import { AiName } from './ai.types.js';
import { AuthRequest } from './auth.types.js';

export interface SendMessageRequest extends AuthRequest {
  content: string;
  conversationId?: string;
  aiName: AiName;
}

export interface SendMessageResponse {
  success: boolean;
  response: string;
  conversationId: string;
  error?: string;
}
