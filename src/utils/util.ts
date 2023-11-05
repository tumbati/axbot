import { HierarchyStructure, PaginationOptions } from 'src/interfaces'
import { IProduct } from 'src/interfaces/product.interface'

export function randomChars(max = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charsLength = chars.length
  let randomString = ''

  for (let i = 0; i < max; i++) {
    randomString += chars.charAt(Math.floor(Math.random() * charsLength))
  }

  return randomString
}

export const emojiNumerals = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣']

export function numberToEmoji(input: number): string {
  if (input < 0) {
    throw new Error('Number should be a non-negative integer.')
  }

  const digits = String(input).split('').map(Number)
  let emojiNumeral = ''

  digits.forEach((digit) => {
    if (digit < 0 || digit > 9) {
      throw new Error('Invalid digit in the number.')
    }
    emojiNumeral += emojiNumerals[digit]
  })

  return emojiNumeral.trim()
}

export function hasHierarchySeparator(level: string): boolean {
  return level.includes(':')
}

export function buildMenu(headerMessage: string, menu: HierarchyStructure[]): string {
  let message = ''

  for (let i = 0; i < menu.length; i++) {
    if (menu[i].isPrivate) {
      continue
    }

    const label = `${numberToEmoji(i + 1)} ${menu[i].label}\n`
    if (i === 0) {
      message = `${headerMessage}:\n\n${label}`
      continue
    }

    message += `${label}`
  }

  return message
}

export function isDigit(value: string): boolean {
  return /^[0-9]*$/.test(value)
}

export function removeHtmlTags(input: string): string {
  return input.replace(/<\/?[^>]+(>|$)/g, '')
}

export function findItemPath(
  structure: HierarchyStructure[],
  targetName: string
): HierarchyStructure | null {
  for (const item of structure) {
    if (item.name === targetName) {
      return item
    }

    if (item.children) {
      const foundInChildren = findItemPath(item.children, targetName)
      if (foundInChildren) {
        return foundInChildren
      }
    }
  }

  return null
}

export function createWhatsappTextTemplate(products: IProduct[], pagination: PaginationOptions): string {
  let template = `Enter a corresponding number to view details about the product.\n\n`

  for (let i = 0; i < products.length; i++) {
    const product = products[i]
    if (i === 0) {
      template += `${numberToEmoji(1)} ${product.title}\nPrice: MWK ${
        product.price
      }`
    }

    if (i > 0) {
      template += `\n\n${numberToEmoji(i + 1)} ${product.title} \nPrice: MWK ${
        product.price
      }`
    }
  }

  const notice = pagination.count > 10 ? `\nTo change between pages click button below.` : ''

  return template+notice
}

export function validateName(value: string, field: string) {
  const minLength = 2
  const maxLength = 20

  if (!/^[A-Za-z\s]+$/.test(value)) {
    return {
      isValid: false,
      message: `${field} can only contain alphabetic characters.`,
    }
  }

  if (value.length < minLength || value.length > maxLength) {
    return {
      isValid: false,
      message: `${field} must be between ${minLength} and ${maxLength} characters.`,
    }
  }

  return { isValid: true }
}

export function validateEmail(value: string, field: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!value) {
    return { isValid: false, message: 'Email is required.' }
  }

  if (!emailRegex.test(value)) {
    return { isValid: false, message: 'Invalid email format.' }
  }

  return { isValid: true, message: 'Email is valid.' }
}

export function validatePassword(password: string, field: string) {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/

  if (!password) {
    return { isValid: false, message: 'Password is required.' }
  }

  if (!passwordRegex.test(password)) {
    return {
      isValid: false,
      message:
        'Password must be at least 6 characters long and contain at least one letter and one number.',
    }
  }

  return { isValid: true, message: 'Password is valid.' }
}

export function capitalize(str: string) {
  if (!str) return str
  return str.charAt(0).toUpperCase() + str.substring(1, str.length).toLowerCase()
}
