const request = require('request')

const EMOJI_DEF = /data-c="([^"]+)"\>([^\<]+)/g;

var URL = 'http://facebook-emoticons.fr.downloadastro.com/tools/';
// other source: http://pastebin.com/raw/hzURT2EX (201 emojis in french)

const processName = name => name
  .toLowerCase()
  .replace(/[Tt].te d[e\']/, '') //  tête de...
  .replace(/^(une?|l[ea]) /, '')
  .replace(/(qui|avec) .+$/, '') // [nom] qui ...
  .replace(/^([^ ]+) \w+ant([ $]).*/, '$1') // adverbes
  .replace(/^(gros|petit)$/, '') // non descriptive emojis
  .replace(/^\s*visage\s*/, '')
  .replace(/.*cadran de l\'horloge.*/, '')
  .trim()
  .split(' ')[0] // first word only

request(URL, (error, response, body) => {
  let m
  while (m = EMOJI_DEF.exec(body)) {
    [match, emoji, name] = m
    let processedName = processName(name)
    if (processedName.length) {
      console.log([ emoji, processedName ].join(', '))
    }
  }
})
