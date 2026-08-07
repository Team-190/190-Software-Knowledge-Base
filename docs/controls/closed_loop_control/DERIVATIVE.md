import useBaseUrl from '@docusaurus/useBaseUrl';

# Derivative Control (D)

[Proportional and integral control](./INTEGRAL.md) together reliably reach the setpoint, but they tend to
overshoot it first, and sometimes ring back and forth around it a few times before finally settling.
**Derivative control** exists to calm that down, by reacting not to the error itself, but to *how fast the error is
changing*.

## The Intuition: A Shock Absorber

Where proportional control is a spring, derivative control behaves like a shock absorber, it doesn't care where the
mechanism is, only how quickly it's getting there. Approaching the setpoint fast means the error is shrinking fast,
and derivative control resists that, applying a brake proportional to the *rate* of change:

$$
u = k_D \frac{de}{dt}
$$

When the mechanism is closing in on the setpoint quickly, the error's rate of change is large and negative
(shrinking fast), so the derivative term pushes back against that speed, softening the approach before the
proportional and integral terms have a chance to blow past the target and overshoot.

<img
src={useBaseUrl("img/images/closed_loop_control/derivative-response.svg")}
alt="A P+I response overshooting and ringing around the setpoint, compared to a P+I+D response that settles smoothly with minimal overshoot"
width="560"
/>

## The Cost: Noise Sensitivity

Derivative control's weakness comes from exactly what makes it useful, it depends on the *rate of change* of a
measurement, and real sensors are never perfectly smooth. A tiny amount of encoder jitter or measurement noise from
one reading to the next can look, to a derivative term, like an enormous, sudden rate of change, since it's
dividing a small measurement fluctuation by a very short slice of time. That noise gets amplified straight into the
motor command, which is why derivative gain is usually kept modest, and why many real controllers filter the
measurement before differentiating it, to keep noise from turning into a jittery, buzzing output.

## Putting All Three Together

$$
u = k_P \cdot e + k_I \int e \, dt + k_D \frac{de}{dt}
$$

That's the complete **PID controller**: proportional pushes toward the setpoint now, integral remembers and
corrects whatever proportional alone leaves behind, and derivative anticipates and softens the approach so the
first two don't overshoot as badly. Actually finding good values for $k_P$, $k_I$, and $k_D$ for a specific
mechanism is a hands-on process, covered next in [PID Tuning](./PID_TUNING.md).
