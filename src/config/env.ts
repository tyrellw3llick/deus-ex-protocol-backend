import dotenv from 'dotenv';
dotenv.config();

interface Config {
  PORT: number;
  MONGODB_URI: string;
  NODE_ENV: string;
}

export const CONFIG: Config = {
  PORT: parseInt(process.env.PORT || '3000', 10),
  MONGODB_URI: process.env.MONGODB_URI || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
};
