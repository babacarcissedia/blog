import Server from '../src/Server'
import Database from "../src/Database";

export function setup (database) {
  const server = new Server(9999, database)
  return server.start()
}

export function startDatabase () {
  return new Database()
}
