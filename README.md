# Alf-Language
Parse the ALF language source file and generate a JSON abstract syntax tree (AST).

The assignment will take one or two parameters from the command line. The first parameter is the name of the file with the ALF script, the second is the output file. If the output file is missing, it will have the same name as the script file with the .json extension.

For example, in this case the output file will be script.json:

node main.js script.ast script.json
In the following example, taking into account that the second parameter is missing, the output file will be automatically generated, having the name script.ast.json:

node main.js script.ast
