import fs from "fs";
import ohm from "ohm-js";

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
  const match = electricScriptGrammar.match(sourceCode);
  if (!match.succeeded()) error(match.message);
}
