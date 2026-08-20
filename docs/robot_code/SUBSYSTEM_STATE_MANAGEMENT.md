# 🌐 Subsystem State Management

:::caution Living Documentation
APIs and control systems change season to season, and sometimes mid-season. Specific class names, file paths, and
code examples throughout this section reflect FRC 190's codebase at the time of writing and may become outdated or
obsolete as WPILib, CTRE, and other vendor libraries evolve. Treat this section as a guide to the underlying
concepts, not a guaranteed match to the current source.
:::

Every subsystem needs some way for the rest of the code to tell it what to do. In 190's code that always settles into
one of two shapes, covered below as Pattern A and Pattern B. Neither one is universally correct. Picking between them
is a real design decision, and getting it wrong is exactly what the [Common Pitfalls](#common-pitfalls) section at
the bottom is about. This page assumes you're comfortable with [Action Definitions: Commands](./ROBOT_CODE_ARCHITECTURE.md#action-definitions-commands)
and the IO pattern from [Hardware Abstraction](./HARDWARE_ABSTRACTION.md), since both patterns below sit directly on
top of them.

## Two Ways to Expose Subsystem Control

### Pattern A: Factory Commands

The simplest shape a subsystem can take is to expose a set of public methods that each return a ```Command```, and
nothing else. Every one of those factory commands does exactly one thing when it's scheduled: it applies one control
request (a voltage, a position, a velocity) straight to the IO layer, and that's the whole job finished.

<details>
<summary>Show code</summary>

```java
public Command setVoltage(double voltage) {
  return Commands.runOnce(() -> arm.setVoltageGoal(Volts.of(voltage)));
}

public Command clockwiseSlow() {
  return setVoltage(-ClimberConstants.SLOW_VOLTAGE);
}

public Command counterClockwiseSlow() {
  return setVoltage(ClimberConstants.SLOW_VOLTAGE);
}
```

</details>

Notice there's no field anywhere in this subsystem tracking "what I'm currently doing." Nothing lives inside the
subsystem between one command and the next. Whatever schedules ```clockwiseSlow()``` is entirely responsible for
deciding when to stop it, what to run instead, and how those pieces sequence together, the subsystem itself has no
opinion. That's what makes this pattern the right building block for a composite command like the ```deployClimber```
example in [Action Definitions: Commands](./ROBOT_CODE_ARCHITECTURE.md#action-definitions-commands): the composite
command owns the sequencing, and each subsystem it calls into just does one small thing on request.

### Pattern B: Set-State + Periodic State Machine

The second shape looks similar from the outside, a subsystem still exposes methods that return commands, but what
those commands actually do is different: instead of applying a control request directly, they just set a desired
state, usually an [enum](../java/advanced_concepts/ENUMS.md). The subsystem's own ```periodic()``` method is what
actually reads that state every cycle and reapplies whatever control request matches it. ```Intake``` is a real
example of this:

<details>
<summary>Show code</summary>

```java
public class Intake extends SubsystemBase {
  private IntakeState intakeState;

  public Command deploy() {
    return Commands.sequence(
        Commands.runOnce(() -> {
          intakeState = IntakeState.INTAKE;
          linkage.setPositionGoal(IntakeConstants.INTAKE_STATES.get(IntakeState.INTAKE));
        }));
  }

  public Command stow() {
    return Commands.runOnce(() -> {
      intakeState = IntakeState.STOW;
      linkage.setPositionGoal(IntakeConstants.INTAKE_STATES.get(IntakeState.STOW));
    });
  }

  @Override
  public void periodic() {
    roller.periodic();
    linkage.periodic();

    switch (intakeState) {
      case STOW:
        roller.setVoltageGoal(normalVoltageSetpoint);
        if (!linkage.atPositionGoal()) roller.setVoltageGoal(Volts.of(IntakeConstants.EXTAKE_VOLTAGE));
        else roller.setVoltageGoal(Volts.of(0.0));
        break;
      case INTAKE:
        roller.setVoltageGoal(Volts.of(IntakeConstants.INTAKE_VOLTAGE));
        break;
      case AGITATE:
        roller.setVoltageGoal(Volts.of(3.0));
        break;
      default:
        break;
    }
  }
}
```

</details>

Here, ```intakeState``` is a field on the subsystem itself, and it's still whatever it was set to the last time
```deploy()```, ```stow()```, or another state-setting command ran, even many cycles later. That field, and the
```switch``` in ```periodic()``` that reads it, is exactly what makes this a state machine: the state is owned and
persisted inside the subsystem, not by whatever last called into it.

### When To Use Each Pattern

The deciding question is whether the control output needs to be recomputed every cycle, or whether it's fine to set
once and leave alone.

A [control request](./FRC_HARDWARE.md#control-requests-motors-only) sent to a TalonFX doesn't expire on its own. Once
```setControl(...)``` is called, the device keeps applying it indefinitely until a new request replaces it. That's
why Pattern A is enough for something like ```clockwiseSlow()```: the request is correct for as long as it's meant to
run, and there's nothing about it that needs to change cycle to cycle just because time passed.

Pattern B earns its extra complexity when the correct output actually depends on something that can change between
cycles, independent of whether a new command was just scheduled. Look again at ```Intake```'s ```STOW``` case: it
checks ```linkage.atPositionGoal()``` fresh, every single cycle, and picks a different roller voltage depending on
the answer. A one-shot factory command can't express that; it runs once and is done. Pattern B is also what lets
other code, like a subsystem's own ```defaultCommand()```, ask "what state is this subsystem in right now" at any
point, rather than only ever pushing new commands at it.

As a rule of thumb: reach for Pattern A when a mechanism just needs to be told what to do and then left alone.
Reach for Pattern B when a mechanism needs to keep re-deciding its own output based on conditions that can change
out from under it.

## Superstructures: Combining Multiple Subsystems into One State Machine

Pattern B works well for a single subsystem answering to its own state, but some robot behaviors need several
subsystems to move together as one coordinated unit rather than each deciding independently. An elevator, an arm, and
an intake pivot sharing the same space is the classic case: if the elevator drops while the arm is still swung out,
the arm can collide with the frame on the way down. No single subsystem's own state machine has enough information to
prevent that, because none of them knows what the other two are doing.

A **superstructure** is a state machine that sits one level above the individual subsystems and solves exactly this.
There's more than one way to build one, and which way fits depends on how large and how tangled the coordination
problem actually is.

### Extending Pattern B Across Subsystems

The lightest version of a superstructure isn't a new concept at all, it's Pattern B, moved up one level. Instead of
one enum living inside one subsystem, one enum lives inside a small coordinating subsystem that owns references to
the two or three subsystems it's coordinating, and its ```periodic()``` decides what to command each of them every
cycle, the same way ```Intake```'s ```periodic()``` decides what to command its roller.

The piece that does the actual collision avoidance is an interlock: before commanding one subsystem's goal, check
whether another subsystem has actually reached the position that makes it safe to do so.

<details>
<summary>Show code</summary>

```java
public class Superstructure extends SubsystemBase {
  private SuperstructureGoal goal;

  @Override
  public void periodic() {
    switch (goal) {
      case STOW:
        // the arm has to clear the frame before the elevator is allowed to retract
        arm.setGoal(ArmGoal.STOW);
        if (arm.atGoal()) {
          elevator.setGoal(ElevatorGoal.STOW);
        }
        break;
      case L4:
        // the elevator has to be raised before the arm is allowed to extend
        elevator.setGoal(ElevatorGoal.L4);
        if (elevator.atGoal()) {
          arm.setGoal(ArmGoal.L4);
        }
        break;
    }
  }
}
```

</details>

Nothing here is a new pattern, ```goal``` is still a field the subsystem owns and persists, and ```periodic()``` still
reapplies it every cycle. The only thing that changed is what's being reapplied: instead of one control request,
it's a coordinated pair of goals across two child subsystems, and the ```if (arm.atGoal())```/```if
(elevator.atGoal())``` checks are doing, by hand, exactly the job a graph edge's guard does further down this page,
"don't let this transition happen until it's actually safe."

This scales to a handful of subsystems and a handful of named goals without much trouble. It stops scaling the moment
the safe ordering between states isn't a simple, fixed rule you can express as one or two ```if``` checks, which is
exactly the problem the graph-based model below is built to solve.

### Graph-Based Superstructures

Once the coordination problem grows past a couple of interlocks, hand-writing every case inside one big
```periodic()``` switch stops being manageable. A robot with a dozen or more named configurations, where the safe
route from one state to another genuinely depends on *which* state you're coming from (going from ```STOW_DOWN``` to
```L4``` might need a different intermediate pose than going from ```GROUND_INTAKE``` to ```L4```, even though both
end at the same place), needs something closer to an actual pathfinding problem than a chain of ```if``` statements.
190's larger superstructures solve that by turning the state machine itself into a graph.

Its states aren't hardware states at all, they're named, robot-level configurations (```STOW_DOWN```, ```L4```,
```BARGE_SCORE```), and each one bundles together the pose every underlying subsystem should be at, plus any roller
actions that should run once it's reached:

<details>
<summary>Show code</summary>

```java
public enum SuperstructureStates {
  STOW_DOWN(
      "STOW_DOWN",
      new SubsystemPoses(ReefState.STOW, ManipulatorArmState.VERTICAL_UP, IntakePivotState.STOW),
      SubsystemActions.empty()),
  L4_SCORE(
      "L4_SCORE",
      new SubsystemPoses(ReefState.L4, ManipulatorArmState.SCORE_L4, IntakePivotState.HANDOFF),
      new SubsystemActions(ManipulatorRollerState.L4_SCORE, IntakeRollerState.STOP));

  private final SuperstructurePose pose;
  private final SuperstructureAction action;
}
```

</details>

The part that keeps a superstructure from just teleporting between poses is a **graph**: states are nodes, and a
directed edge between two states means that direct transition is physically safe. 190's superstructures build this
graph with [JGraphT](https://jgrapht.org/), loaded from a plain text ```.dot``` file describing which transitions are
legal:

<details>
<summary>Show code</summary>

```text
START -> STOW_DOWN [type=UNCONSTRAINED]

STOW_DOWN -> FLIP_DOWN [type=UNCONSTRAINED]
STOW_DOWN -> L2 [type=UNCONSTRAINED]
STOW_DOWN -> L3 [type=UNCONSTRAINED]
STOW_DOWN -> L4 [type=UNCONSTRAINED]
STOW_DOWN -> STOW_UP [type=UNCONSTRAINED]
```

</details>

Every edge also carries a **command**, generated once when the graph is built, that moves every subsystem from the
source state's pose to the target state's pose. To get from a state that isn't directly reachable in one hop, the
superstructure runs a breadth-first search over the graph to find a legal path, then schedules that path's edges one
at a time, only advancing to the next edge once the current one finishes, rather than ever jumping straight to a
distant goal state:

<details>
<summary>Show code</summary>

```java
private void setGoal(SuperstructureStates goal) {
  targetState = goal;
  bfs(currentState, targetState)
      .ifPresent(next -> {
        nextState = next;
        edgeCommand = graph.getEdge(currentState, next);
        edgeCommand.getCommand().schedule();
      });
}
```

</details>

Edges can also carry a **guard**: a condition, checked at pathfinding time, that makes an edge legal or illegal
depending on live robot state rather than always. The ```type``` attribute on each edge above is exactly that, an
edge tagged ```NO_ALGAE``` is filtered out of the search entirely whenever the robot is currently holding a game
piece that would make that transition unsafe, forcing the search to route around it through a different path instead.
Notice this is the same guard concept from the interlocked ```if``` checks above, only now it's data the pathfinder
reads instead of logic that has to be re-derived by hand for every pair of states.

### Which One To Reach For

Both are the same underlying idea: don't let one part of the robot move until it's safe, given what the rest of the
robot is currently doing. The difference is only where that safety rule lives. A couple of subsystems and a couple of
interlocks read clearly as a handful of ```if``` statements inside one ```periodic()```, extending Pattern B is
enough, and it avoids building out graph machinery for a problem that doesn't need it. Once the state count grows
large, once the safe route genuinely depends on where the superstructure is coming from rather than just where it's
going, or once legality itself has to change at runtime, the graph earns its complexity: it turns a set of rules that
would otherwise have to be re-derived and re-checked by hand into data the pathfinder can search and reroute through
automatically.

:::note
190's 2025 season code (```2k25-Robot-Code```, under
```subsystems/v3_Poot/superstructure/```) is the canonical real example of this pattern:
```V3_PootSuperstructureStates``` defines the nodes and their poses, ```V3_PootSuperstructureEdges``` loads the graph
from a ```.dot``` file and builds each edge's command, and ```V3_PootSuperstructure``` owns the current/next/target
state fields and runs the breadth-first search described above.
:::

## Common Pitfalls

**Mixing Pattern A and Pattern B in the same subsystem without a clear reason.** If some of a subsystem's methods
apply a control request directly while others set a field that ```periodic()``` reapplies every cycle, the two can
fight each other: a direct command's control request only lasts until the next ```periodic()``` tick, where the
state machine silently overwrites it with whatever the last remembered state was. Pick one pattern per subsystem, and
only cross that line deliberately (an explicit "override" state, for example, not an accidental one).

**Missing, unreachable, or unexitable states in a graph-based transition table.** A hand-maintained ```.dot``` file is
easy to get subtly wrong. A state with no outgoing edges is a trap, once the superstructure enters it, there is no
legal transition out, no matter what goal gets requested next. A state with no incoming edges is dead code, nothing
in the graph can ever command the superstructure into it. Both are silent failures: the breadth-first search just
returns nothing found and the superstructure sits still, with no obvious error pointing at the missing edge.

**Applying hardware commands outside of ```periodic()```.** Whether a subsystem follows Pattern A or Pattern B, its
control requests should only ever be issued from inside a command that the subsystem itself scheduled, or from its
own ```periodic()```. Reaching into an IO layer directly from some unrelated callback bypasses the state machine
entirely (Pattern B's ```periodic()``` has no idea the hardware just received a command it didn't send) and defeats
the command scheduler's subsystem-requirement guarantees, which exist specifically to stop two different commands
from fighting over the same hardware in the same cycle.
