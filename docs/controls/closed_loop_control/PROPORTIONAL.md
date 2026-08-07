import useBaseUrl from '@docusaurus/useBaseUrl';

# Proportional Control (P)

The simplest possible rule for turning [error](./CLOSED_LOOP_CONTROL.md#setpoint-measurement-and-error) into a motor
command is: **push harder the more wrong things currently are.** That's proportional control, and it's exactly what
it sounds like, the commanded output is just the error multiplied by a constant, the **proportional gain** $k_P$:

$$
u = k_P \cdot e
$$

## The Intuition: A Spring

Proportional control behaves a lot like an actual physical spring stretched between where the mechanism is and
where it's supposed to be. Far from the setpoint, the "spring" is stretched a long way and pulls hard; close to the
setpoint, it barely pulls at all. That's why a mechanism under pure P control slows down as it approaches its
target, the very thing driving it forward (the error) is shrinking the whole time.

## The Gain Tradeoff

$k_P$ controls how stiff that spring is, and every proportional controller has to balance the same two failure
modes:

<img
src={useBaseUrl("img/images/closed_loop_control/proportional-response.svg")}
alt="Low proportional gain: a slow response that settles short of the setpoint. High proportional gain: a fast response that overshoots and oscillates before settling."
width="560"
/>

- **Too low**, and the "spring" is weak. The mechanism creeps toward the setpoint slowly, and worse, it typically
  never quite arrives, see [Steady-State Error](#the-error-p-alone-cant-fix) below.
- **Too high**, and the "spring" is so stiff that the mechanism blows straight past the setpoint (since it's still
  moving fast right as the error crosses zero), then gets pulled back the other way, overshooting again, and again,
  oscillating for a while before it finally settles.

Somewhere between those extremes is a gain that's fast without oscillating badly, and finding that value is the
subject of [PID Tuning](./PID_TUNING.md).

## The Error P Alone Can't Fix

Pure proportional control almost always settles slightly short of the actual setpoint, called **steady-state
error**. The reason is built into the formula itself: the output $u = k_P \cdot e$ only produces a nonzero command
when the error is nonzero. If a mechanism needs *some* ongoing output just to hold its position, an arm resisting
gravity, a drivetrain wheel fighting friction, that output can only come from a small, permanent, leftover error,
since a P controller can't be persuaded to keep pushing once the error hits exactly zero. Erasing that leftover
error without needing a nonzero error to sustain it is exactly the job of
[Integral Control](./INTEGRAL.md).
