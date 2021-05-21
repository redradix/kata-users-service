const { makeApp } = require('./app')
const { connect } = require('./db')

async function main() {
  const connection = await connect()
  const app = makeApp(connection)

  app.listen(3000, () => {
    console.log('Server running...')
  })
}

main().catch(err => {
  console.error(err)
})
