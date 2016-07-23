const request = require('request')

const EMOJI_DEF = /data-c="([^"]+)"\>([^\<]+)/g;

const processName = name => name
  .replace(/[Tt].te d[e\']/, '')
  .trim()

request('http://facebook-emoticons.fr.downloadastro.com/tools/', (error, response, body) => {
  let m
  while (m = EMOJI_DEF.exec(body)) {
    console.log([ m[1], processName(m[2]) ].join(', '))
  }
})
