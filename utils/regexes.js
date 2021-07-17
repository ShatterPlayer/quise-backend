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
    `^[a-z0-9'żźćńółęąśŻŹĆĄŚĘŁÓŃ?!.,<>/\\[\\]\\)\\(;:"#$%^&*+-_ ]{${minQuizTitleChars},${maxQuizTitleChars}}$`,
    'i'
  ),
  regexQuestionText: new RegExp(
    `^[a-z0-9'żźćńółęąśŻŹĆĄŚĘŁÓŃ?!.,<>/\\[\\]\\)\\(;:"#$%^&*+-_ ]{${minQuestionChars},${maxQuestionChars}}$`,
    'i'
  ),
  regexQuestionAnswer: new RegExp(
    `^[a-z0-9'żźćńółęąśŻŹĆĄŚĘŁÓŃ?!.,<>/\\[\\]\\)\\(;:"#$%^&*+-_ ]{${minAnswerChars},${maxAnswerChars}}$`,
    'i'
  ),
  regexQuestionNumber: /^[0-9]+$/,
}
