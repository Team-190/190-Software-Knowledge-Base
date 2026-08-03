import useBaseUrl from '@docusaurus/useBaseUrl';

# Interfaces

An interface is a completely abstract type that defines a contract: a set of methods
that any implementing class guarantees to provide, without specifying any fields or
implementation details of its own.

<img
src={useBaseUrl("img/images/javaoop/cow-interface.png")}
alt="cow-interface"
/>

## Declaring an Interface

An interface is declared using the `interface` keyword, and a class agrees to follow
its contract using the `implements` keyword.

### Interface Formula

```java
interface [InterfaceName] {
    [return type] [method name]([parameters]);
}
```

```java
interface Controllable {
    void enable();
    void disable();
}
```

<details>
<summary>Show code</summary>

```java
class Flywheel implements Controllable {
    boolean isEnabled;

    @Override
    public void enable() {
        isEnabled = true;
    }

    @Override
    public void disable() {
        isEnabled = false;
    }
}
```
</details>

Just like an abstract method (see the Abstract Classes section), a class that
implements an interface is required to provide an implementation for every method the
interface declares, or the code won't compile.

## Interfaces vs. Abstract Classes

Interfaces and abstract classes seem similar at first, since both can't be
instantiated directly, and both can require subclasses/implementers to fill in method
bodies. However, they serve different purposes:

| Abstract Class | Interface |
|-----------------|-----------|
| Can have both abstract and fully implemented methods | Traditionally only method signatures (though modern Java allows default methods) |
| Can have fields (including non-static ones) | Fields are implicitly `public static final` (constants) |
| A class can only `extends` **one** abstract class | A class can `implements` **multiple** interfaces |
| Represents an "is-a" relationship with shared state | Represents a "can-do" capability, with no shared state |

## Implementing Multiple Interfaces

Since Java doesn't allow a class to extend more than one superclass, interfaces are
how Java gets around the limitations of single inheritance. A class can implement as
many interfaces as it needs to.

<details>
<summary>Show code</summary>

```java
interface Loggable {
    void log();
}

class Flywheel implements Controllable, Loggable {
    boolean isEnabled;

    @Override
    public void enable() {
        isEnabled = true;
    }

    @Override
    public void disable() {
        isEnabled = false;
    }

    @Override
    public void log() {
        System.out.println("Flywheel enabled: " + isEnabled);
    }
}
```
</details>

Now, `Flywheel` guarantees both the `Controllable` contract and the `Loggable`
contract, even though it can still only extend a single superclass.

## Default Methods

Modern versions of Java also allow interfaces to provide a `default` implementation for
a method, which implementing classes can use as-is, or override if they need different
behavior.

```java
interface Controllable {
    void enable();
    void disable();

    default void toggle() {
        System.out.println("Toggling controllable state");
    }
}
```

Classes that implement `Controllable` automatically get `toggle()` for free, without
needing to implement it themselves, unless they choose to override it.
