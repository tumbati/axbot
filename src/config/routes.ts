import { Router } from 'express'
import { WhatsAppChannel } from 'src/channels'
import FaqController from 'src/controllers/faq.controller'
import FeedbackController from 'src/controllers/feedback.controller'

const router = Router()

// Subscribe and Verify WhatsApp Webhooks
router.get('/whatsapp/webhook', WhatsAppChannel.verifyWebhooks)

// Stream WhatsApp messages
router.post('/whatsapp/webhook', WhatsAppChannel.streamMessages)

// Fetch feedbacks
router.get('/whatsapp/webhook/feedbacks', FeedbackController.getFeedback)
router.post('/whatsapp/webhook/feedbacks/:feedbackId/replies', FeedbackController.replyToFeedback)

// FAQ Controller
router.get('/whatsapp/webhook/faqs', FaqController.getAllFaqs)
router.post('/whatsapp/webhook/faqs', FaqController.createFaq)
router.get('/whatsapp/webhook/faqs/:id', FaqController.getFaqById)
router.put('/whatsapp/webhook/faqs/:id', FaqController.updateFaq)
router.delete('/whatsapp/webhook/faqs/:id', FaqController.deleteFaq)

export default router
