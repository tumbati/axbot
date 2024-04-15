import { Request, Response } from 'express'
import {
  MessageSubstance,
  WhatsAppMessagePayload,
} from 'src/interfaces/whatsapp.interface'
import whatsappFunnel from './whatsapp.funnel'

async function verifyWebhooks(request: Request, response: Response) {
  try {
    const mode = request.query['hub.mode'] as string
    const challenge = request.query['hub.challenge']
    const token = request.query['hub.verify_token'] as string

    if (!mode || token != process.env.SECRET_KEY) {
      return response.status(403).send('Forbidden')
    }

    if (mode.toLowerCase() === 'subscribe') {
      return response.status(200).send(challenge)
    }

    return response.status(403).send('Forbidden')
  } catch (error) {
    return response.status(403).send('Forbidden')
  }
}

async function streamMessages(request: Request, response: Response) {
  const payload = request.body as WhatsAppMessagePayload

  const data = parseMessage(payload)

  if (!data) {
    return response.send('')
  }

  whatsappFunnel.sieveMessage(data)
  return response.send('ok')
}

function parseMessage(data: WhatsAppMessagePayload): MessageSubstance | null {
  try {
    const value = data.entry.first?.changes.first?.value

    if (!value) {
      return null
    }

    if (!value.messages) {
      return null
    }

    const object: MessageSubstance = {
      provider: 'whatsapp',
      account: value.messages.first?.from as string,
      id: value.messages.first?.id,
    }

    if (value?.messages?.first?.text) {
      object.message = value?.messages?.first?.text.body
    }

    if (value?.messages.first?.context && value.messages.first.type !== 'interactive') {
      object.contextId = value.messages.first?.context?.id
      object.message = value.messages.first.button.payload
    }

    if (
      value.messages.first?.interactive &&
      value.messages.first.type === 'interactive'
    ) {
      object.contextId = value.messages.first.context?.id
      object.message = value.messages.first.interactive.list_reply.title
    }

    return object
  } catch (e) {
    return null
  }
}

export default {
  streamMessages,
  verifyWebhooks,
}
