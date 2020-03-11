import * as mongoose from 'mongoose'
export default class MongoHelper {
   public static connect(uri: string) {
        return new Promise((resolve, reject) => {
            mongoose.connect(uri, { useNewUrlParser: true,  useUnifiedTopology: true }, (error: any) => {
                if (error) {
                    reject(error)
                }
            }).then(() => console.info('Connect to Mongo'))
        })
    }
}
