'use strict';

var lexers = require('../../es6/occam-lexers'),
    GallinaLexer = lexers.GallinaLexer;

var grammar = require ('../../es6/grammar/gallina');

var terminalSymbolsRegExpPattern = GallinaLexer.terminalSymbolsRegExpPattern();

class GallinaExample {
  // constructor() {
  //   var preprocessor = null;
  //
  //   super(GallinaLexer, preprocessor);
  // }
  //
  // run() {
  //   super.setGrammar(grammar);
  //
  //   super.setTerminalSymbolsRegExpPattern(terminalSymbolsRegExpPattern);
  //
  //   super.run();
  // }
}

module.exports = GallinaExample;
