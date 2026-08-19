# 🌉 Robot Code Architecture

Every FRC robot program is built on the same skeleton: WPILib's command-based framework. FRC 190 uses that skeleton
exactly as intended, but wraps a second layer of structure around it so that several robots (two competition bots, a
practice bot, an offseason robot) can live in one repository and share as much code as possible. This page
covers both layers: the traditional command-based pieces every WPILib project has, and the "shared codebase"
architecture 190 builds on top of them.

## Traditional Command-Based Framework

A command-based robot program is really just four kinds of files working together:

| File / Concept       | Role                                                                        |
|----------------------|-----------------------------------------------------------------------------|
| ```Main.java```      | Entry point. Boots the robot program.                                       |
| ```Robot.java```     | Construction point. Owns the mode lifecycle and the ```RobotContainer```.   |
| ```RobotContainer``` | Configuration. Wires hardware, subsystems, commands, and bindings together. |
| Subsystems           | Hardware definitions. What the robot *has*.                                 |
| Commands             | Action definitions. What the robot *does*.                                  |

### Entry Point: ```Main.java```

```Main.java``` is the smallest file in the project and almost never changes:

<details>
<summary>Show code</summary>

```java
package frc.robot;

import edu.wpi.first.wpilibj.RobotBase;

public final class Main {
  private Main() {}

  public static void main(String... args) {
    RobotBase.startRobot(Robot::new);
  }
}
```

</details>

Its only job is to hand a ```Robot``` constructor reference to ```RobotBase.startRobot(...)```, which takes over from
there. See [Robot Code Lifecycle](./ROBOT_CODE_LIFECYCLE.md) for what happens once the program actually starts
running.

### Construction Point: ```Robot.java```

```Robot.java``` is where the program actually comes together. 190 extends AdvantageKit's ```LoggedRobot``` (a drop-in
replacement for WPILib's ```TimedRobot``` that also logs every input the robot receives, so a match can be replayed
later). Stripped down to its structural pieces, it looks like this:

<details>
<summary>Show code</summary>

```java
public class Robot extends LoggedRobot {
  private Command autonomousCommand;
  private RobotContainer robotContainer;

  public Robot() {
    super(Constants.LOOP_PERIOD_SECONDS);
    GompeiLib.init(Constants.getMode(), Constants.TUNING_MODE, Constants.LOOP_PERIOD_SECONDS);
  }

  @Override
  public void robotInit() {
    // Configure logging, set up the deploy directory, and pick which
    // RobotContainer to build for the robot that is currently selected.
    robotContainer = switch (RobotConfig.ROBOT) {
      case V0_FUNKY, V0_FUNKY_SIM -> new V0_FunkyRobotContainer();
      case V1_DOOMSPIRAL, V1_DOOMSPIRAL_SIM -> new V1_DoomSpiralRobotContainer();
      case V2_TURNOVER, V2_TURNOVER_SIM -> new V2_TurnoverRobotContainer();
    };
  }

  @Override
  public void robotPeriodic() {
    robotContainer.robotPeriodic();
    CommandScheduler.getInstance().run();
  }

  @Override
  public void autonomousInit() {
    autonomousCommand = robotContainer.getAutonomousCommand();
    if (autonomousCommand != null) {
      CommandScheduler.getInstance().schedule(autonomousCommand);
    }
  }

  // ...teleopInit, disabledInit, testInit, simulationInit, and their
  // periodic counterparts follow the same pattern described in the
  // Robot Code Lifecycle page.
}
```

</details>

Two things happen here that are easy to miss:

- ```robotContainer``` is declared as the generic ```RobotContainer``` interface, not a concrete class. ```Robot.java```
  never needs to know which robot it is running on. It just asks the container to do its periodic work and hands
  back an autonomous command. Which concrete container gets built is decided once, in ```robotInit()```, based on the
  currently selected robot (see [Runtime Switch](#runtime-switch) below).
- ```robotPeriodic()``` calls ```CommandScheduler.getInstance().run()```, which is what actually polls triggers,
  starts and stops commands, and runs every subsystem's ```periodic()``` method every cycle. If a subsystem's
  ```periodic()``` isn't running, this is usually why.

### Configuration: ```RobotContainer```

The stock WPILib template puts subsystem construction, button bindings, and the autonomous chooser all inside one
concrete ```RobotContainer.java``` class. 190 needs a *different* ```RobotContainer``` for each robot version, so the
shared library ([GompeiLib](./gompeilib/GOMPEILIB.md)) instead defines a small interface that every version-specific
container implements:

<details>
<summary>Show code</summary>

```java
public interface RobotContainer {
  default void robotPeriodic() {}

  default Command getAutonomousCommand() {
    return Commands.none();
  }
}
```

</details>

A class like ```V2_TurnoverRobotContainer``` implements this interface, and its constructor is where that specific
robot actually gets configured: subsystems are instantiated with the correct hardware IO implementations, controller
bindings are set up, ```NamedCommands``` are registered for PathPlanner, and the autonomous chooser is built. Every
robot version has its own container, but ```Robot.java``` only ever talks to the interface.

### Hardware Definitions: Subsystems

A subsystem represents one physical mechanism on the robot (a drivebase, a turret, an intake) and extends
```SubsystemBase```. Subsystems don't talk to motor controllers or sensors directly. They hold an IO interface
(```TurretIO```, ```GenericRollerIO```, ...) and let the concrete implementation passed in by the ```RobotContainer```
decide whether that means real hardware, a physics simulation, or a no-op stub for log replay. That separation is
covered in depth in [Hardware Abstraction](./HARDWARE_ABSTRACTION.md), and how a subsystem tracks and exposes *what
it's currently doing* is covered in [Subsystem State Management](./SUBSYSTEM_STATE_MANAGEMENT.md).

Subsystems in 190's codebase fall into two groups, which map directly onto the directory structure described below:

- **Shared subsystems** (```subsystems/shared/```) are mechanisms general enough to be reused across robot versions:
  a four-bar linkage, a generic roller, a generic flywheel. They're often composed together inside a slightly
  higher-level subsystem specific to what the mechanism is used for that year, e.g. ```Intake``` wraps a
  ```GenericRoller``` and a ```FourBarLinkage``` and exposes ```deploy()```, ```stow()```, and ```collect()``` instead
  of raw roller voltages.
- **Version-specific subsystems** (```subsystems/v2_Turnover/```, etc.) only make sense for one robot, because that
  robot is the only one with that mechanism: a clopper, a spindexer, a swank.

### Action Definitions: Commands

Commands describe *behavior*: what should happen, and for how long. Most 190 commands aren't hand-written ```Command```
subclasses. They're built by composing factory methods on subsystems with WPILib's ```Commands``` utility class
(```Commands.sequence(...)```, ```Commands.parallel(...)```, ```Commands.either(...)```). A subsystem exposes small
building-block commands (```intake.deploy()```, ```climber.setPositionGoal(...)```), and a composite command strings
several of them together into a full robot action:

<details>
<summary>Show code</summary>

```java
public static Command deployClimber(Intake intake, Climber climber) {
  return Commands.sequence(
      intake.stow(),
      Commands.parallel(
          intake.stopCollect(),
          climber.setPositionGoal(ClimberGoal.L1_POSITION_GOAL.getPosition(), GainSlot.ZERO)));
}
```

</details>

Just like subsystems, commands split into ```commands/shared/``` (works on any robot with the subsystems it needs)
and ```commands/v#_Name/``` (specific to one robot). Autonomous routines live one level deeper, under
```commands/v#_Name/autonomous/```, since an autonomous routine is built from that specific robot's trajectories and
hardware and can never be shared across versions.

## Shared Codebase Architecture

190 typically has more than one robot in flight at once, a competition bot, a practice bot, sometimes an off-season
prototype, and they don't want to maintain a separate repository (and let that code drift out of sync) for each one.
Instead, all of it lives in a single codebase, and one value decides which robot's hardware and logic is actually
active in a given build: ```RobotConfig.ROBOT```.

<details>
<summary>Show code</summary>

```java
public final class RobotConfig {
  public static final RobotType ROBOT = RobotType.V2_TURNOVER;

  public enum RobotType {
    V0_FUNKY,
    V0_FUNKY_SIM,
    V1_DOOMSPIRAL,
    V1_DOOMSPIRAL_SIM,
    V2_TURNOVER,
    V2_TURNOVER_SIM;
  }
}
```

</details>

Every place in the codebase that needs to behave differently per robot (which mode to log as, which
```RobotContainer``` to build, which IO implementations to hand each subsystem, which deploy directory to read
trajectories from) reads this same field. Changing which robot is active is a one-line change followed by a
redeploy, not a branch merge or a different repository.

### Runtime Switch

Most of the per-robot decisions are made with an ordinary ```switch``` over ```RobotConfig.ROBOT```, evaluated once
when the robot program starts up. ```Constants.getMode()``` is a good example: it turns the selected ```RobotType```
into the ```RobotMode``` (```REAL```, ```SIM```, or ```REPLAY```) that the rest of the framework, including logging,
keys off of:

<details>
<summary>Show code</summary>

```java
public static RobotMode getMode() {
  return switch (RobotConfig.ROBOT) {
    case V0_FUNKY, V1_DOOMSPIRAL, V2_TURNOVER ->
        RobotBase.isReal() ? RobotMode.REAL : RobotMode.REPLAY;
    case V0_FUNKY_SIM, V1_DOOMSPIRAL_SIM, V2_TURNOVER_SIM -> RobotMode.SIM;
  };
}
```

</details>

The same pattern repeats inside every version-specific ```RobotContainer``` constructor, but one level more granular:
each subsystem gets constructed with a different IO implementation depending on the branch:
```new SwerveModuleIOTalonFX(...)``` for a real robot, ```new SwerveModuleIOSim(...)``` for that robot's simulated
variant, and an anonymous no-op ```new SwerveModuleIO() {}``` for anything else (replay).

:::important
This switch only runs once, at startup, not every loop. Selecting a ```RobotType``` doesn't change robot behavior
mid-match; it decides, for the entire lifetime of that program run, which whole configuration of hardware IO,
subsystems, and bindings gets built. If you change ```RobotConfig.ROBOT```, you must redeploy for it to take effect.
:::

### Compile Time Checks

Because the runtime switch trusts whatever ```RobotConfig.ROBOT``` is currently set to, 190's build pipeline adds
safeguards that run *before* code ever reaches a robot, so a mismatched selection is caught while still sitting at a
keyboard instead of on the field:

- **Deploy-target verification.** A custom Gradle task, ```checkRoboRIOtoRobotType```, runs after ```compileJava``` and
  before ```deployroborio```. It reads the ```PRETTY_HOSTNAME``` comment configured on the target roboRIO over SSH and
  compares it against the compiled value of ```RobotConfig.ROBOT```. If they don't match, the Gradle build fails with
  an explicit error instead of deploying. This is what stops competition-bot code from accidentally landing on the
  practice bot's roboRIO, or vice versa.
- **Sim-mode deploy guard.** ```Constants.java``` defines its own ```main()``` that deliberately fails
  (```System.exit(1)```) if the selected ```RobotType``` resolves to ```RobotMode.SIM```:

  <details>
  <summary>Show code</summary>

  ```java
  public static void main(String... args) {
    if (getMode().equals(RobotMode.SIM)) {
      System.err.println("Cannot deploy, invalid mode selected: " + RobotConfig.ROBOT);
      System.exit(1);
    }
  }
  ```

  </details>

  This exists so a ```_SIM``` variant (meant only for desktop simulation) can never be shipped to real hardware.

Together, the runtime switch and these build-time checks form the two halves of the shared-codebase model: the switch
decides *what runs*, and the compile-time checks make sure the switch is pointed at the right thing before it ever
gets the chance to run.

### Directory Structure

The repository is split into two projects: ```lib/```, which is [GompeiLib](./gompeilib/GOMPEILIB.md), 190's shared,
hardware-agnostic library of generic subsystems, IO interfaces, and core framework pieces (```RobotContainer```,
```RobotMode```, logging utilities), and the robot project itself under ```src/main/java/frc/robot/```, which
consumes GompeiLib as a dependency. Everything in the robot project follows the same shared-vs-version-specific split
described above:

```text
src/main/java/frc/robot/
├── Main.java                 # entry point
├── Robot.java                # construction point
├── RobotConfig.java          # RobotType selection
├── Constants.java            # global constants + mode resolution
├── commands/
│   ├── shared/                    # commands usable by every robot version
│   ├── v1_DoomSpiral/
│   │   └── autonomous/            # V1-only autonomous routines
│   └── v2_Turnover/
│       └── autonomous/            # V2-only autonomous routines
├── subsystems/
│   ├── shared/                    # mechanisms reused across robot versions
│   │   ├── climber/
│   │   ├── fourbarlinkage/
│   │   ├── intake/
│   │   └── turret/
│   ├── v1_DoomSpiral/
│   │   ├── V1_DoomSpiralRobotContainer.java
│   │   ├── V1_DoomSpiralRobotState.java
│   │   ├── swank/                 # V1-only subsystem
│   │   └── spindexer/             # V1-only subsystem
│   └── v2_Turnover/
│       ├── V2_TurnoverRobotContainer.java
│       ├── V2_TurnoverRobotState.java
│       └── clopper/                # V2-only subsystem
└── util/                      # cross-cutting helpers (Alert, AllianceFlipUtil, ...)
```

A few conventions fall out of this layout:

- **Version-specific classes are name-prefixed** with the robot they belong to (```V2_TurnoverRobotContainer```,
  ```V2_TurnoverShooterConstants```) so a shared class and a version override never collide, and so it's obvious at a
  glance which layer any given file lives in.
- **Deployed assets follow the same split.** ```src/main/deploy/``` has one subdirectory per robot version (matching
  ```RobotType.name()```, lowercased and with ```_sim``` stripped), holding that robot's PathPlanner/Choreo
  trajectories and dashboard layouts. ```Robot.java``` computes which of those directories to serve from
  ```RobotConfig.ROBOT``` at startup, the same way it picks a ```RobotContainer```.
- **```RobotState``` also gets one implementation per version** (```V2_TurnoverRobotState```, etc.), holding whatever
  robot-wide state (pose, active alliance, current mechanism goals) that version's commands and subsystems need to
  read from outside the command-scheduler's normal subsystem boundaries.
