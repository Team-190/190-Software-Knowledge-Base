import useBaseUrl from '@docusaurus/useBaseUrl';

# Access Modifiers

Access modifiers control which parts of your code are allowed to see or use a field,
method, or class. They're what make **encapsulation** possible: the practice of
hiding an object's internal details and only exposing what other code actually needs.

<img
src={useBaseUrl("img/images/javaoop/treehouse-private.gif")}
alt="treehouse-private"
/>

## The Four Access Levels

| Modifier              | Same Class | Same Package | Subclass | Everywhere |
|------------------------|------------|---------------|----------|------------|
| `public`               | ✅         | ✅            | ✅       | ✅         |
| `protected`            | ✅         | ✅            | ✅       | ❌         |
| (none, package-private) | ✅         | ✅            | ❌       | ❌         |
| `private`              | ✅         | ❌            | ❌       | ❌         |

- **`public`**: Accessible from anywhere in the program.
- **`protected`**: Accessible within the same package, and by subclasses (see the
  Inheritance section).
- **Package-private** (no keyword at all): Accessible only within the same package.
- **`private`**: Accessible only within the same class.

## Why Hide Fields?

It might seem easier to just make every field `public` so any code can read or change
it directly. However, this makes it very easy for other code to put an object into an
invalid state. For example, imagine a `Flywheel` class with a public `voltage` field:

```java
flywheel.voltage = 9999.0; // Nothing is stopping this from happening!
```

Nothing prevents another part of the codebase from accidentally setting a dangerously
high voltage. By marking `voltage` as `private`, the field can no longer be accessed
directly from outside the class, forcing all interaction to go through methods that
the class controls.

## Getters and Setters

Since private fields can't be accessed directly from outside their class, classes
typically expose public methods, called **getters** and **setters**, to read and
modify them safely.

<details>
<summary>Show code</summary>

```java
class Flywheel {
    private double voltage;

    public double getVoltage() {
        return voltage;
    }

    public void setVoltage(double newVoltage) {
        if (newVoltage <= 12.0) {
            voltage = newVoltage;
        }
    }
}
```
</details>

```java
Flywheel shooterWheel = new Flywheel();
shooterWheel.setVoltage(9999.0); // Ignored, since it fails the check
shooterWheel.setVoltage(12.0);

System.out.println(shooterWheel.getVoltage());
```

Output:
```text
12.0
```

Now, the `setVoltage()` method can validate incoming data before it's ever stored,
something that would be impossible if `voltage` were a plain public field.

## Naming Conventions

- Getter methods are named `get` followed by the field name in PascalCase: `getVoltage()`
- Setter methods are named `set` followed by the field name in PascalCase: `setVoltage()`
- Boolean getters are often named `is` followed by the field name instead of `get`: `isSpinning()`
