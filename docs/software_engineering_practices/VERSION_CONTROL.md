# 🔀 Version Control

FRC 190's software isn't one codebase, it's several. ```2kxx-Robot-Code``` (season's robot), ```GompeiLib```
(the team's shared library), and ```GompeiVision``` (the vision coprocessor code) are all separate repositories under
the ```Team-190``` GitHub organization, and this knowledge base is a repository of its own too. Git and GitHub are what
let a whole roster of students, work on all of these at once without stepping on each other.

## Repositories, Not One Big Folder

Each repository has a job:

| Repository            | Purpose                                                                                            |
|-----------------------|----------------------------------------------------------------------------------------------------|
| ```2kxx-Robot-Code``` | season's robot code. Game-specific, rewritten every year.                                          |
| ```GompeiLib```       | Shared library code reused across seasons (see [GompeiLib](../robot_code/gompeilib/GOMPEILIB.md)). |
| ```GompeiVision```    | Code running on the vision coprocessor.                                                            |
| This knowledge base   | The training curriculum you're reading right now.                                                  |

Splitting things up this way means a fix to ```GompeiLib``` doesn't require touching the season repo directly, and a
change to how the drivetrain behaves this year doesn't risk breaking a subsystem another team is borrowing your code
for. It also means you should get comfortable cloning, branching, and opening pull requests in more than one repo, since
a single feature (say, a new vision-assisted alignment command) might touch both ```2kxx-Robot-Code``` and
```GompeiVision``` at once.

## Two Long-Lived Branches: ```main``` and ```development```

[```2kxx-Robot-Code```](https://github.com/Team-190/2k26-Robot-Code) is built around two branches that never get
deleted, and they mean different things:

* **```development```** is where the season actually happens. Every feature, event branch, and fix eventually gets
  merged in here. It's the default target for a pull request, and it's expected to move fast and occasionally be a
  little rough around the edges, it represents "everything the team has built so far," not "what's safe to compete with
  today."
* **```main```** represents what the robot actually runs at a competition. It only gets updated right before an event,
  when ```development``` has reached a point the team is confident enough to bring to the field. Outside of that,
  ```main``` mostly just sits there.

If you're opening a pull request and you're not sure which branch to target, the answer is almost always
```development```. Targeting ```main``` directly is reserved for the "promote development to main before an event"
moment described below, not for day-to-day feature work.

## Topic Branches

Nobody writes code directly on ```development``` either, all work still happens on a separate branch first, it's just
that the branch's destination is ```development``` instead of ```main```. Looking at the history of
```2kxx-Robot-Code```, branch names generally fall into a few categories:

* **Feature branches**: named after the thing being built, e.g. ```feature-v2-shooter``` or ```v2-intake-stow-fixes```.
  Branched off ```development```, and merged back into it once the feature works. Used for season-long development work
  that isn't tied to a specific competition.
* **Event branches**: named after the competition being prepared for, e.g. ```event-bc-turnover``` or
  ```event_mawor```. Used for the tuning and bugfixing that happens in the days leading up to and during an event, where
  changes need to be fast, isolated, and easy to throw away if they don't work out. These also merge back into
  ```development```, keeping whatever worked at that event as part of the ongoing codebase.
* **Fix / testing branches**: smaller, targeted branches like ```climber-pids``` or ```button-bindings``` for a single
  focused change.

There's no strict prefix system enforced by the tooling, but the naming should tell a teammate what the branch is *for*
at a glance. A branch called ```patch1``` tells the next person nothing; a branch called
```turret-testing``` does.

A large feature is sometimes built as its own mini integration point rather than one flat branch: several smaller
branches (```v2-intake-stow-fixes```, ```v2-pathplanner```, ```button-bindings```) merge into a bigger branch
(```v2-bringup```), which itself later merges into a season-long feature branch (```feature-v2```), which finally merges
into ```development```. Nest branches like this when a feature is big enough that reviewing it as one giant diff against
```development``` wouldn't be useful to anyone, not by default.

## Promoting ```development``` to ```main```

Shortly before an event, a mentor or lead student opens a pull request from ```development``` into ```main```, bringing
the competition branch up to date with everything that's been built and tested since the last event. This is a
deliberate, reviewed step, not something that happens automatically on every merge, which is exactly why
```main``` can be trusted to represent "what the robot currently runs" instead of "whatever was merged last."

## Pull Requests

Every topic branch merges back into ```development``` (or into ```main```, for the pre-event promotion above)
through a **pull request** (PR) on GitHub, never a direct push. Opening a PR does two things:

1. It runs the repository's CI checks (build and lint, see [Code Quality](CODE_QUALITY.md)) against your changes
   automatically.
2. It gives a mentor or a more experienced teammate a chance to read your code before it becomes part of the robot's
   permanent history.

Team 190 merges PRs with a **merge commit** rather than squashing or rebasing, so the individual commits you made on
your branch, and the PR discussion that happened around them, stay visible in the project history forever. This is
useful later: if a subsystem starts misbehaving, being able to find the exact PR that introduced a change (and read why
it was made) is often faster than guessing.

:::important If your branch isn't ready for review yet, open the PR as a **draft**. The Build and Lint workflows in
```2kxx-Robot-Code``` and ```GompeiLib``` only trigger when a PR is opened, marked ready for review, or updated
(```synchronize```), so keeping work-in-progress code in draft avoids spamming CI and your reviewers with a red X on
code you already know is unfinished. Mark it "Ready for review" once it actually is.
:::

## Commits

A commit should represent one coherent change, described in plain, direct language: what changed, not "misc fixes"
or "stuff". Looking through the team's history, good examples read like ```fix approval automation``` or
```remove test file```, not a vague catch-all. If you find yourself writing "and" three times in a commit message, it's
probably several commits pretending to be one.

Commit often enough that you could reasonably undo just your last change without losing unrelated work. You don't need
to agonize over commit granularity, but a single commit that rewrites an entire subsystem *and* retunes PID gains *and*
fixes an unrelated typo in a comment is much harder to review, and much harder to revert if only one part of it turns
out to be wrong.

## Automated Pull Requests

Not every PR is opened by a person. ```GompeiLib``` syncing into ```2kxx-Robot-Code``` (and back) happens through GitHub
Actions workflows that open PRs automatically, which a bot account then auto-approves once CI passes. This is covered in
detail in [Sync](../robot_code/gompeilib/SYNC.md), but it's worth knowing as you read project history:
a PR titled ```GompeiLib sync (pull) 20260506-022030``` isn't a mistake, it's the library-sharing pipeline doing its
job. The same branch-and-PR model you use for your own code is what the automation uses too, just triggered by a release
instead of a person clicking "New pull request."

Notice that these sync PRs target ```main``` directly rather than ```development```. That's intentional, a
```GompeiLib``` release is tied to whatever ```main``` currently represents, not to whatever's mid-flight on
```development```. It's the one routine exception to "target ```development```," and it's handled by automation
specifically so a person doesn't have to remember to make that call themselves.

## Resolving Conflicts

Because multiple students are often working on the same file (```RobotContainer.java``` is a common hotspot), merge
conflicts happen. A conflict isn't a sign you did something wrong, it just means Git can't tell which of two overlapping
changes should win, and needs a human to decide. Pull the latest ```development``` into your branch regularly rather
than waiting until the day before an event to find out your two-week-old branch has diverged from everything else that
shipped in the meantime; the longer a branch goes without syncing, the more painful the eventual conflict resolution
gets.
