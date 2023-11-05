import database from 'src/config/database'
import { ProductSchema } from './product.model'

const CartSchema = new database.Schema(
  {
    productId: {
      type: Number,
      required: true
    },
    account: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      default: 1
    },
    product: ProductSchema
  },
  {
    timestamps: true,
  }
)
const CartModel = database.model('Cart', CartSchema)

export default CartModel
