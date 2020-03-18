import mongoose = require("mongoose")
export default class MongoHelper {

   public static connect(uri: string) {
       mongoose.connect(uri, { useNewUrlParser: true,  useUnifiedTopology: true, useCreateIndex: true})
           .then(() => {
               console.log('connected')
           })
           .catch(err => {
               console.log('rejected promise: '+err)
               mongoose.disconnect()
           })
       mongoose.connection.on('error', err => {
           console.log('mongoose connection error: '+err)
       })

   }
}
