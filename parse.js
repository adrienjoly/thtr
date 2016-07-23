// text parser from http://www.toutmoliere.net/acte-1,405363.html

const ACTOR_PRESENTATION = /^[^a-z0-9\.]{3,}.+\.$/;
const ACTOR_SPEECH = /\n([^a-z0-9\.]{3,}[^\.]+)\.\- /;

var readFromFile = function (filepath) {
  return require('fs').readFileSync(filepath).toString();
};

//var text = readFromFile('lbg-acte1.txt');
var text = readFromFile('fourberies-acte1.txt');

text = text.split('\n[1]')[0]; // delete references at end of file

var parts = text.split(/SC.NE /g);

// part 0 = actors & context
var intro = parts.shift().split('ACTEURS :')[1].split('ACTE ')[0];
var actors = intro.split('\n').filter(l => ACTOR_PRESENTATION.test(l));
var context = intro.split('\n').filter(l => !ACTOR_PRESENTATION.test(l));
console.log('actors:', actors);
console.log('context:', context);

// following parts
parts = parts.map(p => p.split('\n').slice(1).join('\n')); // ignore part number from each part's text

parts = parts.map(p => p
  .split(ACTOR_SPEECH)
  .filter((a, i) => i % 2)
);

console.log('parts:', parts);
