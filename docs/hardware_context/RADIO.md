# 📡 Robot Radio

The Robot Radio is responsible for all wireless communication between the robot and the field. Every FRC robot uses a dedicated radio configured specifically for competition use, allowing the robot to communicate with the Driver Station, Field Management System (FMS), and any coprocessors or network devices mounted on the robot.

The robot radio creates the robot's local network and acts as the bridge between wired Ethernet devices on the robot and the wireless field network used during matches.

The current robot radio used in FRC is manufactured by a company called Vivid Hosting, and features 2.4, 5, and 6 GHz network connectivity capabilities.

For more information about networking and communication protocols see COMMUNICATION_PROTOCOLS

## Tips, Tricks, and Documentation
### Radio Configuration

Before a robot radio can be used in competition, it must be configured using the official FRC Radio Configuration Utility. This utility sets the radio's firmware, team number, wireless settings, and competition configuration. This configuration will occur at a competition before robots can connect to the field.

Radios also need to be configured for use in non-competition environments too. Radio configuration documentation is located here:

https://frc-radio.vivid-hosting.net/overview/programming-your-radio-at-home

https://docs.wpilib.org/en/stable/docs/zero-to-robot/step-3/radio-programming.html

### Powering the Radio

Unexpected radio reboots are one of the most common causes of robot disconnects during matches. Loose connectors, damaged Ethernet cables, or inadequate strain relief can all cause intermittent communication failures.

#### To improve reliability:

* Ensure power connector has no loose strands
* Use short, high-quality Ethernet cables
* Mount the radio on a metal part of the robot to act as a heat sync
* Mounting locations should be unobstructed so the radio can freely communicate with the field
* Avoid sharply bending Ethernet cables near connectors

#### Ethernet Devices

Most modern FRC robots connect multiple devices through the radio's **aux** ports or an Ethernet switch. Common Ethernet devices include:

- Vision coprocessors
- Networked cameras
- Additional network switches

### Technical Specifications
https://frc-radio.vivid-hosting.net/tech-specs/overview