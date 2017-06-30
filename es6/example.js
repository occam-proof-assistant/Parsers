'use strict';

const easy = require('easy'),
      easyLayout = require('easy-layout');

const { Textarea } = easy,
      { SizeableElement, VerticalSplitter } = easyLayout;

const contentTextareaSelector = 'textarea#content',
      parseTreeTextareaSelector = 'textarea#parseTree',
      lexicalEntriesTextareaSelector = 'textarea#lexicalEntries',
      extendedBNFTextareaSelector = 'textarea#extendedBNF',
      sizeableElementSelector = '#sizeableElement',
      verticalSplitterSelector = '#verticalSplitter',
      contentTextarea = new Textarea(contentTextareaSelector),
      parseTreeTextarea = new Textarea(parseTreeTextareaSelector),
      lexicalEntriesTextarea =new Textarea(lexicalEntriesTextareaSelector),
      extendedBNFTextarea = new Textarea(extendedBNFTextareaSelector),
      sizeableElement = new SizeableElement(sizeableElementSelector),
      beforeSizeableElement = false,
      afterSizeableElement = true;

let lexer = null,
    parser = null;

new VerticalSplitter(verticalSplitterSelector, beforeSizeableElement, afterSizeableElement);

class Example {
  static run(content, lexicalEntries, extendedBNF, updateHandler) {
    const contentTextareaValue = content, ///
          extendedBNFTextareaValue = extendedBNF,  ///
          lexicalEntriesTextareaValue = JSON.stringify(lexicalEntries, null, '  ');

    contentTextarea.setValue(contentTextareaValue);

    lexicalEntriesTextarea.setValue(lexicalEntriesTextareaValue);

    extendedBNFTextarea.setValue(extendedBNFTextareaValue);

    contentTextarea.onKeyUp(updateHandler);

    lexicalEntriesTextarea.onKeyUp(updateHandler);

    extendedBNFTextarea.onKeyUp(updateHandler);
  }

  static updateLexer(Lexer) {
    const lexicalEntriesTextareaValue = lexicalEntriesTextarea.getValue();

    let lexicalEntries = null;

    try {
      lexicalEntries = JSON.parse(lexicalEntriesTextareaValue);
    } catch (error) {}

    const lexicalEntriesValid = (lexicalEntries !== null);

    if (lexicalEntriesValid) {
      lexer = Lexer.fromEntries(lexicalEntries);

      lexicalEntriesTextarea.removeClass('error');
    } else {
      lexer = null;

      lexicalEntriesTextarea.addClass('error');
    }
  }

  static updateParser(callback) {
    const bnfTextareaValue = extendedBNFTextarea.getValue(),
          bnf = bnfTextareaValue; ///

    parser = callback(bnf);
  }

  static updateParseTree(ruleName) {
    let node = null,
        parseTreeTextareaHTML = '';

    if ((lexer !== null) && (parser !== null)) {
      try {
        const contentTextareaValue = contentTextarea.getValue(),
              content = contentTextareaValue, ///
              rule = parser.findRule(ruleName),
              lines = lexer.linesFromContent(content);

        node = parser.nodeFromLines(lines, rule);

        if (node === null) {
          throw new Error('The document cannot be parsed for some reason.');  ///
        }

        const parseTree = node.generateParseTree(lines);

        parseTree.shiftLine();  //

        const parseTreeString = parseTree.toString();

        parseTreeTextareaHTML = parseTreeString;  ///

        contentTextarea.removeClass('error');
      } catch (error) {
        contentTextarea.addClass('error');
      }
    }

    parseTreeTextarea.html(parseTreeTextareaHTML);

    return node;
  }
}

module.exports = Example;
