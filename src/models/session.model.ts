import database from 'src/config/database'

const SessionSchema = new database.Schema(
  {
    provider: {
      type: String,
      default: 'whatsapp',
      enum: ['whatsapp', 'telegram']
    },
    account: {
      type: String,
      required: true,
    },
    process: {
      type: String,
      required: true,
    },
    dialog: []
  },
  {
    timestamps: true,
  }
)

const SessionModel = database.model('Session', SessionSchema)

export default SessionModel
