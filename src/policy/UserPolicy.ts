import * as express from 'express'
import AuthorizationException from "@/exception/AuthorizationException";
import AppException from "@/exception/AppException";
export default class UserPolicy {
    public static  canFetchUsers(request: express.Request, next: express.NextFunction) : any {
        if(request.user.role !== 'ADMIN') {
            return next(new AuthorizationException())
        }
    }

    public static canShowUser(request: express.Request,id: string, next: express.NextFunction) : any {
       if(request.user.id !== id ) {
           return next(new AppException({ message: `You are not authorized`, status: 403}))
       }
       if(request.user.role !== 'ADMIN') {
           return next(new AppException({ message: `You are not authorized`, status: 403}))
       }
    }

    public static canUpdateUser(request: express.Request,id: string, next: express.NextFunction) : any {
        if(request.user.id !== id ) {
            return next(new AppException({ message: `You are not authorized`, status: 403}))
        }
        if(request.user.role !== 'ADMIN') {
            return next(new AppException({ message: `You are not authorized`, status: 403}))
        }
    }

    public static canDeleteUser(request: express.Request,id: string, next: express.NextFunction) {
        if(request.user.id !== id ) {
            return next(new AuthorizationException())
        }
        if(request.user.role !== 'ADMIN') {
            return next(new AppException({ message: `You are not authorized`, status: 403}))
        }
    }
}
