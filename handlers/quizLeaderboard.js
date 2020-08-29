const { client, ObjectId } = require('../utils/mongodb')

module.exports = async (req, res) => {
  try {
    const { quizId } = req.query
    const quizzes = client.db('main').collection('quizzes')

    const quiz = await quizzes.findOne({ _id: ObjectId(quizId) })

    if (!quiz) {
      return res.status(400).send({ message: 'Invalid quiz id' })
    }

    return res.send(quiz)
  } catch (e) {
    console.log(e)
    return res.status(500).send({ message: 'Internal server error' })
  }
}
