const fs = require('fs')

const PATH_PLAYS = './plays/'
const URL_PLAYS = '/play/'

const readPlay = id => JSON.parse(fs.readFileSync(PATH_PLAYS + id + '/acte1.json').toString())

const genPlayMetadata = id => {
  var { title, characters } = readPlay(id)
  const appendAvatar = char => {
    const avatarFile = id + '/avatars/' + char.name.toLowerCase() + '.png'
    return !fs.existsSync(PATH_PLAYS + avatarFile) ? char : Object.assign(char, {
      avatarFile: URL_PLAYS + avatarFile
    })
  }
  const illustrationFile = id + '/illustration.png'
  return {
    id: id,
    title,
    illustrationFile: !fs.existsSync(PATH_PLAYS + illustrationFile) ? undefined : URL_PLAYS + illustrationFile,
    characters: characters.map(appendAvatar)
  }
}

fs.readdir(PATH_PLAYS, (err, plays) =>
  plays.filter(id => id.indexOf('.') == -1).forEach(id => {
    fs.writeFileSync(PATH_PLAYS + id + '.json', JSON.stringify(genPlayMetadata(id), null, '  ') + '\n')
  })
)
