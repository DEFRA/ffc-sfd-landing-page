const { refreshToken } = require('ffc-auth')

module.exports = {
  plugin: {
    name: 'auth-refresh',
    register: (server, options) => {
      server.ext('onPreAuth', (request, h) => {
        return refreshToken(request, h)
      })
    }
  }
}
