'use strict';

const lexers = require('occam-lexers'),
      necessary = require('necessary');

const BNFParser = require('../bnf/parser'),
      parserUtilities = require('../utilities/parser'),
      QualifiedCustomGrammarRule = require('../florence/rule/customGrammar/qualified'),
      UnqualifiedCustomGrammarRule = require('../florence/rule/customGrammar/unqualified');

const { BNFLexer } = lexers,
      { array } = necessary,
      { filter } = array;

const bnfLexer = BNFLexer.fromNothing(),
      bnfParser = BNFParser.fromNothing(),
      statementRuleName = 'statement',
      metastatementRuleName = 'metastatement',
      qualifiedStatementRuleName = 'qualifiedStatement',
      qualifiedMetastatementRuleName = 'qualifiedMetastatement',
      unqualifiedStatementRuleName = 'unqualifiedStatement',
      unqualifiedMetastatementRuleName = 'unqualifiedMetastatement';

class customGrammarUtilities {
  static rulesFromBNFMap(bnfMap) {
    const ruleNames = Object.keys(bnfMap),
          bnf = ruleNames.reduce(function (bnf, ruleName) {
            const ruleBNF = bnfMap[ruleName];

            bnf = `${bnf}${ruleBNF}`;

            return bnf;
          }, ''),
          lines = bnfLexer.linesFromBNF(bnf),
          rulesNode = bnfParser.rulesNodeFromLines(lines),
          rules = BNFParser.generateRules(rulesNode);

    return rules;
  }

  static replaceStatementAndMetaStatementRules(customGrammarRules) {
    customGrammarRules = customGrammarRules.slice();  ///
    
    const statementCustomGrammarRule = parserUtilities.findRuleByName(statementRuleName, customGrammarRules),
          metastatementCustomGrammarRule = parserUtilities.findRuleByName(metastatementRuleName, customGrammarRules),
          qualifiedStatementCustomGrammarRule = new QualifiedCustomGrammarRule.fromRuleNameAndCustomGrammarRule(qualifiedStatementRuleName, statementCustomGrammarRule),
          unqualifiedStatementCustomGrammarRule = new UnqualifiedCustomGrammarRule.fromRuleNameAndCustomGrammarRule(unqualifiedStatementRuleName, statementCustomGrammarRule),
          qualifiedMetastatementCustomGrammarRule = new QualifiedCustomGrammarRule.fromRuleNameAndCustomGrammarRule(qualifiedMetastatementRuleName, metastatementCustomGrammarRule),
          unqualifiedMetastatementCustomGrammarRule = new UnqualifiedCustomGrammarRule.fromRuleNameAndCustomGrammarRule(unqualifiedMetastatementRuleName, metastatementCustomGrammarRule);

    customGrammarRules.push(qualifiedStatementCustomGrammarRule);
    customGrammarRules.push(qualifiedMetastatementCustomGrammarRule);
    customGrammarRules.push(unqualifiedStatementCustomGrammarRule);
    customGrammarRules.push(unqualifiedMetastatementCustomGrammarRule);

    filter(customGrammarRules, function(customGrammarRule) {
      const keep = ((customGrammarRule !== statementCustomGrammarRule) && (customGrammarRule !== metastatementCustomGrammarRule));
      
      return keep;
    });
    
    return customGrammarRules;
  }
}

module.exports = customGrammarUtilities;