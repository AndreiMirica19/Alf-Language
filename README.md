# ALF Devoir 3 - Langage Alf

## Description

Le descriptif des devoirs est disponible sur le site de ALF [Devoir 3](https://ocw.cs.pub.ro/courses/alf/teme/tema3)


## Solution

TODO Décrivez ici comment avez-vous résolu les devoirs, quels types de données avez-vous utilisés et pourquoi. 

### Structures de données
AlF.g4:
-statements va contine toate declararile de mai jos.
-start contine  paranteza(statement ; 0 sau mai multe new line).Aceasta poate fi repetata de mai multe ori.-ie.
-long_var_dec contiine tip de variabila,variabila,egal cu valoare sau expresie si 0 sau mai multe virgule.
-type_var_dec contine tip de variabila,variabila si 0 sau mai multe virgule.
-decAuto contine variabila,egal cu valoare sau expresie si 0 sau mai multe virgule.
-declaration contine Declare+ una sau mai multe long_var_dec type_var_dec decAuto.
-atribution_dec contine Variabila egal cu value/expression,sau CLASS_VARIABLE egal cu variable.
-ArrayValueDec contine Variabila si Array_Nr
-FunctionDec are 2 obtiuni,una cu body si una fara.Cea cu body are intre Start si Finish unu sau mai multe statments si ;.Iar cea fara body nu are nimic intre start si finish.
-ForDec contine doua optiuni,una cu FROM nr to nr,si cealalta variable in variable.
-FunctionExec contine Exec,variabila si intre paranteze o atribuire sau  o declarare de variabila.
-lambdaFunction este diferita de FunctionDec deoarece nu contine Start Finish,si nici parametrii.
-IfStatments are 2 optiuni,una fara else,iar cealalta cu else.
-Expressions are mai multe optiuni,in stanga poate fi o expresie,in dreapta la fel iar intre ele un operator.Sau poate fi o expresie intr o paranteza,sau doar un statment.


index.ts:
-StatementNode returneaza JSON ul pentru statement.
-VarNode returneaza JSON ul pentru o variabila.
-ValueNode returneaza JSON ul pentru un value.In constructor,se verifica ce tip de variabila este value folosind RegularExpresions.
-DeclarationNode returneaza un JSON pentru un element.value va fi un JSON generat de VarNode,ValNode sau ExpressionNode.
-DeclarationNodeShort returneaza un JSON pentru un element care e declarat in .ast fara sa primeasca o valoare.
-DeclarationNodeShortNode returneaza un JSON ce contine mai multe elemente de tipul DeclarationNode,DeclarationNodeShort.
-TypeNode returneaza tipul un JSON ce contine un type.
-AtribNode returneaza un JSON pentru operatia de atribuire.To si from pot fi Varnode,ClassProprietyNode,ExpressionNode sau Valnode.
-ExpressionNode returneaza un JSON pentru o expresie.
-AssignNodeArray returneaza un JSON pentru operatia de assign pentru un array.
-ArrayNodeView returneaza JSON ul pentru un Array.
-FunctionParameter returneaza JSON pentru un parametru dintr o functie
-FunctionDefinition returneaza JSON ul pentru o functie.parameters este de tipul FunctionParameter iar statements este de tipul StatementsNode.
-DeclarationNodeShortClass returneaza un JSON pentru un local propriety dintr o clasa.Acest propiety nu are in declaration si o atribuire.
-DeclarationNodeClass face acelasi lucru ca DeclarationNodeShortClass doar ca propiety ul are in declaration si o atribuire.
-ClassObject returneaza un JSON pentru un obiect.
-ForClassicNode returneaza un JSON pentru un For de tipul(for i from 1 to 100 start)
-ForInForNode returneaza un JSON pentru un For de tipul for expression(for i in list start)
-WhileNode returneaza un JSON pentru While statement.
-RepeatNode returneaza un JSON pentru un Repeat statement.
-FunctionCallParamater returneaza un JSON pentru parametrii dintr un Function Call (exec _getpid();)
-FunctionCallNode returneaza  un JSON pentru un FunctionCall
-IfNode returneaza un JSON pentru un If statement.
In clasa Visitator default result este un statement gol.
-VisitMultipleLine viziteaza MultipleLine si returneaza un statement nou sau o eroare daca array ul in care se vor salva toate statements va fi gol.
-VisitVariableDeclaration viziteaza VariableDeclaration si returneaza un DeclarationNodeShortNode.Se parcurge intr un for toate elementele din long_var_dec().Se verifica de fiecare data daca c[i].value este variabila sau valoare.Este important deoarece daca este value,in d se va adauga un DeclarationNode ce contine ca value un valueNode.Daca este variabila,va contine un varnode.Daca nu este nici value nici varnode,dar este expressionNode,DeclarationNode va contine un expressionNode.
-VisitVariableDeclarationShort face acelasi lucru doar ca nu contione value.
-visitVarableAuto returneaza acelesi lucru doar ca fiecare element va avea ca type:"auto" deoarece statement ul  nu contine un tip de date.
-VisitClassDeclaration returneaza un classNode.Se pargurg toate elementele din ctx.proprietyDec() si in d se salveaza elemente de tip declarationNode.Dupa ce se termina for ul,se returneaza un ClassNode ce contine numele variabilei,array ul de declarationNode si l ce contine linia.
-VisitArrayDeclaration returneaza un ArrayNode.In left se vor salva numerele din ctx.Array_Nbmer eliminandu se parantezele.Intr un for, se va parcurge left.In left se vor salva numerele ce apar pana la :,iar in right,valorile de dupa : iar mai apoi se returnaza ArrayNode ul.
-visitArray_assign_value returneaza un assignNodeArray ce este format dintr un ArrayNodeView,un Valnode si linia pe care se afla comanda.
-visitArrayElement_assign_value face acelasi lucru doar ca pentru ArrayElement_assign_valueContext.
-visitArrayFunctionElement_assign_value este folosit pentru ArrayFunctionElement_assign_valueContext.
-visitAtribution returneaza un AtribNode ce contine un varNode pentru ctx.VARIABLE() si un valueNode pentru ctx.Value().
-visitAtributionExpression  returneaza un AtribNode ce contine un varNode pentru ctx.VARIABLE() si un ctx.expression pentru ctx.Value().
-visitAtributionClass  returneaza un AtribNode ce contine un ClassPropertyNode si un ValNode.
-visitFunctionNoBody returneaza un FunctionDefinition.In c se vor salva toate elementele din type_var_dec() iar in d se vor salva toate elementele din c,ca FunctionParameter.Se returneaza un FunctionDefinition cu numele din ctx.Variable(),array ul d,tipul variabiei,iar statments va fi un array gol deoarece functia nu contine statements.
-VisitFunctionWithBody face acelasi lucru doar ca statments nu va fi gol,va contine array ul ss,ce contine toate elementele  din ctx.statements ca StatementsNode.
-VisitFunctionLamda returneaza FunctionDefinition,doar ca nu contine functionParameters.
-VisitValueInt returneaza un ValNode ce contine ctx.INT_NUMBER().text si linia.Acelasi lucru se intampla si cu visitValueDeclaration,visitValueFloat,visitValueString,visitValueBool,visitValueEmpty,visitValueArrayNumber.
 -visitClassVariable returneza ClassPropertyNode,in variab1 se va salva ce se afla in ctx.CLASS_VARIABLE().text inaite de .,iar in variab2 ce se afla dupa . .Se returneaza un ClassPropertyNode ce va contine un ClassObject ce are ca parametrii variab1 si linia pe care se afla,variab2 si linia.
 -visitForClassic returneaza un ForClassicNode.In ss[i] se salveaza toate elementele din statmentsNode.
 -VisitForinFor returneaza un ForInForNode.
 -VisitWhileDeclaration returneaza un WhileNode.In ss se salveaza statementsNode,in cd expresia iar in cdd operatorul din cd.
 -visitRepeatDeclaration functioneaza pe acelasi principiu doar ca pentru ctx:RepeatDeclarationContext si returneaza un repeatNode.
 -VisitIfSimple returneaza un IfNode.In IfNode else va fi undefined
 -VisitIfElse returneaza un Ifnode.Se creaza 2 Array StatementsThen si StatementELse.In c se salveaza linia pe care se afla else ul.In for daca statement ul este mai mic decat c,se salveaaza in StatementsThen,daca nu,in StatementsElse.Se returneaza un IfNode nou ce contine cdd ca expresie,array ul statmentsThen,array ul StatmentElse si linia.
 -VisitExpressionDiv returneaza un ExpressionNode nou.stanga va contine primul expression,dreapta,al doilea.op operatorul.Acelasi lucru fac si celelalte VisitExpression.
 ARRAY_NMBER contine intervalul de numere folosit la declararea unui array.
 Array_Nr contine un numar intre paranteze ce va fi folosit pentru accesarea elementelor din array.
 Float_Number va fi folosit pentru numerele de tip float.
 String_Text va fi textul unui string.
 Commentary ul va fi skipped.
 ClassVariable va contine 2 cuvinte despartite de '.'
 Variable contine un cuvant.
 Spatiile,tab urile si new line urile vor fi ignorate.
 type contine toate token urile ce pot fi un type.
 value contine toate token uirle ce pot fi o valoare.
 Fiecare declarare,expression,type vor fi vizitate in index.ts



### Implémentation 
