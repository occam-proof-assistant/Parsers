'use strict';

const Definition = require('../definition'),
      OneOrMorePartsPart = require('../part/oneOrMoreParts'),
      SignificantTokenTypePart = require('../../common/part/significantTokenType');

class VerticalSpaceDefinition extends Definition {
  constructor() {
    const noWhitespace = false,
          endOfLineSignificantTokenType = 'endOfLine',
          endOfLineSignificantTokenTypePart = new SignificantTokenTypePart(endOfLineSignificantTokenType, noWhitespace),
          oneOrMoreEndOfLineSignificantTokenTypePartsPart = new OneOrMorePartsPart(endOfLineSignificantTokenTypePart, noWhitespace),
          parts = [
            oneOrMoreEndOfLineSignificantTokenTypePartsPart
          ];

    super(parts)
  }
}

module.exports = VerticalSpaceDefinition;