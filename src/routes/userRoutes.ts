import UserController from '../controller/UserController'
import { Router } from 'express'
import authMiddleware from "../middleware/auth.middleware";
export default Router()
  .get('/', authMiddleware, UserController.index.bind(this))
  .post('/', UserController.store.bind(this))
  .get('/:id([A-z0-9]+)', authMiddleware, UserController.show.bind(this))
  .put('/:id([A-z0-9]+)', authMiddleware, UserController.update.bind(this))
  .delete('/:id([A-z0-9]+)', authMiddleware, UserController.destroy.bind(this))
