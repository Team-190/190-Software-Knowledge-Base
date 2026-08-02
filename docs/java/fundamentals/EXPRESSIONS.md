import useBaseUrl from '@docusaurus/useBaseUrl';

# Expressions

An expression is any piece of code that evaluates down to a single value. Expressions
are built by combining values, variables, and operators together. Every time you write
`2 + 2`, `numMotors > 0`, or `velocity * 0.5`, you're writing an expression.

<img
src={useBaseUrl("img/images/javafundamentals/confused-math-lady.gif")}
alt="confused-math-lady"
/>

## Expressions vs. Statements

It's easy to mix up expressions and statements, but they aren't the same thing:

- **Expression**: Evaluates to a value. Example: `5 + 3`
- **Statement**: A complete instruction that performs an action. Example: `int sum = 5 + 3;`

Every expression can be part of a statement, but not every statement is an expression.
The assignment operator `=` takes the value produced by an expression on the right side
and stores it in the variable on the left side.

## Types of Expressions

### Arithmetic Expressions

Combine numeric values using arithmetic operators (`+`, `-`, `*`, `/`, `%`).

```
int totalMotors = 4 + 2; // Evaluates to 6
```

### Relational Expressions

Compare two values and evaluate to a `boolean` (`true` or `false`).

```
boolean isFast = velocity > 5.0; // Evaluates to true or false
```

### Logical Expressions

Combine boolean values using logical operators (`&&`, `||`, `!`).

```
boolean canShoot = hasNote && isAligned; // Evaluates to true or false
```

For more information about the specific operators used to build these expressions, see
the Operators section.

<img
src={useBaseUrl("img/images/javafundamentals/genie-paradox.webp")}
alt="genie-paradox"
/>

## Evaluating Expressions

When Java evaluates an expression made up of multiple operators, it doesn't just read
left to right. Instead, it follows a strict set of precedence rules, similar to the
order of operations you learned in math class (PEMDAS). For example:

```
int result = 2 + 3 * 4; // Evaluates to 14, not 20
```

Multiplication has a higher precedence than addition, so `3 * 4` is evaluated first,
giving `12`, and then `2` is added to get `14`.

### Using Parentheses

Just like in math, parentheses can be used to override the default precedence and
force part of an expression to be evaluated first.

```
int result = (2 + 3) * 4; // Evaluates to 20
```

It's good practice to use parentheses to make your intent clear, even when they aren't
strictly necessary. This makes code easier for other people (and future you) to read.

## Nested Expressions

Expressions can be nested inside one another, since each expression simply evaluates
down to a value that can then be used inside a larger expression.

```
int average = (numMotors + numSensors) / 2;
```

Here, `numMotors + numSensors` is evaluated first, producing a value that is then used
as the left-hand side of the division expression.
