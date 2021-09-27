const axios = require('axios').default
const getIP = require('../getIP')
const querystring = require('querystring')

module.exports = (req, res, next) => {
  let reCaptchaToken = ''
  if (req.method === 'POST') {
    reCaptchaToken = req.body.reCaptchaToken
  } else if (req.method === 'GET') {
    reCaptchaToken = req.query.reCaptchaToken
  }

  const reCaptchaPayload = {
    secret: process.env.RECAPTCHA_SECRET,
    response: reCaptchaToken,
  }
  const IP = getIP(req)

  if (IP) {
    reCaptchaPayload.remoteip = IP
  }

  axios
    .post(
      'https://www.google.com/recaptcha/api/siteverify',
      querystring.stringify(reCaptchaPayload)
    )
    .then(({ data }) => {
      if (data.success) {
        return next()
      } else {
        throw new Error()
      }
    })
    .catch(() => {
      return res.status(403).send({ message: 'ReCAPTCHA validation failed' })
    })
}
