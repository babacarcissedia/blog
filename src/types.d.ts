import { IUser } from './model/interfaces'

declare global{
  namespace Express {
    export interface Request {
      token: any
      user: IUser
      isJson (): boolean
    }
  }
}
