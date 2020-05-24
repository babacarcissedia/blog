import 'module-alias/register';
import { PORT } from './config'
import Server from './Server'

const server = new Server(PORT)
server.start()
