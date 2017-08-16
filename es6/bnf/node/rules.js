'use strict';

const NonTerminalNode = require('../../common/node/nonTerminal');

class RulesNode extends NonTerminalNode {
  generateRules(Rule, mappings) {
    const childNodes = this.getChildNodes(),
          ruleNodes = childNodes,  ///
          rules = ruleNodes.map(function(ruleNode) {
            const rule = ruleNode.generateRule(Rule, mappings);
            
            return rule;
          });
    
    return rules;
  }
  
  static fromNodesAndRuleName(nodes, ruleName) {
    const childNodes = nodes, ///
          rulesNode = NonTerminalNode.fromRuleNameAndChildNodes(RulesNode, ruleName, childNodes);

    return rulesNode;
  }
}

module.exports = RulesNode;
