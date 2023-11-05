import { Request, Response } from 'express';
import WhatsappDispatcher from 'src/channels/whatsapp/whatsapp.dispatcher';
import FeedbackModel from 'src/models/feedback.model';

function validatePayload(payload: Record<string, string>): boolean {
  if (typeof payload !== 'object' || Array.isArray(payload)) {
    return false;
  }

  const requiredKeys = ['admin', 'text'];
  for (const key of requiredKeys) {
    if (
      !(key in payload) ||
      typeof payload[key] !== 'string' ||
      payload[key].trim() === ''
    ) {
      return false;
    }
  }

  return true;
}

async function handleGetFeedback(req: Request, res: Response): Promise<void> {
  try {
    const feedbacks = await FeedbackModel.find();
    res.json(feedbacks);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
}

async function handleReplyToFeedback(req: Request, res: Response) {
  try {
    const { feedbackId } = req.params;
    const { admin, text } = req.body;

    if (!validatePayload(req.body)) {
      return res.status(401).json({ message: 'Invalid payload' });
    }

    const feedback = await FeedbackModel.findOneAndUpdate(
      { _id: feedbackId },
      {
        $push: {
          messages: {
            admin,
            text,
            sender: 'admin',
          },
        },
      }
    );

    if (!feedback) {
      return res.status(401).json({ message: 'Unable to reply' });
    }

    await WhatsappDispatcher.sendText(feedback.account, `From: ${process.env.APP_NAME} Customer Care\n\n${text}`);

    res.json({ message: 'Your reply has been sent.' });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
}

const FeedbackController = {
  getFeedback: handleGetFeedback,
  replyToFeedback: handleReplyToFeedback,
};

export default FeedbackController;
