import * as http from "http";
import MongoHelper from './MongoHelper'
import { DEBUG } from './config'
import requestLoggerMiddleware from './middleware/request.logger.middleware'
import errorMiddleware from './middleware/error.middleware'
import postRoutes from './routes/postRoutes'
import userRoutes from './routes/userRoutes'
import cors from 'cors'
import express from 'express'

export default class Server {
  private readonly port: number
  constructor(port: number) {
    this.port = port
  }

  start(): http.Server {
    const app = express()
    app.use(express.json())
    app.use(cors())
    if (DEBUG) {
      app.use(requestLoggerMiddleware)
    }

    // routes
    app.use('/user', userRoutes)
    app.use('/post', postRoutes)

    // *** THIS MIDDLEWARE SHOULD ALWAYS BE CALLED AT LAST ***
    app.use(errorMiddleware)

    return app.listen(this.port, async () => {
      console.info(`Blog app listening on ${this.port}`)
      await MongoHelper.connect()
    })
  }
}
