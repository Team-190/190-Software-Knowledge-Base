import useBaseUrl from '@docusaurus/useBaseUrl';

# Loop Control

Sometimes you need finer control over a loop than just letting its condition decide
when it starts and stops. Java provides two keywords, `break` and `continue`, that let
you jump around inside a loop's execution.

## The break Statement

The `break` statement immediately exits the loop it's inside, skipping any remaining
iterations entirely.

```java
for (int i = 0; i < 10; i++) {
    if (i == 5) {
        break;
    }
    System.out.println(i);
}
```

Output:
```text
0
1
2
3
4
```

Even though the loop was set up to run 10 times, it stopped as soon as `i` reached
`5`, since `break` exited the loop immediately.

## The continue Statement

The `continue` statement skips the rest of the current iteration and jumps straight to
the next one, without exiting the loop entirely.

```java
for (int i = 0; i < 5; i++) {
    if (i == 2) {
        continue;
    }
    System.out.println(i);
}
```

Output:
```text
0
1
3
4
```

When `i` was `2`, `continue` skipped the `System.out.println(i);` line for that
iteration only, and the loop continued on to `i = 3`.

## Labeled Loops

When loops are nested inside one another, a plain `break` or `continue` only affects
the innermost loop. Labeling a loop lets you target an outer loop specifically.

```java
outer:
for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
        if (j == 1) {
            break outer;
        }
        System.out.println(i + ", " + j);
    }
}
```

Output:
```text
0, 0
```

Here, `break outer;` exits the entire labeled `outer` loop as soon as the condition is
met, rather than just the inner loop. Labeled loops are relatively uncommon, but
useful to recognize when you come across them.

## Infinite Loops

An infinite loop is a loop whose condition never becomes `false`, causing it to repeat
forever (or until the program is forcibly stopped).

```java
while (true) {
    System.out.println("This never stops!");
}
```

<img
src={useBaseUrl("img/images/javacontrolflow/infinite-loop.jpeg")}
alt="infinite-loop"
/>

Infinite loops are usually created by accident, often because a variable used in the
condition is never updated inside the loop body. This is especially dangerous in robot
code: WPILib runs your robot's code inside its own periodic loop roughly every 20
milliseconds, and if one of your methods gets stuck inside an accidental infinite
loop, it blocks that periodic loop from ever finishing its cycle. This means your
entire robot, drivetrain included, can stop responding to commands entirely.

`break` can be used to intentionally escape a loop that would otherwise run forever,
once some condition inside the loop body is met.
