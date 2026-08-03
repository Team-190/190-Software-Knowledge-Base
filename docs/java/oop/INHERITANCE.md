import useBaseUrl from '@docusaurus/useBaseUrl';

# Inheritance

Inheritance allows a class to acquire the fields and methods of another class,
letting you build new classes on top of existing ones instead of writing everything
from scratch.

<img
src={useBaseUrl("img/images/javaoop/inheritance-money.gif")}
alt="inheritance-money"
/>

## Superclasses and Subclasses

The class being inherited from is called the **superclass** (or parent class), and the
class doing the inheriting is called the **subclass** (or child class). A subclass
automatically gains all the non-private fields and methods of its superclass.

### Inheritance Formula

```java
class [Subclass] extends [Superclass] {
    [additional fields and methods]
}
```

<details>
<summary>Show code</summary>

```java
class Subsystem {
    boolean isEnabled;

    void enable() {
        isEnabled = true;
    }
}

class Flywheel extends Subsystem {
    double voltage;

    void spin() {
        System.out.println("Spinning at " + voltage + " volts");
    }
}
```
</details>

```java
Flywheel shooterWheel = new Flywheel();
shooterWheel.enable(); // Inherited from Subsystem
shooterWheel.voltage = 12.0;
shooterWheel.spin();

System.out.println(shooterWheel.isEnabled);
```

Output:
```text
Spinning at 12.0 volts
true
```

Even though `enable()` and `isEnabled` were never defined inside `Flywheel`, they're
available on every `Flywheel` object, since `Flywheel` inherits them from `Subsystem`.

## The super Keyword

The `super` keyword refers to the superclass, and is most commonly used to call the
superclass's constructor from within a subclass's constructor.

<details>
<summary>Show code</summary>

```java
class Subsystem {
    boolean isEnabled;

    Subsystem(boolean isEnabled) {
        this.isEnabled = isEnabled;
    }
}

class Flywheel extends Subsystem {
    double voltage;

    Flywheel(double voltage) {
        super(true); // Calls the Subsystem constructor
        this.voltage = voltage;
    }
}
```
</details>

Just like `this(...)`, a call to `super(...)` must be the very first line of a
constructor. `super` can also be used outside of constructors, to call a method defined
in the superclass, even if the subclass has overridden it.

## Overriding vs. Overloading

These two terms sound similar, but describe very different things:

- **Overriding**: A subclass provides its own implementation of a method that's
  already defined in its superclass. The method signature (name, parameters, and
  return type) must match exactly.
- **Overloading** (see the Constructors section): A class defines multiple methods
  with the same name, but different parameters.

<details>
<summary>Show code</summary>

```java
class Subsystem {
    void periodic() {
        System.out.println("Generic subsystem update");
    }
}

class Flywheel extends Subsystem {
    @Override
    void periodic() {
        System.out.println("Flywheel-specific update");
    }
}
```
</details>

```java
Flywheel shooterWheel = new Flywheel();
shooterWheel.periodic();
```

Output:
```text
Flywheel-specific update
```

## The @Override Annotation

The `@Override` annotation isn't strictly required, but it's a best practice to
include whenever you're overriding a method. It tells the compiler that you intend to
override a superclass method, so if you accidentally misspell the method name or use
the wrong parameters, the compiler will raise an error instead of silently creating an
unrelated new method.

For more information about how overridden methods actually get chosen at runtime, see
the Polymorphism section.
