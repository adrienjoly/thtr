// text parser from http://www.toutmoliere.net/acte-1,405363.html

const ACTOR_PRESENTATION = /^[^a-z0-9\.]{3,}.+\.$/;

var readFromFile = function (filepath) {
  return require('fs').readFileSync(filepath).toString();
};

//var text = readFromFile('lbg-acte1.txt');
var text = readFromFile('fourberies-acte1.txt');

text = text.split('\n[1]')[0]; // delete references at end of file

var parts = text.split(/SC.NE /g);

var intro = parts.shift();
intro = intro.split('ACTEURS :')[1];
intro = intro.split('ACTE ')[0];
//let [ actors, context ] = intro.split('\n\n');
//var actors = intro.split('/n').filter(l => /^[^a-z0-9\.]{3,}[^\.]+\.$/.test(l)).join('\n');
var actors = intro.split('\n').filter(l => ACTOR_PRESENTATION.test(l));
var context = intro.split('\n').filter(l => !ACTOR_PRESENTATION.test(l));
console.log('actors:', actors);
console.log('context:', context);

parts = parts.map((p) => p.split('\n').slice(1).join('\n'));
/*
console.log('parts:', parts.map((p) => p
  .split(/\n([^a-z0-9\.]{3,}[^\.]+)\.\- /)
  .filter((a, i) => i % 2)
));
*/
