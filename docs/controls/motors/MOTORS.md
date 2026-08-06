# 🏍️ Motors and Commutation

Here is a [great video series](https://youtu.be/EHYEQM1sA3o?si=xIin1BQp44bNR2r7) that goes over how motors work!

Every mechanism on the robot, ultimately reduces to the same question: how do we turn electrical energy from the battery
into mechanical energy to move a mechanism? The answer is *almost always* a motor, and every motor, no matter how
expensive or exotic, is solving the same basic problem: **how do you use electricity to keep something spinning,
continuously?**

That problem, and its solution, is called **commutation**. This section builds the idea up from scratch, starting with a
single wire in a magnetic field, all the way up to **Field-Oriented Control (FOC)**, the technique used inside modern
"smart" motor controllers like the ones driving Kraken motors. Each page exists because the previous one had a
limitation, so read them in order:

1. [Brushed DC Motors](./BRUSHED_MOTORS.md): the simplest possible motor, and the mechanical trick (the commutator)
   that keeps it spinning.
2. [Brushless Motors (BLDC)](./BRUSHLESS_MOTORS.md), rebuilding the motor inside out to get rid of that mechanical
   trick, and the new problem that creates.
3. [Trapezoidal (Six-Step) Commutation](./SIX_STEP_COMMUTATION.md), the simplest way to electronically replace a
   commutator.
4. [Sinusoidal Commutation](./SINUSOIDAL_COMMUTATION.md), smoothing six-step's jumps into a continuous sweep.
5. [Field-Oriented Control (FOC)](./FIELD_ORIENTED_CONTROL.md), regulating that sweep from the rotor's own point of
   view.
6. [Torque, Current, Speed, and Voltage](./MOTOR_CHARACTERISTICS.md), two more relationships every motor obeys,
   regardless of which commutation scheme is driving it.
7. [Torque Ripple Across Commutation Methods](./TORQUE_RIPPLE.md), comparing how smooth each of the four approaches
   actually is.
8. [Comparing the Approaches](./COMPARISON.md), how all four fit together, and where the rest of the Controls section
   builds on top of them.

:::tip You don't need to memorize the equations here to write good robot code. What you *do* need is the intuition: why
a commutator exists, why brushless motors need to know their own position, and why FOC is worth the extra computation.
That intuition is exactly what was missing from [Open Loop Control](../open_loop_control/OPEN_LOOP_CONTROL.md) and
[Closed Loop Control](../closed_loop_control/CLOSED_LOOP_CONTROL.md): this section fills in *why* the voltages,
currents, and feedforward constants those pages leaned on behave the way they do.
:::

## Electricity and Magnetism Are Linked

Every motor, brushed or brushless, tiny or huge, runs on one deep fact from physics: **electric current and magnetic
fields are two sides of the same coin.** A magnetic field can push on a current-carrying wire, and a current-carrying
wire can create a magnetic field of its own. A motor is just a machine built to exploit both halves of that relationship
at once. We'll start with the second half, since it's the one that explains where a motor's field even comes from in the
first place.

Any wire carrying current is surrounded by its own magnetic field, no permanent magnet required. A single straight
wire's field is weak and wraps all the way around it, but bend the wire into a loop and the field from every part of it
starts pointing the same direction through the center, adding up instead of canceling out, enough to give the loop a
north face and a south face, like a tiny flat magnet. Stack many of these loops in a row, a **winding**, and each one
adds to the next, so the total field scales with the number of turns and the current flowing through them.

<img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/Coil_right-hand_rule.svg"
alt="A coil of wire acting as a magnet: which way the current flows through the loops determines which end becomes north
and which becomes south"
width="320"
/>

*Source: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Coil_right-hand_rule.svg)*

This coil is an **electromagnet**: unlike a permanent magnet, it can be switched on, off, or reversed just by
controlling its current. Wrapping it around a **core** of iron makes the field stronger still, since the iron itself
becomes magnetized and reinforces the coil's own field, which is exactly why real windings, in both the brushed and
brushless motors covered next, are wound around an iron core rather than left hollow.

## The One Rule Every Motor Obeys

That covers current making a field. The other half of the relationship is what actually makes a motor spin: **a
current-carrying wire sitting in a magnetic field feels a force.** Push current through a wire while it's inside a
magnetic field (whether that field comes from a permanent magnet or a winding like the one above), and the wire gets
shoved sideways, perpendicular to both the current and the field. This is the **Lorentz force**, and now that current-to-field and field-to-force are both on
the table, it can be written as one compact equation:

$$
\vec{F} = I \vec{L} \times \vec{B}
$$

Where $I$ is the current, $\vec{L}$ is the length of wire (in the direction current flows), and $\vec{B}$ is the
magnetic field. You don't need to be comfortable with cross products to use this intuitively, just remember three things
determine the force, and if you flip any *one* of them (reverse the current, or flip the field), the force flips
direction too.

The big trick is **how to keep reapplying that force in a useful direction as the motor spins**, which turns out to be a
surprisingly deep problem. Start with [Brushed DC Motors](./BRUSHED_MOTORS.md) to see exactly why.