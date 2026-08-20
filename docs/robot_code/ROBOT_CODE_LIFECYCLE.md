# 🔄 Robot Code Lifecycle

:::caution Living Documentation
APIs and control systems change season to season, and sometimes mid-season. Specific class names, file paths, and
code examples throughout this section reflect FRC 190's codebase at the time of writing and may become outdated or
obsolete as WPILib, CTRE, and other vendor libraries evolve. Treat this section as a guide to the underlying
concepts, not a guaranteed match to the current source.
:::

Just like any other program, FRC robot code has a lifecycle. There are several defined states that the software moves
through when it runs:

## Entry

The *Entry* of a robot program is the portion that tells the rest of the code to start executing. Usually, this is done
in a file called ```Main.java```, which usually looks something like this:

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

This small class's only job is to call the ```RobotBase.startRobot(...)``` method with a ```Robot``` configuration. This
is what starts all the things that our robot is defined to do. Usually there is no need to change anything about the
```Main.java``` class, as it is predefined by most of the WPILib sample projects and is standardized across all of FRC
190's robot codebases.

## Initialization

After a robot program is entered, the next step is to create all the different things needed to interface with the
robots hardware, such as motors and sensors. This is what the initialization step is for. Usually, the initialization
step occurs mostly in the ```Robot.java``` class.

<details>
<summary>Show Code</summary>

```java
package frc.robot;

import ...

public class Robot extends LoggedRobot {
  # Initialization of variables
  ...

  public Robot() {
    # Instantiation of variables
    ...
  }

  /**
   * This function is run when the robot is first started up and should be used for any
   * initialization code.
   */
  @Override
  public void robotInit() {}

  /** This function is called periodically during all modes. */
  @Override
  public void robotPeriodic() {}

  /** This function is called once when the robot is disabled. */
  @Override
  public void disabledInit() {}

  /** This function is called periodically when disabled. */
  @Override
  public void disabledPeriodic() {}

  /** This autonomous runs the autonomous command selected by your {@link RobotContainer} class. */
  @Override
  public void autonomousInit() {}

  /** This function is called periodically during autonomous. */
  @Override
  public void autonomousPeriodic() {}

  /** This function is called once when teleop is enabled. */
  @Override
  public void teleopInit() {}

  /** This function is called periodically during operator control. */
  @Override
  public void teleopPeriodic() {}

  /** This function is called once when test mode is enabled. */
  @Override
  public void testInit() {}

  /** This function is called periodically during test mode. */
  @Override
  public void testPeriodic() {}

  /** This function is called once when the robot is first started up. */
  @Override
  public void simulationInit() {}

  /** This function is called periodically whilst in simulation. */
  @Override
  public void simulationPeriodic() {}
}
```

</details>

One interesting thing you might have noticed about the ```Robot.java``` class above is that there isn't just one
initialization method or routine. This is because there are many different sub-states, or modes, that the robot code
initializes into. As you know from the game manual and the driver station, there are several different states that the
robot can be in when it is connected to the field or a practice computer:

| Mode         | Description                                                                         |
|--------------|-------------------------------------------------------------------------------------|
| Autonomous   | The robot is performing actions all on its own.                                     |
| Teleoperated | The robot is accepting input from human drivers.                                    |
| Test         | The robot accepts specific instructions so as not to pollute the teleoperated mode. |
| Simulation   | The robot accepts inputs specifically programmed to run in a simulated environment. |
| Disabled     | The robot denies all inputs from the human drivers and robot code, and sits idle.   |

Each of these modes has its own initialization method, such as ```autonomousInit()``` or ```teleopInit()```, which runs
once when that mode is selected and is used to set up anything the mode needs before it starts running.

## Execution

The execution step is the biggest step for a robot to perform, it's where all the things you want the robot to do on the
field actually get commanded.

### Execution Phases

Just like each mode has its own initialization method, it also has its own periodic method, such as
```autonomousPeriodic()``` or ```teleopPeriodic()```. Once a mode's initialization method has run, its periodic method
runs perpetually until the mode is exited, and this is where the actual behavior of the robot during a match is
commanded.

The word "periodic" is doing a lot of work here: these methods are really just the body of a loop that the robot program
is running for you behind the scenes, similar to a [```while``` loop](../java/control_flow/LOOPS.md) that never stops
iterating. Every ~20 milliseconds, whichever periodic method matches the current mode gets called once, does its work,
and returns, and the whole cycle repeats.

:::important
Because a periodic method is already one iteration of a loop, you should never write your own ```while``` loop (or any
other blocking loop) inside of one. A ```while``` loop that waits for some condition to become true will block that
single 20 millisecond iteration from ever returning, which freezes the entire robot program. No other periodic
methods will run, sensor data will stop updating, and the driver station will report the robot as unresponsive. If you
need something to happen "over time" or "until a condition is met," let the periodic method's natural, repeated calls
act as your loop instead of nesting another one inside it.
:::