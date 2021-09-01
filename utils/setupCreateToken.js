const jwt = require('jsonwebtoken')

module.exports = (creatorID, validityID, res) => {
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
