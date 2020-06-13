import AuthorizationException from "@/exception/AuthorizationException";
import { UserRole } from "@/model/interfaces";
import { NextFunction, Request, Response } from 'express'
import pick from 'lodash/pick'
import ValidationException from '@/exception/ValidationException'
import { RULES } from '@/model/User'
import UserRepository from '@/repository/UserRepository'
import AppApiDataResponse from '@/response/AppApiDataResponse'
import Validator from '@bcdbuddy/validator'
import Controller from './Controller'
import AppException from "@/exception/AppException";
import UserPolicy from "@/policy/UserPolicy";

export default class UserController extends Controller {
  static async store (request: Request, response: Response, next: NextFunction) {
    try {
      const data = pick(request.body,['first_name','last_name','email','password','role'])
      // TODO: pick
      const v = await Validator.make({
        data,
        rules: RULES,
        models: {
          Users: UserRepository
        }
      })
      if (v.fails()) {
        throw new ValidationException({ data: v.getErrors() })
      }
      const user = await UserRepository.add(data)
      response.json(new AppApiDataResponse({ data: user, message: `User ${user.first_name} created.` }))
    } catch (error) {
      next(error)
    }
  }

  static async index (request: Request, response: Response, next: NextFunction) {
    try {
      if(UserPolicy.canFetchUsers(request.user)) {
        const users = await UserRepository.findAll()
        response.json(new AppApiDataResponse({ data: users }))
      }
    }catch (error) {
      next(error)
    }
  }

  static async show (request: Request, response: Response, next: NextFunction) {
    try {
      const id = request.params.id
      if(!UserPolicy.canShowUser(request.user, id)) {
        next(new AppException({message: `You are not authorized`, status: 403}))
      }
      const user = await UserRepository.find({ id })
      response.json(new AppApiDataResponse({ data: user }))
    } catch (error) {
      next(error)
    }
  }

  static async update (request: Request, response: Response, next: NextFunction) {
    try {
      const id = request.params.id
      const data = pick(request.body, ['first_name', 'last_name', 'email', 'password'])
      const valid = await Validator.make({
        data,
        rules: RULES,
        models: {
          Users: UserRepository
        }
      })
      if (valid.fails()) {
        throw new ValidationException({ data: valid.getErrors() })
      }
      if(!UserPolicy.canUpdateUser(request.user,id)) {
        next(next(new AuthorizationException()))
      }
      const updateUser = await UserRepository.update(id, data)
      response.send(new AppApiDataResponse({
              data: updateUser,
              message: `User ${updateUser.first_name} updated.`
            }))
    } catch (error) {
      next(error)
    }
  }

  static async destroy (request: Request, response: Response, next: NextFunction) {
    try {
      const id = request.params.id
      if(!UserPolicy.canDeleteUser(request.user, id)) {
        next(new AppException({message: `You are not authorized`, status: 403}))
      }
      const deleteUser = await UserRepository.delete(id)
      response.json(new AppApiDataResponse({ data: deleteUser, message: `User ${id} deleted.` }))
    }catch (error) {
      next(error)
    }
  }
}
