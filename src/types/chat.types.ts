import { AiName } from './ai.types.js';
import { AuthRequest } from './auth.types.js';

export interface Message {
  content: string;
  conversationId?: string;
  aiName: AiName;
}

export interface SendMessageRequestBody {
  content: string;
  conversationId: string;
  aiName: AiName;
}

export interface SendMessageRequest extends AuthRequest {
  body: SendMessageRequestBody;
}

export interface GetConversationsRequest extends AuthRequest {
  query: {
    cursor?: string;
  };
}

export interface GetMessagesRequest extends AuthRequest {
  params: {
    conversationId: string;
  };
}

export interface ChatResponse {
  response: string;
  conversationId: string;
}

export class ChatError extends Error {
  constructor(
    message: string,
    public code:
      | 'QUOTA_EXCEEDED'
      | 'INVALID_INPUT'
      | 'INPUT_TOKENS_EXCEEDED'
      | 'AI_SERVICE_ERROR'
      | 'NOT_FOUND',
    public statusCode: number,
  ) {
    super(message);
    this.name = 'ChatError';
  }
}
