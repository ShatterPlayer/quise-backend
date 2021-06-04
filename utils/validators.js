const axios = require('axios').default
const querystring = require('querystring')
const {
  regexCorrectAnswer,
  regexId,
  regexQuestionAnswer,
  regexQuestionNumber,
  regexQuestionText,
  regexQuizTitle,
  regexUsername,
} = require('./regexes')

const { minQuizTitleChars, maxQuizTitleChars } = require('./constants')

const { maxQuestions, minQuestions, answersAmount } = require('./constants')

const titleValidator = (req, res, next) => {
  const { title } = req.body

  if (title === undefined || !regexQuizTitle.test(title.trim())) {
    return res.status(400).send({
      message: `Quiz title must contain from ${minQuizTitleChars} to ${maxQuizTitleChars} letters and be alphanumeric`,
    })
  }

  next()
}

const questionsValidator = (req, res, next) => {
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
  if (username === undefined || !regexUsername.test(username.trim())) {
    return res.status(400).send({
      message: 'Name must be alphanumeric and must consist of 3 to 20',
    })
  }
  next()
}

const answerValidator = (req, res, next) => {
  const { answer } = req.query
  if (answer === undefined || !regexCorrectAnswer.test(answer)) {
    return res
      .status(400)
      .send({ message: 'Answer must be a number in specific range' })
  }
  next()
}

const questionNumberValidator = (req, res, next) => {
  const { questionNumber } = req.query
  if (
    questionNumber === undefined ||
    !regexQuestionNumber.test(questionNumber)
  ) {
    return res.status(400).send({ message: 'Question number must be a number' })
  }
  next()
}

const reCaptchaValidator = (req, res, next) => {
  let reCaptchaToken = ''
  if (req.method === 'POST') {
    reCaptchaToken = req.body.reCaptchaToken
  } else if (req.method === 'GET') {
    reCaptchaToken = req.query.reCaptchaToken
  }

  axios
    .post(
      'https://www.google.com/recaptcha/api/siteverify',
      querystring.stringify({
        secret: process.env.RECAPTCHA_SECRET,
        response: reCaptchaToken,
      })
    )
    .then(({ data }) => {
      if (data.success) {
        return next()
      } else {
        throw new Error()
      }
    })
    .catch(() => {
      return res.status(403).send({ message: 'ReCAPTCHA validation failed' })
    })
}

module.exports = {
  titleValidator,
  questionsValidator,
  quizIdValidator,
  usernameValidator,
  answerValidator,
  questionNumberValidator,
  reCaptchaValidator,
}
