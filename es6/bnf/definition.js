'use strict';

const arrayUtilities = require('../utilities/array');

const { first, allButFirst } = arrayUtilities;

class Definition {
  constructor(parts) {
    this.parts = parts;
  }

  getParts() {
    return this.parts;
  }

  getFirstPart() {
    const firstPart = first(this.parts);

    return firstPart;
  }

  getPartsLength() {
    const partsLength = this.parts.length;

    return partsLength;
  }

  getAllButFirstParts() {
    const allButFirstParts = allButFirst(this.parts);

    return allButFirstParts;
  }

  parse(configuration, noWhitespace) {
    let nodes = [];

    const savedIndex = configuration.getSavedIndex(),
          everyPartParsed = this.parts.every(function(part) {
            const partNodeOrNodes = part.parse(configuration, noWhitespace);

            if (partNodeOrNodes !== null) {
              nodes = nodes.concat(partNodeOrNodes);

              noWhitespace = false;

              return true;
            }
          });

    if (!everyPartParsed) {
      configuration.backtrack(savedIndex);

      nodes = null;
    }

    return nodes;
  }
  
  asString() {
    const partsString = this.parts.reduce(function(partsString, part) {
          const partString = part.asString();

          if (partsString === null) {
            partsString = partString; ///
          } else {
            partsString = `${partsString} ${partString}`;
          }

          return partsString;
        }, null),
        string = partsString; ///

    return string;
  }
}

module.exports = Definition;
