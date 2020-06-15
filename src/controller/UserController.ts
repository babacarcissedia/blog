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
import UserPolicy from '@/policy/UserPolicy';

export default class UserController extends Controller {
  static async store (request: Request, response: Response, next: NextFunction) {
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
    UserRepository.add(data)
      .then(user => {
        response.json(new AppApiDataResponse({ data: user, message: `User ${user.first_name} created.` }))
      })
      .catch(error => next(error))
  }

  static index (request: Request, response: Response, next: NextFunction) {
    if (!UserPolicy.canFetchUsers(request.user)) {
      return next(new AppException({message: `You are not authorized`, status: 403}))
    }
    UserRepository.findAll()
      .then(users => response.json(new AppApiDataResponse({ data: users })))
      .catch(error => next(error))
  }

  static async show (request: Request, response: Response, next: NextFunction) {
    try {
      const id = request.params.id
      if(!UserPolicy.canShowUser(request.user, id)) {
        return next(next(new AppException({ message: `You are not authorized`, status: 403})))
      }
      const user = await UserRepository.find({ id })
      if(user) {
        return response.json(new AppApiDataResponse({ data: user }))
      }
    } catch (error) {
       next(error)
    }
  }

  static async update (request: Request, response: Response, next: NextFunction) {
    const id = request.params.id
    const data = pick(request.body, ['first_name', 'last_name', 'email', 'password'])
    try {
      if(!UserPolicy.canUpdateUser(request.user, id)) {
        return next(new AuthorizationException())
      }
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
      const userUpdate = await UserRepository.update(id, data)
      if(userUpdate) {
        return response.send(new AppApiDataResponse({
          data: userUpdate,
          message: `User ${userUpdate.first_name} updated.`
        }))
      }
    }catch (error) {
       next(error)
    }
  }

  static destroy (request: Request, response: Response, next: NextFunction) {
    const id = request.params.id
    if(!UserPolicy.canDeleteUser(request.user, id)) {
      return next(new AppException({message: `You are not authorized`, status: 403}))
    }
    UserRepository.delete(id)
      .then(user => {
        response.json(new AppApiDataResponse({ data: user, message: `User ${id} deleted.` }))
      })
      .catch((error) => next(error))
  }
}
