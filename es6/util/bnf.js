'use strict';

const lexers = require('occam-lexers');

const arrayUtil = require('../util/array'),
      TerminalNode = require('../common/node/terminal'),
      NonTerminalNode = require('../common/node/nonTerminal');

const { ExtendedBNFLexer } = lexers,
      { specialSymbols } = ExtendedBNFLexer,
      { NO_WHITESPACE } = specialSymbols;

class bnfUtil {
  static isNodeTerminalNode(node) {
    const nodeTerminalNode = (node instanceof TerminalNode);

    return nodeTerminalNode;
  }

  static isNodeNonTerminalNode(node) {
    const nodeNonTerminalNode = (node instanceof NonTerminalNode);

    return nodeNonTerminalNode;
  }

  static isNodeNoWhitespaceNode(node) {
    let nodeNoWhitespaceNode = false;
  
    const nodeTerminalNode = bnfUtil.isNodeTerminalNode(node);
  
    if (nodeTerminalNode) {
      const terminalNode = node,
            terminalNodeContent = terminalNode.getContent();
  
      nodeNoWhitespaceNode = (terminalNodeContent === NO_WHITESPACE);
    }
  
    return nodeNoWhitespaceNode;
  }

  static isNodeChoiceNode(node) {
    let nodeNoChoiceNode = false;

    const nodeTerminalNode = bnfUtil.isNodeTerminalNode(node);

    if (nodeTerminalNode) {
      const terminalNode = node,
            terminalNodeContent = terminalNode.getContent();

      nodeNoChoiceNode = (terminalNodeContent === '|');
    }

    return nodeNoChoiceNode;
  }

  static isNodeQuantifiersNode(node) {
    let nodeQuantifiersNode = false;

    const nodeNonTerminalNode = bnfUtil.isNodeNonTerminalNode(node);

    if (nodeNonTerminalNode) {
      const nonTerminalNode = node, ///
            childNodes = nonTerminalNode.getChildNodes(),
            firstChildNode = arrayUtil.first(childNodes),
            firstChildNodeTerminalNode = bnfUtil.isNodeTerminalNode(firstChildNode);

      if (firstChildNodeTerminalNode) {
        const terminalNode = firstChildNode,  ///
              terminalNodeContent = terminalNode.getContent();

        nodeQuantifiersNode = (terminalNodeContent === '?') ||
                              (terminalNodeContent === '*') ||
                              (terminalNodeContent === '+');
      }
    }


    return nodeQuantifiersNode;
  }

  static quantifiersFromQuantifiersNode(quantifiersNode, quantifiers = []) {
    const quantifier = quantifierFromQuantifiersNode(quantifiersNode);

    quantifiers.push(quantifier);

    const quantifiersNodeChildNodes = quantifiersNode.getChildNodes(),
          quantifiersNodeChildNodesLength =  quantifiersNodeChildNodes.length;

    if (quantifiersNodeChildNodesLength === 2) {
      const secondQuantifiersNodeChildNode = arrayUtil.second(quantifiersNodeChildNodes);

      quantifiersNode = secondQuantifiersNodeChildNode; ///

      quantifiers = bnfUtil.quantifiersFromQuantifiersNode(quantifiersNode, quantifiers);
    }

    return quantifiers;
  }
}

module.exports = bnfUtil;

function quantifierFromQuantifiersNode(quantifiersNode) {
  const quantifiersNodeChildNodes = quantifiersNode.getChildNodes(),
        firstQuantifiersNodeChildNode = arrayUtil.first(quantifiersNodeChildNodes),
        firstQuantifiersNodeChildNodeContent = firstQuantifiersNodeChildNode.getContent(),
        quantifier = firstQuantifiersNodeChildNodeContent;

  return quantifier;
}
