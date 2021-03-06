"use strict";

import NonTerminalNode from "../../common/node/nonTerminal";
import RegularExpressionPart from "../part/terminal/regularExpression";

import { first, second } from "../../utilities/array";

export default class RegularExpressionNode extends NonTerminalNode {
  regularExpression = /^\/((?:\\.|[^\/])*)\/$/;

  generatePart(lookAhead) {
    const regularExpression = this.getRegularExpression(),
          regularExpressionPart = new RegularExpressionPart(regularExpression);

    return regularExpressionPart;
  }

  getRegularExpression() {
    const childNodes = this.getChildNodes(),
          firstChildNode = first(childNodes),
          terminalNode = firstChildNode,  ///
          terminalNodeContent = terminalNode.getContent(),
          matches = terminalNodeContent.match(this.regularExpression),
          secondMatch = second(matches),
          pattern = secondMatch, ///
          regularExpression = new RegExp(pattern);  ///

    return regularExpression;
  }

  static fromRuleNameAndChildNodes(ruleName, childNodes) { return NonTerminalNode.fromRuleNameAndChildNodes(RegularExpressionNode, ruleName, childNodes); }
}

