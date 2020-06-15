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
        if(user && user.id === id) {
            return true
        } else {
            if(user.role === 'ADMIN') {
                return true
            }
            return false
        }
       }

       public static canUpdateUser(u: IUser, id: string): Boolean {
           if(u && u.id === id) {
               return true
           } else {
               if(u.role === 'ADMIN') {
                   return true
               }
               return false
           }
       }

       public static  canDeleteUser(user: IUser, id: string): Boolean {
           if(user && user.role === 'ADMIN') {
               return true
           }
           return false
       }
}
