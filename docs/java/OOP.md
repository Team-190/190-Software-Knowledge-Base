import useBaseUrl from '@docusaurus/useBaseUrl';

# 🧩 Object Oriented Programming

Object-Oriented Programming (OOP) is a way of structuring code around **objects**:
self-contained bundles of data (fields) and behavior (methods) that model real
things. Instead of writing one long procedure that manipulates loose variables, OOP
encourages you to break a program down into classes, each responsible for its own
small piece of the puzzle.

This is exactly how FRC robot code tends to be organized. A drivetrain, a flywheel, an
intake, each of these is naturally modeled as its own class, with its own fields (like
motor voltage or sensor readings) and its own methods (like `spin()` or `periodic()`).
Rather than one massive file full of variables and if-statements trying to track every
mechanism on the robot at once, OOP lets each subsystem manage its own state, and
interact with the others through clean, well-defined interfaces.

<img
src={useBaseUrl("img/images/javaoop/its-all-connected.gif")}
alt="its-all-connected"
/>

This section covers how classes and objects work, how to construct and control access
to them, and how relationships between classes (through inheritance, polymorphism,
abstract classes, and interfaces) let you build robot code that's organized,
reusable, and easy to extend as new mechanisms get added throughout the season.