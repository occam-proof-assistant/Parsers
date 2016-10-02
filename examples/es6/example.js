'use strict';

var easyUI = require('easyui'),
    easyUILayout = require('easyui-layout'),
    occamLexers = require('occam-lexers'),
    BNFLexer = occamLexers.BNFLexer,
    Input = easyUI.Input,
    TextArea = easyUI.TextArea,
    SizeableElement = easyUILayout.SizeableElement,
    VerticalSplitter = easyUILayout.VerticalSplitter;

var leftColumnSelector = '#leftColumn',
    contentTextAreaSelector = 'textArea#content',
    grammarTextAreaSelector = 'textArea#grammar',
    parseTreeTextAreaSelector = 'textArea#parseTree',
    specialSymbolsRegExpInputSelector = 'input#specialSymbolsRegExp',
    contentTextArea = new TextArea(contentTextAreaSelector),
    grammarTextArea = new TextArea(grammarTextAreaSelector),
    parseTreeTextArea = new TextArea(parseTreeTextAreaSelector),
    specialSymbolsRegExpInput = new Input(specialSymbolsRegExpInputSelector),
    leftColumn = new SizeableElement(leftColumnSelector),
    TO_THE_RIGHT_OF = VerticalSplitter.situated.TO_THE_RIGHT_OF;

new VerticalSplitter('.left.vertical.splitter', TO_THE_RIGHT_OF, leftColumn);

var Parser = require ('../../es6/parser'),
    BNFParser = require ('../../es6/bnfParser');

var parser;

class Example {
  static updateParser(mappings) {
    var grammarTextAreaValue = grammarTextArea.getValue(),
        specialSymbolsRegExpInputValue = specialSymbolsRegExpInput.getValue(),
        grammar = grammarTextAreaValue, ///
        specialSymbolsRegExp = specialSymbolsRegExpInputValue, ///
        lines = BNFLexer.linesFromGrammar(grammar),
        productions = BNFParser.parse(lines, specialSymbolsRegExp, mappings);

    parser = new Parser(productions);
  }

  static updateParseTree(Lexer) {
    var contentTextAreaValue = contentTextArea.getValue(),
        content = contentTextAreaValue,  ///
        tokens = Lexer.tokensFromContent(content),
        documentNode = parser.parse(tokens),
        parseTree = documentNode.getParseTree(),
        parseTreeStr = parseTree.toString(),
        parseTreeTextAreaHTML = parseTreeStr;  ///

    parseTreeTextArea.html(parseTreeTextAreaHTML);
  }
}

Example.contentTextArea = contentTextArea;
Example.grammarTextArea = grammarTextArea;
Example.specialSymbolsRegExpInput = specialSymbolsRegExpInput;

module.exports = Example;
