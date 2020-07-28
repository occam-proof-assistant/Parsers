"use strict";

import { specialSymbols } from "occam-lexers";

import ZeroOrMorePartsPart from "./zeroOrMoreParts";
import CollectionOfPartsPart from "./collectionOfParts";

import { OneOrMorePartsPartType } from "../../partTypes";

const { plus } = specialSymbols;

export default class OneOrMorePartsPart extends CollectionOfPartsPart {
  constructor(part) {
    const type = OneOrMorePartsPartType; ///

    super(type, part);
  }
  
  parse(context, callback) {
    let nodes = null;
    
    const part = this.getPart(),
          partNodeOrNodes = part.parse(context, callback),
          parsed = (partNodeOrNodes !== null);

    if (parsed) {
      nodes = (partNodeOrNodes instanceof Array) ?
                partNodeOrNodes :
                  [partNodeOrNodes];

      const oneOrMorePartsPart = this,  ///
            zeroOrMorePartsPart = ZeroOrMorePartsPart.fromOneOrMorePartsPart(oneOrMorePartsPart),
            zeroOrMorePartsPartNodeOrNodes = zeroOrMorePartsPart.parse(context, callback);

      nodes = nodes.concat(zeroOrMorePartsPartNodeOrNodes);
    }

    return nodes;
  }

  clone() { return super.clone(OneOrMorePartsPart); }

  asString() {
    const operatorString = plus,  ///
          string = super.asString(operatorString);

    return string;
  }
}
