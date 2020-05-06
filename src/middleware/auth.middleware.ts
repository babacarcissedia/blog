import { Request, Response, NextFunction } from "express";
import User from "../api/user/User";
import AuthenticationException from "../exception/AuthenticationException";

export default async function authMiddleware (request: Request, response: Response, next: NextFunction) {
  const token = String(request.headers.authorization)
    .replace('Bearer ', '')
  const users = await User.find({
    token
  })
  if (users.length === 0) {
    throw new AuthenticationException({message: 'You are not authorized'})
  }
  request.user = users[0]
  next()
}
