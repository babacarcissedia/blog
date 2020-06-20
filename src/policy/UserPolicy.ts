import {IUser} from "@/model/interfaces";

export default class UserPolicy {
    public static canFetchUsers(user: IUser): Boolean {
       if(user) {
           if(user.role === 'ADMIN') {
               return true
           }
           return false
       }
       return false
    }

    public static canShowUser(user: IUser, id: string): Boolean {
        return user?.id == id || user?.role === 'ADMIN'
       }

       public static canUpdateUser(u: IUser, id: string): Boolean {
           return u?.id === id || u?.role === 'ADMIN'
       }

       public static  canDeleteUser(user: IUser, id: string): Boolean {
           return user?.role === 'ADMIN'
       }
}
