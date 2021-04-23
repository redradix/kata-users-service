const express = require('express')
const bodyParser = require('body-parser')

const getDb = require('./db')

const app = express()
app.use(bodyParser.json())

app.get('/', (req, res) => {
  return res.json({ message: 'aupa ahi' })
})

app.get('/samples', async (req, res) => {
  console.log('GET /samples')

  const db = await getDb()
  const cursor = db.collection('samples').find()
  const items = await cursor.toArray()
  return res.json({ items })
})

app.post('/samples', async (req, res) => {
  console.log('POST /samples', req.body)

  const db = await getDb()
  const {
    insertedCount,
    insertedId,
    result
  } = await db.collection('samples').insertOne(req.body)
  return res.json({ insertedCount, insertedId, result })
})

app.delete('/samples', async (req, res) => {
  console.log('DELETE /samples')

  const db = await getDb()
  const { deletedCount, result } = await db.collection('samples').deleteMany({})

  return res.json({ deletedCount, result })
})

app.post('/users', async (req, res) => {
  console.log('POST /users', req.body)

  const db = await getDb()

  if (!req.body.password || typeof req.body.password !== 'string' || req.body.password.length < 8) {
    return res.status(400).json({ errors: ['password must have 8 or more characters'] })
  }

  const isUsernameAlreadyUsed = await db.collection('users').findOne({ username: req.body.username })
  if (isUsernameAlreadyUsed) {
    return res.status(400).json({ errors: ['username already in use'] })
  }

  const { insertedId } = await db.collection('users').insertOne(req.body)
  return res.json({ message: 'user created', id: insertedId })
})

module.exports = app
