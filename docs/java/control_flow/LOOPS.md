import useBaseUrl from '@docusaurus/useBaseUrl';

# Loops

A loop lets a program repeat a block of code multiple times, without having to
manually write that code over and over. Java provides a few different kinds of loops,
each suited to slightly different situations.

<img
src={useBaseUrl("img/images/javacontrolflow/hamster-wheel.gif")}
alt="hamster-wheel"
/>

## The for Loop

A `for` loop is best used when you know exactly how many times you want to repeat a
block of code, such as iterating a fixed number of times.

### For Loop Formula

```
for ([initialization]; [condition]; [update]) {
    [code to run each iteration]
}
```

```
for (int i = 0; i < 5; i++) {
    System.out.println("Motor check " + i);
}
```

The three parts of a `for` loop run in a specific order:

1. **Initialization**: `int i = 0;` runs once, before the loop starts
2. **Condition**: `i < 5;` is checked before every iteration; the loop stops once it's `false`
3. **Update**: `i++` runs after every iteration

## The while Loop

A `while` loop is best used when you don't know exactly how many times you need to
repeat, and instead want to keep looping as long as some condition remains `true`.

### While Loop Formula

```
while ([condition]) {
    [code to run each iteration]
}
```

```
int velocity = 0;

while (velocity < 10) {
    velocity += 2;
    System.out.println("Velocity: " + velocity);
}
```

The condition is checked before every iteration, including the very first one. If the
condition is `false` from the start, the loop body never runs at all.

## The do-while Loop

A `do-while` loop is similar to a `while` loop, except the condition is checked
**after** the loop body runs, guaranteeing that the code inside runs at least once.

### Do-While Loop Formula

```
do {
    [code to run each iteration]
} while ([condition]);
```

```
int attempts = 0;

do {
    System.out.println("Attempt " + attempts);
    attempts++;
} while (attempts < 3);
```

## Choosing the Right Loop

| Loop         | Best used when...                                            |
|--------------|-----------------------------------------------------------------|
| `for`        | You know the exact number of iterations ahead of time           |
| `while`      | You want to loop based on a condition, and might not loop at all |
| `do-while`   | You want to loop based on a condition, but need it to run at least once |

## A Preview: The Enhanced for Loop

Java also provides a special version of the `for` loop, called the enhanced for loop
(or "for-each" loop), which is used to iterate over every element in a collection,
such as an array or `ArrayList`, without needing to manually track an index.

```
for (int motorId : motorIds) {
    System.out.println("Motor ID: " + motorId);
}
```

This loop is covered in much more detail in the Data Structures section, once
collections like arrays and `ArrayList` have been introduced.
