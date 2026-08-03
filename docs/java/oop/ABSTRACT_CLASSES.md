import useBaseUrl from '@docusaurus/useBaseUrl';

# Abstract Classes

An abstract class is a class that can't be instantiated on its own; it exists purely
to be extended by other classes. Abstract classes are useful when you want to define
shared structure and behavior for a group of related subclasses, while forcing each
subclass to fill in some of the details itself.

<img
src={useBaseUrl("img/images/javaoop/abstract-classes.webp")}
alt="abstract-classes"
/>

## Declaring an Abstract Class

An abstract class is declared using the `abstract` keyword.

### Abstract Class Formula

```java
abstract class [ClassName] {
    [regular fields and methods]
    abstract [return type] [method name]([parameters]);
}
```

```java
abstract class Subsystem {
    boolean isEnabled;

    void enable() {
        isEnabled = true;
    }

    abstract void periodic(); // No body, just a method signature
}
```

Notice that `periodic()` has no body, just a signature ending in a semicolon. This is
an **abstract method**, a method that the abstract class declares, but doesn't
implement, leaving that responsibility to its subclasses.

## Why You Can't Instantiate an Abstract Class

```java
Subsystem subsystem = new Subsystem(); // Compiler error!
```

Java won't let you create a `Subsystem` object directly, since `Subsystem` has an
abstract method (`periodic()`) with no actual implementation. If Java allowed this, and
you called `subsystem.periodic()`, there would be no code to actually run. Instead, any
concrete (non-abstract) subclass is required to provide an implementation for every
abstract method it inherits.

```java
class Flywheel extends Subsystem {
    double voltage;

    @Override
    void periodic() {
        System.out.println("Spinning at " + voltage + " volts");
    }
}
```

```java
Subsystem shooterWheel = new Flywheel(); // This works, since Flywheel implements periodic()
shooterWheel.periodic();
```

Output:
```text
Spinning at 0.0 volts
```

## Abstract Classes vs. Regular Classes

Regular (non-abstract) classes are also called **concrete classes**, since they
provide a complete, usable implementation of every method they define. Use an abstract
class instead of a regular one when:

- Multiple related subclasses need to share common fields or method implementations
- You want to guarantee that every subclass implements certain methods, without
  providing a default implementation yourself
- The class represents a general concept that shouldn't ever exist on its own (it
  doesn't make sense to have a generic `Subsystem` that isn't some more specific
  mechanism)

For more information about a similar tool for guaranteeing method implementations,
see the Interfaces section.
