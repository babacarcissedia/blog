import * as express from 'express'
import AuthorizationException from "@/exception/AuthorizationException";
import AppException from "@/exception/AppException";
import {request} from "express";
export default class UserPolicy {
    private authUser = express.request.user
    public static  canFetchUsers(authUser) : Boolean {
        if(authUser) {
            if(authUser.role !== 'ADMIN') {
                return false
            }
        }
        return false
    }

    public static canShowUser(authUser,id: string) : Boolean {
        if(authUser) {
            if(authUser.id !== id ) {
                return false
            }
            if(authUser.role !== 'ADMIN') {
                return false
            }
        }
       return false
    }

    public static canUpdateUser(authUser,id: string) : Boolean {
        if(authUser) {
            if(authUser.id !== id ) {
                return false
            }

            if(authUser.role !== 'ADMIN') {
                return false
            }
        }
        return false
    }

    public static canDeleteUser(authUser, id: string) : Boolean {
        if(authUser) {
            if(authUser.id !== id ) {
                return false
            }
            if(authUser.role !== 'ADMIN') {
                return false
            }
        }
        return false
    }
}
