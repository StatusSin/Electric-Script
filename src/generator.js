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
    return generators[node.constructor.name](node);
  }

  const generators = {
    // Key idea: when generating an expression, just return the JS string; when
    // generating a statement, write lines of translated JS to the output array.
    Program(p) {
      gen(p.statements);
    },
    VarDeclaration(d) {
      if (d.initializer == "on") {
        output.push(`let ${gen(d.variable)} = true`);
      } else if (d.initializer == "off") {
        output.push(`let ${gen(d.variable)} = false`);
      } else {
        output.push(`let ${gen(d.variable)} = ${gen(d.initializer)};`);
      }
    },
    ArrayVarDeclaration(d) {
      if (d.initializer == "on") {
        return `let ${gen(d.variable)} = true`;
      } else if (d.initializer == "off") {
        return `let ${gen(d.variable)} = false`;
      } else {
        return `let ${gen(d.variable)} = ${gen(d.initializer)}`;
      }
    },
    Variable(v) {
      // Standard library constants just get special treatment
      return targetName(v);
    },
    Block(b) {
      gen(b.consequent);
    },
    Function(d) {
      output.push(`function ${gen(d.name)}(${gen(d.variable)}) {`);
      gen(d.consequent);
      output.push("}");
    },
    AssignmentStatement(s) {
      output.push(`${gen(s.variable)} = ${gen(s.initializer)};`);
    },
    PrintStatement(s) {
      output.push(`console.log(${gen(s.argument)});`);
    },
    Return(s) {
      output.push(`return ${gen(s.value)};`);
    },
    BreakStatement(s) {
      output.push("break;");
    },
    IfStatement(s) {
      output.push(`if ${gen(s.test)} {`);
      gen(s.consequence);
      if (s.alternate != null) {
        output.push("}");
        gen(s.alternate);
      } else {
        output.push("}");
      }
    },
    Else(s) {
      gen(s.consequent);
    },
    ElseIf(s) {
      output.push("else");
      gen(s.ifStmt);
    },
    For(s) {
      output.push(`for (${gen(s.args)})`);
      gen(s.consequent);
    },
    ForArg(s) {
      return `${gen(s.intDec)}; ${gen(s.test)}; ${gen(s.mod)}`;
    },
    BinaryExpression(e) {
      const op = { "===": "==", "!==": "!=" }[e.op] ?? e.op;
      if (e.op === "//") {
        return `(Math.floor(${e.left}/${e.right}))`;
      } else if (e.op === "^") {
        return `(${e.left} ** ${e.right})`;
      }
      return `(${e.left} ${op} ${e.right})`;
    },
    UnaryExpression(e) {
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
    Modifier(e) {
      return `${e.id}${e.op}`;
    },
    ArrayExpression(e) {
      return `[${gen(e.elements).join(",")}]`;
    },
    MemberExpression(e) {
      const object = gen(e.object);
      const field = JSON.stringify(gen(e.field));
      const chain = e.op === "." ? "" : e.op;
      return `(${object}${chain}[${field}])`;
    },
    ConstructorCall(c) {
      return `new ${gen(c.callee)}(${gen(c.args).join(", ")})`;
    },
    Number(e) {
      return e;
    },
    String(e) {
      return e;
    },
    StringLiteral(e) {
      return JSON.stringify(e.contents);
    },
    Array(a) {
      return a.map(gen);
    },
  };

  gen(program);
  return output.join("\n");
}
