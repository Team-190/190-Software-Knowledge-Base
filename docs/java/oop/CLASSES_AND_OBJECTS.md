import useBaseUrl from '@docusaurus/useBaseUrl';

# Classes and Objects

Object-Oriented Programming (OOP) is a way of organizing code around **objects**,
bundles of data and behavior that model real things. Almost everything you've written
so far in Java has secretly been part of a class, so let's finally unpack what that
actually means.

## Classes: The Blueprint

A class is a blueprint that describes what an object will look like and how it will
behave. A class by itself doesn't take up memory for actual data, it just defines the
structure: what **fields** (data) and **methods** (behavior) any object built from it
will have.

<img
src={useBaseUrl("img/images/javaoop/cookie-cutter-class.gif")}
alt="cookie-cutter-class"
/>

Think of a class like a cookie cutter. The cutter itself isn't a cookie, it just
defines the shape. You can use the same cutter to stamp out as many cookies as you
want, and each cookie is separate from the others, even though they all share the same
shape.

### Class Formula

```
class [ClassName] {
    [fields]
    [methods]
}
```

```
class Flywheel {
    double voltage;

    void spin() {
        System.out.println("Spinning at " + voltage + " volts");
    }
}
```

Here, `Flywheel` is the class (the cookie cutter). It defines a field, `voltage`, and a
method, `spin()`, but on its own, it isn't an actual flywheel you can use yet.

## Objects: The Instance

An object is an actual instance of a class, one of the "cookies" stamped out by the
cutter. Each object gets its own copy of the fields defined by its class, so changing
one object's data doesn't affect any other object made from the same class.

### The new Keyword

Objects are created using the `new` keyword, which tells Java to allocate memory for a
new instance of a class.

```
Flywheel shooterWheel = new Flywheel();
shooterWheel.voltage = 12.0;
shooterWheel.spin();
```

Output:
```text
Spinning at 12.0 volts
```

You can create as many independent objects from the same class as you want:

```
Flywheel shooterWheel = new Flywheel();
Flywheel intakeWheel = new Flywheel();

shooterWheel.voltage = 12.0;
intakeWheel.voltage = 6.0;

System.out.println(shooterWheel.voltage);
System.out.println(intakeWheel.voltage);
```

Output:
```text
12.0
6.0
```

Even though `shooterWheel` and `intakeWheel` were both built from the `Flywheel`
class, they're independent objects, each with their own `voltage` field.

## Everything is (Kind of) an Object

Remember from the Variables section that `String` is a reference type, since it's
technically an object of the `String` class? This is true for nearly everything in
Java that isn't a primitive data type. When you write:

```
String frcYear = "2026";
```

You're really creating an object of the `String` class, which happens to have its own
fields (the characters it stores) and methods (like `.length()` or `.equals()`) defined
for you already, by the creators of Java itself. The only difference is that Java gives
`String` objects a shorthand syntax (string literals) so you don't have to type
`new String("2026")` every time.

For more information about defining your own methods and how objects are created step
by step, see the Constructors section.
