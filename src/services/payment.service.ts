import WhatsappDispatcher from 'src/channels/whatsapp/whatsapp.dispatcher'
import { ISession } from 'src/interfaces'
import CartModel from 'src/models/cart.model'
import SessionModel from 'src/models/session.model'
import AccountService from './account.service'

const formFields: Record<string, string> = {
  'Enter Cardholder Name': 'cardholderName',
  'Enter Card Number': 'cardNumber',
  'Enter Expiry Date': 'expiryDate',
  'Enter Card Verification Code': 'cvv',
  'Enter Billing Address': 'address',
  'Enter Payment Description': 'description'
}

const mainQuestions = Object.keys(formFields)

async function updateDialog(account: string, input: string) {
  await SessionModel.updateOne({ account }, { $push: { dialog: input } })
}

function extractCapturedQuestion(session: ISession) {
  return session.dialog.filter((_, i) => i % 2 === 0)
}

function buildForm(inputs: string[], structured=false) {
  const form: Record<string, string> = {}

  for (let i = 0; i < inputs.length; i += 2) {
    const fieldName = inputs[i].replace('Enter ', '')
    const fieldValue = inputs[i + 1]

    if (!structured) {
      Object.assign(form, {
        [fieldName]: fieldValue,
      })
    } else {
      Object.assign(form, {
        [formFields[inputs[i]]]: fieldValue,
      })
    }
  }

  return form
}

async function completeCheckout(account: string) {
  const registration = await SessionModel.findOne({ account })

  if (!registration) {
    return
  }

  const form = buildForm(registration.dialog)
  const keys = Object.keys(form)
  let message = 'Here is your information:\n'

  for (let i = 0; i < keys.length; i++) {
    message += `\n${keys[i]}:\n${form[keys[i]]}`
  }

  message += `\n\nType "confirm order" to complete your order or "cancel order" to cancel your order.`

  WhatsappDispatcher.send(account, {
    type: 'text',
    text: { body: message },
  })
}

async function manageCheckoutFlow(session: ISession, account: string, input: string) {
  try {
    const capturedQuestions = extractCapturedQuestion(session)
    const dialogNeedsUpdate = capturedQuestions.length < mainQuestions.length

    await updateDialog(account, input)

    if (dialogNeedsUpdate) {
      const nextQuestion = mainQuestions[capturedQuestions.length]
      await updateDialog(account, nextQuestion)
      WhatsappDispatcher.send(account, {
        type: 'text',
        text: { body: nextQuestion },
      })
    }

    if (capturedQuestions.length === mainQuestions.length) {
      await completeCheckout(account)
    }
  } catch (error) {
    console.log(error)
  }
}

async function startPaymentProcess(account: string) {
  try {
    const session = await SessionModel.findOne<ISession>({ account })

    if (!session) {
      const process = await SessionModel.create({
        account,
        provider: 'whatsapp',
        process: 'checkout',
        dialog: [mainQuestions.first],
      })

      WhatsappDispatcher.send(account, {
        type: 'text',
        text: { body: process.dialog.first },
      })

      return
    }

    WhatsappDispatcher.send(account, {
      type: 'text',
      text: {
        body: `Your have already started checkout process.\n\nPlease ${mainQuestions.last?.lowercase()}`,
      },
    })
  } catch (error) {
    console.log(error)
  }
}

async function confirmOrder(account: string) {
  try {
    const session = await SessionModel.findOne<ISession>({ account })

    if (!session) {
      return
    }

    if (session.process === 'checkout') {
      const form = buildForm(session.dialog, true)
      const user = await AccountService.find(account)

      console.log(form)

      WhatsappDispatcher.send(account, {
        type: 'text',
        text: { body: `Hallo ${user?.name}\n\nThank you. Your order was successful` },
      })

      await SessionModel.deleteOne({account})

      const cartItems = await CartModel.find({ account })

      // Process to the backend
    }
  } catch (error) {
    console.log(error)
  }
}

async function cancelOrder(account: string) {
  try {
    const session = await SessionModel.deleteOne({ account, process: 'checkout' })

    if (session.deletedCount) {
      WhatsappDispatcher.send(account, {
        type: 'text',
        text: { body: 'Order was cancelled successfully' },
      })
    }
  } catch (error) {
    console.log(error)
  }
}

async function checkout(account: string) {
  try {
    const existingAccount = await AccountService.find(account)

    if (!existingAccount) {
      // prompt user to create an account
      WhatsappDispatcher.send(account, {
        type: 'text',
        text: {
          body: `🚨 Authentication required!\n\nTo get started, please register your number with us. Type "register" to proceed with the registration process.`,
        },
      })

      return
    }

    startPaymentProcess(account)
  } catch (error) {
    console.log(error)
  }
}

const PaymentService = {
  checkout,
  manageCheckoutFlow,
  confirmOrder,
  cancelOrder
}

export default PaymentService
