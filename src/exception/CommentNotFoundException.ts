import AppError from "../app/AppError";

export default class CommentNotFoundException extends AppError {
    constructor(id:string) {
        super(`No comment found with id ${id}`, 404);
    }
}
