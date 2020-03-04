import AppError from "../app/AppError";

export default class PostNotFoundException extends AppError {
    constructor(id:string) {
        super(`No post found with id ${id}`, 404);
    }

}
