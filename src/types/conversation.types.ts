import { Document, Types } from 'mongoose';

export interface IConversation extends Document {
  _id: Types.ObjectId;
  userId: string;
  title?: string;
  aiName: string;
  lastMessageAt: Date;
  createdAt: Date;
  generateTitle: (firstMessage: string) => string;
}
