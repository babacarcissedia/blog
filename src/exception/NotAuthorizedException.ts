import AppException from "./AppException";

export default class NotAuthorizedException extends AppException {
    constructor() {
        super(403, `You'are not authorized`);
    }
}
