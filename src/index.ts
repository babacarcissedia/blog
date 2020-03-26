
import * as bodyparser from 'body-parser'
import requestLoggerMiddleware from "./middleware/request.logger.middleware"
import MongoHelper from "./MongoHelper"
import userRoutes from './routes/userRoutes'
import postRoutes from "./routes/postRoutes";
import 'dotenv/config'

const {DATABASE_URL, PORT=4000} = process.env

const express = require('express')
const app =  express()

const DEBUG = process.env.DEBUG == 'true'
if (DEBUG) {
    app.use(requestLoggerMiddleware)
}
// middlewares
app.use(bodyparser.json())

// routes
app.use('/user', userRoutes)
app.use('/post',postRoutes)
app.listen(PORT,  async () => {
    console.info(`Blog app listening on ${PORT}`)
    try {
        await MongoHelper.connect(`${DATABASE_URL}`)
    }
    catch (e) {
        console.error(e)
    }


})
