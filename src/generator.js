import { IfStatement } from "./core.js";

// may need to fix analyzer and core to make this work i think
// pretty sure core is missing some features (check commented out code and carlos/src/core.js)
// some i found:
// -break statement
// -boolean
// -conditional
// -variable (not just declaration)
// -while
// -field (?)
// -functionDeclaration (?)
// -function call

// also these but i think we can live without them:
// -super
// -this (?)
// -new
// -extends

// not sure if we plan to implement type declaration
// commented out the version from carlos as an example, not sure if its useful

// not sure how our arrays work (right now it seems pretty different from carlos) need some help with that

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
      output.push(`let ${gen(d.variable)} = ${gen(d.initializer)};`);
    },
    // TypeDeclaration(d) {
    //   // The only type declaration in Carlos is the struct! Becomes a JS class.
    //   output.push(`class ${gen(d.type)} {`);
    //   output.push(`constructor(${gen(d.type.fields).join(",")}) {`);
    //   for (let field of d.type.fields) {
    //     output.push(`this[${JSON.stringify(gen(field))}] = ${gen(field)};`);
    //   }
    //   output.push("}");
    //   output.push("}");
    // },

    // Field(f) {
    //   return targetName(f);
    // },

    // FunctionDeclaration(d) {
    //   output.push(`function ${gen(d.fun)}(${gen(d.params).join(", ")}) {`);
    //   gen(d.body);
    //   output.push("}");
    // },
    Variable(v) {
      // Standard library constants just get special treatment
      return targetName(v);
    },
    Function(f) {
      return targetName(f);
    },
    AssignmentStatement(s) {
      output.push(`${gen(s.target)} = ${gen(s.source)};`);
    },

    // BreakStatement(s) {
    //   output.push("break;");
    // },

    Return(s) {
      output.push(`return ${gen(s.expression)};`);
    },

    // ShortReturnStatement(s) {
    //   output.push("return;");
    // },

    IfStatement(s) {
      output.push(`if (${gen(s.test)}) {`);
      gen(s.consequent);
      if (s.alternate instanceof IfStatement) {
        output.push("} else");
        gen(s.alternate);
      } else {
        output.push("} else {");
        gen(s.alternate);
        output.push("}");
      }
    },

    // WhileStatement(s) {
    //   output.push(`while (${gen(s.test)}) {`);
    //   gen(s.body);
    //   output.push("}");
    // },

    For(s) {
      //TODO: i can do this later
      // const i = targetName(s.iterator);
      // const op = s.op === "..." ? "<=" : "<";
      // output.push(
      //   `for (let ${i} = ${gen(s.low)}; ${i} ${op} ${gen(s.high)}; ${i}++) {`
      // );
      // gen(s.body);
      // output.push("}");
    },
    ForArg(s) {
      output.push(`for (let ${gen(s.iterator)} of ${gen(s.collection)}) {`);
      gen(s.body);
      output.push("}");
    },
    // Conditional(e) {
    //   return `((${gen(e.test)}) ? (${gen(e.consequent)}) : (${gen(
    //     e.alternate
    //   )}))`;
    // },
    BinaryExpression(e) {
      const op = { "==": "===", "!=": "!==" }[e.op] ?? e.op;
      return `(${gen(e.left)} ${op} ${gen(e.right)})`;
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

    // ArrayExpression(e) {
    //   return `[${gen(e.elements).join(",")}]`;
    // },
    // EmptyArray(e) {
    //   return "[]";
    // },
    MemberExpression(e) {
      const object = gen(e.object);
      const field = JSON.stringify(gen(e.field));
      const chain = e.op === "." ? "" : e.op;
      return `(${object}${chain}[${field}])`;
    },
    // FunctionCall(c) {
    //   const targetCode = standardFunctions.has(c.callee)
    //     ? standardFunctions.get(c.callee)(gen(c.args))
    //     : `${gen(c.callee)}(${gen(c.args).join(", ")})`;
    //   // Calls in expressions vs in statements are handled differently
    //   if (c.callee.type.returnType !== Type.VOID) {
    //     return targetCode;
    //   }
    //   output.push(`${targetCode};`);
    // },
    ConstructorCall(c) {
      return `new ${gen(c.callee)}(${gen(c.args).join(", ")})`;
    },
    Number(e) {
      return e;
    },
    // Boolean(e) {
    //   return e;
    // },
    StringLiteral(e) {
      return e;
    },
    Array(a) {
      return a.map(gen);
    },
  };
}
