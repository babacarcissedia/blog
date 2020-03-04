import AppError from "../app/AppError";

export default class UserNotFoundException extends AppError {
    constructor(id:string) {
        super(`No user found with id ${id}`, 404);
    }

}
