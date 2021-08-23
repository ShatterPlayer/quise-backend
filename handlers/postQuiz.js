'use strict'
const { client } = require('../utils/mongodb')

module.exports = async (req, res) => {
  try {
    const quizzes = client.db('main').collection('quizzes')

    const data = {
      title: req.body.title,
      questions: req.body.questions,
      createdAt: new Date(),
      users: [],
      creator: req.creatorUUID,
    }
    const insertedDoc = await quizzes.insertOne(data)

    return res.send({ id: insertedDoc.insertedId })
  } catch (e) {
    console.log(e)
    return res.status(500).send('Internal server error')
  }
}
