import AppApiResponse from "../response/AppApiResponse";
import {Response, Router} from "express";
import AppError from "../app/AppError";

export default abstract class Controller {
    protected router: Router;

    constructor () {
        this.router = Router()
    }

    abstract getRouter(): Router;

    abstract getPath(): string;

    handleErrors(error: Error, response: Response) {
        if (error instanceof AppError) {
            response.status(error.getStatusCode())
                .json(new AppApiResponse(error, AppApiResponse.TYPE_ERROR, error.message))
        } else {
            response.status(500)
                .json(new AppApiResponse(error, AppApiResponse.TYPE_ERROR, error.message))
        }
    }
}
