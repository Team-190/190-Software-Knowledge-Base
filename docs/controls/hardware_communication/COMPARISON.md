# Comparing the Protocols

| Protocol | Wires                  | Topology                          | Bidirectional? | Typical FRC use                                   |
|----------|-------------------------|------------------------------------|-----------------|-----------------------------------------------------|
| [PWM](./PWM.md)      | 1 signal + power + gnd | Point-to-point                     | No              | Legacy speed controllers, servos                    |
| [UART](./UART.md)     | 2 (TX, RX)              | Point-to-point                     | Yes             | Older sensors, debug consoles                       |
| [SPI](./SPI.md)      | 4 (+1 per extra device) | Controller with per-device select  | Yes             | Fast onboard sensors (e.g. gyroscopes)               |
| [I2C](./I2C.md)      | 2 (shared by all)       | Multi-drop, address-based          | Yes             | Simple sensors (used sparingly, see above)          |
| [CAN](./CAN_BUS.md)  | 2 (differential pair)   | Multi-drop bus                     | Yes             | Motor controllers, PDH, PCM, most modern FRC devices |
| [Ethernet](./ETHERNET.md) | Twisted-pair, multiple  | Packet-switched network            | Yes             | Radio uplink, vision coprocessors, NetworkTables     |

Notice the trend moving down the table: each protocol trades away either wire count or simplicity to gain more
devices, more speed, or a way for those devices to talk back, which is exactly the kind of trade-off worth keeping
in mind while reading [Motors and Commutation](../motors/MOTORS.md), where the same "one wire, one direction" PWM
signal from earlier in this section gets replaced by CAN as motor controllers get smarter.
