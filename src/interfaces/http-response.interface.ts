export interface IHttpGetResponse<T> {
  per_page: number
  count: number
  page_number: number
  next: string
  previous: null
  results: Array<T>
}
