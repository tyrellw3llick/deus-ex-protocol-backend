import { Connection, PublicKey } from '@solana/web3.js';
import { CONFIG } from '../config/env.js';

export class SolanaService {
  private static connection: Connection;
  private static tokenMint: PublicKey;

  private static initialize() {
    try {
      this.connection = new Connection(CONFIG.SOLANA_RPC_URL, {
        commitment: 'confirmed',
      });

      this.tokenMint = new PublicKey(CONFIG.TOKEN_MINT_ADDRESS);

      if (!this.tokenMint.toBase58()) {
        throw new Error('Invalid token mint address');
      }
    } catch (error) {
      console.error('Failed to initialize solana service', error);
      throw error;
    }
  }

  private static getConnection(): { connection: Connection; tokenMint: PublicKey } {
    if (!this.connection || !this.tokenMint) {
      this.initialize();
    }

    return {
      connection: this.connection,
      tokenMint: this.tokenMint,
    };
  }

  static async getTokenBalance(walletAddress: string): Promise<number> {
    try {
      const { connection, tokenMint } = this.getConnection();
      const walletPublicKey = new PublicKey(walletAddress);

      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(walletPublicKey, {
        mint: tokenMint,
      });

      if (tokenAccounts.value.length === 0) {
        return 0;
      }

      const balance = tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;

      return balance || 0;
    } catch (error) {
      console.error('Error fetching token balances', error);
      throw error;
    }
  }
}
