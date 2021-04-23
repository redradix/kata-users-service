const express = require('express')
const bodyParser = require('body-parser')
const UserRepository = require('./repository/user')

const App = (db) => {
  const userRepository = UserRepository(db)

  const app = express()
  app.use(bodyParser.json())

  app.get('/', (req, res) => {
    return res.json({ message: 'aupa ahi' })
  })

  app.get('/samples', async (req, res) => {
    console.log('GET /samples')

    const cursor = db.collection('samples').find()
    const items = await cursor.toArray()
    return res.json({ items })
  })

  app.post('/samples', async (req, res) => {
    console.log('POST /samples', req.body)

    const {
      insertedCount,
      insertedId,
      result
    } = await db.collection('samples').insertOne(req.body)
    return res.json({ insertedCount, insertedId, result })
  })

  app.delete('/samples', async (req, res) => {
    console.log('DELETE /samples')

    const { deletedCount, result } = await db.collection('samples').deleteMany({})

    return res.json({ deletedCount, result })
  })

  app.post('/users', async (req, res) => {
    console.log('POST /users', req.body)


    const errors = []

    if (!req.body.password || typeof req.body.password !== 'string' || req.body.password.length < 8) {
      errors.push('password must have 8 or more characters')
    }

    if (!req.body.email || typeof req.body.email !== 'string' || !req.body.email.includes('@') || !req.body.email.includes('.')) {
      errors.push('email not valid')
    }

    if (errors.length) {
      return res.status(400).json({ errors })
    }

    const isUsernameAlreadyUsed = await userRepository.getUserByUsername(req.body.username)
    if (isUsernameAlreadyUsed) {
      return res.status(400).json({ errors: ['username already in use'] })
    }

    const { insertedId } = await userRepository.create(req.body)
    return res.json({ message: 'user created', id: insertedId })
  })

  return app
}

module.exports = App
