const jwt = require('jsonwebtoken')
const { client, ObjectId } = require('../utils/mongodb')

module.exports = async (req, res) => {
  try {
    const quizzes = client.db('main').collection('quizzes')
    const quiz = quizzes.aggregate([
      {
        $match: {
          _id: ObjectId(req.query.quizId),
        },
      },
      {
        $project: {
          questions: {
            $slice: ['$questions', 1],
          },
          users: {
            $filter: {
              input: '$users',
              as: 'user',
              cond: { $eq: ['$$user.username', req.query.username] },
            },
          },
        },
      },
      {
        $project: {
          'questions.correctAnswer': 0,
        },
      },
    ])
    const quizData = await quiz.toArray()
    await quiz.close()

    if (quizData.length !== 1) {
      return res
        .status(400)
        .send({ message: 'Quiz with given id does not exists' })
    }

    if (quizData[0].users.length !== 0) {
      return res
        .status(400)
        .send({ message: 'Given username is already taken' })
    }

    await quizzes.updateOne(
      { _id: ObjectId(req.query.quizId) },
      {
        $push: {
          users: {
            username: req.query.username,
            answers: {},
          },
        },
      }
    )

    const token = jwt.sign(
      {
        username: req.query.username,
        quizId: req.query.quizId,
      },
      process.env.SECRET,
      { expiresIn: '3h' }
    )
    res.cookie('JWT', token, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      maxAge: 10800000 /*3h*/,
    })

    return res.send(quizData[0].questions[0])
  } catch (e) {
    console.log(e)
    return res.status(500).send({ message: 'Internal server error' })
  }
}
