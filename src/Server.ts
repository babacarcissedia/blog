import cors from 'cors'
import express from 'express'
import * as http from "http";
import { DEBUG } from './config'
import Database from './Database'
import errorMiddleware from './middleware/error.middleware'
import requestLoggerMiddleware from './middleware/request.logger.middleware'
import postRoutes from './routes/postRoutes'
import userRoutes from './routes/userRoutes'

export default class Server {
  private readonly port: number
  private readonly database: Database
  private instance: any

  constructor (port: number, database: Database) {
    this.port = port
    this.database = database
  }

  async start (): Promise<http.Server> {
    await this.database.connect()
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

    this.instance = await app.listen(this.port, async () => {
      console.info(`Blog app listening on ${this.port}`)
    })
    return this.instance
  }

  async end () {
    return Promise.all([
      this.database.close(),
      this.instance.close()
    ])
  }
}
