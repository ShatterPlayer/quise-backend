const { client, ObjectId } = require('../utils/mongodb')

module.exports = async (req, res) => {
  try {
    const { quizId } = req.query
    const quizzes = client.db('main').collection('quizzes')

    const quiz = await quizzes.aggregate([
      {
        $match: {
          _id: ObjectId(quizId),
        },
      },
      {
        $project: {
          questionsAmount: {
            $size: '$questions',
          },
          title: 1,
          _id: 0,
        },
      },
    ])

    if (!(await quiz.hasNext())) {
      return res.status(404).send({ message: 'Quiz does not exist' })
    }

    const quizData = await quiz.toArray()

    return res.send(quizData[0])
  } catch (e) {
    console.log(e)
    return res.status(500).send({ message: 'Internal server error' })
  }
}
