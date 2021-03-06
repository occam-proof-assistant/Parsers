"use strict";

import { last } from "../utilities/array";

export default class ParseTree {
  constructor(lines) {
    this.lines = lines;
  }

  clone() {
    const lines = this.lines.slice(),  ///
          parseTree = new ParseTree(lines);

    return parseTree;
  }

  getWidth() {
    let width;

    let linesLength = this.lines.length;

    if (linesLength === 0) {
      width = 0;
    } else {
      const lastLine = last(this.lines),
            lastLineLength = lastLine.length;

      width = lastLineLength; ///
    }

    return width;
  }

  getDepth() {
    const linesLength = this.lines.length,
          depth = linesLength;  ///

    return depth;
  }

  forEachLine(callback) {
    this.lines.forEach(callback);
  }

  appendToTop(parseTree) {
    parseTree.forEachLine((line) => {
      this.lines.unshift(line);
    });
  }

  appendToLeft(parseTree) {
    parseTree.forEachLine((line, index) => {
      this.lines[index] = line + this.lines[index];
    });
  }

  appendToRight(parseTree) {
    parseTree.forEachLine((line, index) => {
      this.lines[index] = this.lines[index] + line;
    });
  }

  appendToBottom(parseTree) {
    parseTree.forEachLine((line) => {
      this.lines.push(line);
    });
  }

  addTopMargin(topMarginDepth) {
    const width = this.getWidth(),
          topMarginWidth = width,  ///
          topMarginString = marginStringFromMarginWidth(topMarginWidth);

    for (let index = 0; index < topMarginDepth; index++) {
      this.lines.unshift(topMarginString);
    }
  }

  addLeftMargin(leftMarginWidth) {
    const leftMarginString = marginStringFromMarginWidth(leftMarginWidth),
          linesLength = this.lines.length;

    for (let index = 0; index < linesLength; index++) {
      this.lines[index] = leftMarginString + this.lines[index];
    }
  }

  addRightMargin(rightMarginWidth) {
    const rightMarginString = marginStringFromMarginWidth(rightMarginWidth),
          linesLength = this.lines.length;

    for (let index = 0; index < linesLength; index++) {
      this.lines[index] = this.lines[index] + rightMarginString;
    }
  }

  addBottomMargin(bottomMarginDepth) {
    const width = this.getWidth(),
          bottomMarginWidth = width,  ///
          bottomMarginString = marginStringFromMarginWidth(bottomMarginWidth);

    for (let index = 0; index < bottomMarginDepth; index++) {
      this.lines.push(bottomMarginString);
    }
  }
  
  popLine() { return this.lines.pop(); }
  
  shiftLine() { return this.lines.shift(); }
  
  pushLine(line) { this.lines.push(line); }
  
  unshiftLine(line) { this.lines.unshift(line); }

  asString() {
    const string = this.lines.reduce((string, line) => {
      string += line + "\n";

      return string;
    }, "");

    return string;
  }
}

function marginStringFromMarginWidth(marginWidth, spaceCharacter) {
  spaceCharacter = spaceCharacter || " ";

  let marginString = "";

  for (let index = 0; index < marginWidth; index++) {
    marginString += spaceCharacter;
  }

  return marginString;
}
