// text parser from http://www.toutmoliere.net/acte-1,405363.html

var fs = require('fs');
var EmojiApplier = require('./EmojiApplier')

const SENTIMENT_LEX_FR = JSON.parse(fs.readFileSync('./node_modules/sentiment-french/build/AFINN.json').toString())

const ACTOR_NAME = /^[^a-z0-9\.\,]{3,}/;
const ACTOR_SPEECH = /\n([^a-z0-9\.]{3,}[^\.]+)\.\- /;

const getSentimentFromFrenchText = text => require('sentiment-french')(text, SENTIMENT_LEX_FR)

const appendSentiment = item => Object.assign(item, {
  sentiment: getSentimentFromFrenchText(item.text)
})

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

const dialogueProcessors = compose(removeReferences, appendIntegratedEmoji, appendEmojiWords /*, appendSentiment*/)

function subDivideIntoSentences(dialogue) {
  var sentences = []
  dialogue.forEach(item => {
    item.text//.split(/[\?\!]/)
      .match(/[^\.!\?]+[\.!\?]+/g)
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
    var dialogue = subDivideIntoSentences(characters.map((a, i) => {
      return {
        character: a,
        text: speech[i]
      };
    }))
    return {
      act: act.split(',')[0],
      scene: index + 1,
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
