import { Schema, model } from 'mongoose';
import { IConversation } from '../types/conversation.types.js';

const conversationSchema = new Schema<IConversation>({
  userId: {
    type: String,
    required: true,
    ref: 'User',
  },
  title: {
    type: String,
    required: true,
  },
  aiName: {
    type: String,
    required: true,
    default: 'MACHINA',
  },
  lastMessageAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

conversationSchema.index({ userId: 1, lastMessageAt: -1 });

const ConversationModel = model<IConversation>('Conversation', conversationSchema);
export default ConversationModel;
