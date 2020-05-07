import 'dotenv/config'
import { DEBUG, PORT } from './config'
import requestLoggerMiddleware from './middleware/request.logger.middleware'
import MongoHelper from './MongoHelper'
import postRoutes from './routes/postRoutes'
import userRoutes from './routes/userRoutes'
import cors from 'cors'
import express from 'express'
const app = express()

// middlewares
app.use(express.json())
app.use(cors())
if (DEBUG) {
  app.use(requestLoggerMiddleware)
}

// routes
app.use('/user', userRoutes)
app.use('/post', postRoutes)

export default async function start () {
  return app.listen(PORT, async () => {
    console.info(`Blog app listening on ${PORT}`)
    try {
      await MongoHelper.connect()
    }catch (e) {
      console.log(e)
    }
  })
}
start();
