import useBaseUrl from '@docusaurus/useBaseUrl';

# Integral Control (I)

[Proportional control](./PROPORTIONAL.md) almost always leaves a small, permanent
[steady-state error](./PROPORTIONAL.md#the-error-p-alone-cant-fix) behind, since its output shrinks to zero exactly
when the error does, even if the mechanism still needs some ongoing push to stay put. **Integral control** fixes
this by keeping score.

## The Intuition: A Running Total

Instead of reacting only to the *current* error, an integral term keeps a running total of every bit of error that
has ever existed, added up over time:

$$
u = k_I \int e \, dt
$$

As long as *any* error persists, even a tiny one, that running total keeps growing, and so does the integral
term's contribution to the output. It only stops growing once the error hits exactly zero. That's the key
difference from proportional control: **P produces a nonzero output only when the error is nonzero, but I can
produce a nonzero output even after the error reaches zero**, because it remembers everything that came before.
That's exactly the "free" ongoing push proportional control could never supply on its own.

<img
src={useBaseUrl("img/images/closed_loop_control/integral-response.svg")}
alt="A P-only response settling short of the setpoint forever, compared to a P+I response that keeps climbing until it fully closes the gap"
width="560"
/>

## The Cost: Overshoot and Wind-Up

Integral control doesn't come for free. Because it's built from *accumulated* history, it has a kind of memory or
momentum, and that history keeps pushing even after the error has crossed zero and started going the other way,
which is exactly why a P+I controller commonly overshoots a little before settling, visible in the chart above.

Push this too far and a more serious problem shows up, called **integral windup**: if a mechanism is physically
stuck (an arm jammed against a hard stop, a wheel that can't spin fast enough to keep up), the error stays large for
a long time, and the integral term keeps accumulating the whole time, growing far larger than it should. The moment
the mechanism frees up, that oversized accumulated value slams the output hard in the other direction, a sudden,
often dangerous overshoot. Most real controllers guard against this by **clamping** the integral term to some
maximum value, so it can never accumulate an unreasonably large correction no matter how long an error persists.

## When to Reach for It

Integral control earns its complexity specifically when a mechanism needs a sustained, nonzero output just to hold
still, exactly the gravity-fighting and friction-fighting situations [feedforward's $k_S$ and
$k_G$](../open_loop_control/FEEDFORWARD.md) terms were built for. In practice, a good feedforward model often
shrinks how much integral gain is even needed, since feedforward is already supplying most of that steady push
before the loop has to accumulate anything to make up the difference. Damping the overshoot integral control tends
to introduce is the job of [Derivative Control](./DERIVATIVE.md).
