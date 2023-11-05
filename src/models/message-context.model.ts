import database from 'src/config/database'
import { ProductSchema } from './product.model'

const MessageContextSchema = new database.Schema(
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
    command: {
      type: String,
      required: true
    },
    waId: {
      type: String,
      required: true,
    },
    product: ProductSchema
  },
  {
    timestamps: true,
  }
)

const MessageContextModel = database.model('Message_Context', MessageContextSchema)

export default MessageContextModel
