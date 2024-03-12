const Wreck = require('@hapi/wreck')
const { GET } = require('../constants/http-verbs')
const { USER } = require('ffc-auth/scopes')
const { serverConfig } = require('../config')

module.exports = [{
  method: GET,
  path: '/home',
  options: { auth: { strategy: 'jwt', scope: [USER] } },
  handler: async (request, h) => {
    console.log('Retrieving data')
    const defraIdToken = request.state.ffc_sfd_auth_token
    const crn = request.auth.credentials.crn
    const query = `query {
          customerBusinesses {
            crn
            businesses {
              id
              sbi
              name
            }
          }
        }`
    try {
      const { payload } = await Wreck.post(serverConfig.dataHost, {
        headers: {
          crn,
          Authorization: defraIdToken,
          'Content-Type': 'application/json'
        },
        payload: JSON.stringify({ query }),
        json: true
      })
      return h.view('home', { customerBusinesses: payload.data.customerBusinesses })
    } catch (error) {
      console.log(error)
      return h.view('500').code(500).takeover()
    }
  }
}]
