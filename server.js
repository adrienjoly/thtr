var fs = require('fs')
var express = require('express')
var app = express()

var PORT = process.env.PORT || 3000;

const makeActFileName = ({ play, act }) => './plays/' + play + '/acte' + act + '.json'

app.get('/', (req, res) =>
  res.send('Hey, how are you today?'))
 
app.get('/api/file/:file', (req, res) =>
  res.json(JSON.parse(fs.readFileSync(req.params.file).toString())))
 
app.get('/api/play/:play/act/:act', (req, res) =>
  res.json(JSON.parse(fs.readFileSync(makeActFileName(req.params)).toString())))
 
app.listen(PORT)
console.log('server running on port', PORT)
