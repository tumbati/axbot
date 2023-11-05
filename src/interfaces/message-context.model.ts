import { Provider } from './dialog.interface'
import { IProduct } from './product.interface'

export interface IMessageContext {
  dialog: string[]
  account: string
  provider: Provider
  waId: string
  command: string
  product: IProduct
}
