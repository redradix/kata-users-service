const request = require('supertest')

const app = require('./api')

describe('Dummy test', () => {

  it('GET /', async () => {
    const res = await request(app).get('/')

    const { status, text } = res

    expect(status).toEqual(200)
    expect(JSON.parse(text)).toEqual({ message: 'aupa ahi' })
  })

})