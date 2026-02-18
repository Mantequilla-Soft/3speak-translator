import express from 'express'
import cors from 'cors'
import { connectDB, getCollection } from './db.js'

const app = express()
const PORT = process.env.API_PORT || 3300

app.use(cors())

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.get('/subtitles/:author/:permlink', async (req, res) => {
  try {
    const { author, permlink } = req.params
    const doc = await getCollection().findOne({ author, permlink })

    if (!doc || !doc.subtitles || Object.keys(doc.subtitles).length === 0) {
      return res.status(404).json({ error: 'No subtitles found' })
    }

    const result = Object.entries(doc.subtitles).map(([lang, cid]) => ({ lang, cid }))
    res.json(result)
  } catch (err) {
    console.error('[subtitle-api] Error:', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

async function start() {
  await connectDB()

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[subtitle-api] Listening on port ${PORT}`)
  })
}

start().catch(err => {
  console.error('[subtitle-api] Failed to start:', err)
  process.exit(1)
})
