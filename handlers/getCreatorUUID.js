const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')

module.exports = createIfDoesNotExist => (req, res, next) => {
  try {
    if (req.cookies.CreateToken) {
      const decodedToken = jwt.verify(
        req.cookies.CreateToken,
        process.env.CREATETOKEN_SECRET
      )
      req.creatorUUID = decodedToken.creatorUUID
    }

    // Creates UUID and refreshes JWT
    if (createIfDoesNotExist) {
      if (!req.creatorUUID) {
        req.creatorUUID = uuidv4()
      }

      const token = jwt.sign(
        {
          creatorUUID: req.creatorUUID,
        },
        process.env.CREATETOKEN_SECRET,
        { expiresIn: '30d' /*30d*/ }
      )

      res.cookie('CreateToken', token, {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
        maxAge: 2592000000 /*30d*/,
      })
    }
    next()
  } catch {
    res.clearCookie('CreateToken', {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
    })
    return res.status(400).send({ message: 'Invalid token' })
  }
}
