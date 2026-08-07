import useBaseUrl from '@docusaurus/useBaseUrl';

# Feedforward Models

[Voltage control](./VOLTAGE_CONTROL.md) makes commanding a motor *consistent*, the same voltage produces the same
result every time, but it doesn't answer the actual question: which voltage produces the speed or acceleration
that's actually wanted? A **feedforward model** answers that question directly, by predicting, ahead of time, the
exact voltage a specific mechanism needs to do what's being asked of it. It's still open loop, nothing is measured
or corrected after the fact, the whole idea is that the prediction is good enough not to need correcting.

## Three Things That Eat Voltage

Every DC motor mechanism (brushed or brushless, doesn't matter) fights the same three physical effects, and a
feedforward model is just a name for adding up how much voltage each one costs:

<img
src={useBaseUrl("img/images/open_loop_control/feedforward-stack.svg")}
alt="A predicted voltage built by stacking three terms: kS to overcome static friction, kV times velocity to hold a cruise speed, and kA times acceleration to speed up or slow down"
width="560"
/>

$$
V = k_S \cdot \text{sgn}(v) + k_V \cdot v + k_A \cdot a
$$

- **$k_S$, static friction.** Any real mechanism has some resistance, in bearings, gears, chains, that has to be
  overcome before it moves *at all*. $\text{sgn}(v)$ just means this term always pushes in whichever direction the
  mechanism is trying to move (or is currently moving), since friction always opposes motion.
- **$k_V$, velocity.** Holding *any* constant speed takes a constant voltage, partly to overcome friction that
  grows with speed, and partly because a spinning motor generates a voltage of its own that pushes back against
  whatever voltage is driving it, so a higher target speed needs a higher applied voltage just to stay ahead of
  that push. [Motors and Commutation](../motors/MOTORS.md) covers this effect, called back-EMF, in depth, and shows
  that $k_V$ is really that same effect, just measured at the mechanism (through whatever gearing sits between the
  motor and the output) instead of at the bare motor shaft.
- **$k_A$, acceleration.** Changing speed, not just holding one, means overcoming inertia, and a heavier or more
  inertia-laden mechanism needs more force, and so more voltage, to hit the same acceleration as a lighter one.
  [Motors and Commutation](../motors/MOTORS.md) covers exactly how a motor turns voltage into that force in the
  first place.

Add all three together, and the result is a prediction of exactly how many volts to send for a desired velocity $v$
and acceleration $a$, computed before the motor ever turns.

## Where the Constants Come From

$k_S$, $k_V$, and $k_A$ are different for every mechanism, they depend on gearing, weight, friction, and the motor
itself, so they can't be looked up, they have to be measured. WPILib's SysId tool does this by commanding a
mechanism through a series of controlled tests (holding several slow, constant speeds; then a few steady
accelerations) while logging voltage, velocity, and acceleration, then fitting this same equation to the recorded
data. The result is a `kS`, `kV`, `kA` triple specific to that one mechanism, used directly in WPILib's
`SimpleMotorFeedforward` class (or a similar feedforward class provided by CTRE or REV's own libraries).

## Fighting Gravity: kG

Mechanisms that move against gravity, an arm, an elevator, need a fourth term, $k_G$, that's present even at zero
velocity and zero acceleration, since gravity pulls on the mechanism whether it's moving or not.

- On an **elevator**, gravity pulls straight down along the same axis the mechanism moves on, so $k_G$ is just
  another constant term, `ElevatorFeedforward` in WPILib.
- On an **arm**, gravity's effect on the *motor's* torque depends on the arm's current angle, gravity fights the
  motor hardest when the arm is horizontal and not at all when it's straight up or down, so $k_G$ is scaled by
  $\cos(\theta)$, `ArmFeedforward` in WPILib.

$$
V_{arm} = k_S \cdot \text{sgn}(v) + k_G \cdot \cos(\theta) + k_V \cdot v + k_A \cdot a
$$

## The Limits of Prediction

A feedforward model is only as good as the physics it assumes. It has no way to know about a chain that's
gradually stretching, a battery sagging mid-match, a bit of unexpected friction from a bent piece of frame, or a
game piece adding unplanned weight to an arm, any of which throws its prediction off by some amount it can never
notice or correct on its own. Feedforward gets a mechanism *close* to the right voltage, reliably and instantly;
closing the remaining gap is exactly the job [Closed Loop Control](../closed_loop_control/CLOSED_LOOP_CONTROL.md)
was built for, and in practice, the two are almost always used together rather than as a strict either/or choice.

See [Comparing Open Loop Methods](./COMPARISON.md) for how percent output, voltage control, and feedforward stack
up against each other.
