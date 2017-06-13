'use strict';

const Definition = require('../definition'),
      TerminalSymbolPart = require('../../common/part/terminalSymbol'),
      ProductionNamePart = require('../../common/part/productionName');

class ProductionDefinition extends Definition {
  constructor() {
    const noWhitespace = false,
          productionNameProductionName = 'productionName',
          separatorTerminalSymbolContent = '::=',
          definitionsProductionName = 'definitions',
          productionNameProductionNamePart = new ProductionNamePart(productionNameProductionName, noWhitespace),
          separatorTerminalSymbolPart = new TerminalSymbolPart(separatorTerminalSymbolContent, noWhitespace),
          definitionsProductionNamePart = new ProductionNamePart(definitionsProductionName, noWhitespace),
          parts = [
            productionNameProductionNamePart,
            separatorTerminalSymbolPart,
            definitionsProductionNamePart
          ];
    
    super(parts)
  }
}

module.exports = ProductionDefinition;