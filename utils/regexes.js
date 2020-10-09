const {
  answersAmount,
  minUsernameChars,
  maxUsernameChars,
  minQuizTitleChars,
  maxQuizTitleChars,
  minQuestionChars,
  maxQuestionChars,
  minAnswerChars,
  maxAnswerChars,
} = require('./constants')

module.exports = {
  regexUsername: new RegExp(
    `^[a-z0-9żźćńółęąśŻŹĆĄŚĘŁÓŃ ]{${minUsernameChars},${maxUsernameChars}}$`,
    'i'
  ),
  regexCorrectAnswer: new RegExp(`^[0-${answersAmount - 1}]$`),
  regexId: /^[0-9a-f]{24}$/,
  regexQuizTitle: new RegExp(
    `^[a-z0-9żźćńółęąśŻŹĆĄŚĘŁÓŃ ]{${minQuizTitleChars},${maxQuizTitleChars}}$`,
    'i'
  ),
  regexQuestionText: new RegExp(
    `^[a-z0-9'"żźćńółęąśŻŹĆĄŚĘŁÓŃ ]{${minQuestionChars},${maxQuestionChars}}$`,
    'i'
  ),
  regexQuestionAnswer: new RegExp(
    `^[a-z0-9żźćńółęąśŻŹĆĄŚĘŁÓŃ ]{${minAnswerChars},${maxAnswerChars}}$`,
    'i'
  ),
  regexQuestionNumber: /^[0-9]+$/,
}
