const jwt = require('jsonwebtoken')
module.exports = tokenName => (req, res, next) => {
  try {
    req.decodedToken = jwt.verify(
      req.cookies[tokenName],
      process.env[`${tokenName.toUpperCase()}_SECRET`]
    )
    next()
  } catch {
    res.clearCookie(tokenName, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
    })
    return res.status(400).send({ message: 'Invalid token' })
  }
}
