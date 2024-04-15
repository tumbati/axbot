import database from 'src/config/database'

const MessageSchema = new database.Schema(
  {
    provider: String,
    sender: {
      type: String,
      required: true,
    },
    id: String,
    contextId: String,
    recipient: {
      type: String,
      required: true,
    },
    text: String,
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    id: true,
  }
)

const MessageModel = database.model('Messages', MessageSchema)

export default MessageModel
