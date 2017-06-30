'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var lexers = require('occam-lexers');

var arrayUtil = require('../util/array'),
    TerminalNode = require('../common/node/terminal'),
    NonTerminalNode = require('../common/node/nonTerminal');

var ExtendedBNFLexer = lexers.ExtendedBNFLexer,
    specialSymbols = ExtendedBNFLexer.specialSymbols,
    NO_WHITESPACE = specialSymbols.NO_WHITESPACE;

var bnfUtil = function () {
  function bnfUtil() {
    _classCallCheck(this, bnfUtil);
  }

  _createClass(bnfUtil, null, [{
    key: 'isNodeTerminalNode',
    value: function isNodeTerminalNode(node) {
      var nodeTerminalNode = node instanceof TerminalNode;

      return nodeTerminalNode;
    }
  }, {
    key: 'isNodeNonTerminalNode',
    value: function isNodeNonTerminalNode(node) {
      var nodeNonTerminalNode = node instanceof NonTerminalNode;

      return nodeNonTerminalNode;
    }
  }, {
    key: 'isNodeNoWhitespaceNode',
    value: function isNodeNoWhitespaceNode(node) {
      var nodeNoWhitespaceNode = false;

      var nodeTerminalNode = bnfUtil.isNodeTerminalNode(node);

      if (nodeTerminalNode) {
        var terminalNode = node,
            terminalNodeContent = terminalNode.getContent();

        nodeNoWhitespaceNode = terminalNodeContent === NO_WHITESPACE;
      }

      return nodeNoWhitespaceNode;
    }
  }, {
    key: 'isNodeChoiceNode',
    value: function isNodeChoiceNode(node) {
      var nodeNoChoiceNode = false;

      var nodeTerminalNode = bnfUtil.isNodeTerminalNode(node);

      if (nodeTerminalNode) {
        var terminalNode = node,
            terminalNodeContent = terminalNode.getContent();

        nodeNoChoiceNode = terminalNodeContent === '|';
      }

      return nodeNoChoiceNode;
    }
  }, {
    key: 'isNodeQuantifiersNode',
    value: function isNodeQuantifiersNode(node) {
      var nodeQuantifiersNode = false;

      var nodeNonTerminalNode = bnfUtil.isNodeNonTerminalNode(node);

      if (nodeNonTerminalNode) {
        var nonTerminalNode = node,
            ///
        childNodes = nonTerminalNode.getChildNodes(),
            firstChildNode = arrayUtil.first(childNodes),
            firstChildNodeTerminalNode = bnfUtil.isNodeTerminalNode(firstChildNode);

        if (firstChildNodeTerminalNode) {
          var terminalNode = firstChildNode,
              ///
          terminalNodeContent = terminalNode.getContent();

          nodeQuantifiersNode = terminalNodeContent === '?' || terminalNodeContent === '*' || terminalNodeContent === '+';
        }
      }

      return nodeQuantifiersNode;
    }
  }, {
    key: 'quantifiersFromQuantifiersNode',
    value: function quantifiersFromQuantifiersNode(quantifiersNode) {
      var quantifiers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

      var quantifier = quantifierFromQuantifiersNode(quantifiersNode);

      quantifiers.push(quantifier);

      var quantifiersNodeChildNodes = quantifiersNode.getChildNodes(),
          quantifiersNodeChildNodesLength = quantifiersNodeChildNodes.length;

      if (quantifiersNodeChildNodesLength === 2) {
        var secondQuantifiersNodeChildNode = arrayUtil.second(quantifiersNodeChildNodes);

        quantifiersNode = secondQuantifiersNodeChildNode; ///

        quantifiers = bnfUtil.quantifiersFromQuantifiersNode(quantifiersNode, quantifiers);
      }

      return quantifiers;
    }
  }]);

  return bnfUtil;
}();

module.exports = bnfUtil;

function quantifierFromQuantifiersNode(quantifiersNode) {
  var quantifiersNodeChildNodes = quantifiersNode.getChildNodes(),
      firstQuantifiersNodeChildNode = arrayUtil.first(quantifiersNodeChildNodes),
      firstQuantifiersNodeChildNodeContent = firstQuantifiersNodeChildNode.getContent(),
      quantifier = firstQuantifiersNodeChildNodeContent;

  return quantifier;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2VzNi91dGlsL2JuZi5qcyJdLCJuYW1lcyI6WyJsZXhlcnMiLCJyZXF1aXJlIiwiYXJyYXlVdGlsIiwiVGVybWluYWxOb2RlIiwiTm9uVGVybWluYWxOb2RlIiwiRXh0ZW5kZWRCTkZMZXhlciIsInNwZWNpYWxTeW1ib2xzIiwiTk9fV0hJVEVTUEFDRSIsImJuZlV0aWwiLCJub2RlIiwibm9kZVRlcm1pbmFsTm9kZSIsIm5vZGVOb25UZXJtaW5hbE5vZGUiLCJub2RlTm9XaGl0ZXNwYWNlTm9kZSIsImlzTm9kZVRlcm1pbmFsTm9kZSIsInRlcm1pbmFsTm9kZSIsInRlcm1pbmFsTm9kZUNvbnRlbnQiLCJnZXRDb250ZW50Iiwibm9kZU5vQ2hvaWNlTm9kZSIsIm5vZGVRdWFudGlmaWVyc05vZGUiLCJpc05vZGVOb25UZXJtaW5hbE5vZGUiLCJub25UZXJtaW5hbE5vZGUiLCJjaGlsZE5vZGVzIiwiZ2V0Q2hpbGROb2RlcyIsImZpcnN0Q2hpbGROb2RlIiwiZmlyc3QiLCJmaXJzdENoaWxkTm9kZVRlcm1pbmFsTm9kZSIsInF1YW50aWZpZXJzTm9kZSIsInF1YW50aWZpZXJzIiwicXVhbnRpZmllciIsInF1YW50aWZpZXJGcm9tUXVhbnRpZmllcnNOb2RlIiwicHVzaCIsInF1YW50aWZpZXJzTm9kZUNoaWxkTm9kZXMiLCJxdWFudGlmaWVyc05vZGVDaGlsZE5vZGVzTGVuZ3RoIiwibGVuZ3RoIiwic2Vjb25kUXVhbnRpZmllcnNOb2RlQ2hpbGROb2RlIiwic2Vjb25kIiwicXVhbnRpZmllcnNGcm9tUXVhbnRpZmllcnNOb2RlIiwibW9kdWxlIiwiZXhwb3J0cyIsImZpcnN0UXVhbnRpZmllcnNOb2RlQ2hpbGROb2RlIiwiZmlyc3RRdWFudGlmaWVyc05vZGVDaGlsZE5vZGVDb250ZW50Il0sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0FBRUEsSUFBTUEsU0FBU0MsUUFBUSxjQUFSLENBQWY7O0FBRUEsSUFBTUMsWUFBWUQsUUFBUSxlQUFSLENBQWxC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YUFBaEIsRUFBbEM7QUFBQSxNQUNNaUIsZ0NBQWdDckMsVUFBVXNCLEtBQVYsQ0FBZ0JPLHlCQUFoQixDQUR0QztBQUFBLE1BRU1TLHVDQUF1Q0QsOEJBQThCdkIsVUFBOUIsRUFGN0M7QUFBQSxNQUdNWSxhQUFhWSxvQ0FIbkI7O0FBS0EsU0FBT1osVUFBUDtBQUNEIiwiZmlsZSI6ImJuZi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuY29uc3QgbGV4ZXJzID0gcmVxdWlyZSgnb2NjYW0tbGV4ZXJzJyk7XG5cbmNvbnN0IGFycmF5VXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwvYXJyYXknKSxcbiAgICAgIFRlcm1pbmFsTm9kZSA9IHJlcXVpcmUoJy4uL2NvbW1vbi9ub2RlL3Rlcm1pbmFsJyksXG4gICAgICBOb25UZXJtaW5hbE5vZGUgPSByZXF1aXJlKCcuLi9jb21tb24vbm9kZS9ub25UZXJtaW5hbCcpO1xuXG5jb25zdCB7IEV4dGVuZGVkQk5GTGV4ZXIgfSA9IGxleGVycyxcbiAgICAgIHsgc3BlY2lhbFN5bWJvbHMgfSA9IEV4dGVuZGVkQk5GTGV4ZXIsXG4gICAgICB7IE5PX1dISVRFU1BBQ0UgfSA9IHNwZWNpYWxTeW1ib2xzO1xuXG5jbGFzcyBibmZVdGlsIHtcbiAgc3RhdGljIGlzTm9kZVRlcm1pbmFsTm9kZShub2RlKSB7XG4gICAgY29uc3Qgbm9kZVRlcm1pbmFsTm9kZSA9IChub2RlIGluc3RhbmNlb2YgVGVybWluYWxOb2RlKTtcblxuICAgIHJldHVybiBub2RlVGVybWluYWxOb2RlO1xuICB9XG5cbiAgc3RhdGljIGlzTm9kZU5vblRlcm1pbmFsTm9kZShub2RlKSB7XG4gICAgY29uc3Qgbm9kZU5vblRlcm1pbmFsTm9kZSA9IChub2RlIGluc3RhbmNlb2YgTm9uVGVybWluYWxOb2RlKTtcblxuICAgIHJldHVybiBub2RlTm9uVGVybWluYWxOb2RlO1xuICB9XG5cbiAgc3RhdGljIGlzTm9kZU5vV2hpdGVzcGFjZU5vZGUobm9kZSkge1xuICAgIGxldCBub2RlTm9XaGl0ZXNwYWNlTm9kZSA9IGZhbHNlO1xuICBcbiAgICBjb25zdCBub2RlVGVybWluYWxOb2RlID0gYm5mVXRpbC5pc05vZGVUZXJtaW5hbE5vZGUobm9kZSk7XG4gIFxuICAgIGlmIChub2RlVGVybWluYWxOb2RlKSB7XG4gICAgICBjb25zdCB0ZXJtaW5hbE5vZGUgPSBub2RlLFxuICAgICAgICAgICAgdGVybWluYWxOb2RlQ29udGVudCA9IHRlcm1pbmFsTm9kZS5nZXRDb250ZW50KCk7XG4gIFxuICAgICAgbm9kZU5vV2hpdGVzcGFjZU5vZGUgPSAodGVybWluYWxOb2RlQ29udGVudCA9PT0gTk9fV0hJVEVTUEFDRSk7XG4gICAgfVxuICBcbiAgICByZXR1cm4gbm9kZU5vV2hpdGVzcGFjZU5vZGU7XG4gIH1cblxuICBzdGF0aWMgaXNOb2RlQ2hvaWNlTm9kZShub2RlKSB7XG4gICAgbGV0IG5vZGVOb0Nob2ljZU5vZGUgPSBmYWxzZTtcblxuICAgIGNvbnN0IG5vZGVUZXJtaW5hbE5vZGUgPSBibmZVdGlsLmlzTm9kZVRlcm1pbmFsTm9kZShub2RlKTtcblxuICAgIGlmIChub2RlVGVybWluYWxOb2RlKSB7XG4gICAgICBjb25zdCB0ZXJtaW5hbE5vZGUgPSBub2RlLFxuICAgICAgICAgICAgdGVybWluYWxOb2RlQ29udGVudCA9IHRlcm1pbmFsTm9kZS5nZXRDb250ZW50KCk7XG5cbiAgICAgIG5vZGVOb0Nob2ljZU5vZGUgPSAodGVybWluYWxOb2RlQ29udGVudCA9PT0gJ3wnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbm9kZU5vQ2hvaWNlTm9kZTtcbiAgfVxuXG4gIHN0YXRpYyBpc05vZGVRdWFudGlmaWVyc05vZGUobm9kZSkge1xuICAgIGxldCBub2RlUXVhbnRpZmllcnNOb2RlID0gZmFsc2U7XG5cbiAgICBjb25zdCBub2RlTm9uVGVybWluYWxOb2RlID0gYm5mVXRpbC5pc05vZGVOb25UZXJtaW5hbE5vZGUobm9kZSk7XG5cbiAgICBpZiAobm9kZU5vblRlcm1pbmFsTm9kZSkge1xuICAgICAgY29uc3Qgbm9uVGVybWluYWxOb2RlID0gbm9kZSwgLy8vXG4gICAgICAgICAgICBjaGlsZE5vZGVzID0gbm9uVGVybWluYWxOb2RlLmdldENoaWxkTm9kZXMoKSxcbiAgICAgICAgICAgIGZpcnN0Q2hpbGROb2RlID0gYXJyYXlVdGlsLmZpcnN0KGNoaWxkTm9kZXMpLFxuICAgICAgICAgICAgZmlyc3RDaGlsZE5vZGVUZXJtaW5hbE5vZGUgPSBibmZVdGlsLmlzTm9kZVRlcm1pbmFsTm9kZShmaXJzdENoaWxkTm9kZSk7XG5cbiAgICAgIGlmIChmaXJzdENoaWxkTm9kZVRlcm1pbmFsTm9kZSkge1xuICAgICAgICBjb25zdCB0ZXJtaW5hbE5vZGUgPSBmaXJzdENoaWxkTm9kZSwgIC8vL1xuICAgICAgICAgICAgICB0ZXJtaW5hbE5vZGVDb250ZW50ID0gdGVybWluYWxOb2RlLmdldENvbnRlbnQoKTtcblxuICAgICAgICBub2RlUXVhbnRpZmllcnNOb2RlID0gKHRlcm1pbmFsTm9kZUNvbnRlbnQgPT09ICc/JykgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh0ZXJtaW5hbE5vZGVDb250ZW50ID09PSAnKicpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodGVybWluYWxOb2RlQ29udGVudCA9PT0gJysnKTtcbiAgICAgIH1cbiAgICB9XG5cblxuICAgIHJldHVybiBub2RlUXVhbnRpZmllcnNOb2RlO1xuICB9XG5cbiAgc3RhdGljIHF1YW50aWZpZXJzRnJvbVF1YW50aWZpZXJzTm9kZShxdWFudGlmaWVyc05vZGUsIHF1YW50aWZpZXJzID0gW10pIHtcbiAgICBjb25zdCBxdWFudGlmaWVyID0gcXVhbnRpZmllckZyb21RdWFudGlmaWVyc05vZGUocXVhbnRpZmllcnNOb2RlKTtcblxuICAgIHF1YW50aWZpZXJzLnB1c2gocXVhbnRpZmllcik7XG5cbiAgICBjb25zdCBxdWFudGlmaWVyc05vZGVDaGlsZE5vZGVzID0gcXVhbnRpZmllcnNOb2RlLmdldENoaWxkTm9kZXMoKSxcbiAgICAgICAgICBxdWFudGlmaWVyc05vZGVDaGlsZE5vZGVzTGVuZ3RoID0gIHF1YW50aWZpZXJzTm9kZUNoaWxkTm9kZXMubGVuZ3RoO1xuXG4gICAgaWYgKHF1YW50aWZpZXJzTm9kZUNoaWxkTm9kZXNMZW5ndGggPT09IDIpIHtcbiAgICAgIGNvbnN0IHNlY29uZFF1YW50aWZpZXJzTm9kZUNoaWxkTm9kZSA9IGFycmF5VXRpbC5zZWNvbmQocXVhbnRpZmllcnNOb2RlQ2hpbGROb2Rlcyk7XG5cbiAgICAgIHF1YW50aWZpZXJzTm9kZSA9IHNlY29uZFF1YW50aWZpZXJzTm9kZUNoaWxkTm9kZTsgLy8vXG5cbiAgICAgIHF1YW50aWZpZXJzID0gYm5mVXRpbC5xdWFudGlmaWVyc0Zyb21RdWFudGlmaWVyc05vZGUocXVhbnRpZmllcnNOb2RlLCBxdWFudGlmaWVycyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHF1YW50aWZpZXJzO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYm5mVXRpbDtcblxuZnVuY3Rpb24gcXVhbnRpZmllckZyb21RdWFudGlmaWVyc05vZGUocXVhbnRpZmllcnNOb2RlKSB7XG4gIGNvbnN0IHF1YW50aWZpZXJzTm9kZUNoaWxkTm9kZXMgPSBxdWFudGlmaWVyc05vZGUuZ2V0Q2hpbGROb2RlcygpLFxuICAgICAgICBmaXJzdFF1YW50aWZpZXJzTm9kZUNoaWxkTm9kZSA9IGFycmF5VXRpbC5maXJzdChxdWFudGlmaWVyc05vZGVDaGlsZE5vZGVzKSxcbiAgICAgICAgZmlyc3RRdWFudGlmaWVyc05vZGVDaGlsZE5vZGVDb250ZW50ID0gZmlyc3RRdWFudGlmaWVyc05vZGVDaGlsZE5vZGUuZ2V0Q29udGVudCgpLFxuICAgICAgICBxdWFudGlmaWVyID0gZmlyc3RRdWFudGlmaWVyc05vZGVDaGlsZE5vZGVDb250ZW50O1xuXG4gIHJldHVybiBxdWFudGlmaWVyO1xufVxuIl19