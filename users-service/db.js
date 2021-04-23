const { MongoClient } = require('mongodb')

const URL = 'mongodb://db:27017'
const client = new MongoClient(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

async function connectDb(name = 'production') {
  try {
    await client.connect()
    return client.db(name)
  } catch (error) {
    console.log('Db => something went wrong', error)
    await client.close()
  }
}

module.exports = connectDb
