# 📶 NetworkTables

:::caution Living Documentation
APIs and control systems change season to season, and sometimes mid-season. Specific class names, file paths, and
code examples throughout this section reflect FRC 190's codebase at the time of writing and may become outdated or
obsolete as WPILib, CTRE, and other vendor libraries evolve. Treat this section as a guide to the underlying
concepts, not a guaranteed match to the current source.
:::

[Ethernet](../controls/hardware_communication/ETHERNET.md) is what physically carries data between the roboRIO, a
Driver Station laptop, and any coprocessors mounted on the robot, but wiring alone doesn't define what the bytes
flowing over it actually *mean*. **NetworkTables** is the application-level protocol FRC builds on top of that wiring:
a shared, real-time key-value store that lets robot code, dashboards, and coprocessors exchange typed data without
each piece of software having to invent its own wire format.

## The Problem It Solves

Without a shared protocol, every dashboard would need its own bespoke way to ask the robot "what's the current
elevator height?" and every coprocessor would need its own way to report "here's the vision-detected robot pose,"
and robot code would need to speak all of them. NetworkTables sidesteps that entirely: robot code just *publishes* a
named value, `Elevator/HeightMeters`, and anything else on the network, a dashboard, a log viewer, another
coprocessor, can *subscribe* to that exact name and receive updates the instant it changes, with no coordination
required beyond agreeing on the name.

## Topics: A Shared, Hierarchical Namespace

Every piece of data lives under a **topic**, a string path that looks like a filesystem, `/SmartDashboard/Autonomous
Chooser` or `/Vision/FrontCamera/TargetPose`. The leading segments group related topics together the same way
folders group related files, and dashboards like Shuffleboard or Elastic use exactly that structure to automatically
organize what they display, a topic under `/SmartDashboard/` shows up in the SmartDashboard tab without any manual
configuration. Every topic also carries a fixed **type** (boolean, double, string, or arrays of each, plus a raw
byte-array type for anything more complex), set the first time it's published.

## Publish/Subscribe, Not Request/Response

NetworkTables is built around **pub/sub**, not the request-response pattern a typical web API uses. A publisher
doesn't wait to be asked for a value, it announces the topic once and then pushes a new value, timestamped, every
time one is available. A subscriber doesn't have to poll for changes either, it registers interest in a topic (or an
entire prefix, like everything under `/Vision/`) and gets notified as updates arrive. That matches exactly the kind
of data flowing across a robot's network: sensor readings, subsystem states, and dashboard controls all change
continuously, and every consumer wants the *latest* value as soon as it exists rather than having to ask again and
again.

## Client/Server Roles

One participant on the network is the **server**, holding the authoritative copy of every topic, and every other
participant is a **client**, publishing and subscribing to that server. On a normal FRC robot, the **roboRIO is
always the server**: it's reachable at a predictable address on the robot's network derived directly from the team
number, so every dashboard and coprocessor knows exactly where to connect using nothing but that number. Robot code,
a Shuffleboard instance on the Driver Station laptop, and a vision coprocessor's code can all publish and subscribe
simultaneously, the server fans updates out to every interested client, and a client publishing a new value is
exactly as valid as the server doing so, "server" here just means "knows where everyone else is," not "the only one
allowed to write."

## NT3 vs. NT4

The protocol has gone through a couple of major revisions. **NT3**, the legacy version, ran as a custom binary
protocol directly over raw TCP on port 1735. **NT4**, the current version, runs over **WebSockets** (a protocol for
long-lived, bidirectional messaging, itself built on top of TCP) on port 5810. Building on WebSockets instead of a
fully custom protocol got NT4 a few concrete improvements: proper per-value timestamps (so a subscriber can tell
exactly when a value changed, not just when it happened to receive it), support for many more simultaneous clients,
and the ability for *any* client to publish, not just the server, both of which NT3 handled far more awkwardly.

## Using It From Robot Code

Robot code reaches NetworkTables through `NetworkTableInstance`, WPILib's entry point to the whole system:

```java
NetworkTableInstance inst = NetworkTableInstance.getDefault();
NetworkTable table = inst.getTable("SmartDashboard");

// Publish a value
DoublePublisher heightPub = table.getDoubleTopic("Elevator/HeightMeters").publish();
heightPub.set(1.25);

// Subscribe to a value
DoubleSubscriber setpointSub = table.getDoubleTopic("Elevator/SetpointMeters").subscribe(0.0);
double setpoint = setpointSub.get();
```

In practice, most 190 subsystem code doesn't call this API directly for telemetry. `Logger.recordOutput(key, value)`,
covered in [Logging](./LOGGING.md), publishes to NetworkTables automatically as a side effect of recording a value
for replay, which is why a value logged for replay also shows up live on a dashboard with no extra code. Calling the
API above directly still matters for anything that isn't already flowing through the logging framework, dashboard
*inputs* like autonomous choosers, in particular, since those are values the dashboard publishes and robot code
subscribes to, the reverse direction of most telemetry.

## Where This Shows Up Next

Because NetworkTables runs over TCP, it inherits TCP's reliability, but not TCP's speed, a subscriber sees a value
only after it's actually arrived and been reassembled, which takes measurably longer than the raw wire time. That
delay matters a great deal for vision, a camera's target detection is only useful if robot code knows how *old* the
reading is by the time it arrives, which is exactly where the story continues in
[Vision & Localization](../vision_localization/LATENCY.md).
