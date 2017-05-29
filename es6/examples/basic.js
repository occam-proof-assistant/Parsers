'use strict';

const easy = require('easy'),
      lexers = require('occam-lexers');

const BasicParser = require('../basic/parser'),
      Example = require('../example');

const { Textarea } = easy,
      { BasicLexer } = lexers;

const lexicalGrammarTextareaSelector = 'textarea#lexicalGrammar',
      lexicalGrammar = BasicLexer.grammar,
      bnfGrammar = `
  
    expression                 ::= term operatorThenTerm*
    
    operatorThenTerm           ::= operator term
    
    operator                   ::= '+' | '-' | '*' | '/'
    
    term                       ::= naturalNumber | parenthesizedExpression
    
    naturalNumber              ::= /^\\d+$/
    
    parenthesizedExpression    ::= '(' expression ')'
          
`;

let lexicalGrammarTextarea,
    basicLexer = null,
    basicParser = null;

class BasicExample {
  static run() {
    lexicalGrammarTextarea = new Textarea(lexicalGrammarTextareaSelector);

    const bnfGrammarTextareaValue = bnfGrammar, ///
          lexicalGrammarTextareaValue = JSON.stringify(lexicalGrammar, null, '  '); ///

    lexicalGrammarTextarea.setValue(lexicalGrammarTextareaValue);

    Example.setBNFGrammarTextareaValue(bnfGrammarTextareaValue);

    Example.onBNFGrammarTextareaKeyUp(update);

    Example.onContentTextareaKeyUp(update);

    lexicalGrammarTextarea.onKeyUp(update);

    update();
  }
}

function update() {
  updateBasicLexer();

  updateBasicParser();

  if (basicLexer !== null) {
    const production = null;  ///

    Example.updateParseTreeTextarea(basicLexer, basicParser, production);
  } else {
    Example.clearParseTreeTextarea();
  }
}

module.exports = BasicExample;

function updateBasicLexer() {
  const lexicalGrammarTextareaValue = lexicalGrammarTextarea.getValue();

  let lexicalGrammar = null;

  try {
    lexicalGrammar = JSON.parse(lexicalGrammarTextareaValue);
  } catch (error) {}

  const lexicalGrammarValid = (lexicalGrammar !== null);

  if (lexicalGrammarValid) {
    basicLexer = BasicLexer.fromGrammar(lexicalGrammar);

    lexicalGrammarTextarea.removeClass('error');
  } else {
    lexicalGrammarTextarea.addClass('error');

    basicLexer = null;
  }
}

function updateBasicParser() {
  const bnfGrammarTextareaValue = Example.getBNFGrammarTextareaValue(),
        bnfGrammar = bnfGrammarTextareaValue; ///

  basicParser = BasicParser.fromGrammar(bnfGrammar);
}
