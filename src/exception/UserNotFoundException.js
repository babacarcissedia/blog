"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var AppError_1 = require("../app/AppError");
var UserNotFoundException = /** @class */ (function (_super) {
    __extends(UserNotFoundException, _super);
    function UserNotFoundException(id) {
        return _super.call(this, "No user found with id " + id, 404) || this;
    }
    return UserNotFoundException;
}(AppError_1["default"]));
exports["default"] = UserNotFoundException;
