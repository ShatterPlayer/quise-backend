'use strict'
/**
 * Docs available at https://documenter.getpostman.com/view/8627559/TVRka7xF
 */
require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const app = express()

const connectToDB = require('./handlers/connectToDB')
const postQuiz = require('./handlers/postQuiz')
const startQuiz = require('./handlers/startQuiz')
const nextQuestion = require('./handlers/nextQuestion')
const quizLeaderboard = require('./handlers/quizLeaderboard')
const getQuiz = require('./handlers/getQuiz')
const deleteQuiz = require('./handlers/deleteQuiz')
const quizIdValidator = require('./utils/validators/quizIdValidator')
const titleValidator = require('./utils/validators/titleValidator')
const questionsValidator = require('./utils/validators/questionsValidator')
const usernameValidator = require('./utils/validators/usernameValidator')
const answerValidator = require('./utils/validators/answerValidator')
const questionNumberValidator = require('./utils/validators/questionNumberValidator')
const reCaptchaValidator = require('./utils/validators/reCaptchaValidator')
const decodeJWT = require('./handlers/decodeJWT')
const creatorCheck = require('./handlers/creatorCheck')

app.set('port', process.env.PORT || 80)

app.use(
  cors({
    origin: ['http://localhost:3000', 'https://quise.netlify.app'],
    credentials: true,
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get('/api/quiz', quizIdValidator, connectToDB, getQuiz)

app.post(
  '/api/quiz',
  reCaptchaValidator,
  titleValidator,
  questionsValidator,
  connectToDB,
  creatorCheck,
  postQuiz
)

app.get(
  '/api/quiz/start',
  reCaptchaValidator,
  quizIdValidator,
  usernameValidator,
  connectToDB,
  startQuiz
)

app.get(
  '/api/quiz/nextquestion',
  answerValidator,
  questionNumberValidator,
  decodeJWT('SolveToken'),
  connectToDB,
  nextQuestion
)

app.delete(
  '/api/quiz',
  quizIdValidator,
  decodeJWT('CreateToken'),
  connectToDB,
  deleteQuiz
)

app.get('/api/quiz/leaderboard', quizIdValidator, connectToDB, quizLeaderboard)

app.listen(app.get('port'), () => {
  console.log(`Server is listening on port ${app.get('port')}`)
})
