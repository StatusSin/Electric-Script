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
      output.push(`let ${gen(d.variable)} = ${gen(d.initializer)};`);
    },
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

    Return(s) {
      output.push(`return ${gen(s.expression)};`);
    },

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
    ForArg(s) {
      output.push(`for (let ${gen(s.iterator)} of ${gen(s.collection)}) {`);
      gen(s.body);
      output.push("}");
    },
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

    StringLiteral(e) {
      return e;
    },
    Array(a) {
      return a.map(gen);
    },
  };
}
