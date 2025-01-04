import { Types } from 'mongoose';

type MessageRole = 'user' | 'assistant';

export interface IMessage {
  role: MessageRole;
  content: string;
  timestamp: Date;
  conversationId: Types.ObjectId;
}
