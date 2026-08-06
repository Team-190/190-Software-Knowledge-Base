# ⚡ Current Control

Here's a simple but powerful fact [Motors and Commutation](../motors/MOTORS.md) covered in depth: torque is
directly proportional to current ($T = K_t \cdot I$). A controller that can hold current steady can, by the same
stroke, hold **torque** steady. That's the whole idea behind **current control**: instead of commanding a voltage
and hoping the resulting torque is whatever's needed, command the current, and therefore the torque, directly.

## Voltage Control vs. Current Control

Voltage and current control aren't just two different units for the same underlying idea, they command genuinely
different physical quantities, and that difference reaches all the way into what a controller's gains have to
account for. **Voltage control commands electrical pressure; current control commands torque directly.** A
voltage-controlled loop's output is volts, and [the back-EMF equation](../motors/MOTOR_CHARACTERISTICS.md#speed-is-proportional-to-voltage-kind-of),
$V = I \cdot R + K_v \cdot \omega$, sits between that commanded voltage and the torque the motor actually produces.
Solved for current, $I = \frac{V - K_v \cdot \omega}{R}$, and it's clear current, and therefore torque, depends on
speed even while voltage is held perfectly steady: the faster the motor is already spinning, the more back-EMF
cancels out the applied voltage, and the less current is left over to make torque. A current-controlled loop skips
that entirely: its output is amps, torque follows immediately from $T = K_t \cdot I$ with no speed term anywhere in
the relationship, the inner current loop automatically raises or lowers voltage however much is needed to hold that
current steady, no matter how fast the motor happens to be turning.

That's exactly the thing a voltage-controlled position or velocity loop has to fight, and a current-controlled one
doesn't. A loop commanding voltage is really commanding torque *indirectly*, through a relationship that shifts with
speed and with however far the battery has sagged, and its gains end up quietly compensating for both. A position or
velocity loop that outputs current instead sidesteps that problem entirely: the motor controller's own current
control is already canceling out back-EMF on every control cycle, so the loop sees something much closer to a clean,
speed-independent torque source, one whose behavior doesn't drift as the mechanism speeds up or the battery sags
mid-match. Its gains only have to describe the mechanism's actual mechanics ($T = J \cdot \alpha$), not the motor's
electrical behavior layered on top of them.

## What Changes for Feedforward

The same split shows up in [feedforward](../open_loop_control/FEEDFORWARD.md). A voltage feedforward model predicts
volts, and its $k_V$ term bundles two effects together: friction that grows with speed, and back-EMF pushing back
against the applied voltage, the term exists precisely because voltage control has to fight both. A current, or
torque, feedforward model predicts amps instead, and since current already *is* torque, its terms map onto the
mechanism's physics far more directly: $k_G$ becomes the exact number of amps needed to hold a mechanism against
gravity, $k_S$ becomes the amps needed to break static friction, both fixed, physically meaningful numbers that
don't shift with speed or battery voltage the way their voltage-domain counterparts do. The back-EMF half of $k_V$
disappears almost entirely under current control, since the inner current loop is already canceling it out on every
control cycle, current control holds torque, and therefore acceleration, steady regardless of speed. What's left of
$k_V$ is only the genuine friction that grows with speed, a real effect on some mechanisms (like aerodynamic drag on
a fast-spinning flywheel), but a much smaller one than the full voltage-domain $k_V$ was accounting for.

## Why Command Torque Directly?

Plenty of mechanisms care about torque, not speed, and current control gives it to them without any indirection
through voltage:

- An **intake or manipulator roller** that needs to grip a game piece firmly, but not so firmly it damages the
  piece or stalls the motor, current control caps that gripping force directly.
- An **arm holding a fixed position against gravity** needs a specific, steady torque to stay put, exactly what a
  well-tuned current setpoint, combined with a torque-domain feedforward, provides, and because that torque is
  measured once in amps it stays correct at every angle and every battery voltage for the rest of the match.
- A **flywheel accelerating as fast as possible** without exceeding a safe current draw benefits from commanding
  current near its limit directly, rather than commanding a voltage and hoping the resulting current stays safe.

## Where This Leads Next

Every layer of the Controls section, from a raw voltage command through current control and back out to a position
or velocity setpoint, has quietly assumed that a command actually makes it from robot code to the motor controller,
and a measurement makes it back. Making that trip real, over CAN, PWM, or whatever wire actually carries it, is the
final addendum to the Controls section: see
[Hardware Communication](../hardware_communication/HARDWARE_COMMUNICATION.md).
