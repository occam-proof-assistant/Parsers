# Parsers

The Occam proof assistant's parsers.

### Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Examples](#examples)
- [Features](#features)
- [Building](#building)
- [Resources](#resources)
- [Contact](#contact)

## Introduction

Supports a variant of extended [BNF](https://en.wikipedia.org/wiki/Backus%E2%80%93Naur_form) and parses tokens provided by Occam's [lexers](https://github.com/occam-proof-assistant/Lexers) accordingly. The following, taken from the basic example, shows some features of this variant:

      expression                 ::= term operatorThenTerm*

      operatorThenTerm           ::= operator term

      operator                   ::= '+' | '-' | '*' | '/'

      term                       ::= naturalNumber | parenthesizedExpression

      naturalNumber              ::= /^\d+$/

      parenthesizedExpression    ::= '(' expression ')'

Note that grouping is not allowed. You cannot do this:

      expression                 ::= term (operator term)*

Instead you have to do this:

      expression                 ::= term operatorThenTerm*

      operatorThenTerm           ::= operator term

The reason for this, apart from an easier implementation, is to facilitate the use of mappings, a feature described later on. Essentially the intermediate productions to support grouping, that would otherwise have to be generated by the parser, must be spelled out in full in the grammar. Whilst this leads to a more verbose grammar, mappings allow the nodes in the parse tree corresponding to these intermediate productions, as well as many others, to be discarded as the parse tree is generated.

## Installation

With [npm](https://www.npmjs.com/):

    npm install occam-parsers

You can also clone the repository with [Git](https://git-scm.com/)...

    git clone git@github.com:occam-proof-assistant/Parsers.git

...and then install the necessary modules with npm from within the project's root directory:

    npm install

You will need to do this if you want to look at the examples.

## Examples

There are two examples. To view them, open the `examples.html` file in the project's root directory. Each example shows a representation of the parse tree, which is useful for writing and debugging grammars.

### Basic example

Both the grammar and the terminal symbols regular expression pattern can be changed dynamically. The terminal symbols regular expression is passed to the lexer, which uses it to split up the content into tokens. For example, each of the arithmetic symbols on the right hand side of the `operator` production can be found in the terminal symbols regular expression pattern.

Here is the parse tree produced by the basic parser corresponding to the expression `1+(2*3)`, given the grammar in the introduction:

                              expression
                                  |
                  ---------------------------------
                  |                               |
                term                      operatorThenTerm
                  |                               |
            naturalNumber      ---------------------------------------
                  |            |                                     |
             1[terminal]   operator                                term
                               |                                     |
                          +[terminal]                     parenthesizedExpression
                                                                     |
                                           -----------------------------------------------------
                                           |                      |                            |
                                      ([terminal]             expression                  )[terminal]
                                                                  |
                                                        ---------------------
                                                        |                   |
                                                      term          operatorThenTerm
                                                        |                   |
                                                  naturalNumber      --------------
                                                        |            |            |
                                                   2[terminal]   operator       term
                                                                     |            |
                                                                *[terminal] naturalNumber
                                                                                  |
                                                                             3[terminal]

### Florence example

This uses the [BNF grammar part](https://raw.githubusercontent.com/occam-proof-assistant/Parsers/master/es6/florence/grammar.js) of Occam's vernacular, called Florence. The following inference rule and proof from propositional logic will parse...

    Rule (NegationOfConjunctionOfNegationsImpliesDisjunction)
      Premise
        ¬(¬P∧¬Q)
      Conclusion
        P∨Q
      Proof
        Suppose
          Q
        Hence
          P∨Q
        Q=>P∨Q
        Suppose
          ¬Q
        Then
          Suppose
            ¬P
          Hence
            ¬P∧¬Q
          ¬P=>(¬P∧¬Q)
          ¬(¬P∧¬Q)
          ¬¬P by ModusTollens
          P by DoubleNegationElimination
        Hence
          P∨Q
        ¬Q=>P∨Q
        Q∨¬Q by LawOfTheExcludedMiddle
      Therefore
        P∨Q by DisjunctionElimination

...as will the following well known theorem and proof:

    Theorem (TheSquareRootOfTwoIsIrrational)
      Conclusion
        ¬∃r (r:IrreducibleFraction ∧ r=√2)
      Proof
        Suppose
          ∃r (r:IrreducibleFraction ∧ r=√2)
        Then
          r:IrreducibleFraction ∧ r=√2
        Hence
          r:IrreducibleFraction
        ∃r (r:IrreducibleFraction ∧ r=√2)=>r:IrreducibleFraction

        Suppose
          ∃r (r:IrreducibleFraction ∧ r=√2)
        Then
          r=√2
          p/q=r
          p/q=√2
          p=q√2
          p²=2q²
          p²:EvenNumber
          p²:SquareNumber
          p:EvenNumber by TheSquareRootOfAnEvenSquareNumberIsEven
          2|p
          p=2m
          p²=4m²
          2q²=4m²
          q²=2m²
          q²=2n
          q²:EvenNumber
          q²:SquareNumber
          q:EvenNumber by TheSquareRootOfAnEvenSquareNumberIsEven
          2|q
          2|p ∧ 2|q
          ∃s:Nat s|p ∧ s|q ∧ s≠1
        Hence
          ¬r:IrreducibleFraction
        ∃r (r:IrreducibleFraction ∧ r=√2)=>¬r:IrreducibleFraction

      Therefore
        ¬∃r (r:IrreducibleFraction ∧ r=√2) by ProofByNegation

## Features

### Operators

- `*` zero or more
- `+` one or more
- `?` optional

These bind tightly to symbols and can therefore be re-used as terminal symbols in their own right. Recall the grammar in the introduction, which re-uses `*` and `+` as terminal symbols.

### Regular expressions

Note that the regular expression for natural numbers finds its way both into the BNF grammar and the terminal symbols regular expression in the basic example. In the BNF grammar a regular expression is distinguished by the usual leading and trailing anchors:

    /^\d+$/

### Matching significant token types

This can be done with a symbol that is identical to the significant token type in question, contained within square brackets. Recall that the [lexical grammar part](https://raw.githubusercontent.com/occam-proof-assistant/Lexers/master/es6/florence/grammar.js) of the Florence specification language defines `unassigned` significant tokens. These are used in the production for labels in the corresponding BNF grammar:

    label ::= [unassigned]

### Matching end of line tokens

This can be done with the `<END_OF_LINE>` special symbol, which will also bind to operators. For example the production for axioms in the BNF part of the Florence vernacular:

    axiom ::= Axiom parenthesisedLabels? ↲ localVariable(s)? premise(s)? conclusion

    ↲     ::=   <END_OF_LINE>+

### Matching no whitespace

This can be done with the `<NO_WHITESPACE>` special symbol. Examples are the `parenthesisedLabels` and `labels` productions in the BNF part of the Florence vernacular:

    parenthesisedLabels  ::=   '('<NO_WHITESPACE>labels<NO_WHITESPACE>')'

    labels               ::=   label<NO_WHITESPACE>commaThenLabel*

The `<NO_WHITESPACE>` special symbol will bind more tightly to the symbol to its right than any operator and will therefore be used repeatedly.

### Mappings

Mappings allow the parse tree to be pruned by discarding needless nodes. For example, given the following mappings...

    mappings = {
      'part': TransparentNode,
      'label': LabelNode,
      'rule': DiscardFirstChildNode,
      'premise': TransparentThenKeepSecondNode,
      'premises': TransparentThenDiscardFirstNode,
      'conclusion': DiscardFirstChildNode,
      'endsOfLines': DiscardNode,
      'commaThenLabel': TransparentThenKeepSecondNode,
      'parenthesisedLabels': TransparentThenKeepSecondNode,
      '(labelled)statement': TransparentNode
    }

...the following rule will parse...

    Rule (PrincipleOfExplosion)
      Premise
        ⌐P
      Conclusion
        P=>Q

...and result in the much simplified parse tree. Note by the way the mistake in the parsing of the conclusion statement, because the `=>` symbol is not distinguished in the lexical part of the Florence vernacular:

                                                  document
                                                      |
                                                    rule
                                                      |
                             --------------------------------------------------
                             |                     |                          |
                          labels              premise(s)                 conclusion
                             |                     |                          |
                PrincipleOfExplosion[label]    statement                  statement
                                                   |                          |
                                                symbol           ---------------------------
                                                   |             |            |            |
                                            ⌐P[unassigned]    symbol       symbol       symbol
                                                                 |            |            |
                                                           P[unassigned] =[special] >Q[unassigned]

Custom nodes can also be defined. The following `LabelNode` class acts transparently, effectively turning itself into a terminal node. It then updates the type of its underlying significant token when its `update()` method is called:

    var TerminalNode = require('../../bnf/node/terminal');
    
    class LabelNode extends TerminalNode {
      update() {
        var significantToken = this.getSignificantToken(),
            significantTokenType = 'label'; ///
    
        significantToken.setType(significantTokenType);
      }
      
      static fromNodes(nodes, productionName) {
        var firstNode = first(nodes),
            terminalNode = firstNode,  ///
            significantToken = terminalNode.getSignificantToken(),
            labelNode = new LabelNode(significantToken);
    
        nodes = [labelNode];
    
        return nodes;
      }
    }
    
    module.exports = LabelNode;
    
    function first(array) { return array[0]; }

### Updating the parse tree

The `TerminalNode` class has a vacuous `update()` method and the `NonTerminalNode` the obvious implementation:

      update() {
        this.childNodes.forEach(function(childNode) {
          childNode.update();
        });
      }
      
Calling the `update()` method of the topmost node returned by the parser, which is done automatically by the Florence parser, is therefore a good way to implement changes to the parse tree that can only be done once it has been fully generated, such as altering the type of a terminal node's underlying significant token. The `update()` method of the `LabelNode` class, given above, is an example of this.

### Querying the parse tree
      
There is a 'Query' class with a static `fromExpression()` method that constructs a query that can then be applied to any node in a parse tree. For example:

    var errorQuery = Query.fromExpression('//error'),
        errorNodes = query.nodesFromNode(documentNode);
        
This example demonstrates the infinite descent `//` operator, which is computationally expensive and should generally be avoided. Queries should be specific. Given the rule from propositional logic above, for example, the following query will pick out the conclusion's statement:

    var conclusionStatementQuery = Query.fromExpression('/document/body/rule/conclusion[0]/statement');
    
Array modifiers can also be used, see the `/conclusion` sub-query above for a vacuous example, since a rule can only have one conclusion. Queries must start with a single leading slash `/`, if not two, and must include the production name of the node that is passed to the `nodeFromNodes()` method. A specific query such as this should be fast compared to more a general infinite descent one.

## Building

Automation is done with [npm scripts](https://docs.npmjs.com/misc/scripts), have a look at the `package.json` file. The pertinent commands are:

    npm run build-debug
    npm run watch-debug

The Florence grammar can be found in the `grammar.js` file in the `es6/florence` directory.

## Resources

* [Gate lectures by Ravindrababu Ravula on Compiler Design](https://www.youtube.com/watch?v=Qkwj65l_96I&list=PLEbnTDJUr_IcPtUXFy2b1sGRPsLFMghhS)
* [Eliminating ambiguity in context free grammars by Rasmus Ejlers Møgelberg](http://itu.dk/people/mogel/SPLC2012/lectures/eliminatingAmbiguity.pdf)
* [BNF and EBNF: What are they and how do they work? by Lars Marius Garshol](http://www.garshol.priv.no/download/text/bnf.html#id2.3.)
* [Introduction to Grammar and Parsing using the Recursive Descent Parser algorithm ACT talk by Eric Nielsen](https://www.youtube.com/watch?v=9jSSSE2FuLU)

## Contact

* jecs@imperial.ac.uk
* http://djalbat.com
