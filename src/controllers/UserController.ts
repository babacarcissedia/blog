import Controller from "./Controller"
import * as express from 'express'
import User from "../api/user/User"
import IUser from "../api/user/IUser";
import AppApiDataResponse from "../response/AppApiDataResponse";
import AppApiSuccessResponse from "../response/AppApiSuccessResponse";
import AppApiResponse from "../response/AppApiResponse";
import UserNotFoundException from "../exception/UserNotFoundException";

export default class UserController extends Controller {
    // Add new user
    async store(req: express.Request, res: express.Response) {
        let newUser = new User(req.body)
        try {
            let user: any = await newUser.save()
            res.json(new AppApiSuccessResponse(user, `User ${user.first_name} created`))
        } catch (error) {
            res.status(500).json( new AppApiResponse(error, AppApiResponse.TYPE_ERROR, error.message))
        }
    }

    // Get all users
    async index(req: express.Request, res: express.Response) {
        try {
            let users = await User.find({})
            res.json(new AppApiDataResponse(users))
        } catch (error) {
            res.status(500).json(new AppApiResponse(error, AppApiResponse.TYPE_ERROR, error.message))
        }
    }

    // Show User
    show (req: express.Request, res: express.Response) {
        const id = req.params.id
        User.findById(id)
            .then((user: any) => {
                if (user) {
                    res.json(new AppApiDataResponse(user));
                } else {
                    throw new UserNotFoundException(id)
                }
            })
            .catch((error: any) => this.handleErrors(error, res))
    }

    // update User
    update (request: express.Request, response: express.Response, next: express.NextFunction) {
        const id = request.params.id;
        let data: any = {first_name: request.body.first_name, last_name: request.body.last_name, email: request.body.email}
        User.findByIdAndUpdate(id, data, {new: false})
            .then(user => {
                if (user) {
                    response.send(new AppApiSuccessResponse(user, `User ${user.first_name} updated.`));
                } else {
                    next(new UserNotFoundException(id))
                }
            })
            .catch((error: any) => this.handleErrors(error, response))
    }

    destroy (request: express.Request, response: express.Response, next: express.NextFunction) {
        const id = request.params.id
        User.findByIdAndDelete(id)
            .then(user => {
                if (user) {
                    response.json(new AppApiSuccessResponse(user, `User ${id} deleted.`));
                } else {
                    next(new UserNotFoundException(id))
                }
            })
            .catch((error: any) => this.handleErrors(error, response))
    }

}
