# Feedforward and Motion Profiles Together

[Feedforward models](../open_loop_control/FEEDFORWARD.md) predict the voltage a mechanism needs given a desired
velocity and acceleration. A [motion profile](./MOTION_PROFILING.md) produces exactly that, a velocity and
acceleration for every instant of a move. Put the two together, and a feedforward model finally has something
genuinely useful to work with.

## Closing the Loop Between Two Ideas

Recall the feedforward equation from earlier in this section:

$$
V = k_S \cdot \text{sgn}(v) + k_V \cdot v + k_A \cdot a
$$

Without a motion profile, $v$ and $a$ have to come from somewhere, and the honest answer, without one, is usually
"a single, final target velocity, commanded all at once," which throws away exactly the smooth, moment-to-moment
detail feedforward is built to use. A motion profile supplies $v$ and $a$ *continuously*, at every control cycle,
so the feedforward term can predict the right voltage for *right now*, not just for wherever the mechanism will
eventually end up.

In practice, a profile-following controller runs both pieces every single cycle:

1. Ask the motion profile ([trapezoidal](./TRAPEZOIDAL.md) or [S-curve](./S_CURVE.md)) what position, velocity, and
   acceleration the mechanism *should* be at right now, this instant, partway through the move.
2. Feed that velocity and acceleration into the feedforward model, predicting the voltage needed to actually
   achieve them.
3. Feed the position (and often velocity) error, the small difference between where the profile says the mechanism
   should be and where it actually is, into a [PID controller](../closed_loop_control/CLOSED_LOOP_CONTROL.md).
4. Command the feedforward voltage and the PID correction *together*, added on top of each other.

## Why This Combination Works So Well

This is the same principle raised on
[Closed Loop Control's landing page](../closed_loop_control/CLOSED_LOOP_CONTROL.md): a good feedforward model does
most of the work predicting the right output, and the closed loop only has to clean up
whatever small amount the prediction gets wrong. A motion profile makes that prediction dramatically better by
giving feedforward a target that's always close to the mechanism's actual current state, rather than one far away.
With the profile doing the heavy lifting and feedforward doing most of the pushing, the PID gains on top can often
be kept small, gentle, and far less prone to the overshoot and oscillation problems that come from relying on PID
to do all the work by itself.

See [Comparing Motion Profile Shapes](./COMPARISON.md) for when a trapezoidal profile is enough and when the extra
smoothness of an S-curve earns its cost.
