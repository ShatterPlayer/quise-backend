const { regexCorrectAnswer } = require('../regexes')

module.exports = (req, res, next) => {
  const { answer } = req.query
  if (answer === undefined || !regexCorrectAnswer.test(answer)) {
    return res
      .status(400)
      .send({ message: 'Answer must be a number in specific range' })
  }
  next()
}
