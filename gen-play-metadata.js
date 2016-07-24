const fs = require('fs')

const PATH_PLAYS = './plays/'

const readPlay = id => JSON.parse(fs.readFileSync(PATH_PLAYS + id + '/acte1.json').toString())

const getMetadata = json => {
  var { title, characters } = json
  return { title, characters }
}

const genPlayMetadata = id => Object.assign({ id: id }, getMetadata(readPlay(id)))

fs.readdir(PATH_PLAYS, (err, plays) =>
  plays.filter(id => id.indexOf('.') == -1).forEach(id => {
    fs.writeFileSync(PATH_PLAYS + id + '.json', JSON.stringify(genPlayMetadata(id), null, '  ') + '\n')
  })
)
