import { Request, Response } from 'express'
import WhatsappDispatcher from 'src/channels/whatsapp/whatsapp.dispatcher'
import MessageModel from 'src/models/messages'

function validatePayload(payload: Record<string, string>): boolean {
  if (typeof payload !== 'object' || Array.isArray(payload)) {
    return false
  }

  const requiredKeys = ['recipient', 'text']
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

async function handleCreateMessage(req: Request, res: Response): Promise<void> {
  try {
    const validated = validatePayload(req.body)

    if (!validated) {
      res.status(401).send('Error sending a message')
    }

    WhatsappDispatcher.sendText(req.body.recipient, req.body.text)

    const message = await MessageModel.create({
      sender: process.env.WA_PHONE_NUMBER,
      recipient: req.body.recipient,
      text: req.body.text,
    })

    res.json({ error: false, success: true, data: message })
  } catch (error) {
    res.status(401).send('Error sending a message')
  }
}

async function handleGetMessages(req: Request, res: Response): Promise<void> {
  try {
    const messages = await MessageModel.find()

    res.json({ error: false, success: true, data: messages })
  } catch (error) {
    res.status(401).send('Error sending a message')
  }
}

const ChatController = {
  handleCreateMessage,
  handleGetMessages,
}

export default ChatController
