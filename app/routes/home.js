const Wreck = require('@hapi/wreck')
const { GET } = require('../constants/http-verbs')
const { USER } = require('ffc-auth/scopes')
const { serverConfig } = require('../config')
const { AUTH_COOKIE_NAME } = require('../constants/cookies')

module.exports = [{
  method: GET,
  path: '/home',
  options: { auth: { strategy: 'jwt', scope: [USER] } },
  handler: async (request, h) => {
    const query = `query {
          personOrganisations {
            crn
            organisations {
              id
              sbi
              name
            }
          }
        }`
    const { payload } = await Wreck.post(serverConfig.dataHost, {
      headers: {
        crn: request.auth.credentials.crn,
        Authorization: request.state[AUTH_COOKIE_NAME],
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({ query }),
      json: true
    })
    return h.view('home', { organisations: payload.data.personOrganisations.organisations, ahwpHost: serverConfig.ahwpHost })
  }
}]
