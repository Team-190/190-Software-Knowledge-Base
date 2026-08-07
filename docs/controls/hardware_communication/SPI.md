import useBaseUrl from '@docusaurus/useBaseUrl';

# SPI: Serial Peripheral Interface

**SPI** (Serial Peripheral Interface) fixes [UART's](./UART.md) "agree on a speed in advance" problem by adding a
dedicated clock wire, making it **synchronous**: the controlling device (the **controller**) toggles a clock line
(**SCLK**), and every other device (a **peripheral**) reads or writes exactly one bit on every clock tick, so there's
never any ambiguity about timing. A basic SPI link uses four wires: **SCLK** (clock), **MOSI** (Controller Out,
Peripheral In), **MISO** (Controller In, Peripheral Out), and **CS** (Chip Select).

<img
src={useBaseUrl("img/images/hardware_communication/spi-single-peripheral.svg")}
alt="A single SPI controller connected to a single peripheral device over SCLK, MOSI, MISO, and CS"
width="380"
/>

For more details and specifics, [see here](https://learn.sparkfun.com/tutorials/serial-peripheral-interface-spi)

## How a Bit Is Actually Transferred: Clock Edges

Every clock cycle has two edges, one where SCLK switches away from its resting level, and one where it switches
back. SPI splits the job of moving one bit between those two edges: on one edge a device shifts its next bit onto
MOSI or MISO, and on the other edge the receiving device samples whatever voltage is sitting on the wire at that
instant. Two settings decide exactly which edge does which job. **Clock polarity (CPOL)** picks which voltage the
clock rests at between bits, low or high. **Clock phase (CPHA)** picks whether a bit is sampled on the first edge of
each cycle (with the next bit shifted out on the second edge) or shifted out on the first edge and sampled on the
second. Both devices on the link have to agree on both settings, since a bit sampled on the wrong edge is just a
guess at whatever the line happened to be doing at that instant.

<img src="https://upload.wikimedia.org/wikipedia/commons/f/f0/SPI_timing_diagram_CS.svg"
alt="SPI timing diagram showing SCLK for both clock polarities, and MOSI/MISO/CS for both clock phases, with bits numbered 7 down to 0"
width="480"
/>

*Source: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:SPI_timing_diagram_CS.svg)*

## Talking to Multiple Peripherals

Because SCLK, MOSI, and MISO can all be shared, adding more devices is cheap: give each one its own CS wire, and the
controller simply pulls a device's CS line low right before talking to it, so only that one device listens while the
others ignore the bus entirely.

<img
src={useBaseUrl("img/images/hardware_communication/spi-multi-peripheral.svg")}
alt="One SPI controller and three peripheral devices sharing SCLK, MOSI, and MISO, each with its own dedicated CS line"
width="420"
/>

## Speed

SPI has no single fixed maximum speed the way [UART](./UART.md#how-fast-is-it-really) has a baud rate, since a bit
moves on every clock edge, the practical ceiling just comes down to how fast a given controller, peripheral, and set
of wires can all reliably switch, commonly anywhere from a few megahertz up into the tens of megahertz. The
roboRIO's onboard SPI port can talk to up to four peripherals at once (one per CS line), and its MXP expansion port
adds an independent clock and data lines plus an additional CS, for teams that need to wire up more than that.

SPI is fast and simple to implement, which is why it's a common choice for onboard sensors that need to be read
quickly and often, like gyroscopes.

[I2C](./I2C.md) makes the opposite trade: fewer wires, at the cost of speed.
