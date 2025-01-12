import { Document, Types } from 'mongoose';
import { AuthRequest } from './auth.types.js';
import { ParamsDictionary } from 'express-serve-static-core';

export interface IVote extends Document {
  userId: string;
  proposalId: Types.ObjectId;
  roundId: number;
  weight: number;
  tokenBalance: number;
  createdAt: Date;
}

export interface CastVoteBody {
  proposalId: Types.ObjectId | string;
}

export interface CastVoteRequest extends AuthRequest {
  body: CastVoteBody;
}

export interface VoteStatusParams extends ParamsDictionary {
  roundId: string;
}

export interface VoteStatusRequest extends AuthRequest {
  params: VoteStatusParams;
}

export interface RoundIdParams extends ParamsDictionary {
  roundId: string;
}

export interface RoundIdRequest extends AuthRequest {
  params: RoundIdParams;
}
