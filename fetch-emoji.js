const request = require('request')

const EMOJI_DEF = /data-c="([^"]+)"\>([^\<]+)/g;

request('http://facebook-emoticons.fr.downloadastro.com/tools/', (error, response, body) => {
  let m
  while (m = EMOJI_DEF.exec(body)) {
    console.log(m.slice(1, 3).join(', '))
  }
})
