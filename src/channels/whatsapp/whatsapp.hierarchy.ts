import { HierarchyStructure } from 'src/interfaces'
import AccountService from 'src/services/account.service'
import CustomerCareService from 'src/services/customer-care.service'
import ProductService from 'src/services/product.service'

const structure: HierarchyStructure[] = [
  {
    name: 'search',
    label: 'Search',
    prompts: ['Enter a keyword to search'],
    action: ProductService.search,
  },
  {
    name: 'registration',
    label: 'Register',
    action: AccountService.startRegistrationFlow
  },
  {
    name: 'customer_support',
    label: 'Customer Support',
    header: 'Customer Support Menu\n\nSelect an option by entering its corresponding number',
    children: [
      {
        name: 'customer_support:feedback',
        label: 'Feedback',
        action: CustomerCareService.sendFeedback
      },
      {
        name: 'customer_support:faq',
        label: 'FAQ',
        action: CustomerCareService.faq
      }
    ]
  },
  {
    name: 'help',
    label: 'Help',
    action: AccountService.renderHelpTemplate
  },
]

const Hierarchy = {
  structure,
}

export default Hierarchy
