import { Schema, model } from 'mongoose';
import { IMessage } from '../types/message.types.js';

const messageSchema = new Schema<IMessage>({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true,
  },
  content: {
    type: String,
    required: true,
    minlength: [1, 'Message content cannot be empty'],
    trim: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true,
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
