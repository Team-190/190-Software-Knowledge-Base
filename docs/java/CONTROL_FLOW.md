import useBaseUrl from '@docusaurus/useBaseUrl';

# 🛃 Control Flow

By default, Java runs a program's statements from top to bottom, one after another,
exactly once each. Control flow is what lets you break out of that default path:
deciding which statements run, which get skipped, and which repeat, based on the
conditions your program encounters while it's running.

<img
src={useBaseUrl("img/images/javacontrolflow/traffic-light.gif")}
alt="traffic-light"
/>

Without control flow, a program could only ever do exactly one fixed sequence of
things. With it, a robot's code can decide to shoot only if a note is loaded, drive
differently depending on which alliance station it starts in, or keep polling a sensor
in a loop until it reads a specific value. This section covers the tools Java gives
you to make those decisions:

- **Conditionals**: Running code only when a condition is `true`, using `if`, `else if`, and `else`
- **Switch Statements**: A cleaner way to compare one variable against many possible values
- **Loops**: Repeating a block of code using `for`, `while`, and `do-while`
- **Loop Control**: Fine-tuning a loop's execution with `break` and `continue`