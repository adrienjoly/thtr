var fs = require('fs')
var express = require('express')
var app = express()

const PORT = process.env.PORT || 3000
const PATH_PLAYS = './plays/'

const makeActFileName = ({ play, act }) => PATH_PLAYS + play + '/acte' + act + '.json'
const readActFile = param => fs.readFileSync(makeActFileName(param)).toString()
const getActJson = param => JSON.parse(readActFile(param))
const getPlayJson = play => JSON.parse(fs.readFileSync(PATH_PLAYS + play + '.json').toString())

app.get('/', (req, res) =>
  res.send('Hey, how are you today?'))
 
app.get('/api/file/:file', (req, res) =>
  res.json(JSON.parse(fs.readFileSync(req.params.file).toString())))
 
app.get('/api/plays', (req, res) => {
  fs.readdir(PATH_PLAYS, (err, plays) =>
    res.json(plays.filter(id => id.indexOf('.json') != -1).map(id =>
      Object.assign({ id: id }, getPlayJson(id.replace('.json', '')))
    ))
  )
})

app.get('/api/play/:play', (req, res) => res.json(getPlayJson(req.params.play)))

app.get('/api/play/:play/act/:act', (req, res) => res.json(getActJson(req.params)))
 
app.listen(PORT)
console.log('server running on port', PORT)
