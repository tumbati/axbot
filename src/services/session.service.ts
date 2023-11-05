import { ISession, Provider } from 'src/interfaces'
import SessionModel from 'src/models/session.model'

async function getSession(account: string, provider: Provider): Promise<ISession | null> {
  try {
    const session = await SessionModel.findOne<ISession>({
      account,
      provider
    })

    return session
  } catch (error) {
    return null
  }
}

async function updateDialog(account: string, input: string) {
  const result = await SessionModel.updateOne({ account }, { $push: { dialog: input } })
  return result
}

async function update(account: string, update: Partial<ISession>) {
  const result = await SessionModel.updateOne({ account }, { $set: update })
  return result
}

export default {
  getSession,
  updateDialog,
  update
}
