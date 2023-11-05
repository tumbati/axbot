import { Provider } from './dialog.interface'

interface ContactProfile {
  name: string
}

interface MessageContext {
  from: string
  id: string
}

interface MessageInteractive {
  type: 'list_reply'
  list_reply: {
    id: string
    title: string
    description: string
  }
}

interface Message {
  context?: MessageContext
  interactive?: MessageInteractive
  from: string
  id: string
  timestamp: string
  text: {
    body: string
  }
  type: string
  button: {
    payload: string
    text: string
  }
}

interface Metadata {
  display_phone_number: string
  phone_number_id: string
}

export interface Value {
  messaging_product: string
  metadata: Metadata
  contacts: {
    profile: ContactProfile
    wa_id: string
  }[]
  messages: Message[]
}

interface Changes {
  value: Value
  field: string
}

interface MessageEntry {
  id: string
  changes: Changes[]
}

export interface WhatsAppMessagePayload {
  object: string
  entry: MessageEntry[]
}

export enum WaTemplates {
  Welcome = 'welcome',
}

export interface MessageSubstance {
  id?: string
  provider: Provider
  account: string
  message?: string
  contextId?: string
}

export interface WhatsappTemplateLanguage {
  code: string
}

export interface WhatsappTemplate {
  name: string
  language: WhatsappTemplateLanguage
  components?: any[]
}

export interface WhatsappTextBody {
  body: string
}

interface ListAction {
  id: string
  title: string
  description: string
}

interface ListSection {
  title: string
  rows: ListAction[]
}

interface InteractiveList {
  type: 'list'
  header: {
    type: 'text'
    text: string
  }
  body: {
    text: string
  }
  footer: {
    text: string
  }
  action: {
    button: string
    sections: ListSection[]
  }
}

export interface PaginationDispatch {
  header: string
  body: string,
  next?: string | null
  previous?: string | null
}

export interface DispatchPayload {
  type: 'template' | 'text' | 'interactive'
  template?: WhatsappTemplate
  text?: WhatsappTextBody
  interactive?: InteractiveList
}
