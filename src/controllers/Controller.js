"use strict";
exports.__esModule = true;
var AppApiResponse_1 = require("../response/AppApiResponse");
var AppError_1 = require("../app/AppError");
var Controller = /** @class */ (function () {
    function Controller() {
    }
    Controller.prototype.handleErrors = function (error, response) {
        if (error instanceof AppError_1["default"]) {
            response.status(error.getStatusCode())
                .json(new AppApiResponse_1["default"](error, AppApiResponse_1["default"].TYPE_ERROR, error.message));
        }
        else {
            response.status(500)
                .json(new AppApiResponse_1["default"](error, AppApiResponse_1["default"].TYPE_ERROR, error.message));
        }
    };
    return Controller;
}());
exports["default"] = Controller;
