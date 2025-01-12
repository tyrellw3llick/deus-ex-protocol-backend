# Deus Ex Protocol

A decentralized AI chatbot protocol powered by $MACHINA tokens on Solana. The protocol enables token-gated AI interactions with customizable personalities and community-driven development through a democratic voting system.

## 🌟 Features

- **Token-Gated AI Chat**
  - Access to AI chatbots based on $MACHINA token holdings
  - Tiered ranking system with escalating privileges
  - Daily message quotas based on user rank

- **Rank System**
  - PLANKTON (0-9,999 tokens): Basic access, 10 daily messages
  - APE (10,000-99,999 tokens): Enhanced access, 50 daily messages
  - CHAD (100,000-999,999 tokens): Premium access, 100 daily messages
  - WHALE (1,000,000+ tokens): Elite access, 200 daily messages

- **Community Governance**
  - Proposal creation and voting system
  - Vote weight multipliers based on rank
  - Round-based voting mechanism

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB
- Solana CLI
- Anthropic API Key

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
MONGODB_URI=your_mongodb_uri
NODE_ENV=development
JWT_SECRET=your_jwt_secret
SOLANA_RPC_URL=your_solana_rpc_url
TOKEN_MINT_ADDRESS=your_token_mint_address
ANTHROPIC_API_KEY=your_anthropic_api_key
ADMIN_PASSWORD=your_admin_password
```

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/deus-ex-protocol.git
cd deus-ex-protocol
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

## 🛠️ API Endpoints

### Authentication
- `POST /auth/login` - Authenticate with Solana wallet

### User Management
- `POST /api/user/refresh-balance` - Update user's token balance and rank

### Chat
- `POST /api/chat/send` - Send message to AI

### Proposals
- `GET /api/proposals/active` - Get active proposals
- `GET /api/proposals/:roundId` - Get proposals by round

### Voting
- `POST /api/vote` - Cast vote on proposal
- `GET /api/vote/status/:roundId` - Get user's vote status in round

### Admin Routes
- `POST /api/admin/proposal` - Create new proposal
- `POST /api/admin/round/end` - End voting round

## 📐 Architecture

The project follows a modular architecture with clear separation of concerns:

- **Services**: Business logic implementation
- **Models**: MongoDB schema definitions
- **Routes**: API endpoint handlers
- **Middleware**: Authentication and admin checks
- **Types**: TypeScript type definitions

## 🔐 Security Features

- JWT-based authentication
- Admin middleware for protected routes
- Solana wallet signature verification
- MongoDB sanitization
- Request validation
- Error handling middleware

## 🛣️ Roadmap

- [ ] Rate limiting
- [ ] Additional security features
- [ ] Enhanced error handling
- [ ] Streaming AI responses to achieve a model like ChatGPT or Claude instead of waiting for HTTP responses
