import useBaseUrl from '@docusaurus/useBaseUrl';

# ➰ Closed Loop Control

[Open Loop Control](../open_loop_control/OPEN_LOOP_CONTROL.md) is a prediction: send a voltage, trust the physics,
never look back. **Closed loop control** replaces that trust with a measurement, a sensor reports what the
mechanism is actually doing, that measurement is compared against what was wanted, and the difference between them
drives the correction. This is the same feedback idea introduced back in
[Open Loop Control](../open_loop_control/OPEN_LOOP_CONTROL.md)'s comparison diagram, explored in full here.

<img
src={useBaseUrl("img/images/open_loop_control/open-vs-closed-loop.svg")}
alt="A closed loop: a setpoint and a measured value are compared to produce an error, which a controller turns into a motor command, and a sensor measures the result to close the loop"
width="620"
/>

## Setpoint, Measurement, and Error

Every closed loop system is built from the same three ingredients:

- The **setpoint**, what the mechanism is being asked to do (a target position, a target velocity, a target
  current).
- The **measurement**, what a sensor reports the mechanism is *actually* doing right now.
- The **error**, simply setpoint minus measurement, how far off the mechanism currently is.

$$
e = \text{setpoint} - \text{measurement}
$$

A **controller** is nothing more than a rule for turning that one number, error, into a motor command. The
simplest possible rule, and the foundation everything else in this section builds on, is
[Proportional Control](./PROPORTIONAL.md): push harder when the error is bigger.

This part of the Controls section builds a controller up one term at a time:

1. [Proportional Control (P)](./PROPORTIONAL.md), pushing in proportion to how wrong things currently are.
2. [Integral Control (I)](./INTEGRAL.md), fixing the error proportional control alone can never quite erase.
3. [Derivative Control (D)](./DERIVATIVE.md), damping the overshoot proportional and integral control tend to
   cause.
4. [PID Tuning](./PID_TUNING.md), an intuitive, hands-on process for finding good gains, and combining PID with
   feedforward.
5. [Comparing Closed Loop Methods](./COMPARISON.md), how P, PI, PD, and PID stack up, and when each is enough.

:::tip
Closed loop control doesn't replace feedforward, it completes it. A good feedforward model gets a mechanism *close*
to the right output instantly; a closed loop on top of it only has to correct the small remainder, which makes for
a controller that's both fast and accurate. Most real FRC mechanisms run both at once.
:::
