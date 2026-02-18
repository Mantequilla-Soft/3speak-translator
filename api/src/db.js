import { MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI
const DATABASE_NAME = process.env.DATABASE_NAME || 'threespeak'
const COLLECTION_NAME = process.env.COLLECTION_NAME || 'subtitles'

let client = null
let db = null

export async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is required')
  }

  client = new MongoClient(MONGODB_URI)
  await client.connect()
  db = client.db(DATABASE_NAME)

  console.log(`[subtitle-api] Connected to MongoDB (${DATABASE_NAME}/${COLLECTION_NAME})`)
  return db
}

export function getCollection() {
  if (!db) throw new Error('Database not connected')
  return db.collection(COLLECTION_NAME)
}
