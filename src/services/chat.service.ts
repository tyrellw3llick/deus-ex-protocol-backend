import Anthropic from '@anthropic-ai/sdk';
import { CONFIG } from '../config/env.js';
import MessageModel from '../models/Message.js';
import ConversationModel from '../models/Conversation.js';
import { ChatError, ChatResponse, Message } from '../types/chat.types.js';
import { RankService } from './rank.service.js';
import { AiService } from './ai.service.js';
import { Types } from 'mongoose';

interface ConversationQuery {
  userId: string;
  lastMessageAt?: {
    $lt: Date;
  };
}
export class ChatService {
  private static anthropic = new Anthropic({
    apiKey: CONFIG.ANTHROPIC_API_KEY,
  });

  private static readonly MAX_INPUT_TOKENS = 1500;
  private static readonly MAX_OUTPUT_TOKENS = 1024;
  private static readonly CONVERSATIONS_PER_PAGE = 10;
  private static readonly MAX_MESSAGES_IN_CONTEXT = 6;
  private static readonly CLAUDE_MODEL = 'claude-3-haiku-20240307';

  /**
   * Get user's conversation with cursor-based pagination
   */
  static async getUserConversations(walletAddress: string, cursor?: string) {
    try {
      const query: ConversationQuery = { userId: walletAddress };

      if (cursor) {
        query.lastMessageAt = { $lt: new Date(cursor) };
      }

      const conversations = await ConversationModel.find(query)
        .sort({ lastMessageAt: -1 })
        .limit(this.CONVERSATIONS_PER_PAGE + 1)
        .lean()
        .exec();

      const hasMore = conversations.length > this.CONVERSATIONS_PER_PAGE;
      if (hasMore) {
        conversations.pop();
      }

      const nextCursor = hasMore
        ? conversations[conversations.length - 1].lastMessageAt.toISOString()
        : null;

      return {
        conversations,
        hasMore,
        nextCursor,
      };
    } catch (error) {
      console.error('Error fetching conversations', error);
      throw error;
    }
  }

  /**
   * Get ALL messages for a conversation
   */
  static async getConversationMessages(conversationId: string, walletAddress: string) {
    try {
      const objectId = new Types.ObjectId(conversationId);

      const conversation = await ConversationModel.findOne({
        _id: objectId,
        userId: walletAddress,
      });

      if (!conversation) {
        throw new ChatError('Conversation not found', 'NOT_FOUND', 404);
      }

      const messages = await MessageModel.find({ conversationId: objectId })
        .sort({ timestamp: 1 })
        .lean()
        .exec();

      return messages;
    } catch (error) {
      if (error instanceof Error && error.name === 'CastError') {
        throw new ChatError('Invalid conversation ID', 'INVALID_INPUT', 400);
      }
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  /**
   * Prepares the conversation context for the AI
   * Retrieves previous messages if conversationId exists
   */
  private static async prepareMessages(
    conversationId: Types.ObjectId | undefined,
    content: string,
  ): Promise<Array<{ role: 'user' | 'assistant'; content: string }>> {
    if (!conversationId) return [{ role: 'user', content: content }];

    const prevMessages = await MessageModel.find({ conversationId })
      .sort({ timestamp: -1 })
      .limit(this.MAX_MESSAGES_IN_CONTEXT)
      .lean()
      .exec();

    return [
      ...prevMessages.reverse().map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: 'user' as const, content: content },
    ];
  }

  /**
   * Creates a new conversation and generates its title
   */
  private static async createNewConversation(userId: string, content: string, aiName: string) {
    const conversation = await ConversationModel.create({
      userId,
      aiName,
    });

    conversation.generateTitle(content);
    await conversation.save();

    return conversation;
  }

  /**
   * Stores both user message and AI response in the database
   * This is done asynchronously to not block the response
   */
  private static async storeMessages(
    conversationId: Types.ObjectId,
    userMessage: string,
    aiResponse: string,
  ): Promise<void> {
    await Promise.all([
      MessageModel.create({
        conversationId,
        role: 'user',
        content: userMessage,
      }),
      MessageModel.create({
        conversationId,
        role: 'assistant',
        content: aiResponse,
      }),
      ConversationModel.findByIdAndUpdate(conversationId, {
        lastMessageAt: new Date(),
      }),
    ]);
  }

  /**
   * Main method to handle message sending
   * Handles message quota, token limits, and AI interaction
   */
  static async sendMessage(userId: string, message: Message): Promise<ChatResponse> {
    const { content, conversationId, aiName } = message;

    const trimmedContent = content.trim();
    if (!trimmedContent) {
      throw new ChatError('Message content cannot be empty', 'INVALID_INPUT', 400);
    }

    const canSendMessage = await RankService.decrementMessages(userId);
    if (!canSendMessage) {
      throw new ChatError('Daily message quota exceeded', 'QUOTA_EXCEEDED', 403);
    }

    const objectId = conversationId ? new Types.ObjectId(conversationId) : undefined;

    const messages = await this.prepareMessages(objectId, trimmedContent);

    const tokenCount = await this.anthropic.messages.countTokens({
      model: this.CLAUDE_MODEL,
      system: AiService.getSystemPrompt(aiName),
      messages: messages,
    });

    if (tokenCount.input_tokens > this.MAX_INPUT_TOKENS) {
      throw new ChatError('Input exceeds maximum token limit', 'INPUT_TOKENS_EXCEEDED', 413);
    }

    const conversation = conversationId
      ? await ConversationModel.findById(objectId)
      : await this.createNewConversation(userId, trimmedContent, aiName);

    if (!conversation) {
      throw new Error('Failed to find/create conversation');
    }

    try {
      const response = await this.anthropic.messages.create({
        model: this.CLAUDE_MODEL,
        max_tokens: this.MAX_OUTPUT_TOKENS,
        messages,
        system: AiService.getSystemPrompt(aiName),
      });

      if (
        !response.content?.[0] ||
        response.content[0].type !== 'text' ||
        !response.content[0].text
      ) {
        throw new Error('Invalid response format from Anthropic');
      }

      const aiMessageResponse = response.content[0].text;

      this.storeMessages(conversation._id, trimmedContent, aiMessageResponse).catch((err) =>
        console.error('Failed to store message', err),
      );

      return {
        response: aiMessageResponse,
        conversationId: conversation._id.toString(),
      };
    } catch (error) {
      if (error instanceof Anthropic.APIError || error instanceof Anthropic.RateLimitError) {
        throw new ChatError('AI service temporarily unavailable', 'AI_SERVICE_ERROR', 503);
      }
      console.error('Detailed chat error:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace',
        userId,
        aiName: message.aiName,
      });
      throw error;
    }
  }
}
