import { IUser } from '@/model/interfaces'

export default class UserPolicy {
  public static canFetchUsers (user: IUser): Boolean {
    return user.role === 'ADMIN'
  }

  public static canShowUser (user: IUser, id: string): Boolean {
    return user.id == id || user.role === 'ADMIN'
  }

  public static canUpdateUser (u: IUser, id: string): Boolean {
    return u.id === id || u.role === 'ADMIN'
  }

  public static canResetPassword (u: IUser, id: string): Boolean {
    return u.id === id
  }

  public static canDeleteUser (user: IUser, id: string): Boolean {
    return user.role === 'ADMIN'
  }
}
