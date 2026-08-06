# Sinusoidal Commutation

[Six-step commutation](./SIX_STEP_COMMUTATION.md) jumps the field vector between only six positions. The natural fix is
to stop jumping and instead drive the current in **each of the three phases as a smooth sine wave**, each shifted 120°
from the other two. Instead of hopping the "push" direction six times per revolution, a sinusoidally-commutated motor
can point it in *any* direction at *any* instant, gliding continuously around the motor.

<img src="https://upload.wikimedia.org/wikipedia/commons/c/cc/3_phase_AC_waveform.svg"
alt="Three sinusoidal phase waveforms, each offset 120 degrees from the other two"
width="420"
/>

*Source: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:3_phase_AC_waveform.svg)*

$$
I_a = I_{peak}\sin (\theta_e) \qquad I_b = I_{peak}\sin (\theta_e - 120°) \qquad I_c = I_{peak}\sin (\theta_e + 120°)
$$

Add the magnetic effect of all three phases together at any instant, and the result is a single, smoothly-rotating
magnetic field vector, no jumps, no steps. This is smoother, quieter, and more efficient than six-step commutation, but
it requires much finer rotor position resolution (a real encoder, not just six Hall states) so the controller always
knows exactly which point on the sine wave each phase should be at.

<img src="https://upload.wikimedia.org/wikipedia/commons/1/12/Rotating_Magnetic_Field.gif"
alt="A rotating magnetic field animation: the stator's colored pole pairs sweep smoothly around the motor instead of jumping"
width="280"
/>

*Source: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Rotating_Magnetic_Field.gif)*

Sinusoidal commutation is a big improvement, but on its own it's still an **open-loop shape**, the controller is just
tracing out a predetermined sine wave locked to rotor angle. It has no direct handle on *how much torque* that produces,
or how to efficiently correct it in real time. That's the problem [Field-Oriented Control](./FIELD_ORIENTED_CONTROL.md)
solves.
