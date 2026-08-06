# UART: Serial Communication

Sending data one bit after another down a single wire, in order, is called **serial** communication (as opposed to
**parallel** communication, which uses a separate wire for each bit and sends them all at once). A **UART**
(Universal Asynchronous Receiver/Transmitter) is one of the simplest serial links: two wires, one for each direction
(**TX**, transmit, and **RX**, receive), each independently carrying a stream of bits.

"Asynchronous" means the two devices don't share a clock wire to keep them in lockstep, instead, they simply agree
in advance on a speed (the **baud rate**, in bits per second), and the sender wraps each byte in a **start bit** and
one or more **stop bits** so the receiver can tell where a new byte begins even without a shared clock. Many UARTs
can also add an optional **parity bit**, right before the stop bit(s): a single extra bit set so the total number of
`1` bits in the byte is always even (or always odd, depending on configuration), which gives the receiver a cheap,
if limited, way to notice if a single bit got flipped in transit.

<img src="https://upload.wikimedia.org/wikipedia/commons/5/53/UART-signal.png"
alt="A UART frame: a start bit, followed by the data bits of one byte, followed by stop bits"
width="480"
/>

*Source: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:UART-signal.png)*

For more details and specifics, [see here](https://learn.sparkfun.com/tutorials/serial-communication)

## How Fast Is It, Really?

Baud rate directly sets how long each bit takes to send: at a baud rate of $B$ bits per second, one bit occupies
$1/B$ seconds. A commonly used rate like 9600 baud, for example, gives each bit about 104 microseconds, so an entire
byte, with its start bit, 8 data bits, and a stop bit (10 bits total), takes a little over 1 millisecond to send.
Push the baud rate higher and every bit gets proportionally shorter, but both ends still have to agree on the exact
same rate ahead of time, since neither side has a shared clock to fall back on if they disagree.

## Where UART Falls Short

UART is bidirectional and needs only two data wires, but it's still strictly point-to-point, one UART port talks to
exactly one other device. On the robot, it shows up occasionally for older sensors and debug consoles, but it's been
largely replaced by the busses described on the following pages for anything that needs to share wiring across
several devices, starting with [SPI](./SPI.md), which adds a shared clock wire.
