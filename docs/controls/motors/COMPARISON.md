# Comparing the Approaches

| Scheme                 | How current is switched                            | [Torque smoothness](./TORQUE_RIPPLE.md) | Position feedback needed         | FRC examples                            |
|------------------------|------------------------------------------------------|----------------------------|----------------------------------|-----------------------------------------|
| Brushed (mechanical)   | Physical commutator + brushes                      | Ripples with segment count | None, it's mechanical            | CIM, 775pro, Mini CIM                   |
| Trapezoidal (six-step) | Electronic switching in 6 discrete steps           | Noticeable ripple          | Coarse (Hall sensors / back-EMF) | Older/basic brushless ESCs              |
| Sinusoidal             | Electronic switching, smooth 3-phase sine          | Smooth                     | Fine, continuous (encoder)       | Many modern brushless ESCs              |
| Field-Oriented Control | Sinusoidal, but regulated in the rotor's own frame | Smoothest, most efficient  | Fine, continuous + fast compute  | TalonFX (Falcon 500 / Kraken X60 / X44) |

Notice that every row is solving the exact same problem posed back in
[Brushed DC Motors](./BRUSHED_MOTORS.md): **keep the push pointed the right way as the thing producing it spins
underneath you.** A mechanical commutator, a six-step lookup table, a spinning sine wave, and a full FOC loop are four
increasingly sophisticated answers to one question.

## Tying Back to the Rest of Controls

Every commutation scheme in the table above is what a given motor controller uses under the hood, underneath
everything covered earlier in the Controls section:

- [Open Loop Control](../open_loop_control/OPEN_LOOP_CONTROL.md) commanded raw voltage or duty cycle, the PWM idea
  from [Brushed DC Motors](./BRUSHED_MOTORS.md), one level up, and its feedforward constants, $k_V$ and $k_A$, turn
  out to just be this section's back-EMF and torque-current relationships, measured at the mechanism instead of at
  the bare motor shaft.
- [Closed Loop Control](../closed_loop_control/CLOSED_LOOP_CONTROL.md) covered the PID and PI loops that
  [FOC's](./FIELD_ORIENTED_CONTROL.md) $I_d$/$I_q$ regulation is built from, running on the motor controller instead
  of the roboRIO.
- [Motion Profiling](../motion_profiling/MOTION_PROFILING.md) covered shaping *what* those closed loops are asked to
  track over time, moment to moment, rather than jumping straight to a single distant target.

No matter how far up that stack you were working, it all still comes down to keeping a magnet chasing a field that
always stays one step ahead of it.

## Where This Leads Next

Everything on this page measures, predicts, and computes torque, but never actually holds it steady on purpose.
That's exactly what [Current Control](../current_control/CURRENT_CONTROL.md) does next: commanding motor current,
and therefore torque, directly from robot code, made practical by the steady $I_q$ FOC produces.
