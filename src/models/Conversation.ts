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
    required: false,
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

conversationSchema.methods.generateTitle = function (firstMessage: string) {
  const baseTitle = firstMessage.trim().substring(0, 50);
  this.title = firstMessage.length > 50 ? `${baseTitle}...` : baseTitle;
  return this.title;
};

conversationSchema.index({ userId: 1, lastMessageAt: -1 });

const ConversationModel = model<IConversation>('Conversation', conversationSchema);
export default ConversationModel;
