import { Provider } from './dialog.interface'

export interface ISession {
  dialog: string[]
  account: string
  provider: Provider
  process: string
}
