# 📍 Pose Estimation

[Vision Processing](./VISION_PROCESSING.md) ends with a `Transform3d` from the camera to a detected AprilTag, useful,
but still just one leg of a longer chain. **Pose estimation** is that full chain: composing everything that's
*already known* with everything the camera *just measured* to arrive at the one number the robot actually wants, its
own pose in the field frame.

## The Chain of Transforms

Three pieces combine to get there, each one a pose or transform in the sense introduced in [Coordinate
Frames](./COORDINATE_FRAMES.md#composing-frames-poses-and-transforms):

1. **`fieldToTag`**, the detected tag's pose in the field frame. This isn't measured, it's *known* ahead of time,
   read straight out of the official AprilTag field layout covered in [Landmarks &
   AprilTags](./LANDMARKS.md#the-field-layout-where-each-landmark-actually-is).
2. **`tagToCamera`**, the camera's pose relative to the tag, the inverse of the `cameraToTag` transform [Vision
   Processing](./VISION_PROCESSING.md#apriltags-finding-a-pose-not-just-a-blob) just solved for via PnP.
3. **`cameraToRobot`**, the camera's fixed mounting offset from the robot's own center. This is also known ahead of
   time, measured once from CAD or with a tape measure, and never changes while the robot is running.

Composing all three, `fieldToTag` combined with `tagToCamera` combined with `cameraToRobot`, walks all the way from
a fixed point on the field, through the tag, through the camera, and out to the robot's own center, yielding
`fieldToRobot`: exactly the robot's pose on the field, computed without any input from odometry at all. This is the
same composition operation from Coordinate Frames, just chained three times in a row instead of once, and it's
essentially what a library like PhotonVision's `PhotonPoseEstimator` or a Limelight's built-in pose solver is doing
internally every time it reports a `Pose2d`.

## Not Every Estimate Deserves Equal Trust

A single vision-derived pose is a measurement, not a certainty, and a few concrete checks are what separate a
reliable pipeline from one that occasionally feeds robot code nonsense:

- **Reject implausible results.** A correctly solved robot pose should sit at a sensible height and not be tilted
  relative to the floor. If the composed pose comes out several inches off the ground or rotated onto its side, the
  underlying PnP solve was almost certainly wrong, and the reading should be thrown out rather than trusted.
- **Watch ambiguity.** A high-ambiguity single-tag solve, from [Vision
  Processing](./VISION_PROCESSING.md#ambiguity), carries that same uncertainty forward into the final pose. Many
  teams simply discard single-tag estimates above an ambiguity threshold, or prefer multi-tag solves whenever more
  than one tag is visible.
- **Weight by distance.** A tag close to the camera fills more of the frame, so small pixel errors move its solved
  corners by a smaller real-world amount than the same pixel error would for a distant, tiny tag. A pose computed
  from a nearby tag is meaningfully more precise than one computed from a tag far across the field, and that
  difference in trust carries forward directly into how the estimate gets weighted, covered next.

A trustworthy vision pose is still, at best, an occasional correction rather than a continuous stream, cameras only
run at a limited frame rate, tags aren't always in view, and processing takes real time. Making full use of it means
combining it with the odometry that's already running every loop, which is exactly the problem [Sensor
Fusion](./SENSOR_FUSION.md) solves.
