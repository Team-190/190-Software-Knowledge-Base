# Trapezoidal (Six-Step) Commutation

The simplest electronic scheme divides one electrical revolution into **six steps**, each 60° apart. In each step,
exactly one phase is driven high, one is driven low, and one is left floating (disconnected), the floating phase is
actually useful, because its back-EMF voltage tells the controller when the rotor has advanced far enough to move to the
next step. Six inexpensive Hall-effect sensors (or a lookup based on back-EMF zero-crossings) are all that's needed to
know which of the six steps to use next.

<img src="https://upload.wikimedia.org/wikipedia/commons/b/b2/Mcb_six_step_commutation_switching.png"
alt="The six-step switching sequence for a BLDC motor: which phase is high, low, or floating in each of the six
60-degree steps"
width="560"
/>

*Source: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Mcb_six_step_commutation_switching.png)*

<img src="https://upload.wikimedia.org/wikipedia/commons/e/e4/Motor_BD.gif"
alt="A three-phase brushless motor stepping through its commutation states: the energized poles jump from one position to the next rather than sweeping smoothly"
width="220"
/>

*Source: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Motor_BD.gif)*

Think of it like a brushed commutator with six segments instead of two, the effective "push" direction hops around the
motor in six discrete jumps per electrical revolution instead of one smooth mechanical sweep. That's cheap and simple to
implement, and it was the standard approach for early affordable brushless ESCs, but it has a real cost:
because the driving force jumps in sudden 60° steps rather than gliding smoothly, the torque output ripples up and down
within every step, producing audible whine, extra vibration, and reduced efficiency, especially at low speed.

The natural fix, is to stop jumping and glide instead. see [sinusoidal commutation](./SINUSOIDAL_COMMUTATION.md).
