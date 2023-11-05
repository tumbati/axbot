const baseURL = process.env.API_BASE_URL

const products = `${baseURL}/product`
const categories = `${baseURL}/category/`
const orders = (account: string) => `${baseURL}/orders/${account}/`
const update_cart = (account: string) => `${baseURL}/user/${account}/update_cart/`

export default {
  products,
  categories,
  orders,
  update_cart
}