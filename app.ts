import express from 'express'
import * as bodyparser from 'body-parser'
import requestLoggerMiddleware from "./request.logger.middleware";
const app =  express()
import 'dotenv/config'

// middleware
app.use(bodyparser.json())
const DEBUG = process.env.DEBUG == 'true'
if (DEBUG) {
    app.use(requestLoggerMiddleware)
}
export default app

