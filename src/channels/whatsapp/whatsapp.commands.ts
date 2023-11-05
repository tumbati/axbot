export const spaceSeparatedCommands = [
  'confirm registration',
  'cancel registration',
  'restart registration',
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
