import { Schema, model } from 'mongoose';
import { User } from '../types/user.types.js';

const userSchema = new Schema<User>({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: function (walletAddress: string) {
        return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(walletAddress);
      },
      message: 'Invalid wallet address format',
    },
  },
  tokenBalance: {
    type: Number,
    default: 0,
    required: true,
    min: [0, 'Token balance cannot be negative'],
    validate: {
      validator: Number.isFinite,
      message: 'Number must be a finite number',
    },
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
    min: [0, 'Daily message quota cannot be negative'],
    validate: {
      validator: Number.isInteger,
      message: 'Daily message quota must be a whole number',
    },
  },
  messagesLeft: {
    type: Number,
    default: 0,
    min: [0, 'Messages left cannot be negative'],
    validate: {
      validator: Number.isInteger,
      message: 'Messages left must be a whole number',
    },
  },
  lastMessageReset: {
    type: Date,
    default: Date.now,
    validate: {
      validator: (date: Date) => date <= new Date(),
      message: 'Reset timestamp cannot be in the future',
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
    validate: {
      validator: (date: Date) => date <= new Date(),
      message: 'Creation timestamp cannot be in the future',
    },
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
