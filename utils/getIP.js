module.exports = req => {
  const xForwardedFor = req.headers['x-forwarded-for']
  if (!xForwardedFor) {
    return undefined
  }
  return xForwardedFor.split(',').reverse()[2].trim()
}
