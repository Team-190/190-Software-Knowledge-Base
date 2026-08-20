# 🧰 FRC Hardware

:::caution Living Documentation
APIs and control systems change season to season, and sometimes mid-season. Specific class names, file paths, and
code examples throughout this section reflect FRC 190's codebase at the time of writing and may become outdated or
obsolete as WPILib, CTRE, and other vendor libraries evolve. Treat this section as a guide to the underlying
concepts, not a guaranteed match to the current source.
:::

[Robot Code Architecture](./ROBOT_CODE_ARCHITECTURE.md) covered how 190's code is *organized*. This page covers what
that code actually talks to: the specific motors, encoders, and sensors 190 bolts onto its robots, and the CTRE
Phoenix 6 Java API used to configure them, read from them, and command them. The underlying physics (how a motor
actually spins, why current limits matter, what a PID loop is doing) is covered in depth in
[Controls](../controls/INTRODUCTION_TO_CONTROLS.md). This page stays at the "what device is this, and what does the
code that drives it look like" level, and links back to Controls wherever the deeper *why* lives.

## Motors

### What Are They?

A motor is the only thing on the robot that turns electrical energy into mechanical motion. Every mechanism, from a
swerve module to a single roller, ultimately reduces to "spin a motor, then gear/link/belt that rotation into the
motion you actually want." [Motors and Commutation](../controls/motors/MOTORS.md) builds up *why* a motor spins from
physics principles; what matters here is that 190 exclusively uses **brushless** motors with an integrated smart motor
controller, meaning the controller itself (not the roboRIO) handles commutation, and the roboRIO instead sends it a
high-level command over CAN (a voltage, a velocity, a position) and reads back telemetry the same way. That's the
**TalonFX** family of controllers, and the motor bolted to one is either a Kraken X60 or a Kraken X44.

### Kraken X60 / X44

Both Krakens ship with a Talon FX controller built directly onto the back of the motor, so "Kraken" and "TalonFX" are
often used interchangeably in 190's code. The ```TalonFX``` class in Phoenix 6 is the object representing the whole
motor + controller unit, regardless of which physical motor is attached.

| Spec (Trapezoidal / Six-Step) | Kraken X60 | Kraken X44 |
|---|---|---|
| Free Speed         | 6,000 RPM | 7,758 RPM |
| Stall Torque        | 7.09 N·m  | 4.11 N·m  |
| Stall Current        | 366 A     | 279 A     |
| Free Current        | 2 A       | 3 A       |
| Peak Power        | 1,108 W   | 835 W     |

| Spec (FOC)                | Kraken X60 | Kraken X44 |
|---|---|---|
| Free Speed         | 5,800 RPM | 7,368 RPM |
| Stall Torque        | 9.37 N·m  | 5.01 N·m  |
| Stall Current        | 483 A     | 329 A     |
| Peak Power        | 1,405 W   | 966 W     |

The X60 is the larger, higher-torque motor and is 190's default choice for drivetrains and any mechanism that needs
serious power (shooters, elevators). The X44 is a smaller, lighter, higher-RPM motor sized for mechanisms with less
demanding torque requirements (turrets, intakes, indexers) where the extra free speed and reduced weight matter more
than raw stall torque. In code, both are constructed identically, ```new TalonFX(canId, canBus)```. The difference
is purely physical and shows up only in gearing and gains, never in which classes get used.

:::note
Notice the FOC rows show *higher* stall torque and power than trapezoidal, but slightly *lower* free speed. That
tradeoff, and why [Field-Oriented Control](../controls/motors/FIELD_ORIENTED_CONTROL.md) exists at all, is covered in
the Controls section. In 190's code, FOC is enabled per-request with ```.withEnableFOC(true)``` on a voltage or
velocity control request, or by picking an ```...FOC``` control request class outright (```TorqueCurrentFOC```,
```VelocityTorqueCurrentFOC```, ```MotionMagicTorqueCurrentFOC```).
:::

### Motor Curves

Every row in the tables above is really one *point* pulled off a much richer picture: a **motor curve**, plotting
torque, current, power, and efficiency across the motor's entire operating range, from stall to free speed. Reading
one tells you how a mechanism will actually behave anywhere between those two extremes, not just at the edges, and
it's also where a current limit and a torque limit turn out to be the same thing. That's covered fully, with the
actual Kraken X60 and X44 curves, in
[Torque, Current, Speed, and Voltage](../controls/motors/MOTOR_CHARACTERISTICS.md#reading-a-motor-curve).

## Encoders

### What Are They?

An encoder measures a shaft's rotation and reports it back over CAN as a position and/or velocity. Every closed-loop
behavior in 190's code, from a shooter holding an RPM to a linkage holding an angle, depends on an encoder telling
the code how close it currently is to the goal; see
[Closed Loop Control](../controls/closed_loop_control/CLOSED_LOOP_CONTROL.md) for how that feedback actually gets
turned into a corrective output.

Every TalonFX already has an encoder built in, measuring the *motor's own rotor*. That's enough for most mechanisms,
but it's only accurate downstream of any belt, chain, or linkage if nothing ever slips, and it always reads relative
position, resetting to whatever value it happened to have on power-up rather than the mechanism's true, physical
angle. When a mechanism needs an **absolute**, slip-proof position instead, 190 adds a CANcoder.

### CANcoder

A CANcoder is a standalone magnetic rotary encoder: a small magnet is mounted to the shaft being measured, and the
CANcoder senses that magnet's orientation and reports an absolute position and velocity over CAN, independent of any
gearing between it and a motor. Because it reads the mechanism's shaft directly rather than the motor's, it isn't
affected by belt slip or backlash the way a motor's built-in encoder is, and because it's magnetic rather than
contact-based, its absolute position survives a power cycle.

190's most common use for a CANcoder is swerve module steering: each module's ```SwerveModuleIOTalonFX``` wires its
turn ```TalonFX``` to read its position directly from that module's ```CANcoder``` instead of its own internal rotor
encoder, using the ```Feedback``` config's ```FeedbackSensorSource```:

<details>
<summary>Show code</summary>

```java
cancoder = new CANcoder(constants.EncoderId, driveConstants.driveConfig.canBus());

turnConfig.Feedback.FeedbackRemoteSensorID = constants.EncoderId;
turnConfig.Feedback.FeedbackSensorSource =
    switch (constants.FeedbackSource) {
      case RemoteCANcoder -> FeedbackSensorSourceValue.RemoteCANcoder;
      case FusedCANcoder -> FeedbackSensorSourceValue.FusedCANcoder;
      case SyncCANcoder -> FeedbackSensorSourceValue.SyncCANcoder;
      default -> throw new IllegalArgumentException("Unexpected value: " + constants.FeedbackSource);
    };
turnConfig.Feedback.RotorToSensorRatio = constants.SteerMotorGearRatio;
```

</details>

That's what makes it possible for a swerve module to boot up already knowing exactly which way its wheel is pointed,
without ever having to re-home against a mechanical stop.

## Range Sensors

### What Are They?

A range sensor measures distance to whatever's in front of it, rather than a shaft's rotation. On 190's robots,
they're mostly used the way a limit switch or a beam-break would be on a simpler robot, to answer "is a game piece
here?" or "has this mechanism reached a hard stop?", but without needing a mechanical switch that can wear out or a
beam-break that only works across a fixed, pre-drilled gap.

### CANrange

CANrange is CTRE's CAN-connected **time-of-flight (ToF)** sensor: it fires a laser pulse and times how long it takes
to bounce back off a surface in front of it, converting that time directly into a distance measurement.

| Spec | Value |
|---|---|
| Range (short mode)  | up to 100 cm |
| Range (long mode)   | up to 300 cm |
| Sample rate     | 5 to 100 Hz, configurable |

Because it measures a real distance rather than a simple on/off contact, it can be read two ways in code: as a raw
distance signal for something like "how far is this game piece from being fully seated," or reconfigured through its
device config to behave like a plain digital proximity switch, tripping true/false once the measured distance crosses
a configurable threshold, for the simpler "is something there or not" case a beam-break would traditionally handle.

## CTRE API

Every Kraken, CANcoder, and CANrange on the robot is programmed through the same Phoenix 6 Java API, and every device
wrapper class in 190's code (```TurretIOTalonFX```, ```SwerveModuleIOTalonFX```, etc, see
[Hardware Abstraction](./HARDWARE_ABSTRACTION.md) for where these live) follows the same three-part pattern to do it:
a **configuration object** sets the device up once, **status signals** read telemetry back from it every loop, and
**control requests** tell it what to do.

### Configuration Objects

A configuration object (```TalonFXConfiguration```, ```CANcoderConfiguration```, ...) is a plain data object that
describes everything about how a device should behave: current limits, gear ratios, PID/feedforward gains (in up to
two independently-selectable **gain slots**, ```Slot0``` and ```Slot1```), motion profiling constraints, which
sensor to use for feedback, and more. It's built up once, then pushed to the physical device with
```device.getConfigurator().apply(...)```:

<details>
<summary>Show code</summary>

```java
talonFXConfiguration = new TalonFXConfiguration();
talonFXConfiguration.MotorOutput.withInverted(constants.leaderInversion);
talonFXConfiguration
    .CurrentLimits
    .withSupplyCurrentLimit(constants.currentLimit.supplyCurrentLimit())
    .withSupplyCurrentLimitEnable(true)
    .withStatorCurrentLimit(constants.currentLimit.statorCurrentLimit())
    .withStatorCurrentLimitEnable(true);
talonFXConfiguration
    .Slot0
    .withKP(constants.voltageGains.kP().getAsDouble())
    .withKD(constants.voltageGains.kD().getAsDouble())
    .withKS(constants.voltageGains.kS().getAsDouble())
    .withKV(constants.voltageGains.kV().getAsDouble())
    .withKA(constants.voltageGains.kA().getAsDouble());
talonFXConfiguration.Feedback.SensorToMechanismRatio = constants.gearRatio;

PhoenixUtil.tryUntilOk(5, () -> talonFX.getConfigurator().apply(talonFXConfiguration, 0.25));
```

</details>

That last line is worth noticing: applying a config is a CAN request that can silently fail to land (a busy bus, a
device that hasn't finished booting), so 190 never calls ```apply(...)``` directly. Every device wrapper goes
through ```PhoenixUtil.tryUntilOk```, which just retries the same call until it reports success or a retry budget
runs out. The gains set here are exactly the ```kP```/```kI```/```kD```/```kS```/```kV```/```kA``` terms from
[PID Tuning](../controls/closed_loop_control/PID_TUNING.md) and
[Feedforward](../controls/open_loop_control/FEEDFORWARD.md). The configuration object is simply where those tuned
constants actually get handed to the hardware.

### Status Signals

Every readable value on a device (position, velocity, applied voltage, supply current, temperature, closed-loop
error) comes back as a ```StatusSignal<T>```, a typed, cached handle to that one field rather than a one-off reading.
A signal only actually reflects new data once it's been refreshed, and 190 refreshes every signal on the robot
together, once per loop, rather than one at a time:

<details>
<summary>Show code</summary>

```java
positionRotations = talonFX.getPosition();
velocityRotationsPerSecond = talonFX.getVelocity();

BaseStatusSignal.setUpdateFrequencyForAll(1 / GompeiLib.getLoopPeriod(), statusSignals);
PhoenixUtil.registerSignals(constants.canBus.isNetworkFD(), statusSignals);
talonFX.optimizeBusUtilization();
```

```java
// PhoenixUtil, called once from Robot.robotPeriodic()
public static void refreshAll() {
  if (canivoreSignals.length > 0) BaseStatusSignal.refreshAll(canivoreSignals);
  if (rioSignals.length > 0) BaseStatusSignal.refreshAll(rioSignals);
}
```

</details>

Batching every signal into one ```BaseStatusSignal.refreshAll(...)``` call (split by which physical CAN bus a device
sits on) pulls every value across the wire in one synchronized round-trip instead of many separate ones, which is
both faster and guarantees every reading a subsystem sees on a given loop was captured at the same instant.
```setUpdateFrequencyForAll``` plus ```optimizeBusUtilization()``` then trims every *other* signal the device would
otherwise stream unprompted, keeping the CAN bus from getting saturated with telemetry nobody registered for. Once
refreshed, a signal's value is read with ```.getValue()``` or ```.getValueAsDouble()```, and compared against a goal
with ```.isNear(reference, tolerance)```, which is what most ```atGoal()```-style methods described in
[Subsystem State Management](./SUBSYSTEM_STATE_MANAGEMENT.md) are built on.

### Control Requests (Motors Only)

A control request is the counterpart to a status signal: instead of reading a value back, it commands the motor to
do something, and is sent with ```talonFX.setControl(request)```. Unlike a configuration object, control requests are
meant to be reused and re-sent every loop with updated values (```request.withOutput(...)```,
```request.withVelocity(...)```) rather than rebuilt from scratch. Which request class to reach for lines up directly
with the Controls section's open-loop/closed-loop/motion-profiling split:

| Control Request | Behavior | Related Concept |
|---|---|---|
| ```VoltageOut``` / ```TorqueCurrentFOC``` | Drive at a fixed voltage or current, open loop | [Open Loop Control](../controls/open_loop_control/OPEN_LOOP_CONTROL.md) |
| ```PositionVoltage``` / ```PositionTorqueCurrentFOC``` | Hold a target position, closed loop on-controller | [Closed Loop Control](../controls/closed_loop_control/CLOSED_LOOP_CONTROL.md) |
| ```VelocityVoltage``` / ```VelocityTorqueCurrentFOC``` | Hold a target velocity, closed loop on-controller | [Closed Loop Control](../controls/closed_loop_control/CLOSED_LOOP_CONTROL.md) |
| ```MotionMagicVoltage``` / ```MotionMagicTorqueCurrentFOC``` | Move to a target position along a trapezoidal/S-curve profile | [Motion Profiling](../controls/motion_profiling/MOTION_PROFILING.md) |
| ```NeutralOut``` | Coast or brake, no output at all | n/a |
| ```Follower``` | Mirror another TalonFX's output (aligned or opposed) | n/a |

```PositionVoltage```/```PositionTorqueCurrentFOC``` and ```MotionMagicVoltage```/```MotionMagicTorqueCurrentFOC```
both end at a target position, but only the Motion Magic pair gets there along a profile. A plain position request
asks the on-controller PID loop to close the error immediately, useful for a small, fast correction, while Motion
Magic is what to reach for anywhere the trip is long enough that accelerating and decelerating smoothly actually
matters.

<details>
<summary>Show code</summary>

```java
voltageControlRequest = new VoltageOut(0.0);
velocityControlRequest = new VelocityVoltage(0).withSlot(0);
velocityTorqueCurrentRequest = new VelocityTorqueCurrentFOC(0.0).withSlot(1);

// Open loop
talonFX.setControl(voltageControlRequest.withOutput(voltageGoal).withEnableFOC(constants.enableFOC));

// Closed loop, gains pulled from Slot0
talonFX.setControl(velocityControlRequest.withVelocity(velocityGoal).withEnableFOC(constants.enableFOC));

// Closed loop with a manual feedforward, gains pulled from Slot1
talonFX.setControl(velocityTorqueCurrentRequest.withVelocity(velocityGoal).withFeedForward(currentFeedforward));
```

</details>

The ```.withSlot(...)``` calls on the velocity requests are what select *which* gain slot from the configuration
object above actually gets used for that request. 190 commonly configures ```Slot0``` for voltage-based control and
```Slot1``` for torque-current-based control on the same mechanism, and switches between them per-request rather than
needing two separate motors.
