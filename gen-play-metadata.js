const fs = require('fs')

const PATH_PLAYS = './plays/'
const URL_PLAYS = '/play/'

const removeAccents = str => !str ? '' : str
  .replace(/[’`"]/g, "'")
  .replace(/[ç]/gi, 'c')
  .replace(/[àâä]/gi, "a")
  .replace(/[éèêë]/gi, "e")
  .replace(/[îï]/gi, "i")
  .replace(/[ôö]/gi, "o")
  .replace(/[ùûü]/gi, "u")

const addSeparators = str => str.replace(/[^a-z0-9']+/g, '-')

const removeTrailingShit = str => str.replace(/-+$/, '')

const toFileName = str => removeTrailingShit(addSeparators(removeAccents(str.toLowerCase())))

const readPlay = id => JSON.parse(fs.readFileSync(PATH_PLAYS + id + '/acte1.json').toString())

const genPlayMetadata = id => {
  var { title, characters } = readPlay(id)
  const appendAvatar = char => {
    const avatarFile = id + '/avatars/' + toFileName(char.name) + '.png'
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
