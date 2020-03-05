import AppException from "./AppException";

export default class PostNotFoundException extends AppException {
    constructor(id:string) {
        super({message: `No post found with id ${id}`, status: 404});
    }

}
