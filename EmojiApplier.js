var fs = require('fs')

const emoji = (() => {
  let emoji = {};
  fs.readFileSync('./emoji.csv').toString().split('\n').forEach(line => {
    [ char, word ] = line.split(', ')
    emoji[word] = char
  })
  return emoji
})()

const createWordRegExp = word => new RegExp('[ ^](' + word + ')[ $]', 'g')

const emojiRegExp = createWordRegExp(Object.keys(emoji).join('|'))

function findEmojiWords(text) {
  const emojiSet = {}
  ;(text.match(emojiRegExp) || []).forEach(word => {
    emojiSet[word.trim()] = emoji[word.trim()]
  })
  return emojiSet
}

function integrateEmoji(text) {
  let final = text.substr()
  let emojiWords = findEmojiWords(text)
  Object.keys(emojiWords).forEach(word => {
    final = final.replace(new RegExp('(' + word + ')', 'g'), '$1 ' + emojiWords[word])
  })
  return final
}

module.exports = {
  findEmojiWords: findEmojiWords,
  integrateEmoji: integrateEmoji,
  emoji: emoji
}
