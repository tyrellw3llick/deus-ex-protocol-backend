import dotenv from 'dotenv';
dotenv.config();

interface Config {
  PORT: number;
  MONGODB_URI: string;
  NODE_ENV: string;
  JWT_SECRET: string;
  SOLANA_RPC_URL: string;
  TOKEN_MINT_ADDRESS: string;
  ANTHROPIC_API_KEY: string;
}

const requiredEnvVars = ['JWT_SECRET', 'TOKEN_MINT_ADDRESS', 'ANTHROPIC_API_KEY'] as const;

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`${envVar} is not defined in the environment variables`);
  }
}

export const CONFIG: Config = {
  PORT: parseInt(process.env.PORT || '3000', 10),
  MONGODB_URI: process.env.MONGODB_URI || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET,
  SOLANA_RPC_URL: process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
  TOKEN_MINT_ADDRESS: process.env.TOKEN_MINT_ADDRESS || '',
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || '',
};
