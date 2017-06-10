'use strict';

const Rule = require('./rule'),
      NonTerminalNode = require('./node/nonTerminal');

class Production {
  constructor(name, rules, Node) {
    this.name = name;
    this.rules = rules;
    this.Node = Node;
  }

  getName() {
    return this.name;
  }
  
  getRules() {
    return this.rules;
  }
  
  getNode() {
    return this.Node;
  }

  isFoundByProductionName(productionName) {
    const found = (this.name === productionName);
    
    return found;
  }
  
  setName(name) {
    this.name = name;
  }
  
  setRules(rules) {
    this.rules = rules;
  }
  
  setNode(node) {
    this.node = node;
  }
  
  isLeftRecursive() {
    const leftRecursiveRules = this.getLeftRecursiveRules(),
          leftRecursiveRulesLength = leftRecursiveRules.length,
          leftRecursive = (leftRecursiveRulesLength > 0);
    
    return leftRecursive;
  }
  
  isImplicitlyLeftRecursive(previousProductions) {
    const implicitlyLeftRecursive = this.rules.some(function(rule) {
      const implicitlyLeftRecursive = rule.isImplicitlyLeftRecursive(previousProductions);
      
      return implicitlyLeftRecursive;
    });
    
    return implicitlyLeftRecursive;
  }
  
  getLeftRecursiveRules() {
    const productionName = this.name, ///
          leftRecursiveRules = this.rules.filter(function(rule) {
            const ruleLeftRecursive = rule.isLeftRecursive(productionName);
      
            return ruleLeftRecursive;
          });

    return leftRecursiveRules;
  }

  getNonLeftRecursiveRules() {
    const productionName = this.name, ///
          leftNonRecursiveRules = this.rules.filter(function(rule) {
            const ruleLeftRecursive = rule.isLeftRecursive(productionName),
                  ruleNonLeftRecursive = !ruleLeftRecursive;
  
            return ruleNonLeftRecursive;
          });

    return leftNonRecursiveRules;
  }
  
  concatRules(rules) {
    this.rules = this.rules.concat(rules);
  }
  
  toString(maximumProductionNameLength) {
    const rulesString = this.rules.reduce(function(rulesString, rule) {
            const ruleString = rule.toString();
            
            if (rulesString === null) {
              rulesString = ruleString;
            } else {
              rulesString = `${rulesString} | ${ruleString}`;
            }
            
            return rulesString;
          }, null),
          productionNameLength = this.name.length,  ///
          paddingLength = maximumProductionNameLength - productionNameLength,
          padding = paddingFromPaddingLength(paddingLength),
          string = `\n  ${this.name}${padding} ::= ${rulesString}\n`;
    
    return string;
  }
  
  parse(context, noWhitespace) {
    let nodeOrNodes = null;

    context.increaseDepth();

    const tooDeep = context.isTooDeep();

    if (tooDeep) {
      throw new Error(`The parse tree is too deep at production '${this.name}'`);
    }

    let ruleNodes = null;
    
    const someRuleParsed = this.rules.some(function(rule) {
            ruleNodes = rule.parse(context, noWhitespace);
  
            const ruleParsed = (ruleNodes !== null);
  
            return ruleParsed;
          });

    if (someRuleParsed) {
      const ruleNodesLength = ruleNodes.length;

      if (ruleNodesLength > 0) {
        const nodes = ruleNodes,  ///
              productionName = this.name; ///

        nodeOrNodes = this.Node.fromNodesAndProductionName(nodes, productionName);  ///
      }
    }

    context.decreaseDepth();

    return nodeOrNodes;
  }

  static fromLine(line, significantTokenTypes, mappings) {
    const name = line.getName(),
          rules = line.mapSymbolSequences(function(symbolSequence) {
            const rule = Rule.fromSymbolSequence(symbolSequence, significantTokenTypes);
  
            return rule;
          }),
          Node = mappings.hasOwnProperty(name) ?
                   mappings[name] :
                     NonTerminalNode, ///
          production = new Production(name, rules, Node);

    return production;
  }
  
  static fromProduction(production) {
    const name = production.getName(),
          rules = production.getRules(),
          Node = production.getNode();
    
    production = new Production(name, rules, Node); ///
    
    return production;
  }
}

module.exports = Production;

function paddingFromPaddingLength(paddingLength) {
  let padding = '';
  
  for (let position = 0; position < paddingLength; position++) {
    padding += ' ';
  }
  
  return padding;
}
