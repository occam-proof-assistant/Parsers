"use strict";

import NonTerminalNodeParseTree from "../parseTree/nonTerminalNode";

import { forwardsSome, backwardsSome } from "../../utilities/array";

export default class NonTerminalNode {
  constructor(ruleName, parentNode, childNodes) {
    this.ruleName = ruleName;
    this.parentNode = parentNode;
    this.childNodes = childNodes;
  }

  isTerminalNode() {
    const terminalNode = false;

    return terminalNode;
  }

  isNonTerminalNode() {
    const nonTerminalNode = true;

    return nonTerminalNode;
  }

  getRuleName() {
    return this.ruleName;
  }

  getParentNode() {
    return this.parentNode;
  }

  getChildNodes() {
    return this.childNodes;
  }

  getFirstSignificantToken() {
    let firstSignificantToken = null;

    forwardsSome(this.childNodes, (childNode) => {
      firstSignificantToken = childNode.getFirstSignificantToken();

      if (firstSignificantToken !== null) {
        return true;
      }
    });

    return firstSignificantToken;
  }

  getLastSignificantToken() {
    let lastSignificantToken = null;

    backwardsSome(this.childNodes, (childNode) => {
      lastSignificantToken = childNode.getLastSignificantToken();

      if (lastSignificantToken !== null) {
        return true;
      }
    });

    return lastSignificantToken;
  }
  
  setRuleName(ruleName) {
    this.ruleName = ruleName;
  }

  setParentNode(parentNode) {
    this.parentNode = parentNode;
  }

  setChildNodes(childNodes) {
    this.childNodes = childNodes;
  }
  
  asParseTree(tokens) {
    const nonTerminalNode = this,  ///
          nonTerminalNodeParseTree = NonTerminalNodeParseTree.fromNonTerminalNodeAndTokens(nonTerminalNode, tokens),
          parseTree = nonTerminalNodeParseTree;  ///

    return parseTree;
  }

  static fromRuleNameAndChildNodes(Class, ruleName, childNodes) {
    if (childNodes === undefined) {
      childNodes = ruleName;
      ruleName = Class;
      Class = NonTerminalNode;  ///
    }

    const childNodesLength = childNodes.length;

    if (childNodesLength === 0) {
      throw new Error(`There are no child nodes at rule '${ruleName}'.`);
    }
    
    const parentNode = undefined, ///
          nonTerminalNode = new Class(ruleName, parentNode, childNodes);

    return nonTerminalNode;
  }
}
