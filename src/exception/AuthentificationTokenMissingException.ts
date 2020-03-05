import AppException from "./AppException";

export default class AuthentificationTokenMissingException extends AppException {
    constructor() {
        super({status: 401, message: 'Authentification Token missing'});
    }
}
