"use strict";
exports.__esModule = true;
var express_1 = require("express");
var bodyparser = require("body-parser");
var request_logger_middleware_1 = require("./request.logger.middleware");
var app = express_1["default"]();
require("dotenv/config");
// middleware
app.use(bodyparser.json());
var DEBUG = process.env.DEBUG == 'true';
if (DEBUG) {
    app.use(request_logger_middleware_1["default"]);
}
exports["default"] = app;
