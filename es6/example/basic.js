'use strict';

var easyui = require('easyui'),
    TextArea = easyui.TextArea;

var lexers = require('occam-lexers'),
    BasicLexer = lexers.BasicLexer;

var BasicParser = require('../basic/parser');

var Example = require('../example');

var terminalSymbolsRegExpPatternTextAreaSelector = 'textarea#terminalSymbolsRegExpPattern',
    terminalSymbolsRegExpPatternTextArea = new TextArea(terminalSymbolsRegExpPatternTextAreaSelector);

var grammar = `

      expression                 ::= term operatorThenTerm*
      
      operatorThenTerm           ::= operator term
      
      operator                   ::= '+' | '-' | '*' | '/'
      
      term                       ::= naturalNumber | parenthesizedExpression
      
      naturalNumber              ::= /^\\d+$/
      
      parenthesizedExpression    ::= '(' expression ')'
    
    `,
    terminalSymbolsRegExpPattern = `\\+|\\-|\\*|\\/|\\(|\\)|\\d+`;

var basicLexer = null,
    basicParser = null;

class BasicExample {
  static run() {
    var grammarTextAreaValue = grammar, ///
        terminalSymbolsRegExpPatternTextAreaValue = terminalSymbolsRegExpPattern; ///

    Example.setGrammarTextAreaValue(grammarTextAreaValue);

    terminalSymbolsRegExpPatternTextArea.setValue(terminalSymbolsRegExpPatternTextAreaValue);

    update();

    terminalSymbolsRegExpPatternTextArea.onChange(function() {
      update();
    });

    Example.onGrammarTextAreaChange(function() {
      update();
    });

    Example.onContentTextAreaChange(function() {
      update();
    });
  }
}

function update() {
  updateBasicLexer();
  updateBasicParser();

  if (basicLexer !== null) {
    Example.updateParseTree(basicLexer, basicParser);
  } else {
    Example.clearParseTree();
  }
}

module.exports = BasicExample;

function updateBasicLexer() {
  var terminalSymbolsRegExpPatternInputValue = terminalSymbolsRegExpPatternTextArea.getValue(),
      terminalSymbolsRegExpPattern = terminalSymbolsRegExpPatternInputValue,  ///
      terminalSymbolsRegExpPatternIsValid = regExpPatternIsValid(terminalSymbolsRegExpPattern);

  if (terminalSymbolsRegExpPatternIsValid) {
    var terminalSymbolsRegExp = new RegExp(terminalSymbolsRegExpPattern),
        grammar = [
          { terminal : terminalSymbolsRegExp }
        ];

    basicLexer = BasicLexer.fromGrammar(grammar);

    terminalSymbolsRegExpPatternTextArea.removeClass('error');
  } else {
    terminalSymbolsRegExpPatternTextArea.addClass('error');

    basicLexer = null;
  }
}

function updateBasicParser() {
  var grammarTextAreaValue = Example.getGrammarTextAreaValue(),
      grammar = grammarTextAreaValue; ///

  basicParser = BasicParser.fromGrammar(grammar);
}

function regExpPatternIsValid(regExpPattern) {
  var valid = true;

  try {
    new RegExp(regExpPattern);
  }
  catch (error) {
    valid = false;
  }

  return valid;
}
