'use strict'
require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')

const app = express()

const connectToDB = require('./handlers/connectToDB')
const postQuiz = require('./handlers/postQuiz')
const startQuiz = require('./handlers/startQuiz')
const nextQuestion = require('./handlers/nextQuestion')
const quizLeaderboard = require('./handlers/quizLeaderboard')
const getQuiz = require('./handlers/getQuiz')
const {
  quizIdValidator,
  titleValidator,
  questionsValidator,
  usernameValidator,
  answerValidator,
  questionNumberValidator,
} = require('./utils/validators')
const decodeJWT = require('./handlers/decodeJWT')

app.set('port', process.env.PORT || 80)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Get basic quiz information
app.get('/api/quiz', quizIdValidator, connectToDB, getQuiz)

// Creates new quiz. Returns quiz id
app.post('/api/quiz', titleValidator, questionsValidator, connectToDB, postQuiz)
/*
  title: string,
  questions: [
    {
      text: string,
      answers: [
        string,
        string,
        string, 
        string
      ]
      correctAnswer: number
    }
  ]
*/

// Starts quiz. Returns question information, questionsAmount
// GET params: quizId, username
app.get(
  '/api/quiz/start',
  quizIdValidator,
  usernameValidator,
  connectToDB,
  startQuiz
)

/* Requests next question, validates answer.
GET params: answer, questionNumber
Returns:
  {
    correctAnswer: bool,
    nextQuestion?: {
      questionNumber: number,
      text: string,
      answers: [
        string,
        string,
        string,
        string
      ]
    },
    isQuizDone: bool
  }
*/
app.get(
  '/api/quiz/nextquestion',
  answerValidator,
  questionNumberValidator,
  decodeJWT,
  connectToDB,
  nextQuestion
)

app.get('/api/quiz/leaderboard', quizIdValidator, connectToDB, quizLeaderboard)

app.listen(app.get('port'), () => {
  console.log(`Server is listening on port ${app.get('port')}`)
})
