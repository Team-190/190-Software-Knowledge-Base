# Making Changes

:::caution Living Documentation
APIs and control systems change season to season, and sometimes mid-season. Specific class names, file paths, and
code examples throughout this section reflect FRC 190's codebase at the time of writing and may become outdated or
obsolete as WPILib, CTRE, and other vendor libraries evolve. Treat this section as a guide to the underlying
concepts, not a guaranteed match to the current source.
:::

There are two places a change to GompeiLib can actually be made: directly in the canonical
[GompeiLib](https://github.com/Team-190/GompeiLib) repository, or inside a season repo's own ```lib/``` copy, synced
back to the canonical repo later by the Push workflow covered in [Sync](./SYNC.md#push-season-repo-to-gompeilib).
Either way, the same validation and CI process applies once a pull request is open.

## Validating a Change with ```examples/swerve```

Testing a change to a shared subsystem or utility doesn't require a real season codebase at all.
[```examples/swerve```](./GOMPEILIB.md#examplesswerve) is a live, deployable Gradle subproject living inside
GompeiLib itself, so a change can be built, simulated, and even deployed to a real swerve robot using nothing but
GompeiLib's own repository, before it ever touches a season repo.

## Formatting Is Automatic

Code style isn't something a contributor has to remember to run before committing. Spotless is wired directly into
the compile step itself:

```groovy
project.compileJava.dependsOn(spotlessApply)
```

Every ```compileJava``` run applies Spotless's formatting first, so there's no separate manual formatting command to
remember, and no PR should ever fail review over something as small as whitespace or import ordering.

## CI on Every Pull Request

Three workflows run against every PR, each checking one thing:

| Workflow | Checks |
|---|---|
| ```build.yaml``` | The library actually compiles |
| ```lint.yaml``` | ```spotlessCheck``` passes, formatting matches what ```compileJava``` would have produced |
| ```test.yaml``` | The full JUnit suite passes, and Jacoco's coverage verification (covered in [Unit Testing](./UNIT_TESTING.md#coverage-enforcement)) doesn't fail |

All three run inside the same ```wpilib/roborio-cross-ubuntu``` container GompeiLib itself builds against, so CI is
exercising the same toolchain a contributor's own machine would use to cross-compile for the roboRIO, not a generic
Ubuntu JDK setup that happens to compile the Java but wouldn't catch a roboRIO-specific issue.

## Publishing a New Version

Cutting a GitHub Release on the GompeiLib repository is what actually ships a new version. That release triggers
```publish.yaml```:

<details>
<summary>Show code</summary>

```yaml
on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - name: Determine version
        run: |
          echo "RELEASE_VERSION=${GITHUB_REF#refs/tags/}" >> $GITHUB_ENV

      - name: Publish to GitHub Packages
        run: ./gradlew publish -PreleaseVersion=$RELEASE_VERSION
```

</details>

The release's git tag becomes the published artifact's version directly, with no separate version bump to remember
anywhere in the codebase. This is also the same event that triggers the Push sync workflow from
[Sync](./SYNC.md#push-season-repo-to-gompeilib) when a *season* repo cuts a release, tying "we shipped something" to
both "publish it" and "sync it back" at once.
