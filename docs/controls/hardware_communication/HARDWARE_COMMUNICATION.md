# 📟 Hardware Communication

Everything earlier in this section, commutation, current, voltage, PID loops, motion profiles, has quietly assumed
that a command like "set this voltage" or "here's the current position" can just get from the roboRIO to a motor
controller and back. This addendum is about how that actually happens: the robot controller never touches a motor's
windings or a sensor's internals directly, it just sends and receives electrical signals over wires, and the robot
uses several different "languages" to do that, depending on what's being said and to how many devices at once:

1. [PWM: Pulse Width Modulation as a Command](./PWM.md), the simplest possible signal, and where it starts to fall
   short.
2. [UART: Serial Communication](./UART.md), sending data one bit at a time, in both directions.
3. [SPI: Serial Peripheral Interface](./SPI.md), adding a clock wire to talk to several devices, fast.
4. [I2C: Inter-Integrated Circuit](./I2C.md), trading speed for using as few wires as possible.
5. [CAN Bus: Controller Area Network](./CAN_BUS.md), a shared, noise-resistant bus every device on the robot can
   talk on at once.
6. [Ethernet](./ETHERNET.md), the wired network used when a robot needs to move real amounts of data.
7. [Comparing the Protocols](./COMPARISON.md), how all six trade off against each other, and where they show up.

## Digital Signals and Duty Cycle

Almost everything on the robot communicates **digitally**: a wire's voltage is read as meaningfully only one of two
states, **high** (close to the device's operating voltage, read as a `1`) or **low** (close to 0 volts, read as a
`0`). There's no "half," the way there might be with a dimmer switch; the signal is either on or off, over and over,
many times a second.

A signal that repeatedly switches between high and low is called **periodic**, and one full high-then-low cycle is
called its **period**. The fraction of that period the signal spends high is its **duty cycle**, a 25% duty cycle
signal is high for a quarter of each period and low for the rest.

<img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/Duty_Cycle_Examples.png"
alt="Three digital signals at different duty cycles: mostly low, evenly split, and mostly high"
width="420"
/>

*Source: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Duty_Cycle_Examples.png)*

Duty cycle matters because it's a simple way to smuggle an *analog*, in-between value (like "37% speed") through a
wire that can only ever be fully on or fully off. Every protocol described on the following pages is, at some level,
just a more organized way of switching a wire between high and low, start with [PWM](./PWM.md) to see the simplest
example.
