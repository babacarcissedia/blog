import Controller from "./Controller"
import { Request, Response, NextFunction } from 'express'
import User from "../api/user/User"
import AppApiDataResponse from "../response/AppApiDataResponse";
import AppApiSuccessResponse from "../response/AppApiSuccessResponse";
import UserNotFoundException from "../exception/UserNotFoundException";

export default class UserController extends Controller {
  static async store(req: Request, res: Response, next: NextFunction) {
    new User(req.body)
      .save()
      .then(user => res.json(new AppApiSuccessResponse(user, `User ${user.first_name} created`)))
      .catch(error => next(error))
  }


  static async index(req: Request, res: Response, next: NextFunction) {
    User.find({})
      .then(users => res.json(new AppApiDataResponse(users)))
      .catch(error => next(error))
  }


  static show(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id
    User.findById(id)
      .then((user: any) => {
        if (user) {
          res.json(new AppApiDataResponse(user));
        } else {
          throw new UserNotFoundException(id)
        }
      })
      .catch((error) => next(error))
  }


  static update(request: Request, response: Response, next: NextFunction) {
    const id = request.params.id;
    let data: any = { first_name: request.body.first_name, last_name: request.body.last_name, email: request.body.email }
    User.findByIdAndUpdate(id, data, { new: false })
      .then(user => {
        if (!user) {
          throw new UserNotFoundException(id)
        }
        response.send(new AppApiSuccessResponse(user, `User ${user.first_name} updated.`));
      })
      .catch((error) => next(error))
  }


  static destroy(request: Request, response: Response, next: NextFunction) {
    const id = request.params.id
    User.findByIdAndDelete(id)
      .then(user => {
        if (!user) {
          throw new UserNotFoundException(id)
        }
        response.json(new AppApiSuccessResponse(user, `User ${id} deleted.`));
      })
      .catch((error) => next(error))
  }
}
