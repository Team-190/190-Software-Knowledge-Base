import useBaseUrl from '@docusaurus/useBaseUrl';

# Type Casting

Type casting is the process of converting a value from one data type into another.
Since Java is statically typed, the compiler needs to know exactly what type of data
it's working with at all times, so converting between types has to be done
explicitly, or in some cases, automatically.

<img
src={useBaseUrl("img/images/javafundamentals/wizard-casting.gif")}
alt="wizard-casting"
/>

## Widening (Implicit) Casting

Widening casting happens automatically when converting a smaller data type into a
larger one, since no data is lost in the process.

```text
byte -> short -> int -> long -> float -> double
```

```java
int numMotors = 4;
double numMotorsAsDouble = numMotors; // Automatically widened to a double
```

Since a `double` can represent every value an `int` can (and more), Java doesn't
require you to do anything special here.

## Narrowing (Explicit) Casting

Narrowing casting is required when converting a larger data type into a smaller one,
since data could potentially be lost in the process. Because of this risk, Java
requires you to explicitly tell it that you understand the potential consequences.

<img
src={useBaseUrl("img/images/javafundamentals/square-peg-round-hole.gif")}
alt="square-peg-round-hole"
/>

### Casting Formula

The general formula for explicitly casting a value is:

```java
([data type]) [value]
```

```java
double velocity = 5.75;
int velocityAsInt = (int) velocity; // Explicitly narrowed to an int, equal to 5
```

Notice that narrowing a `double` to an `int` doesn't round the value, it simply
truncates (cuts off) the decimal portion.

### Overflow

Narrowing casting can also cause **overflow** if the value doesn't fit within the
range of the smaller data type. For example:

```java
int bigNumber = 130;
byte smallNumber = (byte) bigNumber; // Overflows, equal to -126
```

Since a `byte` can only hold values from `-128` to `127`, casting `130` into a `byte`
causes it to wrap around past the maximum value and come out the other side.

## Casting with char

The `char` data type is stored internally as a number (its Unicode code point), so it
can be cast to and from numeric types as well.

```java
char letter = 'A';
int letterAsInt = letter; // Widened to an int, equal to 65

int number = 66;
char numberAsChar = (char) number; // Narrowed to a char, equal to 'B'
```

## Casting Reference Types

Casting isn't limited to primitive data types, reference types can be cast as well.
This is covered in more detail in the Object-Oriented Programming section, but
unlike primitive casting, casting a reference type incorrectly doesn't cause
overflow, it throws a `ClassCastException` at runtime instead.
