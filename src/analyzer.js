import { SSL_OP_TLS_BLOCK_PADDING_BUG } from "constants";
import { Cipher } from "crypto";
import fs from "fs";
import ohm from "ohm-js";
import * as core from "./core.js";

function error(message, node) {
  if (node) {
    throw new Error(`${node.source.getLineAndColumnMessage()}${message}`);
  }
  throw new Error(message);
}

const electricScriptGrammar = ohm.grammar(
  fs.readFileSync("src/electricScript.ohm")
);

export default function analyze(sourceCode) {
  const analyzer = electricScriptGrammar.createSemantics().addOperation("rep", {
    Program(statements) {
      return new core.Program(statements.children.map((s) => s.rep()));
    },
    PrintStatement(_display, _left, argument, _right) {
      return new core.PrintStatement(argument.rep());
    },
    IntDec(_load, variable, _eq, initializer) {
      return new core.VarDeclaration(variable.rep(), initializer.rep());
    },
    StrDec(_label, variable, _eq, initializer) {
      return new core.VarDeclaration(variable.rep(), initializer.rep());
    },
    BoolDec(_switch, variable, _eq, initializer) {
      return new core.VarDeclaration(variable.rep(), initializer.rep());
    },
    AssignStmt(target, _eq, source) {
      return new core.AssignmentStatement(target.rep(), source.rep());
    },
    IfStmt(_zener, _left, test, _right, consequent, alternate) {
      return new core.IfStatement(
        test.rep(),
        consequent.rep(),
        alternate.rep()
      );
    },
    Func(_circuit, name, _left, type, variable, _right, consequent) {
      return new core.Function(
        name.rep(),
        type.rep(),
        variable.rep(),
        consequent.rep()
      );
    },
    Return(_out, value) {
      return new core.Return(value.rep());
    },
    For(_sequential, _left, args, _right, consequent) {
      return new core.For(args.rep(), consequent.rep());
    },
    Comment(_feedback, comment) {
      return new core.Comment(comment.rep());
    },
    Block(_open, consequent, _close) {
      return new core.Block(consequent.rep());
    },
    id(chars) {
      return chars.sourceString;
    },
    Var(id) {
      return this.sourceString;
    },
    Exp_add(left, _plus, right) {
      return new core.BinaryExpression("+", left.rep(), right.rep());
    },
    Exp_sub(left, _minus, right) {
      return new core.BinaryExpression("-", left.rep(), right.rep());
    },
    Exp_exp(left, _carat, right) {
      return new core.BinaryExpression("^", left.rep(), right.rep());
    },
    Exp_mul(left, _asterisk, right) {
      return new core.BinaryExpression("*", left.rep(), right.rep());
    },
    Exp_mod(left, _modulo, right) {
      return new core.BinaryExpression("%", left.rep(), right.rep());
    },
    Exp_div(left, _slash, right) {
      return new core.BinaryExpression("/", left.rep(), right.rep());
    },
    Exp_intdiv(left, _doubleSlash, right) {
      return new core.BinaryExpression("//", left.rep(), right.rep());
    },
    Exp_paren(_left, expression, _right) {
      return expression.rep();
    },
    Exp_neg(_negative, negNum) {
      return negNum.rep();
    },
    numeral(_leading, _dot, _fraction) {
      return Number(this.sourceString);
    },
    stringLiteral(_openQ, chars, _closeQ) {
      return new core.StringLiteral(chars.sourceString);
    },
    _iter(...children) {
      return children.map((child) => child.rep());
    },
    _terminal() {
      return this.sourceString;
    },
    array(_leftBrac, elements, _rightBrac) {
      return new core.Arrays(elements.sourceCode);
    },
  });

  const match = electricScriptGrammar.match(sourceCode);
  if (!match.succeeded()) error(match.message);
  return analyzer(match).rep();
}
