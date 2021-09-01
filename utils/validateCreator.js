const { client, ObjectId } = require('./mongodb')

module.exports = async (creatorID, validityID) => {
  const creators = client.db('main').collection('creators')

  const findFilter = {
    _id: ObjectId(creatorID),
    validityID,
  }

  const creator = await creators.findOne(findFilter, {
    projection: { _id: 1, validityID: 0 },
  })

  if (!creator) {
    return false
  }

  return true
}
