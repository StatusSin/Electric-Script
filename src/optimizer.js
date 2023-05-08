import * as core from "./core.js";

export default function optimize(node) {
  console.log(node.constructor.name);
  return optimizers[node.constructor.name](node);
}

const optimizers = {
  Program(p) {
    p.statements = optimize(p.statements);
    return p;
  },
  VarDeclaration(d) {
    d.variable = optimize(d.variable);
    d.initializer = optimize(d.initializer);
    return d;
  },
  FunctionDeclaration(d) {
    d.fun = optimize(d.fun);
    if (d.body) d.body = optimize(d.body);
    return d;
  },
  Assignment(s) {
    s.source = optimize(s.source);
    s.target = optimize(s.target);
    if (s.source === s.target) {
      return [];
    }
    return s;
  },
  Block(s) {
    return s;
  },
  PrintStatement(s) {
    s.argument = optimize(s.argument);
    return s;
  },
  BreakStatement(s) {
    return s;
  },
  ReturnStatement(s) {
    s.expression = optimize(s.expression);
    return s;
  },
  StringLiteral(s) {
    return s;
  },
  String(s) {
    return s;
  },
  Number(s) {
    return s;
  },
  IfStatement(s) {
    return s;
  },
  For(s) {
    return s;
  },
  ArrayExpression(e) {
    return e;
  },
  Array(a) {
    return a.flatMap(optimize);
  },
  Function(s) {
    return s;
  },
  BinaryExpression(e) {
    console.log(
      `${e.left} - ${[Number, BigInt].includes(e.left)} - ${
        e.left.constructor
      }, ${e.right} - ${[Number, BigInt].includes(e.right.constructor)} - ${
        e.right
      }`
    );
    e.left = optimize(e.left);
    e.op = optimize(e.op);
    e.right = optimize(e.right);
    console.log("Fine so far");
    console.log(e.left.constructor);
    console.log(e.op);
    console.log(e.right.constructor);
    if ([Number].includes(e.left.constructor)) {
      // Numeric constant folding when left operand is constant
      if ([Number].includes(e.right.constructor)) {
        if (e.op === "+") return e.left + e.right;
        else if (e.op === "-") return e.left - e.right;
        else if (e.op === "*") return e.left * e.right;
        else if (e.op === "/") return e.left / e.right;
        else if (e.op === "**") return e.left ** e.right;
        else if (e.op === "<") return e.left < e.right;
        else if (e.op === "<=") return e.left <= e.right;
        else if (e.op === "==") return e.left === e.right;
        else if (e.op === "!=") return e.left !== e.right;
        else if (e.op === ">=") return e.left >= e.right;
        else if (e.op === ">") return e.left > e.right;
      } else if (e.left === 0 && e.op === "+") return e.right;
      else if (e.left === 1 && e.op === "*") return e.right;
      else if (e.left === 0 && e.op === "-")
        return new core.UnaryExpression("-", e.right);
      else if (e.left === 1 && e.op === "**") return 1;
      else if (e.left === 0 && ["*", "/"].includes(e.op)) return 0;
    } else if ([Number].includes(e.right.constructor)) {
      // Numeric constant folding when right operand is constant
      if (["+", "-"].includes(e.op) && e.right === 0) return e.left;
      else if (["*", "/", "//"].includes(e.op) && e.right === 1) return e.left;
      else if (e.op === "*" && e.right === 0) return 0;
      else if (e.op === "^" && e.right === 0) return 1;
    }
    return e;
  },
  UnaryExpression(e) {
    e.op = optimize(e.op);
    e.expression = optimize(e.expression);
    if (e.expression.constructor === Number) {
      if (e.op === "-") {
        return -e.operand;
      }
    }
    return e;
  },
};
