# Comparing Closed Loop Methods

| Method | Corrects | Weakness | Typical FRC use |
|---|---|---|---|
| [P only](./PROPORTIONAL.md) | Proportional to current error | Permanent steady-state error | Quick, rough position holds where a small error doesn't matter |
| [PD](./DERIVATIVE.md) | Error, damped by its rate of change | Still has steady-state error | Fast-moving mechanisms where overshoot is worse than a small final offset |
| [PI](./INTEGRAL.md) | Error, plus its full history | Overshoot, risk of integral windup | Mechanisms needing zero steady-state error, without needing to be fast |
| [PID](./DERIVATIVE.md#putting-all-three-together) | Error, its history, and its rate of change | Three gains to tune instead of one | General-purpose position and velocity control |

Every method in this table is built from the same three ingredients covered throughout this section,
[proportional](./PROPORTIONAL.md), [integral](./INTEGRAL.md), and [derivative](./DERIVATIVE.md) response to error,
just weighted differently depending on which terms are in play.

## Where This Leads Next

A well-tuned closed loop is very good at reaching *a* setpoint accurately. It says nothing about *what* that
setpoint should be doing over time, jumping straight to a final target and letting the controller fight its way
there produces exactly the fast, jerky, overshoot-prone motion the gain tradeoffs in this section keep warning
about. Shaping a smoother path for a closed loop to follow, instead of a single abrupt target, is the subject of
[Motion Profiling](../motion_profiling/MOTION_PROFILING.md).
