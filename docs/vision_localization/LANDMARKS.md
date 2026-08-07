# 🏷️ Landmarks & AprilTags

[Odometry](./ODOMETRY.md) ended on a hard limit: a system that only ever integrates *relative* motion has no way to
check its own work, so its error only grows. Fixing that requires something odometry doesn't have access to at all,
a fixed, known reference point out in the world that the robot can compare itself against. That's a **landmark**,
and before getting into the camera hardware and detection pipeline that actually finds one, it's worth being precise
about what a landmark is and why FRC settled on the specific kind it uses today.

## What Makes Something a Landmark

Recognizing a known, fixed point in the environment to correct an estimated position against is an old idea, sailors
navigated by fixed lighthouses and star positions long before anything like odometry existed in robotics, and it
works for exactly the same reason here: a landmark's position doesn't drift the way an integrated motion estimate
does, so measuring where the robot is *relative to* a landmark gives an absolute correction rather than another
accumulating guess.

Not just anything can serve as a landmark, though. A useful one needs to be:

- **Fixed.** Its position has to be known ahead of time and never change, otherwise "correcting" against it would
  just import a different kind of error.
- **Detectable.** Whatever sensor the robot has, a [camera](./HARDWARE.md), in FRC's case, has to actually be able to
  pick it out reliably.
- **Precisely localizable.** Seeing that *something* is there isn't enough; the sensor needs to pin down exactly
  where it is in the frame well enough to compute a real position from it.
- **Uniquely identifiable.** An FRC field has many landmarks in view at once, so the robot also needs to know
  *which* one it's looking at, otherwise it has no way to look up that landmark's known position in the first place.

## AprilTags: FRC's Landmark System

Since 2023, FRC fields have used **AprilTags**, square fiducial markers placed at fixed, published locations around
the field, as their landmark system. Physically, each tag is a 6×6 grid of black-and-white cells surrounded by a
solid black border, and the specific pattern of cells directly encodes that tag's unique ID:

<img src="https://docs.wpilib.org/en/stable/_images/tag_size.png"
alt="An FRC AprilTag: a solid black border surrounding a 6x6 grid of black-and-white cells, with the physical dimensions of the printed tag labeled"
width="360"
/>

*Source: [WPILib Docs](https://docs.wpilib.org/en/stable/docs/software/vision-processing/apriltag/apriltag-intro.html)*

Several tags mounted on real hardware make it clearer why the black border and stark black-and-white contrast
matter, they need to stay reliably detectable at odd angles and varying light, not just when photographed head-on:

<img src="https://docs.wpilib.org/en/stable/_images/apriltagrobots_overlay.jpg"
alt="AprilTag fiducial markers mounted on robots, demonstrating how the tags appear in a real camera view"
width="480"
/>

*Source: [WPILib Docs](https://docs.wpilib.org/en/stable/docs/software/vision-processing/apriltag/apriltag-intro.html)*

FRC uses a specific tag family called **36h11**, and the exact bit patterns used within it weren't picked casually.
Even though a 6×6 grid technically allows 2³⁶ possible patterns, only 587 of them are actually used as valid tag
IDs, chosen so that:

- **Bit-flip errors don't create ambiguity.** Glare, motion blur, or partial occlusion can misread a cell or two,
  but the valid codes are spread out enough from each other that a few flipped bits still won't turn one tag's ID
  into a different tag's valid ID.
- **Random field clutter doesn't false-positive.** The patterns are deliberately chosen to avoid "simple" geometric
  shapes that might naturally show up elsewhere on the field and get mistaken for a tag that isn't there.
- **Orientation is always recoverable.** The pattern is asymmetric enough that, once a tag is found, the detector
  can also tell which way is "up," not just that a tag is present.

## Why This Beats a Reflective Blob

Older FRC games marked targets with plain retroreflective tape instead, bright, easy to threshold out of an image,
but otherwise featureless: every piece of tape looked identical, so a camera could tell *that* something was there
and roughly *which direction* it was in, but nothing about *which specific field element* it was looking at, and
nothing about distance or orientation without extra assumptions. An AprilTag fixes both problems by construction:
its encoded ID satisfies the "uniquely identifiable" requirement from above directly, and because it's a real
squared-off shape with four known corners rather than a formless blob, it gives a detector enough geometry to solve
for a full position and orientation, not just a direction. Exactly how a detector pulls a corner-level position out
of the image, and the shared math (PnP) that makes that possible, is covered next in [Vision
Processing](./VISION_PROCESSING.md).

## The Field Layout: Where Each Landmark Actually Is

A landmark's known position has to come from somewhere. Every season, FIRST publishes an official **AprilTag field
layout**, a JSON file listing every tag's ID alongside its fixed pose in the [field frame](./COORDINATE_FRAMES.md#the-field-frame),
tag poses are given as the center of the tag, with a rotation of zero facing straight away from the blue alliance
wall. WPILib ships this file for each season's game, and robot code loads it directly into an `AprilTagFieldLayout`
object rather than hard-coding any tag position by hand:

```java
// Swap in whichever AprilTagFields constant matches the current season's field
AprilTagFieldLayout fieldLayout =
    AprilTagFieldLayout.loadField(AprilTagFields.k2026RebuiltWelded);

Pose3d tagSevenFieldPose = fieldLayout.getTagPose(7).orElseThrow();
```

That lookup, tag ID in, fixed field pose out, is exactly the `fieldToTag` piece the transform chain in [Pose
Estimation](./POSE_ESTIMATION.md#the-chain-of-transforms) depends on: it isn't measured by the robot at all, it's
read straight out of this file.

Knowing exactly where every landmark on the field is doesn't help without a sensor that can actually see one, which
is where [Hardware](./HARDWARE.md) picks up.
