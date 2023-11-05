import { Request, Response } from 'express'
import WhatsappDispatcher from 'src/channels/whatsapp/whatsapp.dispatcher'
import FeedbackModel from 'src/models/feedback.model'

function validatePayload(payload: Record<string, string>) {
  if (typeof payload !== 'object' || Array.isArray(payload)) return false

  const requiredKeys = ['admin', 'text']
  for (const key of requiredKeys) {
    if (
      !(key in payload) ||
      typeof payload[key] !== 'string' ||
      payload[key].trim() === ''
    ) {
      return false
    }
  }

  return true
}

async function getFeedback(req: Request, res: Response) {
  try {
    const feedbacks = await FeedbackModel.find()
    return res.json(feedbacks)
  } catch (error) {
    res.status(401).send(error)
  }
}

async function replyToFeedback(req: Request, res: Response) {
  try {
    const { feedbackId } = req.params
    if (!validatePayload(req.body)) {
      return res.status(401).send('Invalid data')
    }

    const feedback = await FeedbackModel.findOneAndUpdate(
      { _id: feedbackId },
      {
        $push: {
          messages: {
            admin: req.body.admin,
            text: req.body.text,
            sender: 'admin',
          },
        },
      }
    )

    if (!feedback) {
      return res.status(401).send('Unable to reply')
    }

    WhatsappDispatcher.sendText(feedback.account, `From: Kutenga Customer Care\n\n${req.body.text}`)
    return res.send('Your reply has been sent.')
  } catch (error) {
    res.status(401).send(error)
  }
}

const FeedbackController = {
  getFeedback,
  replyToFeedback
}

export default FeedbackController
