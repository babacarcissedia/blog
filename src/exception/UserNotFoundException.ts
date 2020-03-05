import AppException from "./AppException";

export default class UserNotFoundException extends AppException {
    constructor(id:string) {
        super({ message:`No user found with id ${id}`, status: 404});
    }

}
