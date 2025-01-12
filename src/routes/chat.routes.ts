import { Response, Router } from 'express';
import { ChatError, SendMessageRequest } from '../types/chat.types.js';
import { ChatService } from '../services/chat.service.js';
import { createSuccessResponse, createErrorResponse } from '../types/api.types.js';

const router = Router();

const sendMessageHandler = async (req: SendMessageRequest, res: Response) => {
  const { content, conversationId, aiName } = req.body;

  try {
    if (!content || !aiName) {
      res
        .status(400)
        .json(createErrorResponse('INVALID_INPUT', 'Content and AI name are required'));
      return;
    }

    const chatResponse = await ChatService.sendMessage(req.verifiedWalletAddress!, {
      content,
      conversationId,
      aiName,
    });

    res.status(200).json(createSuccessResponse({ chatResponse }));
  } catch (error) {
    if (error instanceof ChatError) {
      res.status(error.statusCode).json(createErrorResponse(error.code, error.message));
      return;
    }

    console.error('Unexpected chat error:', error);
    res
      .status(500)
      .json(createErrorResponse('INTERNAL_SERVER_ERROR', 'An unexpected error occurred'));
  }
};

router.post('/send', sendMessageHandler);

export default router;
