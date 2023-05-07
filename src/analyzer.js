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
    Else_elseif(_else, ifStmt) {
      return new core.ElseIf(ifStmt.rep());
    },
    Else_else(_else, consequent) {
      return new core.Else(consequent.rep());
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
    ForArg(intDec, _sc1, test, _sc2, mod) {
      return new core.ForArg(intDec.rep(), test.rep(), mod.rep());
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
    Exp1_binary(left, op, right) {
      return new core.BinaryExpression(op.rep(), left.rep(), right.rep());
    },
    Exp2_binary(left, op, right) {
      return new core.BinaryExpression(op.rep(), left.rep(), right.rep());
    },
    Exp3_binary(left, op, right) {
      return new core.BinaryExpression(op.rep(), left.rep(), right.rep());
    },
    Exp4_binary(left, op, right) {
      return new core.BinaryExpression(op.rep(), left.rep(), right.rep());
    },
    Exp_neg(op, expression) {
      return new core.UnaryExpression(op.rep(), expression.rep());
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
    Exp5_array(_leftBrac, args, _rightBrac) {
      const elements = args.children.map((e) => e.rep());
      return new core.Arrays(elements);
    },
    modifier(id, op) {
      return new core.Modifier(id.rep(), op.rep());
    },
  });

  const match = electricScriptGrammar.match(sourceCode);
  if (!match.succeeded()) error(match.message);
  return analyzer(match).rep();
}
