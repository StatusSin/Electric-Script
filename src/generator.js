import { IfStatement } from "./core.js";

export default function generate(program) {
  const output = [];

  const targetName = ((mapping) => {
    return (entity) => {
      if (!mapping.has(entity)) {
        mapping.set(entity, mapping.size + 1);
      }
      return `${entity.name ?? entity.description}_${mapping.get(entity)}`;
    };
  })(new Map());

  function gen(node) {
    console.log(node.constructor.name);
    return generators[node.constructor.name](node);
  }

  const generators = {
    // Key idea: when generating an expression, just return the JS string; when
    // generating a statement, write lines of translated JS to the output array.
    Program(p) {
      gen(p.statements);
    },
    VarDeclaration(d) {
      console.log("VarDec");
      if (d.initializer == "on") {
        output.push(`let ${gen(d.variable)} = true`);
      } else if (d.initializer == "off") {
        output.push(`let ${gen(d.variable)} = false`);
      } else {
        output.push(`let ${gen(d.variable)} = ${gen(d.initializer)};`);
      }
    },
    Variable(v) {
      console.log("Var");
      // Standard library constants just get special treatment
      return targetName(v);
    },
    Block(b) {
      console.log("Block");
      gen(b.consequent);
    },
    FunctionDeclaration(d) {
      console.log("FuncDec");
      output.push(`function ${gen(d.name)}(${gen(d.variable)}) {`);
      gen(d.consequent);
      output.push("}");
    },
    Function(f) {
      console.log("Func");
      return targetName(f);
    },
    AssignmentStatement(s) {
      console.log("Assign");
      output.push(`${gen(s.target)} = ${gen(s.source)};`);
    },
    PrintStatement(s) {
      console.log("Print");
      output.push(`console.log(${gen(s.argument)});`);
    },
    Return(s) {
      console.log("Return");
      output.push(`return ${gen(s.expression)};`);
    },

    IfStatement(s) {
      console.log("If");
      output.push(`if ${gen(s.test)} {`);
      gen(s.consequence);
      if (s.alternate != null) {
        output.push("}");
        gen(s.alternate);
        // if (s.alternate != null) {
        //   output.push("} else if");
        //   gen(s.alternate.ifStmt);
        // } else {
        //   output.push("} else");
        //   gen(s.alternate);
        // }
      } else {
        output.push("}");
      }
    },
    Else(s) {
      gen(s.consequent);
    },
    ElseIf(s) {
      console.log("Else if");
      output.push("else");
      gen(s.ifStmt);
    },
    ForArg(s) {
      output.push(`for (let ${gen(s.iterator)} of ${gen(s.collection)}) {`);
      gen(s.body);
      output.push("}");
    },
    BinaryExpression(e) {
      console.log("Binary");
      const op = { "==": "===", "!=": "!==" }[e.op] ?? e.op;
      return `(${e.left} ${op} ${e.right})`;
    },
    UnaryExpression(e) {
      console.log("Unary");
      const operand = gen(e.operand);
      if (e.op === "some") {
        return operand;
      } else if (e.op === "#") {
        return `${operand}.length`;
      } else if (e.op === "random") {
        randomCalled = true;
        return `_r(${operand})`;
      }
      return `${e.op}(${operand})`;
    },

    MemberExpression(e) {
      const object = gen(e.object);
      const field = JSON.stringify(gen(e.field));
      const chain = e.op === "." ? "" : e.op;
      return `(${object}${chain}[${field}])`;
    },
    ConstructorCall(c) {
      console.log("Const");
      return `new ${gen(c.callee)}(${gen(c.args).join(", ")})`;
    },
    Number(e) {
      console.log("Num");
      return e;
    },
    String(e) {
      console.log("String");
      return e;
    },
    StringLiteral(e) {
      console.log("StringLit");
      return JSON.stringify(e.contents);
    },
    Array(a) {
      console.log("Array");
      return a.map(gen);
    },
  };

  gen(program);
  return output.join("\n");
}
