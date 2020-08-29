const { answersAmount } = require('./constants')

module.exports = {
  regexUsername: /^[a-z0-9żźćńółęąśŻŹĆĄŚĘŁÓŃ ]{3,20}$/i,
  regexCorrectAnswer: new RegExp(`^[0-${answersAmount - 1}]$`),
  regexId: /^[0-9a-f]{24}$/,
  regexQuizTitle: /^[a-z0-9żźćńółęąśŻŹĆĄŚĘŁÓŃ ]{4,70}$/i,
  regexQuestionText: /^[a-z0-9'"żźćńółęąśŻŹĆĄŚĘŁÓŃ ]{1,1400}$/i,
  regexQuestionAnswer: /^[a-z0-9żźćńółęąśŻŹĆĄŚĘŁÓŃ ]{1,70}$/i,
  regexQuestionNumber: /^[0-9]+$/,
}
