# Deus Ex Protocol

The first decentralized AI chatbot protocol powered by a memecoin: $MACHINA token on Solana. The protocol enables token-gated AI interactions with customizable personalities and community-driven development through a democratic voting system.

### Demo:

[Watch the product demo here](https://www.youtube.com/watch?v=R_TMCzLqK5k)

## 🚀 Core Features

### Token-Gated Access
- Hold $MACHINA tokens to interact with AI
- More tokens = more features
- Daily message limits based on holdings

### Rank Tiers
| Rank | Tokens Required | Daily Messages |
|------|-----------------|----------------|
| PLANKTON | 0 | 10 |
| APE | 10,000 | 50 |
| CHAD | 100,000 | 100 |
| WHALE | 1,000,000 | 200 |

### Community Voting
- Propose new features
- Vote weight based on token holdings
- Democratic development process

## 🛠️ Tech Stack

- Backend: Node.js + Express + TypeScript
- Database: MongoDB
- Blockchain: Solana

## 📘 API Overview
### Public
- `POST /auth/login` - Connect wallet
- `GET /health` - Service health check

### Protected (requires wallet auth)
#### User
- `POST /api/user/refresh-balance` - Update token balance and rank

#### Chat
- `POST /api/chat/send` - Message the AI
- `GET /api/chat/conversations` - Get user's conversations
- `GET /api/chat/conversations/:conversationId/messages` - Get conversation messages

#### Proposals
- `GET /api/proposals/active` - View active proposals
- `GET /api/proposals/:roundId` - Get proposals by round

#### Voting
- `POST /api/vote` - Cast vote
- `GET /api/vote/status/:roundId` - Get user's vote status in round

### Admin (requires admin API key)
- `POST /api/admin/proposal` - Create proposal
- `POST /api/admin/round/end` - End voting round

## 🔒 Security

- JWT authentication
- Rate limiting
- Request validation
- Admin routes protection
