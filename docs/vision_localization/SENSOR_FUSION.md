# 🎯 Sensor Fusion

At this point, the robot has two independent ways to estimate its own pose, and neither one is good enough alone.
[Odometry](./ODOMETRY.md) runs every single loop, smooth and responsive, but drifts steadily with no way to correct
itself. [Vision-derived pose estimates](./POSE_ESTIMATION.md) don't drift at all, they're tied to fixed points on
the field, but they arrive far less often, only when a tag is actually visible, and are noisier, occasionally wrong
outright. **Sensor fusion** is combining the two so the result inherits odometry's smoothness and vision's freedom
from drift, rather than being stuck picking one or the other.

## Prediction and Correction

WPILib's pose estimator classes, `SwerveDrivePoseEstimator`, `DifferentialDrivePoseEstimator`,
`MecanumDrivePoseEstimator`, are built around the same two-step pattern every loop:

- **Predict.** Every loop, exactly like plain odometry, the estimator integrates the latest wheel/gyro measurement
  onto its current pose using the same `Twist2d` arc integration from [Odometry](./ODOMETRY.md#why-naively-adding-deltas-doesnt-work).
  This happens constantly, whether or not a vision measurement is available.
- **Correct.** Whenever a new vision-derived pose arrives, asynchronously, at whatever rate the coprocessor supplies
  it, the estimator blends it into the current estimate rather than overwriting it outright.

That blend is not a plain average. Overwriting the pose with vision entirely would throw away odometry's smoothness
(and let one bad vision frame teleport the reported pose); ignoring vision entirely brings back unbounded drift. The
right answer sits somewhere between the two, decided by how much each source is trusted.

## Trust, as Standard Deviations

Both the predict and correct steps are configured with a **standard deviation** for each state variable (`x`, `y`,
and `θ`), a smaller standard deviation means "trust this source more." The constructor takes two such vectors, one
for the odometry model and one for vision measurements:

```java
SwerveDrivePoseEstimator poseEstimator = new SwerveDrivePoseEstimator(
    kinematics,
    gyroAngle,
    modulePositions,
    initialPose,
    VecBuilder.fill(0.05, 0.05, Units.degreesToRadians(5)),   // odometry std devs (x, y, θ)
    VecBuilder.fill(0.5, 0.5, Units.degreesToRadians(30))     // vision std devs (x, y, θ)
);
```

Every loop, the predict step runs unconditionally:

```java
poseEstimator.updateWithTime(
    Timer.getFPGATimestamp(), gyroAngle, modulePositions);
```

And whenever a new vision pose arrives, it's folded in as a correction:

```java
poseEstimator.addVisionMeasurement(visionPose, visionTimestampSeconds);
```

Internally, each axis is corrected in proportion to how confident the vision measurement is relative to how
confident the odometry model is at that moment, a small vision standard deviation pulls the estimate hard toward the
vision reading; a large one barely nudges it. Because [Pose Estimation](./POSE_ESTIMATION.md#not-every-estimate-deserves-equal-trust)
already establishes that closer tags produce more precise estimates, it's common to *scale the vision standard
deviation by distance to the tag* dynamically, call `addVisionMeasurement` with tighter standard deviations for a
close, unambiguous reading and looser ones for a distant or borderline one, rather than using one fixed trust level
for every vision measurement. Heading is a common special case: a gyro's heading is normally trustworthy enough that
teams keep the odometry heading standard deviation small and let vision correct `x`/`y` far more than `θ`.

## Why This Still Isn't the Whole Story

This description has quietly glossed over one detail: a vision measurement passed to `addVisionMeasurement` isn't
describing the robot's pose *right now*, it's describing where the robot was at the moment the camera captured that
frame, which is already somewhat in the past by the time the estimator sees it. Blending a stale measurement into
the *current* pose as if it were fresh would introduce new error rather than removing it. Handling that correctly,
and what that `timestampSeconds` argument above is actually for, is covered next in [Latency](./LATENCY.md).
