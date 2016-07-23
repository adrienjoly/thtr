// text parser from http://www.toutmoliere.net/acte-1,405363.html

const ACTOR_PRESENTATION = /^[^a-z0-9\.]{3,}.+\.$/;
const ACTOR_SPEECH = /\n([^a-z0-9\.]{3,}[^\.]+)\.\- /;

var readFromFile = function (filepath) {
  return require('fs').readFileSync(filepath).toString();
};

function parseText(text) {
  var parts = text
    .split('\n[1]')[0] // delete references at end of file
    .split(/SC.NE /g);

  // part 0 = actors & context
  var intro = parts.shift().split('ACTEURS :')[1].split('ACTE ')[0];
  var actors = intro.split('\n').filter(l => ACTOR_PRESENTATION.test(l));
  var context = intro.split('\n').filter(l => !ACTOR_PRESENTATION.test(l));

  // following parts
  parts = parts.map(p => p.split('\n').slice(1).join('\n')); // ignore part number from each part's text

  // parse dialogue
  parts = parts.map((part, index) => {
    var all = part.split(ACTOR_SPEECH); // alternance of actor and actor's speech
    var actorList = all.shift();
    var actors = all.filter((a, i) => (i + 1) % 2);
    var speech = all.filter((a, i) => i % 2);
    return {
      act: 1,
      part: index + 1,
      dialogue: actors.map((a, i) => {
        return {
          actor: a,
          text: speech[i]
        };
      })
    };
  });

  return {
    actors: actors,
    context: context,
    parts: parts
  };
}



//var text = readFromFile('lbg-acte1.txt');
var parsed = parseText(readFromFile('fourberies-acte1.txt'));
console.log(JSON.stringify(parsed, null, '  '));

