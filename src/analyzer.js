export default function analyze(sourceCode) {
  const match = electricScriptGrammar.match(sourceCode);
  if (!match.succeeded()) error(match.message);
  console.log("You're good");
}
