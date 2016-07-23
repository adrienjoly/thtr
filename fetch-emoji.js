const request = require('request')

const EMOJI_DEF = /data-c="([^"]+)"\>([^\<]+)/g;

const processName = name => name
  .toLowerCase()
  .replace(/[Tt].te d[e\']/, '') //  tête de...
  .replace(/^(une?|l[ea]) /, '')
  .replace(/(qui|avec) .+$/, '') // [nom] qui ...
  .replace(/^([^ ]+) \w+ant([ $]).*/, '$1') // adverbes
  .replace(/^(gros|petit|visage)$/, '')
  .trim()

request('http://facebook-emoticons.fr.downloadastro.com/tools/', (error, response, body) => {
  let m
  while (m = EMOJI_DEF.exec(body)) {
    [match, emoji, name] = m
    let processedName = processName(name)
    if (processedName.length) {
      console.log([ emoji, processedName ].join(', '))
    }
  }
})
