export interface IHttpGetResponse<T> {
  limit: number
  total: number
  skip: number
  next: string
  previous: null
  products: Array<T>
}
