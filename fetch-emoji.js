const request = require('request')

const EMOJI_DEF = /data-c="([^"]+)"\>([^\<]+)/g;

const processName = name => name
  .toLowerCase()
  .replace(/[Tt].te d[e\']/, '') //  tête de...
  .replace(/^(une?|l[ea]) /, '')
  .replace(/(qui|avec) .+$/, '') // [nom] qui ...
  .trim()

request('http://facebook-emoticons.fr.downloadastro.com/tools/', (error, response, body) => {
  let m
  while (m = EMOJI_DEF.exec(body)) {
    console.log([ m[1], processName(m[2]) ].join(', '))
  }
})
