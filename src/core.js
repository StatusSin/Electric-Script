import util from "util";

export class Program {
  constructor(statements) {
    this.statements = statements;
  }
}

export class PrintStatement {
  constructor(argument) {
    this.argument = argument;
  }
}

export class VarDeclaration {
  constructor(variable, initializer) {
    this.variable = variable;
    this.initializer = initializer;
  }
}

export class ArrayVarDeclaration {
  constructor(variable, initializer) {
    this.variable = variable;
    this.initializer = initializer;
  }
}

export class AssignmentStatement {
  constructor(variable, initializer) {
    this.variable = variable;
    this.initializer = initializer;
  }
}

export class IfStatement {
  constructor(test, consequence, alternate) {
    Object.assign(this, { test, consequence, alternate });
  }
}

export class ElseIf {
  constructor(ifStmt) {
    Object.assign(this, { ifStmt });
  }
}

export class Else {
  constructor(consequent) {
    Object.assign(this, { consequent });
  }
}

export class BinaryExpression {
  constructor(op, left, right) {
    Object.assign(this, { op, left, right });
  }
}

export class UnaryExpression {
  constructor(op, expression) {
    Object.assign(this, { op, expression });
  }
}

export class ArrayExpression {
  // Example: ["Emma", "Norman", "Ray"]
  constructor(elements) {
    this.elements = elements;
  }
}

export class BreakStatement {
  // Intentionally empty
}

export class Modifier {
  constructor(id, op) {
    Object.assign(this, { id, op });
  }
}

export class Function {
  constructor(name, type, variable, consequent) {
    Object.assign(this, { name, type, variable, consequent });
  }
}

export class Return {
  constructor(value) {
    this.value = value;
  }
}

export class For {
  constructor(args, consequent) {
    Object.assign(this, { args, consequent });
  }
}

export class ForArg {
  constructor(intDec, test, mod) {
    Object.assign(this, { intDec, test, mod });
  }
}

export class Comment {
  constructor(comment) {
    this.comment = comment;
  }
}

export class Block {
  constructor(consequent) {
    this.consequent = consequent;
  }
}

export class StringLiteral {
  constructor(contents) {
    this.contents = contents;
  }
}

export class Arrays {
  constructor(elements) {
    this.elements = elements;
  }
}

// Return a compact and pretty string representation of the node graph,
// taking care of cycles. Written here from scratch because the built-in
// inspect function, while nice, isn't nice enough. Defined properly in
// the root class prototype so that it automatically runs on console.log.
Program.prototype[util.inspect.custom] = function () {
  const tags = new Map();

  // Attach a unique integer tag to every node
  function tag(node) {
    if (tags.has(node) || typeof node !== "object" || node === null) return;
    tags.set(node, tags.size + 1);
    for (const child of Object.values(node)) {
      Array.isArray(child) ? child.forEach(tag) : tag(child);
    }
  }

  function* lines() {
    function view(e) {
      if (tags.has(e)) return `#${tags.get(e)}`;
      if (Array.isArray(e)) return `[${e.map(view)}]`;
      return util.inspect(e);
    }
    for (let [node, id] of [...tags.entries()].sort((a, b) => a[1] - b[1])) {
      let type = node.constructor.name;
      let props = Object.entries(node).map(([k, v]) => `${k}=${view(v)}`);
      yield `${String(id).padStart(4, " ")} | ${type} ${props.join(" ")}`;
    }
  }

  tag(this);
  return [...lines()].join("\n");
};
