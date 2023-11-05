import { Provider } from './dialog.interface'
import { IProduct } from './product.interface'

export type CartVerb = 'selected' | 'updated'

export interface ICart {
  productId: number
  account: string
  quantity: number
  product: IProduct
}

export interface CartPayloadDetails {
  attributes: string[]
  deliveryMethod: string
  discount: string | null
  id: number
  productDetails: string
  productId: number
  productImageUrl: string
  productName: string
  productPrice: string
  product_inventory: number
  promo: string | null
  quantity: number
}
export interface CartPayload {
  deliveryMethod: string | null
  error: string | null
  shippingAddress: string | null
  subTotal: number
  userId: number
  source: Provider
  data: CartPayloadDetails[]
}
