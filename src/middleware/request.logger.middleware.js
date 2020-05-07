'use strict'
exports.__esModule = true
var requestLoggerMiddleware
exports.default = requestLoggerMiddleware = function (req, res, next) {
  console.info(req.method + ' ' + req.originalUrl)
  var start = new Date().getTime()
  res.on('finish', function () {
    var elapsed = new Date().getTime() - start
    console.info(req.method + ' ' + req.originalUrl + ' ' + res.statusCode + ' ' + elapsed + ' ms')
  })
  next()
}
