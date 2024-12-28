import { Schema, model } from 'mongoose';
import { User } from '../types/user.types.js';

const userSchema = new Schema<User>({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  tokenBalance: {
    type: Number,
    default: 0,
    required: true,
  },
  rank: {
    type: Number,
    enum: [0, 1, 2, 3],
    default: 0,
    required: true,
  },
  dailyMessageQuota: {
    type: Number,
    default: 0,
  },
  messagesLeft: {
    type: Number,
    default: 0,
  },
  lastMessageReset: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.methods.shouldResetMessage = function (): boolean {
  const today = new Date();
  const lastReset = new Date(this.lastMessageReset);

  return (
    today.getFullYear() !== lastReset.getFullYear() ||
    today.getMonth() !== lastReset.getMonth() ||
    today.getDate() !== lastReset.getDate()
  );
};

const UserModel = model<User>('User', userSchema);
export default UserModel;
