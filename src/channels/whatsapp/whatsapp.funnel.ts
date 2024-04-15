import { MessageSubstance } from 'src/interfaces'
import MessageModel from 'src/models/messages'

export async function sieveMessage(substance: MessageSubstance): Promise<void> {
  if (!substance.message) {
    return
  }

  await MessageModel.create({
    sender: substance.account,
    contextId: substance.contextId,
    id: substance.id,
    text: substance.message,
    recipient: process.env.WA_PHONE_NUMBER,
    provider: substance.provider,
  })
}

export default {
  sieveMessage,
}
