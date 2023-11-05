import { MessageSubstance } from 'src/interfaces'
import AccountService from 'src/services/account.service'
import CartService from 'src/services/cart.service'
import HierarchyService from 'src/services/hierarchy.service'
import ProductService from 'src/services/product.service'
import WhatsappCommands, { spaceSeparatedCommands } from './whatsapp.commands'
import Hierarchy from './whatsapp.hierarchy'

export async function sieveMessage(substance: MessageSubstance): Promise<void> {
  if (!substance.message) {
    return
  }

  const text = substance.message.lowercase().trim()
  let segments = text.split(' ')
  const query = segments.slice(1).join(' ')
  const value = substance.message.trim().replace(/\s+/g, ' ')

  for (const command of spaceSeparatedCommands) {
    if (text.startsWith(command)) {
      segments = [command, segments[3]]
      break
    }
  }

  switch (segments.first) {
    case 'hi':
    case 'hallo':
    case 'hello':
    case WhatsappCommands.START:
    case WhatsappCommands.MENU:
      HierarchyService.sendMainMenu(substance.account)
      break

    case WhatsappCommands.ADD_TO_CART:
      CartService.addItemToCart(substance.account, substance.contextId)
      break

    case WhatsappCommands.VIEW_CART:
      {
        const cartHierarchy = Hierarchy.structure.find((item) => item.name === 'cart')
        if (!cartHierarchy) {
          return
        }
        CartService.viewCart(substance.account, query, cartHierarchy)
      }
      break
    case WhatsappCommands.EDIT_QUANTITY:
      CartService.editQuantity(substance.account, value, substance.contextId)
      break

    case WhatsappCommands.REMOVE_FROM_CART:
      CartService.removeItemFromCart(substance.account, substance.contextId)
      break

    case WhatsappCommands.CLEAR_CART:
      CartService.clearCart(substance.account, value)
      break

    case WhatsappCommands.CONFIRM_REGISTRATION:
      AccountService.confirmRegistration(substance.account, substance.contextId)
      break

    case WhatsappCommands.CANCEL_REGISTRATION:
      AccountService.cancelRegistration(substance.account, substance.contextId)
      break

    case WhatsappCommands.RESTART_REGISTRATION:
      AccountService.restartRegistration(substance.account, substance.contextId)
      break

    case WhatsappCommands.CHECKOUT:
    case WhatsappCommands.CHECKOUT_SHORTCUT:
      CartService.checkout(substance.account)
      break
    case WhatsappCommands.NEXT:
    case WhatsappCommands.NEXT_SHORTCUT:
      ProductService.paginateForward(substance.account, value)
      break

    case WhatsappCommands.PREVIOUS:
    case WhatsappCommands.PREVIOUS_SHORTCUT:
      ProductService.paginateBackwards(substance.account, value)
      break

    default:
      HierarchyService.filtrateInHierarchy(substance.account, value)
      break
  }
}

export default {
  sieveMessage,
}
