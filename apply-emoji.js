var fs = require('fs')
var EmojiApplier = require('./EmojiApplier')

const processJson = json => {
  json.scenes = json.scenes.map(scene => {
    scene.dialogue = scene.dialogue.map(item => {
      const emojiWords = EmojiApplier.findEmojiWords(item.text)
      item.text = ' ' + item.text + ' '
      for (var word in EmojiApplier.emoji) {
        item.text = item.text.replace(' ' + word + ' ', ' ' + EmojiApplier.emoji[word] + ' (' + word + ') ')
      }
      item.text = item.text.trim()
      console.log(item.character + ' - ' + item.text, emojiWords);
      return item
    })
    return scene
  })
  return ''
}

if (process.argv.length < 3) {
  console.warn('syntax: node apply-emoji.js <acte.json>')
} else {
  var processed = processJson(JSON.parse(fs.readFileSync(process.argv[2]).toString()))
  console.log(JSON.stringify(processed, null, '  '))
}
