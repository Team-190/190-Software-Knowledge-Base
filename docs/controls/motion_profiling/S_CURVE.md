import useBaseUrl from '@docusaurus/useBaseUrl';

# S-Curve Profiles

A [trapezoidal profile](./TRAPEZOIDAL.md) keeps velocity smooth, but its *acceleration* jumps instantly between
fixed levels at every phase change, positive, zero, negative, with nothing in between. An **S-curve profile** fixes
that by applying the exact same trapezoid idea one level deeper: instead of let acceleration jump, ramp
*acceleration* itself smoothly too.

<img
src={useBaseUrl("img/images/motion_profiling/s-curve-profile.svg")}
alt="An S-curve velocity profile that rounds off the trapezoid's sharp corners, with an acceleration profile that itself ramps smoothly (trapezoidal) instead of jumping instantly between levels"
width="560"
/>

## Jerk: the Rate of Change of Acceleration

The rate at which acceleration itself changes has its own name, **jerk**. A trapezoidal profile has, in effect,
infinite jerk at each transition, acceleration changes by a large amount in zero time. An S-curve profile adds a
**maximum jerk** limit, the same way a trapezoidal profile limits maximum acceleration, and the result is an
acceleration curve that ramps smoothly up to its peak, holds briefly, and ramps back down, rather than snapping
there instantly. Integrate that smoother acceleration once, and velocity gets the same gentle, rounded-off corners
visible in the chart above, instead of the trapezoid's sharp ones.

## Why Bother

Jerk is what a rider actually *feels* as sudden and uncomfortable, and what a mechanism *feels* as a sudden shock
load. Limiting it has real, practical payoffs:

- **Less mechanical stress.** Chains, belts, and gearboxes see a gentler ramp-up in force rather than a sudden
  snap, meaning less wear over a season of matches.
- **Better game piece control.** A manipulator carrying something loosely held (a game piece resting in an intake,
  balanced on a mechanism) is far more likely to keep it in place through a smooth acceleration change than an
  abrupt one.
- **Less voltage overshoot demanded of the motor.** A [feedforward model's](../open_loop_control/FEEDFORWARD.md)
  $k_A$ term scales directly with commanded acceleration, a sudden jump in acceleration means a sudden jump in
  demanded voltage and current, exactly what a jerk-limited profile avoids asking for.

## The Cost

An S-curve profile takes slightly longer to complete than a trapezoidal one covering the same distance with the
same velocity and acceleration limits, since time is spent easing into and out of the peak acceleration instead of
snapping straight to it. It's also a little more work to generate, one more limit to choose, one more layer of
integration to compute, though modern FRC libraries handle that computation automatically. In practice, that small
time cost is almost always worth it for anything carrying a game piece or driving a mechanism people will feel.

Continue to [Feedforward and Motion Profiles Together](./FEEDFORWARD_WITH_PROFILES.md) to see how either profile
shape feeds directly into the feedforward models from earlier in this section.
