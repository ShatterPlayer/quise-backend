const { regexUsername } = require('../regexes')

module.exports = (req, res, next) => {
  const { username } = req.query
  if (username === undefined || !regexUsername.test(username.trim())) {
    return res.status(400).send({
      message: 'Name must be alphanumeric and must consist of 3 to 20',
    })
  }
  next()
}
