const { client, ObjectId } = require('../utils/mongodb')

module.exports = async (req, res) => {
  try {
    const quizzes = client.db('main').collection('quizzes')
    const { creatorUUID } = req.decodedToken
    const { quizId } = req.query

    const filter = { _id: ObjectId(quizId), creator: creatorUUID }

    const results = await quizzes.deleteOne(filter)
    if (results.deletedCount === 1) {
      return res.send({ message: 'Quiz deleted successfully' })
    } else {
      return res
        .status(400)
        .send({
          message:
            'Quiz can not be deleted. Quiz does not exist or you are not the creator',
        })
    }
  } catch (e) {
    console.log(e)
    return res.status(500).send({ message: 'Internal server error' })
  }
}
