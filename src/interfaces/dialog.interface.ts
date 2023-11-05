export type Provider = 'whatsapp' | 'discord' | 'telegram'

export interface Thread {
  message: string
  sender: string
  recipient: string
  createdAt: Date
  updatedAt: Date
}

export interface IDialog {
  name: string
  provider: Provider
  account: string
  threads: Thread[]
  createdAt: Date
  updatedAt: Date
}