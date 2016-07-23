// text parser from http://www.toutmoliere.net/acte-1,405363.html

var fs = require('fs');

const ACTOR_PRESENTATION = /^[^a-z0-9\.]{3,}.+\.$/;
const ACTOR_SPEECH = /\n([^a-z0-9\.]{3,}[^\.]+)\.\- /;

function parseText(text) {
  var parts = text
    .split('\n[1]')[0] // delete references at end of file
    .split(/SC.NE /g);

  // part 0 = actors & context
  var actors = [];
  var context = [];
  var [ text, act ] = parts.shift().split('ACTE ');
  var intro = text.split('ACTEURS :')[1] || text.split(/Acte [^\n]*\n\n/)[1] || text;
  intro.split('\n').forEach(l => {
    (ACTOR_PRESENTATION.test(l) ? actors : context).push(l);
  });

  // following parts
  parts = parts.map(p => p.split('\n').slice(1).join('\n')); // ignore part number from each part's text

  // parse dialogue
  parts = parts.map((part, index) => {
    var all = part.split(ACTOR_SPEECH); // alternance of actor and actor's speech
    var actorList = all.shift();
    var actors = all.filter((a, i) => (i + 1) % 2);
    var speech = all.filter((a, i) => i % 2);
    return {
      act: act.split(',')[0],
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

if (process.argv.length < 3) {
  console.warn('syntax: node parse.js <acte.txt>');
} else {
  var parsed = parseText(fs.readFileSync(process.argv[2]).toString());
  console.log(JSON.stringify(parsed, null, '  '));  
}
