import { PROVIDERS } from 'src/config/constants'
import database from 'src/config/database'

const ThreadSchema = new database.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    sender: {
      type: String,
      required: true,
    },
    recipient: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

const DialogSchema = new database.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    provider: {
      type: String,
      enum: PROVIDERS,
      default: 'whatsapp'
    },
    account: {
      type: String,
      required: true,
    },
    threads: [ThreadSchema],
  },
  {
    timestamps: true,
  }
)

const DialogModel = database.model('Dialog', DialogSchema)

export default DialogModel
