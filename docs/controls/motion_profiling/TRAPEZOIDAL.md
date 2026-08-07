import useBaseUrl from '@docusaurus/useBaseUrl';

# Trapezoidal Profiles

The simplest motion profile is shaped exactly like its name: plot the *velocity* a mechanism should be commanded
to move at over time, and it traces a trapezoid.

<img
src={useBaseUrl("img/images/motion_profiling/trapezoidal-profile.svg")}
alt="A trapezoidal velocity profile: acceleration ramp up, a constant-velocity cruise, then a deceleration ramp down, with acceleration jumping instantly between three fixed levels"
width="560"
/>

## Three Phases

- **Accelerate**, ramping velocity up from zero at some fixed, chosen acceleration, as fast as the mechanism can
  safely go.
- **Cruise**, holding a constant maximum velocity once it's reached, the flat top of the trapezoid.
- **Decelerate**, ramping velocity back down to zero at the same fixed acceleration, timed so the mechanism arrives
  exactly at its target position the instant velocity reaches zero.

Every instant along that trapezoid produces a matching **position** setpoint too (position is just the running
total of velocity over time), so a controller following a trapezoidal profile is really tracking a constantly
advancing position target, never a single distant one.

## Two Numbers Define the Whole Shape

A trapezoidal profile only needs two limits to be fully specified: a **maximum velocity** (the height of the flat
top) and a **maximum acceleration** (how steep the ramps up and down are). Given a starting position, an ending
position, and those two limits, the entire trapezoid, how long to accelerate, how long to cruise, when to start
decelerating, follows automatically from the same distance/rate/time relationships as any constant-acceleration
motion.

:::note
Short moves never reach the cruise phase at all. If the distance is too short to hit maximum velocity before
needing to decelerate again, the profile becomes a triangle instead, ramping up and immediately back down. The
math is the same either way, the cruise phase simply shrinks to zero.
:::

## What's Still Missing

Look closely at the acceleration plot above: it jumps *instantly* between three fixed levels, positive, zero,
negative, at each phase change. That's a sudden, discontinuous jerk on the mechanism at every transition, physically
unrealistic (nothing can actually change its acceleration in zero time) and hard on gearboxes, belts, and any game
piece being carried along for the ride. Smoothing out exactly that jump is what
[S-Curve Profiles](./S_CURVE.md) exist to do.
