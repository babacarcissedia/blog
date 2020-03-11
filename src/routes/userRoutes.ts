import UserController from '../controller/UserController'
import express = require('express');

export default express.Router()
    .get('/', UserController.index.bind(this))
    .post('/', UserController.store.bind(this))
    .get('/id([A-z0-9]+)', UserController.show.bind(this))
    .put('/id([A-z0-9]+)', UserController.update.bind(this))
    .delete('/id([A-z0-9]+)', UserController.destroy.bind(this))



