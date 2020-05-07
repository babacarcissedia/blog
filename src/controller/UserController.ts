import NotFoundException from "../exception/NotFoundException";
import Controller from "./Controller"
import { Request, Response, NextFunction } from 'express'
import userModel from '../model/User'
import AppApiDataResponse from "../response/AppApiDataResponse";
import  Validator from 'buddy-validator';
import lodash from 'lodash'

export default class UserController extends Controller {
  static async store(req: Request, res: Response, next: NextFunction) {
      const formData = req.body
      const v =  await Validator.make({
          data: formData,
          rules: {
              first_name: 'required',
              last_name: 'required',
              email: ['required', 'unique:Users'],
              password: 'required|confirmed',
              token: 'required'
          },
          models: {
              Users: {
                  exists (filter) {
                      const value = filter.email
                      return userModel.countDocuments({email: value})

                  }
                  }
              }
      })
      if(v.fails()) {
          return res.status(422).json(new AppApiDataResponse({data: v.getErrors(), message: 'Validation errors'}))
      }
    new userModel(req.body)
      .save()
      .then(user => res.json(new AppApiDataResponse({data: user, message:`User ${user.first_name} created.`})))
      .catch(error => next(error))
  }


  static async index(req: Request, res: Response, next: NextFunction) {
      userModel.find({})
      .then(users => res.json(new AppApiDataResponse({data:users})))
      .catch(error => next(error))
  }


  static show(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id
      userModel.findById(id)
      .then((user: any) => {
        if (!user) {
          throw new NotFoundException({ message: 'User not found' })
        }
          res.json(new AppApiDataResponse({data:user}));
      })
      .catch((error: any) => next(error))
  }


  static async update(request: Request, response: Response, next: NextFunction) {
    const id = request.params.id;
    const data = lodash.pick(request.body, ['first_name', 'last_name', 'email', 'password']);
    userModel.findByIdAndUpdate(id, data, { new: false })
      .then(user => {
        if (!user) {
          throw new NotFoundException({ message: 'User not found' })
        }
        response.send(new AppApiDataResponse({data: Object.assign(user,data), message:`User ${request.body.first_name} updated.`}));
      })
      .catch((error) => next(error))
  }


  static destroy(request: Request, response: Response, next: NextFunction) {
    const id = request.params.id
      userModel.findByIdAndDelete(id)
      .then(user => {
        if (!user) {
          throw new NotFoundException({ message: 'User not found'})
        }
        response.json(new AppApiDataResponse({data:user, message:`User ${id} deleted.`}));
      })
      .catch((error) => next(error))
  }
}
