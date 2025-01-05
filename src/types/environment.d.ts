declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      MONGODB_URI: string;
      NODE_ENV: 'development' | 'production' | 'test';
      JWT_SECRET: string;
      SOLANA_RPC_URL: string;
      TOKEN_MINT_ADDRESS: string;
      ANTHROPIC_API_KEY: string;
    }
  }
}

export {};
