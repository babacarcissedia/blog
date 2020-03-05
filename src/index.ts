import express from 'express'
import * as bodyparser from 'body-parser'
import requestLoggerMiddleware from "./middleware/request.logger.middleware";
import MongoHelper from "./MongoHelper";
import userRoutes from './routes/userRoutes'
import 'dotenv/config'

const {DATABASE_URL, PORT=4000} = process.env


const app =  express()

const DEBUG = process.env.DEBUG == 'true'
if (DEBUG) {
    app.use(requestLoggerMiddleware)
}
// middlewares
app.use(bodyparser.json())

// routes
app.use('/user', userRoutes)

MongoHelper.listen(PORT,  async () => {
    console.info(`Blog app listening on ${PORT}`)
    try {
        await MongoHelper.connect(`${DATABASE_URL}`)
        console.info('Connect to mongo')
    } catch (e) {
        console.log(e)
    }
})