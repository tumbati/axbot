import WhatsappDispatcher from 'src/channels/whatsapp/whatsapp.dispatcher'
import WhatsAppTemplate from 'src/channels/whatsapp/whatsapp.template'
import FaqModel, { IFaq } from 'src/models/faq.model'
import FeedbackModel from 'src/models/feedback.model'
import HierarchyModel from 'src/models/hierarchy.model'
import { isDigit } from 'src/utils/util'

async function sendFeedback(account: string, value: string) {
  try {
    const hierarchy = await HierarchyModel.findOne({ account })

    if (hierarchy?.level === 'customer_support') {
      await HierarchyModel.updateOne(
        { account },
        { $set: { level: 'customer_support:feedback' } }
      )
      WhatsappDispatcher.sendText(account, 'Enter your feedback')
      return
    }

    if (isDigit(value) || value.length < 10) {
      return WhatsappDispatcher.sendText(
        account,
        'Error!\n\nPlease enter a valid feedback in long format.'
      )
    }

    const existingFeedback = await FeedbackModel.findOne({ account })

    if (!existingFeedback) {
      await FeedbackModel.create({
        account,
        messages: [
          {
            text: value,
          },
        ],
      })
    }

    const update = await FeedbackModel.updateOne(
      { account },
      { $push: { messages: { text: value } } }
    )

    if (!update.modifiedCount) {
      return WhatsappDispatcher.sendText(account, 'Error!\n\nFailed to send feedback, try again later.\n\nSend "menu" to go back to main menu.')
    }

    WhatsappDispatcher.sendText(account, 'Thank you for your feedback.\n\nTo send another feedback, enter it below or send "menu" to go to main menu.')
  } catch (error) {
    console.log(error)
  }
}

async function faq(account: string, value: string) {
  try {
    const faq = await FaqModel.find<IFaq>()

    if (!faq.length) {
      return WhatsappDispatcher.sendText(account, `We currently don't have frequently asked questions.`)
    }

    WhatsappDispatcher.sendText(account, WhatsAppTemplate.faqTextTemplate(faq))
  } catch (error) {
    console.log(error)
  }
}

const CustomerCareService = {
  sendFeedback,
  faq,
}

export default CustomerCareService
