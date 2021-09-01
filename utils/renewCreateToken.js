const { v4: uuidv4 } = require('uuid')
const jwt = require('jsonwebtoken')
const { client, ObjectId } = require('./mongodb')

module.exports = async (creatorID, res) => {
  const validityID = uuidv4()
  const creators = client.db('main').collection('creators')

  const updateResults = await creators.updateOne(
    { _id: ObjectId(creatorID) },
    { $set: { validityID } }
  )

  if (updateResults.modifiedCount === 0) {
    throw new Error('Creator does not exist')
  }

  const token = jwt.sign(
    {
      creatorID,
      validityID,
    },
    process.env.CREATETOKEN_SECRET,
    { expiresIn: '30d' /*30d*/ }
  )

  return res.cookie('CreateToken', token, {
    httpOnly: true,
    sameSite: 'None',
    secure: true,
    maxAge: 2592000000 /*30d*/,
  })
}
