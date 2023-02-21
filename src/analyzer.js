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
      return new core.Program(statements.rep());
    },
    PrintStatement(_display, _left, argument, _right) {
      return core.PrintStatement(argument.rep());
    },
  });

  const match = electricScriptGrammar.match(sourceCode);
  if (!match.succeeded()) error(match.message);
}
