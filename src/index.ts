import 'dotenv/config'
import { DEBUG, PORT } from './config'
import requestLoggerMiddleware from './middleware/request.logger.middleware'
import MongoHelper from './MongoHelper'
import mongoose from 'mongoose'
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

/*export default async function start () {
  await MongoHelper.connect()
  return app.listen(PORT, async () => {
    console.info(`Blog app listening on ${PORT}`)
  })
}*/

app.listen(PORT,  async () => {
  console.info(`Blog app listening on ${PORT}`)
  try {
    await mongoose.connect(`${process.env.MONGO_URI}`, {useNewUrlParser: true, useUnifiedTopology: true})
    console.log('Connected to Mongo')
  } catch (e) {
    console.error(e)
  }
})
