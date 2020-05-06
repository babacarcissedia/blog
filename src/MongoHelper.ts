import 'dotenv/config'
import mongoose from "mongoose"
import { IN_TEST, MONGO_URI } from "./config";
export default class MongoHelper {

   public static async connect() {
     return new Promise(async (resolve, reject) => {
       let uri
       if (IN_TEST) {
         const { MongoMemoryServer } = await import('mongodb-memory-server');
         const mongo = new MongoMemoryServer();
         uri = await mongo.getConnectionString();
       } else {
         uri = MONGO_URI
       }
       mongoose.set('useNewUrlParser', true);
       mongoose.set('useFindAndModify', false);
       mongoose.set('useCreateIndex', true);
       mongoose.set('useUnifiedTopology', true);
       await mongoose.connect(uri, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
         useCreateIndex: true
       })
      /* mongoose.connection.on('error', error => {
         reject(error)
       })
       mongoose.connection.once('open', () => {
         console.log(`MongoDB successfully connected to ${uri}`)
       })*/
     })
   }

   static close () {
     return mongoose.disconnect();
     // mongoose.connection.db.dropDatabase(function(error, result) {
     //   if (error) {
     //     reject(error)
     //   }
     //   console.log('cleared database')
     //   resolve(true)
     // })
   }
}
