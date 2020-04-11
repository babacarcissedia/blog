import NotFoundException from "../exception/NotFoundException";
import Controller from "./Controller"
import { Request, Response, NextFunction } from 'express'
import User from "../api/user/User"
import AppApiDataResponse from "../response/AppApiDataResponse";

export default class UserController extends Controller {
  static async store(req: Request, res: Response, next: NextFunction) {
    new User(req.body)
      .save()
      .then(user => res.json(new AppApiDataResponse({data: user, message:`User ${user.first_name} created.`})))
      .catch(error => next(error))
  }


  static async index(req: Request, res: Response, next: NextFunction) {
    User.find({})
      .then(users => res.json(new AppApiDataResponse({data:users})))
      .catch(error => next(error))
  }


  static show(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id
    User.findById(id)
      .then((user: any) => {
        if (!user) {
          throw new NotFoundException({ message: 'User not found' })
        }
          res.json(new AppApiDataResponse({data:user}));
      })
      .catch((error: any) => next(error))
  }


  static update(request: Request, response: Response, next: NextFunction) {
    const id = request.params.id;
    const data = request.body
    User.findByIdAndUpdate(id, data, { new: false })
      .then(user => {
        if (!user) {
          throw new NotFoundException({ message: 'User not found' })
        }
        response.send(new AppApiDataResponse({data: user, message:`User ${user.first_name} updated.`}));
      })
      .catch((error) => next(error))
  }


  static destroy(request: Request, response: Response, next: NextFunction) {
    const id = request.params.id
    User.findByIdAndDelete(id)
      .then(user => {
        if (!user) {
          throw new NotFoundException({ message: 'User not found'})
        }
        response.json(new AppApiDataResponse({data:user, message:`User ${id} deleted.`}));
      })
      .catch((error) => next(error))
  }
}
