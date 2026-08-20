# 🗃️ Hardware Abstraction

:::caution Living Documentation
APIs and control systems change season to season, and sometimes mid-season. Specific class names, file paths, and
code examples throughout this section reflect FRC 190's codebase at the time of writing and may become outdated or
obsolete as WPILib, CTRE, and other vendor libraries evolve. Treat this section as a guide to the underlying
concepts, not a guaranteed match to the current source.
:::

[Robot Code Architecture](./ROBOT_CODE_ARCHITECTURE.md) mentioned that a subsystem "holds an IO interface to talk to
hardware, and lets the concrete implementation decide whether that means real hardware, simulation, or a no-op stub."
This page is about that pattern in full: why it exists, how the interface itself is shaped, how AdvantageKit turns a
handful of annotated fields into a working logging and replay system, and what a real hardware implementation
actually looks like. Everything here is grounded in 190's actual roller IO, ```GenericRollerIO```, which is small
enough to see the whole pattern at once. The CTRE-specific pieces it leans on (configuration objects, status signals)
are covered from the hardware side in [FRC Hardware](./FRC_HARDWARE.md).

## Why Abstract Hardware?

### The Problem With Calling Vendor APIs Directly

Imagine a roller subsystem that just imports ```com.ctre.phoenix6.hardware.TalonFX``` and calls methods on it
directly, wherever it needs to. That works, right up until it doesn't:

- **Testability.** The subsystem's logic, "am I at my voltage goal," "what state am I in," is now inseparable from
  a physical CAN device. There's no way to exercise that logic without a real TalonFX plugged into a real CAN bus,
  which means no way to catch a logic bug without a robot in front of you.
- **Simulation.** CTRE's real hardware calls don't mean anything on a desktop with no roboRIO and no CAN bus. Either
  the subsystem silently does nothing in simulation, or every subsystem ends up full of ```if (isSimulation())```
  branches scattered through its actual behavior.
- **Vendor lock-in.** 190 runs several robot versions out of one codebase (see
  [Shared Codebase Architecture](./ROBOT_CODE_ARCHITECTURE.md#shared-codebase-architecture)), and it's entirely
  possible for the *same mechanism* to be built with different hardware on different robots. If every subsystem method
  is written directly against one vendor's types, swapping hardware means rewriting the subsystem, not just its
  wiring.

### What AdvantageKit's IO Pattern Buys

The fix is to never let a subsystem touch a vendor API at all. Instead, a thin interface, the **IO**, sits between
them, and the subsystem only ever calls methods on that interface. Which concrete class actually satisfies it is
decided once, at construction (see [Runtime Switch](./ROBOT_CODE_ARCHITECTURE.md#runtime-switch)), and the subsystem
never finds out which one it got. That one change buys back everything the direct approach lost:

- **Sim support.** ```GenericRollerIOSim``` implements the exact same interface as the real hardware, backed by a
  WPILib ```DCMotorSim``` instead of a CAN device. The subsystem code above it doesn't change by a single line.
- **Hardware swaps.** A ```RobotContainer``` picks the implementation per robot: ```GenericRollerIOTalonFX``` for real
  hardware, ```GenericRollerIOSim``` for simulation, or a bare ```new GenericRollerIO() {}``` when neither applies
  (replay, or a robot that doesn't have that mechanism at all). Same subsystem, same wrapper class, three
  interchangeable backends.
- **Log replay.** Because a subsystem only ever reads a device's state through one object (its *inputs*, covered
  next), that object can be logged during a real match and fed back in later exactly as it was recorded, replaying
  an entire match's subsystem behavior without a robot, or even a simulation, in the loop at all.

## The IO Interface Pattern

An IO interface describes **one hardware unit**, and nothing else. ```GenericRollerIO``` is a good example precisely
because it's small:

<details>
<summary>Show code</summary>

```java
public interface GenericRollerIO {
  @AutoLog
  public static class GenericRollerIOInputs {
    public Rotation2d position = new Rotation2d();
    public AngularVelocity velocity = RadiansPerSecond.of(0.0);

    public double[] appliedVolts = new double[] {};
    public double[] supplyCurrentAmps = new double[] {};
    public double[] torqueCurrentAmps = new double[] {};
    public double[] temperatureCelsius = new double[] {};
  }

  default void updateInputs(GenericRollerIOInputs inputs) {}

  default void setVoltageGoal(Voltage volts) {}

  default boolean atVoltageGoal(Voltage voltageReference) {
    return false;
  }
}
```

</details>

Notice what ```GenericRollerIO``` does *not* know about: it has no idea whether it's spinning an intake roller, a
feeder, or a climber's ratchet, that's decided entirely by whichever subsystem chooses to hold one (see
[Hardware Definitions: Subsystems](./ROBOT_CODE_ARCHITECTURE.md#hardware-definitions-subsystems) for how ```Intake```
composes a ```GenericRoller``` together with a ```FourBarLinkage```). All it describes is "a thing that spins and
reports back on itself," which is exactly why the same interface can back any mechanism built from a roller.

The interface is a contract with two directions, and every method on it falls into one or the other:

- **Data in.** ```updateInputs(inputs)``` pulls fresh telemetry *from* the device and writes it *into* the shared
  ```inputs``` object. This is the only direction data flows from hardware toward the rest of the code.
- **Commands out.** ```setVoltageGoal(volts)``` pushes a command *to* the device. Nothing comes back from calling it;
  it's fire-and-forget, the same way [control requests](./FRC_HARDWARE.md#control-requests-motors-only) are.

```atVoltageGoal(...)``` looks like it reads from hardware, but it doesn't have to. An implementation is free to
answer it from whatever it already has cached, without issuing a new CAN request.

Every method above is a **default method**, and every one of them defaults to doing nothing. That's deliberate, for
two reasons. First, a concrete implementation only needs to override what it actually cares about, nothing forces
every IO implementation to handle every possible interaction if a given device genuinely can't. Second, and more
importantly, it's what makes an empty anonymous class a valid implementation all on its own:

```java
new GenericRollerIO() {}   // valid: every method already has a body, one that does nothing
```

That's precisely the "no hardware at all" stand-in a ```RobotContainer``` reaches for when a robot doesn't have a
given mechanism, or when nothing should touch real hardware at all (log replay). No dedicated "null" or "stub"
implementation class needs to exist anywhere. The interface already provides one for free.

## IO Inputs and ```@AutoLog```

The nested ```GenericRollerIOInputs``` class from above is the **data contract**: every field ```updateInputs()``` is
allowed to populate, and the only thing the rest of the subsystem is allowed to read back. Notice its fields are
plain, public, and mutable, no getters, no encapsulation, which looks unusual for 190's code but is required here:
the fields have to be visible and reflectable for what happens next.

```GenericRollerIOInputs``` is annotated with ```@AutoLog```, from AdvantageKit
(```org.littletonrobotics.junction.AutoLog```). At compile time, an annotation processor scans for every class
carrying that annotation and generates a matching subclass next to it. For ```GenericRollerIOInputs```, that's
```GenericRollerIOInputsAutoLogged```. You'll never find that class's source in the repository, because nobody writes
it; it's produced fresh on every build, with one field-by-field ```toLog(table)```/```fromLog(table)``` pair per field
declared above it. Add a field to ```GenericRollerIOInputs```, and the generated class picks it up automatically, no
logging code to hand-write or keep in sync.

The generated ```AutoLogged``` class is what a subsystem actually instantiates and holds, never the plain
```...IOInputs``` class it's generated from:

<details>
<summary>Show code</summary>

```java
public class GenericRoller {
  private final GenericRollerIO io;
  private final GenericRollerIOInputsAutoLogged inputs;
  private final String aKitTopic;

  public GenericRoller(GenericRollerIO io, Subsystem subsystem, GenericRollerConstants constants, String name, ...) {
    this.io = io;
    inputs = new GenericRollerIOInputsAutoLogged();
    aKitTopic = subsystem.getName() + "/Roller" + name;
    ...
  }

  public void periodic() {
    io.updateInputs(inputs);
    Logger.processInputs(aKitTopic, inputs);
    ...
  }
}
```

</details>

```Logger.processInputs(key, inputs)``` is where this whole pattern actually pays off, and it behaves differently
depending on which ```RobotMode``` (see [Runtime Switch](./ROBOT_CODE_ARCHITECTURE.md#runtime-switch)) the program is
running under, without the surrounding code changing at all:

- On **REAL** or **SIM**, ```updateInputs()``` has just filled ```inputs``` with fresh values, and
  ```processInputs()``` calls the generated ```toLog(...)```, writing every field out to this cycle's log entry.
- On **REPLAY**, ```updateInputs()``` was never meaningfully called (the container built with no-op IOs for replay),
  so ```processInputs()``` instead calls the generated ```fromLog(...)```, and *overwrites* ```inputs``` with
  whatever was recorded for this same cycle during the original run.

Same call, same object, opposite direction of data flow, and every line of subsystem code that reads from
```inputs``` after this point behaves identically either way.

## Real Hardware Implementations

```GenericRollerIOTalonFX``` is the concrete class that satisfies ```GenericRollerIO``` for an actual Kraken/TalonFX.
Its constructor is where the device gets wired up, once: it builds a ```TalonFX```, applies a
```TalonFXConfiguration``` through ```PhoenixUtil.tryUntilOk``` (see
[Configuration Objects](./FRC_HARDWARE.md#configuration-objects)), and grabs a ```StatusSignal``` handle for every
field it will need, registering all of them for the batched, synchronized refresh described in
[Status Signals](./FRC_HARDWARE.md#status-signals):

<details>
<summary>Show code</summary>

```java
public GenericRollerIOTalonFX(GenericRollerConstants constants) {
  talonFX = new TalonFX(constants.leaderCANID, constants.canBus);

  talonFXConfiguration = new TalonFXConfiguration();
  talonFXConfiguration.MotorOutput.withInverted(constants.leaderInvertedValue);
  talonFXConfiguration.CurrentLimits...;
  PhoenixUtil.tryUntilOk(5, () -> talonFX.getConfigurator().apply(talonFXConfiguration, 0.25));

  positionRotations = talonFX.getPosition();
  velocityRotationsPerSecond = talonFX.getVelocity();
  // ...remaining StatusSignal handles, then registered for batched refresh

  voltageRequest = new VoltageOut(0.0).withEnableFOC(constants.enableFOC);
}
```

</details>

Everything up to this point only runs once. The part that runs every cycle is the ```updateInputs()``` override:

<details>
<summary>Show code</summary>

```java
@Override
public void updateInputs(GenericRollerIOInputs inputs) {
  inputs.position = Rotation2d.fromRotations(positionRotations.getValueAsDouble());
  inputs.velocity = velocityRotationsPerSecond.getValue();

  inputs.appliedVolts = new double[appliedVolts.size()];
  inputs.supplyCurrentAmps = new double[supplyCurrentAmps.size()];
  inputs.torqueCurrentAmps = new double[torqueCurrentAmps.size()];
  inputs.temperatureCelsius = new double[temperatureCelsius.size()];

  for (int i = 0; i <= followerTalonFX.length; i++) {
    inputs.appliedVolts[i] = appliedVolts.get(i).getValueAsDouble();
    inputs.supplyCurrentAmps[i] = supplyCurrentAmps.get(i).getValueAsDouble();
    inputs.torqueCurrentAmps[i] = torqueCurrentAmps.get(i).getValueAsDouble();
    inputs.temperatureCelsius[i] = temperatureCelsius.get(i).getValueAsDouble();
  }
}
```

</details>

:::important
This is worth stating plainly: ```updateInputs()``` is the *only* method, in the *only* class, that ever calls
```.getValue()``` or ```.getValueAsDouble()``` on one of this roller's status signals. Every other piece of code that
cares about this roller's position, velocity, or current (the subsystem's ```periodic()```, its ```atGoal()```
checks, its logging, any command that reads it) reads it off the ```inputs``` object instead, never the hardware
directly. That single choke point per device is the entire pattern in one sentence: there is exactly one place where
"go talk to real hardware" happens, and everything else in the codebase, including simulation and replay, is
completely decoupled from it.
:::
