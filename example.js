(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var bnf = '\n\n\n  expression    ::= "(" expression ")" expression~\n\n                  | term expression~ ;\n\n  operator      ::= "+"\n\n                  | "-"\n\n                  | "/"\n\n                  | "*" ;\n\n  term          ::= naturalNumber ;\n\n  naturalNumber ::= /\\d+/ ;\n\n  expression~   ::= operator expression expression~\n\n                  | \u03B5 ;\n\n\n';

module.exports = bnf;

},{}],2:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var lexers = require('occam-lexers');

var bnf = require('./bnf'),
    BNFParser = require('../bnf/parser'),
    CommonParser = require('../common/parser');

var BNFLexer = lexers.BNFLexer;


var bnfLexer = BNFLexer.fromNothing(),
    bnfParser = BNFParser.fromNothing();

var BasicParser = function (_CommonParser) {
  _inherits(BasicParser, _CommonParser);

  function BasicParser() {
    _classCallCheck(this, BasicParser);

    return _possibleConstructorReturn(this, (BasicParser.__proto__ || Object.getPrototypeOf(BasicParser)).apply(this, arguments));
  }

  _createClass(BasicParser, null, [{
    key: 'fromBNF',
    value: function fromBNF(bnf) {
      var basicParser = null;

      try {
        var tokens = bnfLexer.tokensFromBNF(bnf),
            rulesNode = bnfParser.rulesNodeFromTokens(tokens),
            rules = BNFParser.generateRules(rulesNode);

        basicParser = new BasicParser(rules);
      } catch (error) {}

      return basicParser;
    }
  }, {
    key: 'fromNothing',
    value: function fromNothing() {
      var basicParser = BasicParser.fromBNF(bnf);

      return basicParser;
    }
  }]);

  return BasicParser;
}(CommonParser);

Object.assign(BasicParser, {
  bnf: bnf
});

module.exports = BasicParser;

},{"../bnf/parser":30,"../common/parser":74,"./bnf":1,"occam-lexers":173}],3:[function(require,module,exports){
'use strict';

var bnf = '\n\n    rules                ::= rule+ ;\n    \n    rule                 ::= ruleName "::=" definitions ";" ;\n    \n    definitions          ::= definition ( "|" definition )* ;\n    \n    definition           ::= part+ ;\n    \n\n    \n\n    \n\n    \n\n    \n\n    \n\n    \n    part                 ::= "<NO_WHITESPACE>" part part~\n    \n\n    \n\n    \n\n\n                           | "(" part+ ")" part~\n\n                           | "(" part ( "|" part )+ ")" part~\n\n                           | ruleName part~\n    \n                           | regularExpression part~\n    \n                           | significantTokenType part~\n    \n                           | terminalSymbol part~\n    \n                           | endOfLine part~\n    \n                           | epsilon part~\n    \n                           | wildcard part~ \n                           \n                           ;\n    \n    ruleName             ::= [name] ;\n    \n    regularExpression    ::= [regularExpression] ;\n    \n    significantTokenType ::= [type] ;\n    \n    terminalSymbol       ::= [stringLiteral] ;\n    \n    endOfLine            ::= "<END_OF_LINE>" ;\n    \n    epsilon              ::= "\u03B5" ;\n    \n    wildcard             ::= "." ;\n    \n    part~                ::= <NO_WHITESPACE>"?" part~\n    \n                           | <NO_WHITESPACE>"*" part~\n    \n                           | <NO_WHITESPACE>"+" part~\n    \n                           | \u03B5 \n                           \n                           ;\n                                                 \n';

module.exports = bnf;

},{}],4:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RuleNamePart = require('./part/nonTerminal/ruleName'),
    arrayUtilities = require('../utilities/array');

var first = arrayUtilities.first,
    allButFirst = arrayUtilities.allButFirst,
    type = RuleNamePart.type,
    ruleNamePartType = type; ///

var Definition = function () {
  function Definition(parts) {
    _classCallCheck(this, Definition);

    this.parts = parts;
  }

  _createClass(Definition, [{
    key: 'getParts',
    value: function getParts() {
      return this.parts;
    }
  }, {
    key: 'getFirstPart',
    value: function getFirstPart() {
      var firstPart = first(this.parts);

      return firstPart;
    }
  }, {
    key: 'getPartsLength',
    value: function getPartsLength() {
      var partsLength = this.parts.length;

      return partsLength;
    }
  }, {
    key: 'getAllButFirstParts',
    value: function getAllButFirstParts() {
      var allButFirstParts = allButFirst(this.parts);

      return allButFirstParts;
    }
  }, {
    key: 'isFirstPartRuleNamePart',
    value: function isFirstPartRuleNamePart() {
      var firstPartRuleNamePart = void 0;

      var firstPart = this.getFirstPart(),
          firstPartTerminalPart = firstPart.isTerminalPart(),
          firstPartNonTerminalPart = !firstPartTerminalPart;

      if (firstPartNonTerminalPart) {
        var nonTerminalPart = firstPart,
            ///
        nonTerminalPartType = nonTerminalPart.getType(),
            nonTerminalPartTypeRuleNamePartType = nonTerminalPartType === ruleNamePartType,
            nonTerminalPartRuleNamePart = nonTerminalPartTypeRuleNamePartType; ///

        firstPartRuleNamePart = nonTerminalPartRuleNamePart; ///      
      }

      return firstPartRuleNamePart;
    }
  }, {
    key: 'parse',
    value: function parse(configuration, noWhitespace) {
      var nodes = [];

      var savedIndex = configuration.getSavedIndex(),
          everyPartParsed = this.parts.every(function (part) {
        var partNodeOrNodes = part.parse(configuration, noWhitespace),
            partParsed = partNodeOrNodes !== null;

        if (partParsed) {
          nodes = nodes.concat(partNodeOrNodes);

          noWhitespace = false;
        }

        return partParsed;
      });

      if (!everyPartParsed) {
        configuration.backtrack(savedIndex);

        nodes = null;
      }

      return nodes;
    }
  }, {
    key: 'asString',
    value: function asString() {
      var partsString = this.parts.reduce(function (partsString, part) {
        var partString = part.asString();

        if (partsString === null) {
          partsString = partString;
        } else {
          partsString = partsString + ' ' + partString;
        }

        return partsString;
      }, null),
          string = partsString; ///

      return string;
    }
  }]);

  return Definition;
}();

module.exports = Definition;

},{"../utilities/array":97,"./part/nonTerminal/ruleName":36}],5:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var lexers = require('occam-lexers');

var Definition = require('../definition'),
    ruleNames = require('../ruleNames'),
    RuleNamePart = require('../part/nonTerminal/ruleName'),
    GroupOfPartsPart = require('../part/nonTerminal/groupOfParts'),
    OneOrMorePartsPart = require('../part/nonTerminal/oneOrMoreParts'),
    TerminalSymbolPart = require('../part/terminal/terminalSymbol');

var BNFLexer = lexers.BNFLexer,
    specialSymbols = BNFLexer.specialSymbols,
    PartRuleName = ruleNames.PartRuleName,
    RightRecursivePartRuleName = ruleNames.RightRecursivePartRuleName,
    verticalBar = specialSymbols.verticalBar,
    openBracket = specialSymbols.openBracket,
    closeBracket = specialSymbols.closeBracket;

var ChoiceOfPartsDefinition = function (_Definition) {
  _inherits(ChoiceOfPartsDefinition, _Definition);

  function ChoiceOfPartsDefinition() {
    _classCallCheck(this, ChoiceOfPartsDefinition);

    var noWhitespace = false,
        partRuleName = PartRuleName,
        rightRecursivePartRuleName = RightRecursivePartRuleName,
        verticalBarTerminalSymbolContent = verticalBar,
        openBracketTerminalSymbolContent = openBracket,
        closeBracketTerminalSymbolContent = closeBracket,
        partRuleNamePart = new RuleNamePart(partRuleName, noWhitespace),
        rightRecursivePartRuleNamePart = new RuleNamePart(rightRecursivePartRuleName, noWhitespace),
        verticalBarTerminalSymbolPart = new TerminalSymbolPart(verticalBarTerminalSymbolContent, noWhitespace),
        openBracketTerminalSymbolPart = new TerminalSymbolPart(openBracketTerminalSymbolContent, noWhitespace),
        closeBracketTerminalSymbolPart = new TerminalSymbolPart(closeBracketTerminalSymbolContent, noWhitespace),
        verticalBarTerminalSymbolThenPartRuleNameParts = [verticalBarTerminalSymbolPart, partRuleNamePart],
        groupOfPartsPart = new GroupOfPartsPart(verticalBarTerminalSymbolThenPartRuleNameParts),
        oneOrMoreGroupOfPartsPart = new OneOrMorePartsPart(groupOfPartsPart),
        parts = [openBracketTerminalSymbolPart, partRuleNamePart, oneOrMoreGroupOfPartsPart, closeBracketTerminalSymbolPart, rightRecursivePartRuleNamePart];

    return _possibleConstructorReturn(this, (ChoiceOfPartsDefinition.__proto__ || Object.getPrototypeOf(ChoiceOfPartsDefinition)).call(this, parts));
  }

  return ChoiceOfPartsDefinition;
}(Definition);

module.exports = ChoiceOfPartsDefinition;

},{"../definition":4,"../part/nonTerminal/groupOfParts":33,"../part/nonTerminal/oneOrMoreParts":34,"../part/nonTerminal/ruleName":36,"../part/terminal/terminalSymbol":44,"../ruleNames":60,"occam-lexers":173}],6:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Definition = require('../definition'),
    ruleNames = require('../ruleNames'),
    RuleNamePart = require('../part/nonTerminal/ruleName'),
    OneOrMorePartsPart = require('../part/nonTerminal/oneOrMoreParts');

var PartRuleName = ruleNames.PartRuleName;

var DefinitionDefinition = function (_Definition) {
  _inherits(DefinitionDefinition, _Definition);

  function DefinitionDefinition() {
    _classCallCheck(this, DefinitionDefinition);

    var noWhitespace = false,
        partRuleName = PartRuleName,
        partRuleNamePart = new RuleNamePart(partRuleName, noWhitespace),
        oneOrMoreRuleNamePartsPart = new OneOrMorePartsPart(partRuleNamePart),
        parts = [oneOrMoreRuleNamePartsPart];

    return _possibleConstructorReturn(this, (DefinitionDefinition.__proto__ || Object.getPrototypeOf(DefinitionDefinition)).call(this, parts));
  }

  return DefinitionDefinition;
}(Definition);

module.exports = DefinitionDefinition;

},{"../definition":4,"../part/nonTerminal/oneOrMoreParts":34,"../part/nonTerminal/ruleName":36,"../ruleNames":60}],7:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var lexers = require('occam-lexers');

var Definition = require('../definition'),
    ruleNames = require('../ruleNames'),
    RuleNamePart = require('../part/nonTerminal/ruleName'),
    GroupOfPartsPart = require('../part/nonTerminal/groupOfParts'),
    ZeroOrMorePartsPart = require('../part/nonTerminal/zeroOrMoreParts'),
    TerminalSymbolPart = require('../part/terminal/terminalSymbol');

var BNFLexer = lexers.BNFLexer,
    specialSymbols = BNFLexer.specialSymbols,
    DefinitionRuleName = ruleNames.DefinitionRuleName,
    verticalBar = specialSymbols.verticalBar;

var DefinitionsDefinition = function (_Definition) {
  _inherits(DefinitionsDefinition, _Definition);

  function DefinitionsDefinition() {
    _classCallCheck(this, DefinitionsDefinition);

    var noWhitespace = false,
        definitionRuleName = DefinitionRuleName,
        verticalBarTerminalSymbolContent = verticalBar,
        definitionRuleNamePart = new RuleNamePart(definitionRuleName, noWhitespace),
        verticalBarTerminalSymbolPart = new TerminalSymbolPart(verticalBarTerminalSymbolContent, noWhitespace),
        verticalBarTerminalSymbolThenDefinitionRuleNameParts = [verticalBarTerminalSymbolPart, definitionRuleNamePart],
        groupOfPartsPart = new GroupOfPartsPart(verticalBarTerminalSymbolThenDefinitionRuleNameParts),
        zeroOrMoreGroupOfPartsPart = new ZeroOrMorePartsPart(groupOfPartsPart),
        parts = [definitionRuleNamePart, zeroOrMoreGroupOfPartsPart];

    return _possibleConstructorReturn(this, (DefinitionsDefinition.__proto__ || Object.getPrototypeOf(DefinitionsDefinition)).call(this, parts));
  }

  return DefinitionsDefinition;
}(Definition);

module.exports = DefinitionsDefinition;

},{"../definition":4,"../part/nonTerminal/groupOfParts":33,"../part/nonTerminal/ruleName":36,"../part/nonTerminal/zeroOrMoreParts":38,"../part/terminal/terminalSymbol":44,"../ruleNames":60,"occam-lexers":173}],8:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Definition = require('../definition'),
    EpsilonPart = require('../part/terminal/epsilon');

var EpsilonDefinition = function (_Definition) {
  _inherits(EpsilonDefinition, _Definition);

  function EpsilonDefinition() {
    _classCallCheck(this, EpsilonDefinition);

    var noWhitespace = false,
        epsilonPart = new EpsilonPart(noWhitespace),
        parts = [epsilonPart];

    return _possibleConstructorReturn(this, (EpsilonDefinition.__proto__ || Object.getPrototypeOf(EpsilonDefinition)).call(this, parts));
  }

  return EpsilonDefinition;
}(Definition);

module.exports = EpsilonDefinition;

},{"../definition":4,"../part/terminal/epsilon":41}],9:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var lexers = require('occam-lexers');

var Definition = require('../definition'),
    ruleNames = require('../ruleNames'),
    RuleNamePart = require('../part/nonTerminal/ruleName'),
    OneOrMorePartsPart = require('../part/nonTerminal/oneOrMoreParts'),
    TerminalSymbolPart = require('../part/terminal/terminalSymbol');

var BNFLexer = lexers.BNFLexer,
    specialSymbols = BNFLexer.specialSymbols,
    openBracket = specialSymbols.openBracket,
    closeBracket = specialSymbols.closeBracket,
    PartRuleName = ruleNames.PartRuleName,
    RightRecursivePartRuleName = ruleNames.RightRecursivePartRuleName;

var GroupOfPartsDefinition = function (_Definition) {
      _inherits(GroupOfPartsDefinition, _Definition);

      function GroupOfPartsDefinition() {
            _classCallCheck(this, GroupOfPartsDefinition);

            var noWhitespace = false,
                partRuleName = PartRuleName,
                rightRecursivePartRuleName = RightRecursivePartRuleName,
                openBracketTerminalSymbolContent = openBracket,
                closeBracketTerminalSymbolContent = closeBracket,
                partRuleNamePart = new RuleNamePart(partRuleName, noWhitespace),
                rightRecursivePartRuleNamePart = new RuleNamePart(rightRecursivePartRuleName, noWhitespace),
                openBracketTerminalSymbolPart = new TerminalSymbolPart(openBracketTerminalSymbolContent, noWhitespace),
                closeBracketTerminalSymbolPart = new TerminalSymbolPart(closeBracketTerminalSymbolContent, noWhitespace),
                oneOrMorePartRuleNamePartsPart = new OneOrMorePartsPart(partRuleNamePart, noWhitespace),
                parts = [openBracketTerminalSymbolPart, oneOrMorePartRuleNamePartsPart, closeBracketTerminalSymbolPart, rightRecursivePartRuleNamePart];

            return _possibleConstructorReturn(this, (GroupOfPartsDefinition.__proto__ || Object.getPrototypeOf(GroupOfPartsDefinition)).call(this, parts));
      }

      return GroupOfPartsDefinition;
}(Definition);

module.exports = GroupOfPartsDefinition;

},{"../definition":4,"../part/nonTerminal/oneOrMoreParts":34,"../part/nonTerminal/ruleName":36,"../part/terminal/terminalSymbol":44,"../ruleNames":60,"occam-lexers":173}],10:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var lexers = require('occam-lexers');

var Definition = require('../definition'),
    ruleNames = require('../ruleNames'),
    RuleNamePart = require('../part/nonTerminal/ruleName'),
    TerminalSymbolPart = require('../part/terminal/terminalSymbol');

var BNFLexer = lexers.BNFLexer,
    specialSymbols = BNFLexer.specialSymbols,
    NO_WHITESPACE = specialSymbols.NO_WHITESPACE,
    PartRuleName = ruleNames.PartRuleName,
    RightRecursivePartRuleName = ruleNames.RightRecursivePartRuleName;

var NoWhitespaceDefinition = function (_Definition) {
      _inherits(NoWhitespaceDefinition, _Definition);

      function NoWhitespaceDefinition() {
            _classCallCheck(this, NoWhitespaceDefinition);

            var noWhitespace = false,
                partRuleName = PartRuleName,
                rightRecursivePartRuleName = RightRecursivePartRuleName,
                noWhitespaceTerminalSymbolContent = NO_WHITESPACE,
                partRuleNamePart = new RuleNamePart(partRuleName, noWhitespace),
                rightRecursivePartRuleNamePart = new RuleNamePart(rightRecursivePartRuleName, noWhitespace),
                noWhitespaceTerminalSymbolPart = new TerminalSymbolPart(noWhitespaceTerminalSymbolContent, noWhitespace),
                parts = [noWhitespaceTerminalSymbolPart, partRuleNamePart, rightRecursivePartRuleNamePart];

            return _possibleConstructorReturn(this, (NoWhitespaceDefinition.__proto__ || Object.getPrototypeOf(NoWhitespaceDefinition)).call(this, parts));
      }

      return NoWhitespaceDefinition;
}(Definition);

module.exports = NoWhitespaceDefinition;

},{"../definition":4,"../part/nonTerminal/ruleName":36,"../part/terminal/terminalSymbol":44,"../ruleNames":60,"occam-lexers":173}],11:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Definition = require('../definition'),
    ruleNames = require('../ruleNames'),
    RuleNamePart = require('../part/nonTerminal/ruleName');

var RightRecursivePartRuleName = ruleNames.RightRecursivePartRuleName;

var PartRuleDefinition = function (_Definition) {
  _inherits(PartRuleDefinition, _Definition);

  function PartRuleDefinition(ruleName) {
    _classCallCheck(this, PartRuleDefinition);

    var noWhitespace = false,
        rightRecursivePartRuleName = RightRecursivePartRuleName,
        ruleNameRuleNamePart = new RuleNamePart(ruleName, noWhitespace),
        rightRecursivePartRuleNamePart = new RuleNamePart(rightRecursivePartRuleName, noWhitespace),
        parts = [ruleNameRuleNamePart, rightRecursivePartRuleNamePart];

    return _possibleConstructorReturn(this, (PartRuleDefinition.__proto__ || Object.getPrototypeOf(PartRuleDefinition)).call(this, parts));
  }

  return PartRuleDefinition;
}(Definition);

module.exports = PartRuleDefinition;

},{"../definition":4,"../part/nonTerminal/ruleName":36,"../ruleNames":60}],12:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Definition = require('../definition'),
    ruleNames = require('../ruleNames'),
    RuleNamePart = require('../part/nonTerminal/ruleName'),
    TerminalSymbolPart = require('../part/terminal/terminalSymbol');

var RightRecursivePartRuleName = ruleNames.RightRecursivePartRuleName;

var RightRecursivePartRuleDefinition = function (_Definition) {
  _inherits(RightRecursivePartRuleDefinition, _Definition);

  function RightRecursivePartRuleDefinition(terminalSymbolContent) {
    _classCallCheck(this, RightRecursivePartRuleDefinition);

    var noWhitespace = void 0;

    noWhitespace = true;

    var terminalSymbolPart = new TerminalSymbolPart(terminalSymbolContent, noWhitespace);

    noWhitespace = false;

    var rightRecursivePartRuleName = RightRecursivePartRuleName,
        rightRecursivePartRuleNamePart = new RuleNamePart(rightRecursivePartRuleName, noWhitespace),
        parts = [terminalSymbolPart, rightRecursivePartRuleNamePart];

    return _possibleConstructorReturn(this, (RightRecursivePartRuleDefinition.__proto__ || Object.getPrototypeOf(RightRecursivePartRuleDefinition)).call(this, parts));
  }

  return RightRecursivePartRuleDefinition;
}(Definition);

module.exports = RightRecursivePartRuleDefinition;

},{"../definition":4,"../part/nonTerminal/ruleName":36,"../part/terminal/terminalSymbol":44,"../ruleNames":60}],13:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var lexers = require('occam-lexers');

var Definition = require('../definition'),
    ruleNames = require('../ruleNames'),
    RuleNamePart = require('../part/nonTerminal/ruleName'),
    TerminalSymbolPart = require('../part/terminal/terminalSymbol');

var BNFLexer = lexers.BNFLexer,
    specialSymbols = BNFLexer.specialSymbols,
    separator = specialSymbols.separator,
    terminator = specialSymbols.terminator,
    RuleNameRuleName = ruleNames.RuleNameRuleName,
    DefinitionsRuleName = ruleNames.DefinitionsRuleName;

var RuleDefinition = function (_Definition) {
      _inherits(RuleDefinition, _Definition);

      function RuleDefinition() {
            _classCallCheck(this, RuleDefinition);

            var noWhitespace = false,
                separatorTerminalSymbolContent = separator,
                terminatorTerminalSymbolContent = terminator,
                ruleNameRuleName = RuleNameRuleName,
                definitionsRuleName = DefinitionsRuleName,
                separatorTerminalSymbolPart = new TerminalSymbolPart(separatorTerminalSymbolContent, noWhitespace),
                terminatorTerminalSymbolPart = new TerminalSymbolPart(terminatorTerminalSymbolContent, noWhitespace),
                definitionsRuleNamePart = new RuleNamePart(definitionsRuleName, noWhitespace),
                ruleNameRuleNamePart = new RuleNamePart(ruleNameRuleName, noWhitespace),
                parts = [ruleNameRuleNamePart, separatorTerminalSymbolPart, definitionsRuleNamePart, terminatorTerminalSymbolPart];

            return _possibleConstructorReturn(this, (RuleDefinition.__proto__ || Object.getPrototypeOf(RuleDefinition)).call(this, parts));
      }

      return RuleDefinition;
}(Definition);

module.exports = RuleDefinition;

},{"../definition":4,"../part/nonTerminal/ruleName":36,"../part/terminal/terminalSymbol":44,"../ruleNames":60,"occam-lexers":173}],14:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Definition = require('../definition'),
    ruleNames = require('../ruleNames'),
    RuleNamePart = require('../part/nonTerminal/ruleName'),
    OneOrMorePartsPart = require('../part/nonTerminal/oneOrMoreParts');

var RuleRuleName = ruleNames.RuleRuleName;

var RulesDefinition = function (_Definition) {
  _inherits(RulesDefinition, _Definition);

  function RulesDefinition() {
    _classCallCheck(this, RulesDefinition);

    var noWhitespace = false,
        ruleRuleName = RuleRuleName,
        ruleRuleNamePart = new RuleNamePart(ruleRuleName, noWhitespace),
        oneOrMoreRuleRuleNamePartsPart = new OneOrMorePartsPart(ruleRuleNamePart, noWhitespace),
        parts = [oneOrMoreRuleRuleNamePartsPart];

    return _possibleConstructorReturn(this, (RulesDefinition.__proto__ || Object.getPrototypeOf(RulesDefinition)).call(this, parts));
  }

  return RulesDefinition;
}(Definition);

module.exports = RulesDefinition;

},{"../definition":4,"../part/nonTerminal/oneOrMoreParts":34,"../part/nonTerminal/ruleName":36,"../ruleNames":60}],15:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Definition = require('../definition'),
    SignificantTokenTypePart = require('../part/terminal/significantTokenType');

var SignificantTokenTypeDefinition = function (_Definition) {
  _inherits(SignificantTokenTypeDefinition, _Definition);

  function SignificantTokenTypeDefinition(significantTokenType) {
    _classCallCheck(this, SignificantTokenTypeDefinition);

    var noWhitespace = false,
        significantTokenTypePart = new SignificantTokenTypePart(significantTokenType, noWhitespace),
        parts = [significantTokenTypePart];

    return _possibleConstructorReturn(this, (SignificantTokenTypeDefinition.__proto__ || Object.getPrototypeOf(SignificantTokenTypeDefinition)).call(this, parts));
  }

  return SignificantTokenTypeDefinition;
}(Definition);

module.exports = SignificantTokenTypeDefinition;

},{"../definition":4,"../part/terminal/significantTokenType":43}],16:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Definition = require('../definition'),
    TerminalSymbolPart = require('../part/terminal/terminalSymbol');

var TerminalSymbolDefinition = function (_Definition) {
  _inherits(TerminalSymbolDefinition, _Definition);

  function TerminalSymbolDefinition(content) {
    _classCallCheck(this, TerminalSymbolDefinition);

    var noWhitespace = false,
        terminalSymbolPart = new TerminalSymbolPart(content, noWhitespace),
        parts = [terminalSymbolPart];

    return _possibleConstructorReturn(this, (TerminalSymbolDefinition.__proto__ || Object.getPrototypeOf(TerminalSymbolDefinition)).call(this, parts));
  }

  return TerminalSymbolDefinition;
}(Definition);

module.exports = TerminalSymbolDefinition;

},{"../definition":4,"../part/terminal/terminalSymbol":44}],17:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Definition = require('../definition'),
    NonTerminalNode = require('../../common/node/nonTerminal');

var DefinitionNode = function (_NonTerminalNode) {
  _inherits(DefinitionNode, _NonTerminalNode);

  function DefinitionNode() {
    _classCallCheck(this, DefinitionNode);

    return _possibleConstructorReturn(this, (DefinitionNode.__proto__ || Object.getPrototypeOf(DefinitionNode)).apply(this, arguments));
  }

  _createClass(DefinitionNode, [{
    key: 'generateDefinition',
    value: function generateDefinition() {
      var childNodes = this.getChildNodes(),
          partNodes = childNodes,
          ///
      parts = partNodes.map(function (partNode) {
        var noWhitespace = false,
            ///
        part = partNode.generatePart(noWhitespace);

        return part;
      }),
          definition = new Definition(parts);

      return definition;
    }
  }], [{
    key: 'fromNodesAndRuleName',
    value: function fromNodesAndRuleName(nodes, ruleName) {
      var childNodes = nodes,
          ///
      definitionNode = NonTerminalNode.fromRuleNameAndChildNodes(DefinitionNode, ruleName, childNodes);

      return definitionNode;
    }
  }]);

  return DefinitionNode;
}(NonTerminalNode);

module.exports = DefinitionNode;

},{"../../common/node/nonTerminal":62,"../definition":4}],18:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var arrayUtilities = require('../../utilities/array'),
    NonTerminalNode = require('../../common/node/nonTerminal');

var discardOdd = arrayUtilities.discardOdd;

var DefinitionsNode = function (_NonTerminalNode) {
  _inherits(DefinitionsNode, _NonTerminalNode);

  function DefinitionsNode() {
    _classCallCheck(this, DefinitionsNode);

    return _possibleConstructorReturn(this, (DefinitionsNode.__proto__ || Object.getPrototypeOf(DefinitionsNode)).apply(this, arguments));
  }

  _createClass(DefinitionsNode, [{
    key: 'generateDefinitions',
    value: function generateDefinitions() {
      var childNodes = this.getChildNodes(),
          definitionNodes = childNodes,
          ///
      definitions = definitionNodes.map(function (definitionNode) {
        var definition = definitionNode.generateDefinition();

        return definition;
      });

      return definitions;
    }
  }], [{
    key: 'fromNodesAndRuleName',
    value: function fromNodesAndRuleName(nodes, ruleName) {
      var childNodes = discardOdd(nodes),
          definitionsNode = NonTerminalNode.fromRuleNameAndChildNodes(DefinitionsNode, ruleName, childNodes);

      return definitionsNode;
    }
  }]);

  return DefinitionsNode;
}(NonTerminalNode);

module.exports = DefinitionsNode;

},{"../../common/node/nonTerminal":62,"../../utilities/array":97}],19:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EndOfLinePart = require('../part/terminal/endOfLine'),
    NonTerminalNode = require('../../common/node/nonTerminal');

var EndOfLineNode = function (_NonTerminalNode) {
  _inherits(EndOfLineNode, _NonTerminalNode);

  function EndOfLineNode() {
    _classCallCheck(this, EndOfLineNode);

    return _possibleConstructorReturn(this, (EndOfLineNode.__proto__ || Object.getPrototypeOf(EndOfLineNode)).apply(this, arguments));
  }

  _createClass(EndOfLineNode, [{
    key: 'generatePart',
    value: function generatePart(noWhitespace) {
      var endOfLinePart = new EndOfLinePart(noWhitespace);

      return endOfLinePart;
    }
  }], [{
    key: 'fromNodesAndRuleName',
    value: function fromNodesAndRuleName(nodes, ruleName) {
      return NonTerminalNode.fromNodesAndRuleName(EndOfLineNode, nodes, ruleName);
    }
  }]);

  return EndOfLineNode;
}(NonTerminalNode);

module.exports = EndOfLineNode;

},{"../../common/node/nonTerminal":62,"../part/terminal/endOfLine":40}],20:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EpsilonPart = require('../part/terminal/epsilon'),
    NonTerminalNode = require('../../common/node/nonTerminal');

var EpsilonNode = function (_NonTerminalNode) {
  _inherits(EpsilonNode, _NonTerminalNode);

  function EpsilonNode() {
    _classCallCheck(this, EpsilonNode);

    return _possibleConstructorReturn(this, (EpsilonNode.__proto__ || Object.getPrototypeOf(EpsilonNode)).apply(this, arguments));
  }

  _createClass(EpsilonNode, [{
    key: 'generatePart',
    value: function generatePart(noWhitespace) {
      var epsilonPart = new EpsilonPart(noWhitespace);

      return epsilonPart;
    }
  }], [{
    key: 'fromNodesAndRuleName',
    value: function fromNodesAndRuleName(nodes, ruleName) {
      return NonTerminalNode.fromNodesAndRuleName(EpsilonNode, nodes, ruleName);
    }
  }]);

  return EpsilonNode;
}(NonTerminalNode);

module.exports = EpsilonNode;

},{"../../common/node/nonTerminal":62,"../part/terminal/epsilon":41}],21:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var bnfUtilities = require('../../utilities/bnf'),
    arrayUtilities = require('../../utilities/array'),
    OptionalPartPart = require('../part/nonTerminal/optionalPart'),
    ZeroOrMorePartsPart = require('../part/nonTerminal/zeroOrMoreParts'),
    OneOrMorePartsPart = require('../part/nonTerminal/oneOrMoreParts'),
    GroupOfPartsPart = require('../part/nonTerminal/groupOfParts'),
    ChoiceOfPartsPart = require('../part/nonTerminal/choiceOfParts'),
    NonTerminalNode = require('../../common/node/nonTerminal');

var first = arrayUtilities.first,
    last = arrayUtilities.last,
    isNodeQuantifiersNode = bnfUtilities.isNodeQuantifiersNode,
    isNodeNoWhitespaceNode = bnfUtilities.isNodeNoWhitespaceNode,
    quantifiersFromQuantifiersNode = bnfUtilities.quantifiersFromQuantifiersNode;

var PartNode = function (_NonTerminalNode) {
  _inherits(PartNode, _NonTerminalNode);

  function PartNode() {
    _classCallCheck(this, PartNode);

    return _possibleConstructorReturn(this, (PartNode.__proto__ || Object.getPrototypeOf(PartNode)).apply(this, arguments));
  }

  _createClass(PartNode, [{
    key: 'generatePart',
    value: function generatePart(noWhitespace) {
      var part = null;

      var childNodes = this.getChildNodes(),
          nodes = childNodes.slice(),
          ///
      quantifiers = quantifiersFromNodes(nodes),
          firstNodeNoWhitespaceNode = isFirstNodeNoWhitespaceNode(nodes),
          lastNodeRightRecursivePartNode = isLastNodeRightRecursivePartNode(nodes);

      if (firstNodeNoWhitespaceNode) {
        nodes.shift();

        noWhitespace = true;
      }

      if (lastNodeRightRecursivePartNode) {
        nodes.pop();
      }

      var nodesLength = nodes.length;

      if (nodesLength === 1) {
        var firstNode = first(nodes),
            node = firstNode; ///

        part = partFromNode(node, noWhitespace);
      } else {
        part = partFromNodes(nodes);
      }

      part = partFromPartAndQuantifiers(part, quantifiers);

      return part;
    }
  }], [{
    key: 'fromNodesAndRuleName',
    value: function fromNodesAndRuleName(nodes, ruleName) {
      return NonTerminalNode.fromNodesAndRuleName(PartNode, nodes, ruleName);
    }
  }]);

  return PartNode;
}(NonTerminalNode);

module.exports = PartNode;

function quantifiersFromNodes(nodes) {
  var quantifiers = [];

  var lastNode = last(nodes),
      lastNodeQuantifiersNode = isNodeQuantifiersNode(lastNode);

  if (lastNodeQuantifiersNode) {
    var quantifiersNode = lastNode; ///

    quantifiers = quantifiersFromQuantifiersNode(quantifiersNode);
  }

  return quantifiers;
}

function isFirstNodeNoWhitespaceNode(nodes) {
  var firstNode = first(nodes),
      firstNodeNoWhitespaceNode = isNodeNoWhitespaceNode(firstNode);

  return firstNodeNoWhitespaceNode;
}

function isLastNodeRightRecursivePartNode(nodes) {
  var lastNodeRightRecursivePartNode = false;

  var lastNode = last(nodes),
      lastNodeTerminalNode = lastNode.isTerminalNode(),
      lastNodeNonTerminalNode = !lastNodeTerminalNode;

  if (lastNodeNonTerminalNode) {
    var nonTerminalNode = lastNode,
        ///
    nonTerminalNodeRuleName = nonTerminalNode.getRuleName();

    lastNodeRightRecursivePartNode = nonTerminalNodeRuleName === 'part~'; ///
  }

  return lastNodeRightRecursivePartNode;
}

function partFromNode(node, noWhitespace) {
  var part = node.generatePart(noWhitespace);

  return part;
}

function partFromNodes(nodes) {
  var part = null;

  var choiceOfPartsPart = ChoiceOfPartsPart.fromNodes(nodes);

  if (choiceOfPartsPart !== null) {
    part = choiceOfPartsPart; ///
  } else {
    var groupOfPartsPart = GroupOfPartsPart.fromNodes(nodes);

    if (groupOfPartsPart !== null) {
      part = groupOfPartsPart; ///
    }
  }

  return part;
}

function partFromPartAndQuantifiers(part, quantifiers) {
  var quantifiersLength = quantifiers.length;

  if (quantifiersLength > 0) {
    var quantifier = quantifiers.shift(),
        sequenceOfPartsPart = sequenceOfPartsPartFromPartAndQuantifier(part, quantifier);

    part = sequenceOfPartsPart; ///

    part = partFromPartAndQuantifiers(part, quantifiers);
  }

  return part;
}

function sequenceOfPartsPartFromPartAndQuantifier(part, quantifier) {
  var sequenceOfPartsPart = void 0;

  switch (quantifier) {
    case '?':
      var optionalPartPart = new OptionalPartPart(part);

      sequenceOfPartsPart = optionalPartPart; ///
      break;

    case '*':
      var zeroOrMorePartsPart = new ZeroOrMorePartsPart(part);

      sequenceOfPartsPart = zeroOrMorePartsPart; ///
      break;

    case '+':
      var oneOrMorePartsPart = new OneOrMorePartsPart(part);

      sequenceOfPartsPart = oneOrMorePartsPart; ///
      break;
  }

  return sequenceOfPartsPart;
}

},{"../../common/node/nonTerminal":62,"../../utilities/array":97,"../../utilities/bnf":98,"../part/nonTerminal/choiceOfParts":32,"../part/nonTerminal/groupOfParts":33,"../part/nonTerminal/oneOrMoreParts":34,"../part/nonTerminal/optionalPart":35,"../part/nonTerminal/zeroOrMoreParts":38}],22:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var arrayUtilities = require('../../utilities/array'),
    NonTerminalNode = require('../../common/node/nonTerminal'),
    RegularExpressionPart = require('../part/terminal/regularExpression');

var first = arrayUtilities.first,
    second = arrayUtilities.second;

var RegularExpressionNode = function (_NonTerminalNode) {
      _inherits(RegularExpressionNode, _NonTerminalNode);

      function RegularExpressionNode() {
            _classCallCheck(this, RegularExpressionNode);

            return _possibleConstructorReturn(this, (RegularExpressionNode.__proto__ || Object.getPrototypeOf(RegularExpressionNode)).apply(this, arguments));
      }

      _createClass(RegularExpressionNode, [{
            key: 'generatePart',
            value: function generatePart(noWhitespace) {
                  var regularExpression = this.getRegularExpression(),
                      regularExpressionPart = new RegularExpressionPart(regularExpression, noWhitespace);

                  return regularExpressionPart;
            }
      }, {
            key: 'getRegularExpression',
            value: function getRegularExpression() {
                  var childNodes = this.getChildNodes(),
                      firstChildNode = first(childNodes),
                      terminalNode = firstChildNode,
                      ///
                  terminalNodeContent = terminalNode.getContent(),
                      matches = terminalNodeContent.match(RegularExpressionNode.regularExpression),
                      secondMatch = second(matches),
                      pattern = secondMatch,
                      ///
                  regularExpression = new RegExp(pattern); ///

                  return regularExpression;
            }
      }], [{
            key: 'fromNodesAndRuleName',
            value: function fromNodesAndRuleName(nodes, ruleName) {
                  return NonTerminalNode.fromNodesAndRuleName(RegularExpressionNode, nodes, ruleName);
            }
      }]);

      return RegularExpressionNode;
}(NonTerminalNode);

module.exports = RegularExpressionNode;

RegularExpressionNode.regularExpression = /^\/((?:\\.|[^\/])*)\/$/;

},{"../../common/node/nonTerminal":62,"../../utilities/array":97,"../part/terminal/regularExpression":42}],23:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NonTerminalNode = require('../../common/node/nonTerminal');

var RightRecursivePartNode = function (_NonTerminalNode) {
  _inherits(RightRecursivePartNode, _NonTerminalNode);

  function RightRecursivePartNode() {
    _classCallCheck(this, RightRecursivePartNode);

    return _possibleConstructorReturn(this, (RightRecursivePartNode.__proto__ || Object.getPrototypeOf(RightRecursivePartNode)).apply(this, arguments));
  }

  _createClass(RightRecursivePartNode, null, [{
    key: 'fromNodesAndRuleName',
    value: function fromNodesAndRuleName(nodes, ruleName) {
      return NonTerminalNode.fromNodesAndRuleName(RightRecursivePartNode, nodes, ruleName);
    }
  }]);

  return RightRecursivePartNode;
}(NonTerminalNode);

module.exports = RightRecursivePartNode;

},{"../../common/node/nonTerminal":62}],24:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var arrayUtilities = require('../../utilities/array'),
    NonTerminalNode = require('../../common/node/nonTerminal');

var first = arrayUtilities.first,
    second = arrayUtilities.second,
    discardFourthThenSecond = arrayUtilities.discardFourthThenSecond;

var RuleNode = function (_NonTerminalNode) {
      _inherits(RuleNode, _NonTerminalNode);

      function RuleNode() {
            _classCallCheck(this, RuleNode);

            return _possibleConstructorReturn(this, (RuleNode.__proto__ || Object.getPrototypeOf(RuleNode)).apply(this, arguments));
      }

      _createClass(RuleNode, [{
            key: 'generateRule',
            value: function generateRule(Rule) {
                  var name = this.getName(),
                      definitions = this.generateDefinitions(),
                      Node = NonTerminalNode,
                      rule = new Rule(name, definitions, Node);

                  return rule;
            }
      }, {
            key: 'getName',
            value: function getName() {
                  var childNodes = this.getChildNodes(),
                      firstChildNode = first(childNodes),
                      ruleNameNode = firstChildNode,
                      ///
                  ruleNameNodeRuleName = ruleNameNode.getRuleName(),
                      name = ruleNameNodeRuleName; ///

                  return name;
            }
      }, {
            key: 'generateDefinitions',
            value: function generateDefinitions() {
                  var childNodes = this.getChildNodes(),
                      secondChildNode = second(childNodes),
                      definitionsNode = secondChildNode,
                      ///
                  definitions = definitionsNode.generateDefinitions();

                  return definitions;
            }
      }], [{
            key: 'fromNodesAndRuleName',
            value: function fromNodesAndRuleName(nodes, ruleName) {
                  var childNodes = discardFourthThenSecond(nodes),
                      ruleNode = NonTerminalNode.fromRuleNameAndChildNodes(RuleNode, ruleName, childNodes);

                  return ruleNode;
            }
      }]);

      return RuleNode;
}(NonTerminalNode);

module.exports = RuleNode;

},{"../../common/node/nonTerminal":62,"../../utilities/array":97}],25:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var arrayUtilities = require('../../utilities/array'),
    NonTerminalNode = require('../../common/node/nonTerminal'),
    RuleNamePart = require('../part/nonTerminal/ruleName');

var first = arrayUtilities.first;

var RuleNameNode = function (_NonTerminalNode) {
      _inherits(RuleNameNode, _NonTerminalNode);

      function RuleNameNode() {
            _classCallCheck(this, RuleNameNode);

            return _possibleConstructorReturn(this, (RuleNameNode.__proto__ || Object.getPrototypeOf(RuleNameNode)).apply(this, arguments));
      }

      _createClass(RuleNameNode, [{
            key: 'generatePart',
            value: function generatePart(noWhitespace) {
                  var ruleName = this.getRuleName(),
                      ruleNamePart = new RuleNamePart(ruleName, noWhitespace);

                  return ruleNamePart;
            }
      }, {
            key: 'getRuleName',
            value: function getRuleName() {
                  var childNodes = this.getChildNodes(),
                      firstChildNode = first(childNodes),
                      terminalNode = firstChildNode,
                      ///
                  terminalNodeContent = terminalNode.getContent(),
                      ruleName = terminalNodeContent; ///

                  return ruleName;
            }
      }], [{
            key: 'fromNodesAndRuleName',
            value: function fromNodesAndRuleName(nodes, ruleName) {
                  return NonTerminalNode.fromNodesAndRuleName(RuleNameNode, nodes, ruleName);
            }
      }]);

      return RuleNameNode;
}(NonTerminalNode);

module.exports = RuleNameNode;

},{"../../common/node/nonTerminal":62,"../../utilities/array":97,"../part/nonTerminal/ruleName":36}],26:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NonTerminalNode = require('../../common/node/nonTerminal');

var RulesNode = function (_NonTerminalNode) {
  _inherits(RulesNode, _NonTerminalNode);

  function RulesNode() {
    _classCallCheck(this, RulesNode);

    return _possibleConstructorReturn(this, (RulesNode.__proto__ || Object.getPrototypeOf(RulesNode)).apply(this, arguments));
  }

  _createClass(RulesNode, [{
    key: 'generateRules',
    value: function generateRules(Rule) {
      var childNodes = this.getChildNodes(),
          ruleNodes = childNodes,
          ///
      rules = ruleNodes.map(function (ruleNode) {
        var rule = ruleNode.generateRule(Rule);

        return rule;
      });

      return rules;
    }
  }], [{
    key: 'fromNodesAndRuleName',
    value: function fromNodesAndRuleName(nodes, ruleName) {
      var childNodes = nodes,
          ///
      rulesNode = NonTerminalNode.fromRuleNameAndChildNodes(RulesNode, ruleName, childNodes);

      return rulesNode;
    }
  }]);

  return RulesNode;
}(NonTerminalNode);

module.exports = RulesNode;

},{"../../common/node/nonTerminal":62}],27:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var arrayUtilities = require('../../utilities/array'),
    NonTerminalNode = require('../../common/node/nonTerminal'),
    SignificantTokenTypePart = require('../part/terminal/significantTokenType');

var first = arrayUtilities.first,
    second = arrayUtilities.second;

var SignificantTokenTypeNode = function (_NonTerminalNode) {
      _inherits(SignificantTokenTypeNode, _NonTerminalNode);

      function SignificantTokenTypeNode() {
            _classCallCheck(this, SignificantTokenTypeNode);

            return _possibleConstructorReturn(this, (SignificantTokenTypeNode.__proto__ || Object.getPrototypeOf(SignificantTokenTypeNode)).apply(this, arguments));
      }

      _createClass(SignificantTokenTypeNode, [{
            key: 'generatePart',
            value: function generatePart(noWhitespace) {
                  var significantTokenType = this.getSignificantTokenType(),
                      significantTokenTypePart = new SignificantTokenTypePart(significantTokenType, noWhitespace);

                  return significantTokenTypePart;
            }
      }, {
            key: 'getSignificantTokenType',
            value: function getSignificantTokenType() {
                  var childNodes = this.getChildNodes(),
                      firstChildNode = first(childNodes),
                      terminalNode = firstChildNode,
                      ///
                  terminalNodeContent = terminalNode.getContent(),
                      matches = terminalNodeContent.match(SignificantTokenTypeNode.regularExpression),
                      secondMatch = second(matches),
                      significantTokenType = secondMatch; ///

                  return significantTokenType;
            }
      }], [{
            key: 'fromNodesAndRuleName',
            value: function fromNodesAndRuleName(nodes, ruleName) {
                  return NonTerminalNode.fromNodesAndRuleName(SignificantTokenTypeNode, nodes, ruleName);
            }
      }]);

      return SignificantTokenTypeNode;
}(NonTerminalNode);

module.exports = SignificantTokenTypeNode;

SignificantTokenTypeNode.regularExpression = /^\[([^\]]+)\]$/;

},{"../../common/node/nonTerminal":62,"../../utilities/array":97,"../part/terminal/significantTokenType":43}],28:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var arrayUtilities = require('../../utilities/array'),
    NonTerminalNode = require('../../common/node/nonTerminal'),
    TerminalSymbolPart = require('../part/terminal/terminalSymbol');

var first = arrayUtilities.first,
    second = arrayUtilities.second;

var TerminalSymbolNode = function (_NonTerminalNode) {
      _inherits(TerminalSymbolNode, _NonTerminalNode);

      function TerminalSymbolNode() {
            _classCallCheck(this, TerminalSymbolNode);

            return _possibleConstructorReturn(this, (TerminalSymbolNode.__proto__ || Object.getPrototypeOf(TerminalSymbolNode)).apply(this, arguments));
      }

      _createClass(TerminalSymbolNode, [{
            key: 'generatePart',
            value: function generatePart(noWhitespace) {
                  var content = this.getContent(),
                      terminalSymbolPart = new TerminalSymbolPart(content, noWhitespace);

                  return terminalSymbolPart;
            }
      }, {
            key: 'getContent',
            value: function getContent() {
                  var childNodes = this.getChildNodes(),
                      firstChildNode = first(childNodes),
                      terminalNode = firstChildNode,
                      ///
                  terminalNodeContent = terminalNode.getContent(),
                      matches = terminalNodeContent.match(TerminalSymbolNode.regularExpression),
                      secondMatch = second(matches),
                      content = secondMatch.replace(/\\"/g, '"'); ///

                  return content;
            }
      }], [{
            key: 'fromNodesAndRuleName',
            value: function fromNodesAndRuleName(nodes, ruleName) {
                  return NonTerminalNode.fromNodesAndRuleName(TerminalSymbolNode, nodes, ruleName);
            }
      }]);

      return TerminalSymbolNode;
}(NonTerminalNode);

module.exports = TerminalSymbolNode;

TerminalSymbolNode.regularExpression = /^"((?:\\.|[^"])*)"$/;

},{"../../common/node/nonTerminal":62,"../../utilities/array":97,"../part/terminal/terminalSymbol":44}],29:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NonTerminalNode = require('../../common/node/nonTerminal'),
    WildcardPart = require('../part/terminal/wildcard');

var WildcardNode = function (_NonTerminalNode) {
  _inherits(WildcardNode, _NonTerminalNode);

  function WildcardNode() {
    _classCallCheck(this, WildcardNode);

    return _possibleConstructorReturn(this, (WildcardNode.__proto__ || Object.getPrototypeOf(WildcardNode)).apply(this, arguments));
  }

  _createClass(WildcardNode, [{
    key: 'generatePart',
    value: function generatePart(noWhitespace) {
      var wildcardPart = new WildcardPart(noWhitespace);

      return wildcardPart;
    }
  }], [{
    key: 'fromNodesAndRuleName',
    value: function fromNodesAndRuleName(nodes, ruleName) {
      return NonTerminalNode.fromNodesAndRuleName(WildcardNode, nodes, ruleName);
    }
  }]);

  return WildcardNode;
}(NonTerminalNode);

module.exports = WildcardNode;

},{"../../common/node/nonTerminal":62,"../part/terminal/wildcard":45}],30:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var bnf = require('./bnf'),
    Rule = require('./rule'),
    CommonParser = require('../common/parser'),
    PartRule = require('./rule/part'),
    RuleRule = require('./rule/rule'),
    RulesRule = require('./rule/rules'),
    EpsilonRule = require('./rule/epsilon'),
    WildcardRule = require('./rule/wildcard'),
    RuleNameRule = require('./rule/ruleName'),
    EndOfLineRule = require('./rule/endOfLine'),
    DefinitionRule = require('./rule/definition'),
    DefinitionsRule = require('./rule/definitions'),
    TerminalSymbolRule = require('./rule/terminalSymbol'),
    RegularExpressionRule = require('./rule/regularExpression'),
    RightRecursivePartRule = require('./rule/rightRecursivePart'),
    SignificantTokenTypeRule = require('./rule/significantTokenType');

var BNFParser = function (_CommonParser) {
  _inherits(BNFParser, _CommonParser);

  function BNFParser() {
    _classCallCheck(this, BNFParser);

    return _possibleConstructorReturn(this, (BNFParser.__proto__ || Object.getPrototypeOf(BNFParser)).apply(this, arguments));
  }

  _createClass(BNFParser, [{
    key: 'rulesNodeFromTokens',
    value: function rulesNodeFromTokens(tokens) {
      var node = this.parse(tokens),
          rulesNode = node; ///

      return rulesNode;
    }
  }], [{
    key: 'generateRules',
    value: function generateRules(rulesNode) {
      var rules = rulesNode !== null ? rulesNode.generateRules(Rule) : [];

      return rules;
    }
  }, {
    key: 'fromNothing',
    value: function fromNothing() {
      var partRule = new PartRule(),
          ruleRule = new RuleRule(),
          rulesRule = new RulesRule(),
          epsilonRule = new EpsilonRule(),
          wildcardRule = new WildcardRule(),
          ruleNameRule = new RuleNameRule(),
          endOfLineRule = new EndOfLineRule(),
          definitionRule = new DefinitionRule(),
          definitionsRule = new DefinitionsRule(),
          terminalSymbolRule = new TerminalSymbolRule(),
          regularExpressionRule = new RegularExpressionRule(),
          rightRecursivePartRule = new RightRecursivePartRule(),
          significantTokenTypeRule = new SignificantTokenTypeRule();

      var rules = [rulesRule, ruleRule, definitionsRule, definitionRule, partRule, ruleNameRule, regularExpressionRule, significantTokenTypeRule, terminalSymbolRule, endOfLineRule, epsilonRule, wildcardRule, rightRecursivePartRule];

      var bnfParser = new BNFParser(rules);

      return bnfParser;
    }
  }]);

  return BNFParser;
}(CommonParser);

Object.assign(BNFParser, {
  bnf: bnf
});

module.exports = BNFParser;

},{"../common/parser":74,"./bnf":3,"./rule":46,"./rule/definition":47,"./rule/definitions":48,"./rule/endOfLine":49,"./rule/epsilon":50,"./rule/part":51,"./rule/regularExpression":52,"./rule/rightRecursivePart":53,"./rule/rule":54,"./rule/ruleName":55,"./rule/rules":56,"./rule/significantTokenType":57,"./rule/terminalSymbol":58,"./rule/wildcard":59}],31:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NonTerminalPart = function () {
  function NonTerminalPart(type) {
    _classCallCheck(this, NonTerminalPart);

    this.type = type;
  }

  _createClass(NonTerminalPart, [{
    key: 'getType',
    value: function getType() {
      return this.type;
    }
  }, {
    key: 'isTerminalPart',
    value: function isTerminalPart() {
      var terminalPart = false;

      return terminalPart;
    }
  }]);

  return NonTerminalPart;
}();

module.exports = NonTerminalPart;

},{}],32:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NonTerminalPart = require('../../part/nonTerminal'),
    bnfUtilities = require('../../../utilities/bnf'),
    arrayUtilities = require('../../../utilities/array');

var isNodeChoiceNode = bnfUtilities.isNodeChoiceNode,
    second = arrayUtilities.second,
    discardOdd = arrayUtilities.discardOdd,
    discardLastThenFirst = arrayUtilities.discardLastThenFirst;


var type = 'ChoiceOfParts';

var ChoiceOfPartsPart = function (_NonTerminalPart) {
  _inherits(ChoiceOfPartsPart, _NonTerminalPart);

  function ChoiceOfPartsPart(parts) {
    _classCallCheck(this, ChoiceOfPartsPart);

    var _this = _possibleConstructorReturn(this, (ChoiceOfPartsPart.__proto__ || Object.getPrototypeOf(ChoiceOfPartsPart)).call(this, type));

    _this.parts = parts;
    return _this;
  }

  _createClass(ChoiceOfPartsPart, [{
    key: 'getParts',
    value: function getParts() {
      return this.parts;
    }
  }, {
    key: 'parse',
    value: function parse(configuration, noWhitespace) {
      noWhitespace = false; ///

      var nodes = null;

      this.parts.some(function (part) {
        var partNodeOrNodes = part.parse(configuration, noWhitespace),
            partParsed = partNodeOrNodes !== null;

        if (partParsed) {
          nodes = partNodeOrNodes;
        }

        return partParsed;
      });

      return nodes;
    }
  }, {
    key: 'asString',
    value: function asString() {
      var partsString = this.parts.reduce(function (partsString, part) {
        var partString = part.asString();

        if (partsString === null) {
          partsString = partString;
        } else {
          partsString = partsString + ' | ' + partString;
        }

        return partsString;
      }, null),
          string = '( ' + partsString + ' )';

      return string;
    }
  }], [{
    key: 'fromNodes',
    value: function fromNodes(nodes) {
      var choiceOfPartsPart = null;

      nodes = discardLastThenFirst(nodes);

      var secondNode = second(nodes),
          secondNodeChoiceNode = isNodeChoiceNode(secondNode);

      if (secondNodeChoiceNode) {
        nodes = discardOdd(nodes);

        var noWhitespace = false,
            parts = nodes.map(function (node) {
          var part = node.generatePart(noWhitespace);

          return part;
        });

        choiceOfPartsPart = new ChoiceOfPartsPart(parts);
      }

      return choiceOfPartsPart;
    }
  }]);

  return ChoiceOfPartsPart;
}(NonTerminalPart);

Object.assign(ChoiceOfPartsPart, {
  type: type
});

module.exports = ChoiceOfPartsPart;

},{"../../../utilities/array":97,"../../../utilities/bnf":98,"../../part/nonTerminal":31}],33:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NonTerminalPart = require('../../part/nonTerminal'),
    arrayUtilities = require('../../../utilities/array');

var discardLastThenFirst = arrayUtilities.discardLastThenFirst;


var type = 'GroupOfParts';

var GroupOfPartsPart = function (_NonTerminalPart) {
  _inherits(GroupOfPartsPart, _NonTerminalPart);

  function GroupOfPartsPart(parts) {
    _classCallCheck(this, GroupOfPartsPart);

    var _this = _possibleConstructorReturn(this, (GroupOfPartsPart.__proto__ || Object.getPrototypeOf(GroupOfPartsPart)).call(this, type));

    _this.parts = parts;
    return _this;
  }

  _createClass(GroupOfPartsPart, [{
    key: 'getParts',
    value: function getParts() {
      return this.parts;
    }
  }, {
    key: 'parse',
    value: function parse(configuration, noWhitespace) {
      noWhitespace = false; ///

      var nodes = [];

      var savedIndex = configuration.getSavedIndex(),
          everyPartParsed = this.parts.every(function (part) {
        var partNodeOrNodes = part.parse(configuration, noWhitespace),
            partParsed = partNodeOrNodes !== null;

        if (partParsed) {
          nodes = nodes.concat(partNodeOrNodes);
        }

        return partParsed;
      });

      if (!everyPartParsed) {
        configuration.backtrack(savedIndex);

        nodes = null;
      }

      return nodes;
    }
  }, {
    key: 'asString',
    value: function asString() {
      var partsString = this.parts.reduce(function (partsString, part) {
        var partString = part.asString();

        if (partsString === null) {
          partsString = partString;
        } else {
          partsString = partsString + ' ' + partString;
        }

        return partsString;
      }, null),
          string = '( ' + partsString + ' )';

      return string;
    }
  }], [{
    key: 'fromNodes',
    value: function fromNodes(nodes) {
      nodes = discardLastThenFirst(nodes);

      var noWhitespace = false,
          parts = nodes.map(function (node) {
        var part = node.generatePart(noWhitespace);

        return part;
      }),
          groupOfPartsPart = new GroupOfPartsPart(parts);

      return groupOfPartsPart;
    }
  }]);

  return GroupOfPartsPart;
}(NonTerminalPart);

Object.assign(GroupOfPartsPart, {
  type: type
});

module.exports = GroupOfPartsPart;

},{"../../../utilities/array":97,"../../part/nonTerminal":31}],34:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var lexers = require('occam-lexers');

var SequenceOfPartsPart = require('./sequenceOfParts'),
    ZeroOrMorePartsPart = require('./zeroOrMoreParts');

var BNFLexer = lexers.BNFLexer,
    specialSymbols = BNFLexer.specialSymbols,
    plus = specialSymbols.plus;


var type = 'OneOrMoreParts';

var OneOrMorePartsPart = function (_SequenceOfPartsPart) {
  _inherits(OneOrMorePartsPart, _SequenceOfPartsPart);

  function OneOrMorePartsPart(part) {
    _classCallCheck(this, OneOrMorePartsPart);

    return _possibleConstructorReturn(this, (OneOrMorePartsPart.__proto__ || Object.getPrototypeOf(OneOrMorePartsPart)).call(this, type, part));
  }

  _createClass(OneOrMorePartsPart, [{
    key: 'parse',
    value: function parse(configuration, noWhitespace) {
      noWhitespace = false; ///

      var nodes = null;

      var part = this.getPart(),
          partNodeOrNodes = part.parse(configuration, noWhitespace),
          partParsed = partNodeOrNodes !== null;

      if (partParsed) {
        nodes = partNodeOrNodes instanceof Array ? partNodeOrNodes : [partNodeOrNodes];

        var oneOrMorePartsPart = this,
            ///
        zeroOrMorePartsPart = ZeroOrMorePartsPart.fromOneOrMorePartsPart(oneOrMorePartsPart),
            zeroOrMorePartsPartNodeOrNodes = zeroOrMorePartsPart.parse(configuration, noWhitespace);

        nodes = nodes.concat(zeroOrMorePartsPartNodeOrNodes);
      }

      return nodes;
    }
  }, {
    key: 'asString',
    value: function asString() {
      var operatorString = plus,
          ///
      string = _get(OneOrMorePartsPart.prototype.__proto__ || Object.getPrototypeOf(OneOrMorePartsPart.prototype), 'asString', this).call(this, operatorString);

      return string;
    }
  }]);

  return OneOrMorePartsPart;
}(SequenceOfPartsPart);

Object.assign(OneOrMorePartsPart, {
  type: type
});

module.exports = OneOrMorePartsPart;

},{"./sequenceOfParts":37,"./zeroOrMoreParts":38,"occam-lexers":173}],35:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var lexers = require('occam-lexers');

var NonTerminalPart = require('../../part/nonTerminal');

var BNFLexer = lexers.BNFLexer,
    specialSymbols = BNFLexer.specialSymbols,
    questionMark = specialSymbols.questionMark;


var type = 'OptionalPart';

var OptionalPartPart = function (_NonTerminalPart) {
  _inherits(OptionalPartPart, _NonTerminalPart);

  function OptionalPartPart(part) {
    _classCallCheck(this, OptionalPartPart);

    var _this = _possibleConstructorReturn(this, (OptionalPartPart.__proto__ || Object.getPrototypeOf(OptionalPartPart)).call(this, type));

    _this.part = part;
    return _this;
  }

  _createClass(OptionalPartPart, [{
    key: 'getPart',
    value: function getPart() {
      return this.part;
    }
  }, {
    key: 'parse',
    value: function parse(configuration, noWhitespace) {
      noWhitespace = false; ///

      var nodes = [];

      var part = this.getPart(),
          partNodeOrNodes = part.parse(configuration, noWhitespace),
          partParsed = partNodeOrNodes !== null;

      if (partParsed) {
        nodes = partNodeOrNodes;
      }

      return nodes;
    }
  }, {
    key: 'asString',
    value: function asString() {
      var operatorString = questionMark,
          ///
      partString = this.part.asString(),
          string = '' + partString + operatorString;

      return string;
    }
  }]);

  return OptionalPartPart;
}(NonTerminalPart);

Object.assign(OptionalPartPart, {
  type: type
});

module.exports = OptionalPartPart;

},{"../../part/nonTerminal":31,"occam-lexers":173}],36:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var lexers = require('occam-lexers');

var NonTerminalPart = require('../../part/nonTerminal'),
    ruleUtilities = require('../../../utilities/rule');

var BNFLexer = lexers.BNFLexer,
    specialSymbols = BNFLexer.specialSymbols,
    NO_WHITESPACE = specialSymbols.NO_WHITESPACE,
    findRuleByName = ruleUtilities.findRuleByName;


var type = 'RuleName';

var RuleNamePart = function (_NonTerminalPart) {
  _inherits(RuleNamePart, _NonTerminalPart);

  function RuleNamePart(ruleName, noWhitespace) {
    _classCallCheck(this, RuleNamePart);

    var _this = _possibleConstructorReturn(this, (RuleNamePart.__proto__ || Object.getPrototypeOf(RuleNamePart)).call(this, type));

    _this.ruleName = ruleName;

    _this.noWhitespace = noWhitespace;
    return _this;
  }

  _createClass(RuleNamePart, [{
    key: 'getRuleName',
    value: function getRuleName() {
      return this.ruleName;
    }
  }, {
    key: 'parse',
    value: function parse(configuration, noWhitespace) {
      noWhitespace = noWhitespace || this.noWhitespace; ///

      var nodeOrNodes = null;

      var name = this.ruleName,
          ///
      rules = configuration.getRules(),
          rule = findRuleByName(name, rules);

      if (rule !== null) {
        nodeOrNodes = rule.parse(configuration, noWhitespace);
      }

      return nodeOrNodes;
    }
  }, {
    key: 'asString',
    value: function asString() {
      var noWhitespaceString = this.noWhitespace ? NO_WHITESPACE : '',
          string = '' + noWhitespaceString + this.ruleName;

      return string;
    }
  }]);

  return RuleNamePart;
}(NonTerminalPart);

Object.assign(RuleNamePart, {
  type: type
});

module.exports = RuleNamePart;

},{"../../../utilities/rule":100,"../../part/nonTerminal":31,"occam-lexers":173}],37:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NonTerminalPart = require('../../part/nonTerminal');

var SequenceOfPartsPart = function (_NonTerminalPart) {
  _inherits(SequenceOfPartsPart, _NonTerminalPart);

  function SequenceOfPartsPart(type, part) {
    _classCallCheck(this, SequenceOfPartsPart);

    var _this = _possibleConstructorReturn(this, (SequenceOfPartsPart.__proto__ || Object.getPrototypeOf(SequenceOfPartsPart)).call(this, type));

    _this.part = part;
    return _this;
  }

  _createClass(SequenceOfPartsPart, [{
    key: 'getPart',
    value: function getPart() {
      return this.part;
    }
  }, {
    key: 'asString',
    value: function asString(operatorString) {
      var partString = this.part.asString(),
          string = '' + partString + operatorString;

      return string;
    }
  }]);

  return SequenceOfPartsPart;
}(NonTerminalPart);

module.exports = SequenceOfPartsPart;

},{"../../part/nonTerminal":31}],38:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var lexers = require('occam-lexers');

var SequenceOfPartsPart = require('./sequenceOfParts');

var BNFLexer = lexers.BNFLexer,
    specialSymbols = BNFLexer.specialSymbols,
    asterisk = specialSymbols.asterisk;


var type = 'ZeroOrMoreParts';

var ZeroOrMorePartsPart = function (_SequenceOfPartsPart) {
  _inherits(ZeroOrMorePartsPart, _SequenceOfPartsPart);

  function ZeroOrMorePartsPart(part) {
    _classCallCheck(this, ZeroOrMorePartsPart);

    return _possibleConstructorReturn(this, (ZeroOrMorePartsPart.__proto__ || Object.getPrototypeOf(ZeroOrMorePartsPart)).call(this, type, part));
  }

  _createClass(ZeroOrMorePartsPart, [{
    key: 'parse',
    value: function parse(configuration, noWhitespace) {
      noWhitespace = false; ///

      var nodes = [];

      var part = this.getPart();

      for (;;) {
        var partNodeOrNodes = part.parse(configuration, noWhitespace),
            partParsed = partNodeOrNodes !== null;

        if (partParsed) {
          nodes = nodes.concat(partNodeOrNodes);
        } else {
          break;
        }
      }

      return nodes;
    }
  }, {
    key: 'asString',
    value: function asString() {
      var operatorString = asterisk,
          ///
      string = _get(ZeroOrMorePartsPart.prototype.__proto__ || Object.getPrototypeOf(ZeroOrMorePartsPart.prototype), 'asString', this).call(this, operatorString);

      return string;
    }
  }], [{
    key: 'fromOneOrMorePartsPart',
    value: function fromOneOrMorePartsPart(oneOrMorePartsPart) {
      var part = oneOrMorePartsPart.getPart(),
          zeroOrMorePartsPart = new ZeroOrMorePartsPart(part);

      return zeroOrMorePartsPart;
    }
  }]);

  return ZeroOrMorePartsPart;
}(SequenceOfPartsPart);

Object.assign(ZeroOrMorePartsPart, {
  type: type
});

module.exports = ZeroOrMorePartsPart;

},{"./sequenceOfParts":37,"occam-lexers":173}],39:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TerminalPart = function () {
  function TerminalPart(noWhitespace) {
    _classCallCheck(this, TerminalPart);

    this.noWhitespace = noWhitespace;
  }

  _createClass(TerminalPart, [{
    key: 'isTerminalPart',
    value: function isTerminalPart() {
      var terminalPart = true;

      return terminalPart;
    }
  }, {
    key: 'isEpsilonPart',
    value: function isEpsilonPart() {
      var epsilonPart = false;

      return epsilonPart;
    }
  }, {
    key: 'getNoWhitespace',
    value: function getNoWhitespace() {
      return this.noWhitespace; ///
    }
  }]);

  return TerminalPart;
}();

module.exports = TerminalPart;

},{}],40:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var lexers = require('occam-lexers');

var TerminalPart = require('../../part/terminal'),
    EndOfLineNode = require('../../../common/node/terminal/endOfLine');

var BNFLexer = lexers.BNFLexer,
    specialSymbols = BNFLexer.specialSymbols,
    END_OF_LINE = specialSymbols.END_OF_LINE;

var EndOfLinePart = function (_TerminalPart) {
  _inherits(EndOfLinePart, _TerminalPart);

  function EndOfLinePart() {
    _classCallCheck(this, EndOfLinePart);

    return _possibleConstructorReturn(this, (EndOfLinePart.__proto__ || Object.getPrototypeOf(EndOfLinePart)).apply(this, arguments));
  }

  _createClass(EndOfLinePart, [{
    key: 'parse',
    value: function parse(configuration, noWhitespace) {
      noWhitespace = noWhitespace || this.noWhitespace; ///

      var endOfLineNode = null;

      var savedIndex = configuration.getSavedIndex(),
          nextSignificantToken = configuration.getNextSignificantToken(noWhitespace),
          significantToken = nextSignificantToken; ///

      if (significantToken !== null) {
        var significantTokenEndOfLineToken = significantToken.isEndOfLineToken();

        if (significantTokenEndOfLineToken) {
          endOfLineNode = EndOfLineNode.fromSignificantToken(significantToken);
        }
      }

      if (endOfLineNode === null) {
        configuration.backtrack(savedIndex);
      }

      return endOfLineNode;
    }
  }, {
    key: 'asString',
    value: function asString() {
      var string = END_OF_LINE; ///

      return string;
    }
  }]);

  return EndOfLinePart;
}(TerminalPart);

module.exports = EndOfLinePart;

},{"../../../common/node/terminal/endOfLine":64,"../../part/terminal":39,"occam-lexers":173}],41:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var lexers = require('occam-lexers');

var TerminalPart = require('../../part/terminal'),
    EpsilonTerminalNode = require('../../../common/node/terminal/epsilon');

var BNFLexer = lexers.BNFLexer,
    specialSymbols = BNFLexer.specialSymbols,
    epsilon = specialSymbols.epsilon;

var EpsilonPart = function (_TerminalPart) {
  _inherits(EpsilonPart, _TerminalPart);

  function EpsilonPart() {
    _classCallCheck(this, EpsilonPart);

    return _possibleConstructorReturn(this, (EpsilonPart.__proto__ || Object.getPrototypeOf(EpsilonPart)).apply(this, arguments));
  }

  _createClass(EpsilonPart, [{
    key: 'parse',
    value: function parse(configuration, noWhitespace) {
      var epsilonTerminalNode = new EpsilonTerminalNode();

      return epsilonTerminalNode;
    }
  }, {
    key: 'isEpsilonPart',
    value: function isEpsilonPart() {
      var epsilonPart = true;

      return epsilonPart;
    }
  }, {
    key: 'asString',
    value: function asString() {
      var string = epsilon; ///

      return string;
    }
  }]);

  return EpsilonPart;
}(TerminalPart);

module.exports = EpsilonPart;

},{"../../../common/node/terminal/epsilon":65,"../../part/terminal":39,"occam-lexers":173}],42:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var lexers = require('occam-lexers');

var TerminalPart = require('../../part/terminal'),
    TerminalNode = require('../../../common/node/terminal'),
    arrayUtilities = require('../../../utilities/array');

var BNFLexer = lexers.BNFLexer,
    first = arrayUtilities.first,
    specialSymbols = BNFLexer.specialSymbols,
    NO_WHITESPACE = specialSymbols.NO_WHITESPACE;

var RegularExpressionPart = function (_TerminalPart) {
  _inherits(RegularExpressionPart, _TerminalPart);

  function RegularExpressionPart(regularExpression, noWhitespace) {
    _classCallCheck(this, RegularExpressionPart);

    var _this = _possibleConstructorReturn(this, (RegularExpressionPart.__proto__ || Object.getPrototypeOf(RegularExpressionPart)).call(this, noWhitespace));

    _this.regularExpression = regularExpression;
    return _this;
  }

  _createClass(RegularExpressionPart, [{
    key: 'parse',
    value: function parse(configuration, noWhitespace) {
      noWhitespace = noWhitespace || this.noWhitespace; ///

      var terminalNode = null;

      var savedIndex = configuration.getSavedIndex(),
          nextSignificantToken = configuration.getNextSignificantToken(noWhitespace),
          significantToken = nextSignificantToken; ///

      if (significantToken !== null) {
        var content = significantToken.getContent(),
            matches = content.match(this.regularExpression);

        if (matches !== null) {
          var firstMatch = first(matches),
              parsed = firstMatch === content;

          if (parsed) {
            terminalNode = TerminalNode.fromSignificantToken(significantToken);
          }
        }
      }

      if (terminalNode === null) {
        configuration.backtrack(savedIndex);
      }

      return terminalNode;
    }
  }, {
    key: 'asString',
    value: function asString() {
      var regularExpressionString = this.regularExpression.asString(),
          noWhitespaceString = this.noWhitespace ? NO_WHITESPACE : '',
          string = '' + noWhitespaceString + regularExpressionString;

      return string;
    }
  }]);

  return RegularExpressionPart;
}(TerminalPart);

module.exports = RegularExpressionPart;

},{"../../../common/node/terminal":63,"../../../utilities/array":97,"../../part/terminal":39,"occam-lexers":173}],43:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var lexers = require('occam-lexers');

var TerminalPart = require('../../part/terminal'),
    TerminalNode = require('../../../common/node/terminal');

var BNFLexer = lexers.BNFLexer,
    specialSymbols = BNFLexer.specialSymbols,
    NO_WHITESPACE = specialSymbols.NO_WHITESPACE;

var SignificantTokenTypePart = function (_TerminalPart) {
  _inherits(SignificantTokenTypePart, _TerminalPart);

  function SignificantTokenTypePart(significantTokenType, noWhitespace) {
    _classCallCheck(this, SignificantTokenTypePart);

    var _this = _possibleConstructorReturn(this, (SignificantTokenTypePart.__proto__ || Object.getPrototypeOf(SignificantTokenTypePart)).call(this, noWhitespace));

    _this.significantTokenType = significantTokenType;
    return _this;
  }

  _createClass(SignificantTokenTypePart, [{
    key: 'parse',
    value: function parse(configuration, noWhitespace) {
      noWhitespace = noWhitespace || this.noWhitespace; ///

      var terminalNode = null;

      var savedIndex = configuration.getSavedIndex(),
          nextSignificantToken = configuration.getNextSignificantToken(noWhitespace),
          significantToken = nextSignificantToken; ///

      if (significantToken !== null) {
        var significantTokenType = significantToken.getType(),
            parsed = significantTokenType === this.significantTokenType; ///

        if (parsed) {
          terminalNode = TerminalNode.fromSignificantToken(significantToken);
        }
      }

      if (terminalNode === null) {
        configuration.backtrack(savedIndex);
      }

      return terminalNode;
    }
  }, {
    key: 'asString',
    value: function asString() {
      var noWhitespaceString = this.noWhitespace ? NO_WHITESPACE : '',
          string = noWhitespaceString + '[' + this.significantTokenType + ']';

      return string;
    }
  }]);

  return SignificantTokenTypePart;
}(TerminalPart);

module.exports = SignificantTokenTypePart;

},{"../../../common/node/terminal":63,"../../part/terminal":39,"occam-lexers":173}],44:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var lexers = require('occam-lexers');

var TerminalPart = require('../../part/terminal'),
    TerminalNode = require('../../../common/node/terminal');

var BNFLexer = lexers.BNFLexer,
    specialSymbols = BNFLexer.specialSymbols,
    NO_WHITESPACE = specialSymbols.NO_WHITESPACE;

var TerminalSymbolPart = function (_TerminalPart) {
  _inherits(TerminalSymbolPart, _TerminalPart);

  function TerminalSymbolPart(content, noWhitespace) {
    _classCallCheck(this, TerminalSymbolPart);

    var _this = _possibleConstructorReturn(this, (TerminalSymbolPart.__proto__ || Object.getPrototypeOf(TerminalSymbolPart)).call(this, noWhitespace));

    _this.content = content;
    return _this;
  }

  _createClass(TerminalSymbolPart, [{
    key: 'getNoWhitespace',
    value: function getNoWhitespace() {
      return this.noWhitespace;
    }
  }, {
    key: 'parse',
    value: function parse(configuration, noWhitespace) {
      noWhitespace = noWhitespace || this.noWhitespace; ///

      var terminalNode = null;

      var savedIndex = configuration.getSavedIndex(),
          nextSignificantToken = configuration.getNextSignificantToken(noWhitespace),
          significantToken = nextSignificantToken; ///

      if (significantToken !== null) {
        var content = significantToken.getContent(),
            parsed = content === this.content;

        if (parsed) {
          terminalNode = TerminalNode.fromSignificantToken(significantToken);
        }
      }

      if (terminalNode === null) {
        configuration.backtrack(savedIndex);
      }

      return terminalNode;
    }
  }, {
    key: 'asString',
    value: function asString() {
      var noWhitespaceString = this.noWhitespace ? NO_WHITESPACE : '',
          string = noWhitespaceString + '"' + this.content + '"';

      return string;
    }
  }]);

  return TerminalSymbolPart;
}(TerminalPart);

module.exports = TerminalSymbolPart;

},{"../../../common/node/terminal":63,"../../part/terminal":39,"occam-lexers":173}],45:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var lexers = require('occam-lexers');

var TerminalPart = require('../../part/terminal'),
    TerminalNode = require('../../../common/node/terminal');

var BNFLexer = lexers.BNFLexer,
    specialSymbols = BNFLexer.specialSymbols,
    wildcard = specialSymbols.wildcard;

var WildcardPart = function (_TerminalPart) {
  _inherits(WildcardPart, _TerminalPart);

  function WildcardPart() {
    _classCallCheck(this, WildcardPart);

    return _possibleConstructorReturn(this, (WildcardPart.__proto__ || Object.getPrototypeOf(WildcardPart)).apply(this, arguments));
  }

  _createClass(WildcardPart, [{
    key: 'parse',
    value: function parse(configuration, noWhitespace) {
      noWhitespace = noWhitespace || this.noWhitespace; ///

      var terminalNode = null;

      var savedIndex = configuration.getSavedIndex(),
          nextSignificantToken = configuration.getNextSignificantToken(noWhitespace),
          significantToken = nextSignificantToken; ///

      if (significantToken !== null) {
        terminalNode = TerminalNode.fromSignificantToken(significantToken);
      }

      if (terminalNode === null) {
        configuration.backtrack(savedIndex);
      }

      return terminalNode;
    }
  }, {
    key: 'asString',
    value: function asString() {
      var string = wildcard; ///

      return string;
    }
  }]);

  return WildcardPart;
}(TerminalPart);

module.exports = WildcardPart;

},{"../../../common/node/terminal":63,"../../part/terminal":39,"occam-lexers":173}],46:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Rule = function () {
  function Rule(name, definitions, NonTerminalNode) {
    _classCallCheck(this, Rule);

    this.name = name;
    this.definitions = definitions;
    this.NonTerminalNode = NonTerminalNode;
  }

  _createClass(Rule, [{
    key: 'getName',
    value: function getName() {
      return this.name;
    }
  }, {
    key: 'getDefinitions',
    value: function getDefinitions() {
      return this.definitions;
    }
  }, {
    key: 'getNonTerminalNode',
    value: function getNonTerminalNode() {
      return this.NonTerminalNode;
    }
  }, {
    key: 'doDefinitionsExist',
    value: function doDefinitionsExist() {
      var definitionsLength = this.definitions.length,
          definitionsExist = definitionsLength > 0;

      return definitionsExist;
    }
  }, {
    key: 'setName',
    value: function setName(name) {
      this.name = name;
    }
  }, {
    key: 'setDefinitions',
    value: function setDefinitions(definitions) {
      this.definitions = definitions;
    }
  }, {
    key: 'setNode',
    value: function setNode(node) {
      this.node = node;
    }
  }, {
    key: 'addDefinitions',
    value: function addDefinitions(definitions) {
      this.definitions = this.definitions.concat(definitions);
    }
  }, {
    key: 'parse',
    value: function parse(configuration, noWhitespace) {
      var nonTerminalNode = null;

      configuration.increaseDepth();

      var tooDeep = configuration.isTooDeep();

      if (tooDeep) {
        throw new Error('The parse tree is too deep at rule \'' + this.name + '\'');
      }

      var definitionNodes = null;

      var someDefinitionParsed = this.definitions.some(function (definition) {
        definitionNodes = definition.parse(configuration, noWhitespace);

        var definitionParsed = definitionNodes !== null;

        return definitionParsed;
      });

      if (someDefinitionParsed) {
        var ruleName = this.name,
            nodes = definitionNodes; ///

        nonTerminalNode = this.NonTerminalNode.fromNodesAndRuleName(nodes, ruleName);
      }

      configuration.decreaseDepth();

      return nonTerminalNode;
    }
  }, {
    key: 'asString',
    value: function asString(maximumRuleNameLength) {
      var maximumPadding = paddingFromPaddingLength(maximumRuleNameLength),
          definitionsString = this.definitions.reduce(function (definitionsString, definition) {
        var definitionString = definition.asString();

        definitionsString = definitionsString !== null ? definitionsString + '\n\n' + maximumPadding + '     | ' + definitionString : definitionString;

        return definitionsString;
      }, null),
          ruleName = this.name,
          ///
      ruleNameLength = ruleName.length,
          paddingLength = maximumRuleNameLength - ruleNameLength,
          padding = paddingFromPaddingLength(paddingLength),
          string = '\n\n  ' + this.name + padding + ' ::= ' + definitionsString + ' ;';

      return string;
    }
  }], [{
    key: 'fromRule',
    value: function fromRule(Class, rule) {
      if (rule === undefined) {
        rule = Class;
        Class = Rule;
      }

      var name = rule.getName(),
          definitions = rule.getDefinitions(),
          NonTerminalNode = rule.getNonTerminalNode();

      rule = new Class(name, definitions, NonTerminalNode);

      return rule;
    }
  }]);

  return Rule;
}();

module.exports = Rule;

function paddingFromPaddingLength(paddingLength) {
  var padding = '';

  for (var position = 0; position < paddingLength; position++) {
    padding += ' ';
  }

  return padding;
}

},{}],47:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Rule = require('../rule'),
    ruleNames = require('../ruleNames'),
    DefinitionNode = require('../node/definition'),
    DefinitionDefinition = require('../definition/definition');

var DefinitionRuleName = ruleNames.DefinitionRuleName;

var DefinitionRule = function (_Rule) {
  _inherits(DefinitionRule, _Rule);

  function DefinitionRule() {
    _classCallCheck(this, DefinitionRule);

    var name = DefinitionRuleName,
        definitionDefinition = new DefinitionDefinition(),
        definitions = [definitionDefinition],
        Node = DefinitionNode;

    return _possibleConstructorReturn(this, (DefinitionRule.__proto__ || Object.getPrototypeOf(DefinitionRule)).call(this, name, definitions, Node));
  }

  return DefinitionRule;
}(Rule);

module.exports = DefinitionRule;

},{"../definition/definition":6,"../node/definition":17,"../rule":46,"../ruleNames":60}],48:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Rule = require('../rule'),
    ruleNames = require('../ruleNames'),
    DefinitionsNode = require('../node/definitions'),
    DefinitionsDefinition = require('../definition/definitions');

var DefinitionsRuleName = ruleNames.DefinitionsRuleName;

var DefinitionsRule = function (_Rule) {
  _inherits(DefinitionsRule, _Rule);

  function DefinitionsRule() {
    _classCallCheck(this, DefinitionsRule);

    var definitionsDefinition = new DefinitionsDefinition(),
        name = DefinitionsRuleName,
        definitions = [definitionsDefinition],
        Node = DefinitionsNode;

    return _possibleConstructorReturn(this, (DefinitionsRule.__proto__ || Object.getPrototypeOf(DefinitionsRule)).call(this, name, definitions, Node));
  }

  return DefinitionsRule;
}(Rule);

module.exports = DefinitionsRule;

},{"../definition/definitions":7,"../node/definitions":18,"../rule":46,"../ruleNames":60}],49:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var lexers = require('occam-lexers');

var Rule = require('../rule'),
    ruleNames = require('../ruleNames'),
    EndOfLineNode = require('../node/endOfLine'),
    TerminalSymbolDefinition = require('../definition/terminalSymbol');

var BNFLexer = lexers.BNFLexer,
    specialSymbols = BNFLexer.specialSymbols,
    END_OF_LINE = specialSymbols.END_OF_LINE,
    EndOfLineRuleName = ruleNames.EndOfLineRuleName;

var EndOfLineRule = function (_Rule) {
      _inherits(EndOfLineRule, _Rule);

      function EndOfLineRule() {
            _classCallCheck(this, EndOfLineRule);

            var endOfLineTerminalSymbolContent = END_OF_LINE,
                endOfLineTerminalSymbolDefinition = new TerminalSymbolDefinition(endOfLineTerminalSymbolContent),
                name = EndOfLineRuleName,
                definitions = [endOfLineTerminalSymbolDefinition],
                Node = EndOfLineNode;

            return _possibleConstructorReturn(this, (EndOfLineRule.__proto__ || Object.getPrototypeOf(EndOfLineRule)).call(this, name, definitions, Node));
      }

      return EndOfLineRule;
}(Rule);

module.exports = EndOfLineRule;

},{"../definition/terminalSymbol":16,"../node/endOfLine":19,"../rule":46,"../ruleNames":60,"occam-lexers":173}],50:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var lexers = require('occam-lexers');

var Rule = require('../rule'),
    ruleNames = require('../ruleNames'),
    EndOfLineNode = require('../node/epsilon'),
    TerminalSymbolDefinition = require('../definition/terminalSymbol');

var BNFLexer = lexers.BNFLexer,
    specialSymbols = BNFLexer.specialSymbols,
    epsilon = specialSymbols.epsilon,
    EpsilonRuleName = ruleNames.EpsilonRuleName;

var EpsilonRule = function (_Rule) {
      _inherits(EpsilonRule, _Rule);

      function EpsilonRule() {
            _classCallCheck(this, EpsilonRule);

            var epsilonTerminalSymbolContent = epsilon,
                epsilonTerminalSymbolDefinition = new TerminalSymbolDefinition(epsilonTerminalSymbolContent),
                name = EpsilonRuleName,
                definitions = [epsilonTerminalSymbolDefinition],
                Node = EndOfLineNode;

            return _possibleConstructorReturn(this, (EpsilonRule.__proto__ || Object.getPrototypeOf(EpsilonRule)).call(this, name, definitions, Node));
      }

      return EpsilonRule;
}(Rule);

module.exports = EpsilonRule;

},{"../definition/terminalSymbol":16,"../node/epsilon":20,"../rule":46,"../ruleNames":60,"occam-lexers":173}],51:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Rule = require('../rule'),
    PartNode = require('../node/part'),
    ruleNames = require('../ruleNames'),
    PartRuleDefinition = require('../definition/partRule'),
    NoWhitespaceDefinition = require('../definition/noWhitespace'),
    GroupOfPartsDefinition = require('../definition/groupOfParts'),
    ChoiceOfPartsDefinition = require('../definition/choiceOfParts');

var PartRuleName = ruleNames.PartRuleName;

var PartRule = function (_Rule) {
  _inherits(PartRule, _Rule);

  function PartRule() {
    _classCallCheck(this, PartRule);

    var ruleNameRuleName = 'ruleName',
        regularExpressionRuleName = 'regularExpression',
        significantTokenTypeRuleName = 'significantTokenType',
        terminalSymbolRuleName = 'terminalSymbol',
        endOfLineRuleName = 'endOfLine',
        epsilonRuleName = 'epsilon',
        wildcardRuleName = 'wildcard',
        noWhitespaceDefinition = new NoWhitespaceDefinition(),
        groupOfPartsDefinition = new GroupOfPartsDefinition(),
        choiceOfPartsDefinition = new ChoiceOfPartsDefinition(),
        ruleNameRuleNamePartRuleDefinition = new PartRuleDefinition(ruleNameRuleName),
        regularExpressionRuleNamePartRuleDefinition = new PartRuleDefinition(regularExpressionRuleName),
        significantTokenTypeRuleNamePartRuleDefinition = new PartRuleDefinition(significantTokenTypeRuleName),
        terminalSymbolRuleNamePartRuleDefinition = new PartRuleDefinition(terminalSymbolRuleName),
        endOfLineRuleNamePartRuleDefinition = new PartRuleDefinition(endOfLineRuleName),
        epsilonRuleNamePartRuleDefinition = new PartRuleDefinition(epsilonRuleName),
        wildcardRuleNamePartRuleDefinition = new PartRuleDefinition(wildcardRuleName),
        name = PartRuleName,
        definitions = [noWhitespaceDefinition, groupOfPartsDefinition, choiceOfPartsDefinition, ruleNameRuleNamePartRuleDefinition, regularExpressionRuleNamePartRuleDefinition, significantTokenTypeRuleNamePartRuleDefinition, terminalSymbolRuleNamePartRuleDefinition, endOfLineRuleNamePartRuleDefinition, epsilonRuleNamePartRuleDefinition, wildcardRuleNamePartRuleDefinition],
        Node = PartNode;

    return _possibleConstructorReturn(this, (PartRule.__proto__ || Object.getPrototypeOf(PartRule)).call(this, name, definitions, Node));
  }

  return PartRule;
}(Rule);

module.exports = PartRule;

},{"../definition/choiceOfParts":5,"../definition/groupOfParts":9,"../definition/noWhitespace":10,"../definition/partRule":11,"../node/part":21,"../rule":46,"../ruleNames":60}],52:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Rule = require('../rule'),
    ruleNames = require('../ruleNames'),
    RegularExpressionNode = require('../node/regularExpression'),
    SignificantTokenTypeDefinition = require('../definition/significantTokenType');

var RegularExpressionRuleName = ruleNames.RegularExpressionRuleName;

var RegularExpressionRule = function (_Rule) {
  _inherits(RegularExpressionRule, _Rule);

  function RegularExpressionRule() {
    _classCallCheck(this, RegularExpressionRule);

    var regularExpressionSignificantTokenType = 'regularExpression',
        regularExpressionSignificantTokenTypeDefinition = new SignificantTokenTypeDefinition(regularExpressionSignificantTokenType),
        name = RegularExpressionRuleName,
        definitions = [regularExpressionSignificantTokenTypeDefinition],
        Node = RegularExpressionNode;

    return _possibleConstructorReturn(this, (RegularExpressionRule.__proto__ || Object.getPrototypeOf(RegularExpressionRule)).call(this, name, definitions, Node));
  }

  return RegularExpressionRule;
}(Rule);

module.exports = RegularExpressionRule;

},{"../definition/significantTokenType":15,"../node/regularExpression":22,"../rule":46,"../ruleNames":60}],53:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var lexers = require('occam-lexers');

var Rule = require('../rule'),
    ruleNames = require('../ruleNames'),
    EpsilonDefinition = require('../definition/epsilon'),
    RightRecursivePartNode = require('../node/rightRecursivePart'),
    RightRecursivePartRuleDefinition = require('../definition/rightRecursivePartRule');

var BNFLexer = lexers.BNFLexer,
    specialSymbols = BNFLexer.specialSymbols,
    RightRecursivePartRuleName = ruleNames.RightRecursivePartRuleName,
    plus = specialSymbols.plus,
    asterisk = specialSymbols.asterisk,
    questionMark = specialSymbols.questionMark;

var RightRecursivePartRule = function (_Rule) {
      _inherits(RightRecursivePartRule, _Rule);

      function RightRecursivePartRule() {
            _classCallCheck(this, RightRecursivePartRule);

            var plusTerminalSymbolContent = plus,
                asteriskTerminalSymbolContent = asterisk,
                questionMarkTerminalSymbolContent = questionMark,
                optionalRightRecursivePartRuleDefinition = new RightRecursivePartRuleDefinition(questionMarkTerminalSymbolContent),
                ///
            zeroOrMoreRightRecursivePartRuleDefinition = new RightRecursivePartRuleDefinition(asteriskTerminalSymbolContent),
                ///
            oneOrMoreRightRecursivePartRuleDefinition = new RightRecursivePartRuleDefinition(plusTerminalSymbolContent),
                ///
            epsilonDefinition = new EpsilonDefinition(),
                name = RightRecursivePartRuleName,
                definitions = [optionalRightRecursivePartRuleDefinition, zeroOrMoreRightRecursivePartRuleDefinition, oneOrMoreRightRecursivePartRuleDefinition, epsilonDefinition],
                Node = RightRecursivePartNode;

            return _possibleConstructorReturn(this, (RightRecursivePartRule.__proto__ || Object.getPrototypeOf(RightRecursivePartRule)).call(this, name, definitions, Node));
      }

      return RightRecursivePartRule;
}(Rule);

module.exports = RightRecursivePartRule;

},{"../definition/epsilon":8,"../definition/rightRecursivePartRule":12,"../node/rightRecursivePart":23,"../rule":46,"../ruleNames":60,"occam-lexers":173}],54:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Rule = require('../rule'),
    ruleNames = require('../ruleNames'),
    RuleNode = require('../node/rule'),
    RuleDefinition = require('../definition/rule');

var RuleRuleName = ruleNames.RuleRuleName;

var RuleRule = function (_Rule) {
  _inherits(RuleRule, _Rule);

  function RuleRule() {
    _classCallCheck(this, RuleRule);

    var ruleDefinition = new RuleDefinition(),
        name = RuleRuleName,
        definitions = [ruleDefinition],
        Node = RuleNode;

    return _possibleConstructorReturn(this, (RuleRule.__proto__ || Object.getPrototypeOf(RuleRule)).call(this, name, definitions, Node));
  }

  return RuleRule;
}(Rule);

module.exports = RuleRule;

},{"../definition/rule":13,"../node/rule":24,"../rule":46,"../ruleNames":60}],55:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Rule = require('../rule'),
    ruleNames = require('../ruleNames'),
    RuleNameNode = require('../node/ruleName'),
    SignificantTokenTypeDefinition = require('../definition/significantTokenType');

var RuleNameRuleName = ruleNames.RuleNameRuleName;

var RuleNameRule = function (_Rule) {
  _inherits(RuleNameRule, _Rule);

  function RuleNameRule() {
    _classCallCheck(this, RuleNameRule);

    var nameSignificantTokenType = 'name',
        nameSignificantTokenTypeDefinition = new SignificantTokenTypeDefinition(nameSignificantTokenType),
        name = RuleNameRuleName,
        definitions = [nameSignificantTokenTypeDefinition],
        Node = RuleNameNode;

    return _possibleConstructorReturn(this, (RuleNameRule.__proto__ || Object.getPrototypeOf(RuleNameRule)).call(this, name, definitions, Node));
  }

  return RuleNameRule;
}(Rule);

module.exports = RuleNameRule;

},{"../definition/significantTokenType":15,"../node/ruleName":25,"../rule":46,"../ruleNames":60}],56:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Rule = require('../rule'),
    ruleNames = require('../ruleNames'),
    RulesNode = require('../node/rules'),
    RulesDefinition = require('../definition/rules');

var RulesRuleName = ruleNames.RulesRuleName;

var RulesRule = function (_Rule) {
  _inherits(RulesRule, _Rule);

  function RulesRule() {
    _classCallCheck(this, RulesRule);

    var rulesDefinition = new RulesDefinition(),
        name = RulesRuleName,
        definitions = [rulesDefinition],
        Node = RulesNode;

    return _possibleConstructorReturn(this, (RulesRule.__proto__ || Object.getPrototypeOf(RulesRule)).call(this, name, definitions, Node));
  }

  return RulesRule;
}(Rule);

module.exports = RulesRule;

},{"../definition/rules":14,"../node/rules":26,"../rule":46,"../ruleNames":60}],57:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Rule = require('../rule'),
    ruleNames = require('../ruleNames'),
    SignificantTokenTypeNode = require('../node/significantTokenType'),
    SignificantTokenTypeDefinition = require('../definition/significantTokenType');

var SignificantTokenTypeRuleName = ruleNames.SignificantTokenTypeRuleName;

var SignificantTokenTypeRule = function (_Rule) {
  _inherits(SignificantTokenTypeRule, _Rule);

  function SignificantTokenTypeRule() {
    _classCallCheck(this, SignificantTokenTypeRule);

    var typeSignificantTokenType = 'type',
        typeSignificantTokenTypeDefinition = new SignificantTokenTypeDefinition(typeSignificantTokenType),
        name = SignificantTokenTypeRuleName,
        definitions = [typeSignificantTokenTypeDefinition],
        Node = SignificantTokenTypeNode;

    return _possibleConstructorReturn(this, (SignificantTokenTypeRule.__proto__ || Object.getPrototypeOf(SignificantTokenTypeRule)).call(this, name, definitions, Node));
  }

  return SignificantTokenTypeRule;
}(Rule);

module.exports = SignificantTokenTypeRule;

},{"../definition/significantTokenType":15,"../node/significantTokenType":27,"../rule":46,"../ruleNames":60}],58:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Rule = require('../rule'),
    ruleNames = require('../ruleNames'),
    TerminalSymbolNode = require('../node/terminalSymbol'),
    SignificantTokenTypeDefinition = require('../definition/significantTokenType');

var TerminalSymbolRuleName = ruleNames.TerminalSymbolRuleName;

var TerminalSymbolRule = function (_Rule) {
  _inherits(TerminalSymbolRule, _Rule);

  function TerminalSymbolRule() {
    _classCallCheck(this, TerminalSymbolRule);

    var stringLiteralSignificantTokenType = 'stringLiteral',
        stringLiteralSignificantTokenTypeDefinition = new SignificantTokenTypeDefinition(stringLiteralSignificantTokenType),
        name = TerminalSymbolRuleName,
        definitions = [stringLiteralSignificantTokenTypeDefinition],
        Node = TerminalSymbolNode;

    return _possibleConstructorReturn(this, (TerminalSymbolRule.__proto__ || Object.getPrototypeOf(TerminalSymbolRule)).call(this, name, definitions, Node));
  }

  return TerminalSymbolRule;
}(Rule);

module.exports = TerminalSymbolRule;

},{"../definition/significantTokenType":15,"../node/terminalSymbol":28,"../rule":46,"../ruleNames":60}],59:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var lexers = require('occam-lexers');

var Rule = require('../rule'),
    ruleNames = require('../ruleNames'),
    WildcardNode = require('../node/wildcard'),
    TerminalSymbolDefinition = require('../definition/terminalSymbol');

var BNFLexer = lexers.BNFLexer,
    specialSymbols = BNFLexer.specialSymbols,
    wildcard = specialSymbols.wildcard,
    WildcardRuleName = ruleNames.WildcardRuleName;

var WildcardRule = function (_Rule) {
      _inherits(WildcardRule, _Rule);

      function WildcardRule() {
            _classCallCheck(this, WildcardRule);

            var wildcardTerminalSymbolContent = wildcard,
                wildcardTerminalSymbolDefinition = new TerminalSymbolDefinition(wildcardTerminalSymbolContent),
                name = WildcardRuleName,
                definitions = [wildcardTerminalSymbolDefinition],
                Node = WildcardNode;

            return _possibleConstructorReturn(this, (WildcardRule.__proto__ || Object.getPrototypeOf(WildcardRule)).call(this, name, definitions, Node));
      }

      return WildcardRule;
}(Rule);

module.exports = WildcardRule;

},{"../definition/terminalSymbol":16,"../node/wildcard":29,"../rule":46,"../ruleNames":60,"occam-lexers":173}],60:[function(require,module,exports){
'use strict';

module.exports = {
  DefinitionRuleName: 'definition',
  DefinitionsRuleName: 'definitions',
  EndOfLineRuleName: 'endOfLine',
  EpsilonRuleName: 'epsilon',
  PartRuleName: 'part',
  RegularExpressionRuleName: 'regularExpression',
  RightRecursivePartRuleName: 'part~',
  RuleRuleName: 'rule',
  RuleNameRuleName: 'ruleName',
  RulesRuleName: 'rules',
  SignificantTokenTypeRuleName: 'significantTokenType',
  TerminalSymbolRuleName: 'terminalSymbol',
  WildcardRuleName: 'wildcard'
};

},{}],61:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DEFAULT_MAXIMUM_DEPTH = 99;

var Configuration = function () {
  function Configuration(tokens, rules, index, depth, maximumDepth) {
    _classCallCheck(this, Configuration);

    this.tokens = tokens;
    this.rules = rules;
    this.index = index;
    this.depth = depth;
    this.maximumDepth = maximumDepth;
  }

  _createClass(Configuration, [{
    key: 'getTokens',
    value: function getTokens() {
      return this.tokens;
    }
  }, {
    key: 'getRules',
    value: function getRules() {
      return this.rules;
    }
  }, {
    key: 'getIndex',
    value: function getIndex() {
      return this.index;
    }
  }, {
    key: 'getDepth',
    value: function getDepth() {
      return this.depth;
    }
  }, {
    key: 'getMaximumDepth',
    value: function getMaximumDepth() {
      return this.maximumDepth;
    }
  }, {
    key: 'getSavedIndex',
    value: function getSavedIndex() {
      var savedIndex = this.index; ///

      return savedIndex;
    }
  }, {
    key: 'getNextSignificantToken',
    value: function getNextSignificantToken(noWhitespace) {
      var nextSignificantToken = null;

      var tokensLength = this.tokens.length;

      while (this.index < tokensLength) {
        var token = this.tokens[this.index++],
            tokenSignificant = token.isSignificant();

        if (tokenSignificant) {
          nextSignificantToken = token; ///

          break;
        } else if (noWhitespace) {
          var tokenWhitespaceToken = token.isWhitespaceToken();

          if (tokenWhitespaceToken) {
            break;
          }
        }
      }

      return nextSignificantToken;
    }
  }, {
    key: 'isTooDeep',
    value: function isTooDeep() {
      var tooDeep = this.depth > this.maximumDepth;

      return tooDeep;
    }
  }, {
    key: 'backtrack',
    value: function backtrack(savedIndex) {
      this.index = savedIndex; ///
    }
  }, {
    key: 'setIndex',
    value: function setIndex(index) {
      this.index = index;
    }
  }, {
    key: 'increaseDepth',
    value: function increaseDepth() {
      this.depth++;
    }
  }, {
    key: 'decreaseDepth',
    value: function decreaseDepth() {
      this.depth--;
    }
  }], [{
    key: 'fromTokensAndRules',
    value: function fromTokensAndRules(tokens, rules) {
      var index = 0,
          depth = 0,
          maximumDepth = DEFAULT_MAXIMUM_DEPTH,
          configuration = new Configuration(tokens, rules, index, depth, maximumDepth);

      return configuration;
    }
  }]);

  return Configuration;
}();

module.exports = Configuration;

},{}],62:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var arrayUtilities = require('../../utilities/array'),
    NonTerminalNodeParseTree = require('../parseTree/nonTerminalNode');

var first = arrayUtilities.first,
    forwardsSome = arrayUtilities.forwardsSome,
    backwardsSome = arrayUtilities.backwardsSome;

var NonTerminalNode = function () {
  function NonTerminalNode(ruleName, childNodes) {
    _classCallCheck(this, NonTerminalNode);

    this.ruleName = ruleName;
    this.childNodes = childNodes;
  }

  _createClass(NonTerminalNode, [{
    key: 'isTerminalNode',
    value: function isTerminalNode() {
      var terminalNode = false;

      return terminalNode;
    }
  }, {
    key: 'isNonTerminalNode',
    value: function isNonTerminalNode() {
      var nonTerminalNode = true;

      return nonTerminalNode;
    }
  }, {
    key: 'getRuleName',
    value: function getRuleName() {
      return this.ruleName;
    }
  }, {
    key: 'getChildNodes',
    value: function getChildNodes() {
      return this.childNodes;
    }
  }, {
    key: 'getFirstSignificantToken',
    value: function getFirstSignificantToken() {
      var firstSignificantToken = null;

      forwardsSome(this.childNodes, function (childNode) {
        firstSignificantToken = childNode.getFirstSignificantToken();

        if (firstSignificantToken !== null) {
          return true;
        }
      });

      return firstSignificantToken;
    }
  }, {
    key: 'getLastSignificantToken',
    value: function getLastSignificantToken() {
      var lastSignificantToken = null;

      backwardsSome(this.childNodes, function (childNode) {
        lastSignificantToken = childNode.getLastSignificantToken();

        if (lastSignificantToken !== null) {
          return true;
        }
      });

      return lastSignificantToken;
    }
  }, {
    key: 'isNullified',
    value: function isNullified() {
      var nullified = false;

      var childNodesLength = this.childNodes.length;

      if (childNodesLength === 1) {
        var firstChildNode = first(this.childNodes),
            childNode = firstChildNode,
            ///
        childNodeTerminalNode = childNode.isTerminalNode();

        if (childNodeTerminalNode) {
          var terminalNode = childNode,
              ///
          terminalNodeEpsilonNode = terminalNode.isEpsilonNode();

          nullified = terminalNodeEpsilonNode; ///
        }
      }

      return nullified;
    }
  }, {
    key: 'setChildNodes',
    value: function setChildNodes(childNodes) {
      this.childNodes = childNodes;
    }
  }, {
    key: 'asParseTree',
    value: function asParseTree(tokens) {
      var nonTerminalNode = this,
          ///
      nonTerminalNodeParseTree = NonTerminalNodeParseTree.fromNonTerminalNodeAndTokens(nonTerminalNode, tokens),
          parseTree = nonTerminalNodeParseTree; ///

      return parseTree;
    }
  }], [{
    key: 'fromNodesAndRuleName',
    value: function fromNodesAndRuleName(Class, nodes, ruleName) {
      if (ruleName === undefined) {
        ruleName = nodes;
        nodes = Class;
        Class = NonTerminalNode;
      }

      var childNodes = nodes,
          ///
      nonTerminalNode = Class.fromRuleNameAndChildNodes(Class, ruleName, childNodes);

      return nonTerminalNode;
    }
  }, {
    key: 'fromRuleNameAndChildNodes',
    value: function fromRuleNameAndChildNodes(Class, ruleName, childNodes) {
      if (childNodes === undefined) {
        childNodes = ruleName;
        ruleName = Class;
        Class = NonTerminalNode;
      }

      var nonTerminalNode = new Class(ruleName, childNodes);

      return nonTerminalNode;
    }
  }]);

  return NonTerminalNode;
}();

module.exports = NonTerminalNode;

},{"../../utilities/array":97,"../parseTree/nonTerminalNode":70}],63:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TerminalNodeParseTree = require('../parseTree/terminalNode');

var TerminalNode = function () {
  function TerminalNode(significantToken) {
    _classCallCheck(this, TerminalNode);

    this.significantToken = significantToken;
  }

  _createClass(TerminalNode, [{
    key: 'getSignificantToken',
    value: function getSignificantToken() {
      return this.significantToken;
    }
  }, {
    key: 'getFirstSignificantToken',
    value: function getFirstSignificantToken() {
      var firstSignificantToken = this.significantToken; ///

      return firstSignificantToken;
    }
  }, {
    key: 'getLastSignificantToken',
    value: function getLastSignificantToken() {
      var lastSignificantToken = this.significantToken; ///

      return lastSignificantToken;
    }
  }, {
    key: 'isEpsilonNode',
    value: function isEpsilonNode() {
      var epsilonNode = false;

      return epsilonNode;
    }
  }, {
    key: 'isTerminalNode',
    value: function isTerminalNode() {
      var terminalNode = true;

      return terminalNode;
    }
  }, {
    key: 'isNonTerminalNode',
    value: function isNonTerminalNode() {
      var nonTerminalNode = false;

      return nonTerminalNode;
    }
  }, {
    key: 'getContent',
    value: function getContent() {
      return this.significantToken.getContent();
    }
  }, {
    key: 'asParseTree',
    value: function asParseTree(tokens) {
      var terminalNode = this,
          ///
      terminalNodeParseTree = TerminalNodeParseTree.fromTerminalNodeAndTokens(terminalNode, tokens),
          parseTree = terminalNodeParseTree; ///

      return parseTree;
    }
  }], [{
    key: 'fromSignificantToken',
    value: function fromSignificantToken(Class, significantToken) {
      if (significantToken === undefined) {
        significantToken = Class;
        Class = TerminalNode;
      }

      var terminalNode = new Class(significantToken);

      return terminalNode;
    }
  }]);

  return TerminalNode;
}();

module.exports = TerminalNode;

},{"../parseTree/terminalNode":72}],64:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TerminalNode = require('../terminal');

var EndOfLineNode = function (_TerminalNode) {
  _inherits(EndOfLineNode, _TerminalNode);

  function EndOfLineNode() {
    _classCallCheck(this, EndOfLineNode);

    return _possibleConstructorReturn(this, (EndOfLineNode.__proto__ || Object.getPrototypeOf(EndOfLineNode)).apply(this, arguments));
  }

  _createClass(EndOfLineNode, [{
    key: 'getContent',
    value: function getContent() {
      var content = ''; ///

      return content;
    }
  }], [{
    key: 'fromSignificantToken',
    value: function fromSignificantToken(significantToken) {
      return TerminalNode.fromSignificantToken(EndOfLineNode, significantToken);
    }
  }]);

  return EndOfLineNode;
}(TerminalNode);

module.exports = EndOfLineNode;

},{"../terminal":63}],65:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var lexers = require('occam-lexers');

var TerminalNode = require('../terminal'),
    EpsilonNodeParseTree = require('../../parseTree/epsilonNode');

var BNFLexer = lexers.BNFLexer,
    specialSymbols = BNFLexer.specialSymbols,
    epsilon = specialSymbols.epsilon;

var EpsilonNode = function (_TerminalNode) {
  _inherits(EpsilonNode, _TerminalNode);

  function EpsilonNode() {
    _classCallCheck(this, EpsilonNode);

    var significantToken = null;

    return _possibleConstructorReturn(this, (EpsilonNode.__proto__ || Object.getPrototypeOf(EpsilonNode)).call(this, significantToken));
  }

  _createClass(EpsilonNode, [{
    key: 'getContent',
    value: function getContent() {
      var content = epsilon; ///

      return content;
    }
  }, {
    key: 'isEpsilonNode',
    value: function isEpsilonNode() {
      var epsilonNode = true;

      return epsilonNode;
    }
  }, {
    key: 'asParseTree',
    value: function asParseTree(tokens) {
      var epsilonNodeParseTree = EpsilonNodeParseTree.fromNothing(),
          parseTree = epsilonNodeParseTree; ///

      return parseTree;
    }
  }]);

  return EpsilonNode;
}(TerminalNode);

module.exports = EpsilonNode;

},{"../../parseTree/epsilonNode":68,"../terminal":63,"occam-lexers":173}],66:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var arrayUtilities = require('../utilities/array');

var last = arrayUtilities.last;

var ParseTree = function () {
  function ParseTree(lines) {
    _classCallCheck(this, ParseTree);

    this.lines = lines;
  }

  _createClass(ParseTree, [{
    key: 'clone',
    value: function clone() {
      var lines = this.lines.slice(0),
          ///
      parseTree = new ParseTree(lines);

      return parseTree;
    }
  }, {
    key: 'getWidth',
    value: function getWidth() {
      var linesLength = this.lines.length,
          width = undefined;

      if (linesLength === 0) {
        width = 0;
      } else {
        var lastLine = last(this.lines),
            lastLineLength = lastLine.length;

        width = lastLineLength; ///
      }

      return width;
    }
  }, {
    key: 'getDepth',
    value: function getDepth() {
      var linesLength = this.lines.length,
          depth = linesLength; ///

      return depth;
    }
  }, {
    key: 'forEachLine',
    value: function forEachLine(callback) {
      this.lines.forEach(callback);
    }
  }, {
    key: 'appendToTop',
    value: function appendToTop(parseTree) {
      parseTree.forEachLine(function (line) {
        this.lines.unshift(line);
      }.bind(this));
    }
  }, {
    key: 'appendToLeft',
    value: function appendToLeft(parseTree) {
      parseTree.forEachLine(function (line, index) {
        this.lines[index] = line + this.lines[index];
      }.bind(this));
    }
  }, {
    key: 'appendToRight',
    value: function appendToRight(parseTree) {
      parseTree.forEachLine(function (line, index) {
        this.lines[index] = this.lines[index] + line;
      }.bind(this));
    }
  }, {
    key: 'appendToBottom',
    value: function appendToBottom(parseTree) {
      parseTree.forEachLine(function (line) {
        this.lines.push(line);
      }.bind(this));
    }
  }, {
    key: 'addTopMargin',
    value: function addTopMargin(topMarginDepth) {
      var width = this.getWidth(),
          topMarginWidth = width,
          ///
      topMarginString = marginStringFromMarginWidth(topMarginWidth);

      for (var index = 0; index < topMarginDepth; index++) {
        this.lines.unshift(topMarginString);
      }
    }
  }, {
    key: 'addLeftMargin',
    value: function addLeftMargin(leftMarginWidth) {
      var leftMarginString = marginStringFromMarginWidth(leftMarginWidth),
          linesLength = this.lines.length;

      for (var index = 0; index < linesLength; index++) {
        this.lines[index] = leftMarginString + this.lines[index];
      }
    }
  }, {
    key: 'addRightMargin',
    value: function addRightMargin(rightMarginWidth) {
      var rightMarginString = marginStringFromMarginWidth(rightMarginWidth),
          linesLength = this.lines.length;

      for (var index = 0; index < linesLength; index++) {
        this.lines[index] = this.lines[index] + rightMarginString;
      }
    }
  }, {
    key: 'addBottomMargin',
    value: function addBottomMargin(bottomMarginDepth) {
      var width = this.getWidth(),
          bottomMarginWidth = width,
          ///
      bottomMarginString = marginStringFromMarginWidth(bottomMarginWidth);

      for (var index = 0; index < bottomMarginDepth; index++) {
        this.lines.push(bottomMarginString);
      }
    }
  }, {
    key: 'popLine',
    value: function popLine() {
      return this.lines.pop();
    }
  }, {
    key: 'shiftLine',
    value: function shiftLine() {
      return this.lines.shift();
    }
  }, {
    key: 'pushLine',
    value: function pushLine(line) {
      this.lines.push(line);
    }
  }, {
    key: 'unshiftLine',
    value: function unshiftLine(line) {
      this.lines.unshift(line);
    }
  }, {
    key: 'asString',
    value: function asString() {
      var string = this.lines.reduce(function (string, line) {
        string += line + '\n';

        return string;
      }, '');

      return string;
    }
  }]);

  return ParseTree;
}();

module.exports = ParseTree;

function marginStringFromMarginWidth(marginWidth, spaceCharacter) {
  spaceCharacter = spaceCharacter || ' ';

  var marginString = '';

  for (var index = 0; index < marginWidth; index++) {
    marginString += spaceCharacter;
  }

  return marginString;
}

},{"../utilities/array":97}],67:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VerticalBranchParseTree = require('./verticalBranch'),
    HorizontalBranchParseTree = require('./horizontalBranch');

var ChildNodesParseTree = function (_VerticalBranchParseT) {
  _inherits(ChildNodesParseTree, _VerticalBranchParseT);

  function ChildNodesParseTree() {
    _classCallCheck(this, ChildNodesParseTree);

    return _possibleConstructorReturn(this, (ChildNodesParseTree.__proto__ || Object.getPrototypeOf(ChildNodesParseTree)).apply(this, arguments));
  }

  _createClass(ChildNodesParseTree, null, [{
    key: 'fromChildNodesAndTokens',
    value: function fromChildNodesAndTokens(childNodes, tokens) {
      var childNodeParseTrees = childNodes.map(function (childNode) {
        var childNodeParseTree = childNode.asParseTree(tokens);

        return childNodeParseTree;
      }),
          childNodeParseTreesLength = childNodeParseTrees.length;

      var firstVerticalBranchPosition = undefined,
          lastVerticalBranchPosition = 0,
          childNodeParseTreesWidth = 0,
          childNodeParseTreesDepth = 0;

      childNodeParseTrees.forEach(function (childNodeParseTree, index) {
        var childNodeParseTreeWidth = childNodeParseTree.getWidth(),
            childNodeParseTreeDepth = childNodeParseTree.getDepth();

        if (index === 0) {
          var firstChildNodeParseTree = childNodeParseTree,
              firstChildNodeParseTreeVerticalBranchPosition = firstChildNodeParseTree.getVerticalBranchPosition();

          firstVerticalBranchPosition = firstChildNodeParseTreeVerticalBranchPosition;
        }

        if (index === childNodeParseTreesLength - 1) {
          var lastChildNodeParseTree = childNodeParseTree,
              lastChildNodeParseTreeVerticalBranchPosition = lastChildNodeParseTree.getVerticalBranchPosition();

          lastVerticalBranchPosition += lastChildNodeParseTreeVerticalBranchPosition;
        }

        if (index < childNodeParseTreesLength - 1) {
          lastVerticalBranchPosition += childNodeParseTreeWidth;
          lastVerticalBranchPosition += 1;

          childNodeParseTreesWidth += 1;
        }

        childNodeParseTreesWidth += childNodeParseTreeWidth;
        childNodeParseTreesDepth = Math.max(childNodeParseTreesDepth, childNodeParseTreeDepth);
      });

      var width = lastVerticalBranchPosition - firstVerticalBranchPosition + 1,
          verticalBranchParseTree = VerticalBranchParseTree.fromWidth(width),
          horizontalBranchParseTree = HorizontalBranchParseTree.fromWidth(width),
          leftMarginWidth = firstVerticalBranchPosition,
          rightMarginWidth = childNodeParseTreesWidth - width - leftMarginWidth;

      verticalBranchParseTree.addLeftMargin(leftMarginWidth);
      verticalBranchParseTree.addRightMargin(rightMarginWidth);
      horizontalBranchParseTree.addLeftMargin(leftMarginWidth);
      horizontalBranchParseTree.addRightMargin(rightMarginWidth);

      var verticalBranchPosition = verticalBranchParseTree.getVerticalBranchPosition(),
          childNodesParseTree = VerticalBranchParseTree.fromDepthAndVerticalBranchPosition(ChildNodesParseTree, childNodeParseTreesDepth, verticalBranchPosition);

      childNodeParseTrees.forEach(function (childNodeParseTree, index) {
        var childNodeParseTreeDepth = childNodeParseTree.getDepth(),
            clonedChildNodeParseTree = childNodeParseTree.clone();

        if (index < childNodeParseTreesLength - 1) {
          var _rightMarginWidth = 1;

          clonedChildNodeParseTree.addRightMargin(_rightMarginWidth);
        }

        if (childNodeParseTreeDepth < childNodeParseTreesDepth) {
          var bottomMarginDepth = childNodeParseTreesDepth - childNodeParseTreeDepth;

          clonedChildNodeParseTree.addBottomMargin(bottomMarginDepth);
        }

        childNodesParseTree.appendToRight(clonedChildNodeParseTree);
      });

      childNodesParseTree.appendToTop(horizontalBranchParseTree);
      childNodesParseTree.appendToTop(verticalBranchParseTree);

      return childNodesParseTree;
    }
  }]);

  return ChildNodesParseTree;
}(VerticalBranchParseTree);

module.exports = ChildNodesParseTree;

},{"./horizontalBranch":69,"./verticalBranch":73}],68:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var lexers = require('occam-lexers');

var VerticalBranchParseTree = require('./verticalBranch');

var BNFLexer = lexers.BNFLexer,
    specialSymbols = BNFLexer.specialSymbols,
    epsilon = specialSymbols.epsilon;

var EpsilonNodeParseTree = function (_VerticalBranchParseT) {
      _inherits(EpsilonNodeParseTree, _VerticalBranchParseT);

      function EpsilonNodeParseTree() {
            _classCallCheck(this, EpsilonNodeParseTree);

            return _possibleConstructorReturn(this, (EpsilonNodeParseTree.__proto__ || Object.getPrototypeOf(EpsilonNodeParseTree)).apply(this, arguments));
      }

      _createClass(EpsilonNodeParseTree, null, [{
            key: 'fromNothing',
            value: function fromNothing() {
                  var string = epsilon,
                      ///
                  stringLength = string.length,
                      verticalBranchParseTreeWidth = stringLength,
                      ///
                  verticalBranchParseTree = VerticalBranchParseTree.fromWidth(verticalBranchParseTreeWidth),
                      verticalBranchPosition = verticalBranchParseTree.getVerticalBranchPosition(),
                      terminalNodeParseTree = VerticalBranchParseTree.fromStringAndVerticalBranchPosition(EpsilonNodeParseTree, string, verticalBranchPosition);

                  terminalNodeParseTree.appendToTop(verticalBranchParseTree);

                  return terminalNodeParseTree;
            }
      }]);

      return EpsilonNodeParseTree;
}(VerticalBranchParseTree);

module.exports = EpsilonNodeParseTree;

},{"./verticalBranch":73,"occam-lexers":173}],69:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ParseTree = require('../parseTree');

var HorizontalBranchParseTree = function (_ParseTree) {
  _inherits(HorizontalBranchParseTree, _ParseTree);

  function HorizontalBranchParseTree() {
    _classCallCheck(this, HorizontalBranchParseTree);

    return _possibleConstructorReturn(this, (HorizontalBranchParseTree.__proto__ || Object.getPrototypeOf(HorizontalBranchParseTree)).apply(this, arguments));
  }

  _createClass(HorizontalBranchParseTree, null, [{
    key: 'fromWidth',
    value: function fromWidth(width) {
      var string = stringFromCharactersWidth(width, '-'),
          line = string,
          ///
      lines = [line],
          horizontalBranchParseTree = new HorizontalBranchParseTree(lines);

      return horizontalBranchParseTree;
    }
  }]);

  return HorizontalBranchParseTree;
}(ParseTree);

module.exports = HorizontalBranchParseTree;

function stringFromCharactersWidth(charactersWidth, character) {
  var string = '';

  for (var index = 0; index < charactersWidth; index++) {
    string += character;
  }

  return string;
}

},{"../parseTree":66}],70:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var arrayUtilities = require('../../utilities/array'),
    RuleNameParseTree = require('./ruleName'),
    ChildNodesParseTree = require('./childNodes'),
    VerticalBranchParseTree = require('./verticalBranch');

var first = arrayUtilities.first;

var NonTerminalNodeParseTree = function (_VerticalBranchParseT) {
  _inherits(NonTerminalNodeParseTree, _VerticalBranchParseT);

  function NonTerminalNodeParseTree() {
    _classCallCheck(this, NonTerminalNodeParseTree);

    return _possibleConstructorReturn(this, (NonTerminalNodeParseTree.__proto__ || Object.getPrototypeOf(NonTerminalNodeParseTree)).apply(this, arguments));
  }

  _createClass(NonTerminalNodeParseTree, null, [{
    key: 'fromNonTerminalNodeAndTokens',
    value: function fromNonTerminalNodeAndTokens(nonTerminalNode, tokens) {
      var childNodes = nonTerminalNode.getChildNodes(),
          firstChildNode = first(childNodes),
          childNode = firstChildNode,
          childNodesLength = childNodes.length,
          childNodeOrNodesParseTree = childNodesLength === 1 ? childNode.asParseTree(tokens) : ChildNodesParseTree.fromChildNodesAndTokens(childNodes, tokens),
          ruleNameParseTree = RuleNameParseTree.fromNonTerminalNodeAndTokens(nonTerminalNode, tokens);

      var ruleNameParseTreeVerticalBranchPosition = ruleNameParseTree.getVerticalBranchPosition();

      var childNodeOrNodesParseTreeVerticalBranchPosition = childNodeOrNodesParseTree.getVerticalBranchPosition(),
          verticalBranchPositionsDifference = ruleNameParseTreeVerticalBranchPosition - childNodeOrNodesParseTreeVerticalBranchPosition;

      var leftMarginWidth = undefined;

      if (false) {} else if (verticalBranchPositionsDifference < 0) {
        leftMarginWidth = -verticalBranchPositionsDifference;

        ruleNameParseTree.addLeftMargin(leftMarginWidth);
      } else if (verticalBranchPositionsDifference > 0) {
        leftMarginWidth = +verticalBranchPositionsDifference;

        childNodeOrNodesParseTree.addLeftMargin(leftMarginWidth);
      }

      var ruleNameParseTreeWidth = ruleNameParseTree.getWidth(),
          childNodeOrNodesParseTreeWidth = childNodeOrNodesParseTree.getWidth(),
          widthsDifference = ruleNameParseTreeWidth - childNodeOrNodesParseTreeWidth;

      var rightMarginWidth = undefined;

      if (false) {} else if (widthsDifference < 0) {
        rightMarginWidth = -widthsDifference;

        ruleNameParseTree.addRightMargin(rightMarginWidth);
      } else if (widthsDifference > 0) {
        rightMarginWidth = +widthsDifference;

        childNodeOrNodesParseTree.addRightMargin(rightMarginWidth);
      }

      ruleNameParseTreeVerticalBranchPosition = ruleNameParseTree.getVerticalBranchPosition();

      var ruleNameParseTreeDepth = ruleNameParseTree.getDepth(),
          nonTerminalNodeParseTreeDepth = ruleNameParseTreeDepth,
          ///
      verticalBranchPosition = ruleNameParseTreeVerticalBranchPosition,
          ///
      nonTerminalNodeParseTree = VerticalBranchParseTree.fromDepthAndVerticalBranchPosition(NonTerminalNodeParseTree, nonTerminalNodeParseTreeDepth, verticalBranchPosition);

      nonTerminalNodeParseTree.appendToRight(ruleNameParseTree);
      nonTerminalNodeParseTree.appendToBottom(childNodeOrNodesParseTree);

      return nonTerminalNodeParseTree;
    }
  }]);

  return NonTerminalNodeParseTree;
}(VerticalBranchParseTree);

module.exports = NonTerminalNodeParseTree;

},{"../../utilities/array":97,"./childNodes":67,"./ruleName":71,"./verticalBranch":73}],71:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VerticalBranchParseTree = require('./verticalBranch');

var RuleNameParseTree = function (_VerticalBranchParseT) {
  _inherits(RuleNameParseTree, _VerticalBranchParseT);

  function RuleNameParseTree() {
    _classCallCheck(this, RuleNameParseTree);

    return _possibleConstructorReturn(this, (RuleNameParseTree.__proto__ || Object.getPrototypeOf(RuleNameParseTree)).apply(this, arguments));
  }

  _createClass(RuleNameParseTree, null, [{
    key: 'fromNonTerminalNodeAndTokens',
    value: function fromNonTerminalNodeAndTokens(nonTerminalNode, tokens) {
      var ruleName = nonTerminalNode.getRuleName(),
          tokenIndexes = tokenIndexesFromNonTerminalNodeAndTokens(nonTerminalNode, tokens),
          string = '' + ruleName + tokenIndexes,
          stringLength = string.length,
          verticalBranchParseTreeWidth = stringLength,
          ///
      verticalBranchParseTree = VerticalBranchParseTree.fromWidth(verticalBranchParseTreeWidth),
          verticalBranchPosition = verticalBranchParseTree.getVerticalBranchPosition(),
          ruleNameParseTree = VerticalBranchParseTree.fromStringAndVerticalBranchPosition(RuleNameParseTree, string, verticalBranchPosition);

      ruleNameParseTree.appendToTop(verticalBranchParseTree);

      return ruleNameParseTree;
    }
  }]);

  return RuleNameParseTree;
}(VerticalBranchParseTree);

module.exports = RuleNameParseTree;

function tokenIndexesFromNonTerminalNodeAndTokens(nonTerminalNode, tokens) {
  var tokenIndexes = void 0;

  var nonTerminalNodeNullified = nonTerminalNode.isNullified();

  if (nonTerminalNodeNullified) {
    tokenIndexes = '';
  } else {
    var firstSignificantToken = nonTerminalNode.getFirstSignificantToken(),
        lastSignificantToken = nonTerminalNode.getLastSignificantToken(),
        firstSignificantTokenIndex = tokens.indexOf(firstSignificantToken),
        lastSignificantTokenIndex = tokens.indexOf(lastSignificantToken);

    tokenIndexes = firstSignificantTokenIndex !== lastSignificantTokenIndex ? '(' + firstSignificantTokenIndex + '-' + lastSignificantTokenIndex + ')' : '(' + firstSignificantTokenIndex + ')';
  }

  return tokenIndexes;
}

},{"./verticalBranch":73}],72:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VerticalBranchParseTree = require('./verticalBranch');

var TerminalNodeParseTree = function (_VerticalBranchParseT) {
  _inherits(TerminalNodeParseTree, _VerticalBranchParseT);

  function TerminalNodeParseTree() {
    _classCallCheck(this, TerminalNodeParseTree);

    return _possibleConstructorReturn(this, (TerminalNodeParseTree.__proto__ || Object.getPrototypeOf(TerminalNodeParseTree)).apply(this, arguments));
  }

  _createClass(TerminalNodeParseTree, null, [{
    key: 'fromTerminalNodeAndTokens',
    value: function fromTerminalNodeAndTokens(terminalNode, tokens) {
      var significantToken = terminalNode.getSignificantToken(),
          content = terminalNode.getContent(),
          type = significantToken.getType(),
          tokenIndex = tokens.indexOf(significantToken),
          string = content + '[' + type + '](' + tokenIndex + ')',
          stringLength = string.length,
          verticalBranchParseTreeWidth = stringLength,
          ///
      verticalBranchParseTree = VerticalBranchParseTree.fromWidth(verticalBranchParseTreeWidth),
          verticalBranchPosition = verticalBranchParseTree.getVerticalBranchPosition(),
          terminalNodeParseTree = VerticalBranchParseTree.fromStringAndVerticalBranchPosition(TerminalNodeParseTree, string, verticalBranchPosition);

      terminalNodeParseTree.appendToTop(verticalBranchParseTree);

      return terminalNodeParseTree;
    }
  }]);

  return TerminalNodeParseTree;
}(VerticalBranchParseTree);

module.exports = TerminalNodeParseTree;

},{"./verticalBranch":73}],73:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ParseTree = require('../parseTree');

var VerticalBranchParseTree = function (_ParseTree) {
  _inherits(VerticalBranchParseTree, _ParseTree);

  function VerticalBranchParseTree(lines, verticalBranchPosition) {
    _classCallCheck(this, VerticalBranchParseTree);

    var _this = _possibleConstructorReturn(this, (VerticalBranchParseTree.__proto__ || Object.getPrototypeOf(VerticalBranchParseTree)).call(this, lines));

    _this.verticalBranchPosition = verticalBranchPosition;
    return _this;
  }

  _createClass(VerticalBranchParseTree, [{
    key: 'getVerticalBranchPosition',
    value: function getVerticalBranchPosition() {
      return this.verticalBranchPosition;
    }
  }, {
    key: 'addLeftMargin',
    value: function addLeftMargin(leftMarginWidth) {
      _get(VerticalBranchParseTree.prototype.__proto__ || Object.getPrototypeOf(VerticalBranchParseTree.prototype), 'addLeftMargin', this).call(this, leftMarginWidth);

      this.verticalBranchPosition += leftMarginWidth; ///
    }
  }], [{
    key: 'fromWidth',
    value: function fromWidth(width) {
      var string = '|',
          verticalBranchPosition = 0,
          verticalBranchParseTree = VerticalBranchParseTree.fromStringAndVerticalBranchPosition(VerticalBranchParseTree, string, verticalBranchPosition),
          leftMarginWidth = Math.floor(width / 2),
          rightMarginWidth = width - leftMarginWidth - 1;

      verticalBranchParseTree.addLeftMargin(leftMarginWidth);
      verticalBranchParseTree.addRightMargin(rightMarginWidth);

      return verticalBranchParseTree;
    }
  }, {
    key: 'fromDepthAndVerticalBranchPosition',
    value: function fromDepthAndVerticalBranchPosition(Class, depth, verticalBranchPosition) {
      var lines = linesFromDepth(depth),
          args = [null, lines, verticalBranchPosition],
          verticalBranchParseTree = new (Function.prototype.bind.apply(Class, args))(); ///

      return verticalBranchParseTree;
    }
  }, {
    key: 'fromStringAndVerticalBranchPosition',
    value: function fromStringAndVerticalBranchPosition(Class, string, verticalBranchPosition) {
      if (verticalBranchPosition === undefined) {
        verticalBranchPosition = string;
        string = Class;
        Class = ParseTree;
      }

      var line = string,
          ///
      lines = [line],
          args = [null, lines, verticalBranchPosition],
          verticalBranchParseTree = new (Function.prototype.bind.apply(Class, args))(); ///

      return verticalBranchParseTree;
    }
  }]);

  return VerticalBranchParseTree;
}(ParseTree);

module.exports = VerticalBranchParseTree;

function linesFromDepth(depth) {
  var lines = [];

  var index = 0;

  while (index < depth) {
    lines[index++] = '';
  }

  return lines;
}

},{"../parseTree":66}],74:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Configuration = require('./configuration'),
    arrayUtilities = require('../utilities/array');

var first = arrayUtilities.first;

var CommonParser = function () {
  function CommonParser(rules) {
    _classCallCheck(this, CommonParser);

    this.rules = rules;
  }

  _createClass(CommonParser, [{
    key: 'getRules',
    value: function getRules() {
      return this.rules;
    }
  }, {
    key: 'parse',
    value: function parse(tokens) {
      var rule = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      var node = null;

      if (rule === null) {
        var rulesLength = this.rules.length;

        if (rulesLength > 0) {
          var firstRule = first(this.rules);

          rule = firstRule; ///
        }
      }

      if (rule !== null) {
        var configuration = Configuration.fromTokensAndRules(tokens, this.rules),
            noWhitespace = false,
            ///
        nodeOrNodes = rule.parse(configuration, noWhitespace);

        if (nodeOrNodes !== null) {
          node = nodeOrNodes instanceof Array ? first(nodeOrNodes) : nodeOrNodes;
        }
      }

      return node;
    }
  }, {
    key: 'rulesAsString',
    value: function rulesAsString() {
      var maximumRuleNameLength = this.rules.reduce(function (maximumRuleNameLength, rule) {
        var ruleName = rule.getName(),
            ruleNameLength = ruleName.length;

        maximumRuleNameLength = Math.max(maximumRuleNameLength, ruleNameLength);

        return maximumRuleNameLength;
      }, 0),
          rulesString = this.rules.reduce(function (rulesString, rule) {
        var ruleString = rule.asString(maximumRuleNameLength);

        rulesString += ruleString;

        return rulesString;
      }, '');

      return rulesString;
    }
  }]);

  return CommonParser;
}();

module.exports = CommonParser;

},{"../utilities/array":97,"./configuration":61}],75:[function(require,module,exports){
'use strict';

var bnf = '\n\n\n\n    stylesheet                 ::= ( media | ruleSet | declaration | verticalSpace | error )+ ;\n\n\n\n\n\n    media                      ::= "@media" mediaQueries "{" ( ruleSet | declaration | verticalSpace )* "}" verticalSpace? ;\n                                                              \n                                                              \n    mediaQueries               ::=  mediaQuery ( "," verticalSpace? mediaQuery )* ;\n                                                              \n                                                              \n    mediaQuery                 ::=  "not"? ( "only"? mediaType "and" )? mediaExpression ( "and" mediaExpression )* ;\n\n\n    mediaType                  ::=  "all" | "print" | "screen" | "speech" ;\n                                                              \n                                                              \n    mediaExpression            ::=  "(" [identifier] ( ":" expression )? ")" ;\n\n\n\n\n\n    ruleSet                    ::=  selectors "{" ( declaration | verticalSpace )* "}" verticalSpace? ;\n\n\n    selectors                  ::=  selector ( "," verticalSpace? selector )* ;\n\n\n    selector                   ::=  ( class | pseudoClass | pseudoElement | attribute )+ ;\n\n\n\n\n\n    declaration                ::=  property ":" verticalSpace? expression ( "," verticalSpace? expression )* priority? ";" ;\n\n\n    class                      ::=  "."<NO_WHITESPACE>[identifier]<NO_WHITESPACE>( "(" selector ")" )? ;\n\n\n    pseudoClass                ::=  ":"<NO_WHITESPACE>[identifier]<NO_WHITESPACE>( "(" selector ")" )? ;\n\n\n    pseudoElement              ::=  "::"<NO_WHITESPACE>[identifier]<NO_WHITESPACE>( "(" selector ")" )? ;\n\n\n    attribute                  ::=  "["\n\n                                       verticalSpace?\n\n                                       [identifier]\n\n                                       verticalSpace?\n   \n                                       (\n\n                                         ( "=" | "~=" | "|=" )\n\n                                         verticalSpace?\n\n                                         ( [identifier] | [stringLiteral] )\n\n                                         verticalSpace?\n\n                                       )?\n\n                                    "]"\n\n                                 ;\n\n\n    property                   ::=  [identifier] verticalSpace? ;\n\n\n    expression                 ::=  term ( ( "," verticalSpace? )? term )* ;\n\n\n    priority                   ::=  "!important" ;\n\n\n\n\n\n    term                       ::=  [unaryOperator]?\n                                                       \n                                      (\n                                                       \n                                        ( [percentage] | [frequency] | [length] | [angle] | [rems] | [ems] | [time] | [number] )\n                                                       \n                                        |\n                                                       \n                                        uri\n                                                       \n                                        |\n                                                       \n                                        function\n                                                       \n                                        |\n                                                       \n                                        [stringLiteral]\n                                                       \n                                        |\n                                                       \n                                        [identifier]\n                                                       \n                                        |\n                                                       \n                                        [colour]\n                                                       \n                                      )\n                                                       \n                                   ;\n\n\n    uri                        ::=  "url"<NO_WHITESPACE>"(" [stringLiteral] ")" ;\n\n\n    function                   ::=  [identifier]<NO_WHITESPACE>"(" expression ")" ;\n\n\n\n\n\n    verticalSpace              ::=  <END_OF_LINE>+ ;\n\n\n\n\n\n    error                      ::=  . ;\n\n\n\n';

module.exports = bnf;

},{}],76:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var lexers = require('occam-lexers');

var bnf = require('./bnf'),
    BNFParser = require('../bnf/parser'),
    CommonParser = require('../common/parser');

var BNFLexer = lexers.BNFLexer;


var bnfLexer = BNFLexer.fromNothing(),
    bnfParser = BNFParser.fromNothing();

var CSSParser = function (_CommonParser) {
  _inherits(CSSParser, _CommonParser);

  function CSSParser() {
    _classCallCheck(this, CSSParser);

    return _possibleConstructorReturn(this, (CSSParser.__proto__ || Object.getPrototypeOf(CSSParser)).apply(this, arguments));
  }

  _createClass(CSSParser, null, [{
    key: 'fromBNF',
    value: function fromBNF(bnf) {
      var cssParser = null;

      try {
        var tokens = bnfLexer.tokensFromBNF(bnf),
            rulesNode = bnfParser.rulesNodeFromTokens(tokens),
            rules = BNFParser.generateRules(rulesNode);

        cssParser = new CSSParser(rules);
      } catch (error) {}

      return cssParser;
    }
  }, {
    key: 'fromNothing',
    value: function fromNothing() {
      var cssParser = CSSParser.fromBNF(bnf);

      return cssParser;
    }
  }]);

  return CSSParser;
}(CommonParser);

Object.assign(CSSParser, {
  bnf: bnf
});

module.exports = CSSParser;

},{"../bnf/parser":30,"../common/parser":74,"./bnf":75,"occam-lexers":173}],77:[function(require,module,exports){
'use strict';

require('juxtapose');

var easy = require('easy');

var CSSExampleView = require('./example/css/view'),
    BNFExampleView = require('./example/bnf/view'),
    BasicExampleView = require('./example/basic/view'),
    FlorenceExampleView = require('./example/florence/view');

var Body = easy.Body;


var ExampleView = void 0;

var body = new Body(),
    example = window.location.search.substring(1);

switch (example) {
      case 'css':
            ExampleView = CSSExampleView;break;
      case 'bnf':
            ExampleView = BNFExampleView;break;
      case 'basic':
            ExampleView = BasicExampleView;break;
      case 'florence':
            ExampleView = FlorenceExampleView;break;
}

var exampleView = React.createElement(ExampleView, null);

exampleView.appendTo(body);

},{"./example/basic/view":78,"./example/bnf/view":79,"./example/css/view":86,"./example/florence/view":87,"easy":137,"juxtapose":164}],78:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var lexers = require('occam-lexers');

var ExampleView = require('../../example/view'),
    BasicParser = require('../../basic/parser');

var BasicLexer = lexers.BasicLexer;

var BasicExampleView = function (_ExampleView) {
  _inherits(BasicExampleView, _ExampleView);

  function BasicExampleView() {
    _classCallCheck(this, BasicExampleView);

    return _possibleConstructorReturn(this, (BasicExampleView.__proto__ || Object.getPrototypeOf(BasicExampleView)).apply(this, arguments));
  }

  _createClass(BasicExampleView, [{
    key: 'getTitle',
    value: function getTitle() {
      var title = 'Basic parser example';

      return title;
    }
  }, {
    key: 'getLexer',
    value: function getLexer() {
      var Lexer = BasicLexer; ///

      return Lexer;
    }
  }, {
    key: 'getParser',
    value: function getParser() {
      var Parser = BasicParser; ///

      return Parser;
    }
  }, {
    key: 'getInitialContent',
    value: function getInitialContent() {
      var initialContent = '1+2/3';

      return initialContent;
    }
  }], [{
    key: 'fromProperties',
    value: function fromProperties(properties) {
      return ExampleView.fromProperties(BasicExampleView, properties);
    }
  }]);

  return BasicExampleView;
}(ExampleView);

Object.assign(BasicExampleView, {
  defaultProperties: {
    className: 'basic'
  }
});

module.exports = BasicExampleView;

},{"../../basic/parser":2,"../../example/view":88,"occam-lexers":173}],79:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var lexers = require('occam-lexers'),
    easyLayout = require('easy-layout');

var BNFParser = require('../../bnf/parser'),
    ExampleView = require('../../example/view'),
    BNFTextarea = require('../common/textarea/bnf'),
    ContentTextarea = require('../common/textarea/content'),
    ParseTreeTextarea = require('../common/textarea/parseTree'),
    LexicalEntriesTextarea = require('../common/textarea/lexicalEntries'),
    MainVerticalSplitter = require('../common/verticalSplitter/main');

var BNFLexer = lexers.BNFLexer,
    SizeableElement = easyLayout.SizeableElement;

var BNFExampleView = function (_ExampleView) {
	_inherits(BNFExampleView, _ExampleView);

	function BNFExampleView() {
		_classCallCheck(this, BNFExampleView);

		return _possibleConstructorReturn(this, (BNFExampleView.__proto__ || Object.getPrototypeOf(BNFExampleView)).apply(this, arguments));
	}

	_createClass(BNFExampleView, [{
		key: 'getLexer',
		value: function getLexer() {
			var Lexer = BNFLexer; ///

			return Lexer;
		}
	}, {
		key: 'getParser',
		value: function getParser() {
			var Parser = BNFParser; ///

			return Parser;
		}
	}, {
		key: 'getParseTree',
		value: function getParseTree() {
			var parseTree = null;

			var bnfLexer = BNFLexer.fromNothing(),
			    bnfParser = BNFParser.fromNothing(),
			    content = this.getContent(),
			    tokens = bnfLexer.tokenise(content),
			    node = bnfParser.parse(tokens);

			if (node !== null) {
				parseTree = node.asParseTree(tokens);
			}

			return parseTree;
		}
	}, {
		key: 'childElements',
		value: function childElements(properties) {
			var keyUpHandler = this.keyUpHandler.bind(this);

			return [React.createElement(
				'h1',
				null,
				'BNF parser example'
			), React.createElement(
				'div',
				{ className: 'columns' },
				React.createElement(
					SizeableElement,
					null,
					React.createElement(
						'h2',
						null,
						'Lexical entries'
					),
					React.createElement(LexicalEntriesTextarea, { readOnly: true }),
					React.createElement(
						'h2',
						null,
						'BNF'
					),
					React.createElement(BNFTextarea, { readOnly: true })
				),
				React.createElement(MainVerticalSplitter, null),
				React.createElement(
					'div',
					{ className: 'column' },
					React.createElement(
						'h2',
						null,
						'Parse tree'
					),
					React.createElement(ParseTreeTextarea, null),
					React.createElement(
						'h2',
						null,
						'Content'
					),
					React.createElement(ContentTextarea, { onKeyUp: keyUpHandler })
				)
			)];
		}
	}, {
		key: 'getInitialContent',
		value: function getInitialContent() {
			var bnf = BNFParser.bnf,
			    initialContent = bnf; ///

			return initialContent;
		}
	}], [{
		key: 'fromProperties',
		value: function fromProperties(properties) {
			return ExampleView.fromProperties(BNFExampleView, properties);
		}
	}]);

	return BNFExampleView;
}(ExampleView);

Object.assign(BNFExampleView, {
	defaultProperties: {
		className: 'bnf'
	}
});

module.exports = BNFExampleView;

},{"../../bnf/parser":30,"../../example/view":88,"../common/textarea/bnf":81,"../common/textarea/content":82,"../common/textarea/lexicalEntries":83,"../common/textarea/parseTree":84,"../common/verticalSplitter/main":85,"easy-layout":102,"occam-lexers":173}],80:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var easy = require('easy');

var InputElement = easy.InputElement;

var RuleNameInput = function (_InputElement) {
  _inherits(RuleNameInput, _InputElement);

  function RuleNameInput() {
    _classCallCheck(this, RuleNameInput);

    return _possibleConstructorReturn(this, (RuleNameInput.__proto__ || Object.getPrototypeOf(RuleNameInput)).apply(this, arguments));
  }

  _createClass(RuleNameInput, [{
    key: 'getRuleName',
    value: function getRuleName() {
      var value = this.getValue(),
          ruleName = value; ///

      return ruleName;
    }
  }, {
    key: 'parentContext',
    value: function parentContext() {
      var getRuleName = this.getRuleName.bind(this);

      return {
        getRuleName: getRuleName
      };
    }
  }], [{
    key: 'fromProperties',
    value: function fromProperties(properties) {
      return InputElement.fromProperties(RuleNameInput, properties);
    }
  }]);

  return RuleNameInput;
}(InputElement);

Object.assign(RuleNameInput, {
  tagName: 'input',
  defaultProperties: {
    type: 'text',
    className: 'ruleName',
    spellCheck: 'false'
  }
});

module.exports = RuleNameInput;

},{"easy":137}],81:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var easy = require('easy');

var InputElement = easy.InputElement;

var BNFTextarea = function (_InputElement) {
  _inherits(BNFTextarea, _InputElement);

  function BNFTextarea() {
    _classCallCheck(this, BNFTextarea);

    return _possibleConstructorReturn(this, (BNFTextarea.__proto__ || Object.getPrototypeOf(BNFTextarea)).apply(this, arguments));
  }

  _createClass(BNFTextarea, [{
    key: 'getBNF',
    value: function getBNF() {
      var value = this.getValue(),
          bnf = value; ///

      return bnf;
    }
  }, {
    key: 'setBNF',
    value: function setBNF(bnf) {
      var value = bnf; ///

      this.setValue(value);
    }
  }, {
    key: 'parentContext',
    value: function parentContext() {
      var getBNF = this.getBNF.bind(this),
          setBNF = this.setBNF.bind(this);

      return {
        getBNF: getBNF,
        setBNF: setBNF
      };
    }
  }], [{
    key: 'fromProperties',
    value: function fromProperties(properties) {
      return InputElement.fromProperties(BNFTextarea, properties);
    }
  }]);

  return BNFTextarea;
}(InputElement);

Object.assign(BNFTextarea, {
  tagName: 'textarea',
  defaultProperties: {
    className: 'bnf',
    spellCheck: 'false'
  }
});

module.exports = BNFTextarea;

},{"easy":137}],82:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var easy = require('easy');

var InputElement = easy.InputElement;

var ContentTextarea = function (_InputElement) {
  _inherits(ContentTextarea, _InputElement);

  function ContentTextarea() {
    _classCallCheck(this, ContentTextarea);

    return _possibleConstructorReturn(this, (ContentTextarea.__proto__ || Object.getPrototypeOf(ContentTextarea)).apply(this, arguments));
  }

  _createClass(ContentTextarea, [{
    key: 'getContent',
    value: function getContent() {
      var value = this.getValue(),
          content = value; ///

      return content;
    }
  }, {
    key: 'setContent',
    value: function setContent(content) {
      var value = content;

      this.setValue(value);
    }
  }, {
    key: 'showError',
    value: function showError() {
      this.addClass('error');
    }
  }, {
    key: 'hideError',
    value: function hideError() {
      this.removeClass('error');
    }
  }, {
    key: 'parentContext',
    value: function parentContext() {
      var getContent = this.getContent.bind(this),
          setContent = this.setContent.bind(this),
          showError = this.showError.bind(this),
          hideError = this.hideError.bind(this);

      return {
        getContent: getContent,
        setContent: setContent,
        showError: showError,
        hideError: hideError
      };
    }
  }], [{
    key: 'fromProperties',
    value: function fromProperties(properties) {
      return InputElement.fromProperties(ContentTextarea, properties);
    }
  }]);

  return ContentTextarea;
}(InputElement);

Object.assign(ContentTextarea, {
  tagName: 'textarea',
  defaultProperties: {
    className: 'content',
    spellCheck: 'false'
  }
});

module.exports = ContentTextarea;

},{"easy":137}],83:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var easy = require('easy');

var InputElement = easy.InputElement;

var LexicalEntriesTextarea = function (_InputElement) {
  _inherits(LexicalEntriesTextarea, _InputElement);

  function LexicalEntriesTextarea(selector, changeHandler, keyUpHandler) {
    _classCallCheck(this, LexicalEntriesTextarea);

    var _this = _possibleConstructorReturn(this, (LexicalEntriesTextarea.__proto__ || Object.getPrototypeOf(LexicalEntriesTextarea)).call(this, selector, changeHandler));

    if (keyUpHandler) {
      _this.onKeyUp(keyUpHandler);
    }
    return _this;
  }

  _createClass(LexicalEntriesTextarea, [{
    key: 'onKeyUp',
    value: function onKeyUp(keyUpHandler) {
      this.on('keyUp', keyUpHandler);
    }
  }, {
    key: 'getLexicalEntries',
    value: function getLexicalEntries() {
      var value = this.getValue(),
          lexicalEntries = JSON.parse(value);

      return lexicalEntries;
    }
  }, {
    key: 'setLexicalEntries',
    value: function setLexicalEntries(lexicalEntries) {
      var value = JSON.stringify(lexicalEntries, null, '  ');

      this.setValue(value);
    }
  }, {
    key: 'parentContext',
    value: function parentContext() {
      var getLexicalEntries = this.getLexicalEntries.bind(this),
          setLexicalEntries = this.setLexicalEntries.bind(this);

      return {
        getLexicalEntries: getLexicalEntries,
        setLexicalEntries: setLexicalEntries
      };
    }
  }], [{
    key: 'fromProperties',
    value: function fromProperties(properties) {
      return InputElement.fromProperties(LexicalEntriesTextarea, properties);
    }
  }]);

  return LexicalEntriesTextarea;
}(InputElement);

Object.assign(LexicalEntriesTextarea, {
  tagName: 'textarea',
  defaultProperties: {
    className: 'lexicalEntries',
    spellCheck: 'false'
  }
});

module.exports = LexicalEntriesTextarea;

},{"easy":137}],84:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var easy = require('easy');

var InputElement = easy.InputElement;

var ParseTreeTextarea = function (_InputElement) {
  _inherits(ParseTreeTextarea, _InputElement);

  function ParseTreeTextarea() {
    _classCallCheck(this, ParseTreeTextarea);

    return _possibleConstructorReturn(this, (ParseTreeTextarea.__proto__ || Object.getPrototypeOf(ParseTreeTextarea)).apply(this, arguments));
  }

  _createClass(ParseTreeTextarea, [{
    key: 'setParseTree',
    value: function setParseTree(parseTree) {
      if (parseTree !== null) {
        parseTree.shiftLine(); //

        var parseTreeString = parseTree.asString(),
            value = parseTreeString; ///

        this.setValue(value);
      } else {
        this.clearParseTree();
      }
    }
  }, {
    key: 'clearParseTree',
    value: function clearParseTree() {
      var value = '';

      this.setValue(value);
    }
  }, {
    key: 'parentContext',
    value: function parentContext() {
      var setParseTree = this.setParseTree.bind(this),
          clearParseTree = this.clearParseTree.bind(this);

      return {
        setParseTree: setParseTree,
        clearParseTree: clearParseTree
      };
    }
  }], [{
    key: 'fromProperties',
    value: function fromProperties(properties) {
      return InputElement.fromProperties(ParseTreeTextarea, properties);
    }
  }]);

  return ParseTreeTextarea;
}(InputElement);

Object.assign(ParseTreeTextarea, {
  tagName: 'textarea',
  defaultProperties: {
    className: 'parseTree',
    spellCheck: 'false',
    readOnly: true
  }
});

module.exports = ParseTreeTextarea;

},{"easy":137}],85:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var easylayout = require('easy-layout');

var Splitter = easylayout.Splitter,
    VerticalSplitter = easylayout.VerticalSplitter;

var MainVerticalSplitter = function (_VerticalSplitter) {
  _inherits(MainVerticalSplitter, _VerticalSplitter);

  function MainVerticalSplitter() {
    _classCallCheck(this, MainVerticalSplitter);

    return _possibleConstructorReturn(this, (MainVerticalSplitter.__proto__ || Object.getPrototypeOf(MainVerticalSplitter)).apply(this, arguments));
  }

  _createClass(MainVerticalSplitter, null, [{
    key: 'fromProperties',
    value: function fromProperties(properties) {
      var afterSizeableElement = true;

      Object.assign(properties, { afterSizeableElement: afterSizeableElement });

      var mainVerticalSplitter = Splitter.fromProperties(MainVerticalSplitter, properties);

      return mainVerticalSplitter;
    }
  }]);

  return MainVerticalSplitter;
}(VerticalSplitter);

Object.assign(MainVerticalSplitter, {
  defaultProperties: {
    className: 'main'
  }
});

module.exports = MainVerticalSplitter;

},{"easy-layout":102}],86:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var lexers = require('occam-lexers');

var CSSParser = require('../../css/parser'),
    ExampleView = require('../../example/view');

var CSSLexer = lexers.CSSLexer;

var CSSExampleView = function (_ExampleView) {
  _inherits(CSSExampleView, _ExampleView);

  function CSSExampleView() {
    _classCallCheck(this, CSSExampleView);

    return _possibleConstructorReturn(this, (CSSExampleView.__proto__ || Object.getPrototypeOf(CSSExampleView)).apply(this, arguments));
  }

  _createClass(CSSExampleView, [{
    key: 'getTitle',
    value: function getTitle() {
      var title = 'CSS parser example';

      return title;
    }
  }, {
    key: 'getLexer',
    value: function getLexer() {
      var Lexer = CSSLexer; ///

      return Lexer;
    }
  }, {
    key: 'getParser',
    value: function getParser() {
      var Parser = CSSParser; ///

      return Parser;
    }
  }, {
    key: 'getInitialContent',
    value: function getInitialContent() {
      var initialContent = 'background-color : white !important;\n';

      return initialContent;
    }
  }], [{
    key: 'fromProperties',
    value: function fromProperties(properties) {
      return ExampleView.fromProperties(CSSExampleView, properties);
    }
  }]);

  return CSSExampleView;
}(ExampleView);

Object.assign(CSSExampleView, {
  defaultProperties: {
    className: 'css'
  }
});

module.exports = CSSExampleView;

},{"../../css/parser":76,"../../example/view":88,"occam-lexers":173}],87:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var lexers = require('occam-lexers'),
    easyLayout = require('easy-layout');

var ruleUtilities = require('../../utilities/rule'),
    ExampleView = require('../../example/view'),
    FlorenceParser = require('../../florence/parser'),
    RuleNameInput = require('../common/input/ruleName'),
    BNFTextarea = require('../common/textarea/bnf'),
    ContentTextarea = require('../common/textarea/content'),
    ParseTreeTextarea = require('../common/textarea/parseTree'),
    LexicalEntriesTextarea = require('../common/textarea/lexicalEntries'),
    MainVerticalSplitter = require('../common/verticalSplitter/main');

var FlorenceLexer = lexers.FlorenceLexer,
    findRuleByName = ruleUtilities.findRuleByName,
    SizeableElement = easyLayout.SizeableElement;

var FlorenceExampleView = function (_ExampleView) {
  _inherits(FlorenceExampleView, _ExampleView);

  function FlorenceExampleView() {
    _classCallCheck(this, FlorenceExampleView);

    return _possibleConstructorReturn(this, (FlorenceExampleView.__proto__ || Object.getPrototypeOf(FlorenceExampleView)).apply(this, arguments));
  }

  _createClass(FlorenceExampleView, [{
    key: 'getLexer',
    value: function getLexer() {
      var Lexer = FlorenceLexer; ///

      return Lexer;
    }
  }, {
    key: 'getParser',
    value: function getParser() {
      var Parser = FlorenceParser; ///

      return Parser;
    }
  }, {
    key: 'getParseTree',
    value: function getParseTree() {
      var parseTree = null;

      var bnf = this.getBNF(),
          ruleName = this.getRuleName(),
          lexicalEntries = this.getLexicalEntries(),
          entries = lexicalEntries,
          ///
      florenceLexer = FlorenceLexer.fromEntries(entries),
          florenceParser = FlorenceParser.fromBNF(bnf),
          rules = florenceParser.getRules(),
          name = ruleName,
          ///
      rule = findRuleByName(name, rules),
          content = this.getContent(),
          tokens = florenceLexer.tokenise(content),
          node = florenceParser.parse(tokens, rule);

      if (node !== null) {
        parseTree = node.asParseTree(tokens);
      }

      return parseTree;
    }
  }, {
    key: 'childElements',
    value: function childElements(properties) {
      var keyUpHandler = this.keyUpHandler.bind(this);

      return [React.createElement(
        'h1',
        null,
        'Florence parser example'
      ), React.createElement(
        'div',
        { className: 'columns' },
        React.createElement(
          SizeableElement,
          null,
          React.createElement(
            'h2',
            null,
            'Lexical entries'
          ),
          React.createElement(LexicalEntriesTextarea, { onKeyUp: keyUpHandler }),
          React.createElement(
            'h2',
            null,
            'BNF'
          ),
          React.createElement(BNFTextarea, { onKeyUp: keyUpHandler })
        ),
        React.createElement(MainVerticalSplitter, null),
        React.createElement(
          'div',
          { className: 'column' },
          React.createElement(
            'h2',
            null,
            'Parse tree'
          ),
          React.createElement(ParseTreeTextarea, null),
          React.createElement(
            'h2',
            null,
            'Rule name'
          ),
          React.createElement(RuleNameInput, { onKeyUp: keyUpHandler }),
          React.createElement(
            'h2',
            null,
            'Content'
          ),
          React.createElement(ContentTextarea, { onKeyUp: keyUpHandler })
        )
      )];
    }
  }], [{
    key: 'fromProperties',
    value: function fromProperties(properties) {
      return ExampleView.fromProperties(FlorenceExampleView, properties);
    }
  }]);

  return FlorenceExampleView;
}(ExampleView);

Object.assign(FlorenceExampleView, {
  defaultProperties: {
    className: 'florence'
  }
});

module.exports = FlorenceExampleView;

},{"../../example/view":88,"../../florence/parser":94,"../../utilities/rule":100,"../common/input/ruleName":80,"../common/textarea/bnf":81,"../common/textarea/content":82,"../common/textarea/lexicalEntries":83,"../common/textarea/parseTree":84,"../common/verticalSplitter/main":85,"easy-layout":102,"occam-lexers":173}],88:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var easy = require('easy'),
    easyLayout = require('easy-layout');

var BNFTextarea = require('./common/textarea/bnf'),
    ContentTextarea = require('./common/textarea/content'),
    ParseTreeTextarea = require('./common/textarea/parseTree'),
    LexicalEntriesTextarea = require('./common/textarea/lexicalEntries'),
    MainVerticalSplitter = require('./common/verticalSplitter/main');

var Element = easy.Element,
    SizeableElement = easyLayout.SizeableElement;

var ExampleView = function (_Element) {
  _inherits(ExampleView, _Element);

  function ExampleView() {
    _classCallCheck(this, ExampleView);

    return _possibleConstructorReturn(this, (ExampleView.__proto__ || Object.getPrototypeOf(ExampleView)).apply(this, arguments));
  }

  _createClass(ExampleView, [{
    key: 'getParseTree',
    value: function getParseTree() {
      var parseTree = null;

      var Lexer = this.getLexer(),
          Parser = this.getParser(),
          lexicalEntries = this.getLexicalEntries(),
          bnf = this.getBNF(),
          entries = lexicalEntries,
          ///
      lexer = Lexer.fromEntries(entries),
          parser = Parser.fromBNF(bnf),
          content = this.getContent(),
          tokens = lexer.tokenise(content),
          node = parser.parse(tokens);

      if (node !== null) {
        parseTree = node.asParseTree(tokens);
      }

      return parseTree;
    }
  }, {
    key: 'keyUpHandler',
    value: function keyUpHandler() {
      try {
        var parseTree = this.getParseTree();

        this.hideError();

        this.setParseTree(parseTree);
      } catch (error) {
        this.showError();

        this.clearParseTree();
      }
    }
  }, {
    key: 'getInitialContent',
    value: function getInitialContent() {
      var initialContent = '';

      return initialContent;
    }
  }, {
    key: 'childElements',
    value: function childElements(properties) {
      var title = this.getTitle(),
          keyUpHandler = this.keyUpHandler.bind(this);

      return [React.createElement(
        'h1',
        null,
        title
      ), React.createElement(
        'div',
        { className: 'columns' },
        React.createElement(
          SizeableElement,
          null,
          React.createElement(
            'h2',
            null,
            'Lexical entries'
          ),
          React.createElement(LexicalEntriesTextarea, { onKeyUp: keyUpHandler }),
          React.createElement(
            'h2',
            null,
            'BNF'
          ),
          React.createElement(BNFTextarea, { onKeyUp: keyUpHandler })
        ),
        React.createElement(MainVerticalSplitter, null),
        React.createElement(
          'div',
          { className: 'column' },
          React.createElement(
            'h2',
            null,
            'Parse tree'
          ),
          React.createElement(ParseTreeTextarea, null),
          React.createElement(
            'h2',
            null,
            'Content'
          ),
          React.createElement(ContentTextarea, { onKeyUp: keyUpHandler })
        )
      )];
    }
  }, {
    key: 'initialise',
    value: function initialise() {
      this.assignContext();

      var Lexer = this.getLexer(),
          Parser = this.getParser(),
          initialContent = this.getInitialContent(),
          bnf = Parser.bnf,
          entries = Lexer.entries,
          content = initialContent,
          lexicalEntries = entries; ///

      this.setBNF(bnf);
      this.setContent(content);
      this.setLexicalEntries(lexicalEntries);

      this.keyUpHandler();
    }
  }], [{
    key: 'fromProperties',
    value: function fromProperties(Class, properties) {
      var exampleView = Element.fromProperties(Class, properties);

      exampleView.initialise();

      return exampleView;
    }
  }]);

  return ExampleView;
}(Element);

Object.assign(ExampleView, {
  tagName: 'div',
  defaultProperties: {
    className: 'example'
  }
});

module.exports = ExampleView;

},{"./common/textarea/bnf":81,"./common/textarea/content":82,"./common/textarea/lexicalEntries":83,"./common/textarea/parseTree":84,"./common/verticalSplitter/main":85,"easy":137,"easy-layout":102}],89:[function(require,module,exports){
'use strict';

var bnf = '\n\n\n     document                             ::=   ( rule | axiom | lemma | theorem | metalemma | metatheorem | declaration | verticalSpace | error )+ ;\n     \n     \n     \n     rule                                 ::=   "Rule" parenthesisedLabels? <END_OF_LINE> ( premise | premises )? conclusion metaproof? ;\n\n     axiom                                ::=   "Axiom" parenthesisedLabels? <END_OF_LINE> ( unqualifiedStatement | indicativeConditional ) ; \n\n     lemma                                ::=   "Lemma" parenthesisedLabels? <END_OF_LINE> ( unqualifiedStatement | indicativeConditional ) proof? ;\n\n     theorem                              ::=   "Theorem" parenthesisedLabels? <END_OF_LINE> ( unqualifiedStatement | indicativeConditional ) proof? ;\n\n     metalemma                            ::=   "Metalemma" parenthesisedLabels? <END_OF_LINE> ( unqualifiedMetastatement | metaIndicativeConditional ) metaproof? ;\n\n     metatheorem                          ::=   "Metatheorem" parenthesisedLabels? <END_OF_LINE> ( unqualifiedMetastatement | metaIndicativeConditional ) metaproof? ;\n\n     declaration                          ::=   "Types" typesDeclaration <END_OF_LINE>\n\n                                            |   "Contexts" contextsDeclaration  <END_OF_LINE>\n\n                                            |   "Variables" variablesDeclaration  <END_OF_LINE>\n\n                                            |   "Constructors" constructorsDeclaration  <END_OF_LINE>\n\n                                            |   "DependentTypes" dependentTypesDeclaration  <END_OF_LINE>\n\n                                            |   "Metavariables" metavariablesDeclaration  <END_OF_LINE>\n\n                                            |   "Abbreviations" abbreviationsDeclaration  <END_OF_LINE>\n\n                                            |   "Type" typeDeclaration  <END_OF_LINE>\n\n                                            |   "Context" contextDeclaration  <END_OF_LINE>\n\n                                            |   "Variable" variableDeclaration  <END_OF_LINE>\n\n                                            |   "Constructor" constructorDeclaration  <END_OF_LINE>\n\n                                            |   "DependentType" dependentTypeDeclaration  <END_OF_LINE>\n                                            \n                                            |   "Metavariable" metavariableDeclaration  <END_OF_LINE>\n\n                                            |   "Abbreviation" abbreviationDeclaration  <END_OF_LINE>\n\n                                            ;\n                                            \n\n\n     verticalSpace                        ::=   <END_OF_LINE>+ ;\n\n\n\n     error                                ::=   . ;\n\n     \n\n     typesDeclaration                     ::=   typeDeclaration ( "," typeDeclaration)+ ;\n\n     contextsDeclaration                  ::=   contextDeclaration ( "," contextDeclaration)+ ;\n\n     variablesDeclaration                 ::=   variableDeclaration ( "," variableDeclaration)+ ;\n   \n     constructorsDeclaration              ::=   constructorDeclaration ( "," constructorDeclaration)+ ;\n   \n     dependentTypesDeclaration            ::=   dependentTypeDeclaration ( "," dependentTypeDeclaration)* ;\n   \n     metavariablesDeclaration             ::=   metavariableDeclaration ( "," metavariableDeclaration)* ;\n   \n     abbreviationsDeclaration             ::=   abbreviationDeclaration ( "," abbreviationDeclaration)* ;\n\n\n     typeDeclaration                      ::=   typeName ;\n   \n     contextDeclaration                   ::=   contextName<NO_WHITESPACE>parenthesisedTypeName? ;\n   \n     variableDeclaration                  ::=   variableName ;\n   \n     constructorDeclaration               ::=   constructorName<NO_WHITESPACE>parenthesisedTypeNames?<NO_WHITESPACE>":"<NO_WHITESPACE>typeName ;\n   \n     dependentTypeDeclaration             ::=   typeName<NO_WHITESPACE>parenthesisedTypeName ;\n   \n     metavariableDeclaration              ::=   metavariableName<NO_WHITESPACE>parenthesisedTypeName? ;\n     \n     abbreviationDeclaration              ::=   constructorName "for" constructorName ; \n     \n   \n        \n     premise                              ::=   "Premise" <END_OF_LINE> unqualifiedMetastatement ;\n\n     premises                             ::=   "Premises" <END_OF_LINE> unqualifiedMetastatement unqualifiedMetastatement+ ;\n\n     conclusion                           ::=   "Conclusion" <END_OF_LINE> qualifiedMetastatement ;\n\n     \n     \n     metaproof                            ::=   "Proof" <END_OF_LINE> \n     \n                                                metastatementDefinition*\n     \n                                                metaProofDerivation? \n                                                \n                                                qualifiedMetastatement ;\n                                                \n                                                \n                                                \n     metastatementDefinition              ::=   "let" unqualifiedMetastatement ;                                           \n                                                \n     metaProofDerivation                  ::=   ( submetalemma | qualifiedMetastatement )+  "Therefore" <END_OF_LINE> ;                                           \n     \n     submetalemma                         ::=   "Suppose" <END_OF_LINE> unqualifiedMetastatement+ \n     \n                                                ( "Then" <END_OF_LINE> ( submetalemma | qualifiedMetastatement )+ )? \n                                                \n                                                "Hence" <END_OF_LINE> qualifiedMetastatement ;\n\n\n\n     metaIndicativeConditional            ::=   "Suppose" <END_OF_LINE> unqualifiedMetastatement+ \n     \n                                                "Hence" <END_OF_LINE> qualifiedMetastatement ;\n\n\n\n     proof                                ::=   "Proof" <END_OF_LINE> \n     \n                                                statementDefinition*\n     \n                                                proofDerivation? \n                                                \n                                                qualifiedStatement ;\n                                                \n                                                \n                                                \n     statementDefinition                  ::=   "let" unqualifiedStatement;                                           \n\n     proofDerivation                      ::=   ( sublemma | qualifiedStatement )+ "Therefore" <END_OF_LINE> ;\n\n     sublemma                             ::=   "Suppose" <END_OF_LINE> unqualifiedStatement+ \n     \n                                                ( "Then" <END_OF_LINE> ( sublemma | qualifiedStatement )+ )? \n                                                \n                                                "Hence" <END_OF_LINE> qualifiedStatement ;\n\n\n\n     indicativeConditional                ::=   "Suppose" <END_OF_LINE> unqualifiedStatement+ \n     \n                                                "Hence" <END_OF_LINE> qualifiedStatement ;\n\n\n\n     metavariable                         ::=   metavariableName<NO_WHITESPACE>parenthesisedTerm? ;\n\n     reference                            ::=   referenceName<NO_WHITESPACE>parenthesisedTerm? ;\n\n     context                              ::=   contextName<NO_WHITESPACE>parenthesisedTerm? ;\n\n     label                                ::=   labelName<NO_WHITESPACE>parenthesisedTerm? ;\n\n\n\n     parenthesisedTypeNames               ::=   "("<NO_WHITESPACE>typeNames<NO_WHITESPACE>")" ;\n\n     parenthesisedLabels                  ::=   "("<NO_WHITESPACE>labels<NO_WHITESPACE>")" ;                    \n\n     parenthesisedTerms                   ::=   "("<NO_WHITESPACE>terms<NO_WHITESPACE>")" ;   \n\n\n\n     parenthesisedTypeName                ::=   "("<NO_WHITESPACE>typeName<NO_WHITESPACE>")" ;\n\n     parenthesisedTerm                    ::=   "("<NO_WHITESPACE>term<NO_WHITESPACE>")" ;   \n\n         \n     \n     typeNames                            ::=   typeName ( "," typeName )* ;\n\n     labels                               ::=   label ( "," label )* ;\n\n     terms                                ::=   term ( "," term )* ;\n     \n\n\n     typeName                             ::=   [unassigned] ;\n\n     contextName                          ::=   [unassigned] ;\n\n     variableName                         ::=   [unassigned] ;\n\n     constructorName                      ::=   [unassigned] ;\n\n     metavariableName                     ::=   [unassigned] ;\n\n     referenceName                        ::=   [unassigned] ;\n\n     labelName                            ::=   [unassigned] ;\n\n     \n   \n     qualification                        ::= ( "by" | "from" ) reference? ;\n     \n     \n\n     nonsense                             ::=   ( [unassigned] | [special] | [custom] )+ ;\n\n     \n';

module.exports = bnf;

},{}],90:[function(require,module,exports){
'use strict';

var statementBNF = '\n\n\n     expression                           ::=   term \n     \n                                            ;\n\n\n';

module.exports = statementBNF;

},{}],91:[function(require,module,exports){
'use strict';

var metastatementBNF = '\n\n\n     proofAssertion                       ::=   context "\u22A2" judgement ;\n     \n     contextDefinition                    ::=   context "=" ( judgement | context ) ( "," ( judgement | context ) )* ;\n\n     judgement                            ::=   reference "::" metastatement ;\n\n     subproof                             ::=   supposition "..." metastatement ;\n\n     supposition                          ::=   "[" metastatement "]" ;\n\n\n\n     metastatement                        ::=   proofAssertion \n           \n                                            |   contextDefinition \n           \n                                            |   subproof \n                                            \n                                            |   metavariable \n\n                                            |   nonsense \n\n                                            ;\n\n      \n';

module.exports = metastatementBNF;

},{}],92:[function(require,module,exports){
'use strict';

var statementBNF = '\n\n\n     typeAssertion                        ::=   expression ":" typeName ;\n\n     equality                             ::=   expression "=" expression ;\n\n\n\n     statement                            ::=   typeAssertion \n                                                  \n                                            |   equality \n                                                  \n                                            |   nonsense\n\n                                            ;\n\n\n';

module.exports = statementBNF;

},{}],93:[function(require,module,exports){
'use strict';

var termBNF = '\n\n\n     term                                 ::=   constructorName<NO_WHITESPACE>parenthesisedTerms? ;\n\n\n\n';

module.exports = termBNF;

},{}],94:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var lexers = require('occam-lexers');

var bnf = require('./bnf'),
    BNFParser = require('../bnf/parser'),
    CommonParser = require('../common/parser'),
    arrayUtilities = require('../utilities/array'),
    customGrammarUtilities = require('../utilities/customGrammar'),
    defaultCustomGrammarTermBNF = require('./defaultCustomGrammar/termBNF'),
    defaultCustomGrammarExpressionBNF = require('./defaultCustomGrammar/expressionBNF'),
    defaultCustomGrammarStatementBNF = require('./defaultCustomGrammar/statementBNF'),
    defaultCustomGrammarMetastatementBNF = require('./defaultCustomGrammar/metastatementBNF');

var BNFLexer = lexers.BNFLexer,
    push = arrayUtilities.push,
    rulesFromBNFs = customGrammarUtilities.rulesFromBNFs,
    addQualifiedAndUnqualifiedStatementAndMetastatementRules = customGrammarUtilities.addQualifiedAndUnqualifiedStatementAndMetastatementRules;


var bnfLexer = BNFLexer.fromNothing(),
    bnfParser = BNFParser.fromNothing(),
    defaultCustomGrammarBNFs = [defaultCustomGrammarTermBNF, defaultCustomGrammarExpressionBNF, defaultCustomGrammarStatementBNF, defaultCustomGrammarMetastatementBNF],
    defaultCustomGrammarRules = rulesFromBNFs(defaultCustomGrammarBNFs),
    defaultCombinedCustomGrammarsRules = defaultCustomGrammarRules; ///

var FlorenceParser = function (_CommonParser) {
  _inherits(FlorenceParser, _CommonParser);

  function FlorenceParser() {
    _classCallCheck(this, FlorenceParser);

    return _possibleConstructorReturn(this, (FlorenceParser.__proto__ || Object.getPrototypeOf(FlorenceParser)).apply(this, arguments));
  }

  _createClass(FlorenceParser, null, [{
    key: 'fromCombinedCustomGrammarsRules',
    value: function fromCombinedCustomGrammarsRules(combinedCustomGrammarsRules) {
      var florenceParser = FlorenceParser.fromBNF(bnf, combinedCustomGrammarsRules);

      return florenceParser;
    }
  }, {
    key: 'fromBNF',
    value: function fromBNF(bnf) {
      var combinedCustomGrammarsRules = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultCombinedCustomGrammarsRules;

      combinedCustomGrammarsRules = addQualifiedAndUnqualifiedStatementAndMetastatementRules(combinedCustomGrammarsRules); ///

      var tokens = bnfLexer.tokensFromBNF(bnf),
          rulesNode = bnfParser.rulesNodeFromTokens(tokens),
          rules = BNFParser.generateRules(rulesNode);

      push(rules, combinedCustomGrammarsRules);

      var florenceParser = new FlorenceParser(rules);

      return florenceParser;
    }
  }, {
    key: 'fromNothing',
    value: function fromNothing() {
      return FlorenceParser.fromBNF(bnf);
    } ///

  }]);

  return FlorenceParser;
}(CommonParser);

Object.assign(FlorenceParser, {
  bnf: bnf,
  defaultCustomGrammarTermBNF: defaultCustomGrammarTermBNF,
  defaultCustomGrammarExpressionBNF: defaultCustomGrammarExpressionBNF,
  defaultCustomGrammarStatementBNF: defaultCustomGrammarStatementBNF,
  defaultCustomGrammarMetastatementBNF: defaultCustomGrammarMetastatementBNF
});

module.exports = FlorenceParser;

},{"../bnf/parser":30,"../common/parser":74,"../utilities/array":97,"../utilities/customGrammar":99,"./bnf":89,"./defaultCustomGrammar/expressionBNF":90,"./defaultCustomGrammar/metastatementBNF":91,"./defaultCustomGrammar/statementBNF":92,"./defaultCustomGrammar/termBNF":93,"occam-lexers":173}],95:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Rule = require('../../../bnf/rule'),
    Definition = require('../../../bnf/definition'),
    RuleNamePart = require('../../../bnf/part/nonTerminal/ruleName'),
    EndOfLinePart = require('../../../bnf/part/terminal/endOfLine'),
    OptionalPartPart = require('../../../bnf/part/nonTerminal/optionalPart');

var QualifiedCustomGrammarRule = function (_Rule) {
  _inherits(QualifiedCustomGrammarRule, _Rule);

  function QualifiedCustomGrammarRule() {
    _classCallCheck(this, QualifiedCustomGrammarRule);

    return _possibleConstructorReturn(this, (QualifiedCustomGrammarRule.__proto__ || Object.getPrototypeOf(QualifiedCustomGrammarRule)).apply(this, arguments));
  }

  _createClass(QualifiedCustomGrammarRule, null, [{
    key: 'fromRuleNameAndCustomGrammarRule',
    value: function fromRuleNameAndCustomGrammarRule(ruleName, customGrammarRule) {
      var customGrammarRuleNonTerminalNode = customGrammarRule.getNonTerminalNode(),
          customGrammarRuleDefinitions = customGrammarRule.getDefinitions(),
          name = ruleName,
          ///
      definitions = definitionsFromCustomGrammarRuleDefinitions(customGrammarRuleDefinitions),
          NonTerminalNode = customGrammarRuleNonTerminalNode,
          ///
      qualifiedCustomGrammarRule = new QualifiedCustomGrammarRule(name, definitions, NonTerminalNode);

      return qualifiedCustomGrammarRule;
    }
  }]);

  return QualifiedCustomGrammarRule;
}(Rule);

module.exports = QualifiedCustomGrammarRule;

function definitionsFromCustomGrammarRuleDefinitions(customGrammarRuleDefinitions) {
  var definitions = customGrammarRuleDefinitions.map(function (customGrammarRuleDefinition) {
    var customGrammarRuleDefinitionParts = customGrammarRuleDefinition.getParts(),
        qualificationRuleName = 'qualification',
        ///
    qualificationRuleNamePart = new RuleNamePart(qualificationRuleName),
        optionalQualificationRuleNamePart = new OptionalPartPart(qualificationRuleNamePart),
        endOfLinePart = new EndOfLinePart(),
        parts = [].concat(customGrammarRuleDefinitionParts).concat(optionalQualificationRuleNamePart).concat(endOfLinePart),
        definition = new Definition(parts);

    return definition;
  });

  return definitions;
}

},{"../../../bnf/definition":4,"../../../bnf/part/nonTerminal/optionalPart":35,"../../../bnf/part/nonTerminal/ruleName":36,"../../../bnf/part/terminal/endOfLine":40,"../../../bnf/rule":46}],96:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Rule = require('../../../bnf/rule'),
    Definition = require('../../../bnf/definition'),
    EndOfLinePart = require('../../../bnf/part/terminal/endOfLine');

var UnqualifiedCustomGrammarRule = function (_Rule) {
  _inherits(UnqualifiedCustomGrammarRule, _Rule);

  function UnqualifiedCustomGrammarRule() {
    _classCallCheck(this, UnqualifiedCustomGrammarRule);

    return _possibleConstructorReturn(this, (UnqualifiedCustomGrammarRule.__proto__ || Object.getPrototypeOf(UnqualifiedCustomGrammarRule)).apply(this, arguments));
  }

  _createClass(UnqualifiedCustomGrammarRule, null, [{
    key: 'fromRuleNameAndCustomGrammarRule',
    value: function fromRuleNameAndCustomGrammarRule(ruleName, customGrammarRule) {
      var customGrammarRuleNonTerminalNode = customGrammarRule.getNonTerminalNode(),
          customGrammarRuleDefinitions = customGrammarRule.getDefinitions(),
          name = ruleName,
          ///
      definitions = definitionsFromCustomGrammarRuleDefinitions(customGrammarRuleDefinitions),
          NonTerminalNode = customGrammarRuleNonTerminalNode,
          ///
      unqualifiedCustomGrammarRule = new UnqualifiedCustomGrammarRule(name, definitions, NonTerminalNode);

      return unqualifiedCustomGrammarRule;
    }
  }]);

  return UnqualifiedCustomGrammarRule;
}(Rule);

module.exports = UnqualifiedCustomGrammarRule;

function definitionsFromCustomGrammarRuleDefinitions(customGrammarRuleDefinitions) {
  var definitions = customGrammarRuleDefinitions.map(function (customGrammarRuleDefinition) {
    var customGrammarRuleDefinitionParts = customGrammarRuleDefinition.getParts(),
        endOfLinePart = new EndOfLinePart(),
        parts = [].concat(customGrammarRuleDefinitionParts).concat(endOfLinePart),
        definition = new Definition(parts);

    return definition;
  });

  return definitions;
}

},{"../../../bnf/definition":4,"../../../bnf/part/terminal/endOfLine":40,"../../../bnf/rule":46}],97:[function(require,module,exports){
'use strict';

var necessary = require('necessary');

var arrayUtilities = necessary.arrayUtilities;


function allButFirst(array) {
  return array.slice(1);
}

function keepFirst(array) {
  return keepNth(array, 0);
}

function keepSecond(array) {
  return keepNth(array, 1);
}

function keepLast(array) {
  return keepNth(array, -1);
}

function discardFirst(array) {
  return discardNth(array, 0);
}

function discardSecond(array) {
  return discardNth(array, 1);
}

function discardLast(array) {
  return discardNth(array, -1);
}

function discardLastThenFirst(array) {
  return discardNth(discardNth(array, -1), 0);
}

function discardFourthThenSecond(array) {
  return discardNth(discardNth(array, 3), 1);
}

function discardFifthThenSecond(array) {
  return discardNth(discardNth(array, 4), 1);
}

function discardOdd(array) {
  return array.filter(function (entry, index) {
    return isEven(index);
  });
}

module.exports = Object.assign(arrayUtilities, {
  allButFirst: allButFirst,
  keepFirst: keepFirst,
  keepSecond: keepSecond,
  keepLast: keepLast,
  discardFirst: discardFirst,
  discardSecond: discardSecond,
  discardLast: discardLast,
  discardLastThenFirst: discardLastThenFirst,
  discardFourthThenSecond: discardFourthThenSecond,
  discardFifthThenSecond: discardFifthThenSecond,
  discardOdd: discardOdd
});

function keepNth(array, n) {
  array = array.slice();

  return array.splice(n, 1);
}

function discardNth(array, n) {
  array = array.slice();

  array.splice(n, 1);

  return array;
}

function isEven(index) {
  var even = Math.floor(index / 2) === index / 2;

  return even;
}

},{"necessary":166}],98:[function(require,module,exports){
'use strict';

var lexers = require('occam-lexers');

var arrayUtilities = require('../utilities/array');

var BNFLexer = lexers.BNFLexer,
    first = arrayUtilities.first,
    second = arrayUtilities.second,
    specialSymbols = BNFLexer.specialSymbols,
    NO_WHITESPACE = specialSymbols.NO_WHITESPACE;


function isNodeNoWhitespaceNode(node) {
  var nodeNoWhitespaceNode = false;

  var nodeTerminalNode = node.isTerminalNode();

  if (nodeTerminalNode) {
    var terminalNode = node,
        terminalNodeContent = terminalNode.getContent();

    nodeNoWhitespaceNode = terminalNodeContent === NO_WHITESPACE;
  }

  return nodeNoWhitespaceNode;
}

function isNodeChoiceNode(node) {
  var nodeNoChoiceNode = false;

  var nodeTerminalNode = node.isTerminalNode();

  if (nodeTerminalNode) {
    var terminalNode = node,
        terminalNodeContent = terminalNode.getContent();

    nodeNoChoiceNode = terminalNodeContent === '|';
  }

  return nodeNoChoiceNode;
}

function isNodeQuantifiersNode(node) {
  var nodeQuantifiersNode = false;

  var nodeTerminalNode = node.isTerminalNode(),
      nodeNonTerminalNode = !nodeTerminalNode;

  if (nodeNonTerminalNode) {
    var nonTerminalNode = node,
        ///
    childNodes = nonTerminalNode.getChildNodes(),
        firstChildNode = first(childNodes),
        firstChildNodeTerminalNode = firstChildNode.isTerminalNode();

    if (firstChildNodeTerminalNode) {
      var terminalNode = firstChildNode,
          ///
      terminalNodeContent = terminalNode.getContent();

      nodeQuantifiersNode = terminalNodeContent === '?' || terminalNodeContent === '*' || terminalNodeContent === '+';
    }
  }

  return nodeQuantifiersNode;
}

function quantifiersFromQuantifiersNode(quantifiersNode) {
  var quantifiers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  var quantifier = quantifierFromQuantifiersNode(quantifiersNode);

  quantifiers.push(quantifier);

  var quantifiersNodeChildNodes = quantifiersNode.getChildNodes(),
      quantifiersNodeChildNodesLength = quantifiersNodeChildNodes.length;

  if (quantifiersNodeChildNodesLength === 2) {
    var secondQuantifiersNodeChildNode = second(quantifiersNodeChildNodes),
        secondQuantifiersNodeChildNodeQuantifiersNode = isNodeQuantifiersNode(secondQuantifiersNodeChildNode);

    if (secondQuantifiersNodeChildNodeQuantifiersNode) {
      quantifiersNode = secondQuantifiersNodeChildNode; ///

      quantifiers = quantifiersFromQuantifiersNode(quantifiersNode, quantifiers);
    }
  }

  return quantifiers;
}

module.exports = {
  isNodeNoWhitespaceNode: isNodeNoWhitespaceNode,
  isNodeChoiceNode: isNodeChoiceNode,
  isNodeQuantifiersNode: isNodeQuantifiersNode,
  quantifiersFromQuantifiersNode: quantifiersFromQuantifiersNode
};

function quantifierFromQuantifiersNode(quantifiersNode) {
  var quantifiersNodeChildNodes = quantifiersNode.getChildNodes(),
      firstQuantifiersNodeChildNode = first(quantifiersNodeChildNodes),
      firstQuantifiersNodeChildNodeContent = firstQuantifiersNodeChildNode.getContent(),
      quantifier = firstQuantifiersNodeChildNodeContent;

  return quantifier;
}

},{"../utilities/array":97,"occam-lexers":173}],99:[function(require,module,exports){
'use strict';

var lexers = require('occam-lexers');

var BNFParser = require('../bnf/parser'),
    ruleUtilities = require('../utilities/rule'),
    arrayUtilities = require('../utilities/array'),
    QualifiedCustomGrammarRule = require('../florence/rule/customGrammar/qualified'),
    UnqualifiedCustomGrammarRule = require('../florence/rule/customGrammar/unqualified');

var BNFLexer = lexers.BNFLexer,
    push = arrayUtilities.push,
    findRuleByName = ruleUtilities.findRuleByName,
    add = push; ///

var bnfLexer = BNFLexer.fromNothing(),
    bnfParser = BNFParser.fromNothing(),
    statementRuleName = 'statement',
    metastatementRuleName = 'metastatement',
    qualifiedStatementRuleName = 'qualifiedStatement',
    qualifiedMetastatementRuleName = 'qualifiedMetastatement',
    unqualifiedStatementRuleName = 'unqualifiedStatement',
    unqualifiedMetastatementRuleName = 'unqualifiedMetastatement';

function rulesFromBNFs(bnfs) {
      var bnf = bnfs.join(''),
          tokens = bnfLexer.tokensFromBNF(bnf),
          rulesNode = bnfParser.rulesNodeFromTokens(tokens),
          rules = BNFParser.generateRules(rulesNode);

      return rules;
}

function addQualifiedAndUnqualifiedStatementAndMetastatementRules(combinedCustomGrammarsRules) {
      combinedCustomGrammarsRules = combinedCustomGrammarsRules.slice(); ///

      var statementCustomGrammarRule = findRuleByName(statementRuleName, combinedCustomGrammarsRules),
          metastatementCustomGrammarRule = findRuleByName(metastatementRuleName, combinedCustomGrammarsRules),
          qualifiedStatementCustomGrammarRule = new QualifiedCustomGrammarRule.fromRuleNameAndCustomGrammarRule(qualifiedStatementRuleName, statementCustomGrammarRule),
          unqualifiedStatementCustomGrammarRule = new UnqualifiedCustomGrammarRule.fromRuleNameAndCustomGrammarRule(unqualifiedStatementRuleName, statementCustomGrammarRule),
          qualifiedMetastatementCustomGrammarRule = new QualifiedCustomGrammarRule.fromRuleNameAndCustomGrammarRule(qualifiedMetastatementRuleName, metastatementCustomGrammarRule),
          unqualifiedMetastatementCustomGrammarRule = new UnqualifiedCustomGrammarRule.fromRuleNameAndCustomGrammarRule(unqualifiedMetastatementRuleName, metastatementCustomGrammarRule),
          qualifiedAndUnqualifiedStatementAndMetastatementRules = [qualifiedStatementCustomGrammarRule, unqualifiedStatementCustomGrammarRule, qualifiedMetastatementCustomGrammarRule, unqualifiedMetastatementCustomGrammarRule];

      add(combinedCustomGrammarsRules, qualifiedAndUnqualifiedStatementAndMetastatementRules);

      return combinedCustomGrammarsRules;
}

module.exports = {
      rulesFromBNFs: rulesFromBNFs,
      addQualifiedAndUnqualifiedStatementAndMetastatementRules: addQualifiedAndUnqualifiedStatementAndMetastatementRules
};

},{"../bnf/parser":30,"../florence/rule/customGrammar/qualified":95,"../florence/rule/customGrammar/unqualified":96,"../utilities/array":97,"../utilities/rule":100,"occam-lexers":173}],100:[function(require,module,exports){
'use strict';

function findRuleByName(name, rules) {
  var rule = rules.find(function (rule) {
    var ruleName = rule.getName(),
        found = ruleName === name;

    return found;
  }) || null; ///

  return rule;
}

module.exports = {
  findRuleByName: findRuleByName
};

},{}],101:[function(require,module,exports){

},{}],102:[function(require,module,exports){
'use strict';

module.exports = {
  options: require('./lib/options'),
  Splitter: require('./lib/splitter'),
  SizeableElement: require('./lib/sizeableElement'),
  VerticalSplitter: require('./lib/splitter/vertical'),
  HorizontalSplitter: require('./lib/splitter/horizontal')
};

},{"./lib/options":104,"./lib/sizeableElement":105,"./lib/splitter":106,"./lib/splitter/horizontal":107,"./lib/splitter/vertical":108}],103:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var easy = require('easy');

var Body = easy.Body;


var body = new Body();

var previousCursor = void 0; ///

var cursor = function () {
  function cursor() {
    _classCallCheck(this, cursor);
  }

  _createClass(cursor, null, [{
    key: 'columnResize',
    value: function columnResize() {
      var currentCursor = this.getCurrentCursor();

      if (currentCursor !== 'col-resize') {
        previousCursor = currentCursor;

        this.setCursor('col-resize');
      }
    }
  }, {
    key: 'rowResize',
    value: function rowResize() {
      var currentCursor = this.getCurrentCursor();

      if (currentCursor !== 'row-resize') {
        previousCursor = currentCursor;

        this.setCursor('row-resize');
      }
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.setCursor(previousCursor); ///
    }
  }, {
    key: 'getCurrentCursor',
    value: function getCurrentCursor() {
      var currentCursor = body.css('cursor'); ///

      return currentCursor || 'auto'; ///
    }
  }, {
    key: 'setCursor',
    value: function setCursor(cursor) {
      var css = {
        cursor: cursor
      };

      body.css(css);
    }
  }]);

  return cursor;
}();

module.exports = cursor;

},{"easy":109}],104:[function(require,module,exports){
'use strict';

var ESCAPE_KEY_STOPS_DRAGGING = 'ESCAPE_KEY_STOPS_DRAGGING';

module.exports = {
	ESCAPE_KEY_STOPS_DRAGGING: ESCAPE_KEY_STOPS_DRAGGING
};

},{}],105:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var easy = require('easy');

var Element = easy.Element;

var SizeableElement = function (_Element) {
  _inherits(SizeableElement, _Element);

  function SizeableElement() {
    _classCallCheck(this, SizeableElement);

    return _possibleConstructorReturn(this, (SizeableElement.__proto__ || Object.getPrototypeOf(SizeableElement)).apply(this, arguments));
  }

  _createClass(SizeableElement, null, [{
    key: 'fromProperties',
    value: function fromProperties(properties) {
      return Element.fromProperties(SizeableElement, properties);
    }
  }]);

  return SizeableElement;
}(Element);

Object.assign(SizeableElement, {
  tagName: 'div',
  defaultProperties: {
    className: 'sizeable'
  }
});

module.exports = SizeableElement;

},{"easy":109}],106:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var easy = require('easy');

var options = require('./options');

var ESCAPE_KEYCODE = 27;

var ESCAPE_KEY_STOPS_DRAGGING = options.ESCAPE_KEY_STOPS_DRAGGING,
    window = easy.window,
    Element = easy.Element;

var Splitter = function (_Element) {
  _inherits(Splitter, _Element);

  function Splitter(selector, beforeSizeableElement, afterSizeableElement, startDraggingHandler, stopDraggingHandler, dragHandler, options) {
    _classCallCheck(this, Splitter);

    var _this = _possibleConstructorReturn(this, (Splitter.__proto__ || Object.getPrototypeOf(Splitter)).call(this, selector));

    _this.beforeSizeableElement = beforeSizeableElement;
    _this.afterSizeableElement = afterSizeableElement;

    _this.startDraggingHandler = startDraggingHandler || defaultStartDraggingHandler;
    _this.stopDraggingHandler = stopDraggingHandler || defaultStopDraggingHandler;
    _this.dragHandler = dragHandler || defaultDragHandler;
    _this.options = options || defaultOptions;
    return _this;
  }

  _createClass(Splitter, [{
    key: 'isBeforeSizeableElement',
    value: function isBeforeSizeableElement() {
      return this.beforeSizeableElement;
    }
  }, {
    key: 'isAfterSizeableElement',
    value: function isAfterSizeableElement() {
      return this.afterSizeableElement;
    }
  }, {
    key: 'getDragHandler',
    value: function getDragHandler() {
      return this.dragHandler;
    }
  }, {
    key: 'isDisabled',
    value: function isDisabled() {
      var disabled = this.hasClass('disabled');

      return disabled;
    }
  }, {
    key: 'isDragging',
    value: function isDragging() {
      var dragging = this.hasClass('dragging');

      return dragging;
    }
  }, {
    key: 'getDirection',
    value: function getDirection() {
      var direction = void 0;

      if (this.beforeSizeableElement) {
        direction = +1;
      }

      if (this.afterSizeableElement) {
        direction = -1;
      }

      return direction;
    }
  }, {
    key: 'getSizeableElement',
    value: function getSizeableElement() {
      var sizeableElement = void 0;

      var direction = this.getDirection();

      switch (direction) {
        case -1:
          sizeableElement = this.getPreviousSiblingElement(); ///
          break;

        case +1:
          sizeableElement = this.getNextSiblingElement(); ///
          break;
      }

      return sizeableElement;
    }
  }, {
    key: 'isOptionPresent',
    value: function isOptionPresent(option) {
      var optionPresent = this.options[option] === true; ///

      return optionPresent;
    }
  }, {
    key: 'setOptions',
    value: function setOptions(options) {
      this.options = options;
    }
  }, {
    key: 'setOption',
    value: function setOption(option) {
      this.options[option] = true;
    }
  }, {
    key: 'unsetOption',
    value: function unsetOption(option) {
      delete this.options[option];
    }
  }, {
    key: 'enable',
    value: function enable() {
      this.removeClass('disabled');
    }
  }, {
    key: 'disable',
    value: function disable() {
      this.addClass('disabled');
    }
  }, {
    key: 'startDragging',
    value: function startDragging() {
      var escapeKeyStopsDraggingOptionPresent = this.isOptionPresent(ESCAPE_KEY_STOPS_DRAGGING);

      if (escapeKeyStopsDraggingOptionPresent) {
        window.onKeyDown(this.keyDownHandler, this);
      }

      this.addClass('dragging');

      this.startDraggingHandler();
    }
  }, {
    key: 'stopDragging',
    value: function stopDragging() {
      var escapeKeyStopsDraggingOptionPresent = this.isOptionPresent(ESCAPE_KEY_STOPS_DRAGGING);

      if (escapeKeyStopsDraggingOptionPresent) {
        window.offKeyDown(this.keyDownHandler, this);
      }

      this.removeClass('dragging');

      this.stopDraggingHandler();
    }
  }, {
    key: 'onDrag',
    value: function onDrag(dragHandler) {
      this.dragHandler = dragHandler;
    }
  }, {
    key: 'keyDownHandler',
    value: function keyDownHandler(keyCode) {
      if (keyCode === ESCAPE_KEYCODE) {
        var dragging = this.isDragging();

        if (dragging) {
          this.stopDragging();
        }
      }
    }
  }, {
    key: 'initialise',
    value: function initialise(disabled) {
      disabled === true ? ///
      this.disable() : this.enable();

      window.on('mouseup blur', this.mouseUp.bind(this)); ///

      window.onMouseMove(this.mouseMove.bind(this));

      this.onMouseDown(this.mouseDown.bind(this));
      this.onMouseOver(this.mouseOver.bind(this));
      this.onMouseOut(this.mouseOut.bind(this));
    }
  }], [{
    key: 'fromProperties',
    value: function fromProperties(Class, properties) {
      var beforeSizeableElement = properties.beforeSizeableElement,
          afterSizeableElement = properties.afterSizeableElement,
          onStartDragging = properties.onStartDragging,
          onStopDragging = properties.onStopDragging,
          onDrag = properties.onDrag,
          options = properties.options,
          disabled = properties.disabled,
          startDraggingHandler = onStartDragging,
          stopDraggingHandler = onStopDragging,
          dragHandler = onDrag,
          splitter = Element.fromProperties(Class, properties, beforeSizeableElement, afterSizeableElement, startDraggingHandler, stopDraggingHandler, dragHandler, options);


      splitter.initialise(disabled);

      return splitter;
    }
  }]);

  return Splitter;
}(Element);

Object.assign(Splitter, {
  tagName: 'div',
  ignoredProperties: ['beforeSizeableElement', 'afterSizeableElement', 'onStartDragging', 'onStopDragging', 'onDrag', 'options', 'disabled']
});

module.exports = Splitter;

function defaultStartDraggingHandler() {}

function defaultStopDraggingHandler() {}

function defaultDragHandler() {}

var defaultOptions = {};

},{"./options":104,"easy":109}],107:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var cursor = require('../cursor'),
    Splitter = require('../splitter');

var HorizontalSplitter = function (_Splitter) {
  _inherits(HorizontalSplitter, _Splitter);

  function HorizontalSplitter(selector, beforeSizeableElement, afterSizeableElement, startDraggingHandler, stopDraggingHandler, dragHandler, options) {
    _classCallCheck(this, HorizontalSplitter);

    var _this = _possibleConstructorReturn(this, (HorizontalSplitter.__proto__ || Object.getPrototypeOf(HorizontalSplitter)).call(this, selector, beforeSizeableElement, afterSizeableElement, startDraggingHandler, stopDraggingHandler, dragHandler, options));

    _this.setInitialState();
    return _this;
  }

  _createClass(HorizontalSplitter, [{
    key: 'mouseUp',
    value: function mouseUp() {
      var disabled = this.isDisabled();

      if (!disabled) {
        var dragging = this.isDragging();

        if (dragging) {
          this.stopDragging();
        }

        cursor.reset();
      }
    }
  }, {
    key: 'mouseMove',
    value: function mouseMove(mouseTop, mouseLeft) {
      var disabled = this.isDisabled();

      if (!disabled) {
        var dragging = this.isDragging();

        if (dragging) {
          var direction = this.getDirection(),
              dragHandler = this.getDragHandler(),
              sizeableElement = this.getSizeableElement(),
              previousMouseTop = this.getPreviousMouseTop(),
              previousSizeableElementHeight = this.getPreviousSizeableElementHeight(),
              relativeMouseTop = mouseTop - previousMouseTop;

          var sizeableElementHeight = previousSizeableElementHeight - direction * relativeMouseTop;

          var height = sizeableElementHeight; ///

          sizeableElement.setHeight(height);

          sizeableElementHeight = sizeableElement.getHeight(); ///

          dragHandler(sizeableElementHeight);
        }
      }
    }
  }, {
    key: 'mouseDown',
    value: function mouseDown(mouseTop, mouseLeft) {
      var disabled = this.isDisabled();

      if (!disabled) {
        var previousMouseTop = mouseTop,
            ///
        dragging = this.isDragging(),
            sizeableElement = this.getSizeableElement(),
            sizeableElementHeight = sizeableElement.getHeight(),
            previousSizeableElementHeight = sizeableElementHeight; /// 

        this.setPreviousMouseTop(previousMouseTop);

        this.setPreviousSizeableElementHeight(previousSizeableElementHeight);

        if (!dragging) {
          this.startDragging();
        }

        cursor.rowResize();
      }
    }
  }, {
    key: 'mouseOver',
    value: function mouseOver() {
      var disabled = this.isDisabled();

      if (!disabled) {
        cursor.rowResize();
      }
    }
  }, {
    key: 'mouseOut',
    value: function mouseOut() {
      var disabled = this.isDisabled();

      if (!disabled) {
        cursor.reset();
      }
    }
  }, {
    key: 'getPreviousMouseTop',
    value: function getPreviousMouseTop() {
      return this.fromState('previousMouseTop');
    }
  }, {
    key: 'getPreviousSizeableElementHeight',
    value: function getPreviousSizeableElementHeight() {
      return this.fromState('previousSizeableElementHeight');
    }
  }, {
    key: 'setPreviousMouseTop',
    value: function setPreviousMouseTop(previousMouseTop) {
      this.updateState({
        previousMouseTop: previousMouseTop
      });
    }
  }, {
    key: 'setPreviousSizeableElementHeight',
    value: function setPreviousSizeableElementHeight(previousSizeableElementHeight) {
      this.updateState({
        previousSizeableElementHeight: previousSizeableElementHeight
      });
    }
  }, {
    key: 'setInitialState',
    value: function setInitialState() {
      var previousMouseTop = null,
          previousSizeableElementHeight = null;

      this.setState({
        previousMouseTop: previousMouseTop,
        previousSizeableElementHeight: previousSizeableElementHeight
      });
    }
  }], [{
    key: 'fromProperties',
    value: function fromProperties(properties) {
      return Splitter.fromProperties(HorizontalSplitter, properties);
    }
  }]);

  return HorizontalSplitter;
}(Splitter);

Object.assign(HorizontalSplitter, {
  defaultProperties: {
    className: 'horizontal splitter'
  }
});

module.exports = HorizontalSplitter;

},{"../cursor":103,"../splitter":106}],108:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var cursor = require('../cursor'),
    Splitter = require('../splitter');

var VerticalSplitter = function (_Splitter) {
  _inherits(VerticalSplitter, _Splitter);

  function VerticalSplitter(selector, beforeSizeableElement, afterSizeableElement, startDraggingHandler, stopDraggingHandler, dragHandler, options) {
    _classCallCheck(this, VerticalSplitter);

    var _this = _possibleConstructorReturn(this, (VerticalSplitter.__proto__ || Object.getPrototypeOf(VerticalSplitter)).call(this, selector, beforeSizeableElement, afterSizeableElement, startDraggingHandler, stopDraggingHandler, dragHandler, options));

    _this.setInitialState();
    return _this;
  }

  _createClass(VerticalSplitter, [{
    key: 'mouseUp',
    value: function mouseUp() {
      var disabled = this.isDisabled();

      if (!disabled) {
        var dragging = this.isDragging();

        if (dragging) {
          this.stopDragging();
        }

        cursor.reset();
      }
    }
  }, {
    key: 'mouseMove',
    value: function mouseMove(mouseTop, mouseLeft) {
      var disabled = this.isDisabled();

      if (!disabled) {
        var dragging = this.isDragging();

        if (dragging) {
          var direction = this.getDirection(),
              dragHandler = this.getDragHandler(),
              sizeableElement = this.getSizeableElement(),
              previousMouseLeft = this.getPreviousMouseLeft(),
              previousSizeableElementWidth = this.getPreviousSizeableElementWidth(),
              relativeMouseLeft = mouseLeft - previousMouseLeft;

          var sizeableElementWidth = previousSizeableElementWidth - direction * relativeMouseLeft;

          var width = sizeableElementWidth; ///

          sizeableElement.setWidth(width);

          sizeableElementWidth = sizeableElement.getWidth(); ///

          dragHandler(sizeableElementWidth);
        }
      }
    }
  }, {
    key: 'mouseDown',
    value: function mouseDown(mouseTop, mouseLeft) {
      var disabled = this.isDisabled();

      if (!disabled) {
        var previousMouseLeft = mouseLeft,
            ///
        dragging = this.isDragging(),
            sizeableElement = this.getSizeableElement(),
            sizeableElementWidth = sizeableElement.getWidth(),
            previousSizeableElementWidth = sizeableElementWidth; /// 

        this.setPreviousMouseLeft(previousMouseLeft);

        this.setPreviousSizeableElementWidth(previousSizeableElementWidth);

        if (!dragging) {
          this.startDragging();
        }

        cursor.columnResize();
      }
    }
  }, {
    key: 'mouseOver',
    value: function mouseOver() {
      var disabled = this.isDisabled();

      if (!disabled) {
        cursor.columnResize();
      }
    }
  }, {
    key: 'mouseOut',
    value: function mouseOut() {
      var disabled = this.isDisabled();

      if (!disabled) {
        cursor.reset();
      }
    }
  }, {
    key: 'getPreviousMouseLeft',
    value: function getPreviousMouseLeft() {
      return this.fromState('previousMouseLeft');
    }
  }, {
    key: 'getPreviousSizeableElementWidth',
    value: function getPreviousSizeableElementWidth() {
      return this.fromState('previousSizeableElementWidth');
    }
  }, {
    key: 'setPreviousMouseLeft',
    value: function setPreviousMouseLeft(previousMouseLeft) {
      this.updateState({
        previousMouseLeft: previousMouseLeft
      });
    }
  }, {
    key: 'setPreviousSizeableElementWidth',
    value: function setPreviousSizeableElementWidth(previousSizeableElementWidth) {
      this.updateState({
        previousSizeableElementWidth: previousSizeableElementWidth
      });
    }
  }, {
    key: 'setInitialState',
    value: function setInitialState() {
      var previousMouseLeft = null,
          previousSizeableElementWidth = null;

      this.setState({
        previousMouseLeft: previousMouseLeft,
        previousSizeableElementWidth: previousSizeableElementWidth
      });
    }
  }], [{
    key: 'fromProperties',
    value: function fromProperties(properties) {
      return Splitter.fromProperties(VerticalSplitter, properties);
    }
  }]);

  return VerticalSplitter;
}(Splitter);

Object.assign(VerticalSplitter, {
  defaultProperties: {
    className: 'vertical splitter'
  }
});

module.exports = VerticalSplitter;

},{"../cursor":103,"../splitter":106}],109:[function(require,module,exports){
'use strict';

module.exports = {
  window: require('./lib/window'),
  document: require('./lib/document'),
  Div: require('./lib/element/div'),
  Span: require('./lib/element/span'),
  Body: require('./lib/element/body'),
  Link: require('./lib/element/link'),
  Select: require('./lib/element/select'),
  Button: require('./lib/element/button'),
  Checkbox: require('./lib/element/checkbox'),
  Element: require('./lib/element'),
  TextElement: require('./lib/textElement'),
  Input: require('./lib/inputElement/input'),
  Textarea: require('./lib/inputElement/textarea'),
  InputElement: require('./lib/inputElement'),
  Bounds: require('./lib/miscellaneous/bounds'),
  Offset: require('./lib/miscellaneous/offset'),
  React: require('./lib/react')
};

},{"./lib/document":110,"./lib/element":111,"./lib/element/body":112,"./lib/element/button":113,"./lib/element/checkbox":114,"./lib/element/div":115,"./lib/element/link":116,"./lib/element/select":117,"./lib/element/span":118,"./lib/inputElement":119,"./lib/inputElement/input":120,"./lib/inputElement/textarea":121,"./lib/miscellaneous/bounds":122,"./lib/miscellaneous/offset":123,"./lib/react":131,"./lib/textElement":132,"./lib/window":136}],110:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var keyMixins = require('./mixins/key'),
    eventMixins = require('./mixins/event'),
    clickMixins = require('./mixins/click'),
    mouseMixins = require('./mixins/mouse');

var Document = function Document() {
  _classCallCheck(this, Document);

  this.domElement = document; ///
};

Object.assign(Document.prototype, keyMixins);
Object.assign(Document.prototype, eventMixins);
Object.assign(Document.prototype, clickMixins);
Object.assign(Document.prototype, mouseMixins);

module.exports = new Document(); ///

},{"./mixins/click":124,"./mixins/event":125,"./mixins/key":127,"./mixins/mouse":128}],111:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var jsxMixins = require('./mixins/jsx'),
    keyMixins = require('./mixins/key'),
    mouseMixins = require('./mixins/mouse'),
    eventMixins = require('./mixins/event'),
    clickMixins = require('./mixins/click'),
    scrollMixins = require('./mixins/scroll'),
    resizeMixins = require('./mixins/resize'),
    Offset = require('./miscellaneous/offset'),
    Bounds = require('./miscellaneous/bounds'),
    domUtilities = require('./utilities/dom'),
    arrayUtilities = require('./utilities/array'),
    objectUtilities = require('./utilities/object');

var combine = objectUtilities.combine,
    first = arrayUtilities.first,
    augment = arrayUtilities.augment,
    domNodeMatchesSelector = domUtilities.domNodeMatchesSelector,
    domElementFromSelector = domUtilities.domElementFromSelector,
    elementsFromDOMElements = domUtilities.elementsFromDOMElements,
    filterDOMNodesBySelector = domUtilities.filterDOMNodesBySelector,
    descendantDOMNodesFromDOMNode = domUtilities.descendantDOMNodesFromDOMNode;

var Element = function () {
  function Element(selector) {
    _classCallCheck(this, Element);

    this.domElement = domElementFromSelector(selector);

    this.domElement.__element__ = this; ///
  }

  _createClass(Element, [{
    key: 'clone',
    value: function clone() {
      return Element.clone(this);
    }
  }, {
    key: 'getDOMElement',
    value: function getDOMElement() {
      return this.domElement;
    }
  }, {
    key: 'getOffset',
    value: function getOffset() {
      var top = this.domElement.offsetTop,
          ///
      left = this.domElement.offsetLeft,
          ///
      offset = new Offset(top, left);

      return offset;
    }
  }, {
    key: 'getBounds',
    value: function getBounds() {
      var boundingClientRect = this.domElement.getBoundingClientRect(),
          bounds = Bounds.fromBoundingClientRect(boundingClientRect);

      return bounds;
    }
  }, {
    key: 'getWidth',
    value: function getWidth() {
      var includeBorder = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      var width = includeBorder ? this.domElement.offsetWidth : this.domElement.clientWidth;

      return width;
    }
  }, {
    key: 'setWidth',
    value: function setWidth(width) {
      width = width + 'px'; ///

      this.style('width', width);
    }
  }, {
    key: 'getHeight',
    value: function getHeight() {
      var includeBorder = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      var height = includeBorder ? this.domElement.offsetHeight : this.domElement.clientHeight;

      return height;
    }
  }, {
    key: 'setHeight',
    value: function setHeight(height) {
      height = height + 'px'; ///

      this.style('height', height);
    }
  }, {
    key: 'hasAttribute',
    value: function hasAttribute(name) {
      return this.domElement.hasAttribute(name);
    }
  }, {
    key: 'getAttribute',
    value: function getAttribute(name) {
      return this.domElement.getAttribute(name);
    }
  }, {
    key: 'setAttribute',
    value: function setAttribute(name, value) {
      this.domElement.setAttribute(name, value);
    }
  }, {
    key: 'clearAttribute',
    value: function clearAttribute(name) {
      this.domElement.removeAttribute(name);
    }
  }, {
    key: 'addAttribute',
    value: function addAttribute(name, value) {
      this.setAttribute(name, value);
    }
  }, {
    key: 'removeAttribute',
    value: function removeAttribute(name) {
      this.clearAttribute(name);
    }
  }, {
    key: 'setClass',
    value: function setClass(className) {
      this.domElement.className = className;
    }
  }, {
    key: 'addClass',
    value: function addClass(className) {
      this.domElement.classList.add(className);
    }
  }, {
    key: 'removeClass',
    value: function removeClass(className) {
      this.domElement.classList.remove(className);
    }
  }, {
    key: 'toggleClass',
    value: function toggleClass(className) {
      this.domElement.classList.toggle(className);
    }
  }, {
    key: 'hasClass',
    value: function hasClass(className) {
      return this.domElement.classList.contains(className);
    }
  }, {
    key: 'clearClasses',
    value: function clearClasses() {
      this.domElement.className = '';
    }
  }, {
    key: 'prependTo',
    value: function prependTo(parentElement) {
      parentElement.prepend(this);
    }
  }, {
    key: 'appendTo',
    value: function appendTo(parentElement) {
      parentElement.append(this);
    }
  }, {
    key: 'addTo',
    value: function addTo(parentElement) {
      parentElement.add(this);
    }
  }, {
    key: 'removeFrom',
    value: function removeFrom(parentElement) {
      parentElement.remove(this);
    }
  }, {
    key: 'insertBefore',
    value: function insertBefore(siblingElement) {
      var parentDOMNode = siblingElement.domElement.parentNode,
          siblingDOMElement = siblingElement.domElement;

      parentDOMNode.insertBefore(this.domElement, siblingDOMElement);
    }
  }, {
    key: 'insertAfter',
    value: function insertAfter(siblingElement) {
      var parentDOMNode = siblingElement.domElement.parentNode,
          siblingDOMElement = siblingElement.domElement;

      parentDOMNode.insertBefore(this.domElement, siblingDOMElement.nextSibling); ///
    }
  }, {
    key: 'prepend',
    value: function prepend(element) {
      var domElement = element.domElement,
          firstChildDOMElement = this.domElement.firstChild;

      this.domElement.insertBefore(domElement, firstChildDOMElement);
    }
  }, {
    key: 'append',
    value: function append(element) {
      var domElement = element.domElement;

      this.domElement.insertBefore(domElement, null); ///
    }
  }, {
    key: 'add',
    value: function add(element) {
      this.append(element);
    }
  }, {
    key: 'remove',
    value: function remove(element) {
      if (element) {
        var domElement = element.domElement;

        this.domElement.removeChild(domElement);
      } else {
        this.domElement.remove();
      }
    }
  }, {
    key: 'show',
    value: function show() {
      var displayStyle = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'block';
      this.display(displayStyle);
    }
  }, {
    key: 'hide',
    value: function hide() {
      this.style('display', 'none');
    }
  }, {
    key: 'display',
    value: function display(_display) {
      this.style('display', _display);
    }
  }, {
    key: 'enable',
    value: function enable() {
      this.clearAttribute('disabled');
    }
  }, {
    key: 'disable',
    value: function disable() {
      this.setAttribute('disabled', 'disabled');
    }
  }, {
    key: 'isEnabled',
    value: function isEnabled() {
      var disabled = this.isDisabled(),
          enabled = !disabled;

      return enabled;
    }
  }, {
    key: 'isDisabled',
    value: function isDisabled() {
      var disabled = this.hasAttribute('disabled');

      return disabled;
    }
  }, {
    key: 'isDisplayed',
    value: function isDisplayed() {
      var display = this.style('display'),
          displayed = display !== 'none';

      return displayed;
    }
  }, {
    key: 'isShowing',
    value: function isShowing() {
      var displayed = this.isDisplayed(),
          showing = displayed; ///

      return showing;
    }
  }, {
    key: 'isHidden',
    value: function isHidden() {
      var displayed = this.isDisplayed(),
          hidden = !displayed;

      return hidden;
    }
  }, {
    key: 'style',
    value: function style(name, value) {
      if (value !== undefined) {
        this.domElement.style[name] = value;
      } else {
        var style = this.domElement.style[name];

        return style;
      }
    }
  }, {
    key: 'html',
    value: function html(_html) {
      if (_html === undefined) {
        var innerHTML = this.domElement.innerHTML;

        _html = innerHTML; ///

        return _html;
      } else {
        var _innerHTML = _html; ///

        this.domElement.innerHTML = _innerHTML;
      }
    }
  }, {
    key: 'css',
    value: function css(_css) {
      if (_css === undefined) {
        var computedStyle = getComputedStyle(this.domElement),
            css = {};

        for (var index = 0; index < computedStyle.length; index++) {
          var name = computedStyle[0],
              ///
          value = computedStyle.getPropertyValue(name); ///

          css[name] = value;
        }

        return css;
      } else if (typeof _css === 'string') {
        var _name = _css; ///

        var _computedStyle = getComputedStyle(this.domElement),
            _value = _computedStyle.getPropertyValue(_name); ///

        _css = _value; ///

        return _css;
      } else {
        var names = Object.keys(_css); ///

        names.forEach(function (name) {
          var value = _css[name];

          this.style(name, value);
        }.bind(this));
      }
    }
  }, {
    key: 'blur',
    value: function blur() {
      this.domElement.blur();
    }
  }, {
    key: 'focus',
    value: function focus() {
      this.domElement.focus();
    }
  }, {
    key: 'hasFocus',
    value: function hasFocus() {
      var focus = document.activeElement === this.domElement; ///

      return focus;
    }
  }, {
    key: 'getDescendantElements',
    value: function getDescendantElements() {
      var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '*';

      var domNode = this.domElement,
          ///
      descendantDOMNodes = descendantDOMNodesFromDOMNode(domNode),
          descendantDOMElements = filterDOMNodesBySelector(descendantDOMNodes, selector),
          descendantElements = elementsFromDOMElements(descendantDOMElements);

      return descendantElements;
    }
  }, {
    key: 'getChildElements',
    value: function getChildElements() {
      var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '*';

      var childDOMNodes = this.domElement.childNodes,
          childDOMElements = filterDOMNodesBySelector(childDOMNodes, selector),
          childElements = elementsFromDOMElements(childDOMElements);

      return childElements;
    }
  }, {
    key: 'getParentElement',
    value: function getParentElement() {
      var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '*';

      var parentElement = null;

      var parentDOMElement = this.domElement.parentElement;

      if (parentDOMElement !== null) {
        if (parentDOMElement.matches(selector)) {
          var parentDOMElements = [parentDOMElement],
              parentElements = elementsFromDOMElements(parentDOMElements),
              firstParentElement = first(parentElements);

          parentElement = firstParentElement || null;
        }
      }

      return parentElement;
    }
  }, {
    key: 'getAscendantElements',
    value: function getAscendantElements() {
      var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '*';

      var ascendantDOMElements = [],
          parentDOMElement = this.domElement.parentElement;

      var ascendantDOMElement = parentDOMElement; ///
      while (ascendantDOMElement !== null) {
        if (ascendantDOMElement.matches(selector)) {
          ascendantDOMElements.push(ascendantDOMElement);
        }

        ascendantDOMElement = ascendantDOMElement.parentElement;
      }

      var ascendantElements = elementsFromDOMElements(ascendantDOMElements);

      return ascendantElements;
    }
  }, {
    key: 'getPreviousSiblingElement',
    value: function getPreviousSiblingElement() {
      var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '*';

      var previousSiblingElement = null;

      var previousSiblingDOMNode = this.domElement.previousSibling; ///

      if (previousSiblingDOMNode !== null && domNodeMatchesSelector(previousSiblingDOMNode, selector)) {
        previousSiblingElement = previousSiblingDOMNode.__element__ || null;
      }

      return previousSiblingElement;
    }
  }, {
    key: 'getNextSiblingElement',
    value: function getNextSiblingElement() {
      var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '*';

      var nextSiblingElement = null;

      var nextSiblingDOMNode = this.domElement.nextSibling;

      if (nextSiblingDOMNode !== null && domNodeMatchesSelector(nextSiblingDOMNode, selector)) {
        nextSiblingElement = nextSiblingDOMNode.__element__ || null;
      }

      return nextSiblingElement;
    }
  }], [{
    key: 'clone',
    value: function clone(Class, element) {
      var deep = true,
          domElement = element.domElement.cloneNode(deep);

      for (var _len = arguments.length, remainingArguments = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        remainingArguments[_key - 2] = arguments[_key];
      }

      remainingArguments.unshift(domElement);
      remainingArguments.unshift(null);

      return new (Function.prototype.bind.apply(Class, remainingArguments))();
    }
  }, {
    key: 'fromHTML',
    value: function fromHTML(Class, html) {
      var outerDOMElement = document.createElement('div');

      outerDOMElement.innerHTML = html; ///

      var domElement = outerDOMElement.firstChild;

      for (var _len2 = arguments.length, remainingArguments = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        remainingArguments[_key2 - 2] = arguments[_key2];
      }

      remainingArguments.unshift(domElement);
      remainingArguments.unshift(null);

      return new (Function.prototype.bind.apply(Class, remainingArguments))();
    }
  }, {
    key: 'fromDOMElement',
    value: function fromDOMElement(Class, domElement) {
      for (var _len3 = arguments.length, remainingArguments = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
        remainingArguments[_key3 - 2] = arguments[_key3];
      }

      remainingArguments.unshift(domElement);
      remainingArguments.unshift(null);

      return new (Function.prototype.bind.apply(Class, remainingArguments))();
    }
  }, {
    key: 'fromProperties',
    value: function fromProperties(Class, properties) {
      for (var _len4 = arguments.length, remainingArguments = Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
        remainingArguments[_key4 - 2] = arguments[_key4];
      }

      var tagName = Class.tagName,
          html = '<' + tagName + ' />',
          element = Element.fromHTML.apply(Element, [Class, html].concat(remainingArguments)),
          defaultProperties = defaultPropertiesFromClass(Class),
          ignoredProperties = ignoredPropertiesFromClass(Class);

      element.applyProperties(properties, defaultProperties, ignoredProperties);

      return element;
    }
  }, {
    key: 'fromString',
    value: function fromString(string, properties) {
      for (var _len5 = arguments.length, remainingArguments = Array(_len5 > 2 ? _len5 - 2 : 0), _key5 = 2; _key5 < _len5; _key5++) {
        remainingArguments[_key5 - 2] = arguments[_key5];
      }

      var tagName = string,
          ///
      html = '<' + tagName + ' />',
          element = Element.fromHTML.apply(Element, [Element, html].concat(remainingArguments)),
          defaultProperties = {},
          ///
      ignoredProperties = []; ///

      element.applyProperties(properties, defaultProperties, ignoredProperties);

      return element;
    }
  }]);

  return Element;
}();

Object.assign(Element.prototype, jsxMixins);
Object.assign(Element.prototype, keyMixins);
Object.assign(Element.prototype, mouseMixins);
Object.assign(Element.prototype, eventMixins);
Object.assign(Element.prototype, clickMixins);
Object.assign(Element.prototype, scrollMixins);
Object.assign(Element.prototype, resizeMixins);

Object.assign(Element, {
  LEFT_MOUSE_BUTTON: 0,
  RIGHT_MOUSE_BUTTON: 2,
  MIDDLE_MOUSE_BUTTON: 1
});

module.exports = Element;

function defaultPropertiesFromClass(Class) {
  var defaultProperties = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (Class.hasOwnProperty('defaultProperties')) {
    combine(defaultProperties, Class.defaultProperties);
  }

  var superClass = Object.getPrototypeOf(Class);

  if (superClass !== null) {
    defaultPropertiesFromClass(superClass, defaultProperties);
  }

  return defaultProperties;
}

function ignoredPropertiesFromClass(Class) {
  var ignoredProperties = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  if (Class.hasOwnProperty('ignoredProperties')) {
    augment(ignoredProperties, Class.ignoredProperties, function (ignoredProperty) {
      return !ignoredProperties.includes(ignoredProperty);
    });
  }

  var superClass = Object.getPrototypeOf(Class);

  if (superClass !== null) {
    ignoredPropertiesFromClass(superClass, ignoredProperties);
  }

  return ignoredProperties;
}

},{"./miscellaneous/bounds":122,"./miscellaneous/offset":123,"./mixins/click":124,"./mixins/event":125,"./mixins/jsx":126,"./mixins/key":127,"./mixins/mouse":128,"./mixins/resize":129,"./mixins/scroll":130,"./utilities/array":133,"./utilities/dom":134,"./utilities/object":135}],112:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Element = require('../element');

var Body = function (_Element) {
  _inherits(Body, _Element);

  function Body() {
    var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'body';

    _classCallCheck(this, Body);

    return _possibleConstructorReturn(this, (Body.__proto__ || Object.getPrototypeOf(Body)).call(this, selector));
  }

  _createClass(Body, [{
    key: 'clone',
    value: function clone() {
      return Body.clone(this);
    }
  }], [{
    key: 'clone',
    value: function clone(element) {
      return Element.clone(Body, element);
    }
  }, {
    key: 'fromHTML',
    value: function fromHTML(html) {
      return Element.fromHTML(Body, html);
    }
  }, {
    key: 'fromDOMElement',
    value: function fromDOMElement(domElement) {
      return Element.fromDOMElement(Body, domElement);
    }
  }, {
    key: 'fromProperties',
    value: function fromProperties(properties) {
      return Element.fromProperties(Body, properties);
    }
  }]);

  return Body;
}(Element);

Object.assign(Body, {
  tagName: 'body'
});

module.exports = Body;

},{"../element":111}],113:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Element = require('../element');

var Button = function (_Element) {
  _inherits(Button, _Element);

  function Button(selector, clickHandler) {
    _classCallCheck(this, Button);

    var _this = _possibleConstructorReturn(this, (Button.__proto__ || Object.getPrototypeOf(Button)).call(this, selector));

    if (clickHandler !== undefined) {
      _this.onClick(clickHandler);
    }
    return _this;
  }

  _createClass(Button, [{
    key: 'clone',
    value: function clone(clickHandler) {
      return Button.clone(this, clickHandler);
    }
  }, {
    key: 'onClick',
    value: function onClick(clickHandler, object) {
      var intermediateClickHandler = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultIntermediateClickHandler;

      _get(Button.prototype.__proto__ || Object.getPrototypeOf(Button.prototype), 'onClick', this).call(this, clickHandler, object, intermediateClickHandler);
    }
  }, {
    key: 'offClick',
    value: function offClick(clickHandler, object) {
      _get(Button.prototype.__proto__ || Object.getPrototypeOf(Button.prototype), 'offClick', this).call(this, clickHandler, object);
    }
  }], [{
    key: 'clone',
    value: function clone(element, clickHandler) {
      return Element.clone(Button, element, clickHandler);
    }
  }, {
    key: 'fromHTML',
    value: function fromHTML(html, clickHandler) {
      return Element.fromHTML(Button, html, clickHandler);
    }
  }, {
    key: 'fromDOMElement',
    value: function fromDOMElement(domElement, clickHandler) {
      return Element.fromDOMElement(Button, domElement, clickHandler);
    }
  }, {
    key: 'fromProperties',
    value: function fromProperties(properties) {
      var onClick = properties.onClick,
          clickHandler = onClick,
          button = Element.fromProperties(Button, properties, clickHandler);


      return button;
    }
  }]);

  return Button;
}(Element);

Object.assign(Button, {
  tagName: 'button',
  ignoredProperties: ['onClick']
});

module.exports = Button;

function defaultIntermediateClickHandler(clickHandler, event, targetElement) {
  var mouseButton = event.button;

  clickHandler(mouseButton, event, targetElement);
}

},{"../element":111}],114:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Element = require('../element');

var Checkbox = function (_Element) {
  _inherits(Checkbox, _Element);

  function Checkbox(selector, changeHandler, checked) {
    _classCallCheck(this, Checkbox);

    var _this = _possibleConstructorReturn(this, (Checkbox.__proto__ || Object.getPrototypeOf(Checkbox)).call(this, selector));

    if (changeHandler !== undefined) {
      _this.onChange(changeHandler);
    }

    if (checked !== undefined) {
      _this.check(checked);
    }
    return _this;
  }

  _createClass(Checkbox, [{
    key: 'clone',
    value: function clone(changeHandler) {
      return Checkbox.clone(this, changeHandler);
    }
  }, {
    key: 'onChange',
    value: function onChange(changeHandler, object) {
      var intermediateChangeHandler = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultIntermediateChangeHandler;

      this.on('click', changeHandler, object, intermediateChangeHandler); ///
    }
  }, {
    key: 'offChange',
    value: function offChange(changeHandler, object) {
      this.off('click', changeHandler, object); ///
    }
  }, {
    key: 'check',
    value: function check() {
      var checked = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      checked ? this.setAttribute('checked', 'checked') : this.clearAttribute('checked');
    }
  }, {
    key: 'isChecked',
    value: function isChecked() {
      var domElement = this.getDOMElement(),
          checked = domElement.checked;

      return checked;
    }
  }, {
    key: 'onResize',
    value: function onResize() {}
  }, {
    key: 'offResize',
    value: function offResize() {}
  }], [{
    key: 'clone',
    value: function clone(element, changeHandler) {
      return Element.clone(Checkbox, element, changeHandler);
    }
  }, {
    key: 'fromHTML',
    value: function fromHTML(html, changeHandler) {
      return Element.fromHTML(Checkbox, html, changeHandler);
    }
  }, {
    key: 'fromDOMElement',
    value: function fromDOMElement(domElement, changeHandler) {
      return Element.fromDOMElement(Checkbox, domElement, changeHandler);
    }
  }, {
    key: 'fromProperties',
    value: function fromProperties(properties) {
      var onChange = properties.onChange,
          checked = properties.checked,
          changeHandler = onChange,
          checkbox = Element.fromProperties(Checkbox, properties, changeHandler, checked);


      return checkbox;
    }
  }]);

  return Checkbox;
}(Element);

Object.assign(Checkbox, {
  tagName: 'input',
  ignoredProperties: ['onChange', 'checked'],
  defaultProperties: {
    type: 'checkbox'
  }
});

module.exports = Checkbox;

function defaultIntermediateChangeHandler(changeHandler, event, targetElement) {
  var checkbox = targetElement,
      ///
  checked = checkbox.isChecked();

  changeHandler(checked, event, targetElement);
}

},{"../element":111}],115:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Element = require('../element');

var Div = function (_Element) {
  _inherits(Div, _Element);

  function Div(selector) {
    _classCallCheck(this, Div);

    return _possibleConstructorReturn(this, (Div.__proto__ || Object.getPrototypeOf(Div)).call(this, selector));
  }

  _createClass(Div, [{
    key: 'clone',
    value: function clone() {
      return Div.clone(this);
    }
  }], [{
    key: 'clone',
    value: function clone(element) {
      return Element.clone(Div, element);
    }
  }, {
    key: 'fromHTML',
    value: function fromHTML(html) {
      return Element.fromHTML(Div, html);
    }
  }, {
    key: 'fromDOMElement',
    value: function fromDOMElement(domElement) {
      return Element.fromDOMElement(Div, domElement);
    }
  }, {
    key: 'fromProperties',
    value: function fromProperties(properties) {
      return Element.fromProperties(Div, properties);
    }
  }]);

  return Div;
}(Element);

Object.assign(Div, {
  tagName: 'div'
});

module.exports = Div;

},{"../element":111}],116:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Element = require('../element');

var Link = function (_Element) {
  _inherits(Link, _Element);

  function Link(selector, clickHandler) {
    _classCallCheck(this, Link);

    var _this = _possibleConstructorReturn(this, (Link.__proto__ || Object.getPrototypeOf(Link)).call(this, selector));

    if (clickHandler !== undefined) {
      _this.onClick(clickHandler);
    }
    return _this;
  }

  _createClass(Link, [{
    key: 'clone',
    value: function clone(clickHandler) {
      return Link.clone(this, clickHandler);
    }
  }, {
    key: 'onClick',
    value: function onClick(clickHandler, object) {
      var intermediateClickHandler = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultIntermediateClickHandler;

      this.on('click', clickHandler, object, intermediateClickHandler);
    }
  }, {
    key: 'offClick',
    value: function offClick(clickHandler, object) {
      this.off('click', clickHandler, object);
    }
  }], [{
    key: 'clone',
    value: function clone(element, clickHandler) {
      return Element.clone(Link, element, clickHandler);
    }
  }, {
    key: 'fromHTML',
    value: function fromHTML(html, clickHandler) {
      return Element.fromHTML(Link, html, clickHandler);
    }
  }, {
    key: 'fromDOMElement',
    value: function fromDOMElement(domElement, clickHandler) {
      return Element.fromDOMElement(Link, domElement, clickHandler);
    }
  }, {
    key: 'fromProperties',
    value: function fromProperties(properties) {
      var onClick = properties.onClick,
          clickHandler = onClick,
          link = Element.fromProperties(Link, properties, clickHandler);


      return link;
    }
  }]);

  return Link;
}(Element);

Object.assign(Link, {
  tagName: 'a',
  ignoredProperties: ['onClick']
});

module.exports = Link;

function defaultIntermediateClickHandler(clickHandler, event, targetElement) {
  var link = targetElement,
      ///
  href = link.getAttribute('href');

  clickHandler(href, event, targetElement);
}

},{"../element":111}],117:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Element = require('../element');

var Select = function (_Element) {
  _inherits(Select, _Element);

  function Select(selector, changeHandler) {
    _classCallCheck(this, Select);

    var _this = _possibleConstructorReturn(this, (Select.__proto__ || Object.getPrototypeOf(Select)).call(this, selector));

    if (changeHandler !== undefined) {
      _this.onChange(changeHandler);
    }
    return _this;
  }

  _createClass(Select, [{
    key: 'clone',
    value: function clone(changeHandler) {
      return Select.clone(this, changeHandler);
    }
  }, {
    key: 'onChange',
    value: function onChange(changeHandler, object) {
      var intermediateChangeHandler = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultIntermediateChangeHandler;

      this.on('change', changeHandler, object, intermediateChangeHandler);
    }
  }, {
    key: 'offChange',
    value: function offChange(changeHandler, object) {
      this.off('change', changeHandler, object);
    }
  }, {
    key: 'getSelectedOptionValue',
    value: function getSelectedOptionValue() {
      var domElement = this.getDOMElement(),
          selectedOptionValue = domElement.value; ///

      return selectedOptionValue;
    }
  }, {
    key: 'setSelectedOptionByValue',
    value: function setSelectedOptionByValue(selectedOptionValue) {
      var value = selectedOptionValue,
          ///
      domElement = this.getDOMElement();

      domElement.value = value;
    }
  }], [{
    key: 'clone',
    value: function clone(element, changeHandler) {
      return Element.clone(Select, element, changeHandler);
    }
  }, {
    key: 'fromHTML',
    value: function fromHTML(html, changeHandler) {
      return Element.fromHTML(Select, html, changeHandler);
    }
  }, {
    key: 'fromDOMElement',
    value: function fromDOMElement(domElement, changeHandler) {
      return Element.fromDOMElement(Select, domElement, changeHandler);
    }
  }, {
    key: 'fromProperties',
    value: function fromProperties(properties) {
      var onChange = properties.onChange,
          changeHandler = onChange,
          select = Element.fromProperties(Select, properties, changeHandler);


      return select;
    }
  }]);

  return Select;
}(Element);

Object.assign(Select, {
  tagName: 'select',
  ignoredProperties: ['onChange']
});

module.exports = Select;

function defaultIntermediateChangeHandler(changeHandler, event, targetElement) {
  var select = targetElement,
      ///
  selectedOptionValue = select.getSelectedOptionValue();

  changeHandler(selectedOptionValue, event, targetElement);
}

},{"../element":111}],118:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Element = require('../element');

var Span = function (_Element) {
  _inherits(Span, _Element);

  function Span() {
    _classCallCheck(this, Span);

    return _possibleConstructorReturn(this, (Span.__proto__ || Object.getPrototypeOf(Span)).apply(this, arguments));
  }

  _createClass(Span, [{
    key: 'clone',
    value: function clone() {
      return Span.clone(this);
    }
  }, {
    key: 'onResize',
    value: function onResize() {}
  }, {
    key: 'offResize',
    value: function offResize() {}
  }], [{
    key: 'clone',
    value: function clone(element) {
      return Element.clone(Span, element);
    }
  }, {
    key: 'fromHTML',
    value: function fromHTML(html) {
      return Element.fromHTML(Span, html);
    }
  }, {
    key: 'fromDOMElement',
    value: function fromDOMElement(domElement) {
      return Element.fromDOMElement(Span, domElement);
    }
  }, {
    key: 'fromProperties',
    value: function fromProperties(properties) {
      return Element.fromProperties(properties);
    }
  }]);

  return Span;
}(Element);

Object.assign(Span, {
  tagName: 'span'
});

module.exports = Span;

},{"../element":111}],119:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Element = require('./element');

var InputElement = function (_Element) {
  _inherits(InputElement, _Element);

  function InputElement(selector, changeHandler) {
    _classCallCheck(this, InputElement);

    var _this = _possibleConstructorReturn(this, (InputElement.__proto__ || Object.getPrototypeOf(InputElement)).call(this, selector));

    if (changeHandler !== undefined) {
      _this.onChange(changeHandler);
    }
    return _this;
  }

  _createClass(InputElement, [{
    key: 'onResize',
    value: function onResize() {}
  }, {
    key: 'offResize',
    value: function offResize() {}
  }, {
    key: 'onChange',
    value: function onChange(changeHandler) {
      var intermediateChangeHandler = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultIntermediateChangeHandler;

      this.on('change', changeHandler, intermediateChangeHandler);
    }
  }, {
    key: 'offChange',
    value: function offChange(changeHandler) {
      this.off('change', changeHandler);
    }
  }, {
    key: 'getValue',
    value: function getValue() {
      return this.domElement.value;
    }
  }, {
    key: 'getSelectionStart',
    value: function getSelectionStart() {
      return this.domElement.selectionStart;
    }
  }, {
    key: 'getSelectionEnd',
    value: function getSelectionEnd() {
      return this.domElement.selectionEnd;
    }
  }, {
    key: 'isReadOnly',
    value: function isReadOnly() {
      return this.domElement.readOnly;
    }
  }, {
    key: 'setValue',
    value: function setValue(value) {
      this.domElement.value = value;
    }
  }, {
    key: 'setSelectionStart',
    value: function setSelectionStart(selectionStart) {
      this.domElement.selectionStart = selectionStart;
    }
  }, {
    key: 'setSelectionEnd',
    value: function setSelectionEnd(selectionEnd) {
      this.domElement.selectionEnd = selectionEnd;
    }
  }, {
    key: 'setReadOnly',
    value: function setReadOnly(readOnly) {
      this.domElement.readOnly = readOnly;
    }
  }, {
    key: 'select',
    value: function select() {
      this.domElement.select();
    }
  }], [{
    key: 'clone',
    value: function clone(Class, element) {
      for (var _len = arguments.length, remainingArguments = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        remainingArguments[_key - 2] = arguments[_key];
      }

      return Element.clone.apply(Element, [Class, element].concat(remainingArguments));
    }
  }, {
    key: 'fromHTML',
    value: function fromHTML(Class, html) {
      for (var _len2 = arguments.length, remainingArguments = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        remainingArguments[_key2 - 2] = arguments[_key2];
      }

      return Element.fromHTML.apply(Element, [Class, html].concat(remainingArguments));
    }
  }, {
    key: 'fromDOMElement',
    value: function fromDOMElement(Class, domElement) {
      for (var _len3 = arguments.length, remainingArguments = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
        remainingArguments[_key3 - 2] = arguments[_key3];
      }

      return Element.fromDOMElement.apply(Element, [Class, domElement].concat(remainingArguments));
    }
  }, {
    key: 'fromProperties',
    value: function fromProperties(Class, properties) {
      var onChange = properties.onChange,
          changeHandler = onChange; ///

      for (var _len4 = arguments.length, remainingArguments = Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
        remainingArguments[_key4 - 2] = arguments[_key4];
      }

      return Element.fromProperties.apply(Element, [Class, properties, changeHandler].concat(remainingArguments));
    }
  }, {
    key: 'fromString',
    value: function fromString(string, properties) {
      var onChange = properties.onChange,
          changeHandler = onChange; ///

      for (var _len5 = arguments.length, remainingArguments = Array(_len5 > 2 ? _len5 - 2 : 0), _key5 = 2; _key5 < _len5; _key5++) {
        remainingArguments[_key5 - 2] = arguments[_key5];
      }

      return Element.fromString.apply(Element, [string, properties, changeHandler].concat(remainingArguments));
    }
  }]);

  return InputElement;
}(Element);

Object.assign(InputElement, {
  ignoredProperties: ['onChange']
});

module.exports = InputElement;

function defaultIntermediateChangeHandler(changeHandler, event, targetElement) {
  var inputElement = targetElement,
      ///
  value = inputElement.getValue();

  changeHandler(value, event, targetElement);
}

},{"./element":111}],120:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InputElement = require('../inputElement');

var Input = function (_InputElement) {
  _inherits(Input, _InputElement);

  function Input() {
    _classCallCheck(this, Input);

    return _possibleConstructorReturn(this, (Input.__proto__ || Object.getPrototypeOf(Input)).apply(this, arguments));
  }

  _createClass(Input, [{
    key: 'clone',
    value: function clone(changeHandler) {
      return Input.clone(this, changeHandler);
    }
  }], [{
    key: 'clone',
    value: function clone(element, changeHandler) {
      return InputElement.clone(Input, element, changeHandler);
    }
  }, {
    key: 'fromHTML',
    value: function fromHTML(html, changeHandler) {
      return InputElement.fromHTML(Input, html, changeHandler);
    }
  }, {
    key: 'fromDOMElement',
    value: function fromDOMElement(domElement, changeHandler) {
      return InputElement.fromDOMElement(Input, domElement, changeHandler);
    }
  }, {
    key: 'fromProperties',
    value: function fromProperties(properties) {
      return InputElement.fromProperties(Input, properties);
    }
  }]);

  return Input;
}(InputElement);

Object.assign(Input, {
  tagName: 'input'
});

module.exports = Input;

},{"../inputElement":119}],121:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InputElement = require('../inputElement');

var Textarea = function (_InputElement) {
  _inherits(Textarea, _InputElement);

  function Textarea() {
    _classCallCheck(this, Textarea);

    return _possibleConstructorReturn(this, (Textarea.__proto__ || Object.getPrototypeOf(Textarea)).apply(this, arguments));
  }

  _createClass(Textarea, [{
    key: 'clone',
    value: function clone(changeHandler) {
      return Textarea.clone(this, changeHandler);
    }
  }], [{
    key: 'clone',
    value: function clone(element, changeHandler) {
      return InputElement.clone(Textarea, element, changeHandler);
    }
  }, {
    key: 'fromHTML',
    value: function fromHTML(html, changeHandler) {
      return InputElement.fromHTML(Textarea, html, changeHandler);
    }
  }, {
    key: 'fromDOMElement',
    value: function fromDOMElement(domElement, changeHandler) {
      return InputElement.fromDOMElement(Textarea, domElement, changeHandler);
    }
  }, {
    key: 'fromProperties',
    value: function fromProperties(properties) {
      return InputElement.fromProperties(Textarea, properties);
    }
  }]);

  return Textarea;
}(InputElement);

Object.assign(Textarea, {
  tagName: 'textarea'
});

module.exports = Textarea;

},{"../inputElement":119}],122:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Bounds = function () {
  function Bounds(top, left, bottom, right) {
    _classCallCheck(this, Bounds);

    this.top = top;
    this.left = left;
    this.bottom = bottom;
    this.right = right;
  }

  _createClass(Bounds, [{
    key: 'getTop',
    value: function getTop() {
      return this.top;
    }
  }, {
    key: 'getLeft',
    value: function getLeft() {
      return this.left;
    }
  }, {
    key: 'getBottom',
    value: function getBottom() {
      return this.bottom;
    }
  }, {
    key: 'getRight',
    value: function getRight() {
      return this.right;
    }
  }, {
    key: 'getWidth',
    value: function getWidth() {
      var width = this.right - this.left;

      return width;
    }
  }, {
    key: 'getHeight',
    value: function getHeight() {
      var height = this.bottom - this.top;

      return height;
    }
  }, {
    key: 'setTop',
    value: function setTop(top) {
      this.top = top;
    }
  }, {
    key: 'setLeft',
    value: function setLeft(left) {
      this.left = left;
    }
  }, {
    key: 'setBottom',
    value: function setBottom(bottom) {
      this.bottom = bottom;
    }
  }, {
    key: 'setRight',
    value: function setRight(right) {
      this.right = right;
    }
  }, {
    key: 'shift',
    value: function shift(horizontalOffset, verticalOffset) {
      this.top += verticalOffset;
      this.left += horizontalOffset;
      this.bottom += verticalOffset;
      this.right += horizontalOffset;
    }
  }, {
    key: 'isOverlappingMouse',
    value: function isOverlappingMouse(mouseTop, mouseLeft) {
      return this.top < mouseTop && this.left < mouseLeft && this.bottom > mouseTop && this.right > mouseLeft;
    }
  }, {
    key: 'areOverlapping',
    value: function areOverlapping(bounds) {
      return this.top < bounds.bottom && this.left < bounds.right && this.bottom > bounds.top && this.right > bounds.left;
    }
  }], [{
    key: 'fromBoundingClientRect',
    value: function fromBoundingClientRect(boundingClientRect) {
      var windowScrollTop = window.pageYOffset,
          ///
      windowScrollLeft = window.pageXOffset,
          ///
      top = boundingClientRect.top + windowScrollTop,
          left = boundingClientRect.left + windowScrollLeft,
          bottom = boundingClientRect.bottom + windowScrollTop,
          right = boundingClientRect.right + windowScrollLeft,
          bounds = new Bounds(top, left, bottom, right);

      return bounds;
    }
  }, {
    key: 'fromTopLeftWidthAndHeight',
    value: function fromTopLeftWidthAndHeight(top, left, width, height) {
      var bottom = top + height,
          right = left + width,
          bounds = new Bounds(top, left, bottom, right);

      return bounds;
    }
  }]);

  return Bounds;
}();

module.exports = Bounds;

},{}],123:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Offset = function () {
  function Offset(top, left) {
    _classCallCheck(this, Offset);

    this.top = top;
    this.left = left;
  }

  _createClass(Offset, [{
    key: 'getTop',
    value: function getTop() {
      return this.top;
    }
  }, {
    key: 'getLeft',
    value: function getLeft() {
      return this.left;
    }
  }]);

  return Offset;
}();

module.exports = Offset;

},{}],124:[function(require,module,exports){
'use strict';

function onClick(handler, object) {
  var intermediateHandler = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultIntermediateHandler;

  this.on('click', handler, object, intermediateHandler);
}

function offClick(handler, object) {
  this.off('click', handler, object);
}

module.exports = {
  onClick: onClick,
  offClick: offClick
};

function defaultIntermediateHandler(handler, event, targetElement) {
  var mouseTop = event.pageY,
      ///
  mouseLeft = event.pageX,
      ///
  mouseButton = event.button; ///

  handler(mouseTop, mouseLeft, mouseButton, event, targetElement);
}

},{}],125:[function(require,module,exports){
'use strict';

function on(eventTypes, handler) {
  var object = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var intermediateHandler = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

  eventTypes = eventTypes.split(' '); ///

  eventTypes.forEach(function (eventType) {
    var eventListener = this.addEventListener(eventType, handler, object, intermediateHandler);

    this.domElement.addEventListener(eventType, eventListener);
  }.bind(this));
}

function off(eventTypes, handler) {
  var object = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  eventTypes = eventTypes.split(' '); ///

  eventTypes.forEach(function (eventType) {
    var eventListener = this.removeEventListener(eventType, handler, object);

    this.domElement.removeEventListener(eventType, eventListener);
  }.bind(this));
}

module.exports = {
  on: on,
  off: off,
  addEventListener: addEventListener,
  removeEventListener: removeEventListener
};

function addEventListener(eventType, handler, object, intermediateHandler) {
  if (!this.hasOwnProperty('eventListeners')) {
    this.eventListeners = [];
  }

  var targetElement = this,
      ///
  eventListeners = this.eventListeners,
      eventListener = createEventListener(targetElement, eventType, handler, object, intermediateHandler);

  eventListeners.push(eventListener);

  return eventListener;
}

function removeEventListener(eventType, handler, object) {
  var eventListeners = this.eventListeners,
      eventListener = findEventListener(eventListeners, eventType, handler, object),
      index = eventListeners.indexOf(eventListener),
      start = index,
      ///
  deleteCount = 1;

  eventListeners.splice(start, deleteCount);

  if (eventListeners.length === 0) {
    delete this.eventListeners;
  }

  return eventListener;
}

function createEventListener(targetElement, eventType, handler, object, intermediateHandler) {
  var eventListener = void 0;

  if (intermediateHandler === null) {
    eventListener = function eventListener(event) {
      handler.call(object, event, targetElement);
    };
  } else {
    eventListener = function eventListener(event) {
      intermediateHandler(function (event) {
        handler.call.apply(handler, [object].concat(Array.prototype.slice.call(arguments)));
      }, event, targetElement);
    };
  }

  Object.assign(eventListener, {
    eventType: eventType,
    handler: handler,
    object: object
  });

  return eventListener;
}

function findEventListener(eventListeners, eventType, handler, object) {
  var eventListener = eventListeners.find(function (eventListener) {
    var found = eventListener.object === object && eventListener.handler === handler && eventListener.eventType === eventType; ///

    return found;
  });

  return eventListener;
}

},{}],126:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var TextElement = require('../textElement'),
    arrayUtilities = require('../utilities/array'),
    objectUtilities = require('../utilities/object');

var first = arrayUtilities.first,
    combine = objectUtilities.combine,
    prune = objectUtilities.prune;


function applyProperties() {
  var properties = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var defaultProperties = arguments[1];
  var ignoredProperties = arguments[2];

  combine(properties, defaultProperties);

  var element = this,
      ///
  childElements = childElementsFromElementAndProperties(element, properties);

  prune(properties, ignoredProperties);

  var names = Object.keys(properties); ///

  names.forEach(function (name) {
    var value = properties[name];

    if (false) {} else if (isHandlerName(name)) {
      addHandler(this, name, value);
    } else if (isAttributeName(name)) {
      addAttribute(this, name, value);
    } else {
      if (!this.hasOwnProperty('properties')) {
        var _properties = {};

        Object.assign(this, {
          properties: _properties
        });
      }

      this.properties[name] = value;
    }
  }.bind(this));

  var parentElement = this; ///

  childElements.forEach(function (childElement) {
    updateParentElementContext(childElement, parentElement);

    childElement.addTo(parentElement);
  }.bind(this));
}

function getProperties() {
  return this.properties;
}

function getContext() {
  return this.context;
}

function getState() {
  return this.state;
}

function setState(state) {
  this.state = state;
}

function fromState(name) {
  var value = this.state[name];

  return value;
}

function updateState(update) {
  Object.assign(this.state, update);
}

function assignContext(names, thenDelete) {
  var argumentsLength = arguments.length;

  if (argumentsLength === 1) {
    var firstArgument = first(arguments);

    if (typeof firstArgument === 'boolean') {
      names = Object.keys(this.context);

      thenDelete = firstArgument;
    } else {
      thenDelete = true;
    }
  }

  if (argumentsLength === 0) {
    names = Object.keys(this.context);

    thenDelete = true;
  }

  names.forEach(function (name) {
    var value = this.context[name],
        propertyName = name,
        ///
    descriptor = {
      value: value
    };

    Object.defineProperty(this, propertyName, descriptor);

    if (thenDelete) {
      delete this.context[name];
    }
  }.bind(this), []);
}

module.exports = {
  applyProperties: applyProperties,
  getProperties: getProperties,
  getContext: getContext,
  getState: getState,
  setState: setState,
  fromState: fromState,
  updateState: updateState,
  assignContext: assignContext
};

function updateParentElementContext(childElement, parentElement) {
  var parentContext = typeof childElement.parentContext === 'function' ? childElement.parentContext() : childElement.context;

  parentElement.context = Object.assign({}, parentElement.context, parentContext);

  delete childElement.context;
}

function childElementsFromElementAndProperties(element, properties) {
  var childElements = typeof element.childElements === 'function' ? element.childElements(properties) : properties.childElements;

  childElements = childElements !== undefined ? childElements instanceof Array ? childElements : [childElements] : [];

  childElements = childElements.map(function (childElement) {
    if (typeof childElement === 'string') {
      var text = childElement,
          ///
      textElement = new TextElement(text);

      childElement = textElement; ///
    }

    return childElement;
  });

  return childElements;
}

function addHandler(element, name, value) {
  var eventType = name.substr(2).toLowerCase(),
      ///
  handler = value; ///

  element.on(eventType, handler);
}

function addAttribute(element, name, value) {
  if (name === 'className') {
    name = 'class';
  }

  if (name === 'htmlFor') {
    name = 'for';
  }

  if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
    var keys = Object.keys(value);

    keys.forEach(function (key) {
      element.domElement[name][key] = value[key];
    }.bind(this));
  } else if (typeof value === 'boolean') {
    if (value) {
      value = name; ///

      element.addAttribute(name, value);
    }
  } else {
    element.addAttribute(name, value);
  }
}

function isHandlerName(name) {
  return name.match(/^on/);
}

function isAttributeName(name) {
  return attributeNames.includes(name);
}

var attributeNames = ['accept', 'acceptCharset', 'accessKey', 'action', 'allowFullScreen', 'allowTransparency', 'alt', 'async', 'autoComplete', 'autoFocus', 'autoPlay', 'capture', 'cellPadding', 'cellSpacing', 'challenge', 'charSet', 'checked', 'cite', 'classID', 'className', 'colSpan', 'cols', 'content', 'contentEditable', 'contextMenu', 'controls', 'coords', 'crossOrigin', 'data', 'dateTime', 'default', 'defer', 'dir', 'disabled', 'download', 'draggable', 'encType', 'form', 'formAction', 'formEncType', 'formMethod', 'formNoValidate', 'formTarget', 'frameBorder', 'headers', 'height', 'hidden', 'high', 'href', 'hrefLang', 'htmlFor', 'httpEquiv', 'icon', 'id', 'inputMode', 'integrity', 'is', 'keyParams', 'keyType', 'kind', 'label', 'lang', 'list', 'loop', 'low', 'manifest', 'marginHeight', 'marginWidth', 'max', 'maxLength', 'media', 'mediaGroup', 'method', 'min', 'minLength', 'multiple', 'muted', 'name', 'noValidate', 'nonce', 'open', 'optimum', 'pattern', 'placeholder', 'poster', 'preload', 'profile', 'radioGroup', 'readOnly', 'rel', 'required', 'reversed', 'role', 'rowSpan', 'rows', 'sandbox', 'scope', 'scoped', 'scrolling', 'seamless', 'selected', 'shape', 'size', 'sizes', 'span', 'spellCheck', 'src', 'srcDoc', 'srcLang', 'srcSet', 'start', 'step', 'style', 'summary', 'tabIndex', 'target', 'title', 'type', 'useMap', 'value', 'width', 'wmode', 'wrap'];

},{"../textElement":132,"../utilities/array":133,"../utilities/object":135}],127:[function(require,module,exports){
'use strict';

function onKeyUp(handler, object) {
  var intermediateHandler = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultIntermediateHandler;

  this.on('keyup', handler, object, intermediateHandler);
}

function onKeyDown(handler, object) {
  var intermediateHandler = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultIntermediateHandler;

  this.on('keydown', handler, object, intermediateHandler);
}

function offKeyUp(handler, object) {
  this.off('keyup', handler, object);
}

function offKeyDown(handler, object) {
  this.off('keydown', handler, object);
}

module.exports = {
  onKeyUp: onKeyUp,
  onKeyDown: onKeyDown,
  offKeyUp: offKeyUp,
  offKeyDown: offKeyDown
};

function defaultIntermediateHandler(handler, event, targetElement) {
  var keyCode = event.keyCode;

  handler(keyCode, event, targetElement);
}

},{}],128:[function(require,module,exports){
'use strict';

function onMouseUp(handler, object) {
  var intermediateHandler = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultIntermediateHandler;

  this.on('mouseup', handler, object, intermediateHandler);
}

function onMouseDown(handler, object) {
  var intermediateHandler = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultIntermediateHandler;

  this.on('mousedown', handler, object, intermediateHandler);
}

function onMouseOver(handler, object) {
  var intermediateHandler = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultIntermediateHandler;

  this.on('mouseover', handler, object, intermediateHandler);
}

function onMouseOut(handler, object) {
  var intermediateHandler = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultIntermediateHandler;

  this.on('mouseout', handler, object, intermediateHandler);
}

function onMouseMove(handler, object) {
  var intermediateHandler = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultIntermediateHandler;

  this.on('mousemove', handler, object, intermediateHandler);
}

function offMouseUp(handler, object) {
  this.off('mouseup', handler, object);
}

function offMouseDown(handler, object) {
  this.off('mousedown', handler, object);
}

function offMouseOver(handler, object) {
  this.off('mouseover', handler, object);
}

function offMouseOut(handler, object) {
  this.off('mouseout', handler, object);
}

function offMouseMove(handler, object) {
  this.off('mousemove', handler, object);
}

module.exports = {
  onMouseUp: onMouseUp,
  onMouseDown: onMouseDown,
  onMouseOver: onMouseOver,
  onMouseOut: onMouseOut,
  onMouseMove: onMouseMove,
  offMouseUp: offMouseUp,
  offMouseDown: offMouseDown,
  offMouseOver: offMouseOver,
  offMouseOut: offMouseOut,
  offMouseMove: offMouseMove
};

function defaultIntermediateHandler(handler, event, targetElement) {
  var mouseTop = event.pageY,
      ///
  mouseLeft = event.pageX,
      ///
  mouseButton = event.button; ///

  handler(mouseTop, mouseLeft, mouseButton, event, targetElement);
}

},{}],129:[function(require,module,exports){
'use strict';

function onResize(handler, object) {
  var intermediateHandler = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultIntermediateResizeHandler;

  var element = this,
      ///
  resizeEventListeners = findResizeEventListeners(element);

  if (resizeEventListeners.length === 0) {
    addResizeObject(element);
  }

  var eventType = 'resize';

  this.addEventListener(eventType, handler, object, intermediateHandler);
}

function offResize(handler, object) {
  var eventType = 'resize';

  this.removeEventListener(eventType, handler, object);

  var element = this,
      ///
  resizeEventListeners = findResizeEventListeners(element);

  if (resizeEventListeners.length === 0) {
    removeResizeObject(element);
  }
}

module.exports = {
  onResize: onResize,
  offResize: offResize
};

function addResizeObject(element) {
  var resizeObject = document.createElement('object'),
      domElement = element.getDOMElement(),
      style = 'display: block; \n                 position: absolute; \n                 top: 0; \n                 left: 0; \n                 height: 100%; \n                 width: 100%; \n                 overflow: hidden; \n                 pointer-events: none; \n                 z-index: -1;',
      data = 'about:blank',
      type = 'text/html';

  resizeObject.setAttribute('style', style);
  resizeObject.data = data;
  resizeObject.type = type;

  element.__resizeObject__ = resizeObject;

  resizeObject.onload = function () {
    resizeObjectLoadHandler(element);
  };

  domElement.appendChild(resizeObject);
}

function removeResizeObject(element) {
  var domElement = element.getDOMElement(),
      resizeObject = element.__resizeObject__,
      objectWindow = resizeObject.contentDocument.defaultView; ///

  objectWindow.removeEventListener('resize', resizeEventListener);

  domElement.removeChild(resizeObject);
}

function resizeObjectLoadHandler(element) {
  var resizeObject = element.__resizeObject__,
      resizeObjectWindow = resizeObject.contentDocument.defaultView; ///

  resizeObjectWindow.addEventListener('resize', function (event) {
    var resizeEventListeners = findResizeEventListeners(element);

    resizeEventListeners.forEach(function (resizeEventListener) {
      resizeEventListener(event);
    });
  });
}

function defaultIntermediateResizeHandler(handler, event, targetElement) {
  var window = targetElement,
      ///
  width = window.getWidth(),
      height = window.getHeight();

  handler(width, height, event, targetElement);
}

function findResizeEventListeners(element) {
  var resizeEventListeners = [];

  if (element.hasOwnProperty('eventListeners')) {
    var eventListeners = element.eventListeners; ///

    eventListeners.forEach(function (eventListener) {
      if (eventListener.eventType === 'resize') {
        var _resizeEventListener = eventListener;

        resizeEventListeners.push(_resizeEventListener);
      }
    });
  }

  return resizeEventListeners;
}

},{}],130:[function(require,module,exports){
'use strict';

function onScroll(handler, object) {
  var intermediateHandler = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultIntermediateHandler;

  this.on('scroll', handler, object, intermediateHandler);
}

function offScroll(handler, object) {
  this.off('scroll', handler, object);
}

function getScrollTop() {
  return this.domElement.scrollTop;
}

function getScrollLeft() {
  return this.domElement.scrollLeft;
}

function setScrollTop(scrollTop) {
  this.domElement.scrollTop = scrollTop;
}

function setScrollLeft(scrollLeft) {
  this.domElement.scrollLeft = scrollLeft;
}

module.exports = {
  onScroll: onScroll,
  offScroll: offScroll,
  getScrollTop: getScrollTop,
  getScrollLeft: getScrollLeft,
  setScrollTop: setScrollTop,
  setScrollLeft: setScrollLeft
};

function defaultIntermediateHandler(handler, event, targetElement) {
  var scrollTop = targetElement.getScrollTop(),
      scrollLeft = targetElement.getScrollLeft();

  handler(scrollTop, scrollLeft, event, targetElement);
}

},{}],131:[function(require,module,exports){
'use strict';

var Element = require('./element'),
    TextElement = require('./textElement');

function createElement(firstArgument, properties) {
  var element = null;

  if (firstArgument !== undefined) {
    for (var _len = arguments.length, childArguments = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      childArguments[_key - 2] = arguments[_key];
    }

    var childElements = childElementsFromChildArguments(childArguments);

    properties = Object.assign({
      childElements: childElements
    }, properties);

    if (false) {} else if (isSubclassOf(firstArgument, Element)) {
      var Class = firstArgument; ///

      element = Class.fromProperties(properties);
    } else if (typeof firstArgument === 'string') {
      var string = firstArgument; ///

      element = Element.fromString(string, properties);
    } else if (typeof firstArgument === 'function') {
      var elementFunction = firstArgument; ///

      element = elementFunction(properties);
    }
  }

  return element;
}

var React = {
  createElement: createElement
};

module.exports = React;

function childElementsFromChildArguments(childArguments) {
  childArguments = childArguments.reduce(function (childArguments, childArgument) {
    childArguments = childArguments.concat(childArgument);

    return childArguments;
  }, []);

  var childElements = childArguments.map(function (childArgument) {
    var childElement = void 0;

    if (typeof childArgument === 'string') {
      var text = childArgument,
          ///
      textElement = new TextElement(text);

      childElement = textElement;
    } else {
      childElement = childArgument; ///
    }

    return childElement;
  });

  return childElements;
}

function isSubclassOf(argument, Class) {
  var typeOf = false;

  if (argument.name === Class.name) {
    ///
    typeOf = true;
  } else {
    argument = Object.getPrototypeOf(argument); ///

    if (argument) {
      typeOf = isSubclassOf(argument, Class);
    }
  }

  return typeOf;
}

},{"./element":111,"./textElement":132}],132:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Offset = require('./miscellaneous/offset'),
    Bounds = require('./miscellaneous/bounds');

var TextElement = function () {
  function TextElement(text) {
    _classCallCheck(this, TextElement);

    this.domElement = document.createTextNode(text); ///

    this.domElement.__element__ = this;
  }

  _createClass(TextElement, [{
    key: 'clone',
    value: function clone() {
      return TextElement.clone(this);
    }
  }, {
    key: 'getText',
    value: function getText() {
      var nodeValue = this.domElement.nodeValue,
          text = nodeValue; ///

      return text;
    }
  }, {
    key: 'setText',
    value: function setText(text) {
      var nodeValue = text; ///

      this.domElement.nodeValue = nodeValue;
    }
  }, {
    key: 'getOffset',
    value: function getOffset() {
      var top = this.domElement.offsetTop,
          ///
      left = this.domElement.offsetLeft,
          ///
      offset = new Offset(top, left);

      return offset;
    }
  }, {
    key: 'getBounds',
    value: function getBounds() {
      var boundingClientRect = this.domElement.getBoundingClientRect(),
          bounds = Bounds.fromBoundingClientRect(boundingClientRect);

      return bounds;
    }
  }, {
    key: 'getWidth',
    value: function getWidth() {
      var width = this.domElement.clientWidth;

      return width;
    }
  }, {
    key: 'getHeight',
    value: function getHeight() {
      var height = this.domElement.clientHeight;

      return height;
    }
  }, {
    key: 'prependTo',
    value: function prependTo(parentElement) {
      parentElement.prepend(this);
    }
  }, {
    key: 'appendTo',
    value: function appendTo(parentElement) {
      parentElement.append(this);
    }
  }, {
    key: 'addTo',
    value: function addTo(parentElement) {
      parentElement.add(this);
    }
  }, {
    key: 'removeFrom',
    value: function removeFrom(parentElement) {
      parentElement.remove(this);
    }
  }, {
    key: 'insertBefore',
    value: function insertBefore(siblingElement) {
      var parentDOMNode = siblingElement.domElement.parentNode,
          siblingDOMElement = siblingElement.domElement;

      parentDOMNode.insertBefore(this.domElement, siblingDOMElement);
    }
  }, {
    key: 'insertAfter',
    value: function insertAfter(siblingElement) {
      var parentDOMNode = siblingElement.domElement.parentNode,
          siblingDOMElement = siblingElement.domElement;

      parentDOMNode.insertBefore(this.domElement, siblingDOMElement.nextSibling); ///
    }
  }, {
    key: 'remove',
    value: function remove() {
      this.domElement.remove();
    }
  }]);

  return TextElement;
}();

module.exports = TextElement;

},{"./miscellaneous/bounds":122,"./miscellaneous/offset":123}],133:[function(require,module,exports){
'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function first(array) {
  return array[0];
}

function splice(array1, start) {
  var deleteCount = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Infinity;
  var array2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

  var args = [start, deleteCount].concat(_toConsumableArray(array2)),
      deletedItemsArray = Array.prototype.splice.apply(array1, args);

  return deletedItemsArray;
}

function augment(array1, array2, test) {
  array2.forEach(function (element, index) {
    var passed = test(element, index);

    if (passed) {
      array1.push(element);
    }
  });
}

module.exports = {
  first: first,
  splice: splice,
  augment: augment
};

},{}],134:[function(require,module,exports){
'use strict';

var arrayUtilities = require('../utilities/array');

var splice = arrayUtilities.splice;


function domElementFromSelector(selector) {
  var domElement = typeof selector === 'string' ? document.querySelectorAll(selector)[0] : ///
  selector; ///

  return domElement;
}

function elementsFromDOMElements(domElements) {
  var domElementsWithElements = filterDOMNodes(domElements, function (domElement) {
    return domElement.__element__ !== undefined;
  }),
      elements = domElementsWithElements.map(function (domElement) {
    return domElement.__element__;
  });

  return elements;
}

function descendantDOMNodesFromDOMNode(domNode) {
  var descendantDOMNodes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  var start = -1,
      deleteCount = 0,
      childDOMNodes = domNode.childNodes; ///

  splice(descendantDOMNodes, start, deleteCount, childDOMNodes);

  childDOMNodes.forEach(function (childDOMNode) {
    descendantDOMNodesFromDOMNode(childDOMNode, descendantDOMNodes);
  });

  return descendantDOMNodes;
}

function filterDOMNodesBySelector(domNodes, selector) {
  var filteredDOMNodes = filterDOMNodes(domNodes, function (domNode) {
    return domNodeMatchesSelector(domNode, selector);
  });

  return filteredDOMNodes;
}

function domNodeMatchesSelector(domNode, selector) {
  var domNodeType = domNode.nodeType;

  switch (domNodeType) {
    case Node.ELEMENT_NODE:
      {
        var domElement = domNode; ///

        return domElement.matches(selector);
      }

    case Node.TEXT_NODE:
      {
        if (selector === '*') {
          return true;
        }
      }
  }

  return false;
}

function filterDOMNodes(domNodes, test) {
  var filteredDOMNodes = [],
      domNodesLength = domNodes.length;

  for (var index = 0; index < domNodesLength; index++) {
    var domNode = domNodes[index],
        result = test(domNode);

    if (result) {
      filteredDOMNodes.push(domNode);
    }
  }

  return filteredDOMNodes;
}

module.exports = {
  domElementFromSelector: domElementFromSelector,
  elementsFromDOMElements: elementsFromDOMElements,
  descendantDOMNodesFromDOMNode: descendantDOMNodesFromDOMNode,
  filterDOMNodesBySelector: filterDOMNodesBySelector,
  domNodeMatchesSelector: domNodeMatchesSelector,
  filterDOMNodes: filterDOMNodes
};

},{"../utilities/array":133}],135:[function(require,module,exports){
'use strict';

function combine(targetObject) {
  var sourceObject = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var sourceKeys = Object.keys(sourceObject);

  sourceKeys.forEach(function (sourceKey) {
    var targetProperty = targetObject[sourceKey],
        sourceProperty = sourceObject[sourceKey];

    targetObject[sourceKey] = targetObject.hasOwnProperty(sourceKey) ? targetProperty + ' ' + sourceProperty : sourceProperty;
  });
}

function prune(targetObject, sourceKeys) {
  sourceKeys.forEach(function (sourceKey) {
    if (targetObject.hasOwnProperty(sourceKey)) {
      delete targetObject[sourceKey];
    }
  });
}

module.exports = {
  combine: combine,
  prune: prune
};

},{}],136:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var keyMixins = require('./mixins/key'),
    eventMixins = require('./mixins/event'),
    clickMixins = require('./mixins/click'),
    mouseMixins = require('./mixins/mouse');

var Window = function () {
  function Window() {
    _classCallCheck(this, Window);

    this.domElement = window; ///
  }

  _createClass(Window, [{
    key: 'assign',
    value: function assign() {
      var target = this.domElement; ///

      for (var _len = arguments.length, sources = Array(_len), _key = 0; _key < _len; _key++) {
        sources[_key] = arguments[_key];
      }

      Object.assign.apply(Object, [target].concat(sources));
    }
  }, {
    key: 'getWidth',
    value: function getWidth() {
      return this.domElement.innerWidth;
    } ///

  }, {
    key: 'getHeight',
    value: function getHeight() {
      return this.domElement.innerHeight;
    } ///

  }, {
    key: 'getScrollTop',
    value: function getScrollTop() {
      return this.domElement.pageYOffset;
    } ///

  }, {
    key: 'getScrollLeft',
    value: function getScrollLeft() {
      return this.domElement.pageXOffset;
    } ///

  }, {
    key: 'onResize',
    value: function onResize(handler, object) {
      var intermediateHandler = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultIntermediateResizeHandler;

      var eventTypes = 'resize';

      this.on(eventTypes, handler, object, intermediateHandler);
    }
  }, {
    key: 'offResize',
    value: function offResize(handler, object) {
      var eventTypes = 'resize';

      this.off(eventTypes, handler, object);
    }
  }]);

  return Window;
}();

Object.assign(Window.prototype, keyMixins);
Object.assign(Window.prototype, eventMixins);
Object.assign(Window.prototype, clickMixins);
Object.assign(Window.prototype, mouseMixins);

module.exports = new Window(); ///

function defaultIntermediateResizeHandler(handler, event, targetElement) {
  var window = targetElement,
      ///
  width = window.getWidth(),
      height = window.getHeight();

  handler(width, height, event, targetElement);
}

},{"./mixins/click":124,"./mixins/event":125,"./mixins/key":127,"./mixins/mouse":128}],137:[function(require,module,exports){
'use strict';

module.exports = {
  window: require('./lib/window'),
  document: require('./lib/document'),
  Div: require('./lib/element/div'),
  Span: require('./lib/element/span'),
  Body: require('./lib/element/body'),
  Link: require('./lib/element/link'),
  Select: require('./lib/element/select'),
  Button: require('./lib/element/button'),
  Checkbox: require('./lib/element/checkbox'),
  Element: require('./lib/element'),
  TextElement: require('./lib/textElement'),
  Input: require('./lib/inputElement/input'),
  Textarea: require('./lib/inputElement/textarea'),
  InputElement: require('./lib/inputElement'),
  Bounds: require('./lib/misc/bounds'),
  Offset: require('./lib/misc/offset'),
  React: require('./lib/react')
};

},{"./lib/document":138,"./lib/element":139,"./lib/element/body":140,"./lib/element/button":141,"./lib/element/checkbox":142,"./lib/element/div":143,"./lib/element/link":144,"./lib/element/select":145,"./lib/element/span":146,"./lib/inputElement":147,"./lib/inputElement/input":148,"./lib/inputElement/textarea":149,"./lib/misc/bounds":150,"./lib/misc/offset":151,"./lib/react":159,"./lib/textElement":160,"./lib/window":163}],138:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var eventMixin = require('./mixin/event'),
    clickMixin = require('./mixin/click'),
    mouseMixin = require('./mixin/mouse'),
    keyMixin = require('./mixin/key');

var Document = function Document() {
  _classCallCheck(this, Document);

  this.domElement = document; ///
};

Object.assign(Document.prototype, eventMixin);
Object.assign(Document.prototype, clickMixin);
Object.assign(Document.prototype, mouseMixin);
Object.assign(Document.prototype, keyMixin);

module.exports = new Document(); ///

},{"./mixin/click":152,"./mixin/event":153,"./mixin/key":155,"./mixin/mouse":156}],139:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var necessary = require('necessary');

var Offset = require('./misc/offset'),
    Bounds = require('./misc/bounds'),
    jsxMixin = require('./mixin/jsx'),
    eventMixin = require('./mixin/event'),
    clickMixin = require('./mixin/click'),
    scrollMixin = require('./mixin/scroll'),
    resizeMixin = require('./mixin/resize'),
    mouseMixin = require('./mixin/mouse'),
    keyMixin = require('./mixin/key'),
    domUtilities = require('./utilities/dom'),
    objectUtilities = require('./utilities/object');

var arrayUtilities = necessary.arrayUtilities,
    combine = objectUtilities.combine,
    first = arrayUtilities.first,
    augment = arrayUtilities.augment,
    domNodeMatchesSelector = domUtilities.domNodeMatchesSelector,
    domElementFromSelector = domUtilities.domElementFromSelector,
    elementsFromDOMElements = domUtilities.elementsFromDOMElements,
    filterDOMNodesBySelector = domUtilities.filterDOMNodesBySelector,
    descendantDOMNodesFromDOMNode = domUtilities.descendantDOMNodesFromDOMNode;

var Element = function () {
  function Element(selector) {
    _classCallCheck(this, Element);

    this.domElement = domElementFromSelector(selector);

    this.domElement.__element__ = this; ///
  }

  _createClass(Element, [{
    key: 'clone',
    value: function clone() {
      return Element.clone(this);
    }
  }, {
    key: 'getDOMElement',
    value: function getDOMElement() {
      return this.domElement;
    }
  }, {
    key: 'getOffset',
    value: function getOffset() {
      var top = this.domElement.offsetTop,
          ///
      left = this.domElement.offsetLeft,
          ///
      offset = new Offset(top, left);

      return offset;
    }
  }, {
    key: 'getBounds',
    value: function getBounds() {
      var boundingClientRect = this.domElement.getBoundingClientRect(),
          bounds = Bounds.fromBoundingClientRect(boundingClientRect);

      return bounds;
    }
  }, {
    key: 'getWidth',
    value: function getWidth() {
      var includeBorder = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      var width = includeBorder ? this.domElement.offsetWidth : this.domElement.clientWidth;

      return width;
    }
  }, {
    key: 'setWidth',
    value: function setWidth(width) {
      this.style('width', width);
    }
  }, {
    key: 'getHeight',
    value: function getHeight() {
      var includeBorder = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      var height = includeBorder ? this.domElement.offsetHeight : this.domElement.clientHeight;

      return height;
    }
  }, {
    key: 'setHeight',
    value: function setHeight(height) {
      this.style('height', height);
    }
  }, {
    key: 'hasAttribute',
    value: function hasAttribute(name) {
      return this.domElement.hasAttribute(name);
    }
  }, {
    key: 'getAttribute',
    value: function getAttribute(name) {
      return this.domElement.getAttribute(name);
    }
  }, {
    key: 'setAttribute',
    value: function setAttribute(name, value) {
      this.domElement.setAttribute(name, value);
    }
  }, {
    key: 'clearAttribute',
    value: function clearAttribute(name) {
      this.domElement.removeAttribute(name);
    }
  }, {
    key: 'addAttribute',
    value: function addAttribute(name, value) {
      this.setAttribute(name, value);
    }
  }, {
    key: 'removeAttribute',
    value: function removeAttribute(name) {
      this.clearAttribute(name);
    }
  }, {
    key: 'setClass',
    value: function setClass(className) {
      this.domElement.className = className;
    }
  }, {
    key: 'addClass',
    value: function addClass(className) {
      this.domElement.classList.add(className);
    }
  }, {
    key: 'removeClass',
    value: function removeClass(className) {
      this.domElement.classList.remove(className);
    }
  }, {
    key: 'toggleClass',
    value: function toggleClass(className) {
      this.domElement.classList.toggle(className);
    }
  }, {
    key: 'hasClass',
    value: function hasClass(className) {
      return this.domElement.classList.contains(className);
    }
  }, {
    key: 'clearClasses',
    value: function clearClasses() {
      this.domElement.className = '';
    }
  }, {
    key: 'prependTo',
    value: function prependTo(parentElement) {
      parentElement.prepend(this);
    }
  }, {
    key: 'appendTo',
    value: function appendTo(parentElement) {
      parentElement.append(this);
    }
  }, {
    key: 'addTo',
    value: function addTo(parentElement) {
      parentElement.add(this);
    }
  }, {
    key: 'removeFrom',
    value: function removeFrom(parentElement) {
      parentElement.remove(this);
    }
  }, {
    key: 'insertBefore',
    value: function insertBefore(siblingElement) {
      var parentDOMNode = siblingElement.domElement.parentNode,
          siblingDOMElement = siblingElement.domElement;

      parentDOMNode.insertBefore(this.domElement, siblingDOMElement);
    }
  }, {
    key: 'insertAfter',
    value: function insertAfter(siblingElement) {
      var parentDOMNode = siblingElement.domElement.parentNode,
          siblingDOMElement = siblingElement.domElement;

      parentDOMNode.insertBefore(this.domElement, siblingDOMElement.nextSibling); ///
    }
  }, {
    key: 'prepend',
    value: function prepend(element) {
      var domElement = element.domElement,
          firstChildDOMElement = this.domElement.firstChild;

      this.domElement.insertBefore(domElement, firstChildDOMElement);
    }
  }, {
    key: 'append',
    value: function append(element) {
      var domElement = element.domElement;

      this.domElement.insertBefore(domElement, null); ///
    }
  }, {
    key: 'add',
    value: function add(element) {
      this.append(element);
    }
  }, {
    key: 'remove',
    value: function remove(element) {
      if (element) {
        var domElement = element.domElement;

        this.domElement.removeChild(domElement);
      } else {
        this.domElement.remove();
      }
    }
  }, {
    key: 'show',
    value: function show() {
      var displayStyle = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'block';
      this.display(displayStyle);
    }
  }, {
    key: 'hide',
    value: function hide() {
      this.style('display', 'none');
    }
  }, {
    key: 'display',
    value: function display(_display) {
      this.style('display', _display);
    }
  }, {
    key: 'enable',
    value: function enable() {
      this.clearAttribute('disabled');
    }
  }, {
    key: 'disable',
    value: function disable() {
      this.setAttribute('disabled', 'disabled');
    }
  }, {
    key: 'isEnabled',
    value: function isEnabled() {
      var disabled = this.isDisabled(),
          enabled = !disabled;

      return enabled;
    }
  }, {
    key: 'isDisabled',
    value: function isDisabled() {
      var disabled = this.hasAttribute('disabled');

      return disabled;
    }
  }, {
    key: 'isDisplayed',
    value: function isDisplayed() {
      var display = this.style('display'),
          displayed = display !== 'none';

      return displayed;
    }
  }, {
    key: 'style',
    value: function style(name, value) {
      if (value !== undefined) {
        this.domElement.style[name] = value;
      } else {
        var style = this.domElement.style[name];

        return style;
      }
    }
  }, {
    key: 'html',
    value: function html(_html) {
      if (_html === undefined) {
        var innerHTML = this.domElement.innerHTML;

        _html = innerHTML; ///

        return _html;
      } else {
        var _innerHTML = _html; ///

        this.domElement.innerHTML = _innerHTML;
      }
    }
  }, {
    key: 'css',
    value: function css(_css) {
      if (_css === undefined) {
        var computedStyle = getComputedStyle(this.domElement),
            css = {};

        for (var index = 0; index < computedStyle.length; index++) {
          var name = computedStyle[0],
              ///
          value = computedStyle.getPropertyValue(name); ///

          css[name] = value;
        }

        return css;
      } else if (typeof _css === 'string') {
        var _name = _css; ///

        var _computedStyle = getComputedStyle(this.domElement),
            _value = _computedStyle.getPropertyValue(_name); ///

        _css = _value; ///

        return _css;
      } else {
        var names = Object.keys(_css); ///

        names.forEach(function (name) {
          var value = _css[name];

          this.style(name, value);
        }.bind(this));
      }
    }
  }, {
    key: 'blur',
    value: function blur() {
      this.domElement.blur();
    }
  }, {
    key: 'focus',
    value: function focus() {
      this.domElement.focus();
    }
  }, {
    key: 'hasFocus',
    value: function hasFocus() {
      var focus = document.activeElement === this.domElement; ///

      return focus;
    }
  }, {
    key: 'getDescendantElements',
    value: function getDescendantElements() {
      var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '*';

      var domNode = this.domElement,
          ///
      descendantDOMNodes = descendantDOMNodesFromDOMNode(domNode),
          descendantDOMElements = filterDOMNodesBySelector(descendantDOMNodes, selector),
          descendantElements = elementsFromDOMElements(descendantDOMElements);

      return descendantElements;
    }
  }, {
    key: 'getChildElements',
    value: function getChildElements() {
      var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '*';

      var childDOMNodes = this.domElement.childNodes,
          childDOMElements = filterDOMNodesBySelector(childDOMNodes, selector),
          childElements = elementsFromDOMElements(childDOMElements);

      return childElements;
    }
  }, {
    key: 'getParentElement',
    value: function getParentElement() {
      var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '*';

      var parentElement = null;

      var parentDOMElement = this.domElement.parentElement;

      if (parentDOMElement !== null) {
        if (parentDOMElement.matches(selector)) {
          var parentDOMElements = [parentDOMElement],
              parentElements = elementsFromDOMElements(parentDOMElements),
              firstParentElement = first(parentElements);

          parentElement = firstParentElement || null;
        }
      }

      return parentElement;
    }
  }, {
    key: 'getAscendantElements',
    value: function getAscendantElements() {
      var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '*';

      var ascendantDOMElements = [],
          parentDOMElement = this.domElement.parentElement;

      var ascendantDOMElement = parentDOMElement; ///
      while (ascendantDOMElement !== null) {
        if (ascendantDOMElement.matches(selector)) {
          ascendantDOMElements.push(ascendantDOMElement);
        }

        ascendantDOMElement = ascendantDOMElement.parentElement;
      }

      var ascendantElements = elementsFromDOMElements(ascendantDOMElements);

      return ascendantElements;
    }
  }, {
    key: 'getPreviousSiblingElement',
    value: function getPreviousSiblingElement() {
      var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '*';

      var previousSiblingElement = null;

      var previousSiblingDOMNode = this.domElement.previousSibling; ///

      if (previousSiblingDOMNode !== null && domNodeMatchesSelector(previousSiblingDOMNode, selector)) {
        previousSiblingElement = previousSiblingDOMNode.__element__ || null;
      }

      return previousSiblingElement;
    }
  }, {
    key: 'getNextSiblingElement',
    value: function getNextSiblingElement() {
      var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '*';

      var nextSiblingElement = null;

      var nextSiblingDOMNode = this.domElement.nextSibling;

      if (nextSiblingDOMNode !== null && domNodeMatchesSelector(nextSiblingDOMNode, selector)) {
        nextSiblingElement = nextSiblingDOMNode.__element__ || null;
      }

      return nextSiblingElement;
    }
  }], [{
    key: 'clone',
    value: function clone(Class, element) {
      var deep = true,
          domElement = element.domElement.cloneNode(deep);

      for (var _len = arguments.length, remainingArguments = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        remainingArguments[_key - 2] = arguments[_key];
      }

      remainingArguments.unshift(domElement);
      remainingArguments.unshift(null);

      return new (Function.prototype.bind.apply(Class, remainingArguments))();
    }
  }, {
    key: 'fromHTML',
    value: function fromHTML(Class, html) {
      var outerDOMElement = document.createElement('div');

      outerDOMElement.innerHTML = html; ///

      var domElement = outerDOMElement.firstChild;

      for (var _len2 = arguments.length, remainingArguments = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        remainingArguments[_key2 - 2] = arguments[_key2];
      }

      remainingArguments.unshift(domElement);
      remainingArguments.unshift(null);

      return new (Function.prototype.bind.apply(Class, remainingArguments))();
    }
  }, {
    key: 'fromDOMElement',
    value: function fromDOMElement(Class, domElement) {
      for (var _len3 = arguments.length, remainingArguments = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
        remainingArguments[_key3 - 2] = arguments[_key3];
      }

      remainingArguments.unshift(domElement);
      remainingArguments.unshift(null);

      return new (Function.prototype.bind.apply(Class, remainingArguments))();
    }
  }, {
    key: 'fromProperties',
    value: function fromProperties(Class, properties) {
      for (var _len4 = arguments.length, remainingArguments = Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
        remainingArguments[_key4 - 2] = arguments[_key4];
      }

      var tagName = Class.tagName,
          html = '<' + tagName + ' />',
          element = Element.fromHTML.apply(Element, [Class, html].concat(remainingArguments)),
          defaultProperties = defaultPropertiesFromClass(Class),
          ignoredProperties = ignoredPropertiesFromClass(Class);

      element.applyProperties(properties, defaultProperties, ignoredProperties);

      return element;
    }
  }, {
    key: 'fromString',
    value: function fromString(string, properties) {
      for (var _len5 = arguments.length, remainingArguments = Array(_len5 > 2 ? _len5 - 2 : 0), _key5 = 2; _key5 < _len5; _key5++) {
        remainingArguments[_key5 - 2] = arguments[_key5];
      }

      var tagName = string,
          ///
      html = '<' + tagName + ' />',
          element = Element.fromHTML.apply(Element, [Element, html].concat(remainingArguments)),
          defaultProperties = {},
          ///
      ignoredProperties = []; ///

      element.applyProperties(properties, defaultProperties, ignoredProperties);

      return element;
    }
  }]);

  return Element;
}();

Object.assign(Element.prototype, jsxMixin);
Object.assign(Element.prototype, eventMixin);
Object.assign(Element.prototype, clickMixin);
Object.assign(Element.prototype, scrollMixin);
Object.assign(Element.prototype, resizeMixin);
Object.assign(Element.prototype, mouseMixin);
Object.assign(Element.prototype, keyMixin);

Object.assign(Element, {
  LEFT_MOUSE_BUTTON: 0,
  RIGHT_MOUSE_BUTTON: 2,
  MIDDLE_MOUSE_BUTTON: 1
});

module.exports = Element;

function defaultPropertiesFromClass(Class) {
  var defaultProperties = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  combine(defaultProperties, Class.defaultProperties);

  var superClass = Object.getPrototypeOf(Class);

  if (superClass !== null) {
    defaultPropertiesFromClass(superClass, defaultProperties);
  }

  return defaultProperties;
}

function ignoredPropertiesFromClass(Class) {
  var ignoredProperties = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  augment(ignoredProperties, Class.ignoredProperties || [], function (ignoredProperty) {
    return !ignoredProperties.includes(ignoredProperty);
  });

  var superClass = Object.getPrototypeOf(Class);

  if (superClass !== null) {
    ignoredPropertiesFromClass(superClass, ignoredProperties);
  }

  return ignoredProperties;
}

},{"./misc/bounds":150,"./misc/offset":151,"./mixin/click":152,"./mixin/event":153,"./mixin/jsx":154,"./mixin/key":155,"./mixin/mouse":156,"./mixin/resize":157,"./mixin/scroll":158,"./utilities/dom":161,"./utilities/object":162,"necessary":166}],140:[function(require,module,exports){
arguments[4][112][0].apply(exports,arguments)
},{"../element":139,"dup":112}],141:[function(require,module,exports){
arguments[4][113][0].apply(exports,arguments)
},{"../element":139,"dup":113}],142:[function(require,module,exports){
arguments[4][114][0].apply(exports,arguments)
},{"../element":139,"dup":114}],143:[function(require,module,exports){
arguments[4][115][0].apply(exports,arguments)
},{"../element":139,"dup":115}],144:[function(require,module,exports){
arguments[4][116][0].apply(exports,arguments)
},{"../element":139,"dup":116}],145:[function(require,module,exports){
arguments[4][117][0].apply(exports,arguments)
},{"../element":139,"dup":117}],146:[function(require,module,exports){
arguments[4][118][0].apply(exports,arguments)
},{"../element":139,"dup":118}],147:[function(require,module,exports){
arguments[4][119][0].apply(exports,arguments)
},{"./element":139,"dup":119}],148:[function(require,module,exports){
arguments[4][120][0].apply(exports,arguments)
},{"../inputElement":147,"dup":120}],149:[function(require,module,exports){
arguments[4][121][0].apply(exports,arguments)
},{"../inputElement":147,"dup":121}],150:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Bounds = function () {
  function Bounds(top, left, bottom, right) {
    _classCallCheck(this, Bounds);

    this.top = top;
    this.left = left;
    this.bottom = bottom;
    this.right = right;
  }

  _createClass(Bounds, [{
    key: 'getTop',
    value: function getTop() {
      return this.top;
    }
  }, {
    key: 'getLeft',
    value: function getLeft() {
      return this.left;
    }
  }, {
    key: 'getBottom',
    value: function getBottom() {
      return this.bottom;
    }
  }, {
    key: 'getRight',
    value: function getRight() {
      return this.right;
    }
  }, {
    key: 'isOverlappingMouse',
    value: function isOverlappingMouse(mouseTop, mouseLeft) {
      return this.top < mouseTop && this.left < mouseLeft && this.bottom > mouseTop && this.right > mouseLeft;
    }
  }, {
    key: 'areOverlapping',
    value: function areOverlapping(bounds) {
      return this.top < bounds.bottom && this.left < bounds.right && this.bottom > bounds.top && this.right > bounds.left;
    }
  }], [{
    key: 'fromBoundingClientRect',
    value: function fromBoundingClientRect(boundingClientRect) {
      var windowScrollTop = window.pageYOffset,
          ///
      windowScrollLeft = window.pageXOffset,
          ///
      top = boundingClientRect.top + windowScrollTop,
          left = boundingClientRect.left + windowScrollLeft,
          bottom = boundingClientRect.bottom + windowScrollTop,
          right = boundingClientRect.right + windowScrollLeft,
          bounds = new Bounds(top, left, bottom, right);

      return bounds;
    }
  }]);

  return Bounds;
}();

module.exports = Bounds;

},{}],151:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Offset = function () {
  function Offset(top, left) {
    _classCallCheck(this, Offset);

    this.top = top;
    this.left = left;
  }

  _createClass(Offset, [{
    key: 'getTop',
    value: function getTop() {
      return this.top;
    }
  }, {
    key: 'getLeft',
    value: function getLeft() {
      return this.left;
    }
  }]);

  return Offset;
}();

module.exports = Offset;

},{}],152:[function(require,module,exports){
'use strict';

function onClick(handler, object) {
  var intermediateHandler = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultIntermediateHandler;

  this.on('click', handler, object, intermediateHandler);
}

function offClick(handler, object) {
  this.off('click', handler, object);
}

var clickMixin = {
  onClick: onClick,
  offClick: offClick
};

module.exports = clickMixin;

function defaultIntermediateHandler(handler, event, targetElement) {
  var mouseTop = event.pageY,
      ///
  mouseLeft = event.pageX,
      ///
  mouseButton = event.button; ///

  handler(mouseTop, mouseLeft, mouseButton, event, targetElement);
}

},{}],153:[function(require,module,exports){
'use strict';

function on(eventTypes, handler) {
  var object = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var intermediateHandler = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

  eventTypes = eventTypes.split(' '); ///

  eventTypes.forEach(function (eventType) {
    var eventListener = this.addEventListener(eventType, handler, object, intermediateHandler);

    this.domElement.addEventListener(eventType, eventListener);
  }.bind(this));
}

function off(eventTypes, handler) {
  var object = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  eventTypes = eventTypes.split(' '); ///

  eventTypes.forEach(function (eventType) {
    var eventListener = this.removeEventListener(eventType, handler, object);

    this.domElement.removeEventListener(eventType, eventListener);
  }.bind(this));
}

var eventMixin = {
  on: on,
  off: off,
  addEventListener: addEventListener,
  removeEventListener: removeEventListener
};

module.exports = eventMixin;

function addEventListener(eventType, handler, object, intermediateHandler) {
  if (!this.hasOwnProperty('eventListeners')) {
    this.eventListeners = [];
  }

  var targetElement = this,
      ///
  eventListeners = this.eventListeners,
      eventListener = createEventListener(targetElement, eventType, handler, object, intermediateHandler);

  eventListeners.push(eventListener);

  return eventListener;
}

function removeEventListener(eventType, handler, object) {
  var eventListeners = this.eventListeners,
      eventListener = findEventListener(eventListeners, eventType, handler, object),
      index = eventListeners.indexOf(eventListener),
      start = index,
      ///
  deleteCount = 1;

  eventListeners.splice(start, deleteCount);

  if (eventListeners.length === 0) {
    delete this.eventListeners;
  }

  return eventListener;
}

function createEventListener(targetElement, eventType, handler, object, intermediateHandler) {
  var eventListener = void 0;

  if (intermediateHandler === null) {
    eventListener = function eventListener(event) {
      handler.call(object, event, targetElement);
    };
  } else {
    eventListener = function eventListener(event) {
      intermediateHandler(function (event) {
        handler.call.apply(handler, [object].concat(Array.prototype.slice.call(arguments)));
      }, event, targetElement);
    };
  }

  Object.assign(eventListener, {
    eventType: eventType,
    handler: handler,
    object: object
  });

  return eventListener;
}

function findEventListener(eventListeners, eventType, handler, object) {
  var eventListener = eventListeners.find(function (eventListener) {
    var found = eventListener.object === object && eventListener.handler === handler && eventListener.eventType === eventType; ///

    return found;
  });

  return eventListener;
}

},{}],154:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var necessary = require('necessary');

var TextElement = require('../textElement'),
    objectUtilities = require('../utilities/object');

var arrayUtilities = necessary.arrayUtilities,
    first = arrayUtilities.first,
    combine = objectUtilities.combine,
    prune = objectUtilities.prune;


function applyProperties() {
  var properties = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var defaultProperties = arguments[1];
  var ignoredProperties = arguments[2];

  combine(properties, defaultProperties);

  var element = this,
      ///
  childElements = childElementsFromElementAndProperties(element, properties);

  prune(properties, ignoredProperties);

  var names = Object.keys(properties); ///

  names.forEach(function (name) {
    var value = properties[name];

    if (false) {} else if (isHandlerName(name)) {
      addHandler(this, name, value);
    } else if (isAttributeName(name)) {
      addAttribute(this, name, value);
    } else {
      if (!this.hasOwnProperty('properties')) {
        var _properties = {};

        Object.assign(this, {
          properties: _properties
        });
      }

      this.properties[name] = value;
    }
  }.bind(this));

  var parentElement = this; ///

  childElements.forEach(function (childElement) {
    childElement.addTo(parentElement);

    updateParentContext(childElement, parentElement);
  }.bind(this));
}

function getProperties() {
  return this.properties;
}

function getContext() {
  return this.context;
}

function getState() {
  return this.state;
}

function setState(state) {
  this.state = state;
}

function fromState(name) {
  var value = this.state[name];

  return value;
}

function updateState(update) {
  Object.assign(this.state, update);
}

function assignContext(names, thenDelete) {
  var argumentsLength = arguments.length;

  if (argumentsLength === 1) {
    var firstArgument = first(arguments);

    if (typeof firstArgument === 'boolean') {
      names = Object.keys(this.context);

      thenDelete = firstArgument;
    } else {
      thenDelete = true;
    }
  }

  if (argumentsLength === 0) {
    names = Object.keys(this.context);

    thenDelete = true;
  }

  names.forEach(function (name) {
    var value = this.context[name],
        propertyName = name,
        ///
    descriptor = {
      value: value
    };

    Object.defineProperty(this, propertyName, descriptor);

    if (thenDelete) {
      delete this.context[name];
    }
  }.bind(this), []);
}

var jsxMixin = {
  applyProperties: applyProperties,
  getProperties: getProperties,
  getContext: getContext,
  getState: getState,
  setState: setState,
  fromState: fromState,
  updateState: updateState,
  assignContext: assignContext
};

module.exports = jsxMixin;

function updateParentContext(childElement, parentElement) {
  var parentContext = typeof childElement.parentContext === 'function' ? childElement.parentContext() : childElement.context;

  parentElement.context = Object.assign({}, parentElement.context, parentContext);

  delete childElement.context;
}

function childElementsFromElementAndProperties(element, properties) {
  var childElements = typeof element.childElements === 'function' ? element.childElements(properties) : properties.childElements;

  childElements = childElements !== undefined ? childElements instanceof Array ? childElements : [childElements] : [];

  childElements = childElements.map(function (childElement) {
    if (typeof childElement === 'string') {
      var text = childElement,
          ///
      textElement = new TextElement(text);

      childElement = textElement; ///
    }

    return childElement;
  });

  return childElements;
}

function addHandler(element, name, value) {
  var eventType = name.substr(2).toLowerCase(),
      ///
  handler = value; ///

  element.on(eventType, handler);
}

function addAttribute(element, name, value) {
  if (name === 'className') {
    name = 'class';
  }

  if (name === 'htmlFor') {
    name = 'for';
  }

  if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
    var keys = Object.keys(value);

    keys.forEach(function (key) {
      element.domElement[name][key] = value[key];
    }.bind(this));
  } else if (typeof value === 'boolean') {
    if (value) {
      value = name; ///

      element.addAttribute(name, value);
    }
  } else {
    element.addAttribute(name, value);
  }
}

function isHandlerName(name) {
  return name.match(/^on/);
}

function isAttributeName(name) {
  return attributeNames.includes(name);
}

var attributeNames = ['accept', 'acceptCharset', 'accessKey', 'action', 'allowFullScreen', 'allowTransparency', 'alt', 'async', 'autoComplete', 'autoFocus', 'autoPlay', 'capture', 'cellPadding', 'cellSpacing', 'challenge', 'charSet', 'checked', 'cite', 'classID', 'className', 'colSpan', 'cols', 'content', 'contentEditable', 'contextMenu', 'controls', 'coords', 'crossOrigin', 'data', 'dateTime', 'default', 'defer', 'dir', 'disabled', 'download', 'draggable', 'encType', 'form', 'formAction', 'formEncType', 'formMethod', 'formNoValidate', 'formTarget', 'frameBorder', 'headers', 'height', 'hidden', 'high', 'href', 'hrefLang', 'htmlFor', 'httpEquiv', 'icon', 'id', 'inputMode', 'integrity', 'is', 'keyParams', 'keyType', 'kind', 'label', 'lang', 'list', 'loop', 'low', 'manifest', 'marginHeight', 'marginWidth', 'max', 'maxLength', 'media', 'mediaGroup', 'method', 'min', 'minLength', 'multiple', 'muted', 'name', 'noValidate', 'nonce', 'open', 'optimum', 'pattern', 'placeholder', 'poster', 'preload', 'profile', 'radioGroup', 'readOnly', 'rel', 'required', 'reversed', 'role', 'rowSpan', 'rows', 'sandbox', 'scope', 'scoped', 'scrolling', 'seamless', 'selected', 'shape', 'size', 'sizes', 'span', 'spellCheck', 'src', 'srcDoc', 'srcLang', 'srcSet', 'start', 'step', 'style', 'summary', 'tabIndex', 'target', 'title', 'type', 'useMap', 'value', 'width', 'wmode', 'wrap'];

},{"../textElement":160,"../utilities/object":162,"necessary":166}],155:[function(require,module,exports){
'use strict';

function onKeyUp(handler, object) {
  var intermediateHandler = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultIntermediateHandler;

  this.on('keyup', handler, object, intermediateHandler);
}

function onKeyDown(handler, object) {
  var intermediateHandler = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultIntermediateHandler;

  this.on('keydown', handler, object, intermediateHandler);
}

function offKeyUp(handler, object) {
  this.off('keyup', handler, object);
}

function offKeyDown(handler, object) {
  this.off('keydown', handler, object);
}

var keyMixin = {
  onKeyUp: onKeyUp,
  onKeyDown: onKeyDown,
  offKeyUp: offKeyUp,
  offKeyDown: offKeyDown
};

module.exports = keyMixin;

function defaultIntermediateHandler(handler, event, targetElement) {
  var keyCode = event.keyCode;

  handler(keyCode, event, targetElement);
}

},{}],156:[function(require,module,exports){
'use strict';

function onMouseUp(handler, object) {
  var intermediateHandler = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultIntermediateHandler;

  this.on('mouseup', handler, object, intermediateHandler);
}

function onMouseDown(handler, object) {
  var intermediateHandler = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultIntermediateHandler;

  this.on('mousedown', handler, object, intermediateHandler);
}

function onMouseOver(handler, object) {
  var intermediateHandler = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultIntermediateHandler;

  this.on('mouseover', handler, object, intermediateHandler);
}

function onMouseOut(handler, object) {
  var intermediateHandler = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultIntermediateHandler;

  this.on('mouseout', handler, object, intermediateHandler);
}

function onMouseMove(handler, object) {
  var intermediateHandler = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultIntermediateHandler;

  this.on('mousemove', handler, object, intermediateHandler);
}

function offMouseUp(handler, object) {
  this.off('mouseup', handler, object);
}

function offMouseDown(handler, object) {
  this.off('mousedown', handler, object);
}

function offMouseOver(handler, object) {
  this.off('mouseover', handler, object);
}

function offMouseOut(handler, object) {
  this.off('mouseout', handler, object);
}

function offMouseMove(handler, object) {
  this.off('mousemove', handler, object);
}

var mouseMixin = {
  onMouseUp: onMouseUp,
  onMouseDown: onMouseDown,
  onMouseOver: onMouseOver,
  onMouseOut: onMouseOut,
  onMouseMove: onMouseMove,
  offMouseUp: offMouseUp,
  offMouseDown: offMouseDown,
  offMouseOver: offMouseOver,
  offMouseOut: offMouseOut,
  offMouseMove: offMouseMove
};

module.exports = mouseMixin;

function defaultIntermediateHandler(handler, event, targetElement) {
  var mouseTop = event.pageY,
      ///
  mouseLeft = event.pageX,
      ///
  mouseButton = event.button; ///

  handler(mouseTop, mouseLeft, mouseButton, event, targetElement);
}

},{}],157:[function(require,module,exports){
'use strict';

function onResize(handler, object) {
  var intermediateHandler = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultIntermediateResizeHandler;

  var element = this,
      ///
  resizeEventListeners = findResizeEventListeners(element);

  if (resizeEventListeners.length === 0) {
    addResizeObject(element);
  }

  var eventType = 'resize';

  this.addEventListener(eventType, handler, object, intermediateHandler);
}

function offResize(handler, object) {
  var eventType = 'resize';

  this.removeEventListener(eventType, handler, object);

  var element = this,
      ///
  resizeEventListeners = findResizeEventListeners(element);

  if (resizeEventListeners.length === 0) {
    removeResizeObject(element);
  }
}

var resizeMixin = {
  onResize: onResize,
  offResize: offResize
};

module.exports = resizeMixin;

function addResizeObject(element) {
  var resizeObject = document.createElement('object'),
      domElement = element.getDOMElement(),
      style = 'display: block; \n                 position: absolute; \n                 top: 0; \n                 left: 0; \n                 height: 100%; \n                 width: 100%; \n                 overflow: hidden; \n                 pointer-events: none; \n                 z-index: -1;',
      data = 'about:blank',
      type = 'text/html';

  resizeObject.setAttribute('style', style);
  resizeObject.data = data;
  resizeObject.type = type;

  element.__resizeObject__ = resizeObject;

  resizeObject.onload = function () {
    resizeObjectLoadHandler(element);
  };

  domElement.appendChild(resizeObject);
}

function removeResizeObject(element) {
  var domElement = element.getDOMElement(),
      resizeObject = element.__resizeObject__,
      objectWindow = resizeObject.contentDocument.defaultView; ///

  objectWindow.removeEventListener('resize', resizeEventListener);

  domElement.removeChild(resizeObject);
}

function resizeObjectLoadHandler(element) {
  var resizeObject = element.__resizeObject__,
      resizeObjectWindow = resizeObject.contentDocument.defaultView; ///

  resizeObjectWindow.addEventListener('resize', function (event) {
    var resizeEventListeners = findResizeEventListeners(element);

    resizeEventListeners.forEach(function (resizeEventListener) {
      resizeEventListener(event);
    });
  });
}

function defaultIntermediateResizeHandler(handler, event, targetElement) {
  var window = targetElement,
      ///
  width = window.getWidth(),
      height = window.getHeight();

  handler(width, height, event, targetElement);
}

function findResizeEventListeners(element) {
  var resizeEventListeners = [];

  if (element.hasOwnProperty('eventListeners')) {
    var eventListeners = element.eventListeners; ///

    eventListeners.forEach(function (eventListener) {
      if (eventListener.eventType === 'resize') {
        var _resizeEventListener = eventListener;

        resizeEventListeners.push(_resizeEventListener);
      }
    });
  }

  return resizeEventListeners;
}

},{}],158:[function(require,module,exports){
'use strict';

function onScroll(handler, object) {
  var intermediateHandler = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultIntermediateHandler;

  this.on('scroll', handler, object, intermediateHandler);
}

function offScroll(handler, object) {
  this.off('scroll', handler, object);
}

function getScrollTop() {
  return this.domElement.scrollTop;
}

function getScrollLeft() {
  return this.domElement.scrollLeft;
}

function setScrollTop(scrollTop) {
  this.domElement.scrollTop = scrollTop;
}

function setScrollLeft(scrollLeft) {
  this.domElement.scrollLeft = scrollLeft;
}

var scrollMixin = {
  onScroll: onScroll,
  offScroll: offScroll,
  getScrollTop: getScrollTop,
  getScrollLeft: getScrollLeft,
  setScrollTop: setScrollTop,
  setScrollLeft: setScrollLeft
};

module.exports = scrollMixin;

function defaultIntermediateHandler(handler, event, targetElement) {
  var scrollTop = targetElement.getScrollTop(),
      scrollLeft = targetElement.getScrollLeft();

  handler(scrollTop, scrollLeft, event, targetElement);
}

},{}],159:[function(require,module,exports){
'use strict';

var Element = require('./element'),
    TextElement = require('./textElement');

function createElement(firstArgument, properties) {
  var element = null;

  if (firstArgument !== undefined) {
    for (var _len = arguments.length, childArguments = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      childArguments[_key - 2] = arguments[_key];
    }

    var childElements = childElementsFromChildArguments(childArguments);

    properties = Object.assign({
      childElements: childElements
    }, properties);

    if (false) {} else if (isSubclassOf(firstArgument, Element)) {
      var Class = firstArgument; ///

      element = Class.fromProperties(properties);
    } else if (typeof firstArgument === 'string') {
      var string = firstArgument; ///

      element = Element.fromString(string, properties);
    } else if (typeof firstArgument === 'function') {
      var elementFunction = firstArgument; ///

      element = elementFunction(properties);
    }
  }

  return element;
}

var React = {
  createElement: createElement
};

module.exports = React;

function childElementsFromChildArguments(childArguments) {
  childArguments = childArguments.reduce(function (childArguments, childArgument) {
    childArguments = childArguments.concat(childArgument);

    return childArguments;
  }, []);

  var childElements = childArguments.map(function (childArgument) {
    var childElement = void 0;

    if (typeof childArgument === 'string') {
      var text = childArgument,
          ///
      textElement = new TextElement(text);

      childElement = textElement;
    } else {
      childElement = childArgument; ///
    }

    return childElement;
  });

  return childElements;
}

function isSubclassOf(argument, Class) {
  var typeOf = false;

  if (argument.name === Class.name) {
    ///
    typeOf = true;
  } else {
    argument = Object.getPrototypeOf(argument); ///

    if (argument) {
      typeOf = isSubclassOf(argument, Class);
    }
  }

  return typeOf;
}

},{"./element":139,"./textElement":160}],160:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Offset = require('./misc/offset'),
    Bounds = require('./misc/bounds');

var TextElement = function () {
  function TextElement(text) {
    _classCallCheck(this, TextElement);

    this.domElement = document.createTextNode(text); ///

    this.domElement.__element__ = this;
  }

  _createClass(TextElement, [{
    key: 'clone',
    value: function clone() {
      return TextElement.clone(this);
    }
  }, {
    key: 'getText',
    value: function getText() {
      var nodeValue = this.domElement.nodeValue,
          text = nodeValue; ///

      return text;
    }
  }, {
    key: 'setText',
    value: function setText(text) {
      var nodeValue = text; ///

      this.domElement.nodeValue = nodeValue;
    }
  }, {
    key: 'getOffset',
    value: function getOffset() {
      var top = this.domElement.offsetTop,
          ///
      left = this.domElement.offsetLeft,
          ///
      offset = new Offset(top, left);

      return offset;
    }
  }, {
    key: 'getBounds',
    value: function getBounds() {
      var boundingClientRect = this.domElement.getBoundingClientRect(),
          bounds = Bounds.fromBoundingClientRect(boundingClientRect);

      return bounds;
    }
  }, {
    key: 'getWidth',
    value: function getWidth() {
      var width = this.domElement.clientWidth;

      return width;
    }
  }, {
    key: 'getHeight',
    value: function getHeight() {
      var height = this.domElement.clientHeight;

      return height;
    }
  }, {
    key: 'prependTo',
    value: function prependTo(parentElement) {
      parentElement.prepend(this);
    }
  }, {
    key: 'appendTo',
    value: function appendTo(parentElement) {
      parentElement.append(this);
    }
  }, {
    key: 'addTo',
    value: function addTo(parentElement) {
      parentElement.add(this);
    }
  }, {
    key: 'removeFrom',
    value: function removeFrom(parentElement) {
      parentElement.remove(this);
    }
  }, {
    key: 'insertBefore',
    value: function insertBefore(siblingElement) {
      var parentDOMNode = siblingElement.domElement.parentNode,
          siblingDOMElement = siblingElement.domElement;

      parentDOMNode.insertBefore(this.domElement, siblingDOMElement);
    }
  }, {
    key: 'insertAfter',
    value: function insertAfter(siblingElement) {
      var parentDOMNode = siblingElement.domElement.parentNode,
          siblingDOMElement = siblingElement.domElement;

      parentDOMNode.insertBefore(this.domElement, siblingDOMElement.nextSibling); ///
    }
  }, {
    key: 'remove',
    value: function remove() {
      this.domElement.remove();
    }
  }]);

  return TextElement;
}();

module.exports = TextElement;

},{"./misc/bounds":150,"./misc/offset":151}],161:[function(require,module,exports){
'use strict';

var necessary = require('necessary');

var arrayUtilities = necessary.arrayUtilities,
    splice = arrayUtilities.splice;


function domElementFromSelector(selector) {
  var domElement = typeof selector === 'string' ? document.querySelectorAll(selector)[0] : ///
  selector; ///

  return domElement;
}

function elementsFromDOMElements(domElements) {
  var domElementsWithElements = filterDOMNodes(domElements, function (domElement) {
    return domElement.__element__ !== undefined;
  }),
      elements = domElementsWithElements.map(function (domElement) {
    return domElement.__element__;
  });

  return elements;
}

function descendantDOMNodesFromDOMNode(domNode) {
  var descendantDOMNodes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  var start = -1,
      deleteCount = 0,
      childDOMNodes = domNode.childNodes; ///

  splice(descendantDOMNodes, start, deleteCount, childDOMNodes);

  childDOMNodes.forEach(function (childDOMNode) {
    descendantDOMNodesFromDOMNode(childDOMNode, descendantDOMNodes);
  });

  return descendantDOMNodes;
}

function filterDOMNodesBySelector(domNodes, selector) {
  var filteredDOMNodes = filterDOMNodes(domNodes, function (domNode) {
    return domNodeMatchesSelector(domNode, selector);
  });

  return filteredDOMNodes;
}

function domNodeMatchesSelector(domNode, selector) {
  var domNodeType = domNode.nodeType;

  switch (domNodeType) {
    case Node.ELEMENT_NODE:
      {
        var domElement = domNode; ///

        return domElement.matches(selector);
      }

    case Node.TEXT_NODE:
      {
        if (selector === '*') {
          return true;
        }
      }
  }

  return false;
}

function filterDOMNodes(domNodes, test) {
  var filteredDOMNodes = [],
      domNodesLength = domNodes.length;

  for (var index = 0; index < domNodesLength; index++) {
    var domNode = domNodes[index],
        result = test(domNode);

    if (result) {
      filteredDOMNodes.push(domNode);
    }
  }

  return filteredDOMNodes;
}

module.exports = {
  domElementFromSelector: domElementFromSelector,
  elementsFromDOMElements: elementsFromDOMElements,
  descendantDOMNodesFromDOMNode: descendantDOMNodesFromDOMNode,
  filterDOMNodesBySelector: filterDOMNodesBySelector,
  domNodeMatchesSelector: domNodeMatchesSelector,
  filterDOMNodes: filterDOMNodes
};

},{"necessary":166}],162:[function(require,module,exports){
'use strict';

function combine(targetObject) {
  var sourceObject = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var sourceKeys = Object.keys(sourceObject);

  sourceKeys.forEach(function (sourceKey) {
    var targetProperty = targetObject[sourceKey],
        sourceProperty = sourceObject[sourceKey];

    targetObject[sourceKey] = targetObject.hasOwnProperty(sourceKey) ? targetProperty + ' ' + sourceProperty : sourceProperty;
  });
}

function prune(targetObject, sourceKeys) {
  sourceKeys.forEach(function (sourceKey) {
    if (targetObject.hasOwnProperty(sourceKey)) {
      delete targetObject[sourceKey];
    }
  });
}

module.exports = {
  combine: combine,
  prune: prune
};

},{}],163:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var eventMixin = require('./mixin/event'),
    clickMixin = require('./mixin/click'),
    mouseMixin = require('./mixin/mouse'),
    keyMixin = require('./mixin/key');

var Window = function () {
  function Window() {
    _classCallCheck(this, Window);

    this.domElement = window; ///
  }

  _createClass(Window, [{
    key: 'assign',
    value: function assign() {
      var target = this.domElement; ///

      for (var _len = arguments.length, sources = Array(_len), _key = 0; _key < _len; _key++) {
        sources[_key] = arguments[_key];
      }

      Object.assign.apply(Object, [target].concat(sources));
    }
  }, {
    key: 'getWidth',
    value: function getWidth() {
      return this.domElement.innerWidth;
    } ///

  }, {
    key: 'getHeight',
    value: function getHeight() {
      return this.domElement.innerHeight;
    } ///

  }, {
    key: 'getScrollTop',
    value: function getScrollTop() {
      return this.domElement.pageYOffset;
    } ///

  }, {
    key: 'getScrollLeft',
    value: function getScrollLeft() {
      return this.domElement.pageXOffset;
    } ///

  }, {
    key: 'onResize',
    value: function onResize(handler, object) {
      var intermediateHandler = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultIntermediateResizeHandler;

      var eventTypes = 'resize';

      this.on(eventTypes, handler, object, intermediateHandler);
    }
  }, {
    key: 'offResize',
    value: function offResize(handler, object) {
      var eventTypes = 'resize';

      this.off(eventTypes, handler, object);
    }
  }]);

  return Window;
}();

Object.assign(Window.prototype, eventMixin);
Object.assign(Window.prototype, clickMixin);
Object.assign(Window.prototype, mouseMixin);
Object.assign(Window.prototype, keyMixin);

module.exports = new Window(); ///

function defaultIntermediateResizeHandler(handler, event, targetElement) {
  var window = targetElement,
      ///
  width = window.getWidth(),
      height = window.getHeight();

  handler(width, height, event, targetElement);
}

},{"./mixin/click":152,"./mixin/event":153,"./mixin/key":155,"./mixin/mouse":156}],164:[function(require,module,exports){
'use strict';

require('./lib/juxtapose');

},{"./lib/juxtapose":165}],165:[function(require,module,exports){
'use strict';

var easy = require('easy');

var React = easy.React;


Object.defineProperty(window, 'React', {
  get: function get() {
    return React;
  }
});

},{"easy":137}],166:[function(require,module,exports){
'use strict';

module.exports = {
  pathUtilities: require('./lib/utilities/path'),
  arrayUtilities: require('./lib/utilities/array'),
  templateUtilities: require('./lib/utilities/template'),
  fileSystemUtilities: require('./lib/utilities/fileSystem'),
  asynchronousUtilities: require('./lib/utilities/asynchronous'),
  miscellaneousUtilities: require('./lib/utilities/miscellaneous')
};

},{"./lib/utilities/array":167,"./lib/utilities/asynchronous":168,"./lib/utilities/fileSystem":169,"./lib/utilities/miscellaneous":170,"./lib/utilities/path":171,"./lib/utilities/template":172}],167:[function(require,module,exports){
'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function first(array) {
  return array[0];
}

function second(array) {
  return array[1];
}

function third(array) {
  return array[2];
}

function fourth(array) {
  return array[3];
}

function fifth(array) {
  return array[4];
}

function fifthLast(array) {
  return array[array.length - 5];
}

function fourthLast(array) {
  return array[array.length - 4];
}

function thirdLast(array) {
  return array[array.length - 3];
}

function secondLast(array) {
  return array[array.length - 2];
}

function last(array) {
  return array[array.length - 1];
}

function tail(array) {
  return array.slice(1);
}

function push(array1, array2) {
  Array.prototype.push.apply(array1, array2);
}

function unshift(array1, array2) {
  Array.prototype.unshift.apply(array1, array2);
}

function clear(array) {
  var start = 0;

  return array.splice(start);
}

function copy(array1, array2) {
  var start = 0,
      deleteCount = array2.length; ///

  splice(array1, start, deleteCount, array2);
}

function merge(array1, array2) {
  var start = array2.length,
      ///
  deleteCount = 0;

  splice(array1, start, deleteCount, array2);
}

function splice(array1, start, deleteCount) {
  var array2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

  var args = [start, deleteCount].concat(_toConsumableArray(array2)),
      deletedItemsArray = Array.prototype.splice.apply(array1, args);

  return deletedItemsArray;
}

function replace(array, element, test) {
  var start = -1;

  var found = array.some(function (element, index) {
    var passed = test(element, index);

    if (passed) {
      start = index; ///

      return true;
    }
  });

  if (found) {
    var deleteCount = 1;

    array.splice(start, deleteCount, element);
  }

  return found;
}

function filter(array, test) {
  var filteredElements = [];

  backwardsForEach(array, function (element, index) {
    var passed = test(element, index);

    if (!passed) {
      var start = index,
          ///
      deleteCount = 1,
          deletedElements = array.splice(start, deleteCount),
          firstDeletedElement = first(deletedElements);

      filteredElements.unshift(firstDeletedElement); ///
    }
  });

  return filteredElements;
}

function find(array, test) {
  var elements = [];

  forwardsForEach(array, function (element, index) {
    var passed = test(element, index);

    if (passed) {
      elements.push(element);
    }
  });

  return elements;
}

function prune(array, test) {
  var prunedElement = undefined;

  array.some(function (element, index) {
    var passed = test(element, index);

    if (passed) {
      var start = index,
          ///
      deleteCount = 1,
          deletedElements = array.splice(start, deleteCount),
          firstDeletedElement = first(deletedElements);

      prunedElement = firstDeletedElement; ///

      return true;
    }
  });

  return prunedElement;
}

function patch(array, element, test) {
  var found = array.some(function (element, index) {
    var passed = test(element, index);

    if (passed) {
      return true;
    }
  });

  if (found) {
    array.push(element);
  }

  return found;
}

function augment(array1, array2, test) {
  array2.forEach(function (element, index) {
    var passed = test(element, index);

    if (passed) {
      array1.push(element);
    }
  });
}

function separate(array, array1, array2, test) {
  array.forEach(function (element, index) {
    var passed = test(element, index);

    passed ? array1.push(element) : array2.push(element);
  });
}

function forwardsSome(array, callback) {
  var arrayLength = array.length;

  for (var index = 0; index < arrayLength; index++) {
    var element = array[index],
        result = callback(element, index);

    if (result) {
      return true;
    }
  }

  return false;
}

function backwardsSome(array, callback) {
  var arrayLength = array.length;

  for (var index = arrayLength - 1; index >= 0; index--) {
    var element = array[index],
        result = callback(element, index);

    if (result) {
      return true;
    }
  }

  return false;
}

function forwardsForEach(array, callback) {
  var arrayLength = array.length;

  for (var index = 0; index < arrayLength; index++) {
    var element = array[index];

    callback(element, index);
  }
}

function backwardsForEach(array, callback) {
  var arrayLength = array.length;

  for (var index = arrayLength - 1; index >= 0; index--) {
    var element = array[index];

    callback(element, index);
  }
}

module.exports = {
  first: first,
  second: second,
  third: third,
  fourth: fourth,
  fifth: fifth,
  fifthLast: fifthLast,
  fourthLast: fourthLast,
  thirdLast: thirdLast,
  secondLast: secondLast,
  last: last,
  tail: tail,
  push: push,
  unshift: unshift,
  clear: clear,
  copy: copy,
  merge: merge,
  splice: splice,
  replace: replace,
  filter: filter,
  find: find,
  prune: prune,
  patch: patch,
  augment: augment,
  separate: separate,
  forwardsSome: forwardsSome,
  backwardsSome: backwardsSome,
  forwardsForEach: forwardsForEach,
  backwardsForEach: backwardsForEach
};

},{}],168:[function(require,module,exports){
'use strict';

function whilst(callback, done, context) {
  var count = -1;

  function next() {
    count++;

    var index = count,
        ///
    terminate = callback(next, done, context, index);

    if (terminate) {
      done();
    }
  }

  next();
}

function forEach(array, callback, done, context) {
  var length = array.length; ///

  var count = -1;

  function next() {
    count++;

    var terminate = count === length;

    if (terminate) {
      done();
    } else {
      var index = count,
          ///
      element = array[index];

      callback(element, next, done, context, index);
    }
  }

  next();
}

function sequence(callbacks, done, context) {
  var length = callbacks.length; ///

  var count = -1;

  function next() {
    count++;

    var terminate = count === length;

    if (terminate) {
      done();
    } else {
      var index = count,
          ///
      callback = callbacks[index];

      callback(next, done, context, index);
    }
  }

  next();
}

function eventually(callbacks, done, context) {
  var length = callbacks.length; ///

  var count = 0;

  function next() {
    count++;

    var terminate = count === length;

    if (terminate) {
      done();
    }
  }

  callbacks.forEach(function (callback, index) {
    callback(next, done, context, index);
  });
}

function repeatedly(callback, length, done, context) {
  var count = 0;

  function next() {
    count++;

    var terminate = count === length;

    if (terminate) {
      done();
    }
  }

  for (var index = 0; index < length; index++) {
    callback(next, done, context, index);
  }
}

function forwardsForEach(array, callback, done, context) {
  var length = array.length; ///

  var count = -1;

  function next() {
    count++;

    var terminate = count === length;

    if (terminate) {
      done();
    } else {
      var index = count,
          ///
      element = array[index];

      callback(element, next, done, context, index);
    }
  }

  next();
}

function backwardsForEach(array, callback, done, context) {
  var length = array.length; ///

  var count = length;

  function next() {
    count--;

    var terminate = count === -1;

    if (terminate) {
      done();
    } else {
      var index = count,
          ///
      element = array[index];

      callback(element, next, done, context, index);
    }
  }

  next();
}

module.exports = {
  whilst: whilst,
  forEach: forEach,
  sequence: sequence,
  eventually: eventually,
  repeatedly: repeatedly,
  forwardsForEach: forwardsForEach,
  backwardsForEach: backwardsForEach
};

},{}],169:[function(require,module,exports){
'use strict';

var fs = require('fs');

function entryExists(absolutePath) {
  return fs.existsSync(absolutePath);
}

function fileExists(absoluteFilePath) {
  var fileExists = false;

  var absolutePath = absoluteFilePath,
      ///
  entryExists = entryExists(absolutePath);

  if (entryExists) {
    var entryFile = isEntryFile(absolutePath);

    if (entryFile) {
      fileExists = true;
    }
  }

  return fileExists;
}

function isEntryFile(absolutePath) {
  var stat = fs.statSync(absolutePath),
      entryDirectory = stat.isDirectory(),
      entryFile = !entryDirectory;

  return entryFile;
}

function directoryExists(absoluteDirectoryPath) {
  var directoryExists = false;

  var absolutePath = absoluteDirectoryPath,
      ///
  entryExists = entryExists(absolutePath);

  if (entryExists) {
    var entryDirectory = isEntryDirectory(absolutePath);

    if (entryDirectory) {
      directoryExists = true;
    }
  }

  return directoryExists;
}

function isEntryDirectory(absolutePath) {
  var stat = fs.statSync(absolutePath),
      entryDirectory = stat.isDirectory();

  return entryDirectory;
}

function isDirectoryEmpty(absoluteDirectoryPath) {
  var subEntryNames = readDirectory(absoluteDirectoryPath),
      subEntryNamesLength = subEntryNames.length,
      directoryEmpty = subEntryNamesLength === 0;

  return directoryEmpty;
}

function readDirectory(absoluteDirectoryPath) {
  var subEntryNames = fs.readdirSync(absoluteDirectoryPath);

  return subEntryNames;
}

function readFile(absoluteFilePath) {
  var encoding = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'utf8';

  var options = {
    encoding: encoding
  },
      content = fs.readFileSync(absoluteFilePath, options);

  return content;
}

function writeFile(absoluteFilePath, content) {
  fs.writeFileSync(absoluteFilePath, content);
}

module.exports = {
  entryExists: entryExists,
  fileExists: fileExists,
  isEntryFile: isEntryFile,
  directoryExists: directoryExists,
  isEntryDirectory: isEntryDirectory,
  isDirectoryEmpty: isDirectoryEmpty,
  readDirectory: readDirectory,
  readFile: readFile,
  writeFile: writeFile
};

},{"fs":101}],170:[function(require,module,exports){
(function (process){
'use strict';

var GET_METHOD = 'GET',
    POST_METHOD = 'POST',
    ETX_CHARACTER = '\x03';

function get(host, uri, parameters, callback) {
  if (callback === undefined) {
    callback = parameters; ///
    parameters = {};
  }

  var method = GET_METHOD,
      body = undefined;

  request(host, uri, parameters, method, body, callback);
}

function post(host, uri, json, parameters, callback) {
  if (callback === undefined) {
    callback = parameters; ///
    parameters = {};
  }

  var method = POST_METHOD,
      body = JSON.stringify(json);

  request(host, uri, parameters, method, body, callback);
}

function onETX(handler) {
  var _process = process,
      stdin = _process.stdin,
      setRawMode = stdin.setRawMode;


  if (setRawMode) {
    var rawMode = true,
        encoding = 'utf8';

    stdin.setRawMode(rawMode);
    stdin.setEncoding(encoding);

    stdin.resume();

    stdin.addListener('data', dataHandler);

    return offExt;
  }

  function offExt() {
    stdin.removeListener('data', dataHandler);
  }

  function dataHandler(character) {
    if (character === ETX_CHARACTER) {
      handler();
    }
  }
}

module.exports = {
  get: get,
  post: post,
  onETX: onETX
};

function request(host, uri, parameters, method, body, callback) {
  var url = urlFromHostURIAndParameters(host, uri, parameters),
      xmlHttpRequest = new XMLHttpRequest();

  xmlHttpRequest.onreadystatechange = function () {
    var readyState = xmlHttpRequest.readyState,
        status = xmlHttpRequest.status,
        responseText = xmlHttpRequest.responseText;


    if (readyState == 4) {
      if (status == 200) {
        var jsonString = responseText,
            ///
        json = JSON.parse(jsonString);

        callback(json);
      } else {
        callback(null);
      }
    }
  };

  xmlHttpRequest.open(method, url, true);

  xmlHttpRequest.send(body);
}

function urlFromHostURIAndParameters(host, uri, parameters) {
  var queryString = queryStringFromParameters(parameters),
      url = queryString === '' ? host + '/' + uri : host + '/' + uri + '?' + queryString;

  return url;
}

function queryStringFromParameters(parameters) {
  var names = Object.keys(parameters),
      namesLength = names.length,
      lastIndex = namesLength - 1,
      queryString = names.reduce(function (queryString, name, index) {
    var value = parameters[name],
        encodedName = encodeURIComponent(name),
        encodedValue = encodeURIComponent(value),
        ampersandOrNothing = index !== lastIndex ? '&' : '';

    queryString += encodedName + '=' + encodedValue + ampersandOrNothing;

    return queryString;
  }, '');

  return queryString;
}

}).call(this,require('_process'))

},{"_process":238}],171:[function(require,module,exports){
'use strict';

var array = require('./array');

var first = array.first,
    second = array.second,
    last = array.last;


function isPathRelativePath(path) {
  var position = path.search(/^\.{1,2}\//),
      pathRelativePath = position !== -1;

  return pathRelativePath;
}

function isPathAbsolutePath(path) {
  var pathRelativePath = isPathRelativePath(path),
      pathAbsolutePath = !pathRelativePath; ///

  return pathAbsolutePath;
}

function isPathTopmostDirectoryName(path) {
  var position = path.search(/^[^\/]+\/?$/),
      pathTopmostDirectoryName = position !== -1;

  return pathTopmostDirectoryName;
}

function isTopmostDirectoryNameContainedInPath(topmostDirectoryName, path) {
  topmostDirectoryName = topmostDirectoryName.replace(/\/$/, ''); ///

  var regExp = new RegExp('^' + topmostDirectoryName + '(?:\\/.+)?$'),
      position = path.search(regExp),
      topmostDirectoryNameContainedInFilePath = position !== -1;

  return topmostDirectoryNameContainedInFilePath;
}

function combinePaths(directoryPath, relativePath) {
  var absolutePath = null;

  var directoryPathSubEntryNames = directoryPath.split('/'),
      relativeFilePathSubEntryNames = relativePath.split('/');

  var firstRelativeFilePathSubEntryName = first(relativeFilePathSubEntryNames),
      lastDirectoryPathSubEntryName = void 0;

  if (firstRelativeFilePathSubEntryName === '.') {
    relativeFilePathSubEntryNames.shift();
  }

  firstRelativeFilePathSubEntryName = first(relativeFilePathSubEntryNames);
  lastDirectoryPathSubEntryName = last(directoryPathSubEntryNames);

  while (firstRelativeFilePathSubEntryName === '..' && lastDirectoryPathSubEntryName !== undefined) {
    relativeFilePathSubEntryNames.shift();
    directoryPathSubEntryNames.pop();

    firstRelativeFilePathSubEntryName = first(relativeFilePathSubEntryNames);
    lastDirectoryPathSubEntryName = last(directoryPathSubEntryNames);
  }

  if (lastDirectoryPathSubEntryName !== undefined) {
    var absoluteFilePathSubEntryNames = [].concat(directoryPathSubEntryNames).concat(relativeFilePathSubEntryNames);

    absolutePath = absoluteFilePathSubEntryNames.join('/');
  }

  return absolutePath;
}

function concatenatePaths(path1, path2) {
  path1 = path1.replace(/\/$/, ''); ///

  var combinedPath = path1 + '/' + path2;

  return combinedPath;
}

function bottommostNameFromPath(path) {
  var bottommostName = null;

  var matches = path.match(/^.+\/([^\/]+\/?)$/);

  if (matches !== null) {
    var secondMatch = second(matches);

    bottommostName = secondMatch; ///
  }

  return bottommostName;
}

function topmostDirectoryPathFromPath(path) {
  var matches = path.match(/^(.+)\/[^\/]+\/?$/),
      secondMatch = second(matches),
      directoryPath = secondMatch; ///

  return directoryPath;
}

function topmostDirectoryNameFromPath(path) {
  var topmostDirectoryName = null;

  var matches = path.match(/^([^\/]+)\/.+$/);

  if (matches !== null) {
    var secondMatch = second(matches);

    topmostDirectoryName = secondMatch; ///
  }

  return topmostDirectoryName;
}

function pathWithoutBottommostNameFromPath(path) {
  var pathWithoutBottommostName = null;

  var matches = path.match(/(^.+)\/[^\/]+\/?$/);

  if (matches !== null) {
    var secondMatch = second(matches);

    pathWithoutBottommostName = secondMatch; ///
  }

  return pathWithoutBottommostName;
}

function pathWithoutTopmostDirectoryNameFromPath(path) {
  var pathWithoutTopmostDirectoryName = null;

  var matches = path.match(/^[^\/]+\/(.+)$/);

  if (matches !== null) {
    var secondMatch = second(matches);

    pathWithoutTopmostDirectoryName = secondMatch;
  }

  return pathWithoutTopmostDirectoryName;
}

module.exports = {
  isPathRelativePath: isPathRelativePath,
  isPathAbsolutePath: isPathAbsolutePath,
  isPathTopmostDirectoryName: isPathTopmostDirectoryName,
  isTopmostDirectoryNameContainedInPath: isTopmostDirectoryNameContainedInPath,
  combinePaths: combinePaths,
  concatenatePaths: concatenatePaths,
  bottommostNameFromPath: bottommostNameFromPath,
  topmostDirectoryPathFromPath: topmostDirectoryPathFromPath,
  topmostDirectoryNameFromPath: topmostDirectoryNameFromPath,
  pathWithoutBottommostNameFromPath: pathWithoutBottommostNameFromPath,
  pathWithoutTopmostDirectoryNameFromPath: pathWithoutTopmostDirectoryNameFromPath
};

},{"./array":167}],172:[function(require,module,exports){
'use strict';

var fileSystemUtilities = require('../utilities/fileSystem');

var readFile = fileSystemUtilities.readFile;


function parseFile(filePath, args) {
  var content = readFile(filePath),
      parsedContent = parseContent(content, args);

  return parsedContent;
}

function parseContent(content, args) {
  var lines = content.split('\n'),
      parsedLines = parseLines(lines, args),
      parsedContent = parsedLines.join('\n');

  return parsedContent;
}

function parseLine(line, args) {
  var parsedLine = line.replace(/\$\{(.+?)\}/g, function (match, token) {
    var parsedToken = parseToken(token, args);

    return parsedToken;
  });

  return parsedLine;
}

module.exports = {
  parseFile: parseFile,
  parseContent: parseContent,
  parseLine: parseLine
};

function parseLines(lines, args) {
  var parsedLines = lines.map(function (line) {
    var parsedLine = parseLine(line, args);

    return parsedLine;
  });

  return parsedLines;
}

function parseToken(token, args) {
  var parsedToken = '';

  if (args.hasOwnProperty(token)) {
    parsedToken = args[token];
  }

  return parsedToken;
}

},{"../utilities/fileSystem":169}],173:[function(require,module,exports){
'use strict';

module.exports = {
  'SignificantToken': require('./lib/common/token/significant'),
  'NonSignificantToken': require('./lib/common/token/nonSignificant'),
  'BNFLexer': require('./lib/bnf/lexer'),
  'CSSLexer': require('./lib/css/lexer'),
  'LaTeXLexer': require('./lib/latex/lexer'),
  'BasicLexer': require('./lib/basic/lexer'),
  'PlainLexer': require('./lib/plain/lexer'),
  'MetaJSONLexer': require('./lib/metaJSON/lexer'),
  'FlorenceLexer': require('./lib/florence/lexer'),
  'CustomGrammarBNFLexer': require('./lib/customGrammarBNF/lexer'),
  'CustomGrammarLexicalPatternLexer': require('./lib/customGrammarLexicalPattern/lexer')
};

},{"./lib/basic/lexer":175,"./lib/bnf/lexer":177,"./lib/common/token/nonSignificant":183,"./lib/common/token/significant":195,"./lib/css/lexer":213,"./lib/customGrammarBNF/lexer":214,"./lib/customGrammarLexicalPattern/lexer":216,"./lib/florence/lexer":218,"./lib/latex/lexer":220,"./lib/metaJSON/lexer":222,"./lib/plain/lexer":224}],174:[function(require,module,exports){
'use strict';

var entries = [{ "terminal": "\\+|\\-|\\*|\\/|\\(|\\)|\\d+" }, { "unassigned": "^.*$" }];

module.exports = entries;

},{}],175:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var entries = require('./entries'),
    CommonLexer = require('../common/lexer');

var BasicLexer = function (_CommonLexer) {
  _inherits(BasicLexer, _CommonLexer);

  function BasicLexer() {
    _classCallCheck(this, BasicLexer);

    return _possibleConstructorReturn(this, (BasicLexer.__proto__ || Object.getPrototypeOf(BasicLexer)).apply(this, arguments));
  }

  _createClass(BasicLexer, [{
    key: 'tokeniseComments',
    value: function tokeniseComments(tokensOrContents, inComment) {
      return inComment;
    }
  }, {
    key: 'tokeniseDoublyQuotedStringLiterals',
    value: function tokeniseDoublyQuotedStringLiterals(tokensOrContents) {}
  }, {
    key: 'tokeniseSinglyQuotedStringLiterals',
    value: function tokeniseSinglyQuotedStringLiterals(tokensOrContents) {}
  }, {
    key: 'tokeniseRegularExpressions',
    value: function tokeniseRegularExpressions(tokensOrContents) {}
  }, {
    key: 'reTokeniseMiddleOfCommentTokens',
    value: function reTokeniseMiddleOfCommentTokens(tokensOrContents) {}
  }], [{
    key: 'fromNothing',
    value: function fromNothing() {
      return CommonLexer.fromNothing(BasicLexer);
    }
  }, {
    key: 'fromEntries',
    value: function fromEntries(entries) {
      return CommonLexer.fromEntries(BasicLexer, entries);
    }
  }]);

  return BasicLexer;
}(CommonLexer);

Object.assign(BasicLexer, {
  entries: entries
});

module.exports = BasicLexer;

},{"../common/lexer":179,"./entries":174}],176:[function(require,module,exports){
'use strict';

var entries = [{ "special": "::=|\\||\\(|\\)|\\?|\\*|\\+|\\.|ε|;|<NO_WHITESPACE>|<END_OF_LINE>" }, { "type": "\\[[^\\]]+\\]" }, { "name": "[\\w|~]+" }, { "unassigned": "^.*$" }];

module.exports = entries;

},{}],177:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var entries = require('./entries'),
    CommonLexer = require('../common/lexer'),
    specialSymbols = require('./specialSymbols');

var BNFLexer = function (_CommonLexer) {
  _inherits(BNFLexer, _CommonLexer);

  function BNFLexer() {
    _classCallCheck(this, BNFLexer);

    return _possibleConstructorReturn(this, (BNFLexer.__proto__ || Object.getPrototypeOf(BNFLexer)).apply(this, arguments));
  }

  _createClass(BNFLexer, [{
    key: 'tokeniseComments',
    value: function tokeniseComments(tokensOrContents, inComment) {
      return inComment;
    }
  }, {
    key: 'tokeniseSinglyQuotedStringLiterals',
    value: function tokeniseSinglyQuotedStringLiterals(tokensOrContents) {}
  }, {
    key: 'reTokeniseMiddleOfCommentTokens',
    value: function reTokeniseMiddleOfCommentTokens(tokensOrContents) {}
  }, {
    key: 'tokensFromBNF',
    value: function tokensFromBNF(bnf) {
      var content = bnf,
          ///
      tokens = _get(BNFLexer.prototype.__proto__ || Object.getPrototypeOf(BNFLexer.prototype), 'tokenise', this).call(this, content);

      return tokens;
    }
  }], [{
    key: 'fromNothing',
    value: function fromNothing() {
      return CommonLexer.fromNothing(BNFLexer);
    }
  }, {
    key: 'fromEntries',
    value: function fromEntries(entries) {
      return CommonLexer.fromEntries(BNFLexer, entries);
    }
  }]);

  return BNFLexer;
}(CommonLexer);

Object.assign(BNFLexer, {
  entries: entries,
  specialSymbols: specialSymbols
});

module.exports = BNFLexer;

},{"../common/lexer":179,"./entries":176,"./specialSymbols":178}],178:[function(require,module,exports){
'use strict';

var plus = '+',
    epsilon = 'ε',
    wildcard = '.',
    asterisk = '*',
    separator = '::=',
    terminator = ';',
    verticalBar = '|',
    openBracket = '(',
    closeBracket = ')',
    questionMark = '?',
    END_OF_LINE = '<END_OF_LINE>',
    NO_WHITESPACE = '<NO_WHITESPACE>';

module.exports = {
	plus: plus,
	epsilon: epsilon,
	wildcard: wildcard,
	asterisk: asterisk,
	separator: separator,
	terminator: terminator,
	verticalBar: verticalBar,
	openBracket: openBracket,
	closeBracket: closeBracket,
	questionMark: questionMark,
	END_OF_LINE: END_OF_LINE,
	NO_WHITESPACE: NO_WHITESPACE
};

},{}],179:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Rules = require('./rules'),
    CommentTokens = require('./tokens/comment'),
    WhitespaceTokens = require('./tokens/whitespace'),
    SignificantTokens = require('./tokens/significant'),
    MiddleOfCommentTokens = require('./tokens/middleOfComment'),
    RegularExpressionTokens = require('./tokens/regularExpression'),
    NonSignificantEndOfLineTokens = require('../common/tokens/endOfLine/nonSignificant'),
    SinglyQuotedStringLiteralTokens = require('./tokens/stringLiteral/singlyQuoted'),
    DoublyQuotedStringLiteralTokens = require('./tokens/stringLiteral/doublyQuoted');

var CommonLexer = function () {
  function CommonLexer(rules) {
    _classCallCheck(this, CommonLexer);

    this.rules = rules;
  }

  _createClass(CommonLexer, [{
    key: 'getRules',
    value: function getRules() {
      return this.rules;
    }
  }, {
    key: 'tokenise',
    value: function tokenise(content) {
      var tokensOrContents = [content]; ///

      this.tokeniseEndOfLines(tokensOrContents);

      this.tokeniseDoublyQuotedStringLiterals(tokensOrContents);

      this.tokeniseSinglyQuotedStringLiterals(tokensOrContents);

      this.tokeniseComments(tokensOrContents);

      this.reTokeniseMiddleOfCommentTokens(tokensOrContents);

      this.tokeniseRegularExpressions(tokensOrContents);

      this.tokeniseWhitespace(tokensOrContents);

      this.tokeniseSignificantContent(tokensOrContents);

      var tokens = tokensOrContents; ///

      return tokens;
    }
  }, {
    key: 'tokeniseComments',
    value: function tokeniseComments(tokensOrContents) {
      CommentTokens.tokenise(tokensOrContents);
    }
  }, {
    key: 'tokeniseWhitespace',
    value: function tokeniseWhitespace(tokensOrContents) {
      WhitespaceTokens.tokenise(tokensOrContents);
    }
  }, {
    key: 'tokeniseEndOfLines',
    value: function tokeniseEndOfLines(tokensOrContents) {
      NonSignificantEndOfLineTokens.tokenise(tokensOrContents);
    }
  }, {
    key: 'tokeniseDoublyQuotedStringLiterals',
    value: function tokeniseDoublyQuotedStringLiterals(tokensOrContents) {
      DoublyQuotedStringLiteralTokens.tokenise(tokensOrContents);
    }
  }, {
    key: 'tokeniseSinglyQuotedStringLiterals',
    value: function tokeniseSinglyQuotedStringLiterals(tokensOrContents) {
      SinglyQuotedStringLiteralTokens.tokenise(tokensOrContents);
    }
  }, {
    key: 'tokeniseSignificantContent',
    value: function tokeniseSignificantContent(tokensOrContents) {
      SignificantTokens.tokenise(tokensOrContents, this.rules);
    }
  }, {
    key: 'tokeniseRegularExpressions',
    value: function tokeniseRegularExpressions(tokensOrContents) {
      RegularExpressionTokens.tokenise(tokensOrContents);
    }
  }, {
    key: 'reTokeniseMiddleOfCommentTokens',
    value: function reTokeniseMiddleOfCommentTokens(tokensOrContents) {
      MiddleOfCommentTokens.reTokenise(tokensOrContents);
    }
  }], [{
    key: 'fromNothing',
    value: function fromNothing(Class) {
      var entries = Class.entries,
          rules = Rules.fromEntries(entries),
          lexer = new Class(rules);


      return lexer;
    }
  }, {
    key: 'fromEntries',
    value: function fromEntries(Class, entries) {
      var rules = Rules.fromEntries(entries),
          lexer = new Class(rules);

      return lexer;
    }
  }]);

  return CommonLexer;
}();

module.exports = CommonLexer;

},{"../common/tokens/endOfLine/nonSignificant":203,"./rules":181,"./tokens/comment":202,"./tokens/middleOfComment":205,"./tokens/regularExpression":206,"./tokens/significant":207,"./tokens/stringLiteral/doublyQuoted":208,"./tokens/stringLiteral/singlyQuoted":209,"./tokens/whitespace":210}],180:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var necessary = require('necessary');

var SignificantToken = require('../common/token/significant');

var arrayUtilities = necessary.arrayUtilities,
    first = arrayUtilities.first;

var Rule = function () {
  function Rule(significantTokenType, regularExpression) {
    _classCallCheck(this, Rule);

    this.significantTokenType = significantTokenType;
    this.regularExpression = regularExpression;
  }

  _createClass(Rule, [{
    key: 'getSignificantTokenType',
    value: function getSignificantTokenType() {
      return this.significantTokenType;
    }
  }, {
    key: 'getRegularExpression',
    value: function getRegularExpression() {
      return this.regularExpression;
    }
  }, {
    key: 'significantTokenPositionWithinContent',
    value: function significantTokenPositionWithinContent(content) {
      var significantTokenPosition = -1;

      var matches = content.match(this.regularExpression);

      if (matches !== null) {
        var firstMatch = first(matches);

        if (firstMatch !== '') {
          significantTokenPosition = matches.index; ///
        }
      }

      return significantTokenPosition;
    }
  }, {
    key: 'significantTokenFromWithinContent',
    value: function significantTokenFromWithinContent(content) {
      var matches = content.match(this.regularExpression),
          firstMatch = first(matches);

      content = firstMatch; ///

      var type = this.significantTokenType,
          ///
      significantToken = SignificantToken.fromContentAndType(content, type);

      return significantToken;
    }
  }], [{
    key: 'fromEntry',
    value: function fromEntry(entry) {
      var entryKeys = Object.keys(entry),
          firstEntryKey = first(entryKeys),
          significantTokenType = firstEntryKey,
          ///
      regularExpressionPattern = entry[significantTokenType],
          rule = Rule.fromSignificantTokenTypeAndRegularExpressionPattern(significantTokenType, regularExpressionPattern);

      return rule;
    }
  }, {
    key: 'fromSignificantTokenTypeAndRegularExpressionPattern',
    value: function fromSignificantTokenTypeAndRegularExpressionPattern(significantTokenType, regularExpressionPattern) {
      var unicode = isUnicode(regularExpressionPattern),
          flags = unicode ? 'u' : '',
          regExp = new RegExp(regularExpressionPattern, flags),
          regularExpression = regExp,
          ///
      rule = new Rule(significantTokenType, regularExpression);

      return rule;
    }
  }]);

  return Rule;
}();

module.exports = Rule;

function isUnicode(regularExpressionPattern) {
  var unicodeRegularExpression = /u\{/,
      ///
  index = regularExpressionPattern.search(unicodeRegularExpression),
      unicode = index !== -1;

  return unicode;
}

},{"../common/token/significant":195,"necessary":225}],181:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var necessary = require('necessary');

var Rule = require('./rule');

var arrayUtilities = necessary.arrayUtilities,
    first = arrayUtilities.first;

var Rules = function () {
  function Rules(array) {
    _classCallCheck(this, Rules);

    this.array = array;
  }

  _createClass(Rules, [{
    key: 'reduce',
    value: function reduce(callback, initialValue) {
      return this.array.reduce(callback, initialValue);
    }
  }, {
    key: 'getRule',
    value: function getRule(depth) {
      var rule = this.array[depth] || null; ///

      return rule;
    }
  }, {
    key: 'addRule',
    value: function addRule(rule) {
      this.array.unshift(rule); ///
    }
  }], [{
    key: 'fromEntries',
    value: function fromEntries(entries) {
      var significantTokenTypes = significantTokenTypesFromEntries(entries),
          array = significantTokenTypes.map(function (significantTokenType) {
        var regularExpressionPattern = findRegularExpressionPattern(significantTokenType, entries),
            rule = Rule.fromSignificantTokenTypeAndRegularExpressionPattern(significantTokenType, regularExpressionPattern);

        return rule;
      }),
          rules = new Rules(array);

      return rules;
    }
  }]);

  return Rules;
}();

module.exports = Rules;

function findRegularExpressionPattern(significantTokenType, entries) {
  var entry = entries.find(function (entry) {
    var entryKeys = Object.keys(entry),
        firstEntryKey = first(entryKeys),
        entrySignificantTokenType = firstEntryKey,
        ///
    found = entrySignificantTokenType === significantTokenType;

    return found;
  }) || null,
      ///
  regularExpressionPattern = entry !== null ? entry[significantTokenType] : ///
  null;

  return regularExpressionPattern;
}

function significantTokenTypesFromEntries(entries) {
  var significantTokenTypes = entries.map(function (entry) {
    var entryKeys = Object.keys(entry),
        firstEntryKey = first(entryKeys),
        significantTokenType = firstEntryKey; ///

    return significantTokenType;
  });

  return significantTokenTypes;
}

},{"./rule":180,"necessary":225}],182:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var necessary = require('necessary');

var types = require('./types');

var arrayUtilities = necessary.arrayUtilities,
    first = arrayUtilities.first,
    commentType = types.commentType,
    middleType = types.middleType,
    multiLineType = types.multiLineType,
    singleLineType = types.singleLineType,
    endOfLineType = types.endOfLineType,
    whitespaceType = types.whitespaceType;

var Token = function () {
  function Token(type, content, innerHTML, significant) {
    _classCallCheck(this, Token);

    this.type = type;
    this.content = content;
    this.innerHTML = innerHTML;
    this.significant = significant;
  }

  _createClass(Token, [{
    key: 'getType',
    value: function getType() {
      return this.type;
    }
  }, {
    key: 'getContent',
    value: function getContent() {
      return this.content;
    }
  }, {
    key: 'getInnerHTML',
    value: function getInnerHTML() {
      return this.innerHTML;
    }
  }, {
    key: 'getContentLength',
    value: function getContentLength() {
      var contentLength = this.content.length;

      return contentLength;
    }
  }, {
    key: 'isSignificant',
    value: function isSignificant() {
      return this.significant;
    }
  }, {
    key: 'isCommentToken',
    value: function isCommentToken() {
      var typeIncludesCommentType = this.type.includes(commentType),
          commentToken = typeIncludesCommentType; ///

      return commentToken;
    }
  }, {
    key: 'isEndOfLineToken',
    value: function isEndOfLineToken() {
      var typeEndOfLineType = this.type === endOfLineType,
          endOfLineToken = typeEndOfLineType; ///

      return endOfLineToken;
    }
  }, {
    key: 'isWhitespaceToken',
    value: function isWhitespaceToken() {
      var typeWhitespaceType = this.type === whitespaceType,
          whitespaceToken = typeWhitespaceType; ///

      return whitespaceToken;
    }
  }, {
    key: 'isMiddleOfCommentToken',
    value: function isMiddleOfCommentToken() {
      var typeIncludesMiddleType = this.type.includes(middleType),
          typeIncludesCommentType = this.type.includes(commentType),
          middleOfCommentToken = typeIncludesMiddleType && typeIncludesCommentType; ///

      return middleOfCommentToken;
    }
  }, {
    key: 'isMultiLineCommentToken',
    value: function isMultiLineCommentToken() {
      var typeIncludesCommentType = this.type.includes(commentType),
          typeIncludesMultiLineType = this.type.includes(multiLineType),
          multiLineCommentToken = typeIncludesMultiLineType && typeIncludesCommentType; ///

      return multiLineCommentToken;
    }
  }, {
    key: 'isSingleLineCommentToken',
    value: function isSingleLineCommentToken() {
      var typeIncludesCommentType = this.type.includes(commentType),
          typeIncludesSingleLineType = this.type.includes(singleLineType),
          singleLineCommentToken = typeIncludesSingleLineType && typeIncludesCommentType; ///

      return singleLineCommentToken;
    }
  }, {
    key: 'isEqualTo',
    value: function isEqualTo(token) {
      var equalTo = false;

      var tokenSignificant = token.isSignificant();

      if (this.significant === tokenSignificant) {
        var tokenContent = token.getContent();

        if (this.content === tokenContent) {
          var tokenType = token.getType();

          if (this.type === tokenType) {
            equalTo = true;
          }
        }
      }

      return equalTo;
    }
  }, {
    key: 'asHTML',
    value: function asHTML(filePath) {
      var className = this.type,
          ///
      html = '<span class="' + className + '">' + this.innerHTML + '</span>';

      return html;
    }
  }, {
    key: 'clone',
    value: function clone(Class, startPosition, endPosition, significant) {
      var token = null;

      if (startPosition !== endPosition) {
        var content = this.getContent();

        content = content.substring(startPosition, endPosition); ///

        var type = this.getType(),
            sanitisedContent = sanitiseContent(content),
            innerHTML = sanitisedContent; ///

        token = new Class(type, content, innerHTML, significant);
      }

      return token;
    }
  }], [{
    key: 'fromContentAndType',
    value: function fromContentAndType(Class, content, type, significant) {
      var sanitisedContent = sanitiseContent(content),
          innerHTML = sanitisedContent,
          ///
      token = new Class(type, content, innerHTML, significant);

      return token;
    }
  }, {
    key: 'fromContent',
    value: function fromContent(Class, content, significant) {
      var type = Class.type,
          sanitisedContent = sanitiseContent(content),
          innerHTML = sanitisedContent,
          token = new Class(type, content, innerHTML, significant);


      return token;
    }
  }, {
    key: 'fromWithinContent',
    value: function fromWithinContent(Class, content, significant) {
      var token = null;

      var regularExpression = Class.regularExpression,
          matches = content.match(regularExpression);


      if (matches) {
        var firstMatch = first(matches);

        content = firstMatch; ///

        var type = Class.type,
            sanitisedContent = sanitiseContent(content),
            innerHTML = sanitisedContent; ///

        token = new Class(type, content, innerHTML, significant);
      }

      return token;
    }
  }, {
    key: 'positionWithinContent',
    value: function positionWithinContent(Class, content) {
      var regularExpression = Class.regularExpression,
          position = content.search(regularExpression);


      return position;
    }
  }]);

  return Token;
}();

module.exports = Token;

function sanitiseContent(content) {
  var sanitisedContent = content.replace(/&/, '&amp;').replace(/</, '&lt;').replace(/>/, '&gt;');

  return sanitisedContent;
}

},{"./types":211,"necessary":225}],183:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Token = require('../token');

var significant = false;

var NonSignificantToken = function (_Token) {
  _inherits(NonSignificantToken, _Token);

  function NonSignificantToken() {
    _classCallCheck(this, NonSignificantToken);

    return _possibleConstructorReturn(this, (NonSignificantToken.__proto__ || Object.getPrototypeOf(NonSignificantToken)).apply(this, arguments));
  }

  _createClass(NonSignificantToken, [{
    key: 'clone',
    value: function clone(Class, startPosition, endPosition) {
      return _get(NonSignificantToken.prototype.__proto__ || Object.getPrototypeOf(NonSignificantToken.prototype), 'clone', this).call(this, Class, startPosition, endPosition, significant);
    }
  }], [{
    key: 'fromContentAndType',
    value: function fromContentAndType(Class, content, type) {
      return Token.fromContentAndType(Class, content, type, significant);
    }
  }, {
    key: 'fromContent',
    value: function fromContent(Class, content) {
      return Token.fromContent(Class, content, significant);
    }
  }, {
    key: 'fromWithinContent',
    value: function fromWithinContent(Class, content) {
      return Token.fromWithinContent(Class, content, significant);
    }
  }, {
    key: 'positionWithinContent',
    value: function positionWithinContent(Class, content) {
      return Token.positionWithinContent(Class, content);
    }
  }]);

  return NonSignificantToken;
}(Token);

module.exports = NonSignificantToken;

},{"../token":182}],184:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NonSignificantToken = require('../../nonSignificant');

var MultiLineCommentToken = function (_NonSignificantToken) {
  _inherits(MultiLineCommentToken, _NonSignificantToken);

  function MultiLineCommentToken() {
    _classCallCheck(this, MultiLineCommentToken);

    return _possibleConstructorReturn(this, (MultiLineCommentToken.__proto__ || Object.getPrototypeOf(MultiLineCommentToken)).apply(this, arguments));
  }

  _createClass(MultiLineCommentToken, [{
    key: 'clone',
    value: function clone(Class, startPosition, endPosition) {
      return _get(MultiLineCommentToken.prototype.__proto__ || Object.getPrototypeOf(MultiLineCommentToken.prototype), 'clone', this).call(this, Class, startPosition, endPosition);
    }
  }], [{
    key: 'fromContent',
    value: function fromContent(Class, content) {
      return NonSignificantToken.fromContent(Class, content);
    }
  }, {
    key: 'fromWithinContent',
    value: function fromWithinContent(Class, content) {
      return NonSignificantToken.fromWithinContent(Class, content);
    }
  }, {
    key: 'positionWithinContent',
    value: function positionWithinContent(Class, content) {
      return NonSignificantToken.positionWithinContent(Class, content);
    }
  }]);

  return MultiLineCommentToken;
}(NonSignificantToken);

module.exports = MultiLineCommentToken;

},{"../../nonSignificant":183}],185:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var types = require('../../../../types'),
    MultiLineCommentToken = require('../../comment/multiLine');

var multiLineCommentType = types.multiLineCommentType;

var EndOfMultiLineCommentToken = function (_MultiLineCommentToke) {
  _inherits(EndOfMultiLineCommentToken, _MultiLineCommentToke);

  function EndOfMultiLineCommentToken() {
    _classCallCheck(this, EndOfMultiLineCommentToken);

    return _possibleConstructorReturn(this, (EndOfMultiLineCommentToken.__proto__ || Object.getPrototypeOf(EndOfMultiLineCommentToken)).apply(this, arguments));
  }

  _createClass(EndOfMultiLineCommentToken, [{
    key: 'clone',
    value: function clone(startPosition, endPosition) {
      return _get(EndOfMultiLineCommentToken.prototype.__proto__ || Object.getPrototypeOf(EndOfMultiLineCommentToken.prototype), 'clone', this).call(this, EndOfMultiLineCommentToken, startPosition, endPosition);
    }
  }], [{
    key: 'fromContent',
    value: function fromContent(content) {
      return MultiLineCommentToken.fromContent(EndOfMultiLineCommentToken, content);
    }
  }, {
    key: 'fromWithinContent',
    value: function fromWithinContent(content) {
      return MultiLineCommentToken.fromWithinContent(EndOfMultiLineCommentToken, content);
    }
  }, {
    key: 'positionWithinContent',
    value: function positionWithinContent(content) {
      return MultiLineCommentToken.positionWithinContent(EndOfMultiLineCommentToken, content);
    }
  }]);

  return EndOfMultiLineCommentToken;
}(MultiLineCommentToken);

var type = multiLineCommentType,
    ///
regularExpression = /\*\//;

Object.assign(EndOfMultiLineCommentToken, {
  type: type,
  regularExpression: regularExpression
});

module.exports = EndOfMultiLineCommentToken;

},{"../../../../types":211,"../../comment/multiLine":184}],186:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var types = require('../../../../types'),
    MultiLineCommentToken = require('../../comment/multiLine');

var hyperlinkInMultiLineCommentType = types.hyperlinkInMultiLineCommentType;

var HyperlinkInMultiLineCommentToken = function (_MultiLineCommentToke) {
  _inherits(HyperlinkInMultiLineCommentToken, _MultiLineCommentToke);

  function HyperlinkInMultiLineCommentToken() {
    _classCallCheck(this, HyperlinkInMultiLineCommentToken);

    return _possibleConstructorReturn(this, (HyperlinkInMultiLineCommentToken.__proto__ || Object.getPrototypeOf(HyperlinkInMultiLineCommentToken)).apply(this, arguments));
  }

  _createClass(HyperlinkInMultiLineCommentToken, [{
    key: 'asHTML',
    value: function asHTML(filePath) {
      var href = this.content,
          ///
      className = this.type,
          ///
      html = '<span class="' + className + '"><a href="' + href + '" target="_blank">' + this.innerHTML + '</a></span>';

      return html;
    }
  }, {
    key: 'clone',
    value: function clone(startPosition, endPosition) {
      return _get(HyperlinkInMultiLineCommentToken.prototype.__proto__ || Object.getPrototypeOf(HyperlinkInMultiLineCommentToken.prototype), 'clone', this).call(this, HyperlinkInMultiLineCommentToken, startPosition, endPosition);
    }
  }], [{
    key: 'fromContent',
    value: function fromContent(content) {
      return MultiLineCommentToken.fromContent(HyperlinkInMultiLineCommentToken, content);
    }
  }, {
    key: 'fromWithinContent',
    value: function fromWithinContent(content) {
      return MultiLineCommentToken.fromWithinContent(HyperlinkInMultiLineCommentToken, content);
    }
  }, {
    key: 'positionWithinContent',
    value: function positionWithinContent(content) {
      return MultiLineCommentToken.positionWithinContent(HyperlinkInMultiLineCommentToken, content);
    }
  }]);

  return HyperlinkInMultiLineCommentToken;
}(MultiLineCommentToken);

var type = hyperlinkInMultiLineCommentType,
    regularExpression = /\bhttps?:\/\/[^\s\*]+/;

Object.assign(HyperlinkInMultiLineCommentToken, {
  type: type,
  regularExpression: regularExpression
});

module.exports = HyperlinkInMultiLineCommentToken;

},{"../../../../types":211,"../../comment/multiLine":184}],187:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var types = require('../../../../types'),
    MultiLineCommentToken = require('../../comment/multiLine');

var middleOfMultiLineCommentType = types.middleOfMultiLineCommentType;

var MiddleOfMultiLineCommentToken = function (_MultiLineCommentToke) {
  _inherits(MiddleOfMultiLineCommentToken, _MultiLineCommentToke);

  function MiddleOfMultiLineCommentToken() {
    _classCallCheck(this, MiddleOfMultiLineCommentToken);

    return _possibleConstructorReturn(this, (MiddleOfMultiLineCommentToken.__proto__ || Object.getPrototypeOf(MiddleOfMultiLineCommentToken)).apply(this, arguments));
  }

  _createClass(MiddleOfMultiLineCommentToken, [{
    key: 'clone',
    value: function clone(startPosition, endPosition) {
      return _get(MiddleOfMultiLineCommentToken.prototype.__proto__ || Object.getPrototypeOf(MiddleOfMultiLineCommentToken.prototype), 'clone', this).call(this, MiddleOfMultiLineCommentToken, startPosition, endPosition);
    }
  }], [{
    key: 'fromContent',
    value: function fromContent(content) {
      return MultiLineCommentToken.fromContent(MiddleOfMultiLineCommentToken, content);
    }
  }, {
    key: 'fromStringLiteralToken',
    value: function fromStringLiteralToken(stringLiteralToken) {
      var content = stringLiteralToken.getContent(),
          middleOfMultiLineCommentToken = MiddleOfMultiLineCommentToken.fromContent(content);

      return middleOfMultiLineCommentToken;
    }
  }]);

  return MiddleOfMultiLineCommentToken;
}(MultiLineCommentToken);

var type = middleOfMultiLineCommentType; ///

Object.assign(MiddleOfMultiLineCommentToken, {
  type: type
});

module.exports = MiddleOfMultiLineCommentToken;

},{"../../../../types":211,"../../comment/multiLine":184}],188:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var types = require('../../../../types'),
    MultiLineCommentToken = require('../../comment/multiLine');

var multiLineCommentType = types.multiLineCommentType;

var StartOfMultiLineCommentToken = function (_MultiLineCommentToke) {
  _inherits(StartOfMultiLineCommentToken, _MultiLineCommentToke);

  function StartOfMultiLineCommentToken() {
    _classCallCheck(this, StartOfMultiLineCommentToken);

    return _possibleConstructorReturn(this, (StartOfMultiLineCommentToken.__proto__ || Object.getPrototypeOf(StartOfMultiLineCommentToken)).apply(this, arguments));
  }

  _createClass(StartOfMultiLineCommentToken, [{
    key: 'clone',
    value: function clone(startPosition, endPosition) {
      return _get(StartOfMultiLineCommentToken.prototype.__proto__ || Object.getPrototypeOf(StartOfMultiLineCommentToken.prototype), 'clone', this).call(this, StartOfMultiLineCommentToken, startPosition, endPosition);
    }
  }], [{
    key: 'fromContent',
    value: function fromContent(content) {
      return MultiLineCommentToken.fromContent(StartOfMultiLineCommentToken, content);
    }
  }, {
    key: 'fromWithinContent',
    value: function fromWithinContent(content) {
      return MultiLineCommentToken.fromWithinContent(StartOfMultiLineCommentToken, content);
    }
  }, {
    key: 'positionWithinContent',
    value: function positionWithinContent(content) {
      return MultiLineCommentToken.positionWithinContent(StartOfMultiLineCommentToken, content);
    }
  }]);

  return StartOfMultiLineCommentToken;
}(MultiLineCommentToken);

var type = multiLineCommentType,
    ///
regularExpression = /\/\*/;

Object.assign(StartOfMultiLineCommentToken, {
  type: type,
  regularExpression: regularExpression
});

module.exports = StartOfMultiLineCommentToken;

},{"../../../../types":211,"../../comment/multiLine":184}],189:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NonSignificantToken = require('../../nonSignificant');

var SingleLineCommentToken = function (_NonSignificantToken) {
  _inherits(SingleLineCommentToken, _NonSignificantToken);

  function SingleLineCommentToken() {
    _classCallCheck(this, SingleLineCommentToken);

    return _possibleConstructorReturn(this, (SingleLineCommentToken.__proto__ || Object.getPrototypeOf(SingleLineCommentToken)).apply(this, arguments));
  }

  _createClass(SingleLineCommentToken, [{
    key: 'clone',
    value: function clone(Class, startPosition, endPosition) {
      return _get(SingleLineCommentToken.prototype.__proto__ || Object.getPrototypeOf(SingleLineCommentToken.prototype), 'clone', this).call(this, Class, startPosition, endPosition);
    }
  }], [{
    key: 'fromContent',
    value: function fromContent(Class, content) {
      return NonSignificantToken.fromContent(Class, content);
    }
  }, {
    key: 'fromWithinContent',
    value: function fromWithinContent(Class, content) {
      return NonSignificantToken.fromWithinContent(Class, content);
    }
  }, {
    key: 'positionWithinContent',
    value: function positionWithinContent(Class, content) {
      return NonSignificantToken.positionWithinContent(Class, content);
    }
  }]);

  return SingleLineCommentToken;
}(NonSignificantToken);

module.exports = SingleLineCommentToken;

},{"../../nonSignificant":183}],190:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var types = require('../../../../types'),
    SingleLineCommentToken = require('../../comment/singleLine');

var hyperlinkInSingleLineCommentType = types.hyperlinkInSingleLineCommentType;

var HyperlinkInSingleLineCommentToken = function (_SingleLineCommentTok) {
  _inherits(HyperlinkInSingleLineCommentToken, _SingleLineCommentTok);

  function HyperlinkInSingleLineCommentToken() {
    _classCallCheck(this, HyperlinkInSingleLineCommentToken);

    return _possibleConstructorReturn(this, (HyperlinkInSingleLineCommentToken.__proto__ || Object.getPrototypeOf(HyperlinkInSingleLineCommentToken)).apply(this, arguments));
  }

  _createClass(HyperlinkInSingleLineCommentToken, [{
    key: 'asHTML',
    value: function asHTML(filePath) {
      var href = this.content,
          ///
      className = this.type,
          ///
      html = '<span class="' + className + '"><a href="' + href + '" target="_blank">' + this.innerHTML + '</a></span>';

      return html;
    }
  }, {
    key: 'clone',
    value: function clone(startPosition, endPosition) {
      return _get(HyperlinkInSingleLineCommentToken.prototype.__proto__ || Object.getPrototypeOf(HyperlinkInSingleLineCommentToken.prototype), 'clone', this).call(this, HyperlinkInSingleLineCommentToken, startPosition, endPosition);
    }
  }], [{
    key: 'fromContent',
    value: function fromContent(content) {
      return SingleLineCommentToken.fromContent(HyperlinkInSingleLineCommentToken, content);
    }
  }, {
    key: 'fromWithinContent',
    value: function fromWithinContent(content) {
      return SingleLineCommentToken.fromWithinContent(HyperlinkInSingleLineCommentToken, content);
    }
  }, {
    key: 'positionWithinContent',
    value: function positionWithinContent(content) {
      return SingleLineCommentToken.positionWithinContent(HyperlinkInSingleLineCommentToken, content);
    }
  }]);

  return HyperlinkInSingleLineCommentToken;
}(SingleLineCommentToken);

var type = hyperlinkInSingleLineCommentType,
    regularExpression = /\bhttps?:\/\/[^\s]+/;

Object.assign(HyperlinkInSingleLineCommentToken, {
  type: type,
  regularExpression: regularExpression
});

module.exports = HyperlinkInSingleLineCommentToken;

},{"../../../../types":211,"../../comment/singleLine":189}],191:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var types = require('../../../../types'),
    SingleLineCommentToken = require('../../comment/singleLine');

var middleOfSingleLineCommentType = types.middleOfSingleLineCommentType;

var MiddleOfSingleLineCommentToken = function (_SingleLineCommentTok) {
  _inherits(MiddleOfSingleLineCommentToken, _SingleLineCommentTok);

  function MiddleOfSingleLineCommentToken() {
    _classCallCheck(this, MiddleOfSingleLineCommentToken);

    return _possibleConstructorReturn(this, (MiddleOfSingleLineCommentToken.__proto__ || Object.getPrototypeOf(MiddleOfSingleLineCommentToken)).apply(this, arguments));
  }

  _createClass(MiddleOfSingleLineCommentToken, [{
    key: 'clone',
    value: function clone(startPosition, endPosition) {
      return _get(MiddleOfSingleLineCommentToken.prototype.__proto__ || Object.getPrototypeOf(MiddleOfSingleLineCommentToken.prototype), 'clone', this).call(this, MiddleOfSingleLineCommentToken, startPosition, endPosition);
    }
  }], [{
    key: 'fromContent',
    value: function fromContent(content) {
      return SingleLineCommentToken.fromContent(MiddleOfSingleLineCommentToken, content);
    }
  }, {
    key: 'fromStringLiteralToken',
    value: function fromStringLiteralToken(stringLiteralToken) {
      var content = stringLiteralToken.getContent(),
          middleOfSingleLineCommentToken = MiddleOfSingleLineCommentToken.fromContent(content);

      return middleOfSingleLineCommentToken;
    }
  }]);

  return MiddleOfSingleLineCommentToken;
}(SingleLineCommentToken);

var type = middleOfSingleLineCommentType;

Object.assign(MiddleOfSingleLineCommentToken, {
  type: type
});

module.exports = MiddleOfSingleLineCommentToken;

},{"../../../../types":211,"../../comment/singleLine":189}],192:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var types = require('../../../../types'),
    SingleLineCommentToken = require('../../comment/singleLine');

var singleLineCommentType = types.singleLineCommentType;

var StartOfSingleLineCommentToken = function (_SingleLineCommentTok) {
  _inherits(StartOfSingleLineCommentToken, _SingleLineCommentTok);

  function StartOfSingleLineCommentToken() {
    _classCallCheck(this, StartOfSingleLineCommentToken);

    return _possibleConstructorReturn(this, (StartOfSingleLineCommentToken.__proto__ || Object.getPrototypeOf(StartOfSingleLineCommentToken)).apply(this, arguments));
  }

  _createClass(StartOfSingleLineCommentToken, [{
    key: 'clone',
    value: function clone(startPosition, endPosition) {
      return _get(StartOfSingleLineCommentToken.prototype.__proto__ || Object.getPrototypeOf(StartOfSingleLineCommentToken.prototype), 'clone', this).call(this, StartOfSingleLineCommentToken, startPosition, endPosition);
    }
  }], [{
    key: 'fromContent',
    value: function fromContent(content) {
      return SingleLineCommentToken.fromContent(StartOfSingleLineCommentToken, content);
    }
  }, {
    key: 'fromWithinContent',
    value: function fromWithinContent(content) {
      return SingleLineCommentToken.fromWithinContent(StartOfSingleLineCommentToken, content);
    }
  }, {
    key: 'positionWithinContent',
    value: function positionWithinContent(content) {
      return SingleLineCommentToken.positionWithinContent(StartOfSingleLineCommentToken, content);
    }
  }]);

  return StartOfSingleLineCommentToken;
}(SingleLineCommentToken);

var type = singleLineCommentType,
    regularExpression = /\/\//;

Object.assign(StartOfSingleLineCommentToken, {
  type: type,
  regularExpression: regularExpression
});

module.exports = StartOfSingleLineCommentToken;

},{"../../../../types":211,"../../comment/singleLine":189}],193:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var types = require('../../types'),
    NonSignificantToken = require('../nonSignificant');

var endOfLineType = types.endOfLineType;

var EndOfLineNonSignificantToken = function (_NonSignificantToken) {
  _inherits(EndOfLineNonSignificantToken, _NonSignificantToken);

  function EndOfLineNonSignificantToken() {
    _classCallCheck(this, EndOfLineNonSignificantToken);

    return _possibleConstructorReturn(this, (EndOfLineNonSignificantToken.__proto__ || Object.getPrototypeOf(EndOfLineNonSignificantToken)).apply(this, arguments));
  }

  _createClass(EndOfLineNonSignificantToken, [{
    key: 'asHTML',
    value: function asHTML(filePath) {
      var html = '\n'; ///

      return html;
    }
  }, {
    key: 'clone',
    value: function clone(startPosition, endPosition) {
      return _get(EndOfLineNonSignificantToken.prototype.__proto__ || Object.getPrototypeOf(EndOfLineNonSignificantToken.prototype), 'clone', this).call(this, EndOfLineNonSignificantToken, startPosition, endPosition);
    }
  }], [{
    key: 'fromContent',
    value: function fromContent(content) {
      return NonSignificantToken.fromContent(EndOfLineNonSignificantToken, content);
    }
  }, {
    key: 'fromWithinContent',
    value: function fromWithinContent(content) {
      return NonSignificantToken.fromWithinContent(EndOfLineNonSignificantToken, content);
    }
  }, {
    key: 'positionWithinContent',
    value: function positionWithinContent(content) {
      return NonSignificantToken.positionWithinContent(EndOfLineNonSignificantToken, content);
    }
  }]);

  return EndOfLineNonSignificantToken;
}(NonSignificantToken);

var type = endOfLineType,
    regularExpression = /\r\n|\r|\n/;

Object.assign(EndOfLineNonSignificantToken, {
  type: type,
  regularExpression: regularExpression
});

module.exports = EndOfLineNonSignificantToken;

},{"../../types":211,"../nonSignificant":183}],194:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var types = require('../../types'),
    NonSignificantToken = require('../nonSignificant');

var whitespaceType = types.whitespaceType;

var WhitespaceToken = function (_NonSignificantToken) {
  _inherits(WhitespaceToken, _NonSignificantToken);

  function WhitespaceToken() {
    _classCallCheck(this, WhitespaceToken);

    return _possibleConstructorReturn(this, (WhitespaceToken.__proto__ || Object.getPrototypeOf(WhitespaceToken)).apply(this, arguments));
  }

  _createClass(WhitespaceToken, [{
    key: 'asHTML',
    value: function asHTML(filePath) {
      var html = this.innerHTML; ///

      return html;
    }
  }, {
    key: 'clone',
    value: function clone(startPosition, endPosition) {
      return _get(WhitespaceToken.prototype.__proto__ || Object.getPrototypeOf(WhitespaceToken.prototype), 'clone', this).call(this, WhitespaceToken, startPosition, endPosition);
    }
  }], [{
    key: 'fromContent',
    value: function fromContent(content) {
      return NonSignificantToken.fromContent(WhitespaceToken, content);
    }
  }, {
    key: 'fromWithinContent',
    value: function fromWithinContent(content) {
      return NonSignificantToken.fromWithinContent(WhitespaceToken, content);
    }
  }, {
    key: 'positionWithinContent',
    value: function positionWithinContent(content) {
      return NonSignificantToken.positionWithinContent(WhitespaceToken, content);
    }
  }]);

  return WhitespaceToken;
}(NonSignificantToken);

var type = whitespaceType,
    ///
regularExpression = /[\t ]+/;

Object.assign(WhitespaceToken, {
  type: type,
  regularExpression: regularExpression
});

module.exports = WhitespaceToken;

},{"../../types":211,"../nonSignificant":183}],195:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Token = require('../token');

var significant = true;

var SignificantToken = function (_Token) {
  _inherits(SignificantToken, _Token);

  function SignificantToken() {
    _classCallCheck(this, SignificantToken);

    return _possibleConstructorReturn(this, (SignificantToken.__proto__ || Object.getPrototypeOf(SignificantToken)).apply(this, arguments));
  }

  _createClass(SignificantToken, [{
    key: 'clone',
    value: function clone(Class, startPosition, endPosition) {
      if (endPosition === undefined) {
        endPosition = startPosition;
        startPosition = Class;
        Class = SignificantToken;
      }

      var significantToken = _get(SignificantToken.prototype.__proto__ || Object.getPrototypeOf(SignificantToken.prototype), 'clone', this).call(this, Class, startPosition, endPosition, significant);

      return significantToken;
    }
  }], [{
    key: 'fromContentAndType',
    value: function fromContentAndType(Class, content, type) {
      if (type === undefined) {
        type = content;
        content = Class;
        Class = SignificantToken;
      }

      var significantToken = Token.fromContentAndType(Class, content, type, significant);

      return significantToken;
    }
  }, {
    key: 'fromContent',
    value: function fromContent(Class, content) {
      if (content === undefined) {
        content = Class;
        Class = SignificantToken;
      }

      var significantToken = Token.fromContent(Class, content, significant);

      return significantToken;
    }
  }, {
    key: 'fromWithinContent',
    value: function fromWithinContent(Class, content) {
      if (content === undefined) {
        content = Class;
        Class = SignificantToken;
      }

      var significantToken = Token.fromWithinContent(Class, content, significant);

      return significantToken;
    }
  }, {
    key: 'positionWithinContent',
    value: function positionWithinContent(Class, content) {
      if (content === undefined) {
        content = Class;
        Class = SignificantToken;
      }

      var position = Token.positionWithinContent(Class, content);

      return position;
    }
  }]);

  return SignificantToken;
}(Token);

module.exports = SignificantToken;

},{"../token":182}],196:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var types = require('../../types'),
    SignificantToken = require('../significant');

var endOfLineType = types.endOfLineType;

var EndOfLineSignificantToken = function (_SignificantToken) {
  _inherits(EndOfLineSignificantToken, _SignificantToken);

  function EndOfLineSignificantToken() {
    _classCallCheck(this, EndOfLineSignificantToken);

    return _possibleConstructorReturn(this, (EndOfLineSignificantToken.__proto__ || Object.getPrototypeOf(EndOfLineSignificantToken)).apply(this, arguments));
  }

  _createClass(EndOfLineSignificantToken, [{
    key: 'asHTML',
    value: function asHTML(filePath) {
      var html = '\n'; ///

      return html;
    }
  }, {
    key: 'clone',
    value: function clone(startPosition, endPosition) {
      return _get(EndOfLineSignificantToken.prototype.__proto__ || Object.getPrototypeOf(EndOfLineSignificantToken.prototype), 'clone', this).call(this, EndOfLineSignificantToken, startPosition, endPosition);
    }
  }], [{
    key: 'fromContent',
    value: function fromContent(content) {
      return SignificantToken.fromContent(EndOfLineSignificantToken, content);
    }
  }, {
    key: 'fromWithinContent',
    value: function fromWithinContent(content) {
      return SignificantToken.fromWithinContent(EndOfLineSignificantToken, content);
    }
  }, {
    key: 'positionWithinContent',
    value: function positionWithinContent(content) {
      return SignificantToken.positionWithinContent(EndOfLineSignificantToken, content);
    }
  }]);

  return EndOfLineSignificantToken;
}(SignificantToken);

var type = endOfLineType,
    ///
regularExpression = /\r\n|\r|\n/;

Object.assign(EndOfLineSignificantToken, {
  type: type,
  regularExpression: regularExpression
});

module.exports = EndOfLineSignificantToken;

},{"../../types":211,"../significant":195}],197:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var types = require('../../types'),
    SignificantToken = require('../significant');

var regularExpressionType = types.regularExpressionType;

var RegularExpressionToken = function (_SignificantToken) {
  _inherits(RegularExpressionToken, _SignificantToken);

  function RegularExpressionToken() {
    _classCallCheck(this, RegularExpressionToken);

    return _possibleConstructorReturn(this, (RegularExpressionToken.__proto__ || Object.getPrototypeOf(RegularExpressionToken)).apply(this, arguments));
  }

  _createClass(RegularExpressionToken, [{
    key: 'clone',
    value: function clone(startPosition, endPosition) {
      return _get(RegularExpressionToken.prototype.__proto__ || Object.getPrototypeOf(RegularExpressionToken.prototype), 'clone', this).call(this, RegularExpressionToken, startPosition, endPosition);
    }
  }], [{
    key: 'fromContent',
    value: function fromContent(content) {
      return SignificantToken.fromContent(RegularExpressionToken, content);
    }
  }, {
    key: 'fromWithinContent',
    value: function fromWithinContent(content) {
      return SignificantToken.fromWithinContent(RegularExpressionToken, content);
    }
  }, {
    key: 'positionWithinContent',
    value: function positionWithinContent(content) {
      return SignificantToken.positionWithinContent(RegularExpressionToken, content);
    }
  }]);

  return RegularExpressionToken;
}(SignificantToken);

var type = regularExpressionType,
    ///
regularExpression = /\/(?:\\.|[^\/])*\//;

Object.assign(RegularExpressionToken, {
  type: type,
  regularExpression: regularExpression
});

module.exports = RegularExpressionToken;

},{"../../types":211,"../significant":195}],198:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SignificantToken = require('../significant');

var StringLiteralToken = function (_SignificantToken) {
  _inherits(StringLiteralToken, _SignificantToken);

  function StringLiteralToken() {
    _classCallCheck(this, StringLiteralToken);

    return _possibleConstructorReturn(this, (StringLiteralToken.__proto__ || Object.getPrototypeOf(StringLiteralToken)).apply(this, arguments));
  }

  _createClass(StringLiteralToken, [{
    key: 'clone',
    value: function clone(Class, startPosition, endPosition) {
      return _get(StringLiteralToken.prototype.__proto__ || Object.getPrototypeOf(StringLiteralToken.prototype), 'clone', this).call(this, Class, startPosition, endPosition);
    }
  }, {
    key: 'getString',
    value: function getString() {
      var content = this.getContent(),
          contentLength = content.length,
          start = 1,
          end = contentLength - 1,
          string = content.substring(start, end);

      return string;
    }
  }], [{
    key: 'fromContent',
    value: function fromContent(Class, content) {
      return SignificantToken.fromContent(Class, content);
    }
  }, {
    key: 'fromWithinContent',
    value: function fromWithinContent(Class, content) {
      return SignificantToken.fromWithinContent(Class, content);
    }
  }, {
    key: 'positionWithinContent',
    value: function positionWithinContent(Class, content) {
      return SignificantToken.positionWithinContent(Class, content);
    }
  }]);

  return StringLiteralToken;
}(SignificantToken);

module.exports = StringLiteralToken;

},{"../significant":195}],199:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var types = require('../../../types'),
    StringLiteralToken = require('../../significant/stringLiteral');

var stringLiteralType = types.stringLiteralType;

var DoublyQuotedStringLiteralToken = function (_StringLiteralToken) {
  _inherits(DoublyQuotedStringLiteralToken, _StringLiteralToken);

  function DoublyQuotedStringLiteralToken() {
    _classCallCheck(this, DoublyQuotedStringLiteralToken);

    return _possibleConstructorReturn(this, (DoublyQuotedStringLiteralToken.__proto__ || Object.getPrototypeOf(DoublyQuotedStringLiteralToken)).apply(this, arguments));
  }

  _createClass(DoublyQuotedStringLiteralToken, [{
    key: 'clone',
    value: function clone(startPosition, endPosition) {
      return _get(DoublyQuotedStringLiteralToken.prototype.__proto__ || Object.getPrototypeOf(DoublyQuotedStringLiteralToken.prototype), 'clone', this).call(this, DoublyQuotedStringLiteralToken, startPosition, endPosition);
    }
  }], [{
    key: 'fromContent',
    value: function fromContent(content) {
      return StringLiteralToken.fromContent(DoublyQuotedStringLiteralToken, content);
    }
  }, {
    key: 'fromWithinContent',
    value: function fromWithinContent(content) {
      return StringLiteralToken.fromWithinContent(DoublyQuotedStringLiteralToken, content);
    }
  }, {
    key: 'positionWithinContent',
    value: function positionWithinContent(content) {
      return StringLiteralToken.positionWithinContent(DoublyQuotedStringLiteralToken, content);
    }
  }]);

  return DoublyQuotedStringLiteralToken;
}(StringLiteralToken);

var type = stringLiteralType,
    ///
regularExpression = /"(?:\\.|[^"])*"/;

Object.assign(DoublyQuotedStringLiteralToken, {
  type: type,
  regularExpression: regularExpression
});

module.exports = DoublyQuotedStringLiteralToken;

},{"../../../types":211,"../../significant/stringLiteral":198}],200:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var types = require('../../../types'),
    StringLiteralToken = require('../../significant/stringLiteral');

var stringLiteralType = types.stringLiteralType;

var SinglyQuotedStringLiteralToken = function (_StringLiteralToken) {
  _inherits(SinglyQuotedStringLiteralToken, _StringLiteralToken);

  function SinglyQuotedStringLiteralToken() {
    _classCallCheck(this, SinglyQuotedStringLiteralToken);

    return _possibleConstructorReturn(this, (SinglyQuotedStringLiteralToken.__proto__ || Object.getPrototypeOf(SinglyQuotedStringLiteralToken)).apply(this, arguments));
  }

  _createClass(SinglyQuotedStringLiteralToken, [{
    key: 'clone',
    value: function clone(startPosition, endPosition) {
      return _get(SinglyQuotedStringLiteralToken.prototype.__proto__ || Object.getPrototypeOf(SinglyQuotedStringLiteralToken.prototype), 'clone', this).call(this, SinglyQuotedStringLiteralToken, startPosition, endPosition);
    }
  }], [{
    key: 'fromContent',
    value: function fromContent(content) {
      return StringLiteralToken.fromContent(SinglyQuotedStringLiteralToken, content);
    }
  }, {
    key: 'fromWithinContent',
    value: function fromWithinContent(content) {
      return StringLiteralToken.fromWithinContent(SinglyQuotedStringLiteralToken, content);
    }
  }, {
    key: 'positionWithinContent',
    value: function positionWithinContent(content) {
      return StringLiteralToken.positionWithinContent(SinglyQuotedStringLiteralToken, content);
    }
  }]);

  return SinglyQuotedStringLiteralToken;
}(StringLiteralToken);

var type = stringLiteralType,
    ///
regularExpression = /'(?:\\.|[^'])*'/;

Object.assign(SinglyQuotedStringLiteralToken, {
  type: type,
  regularExpression: regularExpression
});

module.exports = SinglyQuotedStringLiteralToken;

},{"../../../types":211,"../../significant/stringLiteral":198}],201:[function(require,module,exports){
'use strict';

var necessary = require('necessary');

var arrayUtilities = necessary.arrayUtilities,
    splice = arrayUtilities.splice;


function tokeniseByToken(tokensOrContents, Token) {
  tokeniseByCallback(tokensOrContents, function (tokenOrContent) {
    var tokensOrRemainingContents = void 0;

    var tokenOrContentString = typeof tokenOrContent === 'string',
        tokenOrContentContent = tokenOrContentString; ///

    if (tokenOrContentContent) {
      var content = tokenOrContent,
          ///
      tokenOrRemainingContent = tokenOrRemainingContentFromContentAndToken(content, Token);

      tokensOrRemainingContents = tokenOrRemainingContent; ///
    } else {
      var token = tokenOrContent; ///

      tokensOrRemainingContents = [token];
    }

    return tokensOrRemainingContents;
  });
}

function tokeniseByCallback(tokensOrContents, callback) {
  var index = 0,
      tokensOrContentsLength = tokensOrContents.length;

  while (index < tokensOrContentsLength) {
    var tokenOrContent = tokensOrContents[index],
        tokensOrRemainingContents = callback(tokenOrContent),
        tokensOrRemainingContentsLength = tokensOrRemainingContents.length,
        start = index,
        ///
    deleteCount = 1;

    splice(tokensOrContents, start, deleteCount, tokensOrRemainingContents);

    tokensOrContentsLength -= 1;

    tokensOrContentsLength += tokensOrRemainingContentsLength;

    index += tokensOrRemainingContentsLength;
  }
}

module.exports = {
  tokeniseByToken: tokeniseByToken,
  tokeniseByCallback: tokeniseByCallback
};

function tokenOrRemainingContentFromContentAndToken(content, Token) {
  var tokenOrRemainingContent = [],
      remainingContent = void 0,
      tokenPositionWithinContent = Token.positionWithinContent(content);

  while (tokenPositionWithinContent !== -1) {
    if (tokenPositionWithinContent > 0) {
      remainingContent = content.substring(0, tokenPositionWithinContent);

      tokenOrRemainingContent.push(remainingContent);
    }

    var token = Token.fromWithinContent(content),
        tokenContentLength = token.getContentLength(),
        tokenOffset = tokenPositionWithinContent + tokenContentLength;

    tokenOrRemainingContent.push(token);

    content = content.substring(tokenOffset);

    tokenPositionWithinContent = Token.positionWithinContent(content);
  }

  if (content !== '') {
    remainingContent = content;

    tokenOrRemainingContent.push(remainingContent);
  }

  return tokenOrRemainingContent;
}

},{"necessary":225}],202:[function(require,module,exports){
'use strict';

var types = require('../types'),
    tokens = require('../tokens'),
    StringLiteralToken = require('../token/significant/stringLiteral'),
    EndOfMultiLineCommentToken = require('../token/nonSignificant/comment/multiLine/endOf'),
    StartOfMultiLineCommentToken = require('../token/nonSignificant/comment/multiLine/startOf'),
    MiddleOfMultiLineCommentToken = require('../token/nonSignificant/comment/multiLine/middleOf'),
    StartOfSingleLineCommentToken = require('../token/nonSignificant/comment/singleLine/startOf'),
    MiddleOfSingleLineCommentToken = require('../token/nonSignificant/comment/singleLine/middleOf');

var multiLineType = types.multiLineType,
    singleLineType = types.singleLineType,
    multiLineCommentType = types.multiLineCommentType,
    singleLineCommentType = types.singleLineCommentType,
    tokeniseByCallback = tokens.tokeniseByCallback;


function tokenise(tokensOrContents) {
  var commentType = null;

  tokeniseByCallback(tokensOrContents, function (tokenOrContent) {
    var commentTokensOrRemainingContents = [];

    commentType = tokeniseCommentTokens(commentTokensOrRemainingContents, tokenOrContent, commentType);

    var tokensOrRemainingContents = commentTokensOrRemainingContents; ///

    return tokensOrRemainingContents;
  });
}

module.exports = {
  tokenise: tokenise
};

function tokeniseCommentTokens(commentTokensOrRemainingContents, tokenOrContent, commentType) {
  var tokenOrContentContent = isTokenOrContentContent(tokenOrContent),
      tokenOrContentStringLiteralToken = isTokenOrContentStringLiteralToken(tokenOrContent),
      commentTypeSingleLineCommentType = isCommentTypeSingleLineCommentType(commentType),
      commentTypeMultiLineCommentType = isCommentTypeMultiLineCommentType(commentType);

  if (false) {} else if (tokenOrContentContent) {
    var content = tokenOrContent; ///

    if (false) {} else if (commentTypeSingleLineCommentType) {
      var middleOfSingleLineCommentToken = MiddleOfSingleLineCommentToken.fromContent(content);

      commentTokensOrRemainingContents.push(middleOfSingleLineCommentToken);
    } else if (commentTypeMultiLineCommentType) {
      var endOfMultiLineCommentTokenPosition = EndOfMultiLineCommentToken.positionWithinContent(content);

      if (endOfMultiLineCommentTokenPosition > -1) {
        commentType = tokeniseEndOfMultiLineCommentToken(commentTokensOrRemainingContents, content);
      } else {
        var middleOfMultiLineCommentToken = MiddleOfMultiLineCommentToken.fromContent(content);

        commentTokensOrRemainingContents.push(middleOfMultiLineCommentToken);
      }
    } else {
      var startOfSingleLineCommentTokenPosition = StartOfSingleLineCommentToken.positionWithinContent(content),
          startOfMultiLineCommentTokenPosition = StartOfMultiLineCommentToken.positionWithinContent(content);

      if (startOfSingleLineCommentTokenPosition > -1 && startOfMultiLineCommentTokenPosition > -1) {
        if (false) {} else if (startOfSingleLineCommentTokenPosition < startOfMultiLineCommentTokenPosition) {
          commentType = tokeniseStartOfSingleLineCommentToken(commentTokensOrRemainingContents, content);
        } else if (startOfMultiLineCommentTokenPosition < startOfSingleLineCommentTokenPosition) {
          commentType = tokeniseStartOfMultiLineCommentToken(commentTokensOrRemainingContents, content);
        }
      } else if (startOfSingleLineCommentTokenPosition > -1) {
        commentType = tokeniseStartOfSingleLineCommentToken(commentTokensOrRemainingContents, content);
      } else if (startOfMultiLineCommentTokenPosition > -1) {
        commentType = tokeniseStartOfMultiLineCommentToken(commentTokensOrRemainingContents, content);
      } else {
        var remainingContent = content; ///

        commentTokensOrRemainingContents.push(remainingContent);
      }
    }
  } else if (tokenOrContentStringLiteralToken) {
    var stringLiteralToken = tokenOrContent; ///

    if (false) {} else if (commentTypeSingleLineCommentType) {
      var _middleOfSingleLineCommentToken = MiddleOfSingleLineCommentToken.fromStringLiteralToken(stringLiteralToken);

      commentTokensOrRemainingContents.push(_middleOfSingleLineCommentToken);
    } else if (commentTypeMultiLineCommentType) {
      var _content = stringLiteralToken.getContent(),
          _endOfMultiLineCommentTokenPosition = EndOfMultiLineCommentToken.positionWithinContent(_content);

      if (_endOfMultiLineCommentTokenPosition > -1) {
        commentType = tokeniseEndOfMultiLineCommentToken(commentTokensOrRemainingContents, _content);
      } else {
        var _middleOfMultiLineCommentToken = MiddleOfMultiLineCommentToken.fromContent(_content);

        commentTokensOrRemainingContents.push(_middleOfMultiLineCommentToken);
      }
    } else {
      commentTokensOrRemainingContents.push(stringLiteralToken);
    }
  } else {
    var token = tokenOrContent,
        ///
    tokenEndOfLineToken = token.isEndOfLineToken();

    if (tokenEndOfLineToken) {
      var _commentTypeSingleLineCommentType = isCommentTypeSingleLineCommentType(commentType);

      if (_commentTypeSingleLineCommentType) {
        commentType = null;
      }
    }

    commentTokensOrRemainingContents.push(token);
  }

  return commentType;
}

function isTokenOrContentContent(tokenOrContent) {
  var tokenOrContentString = typeof tokenOrContent === 'string',
      tokenOrContentContent = tokenOrContentString; ///

  return tokenOrContentContent;
}

function isTokenOrContentStringLiteralToken(tokenOrContent) {
  var tokenOrContentStringLiteralToken = false;

  var tokenOrContentString = typeof tokenOrContent === 'string',
      tokenOrContentContent = tokenOrContentString,
      ///
  tokenOrContentToken = !tokenOrContentContent;

  if (tokenOrContentToken) {
    var token = tokenOrContent,
        tokenStringLiteralToken = token instanceof StringLiteralToken;

    tokenOrContentStringLiteralToken = tokenStringLiteralToken; ///
  }

  return tokenOrContentStringLiteralToken;
}

function isCommentTypeSingleLineCommentType(commentType) {
  var commentTypeSingleLineCommentType = false;

  if (commentType !== null) {
    var commentTypeIncludesSingleLineType = commentType.includes(singleLineType);

    commentTypeSingleLineCommentType = commentTypeIncludesSingleLineType;
  }

  return commentTypeSingleLineCommentType;
}

function isCommentTypeMultiLineCommentType(commentType) {
  var commentTypeMultiLineCommentType = false;

  if (commentType !== null) {
    var commentTypeIncludesMultiLineType = commentType.includes(multiLineType);

    commentTypeMultiLineCommentType = commentTypeIncludesMultiLineType;
  }

  return commentTypeMultiLineCommentType;
}

function tokeniseStartOfSingleLineCommentToken(commentTokensOrRemainingContents, content) {
  var commentType = singleLineCommentType; ///

  commentType = tokeniseStartOfCommentToken(StartOfSingleLineCommentToken, commentTokensOrRemainingContents, content, commentType);

  return commentType;
}

function tokeniseStartOfMultiLineCommentToken(commentTokensOrRemainingContents, content) {
  var commentType = multiLineCommentType; ///

  commentType = tokeniseStartOfCommentToken(StartOfMultiLineCommentToken, commentTokensOrRemainingContents, content, commentType);

  return commentType;
}

function tokeniseEndOfMultiLineCommentToken(commentTokensOrRemainingContents, content) {
  var commentType = null;

  commentType = tokeniseEndOfCommentToken(EndOfMultiLineCommentToken, MiddleOfMultiLineCommentToken, commentTokensOrRemainingContents, content, commentType);

  return commentType;
}

function tokeniseStartOfCommentToken(StartOfCommentToken, commentTokensOrRemainingContents, content, commentType) {
  var startOfSingleLineCommentToken = StartOfCommentToken.fromWithinContent(content),
      position = StartOfCommentToken.positionWithinContent(content),
      ///
  contentLength = startOfSingleLineCommentToken.getContentLength(),
      left = position,
      ///
  right = position + contentLength,
      leftContent = content.substring(0, left),
      rightContent = content.substring(right),
      leftContentLength = leftContent.length,
      rightContentLength = rightContent.length;

  if (leftContentLength > 0) {
    var remainingContent = leftContent; ///

    commentTokensOrRemainingContents.push(remainingContent);
  }

  commentTokensOrRemainingContents.push(startOfSingleLineCommentToken);

  if (rightContentLength > 0) {
    var tokenOrContent = rightContent; ///

    commentType = tokeniseCommentTokens(commentTokensOrRemainingContents, tokenOrContent, commentType);
  }

  return commentType;
}

function tokeniseEndOfCommentToken(EndOfCommentToken, MiddleOfCommentToken, commentTokensOrRemainingContents, content, commentType) {
  var endOfMultiLineCommentToken = EndOfCommentToken.fromWithinContent(content),
      position = EndOfCommentToken.positionWithinContent(content),
      contentLength = endOfMultiLineCommentToken.getContentLength(),
      left = position,
      right = position + contentLength,
      leftContent = content.substring(0, left),
      rightContent = content.substring(right),
      leftContentLength = leftContent.length,
      rightContentLength = rightContent.length;

  if (leftContentLength > 0) {
    var _content2 = leftContent,
        ///
    middleOfMultiLineCommentToken = MiddleOfCommentToken.fromContent(_content2);

    commentTokensOrRemainingContents.push(middleOfMultiLineCommentToken);
  }

  commentTokensOrRemainingContents.push(endOfMultiLineCommentToken);

  if (rightContentLength > 0) {
    var tokenOrContent = rightContent; ///

    commentType = tokeniseCommentTokens(commentTokensOrRemainingContents, tokenOrContent, commentType);
  }

  return commentType;
}

},{"../token/nonSignificant/comment/multiLine/endOf":185,"../token/nonSignificant/comment/multiLine/middleOf":187,"../token/nonSignificant/comment/multiLine/startOf":188,"../token/nonSignificant/comment/singleLine/middleOf":191,"../token/nonSignificant/comment/singleLine/startOf":192,"../token/significant/stringLiteral":198,"../tokens":201,"../types":211}],203:[function(require,module,exports){
'use strict';

var tokens = require('../../tokens'),
    EndOfLineNonSignificantToken = require('../../token/nonSignificant/endOfLine');

var tokeniseByToken = tokens.tokeniseByToken;


function tokenise(tokensOrContents) {
  tokeniseByToken(tokensOrContents, EndOfLineNonSignificantToken);
}

module.exports = {
  tokenise: tokenise
};

},{"../../token/nonSignificant/endOfLine":193,"../../tokens":201}],204:[function(require,module,exports){
'use strict';

var tokens = require('../../tokens'),
    EndOfLineSignificantToken = require('../../token/significant/endOfLine');

var tokeniseByToken = tokens.tokeniseByToken;


function tokenise(tokensOrContents) {
  tokeniseByToken(tokensOrContents, EndOfLineSignificantToken);
}

module.exports = {
  tokenise: tokenise
};

},{"../../token/significant/endOfLine":196,"../../tokens":201}],205:[function(require,module,exports){
'use strict';

var tokens = require('../tokens'),
    MiddleOfMultiLineCommentToken = require('../token/nonSignificant/comment/multiLine/middleOf'),
    MiddleOfSingleLineCommentToken = require('../token/nonSignificant/comment/singleLine/middleOf'),
    HyperlinkInMultiLineCommentToken = require('../token/nonSignificant/comment/multiLine/hyperlinkIn'),
    HyperlinkInSingleLineCommentToken = require('../token/nonSignificant/comment/singleLine/hyperlinkIn');

var tokeniseByCallback = tokens.tokeniseByCallback;


function reTokenise(tokensOrContents) {
  tokeniseByCallback(tokensOrContents, function (tokenOrContent) {
    var commentTokensOrRemainingContents = [];

    reTokeniseMiddleOfCommentTokens(commentTokensOrRemainingContents, tokenOrContent);

    var tokensOrRemainingContents = commentTokensOrRemainingContents; ///

    return tokensOrRemainingContents;
  });
}

module.exports = {
  reTokenise: reTokenise
};

function reTokeniseMiddleOfCommentTokens(commentTokensOrRemainingContents, tokenOrContent) {
  var tokenOrContentString = typeof tokenOrContent === 'string',
      tokenOrContentContent = tokenOrContentString; ///

  if (tokenOrContentContent) {
    var remainingContent = tokenOrContent; ///

    commentTokensOrRemainingContents.push(remainingContent);
  } else {
    var token = tokenOrContent,
        ///
    tokenMiddleOfCommentToken = token.isMiddleOfCommentToken();

    if (tokenMiddleOfCommentToken) {
      var middleOfCommentToken = token,
          ///
      middleOfCommentTokenMultiLineCommentToken = middleOfCommentToken.isMultiLineCommentToken(),
          middleOfCommentTokenSingleLineCommentToken = !middleOfCommentTokenMultiLineCommentToken; ///

      if (false) {} else if (middleOfCommentTokenMultiLineCommentToken) {
        var content = middleOfCommentToken.getContent(),
            ///
        hyperlinkInMultiLineCommentTokenPosition = HyperlinkInMultiLineCommentToken.positionWithinContent(content);

        if (hyperlinkInMultiLineCommentTokenPosition > -1) {
          tokeniseHyperlinkInMultiLineCommentToken(commentTokensOrRemainingContents, content);
        } else {
          commentTokensOrRemainingContents.push(token);
        }
      } else if (middleOfCommentTokenSingleLineCommentToken) {
        var _content = middleOfCommentToken.getContent(),
            ///
        hyperlinkInSingleLineCommentTokenPosition = HyperlinkInSingleLineCommentToken.positionWithinContent(_content);

        if (hyperlinkInSingleLineCommentTokenPosition > -1) {
          tokeniseHyperlinkInSingleLineCommentToken(commentTokensOrRemainingContents, _content);
        } else {
          commentTokensOrRemainingContents.push(token);
        }
      } else {
        commentTokensOrRemainingContents.push(middleOfCommentToken);
      }
    } else {
      commentTokensOrRemainingContents.push(token);
    }
  }
}

function tokeniseHyperlinkInMultiLineCommentToken(commentTokensOrRemainingContents, content) {
  tokeniseHyperlinkInCommentToken(HyperlinkInMultiLineCommentToken, MiddleOfMultiLineCommentToken, commentTokensOrRemainingContents, content);
}

function tokeniseHyperlinkInSingleLineCommentToken(commentTokensOrRemainingContents, content) {
  tokeniseHyperlinkInCommentToken(HyperlinkInSingleLineCommentToken, MiddleOfSingleLineCommentToken, commentTokensOrRemainingContents, content);
}

function tokeniseHyperlinkInCommentToken(HyperlinkInCommentToken, MiddleOfCommentToken, commentTokensOrRemainingContents, content) {
  var hyperlinkInCommentToken = HyperlinkInCommentToken.fromWithinContent(content),
      position = HyperlinkInCommentToken.positionWithinContent(content),
      ///
  contentLength = hyperlinkInCommentToken.getContentLength(),
      left = position,
      right = position + contentLength,
      leftContent = content.substring(0, left),
      rightContent = content.substring(right),
      leftContentLength = leftContent.length,
      rightContentLength = rightContent.length;

  if (leftContentLength > 0) {
    var _content2 = leftContent,
        ///
    middleOfCommentToken = MiddleOfCommentToken.fromContent(_content2);

    commentTokensOrRemainingContents.push(middleOfCommentToken);
  }

  commentTokensOrRemainingContents.push(hyperlinkInCommentToken);

  if (rightContentLength > 0) {
    var _content3 = rightContent,
        ///
    _middleOfCommentToken = MiddleOfCommentToken.fromContent(_content3),
        tokenOrContent = _middleOfCommentToken; ///

    reTokeniseMiddleOfCommentTokens(commentTokensOrRemainingContents, tokenOrContent);
  }
}

},{"../token/nonSignificant/comment/multiLine/hyperlinkIn":186,"../token/nonSignificant/comment/multiLine/middleOf":187,"../token/nonSignificant/comment/singleLine/hyperlinkIn":190,"../token/nonSignificant/comment/singleLine/middleOf":191,"../tokens":201}],206:[function(require,module,exports){
'use strict';

var tokens = require('../tokens'),
    RegularExpression = require('../token/significant/regularExpression');

var tokeniseByToken = tokens.tokeniseByToken;


function tokenise(tokensOrContents) {
  tokeniseByToken(tokensOrContents, RegularExpression);
}

module.exports = {
  tokenise: tokenise
};

},{"../token/significant/regularExpression":197,"../tokens":201}],207:[function(require,module,exports){
'use strict';

var tokens = require('../tokens');

var tokeniseByCallback = tokens.tokeniseByCallback;


function tokenise(tokensOrContents, rules) {
  tokeniseByCallback(tokensOrContents, function (tokenOrContent) {
    var tokensOrRemainingContents = void 0;

    var tokenOrContentString = typeof tokenOrContent === 'string',
        tokenOrContentContent = tokenOrContentString; ///

    if (tokenOrContentContent) {
      var content = tokenOrContent,
          ///
      depth = 0,
          significantTokens = significantTokensFromContent(content, rules, depth);

      tokensOrRemainingContents = significantTokens; ///
    } else {
      var token = tokenOrContent; ///

      tokensOrRemainingContents = [token];
    }

    return tokensOrRemainingContents;
  });
}

module.exports = {
  tokenise: tokenise
};

function significantTokensFromContent(content, rules, depth) {
  var significantTokens = [];

  if (content !== '') {
    var rule = rules.getRule(depth);

    if (rule !== null) {
      var nextDepth = depth + 1,
          significantTokenPositionWithinContent = rule.significantTokenPositionWithinContent(content);

      if (significantTokenPositionWithinContent === -1) {
        significantTokens = significantTokensFromContent(content, rules, nextDepth);
      } else {
        var significantToken = rule.significantTokenFromWithinContent(content),
            significantTokenContentLength = significantToken.getContentLength(),
            left = significantTokenPositionWithinContent,
            ///
        right = significantTokenPositionWithinContent + significantTokenContentLength,
            ///
        leftContent = content.substring(0, left),
            rightContent = content.substring(right),
            leftSignificantTokens = significantTokensFromContent(leftContent, rules, nextDepth),
            rightSignificantTokens = significantTokensFromContent(rightContent, rules, depth);

        significantTokens = [].concat(leftSignificantTokens).concat(significantToken).concat(rightSignificantTokens);
      }
    } else {
      throw new Error('There is no rule to parse \'' + content + '\'.');
    }
  }

  return significantTokens;
}

},{"../tokens":201}],208:[function(require,module,exports){
'use strict';

var tokens = require('../../tokens'),
    DoublyQuotedStringLiteralToken = require('../../token/significant/stringLiteral/doublyQuoted');

var tokeniseByToken = tokens.tokeniseByToken;


function tokenise(tokensAndContents) {
  tokeniseByToken(tokensAndContents, DoublyQuotedStringLiteralToken);
}

module.exports = {
  tokenise: tokenise
};

},{"../../token/significant/stringLiteral/doublyQuoted":199,"../../tokens":201}],209:[function(require,module,exports){
'use strict';

var tokens = require('../../tokens'),
    SinglyQuotedStringLiteralToken = require('../../token/significant/stringLiteral/singlyQuoted');

var tokeniseByToken = tokens.tokeniseByToken;


function tokenise(tokensAndContents) {
  tokeniseByToken(tokensAndContents, SinglyQuotedStringLiteralToken);
}

module.exports = {
  tokenise: tokenise
};

},{"../../token/significant/stringLiteral/singlyQuoted":200,"../../tokens":201}],210:[function(require,module,exports){
'use strict';

var tokens = require('../tokens'),
    WhitespaceToken = require('../token/nonSignificant/whitespace');

var tokeniseByToken = tokens.tokeniseByToken;


function tokenise(tokensAndContents) {
  tokeniseByToken(tokensAndContents, WhitespaceToken);
}

module.exports = {
  tokenise: tokenise
};

},{"../token/nonSignificant/whitespace":194,"../tokens":201}],211:[function(require,module,exports){
'use strict';

var middleType = 'middle',
    commentType = 'comment',
    multiLineType = 'multiLine',
    singleLineType = 'singleLine',
    hyperlinkType = 'hyperlink',
    endOfLineType = 'endOfLine',
    whitespaceType = 'whitespace',
    stringLiteralType = 'stringLiteral',
    regularExpressionType = 'regularExpression',
    multiLineCommentType = multiLineType + ' ' + commentType,
    singleLineCommentType = singleLineType + ' ' + commentType,
    middleOfMultiLineCommentType = middleType + ' ' + multiLineCommentType,
    middleOfSingleLineCommentType = middleType + ' ' + singleLineCommentType,
    hyperlinkInMultiLineCommentType = hyperlinkType + ' ' + multiLineCommentType,
    hyperlinkInSingleLineCommentType = hyperlinkType + ' ' + singleLineCommentType;

module.exports = {
	middleType: middleType,
	commentType: commentType,
	multiLineType: multiLineType,
	singleLineType: singleLineType,
	hyperlinkType: hyperlinkType,
	endOfLineType: endOfLineType,
	whitespaceType: whitespaceType,
	stringLiteralType: stringLiteralType,
	regularExpressionType: regularExpressionType,
	multiLineCommentType: multiLineCommentType,
	singleLineCommentType: singleLineCommentType,
	middleOfMultiLineCommentType: middleOfMultiLineCommentType,
	middleOfSingleLineCommentType: middleOfSingleLineCommentType,
	hyperlinkInMultiLineCommentType: hyperlinkInMultiLineCommentType,
	hyperlinkInSingleLineCommentType: hyperlinkInSingleLineCommentType
};

},{}],212:[function(require,module,exports){
'use strict';

var entries = [{
  "colour": "#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3})"
}, {
  "keyword": "(?:!important|@media)"
}, {
  "percentage": "(?:[0-9]+|[0-9]*\\.[0-9]+)\\%"
}, {
  "frequency": "(?:[0-9]+|[0-9]*\\.[0-9]+)(?:hz|khz)"
}, {
  "length": "(?:[0-9]+|[0-9]*\\.[0-9]+)(?:px|cm|mm|in|pt|pc)"
}, {
  "angle": "(?:[0-9]+|[0-9]*\\.[0-9]+)(?:deg|rad|grad)"
}, {
  "time": "(?:[0-9]+|[0-9]*\\.[0-9]+)(?:s|ms)"
}, {
  "rems": "(?:[0-9]+|[0-9]*\\.[0-9]+)rem"
}, {
  "ems": "(?:[0-9]+|[0-9]*\\.[0-9]+)em"
}, {
  "number": "[0-9]+|[0-9]*\\.[0-9]+"
}, {
  "special": ";|::|:|\\.|,|/|\\|=|~=|=|>|\\{|\\}|\\(|\\)|\\[|\\]"
}, {
  "operator": "^(?:and|not|only)$"
}, {
  "identifier": "[_a-zA-Z][_a-zA-Z0-9-]*"
}, {
  "unaryOperator": "\\+|\\-"
}, {
  "unassigned": "^.*$"
}];

module.exports = entries;

},{}],213:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var entries = require('./entries'),
    CommonLexer = require('../common/lexer'),
    SignificantEndOfLineTokens = require('../common/tokens/endOfLine/significant');

var CSSLexer = function (_CommonLexer) {
  _inherits(CSSLexer, _CommonLexer);

  function CSSLexer() {
    _classCallCheck(this, CSSLexer);

    return _possibleConstructorReturn(this, (CSSLexer.__proto__ || Object.getPrototypeOf(CSSLexer)).apply(this, arguments));
  }

  _createClass(CSSLexer, [{
    key: 'tokeniseEndOfLines',
    value: function tokeniseEndOfLines(tokensOrContents) {
      SignificantEndOfLineTokens.tokenise(tokensOrContents);
    }
  }, {
    key: 'tokeniseRegularExpressions',
    value: function tokeniseRegularExpressions(tokensOrContents) {}
  }], [{
    key: 'fromNothing',
    value: function fromNothing() {
      return CommonLexer.fromNothing(CSSLexer);
    }
  }, {
    key: 'fromEntries',
    value: function fromEntries(entries) {
      return CommonLexer.fromEntries(CSSLexer, entries);
    }
  }]);

  return CSSLexer;
}(CommonLexer);

Object.assign(CSSLexer, {
  entries: entries
});

module.exports = CSSLexer;

},{"../common/lexer":179,"../common/tokens/endOfLine/significant":204,"./entries":212}],214:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var entries = require('../bnf/entries'),
    CommonLexer = require('../common/lexer');

var CustomGrammarBNFLexer = function (_CommonLexer) {
  _inherits(CustomGrammarBNFLexer, _CommonLexer);

  function CustomGrammarBNFLexer() {
    _classCallCheck(this, CustomGrammarBNFLexer);

    return _possibleConstructorReturn(this, (CustomGrammarBNFLexer.__proto__ || Object.getPrototypeOf(CustomGrammarBNFLexer)).apply(this, arguments));
  }

  _createClass(CustomGrammarBNFLexer, [{
    key: 'tokeniseComments',
    value: function tokeniseComments(tokensOrContents, inComment) {
      return inComment;
    }
  }, {
    key: 'tokeniseSinglyQuotedStringLiterals',
    value: function tokeniseSinglyQuotedStringLiterals(tokensOrContents) {}
  }, {
    key: 'reTokeniseMiddleOfCommentTokens',
    value: function reTokeniseMiddleOfCommentTokens(tokensOrContents) {}
  }], [{
    key: 'fromNothing',
    value: function fromNothing() {
      return CommonLexer.fromNothing(CustomGrammarBNFLexer);
    }
  }, {
    key: 'fromEntries',
    value: function fromEntries(entries) {
      return CommonLexer.fromEntries(CustomGrammarBNFLexer, entries);
    }
  }]);

  return CustomGrammarBNFLexer;
}(CommonLexer);

Object.assign(CustomGrammarBNFLexer, {
  entries: entries
});

module.exports = CustomGrammarBNFLexer;

},{"../bnf/entries":176,"../common/lexer":179}],215:[function(require,module,exports){
'use strict';

var entries = [{ "unassigned": "^.*$" }];

module.exports = entries;

},{}],216:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var entries = require('./entries'),
    CommonLexer = require('../common/lexer');

var CustomGrammarLexicalPatternLexer = function (_CommonLexer) {
  _inherits(CustomGrammarLexicalPatternLexer, _CommonLexer);

  function CustomGrammarLexicalPatternLexer() {
    _classCallCheck(this, CustomGrammarLexicalPatternLexer);

    return _possibleConstructorReturn(this, (CustomGrammarLexicalPatternLexer.__proto__ || Object.getPrototypeOf(CustomGrammarLexicalPatternLexer)).apply(this, arguments));
  }

  _createClass(CustomGrammarLexicalPatternLexer, [{
    key: 'tokeniseComments',
    value: function tokeniseComments(tokensOrContents, inComment) {
      return inComment;
    }
  }, {
    key: 'tokeniseDoublyQuotedStringLiterals',
    value: function tokeniseDoublyQuotedStringLiterals(tokensOrContents) {}
  }, {
    key: 'tokeniseSinglyQuotedStringLiterals',
    value: function tokeniseSinglyQuotedStringLiterals(tokensOrContents) {}
  }, {
    key: 'tokeniseRegularExpressions',
    value: function tokeniseRegularExpressions(tokensOrContents) {}
  }, {
    key: 'reTokeniseMiddleOfCommentTokens',
    value: function reTokeniseMiddleOfCommentTokens(tokensOrContents) {}
  }], [{
    key: 'fromNothing',
    value: function fromNothing() {
      return CommonLexer.fromNothing(CustomGrammarLexicalPatternLexer);
    }
  }, {
    key: 'fromEntries',
    value: function fromEntries(entries) {
      return CommonLexer.fromEntries(CustomGrammarLexicalPatternLexer, entries);
    }
  }]);

  return CustomGrammarLexicalPatternLexer;
}(CommonLexer);

Object.assign(CustomGrammarLexicalPatternLexer, {
  entries: entries
});

module.exports = CustomGrammarLexicalPatternLexer;

},{"../common/lexer":179,"./entries":215}],217:[function(require,module,exports){
'use strict';

var entries = [{ "special": ",|;|⊢|=|::|:|\\[|\\]|\\{|\\}|\\(|\\)|\\.\\.\\.|\\.\\." }, { "keyword": "^(?:Rule|Axiom|Theorem|Lemma|Metalemma|Metatheorem|Premises|Premise|Conclusion|Proof|Therefore|Suppose|Then|Hence|Types|Type|Variables|Variable|Contexts|Context|Constructors|Constructor|DependentTypes|DependentType|QualifiedMetavariables|QualifiedMetavariable|Metavariables|Metavariable|Abbreviations|Abbreviation|Object|Definition|for|let|from|by)$" }, { "unassigned": "^.*$" }];

module.exports = entries;

},{}],218:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var entries = require('./entries'),
    Rule = require('../common/rule'),
    Rules = require('../common/rules'),
    CommonLexer = require('../common/lexer'),
    SignificantEndOfLineTokens = require('../common/tokens/endOfLine/significant');

var FlorenceLexer = function (_CommonLexer) {
  _inherits(FlorenceLexer, _CommonLexer);

  function FlorenceLexer() {
    _classCallCheck(this, FlorenceLexer);

    return _possibleConstructorReturn(this, (FlorenceLexer.__proto__ || Object.getPrototypeOf(FlorenceLexer)).apply(this, arguments));
  }

  _createClass(FlorenceLexer, [{
    key: 'tokeniseEndOfLines',
    value: function tokeniseEndOfLines(tokensOrContents) {
      SignificantEndOfLineTokens.tokenise(tokensOrContents);
    }
  }, {
    key: 'tokeniseRegularExpressions',
    value: function tokeniseRegularExpressions(tokensOrContents) {}
  }, {
    key: 'tokeniseSinglyQuotedStringLiterals',
    value: function tokeniseSinglyQuotedStringLiterals(tokensOrContents) {}
  }], [{
    key: 'fromNothing',
    value: function fromNothing() {
      return CommonLexer.fromNothing(FlorenceLexer);
    }
  }, {
    key: 'fromEntries',
    value: function fromEntries(entries) {
      return CommonLexer.fromEntries(FlorenceLexer, entries);
    }
  }, {
    key: 'fromCombinedCustomGrammarsLexicalPattern',
    value: function fromCombinedCustomGrammarsLexicalPattern(combinedCustomGrammarsLexicalPattern) {
      var florenceLexer = FlorenceLexer.fromEntriesAndCombinedCustomGrammarsLexicalPattern(entries, combinedCustomGrammarsLexicalPattern);

      return florenceLexer;
    }
  }, {
    key: 'fromEntriesAndCombinedCustomGrammarsLexicalPattern',
    value: function fromEntriesAndCombinedCustomGrammarsLexicalPattern(entries, combinedCustomGrammarsLexicalPattern) {
      var custom = combinedCustomGrammarsLexicalPattern,
          ///
      customGrammarEntry = {
        custom: custom
      },
          customGrammarRule = Rule.fromEntry(customGrammarEntry),
          rules = Rules.fromEntries(entries);

      rules.addRule(customGrammarRule);

      var florenceLexer = new FlorenceLexer(rules);

      return florenceLexer;
    }
  }]);

  return FlorenceLexer;
}(CommonLexer);

Object.assign(FlorenceLexer, {
  entries: entries
});

module.exports = FlorenceLexer;

},{"../common/lexer":179,"../common/rule":180,"../common/rules":181,"../common/tokens/endOfLine/significant":204,"./entries":217}],219:[function(require,module,exports){
'use strict';

var entries = [{ "special": "\\$\\$|\\$|\\\\\\(|\\\\\\)|\\\\\\[|\\\\\\]" }, { "unassigned": "^.*$" }];

module.exports = entries;

},{}],220:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var entries = require('./entries'),
    CommonLexer = require('../common/lexer');

var LaTeXLexer = function (_CommonLexer) {
  _inherits(LaTeXLexer, _CommonLexer);

  function LaTeXLexer() {
    _classCallCheck(this, LaTeXLexer);

    return _possibleConstructorReturn(this, (LaTeXLexer.__proto__ || Object.getPrototypeOf(LaTeXLexer)).apply(this, arguments));
  }

  _createClass(LaTeXLexer, [{
    key: 'tokeniseRegularExpressions',
    value: function tokeniseRegularExpressions(tokensOrContents) {}
  }], [{
    key: 'fromNothing',
    value: function fromNothing() {
      return CommonLexer.fromNothing(LaTeXLexer);
    }
  }, {
    key: 'fromEntries',
    value: function fromEntries(entries) {
      return CommonLexer.fromEntries(LaTeXLexer, entries);
    }
  }]);

  return LaTeXLexer;
}(CommonLexer);

Object.assign(LaTeXLexer, {
  entries: entries
});

module.exports = LaTeXLexer;

},{"../common/lexer":179,"./entries":219}],221:[function(require,module,exports){
'use strict';

var entries = [{ "special": ",|:|\\[|\\]|\\{|\\}" }, { "unassigned": "^.*$" }];

module.exports = entries;

},{}],222:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var entries = require('./entries'),
    CommonLexer = require('../common/lexer');

var MetaJSONLexer = function (_CommonLexer) {
  _inherits(MetaJSONLexer, _CommonLexer);

  function MetaJSONLexer() {
    _classCallCheck(this, MetaJSONLexer);

    return _possibleConstructorReturn(this, (MetaJSONLexer.__proto__ || Object.getPrototypeOf(MetaJSONLexer)).apply(this, arguments));
  }

  _createClass(MetaJSONLexer, [{
    key: 'tokeniseComments',
    value: function tokeniseComments(tokensOrContents, inComment) {}
  }, {
    key: 'tokeniseSinglyQuotedStringLiterals',
    value: function tokeniseSinglyQuotedStringLiterals(tokensOrContents) {}
  }, {
    key: 'reTokeniseMiddleOfCommentTokens',
    value: function reTokeniseMiddleOfCommentTokens(tokensOrContents) {}
  }], [{
    key: 'fromEntries',
    value: function fromEntries(entries) {
      return CommonLexer.fromEntries(MetaJSONLexer, entries);
    }
  }, {
    key: 'fromNothing',
    value: function fromNothing() {
      return CommonLexer.fromNothing(MetaJSONLexer);
    }
  }]);

  return MetaJSONLexer;
}(CommonLexer);

Object.assign(MetaJSONLexer, {
  entries: entries
});

module.exports = MetaJSONLexer;

},{"../common/lexer":179,"./entries":221}],223:[function(require,module,exports){
'use strict';

var entries = [{ "unassigned": "^.*$" }];

module.exports = entries;

},{}],224:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var entries = require('./entries'),
    CommonLexer = require('../common/lexer');

var PlainLexer = function (_CommonLexer) {
  _inherits(PlainLexer, _CommonLexer);

  function PlainLexer() {
    _classCallCheck(this, PlainLexer);

    return _possibleConstructorReturn(this, (PlainLexer.__proto__ || Object.getPrototypeOf(PlainLexer)).apply(this, arguments));
  }

  _createClass(PlainLexer, [{
    key: 'tokeniseComments',
    value: function tokeniseComments(tokensOrContents, inComment) {
      return inComment;
    }
  }, {
    key: 'tokeniseDoublyQuotedStringLiterals',
    value: function tokeniseDoublyQuotedStringLiterals(tokensOrContents) {}
  }, {
    key: 'tokeniseSinglyQuotedStringLiterals',
    value: function tokeniseSinglyQuotedStringLiterals(tokensOrContents) {}
  }, {
    key: 'tokeniseRegularExpressions',
    value: function tokeniseRegularExpressions(tokensOrContents) {}
  }, {
    key: 'reTokeniseMiddleOfCommentTokens',
    value: function reTokeniseMiddleOfCommentTokens(tokensOrContents) {}
  }], [{
    key: 'fromEntries',
    value: function fromEntries(entries) {
      return CommonLexer.fromEntries(PlainLexer, entries);
    }
  }, {
    key: 'fromNothing',
    value: function fromNothing() {
      return CommonLexer.fromNothing(PlainLexer);
    }
  }]);

  return PlainLexer;
}(CommonLexer);

Object.assign(PlainLexer, {
  entries: entries
});

module.exports = PlainLexer;

},{"../common/lexer":179,"./entries":223}],225:[function(require,module,exports){
arguments[4][166][0].apply(exports,arguments)
},{"./lib/utilities/array":226,"./lib/utilities/asynchronous":227,"./lib/utilities/fileSystem":228,"./lib/utilities/miscellaneous":229,"./lib/utilities/path":235,"./lib/utilities/template":236,"dup":166}],226:[function(require,module,exports){
'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function first(array) {
  return array[0];
}

function second(array) {
  return array[1];
}

function third(array) {
  return array[2];
}

function fourth(array) {
  return array[3];
}

function fifth(array) {
  return array[4];
}

function fifthLast(array) {
  return array[array.length - 5];
}

function fourthLast(array) {
  return array[array.length - 4];
}

function thirdLast(array) {
  return array[array.length - 3];
}

function secondLast(array) {
  return array[array.length - 2];
}

function last(array) {
  return array[array.length - 1];
}

function tail(array) {
  return array.slice(1);
}

function push(array1, array2) {
  Array.prototype.push.apply(array1, array2);
}

function unshift(array1, array2) {
  Array.prototype.unshift.apply(array1, array2);
}

function concat(array1, elementOrArray2) {
  var array2 = elementOrArray2 instanceof Array ? elementOrArray2 : [elementOrArray2];

  push(array1, array2);
}

function clear(array) {
  var start = 0;

  return array.splice(start);
}

function copy(array1, array2) {
  var start = 0,
      deleteCount = array2.length; ///

  splice(array1, start, deleteCount, array2);
}

function merge(array1, array2) {
  var start = array2.length,
      ///
  deleteCount = 0;

  splice(array1, start, deleteCount, array2);
}

function splice(array1, start) {
  var deleteCount = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Infinity;
  var array2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

  var args = [start, deleteCount].concat(_toConsumableArray(array2)),
      deletedItemsArray = Array.prototype.splice.apply(array1, args);

  return deletedItemsArray;
}

function replace(array, element, test) {
  var start = -1;

  var found = array.some(function (element, index) {
    var passed = test(element, index);

    if (passed) {
      start = index; ///

      return true;
    }
  });

  if (found) {
    var deleteCount = 1;

    array.splice(start, deleteCount, element);
  }

  return found;
}

function filter(array, test) {
  var filteredElements = [];

  backwardsForEach(array, function (element, index) {
    var passed = test(element, index);

    if (!passed) {
      var start = index,
          ///
      deleteCount = 1,
          deletedElements = array.splice(start, deleteCount),
          firstDeletedElement = first(deletedElements);

      filteredElements.unshift(firstDeletedElement); ///
    }
  });

  return filteredElements;
}

function find(array, test) {
  var elements = [];

  forwardsForEach(array, function (element, index) {
    var passed = test(element, index);

    if (passed) {
      elements.push(element);
    }
  });

  return elements;
}

function prune(array, test) {
  var prunedElement = undefined;

  array.some(function (element, index) {
    var passed = test(element, index);

    if (!passed) {
      var start = index,
          ///
      deleteCount = 1,
          deletedElements = array.splice(start, deleteCount),
          firstDeletedElement = first(deletedElements);

      prunedElement = firstDeletedElement; ///

      return true;
    }
  });

  return prunedElement;
}

function patch(array, element, test) {
  var found = array.some(function (element, index) {
    var passed = test(element, index);

    if (passed) {
      return true;
    }
  });

  if (found) {
    array.push(element);
  }

  return found;
}

function augment(array1, array2, test) {
  array2.forEach(function (element, index) {
    var passed = test(element, index);

    if (passed) {
      array1.push(element);
    }
  });
}

function separate(array, array1, array2, test) {
  array.forEach(function (element, index) {
    var passed = test(element, index);

    passed ? array1.push(element) : array2.push(element);
  });
}

function forwardsSome(array, callback) {
  var arrayLength = array.length;

  for (var index = 0; index < arrayLength; index++) {
    var element = array[index],
        result = callback(element, index);

    if (result) {
      return true;
    }
  }

  return false;
}

function backwardsSome(array, callback) {
  var arrayLength = array.length;

  for (var index = arrayLength - 1; index >= 0; index--) {
    var element = array[index],
        result = callback(element, index);

    if (result) {
      return true;
    }
  }

  return false;
}

function forwardsEvery(array, callback) {
  var arrayLength = array.length;

  for (var index = 0; index < arrayLength; index++) {
    var element = array[index],
        result = callback(element, index);

    if (!result) {
      return false;
    }
  }

  return true;
}

function backwardsEvery(array, callback) {
  var arrayLength = array.length;

  for (var index = arrayLength - 1; index >= 0; index--) {
    var element = array[index],
        result = callback(element, index);

    if (!result) {
      return false;
    }
  }

  return true;
}

function forwardsReduce(array, callback, initialValue) {
  var value = initialValue;

  forwardsForEach(array, function (element, index) {
    value = callback(value, element, index);
  });

  return value;
}

function backwardsReduce(array, callback, initialValue) {
  var value = initialValue;

  backwardsForEach(array, function (element, index) {
    value = callback(value, element, index);
  });

  return value;
}

function forwardsForEach(array, callback) {
  var arrayLength = array.length;

  for (var index = 0; index < arrayLength; index++) {
    var element = array[index];

    callback(element, index);
  }
}

function backwardsForEach(array, callback) {
  var arrayLength = array.length;

  for (var index = arrayLength - 1; index >= 0; index--) {
    var element = array[index];

    callback(element, index);
  }
}

module.exports = {
  first: first,
  second: second,
  third: third,
  fourth: fourth,
  fifth: fifth,
  fifthLast: fifthLast,
  fourthLast: fourthLast,
  thirdLast: thirdLast,
  secondLast: secondLast,
  last: last,
  tail: tail,
  push: push,
  unshift: unshift,
  concat: concat,
  clear: clear,
  copy: copy,
  merge: merge,
  splice: splice,
  replace: replace,
  filter: filter,
  find: find,
  prune: prune,
  patch: patch,
  augment: augment,
  separate: separate,
  forwardsSome: forwardsSome,
  backwardsSome: backwardsSome,
  forwardsEvery: forwardsEvery,
  backwardsEvery: backwardsEvery,
  forwardsReduce: forwardsReduce,
  backwardsReduce: backwardsReduce,
  forwardsForEach: forwardsForEach,
  backwardsForEach: backwardsForEach
};

},{}],227:[function(require,module,exports){
'use strict';

function whilst(callback, done, context) {
  var count = -1;

  function next() {
    count++;

    var index = count,
        ///
    terminate = callback(next, done, context, index);

    if (terminate) {
      done();
    }
  }

  next();
}

function forEach(array, callback, done, context) {
  var length = array.length; ///

  var count = -1;

  function next() {
    count++;

    var terminate = count === length;

    if (terminate) {
      done();
    } else {
      var index = count,
          ///
      element = array[index];

      callback(element, next, done, context, index);
    }
  }

  next();
}

function sequence(callbacks, done, context) {
  var length = callbacks.length; ///

  var count = -1;

  function next() {
    count++;

    var terminate = count === length;

    if (terminate) {
      done();
    } else {
      var index = count,
          ///
      callback = callbacks[index];

      callback(next, done, context, index);
    }
  }

  next();
}

function eventually(callbacks, done, context) {
  var length = callbacks.length; ///

  var count = 0;

  function next() {
    count++;

    var terminate = count === length;

    if (terminate) {
      done();
    }
  }

  callbacks.forEach(function (callback, index) {
    callback(next, done, context, index);
  });
}

function repeatedly(callback, length, done, context) {
  var count = 0;

  function next() {
    count++;

    var terminate = count === length;

    if (terminate) {
      done();
    }
  }

  for (var index = 0; index < length; index++) {
    callback(next, done, context, index);
  }
}

function forwardsForEach(array, callback, done, context) {
  var length = array.length; ///

  var count = -1;

  function next() {
    count++;

    var terminate = count === length;

    if (terminate) {
      done();
    } else {
      var index = count,
          ///
      element = array[index];

      callback(element, next, done, context, index);
    }
  }

  next();
}

function backwardsForEach(array, callback, done, context) {
  var length = array.length; ///

  var count = length;

  function next() {
    count--;

    var terminate = count === -1;

    if (terminate) {
      done();
    } else {
      var index = count,
          ///
      element = array[index];

      callback(element, next, done, context, index);
    }
  }

  next();
}

module.exports = {
  whilst: whilst,
  forEach: forEach,
  sequence: sequence,
  eventually: eventually,
  repeatedly: repeatedly,
  forwardsForEach: forwardsForEach,
  backwardsForEach: backwardsForEach
};

},{}],228:[function(require,module,exports){
'use strict';

var fs = require('fs');

function checkEntryExists(absolutePath) {
  var entryExists = fs.existsSync(absolutePath);

  return entryExists;
}

function checkFileExists(absoluteFilePath) {
  var fileExists = false;

  var absolutePath = absoluteFilePath,
      ///
  entryExists = checkEntryExists(absolutePath);

  if (entryExists) {
    var entryFile = isEntryFile(absolutePath);

    if (entryFile) {
      fileExists = true;
    }
  }

  return fileExists;
}

function checkDirectoryExists(absoluteDirectoryPath) {
  var directoryExists = false;

  var absolutePath = absoluteDirectoryPath,
      ///
  entryExists = checkEntryExists(absolutePath);

  if (entryExists) {
    var entryDirectory = isEntryDirectory(absolutePath);

    if (entryDirectory) {
      directoryExists = true;
    }
  }

  return directoryExists;
}

function isEntryFile(absolutePath) {
  var stat = fs.statSync(absolutePath),
      entryDirectory = stat.isDirectory(),
      entryFile = !entryDirectory;

  return entryFile;
}

function isEntryDirectory(absolutePath) {
  var stat = fs.statSync(absolutePath),
      entryDirectory = stat.isDirectory();

  return entryDirectory;
}

function isDirectoryEmpty(absoluteDirectoryPath) {
  var subEntryNames = readDirectory(absoluteDirectoryPath),
      subEntryNamesLength = subEntryNames.length,
      directoryEmpty = subEntryNamesLength === 0;

  return directoryEmpty;
}

function readDirectory(absoluteDirectoryPath) {
  var subEntryNames = fs.readdirSync(absoluteDirectoryPath);

  return subEntryNames;
}

function readFile(absoluteFilePath) {
  var encoding = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'utf8';

  var options = {
    encoding: encoding
  },
      content = fs.readFileSync(absoluteFilePath, options);

  return content;
}

function writeFile(absoluteFilePath, content) {
  fs.writeFileSync(absoluteFilePath, content);
}

function appendToFile(absoluteFilePath, content) {
  fs.appendFileSync(absoluteFilePath, content);
}

function renameFile(oldAbsoluteFilePath, newAbsoluteFilePath) {
  fs.renameSync(oldAbsoluteFilePath, newAbsoluteFilePath);
}

function getStats(absoluteFilePath) {
  return fs.statSync(absoluteFilePath);
}

module.exports = {
  checkEntryExists: checkEntryExists,
  checkFileExists: checkFileExists,
  checkDirectoryExists: checkDirectoryExists,
  isEntryFile: isEntryFile,
  isEntryDirectory: isEntryDirectory,
  isDirectoryEmpty: isDirectoryEmpty,
  readDirectory: readDirectory,
  readFile: readFile,
  writeFile: writeFile,
  appendToFile: appendToFile,
  renameFile: renameFile,
  getStats: getStats
};

},{"fs":101}],229:[function(require,module,exports){
'use strict';

var rc = require('./miscellaneous/rc'),
    log = require('./miscellaneous/log'),
    ajax = require('./miscellaneous/ajax'),
    onETX = require('./miscellaneous/onETX'),
    prompt = require('./miscellaneous/prompt');

var get = ajax.get,
    post = ajax.post;


module.exports = {
  log: log,
  rc: rc,
  get: get,
  post: post,
  onETX: onETX,
  prompt: prompt
};

},{"./miscellaneous/ajax":230,"./miscellaneous/log":231,"./miscellaneous/onETX":232,"./miscellaneous/prompt":233,"./miscellaneous/rc":234}],230:[function(require,module,exports){
'use strict';

var GET_METHOD = 'GET',
    POST_METHOD = 'POST';

function get(host, uri, parameters, callback) {
  if (callback === undefined) {
    callback = parameters; ///
    parameters = {};
  }

  var method = GET_METHOD,
      body = undefined;

  request(host, uri, parameters, method, body, callback);
}

function post(host, uri, json, parameters, callback) {
  if (callback === undefined) {
    callback = parameters; ///
    parameters = {};
  }

  var method = POST_METHOD,
      body = JSON.stringify(json);

  request(host, uri, parameters, method, body, callback);
}

module.exports = {
  get: get,
  post: post
};

function request(host, uri, parameters, method, body, callback) {
  var url = urlFromHostURIAndParameters(host, uri, parameters),
      xmlHttpRequest = new XMLHttpRequest();

  xmlHttpRequest.onreadystatechange = function () {
    var readyState = xmlHttpRequest.readyState,
        status = xmlHttpRequest.status,
        responseText = xmlHttpRequest.responseText;


    if (readyState == 4) {
      if (status == 200) {
        var jsonString = responseText,
            ///
        json = JSON.parse(jsonString);

        callback(json);
      } else {
        callback(null);
      }
    }
  };

  xmlHttpRequest.open(method, url, true);

  xmlHttpRequest.setRequestHeader('content-type', 'application/json;charset=UTF-8');

  xmlHttpRequest.send(body);
}

function urlFromHostURIAndParameters(host, uri, parameters) {
  var queryString = queryStringFromParameters(parameters),
      url = queryString === '' ? '' + host + uri : '' + host + uri + '?' + queryString;

  return url;
}

function queryStringFromParameters(parameters) {
  var names = Object.keys(parameters),
      namesLength = names.length,
      lastIndex = namesLength - 1,
      queryString = names.reduce(function (queryString, name, index) {
    var value = parameters[name],
        encodedName = encodeURIComponent(name),
        encodedValue = encodeURIComponent(value),
        ampersandOrNothing = index !== lastIndex ? '&' : '';

    queryString += encodedName + '=' + encodedValue + ampersandOrNothing;

    return queryString;
  }, '');

  return queryString;
}

},{}],231:[function(require,module,exports){
'use strict';

var path = require('path');

var pathUtilities = require('../../utilities/path'),
    arrayUtilities = require('../../utilities/array'),
    fileSystemUtilities = require('../../utilities/fileSystem');

var second = arrayUtilities.second,
    concatenatePaths = pathUtilities.concatenatePaths,
    checkFileExists = fileSystemUtilities.checkFileExists,
    readFile = fileSystemUtilities.readFile,
    appendToFile = fileSystemUtilities.appendToFile,
    renameFile = fileSystemUtilities.renameFile,
    getStats = fileSystemUtilities.getStats;


var TRACE = 'TRACE',
    DEBUG = 'DEBUG',
    INFO = 'INFO',
    WARNING = 'WARNING',
    ERROR = 'ERROR',
    FATAL = 'FATAL';

var logLevel = WARNING,
    logFileBaseName = 'default',
    logDirectoryPath = null;

function log(message) {
  var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  var pertinentStackMessageIndex = 2;

  var levels = [TRACE, DEBUG, INFO, WARNING, ERROR, FATAL];

  if (level) {
    ///
    var levelIndex = levels.indexOf(level),
        logLevelIndex = levels.indexOf(logLevel);

    if (levelIndex < logLevelIndex) {
      return;
    }

    pertinentStackMessageIndex += 1;

    level = level + ' '; ///
  }

  var error = new Error(),
      stack = error.stack,
      stackMessages = stack.split(/\r\n|\n/),
      pertinentStackMessage = stackMessages[pertinentStackMessageIndex],
      currentDateAndTimeString = getCurrentDateAndTimeString(),
      filePath = filePathFromStackMessage(pertinentStackMessage),
      lineNumber = lineNumberFromStackMessage(pertinentStackMessage),
      logMessage = '' + level + currentDateAndTimeString + ' ' + filePath + '(' + lineNumber + ') ' + message;


  console.log(logMessage);

  if (logDirectoryPath !== null) {
    rollOverLogFile();

    var logFilePath = getLogFilePath(),
        logFileContent = logMessage + '\n';

    appendToFile(logFilePath, logFileContent);
  }

  return logMessage;
}

function trace(message) {
  return log(message, TRACE);
}

function debug(message) {
  return log(message, DEBUG);
}

function info(message) {
  return log(message, INFO);
}

function warning(message) {
  return log(message, WARNING);
}

function error(message) {
  return log(message, ERROR);
}

function fatal(message) {
  return log(message, FATAL);
}

function setLogLevel(level) {
  logLevel = level;
}

function setLogFileBaseName(fileBaseName) {
  logFileBaseName = fileBaseName;
}

function setLogDirectoryPath(directoryPath) {
  logDirectoryPath = directoryPath;
}

function getLogFileContent() {
  var logFilePath = getLogFilePath(),
      logFileContent = readFile(logFilePath);

  return logFileContent;
}

Object.assign(log, {
  TRACE: TRACE,
  DEBUG: DEBUG,
  INFO: INFO,
  WARNING: WARNING,
  ERROR: ERROR,
  FATAL: FATAL,
  trace: trace,
  debug: debug,
  info: info,
  warning: warning,
  error: error,
  fatal: fatal,
  setLogLevel: setLogLevel,
  setLogFileBaseName: setLogFileBaseName,
  setLogDirectoryPath: setLogDirectoryPath,
  getLogFileContent: getLogFileContent
});

module.exports = log;

function getLogFilePath() {
  var logFileName = logFileBaseName + '.log',
      logFilePath = concatenatePaths(logDirectoryPath, logFileName);

  return logFilePath;
}

function getRolledOverLogFilePath() {
  var currentDateString = getCurrentDateString(),
      rolledOverLogFileName = logFileBaseName + '.' + currentDateString + '.log',
      rolledOverLogFilePath = concatenatePaths(logDirectoryPath, rolledOverLogFileName);

  return rolledOverLogFilePath;
}

function getLogFileLastModifiedDate() {
  var logFilePath = getLogFilePath(),
      logFileStats = getStats(logFilePath),
      mtime = logFileStats.mtime,
      logFileLastModifiedDate = new Date(mtime); ///

  return logFileLastModifiedDate;
}

function rollOverLogFile() {
  var logFilePath = getLogFilePath(),
      logFileExists = checkFileExists(logFilePath);

  if (!logFileExists) {
    return;
  }

  var logFileLastModifiedDate = getLogFileLastModifiedDate(),
      logFileLastModifiedDateCurrentDate = isDateCurrentDate(logFileLastModifiedDate);

  if (!logFileLastModifiedDateCurrentDate) {
    var rolledOverLogFilePath = getRolledOverLogFilePath();

    renameFile(logFilePath, rolledOverLogFilePath);
  }
}

function isDateCurrentDate(date) {
  var currentDate = new Date(),
      dateString = date.toDateString(),
      currentDateString = currentDate.toDateString(),
      dateCurrentDate = dateString === currentDateString;

  return dateCurrentDate;
}

function getCurrentDateString() {
  var date = new Date(),
      day = padStartWithZeroes(date.getDate(), 2),
      ///
  month = padStartWithZeroes(date.getMonth() + 1, 2),
      ///
  year = date.getFullYear(),
      currentDateAndTimeString = day + '-' + month + '-' + year;

  return currentDateAndTimeString;
}

function getCurrentDateAndTimeString() {
  var date = new Date(),
      day = padStartWithZeroes(date.getDate(), 2),
      ///
  month = padStartWithZeroes(date.getMonth() + 1, 2),
      ///
  year = date.getFullYear(),
      hours = padStartWithZeroes(date.getHours(), 2),
      minutes = padStartWithZeroes(date.getMinutes(), 2),
      seconds = padStartWithZeroes(date.getSeconds(), 2),
      milliseconds = padStartWithZeroes(date.getMilliseconds(), 3),
      currentDateAndTimeString = day + '-' + month + '-' + year + ' ' + hours + ':' + minutes + ':' + seconds + '.' + milliseconds;

  return currentDateAndTimeString;
}

function filePathFromStackMessage(stackMessage) {
  var matches = stackMessage.match(/(\/.+)\:\d+\:\d+/),
      secondMatch = second(matches),
      absoluteFilePath = secondMatch,
      ///
  currentWorkingDirectoryPath = path.resolve('.'),
      ///
  currentWorkingDirectoryPathLength = currentWorkingDirectoryPath.length,
      start = currentWorkingDirectoryPathLength + 1,
      ///
  filePath = absoluteFilePath.substr(start);

  return filePath;
}

function lineNumberFromStackMessage(stackMessage) {
  var matches = stackMessage.match(/\:(\d+)/),
      secondMatch = second(matches),
      lineNumber = secondMatch; ///

  return lineNumber;
}

function padStartWithZeroes(string, targetLength) {
  var padString = '0',
      paddedString = padStart(string, targetLength, padString);

  return paddedString;
}

function padStart(string, targetLength, padString) {
  var padding = '';

  for (var index = 0; index < targetLength; index++) {
    padding += padString;
  }

  var paddedString = ('' + padding + string).substr(-targetLength);

  return paddedString;
}

},{"../../utilities/array":226,"../../utilities/fileSystem":228,"../../utilities/path":235,"path":237}],232:[function(require,module,exports){
(function (process){
'use strict';

var ETX_CHARACTER = '\x03';

function onETX(handler) {
  var _process = process,
      stdin = _process.stdin,
      setRawMode = stdin.setRawMode;


  if (setRawMode) {
    var rawMode = true,
        encoding = 'utf8';

    stdin.setRawMode(rawMode);
    stdin.setEncoding(encoding);

    stdin.resume();

    stdin.addListener('data', dataHandler);

    return offExt;
  }

  function offExt() {
    stdin.removeListener('data', dataHandler);
  }

  function dataHandler(character) {
    if (character === ETX_CHARACTER) {
      handler();
    }
  }
}

module.exports = onETX;

}).call(this,require('_process'))

},{"_process":238}],233:[function(require,module,exports){
(function (process){
'use strict';

var onETX = require('./onETX'),
    asynchronousUtilities = require('../../utilities/asynchronous');

var _process = process,
    stdin = _process.stdin,
    stdout = _process.stdout,
    whilst = asynchronousUtilities.whilst,
    _process2 = process,
    exit = _process2.exit;


var BACKSPACE_CHARACTER = String.fromCharCode(127),
    LINE_FEED_CHARACTER = '\n',
    CARRIAGE_RETURN_CHARACTER = '\r';

function prompt(options, callback) {
  var value = null,
      _options$attempts = options.attempts,
      attempts = _options$attempts === undefined ? 3 : _options$attempts,
      context = {
    value: value,
    attempts: attempts,
    options: options
  };


  whilst(attempt, function () {
    var value = context.value;


    callback(value);
  }, context);
}

module.exports = prompt;

function attempt(next, done, context) {
  var attempts = context.attempts;


  var terminate = attempts-- === 0;

  if (terminate) {
    done();

    return;
  }

  var options = context.options,
      description = options.description,
      errorMessage = options.errorMessage,
      validationPattern = options.validationPattern,
      validationFunction = options.validationFunction,
      _options$encoding = options.encoding,
      encoding = _options$encoding === undefined ? 'utf8' : _options$encoding,
      _options$hidden = options.hidden,
      hidden = _options$hidden === undefined ? false : _options$hidden;


  hidden ? hiddenInput(description, encoding, callback) : visibleInput(description, encoding, callback);

  function callback(value) {
    var valid = validationFunction ? ///
    validationFunction(value) : validationPattern.test(value);

    if (valid) {
      Object.assign(context, {
        value: value
      });

      done();
    } else {
      console.log(errorMessage);

      Object.assign(context, {
        attempts: attempts
      });

      next();
    }
  }
}

function visibleInput(description, encoding, callback) {
  var rawMode = false;

  stdout.write(description);

  stdin.setEncoding(encoding);

  stdin.setRawMode(rawMode);

  stdin.resume();

  var value = void 0;

  var listener = function listener(chunk) {
    value = chunk.trim();

    stdin.removeListener('data', listener);

    stdin.pause();

    callback(value);
  };

  stdin.on('data', listener);
}

function hiddenInput(description, encoding, callback) {
  var rawMode = true,
      offETX = onETX(function () {
    console.log('^C');

    exit();
  });

  stdout.write(description);

  stdin.setEncoding(encoding);

  stdin.setRawMode(rawMode);

  stdin.resume();

  var value = '';

  var listener = function listener(chunk) {
    var character = chunk.toString(encoding);

    switch (character) {
      case LINE_FEED_CHARACTER:
      case CARRIAGE_RETURN_CHARACTER:
        stdout.write(LINE_FEED_CHARACTER);

        stdin.removeListener('data', listener);

        stdin.pause();

        offETX();

        callback(value);
        break;

      case BACKSPACE_CHARACTER:
        value = truncate(value);

        stdout.clearLine();

        stdout.cursorTo(0);

        stdout.write(description);
        break;

      default:
        value += character;
        break;
    }
  };

  stdin.on('data', listener);
}

function truncate(value) {
  return value.slice(0, value.length - 1);
}

}).call(this,require('_process'))

},{"../../utilities/asynchronous":227,"./onETX":232,"_process":238}],234:[function(require,module,exports){
'use strict';

var path = require('path');

var arrayUtilities = require('../../utilities/array'),
    fileSystemUtilities = require('../../utilities/fileSystem');

var first = arrayUtilities.first,
    second = arrayUtilities.second,
    readFile = fileSystemUtilities.readFile,
    writeFile = fileSystemUtilities.writeFile,
    checkFileExists = fileSystemUtilities.checkFileExists;


var rcBaseExtension = '';

function rc() {
  var environmentNameOrArgv = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

  var environment = void 0,
      environmentName = void 0,
      environmentNameOrArgvArgv = environmentNameOrArgv instanceof Array;

  if (environmentNameOrArgvArgv) {
    var argv = environmentNameOrArgv; ///

    environmentName = environmentNameFromArgv(argv);
  } else {
    environmentName = environmentNameOrArgv; ///
  }

  var json = readRCFile(),
      environments = json.environments;


  if (environmentName === null) {
    var firstEnvironment = first(environments);

    environment = firstEnvironment; ///
  } else {
    environment = environments.find(function (environment) {
      var name = environment.name,
          found = name === environmentName;


      return found;
    });
  }

  delete environment.name;

  Object.assign(rc, environment);

  return environment;
}

function readRCFile() {
  var absoluteRCFilePath = absoluteRCFilePathFromNothing(),
      fileContent = readFile(absoluteRCFilePath),
      json = JSON.parse(fileContent);

  return json;
}

function writeRCFile(json) {
  var absoluteRCFilePath = absoluteRCFilePathFromNothing(),
      fileContent = JSON.stringify(json, null, '\t');

  writeFile(absoluteRCFilePath, fileContent);
}

function updateRCFile(addedProperties) {
  var json = readRCFile();

  if (addedProperties) {
    Object.assign(json, addedProperties);
  }

  for (var _len = arguments.length, deletedPropertyNames = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    deletedPropertyNames[_key - 1] = arguments[_key];
  }

  deletedPropertyNames.forEach(function (deletedPropertyName) {
    delete json[deletedPropertyName];
  });

  writeRCFile(json);
}

function checkRCFileExists() {
  var absoluteRCFilePath = absoluteRCFilePathFromNothing(),
      rcFileExists = checkFileExists(absoluteRCFilePath);

  return rcFileExists;
}

function createVacuousRCFile() {
  var json = {
    "environments": [{}]
  };

  writeRCFile(json);
}

function setRCBaseExtension(baseExtension) {
  rcBaseExtension = baseExtension;
}

Object.assign(rc, {
  readRCFile: readRCFile,
  writeRCFile: writeRCFile,
  updateRCFile: updateRCFile,
  checkRCFileExists: checkRCFileExists,
  createVacuousRCFile: createVacuousRCFile,
  setRCBaseExtension: setRCBaseExtension
});

module.exports = rc;

function environmentNameFromArgv(argv) {
  var environmentName = null;

  argv.find(function (argument) {
    ///
    var matches = argument.match(/\-\-environment=(.+)/),
        found = matches !== null;

    if (found) {
      var secondMatch = second(matches);

      environmentName = secondMatch;
    }

    return found;
  });

  return environmentName;
}

function absoluteRCFilePathFromNothing() {
  var filePath = './.' + rcBaseExtension + 'rc',
      absoluteRCFilePath = path.resolve(filePath);

  return absoluteRCFilePath;
}

},{"../../utilities/array":226,"../../utilities/fileSystem":228,"path":237}],235:[function(require,module,exports){
'use strict';

var array = require('./array');

var first = array.first,
    second = array.second,
    last = array.last;


function isPathRelativePath(path) {
  var position = path.search(/^\.{1,2}\//),
      pathRelativePath = position !== -1;

  return pathRelativePath;
}

function isPathAbsolutePath(path) {
  var pathRelativePath = isPathRelativePath(path),
      pathAbsolutePath = !pathRelativePath; ///

  return pathAbsolutePath;
}

function isPathTopmostDirectoryName(path) {
  var position = path.search(/^[^\/]+\/?$/),
      pathTopmostDirectoryName = position !== -1;

  return pathTopmostDirectoryName;
}

function isTopmostDirectoryNameContainedInPath(topmostDirectoryName, path) {
  topmostDirectoryName = topmostDirectoryName.replace(/\/$/, ''); ///

  var regExp = new RegExp('^' + topmostDirectoryName + '(?:\\/.+)?$'),
      position = path.search(regExp),
      topmostDirectoryNameContainedInFilePath = position !== -1;

  return topmostDirectoryNameContainedInFilePath;
}

function combinePaths(directoryPath, relativePath) {
  var absolutePath = null;

  var directoryPathSubEntryNames = directoryPath.split('/'),
      relativeFilePathSubEntryNames = relativePath.split('/');

  var firstRelativeFilePathSubEntryName = first(relativeFilePathSubEntryNames),
      lastDirectoryPathSubEntryName = void 0;

  if (firstRelativeFilePathSubEntryName === '.') {
    relativeFilePathSubEntryNames.shift();
  }

  firstRelativeFilePathSubEntryName = first(relativeFilePathSubEntryNames);
  lastDirectoryPathSubEntryName = last(directoryPathSubEntryNames);

  while (firstRelativeFilePathSubEntryName === '..' && lastDirectoryPathSubEntryName !== undefined) {
    relativeFilePathSubEntryNames.shift();
    directoryPathSubEntryNames.pop();

    firstRelativeFilePathSubEntryName = first(relativeFilePathSubEntryNames);
    lastDirectoryPathSubEntryName = last(directoryPathSubEntryNames);
  }

  if (lastDirectoryPathSubEntryName !== undefined) {
    var absoluteFilePathSubEntryNames = [].concat(directoryPathSubEntryNames).concat(relativeFilePathSubEntryNames);

    absolutePath = absoluteFilePathSubEntryNames.join('/');
  }

  return absolutePath;
}

function concatenatePaths(path1, path2) {
  path1 = path1.replace(/\/$/, ''); ///

  var combinedPath = path1 + '/' + path2;

  return combinedPath;
}

function bottommostNameFromPath(path) {
  var bottommostName = null;

  var matches = path.match(/^.+\/([^\/]+\/?)$/);

  if (matches !== null) {
    var secondMatch = second(matches);

    bottommostName = secondMatch; ///
  }

  return bottommostName;
}

function topmostDirectoryPathFromPath(path) {
  var matches = path.match(/^(.+)\/[^\/]+\/?$/),
      secondMatch = second(matches),
      directoryPath = secondMatch; ///

  return directoryPath;
}

function topmostDirectoryNameFromPath(path) {
  var topmostDirectoryName = null;

  var matches = path.match(/^([^\/]+)\/.+$/);

  if (matches !== null) {
    var secondMatch = second(matches);

    topmostDirectoryName = secondMatch; ///
  }

  return topmostDirectoryName;
}

function pathWithoutBottommostNameFromPath(path) {
  var pathWithoutBottommostName = null;

  var matches = path.match(/(^.+)\/[^\/]+\/?$/);

  if (matches !== null) {
    var secondMatch = second(matches);

    pathWithoutBottommostName = secondMatch; ///
  }

  return pathWithoutBottommostName;
}

function pathWithoutTopmostDirectoryNameFromPath(path) {
  var pathWithoutTopmostDirectoryName = null;

  var matches = path.match(/^[^\/]+\/(.+)$/);

  if (matches !== null) {
    var secondMatch = second(matches);

    pathWithoutTopmostDirectoryName = secondMatch;
  }

  return pathWithoutTopmostDirectoryName;
}

module.exports = {
  isPathRelativePath: isPathRelativePath,
  isPathAbsolutePath: isPathAbsolutePath,
  isPathTopmostDirectoryName: isPathTopmostDirectoryName,
  isTopmostDirectoryNameContainedInPath: isTopmostDirectoryNameContainedInPath,
  combinePaths: combinePaths,
  concatenatePaths: concatenatePaths,
  bottommostNameFromPath: bottommostNameFromPath,
  topmostDirectoryPathFromPath: topmostDirectoryPathFromPath,
  topmostDirectoryNameFromPath: topmostDirectoryNameFromPath,
  pathWithoutBottommostNameFromPath: pathWithoutBottommostNameFromPath,
  pathWithoutTopmostDirectoryNameFromPath: pathWithoutTopmostDirectoryNameFromPath
};

},{"./array":226}],236:[function(require,module,exports){
'use strict';

var fileSystemUtilities = require('../utilities/fileSystem');

var readFile = fileSystemUtilities.readFile;


function parseFile(filePath, args) {
  var content = readFile(filePath),
      parsedContent = parseContent(content, args);

  return parsedContent;
}

function parseContent(content, args) {
  var lines = content.split('\n'),
      parsedLines = parseLines(lines, args),
      parsedContent = parsedLines.join('\n');

  return parsedContent;
}

function parseLine(line, args) {
  var parsedLine = line.replace(/\$\{(.+?)\}/g, function (match, token) {
    var parsedToken = parseToken(token, args);

    return parsedToken;
  });

  return parsedLine;
}

module.exports = {
  parseFile: parseFile,
  parseContent: parseContent,
  parseLine: parseLine
};

function parseLines(lines, args) {
  var parsedLines = lines.map(function (line) {
    var parsedLine = parseLine(line, args);

    return parsedLine;
  });

  return parsedLines;
}

function parseToken(token, args) {
  var parsedToken = '';

  if (args.hasOwnProperty(token)) {
    parsedToken = args[token];
  }

  return parsedToken;
}

},{"../utilities/fileSystem":228}],237:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))

},{"_process":238}],238:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[77])