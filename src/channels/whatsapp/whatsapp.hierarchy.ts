import { HierarchyStructure } from 'src/interfaces'
import AccountService from 'src/services/account.service'
import CartService from 'src/services/cart.service'
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
    name: 'browse_categories',
    label: 'Browse Categories',
    action: ProductService.browseCategories
  },
  {
    name: 'cart',
    label: 'Cart',
    header: 'Cart Menu\n\nSelect an option by entering its corresponding number',
    action: CartService.viewCart,
  },
  {
    name: 'registration',
    label: 'Register',
    action: AccountService.startRegistrationFlow
  },
  {
    name: 'track_order',
    label: 'Track My Order',
    action: ProductService.trackOrder
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
    name: 'checkout',
    label: 'Checkout',
    action: CartService.checkout
  },
  {
    name: 'help',
    label: 'Help',
    action: AccountService.renderHelpTemplate
  },
  {
    name: 'cart:edit_quantity',
    label: 'Edit Quantity',
    action: CartService.editQuantity,
    isPrivate: true
  },
]

const Hierarchy = {
  structure,
}

export default Hierarchy
