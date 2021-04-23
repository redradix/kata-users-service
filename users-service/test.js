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

    it('Cannot create users with the same username', async () => {
      const payload = {
        username: 'Aaron',
        email: 'aaron@redradix.com',
        password: 'mypassword'
      }
      await request(app).post('/users').send(payload)
      const res = await request(app).post('/users').send(payload)

      const { status, text } = res
      const body = JSON.parse(text)

      expect(status).toEqual(400)
      expect(body).toHaveProperty('errors')
      expect(body.errors).toHaveLength(1)
      expect(body.errors[0]).toBe('username already in use')
    })

    it('Cannot create users with passwords shorter than 8 characters', async () => {
      const payload = {
        username: 'Aaron',
        email: 'aaron@redradix.com',
        password: '123'
      }
      const res = await request(app).post('/users').send(payload)

      const { status, text } = res
      const body = JSON.parse(text)

      expect(status).toEqual(400)
      expect(body).toHaveProperty('errors')
      expect(body.errors).toHaveLength(1)
      expect(body.errors[0]).toBe('password must have 8 or more characters')
    })

    it('Cannot create users with an invalid email', async () => {
      const payload = {
        username: 'Aaron',
        email: 'aaron',
        password: 'mypassword'
      }
      await request(app).post('/users').send(payload)
      const res = await request(app).post('/users').send(payload)

      const { status, text } = res
      const body = JSON.parse(text)

      expect(status).toEqual(400)
      expect(body).toHaveProperty('errors')
      expect(body.errors).toHaveLength(1)
      expect(body.errors[0]).toBe('email not valid')
    })

    it('Response includes all validation errors', async () => {
      const payload = {
        username: 'Aaron',
        email: 'aaron',
        password: '123'
      }
      await request(app).post('/users').send(payload)
      const res = await request(app).post('/users').send(payload)

      const { status, text } = res
      const body = JSON.parse(text)

      expect(status).toEqual(400)
      expect(body).toHaveProperty('errors')
      expect(body.errors).toHaveLength(2)
      expect(body.errors).toEqual(
        expect.arrayContaining([
          'password must have 8 or more characters',
          'email not valid'
        ])
      )
    })
  })

})
