const {
  answersAmount,
  maxQuestions,
  minQuestions,
} = require('../utils/constants')
const {
  regexQuestionText,
  regexQuestionAnswer,
  regexCorrectAnswer,
  regexQuizTitle,
} = require('../utils/regexes')

module.exports = (req, res, next) => {
  try {
    const { questions, title } = req.body
    if (!title) {
      const error = new Error('Expected title of the quiz')
      error.code = 400
      throw error
    }

    if (!regexQuizTitle.test(title)) {
      const error = new Error('Quiz title does not match the shape')
      error.code = 400
      throw error
    }

    if (!questions || !questions.forEach) {
      const error = new Error('Expected array of questions')
      error.code = 400
      throw error
    }

    if (
      !questions.length ||
      questions.length > maxQuestions ||
      questions.length < minQuestions
    ) {
      const error = new Error(
        `The quiz can consist of ${minQuestions} to ${maxQuestions} questions`
      )
      error.code = 400
      throw error
    }

    questions.forEach(question => {
      if (!question.text || !question.answers) {
        const error = new Error('Question must contain text and answers')
        error.code = 400
        throw error
      }

      if (!regexQuestionText.test(question.text)) {
        const error = new Error('One of question text does not match the shape')
        error.code = 400
        throw error
      }

      if (
        !question.answers.forEach ||
        question.answers.length !== answersAmount
      ) {
        const error = new Error(
          `Question answers parameter must be an array of ${answersAmount} elements`
        )
        error.code = 400
        throw error
      }

      question.answers.forEach(answer => {
        if (!regexQuestionAnswer.test(answer)) {
          const error = new Error('One of answers does not match the shape')
          error.code = 400
          throw error
        }
      })

      if (!regexCorrectAnswer.test(question.correctAnswer)) {
        const error = new Error(
          'One of correct answers does not match the shape'
        )
        error.code = 400
        throw error
      }
    })

    next()
  } catch (e) {
    return res.status(e.code).send({ message: e.message })
  }
}
