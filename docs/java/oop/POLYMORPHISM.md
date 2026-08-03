import useBaseUrl from '@docusaurus/useBaseUrl';

# Polymorphism

Polymorphism (Greek for "many forms") is the ability for an object to be treated as
an instance of its superclass, while still behaving according to its own, more
specific subclass. It's one of the most powerful ideas in OOP, since it lets you write
code that works with many different types of objects, without needing to know exactly
which one it's dealing with.

<img
src={useBaseUrl("img/images/javaoop/transformer-robot.gif")}
alt="transformer-robot"
/>

## Upcasting

Since a subclass inherits everything from its superclass, a subclass object can always
be treated as though it were an object of the superclass type. This is called
**upcasting**, and it happens automatically, similar to widening casting covered in
the Type Casting section.

```
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

```
Subsystem subsystem = new Flywheel(); // A Flywheel, stored as a Subsystem reference
subsystem.periodic();
```

Output:
```text
Flywheel-specific update
```

Even though `subsystem` is declared as a `Subsystem`, it's actually holding a
`Flywheel` object underneath, and Java remembers that.

## Dynamic Method Dispatch

Notice that calling `periodic()` on the upcast `subsystem` reference still ran
`Flywheel`'s overridden version, not `Subsystem`'s original one. This is called
**dynamic method dispatch**: Java decides which overridden method to actually run based
on the object's real, runtime type, not the type of the variable referencing it.

This is what makes polymorphism useful. A single list of `Subsystem` references can
hold many different kinds of subsystems, and calling `periodic()` on each one will
automatically run the correct, subsystem-specific behavior.

```
class Intake extends Subsystem {
    @Override
    void periodic() {
        System.out.println("Intake-specific update");
    }
}
```

```
Subsystem[] subsystems = { new Flywheel(), new Intake() };

for (Subsystem subsystem : subsystems) {
    subsystem.periodic();
}
```

Output:
```text
Flywheel-specific update
Intake-specific update
```

The loop doesn't need to know or care whether each `subsystem` is actually a
`Flywheel` or an `Intake`; it just calls `periodic()`, and polymorphism takes care of
running the right code. For more information about arrays and loops like the one
above, see the Data Structures and Control Flow sections.

## Why This Matters for Robot Code

This pattern is exactly how many FRC codebases are structured. A robot might keep a
single list of `Subsystem` references, one for each mechanism on the robot, and call
`periodic()` on all of them every loop cycle, without ever needing a giant chain of
if-statements checking what kind of subsystem each one is.
