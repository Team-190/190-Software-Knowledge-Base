import useBaseUrl from '@docusaurus/useBaseUrl';

# 🎛️ Motion Profiles

[Closed Loop Control](../closed_loop_control/CLOSED_LOOP_CONTROL.md) is very good at reaching a setpoint accurately.
It says nothing about *how* to get there. Hand a PID loop a single, instant target, "go from here to three meters
away, right now", and it will do exactly that: push as hard as its gains allow, the whole way, producing the fast,
jerky, overshoot-prone motion the gain tradeoffs throughout that section kept warning about. **Motion profiling**
fixes this, not by changing the controller, but by changing what's being asked of it.

<img
src={useBaseUrl("img/images/motion_profiling/step-vs-profiled.svg")}
alt="A controller chasing an instant step setpoint overshoots and rings before settling, while the same controller chasing a smooth motion profile tracks it closely the whole way with no overshoot"
width="580"
/>

## Shaping the Setpoint, Not the Controller

A motion profile is a plan: instead of handing a controller one final target and letting it fight its way there,
a profile breaks that trip into a smooth, continuously-updating sequence of intermediate setpoints, a **position**,
**velocity**, and often **acceleration** for every instant between now and arrival, all obeying limits the
mechanism can actually achieve. The closed loop's job barely changes, it's still just correcting error every
cycle, the error it's asked to correct is just never allowed to get large in the first place, since the setpoint it
's chasing is always close to where the mechanism already is.

This part of the Controls section covers two ways to build that plan, and how they combine with everything earlier
in the Controls section:

1. [Trapezoidal Profiles](./TRAPEZOIDAL.md), the simplest shape: ramp up, cruise, ramp down.
2. [S-Curve Profiles](./S_CURVE.md), smoothing out the trapezoid's sudden jumps in acceleration.
3. [Feedforward and Motion Profiles Together](./FEEDFORWARD_WITH_PROFILES.md), why a profile's planned velocity
   and acceleration are exactly what a [feedforward model](../open_loop_control/FEEDFORWARD.md) needs as input.
4. [Comparing Motion Profile Shapes](./COMPARISON.md), when the extra complexity of an S-curve is worth it.
