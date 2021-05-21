const { MongoClient } = require('mongodb')

const URL = 'mongodb://db:27017'

async function connect() {
  const client = new MongoClient(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

  await client.connect()

  function getDb(name = 'production') {
    return client.db(name)
  }

  async function close() {
      await client.close()
  }

  return {
    getDb,
    close,
  }
}

module.exports = {
  connect
}
