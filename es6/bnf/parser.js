'use strict';

const cycles = require('../grammar/cycles'),
      leftRecursion = require('../grammar/leftRecursion'),
      CommonParser = require('../common/parser'),
      PartProduction = require('./production/part'),
      GroupProduction = require('./production/group'),
      DefinitionProduction = require('./production/definition'),
      DefinitionsProduction = require('./production/definitions'),
      ProductionProduction = require('./production/production'),
      ProductionsProduction = require('./production/productions'),
      OptionalPartProduction = require('./production/optionalPart'),
      OneOrMorePartsProduction = require('./production/oneOrMoreParts'),
      ZeroOrMorePartsProduction = require('./production/zeroOrMoreParts'),
      VerticalSpaceProduction = require('./production/verticalSpace'),
      ProductionNameProduction = require('./production/productionName'),
      TerminalSymbolProduction = require('./production/terminalSymbol'),
      RegularExpressionProduction = require('./production/regularExpression'),
      SignificantTokenTypeProduction = require('./production/significantTokenType');

class BNFParser extends CommonParser {
  static fromNothing() {
    const partProduction = new PartProduction(),
          groupProduction = new GroupProduction(),
          definitionProduction = new DefinitionProduction(),
          definitionsProduction = new DefinitionsProduction(),
          productionProduction = new ProductionProduction(),
          productionsProduction = new ProductionsProduction(),
          optionalPartProduction = new OptionalPartProduction(),
          oneOrMorePartsProduction = new OneOrMorePartsProduction(),
          zeroOrMorePartsProduction = new ZeroOrMorePartsProduction(),
          verticalSpaceProduction = new VerticalSpaceProduction(),
          productionNameProduction = new ProductionNameProduction(),
          terminalSymbolProduction = new TerminalSymbolProduction(),
          regularExpressionProduction = new RegularExpressionProduction(),
          significantTokenTypeProduction = new SignificantTokenTypeProduction();

    let productions = [
          productionsProduction,
          productionProduction,
          definitionsProduction,
          definitionProduction,
          partProduction,
          optionalPartProduction,
          oneOrMorePartsProduction,
          zeroOrMorePartsProduction,
          groupProduction,
          productionNameProduction,
          regularExpressionProduction,
          significantTokenTypeProduction,
          terminalSymbolProduction,
          verticalSpaceProduction
        ];

    productions = cycles.eliminate(productions);  ///

    productions = leftRecursion.eliminate(productions);  ///

    const bnfParser = new BNFParser(productions);
    
    return bnfParser;
  }
}

module.exports = BNFParser;
