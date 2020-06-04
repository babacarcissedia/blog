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
    const authUser = request.user
    if (authUser.role !== UserRole.ADMIN) {
      return next(new AuthorizationException())
    }
    UserRepository.findAll()
      .then(users => response.json(new AppApiDataResponse({ data: users })))
      .catch(error => next(error))
  }

  static async show (request: Request, response: Response, next: NextFunction) {
    const id = request.params.id
    if(request.user.id !== id && request.user.role !== 'ADMIN') {
      return next(next(new AppException({ message: `You are not authorized`, status: 403})))
    }
    UserRepository.find({ id })
      .then((user: any) => {
        response.json(new AppApiDataResponse({ data: user }))
      })
      .catch((error: any) => next(error))
  }

  static async update (request: Request, response: Response, next: NextFunction) {
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
    if(request.user.id !== id && request.user.role !== 'ADMIN') {
      return next(new AppException({ message: `You are not authorized`, status: 403}))
    }
    UserRepository.update(id, data)
      .then(user => {
        response.send(new AppApiDataResponse({
          data: user,
          message: `User ${user.first_name} updated.`
        }))
      })
      .catch((error) => next(error))
  }

  static destroy (request: Request, response: Response, next: NextFunction) {
    const id = request.params.id
    if(request.user.id !== id && request.user.role !== 'ADMIN') {
      return next(new AppException({ message: `You are not authorized`, status: 403}))
    }
    UserRepository.delete(id)
      .then(user => {
        response.json(new AppApiDataResponse({ data: user, message: `User ${id} deleted.` }))
      })
      .catch((error) => next(error))
  }
}
