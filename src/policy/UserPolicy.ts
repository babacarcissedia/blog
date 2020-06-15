import {IUser} from "@/model/interfaces";

export default class UserPolicy {
    public static canFetchUsers(user: IUser): Boolean{
       if(user) {
           if(user.role === 'ADMIN') {
               return true
           }
           return false
       }
       return false
    }

    public static CanShowUser(user: IUser, id: string) : Boolean{
       if(user) {
           if(user.id !== id) {
               return false
           } else {
               if(user.role === 'ADMIN'){
                   return true
               }
               return false
           }
       }
         return false
       }
}
