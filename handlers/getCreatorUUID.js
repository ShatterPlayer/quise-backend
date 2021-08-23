const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')

module.exports = (req, res, next) => {
  try {
    if (req.cookies.CreateToken) {
      const decodedToken = jwt.verify(
        req.cookies.CreateToken,
        process.env.CREATETOKEN_SECRET
      )
      req.creatorUUID = decodedToken.creatorUUID
    } else {
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
