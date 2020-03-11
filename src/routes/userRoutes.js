"use strict";
exports.__esModule = true;
var UserController_1 = require("../controller/UserController");
var express = require("express");
exports["default"] = express.Router()
    .get('/', UserController_1["default"].index.bind(this))
    .post('/', UserController_1["default"].store.bind(this))
    .get('/id([A-z0-9]+)', UserController_1["default"].show.bind(this))
    .put('/id([A-z0-9]+)', UserController_1["default"].update.bind(this))["delete"]('/id([A-z0-9]+)', UserController_1["default"].destroy.bind(this));
