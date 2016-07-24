const readJsonFile = file => JSON.parse(require('fs').readFileSync(file).toString())

const getMetadata = json => {
  var { title, characters } = json
  return { title, characters }
}

const file = process.argv[2] + '/acte1.json'

console.log(JSON.stringify(getMetadata(readJsonFile(file)), null, '  '))
