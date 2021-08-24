const jwt = require('jsonwebtoken')
module.exports = tokenName => (req, res, next) => {
  try {
    req.decodedSolveToken = jwt.verify(
      req.cookies[tokenName],
      process.env.SOLVETOKEN_SECRET
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
