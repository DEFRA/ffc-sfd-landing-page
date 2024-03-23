const Wreck = require('@hapi/wreck')
const { GET } = require('../constants/http-verbs')
const { SFD_VIEW } = require('ffc-auth/scopes')
const { serverConfig } = require('../config')
const { AUTH_COOKIE_NAME } = require('../constants/cookies')

module.exports = [{
  method: GET,
  path: '/home',
  options: { auth: { strategy: 'jwt', scope: [SFD_VIEW] } },
  handler: async (request, h) => {
    const person = await getPerson(request)
    const organisation = await getOrganisation(request)
    return h.view('home', { person, organisation, ahwpHost: serverConfig.ahwpHost })
  }
}]

const getPerson = async (request) => {
  const query = `query {
          person {
            crn
            title
            fullName
            landline
            mobile
            email
            address {
              fullAddress
            }
            doNotContact
            locked
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
  return payload.data.person
}

const getOrganisation = async (request) => {
  const query = `query {
          organisation(organisationId: ${request.auth.credentials.organisationId}) {
            sbi
            name
            mobile
            email
            address {
              fullAddress
            }
            type
            legalStatus
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
  return payload.data.organisation
}
