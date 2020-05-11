import Validator from '@bcdbuddy/validator'
import { NextFunction, Request, Response } from 'express'
import pick from 'lodash/pick'
import NotFoundException from '../exception/NotFoundException'
import ValidationException from '../exception/ValidationException'
import { RULES } from '../model/User'
import UserRepository from '../repository/UserRepository'
import AppApiDataResponse from '../response/AppApiDataResponse'
import Controller from './Controller'
import authMiddleware from '../middleware/auth.middleware'

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
      .then(user => response.json(new AppApiDataResponse({ data: user, message: `User ${user.first_name} created.` })))
      .catch(error => next(error))
  }

  static index (request: Request, response: Response, next: NextFunction) {
    authMiddleware
    UserRepository.findAll()
      .then(users => response.json(new AppApiDataResponse({ data: users })))
      .catch(error => next(error))
  }

  static show (req: Request, res: Response, next: NextFunction) {
    const id = req.params.id
    UserRepository.find({ id })
      .then((user: any) => {
        if (!user) {
          throw new NotFoundException({ message: 'User not found' })
        }
        res.json(new AppApiDataResponse({ data: user }))
      })
      .catch((error: any) => next(error))
  }

  static async update (request: Request, response: Response, next: NextFunction) {
    const id = request.params.id
    const data = pick(request.body, ['first_name', 'last_name', 'email', 'password'])
    UserRepository.update(id, data)
      .then(user => {
        response.send(new AppApiDataResponse({
          data: Object.assign(user, data),
          message: `User ${request.body.first_name} updated.`
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
