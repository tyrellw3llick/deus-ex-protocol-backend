import dotenv from 'dotenv';
dotenv.config();

interface Config {
  PORT: number;
  MONGODB_URI: string;
  NODE_ENV: string;
  JWT_SECRET: string;
}

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in the environment variables');
}

export const CONFIG: Config = {
  PORT: parseInt(process.env.PORT || '3000', 10),
  MONGODB_URI: process.env.MONGODB_URI || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET,
};
