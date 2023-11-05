import database from 'src/config/database'

const MessageSchema = new database.Schema({
  sender: {
    type: String,
    default: 'self',
    enum: ['self', 'admin']
  },
  text: {
    type: String,
    required: true,
  },
  waId: String,
  contextId: String,
  isRead: {
    type: Boolean,
    default: false,
  },
  admin: String
})

const FeedbackSchema = new database.Schema(
  {
    account: {
      type: String,
      required: true,
    },
    messages: [MessageSchema],
  },
  {
    timestamps: true,
  }
)

const FeedbackModel = database.model('Feedback', FeedbackSchema)

export default FeedbackModel
