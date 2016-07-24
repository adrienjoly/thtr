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
  var headerParts = text.split(/Acte [^\n]*\n\n/);
  var title = headerParts[0].replace(/[\n\s]{2,}/g, '').split('\n').pop();
  var intro = headerParts[1] || text;
  intro.split('\n').forEach(l => {
    var char = ACTOR_NAME.exec(l);
    if (char) {
      if (l === 'ACTEURS :') return;
      let charParts = l.split(', ');
      let [ name, ...desc ] = charParts;
      if (desc.length && ACTOR_NAME.test(desc[0])) {
        context.push('Autres personnages présents: ' + l);
      } else {
        characters.push({
          name: name,
          desc: desc.join(', ')
        });
      }
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
    var dialogue = characters.map((a, i) => {
      return {
        character: a,
        text: speech[i]
      };
    })
    return {
      act: act.split(',')[0],
      scene: index + 1,
      dialogue: dialogue
    };
  });

  return {
    title: title,
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
