# ⏱️ Latency

[Sensor Fusion](./SENSOR_FUSION.md#why-this-still-isnt-the-whole-story) ended on an important detail: a vision
measurement doesn't describe the robot's pose *right now*, it describes the robot's pose at whatever earlier instant
the camera actually captured the frame. Everything that happens between that instant and the moment robot code
finally sees the result adds up to **latency**, and for a fast-moving robot, ignoring it is enough to make a
correction actively wrong instead of helpful.

## Where the Delay Comes From

A single vision measurement passes through several stages before it ever reaches the pose estimator, and each one
adds time:

- **Exposure.** The camera sensor itself takes a nonzero amount of time to capture a frame.
- **Processing.** The detection pipeline from [Vision Processing](./VISION_PROCESSING.md), thresholding, corner
  finding, and the PnP solve, all take real CPU time on the coprocessor, typically several milliseconds at least.
- **Transport.** The result still has to travel across the robot's network back to the roboRIO, commonly over
  [NetworkTables](../robot_code/NETWORKTABLES.md#where-this-shows-up-next), which, being built on TCP, only delivers
  a value once it has actually finished arriving.

Individually, none of these look like much, but added together, total pipeline latency commonly reaches tens of
milliseconds, and can run well past a hundred on a loaded coprocessor. A robot spinning or driving quickly can easily
move several inches, or several degrees, in that span. Naively applying a measurement that old as if it described
the robot's pose *right now* would correct the estimate toward where the robot used to be, not where it actually is.

## Timestamping at the Source

The fix starts with recording *when the frame was actually captured*, not when the result happens to arrive. Vision
coprocessors report this alongside every pose using the same FPGA-synchronized clock the roboRIO itself uses for
timing (`Timer.getFPGATimestamp()`), so that a timestamp attached to a measurement means the same instant no matter
which device measured it. This is precisely the second argument in the `addVisionMeasurement(visionPose,
visionTimestampSeconds)` call from [Sensor Fusion](./SENSOR_FUSION.md#trust-as-standard-deviations), and it's what
makes correcting the *right* moment in the robot's history possible at all.

## Correcting the Past, Not the Present

WPILib's pose estimators keep a short rolling **buffer** of recent odometry-only poses, each tagged with the
timestamp it was computed at. When a vision measurement arrives with an earlier timestamp, the estimator doesn't
just splice it into the current pose, it looks back into that buffer (interpolating between buffered samples if the
exact timestamp falls between them), finds what odometry alone believed the pose was *at that historical instant*,
and applies the vision correction there instead:

```
   t-0.10s        t-0.05s         now
     │               │              │
  ┌──┴──┐         ┌──┴──┐        ┌──┴──┐
  │odom │ ───────▶│odom │ ─────▶ │odom │   buffered odometry-only poses
  └──┬──┘         └─────┘        └─────┘
     │
     ▼
  vision measurement, timestamped t-0.10s,
  corrects the buffered pose at t-0.10s...

     │
     ▼
  ...then every odometry update from t-0.10s
  through now is replayed on top of the
  corrected pose, bringing the correction
  forward to the present
```

Once that historical pose is corrected, the estimator replays every odometry update that happened *after* that
timestamp back on top of it, carrying the correction forward to the present rather than leaving it stuck in the past.
The practical effect is that a "late" vision measurement still ends up correcting the robot's pose by the right
amount, applied at the right point in its motion, rather than either being ignored or misapplied to the wrong
instant.

:::note
That buffer only covers a limited window (on the order of a second or two). A vision measurement timestamped older
than anything left in the buffer can no longer be reconciled with odometry history and is simply discarded, one more
reason to keep total pipeline latency, capture, processing, and transport together, as low as is practical.
:::

Timestamping and buffered correction are what make the rest of this section's pipeline trustworthy end to end:
[coordinate frames](./COORDINATE_FRAMES.md) give every measurement a shared meaning, [odometry](./ODOMETRY.md) and
[vision](./VISION_PROCESSING.md) each contribute an estimate with different strengths, and
[fusion](./SENSOR_FUSION.md) combines them, correctly, at the moment each measurement actually happened. That's the
practical, competition-proven baseline; [Advanced Vision Techniques](./ADVANCED_VISION_TECHNIQUES.md) closes this
section out with where it can go from here.
