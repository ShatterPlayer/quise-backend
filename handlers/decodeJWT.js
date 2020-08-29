const jwt = require('jsonwebtoken')
module.exports = (req, res, next) => {
  try {
    req.decodedToken = jwt.verify(req.cookies.JWT, process.env.SECRET)
    next()
  } catch {
    return res.status(400).send({ message: 'Invalid token' })
  }
}
