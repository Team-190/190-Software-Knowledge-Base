# 🚀 Advanced Vision Techniques

Everything from [Coordinate Frames](./COORDINATE_FRAMES.md) through [Latency](./LATENCY.md) describes the common,
practical FRC baseline: solve one pose per camera frame with PnP, fuse it into a Kalman-style pose estimator,
correct for how stale it already is by the time it arrives. That baseline isn't the ceiling of what's possible,
it's just what reliably fits a six-week build season running on a roboRIO and a modest coprocessor. This closing
article covers techniques that go further, starting with one already in common use, then three that aren't yet.

## Gyro-Constrained Pose Solving

[Vision Processing's ambiguity problem](./VISION_PROCESSING.md#ambiguity) exists because solving a pose from a
single tag's four corners alone is under-constrained: the solver has to work out the target's full rotation *and*
position from scratch, and more than one rotation can explain almost the same 2D projection. But the robot doesn't
actually need the solver to guess at rotation blind, it already has a gyro measuring heading independently, with
far better precision than a single-tag PnP solve can offer on its own. Feeding that known heading into the solver as
a **fixed input**, rather than something to solve for, shrinks the problem: the solver no longer has to choose
between two rotation interpretations that both fit the image, because one of them is already ruled out before the
solve even starts. That also happens to improve accuracy for a single distant tag generally, since the solver isn't
spending any of its limited precision guessing at a rotation it's now simply been told.

This is meaningfully different from what [Sensor Fusion](./SENSOR_FUSION.md) does with the gyro. There, a gyro
measurement corrects heading *after* an independent vision pose has already been computed, blending two separately
finished answers. Here, the gyro measurement is folded directly into the pose solve itself, before a pose exists at
all, eliminating the ambiguity at its source instead of statistically discounting it afterward. This technique is
already in active, everyday use across FRC, it's the mechanism behind Limelight's **MegaTag2** (which expects the
robot's current gyro yaw every frame before it will report a pose), and Team 6328 has published a similar
gyro-constrained solving approach in their own vision pipeline.

## Beyond a Single Frame: What FRC Doesn't Usually Do Yet

Every technique covered so far, gyro-constrained solving included, still treats each camera frame as an independent
measurement: solve a pose, hand it off to fusion, and start over from scratch on the next frame. The following three
techniques instead treat localization as one continuous, cumulative problem. **None of these are commonly run on
competition FRC robots today**, they cost meaningfully more compute and engineering effort than a build season
usually has room for, but they're real directions the ideas in this section extend into, and they're specifically
what 190's own vision coprocessor project, `GompeiVision`, intends to explore once that project is picked back up.

### VSLAM (Visual Simultaneous Localization and Mapping)

Every technique earlier in this section assumes the map is already known, the AprilTag field layout from [Landmarks
& AprilTags](./LANDMARKS.md#the-field-layout-where-each-landmark-actually-is) is handed to the robot ahead of time,
and localizing just means finding where the robot sits inside that fixed, pre-known map. **VSLAM** drops that
assumption entirely: instead of relying on a pre-built map of known landmarks, it builds a map of ordinary visual
features, corners, edges, textured surfaces, anything a camera can consistently re-recognize, while simultaneously
using that same growing map to track the camera's own motion through it. That means a VSLAM system can, in
principle, keep localizing continuously even when no AprilTag is anywhere in the frame, using whatever natural
features happen to be visible instead, something nothing else in this section can do at all.

### VMCL (Visual Monte Carlo Localization)

Every pose estimator covered in [Sensor Fusion](./SENSOR_FUSION.md) tracks a single best-guess pose, plus how
uncertain it is around that one guess, which works well as long as that guess starts out roughly right. **Monte
Carlo Localization** takes a structurally different approach: instead of one estimate, it maintains a large
population of candidate poses, **particles**, scattered across the field, scores each one by how well it explains
the robot's current sensor readings, and repeatedly resamples toward whichever particles are scoring best. Because
it isn't committed to a single hypothesis the way a Kalman-style estimator is, a Monte Carlo approach can represent
several genuinely different candidate poses at once, and correctly recover from being badly wrong, exactly the kind
of ambiguous or "lost robot" situation covered in [Vision Processing's ambiguity
section](./VISION_PROCESSING.md#ambiguity), without needing to already be close to the right answer first.

### TagSLAM

Every technique so far, VSLAM included, still treats the AprilTag field layout as ground truth, the tags' published
field positions are simply assumed to be exactly correct. **TagSLAM**, an existing open-source SLAM package built
specifically around fiducial markers, drops even that assumption: it treats tag positions themselves as unknowns to
be solved for jointly alongside the camera's own trajectory, using the same graph-based optimization approach (a
factor graph, solved with the GTSAM library) that general-purpose SLAM systems use for mapping. That's useful less
as a full replacement for the pipeline this section builds, and more as a way to build or audit the map underneath
it: measuring actual tag placement error on a practice field, calibrating a multi-camera rig's mounting offsets, or
generating ground-truth trajectories to validate everything else in this section against.

## Where This Leaves FRC Today

None of VSLAM, VMCL, or TagSLAM are things a typical competition FRC robot runs right now, and the
[Sensor Fusion](./SENSOR_FUSION.md) plus [Latency](./LATENCY.md) pipeline described earlier in this section remains
the practical baseline for a robot that has to work reliably after a six-week build season. They're covered here
because they're real, existing techniques, and specifically the direction `GompeiVision` intends to explore once
that project is picked back up, not because every team should reach for them first.
