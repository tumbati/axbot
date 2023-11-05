export interface FeedbackMessage {
  _id: string
  sender: 'self' | 'admin'
  text: string
  waId: string
  contextId?: string
  isRead: boolean
}

export interface IFeedback {
  _id: string
  account: string
  messages: FeedbackMessage[]
  createdAt?: Date
  updatedAt?: Date
}
