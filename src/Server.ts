import * as http from "http";
import MongoHelper from './MongoHelper'
import { DEBUG } from './config'
import requestLoggerMiddleware from './middleware/request.logger.middleware'
import postRoutes from './routes/postRoutes'
import userRoutes from './routes/userRoutes'
import cors from 'cors'
import express, {NextFunction, Response, Request} from 'express'

export default class Server {
  private readonly port: number
  constructor (port: number) {
    this.port = port
  }

  start (): http.Server {
    // middlewares
    const app = express()
    app.use(express.json())
    app.use(cors())
    if (DEBUG) {
      app.use(requestLoggerMiddleware)
    }

    // routes
    app.use('/user', userRoutes)
    app.use('/post', postRoutes)
    app.use(function (err: Error,request: Request,response: Response, next: NextFunction) {{
      console.error(err.stack)
      response.status(401).json({
        type: 'error',
        message: 'Unauthorized',
        data: err.message
      })
    }
    })
    return app.listen(this.port, async () => {
      console.info(`Blog app listening on ${this.port}`)
      await MongoHelper.connect()
    })
  }
}
