import fs from "fs";
import ohm from "ohm-js";
import * as core from "./core.js";

const electricScriptGrammar = ohm.grammar(
  fs.readFileSync("src/electricScript.ohm")
);

export default function analyze(sourceCode) {
  const match = electricScriptGrammar.match(sourceCode);
  if (!match.succeeded()) error(match.message);
  console.log("You're good");
}
