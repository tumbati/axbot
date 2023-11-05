import { IProduct } from './product.interface'

interface HierarchyItem {
  name: string
  label: string
  prompts?: string[]
  action?: Function
  isPrivate?: boolean
}

export interface HierarchyStructure extends HierarchyItem {
  header?: string
  children?: HierarchyItem[]
}

export interface ChildFiltration {
  subordinate: HierarchyStructure,
  hierarchy: IHierarchy,
  account: string
  value: string
}

export interface IHierarchy {
  provider: string
  account: string
  level:
    | 'menu'
    | 'search'
    | 'browse_products'
    | 'order'
    | 'order:track_an_order'
    | 'customer_support'
    | 'product'
    | 'cart'
    | 'checkout'
  dialog: IProduct[] | Record<string, string | number>[] // You might want to replace `any` with a more specific type
}
