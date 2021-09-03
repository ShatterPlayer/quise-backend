const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')
const { client } = require('../utils/mongodb')
const validateCreator = require('../utils/validateCreator')
const renewCreateToken = require('../utils/renewCreateToken')
const setupCreateToken = require('../utils/setupCreateToken')

module.exports = async (req, res, next) => {
  try {
    const CreateToken = req.cookies['CreateToken']
    if (CreateToken) {
      const decodedToken = jwt.verify(
        CreateToken,
        process.env.CREATETOKEN_SECRET
      )

      const validation = await validateCreator(
        decodedToken.creatorID,
        decodedToken.validityID
      )
      if (!validation) {
        throw new Error('Invalid token')
      }

      await renewCreateToken(decodedToken.creatorID, res)
      req.creatorID = decodedToken.creatorID
    } else {
      const creators = client.db('main').collection('creators')
      const validityID = uuidv4()

      const insertResults = await creators.insertOne({
        validityID,
        lastOperation: new Date(),
      })
      const creatorID = String(insertResults.insertedId)

      setupCreateToken(creatorID, validityID, res)
      req.creatorID = creatorID
    }
    return next()
  } catch (e) {
    console.log(e)
    res.clearCookie('CreateToken', {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
    })
    return res.status(400).send({ message: 'Creator check failed' })
  }
}
