const {
  regexCorrectAnswer,
  regexId,
  regexQuestionAnswer,
  regexQuestionNumber,
  regexQuestionText,
  regexQuizTitle,
  regexUsername,
} = require('./regexes')

const { maxQuestions, minQuestions, answersAmount } = require('./constants')

const titleValidator = (req, res, next) => {
  const { title } = req.body

  if (title === undefined || !regexQuizTitle.test(title)) {
    return res
      .status(400)
      .send({ message: 'Quiz title does not match the shape' })
  }

  next()
}

const questionsValidator = (req, res, next) => {
  const { questions } = req.body

  if (questions === undefined || !questions.forEach) {
    return res.status(400).send('Expected array parameter with questions')
  }

  if (
    questions.length === undefined ||
    questions.length > maxQuestions ||
    questions.length < minQuestions
  ) {
    return res
      .status(400)
      .send(
        `The quiz can consist of ${minQuestions} to ${maxQuestions} questions`
      )
  }

  questions.forEach(question => {
    if (question.text === undefined || question.answers === undefined) {
      return res.status(400).send('Question must contain text and answers')
    }

    if (!regexQuestionText.test(question.text)) {
      return res
        .status(400)
        .send('One of question texts does not match the shape')
    }

    if (
      question.answers.forEach === undefined ||
      question.answers.length !== answersAmount
    ) {
      return res
        .status(400)
        .send(
          `Question answers parameter must be an array of ${answersAmount} elements`
        )
    }

    question.answers.forEach(answer => {
      if (answer === undefined || !regexQuestionAnswer.test(answer)) {
        return res.status(400).send('One of answers does not match the shape')
      }
    })

    if (
      question.correctAnswer === undefined ||
      !regexCorrectAnswer.test(question.correctAnswer)
    ) {
      return res
        .status(400)
        .send('One of correct answers does not match the shape')
    }
  })

  next()
}

const quizIdValidator = (req, res, next) => {
  const { quizId } = req.query

  if (quizId === undefined || !regexId.test(quizId)) {
    return res
      .status(400)
      .send({ message: 'Id must be a string of 24 hex characters' })
  }

  next()
}

const usernameValidator = (req, res, next) => {
  const { username } = req.query
  if (username === undefined || !regexUsername.test(username)) {
    return res.status(400).send({
      message: 'Name must be alphanumeric and must consist of 3 to 20',
    })
  }
  next()
}

const answerValidator = (req, res, next) => {
  const { answer } = req.query
  if (answer === undefined || !regexCorrectAnswer.test(answer)) {
    return res.status(400).send('Answer must be a number in specific range')
  }
  next()
}

const questionNumberValidator = (req, res, next) => {
  const { questionNumber } = req.query
  if (
    questionNumber === undefined ||
    !regexQuestionNumber.test(questionNumber)
  ) {
    return res.status(400).send('Question number must be a number')
  }
  next()
}

module.exports = {
  titleValidator,
  questionsValidator,
  quizIdValidator,
  usernameValidator,
  answerValidator,
  questionNumberValidator,
}
