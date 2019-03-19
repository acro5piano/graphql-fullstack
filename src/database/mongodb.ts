import { MongoClient, Db } from 'mongodb'
import uuid from 'uuid'

// Connection URL
const url = 'mongodb://127.0.0.1:27017'

// Database Name
const dbName = 'local'

// Create a new MongoClient
const client = new MongoClient(url, { useNewUrlParser: true })

export let db: Db

// Use connect method to connect to the Server
export async function init() {
  await client.connect()
  console.log('[mongodb] Connected successfully to server')

  db = client.db(dbName)

  process.on('exit', terminate)
}

/*
 * For testing.
 */
export async function changeDBToRandomName() {
  db = client.db(uuid())
}

export function terminate() {
  return client.close()
}
