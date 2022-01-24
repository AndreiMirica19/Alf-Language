import { CharStreams, CodePointCharStream, CommonTokenStream, Token } from 'antlr4ts';
import { AlfLexer } from './AlfLexer.js';
import { AlfParser, ArrayClassFieldElement_assign_valueContext, ArrayDeclarationContext, ArrayElement_assign_valueContext, ArrayFunctionElement_assign_valueContext, ArrayValueContext, ArrayValueDecContext, Array_assign_valueContext, Array_assign_variableContext, Array_decContext, AtributionClassContext, AtributionContext, AtributionExpresionContext, ClassDeclarationContext, ClassVariableContext, DeclarationRuleContext,ExpresionAddContext,ExpresionDivContext,ExpresionEQUALContext,ExpresionGreaterContext,ExpresionGREATER_EQUALContext,ExpresionLESSERContext,ExpresionLESSEREQUALContext,ExpresionMulContext,ExpresionParanthesesContext,ExpresionRemContext,ExpresionSubContext,ExpresionvalueContext,ExpressionContext,ForClassicContext,ForinForContext,FunctionExecVariableContext,FunctionLambdaContext,FunctionNoBodyContext,FunctionWithBodyContext,IfElseContext,IfSimpleContext,LambdaFunctionContext,MultipleLinesContext,RepeatDeclarationContext,TypeBoolContext,  TypeEmptyContext,  TypeFloatContext, TypeIntContext,  TypeStringContext, TypeVariableContext, ValueArrayNumberContext, ValueBoolContext, ValueDeclarationContext, ValueEmptyContext, ValueFloatContext, ValueIntContext,  ValueStringContext, ValueVariableContext, VarableAutoContext, VariableDeclarationContext, VariableDeclarationShortContext, WhileDeclarationContext } from './AlfParser.js';
import { AlfListener } from './AlfListener.js';
import { AlfVisitor } from './AlfVisitor.js';
import * as fs from 'fs';
import { ParseTree } from 'antlr4ts/tree/ParseTree';
import { AbstractParseTreeVisitor } from 'antlr4ts/tree/AbstractParseTreeVisitor';
import { toCharArray } from 'antlr4ts/misc/Utils';
import { TerminalNode } from 'antlr4ts/tree/TerminalNode';
import { SuppressWarnings } from 'antlr4ts/Decorators';

let FloatnumbersExp:RegExp=/[.0-9]+/
let numbersExp:RegExp=/[0-9]+/
let stringExp:RegExp=/[a-zA-Z0-9"]+/
let valueExp:RegExp=/[a-zA-Z]+/
let source=process.argv.slice(2);
let input: string = fs.readFileSync(source[0]).toString();
let inputStream: CodePointCharStream = CharStreams.fromString(input);
let lexer: AlfLexer = new AlfLexer(inputStream);
let tokenStream: CommonTokenStream = new CommonTokenStream(lexer);
let parser: AlfParser = new AlfParser(tokenStream);

// Parse the input, where `prog` is whatever entry point you defined
let tree = parser.start();
// console.log(tree);

abstract class ASTNode {
    constructor(){};
}

class ClassNode extends ASTNode{
    constructor( public readonly variable: string,public readonly declaration:(DeclarationNodeShortClass|DeclarationNodeClass)[],public readonly line: number){
        super()
    }
    toJSON() {
        
        return {
            id: "ClassDefinition",
            title:this.variable,
            properties:this.declaration,
            line:this.line+1
        }
    }
}
class ArrayNode extends ASTNode{
    constructor(public readonly title:string,public readonly type:string,
        public readonly from:string,public readonly to:string,public readonly line:number){
            super()
        }
     toJSON(){
         return{
             id:"Array",
             title:this.title,
             element_type:this.type,
             from:this.from,
             to:this.to,
             line:this.line

         }
     }   
}
class StatementsNode extends ASTNode {
   
    constructor(public readonly statements: ASTNode[],public readonly line: number) {
        super();
      
    }
    toJSON() {
        
        return {
            id: "Statements",
            statements:this.statements,
            line:this.line
        }
    }
}

class Varnode extends ASTNode{
   type=" "

    constructor(public readonly value: string|number|ExpressionNode|Boolean,public readonly line: string|number) {
        super();
       if(value=="true"){
       this.type="boolean"
       
       this.value= Boolean(this.value)
        
       }
       else
       if(value=="false"){
       this.type="boolean"
       
       this.value= Boolean(!this.value)      
       }
       else
       if(numbersExp.exec(value.toString())?.toString()==value.toString())
       this.type="integer"
       else
       if((FloatnumbersExp.exec(value.toString())?.toString()==value.toString()))
       this.type="float"
       else{
        this.value= this.value.toString().replace("\"",'')
        this.value=this.value.toString().replace("\"",'')
           if(this.value.toString().length!=1)
          this.type="string"
          else
          this.type="symbol"
         

       }

        
    }
    
    toJSON() {
        return {
            id: "Variable",
            title: this.value,
            line:this.line
        
        }
    }
}
class Valnode extends ASTNode{
    type=" "
 
     constructor(public readonly value: string|number|ExpressionNode|boolean,public readonly line: string|number) {
         super();
        if(this.value=="empty")
        this.type="empty" 
        else 
        if(this.value=="true"){
        this.type="boolean"
        this.value= Boolean(this.value)
        }
        else
        if(this.value=="false"){
        this.type="boolean"
        this.value= Boolean(!this.value)
       
        
        }
        else
        if(numbersExp.exec(value.toString())?.toString()==value.toString()){
        this.type="integer"
        this.value=parseInt(this.value.toString())
        }
        else
        if((FloatnumbersExp.exec(value.toString())?.toString()==value.toString())){
        this.type="float"
        this.value=parseFloat(this.value.toString())
        }
        else{
         this.value= this.value.toString().replace("\"",'')
         this.value=this.value.toString().replace("\"",'')
            if(this.value.toString().length!=1)
           this.type="string"
           else
           this.type="symbol"
          
 
        }
 
         
     }
     
     toJSON() {
         return {
             id: "Value",
             type: this.type,
             value: this.value,
             line:this.line
         
         }
     }
 }
class DeclarationNode extends ASTNode {
    
    constructor(public readonly variable_type: string, public readonly variable: string, public readonly op: string, public readonly value: Varnode|ExpressionNode|Valnode,public readonly line: number) {
        super();
        
    }
    
    toJSON() {
        return {
            id: "DeclarationElement",
            type:this.variable_type,
            title:this.variable,
            value:this.value,
            line:this.line
        
        }
    }
}
class DeclarationNodeShort extends ASTNode{
    constructor(public readonly variable_type: string, public readonly variable: string,public readonly line:number) {
        super();
        
    }
    
    toJSON() {
        return {
            id: "DeclarationElement",
            type: this.variable_type,
            title: this.variable,
            line:this.line
        
        }
    }
}
class DeclarationNodeShortNode extends ASTNode{
    constructor(public readonly  d:DeclarationNodeShort[]|DeclarationNode[]|(DeclarationNodeShort|DeclarationNode)[],public readonly line:number) {
        super();
        
    }
    
    toJSON() {
        return {
            id: "Declaration",
            elements:this.d,
            line:this.line
        
        }
    }
}

class TypeNode extends ASTNode {
    constructor(public readonly type_name: string,public readonly line: number) {
        super();
    }
    toJSON() {
        return  {
            type: this.type_name
        }
    }
}
class AtribNode extends ASTNode{
    constructor(public readonly to:Varnode|ClassPropertyNode|ExpressionNode|Valnode,public readonly from:Varnode|ClassPropertyNode|ExpressionNode|Valnode,public readonly line:number){
        super()
    }
    toJSON(){
        return{
            id:"Assign",
            to:this.to,
            from:this.from,
            line:this.line

        }
    }
}
class ExpressionNode extends ASTNode {
    constructor( public readonly left: ExpressionNode,public readonly op: string, public readonly right: ExpressionNode,public readonly line:number) {
        super();
    }
    toJSON() {
        return {
            id:"Expression",
            op: this.op,
            left: this.left,
            right: this.right,
            line:this.line
        }
    }
}
class AssignNodeArray extends ASTNode{
  constructor(public readonly array:ArrayNodeView,public readonly from:Varnode|ExpressionNode|Valnode|ArrayNodeView,public readonly line:number){
      super()
  }
  toJSON(){
      return{
      id:"Assign",
      to:this.array,
      from:this.from,
      line:this.line
      }
  }

}
class ArrayNodeView extends ASTNode{
    constructor(public readonly name:string,public readonly index:Varnode|Valnode|ArrayNodeView|FunctionCallNode|ClassPropertyNode,public readonly line:number) {
        super();
    }
    toJSON() {
        return {
           id:"ArrayElement",
           array:this.name,
           index:this.index,
           line:this.line
        }
    }
}

class FunctionParameters extends ASTNode{
    constructor(public readonly type:string,public readonly name:string){
        super()
    }
    toJSON(){
      return {
          id:"FunctionDefinitionParameter",
          type:this.type,
          name:this.name

      }
    }
}
class FunctionDefinition extends ASTNode{
    constructor(public readonly title:string,public readonly parameters:FunctionParameters[],public readonly return_type:string,public readonly statements:StatementsNode[],
        public readonly line:number){
        super()
    }
    toJSON(){
        return{
            id:"FunctionDefinition",
            title:this.title,
            parameters:this.parameters,
            return_type:this.return_type,
            statements:this.statements,
            line:this.line
        }
    }
}

class DeclarationNodeShortClass extends ASTNode{
    constructor(public readonly variable_type: string, public readonly variable: string,public readonly line:number) {
        super();
        
    }
    
    toJSON() {
        return {
            id: "LocalProperty",
            type: this.variable_type,
            title: this.variable,
            line:this.line
        
        }
    }
}
class DeclarationNodeClass extends ASTNode {
    
    constructor(public readonly variable_type: string, public readonly variable: string, public readonly op: string, public readonly value: Varnode|ExpressionNode|Valnode,public readonly line: number) {
        super();
        
    }
    
    toJSON() {
        return {
            id: "LocalProperty",
            type:this.variable_type,
            title:this.variable,
            value: this.value,
            line:this.line
        
        }
    }
}
class ClassObject extends ASTNode {
    constructor(public readonly title:string,public readonly line:number){
       super()
    }
    toJSON(){
        return{
            id:"Variable",
            title:this.title,
            line:this.line
        }
    }
}
    
class ClassPropertyNode  extends ASTNode {
    constructor(public readonly object:ClassObject,public readonly title:string,public readonly line:number){
       super()
    }
    toJSON(){
        return{
            id:"ClassProperty",
            object:this.object,
            title:this.title,
            line:this.line
        }
    }
}

class ForClassicNode extends ASTNode{
    constructor(public readonly variable:string,public readonly from:Varnode|Valnode,public readonly to:Varnode|Valnode,public readonly statements:StatementsNode[],public readonly line:number){
        super()
    }
    toJSON(){
        return{
            id:"ForLoop",
            variable:this.variable,
            from:this.from,
            to:this.to,
            statements:this.statements,
            line:this.line
        }
    }
}
class ForinForNode extends ASTNode{
    constructor(public readonly variable:string,public readonly from:Varnode,public readonly statements:StatementsNode[],public readonly line:number){
        super()
    }
    toJSON(){
        return{
            id:"ForLoop",
            variable:this.variable,
            exp:this.from,
            statements:this.statements,
            line:this.line
        }
    }
}
class WhileNode extends ASTNode{
    constructor(public readonly exp:ExpressionNode,public readonly statement:StatementsNode[],public readonly line:number){
        super()
    }
    toJSON(){
        return{
            id: "WhileLoop",
            exp:this.exp,
            statements:this.statement,
            line:this.line

        }
    }
}
class RepeatNode extends ASTNode{
    constructor(public readonly exp:ExpressionNode,public readonly statement:StatementsNode[],public readonly line:number){
        super()
    }
    toJSON(){
        return{
            id: "RepeatLoop",
            exp:this.exp,
            statements:this.statement,
            line:this.line

        }
    }
}
class FunctionCallParameter extends ASTNode{
    constructor(public readonly name:string,public readonly value:Valnode,public readonly line:number){
        super()
    }
    toJSON(){
        return{
            id:"FunctionCallParameter",
            name:this.name,
            value:this.value
        }
    }
}
class FunctionCallNode extends ASTNode{
    constructor(public readonly function_name:string,public readonly parameters:FunctionCallParameter[],public readonly line:number){
        super()
    }
    toJSON(){
        return {
            id:"FunctionCall",
            function_name:this.function_name,
            parameters:this.parameters,
            line:this.line
        }
    }
}
class IfNode extends ASTNode{
    constructor(public readonly exp:ExpressionNode,public readonly statementThen:StatementsNode[],public readonly statementElse:StatementsNode[]|undefined,public readonly line:number){
        super()
    }
    toJSON(){
        return{
            id:"IfBranch",
            exp:this.exp,
            then:this.statementThen,
            else_then:this.statementElse,
            line:this.line
        }
    }
}
let index:number[]=new Array
let c=0
class Visitator extends AbstractParseTreeVisitor<ASTNode>implements AlfVisitor<ASTNode>{
    protected defaultResult(): ASTNode {
       return new StatementsNode([],0);
    }
    visitMultipleLines(ctx:MultipleLinesContext):StatementsNode{
        let s=[]
        let c:number|undefined
      for(let i=0;i<ctx.statement().length;i++){
      s[i] = this.visit(ctx.statement(i));
      c=ctx.statement(i)._stop?.line
      }
      if(s){
          
        return new StatementsNode(s,c!)
      }
      else 
      throw new Error()  
    }

    visitVariableDeclaration(ctx:VariableDeclarationContext):DeclarationNodeShortNode{
        let c=ctx.long_var_dec()
        let d:DeclarationNode[]=new Array
        for(let i=0;i<c.length;i++){
        
        if(c[i].value()!=undefined){    
        if(FloatnumbersExp.exec(c[i].value()?.text!)?.toString()==c[i].value()?.text||stringExp.exec(c[i].value()?.text!)?.toString()==c[i].value()?.text)  
        if(valueExp.exec(c[i].value()!.text)?.toString()==c[i].value()!.text)
        d.push(new DeclarationNode(
            (this.visit(c[i].type()) as TypeNode).type_name,
            c[i].VARIABLE().text,
            c[i].EQ().text,
            (this.visit(c[i].value()!) as Varnode),
            c[i].VARIABLE()._symbol.line
        ))
        else
        d.push(new DeclarationNode(
            (this.visit(c[i].type()) as TypeNode).type_name,
            c[i].VARIABLE().text,
            c[i].EQ().text,
            (this.visit(c[i].value()!) as Valnode),
            c[i].VARIABLE()._symbol.line
        ))
        }
        else
        if(c[i].expression()!=undefined)
        d.push(new DeclarationNode(
            (this.visit(c[i].type()) as TypeNode).type_name,
            c[i].VARIABLE().text,
            c[i].EQ().text,
            (this.visit(c[i].expression()!) as ExpressionNode),
            c[i].VARIABLE()._symbol.line
        ))
        }
        return new DeclarationNodeShortNode(d,c[c.length-1].VARIABLE()._symbol.line)
    }
   visitVariableDeclarationShort(ctx:VariableDeclarationShortContext):DeclarationNodeShortNode{
       let c=ctx.type_var_dec()
       let d:DeclarationNodeShort[]=new Array
      for(let i=0;i<c.length;i++){
      
       d.push(new DeclarationNodeShort(
        (this.visit(c[i].type()) as TypeNode).type_name,
        c[i].VARIABLE().text,
        c[i].VARIABLE()._symbol.line
       ))
      }
      return new DeclarationNodeShortNode(
          d,c[c.length-1].VARIABLE()._symbol.line
      )
   }
   visitVarableAuto(ctx:VarableAutoContext):DeclarationNodeShortNode{
    let c=ctx.decAuto()
    let d:DeclarationNode[]=new Array
   for(let i=0;i<c.length;i++){
    if(valueExp.exec(c[i].value()!.text)?.toString()==c[i].value()!.text)  
    d.push(new DeclarationNode(
     "auto",
     c[i].VARIABLE().text,
     c[i].EQ().text,
     (new Varnode(c[i].value()?.text!,c[i].value()?._stop?.line!)),
     c[i].VARIABLE()._symbol.line
    ))
    else
    d.push(new DeclarationNode(
        "auto",
        c[i].VARIABLE().text,
        c[i].EQ().text,
        (new Valnode(c[i].value()?.text!,c[i].value()?._stop?.line!)),
        c[i].VARIABLE()._symbol.line
       ))
   }
   return new DeclarationNodeShortNode(
       d,c[c.length-1].VARIABLE()._symbol.line
   )    
   }
    visitClassDeclaration(ctx: ClassDeclarationContext):ClassNode{
        let c=ctx.proprietyDec();
        let eq=""
        let v=""
        let l= ""
        let d:(DeclarationNodeShortClass|DeclarationNodeClass)[]=new Array
        
        for(let i=0;i<c.length;i++){
            if(c[i].EQ()?.text!=undefined&&c[i].value()?.text!=undefined){
                eq=c[i].EQ()?.text!
        
                v=c[i].value()?.text!
                if(valueExp.exec(v)?.toString()==v){
                d.push(new DeclarationNodeClass(
                    c[i].type().text,
                    c[i].VARIABLE().text,
                    eq!,
                    (this.visit(c[i].value()!) as Varnode),
                    c[i].VARIABLE()._symbol.line
                    ))
                    l= c[i].VARIABLE()._symbol.line.toString()

                }
                else{    
                d.push(new DeclarationNodeClass(
                c[i].type().text,
                c[i].VARIABLE().text,
                eq!,
                (this.visit(c[i].value()!) as Valnode),
                c[i].VARIABLE()._symbol.line
                ))
                l= c[i].VARIABLE()._symbol.line.toString()
                }
            }
            else
                d.push(new DeclarationNodeShortClass(
                 c[i].type().text,
                c[i].VARIABLE().text,
                 c[i].VARIABLE()._symbol.line,
                 ))
        l= c[i].VARIABLE()._symbol.line.toString()
              
        eq=""
        v=""
      
        }
        let df
        if(l==""){
         l=((ctx.END()._symbol.line)-1).toString()
         
        }
      return new ClassNode(
        ctx.VARIABLE().text,
        d,
        parseInt(l)  
            
        );
       
    }
   
    visitArrayDeclaration(ctx:ArrayDeclarationContext):ArrayNode{
        let left=ctx.ARRAY_NMBER().text
        
        left=left.replace("[","")
        left=left.replace("]","")
        let c=0
        for(let i=0;i<left.length;i++){
          if(left[i]==":"){
          c=i
          break;
          }  
        }
        let right=left.substr(c+1,left.length-1)
         left=left.substr(0,c)
        return new ArrayNode(
         ctx.VARIABLE().text,
         ctx.type().text,
         left,
         right,
         ctx.VARIABLE()._symbol.line
        )
    }
    visitArrayValue(ctx:ArrayValueContext):ArrayNodeView{
        let s=ctx.ARRAY_NR().text
       s= s.replace("[",'')
       s= s.replace("]",'')
        return new ArrayNodeView(
            ctx.VARIABLE().text,
            new Varnode(s,ctx.VARIABLE()._symbol.line),
            ctx.VARIABLE()._symbol.line
        )
    }
    visitArray_assign_value(ctx: Array_assign_valueContext):AssignNodeArray{
        let s=ctx.ARRAY_NR().text
        s= s.replace("[",'')
       s= s.replace("]",'')
        return new AssignNodeArray(
            new ArrayNodeView(
                ctx.VARIABLE().text,
                new Valnode(s,ctx.VARIABLE()._symbol.line),
                ctx.VARIABLE()._symbol.line
            ),
            new Valnode(ctx.value().text,ctx.VARIABLE()._symbol.line),
            ctx.VARIABLE()._symbol.line
        )
    }
    visitArrayElement_assign_value(ctx:ArrayElement_assign_valueContext):AssignNodeArray{
        let s=ctx.ARRAY_NR()!.text
        s= s.replace("[",'')
       s= s.replace("]",'')
        return new AssignNodeArray(
            new ArrayNodeView(
                ctx.VARIABLE(0).text,
                new ArrayNodeView(ctx.VARIABLE(1).text,new Valnode(s,ctx.VARIABLE(1)._symbol.line),ctx.VARIABLE(1)._symbol.line),
                ctx.VARIABLE(1)._symbol.line
            ),
            new Valnode(ctx.value().text,ctx.VARIABLE(1)._symbol.line),
            ctx.VARIABLE(1)._symbol.line
        )
    }
    visitArrayFunctionElement_assign_value(ctx:ArrayFunctionElement_assign_valueContext):AssignNodeArray{
        let c=(ctx.functionExec() as FunctionExecVariableContext)
         let d=new Array
         d=c.value_dec();
         
        return new AssignNodeArray(
            

            new ArrayNodeView(
                ctx.VARIABLE().text,
                new FunctionCallNode (c.VARIABLE().text,d,c.RP()._symbol.line),
                ctx.VARIABLE()._symbol.line
            ),
            new Valnode(ctx.value().text,ctx.VARIABLE()._symbol.line),
            ctx.VARIABLE()._symbol.line
        )
    }
    visitArrayClassFieldElement_assign_value(ctx:ArrayClassFieldElement_assign_valueContext):AssignNodeArray{
        let variab=ctx.CLASS_VARIABLE().text
        let variab1=""
        let variab2=""
        let c=0
        for(let i=0;i<variab.length;i++){
         if(variab[i]=="."){
           c=i;
           break;
         }
        
        }
        variab1=variab.substr(0,c)
        variab2=variab.substr(c+1,variab.length-1)
         
        return new AssignNodeArray(
            

            new ArrayNodeView(
                ctx.VARIABLE().text,
                new ClassPropertyNode(
                    new ClassObject(variab1,ctx.CLASS_VARIABLE()._symbol.line),
                    variab2,
                    ctx.CLASS_VARIABLE()._symbol.line),
                ctx.VARIABLE()._symbol.line
            ),
            new Valnode(ctx.value().text,ctx.VARIABLE()._symbol.line),
            ctx.VARIABLE()._symbol.line
        )
    }
    
    visitAtribution(ctx:AtributionContext):AtribNode{
        return new AtribNode(
            new Varnode(ctx.VARIABLE().text,ctx.VARIABLE()._symbol.line),
            new Valnode(ctx.value().text,ctx.VARIABLE()._symbol.line),
            ctx.VARIABLE()._symbol.line

        )
    }
    visitAtributionExpresion(ctx: AtributionExpresionContext):AtribNode{
        let c=ctx.expression()
        
        
        return new AtribNode(
            new Varnode(ctx.VARIABLE().text,ctx.VARIABLE()._symbol.line),
            this.visit(ctx.expression())as ExpressionNode,
            ctx.VARIABLE()._symbol.line

        )

    }
    visitAtributionClass(ctx:AtributionClassContext):AtribNode{
        let variab=ctx.CLASS_VARIABLE().text
        let variab1=""
        let variab2=""
        let c=0
        for(let i=0;i<variab.length;i++){
         if(variab[i]=="."){
           c=i;
           break;
         }
        
        }
        variab1=variab.substr(0,c)
        variab2=variab.substr(c+1,variab.length-1)
        return new AtribNode(
             new ClassPropertyNode(
                new ClassObject(variab1,ctx.CLASS_VARIABLE()._symbol.line),
                variab2,
                ctx.CLASS_VARIABLE()._symbol.line),
            new Valnode(ctx.value().text,ctx.CLASS_VARIABLE()._symbol.line),
            ctx.CLASS_VARIABLE()._symbol.line

        )
    }
    visitFunctionNoBody(ctx:FunctionNoBodyContext):FunctionDefinition{
        let c=ctx.type_var_dec()
        let d:FunctionParameters[]=new Array
        let l=0
        for(let i=0;i<c.length;i++){
         d.push(new FunctionParameters(c[i].type().text,c[i].VARIABLE().text) )
         l=c[i].VARIABLE()._symbol.line 
        }
        return new FunctionDefinition(
            ctx.VARIABLE().text,
            d,
            ctx.type().text,
            [],
            l
        )
    }
    visitFunctionWithBody(ctx:FunctionWithBodyContext):FunctionDefinition{
        let c=ctx.type_var_dec()
        let ss=[]=new Array
        let statements=ctx.statement()
        let d:FunctionParameters[]=new Array
        let s:StatementsNode[]=new Array
        let l=0
        
        for(let i=0;i<c.length;i++){
         d.push(new FunctionParameters(c[i].type().text,c[i].VARIABLE().text) )
        }
        for(let i=0;i<statements.length;i++){
            ss[i] = this.visit(ctx.statement(i));
            l=ctx.statement(i)._stop?.line!
        }
        s.push(new StatementsNode (ss,1))
        return new FunctionDefinition(
            ctx.VARIABLE().text,
            d,
            ctx.type().text,
            ss,
            ctx.END()._symbol.line
        )
    }
    visitFunctionLambda(ctx:FunctionLambdaContext):FunctionDefinition{
       let  c=ctx.statement()
        let ss=[]=new Array
        let statements=ctx.statement()
        let d:FunctionParameters[]=new Array
        let s:StatementsNode[]=new Array
        let l=0
        
       
        for(let i=0;i<statements.length;i++){
            ss[i] = this.visit(ctx.statement(i));
            l=ctx.statement(i)._stop?.line!
        }
        s.push(new StatementsNode (ss,1))
        return new FunctionDefinition(
            ctx.VARIABLE().text,
            d,
            ctx.type().text,
            ss,
            l
        )
    }
    visitValueDeclaration(ctx:ValueDeclarationContext):Valnode{
       
       return new Valnode(
        (this.visit(ctx.value()) as Valnode).value,(this.visit(ctx.value()) as Valnode).line)
       
    }

    visitValueInt(ctx: ValueIntContext): Valnode {
        return new Valnode(
            (ctx.INT_NUMBER().text),
            ctx.INT_NUMBER()._symbol.line
        );
    }
    visitValueFloat(ctx: ValueFloatContext): Valnode {
        return new Valnode(
        (ctx.FLOAT_NUMBER().text),ctx.FLOAT_NUMBER()._symbol.line
        );
    }
    visitValueString(ctx: ValueStringContext): Valnode {
        return new Valnode(
            ctx.STRING_TEXT().text,ctx.STRING_TEXT()._symbol.line
        );
    }
    visitValueBool(ctx:ValueBoolContext):Valnode{
        return new Valnode(
            ctx.BOOL().text,ctx.BOOL()._symbol.line
        );
    }
    visitValueEmpty(ctx:ValueEmptyContext):Valnode{
        return new Valnode(
            ctx.EMPTY().text,ctx.EMPTY()._symbol.line
        );
    }
    visitValueArrayNumber(ctx:ValueArrayNumberContext):Valnode{
            return new Valnode(
                ctx.ARRAY_NMBER().text,ctx.ARRAY_NMBER()._symbol.line
            )
    }
    visitClassVariable(ctx: ClassVariableContext):ClassPropertyNode{
        let variab=ctx.CLASS_VARIABLE().text
        let variab1=""
        let variab2=""
        let c=0
        for(let i=0;i<variab.length;i++){
         if(variab[i]=="."){
           c=i;
           break;
         }
        
        }
        variab1=variab.substr(0,c)
        variab2=variab.substr(c+1,variab.length-1)
        return new ClassPropertyNode(
        new ClassObject(variab1,ctx.CLASS_VARIABLE()._symbol.line),
        variab2,
        ctx.CLASS_VARIABLE()._symbol.line)
    }
    visitForClassic(ctx:ForClassicContext):ForClassicNode{
        let c=ctx.statement
        let ss=[]=new Array
        let statements=ctx.statement()
        let s:StatementsNode[]=new Array
        for(let i=0;i<statements.length;i++){
            ss[i] = this.visit(ctx.statement(i));
        }
        return new ForClassicNode(
           ctx.VARIABLE().text,
           new Valnode(ctx.INT_NUMBER(0).text,ctx.VARIABLE()._symbol.line
           ),
           new Valnode(ctx.INT_NUMBER(1).text,ctx.VARIABLE()._symbol.line
           ),
           ss,
           ctx.FINISH()._symbol.line
        )
    }
    visitForinFor(ctx:ForinForContext):ForinForNode{
        let c=ctx.statement
        let ss=[]=new Array
        let statements=ctx.statement()
        let s:StatementsNode[]=new Array
        for(let i=0;i<statements.length;i++){
            ss[i] = this.visit(ctx.statement(i));
        }
        
        return new ForinForNode(
           ctx.VARIABLE(0).text,
           new Varnode(ctx.VARIABLE(1).text,ctx.VARIABLE(1)._symbol.line
           ),
           ss,
           ctx.FINISH()._symbol.line
        )
    }
   visitWhileDeclaration(ctx:WhileDeclarationContext):WhileNode{
    let c=ctx.statement
    let ss=[]=new Array
    let statements=ctx.statement()
    let s:StatementsNode[]=new Array
    for(let i=0;i<statements.length;i++){
        ss[i] = this.visit(ctx.statement(i));
    }
    let cd=ctx.expression() as ExpresionGreaterContext
    let cdd=this.visitExpresionGreater(cd) as ExpressionNode
    return new WhileNode(
        cdd,
        ss,
        ctx.FINISH()._symbol.line
    )
   }
   visitIfSimple(ctx:IfSimpleContext):IfNode{
       let c=ctx.statement()
       let s:StatementsNode[]=new Array
       let ss=[]=new Array
       let statements=ctx.statement()
       for(let i=0;i<statements.length;i++){
        ss[i] = this.visit(ctx.statement(i));
    }
    let cd=ctx.expression() as ExpresionGreaterContext
    let cdd=this.visitExpresionGreater(cd) as ExpressionNode
    return new IfNode(
        cdd,
        ss,
        undefined,
        ctx.END()._symbol.line
    )

   }
   visitIfElse(ctx:IfElseContext):IfNode{
       let c=ctx.ELSE()._symbol.line
       let s:StatementsNode[]=new Array
       let statementsThen=[]=new Array
       let statementsElse=[]=new Array
       let statements=ctx.statement()
       for(let i=0;i<statements.length;i++){
         if(ctx.statement(i)._stop?.line!<c)  
           statementsThen[i] = this.visit(ctx.statement(i));
        else
        if(ctx.statement(i)._stop?.line!>c) 
        statementsElse.push(this.visit(ctx.statement(i)));
    }
    let cd=ctx.expression() as ExpresionGreaterContext
    let cdd=this.visitExpresionGreater(cd) as ExpressionNode
    return new IfNode(
        cdd,
        statementsThen,
        statementsElse,
        ctx.END()._symbol.line
    )
   }
   visitRepeatDeclaration(ctx:RepeatDeclarationContext):RepeatNode{
    let c=ctx.statement
    let ss=[]=new Array
    let statements=ctx.statement()
    let s:StatementsNode[]=new Array
    for(let i=0;i<statements.length;i++){
        ss[i] = this.visit(ctx.statement(i));
    }
    let cd=ctx.expression() as ExpresionGreaterContext
    let cdd=this.visitExpresionGreater(cd) as ExpressionNode
    return new RepeatNode(
        cdd,
        ss,
        ctx.WHILE()._symbol.line
    )
   }
  visitFunctionExecVariable(ctx:FunctionExecVariableContext):FunctionCallNode{
      let c=ctx.atribution_dec()
      let d=[]
      let dd=[]
      for(let i=0;i<c.length;i++){
          d.push(c[i]as AtributionContext)
          dd.push(new FunctionCallParameter(d[i].VARIABLE().text,new Valnode(d[i].value().text,d[i].value()._stop?.line!),d[d.length-1].VARIABLE()._symbol.line))
      }
      return new FunctionCallNode(
          ctx.VARIABLE().text,
           dd,
          ctx.VARIABLE()._symbol.line
      )
  }
    visitTypeInt(ctx: TypeIntContext): TypeNode {
        return new TypeNode(
            ctx.INT().text,ctx.INT()._symbol.line
        )
    }
    visitTypeString(ctx: TypeStringContext): TypeNode {
        return new TypeNode(
            ctx.STRING().text,ctx.STRING()._symbol.line
        )
    }
    visitTypeFloat(ctx: TypeFloatContext): TypeNode {
        return new TypeNode(
            ctx.FLOAT().text,ctx.FLOAT()._symbol.line
        )
    }
    visitTypeBool(ctx: TypeBoolContext):TypeNode{
        return new TypeNode(
            ctx.BOOLEAN().text,ctx.BOOLEAN()._symbol.line

        )
    }
    visitTypeVariable(ctx:TypeVariableContext):TypeNode{
        return new TypeNode(
            ctx.VARIABLE().text,ctx.VARIABLE()._symbol.line
        )
    }
    visitTypeEmpty(ctx:TypeEmptyContext):TypeNode{
        
        return new TypeNode(
            ctx.EMPTY().text,ctx.EMPTY()._symbol.line
        )
    }
   
    visitValueVariable(ctx: ValueVariableContext):Varnode{
        return new Varnode(ctx.VARIABLE().text,ctx.VARIABLE()._symbol.line)
    }
    visitExpresionDiv(ctx: ExpresionDivContext):ExpressionNode{
        const stange=this.visit(ctx.expression(0))
        const dreapta=this.visit(ctx.expression(1))
        const operator=ctx._op
        if(operator!=undefined){
            
           return new ExpressionNode(stange as ExpressionNode,operator.text!,dreapta as ExpressionNode,operator.line)
        }
       else throw new Error()
    }
    visitExpresionMul(ctx: ExpresionMulContext):ExpressionNode{
        const stange=this.visit(ctx.expression(0))
        const dreapta=this.visit(ctx.expression(1))
        const operator=ctx._op
        if(operator!=undefined){
            
           return new ExpressionNode(stange as ExpressionNode,operator.text!,dreapta as ExpressionNode,operator.line)
        }
       else throw new Error()
    }
    visitExpresionRem(ctx: ExpresionRemContext):ExpressionNode{
        const stange=this.visit(ctx.expression(0))
        const dreapta=this.visit(ctx.expression(1))
        const operator=ctx._op
        if(operator!=undefined){
            
           return new ExpressionNode(stange as ExpressionNode,operator.text!,dreapta as ExpressionNode,operator.line)
        }
       else throw new Error()
    }
    visitExpresionAdd(ctx: ExpresionAddContext):ExpressionNode{
        const stange=this.visit(ctx.expression(0))
        const dreapta=this.visit(ctx.expression(1))
        const operator=ctx._op
        if(operator!=undefined){
            
           return new ExpressionNode(stange as ExpressionNode,operator.text!,dreapta as ExpressionNode,operator.line)
        }
       else throw new Error()
    }
    visitExpresionSub(ctx: ExpresionSubContext):ExpressionNode{
        const stange=this.visit(ctx.expression(0))
        const dreapta=this.visit(ctx.expression(1))
        const operator=ctx._op
        if(operator!=undefined){
            
           return new ExpressionNode(stange as ExpressionNode,operator.text!,dreapta as ExpressionNode,operator.line)
        }
       else throw new Error()
    }
    visitExpresionEQUAL(ctx:ExpresionEQUALContext):ExpressionNode{
        const stange=this.visit(ctx.expression(0))
        const dreapta=this.visit(ctx.expression(1))
        const operator=ctx._op
        if(operator!=undefined){
            
           return new ExpressionNode(stange as ExpressionNode,operator.text!,dreapta as ExpressionNode,operator.line)
        }
       else throw new Error()
    }
    visitExpresionGreater(ctx:ExpresionGreaterContext):ExpressionNode{
        const stange=this.visit(ctx.expression(0))
        const dreapta=this.visit(ctx.expression(1))
        const operator=ctx._op
        if(operator!=undefined){
            
           return new ExpressionNode(stange as ExpressionNode,operator.text!,dreapta as ExpressionNode,operator.line)
        }
       else throw new Error()
    }
    visitExpresionGREATER_EQUAL(ctx:ExpresionGREATER_EQUALContext):ExpressionNode{
        const stange=this.visit(ctx.expression(0))
        const dreapta=this.visit(ctx.expression(1))
        const operator=ctx._op
        if(operator!=undefined){
            
           return new ExpressionNode(stange as ExpressionNode,operator.text!,dreapta as ExpressionNode,operator.line)
        }
       else throw new Error()
    }
    visitExpresionLESSEREQUAL(ctx:ExpresionLESSEREQUALContext):ExpressionNode{
        const stange=this.visit(ctx.expression(0))
        const dreapta=this.visit(ctx.expression(1))
        const operator=ctx._op
        if(operator!=undefined){
            
           return new ExpressionNode(stange as ExpressionNode,operator.text!,dreapta as ExpressionNode,operator.line)
        }
       else throw new Error()
    }
    visitExpresionLESSER(ctx:ExpresionLESSERContext):ExpressionNode{
        const stange=this.visit(ctx.expression(0))
        const dreapta=this.visit(ctx.expression(1))
        const operator=ctx._op
        if(operator!=undefined){
            
           return new ExpressionNode(stange as ExpressionNode,operator.text!,dreapta as ExpressionNode,operator.line)
        }
       else throw new Error()
    }

    visitExpresionParantheses(ctx: ExpresionParanthesesContext){
        return(this.visit(ctx.expression()))
    }
    visitExpresionvalue(ctx: ExpresionvalueContext):Varnode|Valnode{
        if(numbersExp.exec(ctx.value().text)?.toString()!=ctx.value().text)
        return new Varnode(ctx.value().text,ctx.value()._start.line)
        else
        return new Valnode(ctx.value().text,ctx.value()._start.line)
    }
   
 
   
    
}

const visitor = new Visitator();
//console.log(JSON.stringify(visitor.visit(tree), null, 4));
let fileInput=require('fs')
if(source[1]==null){
    fileInput.writeFile(source[0]+".json",JSON.stringify(visitor.visit(tree), null, 4),  function(err:any) {
        if (err) {
            return console.error(err);
        }
        
    });
}
else{
    fileInput.writeFile(source[1],JSON.stringify(visitor.visit(tree), null, 4),  function(err:any) {
        if (err) {
            return console.error(err);
        }
        
    });
}

