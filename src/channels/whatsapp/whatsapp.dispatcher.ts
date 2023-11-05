import { DispatchPayload, Value } from 'src/interfaces/whatsapp.interface'
import WhatsappNetwork from './whatsapp.network'

const waURL = process.env.WA_BASE_URL as string

async function send(to: string, data: DispatchPayload) {
  try {
    Object.assign(data, {
      ...data,
      messaging_product: 'whatsapp',
      to,
    })
    const response = await WhatsappNetwork.post(waURL, data)
    return response.data as Value
  } catch (e: any) {
    console.log(e.response.data.error)
  }
}

function sendText(account: string, text: string) {
  send(account, {
    type: 'text',
    text: { body: text }
  })
}

const WhatsappDispatcher = {
  send,
  sendText,
}

export default WhatsappDispatcher
