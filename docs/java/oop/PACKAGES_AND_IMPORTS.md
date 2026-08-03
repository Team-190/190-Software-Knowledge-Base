import useBaseUrl from '@docusaurus/useBaseUrl';

# Packages and Imports

As a codebase grows, it becomes impractical to keep every class in one giant, flat
list. Java solves this using **packages**, a way of grouping related classes together,
similar to how folders organize files on a computer.

<img
src={useBaseUrl("img/images/javaoop/package-box.gif")}
alt="package-box"
/>

## The package Declaration

Every Java file belongs to a package, declared with the `package` keyword at the very
top of the file, before anything else (even before `import` statements).

### Package Formula

```java
package [package.name];
```

```java
package frc.robot.subsystems;

class Flywheel {
    // ...
}
```

Packages are typically named in reverse-domain style, and mirror the folder structure
of the project. A class declared in `frc.robot.subsystems` would physically live inside
a `frc/robot/subsystems/` folder in the project.

## Importing Classes

Classes automatically have access to every other class in the same package, but to use
a class from a *different* package, it must first be imported.

Recall from the Input/Output section that reading user input required this line at
the top of the file:

```java
import java.util.Scanner;
```

This tells Java that the `Scanner` class lives in the `java.util` package, and makes
it available for use throughout the rest of the file, without needing to write its
full name (`java.util.Scanner`) every single time.

### Import Formula

```java
import [package.name].[ClassName];
```

## Wildcard Imports

Instead of importing classes one at a time, a wildcard (`*`) can be used to import
every class in a package at once.

```java
import java.util.*; // Imports every class in java.util, including Scanner
```

While convenient, wildcard imports are generally discouraged, since they make it
less clear exactly which classes a file actually depends on, and can occasionally
cause naming conflicts if two different packages contain classes with the same name.

## Why Packages Matter

Packages provide two main benefits:

- **Organization**: Related classes (e.g. all of a robot's subsystems) can be grouped
  together, making a large codebase easier to navigate.
- **Namespacing**: Two classes in different packages are allowed to share the same
  name, since their full, qualified names (`package.name.ClassName`) are still unique.

Java's own built-in classes are organized this way too. `String` and `Math` live in
`java.lang` (which is automatically imported into every file, no `import` required),
while `Scanner` lives in `java.util`, and must be explicitly imported before use.
