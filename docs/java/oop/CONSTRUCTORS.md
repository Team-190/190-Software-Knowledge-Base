import useBaseUrl from '@docusaurus/useBaseUrl';

# Constructors

A constructor is a special method that runs automatically whenever an object is
created with the `new` keyword. Its job is to set up (construct) the object, usually by
initializing its fields to starting values.

<img
src={useBaseUrl("img/images/javaoop/under-construction.gif")}
alt="under-construction"
/>

## The Default Constructor

If a class doesn't define any constructor at all, Java automatically provides an
empty, no-argument default constructor for you behind the scenes. This is why you were
able to write `new Flywheel()` in the Classes and Objects section, even though the
`Flywheel` class never explicitly defined a constructor.

## Writing Your Own Constructor

Once you write your own constructor, Java stops providing the automatic default one,
and you take full control over how an object is initialized.

### Constructor Formula

```java
class [ClassName] {
    [ClassName]([parameters]) {
        [initialization code]
    }
}
```

A constructor looks like a method, but it has no return type (not even `void`), and
its name must exactly match the name of the class.

```java
class Flywheel {
    double voltage;

    Flywheel(double startingVoltage) {
        voltage = startingVoltage;
    }
}
```

Now, instead of creating a `Flywheel` and setting its voltage separately, both steps
happen at once:

```java
Flywheel shooterWheel = new Flywheel(12.0);
System.out.println(shooterWheel.voltage);
```

Output:
```text
12.0
```

## The this Keyword

Notice that the constructor above used `startingVoltage` as the parameter name to
avoid a naming conflict with the `voltage` field. Java also provides the `this`
keyword, which refers to the current object, and can be used to disambiguate a field
from a parameter that share the same name.

```java
class Flywheel {
    double voltage;

    Flywheel(double voltage) {
        this.voltage = voltage; // this.voltage refers to the field, voltage refers to the parameter
    }
}
```

`this.voltage` refers to the object's field, while `voltage` on its own refers to the
parameter that was just passed in.

## Constructor Overloading

A class can define multiple constructors, as long as they each accept a different set
of parameters. This is known as **overloading**, and it allows a class to be
constructed in more than one way.

<details>
<summary>Show code</summary>

```java
class Flywheel {
    double voltage;

    Flywheel() {
        this(6.0); // Calls the other constructor with a default voltage
    }

    Flywheel(double voltage) {
        this.voltage = voltage;
    }
}
```
</details>

```java
Flywheel defaultWheel = new Flywheel();
Flywheel customWheel = new Flywheel(12.0);

System.out.println(defaultWheel.voltage);
System.out.println(customWheel.voltage);
```

Output:
```text
6.0
12.0
```

Calling `this(...)` from inside a constructor lets one constructor delegate to another,
so shared initialization logic doesn't have to be duplicated. When used this way,
`this(...)` must be the very first line of the constructor.
