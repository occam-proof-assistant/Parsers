'use strict';

var Context = require('./context');

class CommonParser {
  constructor(productions) {
    this.productions = productions;
  }

  parse(tokens) {
    var node = null,
        productionsLength = this.productions.length;

    if (productionsLength > 0) {
      var firstProduction = first(this.productions),
          context = new Context(tokens, this.productions),
          production = firstProduction, ///
          nodes = production.parse(context);

      if (nodes !== null) {
        var nodesLength = nodes.length;

        if (nodesLength > 0) {
          var firstNode = first(nodes);

          node = firstNode; ///
        }
      }
    }

    return node;
  }

  findProduction(productionName) {
    var name = productionName,  ///
        index = this.indexOfProductionByName(name),
        production = (index !== null) ?
                       this.productions[index] :
                         null;

    return production;
  }

  indexOfProductionByName(name) {
    var index,
        foundIndex = null;

    this.productions.some(function(production, index) {
      var productionName = production.getName();

      if (productionName === name) {
        foundIndex = index;

        return true;
      } else {
        return false;
      }
    });

    index = foundIndex; ///

    return index;
  }
}

module.exports = CommonParser;

function first(array) { return array[0]; }
