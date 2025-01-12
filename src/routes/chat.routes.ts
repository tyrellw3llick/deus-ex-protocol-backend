import { Response, Router } from 'express';
import { ChatError, SendMessageRequest } from '../types/chat.types.js';
import { ChatService } from '../services/chat.service.js';

const router = Router();

/**
 * @route   POST /api/chat/send
 * @desc    Send a message to AI and get response
 * @access  Private
 */
const sendMessageHandler = async (req: SendMessageRequest, res: Response) => {
  const { content, conversationId, aiName } = req.body;

  try {
    if (!content || !aiName) {
      res.status(400).json({
        success: false,
        error: 'INVALID_INPUT',
        message: 'Content and AI name are required',
      });
      return;
    }

    const chatResponse = await ChatService.sendMessage(req.verifiedWalletAddress!, {
      content,
      conversationId,
      aiName,
    });

    res.status(200).json({
      success: true,
      data: {
        chatResponse,
      },
    });
  } catch (error) {
    if (error instanceof ChatError) {
      res.status(error.statusCode).json({
        error: error.code,
        message: error.message,
      });
      return;
    }

    console.error('Unexpected chat error:', error);
    res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
    });
  }
};

router.post('/send', sendMessageHandler);

export default router;
