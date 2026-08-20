# Library Integration

:::caution Living Documentation
APIs and control systems change season to season, and sometimes mid-season. Specific class names, file paths, and
code examples throughout this section reflect FRC 190's codebase at the time of writing and may become outdated or
obsolete as WPILib, CTRE, and other vendor libraries evolve. Treat this section as a guide to the underlying
concepts, not a guaranteed match to the current source.
:::

[GompeiLib](./GOMPEILIB.md) is a separate Gradle project from any season's robot code, which means every season repo
has to actually pull it in as a dependency before any of it is usable. 190 supports two ways to do that, and uses
both, for different reasons.

## The Local Subproject Path

Day to day, a season repo consumes GompeiLib as a **local Gradle subproject**, its source living right inside the
season repo's own checkout rather than being downloaded from anywhere. Two files wire this together. First,
```settings.gradle``` tells Gradle that a project named ```:gompeilib``` exists, and points it at the ```lib/```
directory instead of a folder named ```gompeilib```:

```groovy
include(":gompeilib")
project(":gompeilib").projectDir = file("lib")
```

Then the season repo's own ```build.gradle``` depends on that subproject directly:

```groovy
dependencies {
  implementation project(':gompeilib')
  aspect project(':gompeilib')
  ...
}
```

The ```aspect``` line matters as much as ```implementation``` does. GompeiLib's tracing annotations
(```@Trace```, seen wherever a subsystem's ```periodic()``` needs its execution time measured) are woven in by
AspectJ at compile time, not read by reflection at runtime, and that weaving has to happen again in the *consuming*
project, not just inside GompeiLib's own build. Without the ```aspect``` line, ```@Trace``` annotations copied over
with GompeiLib's source would silently do nothing in the season repo, compiling fine but never actually recording
anything.

## The Published Artifact Path

The alternative is consuming GompeiLib the way any other Maven dependency gets consumed: as a versioned artifact
rather than source sitting in the same checkout. GompeiLib's own ```build.gradle``` is set up to publish exactly that
way:

<details>
<summary>Show code</summary>

```groovy
group = 'edu.wpi.team190'
version = project.hasProperty("releaseVersion") ? project.property("releaseVersion") : "0.0.0-SNAPSHOT"

publishing {
  publications {
    mavenJava(MavenPublication) {
      from components.java
      groupId = group
      artifactId = "gompeilib"
      version = version
    }
  }

  repositories {
    if (System.getenv("CI") == "true") {
      maven {
        name = "GitHubPackages"
        url = uri("https://maven.pkg.github.com/Team-190/GompeiLib")
        ...
      }
    }
  }
}
```

</details>

Cutting a GitHub Release on the GompeiLib repository is what actually triggers a publish (covered in full in [Making
Changes](./MAKING_CHANGES.md#publishing-a-new-version)), and the release tag becomes the artifact's version directly,
```-PreleaseVersion=$RELEASE_VERSION``` is passed straight from the tag name into the Gradle build. A season repo
could, in principle, depend on a specific published version from ```maven.pkg.github.com/Team-190/GompeiLib``` the
same way it depends on any vendor library, pinning to a known-good release instead of whatever ```lib/``` currently
contains.

## Why the Local Path Is the Default

190 uses the local subproject path for day-to-day development, and the published path is really there for anyone
consuming a specific, frozen release rather than actively developing against it. Working out of ```lib/``` means a
change to GompeiLib and the season code that depends on it can be made, built, and tested together in one checkout,
with no publish-a-new-version-then-bump-the-dependency round trip between them. That tight loop is exactly what makes
in-season fixes practical, and it's also why keeping ```lib/``` and the canonical GompeiLib repository from silently
drifting apart matters enough to have its own dedicated sync process, covered next in [Sync](./SYNC.md).
