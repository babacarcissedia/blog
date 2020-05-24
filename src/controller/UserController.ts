import AuthorizationException from "@/exception/AuthorizationException";
import ValidationException from '@/exception/ValidationException'
import { UserRole } from "@/model/interfaces";
import { RULES } from '@/model/User'
import UserRepository from '@/repository/UserRepository'
import AppApiDataResponse from '@/response/AppApiDataResponse'
import Validator from '@bcdbuddy/validator'
import { NextFunction, Request, Response } from 'express'
import Controller from './Controller'

export default class UserController extends Controller {
  static async store (request: Request, response: Response, next: NextFunction) {
    const data = request.body
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

  static show (request: Request, response: Response, next: NextFunction) {
    const id = request.params.id
    UserRepository.find({ id })
      .then((user: any) => {
        response.json(new AppApiDataResponse({ data: user }))
      })
      .catch((error: any) => next(error))
  }

  static async update (request: Request, response: Response, next: NextFunction) {
    const id = request.params.id
    const data = request.body
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
    UserRepository.delete(id)
      .then(user => {
        response.json(new AppApiDataResponse({ data: user, message: `User ${id} deleted.` }))
      })
      .catch((error) => next(error))
  }
}
