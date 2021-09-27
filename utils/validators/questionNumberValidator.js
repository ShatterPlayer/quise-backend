const { regexQuestionNumber } = require('../regexes')

module.exports = (req, res, next) => {
  const { questionNumber } = req.query
  if (
    questionNumber === undefined ||
    !regexQuestionNumber.test(questionNumber)
  ) {
    return res.status(400).send({ message: 'Question number must be a number' })
  }
  next()
}
