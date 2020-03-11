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
var AppException = /** @class */ (function (_super) {
    __extends(AppException, _super);
    function AppException(_a) {
        var _b = _a.data, data = _b === void 0 ? {} : _b, _c = _a.message, message = _c === void 0 ? '' : _c, _d = _a.status, status = _d === void 0 ? 400 : _d;
        var _this = _super.call(this, message) || this;
        _this.data = data;
        _this.status = status;
        _this.message = message || 'Something went wrong';
        return _this;
    }
    return AppException;
}(Error));
exports["default"] = AppException;
