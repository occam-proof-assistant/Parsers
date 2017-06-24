'use strict';

const arrayUtil = require('../../util/array'),
      EmptyParseTree = require('./empty'),
      RuleNameParseTree = require('./ruleName'),
      ChildNodesParseTree = require('./childNodes'),
      VerticalBranchParseTree = require('./verticalBranch');

class NonTerminalNodeParseTree extends VerticalBranchParseTree {
  static fromNonTerminalNode(nonTerminalNode, lines) {
    const childNodes = nonTerminalNode.getChildNodes(),
          firstChildNode = arrayUtil.first(childNodes),
          childNode = firstChildNode,
          childNodesLength = childNodes.length,
          childNodeOrNodesParseTree = (childNodesLength === 1) ?
                                        childNode.generateParseTree(lines) :
                                          ChildNodesParseTree.fromChildNodes(childNodes, lines),
          ruleNameParseTree = RuleNameParseTree.fromNonTerminalNode(nonTerminalNode, lines);
    
    let ruleNameParseTreeVerticalBranchPosition = ruleNameParseTree.getVerticalBranchPosition();
    
    const childNodeOrNodesParseTreeVerticalBranchPosition = childNodeOrNodesParseTree.getVerticalBranchPosition(),
          verticalBranchPositionsDifference = ruleNameParseTreeVerticalBranchPosition - childNodeOrNodesParseTreeVerticalBranchPosition;
    
    let leftMarginWidth = undefined;

    if (false) {

    } else if (verticalBranchPositionsDifference < 0) {
      leftMarginWidth = -verticalBranchPositionsDifference;

      ruleNameParseTree.addLeftMargin(leftMarginWidth);
    } else if (verticalBranchPositionsDifference > 0) {
      leftMarginWidth = +verticalBranchPositionsDifference;

      childNodeOrNodesParseTree.addLeftMargin(leftMarginWidth);
    }

    const ruleNameParseTreeWidth = ruleNameParseTree.getWidth(),
          childNodeOrNodesParseTreeWidth = childNodeOrNodesParseTree.getWidth(),
          widthsDifference = ruleNameParseTreeWidth - childNodeOrNodesParseTreeWidth;
    
    let rightMarginWidth = undefined;

    if (false) {

    } else if (widthsDifference < 0) {
      rightMarginWidth = -widthsDifference;
      
      ruleNameParseTree.addRightMargin(rightMarginWidth);
    } else if (widthsDifference > 0) {
      rightMarginWidth = +widthsDifference;

      childNodeOrNodesParseTree.addRightMargin(rightMarginWidth);
    }

    ruleNameParseTreeVerticalBranchPosition = ruleNameParseTree.getVerticalBranchPosition();

    const ruleNameParseTreeDepth = ruleNameParseTree.getDepth(),
          nonTerminalNodeParseTreeDepth = ruleNameParseTreeDepth, ///
          verticalBranchPosition = ruleNameParseTreeVerticalBranchPosition, ///
          nonTerminalNodeParseTree = EmptyParseTree.fromDepth(nonTerminalNodeParseTreeDepth, NonTerminalNodeParseTree, verticalBranchPosition);

    nonTerminalNodeParseTree.appendToRight(ruleNameParseTree);
    nonTerminalNodeParseTree.appendToBottom(childNodeOrNodesParseTree);

    return nonTerminalNodeParseTree;
  }
}

module.exports = NonTerminalNodeParseTree;
