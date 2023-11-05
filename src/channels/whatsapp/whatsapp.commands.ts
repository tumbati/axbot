export const spaceSeparatedCommands = [
  'add to cart',
  'edit quantity',
  'add to wishlist',
  'remove from cart',
  'remove from wishlist',
  'clear cart',
  'cart details',
  'confirm registration',
  'cancel registration',
  'restart registration',
  'confirm order',
  'cancel order'
]

enum WhatsappCommands {
  // Free text workflow
  START = 'start',
  HELLO = 'hello',
  SEARCH = 'search',
  LOGOUT = 'logout',
  DETAILS = 'details',
  PREVIOUS = 'previous',
  PREVIOUS_SHORTCUT = 'prev',
  NEXT = 'next',
  NEXT_SHORTCUT = 'nxt',
  ADD_TO_CART = 'add to cart',
  CLEAR_CART = 'clear cart',
  EDIT_QUANTITY = 'edit quantity',
  ADD_TO_WISHLIST = 'add to wishlist',
  REMOVE_FROM_CART = 'remove from cart',
  REMOVE_FROM_WISHLIST = 'remove from wishlist',
  VIEW_CART = 'vc',
  VIEW = 'view',
  CHECKOUT = 'checkout',
  CHECKOUT_SHORTCUT = 'ckt',
  REGISTER = 'register',
  CONFIRM_REGISTRATION = 'confirm registration',
  CANCEL_REGISTRATION = 'cancel registration',
  RESTART_REGISTRATION = 'restart registration',
  CONFIRM_PAYMENT = 'confirm order',
  CANCEL_PAYMENT = 'cancel order',

  // Numerical workflow Usage
  MENU = 'menu',
}

export default WhatsappCommands
