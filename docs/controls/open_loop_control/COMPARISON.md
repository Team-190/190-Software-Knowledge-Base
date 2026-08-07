# Comparing Open Loop Methods

| Method | What's commanded | Consistent across battery voltage? | Knows the "correct" value? | Typical FRC use |
|---|---|---|---|---|
| [Percent Output](./PERCENT_OUTPUT.md) | A fraction of whatever voltage is currently available | No | No | Driver-controlled joystick input |
| [Voltage Control](./VOLTAGE_CONTROL.md) | An exact number of volts | Yes | No | Anything needing repeatable behavior run to run |
| [Feedforward](./FEEDFORWARD.md) | A predicted voltage, computed from a desired velocity and acceleration | Yes | Approximately, if the model is accurate | Flywheels, drivetrain velocity control, arms and elevators |

Each row trades away a little more guesswork than the one before it, but none of them ever *check* whether the
result actually matched what was wanted; that's the one thing every open loop method, no matter how good its
prediction, structurally cannot do.

## When Open Loop Is Enough

Open loop control isn't a stepping stone to something better in every case, it's the right permanent choice
whenever a mechanism's behavior is predictable enough that a good model beats the cost and complexity of measuring
and correcting. A drivetrain under direct human control barely needs anything more than percent output, since the
driver *is* the feedback loop, watching the robot and adjusting the joystick in real time.

## Where It Falls Short

Open loop struggles the moment a mechanism's behavior stops being predictable: a chain that's stretched slightly, a
game piece adding unmodeled weight to an arm, a wheel slipping on carpet, a battery sagging further than expected.
None of that is visible to an open loop system, since nothing is ever measured after the command goes out. Fixing
that requires exactly what open loop control leaves out: a sensor, and a way to react to what it reports, which is
the whole subject of [Closed Loop Control](../closed_loop_control/CLOSED_LOOP_CONTROL.md).
