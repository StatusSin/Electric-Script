![](https://github.com/StatusSin/Electric-Script/blob/main/docs/images/ElectricScript.png?raw=true "ElectricScriptLogo")

# ElectricScript

ElectricScript is a "juiced-up" programming language for electrical engineers, aimed to bridge the gap between electrical engineering and computer science. With its electrifying set of terms and tailored features, it "amps" up the understanding for electrical engineers. Get ready to "short-circuit" your way into programming with a familar set of engineering terms that will be sure to cause a "spark" in your brain!

## Written by Aryaman Ramchandran, Kevin Gager, Jurgis Stepenka, Gabriel Sonkowsky

## Types

| JavaScript     | ElectricScript |
| -------------- | -------------- |
| {              | + terminal     |
| }              | - terminal     |
| print          | display        |
| return         | out            |
| int            | load           |
| string         | label          |
| function       | circuit        |
| boolean        | switch         |
| Error Messages | Failure Report |
| true           | high           |
| false          | low            |
| break          | short-circuit  |
| for            | sequential     |
| while          | loop           |
| if             | zener          |
| let            | gauge          |
| //             | feedback       |
| new            | charge         |
| constructor    | drawing        |
| class          | signal         |
| extends        | wired to       |
| super          | amplify        |
| this           | current        |

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

### Class Creation

JavaScript

```

class Fruit {
  constructor(color, weight) {
    this.color = color;
    this.weight = weight;
  }

  getColor() {
    return this.color;
  }
}

class Watermelon extends Fruit {
  constructor(weight, seedless) {
    super(“red”, weight);
    this.seedless = seedless;
  }
}

```

ElectricScript

```
signal Fruit
+terminal
   drawing(color,weight)
   +terminal
       current.color = color
       current.weight = weight
   -terminal

   getColor()
   +terminal
   	out current.color
   -terminal
-terminal

signal Watermellon wired to Fruit
+terminal
   drawing(weight, seedless)
   +terminal
      amplify(“red”, weight)
      current.seedless = seedless
   -terminal
-terminal

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
Parellel Addition: (2*3)/(2+3)

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
Parellel Addition: 2 || 3

```
