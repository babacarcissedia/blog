"use strict";
exports.__esModule = true;
var mongoose = require("mongoose");
var MongoHelper = /** @class */ (function () {
    function MongoHelper() {
    }
    MongoHelper.connect = function (uri) {
        return new Promise(function (resolve, reject) {
            mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, function (error) {
                if (error) {
                    reject(error);
                }
            }).then(function () { return console.info('Connect to Mongo'); });
        });
    };
    return MongoHelper;
}());
exports["default"] = MongoHelper;
