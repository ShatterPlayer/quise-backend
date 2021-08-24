const { client, ObjectId } = require('../utils/mongodb')

module.exports = async (req, res) => {
  try {
    const quizzes = client.db('main').collection('quizzes')
    const quiz = quizzes.aggregate([
      {
        $match: {
          _id: ObjectId(req.decodedToken.quizId),
          'users.username': req.decodedToken.username,
        },
      },
      {
        $project: {
          questions: {
            $slice: [
              '$questions',
              Number(req.query.questionNumber),
              Number(req.query.questionNumber) + 2,
            ],
          },
          users: {
            $filter: {
              input: '$users',
              as: 'user',
              cond: {
                $eq: ['$$user.username', req.decodedToken.username],
              },
            },
          },
        },
      },
    ])

    if (!(await quiz.hasNext())) {
      return res
        .status(400)
        .send({ message: 'Invalid id or username parameter' })
    }

    const quizData = await quiz.toArray()
    let lastQuestion

    if (quizData[0].users[0].answers[req.query.questionNumber] !== undefined) {
      return res
        .status(400)
        .send({ message: 'User already answered this question' })
    }

    if (quizData[0].questions.length === 0) {
      return res
        .status(400)
        .send({ message: 'There is no question with given number' })
    }

    if (quizData[0].questions.length === 1) {
      lastQuestion = true
    } else {
      lastQuestion = false
    }

    // Evaluating answer
    const answeredQuestion = quizData[0].questions[0]
    const subsequentQuestion = quizData[0].questions[1]
    let isAnswerCorrect

    if (answeredQuestion.correctAnswer == req.query.answer) {
      isAnswerCorrect = true
    } else {
      isAnswerCorrect = false
    }

    quizzes.updateOne(
      {
        _id: ObjectId(req.decodedToken.quizId),
        'users.username': req.decodedToken.username,
      },
      {
        $set: {
          ['users.$[user].answers.' + req.query.questionNumber]:
            isAnswerCorrect,
        },
      },
      {
        arrayFilters: [
          {
            'user.username': req.decodedToken.username,
          },
        ],
      }
    )

    const response = {
      correctAnswer: answeredQuestion.correctAnswer,

      isQuizDone: lastQuestion,
    }

    if (subsequentQuestion) {
      response.nextQuestion = {
        questionNumber: Number(req.query.questionNumber) + 1,
        text: subsequentQuestion.text,
        answers: subsequentQuestion.answers,
      }
    }

    return res.send(response)
  } catch (e) {
    console.log(e)
    return res.status(500).send({ message: 'Internal server error' })
  }
}
