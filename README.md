![](https://github.com/StatusSin/Electric-Script/blob/main/docs/images/ElectricScript.png?raw=true "ElectricScriptLogo")

# ElectricScript

ElectricScript is a "juiced-up" programming language for electrical engineers, aimed to bridge the gap between electrical engineering and computer science. With its electrifying set of terms and tailored features, it "amps" up the understanding for electrical engineers. Get ready to "short-circuit" your way into programming with a familar set of engineering terms that will be sure to cause a "spark" in your brain!

https://statussin.github.io/Electric-Script/

## Written by Aryaman Ramchandran, Kevin Gager, Jurgis Stepenka, Gabriel Sonkowsky

## Types

| JavaScript | ElectricScript |
| ---------- | -------------- |
| {          | + terminal     |
| }          | - terminal     |
| print      | display        |
| return     | out            |
| int        | load           |
| string     | label          |
| function   | circuit        |
| boolean    | switch         |
| true       | high           |
| false      | low            |
| break      | short-circuit  |
| for        | sequential     |
| if         | zener          |
| //         | feedback       |

## Example Programs

### Hello World

JavaScript

```

function helloWorld() {
	console.log(“Hello World”)
}

```

ElectricScript

```

circuit helloWorld()
+terminal
         display(“Hello World)
-terminal

```

### Factorial

JavaScript

```

function factorial(n) {
  if (n === 0) {
    return 1;
  }
  return n * factorial(n - 1);
}

console.log(factorial(5)); // Output: 120

```

ElectricScript

```

circuit factorial(n)
+terminal
  zener (n == 0)
  +terminal
    out 1
  -terminal
  out n * circuit(n - 1)
-terminal

display(factorial(5)) feedback Output: 120

```

### For and If Loops

JavaScript

```
for(var i = 0; i <= 10; i++) {
  if(i % 2) {
    console.log(i);
  }
}

```

ElectricScript

```

sequential(load i = 0; i <= 10; i++)
+terminal
    zener(i % 2)
    +terminal
        display(i)
    -terminal
-terminal

```

### Arithmetic

JavaScript

```

Addition: 2 + 3
Subtraction: 2 - 3
Multiplication: 2 * 3
Division: 2 / 3
Interger Division: 2 // 3
Exponents: 2 ^ 3
Modulo: 2 % 3

```

ElectricScript

```

Addition: 2 + 3
Subtraction: 2 - 3
Multiplication: 2 * 3
Division: 2 / 3
Interger division: 2 // 3
Exponents: 2 ^ 3
Modulo: 2 % 3
```

## Usage

To run from the command line:

```
node src/electricScript.js <filename> <outputType>
```

The `outputType` indicates what you wish to print to standard output:

<table>
<tr><th>Option</th><th>Description</th></tr>
<tr><td>analyzed</td><td>The decorated AST</td></tr>
<tr><td>optimized</td><td>The optimized decorated AST</td></tr>
<tr><td>js</td><td>The translation of the program to JavaScript</td></tr>
</table>

Example runs, using the sample introductory program above:

```
$ node src/electricScript.js examples/printing.electricScript analyzed
   1 | Program statements=[#2]
   2 | PrintStatement argument=#3
   3 | StringLiteral contents='Hello there'
```

```
$ node src/electricScript.js examples/printing.electricScript optimized
   1 | Program statements=[#2]
   2 | PrintStatement argument=#3
   3 | StringLiteral contents='Hello there'
```

```
$ node src/electricScript.js examples/printing.electricScript js
console.log("Hello there");
```

Pipe the output back into node to compile and run on the same line:

```
$ node src/electricScript.js examples/printing.electricScript js | node
Hello there
```
