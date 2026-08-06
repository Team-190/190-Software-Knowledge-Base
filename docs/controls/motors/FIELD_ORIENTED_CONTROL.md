import useBaseUrl from '@docusaurus/useBaseUrl';

# Field-Oriented Control (FOC)

Here's the core difficulty FOC is built to solve: the three phase currents are all constantly changing sine waves, 120°
apart, and what we actually care about, torque, comes from a somewhat awkward combination of all three at once. Trying
to directly regulate three interacting, constantly-moving sine waves with three separate PID loops is clumsy and doesn't
converge cleanly, because the "error" itself is a moving target.

**The big idea behind FOC**: stop describing the currents from the stationary point of view of someone standing next to
the motor, and instead describe them from a point of view that spins *with the rotor*. If you're riding along with the
rotor's magnet, the field that's supposed to be dragging you around isn't spinning relative to you at all, it's sitting
still. Two sine waves, 90° apart, viewed from a reference frame that rotates in exact sync with them, don't look like
sine waves anymore, they look like two constant, unmoving numbers. A hard, constantly-changing problem becomes an easy,
constant one, just by changing your point of view.

<img src="https://upload.wikimedia.org/wikipedia/commons/3/35/Diagram_of_a_d%2Cq_coordinate_system_superimposed_on_three-phase_system.jpg"
alt="The rotating d,q coordinate frame superimposed on the stationary three-phase abc system"
width="380"
/>

*Source: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Diagram_of_a_d,q_coordinate_system_superimposed_on_three-phase_system.jpg)*

Getting to that rotating point of view takes two coordinate transforms:

## The Clarke Transform: Three Current Readings Become Two

Three phase currents sound like three independent pieces of information, but they're not quite. All three windings
connect together at a shared center point, and at that junction current can't pile up or vanish, whatever flows in
from one wire has to flow back out through the other two. That forces $I_a + I_b + I_c$ to equal zero at every
instant, which means knowing any two of the three currents automatically tells you the third: if $I_a = 5\text{A}$
and $I_b = -3\text{A}$, then $I_c$ has no choice but to be $-2\text{A}$. Three numbers, but only two of them are ever
actually free to vary.

The awkward part is that the two you'd naturally reach for, say $I_a$ and $I_b$, don't point in convenient
directions to work with. Each phase current pushes along its own winding's physical axis, and those three axes sit
120° apart, not a tidy, perpendicular x/y layout. [As established back in Sinusoidal
Commutation](./SINUSOIDAL_COMMUTATION.md), all three currents combine at every instant into one single,
smoothly-rotating magnetic field vector, so what's actually wanted is a clean, perpendicular way to describe *that
one vector*, not three overlapping, redundant readings of it. That's exactly what the **Clarke transform** does: it
repackages the three phase currents into two perpendicular, still-*stationary* axes, conventionally called $\alpha$
and $\beta$, that describe the same combined vector the way ordinary x/y coordinates would:

$$
I_\alpha = I_a \qquad\qquad I_\beta = \frac{I_a + 2 I_b}{\sqrt{3}}
$$

Nothing physical has changed, this is the same current, the same combined vector, just described with two
perpendicular numbers instead of three redundant, 120°-apart ones.

<video
src={useBaseUrl("img/images/motors/clarke-transform.mp4")}
autoPlay
loop
muted
playsInline
width="440"
>
  Animated Clarke transform: the three-phase abc waveforms and their spinning abc-frame vectors on the top row
  collapse into the two-phase alpha-beta waveforms and their spinning alpha-beta-frame vector on the bottom row.
</video>

Watch the two frames on the right side of the animation: the three $a$, $b$, $c$ vectors up top and the two
$\alpha$, $\beta$ vectors below both sweep around at the same rate, tracing out the same combined vector, just
described by two numbers instead of three.

## The Park Transform: Standing Still Relative to the Rotor

The **Park transform** takes that stationary $(\alpha, \beta)$ description and rotates it by the rotor's own electrical
angle $\theta$ (read straight from the encoder), landing on two new axes, $d$ and $q$, that spin together with the
rotor:

$$
I_d = I_\alpha \cos\theta + I_\beta \sin\theta \qquad\qquad I_q = -I_\alpha \sin\theta + I_\beta \cos\theta
$$

Because $d$ and $q$ spin in lockstep with the same electrical angle the current itself is rotating at, a properly
commutated motor's currents stop looking sinusoidal in this frame, they collapse into two **steady, DC-like
quantities**:

<video
src={useBaseUrl("img/images/motors/park-transform.mp4")}
autoPlay
loop
muted
playsInline
width="440"
>
  Animated Park transform: the spinning abc-frame vectors on the top row become two flat, unmoving d and q
  waveforms on the bottom left, and a single steady vector in the rotating dq frame on the bottom right.
</video>

Watch the bottom row this time: while the abc frame up top keeps spinning, the $d$/$q$ waveforms below go
completely flat, constant lines, and the vector in the rotating $dq$ frame stops moving entirely. That's the whole
payoff of Park's transform: riding along with the rotor turns a moving target into a stationary one.

- $I_d$, the component of current pointing along the rotor magnet's own axis. This doesn't produce torque; it either
  strengthens or weakens the magnetic field itself. For most FRC-style surface-mount permanent-magnet motors, the
  torque-per-amp is maximized by holding $I_d = 0$.
- $I_q$, the component of current at 90° to the magnet, exactly the "always push tangentially, never toward or away
  from the center" direction that produces the most torque for a given current. Torque comes out directly proportional
  to $I_q$:

$$
T \approx k_t \cdot I_q
$$

## Closing the Loop

This is the payoff: $I_d$ and $I_q$ are just steady numbers now, which means they can be regulated with two ordinary PI
controllers, exactly the same closed-loop tool used everywhere else in [Closed Loop Control](../closed_loop_control/CLOSED_LOOP_CONTROL.md),
just running on the motor controller instead of the roboRIO. Once the controller has computed the correction it wants in
the $d$/$q$ frame, an **inverse Park transform** rotates it back into the stationary $\alpha/\beta$ frame, and **Space
Vector PWM (an inverse Clarke transform, essentially)** turns that back into the three PWM duty cycles that actually
drive the inverter's switches.

<img src="https://upload.wikimedia.org/wikipedia/commons/a/a2/IFOC.jpg"
alt="A simplified indirect field-oriented control block diagram: current sensing, Clarke/Park transforms, PI
controllers, inverse Park, and the inverter driving the motor"
width="520"
/>

*Source: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:IFOC.jpg)*

All of this, sense the currents, rotate them into the rotor's frame, correct two steady numbers, rotate the correction
back out, resynthesize the PWM, runs many thousands of times per second inside the motor controller itself. The result
is a motor that produces smooth, nearly ripple-free torque, runs quieter, and gets more torque out of every amp it
draws, at the cost of needing a fast onboard processor and a precise, low-latency rotor angle. This is exactly what
modern FRC "smart" brushless controllers (like the TalonFX controllers built into the Kraken motors) are
doing internally when running in FOC mode.

It's worth walking through one of those thousands-per-second iterations, because a PI controller is inherently
reactive, it only ever computes a correction for an error that's already happened, and that sounds like it should
leave the motor perpetually a step behind. Say $I_q$'s target is 20A and the latest measurement comes back at 18A, a
2A shortfall. The controller didn't know that gap existed until it measured it, and by the time it computes a
correction and rotates it back out through the inverse Park transform and Space Vector PWM, the new duty cycle it
produces is answering for a gap that, strictly speaking, already happened. That duty cycle nudges the phase voltages
up slightly, but current in a real winding can't jump to meet a new voltage instantly, it climbs toward it along the
circuit's own exponential curve, governed by the electrical time constant $\tau = L/R$, typically a few milliseconds,
the same time constant. If the loop only measured and
corrected once every few milliseconds, that lag would matter, current would forever be chasing a target that had
already moved on by the time a correction arrived. But at tens of kilohertz, the next measurement lands roughly fifty
microseconds later, long before the current has climbed any meaningful fraction of the way through that exponential.
So the loop measures again, finds the error only marginally smaller, say 1.8A instead of 2A, and nudges the
correction again, thousands of times every second. Each individual nudge is technically late, computed from an error
that already existed by the time it's acted on, but the nudges arrive so much faster than the physical current can
possibly respond that the staircase of small, reactive corrections converges onto essentially the same smooth curve
a perfectly clairvoyant, non-reactive controller would have produced. The reactivity is real, it just never gets
enough time between corrections to turn into anything visible.

That steady, well-regulated $I_q$ is exactly what makes
[commanding motor current directly from robot code](../current_control/CURRENT_CONTROL.md), covered next, practical
in the first place, without FOC holding it smooth, a raw current setpoint would be fighting the same ripple problem
this whole page exists to solve.

That's the last of the commutation schemes this section covers. Before comparing all four head to head, [Torque,
Current, Speed, and Voltage](./MOTOR_CHARACTERISTICS.md) covers two more relationships every motor obeys, regardless
of which of these schemes is driving it.
