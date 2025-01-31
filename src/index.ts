import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import { CONFIG } from './config/env.js';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import chatRoutes from './routes/chat.routes.js';
import proposalRoutes from './routes/proposal.routes.js';
import aiRoutes from './routes/ai.routes.js';
import voteRoutes from './routes/vote.routes.js';
import { authMiddleware } from './middleware/auth.middleware.js';
import { createErrorResponse } from './types/api.types.js';
import { errorHandler } from './middleware/error.middleware.js';
import {
  globalLimiter,
  authLimiter,
  chatLimiter,
  balanceLimiter,
  voteLimiter,
  proposalLimiter,
} from './middleware/rateLimit.middleware.js';
import mongoose from 'mongoose';

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50kb' }));
app.use(mongoSanitize());
app.use(
  helmet({
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"], // Only allow resources from same origin
        scriptSrc: ["'self'"], // Only allow scripts from same origin
        connectSrc: ["'self'", 'https://api.mainnet-beta.solana.com'], // Allow connections to Solana RPC
        imgSrc: ["'self'", 'data:', 'https:'], // Allow images from same origin and data URIs
        styleSrc: ["'self'", "'unsafe-inline'"], // Allow styles from same origin
      },
    },
    hidePoweredBy: true,
    frameguard: {
      action: 'deny',
    },
  }),
);

// Global rate limit to all routes
//app.use(globalLimiter);

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
app.use('/api/user', balanceLimiter, userRoutes);
app.use('/api/chat', chatLimiter, chatRoutes);
app.use('/api/proposals', proposalLimiter, proposalRoutes);
app.use('/api/vote', voteRoutes);
app.use('/api/ai', proposalLimiter, aiRoutes);

// Not found handler
app.use((req: Request, res: Response) => {
  if (!res.headersSent) {
    res.status(404).json(createErrorResponse('NOT_FOUND', 'The requested resource was not found'));
  }
});

app.use(errorHandler);

const startServer = async (): Promise<void> => {
  try {
    // Connect to MongoDB first
    await connectDB();

    // Store server instance
    const server = app.listen(CONFIG.PORT, () => {
      console.log(`Server running in ${CONFIG.NODE_ENV} mode on port ${CONFIG.PORT}`);
    });

    // Graceful shutdown handler
    const shutdownGracefully = async () => {
      console.log('\nShutting down gracefully...');

      // Set a timeout of 5 seconds
      const forceExit = setTimeout(() => {
        console.log('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 5000);

      try {
        // Close server first
        await new Promise((resolve) => server.close(resolve));
        console.log('Server closed');

        // Then close MongoDB
        await mongoose.connection.close();
        console.log('MongoDB connection closed');

        // Clear the timeout since we succeeded
        clearTimeout(forceExit);
        process.exit(0);
      } catch (err) {
        console.error('Error during shutdown:', err);
        process.exit(1);
      }
    };

    // Handle both SIGTERM and SIGINT
    process.on('SIGTERM', shutdownGracefully);
    process.on('SIGINT', shutdownGracefully);
  } catch (error) {
    console.error(
      '❌ Failed to start server:',
      error instanceof Error ? error.message : 'Unknown error',
    );
    process.exit(1);
  }
};

startServer();
