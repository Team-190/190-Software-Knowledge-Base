# 📝 Contributing Guidelines

[Git Standards](GIT_STANDARDS.md), [Code Quality](CODE_QUALITY.md), and [Team Development](TEAM_DEVELOPMENT.md)
cover *why* the team works the way it does. This page is the practical checklist for actually making your first
change: getting access, setting up your machine, and shipping a pull request that a reviewer can say yes to.

## Getting Access

Before you can contribute, you need to actually be able to see the code:

1. Ask a mentor to add your GitHub account to the ```Team-190``` GitHub organization.
2. Confirm you can see and clone ```2kxx-Robot-Code```, ```GompeiLib```, and (if you're working on vision)
   ```GompeiVision```.
3. If you're picking up this knowledge base itself, you'll want access to it too, it's a normal repository like
   any other.

If you can't see a repository you think you should have access to, ask, don't wait. Access issues are usually a
five-minute fix for a mentor and a multi-day blocker if you sit on it.

## Setting Up Your Environment

Robot code is built with [GradleRIO](../hardware_context/HARDWARE_CONTEXT.md) inside the
[WPILib VS Code](../java/JAVA_INTRODUCTION.md) extension, so your setup should match what the rest of the team uses:

1. Install the current season's WPILib toolchain (it bundles its own VS Code, JDK, and Gradle, so you don't need to
   install Java separately).
2. Clone the repository you're working in through the WPILib VS Code extension or plain ```git clone```.
3. Open it in WPILib VS Code and let Gradle finish its first sync, this can take a while the first time as it
   downloads vendor dependencies (WPILib, AdvantageKit, Phoenix 6, PathPlanner, etc.).
4. Run a build (```./gradlew build```) before you change a single line, so you know a failure later is something
   *you* introduced and not a broken starting point.

If you're contributing to ```GompeiLib``` specifically, also read
[Library Integration](../robot_code/gompeilib/LIBRARY_INTEGRATION.md), since it's consumed by the season repo as a
local Gradle subproject and building it in isolation works a little differently.

## Finding Something to Work On

Don't guess at what the team needs, and don't go looking for work on your own either, your Task Manager should
already have an issue with your name on it. If you don't have a Task Manager yet, or you're not sure whose
subsystem or area you'd be stepping into, ask a mentor before you start writing code. This avoids two common
failure modes: duplicating work someone else already started, and spending a week building something that doesn't
actually fit into the robot's current design. A five-minute conversation up front is cheaper than a pull request
nobody can merge.

## Making a Change

1. **Branch off whatever your work actually builds on.** Most of the time that's the feature branch your work
   belongs to, with your own branch following the ```<feature>/<subfeature>/...``` naming convention, see
   [Feature and Subfeature Branch Naming](GIT_STANDARDS.md#feature-and-subfeature-branch-naming) for how that's
   named; an event or fix/testing branch instead comes straight off ```development```, see
   [Topic Branches](GIT_STANDARDS.md#topic-branches). ```development``` is where the season's work lives day to
   day; ```main``` is only touched right before an event, see
   [Git Standards](GIT_STANDARDS.md#two-long-lived-branches-main-and-development).
2. **Write the change.** Follow the patterns already established in the codebase, see
   [Subsystem State Management](../robot_code/SUBSYSTEM_STATE_MANAGEMENT.md) and
   [Hardware Abstraction](../robot_code/HARDWARE_ABSTRACTION.md) for how subsystems in this codebase are expected
   to be structured. If you're not sure whether your approach fits, ask before you've written five hundred lines
   of it.
3. **Build locally** and let Spotless auto-format your code (```./gradlew build``` runs ```spotlessApply``` for
   you, see [Code Quality](CODE_QUALITY.md)).
4. **Test it**, in simulation first if the change touches hardware, and on the real robot with a mentor or lead
   present before it goes anywhere near a competition.
5. **Commit** in focused, clearly-described chunks, not one giant commit at the end.

## Opening the Pull Request

* Push your branch and open a PR against whatever it branched off of, that's not always ```development```, a
  subfeature branch's PR targets its feature branch first, see
  [Feature and Subfeature Branch Naming](GIT_STANDARDS.md#feature-and-subfeature-branch-naming). Then request
  review from whoever owns that branch.
* Title it with the same tag as the issue it closes, ```[Tag] Title```, see
  [Issue and Pull Request Title Prefixes](GIT_STANDARDS.md#issue-and-pull-request-title-prefixes).
* If it's not finished yet, open it as a **draft** so you're not triggering CI or requesting review prematurely.
* Write a description that tells a reviewer *what* changed and *why*, not just "updates". If the change is hard to
  explain in a sentence, that's often a sign it should have been two smaller PRs instead of one.
* Mark it "Ready for review" once the Build and Lint checks are passing and you'd actually stand behind the code.

From there, a reviewer will read through it, per [Team Development](TEAM_DEVELOPMENT.md#code-review-is-a-teaching-tool-not-just-a-gate).
Expect comments, respond to them, and don't take a requested change personally, it's the process working as
intended.

## What a Review Meeting Actually Looks Like

Not every review happens as GitHub comments, sometimes it's faster (and more useful, since it lets a reviewer ask
follow-up questions in real time) to sit down together and go through a PR out loud. The conversations below are
what that actually sounds like, each pulled from a different corner of the codebase, because the questions worth
asking depend a lot on what the code is actually doing. The last one isn't a normal PR review either, it's a lead
student bringing a first draft of something bigger, the high-level structure other subsystems are about to be
built on top of, to a mentor to sanity-check before it goes any further.

### A New Subsystem: Hardware Abstraction and Honest Uncertainty

Rishi, a junior, opens a PR titled ```Add Arm subsystem``` against ```2kxx-Robot-Code```. It wraps GompeiLib's
underlying arm mechanism (see [GompeiLib](../robot_code/gompeilib/GOMPEILIB.md)):

<details>
<summary>Show code</summary>

```java
public class Arm extends SubsystemBase {
  private final edu.wpi.team190.gompeilib.subsystems.arm.Arm mechanism;
  private Rotation2d goal;

  public Arm(ArmIO io) {
    setName("Arm");
    mechanism = new edu.wpi.team190.gompeilib.subsystems.arm.Arm(io, this, 1, ArmConstants.ARM_CONSTANTS);
    goal = Rotation2d.kZero;
  }

  @Override
  public void periodic() {
    mechanism.periodic();
    Logger.recordOutput(getName() + "/Goal", goal);
    Logger.recordOutput(getName() + "/At Goal", atGoal());
  }

  public Command setPositionGoal(Rotation2d positionGoal) {
    return this.runOnce(
            () -> {
              goal = positionGoal;
              mechanism.setGainSlot(GainSlot.ONE);
            })
        .andThen(Commands.runOnce(() -> mechanism.setPositionGoal(positionGoal)), mechanism.waitUntilAtGoal())
        .andThen(stop());
  }

  public boolean atGoal() {
    return Math.abs(mechanism.getArmPosition().getRadians() - goal.getRadians())
        < ArmConstants.CONSTRAINTS.goalTolerance().get(Radians);
  }

  public Command stop() {
    return mechanism.setVoltage(Volts.of(0));
  }
}
```

</details>

Anshu, the lead student who owns the arm-based mechanisms this season, pulls Rishi aside to go through it together:

<details>
<summary>Show conversation</summary>

> **Anshu:** Why does the ```Arm``` subsystem wrap GompeiLib's arm mechanism instead of talking to the motor
> directly?
>
> **Rishi:** GompeiLib's mechanism already handles the profiled PID controller and the real/sim ```ArmIO``` split,
> so I don't have to reimplement that. I just pass in the ```ArmIO``` this arm actually uses and the constants for
> this mechanism.
>
> **Anshu:** Makes sense, that's [Hardware Abstraction](../robot_code/HARDWARE_ABSTRACTION.md) doing its job, this
> class shouldn't know or care whether ```io``` is a real Kraken or a simulated one. Different question,
> ```setPositionGoal``` stores ```goal``` in a field before it ever tells the mechanism to move. Why not just call
> ```mechanism.setPositionGoal(...)``` directly?
>
> **Rishi:** ```atGoal()``` needs something to compare the current position against. If I don't store the goal
> somewhere, ```periodic()``` and anything else that checks ```atGoal()``` has no idea what "the goal" even is once
> the command that set it has finished running.
>
> **Anshu:** Right, that's why it lives on the subsystem instead of inside the command. Now, ```GainSlot.ONE``` is
> hardcoded, what's the reasoning there?
>
> **Rishi:** Honestly, I copied that line from ```Climber``` and didn't dig into it much. I know ```GainSlot``` picks
> which set of PID gains the Talon uses, but I haven't checked whether this mechanism actually needs more than one.
>
> **Anshu:** That's worth checking before this merges, not after. If it turns out one gain profile really is all
> this mechanism needs, would leaving it hardcoded and confirming that with whoever's tuning it be enough for you,
> or is there something worth writing down so the next person doesn't wonder the same thing you're wondering right
> now?
>
> **Rishi:** I'll check with them today, and if one slot really is enough, I'll drop a one-line comment on it
> explaining why, so nobody has to trace it back to a copy-paste again.
>
> **Anshu:** ```atGoal()``` compares against ```ArmConstants.CONSTRAINTS.goalTolerance()```. Did you pick that
> number, or did it come from somewhere else too?
>
> **Rishi:** Same thing, I matched what ```Climber``` uses, half a degree. I haven't tuned it against this arm's
> actual range of motion yet.
>
> **Anshu:** Would knowing that change how I read the rest of this PR? Where would that be worth saying out loud
> so it's not just something you and I know? Also, did you run it in simulation before opening the PR?
>
> **Rishi:** Fair, I'll put "tolerance is a placeholder, not tuned" in the PR description. And yeah, I drove it to
> a few goal positions and watched ```Goal``` and ```At Goal``` in AdvantageScope, it settles and flips true when
> it gets close.
>
> **Anshu:** Logging both of those every cycle instead of only when they change is the right call, it's what makes
> "it never reached the goal on the field" debuggable after the fact instead of a mystery. Does that cover
> everything you'd want in place before this merges?
>
> **Rishi:** I think so, the gain slot comment and the tolerance note in the description are the two things I still
> owe this PR. I'll add both before marking it ready.

</details>

Nothing here was about proving Rishi wrong. Anshu asked Rishi to explain each decision, and the two places Rishi
couldn't, the gain slot and the tolerance, weren't bugs, they were unverified assumptions copied from another
subsystem. Naming that honestly in the PR description was enough, nobody had to pretend the arm was fully tuned to
get this merged.

### The RoboRIO Identity Check: A Migration to SystemCore

```2kxx-Robot-Code```'s ```build.gradle``` has a task called ```checkRoboRIOtoRobotType``` that runs before every
deploy: it connects to the robot controller, reads an identifier off the physical hardware, and compares it
against the ```ROBOT``` value declared in ```RobotConfig``` in the code that's about to be deployed. If they don't
match, the deploy fails instead of going through, since [team 190 usually has more than one physical
robot](../hardware_context/robot_controller/SYSTEMCORE.mdx) running at once and deploying code built for one
robot's wiring onto a different one is exactly the kind of mistake this exists to catch. With the team moving from
the roboRIO to the new SystemCore controller this season, Ananth, a junior, opens a PR titled ```Match robots by
serial number for SystemCore``` that changes what identity the check actually compares:

<details>
<summary>Show diff</summary>

```diff
// RobotConfig.java
 enum RobotType {
-  COMPETITION,
-  PRACTICE
+  COMPETITION("0x0F3A2C19"),
+  PRACTICE("0x0F3A17B4");
+
+  final String serial;
+
+  RobotType(String serial) {
+    this.serial = serial;
+  }
 }
```

```diff
// build.gradle, inside checkRoboRIOtoRobotType
-        if (ROBORIO_COMMENT.equalsIgnoreCase(robotEnumValue.name())) {
-            println "The roboRIO name matches the ROBOT value in Constants.java!"
+        if (CONTROLLER_SERIAL.equalsIgnoreCase(robotEnumValue.serial)) {
+            println "The controller's serial number matches the ROBOT value in RobotConfig.java!"
         } else {
-            throw new GradleException("Mismatch! ...")
+            throw new GradleException("Mismatch! Controller serial '${CONTROLLER_SERIAL}' does not match the "
+                    + "expected serial '${robotEnumValue.serial}' for ROBOT value '${robotEnumValue.name()}'")
         }
```

</details>

Katie, a mentor, is reviewing it with Ananth:

<details>
<summary>Show conversation</summary>

> **Katie:** What prompted this one?
>
> **Ananth:** SystemCore doesn't seem to have the same settable "comment" field the roboRIO's webserver gave us
> for ```/etc/machine-info```, but every controller has a fixed hardware serial number, so I switched the check to
> compare against that instead. I put the expected serial for each robot right on the ```RobotType``` enum in
> ```RobotConfig.java```, next to everything else that describes each robot.
>
> **Katie:** If the comment field really isn't there on the new hardware, that's a reasonable adjustment to have to
> make. Walk me through what happens the day a competition controller dies mid-event and the spare goes in.
>
> **Ananth:** The spare's serial number wouldn't match whatever's hardcoded for ```COMPETITION```, so I'd just
> update that one line in ```RobotConfig.java``` and redeploy. That's not actually a problem for us, we're always
> on an event branch while we're at a competition anyway, so the pit crew programmer editing a file and pushing
> out a new deploy mid-event is just the normal workflow, same as any other last-minute fix.
>
> **Katie:** Fair, that's a real difference from a lot of teams, and it means the "swapping hardware requires a
> code change" problem I was picturing isn't actually a problem here. Let me ask something else, then. Say the
> pit crew programmer's mid-match-cycle, grabs the wrong driver station laptop, and tries to deploy competition
> code to the practice bot by mistake. What do they actually see when this check fails?
>
> **Ananth:** The ```GradleException``` message, controller serial and expected serial, both as hex strings.
>
> **Katie:** With the old comment-based check, that message said something like "roboRIO comment 'PRACTICE' does
> not match ROBOT value 'COMPETITION'," which tells you exactly what happened in about a second. What does
> ```Mismatch! Controller serial '0x0F3A17B4' does not match the expected serial '0x0F3A2C19'``` tell the pit crew
> programmer, with maybe ninety seconds before the next match?
>
> **Ananth:** ...nothing, really. They'd have to know both serials by memory or go look them up to figure out
> which robot they're actually holding.
>
> **Katie:** That's the thing I'd actually want fixed here, not the design, the message. The serial number's the
> right thing to check against, it can't be mistyped the way a comment can, but the person reading the failure at
> an event still needs a name, not a hex string, to act on it fast.
>
> **Ananth:** I could look up which ```RobotType``` the actual controller's serial matches, if any, and put both
> names in the message, something like "connected controller matches PRACTICE, but this build expects
> COMPETITION." That's the same information the old message gave, just derived from the serial instead of trusting
> a comment somebody typed.
>
> **Katie:** That sounds like it keeps everything you wanted from switching to a serial number and gets the
> diagnostic value back too. Does that feel like enough to update before this is good to go?
>
> **Ananth:** Yeah, I'll rewrite the message before I mark it ready.

</details>

Katie's first instinct, that hardcoding a serial number in ```RobotConfig.java``` creates a costly recovery path,
turned out to be ok for this team specifically, event branches and the pit crew programmer's ability to push a
fix mid-competition already make that a non-issue. The actual problem only showed up one question later: a serial
number is exactly the right thing to check against, but ```0x0F3A17B4``` doesn't mean anything to a person
standing in the pit with a timer running, the way ```PRACTICE``` did. A review conversation isn't just the
reviewer finding what's wrong, sometimes it's the developer correcting an assumption the reviewer walked in with,
and both of those happened here before landing on the actual fix.

### A Structural Review: Rethinking the Superstructure

Jasmine, the lead student who owns how the elevator and arm work together this season, writes a first pass at
coordinating them and brings it to Kevin, a mentor, not for a merge decision, but to sanity-check the shape of it
before anything else starts depending on it:

<details>
<summary>Show code</summary>

```java
public class Superstructure extends SubsystemBase {
  private final Elevator elevator;
  private final Arm arm;

  private SuperstructureState goal = SuperstructureState.STOW;

  public Superstructure(Elevator elevator, Arm arm) {
    this.elevator = elevator;
    this.arm = arm;
  }

  public void requestState(SuperstructureState requested) {
    goal = requested;
  }

  @Override
  public void periodic() {
    switch (goal) {
      case STOW -> {
        elevator.setGoal(ElevatorConstants.STOW_HEIGHT);
        arm.setGoal(ArmConstants.STOW_ANGLE);
      }
      case L4_PREP -> elevator.setGoal(ElevatorConstants.L4_HEIGHT);
      case L4_SCORE -> {
        if (elevator.atGoal()) {
          arm.setGoal(ArmConstants.L4_SCORE_ANGLE);
        }
      }
      case CLIMB_PREP -> elevator.setGoal(ElevatorConstants.CLIMB_HEIGHT);
      case CLIMB -> {
        if (elevator.atGoal()) {
          arm.setGoal(ArmConstants.CLIMB_ANGLE);
        }
      }
    }
  }
}
```

</details>

Kevin reads through it with Jasmine:

<details>
<summary>Show conversation</summary>

> **Kevin:** Walk me through what happens if something calls ```requestState(L4_SCORE)``` while the robot's
> sitting in ```STOW```.
>
> **Jasmine:** ```goal``` becomes ```L4_SCORE```, so the next ```periodic()``` hits that case, and... hang on.
> ```elevator.atGoal()``` is false, because nothing ever told the elevator to go up, that only happens in
> ```L4_PREP```, and we never went through it.
>
> **Kevin:** Right, so what does the robot actually do?
>
> **Jasmine:** Nothing. The elevator just sits at stow height forever, ```atGoal()``` never flips true, the arm
> never gets commanded, we're stuck in ```L4_SCORE``` doing nothing.
>
> **Kevin:** So every case here knows what the *final* position for that state should look like. Does anything
> know how to get from wherever the robot currently is to the state that was requested?
>
> **Jasmine:** ...no. There's no notion of "current state" at all, only ```goal```. Each case just assumes we
> already arrived from wherever we're supposed to have come from.
>
> **Kevin:** Right, and that's the piece I'd want to change before anything else starts calling into this. What
> would it take to actually track where the robot currently is, not just where it's headed?
>
> **Jasmine:** Add a ```current``` field next to ```goal```, and instead of switching straight on ```goal```, walk
> from ```current``` toward ```goal``` one legal step at a time, only advancing ```current``` once each
> intermediate state's actually been reached.
>
> **Kevin:** That's the right shape. "One legal step at a time" means something else needs to exist too, some
> notion of which states are actually adjacent to which. Where does that live right now?
>
> **Jasmine:** Nowhere, really. The case order just kind of implies it, ```STOW``` before ```L4_PREP``` before
> ```L4_SCORE```, but that's not written down anywhere, it's just how I happened to order the switch.
>
> **Kevin:** Which is exactly why it broke the moment something skipped straight to the last case. What if that
> ordering lived somewhere explicit instead, [same idea as a superstructure
> graph](../robot_code/SUBSYSTEM_STATE_MANAGEMENT.md), which states connect to which, kept separate from what each
> state commands? What would ```periodic()``` need to do differently if it could look up the next hop from
> ```current``` toward ```goal``` in something like that, instead of falling straight into whatever case matches
> ```goal```?
>
> **Jasmine:** It'd pull the adjacency out into its own table and walk it hop by hop instead of switching straight
> on ```goal```. That fixes something else I hadn't thought about too, if I add a fifth state later, I only add it
> to the table and give it a case, I don't have to re-audit every existing case to make sure nothing else can skip
> over it.
>
> **Kevin:** That's the sign this is actually the right restructuring and not just reorganizing for its own sake.
> Does reworking it with ```current```/```goal``` and an explicit adjacency table feel like enough before anything
> else starts depending on the shape of this class?
>
> **Jasmine:** Yeah, I'll rewrite it that way and have a new version by Thursday.

</details>

The first draft wasn't wrong about what each state should look like, ```L4_SCORE``` really does mean "elevator up,
arm rotated out." What it was missing was any idea of a *current* state at all, which meant it could only ever
jump straight to wherever it was told and had no way to walk there safely. That's a change worth making while
```Superstructure``` is one file with one author, not after three other subsystems have started calling into it.

## Getting Help

If you're stuck, ask. In order of who's likely to unblock you fastest:

1. Whoever owns the feature or subsystem you're working in.
2. A mentor, especially for anything architectural or safety-related.
3. This knowledge base, for anything that's a gap in your own understanding rather than a question about a specific
   decision someone else made.

Sitting silently on a blocker for days doesn't make you look more capable, it just means the problem takes longer
to fix.

## Before You Start Typing

One more thing worth knowing before you open an editor: the team has a policy on how, when, and where AI coding
tools are and aren't appropriate to use on this codebase. Read [AI Policy](AI_POLICY.md) before your first
contribution, not after you've already leaned on one.
