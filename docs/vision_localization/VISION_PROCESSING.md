# 🔍 Vision Processing

A raw camera frame is just a grid of pixel brightness and color values, nothing in it is labeled "target." **Vision
processing** is the pipeline that turns that raw grid into something robot code can act on: where a target is, and,
for the [AprilTags](./LANDMARKS.md) most modern FRC vision relies on, exactly where the camera is relative to it.
FRC has used two fundamentally different kinds of targets over the years, and they're worth contrasting because
they push the pipeline in very different directions.

## Retroreflective Targets: Finding a Blob

Older FRC games marked targets with **retroreflective tape**, material that bounces light directly back toward its
source rather than scattering it. Pairing that tape with a ring of bright LEDs mounted around the camera lens makes
the target light up dramatically brighter than everything else in frame, so much so that lowering the camera's
exposure until only the tape is visible is itself a common processing trick:

<img src="https://docs.wpilib.org/en/stable/_images/target-output.png"
alt="Retroreflective tape on an FRC field element, photographed at low camera brightness so only the illuminated tape stands out against an otherwise dark image"
width="420"
/>

*Source: [WPILib Docs](https://docs.wpilib.org/en/stable/docs/software/vision-processing/introduction/target-info-and-retroreflection.html)*

From there, the pipeline's job is comparatively simple: **threshold** the image (keep only pixels above a brightness
cutoff), find the resulting blob's contour, and compute its centroid. Combined with the camera's intrinsics from
[Hardware](./HARDWARE.md#the-pinhole-camera-model), that centroid converts directly into a horizontal and vertical
**angle** from the camera's lens to the target, enough to steer toward it, but nothing about distance or orientation
without extra geometric assumptions (like knowing the target's fixed height off the floor).

## AprilTags: Finding a Pose, Not Just a Blob

[Landmarks & AprilTags](./LANDMARKS.md) covers what an AprilTag physically is and why FRC uses them as landmarks;
what matters here is what the pipeline actually does with one. Unlike a plain reflective blob, an AprilTag's
pipeline can identify a detected square's four corners with pixel-level precision, along with the ID encoded in its
grid of cells:

<img src="https://docs.wpilib.org/en/stable/_images/decode_id.png"
alt="An AprilTag detection pipeline locating a tag's four corners and decoding its cell pattern into a numeric tag ID"
width="420"
/>

*Source: [WPILib Docs](https://docs.wpilib.org/en/stable/docs/software/vision-processing/apriltag/apriltag-intro.html)*

Because the tag's physical size and the geometry of its corners (in the tag's own frame, from [Coordinate
Frames](./COORDINATE_FRAMES.md#camera-and-target-frames)) are known exactly, along with the camera's intrinsics,
that's enough information to solve for the camera's full pose relative to the tag, not just an angle.

That calculation is an instance of the classic **Perspective-n-Point (PnP)** problem: given several 3D points in a
known local frame (a tag's four corners) and where those same points landed in the 2D image, solve for the 3D pose
that would have produced exactly that projection. The output is a `Transform3d` describing the tag's position and
orientation relative to the camera (or equivalently, the camera relative to the tag).

## Ambiguity

A flat, square target viewed at certain angles has a subtle problem: two meaningfully different poses can produce
almost the same 2D projection, especially when the tag is viewed nearly head-on:

<img src="https://docs.wpilib.org/en/stable/_images/planar_ambiguity1_base.png"
alt="A flat square target viewed by a camera"
width="280"
/>
<img src="https://docs.wpilib.org/en/stable/_images/planar_ambiguity1.png"
alt="Two meaningfully different real-world orientations of that same flat target, shown side by side, that project to nearly the same corners in the camera image"
width="280"
/>

*Source: [WPILib Docs](https://docs.wpilib.org/en/stable/docs/software/vision-processing/apriltag/apriltag-intro.html)*

Translating the four known corners of a target in a two-dimensional image back into a three-dimensional real-world
position is inherently ambiguous this way: there are multiple real-world poses that land those same four corners in
almost the same spot in the image. A human can often resolve this instinctively from lighting or background context,
but a detector has no such context to lean on. The PnP solver can return either pose, and a small amount of pixel
noise is enough to flip which one it picks between frames, a phenomenon vision pipelines like PhotonVision report as
an **ambiguity** score. Code consuming single-tag pose data generally has to either reject high-ambiguity detections
outright or lean on **multi-tag PnP**, solving simultaneously for a pose that's consistent with *every* tag visible
in frame at once, which resolves the ambiguity almost entirely because it's extremely unlikely for the wrong pose to
satisfy multiple tags at different positions simultaneously.

## From "Relative to the Camera" to "On the Field"

Everything covered so far only produces a target's pose *relative to the camera*, useful, but not yet the thing the
robot actually needs: its own pose in the field frame. Getting there means chaining this camera-relative measurement
together with the tag's known field position and the camera's known mounting position on the robot, exactly the kind
of pose-and-transform composition introduced in [Coordinate Frames](./COORDINATE_FRAMES.md#composing-frames-poses-and-transforms),
which is where [Pose Estimation](./POSE_ESTIMATION.md) picks up.
