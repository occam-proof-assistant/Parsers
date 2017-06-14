'use strict';

const Definition = require('../definition'),
      OneOrMorePartsPart = require('../part/oneOrMoreParts'),
      TerminalSymbolPart = require('../part/terminalSymbol'),
      ProductionNamePart = require('../part/productionName');

class GroupOfPartsDefinition extends Definition {
  constructor() {
    const partProductionName = 'part',
          openBracketTerminalSymbolContent = '(',
          closeBracketTerminalSymbolContent = ')',
          partProductionNamePart = new ProductionNamePart(partProductionName),
          openBracketTerminalSymbolPart = new TerminalSymbolPart(openBracketTerminalSymbolContent),
          closeBracketTerminalSymbolPart = new TerminalSymbolPart(closeBracketTerminalSymbolContent),
          oneOrMorePartProductionNamePartsPart = new OneOrMorePartsPart(partProductionNamePart),
          parts = [
            openBracketTerminalSymbolPart,
            oneOrMorePartProductionNamePartsPart,
            closeBracketTerminalSymbolPart
          ];
    
    super(parts)
  }
}

module.exports = GroupOfPartsDefinition;
