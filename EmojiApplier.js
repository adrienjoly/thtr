var fs = require('fs')

const emoji = (() => {
  let emoji = {};
  fs.readFileSync('./emoji.csv').toString().split('\n').forEach(line => {
    [ char, word ] = line.split(', ')
    emoji[word] = char
  })
  return emoji
})()

const SEPAR = '\\,\\;\\.'
const RE_SEPAR = new RegExp('[' + SEPAR + ']')
const createWordRegExp = word => new RegExp('([ ^])(' + word + ')([ ' + SEPAR + '$])', 'g')

const emojiRegExp = createWordRegExp(Object.keys(emoji).join('|'))

function findEmojiWords(text) {
  const emojiSet = {}
  ;(text.match(emojiRegExp) || []).forEach(word => {
    word = word.replace(RE_SEPAR, '').trim()
    emojiSet[word] = emoji[word]
  })
  return emojiSet
}

function integrateEmoji(text) {
  let final = text.substr()
  let emojiWords = findEmojiWords(text)
  Object.keys(emojiWords).forEach(word => {
    final = final.replace(createWordRegExp(word), '$1$2 ' + emojiWords[word] + '$3')
  })
  // TODO: final = final.replace(emojiRegExp, (a, word) => console.log(arguments)/*'$1$2 ' + emojiWords[word] + '$3'*/)
  return final
}

module.exports = {
  findEmojiWords: findEmojiWords,
  integrateEmoji: integrateEmoji,
  emoji: emoji
}
