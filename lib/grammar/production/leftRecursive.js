'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Production = require('../../common/production'),
    LeftRecursiveRule = require('../rule/leftRecursive'),
    ImplicitlyLeftRecursiveRule = require('../rule/implicitlyLeftRecursive');

var LeftRecursiveProduction = function (_Production) {
  _inherits(LeftRecursiveProduction, _Production);

  function LeftRecursiveProduction() {
    _classCallCheck(this, LeftRecursiveProduction);

    return _possibleConstructorReturn(this, (LeftRecursiveProduction.__proto__ || Object.getPrototypeOf(LeftRecursiveProduction)).apply(this, arguments));
  }

  _createClass(LeftRecursiveProduction, [{
    key: 'getLeftRecursiveRules',
    value: function getLeftRecursiveRules() {
      var name = this.getName(),
          rules = this.getRules(),
          productionName = name,
          ///
      leftRecursiveRules = rules.filter(function (rule) {
        var leftRecursiveRule = LeftRecursiveRule.fromRuleAndProductionName(rule, productionName),
            ruleLeftRecursive = leftRecursiveRule !== null;

        return ruleLeftRecursive;
      });

      return leftRecursiveRules;
    }
  }, {
    key: 'getNonLeftRecursiveRules',
    value: function getNonLeftRecursiveRules() {
      var name = this.getName(),
          rules = this.getRules(),
          productionName = name,
          ///
      nonLeftRecursiveRules = rules.filter(function (rule) {
        var leftRecursiveRule = LeftRecursiveRule.fromRuleAndProductionName(rule, productionName),
            ruleNonLeftRecursive = leftRecursiveRule === null;

        return ruleNonLeftRecursive;
      });

      return nonLeftRecursiveRules;
    }
  }], [{
    key: 'fromProduction',
    value: function fromProduction(production) {
      var leftRecursiveProduction = null;

      var productionName = production.getName(),
          productionRules = production.getRules(),
          someProductionRuleLeftRecursive = productionRules.some(function (productionRule) {
        var rule = productionRule,
            ///
        leftRecursiveRule = LeftRecursiveRule.fromRuleAndProductionName(rule, productionName),
            productionRuleLeftRecursive = leftRecursiveRule !== null;

        return productionRuleLeftRecursive;
      });

      if (someProductionRuleLeftRecursive) {
        leftRecursiveProduction = Production.fromProduction(production, LeftRecursiveProduction);
      }

      return leftRecursiveProduction;
    }
  }, {
    key: 'fromImplicitlyLeftRecursiveProductionAndPreviousProductions',
    value: function fromImplicitlyLeftRecursiveProductionAndPreviousProductions(implicitlyLeftRecursiveProduction, previousProductions) {
      var name = implicitlyLeftRecursiveProduction.getName(),
          Node = implicitlyLeftRecursiveProduction.getNode();

      var rules = implicitlyLeftRecursiveProduction.getRules();

      previousProductions.forEach(function (previousProduction) {
        var leftRecursiveRules = leftRecursiveRulesFromRulesAndPreviousProduction(rules, previousProduction);

        rules = leftRecursiveRules;
      });

      var leftRecursiveProduction = new LeftRecursiveProduction(name, rules, Node);

      return leftRecursiveProduction;
    }
  }]);

  return LeftRecursiveProduction;
}(Production);

module.exports = LeftRecursiveProduction;

function leftRecursiveRulesFromRulesAndPreviousProduction(rules, previousProduction) {
  var leftRecursiveRules = [];

  rules.forEach(function (rule) {
    var implicitlyLeftRecursiveRule = ImplicitlyLeftRecursiveRule.fromRuleAndPreviousProduction(rule, previousProduction);

    if (implicitlyLeftRecursiveRule === null) {
      var leftRecursiveRule = rule; ///

      leftRecursiveRules.push(leftRecursiveRule);
    } else {
      leftRecursiveRules = leftRecursiveRules.concat(leftRecursiveRulesFromImplicitlyLeftRecursiveRuleAndPreviousProduction(implicitlyLeftRecursiveRule, previousProduction)); ///
    }
  });

  return leftRecursiveRules;
}

function leftRecursiveRulesFromImplicitlyLeftRecursiveRuleAndPreviousProduction(implicitlyLeftRecursiveRule, previousProduction) {
  var previousProductionRules = previousProduction.getRules(),
      implicitlyLeftRecursiveRuleAllButFirstParts = implicitlyLeftRecursiveRule.getAllButFirstParts(),
      leftRecursiveRules = previousProductionRules.map(function (previousProductionRule) {
    var previousProductionRuleParts = previousProductionRule.getParts(),
        leftRecursiveRuleParts = [].concat(previousProductionRuleParts).concat(implicitlyLeftRecursiveRuleAllButFirstParts),
        leftRecursiveRule = new LeftRecursiveRule(leftRecursiveRuleParts);

    return leftRecursiveRule;
  });

  return leftRecursiveRules;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2VzNi9ncmFtbWFyL3Byb2R1Y3Rpb24vbGVmdFJlY3Vyc2l2ZS5qcyJdLCJuYW1lcyI6WyJQcm9kdWN0aW9uIiwicmVxdWlyZSIsIkxlZnRSZWN1cnNpdmVSdWxlIiwiSW1wbGljaXRseUxlZnRSZWN1cnNpdmVSdWxlIiwiTGVmdFJlY3Vyc2l2ZVByb2R1Y3Rpb24iLCJuYW1lIiwiZ2V0TmFtZSIsInJ1bGVzIiwiZ2V0UnVsZXMiLCJwcm9kdWN0aW9uTmFtZSIsImxlZnRSZWN1cnNpdmVSdWxlcyIsImZpbHRlciIsInJ1bGUiLCJsZWZ0UmVjdXJzaXZlUnVsZSIsImZyb21SdWxlQW5kUHJvZHVjdGlvbk5hbWUiLCJydWxlTGVmdFJlY3Vyc2l2ZSIsIm5vbkxlZnRSZWN1cnNpdmVSdWxlcyIsInJ1bGVOb25MZWZ0UmVjdXJzaXZlIiwicHJvZHVjdGlvbiIsImxlZnRSZWN1cnNpdmVQcm9kdWN0aW9uIiwicHJvZHVjdGlvblJ1bGVzIiwic29tZVByb2R1Y3Rpb25SdWxlTGVmdFJlY3Vyc2l2ZSIsInNvbWUiLCJwcm9kdWN0aW9uUnVsZSIsInByb2R1Y3Rpb25SdWxlTGVmdFJlY3Vyc2l2ZSIsImZyb21Qcm9kdWN0aW9uIiwiaW1wbGljaXRseUxlZnRSZWN1cnNpdmVQcm9kdWN0aW9uIiwicHJldmlvdXNQcm9kdWN0aW9ucyIsIk5vZGUiLCJnZXROb2RlIiwiZm9yRWFjaCIsInByZXZpb3VzUHJvZHVjdGlvbiIsImxlZnRSZWN1cnNpdmVSdWxlc0Zyb21SdWxlc0FuZFByZXZpb3VzUHJvZHVjdGlvbiIsIm1vZHVsZSIsImV4cG9ydHMiLCJpbXBsaWNpdGx5TGVmdFJlY3Vyc2l2ZVJ1bGUiLCJmcm9tUnVsZUFuZFByZXZpb3VzUHJvZHVjdGlvbiIsInB1c2giLCJjb25jYXQiLCJsZWZ0UmVjdXJzaXZlUnVsZXNGcm9tSW1wbGljaXRseUxlZnRSZWN1cnNpdmVSdWxlQW5kUHJldmlvdXNQcm9kdWN0aW9uIiwicHJldmlvdXNQcm9kdWN0aW9uUnVsZXMiLCJpbXBsaWNpdGx5TGVmdFJlY3Vyc2l2ZVJ1bGVBbGxCdXRGaXJzdFBhcnRzIiwiZ2V0QWxsQnV0Rmlyc3RQYXJ0cyIsIm1hcCIsInByZXZpb3VzUHJvZHVjdGlvblJ1bGUiLCJwcmV2aW91c1Byb2R1Y3Rpb25SdWxlUGFydHMiLCJnZXRQYXJ0cyIsImxlZnRSZWN1cnNpdmVSdWxlUGFydHMiXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7O0FBRUEsSUFBTUEsYUFBYUMsUUFBUSx5QkFBUixDQUFuQjtBQUFBLElBQ01DLG9CQUFvQkQsUUFBUSx1QkFBUixDQUQxQjtBQUFBLElBRU1FLDhCQUE4QkYsUUFBUSxpQ0FBUixDQUZwQzs7SUFJTUcsdUI7Ozs7Ozs7Ozs7OzRDQUNvQjtBQUN0QixVQUFNQyxPQUFPLEtBQUtDLE9BQUwsRUFBYjtBQUFBLFVBQ01DLFFBQVEsS0FBS0MsUUFBTCxFQURkO0FBQUEsVUFFTUMsaUJBQWlCSixJQUZ2QjtBQUFBLFVBRThCO0FBQ3hCSywyQkFBcUJILE1BQU1JLE1BQU4sQ0FBYSxVQUFTQyxJQUFULEVBQWU7QUFDL0MsWUFBTUMsb0JBQW9CWCxrQkFBa0JZLHlCQUFsQixDQUE0Q0YsSUFBNUMsRUFBa0RILGNBQWxELENBQTFCO0FBQUEsWUFDTU0sb0JBQXFCRixzQkFBc0IsSUFEakQ7O0FBR0EsZUFBT0UsaUJBQVA7QUFDRCxPQUxvQixDQUgzQjs7QUFVQSxhQUFPTCxrQkFBUDtBQUNEOzs7K0NBRTBCO0FBQ3pCLFVBQU1MLE9BQU8sS0FBS0MsT0FBTCxFQUFiO0FBQUEsVUFDTUMsUUFBUSxLQUFLQyxRQUFMLEVBRGQ7QUFBQSxVQUVNQyxpQkFBaUJKLElBRnZCO0FBQUEsVUFFOEI7QUFDeEJXLDhCQUF3QlQsTUFBTUksTUFBTixDQUFhLFVBQVNDLElBQVQsRUFBZTtBQUNsRCxZQUFNQyxvQkFBb0JYLGtCQUFrQlkseUJBQWxCLENBQTRDRixJQUE1QyxFQUFrREgsY0FBbEQsQ0FBMUI7QUFBQSxZQUNNUSx1QkFBd0JKLHNCQUFzQixJQURwRDs7QUFHQSxlQUFP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ZnRSZWN1cnNpdmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbmNvbnN0IFByb2R1Y3Rpb24gPSByZXF1aXJlKCcuLi8uLi9jb21tb24vcHJvZHVjdGlvbicpLFxuICAgICAgTGVmdFJlY3Vyc2l2ZVJ1bGUgPSByZXF1aXJlKCcuLi9ydWxlL2xlZnRSZWN1cnNpdmUnKSxcbiAgICAgIEltcGxpY2l0bHlMZWZ0UmVjdXJzaXZlUnVsZSA9IHJlcXVpcmUoJy4uL3J1bGUvaW1wbGljaXRseUxlZnRSZWN1cnNpdmUnKTtcblxuY2xhc3MgTGVmdFJlY3Vyc2l2ZVByb2R1Y3Rpb24gZXh0ZW5kcyBQcm9kdWN0aW9uIHtcbiAgZ2V0TGVmdFJlY3Vyc2l2ZVJ1bGVzKCkge1xuICAgIGNvbnN0IG5hbWUgPSB0aGlzLmdldE5hbWUoKSxcbiAgICAgICAgICBydWxlcyA9IHRoaXMuZ2V0UnVsZXMoKSxcbiAgICAgICAgICBwcm9kdWN0aW9uTmFtZSA9IG5hbWUsICAvLy9cbiAgICAgICAgICBsZWZ0UmVjdXJzaXZlUnVsZXMgPSBydWxlcy5maWx0ZXIoZnVuY3Rpb24ocnVsZSkge1xuICAgICAgICAgICAgY29uc3QgbGVmdFJlY3Vyc2l2ZVJ1bGUgPSBMZWZ0UmVjdXJzaXZlUnVsZS5mcm9tUnVsZUFuZFByb2R1Y3Rpb25OYW1lKHJ1bGUsIHByb2R1Y3Rpb25OYW1lKSxcbiAgICAgICAgICAgICAgICAgIHJ1bGVMZWZ0UmVjdXJzaXZlID0gKGxlZnRSZWN1cnNpdmVSdWxlICE9PSBudWxsKTtcbiAgXG4gICAgICAgICAgICByZXR1cm4gcnVsZUxlZnRSZWN1cnNpdmU7XG4gICAgICAgICAgfSk7XG5cbiAgICByZXR1cm4gbGVmdFJlY3Vyc2l2ZVJ1bGVzO1xuICB9XG5cbiAgZ2V0Tm9uTGVmdFJlY3Vyc2l2ZVJ1bGVzKCkge1xuICAgIGNvbnN0IG5hbWUgPSB0aGlzLmdldE5hbWUoKSxcbiAgICAgICAgICBydWxlcyA9IHRoaXMuZ2V0UnVsZXMoKSxcbiAgICAgICAgICBwcm9kdWN0aW9uTmFtZSA9IG5hbWUsICAvLy9cbiAgICAgICAgICBub25MZWZ0UmVjdXJzaXZlUnVsZXMgPSBydWxlcy5maWx0ZXIoZnVuY3Rpb24ocnVsZSkge1xuICAgICAgICAgICAgY29uc3QgbGVmdFJlY3Vyc2l2ZVJ1bGUgPSBMZWZ0UmVjdXJzaXZlUnVsZS5mcm9tUnVsZUFuZFByb2R1Y3Rpb25OYW1lKHJ1bGUsIHByb2R1Y3Rpb25OYW1lKSxcbiAgICAgICAgICAgICAgICAgIHJ1bGVOb25MZWZ0UmVjdXJzaXZlID0gKGxlZnRSZWN1cnNpdmVSdWxlID09PSBudWxsKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIHJ1bGVOb25MZWZ0UmVjdXJzaXZlO1xuICAgICAgICAgIH0pO1xuXG4gICAgcmV0dXJuIG5vbkxlZnRSZWN1cnNpdmVSdWxlcztcbiAgfVxuXG4gIHN0YXRpYyBmcm9tUHJvZHVjdGlvbihwcm9kdWN0aW9uKSB7XG4gICAgbGV0IGxlZnRSZWN1cnNpdmVQcm9kdWN0aW9uID0gbnVsbDtcbiAgICBcbiAgICBjb25zdCBwcm9kdWN0aW9uTmFtZSA9IHByb2R1Y3Rpb24uZ2V0TmFtZSgpLFxuICAgICAgICAgIHByb2R1Y3Rpb25SdWxlcyA9IHByb2R1Y3Rpb24uZ2V0UnVsZXMoKSxcbiAgICAgICAgICBzb21lUHJvZHVjdGlvblJ1bGVMZWZ0UmVjdXJzaXZlID0gcHJvZHVjdGlvblJ1bGVzLnNvbWUoZnVuY3Rpb24ocHJvZHVjdGlvblJ1bGUpIHtcbiAgICAgICAgICAgIGNvbnN0IHJ1bGUgPSBwcm9kdWN0aW9uUnVsZSwgLy8vXG4gICAgICAgICAgICAgICAgICBsZWZ0UmVjdXJzaXZlUnVsZSA9IExlZnRSZWN1cnNpdmVSdWxlLmZyb21SdWxlQW5kUHJvZHVjdGlvbk5hbWUocnVsZSwgcHJvZHVjdGlvbk5hbWUpLFxuICAgICAgICAgICAgICAgICAgcHJvZHVjdGlvblJ1bGVMZWZ0UmVjdXJzaXZlID0gKGxlZnRSZWN1cnNpdmVSdWxlICE9PSBudWxsKTtcblxuICAgICAgICAgICAgcmV0dXJuIHByb2R1Y3Rpb25SdWxlTGVmdFJlY3Vyc2l2ZTtcbiAgICAgICAgICB9KTtcblxuICAgIGlmIChzb21lUHJvZHVjdGlvblJ1bGVMZWZ0UmVjdXJzaXZlKSB7XG4gICAgICBsZWZ0UmVjdXJzaXZlUHJvZHVjdGlvbiA9IFByb2R1Y3Rpb24uZnJvbVByb2R1Y3Rpb24ocHJvZHVjdGlvbiwgTGVmdFJlY3Vyc2l2ZVByb2R1Y3Rpb24pO1xuICAgIH1cbiAgICBcbiAgICByZXR1cm4gbGVmdFJlY3Vyc2l2ZVByb2R1Y3Rpb247XG4gIH1cbiAgXG4gIHN0YXRpYyBmcm9tSW1wbGljaXRseUxlZnRSZWN1cnNpdmVQcm9kdWN0aW9uQW5kUHJldmlvdXNQcm9kdWN0aW9ucyhpbXBsaWNpdGx5TGVmdFJlY3Vyc2l2ZVByb2R1Y3Rpb24sIHByZXZpb3VzUHJvZHVjdGlvbnMpIHtcbiAgICBjb25zdCBuYW1lID0gaW1wbGljaXRseUxlZnRSZWN1cnNpdmVQcm9kdWN0aW9uLmdldE5hbWUoKSxcbiAgICAgICAgICBOb2RlID0gaW1wbGljaXRseUxlZnRSZWN1cnNpdmVQcm9kdWN0aW9uLmdldE5vZGUoKTtcblxuICAgIGxldCBydWxlcyA9IGltcGxpY2l0bHlMZWZ0UmVjdXJzaXZlUHJvZHVjdGlvbi5nZXRSdWxlcygpO1xuXG4gICAgcHJldmlvdXNQcm9kdWN0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKHByZXZpb3VzUHJvZHVjdGlvbikge1xuICAgICAgY29uc3QgbGVmdFJlY3Vyc2l2ZVJ1bGVzID0gbGVmdFJlY3Vyc2l2ZVJ1bGVzRnJvbVJ1bGVzQW5kUHJldmlvdXNQcm9kdWN0aW9uKHJ1bGVzLCBwcmV2aW91c1Byb2R1Y3Rpb24pO1xuXG4gICAgICBydWxlcyA9IGxlZnRSZWN1cnNpdmVSdWxlcztcbiAgICB9KTtcblxuICAgIGNvbnN0IGxlZnRSZWN1cnNpdmVQcm9kdWN0aW9uID0gbmV3IExlZnRSZWN1cnNpdmVQcm9kdWN0aW9uKG5hbWUsIHJ1bGVzLCBOb2RlKTtcblxuICAgIHJldHVybiBsZWZ0UmVjdXJzaXZlUHJvZHVjdGlvbjtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IExlZnRSZWN1cnNpdmVQcm9kdWN0aW9uO1xuXG5mdW5jdGlvbiBsZWZ0UmVjdXJzaXZlUnVsZXNGcm9tUnVsZXNBbmRQcmV2aW91c1Byb2R1Y3Rpb24ocnVsZXMsIHByZXZpb3VzUHJvZHVjdGlvbikge1xuICBsZXQgbGVmdFJlY3Vyc2l2ZVJ1bGVzID0gW107XG5cbiAgcnVsZXMuZm9yRWFjaChmdW5jdGlvbihydWxlKSB7XG4gICAgY29uc3QgaW1wbGljaXRseUxlZnRSZWN1cnNpdmVSdWxlID0gSW1wbGljaXRseUxlZnRSZWN1cnNpdmVSdWxlLmZyb21SdWxlQW5kUHJldmlvdXNQcm9kdWN0aW9uKHJ1bGUsIHByZXZpb3VzUHJvZHVjdGlvbik7XG5cbiAgICBpZiAoaW1wbGljaXRseUxlZnRSZWN1cnNpdmVSdWxlID09PSBudWxsKSB7XG4gICAgICBjb25zdCBsZWZ0UmVjdXJzaXZlUnVsZSA9IHJ1bGU7IC8vL1xuXG4gICAgICBsZWZ0UmVjdXJzaXZlUnVsZXMucHVzaChsZWZ0UmVjdXJzaXZlUnVsZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxlZnRSZWN1cnNpdmVSdWxlcyA9IGxlZnRSZWN1cnNpdmVSdWxlcy5jb25jYXQobGVmdFJlY3Vyc2l2ZVJ1bGVzRnJvbUltcGxpY2l0bHlMZWZ0UmVjdXJzaXZlUnVsZUFuZFByZXZpb3VzUHJvZHVjdGlvbihpbXBsaWNpdGx5TGVmdFJlY3Vyc2l2ZVJ1bGUsIHByZXZpb3VzUHJvZHVjdGlvbikpOyAgLy8vXG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gbGVmdFJlY3Vyc2l2ZVJ1bGVzO1xufVxuXG5mdW5jdGlvbiBsZWZ0UmVjdXJzaXZlUnVsZXNGcm9tSW1wbGljaXRseUxlZnRSZWN1cnNpdmVSdWxlQW5kUHJldmlvdXNQcm9kdWN0aW9uKGltcGxpY2l0bHlMZWZ0UmVjdXJzaXZlUnVsZSwgcHJldmlvdXNQcm9kdWN0aW9uKSB7XG4gIGNvbnN0IHByZXZpb3VzUHJvZHVjdGlvblJ1bGVzID0gcHJldmlvdXNQcm9kdWN0aW9uLmdldFJ1bGVzKCksXG4gICAgICAgIGltcGxpY2l0bHlMZWZ0UmVjdXJzaXZlUnVsZUFsbEJ1dEZpcnN0UGFydHMgPSBpbXBsaWNpdGx5TGVmdFJlY3Vyc2l2ZVJ1bGUuZ2V0QWxsQnV0Rmlyc3RQYXJ0cygpLFxuICAgICAgICBsZWZ0UmVjdXJzaXZlUnVsZXMgPSBwcmV2aW91c1Byb2R1Y3Rpb25SdWxlcy5tYXAoZnVuY3Rpb24ocHJldmlvdXNQcm9kdWN0aW9uUnVsZSkge1xuICAgICAgICAgIGNvbnN0IHByZXZpb3VzUHJvZHVjdGlvblJ1bGVQYXJ0cyA9IHByZXZpb3VzUHJvZHVjdGlvblJ1bGUuZ2V0UGFydHMoKSxcbiAgICAgICAgICAgICAgICBsZWZ0UmVjdXJzaXZlUnVsZVBhcnRzID0gW10uY29uY2F0KHByZXZpb3VzUHJvZHVjdGlvblJ1bGVQYXJ0cykuY29uY2F0KGltcGxpY2l0bHlMZWZ0UmVjdXJzaXZlUnVsZUFsbEJ1dEZpcnN0UGFydHMpLFxuICAgICAgICAgICAgICAgIGxlZnRSZWN1cnNpdmVSdWxlID0gbmV3IExlZnRSZWN1cnNpdmVSdWxlKGxlZnRSZWN1cnNpdmVSdWxlUGFydHMpO1xuXG4gICAgICAgICAgcmV0dXJuIGxlZnRSZWN1cnNpdmVSdWxlO1xuICAgICAgICB9KTtcblxuICByZXR1cm4gbGVmdFJlY3Vyc2l2ZVJ1bGVzO1xufVxuIl19