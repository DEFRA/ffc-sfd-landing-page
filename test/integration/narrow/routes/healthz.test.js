const { createServer } = require('../../../../app/server')

describe('Healthz test', () => {
  let server

  beforeEach(async () => {
    server = await createServer()
    await server.start()
  })

  afterEach(async () => {
    await server.stop()
  })

  test('GET /healthz route returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/landing-page/healthz'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  afterEach(async () => {
    await server.stop()
  })
})
