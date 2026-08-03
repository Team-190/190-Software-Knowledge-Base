import useBaseUrl from '@docusaurus/useBaseUrl';

# Exceptions

An exception is an object that represents an error or unexpected event that disrupts
the normal flow of a program. You've already run into a few of these throughout this
guide, such as the `ClassCastException` mentioned in the Type Casting section. Rather
than letting these errors crash the entire robot program, Java gives you tools to
detect and respond to them gracefully.

## Try, Catch, and Finally

The `try` block contains code that might throw an exception. If an exception occurs,
execution immediately jumps to the matching `catch` block instead of crashing the
program.

### Try-Catch Formula

```java
try {
    [risky code]
} catch ([ExceptionType] [name]) {
    [code that runs if the exception occurs]
}
```

```java
try {
    int result = 10 / 0; // Throws an ArithmeticException
    System.out.println("This line never runs");
} catch (ArithmeticException e) {
    System.out.println("Cannot divide by zero!");
}
```

Output:
```text
Cannot divide by zero!
```

### Finally

An optional `finally` block can be added after the `catch` block. Code inside
`finally` always runs, whether or not an exception was thrown, making it useful for
cleanup work like closing a sensor connection.

```java
try {
    int result = 10 / 0;
} catch (ArithmeticException e) {
    System.out.println("Cannot divide by zero!");
} finally {
    System.out.println("This always runs");
}
```

### Catching Multiple Exception Types

A single `try` block can be followed by multiple `catch` blocks, allowing different
exception types to be handled differently. Java also allows multiple types to be
caught in one block using `|`.

```java
try {
    riskyMethod();
} catch (ArithmeticException e) {
    System.out.println("Math error");
} catch (NullPointerException e) {
    System.out.println("Something was null");
}
```

```java
try {
    riskyMethod();
} catch (ArithmeticException | NullPointerException e) {
    System.out.println("Something went wrong");
}
```

## Checked vs. Unchecked Exceptions

Java splits exceptions into two categories:

- **Checked Exceptions**: Must either be caught or declared. The compiler forces you
  to acknowledge these could happen. Example: `IOException`
- **Unchecked Exceptions**: Don't need to be caught or declared. These usually
  represent programming mistakes, such as `ArithmeticException`, `NullPointerException`,
  and `ClassCastException`

## Throwing Exceptions

The `throw` keyword is used to manually trigger an exception when something goes
wrong in your own code.

```java
if (voltage > 12) {
    throw new IllegalArgumentException("Voltage cannot exceed 12");
}
```

If a method doesn't handle a checked exception itself, it must declare that it might
throw one using the `throws` keyword in its method signature. For more information
about methods, see the Object-Oriented Programming section.

```java
public void readSensor() throws IOException {
    // Code that might throw an IOException
}
```

## Custom Exceptions

Just like any other class, you can create your own exception types by extending
`Exception` (checked) or `RuntimeException` (unchecked). This is useful for giving
teammates a more descriptive error than a generic Java exception.

```java
public class SensorDisconnectedException extends RuntimeException {
    public SensorDisconnectedException(String message) {
        super(message);
    }
}
```

```java
if (!sensor.isConnected()) {
    throw new SensorDisconnectedException("Encoder disconnected on the elevator");
}
```

For more information about `extends` and inheritance, see the Object-Oriented
Programming section.

<img
src={useBaseUrl("img/images/javaadvanced/exception.jpg")}
alt="exception"
/>