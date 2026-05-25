import useBaseUrl from '@docusaurus/useBaseUrl';

# Variables

In Java, a variable is a named memory location where you can hold data
that can change (vary) as the program runs. Think of it like a container or box for storing info.

<img
src={useBaseUrl("img/images/javafundamentals/too-many-variables.gif")}
alt="too-many-variables"
/>

## Memory and Categorization

Essentially, when you create a variable, Java sets aside a specific amount of RAM, and the behavior
of this memory is governed by the category of the variable:

- **Primitive Variables**: Store the actual value of the variable in memory.

- **Reference Variables**: Store a memory address (pointer) that directs the program to where
the object is stored in memory. More on these variables in the Object-Oriented Programming and Data
Structures sections

In this section, we'll focus primarily on the primitive variables.

## Creating a Variable

Java is a statically typed language, meaning that every variable must be declared with a data type
when the code compiles. This is to ensure that you are not trying to store _text_ inside a 
"box" that's meant for a _number_. Primitive variables can only be declared with primitive data types, 
including:

- `byte`
- `short`
- `int`
- `long`
- `boolean`
- `float`
- `double`
- `char`

### Declaration

The first step of creating a variable is to declare it. To do so, you must tell Java what
data type the variable is storing, and the name of the variable.

```
int numMotors; // Reserves a memory location for an integer called numMotors
```

### Initialization

Then, once the variable is declared, it can be initialized. To initialize a variable, simply
set it equal to its value.

```
numMotors = 4; // Sets the numMotors variable to the integer value of 4
```

A shortcut approach to creating a variable is to declare and initialize the variable 
on the same line, like so:

```
int numMotors = 4; // Declares and initializes the numMotors variable
```

The general formula for creating any primitive variable is:

```
[data type] [variable name] = [value];
```




## Variable Scope

Variables have boundaries based on their scope (where they live). 

- **Local Variables**: Declared inside a method or block of code. They only exist while that block
  of code is running and are destroyed as soon as the block is done executing
- **Instance Variables**: Declared inside a class but outside any methods. They belong
  to specific objects and persist in memory as long as the object exists
- **Static Variables**: Declared with the `static` keyword and belong only to the class itself

For more info, see the Object-Oriented Programming section.

## Rules and Naming Conventions

Java syntax requires strict adherence to rules, and FRC 190 has some standard style conventions

### Rules

- Names are case-sensitive: `numMotors` and `NumMotors` are different variables
- Names cannot start with a digit: `1stMotorCANID` is an illegal name
- Names cannot use reserved Java keywords such as `class`, `public`, or `int`
- Names cannot have spaces
- To differentiate a float from a double, you must add an `f` suffix, and to differentiate
  a long from an int, add an `L` suffix
  - ```float velocityRadiansPerSecond = 0.5f; ```
  - ```long bigNumber = 4500000000L;```

### Conventions

- Names should use camelCase: `numMotors` instead of `NumMotors`
- Names should be descriptive: `numMotors` instead of `nM`
- Names should have units: `velocityRadiansPerSecond` instead of `velocity`;
- Constants (see next section) are in all caps: `ROLLER_SLOW_VOLTAGE` instead of `rollerSlowVoltage`


## Strings

Strings are objects that represent a sequence of characters. Strings are an example of a 
reference variable, since they are a pointer to an object of the `String` class stored in memory. Strings are immutable, meaning that once a `String` object is created, it's
value cannot be changed. Strings are initialized with a string literal, which is surrounded
with quotes.

Strings, while they are an object, can be declared
and initialized the same way as a primitive variable. 

```
String frcYear = "2026"; // Declaring a String with name frcYear and string literal of 2026
```

For more information about objects, such as Strings, check out the Object-Oriented Programming section.

