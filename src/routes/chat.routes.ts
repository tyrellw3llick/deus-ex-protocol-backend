import { Response, Router } from 'express';
import {
  ChatError,
  GetConversationsRequest,
  GetMessagesRequest,
  SendMessageRequest,
} from '../types/chat.types.js';
import { ChatService } from '../services/chat.service.js';
import { createSuccessResponse, createErrorResponse } from '../types/api.types.js';

const router = Router();

const sendMessageHandler = async (req: SendMessageRequest, res: Response) => {
  const { content, conversationId, aiName } = req.body;

  try {
    if (!content || !aiName) {
      res
        .status(400)
        .json(createErrorResponse('INVALID_INPUT', 'Content and AI name are required'));
      return;
    }

    const chatResponse = await ChatService.sendMessage(req.verifiedWalletAddress!, {
      content,
      conversationId,
      aiName,
    });

    res.status(200).json(createSuccessResponse({ chatResponse }));
  } catch (error) {
    if (error instanceof ChatError) {
      res.status(error.statusCode).json(createErrorResponse(error.code, error.message));
      return;
    }

    console.error('Unexpected chat error:', error);
    res
      .status(500)
      .json(createErrorResponse('INTERNAL_SERVER_ERROR', 'An unexpected error occurred'));
  }
};

/**
 * Get user's conversations
 * GET /api/chat/conversations
 */
const getConversationsHandler = async (req: GetConversationsRequest, res: Response) => {
  try {
    const result = await ChatService.getUserConversations(
      req.verifiedWalletAddress!,
      req.query.cursor,
    );

    res.status(200).json(createSuccessResponse(result));
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Failed to fetch conversations'));
  }
};

/**
 * Get messages for a conversation
 * GET /api/chat/conversations/:conversationId/messages
 */
const getMessagesHandler = async (req: GetMessagesRequest, res: Response) => {
  try {
    const { conversationId } = req.params;

    const messages = await ChatService.getConversationMessages(
      conversationId,
      req.verifiedWalletAddress!,
    );

    res.status(200).json(createSuccessResponse({ messages }));
  } catch (error) {
    if (error instanceof ChatError) {
      res.status(error.statusCode).json(createErrorResponse(error.code, error.message));
      return;
    }

    console.error('Error fetching messages:', error);
    res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Failed to fetch messages'));
  }
};

router.post('/send', sendMessageHandler);
router.get('/conversations/:conversationId/messages', getMessagesHandler);
router.get('/conversations', getConversationsHandler);

export default router;
