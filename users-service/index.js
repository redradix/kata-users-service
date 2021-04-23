const App = require('./api')

const main = async () => {
  const app = App()

  app.listen(3000, () => {
    console.log('Server running...')
  })
}

main()
