class Program {
  constructor(statements) {
    this.statements = statements;
  }
}

class PrintStatement {
  constructor(argument) {
    this.argument = argument;
  }
}

class VariableDeclaration {
  constructor(variable, initializer) {
    this.variable = variable;
    this.initializer = initializer;
  }
}

class AssignmentStatement {
  constructor(variable, initializer) {
    this.variable = variable;
    this.initializer = initializer;
  }
}

class IfStatement {
  constructor(test, consequence, alternate) {
    Object.assign(this, { test, consequence, alternate });
  }
}

class BinaryExpression {
  constructor(op, left, right) {
    Object.assign(this, { op, left, right });
  }
}
