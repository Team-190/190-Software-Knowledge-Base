# CAN Bus: Controller Area Network

Every protocol covered so far still has one controller (the roboRIO) directing one or more listeners. **CAN**
(Controller Area Network) is different: it's a true **multi-drop bus**, where every device, the roboRIO, motor
controllers, the Power Distribution Hub, the Pneumatics Control Module, CAN-based sensors, etc. connects to the *same*
two-wire cable in parallel, and any device can send a message that every other device on the bus hears.

## Wiring: Sending Data Over Just Two Wires

Physically, the CAN bus is one cable daisy-chained through every device on the robot, capped at each end with a
**termination resistor** that prevents electrical reflections from corrupting the signal.

<img src="https://upload.wikimedia.org/wikipedia/commons/9/9e/CAN-Bus_Elektrische_Zweidrahtleitung.svg"
alt="A CAN bus: several nodes daisy-chained along one two-wire cable, terminated with a resistor at each end"
width="420"
/>

*Source: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:CAN-Bus_Elektrische_Zweidrahtleitung.svg)*

That cable carries exactly two wires, **CAN High** and **CAN Low**, and every single bit CAN ever sends has to be
represented as a voltage on those same two wires. At **rest**, called the **recessive** state (a `1`), no device is
driving the bus at all, the termination resistors above just passively pull both wires to the same resting voltage,
roughly 2.5 V each, so the *difference* between them is close to 0 V. To send a **dominant** bit (a `0`), a device
actively drives CAN High up toward about 3.5 V and CAN Low down toward about 1.5 V, opening up a difference of
around 2 V. A receiver doesn't need to know either wire's exact voltage, it just measures the *difference* between
them, and if that difference is large enough (comfortably above the roughly 0.5 V of noise margin CAN allows for),
it reads a dominant `0`; otherwise, it reads a recessive `1`.

One consequence of this falls out for free: a dominant bit is *actively* driven, while a recessive bit is only
*passively* held. So if two devices drive the bus at the same instant, and one sends a dominant bit while the other
sends a recessive one, the actively-driven dominant bit physically overpowers the passively-held recessive one, and
the bus reads as dominant. That's not a rule anyone had to program in, it's just electricity, and it's the entire
mechanism [collision resolution](#resolving-collisions) relies on further down this page.

Only one bit can be on the wire at any given instant, so an entire frame has to go out one bit after another rather
than all at once, but "one bit at a time" is a lot faster than it sounds. FRC's CAN bus runs at 1 megabit per
second, so each individual bit only takes about **1 microsecond**, one millionth of a second, to send. A complete
frame, every field covered in [The CAN Frame](#the-can-frame) below, adds up to only a few dozen bits, so a whole
message typically finishes in well under 50 microseconds. That leaves room for thousands of separate CAN messages
every single second, even though every one of them is still, physically, nothing more than a long string of
individual bits sent one at a time.

## The CAN Frame

Every device is physically capable of driving the same two wires at any moment, so CAN can't just let devices dump
raw, unstructured bits onto the bus, every device needs to agree on exactly how a message is packaged, so a
receiver can tell where one message ends and the next begins, and pull the right information back out. That package
is called a **frame**, and it's built from several fields, each with its own job.

<img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/CAN-Bus-frame_in_base_format_without_stuffbits.svg"
alt="A complete CAN frame broken into its fields: start of frame, arbitration ID, control field, data bytes, CRC, ACK slot, and end of frame"
width="620"
/>

*Source: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:CAN-Bus-frame_in_base_format_without_stuffbits.svg)*

Reading left to right:

- **Start of Frame (SOF)**, a single bit that flips the bus from idle to busy, telling every other device "a message
  is starting right now."
- **Arbitration field**, the message's **identifier** (11 bits in the "base" format shown above; FRC devices
  actually use an extended, 29-bit identifier that packs in a device type, manufacturer code, API class and index,
  and device number, all in this same field, see WPILib's
  [FRC CAN Device Specifications](https://docs.wpilib.org/en/stable/docs/software/can-devices/can-addressing.html)
  for the exact breakdown). This ID is what every other device reads to decide whether the message is meant for
  them, and it's also what decides *priority*, more on that in [Resolving Collisions](#resolving-collisions).
- **Control field**, includes the **Data Length Code (DLC)**, four bits that tell the receiver exactly how many
  data bytes are about to follow, so it knows when the data field ends without needing to count them itself.
- **Data field**, the actual payload, anywhere from 0 to 8 bytes, carrying whatever the message is actually about
  (a voltage setpoint, an encoder reading, a temperature, and so on).
- **CRC field**, a checksum computed from everything before it. The receiver recomputes the same checksum on its
  end and compares; if they don't match, the data was corrupted in transit and the receiver throws the frame away.
- **ACK slot**, a single bit that starts out recessive (the sender doesn't drive it low), but *any* device that
  received the frame correctly overwrites it with a dominant bit, letting the sender know at least one device on the
  bus heard the message intact.
- **End of Frame (EOF)**, a fixed run of bits marking that the message is over, followed by a brief gap
  (**Inter-Frame Spacing**) before the bus is free for the next message.

:::note
Classic CAN caps every frame at 8 data bytes. Newer FRC hardware, like Kraken motors and CTRE's CANivore, supports
**CAN FD** (Flexible Data-Rate), an extension that allows much larger data fields, up to 64 bytes, and a faster
data-phase bit rate, so a single frame can carry far more telemetry at once.
:::

## Noise Resistance

Sending a bit as a *difference* between two wires, rather than as a single wire's voltage relative to ground, is
called **differential signaling**, and it's where CAN gets its noise resistance from. CAN High and CAN Low always
carry the same signal but inverted from each other, so if electrical noise (and a robot full of motors makes plenty)
adds a stray voltage onto the cable, it lands on both wires equally. Since a receiver only ever looks at the
*difference* between CAN High and CAN Low, that shared noise cancels out of the measurement entirely, leaving the
actual dominant/recessive voltage gap from the [Wiring](#wiring-sending-data-over-just-two-wires) section intact
even in a very electrically noisy environment.

<img src="https://upload.wikimedia.org/wikipedia/commons/1/1a/ISO11898-2.svg"
alt="CAN High and CAN Low signaling: two inverted signals whose difference encodes the bit, canceling out shared noise"
width="420"
/>

*Source: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:ISO11898-2.svg)*

## Resolving Collisions

Because CAN is a shared bus, it's entirely possible for two devices to start sending a frame at the exact same
instant. Rather than detecting that collision after the fact and making both sides wait and retry (the way older
shared-medium networks did), CAN resolves it bit by bit, live, as the identifier field is being sent, a process
called **arbitration**.

Every device transmitting listens to the bus while it sends its own identifier bit by bit, comparing what it *sent*
to what actually appears on the bus. As soon as a device sends a recessive bit but sees a dominant bit on the bus
instead (dominant winning is exactly the electrical behavior described back in
[Wiring](#wiring-sending-data-over-just-two-wires)), it knows some other device is sending an ID with a `0` in that
position, meaning that other message has a numerically lower ID, so it immediately stops transmitting and waits
for the bus to go idle again, without ever corrupting the frame that's still going out. The message with the lower
numeric ID simply keeps going, uninterrupted, which is why lower IDs are treated as higher priority: they win
arbitration every time.

:::note
This is also why a CAN frame contains a few extra "stuff bits" not shown in the frame diagram above: to guarantee
every device's clock stays in sync, CAN inserts an opposite-polarity bit any time five identical bits in a row would
otherwise appear on the wire, and receivers automatically remove them again once the frame is decoded.
:::

Put together, this is what makes CAN the backbone of a modern FRC electrical system: because it's bidirectional,
the roboRIO can send a motor controller a voltage, velocity, or position setpoint, and that same controller can talk
back with its encoder position, current draw, temperature, and any fault codes, all as separate frames on the same
two wires. Separately from the message ID's role in arbitration, every physical device is also configured with its
own unique **device ID**, so software running on the roboRIO can tell, say, the left drivetrain motor controller
apart from the right one. Robust, bidirectional, and as easy to expand as splicing a new device into the chain and
giving it a unique ID, this combination is why CAN carries most of the traffic on a modern FRC robot.

None of the protocols covered so far are built to move a lot of data quickly. [Ethernet](./ETHERNET.md) is.
