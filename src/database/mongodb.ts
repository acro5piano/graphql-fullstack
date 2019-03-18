import { MongoClient, Db } from 'mongodb'

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

export function terminate() {
  return client.close()
}
