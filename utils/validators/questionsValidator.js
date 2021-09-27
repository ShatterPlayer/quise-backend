const { maxQuestions, minQuestions, answersAmount } = require('../constants')
const {
  regexCorrectAnswer,
  regexQuestionAnswer,
  regexQuestionText,
} = require('../regexes')

module.exports = (req, res, next) => {
  const { questions } = req.body

  if (questions === undefined || !questions.forEach) {
    return res
      .status(400)
      .send({ message: 'Expected array parameter with questions' })
  }

  if (
    questions.length === undefined ||
    questions.length > maxQuestions ||
    questions.length < minQuestions
  ) {
    return res.status(400).send({
      message: `The quiz can consist of ${minQuestions} to ${maxQuestions} questions`,
    })
  }

  questions.forEach(question => {
    if (question.text === undefined || question.answers === undefined) {
      return res
        .status(400)
        .send({ message: 'Question must contain text and answers' })
    }

    if (!regexQuestionText.test(question.text.trim())) {
      return res
        .status(400)
        .send({ message: 'One of question texts does not match the shape' })
    }

    if (
      question.answers.forEach === undefined ||
      question.answers.length !== answersAmount
    ) {
      return res.status(400).send({
        message: `Question answers parameter must be an array of ${answersAmount} elements`,
      })
    }

    question.answers.forEach(answer => {
      if (answer === undefined || !regexQuestionAnswer.test(answer.trim())) {
        return res
          .status(400)
          .send({ message: 'One of answers does not match the shape' })
      }
    })

    if (
      question.correctAnswer === undefined ||
      !regexCorrectAnswer.test(question.correctAnswer)
    ) {
      return res
        .status(400)
        .send({ message: 'One of correct answers does not match the shape' })
    }
  })
  if (!res.headersSent) {
    next()
  }
}
