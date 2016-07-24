var fs = require('fs')

const emoji = (() => {
  let emoji = {};
  fs.readFileSync('./emoji.csv').toString().split('\n').forEach(line => {
    [ char, word ] = line.split(', ')
    emoji[word] = char
  })
  return emoji
})()

module.exports = {
  emoji: emoji
}
