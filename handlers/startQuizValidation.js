const { regexUsername, regexId } = require('../utils/regexes')

module.exports = (req, res, next) => {
  try {
    const { username, quizId } = req.query
    if (!regexUsername.test(username)) {
      const error = new Error(
        'Name must be alphanumeric and must consist of 3 to 20'
      )
      error.code = 400
      throw error
    }

    if (!regexId.test(quizId)) {
      const error = new Error('Id must be a string of 24 hex characters')
      error.code = 400
      throw error
    }

    next()
  } catch (e) {
    return res.status(e.code).send({ message: e.message })
  }
}
