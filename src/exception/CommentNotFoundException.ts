import AppException from "./AppException";

export default class CommentNotFoundException extends AppException {
    constructor(id:string) {
        super({message: `No comment found with id ${id}`, status: 404});
    }
}
