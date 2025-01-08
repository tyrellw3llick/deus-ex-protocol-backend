# Deus Ex Machina Protocol 🤖✨
> A decentralized AI platform where memecoins meet real AI utility

## Project Overview
Deus Ex Machina Protocol is a unique platform that brings memecoins to life through AI. The project features DeusExMachina ($MACHINA), the first memecoin to achieve sentience and create its own protocol. Users can interact with AI chatbots while their access level is determined by their token holdings. Users will be assigned a rank based on their holdings that will allow them to vote and decide the future of the platform.

### Currently Implemented Features
- **Web3 Authentication:** Secure login using Phantom Wallet (Solana)
- **Token-Based Ranking:** Dynamic user ranks based on $MACHINA holdings
  - PLANKTON (0-9,999 tokens): 10 messages/day
  - APE (10,000-99,999 tokens): 50 messages/day
  - CHAD (100,000-999,999 tokens): 100 messages/day
  - WHALE (1,000,000+ tokens): 200 messages/day
- **AI Integration:** Powered by Claude API with custom AI personalities
- **Auto Balance Updates:** Automatic rank adjustments based on token holdings

### Under Development
- Community voting system for new AI chatbots
- Conversation history and management
- Additional AI personalities

## Technical Stack

### Backend (Implemented)
- **Runtime:** Node.js with ES Modules
- **API:** Express.js with TypeScript
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT + Most used Solana Wallets
- **Blockchain:** Solana Web3.js
- **AI:** Claude API (Anthropic)
- **Private RPC**: Helius

### Project Structure
```
├── config/                 # Configuration files
│   ├── db.ts              # Database connection
│   ├── env.ts             # Environment variables
│   └── llm_instructions/  # AI personality configs
├── middleware/            # Express middlewares
│   └── auth.middleware.ts # JWT authentication
├── models/               # Mongoose models
│   ├── User.ts          # User model with ranks
│   ├── Message.ts       # Chat messages
│   └── Conversation.ts  # Chat conversations
├── routes/              # Express routes
├── services/           # Business logic
└── types/             # TypeScript definitions
```

## API Documentation

### Authentication
#### `POST /auth/login`
- Login with Solana wallet
- **Request:** `{ pubKey: string }`
- **Response:** 
```json
{
  "success": true,
  "token": "jwt_token",
  "user": {
    "walletAddress": "string",
    "tokenBalance": number,
    "rank": number,
    "messagesLeft": number,
    "dailyMessageQuota": number
  }
}
```

### User Management
#### `POST /api/user/refresh-balance`
- Update user's token balance and rank
- **Response:** Updated user data
- Requires JWT authentication

### Chat System
#### `POST /api/chat/send`
- Send message to AI
- **Request:**
```json
{
  "content": "string",
  "aiName": "MACHINA",
  "conversationId": "string" // optional
}
```
- **Response:** AI response with conversation ID
- Rate limited based on user rank
- Requires JWT authentication

## Environment Setup
Required variables:
```env
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
TOKEN_MINT_ADDRESS=your_token_address
ANTHROPIC_API_KEY=your_claude_api_key
```

## Development
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Start development server: `npm run dev`

## Contact
- **Twitter:** @DeusExDev
- **Reddit:** @DeusExDev_

---
Built with God's help and guidance 🙏🏻
