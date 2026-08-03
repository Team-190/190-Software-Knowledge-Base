import useBaseUrl from '@docusaurus/useBaseUrl';

# Static vs. Instance

Every field and method in a class belongs to one of two categories: **instance**
members, which belong to a specific object, or **static** members, which belong to the
class itself.

<img
src={useBaseUrl("img/images/javaoop/static-shock.gif")}
alt="static-shock"
/>

## Instance Members

By default, fields and methods are instance members. This means every object created
from the class gets its own separate copy of the field, and methods operate on that
specific object's data. This is the behavior we've used throughout the Classes and
Objects, and Constructors sections.

```java
class Flywheel {
    double voltage; // An instance field

    void spin() { // An instance method
        System.out.println("Spinning at " + voltage + " volts");
    }
}
```

Each `Flywheel` object gets its own independent `voltage` field, which is why two
different `Flywheel` objects can hold two completely different voltages at the same
time.

## Static Members

Static fields and methods are declared with the `static` keyword, and belong to the
class as a whole, rather than to any individual object. There's only ever one copy of a
static field, shared by every object of that class.

### Static Formula

```java
static [data type] [field name];
static [return type] [method name]([parameters]) { }
```

```java
class Flywheel {
    static int numFlywheels = 0; // Shared by every Flywheel object

    Flywheel() {
        numFlywheels++;
    }
}
```

```java
Flywheel shooterWheel = new Flywheel();
Flywheel intakeWheel = new Flywheel();

System.out.println(Flywheel.numFlywheels);
```

Output:
```text
2
```

Notice that `numFlywheels` is accessed using the class name (`Flywheel.numFlywheels`),
not through an individual object. Since it's shared, both `Flywheel` objects
contributed to the same counter.

## Why Math.PI Doesn't Need an Object

This finally explains a question left open back in the Constants section: why can you
write `Math.PI` and `Math.max()` without ever writing `Math math1 = new Math();`
first? It's because `PI` is a `static final` field, and `max()` is a `static` method,
both defined on the `Math` class itself. Since they don't belong to any specific
`Math` object, no object ever needs to be created to use them; they can be accessed
directly through the class name.

```java
double area = Math.PI * radius * radius; // No Math object required
```

## When to Use static

As a general rule:

- Use an **instance** member when the data or behavior is specific to one object (e.g.
  each `Flywheel` having its own `voltage`).
- Use a **static** member when the data or behavior is shared across every object of a
  class, or doesn't depend on any particular object at all (e.g. a utility method like
  `Math.max()`, or a shared counter like `numFlywheels`).
