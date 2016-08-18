// converts txt transcripts from www.toutmoliere.net into json files

var fs = require('fs');
var EmojiApplier = require('./EmojiApplier')

const ACTOR_NAME = /^[^a-z0-9\.\,]{3,}/;
const ACTOR_SPEECH = /\n([A-ZÉÈÊÎŒ’\' ]{3,}[^\.\n]+)(?:\n|\.\- )/; // TODO: add more accentuated chars.

const appendEmojiWords = item => Object.assign(item, {
  emojiWords: EmojiApplier.findEmojiWords(item.text)
})

const appendIntegratedEmoji = item => Object.assign(item, {
  textWithEmoji: EmojiApplier.integrateEmoji(item.text)
})

const removeReferences = item => {
  item.text = item.text
    .replace(/\s?\[\d+\]\s?/g, ' ')  // remove [x] references
    .replace(/\s+/g, ' ')            // remove redundant whitespace
    .replace(/\s+([\,\;\.])/g, '$1') // remove spaces before punctuation
  return item
}

const compose = function() {
  const fcts = arguments
  return param => {
    let v = param
    for (let i = 0; i < fcts.length; ++i) {
      v = fcts[i](v)
    }
    return v
  }
}

const dialogueProcessors = compose(removeReferences, appendIntegratedEmoji, appendEmojiWords)

function subDivideIntoSentences(dialogue) {
  var sentences = []
  dialogue.forEach(item => {
    (item.text.match(/[^\.!\?]+[\.!\?]+/g) || [])
      .forEach(sentence => sentences.push({
        character: item.character,
        text: sentence
      }))
  })
  return sentences
}

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
          name: name.replace(/\.$/, ''),
          desc: desc.join(', ')
        });
      }
    } else {
      context.push(l);
    }
  });


  // parse dialogue
  parts = parts.map((part, index) => {
    part = part.replace(/\nDIALOGUE EN MUSIQUE\n/g, '\n');
    var all = part.split(ACTOR_SPEECH); // alternance of character and character's speech
    var sceneContext = all.shift().split('\n\n').slice(1).join('\n');
    var characters = all.filter((a, i) => (i + 1) % 2);
    var speech = all.filter((a, i) => i % 2);
    var dialogue = subDivideIntoSentences(characters.filter(a => !!a).map((a, i) => {
      var localContext = a.split(',');
      var character = localContext[0].replace(/\.$/, '');
      var text = (localContext[1] ? '(' + localContext[1].trim() + ') ' : '') + speech[i];
      return {
        character: character,
        text: text
      };
    }))
    return {
      act: act.split(',')[0],
      scene: index + 1,
      sceneContext: sceneContext,
      dialogue: dialogue.map(dialogueProcessors) 
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
