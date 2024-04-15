import { Router } from 'express'
import { WhatsAppChannel } from 'src/channels'
import ChatController from 'src/controllers/chat.controller'

const router = Router()
  // Subscribe and Verify WhatsApp Webhooks
  .get('/whatsapp/webhook', WhatsAppChannel.verifyWebhooks)

  // Stream WhatsApp messages
  .post('/whatsapp/webhook', WhatsAppChannel.streamMessages)

  // Chat Controller
  .post('/chats', ChatController.handleCreateMessage)
  .get('/chats', ChatController.handleGetMessages)

export default router
