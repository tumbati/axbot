export type PaginationComponent = 'categories' | 'search_results'

export type PaginationOptions = {
  next: string | null
  previous: string | null
  count: number
}

export interface IPagination {
  account: string
  component: PaginationComponent
  previous: string | null
  count: number
  next: string | null
  pageNumber: number
  perPage: number
  createdAt?: Date
  updatedAt?: Date
}