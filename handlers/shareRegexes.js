const regexes = require('../utils/regexes')

const procesedRegexes = {}
for (let property in regexes) {
  procesedRegexes[property] = String(regexes[property])
}
module.exports = (req, res) => {
  return res.send(procesedRegexes)
}
