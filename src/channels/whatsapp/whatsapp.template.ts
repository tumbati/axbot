import { DispatchPayload, PaginationDispatch } from 'src/interfaces'
import { RegistrationForm } from 'src/interfaces/account.interface'
import { IProduct } from 'src/interfaces/product.interface'
import { IFaq } from 'src/models/faq.model'
import { removeHtmlTags } from 'src/utils/util'
import constants from './whatsapp.constants'

const helpMenu = [
  {
    title: 'Search',
    description:
      'Send "menu" then select 1. You will be prompted to enter a keyword. Send something that you want to search.',
  },
  {
    title: 'Browse Categories',
    description:
      'Select "Browse Categories" from the menu. You\'ll be able to explore various product categories.',
  },
  {
    title: 'Cart',
    description: 'Choose "Cart" from the menu to manage your shopping cart.',
    children: [
      {
        title: 'View Cart',
        description: 'Select this option to see the items currently in your cart.',
      },
      {
        title: 'Clear Cart',
        description: 'Opt for this to remove all items from your cart.',
      },
      {
        title: 'Edit Quantity',
        description:
          'If you need to adjust the quantity of a specific item, choose this option (private).',
      },
    ],
  },
  {
    title: 'Register',
    description:
      'To register, select "Register" from the menu and follow the prompts to complete the registration process.',
  },
  {
    title: 'Track My Order',
    description:
      'Select "Track My Order" to find out the status and details of your order.',
  },
  {
    title: 'Customer Support',
    description:
      'For any assistance or inquiries, choose "Customer Support" to get help from our support team.',
  },
  {
    title: 'Checkout',
    description:
      'Select "Checkout" to proceed to the checkout process and complete your order.',
  },
  {
    title: 'Help',
    description:
      'Choose "Help" to access information and guides that can assist you in using our services.',
  },
]

function productCardTemplate(product: IProduct): DispatchPayload {
  return {
    type: 'template',
    template: {
      name: constants.templates.product_card,
      language: { code: 'en_US' },
      components: [
        {
          type: 'header',
          parameters: [
            {
              type: 'image',
              image: {
                link: product.images.first,
              },
            },
          ],
        },
        {
          type: 'body',
          parameters: [
            {
              type: 'text',
              text: product.id,
            },
            {
              type: 'text',
              text: product.title,
            },
            {
              type: 'text',
              text: product.category,
            },
            {
              type: 'text',
              text: product.price,
            },
            {
              type: 'text',
              text: removeHtmlTags(product.description),
            },
          ],
        },
      ],
    },
  }
}


function registrationCard(form: RegistrationForm): DispatchPayload {
  return {
    type: 'template',
    template: {
      name: constants.templates.registration_card,
      language: { code: 'en_US' },
      components: [
        {
          type: 'body',
          parameters: [
            {
              type: 'text',
              text: form.first_name,
            },
            {
              type: 'text',
              text: form.last_name,
            },
            {
              type: 'text',
              text: form.email,
            },
            {
              type: 'text',
              text: form.password,
            },
          ],
        },
      ],
    },
  }
}

function checkoutTemplate(url: string): DispatchPayload {
  return {
    type: 'template',
    template: {
      name: constants.templates.checkout_card,
      language: { code: 'en_US' },
      components: [
        {
          type: 'button',
          sub_type: 'url',
          index: 0,
          parameters: [
            {
              type: 'text',
              text: url,
            },
          ],
        },
      ],
    },
  }
}

function helpTextTemplate(): string {
  let text = `Help\n\n`

  for (let i = 0; i < helpMenu.length; i++) {
    text += `${i + 1}. ${helpMenu[i].title}\n${helpMenu[i].description}\n\n`
  }

  return text
}

function registrationFormTemplate(): DispatchPayload {
  return {
    type: 'template',
    template: {
      name: constants.templates.registration_form,
      language: { code: 'en_US' },
      components: [],
    },
  }
}

function paginationTemplate(payload: PaginationDispatch): DispatchPayload {
  const rows = []

  if (payload.previous) {
    rows.push({
      id: 'previous',
      title: 'Previous',
      description: 'Go to the previous page',
    })
  }

  rows.push({
    id: 'next',
    title: 'Next',
    description: 'Go to the next page',
  })
  return {
    type: 'interactive',
    interactive: {
      type: 'list',
      header: {
        type: 'text',
        text: payload.header,
      },
      body: {
        text: payload.body,
      },
      footer: {
        text: 'From Tumbati',
      },
      action: {
        button: 'Change page',
        sections: [
          {
            title: 'Pagination',
            rows,
          },
        ],
      },
    },
  }
}

function cartInteractiveTemplate(payload: PaginationDispatch): DispatchPayload {
  return {
    type: 'interactive',
    interactive: {
      type: 'list',
      header: {
        type: 'text',
        text: payload.header,
      },
      body: {
        text: payload.body,
      },
      footer: {
        text: 'kutenga.mw',
      },
      action: {
        button: 'Cart options',
        sections: [
          {
            title: 'Pagination',
            rows: [
              {
                id: 'checkout',
                title: 'Checkout',
                description: 'Complete your purchase by checking out.',
              },
              {
                id: 'clear_cart',
                title: 'Clear cart',
                description: 'Remove everything from your cart.',
              },
            ],
          },
        ],
      },
    },
  }
}

function faqTextTemplate(faq: IFaq[]): string {
  let template = 'Frequently Asked Questions\n\n'

  for(let i=0;i<faq.length;i++) {
    template += `${i+1}. ${faq[i].question}\n${faq[i].answer}\n\n`
  }

  const notice = 'Send "menu" to go to main menu.'

  return template+notice
}

const WhatsAppTemplate = {
  productCardTemplate,
  registrationCard,
  checkoutTemplate,
  registrationFormTemplate,
  helpTextTemplate,
  paginationTemplate,
  cartInteractiveTemplate,
  faqTextTemplate
}

export default WhatsAppTemplate
