# 🛞 Odometry

Given the [field frame and robot frame](./COORDINATE_FRAMES.md), the simplest possible way for a robot to know its
own pose is to never lose track of it in the first place: start at a known pose, and continuously add up every small
motion the robot makes since then. That technique, tracking position purely by accumulating measured motion rather
than observing an outside reference, is called **odometry**.

## Measuring Motion

A robot doesn't have a direct sensor for "how far did I just move across the field." What it does have is **wheel
encoders**, which measure how far each wheel has rotated, and typically a **gyroscope**, which measures rotation
directly. Odometry's job is to turn those raw measurements into a small position-and-heading delta for the current
loop, then add that delta onto the previous pose to get the new one.

The exact math for turning wheel rotation into a chassis delta differs by drivetrain, a differential (tank) drive
only needs to know how far the left and right sides each traveled; a swerve drive needs each module's direction
*and* distance; a mecanum drive needs all four wheels' contributions resolved through its own geometry, but WPILib's
`DifferentialDriveKinematics`, `SwerveDriveKinematics`, and `MecanumDriveKinematics` classes all boil that down to
the same result: a small `(Δx, Δy, Δθ)` describing how the chassis moved during the last loop.

## Why Naively Adding Deltas Doesn't Work

The obvious next step, just add `Δx` and `Δy` directly onto the robot's field-frame `x` and `y`, is wrong the moment
the robot is turning while it moves. Over one 20 ms loop, a robot driving in an arc doesn't trace a straight line, it
traces a small curve, and treating that curve as a straight-line step introduces error every single loop. At low
update rates or high turn speed, that error adds up fast.

WPILib's fix is a type called `Twist2d`: rather than treating a loop's motion as an instantaneous jump, a twist
represents the *continuous* velocity that would produce the measured `(Δx, Δy, Δθ)` if held constant for the loop.
Calling `.exp()` on that twist integrates it properly along the resulting arc rather than a straight line,
returning a `Transform2d` that then gets composed onto the previous pose. This is exactly what happens inside
`DifferentialDriveOdometry.update()`, `SwerveDriveOdometry.update()`, and `MecanumDriveOdometry.update()`, which all
share the same underlying `Odometry` base class:

```java
// From WPILib's Odometry base class, called once per loop by each drivetrain's update()
public Pose2d update(Rotation2d gyroAngle, T wheelPositions) {
  var twist = m_kinematics.toTwist2d(m_previousWheelPositions, wheelPositions);
  twist.dtheta = gyroAngle.minus(m_previousGyroAngle).getRadians();
  m_pose = m_pose.plus(twist.exp());
  ...
  return m_pose;
}
```

Robot code itself never touches any of this directly, it just calls `update()` once per loop with fresh sensor
readings and reads back the resulting pose:

```java
// Called once per loop, typically in periodic()
Rotation2d gyroAngle = gyro.getRotation2d();
SwerveModulePosition[] modulePositions = getModulePositions();

odometry.update(gyroAngle, modulePositions);
Pose2d currentPose = odometry.getPoseMeters();
```

:::note
Heading (`θ`) usually comes straight from the gyro rather than being derived from wheel deltas at all. A gyro
measures rotation directly and isn't affected by wheel slip, so it's almost always more trustworthy than a
heading computed purely from how far each wheel spun.
:::

## Why Odometry Drifts

Even with correct arc integration, odometry has no way to check its own work against anything outside itself, every
new pose is built entirely from the previous one plus a measured delta, so any small measurement error becomes a
small pose error, and that error is now baked into every pose computed after it. Wheel slip (spinning against
carpet, or against another robot during a collision), encoder resolution limits, and small kinematic modeling errors
all contribute a little bit of error every loop, and because nothing ever corrects it, the total error only grows
over the course of a match. This is the defining weakness of odometry in general, not something specific to FRC: a
system that only ever integrates *relative* motion has no mechanism to recover from an *absolute* mistake.

Odometry alone is still extremely valuable, it's smooth, it updates every single loop, and short-term it's
extremely accurate, but a robot that only trusts odometry will end a two-and-a-half-minute match with a pose that's
measurably wrong. Fixing that requires an independent way to observe the robot's *actual* position on the field from
time to time, by recognizing something fixed and already known, a **landmark**, covered next in [Landmarks &
AprilTags](./LANDMARKS.md).
