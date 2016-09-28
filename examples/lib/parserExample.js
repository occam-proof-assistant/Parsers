'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var easyUI = require('easyui'),
    easyUILayout = require('easyui-layout'),
    occamLexers = require('occam-lexers'),
    BNFLexer = occamLexers.BNFLexer,
    Input = easyUI.Input,
    TextArea = easyUI.TextArea,
    SizeableElement = easyUILayout.SizeableElement,
    VerticalSplitter = easyUILayout.VerticalSplitter;

var leftColumnSelector = '#leftColumn',
    inputTextAreaSelector = 'textArea#input',
    grammarTextAreaSelector = 'textArea#grammar',
    parseTreeTextAreaSelector = 'textArea#parseTree',
    specialSymbolsRegExpInputSelector = 'input#specialSymbolsRegExp',
    inputTextArea = new TextArea(inputTextAreaSelector),
    grammarTextArea = new TextArea(grammarTextAreaSelector),
    parseTreeTextArea = new TextArea(parseTreeTextAreaSelector),
    specialSymbolsRegExpInput = new Input(specialSymbolsRegExpInputSelector),
    leftColumn = new SizeableElement(leftColumnSelector),
    TO_THE_RIGHT_OF = VerticalSplitter.situated.TO_THE_RIGHT_OF;

new VerticalSplitter('.left.vertical.splitter', TO_THE_RIGHT_OF, leftColumn);

var Parser = require('../../es6/parser'),
    BNFParser = require('../../es6/bnfParser');

var mappings = {};

var ParserExample = function () {
  function ParserExample() {
    _classCallCheck(this, ParserExample);
  }

  _createClass(ParserExample, null, [{
    key: 'run',
    value: function run() {
      updateParser();

      specialSymbolsRegExpInput.onChange(function () {
        updateParser();
        updateParseTree();
      });

      grammarTextArea.onChange(function () {
        updateParser();
        updateParseTree();
      });

      inputTextArea.onChange(function () {
        updateParseTree();
      });
    }
  }]);

  return ParserExample;
}();

module.exports = ParserExample;

var parser;

function updateParser() {
  var grammarTextAreaValue = grammarTextArea.getValue(),
      specialSymbolsRegExpInputValue = specialSymbolsRegExpInput.getValue(),
      grammar = grammarTextAreaValue,
      ///
  specialSymbolsRegExp = specialSymbolsRegExpInputValue,
      ///
  lines = BNFLexer.linesFromGrammar(grammar),
      productions = BNFParser.parse(lines, specialSymbolsRegExp, mappings);

  parser = new Parser(productions);
}

function updateParseTree() {
  var inputTextAreaValue = inputTextArea.getValue(),
      input = inputTextAreaValue,
      ///
  documentNode = parser.parse(input),
      parseTree = documentNode.getParseTree(),
      parseTreeStr = parseTree.toString(),
      parseTreeTextAreaHTML = parseTreeStr; ///

  parseTreeTextArea.html(parseTreeTextAreaHTML);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2VzNi9wYXJzZXJFeGFtcGxlLmpzIl0sIm5hbWVzIjpbImVhc3lVSSIsInJlcXVpcmUiLCJlYXN5VUlMYXlvdXQiLCJvY2NhbUxleGVycyIsIkJORkxleGVyIiwiSW5wdXQiLCJUZXh0QXJlYSIsIlNpemVhYmxlRWxlbWVudCIsIlZlcnRpY2FsU3BsaXR0ZXIiLCJsZWZ0Q29sdW1uU2VsZWN0b3IiLCJpbnB1dFRleHRBcmVhU2VsZWN0b3IiLCJncmFtbWFyVGV4dEFyZWFTZWxlY3RvciIsInBhcnNlVHJlZVRleHRBcmVhU2VsZWN0b3IiLCJzcGVjaWFsU3ltYm9sc1JlZ0V4cElucHV0U2VsZWN0b3IiLCJpbnB1dFRleHRBcmVhIiwiZ3JhbW1hclRleHRBcmVhIiwicGFyc2VUcmVlVGV4dEFyZWEiLCJzcGVjaWFsU3ltYm9sc1JlZ0V4cElucHV0IiwibGVmdENvbHVtbiIsIlRPX1RIRV9SSUdIVF9PRiIsInNpdHVhdGVkIiwiUGFyc2VyIiwiQk5GUGFyc2VyIiwibWFwcGluZ3MiLCJQYXJzZXJFeGFtcGxlIiwidXBkYXRlUGFyc2VyIiwib25DaGFuZ2UiLCJ1cGRhdGVQYXJzZVRyZWUiLCJtb2R1bGUiLCJleHBvcnRzIiwicGFyc2VyIiwiZ3JhbW1hclRleHRBcmVhVmFsdWUiLCJnZXRWYWx1ZSIsInNwZWNpYWxTeW1ib2xzUmVnRXhwSW5wdXRWYWx1ZSIsImdyYW1tYXIiLCJzcGVjaWFsU3ltYm9sc1JlZ0V4cCIsImxpbmVzIiwibGluZXNGcm9tR3JhbW1hciIsInByb2R1Y3Rpb25zIiwicGFyc2UiLCJpbnB1dFRleHRBcmVhVmFsdWUiLCJpbnB1dCIsImRvY3VtZW50Tm9kZSIsInBhcnNlVHJlZSIsImdldFBhcnNlVHJlZSIsInBhcnNlVHJlZVN0ciIsInRvU3RyaW5nIiwicGFyc2VUcmVlVGV4dEFyZWFIVE1MIiwiaHRtbCJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztBQUVBLElBQUlBLFNBQVNDLFFBQVEsUUFBUixDQUFiO0FBQUEsSUFDSUMsZUFBZUQsUUFBUSxlQUFSLENBRG5CO0FBQUEsSUFFSUUsY0FBY0YsUUFBUSxjQUFSLENBRmxCO0FBQUEsSUFHSUcsV0FBV0QsWUFBWUMsUUFIM0I7QUFBQSxJQUlJQyxRQUFRTCxPQUFPSyxLQUpuQjtBQUFBLElBS0lDLFdBQVdOLE9BQU9NLFFBTHRCO0FBQUEsSUFNSUMsa0JBQWtCTCxhQUFhSyxlQU5uQztBQUFBLElBT0lDLG1CQUFtQk4sYUFBYU0sZ0JBUHBDOztBQVNBLElBQUlDLHFCQUFxQixhQUF6QjtBQUFBLElBQ0lDLHdCQUF3QixnQkFENUI7QUFBQSxJQUVJQywwQkFBMEIsa0JBRjlCO0FBQUEsSUFHSUMsNEJBQTRCLG9CQUhoQztBQUFBLElBSUlDLG9DQUFvQyw0QkFKeEM7QUFBQSxJQUtJQyxnQkFBZ0IsSUFBSVIsUUFBSixDQUFhSSxxQkFBYixDQUxwQjtBQUFBLElBTUlLLGtCQUFrQixJQUFJVCxRQUFKLENBQWFLLHVCQUFiLENBTnRCO0FBQUEsSUFPSUssb0JBQW9CLElBQUlWLFFBQUosQ0FBYU0seUJBQWIsQ0FQeEI7QUFBQSxJQVFJSyw0QkFBNEIsSUFBSVosS0FBSixDQUFVUSxpQ0FBVixDQVJoQztBQUFBLElBU0lLLGFBQWEsSUFBSVgsZUFBSixDQUFvQkUsa0JBQXBCLENBVGpCO0FBQUEsSUFVSVUsa0JBQWtCWCxpQkFBaUJZLFFBQWpCLENBQTBCRCxlQVZoRDs7QUFZQSxJQUFJWCxnQkFBSixDQUFxQix5QkFBckIsRUFBZ0RXLGVBQWhELEVBQWlFRCxVQUFqRTs7QUFFQSxJQUFJRyxTQUFTcEIsUUFBUyxrQkFBVCxDQUFiO0FBQUEsSUFDSXFCLFlBQVlyQixRQUFTLHFCQUFULENBRGhCOztBQUdBLElBQUlzQixXQUFXLEVBQWY7O0lBRU1DLGE7Ozs7Ozs7MEJBQ1M7QUFDWEM7O0FBRUFSLGdDQUEwQlMsUUFBMUIsQ0FBbUMsWUFBVztBQUM1Q0Q7QUFDQUU7QUFDRCxPQUhEOztBQUtBWixzQkFBZ0JXLFFBQWhCLENBQXlCLFlBQVc7QUFDbENEO0FBQ0FFO0FBQ0QsT0FIRDs7QUFLQWIsb0JBQWNZLFFBQWQsQ0FBdUIsWUFBVztBQUNoQ0M7QUFDRCxPQUZEO0FBR0Q7Ozs7OztBQUdIQyxPQUFPQyxPQUFQLEdBQWlCTCxhQUFqQjs7QUFFQSxJQUFJTSxNQUFKOztBQUVBLFNBQVNMLFlBQVQsR0FBd0I7QUFDdEIsTUFBSU0sdUJBQXVCaEIsZ0JBQWdCaUIsUUFBaEIsRUFBM0I7QUFBQSxNQUNJQyxpQ0FBaUNoQiwwQkFBMEJlLFFBQTFCLEVBRHJDO0FBQUEsTUFFSUUsVUFBVUgsb0JBRmQ7QUFBQSxNQUVvQztBQUNoQ0kseUJBQXVCRiw4QkFIM0I7QUFBQSxNQUcyRDtBQUN2REcsVUFBUWhDLFNBQVNpQyxnQkFBVCxDQUEwQkgsT0FBMUIsQ0FKWjtBQUFBLE1BS0lJLGNBQWNoQixVQUFVaUIsS0FBVixDQUFnQkgsS0FBaEIsRUFBdUJELG9CQUF2QixFQUE2Q1osUUFBN0MsQ0FMbEI7O0FBT0FPLFdBQVMsSUFBSVQsTUFBSixDQUFXaUIsV0FBWCxDQUFUO0FBQ0Q7O0FBRUQsU0FBU1gsZUFBVCxHQUEyQjtBQUN6QixNQUFJYSxxQkFBcUIxQixjQUFja0IsUUFBZCxFQUF6QjtBQUFBLE1BQ0lTLFFBQVFELGtCQURaO0FBQUEsTUFDaUM7QUFDN0JFLGlCQUFlWixPQUFPUyxLQUFQLENBQWFFLEtBQWIsQ0FGbkI7QUFBQSxNQUdJRSxZQUFZRCxhQUFhRSxZQUFiLEVBSGhCO0FBQUEsTUFJSUMsZUFBZUYsVUFBVUcsUUFBVixFQUpuQjtBQUFBLE1BS0lDLHdCQUF3QkYsWUFMNUIsQ0FEeUIsQ0FNa0I7O0FBRTNDN0Isb0JBQWtCZ0MsSUFBbEIsQ0FBdUJELHFCQUF2QjtBQUNEIiwiZmlsZSI6InBhcnNlckV4YW1wbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciBlYXN5VUkgPSByZXF1aXJlKCdlYXN5dWknKSxcbiAgICBlYXN5VUlMYXlvdXQgPSByZXF1aXJlKCdlYXN5dWktbGF5b3V0JyksXG4gICAgb2NjYW1MZXhlcnMgPSByZXF1aXJlKCdvY2NhbS1sZXhlcnMnKSxcbiAgICBCTkZMZXhlciA9IG9jY2FtTGV4ZXJzLkJORkxleGVyLFxuICAgIElucHV0ID0gZWFzeVVJLklucHV0LFxuICAgIFRleHRBcmVhID0gZWFzeVVJLlRleHRBcmVhLFxuICAgIFNpemVhYmxlRWxlbWVudCA9IGVhc3lVSUxheW91dC5TaXplYWJsZUVsZW1lbnQsXG4gICAgVmVydGljYWxTcGxpdHRlciA9IGVhc3lVSUxheW91dC5WZXJ0aWNhbFNwbGl0dGVyO1xuXG52YXIgbGVmdENvbHVtblNlbGVjdG9yID0gJyNsZWZ0Q29sdW1uJyxcbiAgICBpbnB1dFRleHRBcmVhU2VsZWN0b3IgPSAndGV4dEFyZWEjaW5wdXQnLFxuICAgIGdyYW1tYXJUZXh0QXJlYVNlbGVjdG9yID0gJ3RleHRBcmVhI2dyYW1tYXInLFxuICAgIHBhcnNlVHJlZVRleHRBcmVhU2VsZWN0b3IgPSAndGV4dEFyZWEjcGFyc2VUcmVlJyxcbiAgICBzcGVjaWFsU3ltYm9sc1JlZ0V4cElucHV0U2VsZWN0b3IgPSAnaW5wdXQjc3BlY2lhbFN5bWJvbHNSZWdFeHAnLFxuICAgIGlucHV0VGV4dEFyZWEgPSBuZXcgVGV4dEFyZWEoaW5wdXRUZXh0QXJlYVNlbGVjdG9yKSxcbiAgICBncmFtbWFyVGV4dEFyZWEgPSBuZXcgVGV4dEFyZWEoZ3JhbW1hclRleHRBcmVhU2VsZWN0b3IpLFxuICAgIHBhcnNlVHJlZVRleHRBcmVhID0gbmV3IFRleHRBcmVhKHBhcnNlVHJlZVRleHRBcmVhU2VsZWN0b3IpLFxuICAgIHNwZWNpYWxTeW1ib2xzUmVnRXhwSW5wdXQgPSBuZXcgSW5wdXQoc3BlY2lhbFN5bWJvbHNSZWdFeHBJbnB1dFNlbGVjdG9yKSxcbiAgICBsZWZ0Q29sdW1uID0gbmV3IFNpemVhYmxlRWxlbWVudChsZWZ0Q29sdW1uU2VsZWN0b3IpLFxuICAgIFRPX1RIRV9SSUdIVF9PRiA9IFZlcnRpY2FsU3BsaXR0ZXIuc2l0dWF0ZWQuVE9fVEhFX1JJR0hUX09GO1xuXG5uZXcgVmVydGljYWxTcGxpdHRlcignLmxlZnQudmVydGljYWwuc3BsaXR0ZXInLCBUT19USEVfUklHSFRfT0YsIGxlZnRDb2x1bW4pO1xuXG52YXIgUGFyc2VyID0gcmVxdWlyZSAoJy4uLy4uL2VzNi9wYXJzZXInKSxcbiAgICBCTkZQYXJzZXIgPSByZXF1aXJlICgnLi4vLi4vZXM2L2JuZlBhcnNlcicpO1xuXG52YXIgbWFwcGluZ3MgPSB7fTtcblxuY2xhc3MgUGFyc2VyRXhhbXBsZSB7XG4gIHN0YXRpYyBydW4oKSB7XG4gICAgdXBkYXRlUGFyc2VyKCk7XG5cbiAgICBzcGVjaWFsU3ltYm9sc1JlZ0V4cElucHV0Lm9uQ2hhbmdlKGZ1bmN0aW9uKCkge1xuICAgICAgdXBkYXRlUGFyc2VyKCk7XG4gICAgICB1cGRhdGVQYXJzZVRyZWUoKTtcbiAgICB9KTtcblxuICAgIGdyYW1tYXJUZXh0QXJlYS5vbkNoYW5nZShmdW5jdGlvbigpIHtcbiAgICAgIHVwZGF0ZVBhcnNlcigpO1xuICAgICAgdXBkYXRlUGFyc2VUcmVlKCk7XG4gICAgfSk7XG5cbiAgICBpbnB1dFRleHRBcmVhLm9uQ2hhbmdlKGZ1bmN0aW9uKCkge1xuICAgICAgdXBkYXRlUGFyc2VUcmVlKCk7XG4gICAgfSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQYXJzZXJFeGFtcGxlO1xuXG52YXIgcGFyc2VyO1xuXG5mdW5jdGlvbiB1cGRhdGVQYXJzZXIoKSB7XG4gIHZhciBncmFtbWFyVGV4dEFyZWFWYWx1ZSA9IGdyYW1tYXJUZXh0QXJlYS5nZXRWYWx1ZSgpLFxuICAgICAgc3BlY2lhbFN5bWJvbHNSZWdFeHBJbnB1dFZhbHVlID0gc3BlY2lhbFN5bWJvbHNSZWdFeHBJbnB1dC5nZXRWYWx1ZSgpLFxuICAgICAgZ3JhbW1hciA9IGdyYW1tYXJUZXh0QXJlYVZhbHVlLCAvLy9cbiAgICAgIHNwZWNpYWxTeW1ib2xzUmVnRXhwID0gc3BlY2lhbFN5bWJvbHNSZWdFeHBJbnB1dFZhbHVlLCAvLy9cbiAgICAgIGxpbmVzID0gQk5GTGV4ZXIubGluZXNGcm9tR3JhbW1hcihncmFtbWFyKSxcbiAgICAgIHByb2R1Y3Rpb25zID0gQk5GUGFyc2VyLnBhcnNlKGxpbmVzLCBzcGVjaWFsU3ltYm9sc1JlZ0V4cCwgbWFwcGluZ3MpO1xuXG4gIHBhcnNlciA9IG5ldyBQYXJzZXIocHJvZHVjdGlvbnMpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVQYXJzZVRyZWUoKSB7XG4gIHZhciBpbnB1dFRleHRBcmVhVmFsdWUgPSBpbnB1dFRleHRBcmVhLmdldFZhbHVlKCksXG4gICAgICBpbnB1dCA9IGlucHV0VGV4dEFyZWFWYWx1ZSwgIC8vL1xuICAgICAgZG9jdW1lbnROb2RlID0gcGFyc2VyLnBhcnNlKGlucHV0KSxcbiAgICAgIHBhcnNlVHJlZSA9IGRvY3VtZW50Tm9kZS5nZXRQYXJzZVRyZWUoKSxcbiAgICAgIHBhcnNlVHJlZVN0ciA9IHBhcnNlVHJlZS50b1N0cmluZygpLFxuICAgICAgcGFyc2VUcmVlVGV4dEFyZWFIVE1MID0gcGFyc2VUcmVlU3RyOyAgLy8vXG5cbiAgcGFyc2VUcmVlVGV4dEFyZWEuaHRtbChwYXJzZVRyZWVUZXh0QXJlYUhUTUwpO1xufVxuIl19