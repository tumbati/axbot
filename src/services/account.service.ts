import WhatsappDispatcher from 'src/channels/whatsapp/whatsapp.dispatcher'
import WhatsAppTemplate from 'src/channels/whatsapp/whatsapp.template'
import { ISession } from 'src/interfaces'
import { IAccount, RegistrationForm } from 'src/interfaces/account.interface'
import AccountModel from 'src/models/account.model'
import HierarchyModel from 'src/models/hierarchy.model'
import SessionModel from 'src/models/session.model'
import { capitalize, validateEmail, validateName, validatePassword } from 'src/utils/util'

const registrationQuestions = [
  {
    question: 'Enter your firstname',
    field: 'Firstname',
    validate: validateName, // for firstname
  },
  {
    field: 'Lastname',
    question: 'Enter your lastname',
    validate: validateName, // for lastname
  },
  {
    field: 'Email',
    question: 'Enter your email',
    validate: validateEmail, // for email
  },
  {
    field: 'Password',
    question: 'Enter your password',
    validate: validatePassword, // for password
  },
]

async function find(account: string): Promise<IAccount | null> {
  try {
    const cache = await AccountModel.findOne<IAccount>({ phone: account })
    return cache
  } catch (e) {
    return null
  }
}

function extractCapturedQuestion(session: ISession) {
  return session.dialog.filter((_, i) => i % 2 === 0)
}

async function manageRegistrationFlow(session: ISession, account: string, input: string) {
  try {
    const capturedQuestions = extractCapturedQuestion(session)
    const dialogNeedsUpdate = capturedQuestions.length < registrationQuestions.length

    const lastQuestion = registrationQuestions[capturedQuestions.length - 1]
    const validation = lastQuestion.validate(input, lastQuestion.field)

    if (!validation.isValid) {
      return WhatsappDispatcher.sendText(
        account,
        `Validation error!\n\n${validation.message}`
      )
    }

    await updateDialog(account, input)

    if (dialogNeedsUpdate) {
      const nextQuestion = registrationQuestions[capturedQuestions.length]
      await updateDialog(account, nextQuestion.question)
      WhatsappDispatcher.send(account, {
        type: 'text',
        text: { body: nextQuestion.question },
      })
    }

    if (capturedQuestions.length === registrationQuestions.length) {
      await completeRegistration(account)
    }
  } catch (error) {
    console.log(error)
  }
}

async function updateDialog(account: string, input: string) {
  await SessionModel.updateOne({ account }, { $push: { dialog: input } })
}

async function completeRegistration(account: string) {
  try {
    const registration = await SessionModel.findOne({ account })

    if (!registration) {
      return
    }

    const build = buildForm(registration.dialog)
    const form: RegistrationForm = {
      first_name: capitalize(build.firstname),
      last_name: capitalize(build.lastname),
      email: build.email,
      password: build.password,
    }

    WhatsappDispatcher.sendText(account, 'Compiling, please wait...')
    const response = await WhatsappDispatcher.send(
      account,
      WhatsAppTemplate.registrationCard(form)
    )
    console.log(response?.messages.first)
  } catch (error) {
    console.log(error)
  }
}

function buildForm(inputs: string[]) {
  const form: Record<string, string> = {}

  for (let i = 0; i < inputs.length; i += 2) {
    const fieldName = inputs[i].toLowerCase().split(' ').pop() || ''
    const fieldValue = inputs[i + 1]

    Object.assign(form, {
      [fieldName]: fieldValue,
    })
  }

  return form
}

async function confirmRegistration(account: string, waId?: string) {
  try {
    WhatsappDispatcher.sendText(account, 'Confirm, Men working ahead...')
    // const session = await SessionModel.findOne<ISession>({ account })

    // if (!session) {
    //   return
    // }

    // if (session.process === 'registration') {
    //   const form = buildForm(session.dialog)
    //   await AccountModel.create({
    //     phone: account,
    //     name: form.name,
    //     address: form.address,
    //   })

    //   WhatsappDispatcher.send(account, {
    //     type: 'text',
    //     text: { body: 'Thank you. Registration was successful' },
    //   })

    //   await SessionModel.deleteOne({ account, process: 'registration' })

    //   const cartItems = await CartModel.find({ account })

    //   if (cartItems.length) {
    //     WhatsappDispatcher.send(account, {
    //       type: 'text',
    //       text: {
    //         body: `You have ${cartItems.length} items in your cart, type "checkout" to process payment.`,
    //       },
    //     })
    //   }
    // }
  } catch (error) {
    console.log(error)
  }
}

async function cancelRegistration(account: string, waId?: string) {
  try {
    const session = await SessionModel.deleteOne({ account, process: 'registration' })

    if (session.deletedCount) {
      WhatsappDispatcher.send(account, {
        type: 'text',
        text: { body: 'Registration was cancelled successfully\n\nSend "menu" to see other options.' },
      })
    }
  } catch (error) {
    console.log(error)
  }
}

async function restartRegistration(account: string, waId?: string) {
  try {
    await HierarchyModel.deleteOne({ account, command: 'registration' })
    await HierarchyModel.updateOne({account}, {$set: {level: 'menu'}})

    startRegistrationFlow(account, '')
  } catch (error) {
    console.log(error)
  }
}

async function startRegistrationFlow(account: string, value: string) {
  try {
    const cache = await find(account)

    if (cache) {
      WhatsappDispatcher.send(account, {
        type: 'text',
        text: { body: 'You already registered an account with us' },
      })
      return
    }

    // Redirect user to use web version
    WhatsappDispatcher.send(account, WhatsAppTemplate.registrationFormTemplate())

    /**
     * Manual account registration, this process is not very considering
     * password is displayed in plain text.
     */

    // const session = await SessionModel.findOne<ISession>({ account })
    // const hierarchy = await HierarchyModel.findOne({ account })

    // if (hierarchy?.level !== 'registration') {
    //   await SessionModel.deleteOne({ account })
    //   await HierarchyModel.updateOne({ account }, { $set: { level: 'registration' } })
    //   const process = await SessionModel.create({
    //     account,
    //     provider: 'whatsapp',
    //     process: 'registration',
    //     dialog: [registrationQuestions.first?.question],
    //   })

    //   WhatsappDispatcher.send(account, {
    //     type: 'text',
    //     text: { body: process.dialog.first },
    //   })

    //   return
    // }

    // if (session) {
    //   manageRegistrationFlow(session, account, value)
    // }
  } catch (error) {
    console.log(error)
  }
}

async function renderHelpTemplate(account: string): Promise<void> {
  try {
    WhatsappDispatcher.sendText(account, WhatsAppTemplate.helpTextTemplate())
  } catch (error) {
    console.log(error)
  }
}

const AccountService = {
  find,
  startRegistrationFlow,
  manageRegistrationFlow,
  confirmRegistration,
  cancelRegistration,
  restartRegistration,
  renderHelpTemplate
}

export default AccountService
