import startServer from '../src/index'
import MongoHelper from "../src/MongoHelper";

export function setup () {
  return startServer()
}

export function clean (): Promise<any> {
  return MongoHelper.close()
}
