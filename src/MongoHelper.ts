import 'dotenv/config'
import mongoose from 'mongoose'
import { IN_TEST, MONGO_URI } from './config'
import UserRepository from './repository/UserRepository'
export default class MongoHelper {
  static async connect () {
    return await new Promise(async (resolve, reject) => {
      let uri
      if (IN_TEST) {
        const { MongoMemoryServer } = await import('mongodb-memory-server')
        const mongo = new MongoMemoryServer()
        uri = await mongo.getConnectionString()
      } else {
        uri = MONGO_URI
      }
      mongoose.set('useNewUrlParser', true)
      mongoose.set('useFindAndModify', false)
      mongoose.set('useCreateIndex', true)
      mongoose.set('useUnifiedTopology', true)
      try {
        console.log('trying to connect with uri %s', uri)
        await mongoose.connect(`${uri}`, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true
        })
        console.log(`MongoDB successfully connected to ${uri}`)
      } catch (e) {
        mongoose.connection.on('error', error => {
          reject(error)
        })
      }
    })
  }

  static close () {
    console.log('stoping db connection')
    return mongoose.disconnect()
  }

  static truncate () {
    return Promise.all([
      UserRepository.truncate()
    ])
  }
}
