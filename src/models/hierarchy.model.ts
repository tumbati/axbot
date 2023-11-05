import { PROVIDERS } from 'src/config/constants'
import database from 'src/config/database'

const HierarchySchema = new database.Schema(
  {
    provider: {
      type: String,
      default: 'whatsapp',
      enum: PROVIDERS
    },
    account: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
    },
    dialog: []
  },
  {
    timestamps: true,
  }
)

const HierarchyModel = database.model('Hierarchy', HierarchySchema)

export default HierarchyModel
