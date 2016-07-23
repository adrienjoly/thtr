var fs = require('fs')

const emoji = (() => {
  let emoji = {};
  fs.readFileSync('./emoji.csv').toString().split('\n').forEach(line => {
    [ char, word ] = line.split(', ')
    emoji[word] = char
  })
  return emoji
})()

const processJson = json => {
  json.scenes = json.scenes.map(scene => {
    scene.dialogue = scene.dialogue.map(item => {
      item.text = ' ' + item.text + ' '
      for (var word in emoji) {
        item.text = item.text.replace(' ' + word + ' ', ' ' + emoji[word] + ' (' + word + ') ')
      }
      item.text = item.text.trim()
      console.log(item.character + ' - ' + item.text);
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
