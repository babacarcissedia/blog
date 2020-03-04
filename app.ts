import express from 'express'
import * as bodyparser from 'body-parser'
import requestLoggerMiddleware from "./request.logger.middleware";
const app =  express()

// middleware
app.use(bodyparser.json())
app.use(requestLoggerMiddleware)
export default app

