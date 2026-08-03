import useBaseUrl from '@docusaurus/useBaseUrl';

# Enums

An enum (short for enumeration) is a special data type that represents a fixed set of
named constants. Enums are useful whenever a variable should only ever hold one of a
small, known set of values, such as the state of a robot mechanism.

## Declaring an Enum

### Enum Formula

```java
enum [EnumName] {
    [CONSTANT_ONE], [CONSTANT_TWO], [CONSTANT_THREE]
}
```

```java
enum ElevatorState {
    STOWED, INTAKING, SCORING
}
```

An enum is created much like any other class, and its constants are accessed using
the enum name followed by the constant.

```java
ElevatorState currentState = ElevatorState.STOWED;
```

Unlike a plain `int` or `String`, an `ElevatorState` variable can only ever be one of
the three declared constants, so a typo like `ElevatorState.STOWD` is a compile error
instead of a silent bug.

## Enums in a Switch Statement

Enums pair especially well with switch statements, since the compiler already knows
every possible value the variable could hold. For more information about switch
statements, see the Switch section.

<details>
<summary>Show code</summary>

```java
switch (currentState) {
    case STOWED:
        elevator.setVoltage(0);
        break;
    case INTAKING:
        elevator.setVoltage(-2);
        break;
    case SCORING:
        elevator.setVoltage(6);
        break;
}
```
</details>

## Enums with Fields and Constructors

Enums aren't limited to just being a list of names, they can also carry their own
data, just like a regular class. Each constant calls the enum's constructor when it's
declared.

<details>
<summary>Show code</summary>

```java
enum ElevatorState {
    STOWED(0),
    INTAKING(-2),
    SCORING(6);

    private final double voltage;

    ElevatorState(double voltage) {
        this.voltage = voltage;
    }

    public double getVoltage() {
        return voltage;
    }
}
```
</details>

```java
double voltage = ElevatorState.SCORING.getVoltage(); // Equal to 6
```

This pattern is extremely common in FRC robot code, since it lets you bundle a
mechanism's named states directly together with the values (voltages, setpoints,
timeouts) associated with each one, instead of managing them as separate variables.
For more information about fields, constructors, and the `this` keyword, see the
Object-Oriented Programming section.

<img
src={useBaseUrl("img/images/javaadvanced/enum.png")}
alt="pick-one-wheel"
/>