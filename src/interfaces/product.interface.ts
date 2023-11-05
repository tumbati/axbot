import { ICategory } from './category.interface'

interface Image {
  image_id: number
  created: string
  modified: string
  voided: boolean
  voidedby: null | any // Change `any` to the appropriate type
  voided_reason: null | any // Change `any` to the appropriate type
  voided_remarks: null | any // Change `any` to the appropriate type
  name: string
  image: string
  product: number
}

export interface IProduct {
  id: string
  cacheId?: number
  cartId?: string
  wishlistId?: string
  product_id: number
  category: ICategory
  sub_category: ICategory
  rating: null // Change this to the appropriate type
  rating_count: number
  images: Image[]
  promo: null // Change this to the appropriate type
  discount: null // Change this to the appropriate type
  attributes: any[] // Change `any` to the appropriate type
  created: string
  modified: string
  voided: boolean
  voidedby: null | any // Change `any` to the appropriate type
  voided_reason: null | any // Change `any` to the appropriate type
  voided_remarks: null | any // Change `any` to the appropriate type
  sku: null // Change this to the appropriate type
  name: string
  description: string
  brand: string
  delivery_method: string
  unit_price: string
  quantity_per_unit: number
  in_stock: boolean
  low_stock_warning: number
  quantity: number
  vendor: number
}
