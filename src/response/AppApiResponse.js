"use strict";
exports.__esModule = true;
var AppApiResponse = /** @class */ (function () {
    function AppApiResponse(data, type, message) {
        this.type = type;
        this.message = message;
        this.data = data;
    }
    AppApiResponse.prototype.getData = function () {
        return this.data;
    };
    AppApiResponse.prototype.getType = function () {
        return this.type;
    };
    AppApiResponse.prototype.getMessage = function () {
        return this.message;
    };
    AppApiResponse.prototype.toString = function () {
        return JSON.stringify({
            type: this.type,
            message: this.message,
            data: this.data
        });
    };
    AppApiResponse.prototype.isSuccess = function () {
        return this.type === AppApiResponse.TYPE_SUCCESS;
    };
    AppApiResponse.from = function (object) {
        return new AppApiResponse(object.data, object.type, object.message);
    };
    AppApiResponse.TYPE_SUCCESS = 'success';
    AppApiResponse.TYPE_ERROR = 'error';
    return AppApiResponse;
}());
exports["default"] = AppApiResponse;
