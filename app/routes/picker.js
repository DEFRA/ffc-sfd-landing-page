const { GET } = require('../constants/http-verbs')
const { USER } = require('ffc-auth/scopes')
const { serverConfig } = require('../config/index')

module.exports = [{
  method: GET,
  path: '/picker',
  options: { auth: { strategy: 'jwt', scope: [USER] } },
  handler: async (request, h) => {
    return h.redirect(`${serverConfig.gatewayHost}/auth/picker`)
  }
}]
