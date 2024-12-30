import { Connection, PublicKey } from '@solana/web3.js';
import { CONFIG } from '../config/env.js';

interface TokenAmount {
  amount: string;
  decimals: number;
  uiAmount: number;
  uiAmountString: string;
}

interface TokenAccountInfo {
  mint: string;
  owner: string;
  tokenAmount: TokenAmount;
  state: string;
}

interface TokenAccountDebugInfo {
  mint: string;
  accountsFound: number;
  accounts: Array<{
    address: string;
    data: TokenAccountInfo;
  }>;
}

export class SolanaService {
  private static connection: Connection;
  private static tokenMint: PublicKey;
  private static lastRequestTime: number = 0;
  private static readonly MIN_REQUEST_INTERVAL = 500; // 500ms between requests

  private static initialize() {
    try {
      this.connection = new Connection(CONFIG.SOLANA_RPC_URL, {
        commitment: 'confirmed',
        confirmTransactionInitialTimeout: 60000,
      });
      this.tokenMint = new PublicKey(CONFIG.TOKEN_MINT_ADDRESS);

      if (!this.tokenMint.toBase58()) {
        throw new Error('Invalid token mint address');
      }
    } catch (error) {
      console.error('Failed to initialize SolanaService:', error);
      throw new Error(
        `Failed to initialize SolanaService: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  private static getInstance() {
    if (!this.connection || !this.tokenMint) {
      this.initialize();
    }
    return {
      connection: this.connection,
      tokenMint: this.tokenMint,
    };
  }

  private static async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private static async enforceRequestInterval(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < this.MIN_REQUEST_INTERVAL) {
      await this.sleep(this.MIN_REQUEST_INTERVAL - timeSinceLastRequest);
    }

    this.lastRequestTime = Date.now();
  }

  static async getTokenBalance(walletAddress: string): Promise<number> {
    try {
      await this.enforceRequestInterval();

      const { connection, tokenMint } = this.getInstance();
      const pubKey = new PublicKey(walletAddress);

      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(pubKey, {
        mint: tokenMint,
      });

      if (tokenAccounts.value.length === 0) return 0;

      const balance = tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;
      return balance || 0;
    } catch (error) {
      if (error instanceof Error && error.message.includes('429')) {
        console.log('Rate limit hit, retrying after delay...');
        await this.sleep(2000);
        return this.getTokenBalance(walletAddress);
      }
      console.error('Error fetching token balance:', error);
      throw error;
    }
  }

  static async getTokenAccountsDebug(walletAddress: string): Promise<TokenAccountDebugInfo> {
    try {
      await this.enforceRequestInterval();

      const { connection, tokenMint } = this.getInstance();
      const pubKey = new PublicKey(walletAddress);

      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(pubKey, {
        mint: tokenMint,
      });

      return {
        mint: tokenMint.toString(),
        accountsFound: tokenAccounts.value.length,
        accounts: tokenAccounts.value.map((acc) => ({
          address: acc.pubkey.toString(),
          data: acc.account.data.parsed.info as TokenAccountInfo,
        })),
      };
    } catch (error) {
      if (error instanceof Error && error.message.includes('429')) {
        console.log('Rate limit hit, retrying after delay...');
        await this.sleep(2000);
        return this.getTokenAccountsDebug(walletAddress);
      }
      console.error('Error in getTokenAccountsDebug:', error);
      throw error;
    }
  }
}
