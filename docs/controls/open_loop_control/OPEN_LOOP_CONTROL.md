import useBaseUrl from '@docusaurus/useBaseUrl';

# 💡 Open Loop Control

Robot code's most basic job is turning a desire, "spin this flywheel," "hold this arm level," into an electrical
command sent to a motor. This section is about how that command actually gets decided, starting with the simplest
possible approach: **open loop control**, sending a command and never checking whether it worked.

<img
src={useBaseUrl("img/images/open_loop_control/open-vs-closed-loop.svg")}
alt="Open loop: a command goes straight to the motor with nothing checking the result. Closed loop: a sensor measures the mechanism and feeds that measurement back to correct the command."
width="620"
/>

An **open loop** system has no feedback path, the command goes out, the motor does whatever that command and the
physical world produce, and the code moves on without ever looking back to see what actually happened. A
**closed loop** system (covered in the next part of this section) adds a sensor and compares what actually
happened to what was wanted, correcting the difference. Open loop is simpler, cheaper, and often good enough, but
only when the relationship between "command sent" and "result produced" is predictable enough to trust blind.

This part of the Controls section covers three ideas, in order:

1. [Percent Output and Duty Cycle Control](./PERCENT_OUTPUT.md), the crudest, most direct way to command a motor.
2. [Voltage Control](./VOLTAGE_CONTROL.md), fixing percent output's biggest flaw: it isn't actually consistent.
3. [Feedforward Models](./FEEDFORWARD.md), predicting the exact voltage a mechanism will need before it ever
   moves, using the same physics [Motors and Commutation](../motors/MOTORS.md) covers in full later on.
4. [Comparing Open Loop Methods](./COMPARISON.md), when open loop is enough, and where it starts to fall short.

:::tip
Open loop control isn't a lesser version of closed loop control, it's the right tool whenever a mechanism's behavior
is predictable enough that guessing correctly (with good math) beats measuring and correcting. A flywheel spinning
up to a known speed, or a drivetrain being driven by a human, are both often handled perfectly well without any
feedback at all.
:::
