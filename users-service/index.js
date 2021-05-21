const { makeApp } = require('./app')
const { connect } = require('./db')
const createUsersService = require('./users')

async function main() {
  const connection = await connect()
  const usersService = createUsersService(connection)
  const app = makeApp(usersService)

  app.listen(3000, () => {
    console.log('Server running...')
  })
}

main().catch(err => {
  console.error(err)
})
