const request = require('supertest')

const app = require('./api')
const getDb = require('./db')


describe('Dummy test', () => {

  afterEach(async () => {
    const db = await getDb('production')
    db.collection('users').removeMany({})
  })

  it('GET /', async () => {
    const res = await request(app).get('/')

    const { status, text } = res

    expect(status).toEqual(200)
    expect(JSON.parse(text)).toEqual({ message: 'aupa ahi' })
  })

  describe('POST /users', () => {
    it('Returns 200 if everything goes ok', async () => {
      const payload = {
        username: 'Aaron',
        email: 'aaron@redradix.com',
        password: 'mypassword'
      }
      const res = await request(app).post('/users').send(payload)
      const { status, text } = res
      const body = JSON.parse(text)

      expect(status).toEqual(200)
      expect(body).toHaveProperty('message', 'user created' )
      expect(body).toHaveProperty('id')
    })
  })

})
