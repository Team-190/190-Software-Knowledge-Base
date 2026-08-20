# 🪵 Logging

:::caution Living Documentation
APIs and control systems change season to season, and sometimes mid-season. Specific class names, file paths, and
code examples throughout this section reflect FRC 190's codebase at the time of writing and may become outdated or
obsolete as WPILib, CTRE, and other vendor libraries evolve. Treat this section as a guide to the underlying
concepts, not a guaranteed match to the current source.
:::

## Why Logging Matters

An FRC match lasts two and a half minutes, runs on hardware nobody can attach a debugger to mid-match, and is over
before anyone watching from the pits could possibly diagnose what went wrong in real time. Whatever caused a
mechanism to stall, a robot to drift off its path, or an autonomous routine to miss a step has to be understood
*after the fact*, from whatever evidence was captured while it was happening. Logging is that evidence, and how much
of it exists determines how good a question can even be asked about a match that already ended.

Team 6328, the team behind AdvantageKit (the logging framework 190 builds on), frames this as three progressively
more capable levels. Each one fixes a real limitation of the last, and understanding why each level exists is what
makes the rest of this page make sense.

## Level 1: Driver Station Logging

The Driver Station application captures a log automatically, with zero robot code required: joystick and controller
inputs, when the robot was enabled and disabled, battery voltage over time, and CAN bus utilization. This is the
baseline every FRC team already has, whether they think about logging or not.

Its limitations are exactly what "zero code" implies. There's no custom or sensor data (an elevator's height, a
shooter's RPM), no visibility into what any subsystem thought it was doing internally, and what is captured is coarse
and hard to line up against actual robot behavior. A Driver Station log can tell you the robot was enabled at a given
timestamp; it can't tell you why a mechanism wasn't where it should have been.

## Level 2: On-Robot Logging

The next level is writing custom values to a log file on the roboRIO during a match: sensor readings, a subsystem's
current state, a setpoint being tracked. This is a real improvement, because now the log contains whatever someone
thought to record, not just what the Driver Station captures for free.

The limitation is baked directly into that description: only whatever was explicitly logged is available after the
match. If a value wasn't being recorded, it's gone, permanently, the instant the match ends, and there's no way to go
back and ask a question nobody thought to log for ahead of time.

## Level 3: Log Replay

The core idea behind the third level is a shift in *what* gets logged: instead of logging derived values (a
computed setpoint, a boolean flag), log every raw hardware input the robot code ever read, and then **replay** the
same robot code against that recorded log later, off the robot entirely.

This is exactly why the [IO abstraction pattern](./HARDWARE_ABSTRACTION.md) exists. Because every subsystem reads
hardware exclusively through an ```updateInputs()``` call into a logged ```...IOInputs``` object, replaying a match is
just a matter of feeding those exact same recorded inputs back into the exact same subsystem code, cycle for cycle,
and letting it run again as if it were live. Nothing about hardware abstraction was built for testability or
simulation alone, log replay is the reason that pattern exists in the first place.

The payoff is what makes this level worth the setup cost: if a match raises a question nobody thought to log for
ahead of time, the fix isn't "wait for next match and hope it happens again." It's adding a new
```Logger.recordOutput()``` call, re-running replay against the log that's already sitting on disk, and getting an
answer without ever touching the robot again. This is what AdvantageKit provides, and the rest of this page covers
how.

## ```LoggedRobot``` and Setting Up the Logger

[Robot Code Architecture](./ROBOT_CODE_ARCHITECTURE.md#construction-point-robotjava) already covered that 190 extends
AdvantageKit's ```LoggedRobot``` instead of WPILib's ```TimedRobot```, specifically because ```LoggedRobot``` is what
makes every input the robot receives loggable in the first place. Setting up where those logs actually go happens
once, early in ```robotInit()```:

<details>
<summary>Show code</summary>

```java
switch (Constants.getMode()) {
  case REAL:
    Logger.addDataReceiver(new WPILOGWriter());
    Logger.addDataReceiver(new NT4Publisher());
    break;

  case SIM:
    Logger.addDataReceiver(new NT4Publisher());
    break;

  case REPLAY:
    setUseTiming(false);
    String logPath = LogFileUtil.findReplayLog();
    Logger.setReplaySource(new WPILOGReader(logPath));
    Logger.addDataReceiver(new WPILOGWriter(LogFileUtil.addPathSuffix(logPath, "_sim")));
    break;
}

Logger.start();
```

</details>

```Logger.start()``` is what actually begins recording, and it's called only once every destination for this run's
mode has already been registered. Which destinations get registered, and why they differ by mode, is covered in
[Log Destinations](#log-destinations) below.

## What Gets Logged Automatically

Two categories of data end up in the log without any dedicated ```Logger.recordOutput()``` call anywhere in
subsystem code.

The first is every hardware input flowing through the [```@AutoLog``` IO
pattern](./HARDWARE_ABSTRACTION.md#io-inputs-and-autolog): every field on a subsystem's ```...IOInputsAutoLogged```
object gets written to the log every single cycle, automatically, as a side effect of the same
```Logger.processInputs()``` call that already exists to support hardware abstraction. This is also what makes
[Level 3](#level-3-log-replay) possible at all, the raw inputs replay depends on are already being captured with
zero extra logging code.

The second is anything already flowing through NetworkTables, including Driver Station and joystick input, which
AdvantageKit captures as part of the same recording pass. Combined with the IO inputs above, this means a
surprisingly large fraction of a useful log already exists before a single manual logging call is written.

## Logging Custom Values with ```Logger.recordOutput()```

Not everything worth knowing about a match is a raw hardware input. A subsystem's current goal, which state a
superstructure is in, whether a condition it computed internally is currently true, none of that lives in an IO
layer, because none of it comes from hardware. ```Logger.recordOutput(key, value)``` is how anything else gets
recorded, and it's called the same way ```@AutoLog``` inputs are, every cycle, from inside ```periodic()```:

<details>
<summary>Show code</summary>

```java
// Intake.periodic()
Logger.recordOutput("Intake/Intake State", intakeState);

// V3_PootSuperstructure.periodic()
Logger.recordOutput(NTPrefixes.SUPERSTRUCTURE + "Current State", currentState.toString());
Logger.recordOutput(NTPrefixes.SUPERSTRUCTURE + "Next State", nextState.toString());
```

</details>

The key itself, the string path a value gets recorded under, matters as much as the value. 190's convention is a
```/Subsystem/Value``` hierarchy, mirroring the same hierarchical structure [NetworkTables
topics](./NETWORKTABLES.md#topics-a-shared-hierarchical-namespace) already use, so that a log viewer's folder tree
lines up with the codebase's own subsystem boundaries. Shared prefixes that show up across many files are pulled into
one constants class, ```NTPrefixes```, rather than retyped as string literals everywhere:

<details>
<summary>Show code</summary>

```java
public class NTPrefixes {
  public static final String ROBOT_STATE = "RobotState/";
  public static final String SUPERSTRUCTURE = "Superstructure/";
  public static final String POSE_DATA = ROBOT_STATE + "Pose Data/";
}
```

</details>

An ```@AutoLogOutput``` annotation covers the common case of logging one field or one method's return value every
cycle, without writing a ```recordOutput()``` call by hand:

```java
@AutoLogOutput(key = "Climber/isClimbed")
private boolean isClimbed;
```

## Log Destinations

A **destination** is where recorded data actually goes, and 190's code registers a different combination depending
on which mode it's running under, as seen in the ```robotInit()``` switch above:

| Destination | What it does | Active in |
|---|---|---|
| ```WPILOGWriter``` | Writes every recorded value to a ```.wpilog``` file, on a USB stick on a real robot, or on disk during replay | REAL, REPLAY |
| ```NT4Publisher``` | Streams every recorded value live over NetworkTables, for a dashboard or AdvantageScope to watch in real time | REAL, SIM |

REAL gets both: a durable on-disk record for later analysis, and a live stream for watching the robot while it runs.
SIM only needs the live stream, since a simulation run isn't something anyone typically replays later. REPLAY writes
to a *second* ```.wpilog``` (suffixed ```_sim```) rather than streaming live, since replay is usually run much faster
than real time and isn't meant to be watched as it happens, it's meant to produce a new log with whatever new
```recordOutput()``` calls were just added.

## Running Replay in Practice

Replay mode isn't a separate build or a special flag, it falls directly out of [the same runtime switch that picks
everything else](./ROBOT_CODE_ARCHITECTURE.md#runtime-switch). Recall ```Constants.getMode()```: running a
non-```_SIM``` ```RobotType``` (```V2_TURNOVER```, for example) while ```RobotBase.isReal()``` is false, which is
exactly what happens launching that build in desktop simulation rather than on a roboRIO, resolves to ```REPLAY```
rather than ```SIM```. Once in that branch, ```LogFileUtil.findReplayLog()``` opens a file picker for the ```.wpilog```
to replay against, and the robot code then runs against that recorded log instead of live hardware, cycle for cycle,
exactly as described in [Level 3](#level-3-log-replay).

In practice, debugging a match issue this way looks like: notice something wrong from the log the match already
produced, add a ```Logger.recordOutput()``` call somewhere that would explain it, launch simulation with replay
selected against that same log, and read the new value straight out of the resulting ```_sim``` log, without the
physical robot ever being involved. The project's ```replayWatch``` Gradle task automates the last step of that loop,
re-running replay automatically whenever the code changes, so iterating on a new logging call doesn't require
manually re-launching replay each time.

## Viewing Logs with AdvantageScope

AdvantageScope, also from Team 6328, is the viewer built to read AdvantageKit's logs. A ```.wpilog``` file opens
either through *File > Open Log(s)...* or by dragging it onto the AdvantageScope window directly, and a live
```NT4Publisher``` stream can be connected to the same way for watching a robot in real time instead of after the
fact.

Three tabs cover most day-to-day use:

- **Line Graph**, the default view, plots numeric and boolean fields over time, dragged in from the field browser
  onto a left axis, right axis, or a discrete row for booleans and enums.
- **2D Field**, for anything geometric (a ```Pose2d```, a ```Translation2d```, an array of poses), overlays it
  directly onto a top-down map of the field, which is where a logged odometry pose or an autonomous path actually
  becomes readable.
- **Table**, for reading exact values rather than trends, lists every change to a set of selected fields as its own
  row, and stays synchronized in time with whatever's selected in every other open tab.

## Common Pitfalls

**Logging values outside ```periodic()``` inconsistently.** A value recorded from a constructor, a one-shot command,
or some other irregular callsite only appears in the log once, at whatever moment that code happened to run, rather
than as a continuous trend. Keep ```recordOutput()``` calls inside ```periodic()``` (or inside ```updateInputs()``` for
IO-layer data) so every value in the log updates on the same steady, predictable cadence as everything else.

**Inconsistent or unorganized key naming.** A log with keys scattered across ```Elevator_Height```,
```intake/roller-voltage```, and ```Shooter Wheel Speed``` is much harder to search and browse than one that commits
to a single ```/Subsystem/Value``` convention throughout, and it stops a log viewer's automatic folder grouping from
working the way it's supposed to. Pick one convention (190's is described in [Logging Custom
Values](#logging-custom-values-with-loggerrecordoutput)) and hold every new key to it.

**Relying only on live NetworkTables streaming instead of the on-disk log for postmortem debugging.** A live stream
disappears the moment the match ends and nothing was watching, while a ```.wpilog``` file on disk persists and can be
opened, replayed against, and re-examined at any point afterward. Treat the live view as something to watch *during*
a match, and the on-disk log as the actual record of what happened, since it's the only one still around once the
match is over.
