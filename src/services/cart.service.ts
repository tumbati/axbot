import WhatsappCommands from 'src/channels/whatsapp/whatsapp.commands'
import WhatsappDispatcher from 'src/channels/whatsapp/whatsapp.dispatcher'
import WhatsAppTemplate from 'src/channels/whatsapp/whatsapp.template'
import api from 'src/config/api'
import http from 'src/config/http'
import { HierarchyStructure, IMessageContext } from 'src/interfaces'
import { CartPayload, ICart } from 'src/interfaces/cart.interface'
import CartModel from 'src/models/cart.model'
import HierarchyModel from 'src/models/hierarchy.model'
import MessageContextModel from 'src/models/message-context.model'
import SessionModel from 'src/models/session.model'
import {
  createCartTextTemplate,
  getCartTotal,
  isDigit,
  removeHtmlTags
} from 'src/utils/util'
import sessionService from './session.service'

async function addItemToCart(account: string, waId?: string) {
  try {
    if (!waId) {
      return
    }

    const messageContext = await MessageContextModel.findOne<IMessageContext>({
      account,
      command: WhatsappCommands.ADD_TO_CART,
      waId,
    })

    if (!messageContext) {
      return
    }

    const exists = await CartModel.findOne<ICart>({
      account,
      productId: messageContext.product.product_id,
    })

    if (exists) {
      WhatsappDispatcher.sendText(
        account,
        `This product already exist in your cart\n\nName: ${
          exists.product?.name
        }.\nDescription: ${removeHtmlTags(exists.product?.description || '')}`
      )
      return
    }

    const added = await CartModel.create({
      productId: messageContext.product.product_id,
      account,
      quantity: 1,
      product: messageContext.product,
    })

    if (added) {
      WhatsappDispatcher.sendText(
        account,
        'Success!\n\nYou have added ' +
          messageContext.product?.name +
          ' to cart.\n\nTo view cart send "vc" or "menu" to select cart'
      )
    }
  } catch (error) {
    console.log(error)
  }
}

async function displayCart(account: string, cart: ICart[]) {
  if (!cart.length) {
    const message =
      'Your cart is empty!\n\nSend "menu" to view other options available.'
    return WhatsappDispatcher.sendText(account, message)
  }

  let message = ''

  for (let i = 0; i < cart.length; i++) {
    message += createCartTextTemplate(cart[i], i)
  }

  message += `\n\nTotal: MWK ${getCartTotal(
    cart
  )}\n\nTo checkout or clear cart, press button below.`

  await sessionService.update(account, { process: 'cart', dialog: [] })
  await HierarchyModel.updateOne({ account }, { $set: { level: 'cart' } })

  WhatsappDispatcher.send(account, WhatsAppTemplate.cartInteractiveTemplate({
    header: `Cart Details - (${cart.length}) items`,
    body: message
  }))
}

async function viewCart(account: string, value: string, hierarchy: HierarchyStructure) {
  try {
    const cart = await CartModel.find<ICart>({ account })
    const hierarchy = await HierarchyModel.findOne({ account })

    if (hierarchy?.level === 'menu' || !value) {
      displayCart(account, cart)
      return
    }

    if (!isDigit(value)) {
      return WhatsappDispatcher.sendText(
        account,
        'Error!\n\nYou can only use numeric values.'
      )
    }

    const selectedCart = cart.at(parseInt(value) - 1)

    if (!selectedCart) {
      let message = 'Error!\n\n'

      if (cart.length === 1) {
        message += 'There is only one item in the cart.'
      }

      if (cart.length > 2) {
        message += `Out of range, you can only choose from 1-${cart.length}`
      }

      return WhatsappDispatcher.sendText(account, message)
    }

    WhatsappDispatcher.sendText(account, 'Loading, please wait...')
    const response = await WhatsappDispatcher.send(
      account,
      WhatsAppTemplate.cartDetailTemplate(selectedCart, 'selected')
    )

    await MessageContextModel.deleteOne({
      account,
      command: WhatsappCommands.VIEW_CART,
    })

    await MessageContextModel.create({
      account,
      waId: response?.messages.first?.id,
      command: WhatsappCommands.VIEW_CART,
      product: selectedCart.product,
    })
  } catch (error) {
    console.log(error)
  }
}

async function editQuantity(account: string, value: string, waId?: string) {
  try {
    const session = await sessionService.getSession(account, 'whatsapp')

    if (waId && value.toLowerCase() === WhatsappCommands.EDIT_QUANTITY) {
      const messageContext = await MessageContextModel.findOne({ account, waId })

      if (!session) {
        await SessionModel.create({
          account,
          process: 'cart:edit_quantity',
          dialog: ['Enter quantity for ' + messageContext?.product?.name],
        })
      } else {
        await SessionModel.updateOne(
          { account, waId },
          {
            $set: {
              process: 'cart:edit_quantity',
              dialog: ['Enter quantity for ' + messageContext?.product?.name],
            },
          }
        )
      }

      await HierarchyModel.updateOne(
        { account },
        { $set: { level: 'cart:edit_quantity' } }
      )

      return WhatsappDispatcher.sendText(
        account,
        'Enter quantity for ' + messageContext?.product?.name
      )
    }

    if (isDigit(value)) {
      const messageContext = await MessageContextModel.findOne({
        account,
        command: WhatsappCommands.VIEW_CART,
      })

      if (!messageContext) {
        return
      }

      const result = await CartModel.updateOne(
        {
          account,
          'product.product_id': messageContext.product?.product_id,
        },
        {
          $set: { quantity: parseInt(value) },
        }
      )

      if (result.modifiedCount) {
        const message = `Success!\n\nYou have updated ${messageContext.product?.name} quantity to ${value}.\n\nTo change the quantity, enter quantity below or send "vc" or "menu" to select cart.`
        WhatsappDispatcher.sendText(account, message)
      }
    }
  } catch (error) {
    console.log(error)
  }
}

async function clearCart(account: string, value: string) {
  try {
    const result = await CartModel.deleteMany({
      account,
    })

    if (result.deletedCount) {
      return WhatsappDispatcher.sendText(
        account,
        'You have successfully cleared your cat.\n\nSend "vc" to view cart'
      )
    }

    WhatsappDispatcher.sendText(account, 'Something went wrong!\n\nFailed to clear cart')
  } catch (error) {
    console.log(error)
  }
}

async function removeItemFromCart(account: string, waId?: string) {
  try {
    const context = await MessageContextModel.findOneAndDelete({
      account,
      waId,
      command: WhatsappCommands.VIEW_CART,
    })

    const result = await CartModel.deleteOne({
      account,
      'product.product_id': context?.product?.product_id,
    })

    if (result.deletedCount) {
      const message = `Success!\n\nYou have successfully deleted ${context?.product?.name} from cart\n\nSend "vc" to view cart.`
      return WhatsappDispatcher.sendText(account, message)
    }

    WhatsappDispatcher.sendText(
      account,
      `Error!\n\nFailed to delete ${context?.product?.name} from cart.`
    )
  } catch (error) {
    console.log(error)
  }
}

function buildCart(account: string, cart: ICart[]): CartPayload {
  const payload: CartPayload = {
    deliveryMethod: null,
    error: null,
    shippingAddress: null,
    subTotal: getCartTotal(cart),
    userId: parseInt(account),
    source: 'whatsapp',
    data: []
  }

  for(const item of cart) {
    payload.data.push({
      id: item.productId,
      attributes: item.product.attributes,
      productId: item.productId,
      deliveryMethod: item.product.delivery_method,
      productDetails: item.product.description,
      productName: item.product.name,
      productImageUrl: item.product.images.first?.image || '',
      productPrice: item.product.unit_price,
      promo: item.product.promo,
      product_inventory: item.product.quantity,
      quantity: item.quantity,
      discount: item.product.discount
    })
  }

  return payload
}

async function checkout(account: string, value?: string): Promise<void> {
  try {
    const cart = await CartModel.find<ICart>({ account })

    if (!cart.length) {
      return
    }

    const response = await http.post(api.update_cart(account), buildCart(account, cart))

    console.log(response.data)

    WhatsappDispatcher.sendText(account, 'Loading, please wait...')
    WhatsappDispatcher.send(account, WhatsAppTemplate.checkoutTemplate('/?phone='+account+'source=whatsapp'))
  } catch (error: any) {
    console.log('Error ' +error.response.status)
  }
}

const CartService = {
  addItemToCart,
  viewCart,
  removeItemFromCart,
  editQuantity,
  clearCart,
  checkout,
}

export default CartService
