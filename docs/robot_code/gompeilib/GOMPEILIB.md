# 🐐 GompeiLib

:::caution Living Documentation
APIs and control systems change season to season, and sometimes mid-season. Specific class names, file paths, and
code examples throughout this section reflect FRC 190's codebase at the time of writing and may become outdated or
obsolete as WPILib, CTRE, and other vendor libraries evolve. Treat this section as a guide to the underlying
concepts, not a guaranteed match to the current source.
:::

Every season, 190 rebuilds a lot of the same things: a swerve drivebase, an elevator, a roller, a vision pose
estimator, the IO plumbing described in [Hardware Abstraction](../HARDWARE_ABSTRACTION.md) to make each of them
simulatable and replayable. **GompeiLib** (```edu.wpi.team190.gompeilib```) is 190's answer to not rewriting that
every year: a shared Gradle library of core utilities and reusable subsystems that every season's robot project pulls
in as a dependency, rather than copy-pasting from whatever the previous year's repository happened to contain.

## What's In It

GompeiLib splits into two halves. The **core utilities** are small, hardware-agnostic building blocks every
subsystem in the library (and most subsystems in a season repo) end up depending on somewhere:

| Class | What it's for |
|---|---|
| ```RobotState``` | A minimal interface for anything that needs a ```periodic()``` call but isn't tied to one specific robot |
| ```RobotMode``` | The ```REAL```/```SIM```/```REPLAY``` enum covered in [Runtime Switch](../ROBOT_CODE_ARCHITECTURE.md#runtime-switch) |
| ```VirtualSubsystem``` | A periodic callback for things that need to run every cycle but aren't hardware, so they don't need a WPILib ```Subsystem```'s requirement/mutex machinery |
| ```Setpoint<U>``` | A unit-aware setpoint that also tracks a driver-adjustable offset on top of it, the same object backing the offset commands in [Action Definitions: Commands](../ROBOT_CODE_ARCHITECTURE.md#action-definitions-commands) |
| ```GeometryUtil``` | The ```Pose2d```/```Transform2d``` helper functions covered in [Geometry Concepts](../GEOMETRY_CONCEPTS.md) |
| ```LimelightHelpers``` | The community-standard helper class for reading a Limelight's NetworkTables output |

The **reusable subsystems** are the actual mechanisms: ```Elevator```, ```Arm```, generic ```Roller```/```Flywheel```
building blocks (the same ```GenericRoller``` from [Hardware Abstraction](../HARDWARE_ABSTRACTION.md)), a full
```Vision``` pipeline, and a complete swerve module/drivebase implementation. Every one of them follows the same IO
abstraction pattern: an ```ArmIO``` interface, an ```ArmIOTalonFX``` for real hardware, an ```ArmIOSim``` for
simulation, exactly the shape covered in [Hardware Abstraction](../HARDWARE_ABSTRACTION.md#the-io-interface-pattern).
That's what makes a subsystem in GompeiLib actually reusable across seasons: it drops into any year's project with
whatever hardware layer that year's robot actually has, rather than being hardwired to one specific set of CAN IDs
and motor types.

## ```examples/swerve```

GompeiLib ships a complete, buildable reference robot project inside its own repository, under ```examples/swerve```:
its own ```Main.java```, ```Robot.java```, ```RobotContainer```, vendordeps, and deploy assets, a real robot project
that happens to depend on the GompeiLib source sitting right next to it instead of a season's actual game-specific
code. It serves two purposes at once: it's living documentation of how to wire GompeiLib's subsystems together into
an actual robot, and it's a real integration test, since it's a project that has to compile, deploy, and run
correctly against whatever GompeiLib's ```main``` branch currently looks like.

## ```GompeiLib.init(...)```

Before any subsystem or utility in the library can be used, one call is required, once, from ```robotInit()```:

<details>
<summary>Show code</summary>

```java
public static void init(RobotMode mode, boolean isTuning, double loopPeriodSecs) {
  if (initialized) {
    System.err.println("GompeiLib has already been initialized!");
    return;
  }

  currentMode = mode;
  tuningMode = isTuning;
  loopPeriod = loopPeriodSecs;

  initialized = true;
}

private static void checkInitialized() {
  if (!initialized) {
    throw new IllegalStateException("GompeiLib.init() must be called before using GompeiLib.");
  }
}
```

</details>

Every other static accessor on ```GompeiLib``` (```getMode()```, ```isTuning()```, ```getLoopPeriod()```) calls
```checkInitialized()``` first and throws if ```init()``` hasn't run yet, so a season repo forgetting this call fails
loudly and immediately the first time anything in the library tries to read the current mode or loop period, rather
than quietly misbehaving. 190's own ```Robot()``` constructor is where this actually happens:

```java
public Robot() {
  super(Constants.LOOP_PERIOD_SECONDS);
  GompeiLib.init(Constants.getMode(), Constants.TUNING_MODE, Constants.LOOP_PERIOD_SECONDS);
}
```

## Where To Go From Here

This page covers what GompeiLib *is*. The rest of this section covers how it's actually developed and consumed:

- [Library Integration](./LIBRARY_INTEGRATION.md), how a season repo actually pulls GompeiLib in, both as a local
  subproject and as a published artifact.
- [Sync](./SYNC.md), how changes made inside a season repo's local copy make their way back to the canonical
  GompeiLib repository, and vice versa.
- [Making Changes](./MAKING_CHANGES.md), where to actually edit GompeiLib, and what CI checks a change has to pass.
- [Unit Testing](./UNIT_TESTING.md), the testing standard every addition to the library is expected to meet.
