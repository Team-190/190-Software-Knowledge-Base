# PID Tuning

Knowing what $k_P$, $k_I$, and $k_D$ each *do* doesn't automatically tell you what numbers to actually type into
code for a specific mechanism. **Tuning** is the hands-on process of finding those numbers, and while it can look
intimidating, it comes down to a fairly mechanical, repeatable process.

## Start With Feedforward, Not Integral

Before touching any PID gains at all, get a decent
[feedforward model](../open_loop_control/FEEDFORWARD.md) in place first. Feedforward supplies the steady, predictable
part of the output directly, so the closed loop on top of it only has to correct whatever small amount feedforward
gets wrong. A mechanism with good feedforward often barely needs integral gain at all, since there's no large,
persistent error left over for [integral control](./INTEGRAL.md) to spend time accumulating away. Less reliance on
$k_I$ also means less risk of the overshoot and wind-up problems integral control is prone to.

## The Order That Works: P, Then D, Then I

A practical, widely-used order (and the one WPILib's own documentation recommends) is to bring in the three terms
one at a time, in this order:

1. **Start at zero.** Set $k_P$, $k_I$, and $k_D$ all to zero.
2. **Increase $k_P$** until the mechanism tracks its setpoint reasonably well, moving promptly without being
   wildly unstable. Some overshoot and oscillation at this stage is normal, expected, and fine, that's exactly what
   [Proportional Control](./PROPORTIONAL.md#the-gain-tradeoff) predicts.
3. **Increase $k_D$** until that oscillation damps out and the mechanism settles smoothly. This is
   [Derivative Control](./DERIVATIVE.md) doing its job, softening the approach the proportional term made too
   aggressive.
4. **Only if a steady-state error remains**, add a small amount of $k_I$ until the mechanism reaches the exact
   setpoint in a reasonable amount of time, watching for the overshoot [Integral
   Control](./INTEGRAL.md#the-cost-overshoot-and-wind-up) tends to reintroduce.

A simple, effective way to search for each value is to **double it until the effect you're looking for shows up**,
then back off partway. Start a gain at some small value, double it, and keep doubling until the mechanism's
behavior changes the way that term is supposed to change it (P responds faster, D stops oscillating, I closes the
remaining gap), then cut back until the behavior is clean rather than right at the edge of instability.

## What "Good" Looks Like

There's rarely a single, perfect set of gains, tuning is a matter of trading off several things a team cares about
differently depending on the mechanism:

- **Rise time**, how quickly the mechanism gets close to the setpoint.
- **Overshoot**, how far past the setpoint it swings before coming back.
- **Settling time**, how long until it stays within an acceptable range of the setpoint for good.
- **Steady-state error**, how far off it sits once it's done moving.

A shooter flywheel usually tolerates some settling time in exchange for zero overshoot (overshooting speed means an
inaccurate shot); a drivetrain chasing a fast trajectory usually wants quick rise time even at the cost of a little
overshoot. Good tuning means picking gains that fit what a specific mechanism actually needs, not chasing one
universally "correct" answer.

## Mind Your Units

Every term in $u = k_P e + k_I \int e\,dt + k_D \dot{e}$ carries units that depend on what the error $e$ and the
output $u$ are actually measured in, and losing track of that is one of the easiest ways to end up chasing a gain
that "should" work but doesn't. $k_P$ is output per unit of error, $k_I$ is output per unit of error-seconds, and
$k_D$ is output per unit of error-per-second. Change the error term from degrees to radians, or from encoder ticks
to a converted sensor unit, or change the output from percent output to volts, and every gain has to be rescaled to
match. A $k_P$ tuned for degrees of error will not produce the same behavior once that same error is reported in
radians, even though nothing about the mechanism itself changed.

Before typing in a number, know exactly what's on both sides of that equation: what units the sensor feeding the
loop reports error in, and what units the controller is expecting its output in (percent output on $[-1, 1]$ behaves
nothing like a `TalonFX` running `TorqueCurrentFOC`, which expects amps, or a controller running in voltage control,
which expects volts). The controller doesn't know or care what those numbers mean, it just multiplies them, so it's
on whoever is tuning the loop to keep track of what a change in a gain actually represents physically. This is also
why gains copied from a different mechanism (a different gearbox ratio, a different sensor conversion factor, a
different controller's native output units) rarely transfer directly, even to something that looks nearly
identical, since the units the gain is scaling have quietly changed underneath it.

Continue to [Comparing Closed Loop Methods](./COMPARISON.md) to see how P, PI, PD, and PID stack up against each
other, and when each one is enough.
