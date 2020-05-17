import AppException from './AppException'

export default class AuthorizationException extends AppException {
  constructor () {
    super({ status: 403, message: 'You\'are not authorized' })
  }
}
