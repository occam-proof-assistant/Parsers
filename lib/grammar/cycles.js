'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var tarjan = require('occam-tarjan');

var parserUtil = require('../util/parser'),
    Production = require('../common/production'),
    UnitRuleProduction = require('./production/unitRule'),
    UnitRulesProduction = require('./production/unitRules'),
    NonUnitRulesProduction = require('./production/nonUnitRules');

var Graph = tarjan.Graph;

var cycles = function () {
  function cycles() {
    _classCallCheck(this, cycles);
  }

  _createClass(cycles, null, [{
    key: 'eliminate',
    value: function eliminate(productions) {
      var graph = graphFromProductions(productions),
          components = graph.generateComponents(),
          nonCyclicProductions = nonCyclicProductionsFromComponents(components, productions),
          alreadyNonCyclicProductions = alreadyNonCyclicProductionsFromGraph(graph, productions);

      productions = productions.map(function (production) {
        var productionName = production.getName(),
            nonCyclicProduction = parserUtil.findProduction(productionName, nonCyclicProductions),
            alreadyNonCyclicProduction = parserUtil.findProduction(productionName, alreadyNonCyclicProductions);

        production = nonCyclicProduction || alreadyNonCyclicProduction; ///

        return production;
      });

      return productions;
    }
  }]);

  return cycles;
}();

module.exports = cycles;

function graphFromProductions(productions) {
  var unitRulesProductions = unitRulesProductionsFromProductions(productions),
      graph = graphFromUnitRulesProductions(unitRulesProductions);

  return graph;
}

function unitRulesProductionsFromProductions(productions) {
  var unitRulesProductions = productions.reduce(function (unitRulesProductions, production) {
    var unitRulesProduction = UnitRulesProduction.fromProduction(production);

    if (unitRulesProduction !== null) {
      unitRulesProductions.push(unitRulesProduction);
    }

    return unitRulesProductions;
  }, []);

  return unitRulesProductions;
}

function graphFromUnitRulesProductions(unitRulesProductions) {
  var graph = new Graph();

  unitRulesProductions.forEach(function (unitRulesProduction) {
    var productionName = unitRulesProduction.getName(),
        productionNames = unitRulesProduction.getProductionNames(),
        vertexName = productionName,
        ///
    descendantVertexNames = productionNames; ///

    graph.addVertex(vertexName, descendantVertexNames);
  });

  return graph;
}

function nonCyclicProductionsFromComponents(components, productions) {
  var nonCyclicProductions = components.reduce(function (nonCyclicProductions, component) {
    var componentNonCyclic = component.isNonCyclic();

    if (componentNonCyclic) {
      nonCyclicProductionFromComponent(component, productions, nonCyclicProductions);
    } else {
      nonCyclicProductionsFromComponent(component, productions, nonCyclicProductions);
    }

    return nonCyclicProductions;
  }, []);

  return nonCyclicProductions;
}

function alreadyNonCyclicProductionsFromGraph(graph, productions) {
  var alreadyNonCyclicProductions = productions.filter(function (production) {
    var productionName = production.getName(),
        vertexName = productionName,
        ///
    vertexPresent = graph.isVertexPresent(vertexName),
        productionAlreadyNonCyclic = !vertexPresent; ///

    return productionAlreadyNonCyclic;
  });

  return alreadyNonCyclicProductions;
}

function nonCyclicProductionFromComponent(component, productions, nonCyclicProductions) {
  var firstVertex = component.getFirstVertex(),
      firstVertexName = firstVertex.getName(),
      nonCyclicProductionName = firstVertexName,
      ///
  nonCyclicProduction = parserUtil.findProduction(nonCyclicProductionName, productions);

  nonCyclicProductions.push(nonCyclicProduction);
}

function nonCyclicProductionsFromComponent(component, productions, nonCyclicProductions) {
  productions = productionsFromComponent(component, productions); ///

  var fixedProductions = fixedProductionsFromProductions(productions),
      unitRuleProductions = unitRuleProductionsFromProductions(productions),
      removedProductions = [],
      addedProductions = [];

  var unitRuleProductionsLength = unitRuleProductions.length;

  while (unitRuleProductionsLength > 0) {
    var unitRuleProduction = unitRuleProductions.shift(),
        unitRuleProductionName = unitRuleProduction.getName();

    var removedProduction = unitRuleProduction;

    removedProductions.push(removedProduction);

    var unitRuleProductionUnitRuleProductionName = unitRuleProduction.getUnitRuleProductionName(),
        fixedProductionName = unitRuleProductionUnitRuleProductionName,
        ///
    addedProductionName = unitRuleProductionName,
        ///
    fixedProduction = parserUtil.findProduction(fixedProductionName, fixedProductions);

    var addedProduction = parserUtil.findProduction(addedProductionName, addedProductions);

    if (addedProduction === null) {
      addedProduction = Production.fromProduction(fixedProduction);

      addedProduction.setName(addedProductionName);

      addedProductions.push(addedProduction);
    } else {
      var fixedProductionRules = fixedProduction.getRules();

      addedProduction.addRules(fixedProductionRules);
    }

    var intermediateProductionName = unitRuleProductionUnitRuleProductionName,
        ///
    intermediateProduction = parserUtil.findProduction(intermediateProductionName, unitRuleProductions);

    if (intermediateProduction !== null) {
      var intermediateProductionUnitRuleProductionName = intermediateProduction.getUnitRuleProductionName(),
          _unitRuleProductionUnitRuleProductionName = intermediateProductionUnitRuleProductionName,
          ///
      unitRuleProductionNonCyclic = unitRuleProductionName !== _unitRuleProductionUnitRuleProductionName;

      if (unitRuleProductionNonCyclic) {
        unitRuleProduction = findUnitRuleProduction(unitRuleProductionName, _unitRuleProductionUnitRuleProductionName, removedProductions);

        if (unitRuleProduction === null) {
          unitRuleProduction = UnitRuleProduction.fromNameAndUnitRuleProductionName(unitRuleProductionName, _unitRuleProductionUnitRuleProductionName);

          unitRuleProductions.unshift(unitRuleProduction);
        }
      }
    }

    unitRuleProductionsLength = unitRuleProductions.length;
  }

  nonCyclicProductionsFromFixedAndAddedProductions(fixedProductions, addedProductions, nonCyclicProductions);
}

function nonCyclicProductionsFromFixedAndAddedProductions(fixedProductions, addedProductions, nonCyclicProductions) {
  fixedProductions.forEach(function (fixedProduction) {
    var nonCyclicProduction = fixedProduction,
        ///
    nonCyclicProductionName = nonCyclicProduction.getName(),
        addedProductionName = nonCyclicProductionName,
        ///
    addedProduction = parserUtil.findProduction(addedProductionName, addedProductions);

    if (addedProduction !== null) {
      var addedProductionRules = addedProduction.getRules();

      nonCyclicProduction.addRules(addedProductionRules);
    }

    nonCyclicProductions.push(nonCyclicProduction);
  });
}

function productionsFromComponent(component, productions) {
  productions = component.mapVertices(function (vertex) {
    var vertexName = vertex.getName(),
        productionName = vertexName,
        ///
    production = parserUtil.findProduction(productionName, productions);

    return production;
  });

  return productions;
}

function unitRuleProductionsFromProductions(productions) {
  var unitRuleProductions = productions.reduce(function (unitRuleProductions, production) {
    var name = production.getName(),
        unitRulesProduction = UnitRulesProduction.fromProduction(production);

    unitRulesProduction.forEachUnitRule(function (unitRule) {
      var unitRuleProduction = UnitRuleProduction.fromNameAndUnitRule(name, unitRule);

      unitRuleProductions.push(unitRuleProduction);
    });

    return unitRuleProductions;
  }, []);

  return unitRuleProductions;
}

function fixedProductionsFromProductions(productions) {
  var fixedProductions = productions.map(function (production) {
    var nonUnitProduction = NonUnitRulesProduction.fromProduction(production),
        fixedProduction = nonUnitProduction; ///

    return fixedProduction;
  });

  return fixedProductions;
}

function findUnitRuleProduction(productionName, unitRuleProductionName, unitRuleProductions) {
  var firstProductionName = productionName,
      ///
  secondProductionName = unitRuleProductionName; ///

  var foundUnitRuleProduction = null;

  unitRuleProductions.some(function (unitRuleProduction) {
    var unitRuleProductionFound = unitRuleProduction.isFoundByProductionNames(firstProductionName, secondProductionName);

    if (unitRuleProductionFound) {
      foundUnitRuleProduction = unitRuleProduction;

      return true;
    }
  });

  var unitRuleProduction = foundUnitRuleProduction; ///

  return unitRuleProduction;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2VzNi9ncmFtbWFyL2N5Y2xlcy5qcyJdLCJuYW1lcyI6WyJ0YXJqYW4iLCJyZXF1aXJlIiwicGFyc2VyVXRpbCIsIlByb2R1Y3Rpb24iLCJVbml0UnVsZVByb2R1Y3Rpb24iLCJVbml0UnVsZXNQcm9kdWN0aW9uIiwiTm9uVW5pdFJ1bGVzUHJvZHVjdGlvbiIsIkdyYXBoIiwiY3ljbGVzIiwicHJvZHVjdGlvbnMiLCJncmFwaCIsImdyYXBoRnJvbVByb2R1Y3Rpb25zIiwiY29tcG9uZW50cyIsImdlbmVyYXRlQ29tcG9uZW50cyIsIm5vbkN5Y2xpY1Byb2R1Y3Rpb25zIiwibm9uQ3ljbGljUHJvZHVjdGlvbnNGcm9tQ29tcG9uZW50cyIsImFscmVhZHlOb25DeWNsaWNQcm9kdWN0aW9ucyIsImFscmVhZHlOb25DeWNsaWNQcm9kdWN0aW9uc0Zyb21HcmFwaCIsIm1hcCIsInByb2R1Y3Rpb24iLCJwcm9kdWN0aW9uTmFtZSIsImdldE5hbWUiLCJub25DeWNsaWNQcm9kdWN0aW9uIiwiZmluZFByb2R1Y3Rpb24iLCJhbHJlYWR5Tm9uQ3ljbGljUHJvZHVjdGlvbiIsIm1vZHVsZSIsImV4cG9ydHMiLCJ1bml0UnVsZXNQcm9kdWN0aW9ucyIsInVuaXRSdWxlc1Byb2R1Y3Rpb25zRnJvbVByb2R1Y3Rpb25zIiwiZ3JhcGhGcm9tVW5pdFJ1bGVzUHJvZHVjdGlvbnMiLCJyZWR1Y2UiLCJ1bml0UnVsZXNQcm9kdWN0aW9uIiwiZnJvbVByb2R1Y3Rpb24iLCJwdXNoIiwiZm9yRWFjaCIsInByb2R1Y3Rpb25OYW1lcyIsImdldFByb2R1Y3Rpb25OYW1lcyIsInZlcnRleE5hbWUiLCJkZXNjZW5kYW50VmVydGV4TmFtZXMiLCJhZGRWZXJ0ZXgiLCJjb21wb25lbnQiLCJjb21wb25lbnROb25DeWNsaWMiLCJpc05vbkN5Y2xpYyIsIm5vbkN5Y2xpY1Byb2R1Y3Rpb25Gcm9tQ29tcG9uZW50Iiwibm9uQ3ljbGljUHJvZHVjdGlvbnNGcm9tQ29tcG9uZW50IiwiZmlsdGVyIiwidmVydGV4UHJlc2VudCIsImlzVmVydGV4UHJlc2VudCIsInByb2R1Y3Rpb25BbHJlYWR5Tm9uQ3ljbGljIiwiZmlyc3RWZXJ0ZXgiLCJnZXRGaXJzdFZlcnRleCIsImZpcnN0VmVydGV4TmFtZSIsIm5vbkN5Y2xpY1Byb2R1Y3Rpb25OYW1lIiwicHJvZHVjdGlvbnNGcm9tQ29tcG9uZW50IiwiZml4ZWRQcm9kdWN0aW9ucyIsImZpeGVkUHJvZHVjdGlvbnNGcm9tUHJvZHVjdGlvbnMiLCJ1bml0UnVsZVByb2R1Y3Rpb25zIiwidW5pdFJ1bGVQcm9kdWN0aW9uc0Zyb21Qcm9kdWN0aW9ucyIsInJlbW92ZWRQcm9kdWN0aW9ucyIsImFkZGVkUHJvZHVjdGlvbnMiLCJ1bml0UnVsZVByb2R1Y3Rpb25zTGVuZ3RoIiwibGVuZ3RoIiwidW5pdFJ1bGVQcm9kdWN0aW9uIiwic2hpZnQiLCJ1bml0UnVsZVByb2R1Y3Rpb25OYW1lIiwicmVtb3ZlZFByb2R1Y3Rpb24iLCJ1bml0UnVsZVByb2R1Y3Rpb25Vbml0UnVsZVByb2R1Y3Rpb25OYW1lIiwiZ2V0VW5pdFJ1bGVQcm9kdWN0aW9uTmFtZSIsImZpeGVkUHJvZHVjdGlvbk5hbWUiLCJhZGRlZFByb2R1Y3Rpb25OYW1lIiwiZml4ZWRQcm9kdWN0aW9uIiwiYWRkZWRQcm9kdWN0aW9uIiwic2V0TmFtZSIsImZpeGVkUHJvZHVjdGlvblJ1bGVzIiwiZ2V0UnVsZXMiLCJhZGRSdWxlcyIsImludGVybWVkaWF0ZVByb2R1Y3Rpb25OYW1lIiwiaW50ZXJtZWRpYXRlUHJvZHVjdGlvbiIsImludGVybWVkaWF0ZVByb2R1Y3Rpb25Vbml0UnVsZVByb2R1Y3Rpb25OYW1lIiwidW5pdFJ1bGVQcm9kdWN0aW9uTm9uQ3ljbGljIiwiZmluZFVuaXRSdWxlUHJvZHVjdGlvbiIsImZyb21OYW1lQW5kVW5pdFJ1bGVQcm9kdWN0aW9uTmFtZSIsInVuc2hpZnQiLCJub25DeWNsaWNQcm9kdWN0aW9uc0Zyb21GaXhlZEFuZEFkZGVkUHJvZHVjdGlvbnMiLCJhZGRlZFByb2R1Y3Rpb25SdWxlcyIsIm1hcFZlcnRpY2VzIiwidmVydGV4IiwibmFtZSIsImZvckVhY2hVbml0UnVsZSIsInVuaXRSdWxlIiwiZnJvbU5hbWVBbmRVbml0UnVsZSIsIm5vblVuaXRQcm9kdWN0aW9uIiwiZmlyc3RQcm9kdWN0aW9uTmFtZSIsInNlY29uZFByb2R1Y3Rpb25OYW1lIiwiZm91bmRVbml0UnVsZVByb2R1Y3Rpb24iLCJzb21lIiwidW5pdFJ1bGVQcm9kdWN0aW9uRm91bmQiLCJpc0ZvdW5kQnlQcm9kdWN0aW9uTmFtZXMiXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7QUFFQSxJQUFNQSxTQUFTQyxRQUFRLGNBQVIsQ0FBZjs7QUFFQSxJQUFNQyxhQUFhRCxRQUFRLGdCQUFSLENBQW5CO0FBQUEsSUFDTUUsYUFBYUYsUUFBUSxzQkFBUixDQURuQjtBQUFBLElBRU1HLHFCQUFxQkgsUUFBUSx1QkFBUixDQUYzQjtBQUFBLElBR01JLHNCQUFzQkosUUFBUSx3QkFBUixDQUg1QjtBQUFBLElBSU1LLHlCQUF5QkwsUUFBUSwyQkFBUixDQUovQjs7SUFNUU0sSyxHQUFVUCxNLENBQVZPLEs7O0lBRUZDLE07Ozs7Ozs7OEJBQ2FDLFcsRUFBYTtBQUM1QixVQUFNQyxRQUFRQyxxQkFBcUJGLFdBQXJCLENBQWQ7QUFBQSxVQUNNRyxhQUFhRixNQUFNRyxrQkFBTixFQURuQjtBQUFBLFVBRU1DLHVCQUF1QkMsbUNBQW1DSCxVQUFuQyxFQUErQ0gsV0FBL0MsQ0FGN0I7QUFBQSxVQUdNTyw4QkFBOEJDLHFDQUFxQ1AsS0FBckMsRUFBNENELFdBQTVDLENBSHBDOztBQUtBQSxvQkFBY0EsWUFBWVMsR0FBWixDQUFnQixVQUFTQyxVQUFULEVBQXFCO0FBQ2pELFlBQU1DLGlCQUFpQkQsV0FBV0UsT0FBWCxFQUF2QjtBQUFBLFlBQ01DLHNCQUFzQnBCLFdBQVdxQixjQUFYLENBQTBCSCxjQUExQixFQUEwQ04sb0JBQTFDLENBRDVCO0FBQUEsWUFFTVUsNkJBQTZCdEIsV0FBV3FCLGNBQVgsQ0FBMEJI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YW4gPSByZXF1aXJlKCdvY2NhbS10YXJqYW4nKTtcblxuY29uc3QgcGFyc2VyVXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwvcGFyc2VyJyksXG4gICAgICBQcm9kdWN0aW9uID0gcmVxdWlyZSgnLi4vY29tbW9uL3Byb2R1Y3Rpb24nKSxcbiAgICAgIFVuaXRSdWxlUHJvZHVjdGlvbiA9IHJlcXVpcmUoJy4vcHJvZHVjdGlvbi91bml0UnVsZScpLFxuICAgICAgVW5pdFJ1bGVzUHJvZHVjdGlvbiA9IHJlcXVpcmUoJy4vcHJvZHVjdGlvbi91bml0UnVsZXMnKSxcbiAgICAgIE5vblVuaXRSdWxlc1Byb2R1Y3Rpb24gPSByZXF1aXJlKCcuL3Byb2R1Y3Rpb24vbm9uVW5pdFJ1bGVzJyk7XG5cbmNvbnN0IHsgR3JhcGggfSA9IHRhcmphbjtcblxuY2xhc3MgY3ljbGVzIHtcbiAgc3RhdGljIGVsaW1pbmF0ZShwcm9kdWN0aW9ucykge1xuICAgIGNvbnN0IGdyYXBoID0gZ3JhcGhGcm9tUHJvZHVjdGlvbnMocHJvZHVjdGlvbnMpLFxuICAgICAgICAgIGNvbXBvbmVudHMgPSBncmFwaC5nZW5lcmF0ZUNvbXBvbmVudHMoKSxcbiAgICAgICAgICBub25DeWNsaWNQcm9kdWN0aW9ucyA9IG5vbkN5Y2xpY1Byb2R1Y3Rpb25zRnJvbUNvbXBvbmVudHMoY29tcG9uZW50cywgcHJvZHVjdGlvbnMpLFxuICAgICAgICAgIGFscmVhZHlOb25DeWNsaWNQcm9kdWN0aW9ucyA9IGFscmVhZHlOb25DeWNsaWNQcm9kdWN0aW9uc0Zyb21HcmFwaChncmFwaCwgcHJvZHVjdGlvbnMpO1xuXG4gICAgcHJvZHVjdGlvbnMgPSBwcm9kdWN0aW9ucy5tYXAoZnVuY3Rpb24ocHJvZHVjdGlvbikge1xuICAgICAgY29uc3QgcHJvZHVjdGlvbk5hbWUgPSBwcm9kdWN0aW9uLmdldE5hbWUoKSxcbiAgICAgICAgICAgIG5vbkN5Y2xpY1Byb2R1Y3Rpb24gPSBwYXJzZXJVdGlsLmZpbmRQcm9kdWN0aW9uKHByb2R1Y3Rpb25OYW1lLCBub25DeWNsaWNQcm9kdWN0aW9ucyksXG4gICAgICAgICAgICBhbHJlYWR5Tm9uQ3ljbGljUHJvZHVjdGlvbiA9IHBhcnNlclV0aWwuZmluZFByb2R1Y3Rpb24ocHJvZHVjdGlvbk5hbWUsIGFscmVhZHlOb25DeWNsaWNQcm9kdWN0aW9ucyk7XG5cbiAgICAgIHByb2R1Y3Rpb24gPSBub25DeWNsaWNQcm9kdWN0aW9uIHx8IGFscmVhZHlOb25DeWNsaWNQcm9kdWN0aW9uOyAvLy9cblxuICAgICAgcmV0dXJuIHByb2R1Y3Rpb247XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJvZHVjdGlvbnM7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjeWNsZXM7XG5cbmZ1bmN0aW9uIGdyYXBoRnJvbVByb2R1Y3Rpb25zKHByb2R1Y3Rpb25zKSB7XG4gIGNvbnN0IHVuaXRSdWxlc1Byb2R1Y3Rpb25zID0gdW5pdFJ1bGVzUHJvZHVjdGlvbnNGcm9tUHJvZHVjdGlvbnMocHJvZHVjdGlvbnMpLFxuICAgICAgICBncmFwaCA9IGdyYXBoRnJvbVVuaXRSdWxlc1Byb2R1Y3Rpb25zKHVuaXRSdWxlc1Byb2R1Y3Rpb25zKTtcblxuICByZXR1cm4gZ3JhcGg7XG59XG5cbmZ1bmN0aW9uIHVuaXRSdWxlc1Byb2R1Y3Rpb25zRnJvbVByb2R1Y3Rpb25zKHByb2R1Y3Rpb25zKSB7XG4gIGNvbnN0IHVuaXRSdWxlc1Byb2R1Y3Rpb25zID0gcHJvZHVjdGlvbnMucmVkdWNlKGZ1bmN0aW9uKHVuaXRSdWxlc1Byb2R1Y3Rpb25zLCBwcm9kdWN0aW9uKSB7XG4gICAgY29uc3QgdW5pdFJ1bGVzUHJvZHVjdGlvbiA9IFVuaXRSdWxlc1Byb2R1Y3Rpb24uZnJvbVByb2R1Y3Rpb24ocHJvZHVjdGlvbik7XG5cbiAgICBpZiAodW5pdFJ1bGVzUHJvZHVjdGlvbiAhPT0gbnVsbCkge1xuICAgICAgdW5pdFJ1bGVzUHJvZHVjdGlvbnMucHVzaCh1bml0UnVsZXNQcm9kdWN0aW9uKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdW5pdFJ1bGVzUHJvZHVjdGlvbnM7XG4gIH0sIFtdKTtcblxuICByZXR1cm4gdW5pdFJ1bGVzUHJvZHVjdGlvbnM7XG59XG5cbmZ1bmN0aW9uIGdyYXBoRnJvbVVuaXRSdWxlc1Byb2R1Y3Rpb25zKHVuaXRSdWxlc1Byb2R1Y3Rpb25zKSB7XG4gIGNvbnN0IGdyYXBoID0gbmV3IEdyYXBoKCk7XG5cbiAgdW5pdFJ1bGVzUHJvZHVjdGlvbnMuZm9yRWFjaChmdW5jdGlvbih1bml0UnVsZXNQcm9kdWN0aW9uKSB7XG4gICAgY29uc3QgcHJvZHVjdGlvbk5hbWUgPSB1bml0UnVsZXNQcm9kdWN0aW9uLmdldE5hbWUoKSxcbiAgICAgICAgICBwcm9kdWN0aW9uTmFtZXMgPSB1bml0UnVsZXNQcm9kdWN0aW9uLmdldFByb2R1Y3Rpb25OYW1lcygpLFxuICAgICAgICAgIHZlcnRleE5hbWUgPSBwcm9kdWN0aW9uTmFtZSwgIC8vL1xuICAgICAgICAgIGRlc2NlbmRhbnRWZXJ0ZXhOYW1lcyA9IHByb2R1Y3Rpb25OYW1lczsgLy8vXG5cbiAgICBncmFwaC5hZGRWZXJ0ZXgodmVydGV4TmFtZSwgZGVzY2VuZGFudFZlcnRleE5hbWVzKTtcbiAgfSk7XG5cbiAgcmV0dXJuIGdyYXBoO1xufVxuXG5mdW5jdGlvbiBub25DeWNsaWNQcm9kdWN0aW9uc0Zyb21Db21wb25lbnRzKGNvbXBvbmVudHMsIHByb2R1Y3Rpb25zKSB7XG4gIGNvbnN0IG5vbkN5Y2xpY1Byb2R1Y3Rpb25zID0gY29tcG9uZW50cy5yZWR1Y2UoZnVuY3Rpb24obm9uQ3ljbGljUHJvZHVjdGlvbnMsIGNvbXBvbmVudCkge1xuICAgICAgICAgIGNvbnN0IGNvbXBvbmVudE5vbkN5Y2xpYyA9IGNvbXBvbmVudC5pc05vbkN5Y2xpYygpO1xuXG4gICAgICAgICAgaWYgKGNvbXBvbmVudE5vbkN5Y2xpYykge1xuICAgICAgICAgICAgbm9uQ3ljbGljUHJvZHVjdGlvbkZyb21Db21wb25lbnQoY29tcG9uZW50LCBwcm9kdWN0aW9ucywgbm9uQ3ljbGljUHJvZHVjdGlvbnMpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBub25DeWNsaWNQcm9kdWN0aW9uc0Zyb21Db21wb25lbnQoY29tcG9uZW50LCBwcm9kdWN0aW9ucywgbm9uQ3ljbGljUHJvZHVjdGlvbnMpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBub25DeWNsaWNQcm9kdWN0aW9ucztcbiAgICAgICAgfSwgW10pO1xuXG4gIHJldHVybiBub25DeWNsaWNQcm9kdWN0aW9ucztcbn1cblxuZnVuY3Rpb24gYWxyZWFkeU5vbkN5Y2xpY1Byb2R1Y3Rpb25zRnJvbUdyYXBoKGdyYXBoLCBwcm9kdWN0aW9ucykge1xuICBjb25zdCBhbHJlYWR5Tm9uQ3ljbGljUHJvZHVjdGlvbnMgPSBwcm9kdWN0aW9ucy5maWx0ZXIoZnVuY3Rpb24ocHJvZHVjdGlvbikge1xuICAgIGNvbnN0IHByb2R1Y3Rpb25OYW1lID0gcHJvZHVjdGlvbi5nZXROYW1lKCksXG4gICAgICAgICAgdmVydGV4TmFtZSA9IHByb2R1Y3Rpb25OYW1lLCAgLy8vXG4gICAgICAgICAgdmVydGV4UHJlc2VudCA9IGdyYXBoLmlzVmVydGV4UHJlc2VudCh2ZXJ0ZXhOYW1lKSxcbiAgICAgICAgICBwcm9kdWN0aW9uQWxyZWFkeU5vbkN5Y2xpYyA9ICF2ZXJ0ZXhQcmVzZW50OyAvLy9cbiAgICBcbiAgICByZXR1cm4gcHJvZHVjdGlvbkFscmVhZHlOb25DeWNsaWM7XG4gIH0pO1xuXG4gIHJldHVybiBhbHJlYWR5Tm9uQ3ljbGljUHJvZHVjdGlvbnM7XG59XG5cbmZ1bmN0aW9uIG5vbkN5Y2xpY1Byb2R1Y3Rpb25Gcm9tQ29tcG9uZW50KGNvbXBvbmVudCwgcHJvZHVjdGlvbnMsIG5vbkN5Y2xpY1Byb2R1Y3Rpb25zKSB7XG4gIGNvbnN0IGZpcnN0VmVydGV4ID0gY29tcG9uZW50LmdldEZpcnN0VmVydGV4KCksXG4gICAgICAgIGZpcnN0VmVydGV4TmFtZSA9IGZpcnN0VmVydGV4LmdldE5hbWUoKSxcbiAgICAgICAgbm9uQ3ljbGljUHJvZHVjdGlvbk5hbWUgPSBmaXJzdFZlcnRleE5hbWUsICAvLy9cbiAgICAgICAgbm9uQ3ljbGljUHJvZHVjdGlvbiA9IHBhcnNlclV0aWwuZmluZFByb2R1Y3Rpb24obm9uQ3ljbGljUHJvZHVjdGlvbk5hbWUsIHByb2R1Y3Rpb25zKTtcblxuICBub25DeWNsaWNQcm9kdWN0aW9ucy5wdXNoKG5vbkN5Y2xpY1Byb2R1Y3Rpb24pO1xufVxuXG5mdW5jdGlvbiBub25DeWNsaWNQcm9kdWN0aW9uc0Zyb21Db21wb25lbnQoY29tcG9uZW50LCBwcm9kdWN0aW9ucywgbm9uQ3ljbGljUHJvZHVjdGlvbnMpIHtcbiAgcHJvZHVjdGlvbnMgPSBwcm9kdWN0aW9uc0Zyb21Db21wb25lbnQoY29tcG9uZW50LCBwcm9kdWN0aW9ucyk7IC8vL1xuXG4gIGNvbnN0IGZpeGVkUHJvZHVjdGlvbnMgPSBmaXhlZFByb2R1Y3Rpb25zRnJvbVByb2R1Y3Rpb25zKHByb2R1Y3Rpb25zKSxcbiAgICAgICAgdW5pdFJ1bGVQcm9kdWN0aW9ucyA9IHVuaXRSdWxlUHJvZHVjdGlvbnNGcm9tUHJvZHVjdGlvbnMocHJvZHVjdGlvbnMpLFxuICAgICAgICByZW1vdmVkUHJvZHVjdGlvbnMgPSBbXSxcbiAgICAgICAgYWRkZWRQcm9kdWN0aW9ucyA9IFtdO1xuXG4gIGxldCB1bml0UnVsZVByb2R1Y3Rpb25zTGVuZ3RoID0gdW5pdFJ1bGVQcm9kdWN0aW9ucy5sZW5ndGg7XG5cbiAgd2hpbGUgKHVuaXRSdWxlUHJvZHVjdGlvbnNMZW5ndGggPiAwKSB7XG4gICAgbGV0IHVuaXRSdWxlUHJvZHVjdGlvbiA9IHVuaXRSdWxlUHJvZHVjdGlvbnMuc2hpZnQoKSxcbiAgICAgICAgdW5pdFJ1bGVQcm9kdWN0aW9uTmFtZSA9IHVuaXRSdWxlUHJvZHVjdGlvbi5nZXROYW1lKCk7XG5cbiAgICBjb25zdCByZW1vdmVkUHJvZHVjdGlvbiA9IHVuaXRSdWxlUHJvZHVjdGlvbjtcblxuICAgIHJlbW92ZWRQcm9kdWN0aW9ucy5wdXNoKHJlbW92ZWRQcm9kdWN0aW9uKTtcblxuICAgIGNvbnN0IHVuaXRSdWxlUHJvZHVjdGlvblVuaXRSdWxlUHJvZHVjdGlvbk5hbWUgPSB1bml0UnVsZVByb2R1Y3Rpb24uZ2V0VW5pdFJ1bGVQcm9kdWN0aW9uTmFtZSgpLFxuICAgICAgICAgIGZpeGVkUHJvZHVjdGlvbk5hbWUgPSB1bml0UnVsZVByb2R1Y3Rpb25Vbml0UnVsZVByb2R1Y3Rpb25OYW1lLCAgLy8vXG4gICAgICAgICAgYWRkZWRQcm9kdWN0aW9uTmFtZSA9IHVuaXRSdWxlUHJvZHVjdGlvbk5hbWUsICAvLy9cbiAgICAgICAgICBmaXhlZFByb2R1Y3Rpb24gPSBwYXJzZXJVdGlsLmZpbmRQcm9kdWN0aW9uKGZpeGVkUHJvZHVjdGlvbk5hbWUsIGZpeGVkUHJvZHVjdGlvbnMpO1xuXG4gICAgbGV0IGFkZGVkUHJvZHVjdGlvbiA9IHBhcnNlclV0aWwuZmluZFByb2R1Y3Rpb24oYWRkZWRQcm9kdWN0aW9uTmFtZSwgYWRkZWRQcm9kdWN0aW9ucyk7XG5cbiAgICBpZiAoYWRkZWRQcm9kdWN0aW9uID09PSBudWxsKSB7XG4gICAgICBhZGRlZFByb2R1Y3Rpb24gPSBQcm9kdWN0aW9uLmZyb21Qcm9kdWN0aW9uKGZpeGVkUHJvZHVjdGlvbik7XG5cbiAgICAgIGFkZGVkUHJvZHVjdGlvbi5zZXROYW1lKGFkZGVkUHJvZHVjdGlvbk5hbWUpO1xuXG4gICAgICBhZGRlZFByb2R1Y3Rpb25zLnB1c2goYWRkZWRQcm9kdWN0aW9uKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgZml4ZWRQcm9kdWN0aW9uUnVsZXMgPSBmaXhlZFByb2R1Y3Rpb24uZ2V0UnVsZXMoKTtcblxuICAgICAgYWRkZWRQcm9kdWN0aW9uLmFkZFJ1bGVzKGZpeGVkUHJvZHVjdGlvblJ1bGVzKTtcbiAgICB9XG5cbiAgICBjb25zdCBpbnRlcm1lZGlhdGVQcm9kdWN0aW9uTmFtZSA9IHVuaXRSdWxlUHJvZHVjdGlvblVuaXRSdWxlUHJvZHVjdGlvbk5hbWUsIC8vL1xuICAgICAgICAgIGludGVybWVkaWF0ZVByb2R1Y3Rpb24gPSBwYXJzZXJVdGlsLmZpbmRQcm9kdWN0aW9uKGludGVybWVkaWF0ZVByb2R1Y3Rpb25OYW1lLCB1bml0UnVsZVByb2R1Y3Rpb25zKTtcblxuICAgIGlmIChpbnRlcm1lZGlhdGVQcm9kdWN0aW9uICE9PSBudWxsKSB7XG4gICAgICBjb25zdCBpbnRlcm1lZGlhdGVQcm9kdWN0aW9uVW5pdFJ1bGVQcm9kdWN0aW9uTmFtZSA9IGludGVybWVkaWF0ZVByb2R1Y3Rpb24uZ2V0VW5pdFJ1bGVQcm9kdWN0aW9uTmFtZSgpLFxuICAgICAgICAgICAgdW5pdFJ1bGVQcm9kdWN0aW9uVW5pdFJ1bGVQcm9kdWN0aW9uTmFtZSA9IGludGVybWVkaWF0ZVByb2R1Y3Rpb25Vbml0UnVsZVByb2R1Y3Rpb25OYW1lLCAgLy8vXG4gICAgICAgICAgICB1bml0UnVsZVByb2R1Y3Rpb25Ob25DeWNsaWMgPSAodW5pdFJ1bGVQcm9kdWN0aW9uTmFtZSAhPT0gdW5pdFJ1bGVQcm9kdWN0aW9uVW5pdFJ1bGVQcm9kdWN0aW9uTmFtZSk7XG5cbiAgICAgIGlmICh1bml0UnVsZVByb2R1Y3Rpb25Ob25DeWNsaWMpIHtcbiAgICAgICAgdW5pdFJ1bGVQcm9kdWN0aW9uID0gZmluZFVuaXRSdWxlUHJvZHVjdGlvbih1bml0UnVsZVByb2R1Y3Rpb25OYW1lLCB1bml0UnVsZVByb2R1Y3Rpb25Vbml0UnVsZVByb2R1Y3Rpb25OYW1lLCByZW1vdmVkUHJvZHVjdGlvbnMpO1xuXG4gICAgICAgIGlmICh1bml0UnVsZVByb2R1Y3Rpb24gPT09IG51bGwpIHtcbiAgICAgICAgICB1bml0UnVsZVByb2R1Y3Rpb24gPSBVbml0UnVsZVByb2R1Y3Rpb24uZnJvbU5hbWVBbmRVbml0UnVsZVByb2R1Y3Rpb25OYW1lKHVuaXRSdWxlUHJvZHVjdGlvbk5hbWUsIHVuaXRSdWxlUHJvZHVjdGlvblVuaXRSdWxlUHJvZHVjdGlvbk5hbWUpO1xuXG4gICAgICAgICAgdW5pdFJ1bGVQcm9kdWN0aW9ucy51bnNoaWZ0KHVuaXRSdWxlUHJvZHVjdGlvbik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB1bml0UnVsZVByb2R1Y3Rpb25zTGVuZ3RoID0gdW5pdFJ1bGVQcm9kdWN0aW9ucy5sZW5ndGg7XG4gIH1cblxuICBub25DeWNsaWNQcm9kdWN0aW9uc0Zyb21GaXhlZEFuZEFkZGVkUHJvZHVjdGlvbnMoZml4ZWRQcm9kdWN0aW9ucywgYWRkZWRQcm9kdWN0aW9ucywgbm9uQ3ljbGljUHJvZHVjdGlvbnMpO1xufVxuXG5mdW5jdGlvbiBub25DeWNsaWNQcm9kdWN0aW9uc0Zyb21GaXhlZEFuZEFkZGVkUHJvZHVjdGlvbnMoZml4ZWRQcm9kdWN0aW9ucywgYWRkZWRQcm9kdWN0aW9ucywgbm9uQ3ljbGljUHJvZHVjdGlvbnMpIHtcbiAgZml4ZWRQcm9kdWN0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKGZpeGVkUHJvZHVjdGlvbikge1xuICAgIGNvbnN0IG5vbkN5Y2xpY1Byb2R1Y3Rpb24gPSBmaXhlZFByb2R1Y3Rpb24sIC8vL1xuICAgICAgICAgIG5vbkN5Y2xpY1Byb2R1Y3Rpb25OYW1lID0gbm9uQ3ljbGljUHJvZHVjdGlvbi5nZXROYW1lKCksXG4gICAgICAgICAgYWRkZWRQcm9kdWN0aW9uTmFtZSA9IG5vbkN5Y2xpY1Byb2R1Y3Rpb25OYW1lLCAvLy9cbiAgICAgICAgICBhZGRlZFByb2R1Y3Rpb24gPSBwYXJzZXJVdGlsLmZpbmRQcm9kdWN0aW9uKGFkZGVkUHJvZHVjdGlvbk5hbWUsIGFkZGVkUHJvZHVjdGlvbnMpO1xuXG4gICAgaWYgKGFkZGVkUHJvZHVjdGlvbiAhPT0gbnVsbCkge1xuICAgICAgY29uc3QgYWRkZWRQcm9kdWN0aW9uUnVsZXMgPSBhZGRlZFByb2R1Y3Rpb24uZ2V0UnVsZXMoKTtcblxuICAgICAgbm9uQ3ljbGljUHJvZHVjdGlvbi5hZGRSdWxlcyhhZGRlZFByb2R1Y3Rpb25SdWxlcyk7XG4gICAgfVxuXG4gICAgbm9uQ3ljbGljUHJvZHVjdGlvbnMucHVzaChub25DeWNsaWNQcm9kdWN0aW9uKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHByb2R1Y3Rpb25zRnJvbUNvbXBvbmVudChjb21wb25lbnQsIHByb2R1Y3Rpb25zKSB7XG4gIHByb2R1Y3Rpb25zID0gY29tcG9uZW50Lm1hcFZlcnRpY2VzKGZ1bmN0aW9uKHZlcnRleCkge1xuICAgIGNvbnN0IHZlcnRleE5hbWUgPSB2ZXJ0ZXguZ2V0TmFtZSgpLFxuICAgICAgICAgIHByb2R1Y3Rpb25OYW1lID0gdmVydGV4TmFtZSwgIC8vL1xuICAgICAgICAgIHByb2R1Y3Rpb24gPSBwYXJzZXJVdGlsLmZpbmRQcm9kdWN0aW9uKHByb2R1Y3Rpb25OYW1lLCBwcm9kdWN0aW9ucyk7XG5cbiAgICByZXR1cm4gcHJvZHVjdGlvbjtcbiAgfSk7XG5cbiAgcmV0dXJuIHByb2R1Y3Rpb25zO1xufVxuXG5mdW5jdGlvbiB1bml0UnVsZVByb2R1Y3Rpb25zRnJvbVByb2R1Y3Rpb25zKHByb2R1Y3Rpb25zKSB7XG4gIGNvbnN0IHVuaXRSdWxlUHJvZHVjdGlvbnMgPSBwcm9kdWN0aW9ucy5yZWR1Y2UoZnVuY3Rpb24odW5pdFJ1bGVQcm9kdWN0aW9ucywgcHJvZHVjdGlvbikge1xuICAgIGNvbnN0IG5hbWUgPSBwcm9kdWN0aW9uLmdldE5hbWUoKSxcbiAgICAgICAgICB1bml0UnVsZXNQcm9kdWN0aW9uID0gVW5pdFJ1bGVzUHJvZHVjdGlvbi5mcm9tUHJvZHVjdGlvbihwcm9kdWN0aW9uKTtcblxuICAgIHVuaXRSdWxlc1Byb2R1Y3Rpb24uZm9yRWFjaFVuaXRSdWxlKGZ1bmN0aW9uKHVuaXRSdWxlKSB7XG4gICAgICBjb25zdCB1bml0UnVsZVByb2R1Y3Rpb24gPSBVbml0UnVsZVByb2R1Y3Rpb24uZnJvbU5hbWVBbmRVbml0UnVsZShuYW1lLCB1bml0UnVsZSk7XG5cbiAgICAgIHVuaXRSdWxlUHJvZHVjdGlvbnMucHVzaCh1bml0UnVsZVByb2R1Y3Rpb24pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHVuaXRSdWxlUHJvZHVjdGlvbnM7XG4gIH0sIFtdKTtcblxuICByZXR1cm4gdW5pdFJ1bGVQcm9kdWN0aW9ucztcbn1cblxuZnVuY3Rpb24gZml4ZWRQcm9kdWN0aW9uc0Zyb21Qcm9kdWN0aW9ucyhwcm9kdWN0aW9ucykge1xuICBjb25zdCBmaXhlZFByb2R1Y3Rpb25zID0gcHJvZHVjdGlvbnMubWFwKGZ1bmN0aW9uKHByb2R1Y3Rpb24pIHtcbiAgICBjb25zdCBub25Vbml0UHJvZHVjdGlvbiA9IE5vblVuaXRSdWxlc1Byb2R1Y3Rpb24uZnJvbVByb2R1Y3Rpb24ocHJvZHVjdGlvbiksXG4gICAgICAgICAgZml4ZWRQcm9kdWN0aW9uID0gbm9uVW5pdFByb2R1Y3Rpb247IC8vL1xuICAgIFxuICAgIHJldHVybiBmaXhlZFByb2R1Y3Rpb247XG4gIH0pO1xuICBcbiAgcmV0dXJuIGZpeGVkUHJvZHVjdGlvbnM7XG59XG5cbmZ1bmN0aW9uIGZpbmRVbml0UnVsZVByb2R1Y3Rpb24ocHJvZHVjdGlvbk5hbWUsIHVuaXRSdWxlUHJvZHVjdGlvbk5hbWUsIHVuaXRSdWxlUHJvZHVjdGlvbnMpIHtcbiAgY29uc3QgZmlyc3RQcm9kdWN0aW9uTmFtZSA9IHByb2R1Y3Rpb25OYW1lLCAvLy9cbiAgICAgICAgc2Vjb25kUHJvZHVjdGlvbk5hbWUgPSB1bml0UnVsZVByb2R1Y3Rpb25OYW1lOyAgLy8vXG5cbiAgbGV0IGZvdW5kVW5pdFJ1bGVQcm9kdWN0aW9uID0gbnVsbDtcblxuICB1bml0UnVsZVByb2R1Y3Rpb25zLnNvbWUoZnVuY3Rpb24odW5pdFJ1bGVQcm9kdWN0aW9uKSB7XG4gICAgY29uc3QgdW5pdFJ1bGVQcm9kdWN0aW9uRm91bmQgPSB1bml0UnVsZVByb2R1Y3Rpb24uaXNGb3VuZEJ5UHJvZHVjdGlvbk5hbWVzKGZpcnN0UHJvZHVjdGlvbk5hbWUsIHNlY29uZFByb2R1Y3Rpb25OYW1lKTtcblxuICAgIGlmICh1bml0UnVsZVByb2R1Y3Rpb25Gb3VuZCkge1xuICAgICAgZm91bmRVbml0UnVsZVByb2R1Y3Rpb24gPSB1bml0UnVsZVByb2R1Y3Rpb247XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfSk7XG5cbiAgY29uc3QgdW5pdFJ1bGVQcm9kdWN0aW9uID0gZm91bmRVbml0UnVsZVByb2R1Y3Rpb247IC8vL1xuXG4gIHJldHVybiB1bml0UnVsZVByb2R1Y3Rpb247XG59XG4iXX0=