import { Schema, model } from 'mongoose';
import { IMessage } from '../types/message.types.js';
import { contentValidator } from '../utils/validation.js';

const messageSchema = new Schema<IMessage>({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
    minlength: [1, 'Message content cannot be empty'],
    maxlength: [4000, 'Message content is too long'],
    trim: true,
    validate: {
      validator: (content: string) => contentValidator.noMaliciousContent(content),
      message: 'Message contains invalid content',
    },
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true,
    validate: {
      validator: (date: Date) => date <= new Date(),
      message: 'Timestamp cannot be in the future',
    },
  },
  conversationId: {
    type: Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
  },
});

messageSchema.index({ conversationId: 1, timestamp: -1 });

const MessageModel = model<IMessage>('Message', messageSchema);
export default MessageModel;
