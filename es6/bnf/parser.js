'use strict';

const CommonParser = require('../common/parser'),
      ProductionsProduction = require('./production/productions'),
      ProductionProduction = require('./production/production'),
      RulesProduction = require('./production/rules'),
      RuleProduction = require('./production/rule'),
      PartProduction = require('./production/part'),
      ProductionNameProduction = require('./production/productionName'),
      RegularExpressionProduction = require('./production/regularExpression'),
      TerminalSymbolProduction = require('./production/terminalSymbol');

class BNFParser extends CommonParser {
  static fromNothing() {
    const productionsProduction = new ProductionsProduction(),
          productionProduction = new ProductionProduction(),
          rulesProduction = new RulesProduction(),
          ruleProduction = new RuleProduction(),
          partProduction = new PartProduction(),
          productionNameProduction = new ProductionNameProduction(),
          regularExpressionProduction = new RegularExpressionProduction(),
          terminalSymbolProduction = new TerminalSymbolProduction(),
          productions = [
            productionsProduction,
            productionProduction,
            rulesProduction,
            ruleProduction,
            partProduction,
            productionNameProduction,
            regularExpressionProduction,
            terminalSymbolProduction
          ],
          bnfParser = new BNFParser(productions);
    
    return bnfParser;
  }
}

module.exports = BNFParser;
