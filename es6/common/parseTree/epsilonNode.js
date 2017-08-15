'use strict';

const lexers = require('occam-lexers');

const VerticalBranchParseTree = require('./verticalBranch');

const { BNFLexer } = lexers,
      { specialSymbols } = BNFLexer,
      { epsilon } = specialSymbols;

class EpsilonNodeParseTree extends VerticalBranchParseTree {
  static fromNothing() {
    const string = epsilon, ///
          stringLength = string.length,
          verticalBranchParseTreeWidth = stringLength, ///
          verticalBranchParseTree = VerticalBranchParseTree.fromWidth(verticalBranchParseTreeWidth),
          verticalBranchPosition = verticalBranchParseTree.getVerticalBranchPosition(),
          terminalNodeParseTree = VerticalBranchParseTree.fromStringAndVerticalBranchPosition(EpsilonNodeParseTree, string, verticalBranchPosition);

    terminalNodeParseTree.appendToTop(verticalBranchParseTree);

    return terminalNodeParseTree;
  }
}

module.exports = EpsilonNodeParseTree;