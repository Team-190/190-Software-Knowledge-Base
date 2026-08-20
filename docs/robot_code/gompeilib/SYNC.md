# External Sync

:::caution Living Documentation
APIs and control systems change season to season, and sometimes mid-season. Specific class names, file paths, and
code examples throughout this section reflect FRC 190's codebase at the time of writing and may become outdated or
obsolete as WPILib, CTRE, and other vendor libraries evolve. Treat this section as a guide to the underlying
concepts, not a guaranteed match to the current source.
:::

[Library Integration](./LIBRARY_INTEGRATION.md) covered why a season repo keeps GompeiLib's source directly inside
its own ```lib/``` directory rather than only depending on a published artifact. That raises an obvious question:
```lib/``` isn't a git submodule or a subtree, it's a plain, ordinary, copied directory, so what stops it from
silently drifting away from the canonical [GompeiLib](https://github.com/Team-190/GompeiLib) repository over the
course of a season?

The answer is two GitHub Actions workflows living in the season repo, ```pushgompeilib.yml``` and
```pullgompeilib.yml```, both of which call the same shared, reusable workflow:

<details>
<summary>Show code</summary>

```yaml
# pushgompeilib.yml
name: Push GompeiLib

on:
  release:
    types: [published]
  workflow_dispatch:

jobs:
  sync:
    uses: Team-190/.github/.github/workflows/syncgompeilib.yaml@main
    with:
      direction: push
    secrets:
      GOMPEILIB_SYNC: ${{ secrets.GOMPEILIB_SYNC }}
```

```yaml
# pullgompeilib.yml
name: Pull GompeiLib

on:
  workflow_dispatch:

jobs:
  sync:
    uses: Team-190/.github/.github/workflows/syncgompeilib.yaml@main
    with:
      direction: pull
    secrets:
      GOMPEILIB_SYNC: ${{ secrets.GOMPEILIB_SYNC }}
```

</details>

Both workflows call the exact same reusable workflow, ```Team-190/.github/.github/workflows/syncgompeilib.yaml```,
with only a ```direction``` input distinguishing them. That reusable workflow checks out both the season repo and the
canonical GompeiLib repo side by side, then copies files from one into the other, in whichever direction it was told
to.

## Push: Season Repo to GompeiLib

**Push** fires automatically the moment a release is published in the season repo, and it's ```workflow_dispatch```
triggerable too for a manual push outside of a release. It takes whatever's currently sitting in the season repo's
```lib/```, in-season fixes, tuning changes, anything that got edited locally while chasing a bug mid-competition,
and propagates it back to the canonical GompeiLib repository as a pull request, on a branch named something like
```gompeilib-sync-<timestamp>```. Tying this to release publication specifically means a push happens at a
meaningful checkpoint (a version the team actually shipped) rather than on every single commit, which would turn
GompeiLib's own history into a noisy mirror of every experimental change made mid-season.

## Pull: GompeiLib to Season Repo

**Pull** runs the other direction, and it's manually triggered only (```workflow_dispatch```), never automatic. It
brings the latest canonical GompeiLib source down into the season repo's ```lib/```, overwriting whatever was there.
Because this one isn't tied to any automatic trigger, running it is a deliberate decision, typically made when a fix
or feature landed in GompeiLib itself (perhaps through another season repo's push, or a direct commit) that this
season's robot code wants without waiting for the next release cycle.

## Review on the GompeiLib Side

An incoming sync PR on the GompeiLib repository still has to go through the same review process any other PR does.
GompeiLib's **LCM Review Automation** bot auto-approves a sync PR when it's opened by the trusted maintainer it's
configured to trust, and requests a review from that same maintainer otherwise, so a sync PR from an unexpected
source doesn't merge without a human actually looking at what it changed.

:::note
Because push and pull both move whole files rather than merging line by line, running pull while ```lib/``` has
uncommitted local changes will overwrite them. Push whatever's worth keeping back to GompeiLib first, or commit it
locally, before pulling a fresh copy down.
:::
