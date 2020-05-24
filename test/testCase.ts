import Server from '../src/Server'
import MongoHelper from "../src/MongoHelper";

export function setup () {
  const server = new Server(9999)
  return server.start()
}

export function start () {
  return MongoHelper.connect()
}

export function stop () {
  return MongoHelper.close()
}

export function clean (): Promise<any> {
  return MongoHelper.truncate()
}
