# ✅ Code Quality

Robot code has a habit of getting messy fast: fifteen students touching the same files over a six-week build season,
under deadline pressure, with a competition robot on the line. Team 190 leans on automated tooling to catch the
things a rushed human reviewer might miss, so that code review can focus on *does this make sense* instead of
*is this formatted correctly*.

## Formatting with Spotless

Every repository (```2kxx-Robot-Code```, ```GompeiLib```, and ```GompeiVision```) uses the
[Spotless](https://github.com/diffplug/spotless) Gradle plugin to enforce one consistent code style, so that
whoever wrote a file doesn't matter, it looks the same either way. Spotless is configured to:

* Format all ```.java``` files with **Google Java Format**.
* Remove unused imports automatically.
* Trim trailing whitespace.
* Ensure every file ends with a newline.
* Format ```.gradle``` files and ```.json``` files with their own consistent rules.

You almost never need to think about this. In the Gradle build, ```compileJava``` depends on ```spotlessApply```,
which means **building the project automatically reformats your code** before it compiles. If you're used to
manually lining up braces or arguing about tabs vs. spaces, you can stop, Spotless has already decided.

:::important
CI does *not* auto-format your code for you, it only checks it. Every pull request runs a ```Lint``` workflow that
executes ```./gradlew spotlessCheck```, which fails the build if anything isn't already formatted. If you see a red
X on the Lint check, run ```./gradlew build``` (or just ```./gradlew spotlessApply```) locally, commit the result,
and push again.
:::

## Automated Checks on Every Pull Request

Opening a pull request in ```2kxx-Robot-Code``` or ```GompeiLib``` triggers two GitHub Actions workflows before a
human ever looks at the code:

| Workflow | What it checks |
|----------|-----------------|
| **Build** | Does ```./gradlew build``` succeed? Does the code actually compile and pass any existing tests? |
| **Lint**  | Does ```./gradlew spotlessCheck``` pass? Is the code formatted correctly? |

Both have to pass before a PR is a reasonable candidate for merging. This isn't about bureaucracy, it's about making
sure a reviewer's time goes toward things a computer can't check: does this state machine handle every transition
correctly, does this control loop make physical sense, is this the right way to structure this subsystem.

## Testing: Library Code vs. Season Code

Team 190 draws a deliberate line between how strictly ```GompeiLib``` and ```2kxx-Robot-Code``` are tested, and it's
worth understanding *why* rather than assuming one of them is doing it "wrong."

**```GompeiLib``` is unit tested thoroughly.** Its test suite uses JUnit 5 and Mockito (```mockito-inline```, which
can mock static and final methods) to test the real and simulated I/O variants of its utilities independently, and
Jacoco reports coverage on every build. This level of rigor makes sense because ```GompeiLib``` is shared
infrastructure: a bug in a utility used across multiple subsystems and multiple seasons is a bug that quietly
breaks things everywhere it's used, possibly years after it was written. See
[Unit Testing](../robot_code/gompeilib/UNIT_TESTING.md) for what this looks like in practice.

**```2kxx-Robot-Code``` is not held to the same unit-testing bar.** Game-specific subsystem code changes constantly
throughout a six-week build season and gets thrown out entirely at the end of it, so the cost of writing and
maintaining a full unit test suite for it usually isn't worth the payoff. Instead, season code is validated through:

* **Simulation**: running mechanisms in WPILib/AdvantageKit's simulated I/O layer before ever touching real
  hardware, see [Hardware Abstraction](../robot_code/HARDWARE_ABSTRACTION.md).
* **On-robot testing**: actually driving the thing and watching what happens, often with a mentor or lead student
  present.
* **Logged data review**: using AdvantageScope to look back at what a mechanism actually did during a test run,
  see [Logging](../robot_code/LOGGING.md).
* **Code review**: a second set of eyes catching logic errors before they ever reach the field.

This isn't laziness, it's matching the amount of process to how long the code is going to live and how expensive a
bug in it would actually be.

## Code Review as a Quality Gate

Passing CI means the code compiles and is formatted. It says nothing about whether the code is *correct*. That's
what a human reviewer is for. When reviewing a teammate's pull request, look for things a computer can't check:

* Does this correctly handle the edges of a range (an elevator at its lower limit, a claw already open)?
* Is this subsystem using the [state management pattern](../robot_code/SUBSYSTEM_STATE_MANAGEMENT.md) consistently
  with how the rest of the codebase does it?
* Are units and coordinate frames consistent (see [Geometry Concepts](../robot_code/GEOMETRY_CONCEPTS.md))?
* Would this make sense to someone reading it for the first time, without the author standing next to them
  explaining it?

Leaving review comments is not an attack on the author, and receiving them is not a judgment on you as a programmer.
The entire point of having more than one person on this team is that mistakes get caught before they show up on the
field instead of during a match.
