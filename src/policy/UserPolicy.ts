import * as express from 'express'
import AuthorizationException from "@/exception/AuthorizationException";
import AppException from "@/exception/AppException";
import {request} from "express";
import {IUser} from "@/model/interfaces";
export default class UserPolicy {
    private authUser = express.request.user
    public static  canFetchUsers(user: IUser) : Boolean {
        if(user) {
            if(user.role !== 'ADMIN') {
                return false
            }
        }
        return false
    }

    public static canShowUser(user: IUser,id: string) : Boolean {
        if(user) {
            if(user.id === id ) {
                return true
            } else {
                if(user.role === 'ADMIN') {
                    return true
                }
                return false
            }
        }
       return false
    }

    public static canUpdateUser(user: IUser,id: string) : Boolean {
        if(user) {
            if(user.id === id ) {
                return true
            }
            else {
                if(user.role === 'ADMIN') {
                    return true
                }
                return false
            }
        }
        return false
    }

    public static canDeleteUser(user: IUser, id: string) : Boolean {
        if(user) {
            if(user.id === id ) {
                return true
            }
            else {
                if(user.role === 'ADMIN') {
                    return true
                }
                return false
            }
        }
        return false
    }
}
