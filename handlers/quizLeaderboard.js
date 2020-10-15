const { client, ObjectId } = require('../utils/mongodb')

module.exports = async (req, res) => {
  try {
    const { quizId } = req.query
    const quizzes = client.db('main').collection('quizzes')

    const quiz = await quizzes.findOne(
      { _id: ObjectId(quizId) },
      {
        projection: {
          questions: 0,
        },
      }
    )

    if (!quiz) {
      return res
        .status(400)
        .send({ message: 'Quiz with given id does not exist' })
    }

    // Answers are stored in an object. More convenient form in frontend would be array.
    quiz.users = quiz.users.map(user => ({
      ...user,
      answers: Object.values(user.answers),
    }))

    return res.send(quiz)
  } catch (e) {
    console.log(e)
    return res.status(500).send({ message: 'Internal server error' })
  }
}
