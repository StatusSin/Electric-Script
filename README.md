![](https://github.com/StatusSin/Electric-Script/blob/main/docs/images/ElectricScript.png?raw=true "ElectricScriptLogo")

# ElectricScript

## Written by Aryaman Ramchandran, Kevin Gager, Jurgis Stepenka, Gabriel Sonkowsky

## Types
| JavaScript | ElectricScript |
| --- | --- |
| print      | display        |
| return | out |
| int | load |
| string | label |
| function | circuit |
| boolean | switch |
| Error Messages | Failure Report |
| true | high |
| false | low |
| break | short-circuit |
| for | sequential |
| while | loop |
| if | zener |
| let | gauge |
| // | feedback |
| new | charge |
| constructor | drawing |
| class | signal |
| extends | wired to |
| super | amplify |
| this | current |

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
       out this.color
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
or(var i = 0; i <= 10; i++) {
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

Addition: 2 + 2
Subtraction: 2 - 2
Multiplication: 2 * 2
Division: 2 / 2
Exponents: 2 ** 2
Modulo: 2 % 2

```

ElectricScript

```

Addition: 2 + 2
Subtraction: 2 - 2
Multiplication: 2 * 2
Division: 2 / 2
Exponents: 2 ^ 2
Modulo: 2 % 2

```
