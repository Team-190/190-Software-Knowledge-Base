# 🗺️ Introduction

Driving a robot by joystick doesn't require the robot to know where it is at all, a human is closing that loop,
watching the field and correcting by eye. The moment robot code has to do something on its own, align to a scoring
location, follow a planned path, drive to a fixed spot during autonomous, it can't act on a position it doesn't
have. **Localization** is the general problem of continuously answering "where is the robot right now," accurately
enough for robot code to actually act on the answer, and this section builds that answer up from nothing, piece by
piece.

## Two Techniques, Two Opposite Weaknesses

There is no single sensor that solves localization outright. Instead, this section builds two genuinely different
techniques and combines them:

- Measuring the robot's own motion (how far each wheel spun, how much it rotated) and continuously adding it up.
  This is fast and smooth, updating every single control loop, but it has no way to check itself against the
  outside world, so any small measurement error accumulates, unbounded, for the rest of the match.
- Recognizing something fixed and already known out in the world, and measuring the robot's position relative to
  *that*. This doesn't drift, ever, but it only works when that fixed reference is actually in view, and it takes
  real time to capture and process.

Neither one is trustworthy alone. The entire arc of this section is building each technique properly, understanding
exactly where each one breaks down, and then combining them so the result inherits the good half of both.

## Reading Order

1. [Coordinate Frames](./COORDINATE_FRAMES.md), the shared language everything else depends on: what a position
   even means without agreeing on an origin and a set of axes first.
2. [Odometry](./ODOMETRY.md), tracking the robot's pose by continuously integrating its own measured motion, and
   exactly why that inevitably drifts.
3. [Landmarks & AprilTags](./LANDMARKS.md), what makes a fixed reference point in the world useful for correcting
   that drift, and the specific marker system FRC uses as one.
4. [Hardware](./HARDWARE.md), the camera that actually captures a landmark and the coprocessor that usually
   processes it, and why the specific hardware matters.
5. [Vision Processing](./VISION_PROCESSING.md), the pipeline that turns a raw camera frame into a target's position.
6. [Pose Estimation](./POSE_ESTIMATION.md), chaining a detected landmark's known position together with what the
   camera measured to arrive at the robot's own pose on the field.
7. [Sensor Fusion](./SENSOR_FUSION.md), combining that vision-derived pose with the odometry that's already running
   every loop, rather than picking one or the other.
8. [Latency](./LATENCY.md), why a vision measurement is always describing a moment slightly in the past, and how
   that gets accounted for instead of ignored.
9. [Advanced Vision Techniques](./ADVANCED_VISION_TECHNIQUES.md), gyro-constrained pose solving (already common
   practice), followed by three techniques FRC doesn't typically use yet.

Start with [Coordinate Frames](./COORDINATE_FRAMES.md).
