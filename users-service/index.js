const App = require('./api')
const connectDb = require('./db')

const main = async () => {
  const dbConnection = await connectDb()
  const app = App(dbConnection)

  app.listen(3000, () => {
    console.log('Server running...')
  })
}

main()
