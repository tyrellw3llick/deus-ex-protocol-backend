import { Schema, model } from 'mongoose';
import { IConversation } from '../types/conversation.types.js';
import { AiName } from '../types/ai.types.js';

const conversationSchema = new Schema<IConversation>({
  userId: {
    type: String,
    required: true,
    ref: 'User',
    trim: true,
    validate: {
      validator: (walletAddress: string) => {
        return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(walletAddress);
      },
      message: 'Ivalid wallet address format',
    },
  },
  title: {
    type: String,
    required: false,
    maxlength: [55, 'Tittle is too long'],
    trim: true,
  },
  aiName: {
    type: String,
    required: true,
    default: 'MACHINA',
    enum: {
      values: ['MACHINA', 'SAKURA'] as AiName[],
      message: 'Invalid AI assistant name',
    },
  },
  lastMessageAt: {
    type: Date,
    default: Date.now,
    required: true,
    validate: {
      validator: (date: Date) => date <= new Date(),
      message: 'Last message timestamp cannot be in the future',
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
    validate: {
      validator: (date: Date) => date <= new Date(),
      message: 'Creation timestamp cannot be in the future',
    },
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
