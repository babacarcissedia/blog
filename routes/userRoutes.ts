// routes/userRoutes.ts
import * as express from 'express'
import UserController from '../src/controllers/UserController'
const userController = new UserController()
export default express.Router()
    .get('/', userController.index.bind(this))
    .post('/', userController.store.bind(this))
    .get('/id([A-z0-9]+)', userController.show.bind(this))
    .put('/id([A-z0-9]+)', userController.update.bind(this))
    .delete('/id([A-z0-9]+)', userController.destroy.bind(this))



