grammar Alf;

start       : (statement SEMICOLON NEWLINE*)*     #multipleLines 
            ;

statement   : declaration      #declarationRule
            |class_dec        #classRule
            |atribution_dec    #atributionRule
            |value             #valueRule
            |array_dec         #arrayRule
            |whileDec             #whilRule
            |expression        #expressionRule
            |array_assign      #array_assign_rule
            |arrayValueDec        #array_value_rule
            |lambdaFunction       #lambdaFunctionRule
            |functionDec          #functionRule
            |forDec               #forRule
            |repeatDec            #repeatRule
            |functionExec        #execRule
            |ifStatement        #ifRule
            
            ;
class_dec   : CLASS VARIABLE proprietyDec* END           #classDeclaration
            ;
array_dec   :type ARRAY VARIABLE ARRAY_NMBER        #arrayDeclaration
            ;
array_assign:VARIABLE ARRAY_NR EQ value        #array_assign_value
            |VARIABLE ARRAY_NR EQ VARIABLE     #array_assign_variable
            |VARIABLE ARRAY_NR EQ expression   #array_assign_expression
            |VARIABLE '['(VARIABLE ARRAY_NR)']'EQ value #arrayElement_assign_value
            |VARIABLE '['functionExec']'EQ value  #arrayFunctionElement_assign_value
            |VARIABLE '['CLASS_VARIABLE']'EQ value #arrayClassFieldElement_assign_value
            ;         
declaration :DECLARE (long_var_dec)+                #variableDeclaration
            |DECLARE (type_var_dec)+                #variableDeclarationShort
            |DECLARE  decAuto+                       #varableAuto
            ;
value_dec   :value                              #valueDeclaration 
            ;
atribution_dec:VARIABLE EQ value               #atribution
            |CLASS_VARIABLE EQ value           #atributionClass
            |VARIABLE EQ expression            #atributionExpresion
            ;
proprietyDec: PROPRIETY type  VARIABLE (EQ value|expression)? SEMICOLON
            ;
type_var_dec:type VARIABLE ','*
            ;
long_var_dec:type VARIABLE EQ value ','*
            |type VARIABLE EQ expression ','*
            
             ;
decAuto     :VARIABLE EQ value
            |VARIABLE EQ expression 
            |VARIABLE EQ functionExec
            ;
arrayValueDec  : VARIABLE ARRAY_NR                    #arrayValue
            ;
functionDec:FUCTION VARIABLE (LP type_var_dec* RP)? ':' type BEGIN (statement SEMICOLON)* END  #functionWithBody 
            |FUCTION VARIABLE (LP type_var_dec* RP)? ':' type  #functionNoBody
            ;
forDec      :FOR VARIABLE FROM INT_NUMBER TO INT_NUMBER START (statement SEMICOLON)* FINISH #forClassic
            |FOR VARIABLE IN VARIABLE  START (statement SEMICOLON)* FINISH                                          #ForinFor
            ;
whileDec    :WHILE expression START (statement SEMICOLON)* FINISH   #whileDeclaration
            ;
repeatDec   :REPEAT (statement SEMICOLON)*  WHILE expression      #repeatDeclaration
            ;
functionExec:EXEC VARIABLE LP(atribution_dec|value_dec VIRGULA?)* RP              #functionExecVariable
            ;
lambdaFunction:FUCTION VARIABLE ':' type '=>'(statement SEMICOLON*)* #functionLambda
           ;
ifStatement:IF expression (statement SEMICOLON)* END  #ifSimple
           |IF expression (statement SEMICOLON)* ELSE (statement SEMICOLON)* END #ifElse
           ;            

expression  : stanga=expression op=DIV dreapta=expression    #expresionDiv
            | stanga=expression op=MUL dreapta=expression  #expresionMul
            | stanga=expression op=REM dreapta=expression  #expresionRem
            | stanga=expression op=ADD dreapta=expression  #expresionAdd
            | stanga=expression op=SUB dreapta=expression  #expresionSub
            | stanga=expression op=GREATER dreapta=expression  #expresionGreater
            | stanga=expression op=GREATER_EQUAL dreapta=expression  #expresionGREATER_EQUAL
            | stanga=expression op=LESS dreapta=expression  #expresionLESSER
            | stanga=expression op=LESS_EQUAL dreapta=expression  #expresionLESSEREQUAL
            | stanga=expression op=EQUAL dreapta=expression  #expresionEQUAL
            |stanga=expression op=DIFFERENT dreapta=expression  #expresionDiferent
            | LP expression RP                             #expresionParantheses
            | value                                        #expresionvalue
            ;

type        : INT                           #typeInt
            | FLOAT                         #typeFloat
            | STRING                        #typeString
            | BOOLEAN                       #typeBool
            |VARIABLE                       #typeVariable
            |EMPTY                          #typeEmpty
            ;

        
value       : INT_NUMBER                    #valueInt
            | FLOAT_NUMBER                  #valueFloat
            | STRING_TEXT                   #valueString
            | BOOL                          #valueBool
            |ARRAY_NMBER                    #valueArrayNumber
            |VARIABLE                       #valueVariable
            |CLASS_VARIABLE                 #classVariable
            |EMPTY                          #valueEmpty    
                 
            ;

operatori   :ADD
            |SUB
            |MUL
            |DIV
            |REM            
            ;
WS          :   (' ')       -> skip;
TAB         :   ([\t]) -> skip;   
NEWLINE     :   ([\r\n]+)   -> skip;
ADD         :   '+';
SUB         :   '-';
MUL         :   '*';
DIV         :   '/';
REM         :   '%';
INT         :   'integer';
FLOAT       :   'float';
STRING      :   'string';
LP          :   '(';
RP          :   ')';
EQ          :   '=';
SEMICOLON   :   ';';
GREATER     :   '>';
LESS        :   '<';
EQUAL       :   '=';
GREATER_EQUAL:  '>=';
LESS_EQUAL   :  '<=';
ARRAY_NMBER:('['[0-9]+':'[0-9]+']');
ARRAY_NR:('['([0-9])+']');
INT_NUMBER  :   ([0-9]+);
FLOAT_NUMBER:   ([0-9]+'.'[0-9]+);
STRING_TEXT :   ('"'([a-zA-Z0-9 WS ])*'"');
BOOL        : 'true'|'false';
BOOLEAN     : 'boolean';
DECLARE     :'declare';
CLASS       :'class';
END         :'end';
ARRAY       :'array';
PROPRIETY   :'local';
FUCTION     :'function';
BEGIN       :'begin';
FOR         :'for';
FROM        :'from';
TO          :'to';
START       :'start';
FINISH      :'finish';
IN          :'in';
DIFFERENT   : '!=';
WHILE       :'while';
IF          :'if';
ELSE        :'else';
DO          :'DO';
REPEAT      :'repeat';
EXEC        :'exec';
EMPTY       :'empty';
VIRGULA     :',';
COMENTARY   :('/*'.+'*/')  ->skip;
CLASS_VARIABLE:(([a-zA-Z0-9]+('.')[a-zA-Z0-9]+));
VARIABLE    :((('_'?)[a-zA-Z0-9_]+));