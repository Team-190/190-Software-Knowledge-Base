# Percent Output and Duty Cycle Control

The simplest possible way to command a motor is to just say what fraction of full power to use, `0.5` for "half
power," `-1.0` for "full power in reverse," `0.0` for "stop." In WPILib, this is what a plain `motor.set(speed)` call
does, and it's almost always the very first way any FRC programmer commands a motor.

## What "Percent" Actually Means

Under the hood, this is a **duty cycle**: the motor controller switches the full battery voltage on and off very
quickly, and "50% output" just means the switch is on for half of every cycle. A brushless motor controller running
trapezoidal or sinusoidal commutation does the equivalent thing across its phases, but the idea is identical,
percent output scales *how much* of the available battery voltage actually reaches the motor, moment to moment.
This same switching trick shows up again from two different angles later on, as the actual PWM voltage-control
mechanism inside a [brushed motor](../motors/BRUSHED_MOTORS.md#controlling-speed-pwm-and-the-h-bridge), and as a
general-purpose signal for talking to hardware in the [Hardware Communication](../hardware_communication/HARDWARE_COMMUNICATION.md)
addendum.

$$
V_{motor} \approx \text{percent} \times V_{battery}
$$

## Why "Percent" Is a Deceptive Name

Here's the catch this whole section exists to fix: that equation has $V_{battery}$ in it, and the battery's voltage
is not constant. A fully charged battery might sit near 13 volts; a battery that's been driving four motors hard for
two minutes might sag to 9 volts or lower under load. Command `0.5` on a fresh battery and a nearly dead one, and the
*voltage* the motor actually receives, and therefore its actual speed, is different both times, even though the code
asked for the exact same thing.

That's not a bug, it's simply what "percent of whatever's currently available" means. Percent output is perfectly
fine for anything a human is actively correcting in real time, like driving with a joystick, since a driver
naturally compensates for a robot that feels a little sluggish. It's a poor choice for anything that needs to behave
*consistently*, run after run, battery after battery, which is exactly the problem
[Voltage Control](./VOLTAGE_CONTROL.md) solves.
