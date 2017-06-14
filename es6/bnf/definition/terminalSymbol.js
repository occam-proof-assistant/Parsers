'use strict';

const Definition = require('../definition'),
      TerminalSymbolPart = require('../part/terminalSymbol');

class TerminalSymbolDefinition extends Definition {
  constructor(content) {
    const terminalSymbolPart = new TerminalSymbolPart(content),
          parts = [
            terminalSymbolPart
          ];
    
    super(parts)
  }
}

module.exports = TerminalSymbolDefinition;
