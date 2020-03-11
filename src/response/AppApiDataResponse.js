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
var AppApiResponse_1 = require("./AppApiResponse");
var AppApiDataResponse = /** @class */ (function (_super) {
    __extends(AppApiDataResponse, _super);
    function AppApiDataResponse(data, type) {
        if (type === void 0) { type = AppApiResponse_1["default"].TYPE_SUCCESS; }
        return _super.call(this, data, type, '') || this;
    }
    return AppApiDataResponse;
}(AppApiResponse_1["default"]));
exports["default"] = AppApiDataResponse;
