import useBaseUrl from '@docusaurus/useBaseUrl';

# Conditionals

A conditional statement lets a program make a decision. Instead of running every line
of code in order every single time, a conditional runs a block of code only if a
certain boolean expression evaluates to `true`.

<img
src={useBaseUrl("img/images/javacontrolflow/rick-ai.webp")}
alt="rick-ai"
/>

## The if Statement

The simplest conditional is the `if` statement, which runs a block of code only if
its condition is `true`.

### If Formula

```java
if ([condition]) {
    [code to run if condition is true]
}
```

```java
if (velocity > 5.0) {
    System.out.println("Moving fast!");
}
```

If `velocity` is greater than `5.0`, the message is printed. Otherwise, the block is
skipped entirely, and the program moves on to whatever comes after it.

## The else Statement

An `else` block runs when the `if` condition is `false`, giving you a fallback path.

```java
if (velocity > 5.0) {
    System.out.println("Moving fast!");
} else {
    System.out.println("Moving slow.");
}
```

## The else if Statement

When there are more than two possible outcomes, `else if` can be chained onto an `if`
statement to check additional conditions in order.

```java
if (velocity > 10.0) {
    System.out.println("Very fast!");
} else if (velocity > 5.0) {
    System.out.println("Moving fast!");
} else {
    System.out.println("Moving slow.");
}
```

Java checks each condition from top to bottom and runs the first block whose condition
is `true`, skipping the rest. If none of the conditions are `true`, the final `else`
block runs (if one exists).

## Conditions are Boolean Expressions

The condition inside the parentheses of an `if` statement must always evaluate to a
`boolean`. This means anything covered in the Expressions and Operators sections, such
as relational and logical expressions, can be used here.

```java
boolean hasNote = true;
boolean isAligned = true;

if (hasNote && isAligned) {
    System.out.println("Ready to shoot!");
}
```

For more information about building boolean expressions, see the Expressions and
Operators sections.

## Nested Conditionals

Conditionals can be placed inside other conditionals, allowing a program to check a
second condition only after the first one has already been satisfied.

```java
if (hasNote) {
    if (isAligned) {
        System.out.println("Ready to shoot!");
    } else {
        System.out.println("Aligning...");
    }
} else {
    System.out.println("No note detected.");
}
```

While nesting is sometimes necessary, deeply nested conditionals can be hard to read.
Combining conditions with logical operators (`&&`, `||`) is often a cleaner
alternative when possible.

## Braces and Style

Technically, Java allows you to omit curly braces `{}` around a single-line `if` body.
However, **FRC 190 always uses braces**, even for one-line blocks:

```java
// Avoid
if (velocity > 5.0)
    System.out.println("Moving fast!");

// Preferred
if (velocity > 5.0) {
    System.out.println("Moving fast!");
}
```

This prevents a very common bug where a second line is accidentally assumed to be part
of the conditional, when it actually always runs regardless of the condition.
