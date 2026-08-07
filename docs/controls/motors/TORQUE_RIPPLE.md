import useBaseUrl from '@docusaurus/useBaseUrl';

# Torque Ripple Across Commutation Methods

Every commutation scheme covered so far is solving the same problem: keep torque pointed in a useful direction as
the rotor spins underneath it. But pointing the right way isn't the same as staying the same *size*, even a scheme
that never pushes backward can still push harder at some instants than others, and that wobble in torque, not
direction, is called **torque ripple**.

<img
src={useBaseUrl("img/images/motors/torque-ripple-comparison.svg")}
alt="Torque output over one electrical revolution for brushed, six-step, sinusoidal, and FOC commutation, showing ripple shrinking from a wavy line to a sawtooth to a gentle wave to a flat line"
width="620"
/>

## Brushed: Ripple From Segment Count

A brushed motor's commutator only flips current at specific points around the rotation, keyed to however many
segments the commutator has. Between those switching points, the [torque produced by the motor
effect](./MOTORS.md#the-one-rule-every-motor-obeys) still depends on how well a given coil happens to be aligned
with the stator's field at that instant, so torque drifts up and down through each segment's span rather than
holding still. More segments mean more, smaller wobbles instead of fewer, larger ones, which is exactly why [real
brushed motors wind many coils onto many commutator segments](./BRUSHED_MOTORS.md#why-a-loop-alone-isnt-a-motor)
instead of just one.

## Six-Step: Ripple From 60° Jumps

Trapezoidal commutation replaces the commutator with six discrete switching states, each covering 60° of rotation.
Inside a single step, the two energized phases stay fixed while the rotor keeps turning underneath them, so the
angle between the stator's push and the rotor's magnet drifts away from the ideal 90° for most of the step, passing
through it only once, then a hard jump resets the field back to a fresh 60°-early position at the next step. That
combination, drift then jump, is what produces the sharp, sawtooth-shaped ripple that gives [six-step
commutation](./SIX_STEP_COMMUTATION.md) its characteristic whine and vibration.

## Sinusoidal: Smoother, But Still Open-Loop

Driving each phase as a smooth sine wave removes the jumps entirely, the field sweeps continuously instead of
hopping, so the ripple that's left is much smaller. But [sinusoidal commutation on its own is still
open-loop](./SINUSOIDAL_COMMUTATION.md): the controller traces out a sine wave it assumes matches the real current,
without ever measuring and correcting the actual current amplitude. Winding resistance, inductance, and back-EMF all
shift the real current slightly away from that assumption as speed and load change, leaving a small residual ripple
sinusoidal commutation has no way to notice, let alone fix.

## FOC: Ripple Suppressed by Closed-Loop Correction

FOC keeps the same smooth sine waves sinusoidal commutation uses, but stops assuming they're correct. By
transforming the currents into the [rotor's own $d$/$q$ frame](./FIELD_ORIENTED_CONTROL.md), a properly commutated
motor's torque-producing current collapses into a single steady number, $I_q$, that a PI loop can measure and
correct thousands of times per second. Any ripple that would have crept in from resistance, inductance, or back-EMF
gets corrected away almost as soon as it appears, which is why FOC is the only method on this page that holds torque
essentially flat.

See [Comparing the Approaches](./COMPARISON.md) for how ripple stacks up against the other tradeoffs, wiring
complexity and position feedback needed, between all four methods.
