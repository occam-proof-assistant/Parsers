"use strict";

import NonTerminalNode from "../../common/node/nonTerminal";
import NoWhitespacePart from "../part/terminal/noWhitespace";

export default class NoWhitespacePartNode extends NonTerminalNode {
  generatePart(lookAhead) {
    const noWhitespacePart = new NoWhitespacePart();

    return noWhitespacePart;
  }

  static fromRuleNameAndChildNodes(ruleName, childNodes) { return NonTerminalNode.fromRuleNameAndChildNodes(NoWhitespacePartNode, ruleName, childNodes); }
}
