import AppException from "@/exception/AppException";
import { NextFunction, Request, Response } from 'express'
import AuthorizationException from "@/exception/AuthorizationException";
import UserRepository from '@/repository/UserRepository'

export default async function authMiddleware (request: Request, response: Response, next: NextFunction) {
  const token = String(request.headers.authorization || '')
    .replace('Bearer ', '')
  if (!token) {
    throw new AppException({ message: 'You need to login to access this resource.', status: 401 })
  }
  const users = await UserRepository.findAll({ token })
  if (users.length === 0) {
    throw new AppException({ status: 403, message: 'No user found with that token, maybe expired.' })
  }
  request.user = users[0]
  if (request.user.role === 'CUSTOMER') {
    throw new AuthorizationException()
  }
  next()
}
