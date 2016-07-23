// text parser from http://www.toutmoliere.net/acte-1,405363.html

var fs = require('fs');

const ACTOR_NAME = /^[^a-z0-9\.\,]{3,}/;
const ACTOR_SPEECH = /\n([^a-z0-9\.]{3,}[^\.]+)\.\- /;

function parseText(text) {
  var parts = text
    .split('\n[1]')[0] // delete references at end of file
    .split(/SC.NE /g);

  // part 0 = characters & context
  var characters = [];
  var context = [];
  var [ text, act ] = parts.shift().split('ACTE ');
  var intro = text.split('ACTEURS :')[1] || text.split(/Acte [^\n]*\n\n/)[1] || text;
  intro.split('\n').forEach(l => {
    var char = ACTOR_NAME.exec(l);
    if (char) {
      var [ name, ...desc ] = l.split(', ');
      characters.push([ name, desc.join(', ') ].join(desc.length ? ', ' : ''));
    } else {
      context.push(l);
    }
  });

  // following parts
  parts = parts.map(p => p.split('\n').slice(1).join('\n')); // ignore part number from each part's text

  // parse dialogue
  parts = parts.map((part, index) => {
    var all = part.split(ACTOR_SPEECH); // alternance of character and character's speech
    var characterList = all.shift();
    var characters = all.filter((a, i) => (i + 1) % 2);
    var speech = all.filter((a, i) => i % 2);
    return {
      act: act.split(',')[0],
      scene: index + 1,
      dialogue: characters.map((a, i) => {
        return {
          character: a,
          text: speech[i]
        };
      })
    };
  });

  return {
    characters: characters,
    context: context,
    scenes: parts
  };
}

if (process.argv.length < 3) {
  console.warn('syntax: node parse.js <acte.txt>');
} else {
  var parsed = parseText(fs.readFileSync(process.argv[2]).toString());
  console.log(JSON.stringify(parsed, null, '  '));  
}
