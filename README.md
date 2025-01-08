# Deus Ex Machina Protocol 🤖✨
> A decentralized AI platform where community drives innovation

## Project Overview
Deus Ex Machina Protocol is a groundbreaking decentralized platform that combines blockchain technology with AI to create a unique, community-driven ecosystem. The platform features a token-based ranking system where holders can interact with AI chatbots and participate in governance decisions.

### Key Features
- **Web3 Authentication:** Secure wallet-based authentication using Phantom Wallet
- **Token-Based Access System:** Dynamic user ranks based on token holdings
- **Intelligent Rate Limiting:** Message quotas tied to token holdings
- **Community Governance:** Token holders can vote on new AI chatbot implementations
- **Decentralized Decision Making:** Community-driven development process

## Technical Stack
### Backend Architecture
- **Runtime:** Node.js with ES Modules
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT for session management
- **Blockchain:** Solana Web3.js for token interactions
- **AI Integration:** Claude API (Anthropic)

### Development Tools
- ESLint & Prettier for code quality
- Environment variable management with dotenv
- Comprehensive type definitions

### Project Structure
```
├── config/                 # Configuration files
│   ├── db.ts              # Database connection
│   ├── env.ts             # Environment variables
│   └── llm_instructions/  # AI personality configs
├── middleware/            # Express middlewares
├── models/               # Mongoose models
├── routes/              # Express routes
├── services/           # Business logic
├── tests/             # Test files
├── types/            # TypeScript type definitions
└── utils/           # Utility functions
```

## Core Components

### Authentication System
- Wallet-based authentication using Solana
- JWT token generation and validation
- Middleware protection for routes

### Ranking System
- Token balance tracking
- Dynamic rank calculation
- Daily message quota management
- Vote weight calculation

### Chat System
- AI interaction through Claude API
- Message history tracking
- Conversation management
- Rate limiting based on user rank

## API Documentation

### Public Routes

#### `GET /health`
- Health check endpoint
- **Response:** `{ status: 'ok' }`
- **Status Codes:**
  - `200`: Server is healthy

#### `POST /auth/login`
- Authenticate user with wallet
- **Request Body:** `{ pubKey: string }`
- **Response:** JWT token and user data
- **Status Codes:**
  - `200`: Authentication successful
  - `400`: Invalid wallet address
  - `401`: Authentication failed
  - `500`: Server error

### Protected Routes
All routes under /api require JWT authentication in the Authorization header.

#### `POST /api/user/refresh-balance`
- Update user's token balance
- **Response:** Updated user data
- **Status Codes:**
  - `200`: Balance updated successfully
  - `401`: Unauthorized
  - `404`: User not found
  - `500`: Server error

#### `POST /api/chat/send`
- Send a message to AI assistant
- **Request Body:**
  ```json
  {
    "content": string,
    "aiName": "MACHINA",
    "conversationId": string (optional)
  }
  ```
- **Response:** AI response and conversation data
- **Status Codes:**
  - `200`: Message sent successfully
  - `400`: Invalid request body
  - `401`: Unauthorized
  - `403`: Message quota exceeded
  - `413`: Input too long
  - `429`: Rate limit exceeded
  - `500`: Server error

### Error Responses
All error responses follow the format:
```json
{
  "success": false,
  "message": string,
  }
}
```

### Environment Variables
Required environment variables:
- `PORT`: Server port
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for JWT signing
- `SOLANA_RPC_URL`: Solana RPC endpoint
- `TOKEN_MINT_ADDRESS`: $MACHINA token address
- `ANTHROPIC_API_KEY`: Claude API key

## Contact
- **GitHub:** @DeusEx-Dev
- **Twitter:** @DeusExDev

---
Built with the help of God 🙏.
