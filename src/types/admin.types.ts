import { Request } from 'express';

export interface AdminRequest extends Request {
  headers: Request['headers'] & {
    'admin-password'?: string;
  };
}
