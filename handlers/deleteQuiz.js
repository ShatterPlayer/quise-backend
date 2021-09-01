const { client, ObjectId } = require('../utils/mongodb')
const validateCreator = require('../utils/validateCreator')

module.exports = async (req, res) => {
  try {
    console.log(req.decodedToken)
    const creatorValidation = await validateCreator(
      req.decodedToken.creatorID,
      req.decodedToken.validityID
    )

    if (!creatorValidation) {
      return res.status(400).send({
        message: 'Quiz can not be deleted. Server received invalid token.',
      })
    }

    const quizzes = client.db('main').collection('quizzes')
    const { creatorID } = req.decodedToken
    const { quizId } = req.query

    const filter = { _id: ObjectId(quizId), creatorID }

    const results = await quizzes.deleteOne(filter)
    if (results.deletedCount === 1) {
      return res.send({ message: 'Quiz deleted successfully' })
    } else {
      return res.status(400).send({
        message:
          'Quiz can not be deleted. Quiz does not exist or you are not the creator',
      })
    }
  } catch (e) {
    console.log(e)
    return res.status(500).send({ message: 'Internal server error' })
  }
}
