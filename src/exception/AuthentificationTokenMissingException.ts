import AppException from "./AppException";

export default class AuthentificationTokenMissingException extends AppException {
    constructor() {
        super(401, 'Authentification Token missing');
    }
}
