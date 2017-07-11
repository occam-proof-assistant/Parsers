'use strict';

const bnf = `



     document                             ::=   ( rule | axiom | lemma | theorem | declaration | verticalSpace | error )+ ;



     rule                                 ::=   "Rule" parenthesisedLabels? <END_OF_LINE> ( premise | premises )? conclusion metaProof? ;

     axiom                                ::=   "Axiom" parenthesisedLabels? <END_OF_LINE> ( unjustifiedStatement | indicativeConditional ) ; 

     lemma                                ::=   "Lemma" parenthesisedLabels? <END_OF_LINE> ( unjustifiedStatement | indicativeConditional ) proof? ;

     theorem                              ::=   "Theorem" parenthesisedLabels? <END_OF_LINE> ( unjustifiedStatement | indicativeConditional ) proof? ;

     declaration                          ::=   "Types" typesDeclaration

                                            |   "Contexts" contextsDeclaration

                                            |   "Variables" variablesDeclaration

                                            |   "Constructors" constructorsDeclaration

                                            |   "Abbreviations" abbreviationsDeclaration

                                            |   "DependentTypes" dependentTypesDeclaration

                                            |   "Metavariables" metavariablesDeclaration

                                            |   "Type" typeDeclaration

                                            |   "Context" contextDeclaration

                                            |   "Variable" variableDeclaration

                                            |   "Constructor" constructorDeclaration

                                            |   "Abbreviation" abbreviationDeclaration

                                            |   "DependentType" dependentTypeDeclaration
                                            
                                            |   "Metavariable" metavariableDeclaration

                                            ;
                                            


     verticalSpace                        ::=   <END_OF_LINE>+ ;



     error                                ::=   . ;

     

     typesDeclaration                     ::=   typeDeclaration ( "," typeDeclaration)+ ;

     contextsDeclaration                  ::=   contextDeclaration ( "," contextDeclaration)+ ;

     variablesDeclaration                 ::=   variableDeclaration ( "," variableDeclaration)+ ;
   
     constructorsDeclaration              ::=   constructorDeclaration ( "," constructorDeclaration)+ ;
   
     abbreviationsDeclaration             ::=   abbreviationDeclaration ( "," abbreviationDeclaration)+ ;
   
     dependentTypesDeclaration            ::=   dependentTypeDeclaration ( "," dependentTypeDeclaration)* ;
   
     metavariablesDeclaration             ::=   metavariableDeclaration ( "," metavariableDeclaration)* ;
   


     typeDeclaration                      ::=   typeName ;
   
     contextDeclaration                   ::=   contextName(<NO_WHITESPACE>":"typeName)? ;
   
     variableDeclaration                  ::=   variableName ;
   
     constructorDeclaration               ::=   constructorName<NO_WHITESPACE>parenthesisedTypeNames?<NO_WHITESPACE>":"<NO_WHITESPACE>typeName ;
   
     abbreviationDeclaration              ::=   typeName "for" typeName | constructorName "for" constructorName ;

     dependentTypeDeclaration             ::=   typeName<NO_WHITESPACE>parenthesisedTypeName ;
   
     metavariableDeclaration              ::=   metavariableName<NO_WHITESPACE>parenthesisedTypeName? ;

   
        
     premise                              ::=   "Premise" <END_OF_LINE> unjustifiedMetastatement ;

     premises                             ::=   "Premises" <END_OF_LINE> unjustifiedMetastatement unjustifiedMetastatement+ ;

     conclusion                           ::=   "Conclusion" <END_OF_LINE> unjustifiedOrJustifiedMetastatement ;

     
     
     metaProof                            ::=   "Proof" <END_OF_LINE> 
     
                                                metastatementDefinition*
     
                                                metaProofDerivation? 
                                                
                                                unjustifiedOrJustifiedMetastatement ;
                                                
     metastatementDefinition              ::=   "let" metastatement <END_OF_LINE> ;                                           
                                                
     metaProofDerivation                  ::=   ( subrule | unjustifiedOrJustifiedMetastatement )+  "Therefore" <END_OF_LINE> ;                                           
     
     subrule                              ::=   "Suppose" <END_OF_LINE> unjustifiedMetastatement+ 
     
                                                ( "Then" <END_OF_LINE> ( subrule | unjustifiedOrJustifiedMetastatement )+ )? 
                                                
                                                "Hence" <END_OF_LINE> unjustifiedOrJustifiedMetastatement ;



     proof                                ::=   "Proof" <END_OF_LINE> 
     
                                                statementDefinition*
     
                                                proofDerivation? 
                                                
                                                unjustifiedOrJustifiedStatement ;
                                                
     statementDefinition                  ::=   "let" statement <END_OF_LINE> ;                                           

     proofDerivation                      ::=   ( sublemma | unjustifiedOrJustifiedStatement )+ "Therefore" <END_OF_LINE> ;

     sublemma                             ::=   "Suppose" <END_OF_LINE> unjustifiedStatement+ 
     
                                                ( "Then" <END_OF_LINE> ( sublemma | unjustifiedOrJustifiedStatement )+ )? 
                                                
                                                "Hence" <END_OF_LINE> unjustifiedOrJustifiedStatement ;



     indicativeConditional                ::=   "Suppose" <END_OF_LINE> unjustifiedStatement+ 
     
                                                "Hence" <END_OF_LINE> unjustifiedOrJustifiedStatement ;



     unjustifiedOrJustifiedMetastatement  ::=   unjustifiedMetastatement | justifiedMetastatement ;
     
     unjustifiedMetastatement             ::=   metastatement <END_OF_LINE> ;
     
     justifiedMetastatement               ::=   metastatement "by" reference <END_OF_LINE> ;



     unjustifiedOrJustifiedStatement      ::=   unjustifiedStatement | justifiedStatement ;

     unjustifiedStatement                 ::=   statement <END_OF_LINE> ;

     justifiedStatement                   ::=   statement ( "by" | "from" ) reference <END_OF_LINE> ;



     metavariable                         ::=   metavariableName<NO_WHITESPACE>parenthesisedTerm? ;

     reference                            ::=   referenceName<NO_WHITESPACE>parenthesisedTerm? ;

     context                              ::=   contextName<NO_WHITESPACE>parenthesisedTerm? ;

     label                                ::=   labelName<NO_WHITESPACE>parenthesisedTerm? ;



     parenthesisedTypeNames               ::=   "("<NO_WHITESPACE>typeNames<NO_WHITESPACE>")" ;

     parenthesisedLabels                  ::=   "("<NO_WHITESPACE>labels<NO_WHITESPACE>")" ;                    

     parenthesisedTerms                   ::=   "("<NO_WHITESPACE>terms<NO_WHITESPACE>")" ;   



     parenthesisedTypeName                ::=   "("<NO_WHITESPACE>typeName<NO_WHITESPACE>")" ;

     parenthesisedTerm                    ::=   "("<NO_WHITESPACE>term<NO_WHITESPACE>")" ;   

         
     
     compoundTerm                         ::=   constructorName<NO_WHITESPACE>parenthesisedTerms? ;



     variable                             ::=   variableName ;



     typeNames                            ::=   typeName ( "," typeName )* ;

     labels                               ::=   label ( "," label )* ;

     terms                                ::=   term ( "," term )* ;
     


     typeName                             ::=   name ;

     contextName                          ::=   name ;

     variableName                         ::=   name ;

     constructorName                      ::=   name ;

     metavariableName                     ::=   name ;

     referenceName                        ::=   name ;

     labelName                            ::=   name ;

     
   
     name                                 ::=   [unassigned] ;
       

       
`;

module.exports = bnf;
