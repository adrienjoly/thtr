var fs = require('fs')

const emoji = (() => {
  let emoji = {};
  fs.readFileSync('./emoji.csv').toString().split('\n').forEach(line => {
    [ char, word ] = line.split(', ')
    emoji[word] = char
  })
  return emoji
})()

const emojiRegExp = new RegExp('[ ^](' + Object.keys(emoji).join('|') + ')[ $]', 'g')

function findEmojiWords(text) {
  const emojiSet = {}
  ;(text.match(emojiRegExp) || []).forEach(word => {
    emojiSet[word.trim()] = emoji[word.trim()]
  })
  return emojiSet
}

module.exports = {
  findEmojiWords: findEmojiWords,
  emoji: emoji
}
