import AppApiResponse from "../response/AppApiResponse";
import {Response} from "express";
import AppError from "../app/AppError";

export default abstract class Controller {
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
