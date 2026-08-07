# 🔧 Hardware

[Landmarks & AprilTags](./LANDMARKS.md) established *what* the robot needs to look for to correct
[odometry's](./ODOMETRY.md) drift, a fixed, known, uniquely identifiable point on the field. A camera is *how* the
robot actually looks for one: it's an **exteroceptive** sensor, one that observes something external and fixed
rather than something the robot did internally. Everything a camera reports is anchored to the outside world, so,
unlike odometry, it doesn't accumulate error over time. Before covering how a camera's image gets turned into a
pose, it's worth understanding the hardware behind it, the camera itself, and the coprocessor that usually does the
heavy lifting alongside it.

## The Pinhole Camera Model

At its core, a camera works by letting light from the outside world pass through a small opening and land on a
sensor behind it, projecting a 3D scene down onto a 2D image. This is the **pinhole camera model**, and even though
a real lens is far more complex than a literal pinhole, the same basic geometry applies: a point out in the world
maps to exactly one point in the resulting image.

<img src="https://upload.wikimedia.org/wikipedia/commons/3/3b/Pinhole-camera.svg"
alt="A pinhole camera: light from an object passes through a small hole and forms an inverted image on the opposite wall"
width="360"
/>

*Source: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Pinhole-camera.svg)*

That mapping from a 3D point to a 2D pixel is described by the camera's **intrinsics**: its **focal length** (how
strongly it converges light onto the sensor, which controls field of view) and its **principal point** (the pixel
the lens's optical axis actually passes through, ideally the image's center, but rarely exactly there in practice).
A real lens also introduces **distortion**, pixels drift from where a perfect pinhole model predicts, most visibly
as a "fisheye" bowing effect near the image's edges. Every camera used for FRC vision needs to be **calibrated**
once, typically by capturing many photos of a printed checkerboard or ChArUco pattern from different angles and
distances, to solve for its exact focal length, principal point, and distortion coefficients. Every downstream
calculation that turns a pixel into a real-world direction, covered starting in
[Vision Processing](./VISION_PROCESSING.md), depends on having accurate intrinsics for the specific camera in use.

## Field of View, Resolution, Frame Rate, and Their Trade-off

A wider **field of view (FOV)** lets a camera see more of the field at once, more AprilTags in frame, less chance of
losing sight of a target while turning, but it spreads the same number of pixels across a wider angle, so each pixel
corresponds to more real-world distance, reducing precision for anything far away. Higher **resolution** pushes back
against that by giving a wider FOV more pixels to work with, but every additional pixel costs more processing time
per frame and more data to move: a single compressed camera frame can already take dozens of Ethernet frames to
transmit (see [Ethernet: How Big Is 1,500 Bytes,
Really?](../controls/hardware_communication/ETHERNET.md#how-big-is-1500-bytes-really)), and higher resolution only
makes that worse.

**Frame rate (FPS)** is the third variable in the same trade-off, and it's tied directly to resolution: a sensor
only has so much time to read pixels out and a coprocessor only has so much time to run the detection pipeline from
[Vision Processing](./VISION_PROCESSING.md) on each one, so pushing resolution up generally pushes the achievable
frame rate down, which is exactly why most camera configuration tools let a team trade one against the other rather
than maximize both at once. Frame rate matters beyond just "more data over time," too: it sets how often the robot
actually gets a fresh vision correction at all, a low frame rate means bigger gaps between updates, more of the
robot's motion has to be covered by [odometry](./ODOMETRY.md) alone in between them, and more real-world motion
happens within each individual exposure, which is exactly the ingredient that makes [rolling-shutter
skew](#global-shutter-vs-rolling-shutter) worse. How that update rate factors into combining vision with odometry is
covered later in [Sensor Fusion](./SENSOR_FUSION.md) and [Latency](./LATENCY.md).

In practice, teams tune FOV, resolution, and frame rate together for the specific job a camera is doing: wide and
lower-resolution for reliably seeing tags across the whole field, narrower and higher-resolution for precisely
locking onto one target from a distance, and a higher frame rate whenever the pipeline and network can afford it,
since a faster stream of corrections is one of the most direct ways to shrink how far odometry alone has to carry the
robot's pose between vision updates.

## Global Shutter vs. Rolling Shutter

A camera sensor doesn't necessarily capture an entire frame at the same instant. A **global shutter** exposes every
pixel simultaneously, so the whole image represents one single moment in time. A **rolling shutter**, cheaper and far
more common in consumer cameras, exposes the image row by row in rapid succession, which is unnoticeable for
stationary scenes but visibly skews anything moving fast enough during that scan:

<img src="https://upload.wikimedia.org/wikipedia/commons/2/25/Propellor_with_rolling-shutter_artifact.jpg"
alt="A spinning propeller photographed with a rolling shutter, appearing bent and distorted because different rows of the image were captured at slightly different times"
width="360"
/>

*Source: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Propellor_with_rolling-shutter_artifact.jpg)*

A robot driving and spinning at full speed is exactly the kind of fast relative motion that makes rolling shutter
distortion worse, a skewed AprilTag no longer matches the perfect square geometry the detector expects, directly
hurting the accuracy of the pose math covered in [Vision Processing](./VISION_PROCESSING.md). That's why
FRC-oriented cameras (the sensors inside a Limelight, or the boards teams commonly pair with PhotonVision) are
almost always chosen specifically for **global shutter** support, even though rolling-shutter sensors are usually
cheaper and higher resolution for the same price.

## Coprocessors

Actually running a detection pipeline against a live camera feed, thresholding, corner-finding, solving for pose,
takes real, sustained CPU time, time the roboRIO also needs for the robot's own 20 ms control loop. Rather than
compete for that time, most teams run vision processing on a separate **coprocessor**, a small onboard computer
(commonly a Raspberry Pi or Orange Pi running PhotonVision) or a self-contained smart camera (like a Limelight, which
bundles its own camera and processor in one unit). The coprocessor does the actual image processing and reports
results, target angles, tag IDs, computed poses, back to the roboRIO over the robot's own network, typically over
[NetworkTables](../robot_code/NETWORKTABLES.md), which is exactly why that network has to already be in place before
any of this data can reach robot code at all.

A camera and a coprocessor only produce a raw stream of pixels and CPU cycles, though, turning that into an actual
target the robot can react to is the job of the detection pipeline itself, covered next in
[Vision Processing](./VISION_PROCESSING.md).
