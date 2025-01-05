import { AuthRequest } from "./auth.types.js";

//Anthropic API types
export interface AnthropicContentItem {
  type: 'text';
  text: string;
}

export interface AnthropicMessage {
  role: 'user' | 'assistant';
  content: AnthropicContentItem[];
}

export interface AnthropicRequestBody {
  model: string;
  max_tokens: number;
  temperature?: number;
  system?: string;
  messages: AnthropicMessage;
}

export interface AnthropicResponse {
  content: AnthropicContentItem[];
  id: string;
  model: string;
  role: 'assistant';
  stop_reason: string;
  stop_sequence: string | null;
  type: 'message';
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

export interface AnthropicError {
  type: 'error';
  error: {
    type: string;
    message: string;
  };
}

// DeusEx API types
export interface SendMessageRequest extends AuthRequest {
  content: string;
  conversationId?: string;
}

export interface SendMessageResponse {
  success: boolean;
  reponse: string;
  conversationId: string;
  error?: string;
}
