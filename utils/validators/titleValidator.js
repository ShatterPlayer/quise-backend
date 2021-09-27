const { regexQuizTitle } = require('../regexes')
const { minQuizTitleChars, maxQuizTitleChars } = require('../constants')

module.exports = (req, res, next) => {
  const { title } = req.body

  if (title === undefined || !regexQuizTitle.test(title.trim())) {
    return res.status(400).send({
      message: `Quiz title must contain from ${minQuizTitleChars} to ${maxQuizTitleChars} letters and be alphanumeric`,
    })
  }

  next()
}
