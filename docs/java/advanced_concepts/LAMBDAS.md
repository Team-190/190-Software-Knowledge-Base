import useBaseUrl from '@docusaurus/useBaseUrl';

# Lambda Expressions

A lambda expression is a short, anonymous block of code that can be treated as a
value; essentially, a shorthand way of writing a method without needing to formally
declare a class and method for it. Lambdas make code that passes behavior around
(like a small calculation or a callback) much more concise.

<img
src={useBaseUrl("img/images/javaadvanced/excel-shortcut.gif")}
alt="excel-shortcut"
/>

## Functional Interfaces

Lambdas can only be used where Java expects a **functional interface**, which is an
interface that contains exactly one abstract method. For more information about
interfaces, see the Object-Oriented Programming section.

```java
@FunctionalInterface
public interface Calculation {
    double apply(double input);
}
```

Since `Calculation` has exactly one method, `apply`, Java knows exactly what a lambda
assigned to it is supposed to implement.

## Lambda Syntax

### Lambda Formula

```java
([parameters]) -> [expression or code block]
```

```java
Calculation squareIt = (double x) -> x * x;

double result = squareIt.apply(4); // Equal to 16.0
```

The lambda `(double x) -> x * x` is shorthand for writing an entire class that
implements `Calculation` and overrides `apply`. Java is often able to infer the
parameter's type automatically, so it can also be shortened further:

```java
Calculation squareIt = x -> x * x;
```

If the body of the lambda needs more than one line, curly braces and a `return`
statement can be used, just like a normal method.

```java
Calculation clamp = x -> {
    if (x > 1.0) {
        return 1.0;
    }
    return x;
};
```

## Common Built-In Functional Interfaces

Java's standard library provides several general-purpose functional interfaces in the
`java.util.function` package, so you don't have to declare your own for common cases.

| Interface     | Abstract Method      | Description                                  |
|---------------|------------------------|-----------------------------------------------|
| `Runnable`    | `run()`                | Takes no input, returns nothing                |
| `Supplier<T>` | `get()`                 | Takes no input, returns a value of type `T`    |
| `Consumer<T>` | `accept(T t)`           | Takes a value of type `T`, returns nothing     |
| `Comparator<T>` | `compare(T a, T b)`  | Takes two values, returns an `int` comparison  |

```java
Runnable stopMotor = () -> motor.set(0);
stopMotor.run(); // Executes the lambda
```

## Lambdas in FRC Code

Lambdas show up constantly in WPILib's command-based framework, since commands often
need a small, specific action rather than an entire class. For example, a command
might be built by passing in a lambda that describes exactly what should happen when
it runs, instead of writing a whole new class for it.

```java
Runnable raiseElevator = () -> elevator.setVoltage(6);
```

This guide focuses on the core language feature; the robot code architecture that
makes heavy use of lambdas like this is covered in the 190 Robot Code section.
