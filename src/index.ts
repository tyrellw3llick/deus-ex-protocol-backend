import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { CONFIG } from './config/env.js';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import chatRoutes from './routes/chat.routes.js';
import proposalRoutes from './routes/proposal.routes.js';
import voteRoutes from './routes/vote.routes.js';
import { authMiddleware } from './middleware/auth.middleware.js';
import { createErrorResponse } from './types/api.types.js';
import { errorHandler } from './middleware/error.middleware.js';

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());

// ROUTES

// Basic health check route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// Authentication routes - They are not protected
app.use('/auth', authRoutes);

//Admin routes
app.use('/api/admin', proposalRoutes);

// Protected routes with the JWT
app.use('/api', authMiddleware);
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/vote', voteRoutes);

// Not found handler
app.use((req: Request, res: Response) => {
  if (!res.headersSent) {
    res.status(404).json(createErrorResponse('NOT_FOUND', 'The requested resource was not found'));
  }
});

app.use(errorHandler);

// Start server function
const startServer = async (): Promise<void> => {
  try {
    // Connect to MongoDB first
    await connectDB();

    // Then start Express server
    app.listen(CONFIG.PORT, () => {
      console.log(`Server running in ${CONFIG.NODE_ENV} mode on port ${CONFIG.PORT}`);
    });
  } catch (error) {
    console.error(
      '❌ Failed to start server:',
      error instanceof Error ? error.message : 'Unknown error',
    );
    process.exit(1);
  }
};

startServer();
