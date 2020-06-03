"use strict";

import { Element } from "easy";
import { RowsDiv, ColumnsDiv } from "easy-layout";

import Heading from "./heading";
import BackLink from "./link/back";
import Paragraph from "./paragraph";
import ColumnDiv from "./div/column";
import SubHeading from "./subHeading";
import SizeableDiv from "./div/sizeable";
import BNFTextarea from "./textarea/bnf";
import RuleNameInput from "./input/ruleName";
import TokensTextarea from "./textarea/tokens";
import ContentTextarea from "./textarea/content";
import ParseTreeTextarea from "./textarea/parseTree";
import VerticalSplitterDiv from "./div/splitter/vertical";
import LexicalEntriesTextarea from "./textarea/lexicalEntries";

import { findRuleByName } from "../utilities/rule";

export default class View extends Element {
  getTokens() {
    const lexicalEntries = this.getLexicalEntries(),
          entries = lexicalEntries, ///
          lexer = this.Lexer.fromEntries(entries),
          content = this.getContent(),
          tokens = lexer.tokenise(content);

    return tokens;
  }

  getParseTree(tokens) {
    let parseTree = null;

    const bnf = this.getBNF(),
          parser = this.Parser.fromBNF(bnf),
          ruleName = this.getRuleName(),
          name = ruleName,  ///
          rules = parser.getRules(),
          rule = findRuleByName(name, rules),
          node = parser.parse(tokens, rule);

    if (node !== null) {
      parseTree = node.asParseTree(tokens);
    }

    return parseTree;
  }

  keyUpHandler() {
    try {
      const tokens = this.getTokens(),
            parseTree = this.getParseTree(tokens);

      this.setTokens(tokens);

      this.setParseTree(parseTree);
    } catch (error) {
      console.log(error);

      this.clearTokens();

      this.clearParseTree();
    }
  }

  childElements() {
    const keyUpHandler = this.keyUpHandler.bind(this);

    return ([

      <Heading>
        {this.heading}
      </Heading>,
      <ColumnsDiv>
        <SizeableDiv>
          <RowsDiv>
            <SubHeading>
              Lexical entries
            </SubHeading>
            <LexicalEntriesTextarea onKeyUp={keyUpHandler} />
            <SubHeading>
              BNF
            </SubHeading>
            <BNFTextarea onKeyUp={keyUpHandler} />
            <SubHeading>
              Rule name
            </SubHeading>
            <RuleNameInput onKeyUp={keyUpHandler} />
          </RowsDiv>
        </SizeableDiv>
        <VerticalSplitterDiv />
        <ColumnDiv>
          <RowsDiv>
            <SubHeading>
              Content
            </SubHeading>
            <ContentTextarea onKeyUp={keyUpHandler} />
            <SubHeading>
              Tokens
            </SubHeading>
            <TokensTextarea />
            <SubHeading>
              Parse tree
            </SubHeading>
            <ParseTreeTextarea />
          </RowsDiv>
        </ColumnDiv>
      </ColumnsDiv>,
      <Paragraph>
        <BackLink />
      </Paragraph>

    ]);
  }

  initialise() {
    this.assignContext();

    const { bnf } = this.Parser,
          { entries } = this.Lexer,
          content = this.initialContent, ///
          lexicalEntries = entries; ///

    this.setBNF(bnf);
    this.setContent(content);
    this.setLexicalEntries(lexicalEntries);

    this.keyUpHandler();
  }

  static tagName = "div";

  static fromClass(Class, properties) {
    const exampleView = Element.fromClass(Class, properties);

    exampleView.initialise();

    return exampleView
  }
}
