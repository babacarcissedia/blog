import app from './app'
import * as http from  'http'
import 'dotenv/config'
import MongoHelper from "./server";

const PORT = 4000
const server = http.createServer(app)
server.listen(PORT,  async () => {
    console.info(`Blog app listening on ${PORT}`)
    try {
        await MongoHelper.connect(`${process.env.DATABASE_URL}`)
        console.info('Connect to mongo')
    } catch (e) {
        console.log(e)
    }
}
)
