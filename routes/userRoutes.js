"use strict";
exports.__esModule = true;
// routes/userRoutes.ts
var express_1 = require("express");
var UserController_1 = require("../src/controllers/UserController");
var userController = new UserController_1["default"]();
exports["default"] = express_1["default"].Router()
    .get('/', userController.index.bind(this))
    .post('/', userController.store.bind(this))
    .get('/id([A-z0-9]+)', userController.show.bind(this))
    .put('/id([A-z0-9]+)', userController.update.bind(this))["delete"]('/id([A-z0-9]+)', userController.destroy.bind(this));
