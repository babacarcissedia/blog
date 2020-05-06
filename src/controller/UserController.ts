import NotFoundException from "../exception/NotFoundException";
import Controller from "./Controller"
import { Request, Response, NextFunction } from 'express'
import userModel from '../model/User'
import AppApiDataResponse from "../response/AppApiDataResponse";
import  Validator from 'buddy-validator';
import IUser from "api/user/IUser";
import UserRepository from "../model/UserRepository";
import {onlyOn} from "../app.helpers";
import IPost from "../api/post/IPost";
import AppApiErrorResponse from "../response/AppApiErrorResponse";
import AppError from "../exception/AppError";

export default class UserController extends Controller {
  static async store(req: Request, res: Response, next: NextFunction) {
      const formData = req.body
      const v =  await Validator.make({
          data: formData,
          rules: {
              first_name: 'required',
              last_name: 'required',
              email: ['required', 'unique:Users','email'],
              password: 'required|confirmed',
              token: 'required'
          },
          models: {
              Users: {
                  async exists (filter) {
                      const value = filter.email
                     if(userModel.find({ email: value})) {
                         throw new AppError(`Email ${value} already exists`, 422)
                     }
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
    const data = onlyOn(request.body, ['first_name', 'last_name', 'email', 'password']);
     let user: IUser | null = null
      try {
         user = await userModel.findById(id)
      } catch (e) {
          next(new NotFoundException({message: 'User not found'}))
      }
      if(!user) {
          next(new NotFoundException({message: ' User not found'}))
      }

      userModel.findByIdAndUpdate(id, data, { new: false })
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
