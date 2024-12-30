/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import '../config/env.js';
import { SolanaService } from '../services/solana.service.js';

const TEST_ADDRESSES = {
  withTokens: 'HJ3eTbqK9T7kD8yzq6mEF5oyikQRAkn4PzmCXb3pmjTg',
  withoutTokens: 'BndjYhHAPUNGje9LUXNyZVQvMxyvW7x6G1nF3hQ7tQEd',
};

async function testSolanaService() {
  try {
    console.log('🧪 Testing SolanaService...\n');

    // Test 1: Wallet with tokens
    console.log('Test 1: Checking wallet with tokens');
    console.log('Wallet:', TEST_ADDRESSES.withTokens);
    const balanceWithTokens = await SolanaService.getTokenBalance(TEST_ADDRESSES.withTokens);
    const debugDataWithTokens = await SolanaService.getTokenAccountsDebug(
      TEST_ADDRESSES.withTokens,
    );
    console.log('Token accounts response:', JSON.stringify(debugDataWithTokens, null, 2));
    console.log('Balance:', balanceWithTokens);
    console.log('------------------------\n');

    // Wait to avoid rate limits
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Test 2: Wallet without tokens
    console.log('Test 2: Checking wallet without tokens');
    console.log('Wallet:', TEST_ADDRESSES.withoutTokens);
    const balanceWithoutTokens = await SolanaService.getTokenBalance(TEST_ADDRESSES.withoutTokens);
    const debugDataWithoutTokens = await SolanaService.getTokenAccountsDebug(
      TEST_ADDRESSES.withoutTokens,
    );
    console.log('Token accounts response:', JSON.stringify(debugDataWithoutTokens, null, 2));
    console.log('Balance:', balanceWithoutTokens);
    console.log('------------------------\n');

    // Test 3: Invalid wallet address
    console.log('Test 3: Testing invalid wallet address');
    try {
      await SolanaService.getTokenBalance('invalid-address');
      console.log('❌ Error: Should have thrown an error for invalid address');
    } catch (error) {
      console.log('✅ Successfully caught invalid address error');
      console.log('Error message:', error.message);
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('Error details:', error instanceof Error ? error.message : error);
  }
}

// Run the tests
testSolanaService();
