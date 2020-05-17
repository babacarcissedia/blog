import { Request, Response, NextFunction } from 'express'
import AuthenticationException from '../exception/AuthenticationException'
import UserRepository from '../repository/UserRepository'
import NotAuthorizedException from "../exception/NotAuthorizedException";

export default async function authMiddleware (request: Request, response: Response, next: NextFunction): Promise<void> {
  const token = String(request.headers.authorization).replace('Bearer ', '')
  const users = await UserRepository.findAll({ token })
  if (users.length === 0) {
    return next(new AuthenticationException({ status: 401 }))
  }
  request.user = users[0]
  if(request.user.role === 'CUSTOMER' ) {
    return next(new NotAuthorizedException())
  }
  next()
}
