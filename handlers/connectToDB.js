const { client } = require('../utils/mongodb')

module.exports = async (req, res, next) => {
  try {
    if (!client.isConnected()) {
      await client.connect()
    }
    next()
  } catch (e) {
    console.log(e)
    return res.status(500).send({ message: 'Internal server error' })
  }
}
