'use strict';

const lexers = require('occam-lexers');

const extendedBNF = require('./extendedBNF'),
      CommonParser = require('../common/parser'),
      ExtendedBNFParser = require('../extendedBNF/parser');

const { ExtendedBNFLexer } = lexers;

const extendedBNFLexer = ExtendedBNFLexer.fromNothing(),
      extendedBNFParser = ExtendedBNFParser.fromNothing();

class BasicParser extends CommonParser {
  static fromExtendedBNF(extendedBNF) {
    let basicParser = null;

    try {
      const lines = extendedBNFLexer.linesFromExtendedBNF(extendedBNF),
            node = extendedBNFParser.nodeFromLines(lines),
            rules = ExtendedBNFParser.generateRules(node);

      basicParser = new BasicParser(rules);
    } catch (error) {
      
    }

    return basicParser;
  }

  static fromNothing() {
    const basicParser = BasicParser.fromExtendedBNF(extendedBNF);

    return basicParser;
  }
}

module.exports = BasicParser;

BasicParser.extendedBNF = extendedBNF;