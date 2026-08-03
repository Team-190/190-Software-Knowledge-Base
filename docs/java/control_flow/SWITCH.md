import useBaseUrl from '@docusaurus/useBaseUrl';

# Switch Statements

A `switch` statement is another way to make decisions in Java, and is often a cleaner
alternative to a long chain of `else if` statements when you're comparing a single
variable against many possible values.

<img
src={useBaseUrl("img/images/javacontrolflow/switch-case.webp")}
alt="switch-case"
/>

## Switch Formula

<details>
<summary>Show code</summary>

```java
switch ([variable]) {
    case [value1]:
        [code to run]
        break;
    case [value2]:
        [code to run]
        break;
    default:
        [code to run if no case matches]
}
```
</details>

<details>
<summary>Show code</summary>

```java
int allianceStation = 2;

switch (allianceStation) {
    case 1:
        System.out.println("Station 1");
        break;
    case 2:
        System.out.println("Station 2");
        break;
    case 3:
        System.out.println("Station 3");
        break;
    default:
        System.out.println("Invalid station");
}
```
</details>

Output:
```text
Station 2
```

## Comparing to an if-else Chain

The switch statement above is functionally equivalent to the following `else if`
chain, but is arguably easier to read when there are many possible values to check:

```java
if (allianceStation == 1) {
    System.out.println("Station 1");
} else if (allianceStation == 2) {
    System.out.println("Station 2");
} else if (allianceStation == 3) {
    System.out.println("Station 3");
} else {
    System.out.println("Invalid station");
}
```

## Fall-Through

Each `case` in a switch statement needs a `break` statement to stop execution from
"falling through" into the next case. Without `break`, Java will keep running code
downward through every subsequent case until it hits a `break` or reaches the end of
the switch block.

<details>
<summary>Show code</summary>

```java
int allianceStation = 1;

switch (allianceStation) {
    case 1:
        System.out.println("Station 1");
    case 2:
        System.out.println("Station 2");
        break;
    default:
        System.out.println("Invalid station");
}
```
</details>

Output:
```text
Station 1
Station 2
```

Even though `allianceStation` was `1`, both `"Station 1"` and `"Station 2"` were
printed, since there was no `break` after the first case. Forgetting a `break` is one
of the most common switch statement bugs, so it's important to always double check
your cases.

## The default Case

The `default` case runs when none of the other cases match the variable's value. It's
similar to the final `else` in an `if`-`else if`-`else` chain, and while it isn't
required, it's good practice to include one to handle unexpected values.

## Modern Switch Expressions

Newer versions of Java support a more concise "arrow" syntax for switch statements,
which doesn't require `break` statements, since each case only runs its own code by
default (no fall-through).

```java
switch (allianceStation) {
    case 1 -> System.out.println("Station 1");
    case 2 -> System.out.println("Station 2");
    case 3 -> System.out.println("Station 3");
    default -> System.out.println("Invalid station");
}
```

This syntax is generally preferred in modern Java code, since it's more concise and
eliminates the risk of accidental fall-through entirely.
