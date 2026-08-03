import useBaseUrl from '@docusaurus/useBaseUrl';

# Operators

An operator is a special symbol that tells Java to perform a specific operation on one
or more values, known as operands. You've already seen operators used to build
expressions, such as `+` and `>`, but Java has several different categories of
operators, each with their own purpose.

<img
src={useBaseUrl("img/images/javafundamentals/telephone-operator.gif")}
alt="telephone-operator"
/>

## Arithmetic Operators

Arithmetic operators perform math operations on numeric values.

| Operator | Description         | Example  |
|----------|----------------------|----------|
| `+`      | Addition             | `a + b`  |
| `-`      | Subtraction          | `a - b`  |
| `*`      | Multiplication       | `a * b`  |
| `/`      | Division             | `a / b`  |
| `%`      | Modulus (remainder)  | `a % b`  |

Note that dividing two integers performs **integer division**, meaning the decimal
portion of the result is truncated:

```java
int result = 7 / 2; // Evaluates to 3, not 3.5
```

The modulus operator `%` returns the remainder of a division, and is very useful for
things like checking whether a number is even or odd:

```java
int remainder = 7 % 2; // Evaluates to 1
```

## Relational Operators

Relational operators compare two values and always evaluate to a `boolean`.

| Operator | Description              |
|----------|---------------------------|
| `==`     | Equal to                  |
| `!=`     | Not equal to               |
| `>`      | Greater than               |
| `<`      | Less than                  |
| `>=`     | Greater than or equal to   |
| `<=`     | Less than or equal to      |

Be careful not to confuse the equality operator `==` with the assignment operator `=`.
Using `=` instead of `==` inside a conditional is a very common bug, since `=` assigns
a value rather than comparing one.

## Logical Operators

Logical operators combine or invert `boolean` values.

| Operator | Description  | Example                    |
|----------|---------------|-----------------------------|
| `&&`     | Logical AND   | `a && b`                    |
| <code>&#124;&#124;</code> | Logical OR | <code>a &#124;&#124; b</code> |
| `!`      | Logical NOT   | `!a`                        |

Java's `&&` and `||` operators use **short-circuit evaluation**, meaning the second
operand is not evaluated if the result can already be determined from the first
operand. For example, in `a && b`, if `a` is `false`, `b` is never checked, since the
whole expression must be `false` regardless of `b`'s value.

## Assignment Operators

The `=` operator assigns the value of the right-hand side to the variable on the
left-hand side. Java also provides compound assignment operators, which combine an
arithmetic operation with an assignment.

| Operator | Equivalent To |
|----------|----------------|
| `+=`     | `a = a + b`    |
| `-=`     | `a = a - b`    |
| `*=`     | `a = a * b`    |
| `/=`     | `a = a / b`    |
| `%=`     | `a = a % b`    |

```java
int numMotors = 4;
numMotors += 2; // numMotors is now equal to 6
```

## Unary Operators

Unary operators act on a single operand.

| Operator | Description          |
|----------|------------------------|
| `-`      | Negation                |
| `!`      | Logical complement      |
| `++`     | Increment               |
| `--`     | Decrement               |

The increment and decrement operators can be used in two ways: **prefix** (`++i`) and
**postfix** (`i++`). Both increment the variable, but they differ in the value the
expression evaluates to.

```java
int i = 1;
int j = ++i; // i is incremented first, then assigned: i = 2, j = 2

int m = 1;
int n = m++; // m is assigned first, then incremented: m = 2, n = 1
```

## The Ternary Operator

The ternary operator `?:` is a shorthand for a simple if-else statement, and is the
only operator in Java that takes three operands.

### Ternary Formula

```java
[condition] ? [value if true] : [value if false]
```

```java
int voltage = isFast ? 12 : 6;
```

If `isFast` is `true`, `voltage` is set to `12`. Otherwise, `voltage` is set to `6`.
For more information about if-else statements, see the Control Flow section.

## Operator Precedence

When an expression contains multiple operators, Java evaluates them according to a
strict precedence order (from highest to lowest priority):

1. Unary operators (`++`, `--`, `!`, unary `-`)
2. Multiplicative operators (`*`, `/`, `%`)
3. Additive operators (`+`, `-`)
4. Relational operators (`<`, `>`, `<=`, `>=`)
5. Equality operators (`==`, `!=`)
6. Logical AND (`&&`)
7. Logical OR (`||`)
8. Ternary operator (`?:`)
9. Assignment operators (`=`, `+=`, `-=`, etc.)

When operators share the same precedence, Java evaluates them left to right (with the
exception of assignment operators, which evaluate right to left). As always, if you
want to guarantee a specific order of evaluation, use parentheses.

<img
src={useBaseUrl("img/images/javafundamentals/flex-tape-precedence.webp")}
alt="flex-tape-precedence"
/>
