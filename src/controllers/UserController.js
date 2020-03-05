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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var Controller_1 = require("./Controller");
var User_1 = require("../api/user/User");
var AppApiDataResponse_1 = require("../response/AppApiDataResponse");
var AppApiSuccessResponse_1 = require("../response/AppApiSuccessResponse");
var AppApiResponse_1 = require("../response/AppApiResponse");
var UserNotFoundException_1 = require("../exception/UserNotFoundException");
var UserController = /** @class */ (function (_super) {
    __extends(UserController, _super);
    function UserController() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // Add new user
    UserController.prototype.store = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var newUser, user, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newUser = new User_1["default"](req.body);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, newUser.save()];
                    case 2:
                        user = _a.sent();
                        res.json(new AppApiSuccessResponse_1["default"](user, "User " + user.first_name + " created"));
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        res.status(500).json(new AppApiResponse_1["default"](error_1, AppApiResponse_1["default"].TYPE_ERROR, error_1.message));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Get all users
    UserController.prototype.index = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var users, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, User_1["default"].find({})];
                    case 1:
                        users = _a.sent();
                        res.json(new AppApiDataResponse_1["default"](users));
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        res.status(500).json(new AppApiResponse_1["default"](error_2, AppApiResponse_1["default"].TYPE_ERROR, error_2.message));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Show User
    UserController.prototype.show = function (req, res) {
        var _this = this;
        var id = req.params.id;
        User_1["default"].findById(id)
            .then(function (user) {
            if (user) {
                res.json(new AppApiDataResponse_1["default"](user));
            }
            else {
                throw new UserNotFoundException_1["default"](id);
            }
        })["catch"](function (error) { return _this.handleErrors(error, res); });
    };
    // update User
    UserController.prototype.update = function (request, response, next) {
        var _this = this;
        var id = request.params.id;
        var data = { first_name: request.body.first_name, last_name: request.body.last_name, email: request.body.email };
        User_1["default"].findByIdAndUpdate(id, data, { "new": false })
            .then(function (user) {
            if (user) {
                response.send(new AppApiSuccessResponse_1["default"](user, "User " + user.first_name + " updated."));
            }
            else {
                next(new UserNotFoundException_1["default"](id));
            }
        })["catch"](function (error) { return _this.handleErrors(error, response); });
    };
    UserController.prototype.destroy = function (request, response, next) {
        var _this = this;
        var id = request.params.id;
        User_1["default"].findByIdAndDelete(id)
            .then(function (user) {
            if (user) {
                response.json(new AppApiSuccessResponse_1["default"](user, "User " + id + " deleted."));
            }
            else {
                next(new UserNotFoundException_1["default"](id));
            }
        })["catch"](function (error) { return _this.handleErrors(error, response); });
    };
    return UserController;
}(Controller_1["default"]));
exports["default"] = UserController;
