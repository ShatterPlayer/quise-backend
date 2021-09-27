const { regexId } = require('../regexes')

module.exports = (req, res, next) => {
  const { quizId } = req.query

  if (quizId === undefined || !regexId.test(quizId)) {
    return res
      .status(400)
      .send({ message: 'Id must be a string of 24 hex characters' })
  }

  next()
}
