const jwt = require('jsonwebtoken')
module.exports = (req, res, next) => {
  try {
    req.decodedSolveToken = jwt.verify(
      req.cookies.SolveToken,
      process.env.SOLVETOKEN_SECRET
    )
    next()
  } catch {
    return res.status(400).send({ message: 'Invalid token' })
  }
}
