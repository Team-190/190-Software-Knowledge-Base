# Comparing Motion Profile Shapes

| Shape | Acceleration | Jerk | Move time | Typical FRC use |
|---|---|---|---|---|
| No profile (raw setpoint) | Whatever the PID loop's gains produce | Unbounded | Fastest, at the cost of overshoot and jerkiness | Rarely, only when a rough, fast snap to target is acceptable |
| [Trapezoidal](./TRAPEZOIDAL.md) | Fixed levels, jumps instantly between them | Unbounded at each transition | Fast | Most position and velocity moves, drivetrain trajectories, arms, elevators |
| [S-Curve](./S_CURVE.md) | Ramps smoothly to fixed levels | Bounded | Slightly slower than trapezoidal | Mechanisms carrying fragile or loosely-held game pieces, moves people will physically feel |

## Choosing a Shape

A trapezoidal profile is the right default for most mechanisms, it's simpler to reason about, cheaper to compute,
and removes the worst problems (overshoot, unpredictable timing) that come from commanding a raw, unprofiled
setpoint. Reach for an S-curve specifically when the *jerk* at a trapezoidal profile's sharp corners causes a real
problem, a game piece that shifts or falls out at the start or end of a move, a mechanism that visibly shudders,
or a chain and gearbox combination taking more wear than expected.

## Where This Leads

Motion profiling is the last piece of a chain that's run through this entire section so far:
[Open Loop Control](../open_loop_control/OPEN_LOOP_CONTROL.md) covered predicting the voltage a mechanism needs,
[Closed Loop Control](../closed_loop_control/CLOSED_LOOP_CONTROL.md) covered correcting that prediction against a
measurement, and motion profiling covers *what* that measurement should be chasing, moment to moment, instead of
all at once. Every layer exists because the one before it had a limitation.

None of that chain has needed to know exactly *how* a motor turns a voltage or a current setpoint into a push, just
that it does. [Motors and Commutation](../motors/MOTORS.md) is up next, and grounds all of it out: where torque
actually comes from, and why $k_V$ and $k_A$ in a feedforward model are the same constants a motor's own circuit
equation predicts.

For how the roboRIO actually gets a profile's setpoints, a PID correction, and a feedforward voltage out to a motor
controller in the first place, see the [Hardware Communication](../hardware_communication/HARDWARE_COMMUNICATION.md)
addendum, at the very end of this section.
