const jwt = require('jsonwebtoken')
const { regexCorrectAnswer, regexQuestionNumber } = require('../utils/regexes')

module.exports = (req, res, next) => {
  try {
    req.decodedToken = jwt.verify(req.cookies.JWT, process.env.SECRET)

    if (!regexCorrectAnswer.test(req.query.answer)) {
      const error = new Error("Invalid 'answer' parameter")
      error.code = 400
      throw error
    }

    if (!regexQuestionNumber.test(req.query.questionNumber)) {
      const error = new Error("Invalid 'questionNumber' parameter")
      error.code = 400
      throw error
    }
    next()
  } catch (e) {
    if (e.name === 'JsonWebTokenError') {
      return res.status(400).send({ message: 'Invalid token' })
    }
    return res.status(e.code).send({ message: e.message })
  }
}
