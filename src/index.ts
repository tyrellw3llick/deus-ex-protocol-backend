import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { CONFIG } from './config/env.js';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic health check route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// Global error handler
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
      'Failed to start server:',
      error instanceof Error ? error.message : 'Unknown error',
    );
    process.exit(1);
  }
};

startServer();
