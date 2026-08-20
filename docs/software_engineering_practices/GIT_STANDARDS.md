# 🔀 Git Standards

FRC 190's software isn't one codebase, it's several. ```2kxx-Robot-Code``` (season's robot), ```GompeiLib```
(the team's shared library), and ```GompeiVision``` (the vision coprocessor code) are all separate repositories under
the ```Team-190``` GitHub organization, and this knowledge base is a repository of its own too. Git and GitHub are what
let a whole roster of students, work on all of these at once without stepping on each other.

## What Git Actually Is

Git is a **distributed version control system**: a tool that keeps a history of every change ever made to a
project, and lets more than one person work on that project at the same time without overwriting each other's work.
"Distributed" is the key word, every clone of a repository (including the one on your own laptop) has the *entire*
project history in it, not just whatever you're currently looking at. That's different from something like a shared
Google Doc, where there's one canonical copy and everyone's editing it live; with Git, you have a full, independent
copy on your machine, you make changes to it privately, and you explicitly choose when to share those changes with
everyone else (and when to pull in theirs). GitHub is not Git, it's a website that hosts Git repositories and adds
things Git itself doesn't have: pull requests, code review, issues, and CI. You could use Git without GitHub, but
Team 190 uses GitHub as the shared meeting point all those independent laptop copies sync through.

## Commits and the Staging Area

The core unit of Git history is the **commit**, a labeled snapshot of every tracked file in the project at one
point in time, along with a message describing what changed and why. A commit isn't a diff, it's a full snapshot
(Git is smart about storing these efficiently under the hood, but conceptually, think "snapshot," not "list of
line changes"), and every commit points back to the commit that came right before it, which is what makes
```git log``` a readable timeline instead of a pile of unrelated changes.

Getting a change from "I edited a file" to "that's now a commit" goes through a middle step called the
**staging area** (sometimes called "the index"). There are three places a change can live:

1. **Working directory**: the files on disk, exactly as your editor left them. Running ```git status``` shows what's
   changed here that Git doesn't know about yet.
2. **Staging area**: changes you've explicitly marked as "include this in the next commit," using ```git add
   <file>``` (or ```git add .``` for everything that's changed).
3. **Repository**: the permanent, committed history, created by running ```git commit -m "message"```, which takes
   whatever's currently staged and turns it into a new snapshot.

The staging area exists so a commit can be *smaller* than "everything you touched since lunch." If you fixed a bug
in ```Climber.java``` and also happened to reformat an unrelated file while you were in there, ```git add
Climber.java``` followed by ```git commit``` lets you commit just the bug fix, leaving the unrelated change
unstaged for its own commit later, exactly the "one commit, one coherent change" habit described in
[Commits](#commits) below. ```git diff``` shows you unstaged changes; ```git diff --staged``` shows you what's
about to go into the next commit.

## Branches Are Pointers, Not Copies

A **branch** is just a movable label pointing at one specific commit, nothing gets copied or duplicated when you
create one. ```git branch <name>``` creates a new label pointing at whatever commit you're currently on;
```git switch <name>``` (or the older ```git checkout <name>```) moves a special pointer called **```HEAD```**
to point at that label instead, which is what makes your working directory's files change to match that branch.
```git switch -c <name>``` does both at once, create the branch and move to it, which is the command you'll reach
for almost every time you start new work, see [Topic Branches](#topic-branches) below for what to actually name it.

Because a branch is just a pointer, not a copy, creating one is instant and cheap no matter how large the repository
is, this is *why* Git-based workflows lean so heavily on branching for every piece of work, however small, instead
of everyone working directly on one shared line of history. When a branch's changes get folded back into another
branch (see [Merging](#merging) below), the pointer is what moves, the underlying commits were there the whole time.

## Remotes: How Your Laptop Talks to GitHub

Your local repository doesn't automatically know about anyone else's changes, or even about GitHub's copy of the
repository, until you explicitly sync with it. The GitHub copy is called a **remote**, and by convention the remote
you cloned from is named ```origin```. Four commands cover almost everything you need:

* **```git clone <url>```**: copies an entire remote repository, full history included, down to your machine for
  the first time. You only do this once per repository per machine.
* **```git fetch```**: downloads any new commits from the remote into your local repository, without touching your
  working directory or merging anything into your current branch. It's a safe, read-only "see what's changed."
* **```git pull```**: a ```git fetch``` immediately followed by merging the remote's version of your current branch
  into your local one. This is what you run to catch your local ```development``` up with everything that's merged
  on GitHub since you last checked, see [Resolving Conflicts](#resolving-conflicts) for what happens if that merge
  doesn't go cleanly.
* **```git push```**: uploads your local commits to the remote, making them visible to everyone else. The first time
  you push a brand-new branch, add ```-u origin <branch-name>``` so Git remembers which remote branch this one
  tracks, after that a plain ```git push``` is enough.

## Merging

Merging is how the commits on one branch get folded into another. Git handles this two different ways depending on
whether the branches have diverged:

* **Fast-forward merge**: if the target branch (say ```development```) hasn't had any new commits since you branched
  off it, Git can just move ```development```'s pointer forward to match your branch, no new commit needed, the
  history stays a single straight line.
* **Three-way merge**: if ```development``` *has* moved since you branched off (almost always true in practice, since
  other people are merging into it too), Git creates a new **merge commit** with two parents, one pointing at
  ```development```'s previous tip and one at your branch's tip. This is the kind of merge a GitHub pull request
  produces, see [Pull Requests](#pull-requests) below for why Team 190 deliberately keeps this merge commit instead
  of squashing it away.

Either way, merging is what a pull request does when it's approved and clicked "Merge," it's the same operation
```git merge <branch>``` performs locally, GitHub is just running it for you on its own copy of the repository.

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
  that isn't tied to a specific competition. Anything underneath a feature branch follows a stricter, slash-based
  naming convention, see [Feature and Subfeature Branch Naming](#feature-and-subfeature-branch-naming) below.
* **Event branches**: named after the competition being prepared for, e.g. ```event-bc-turnover``` or
  ```event_mawor```. Used for the tuning and bugfixing that happens in the days leading up to and during an event, where
  changes need to be fast, isolated, and easy to throw away if they don't work out. These also merge back into
  ```development```, keeping whatever worked at that event as part of the ongoing codebase.
* **Fix / testing branches**: smaller, targeted branches like ```climber-pids``` or ```button-bindings``` for a single
  focused change.

Event and fix/testing branches don't follow a strict prefix system enforced by the tooling, but the naming should tell
a teammate what the branch is *for* at a glance. A branch called ```patch1``` tells the next person nothing; a branch
called ```turret-testing``` does. Feature branches, on the other hand, *do* follow a strict convention, described next.

## Feature and Subfeature Branch Naming

The three student roles described in
[Roles on the Software Sub-Team](TEAM_DEVELOPMENT.md#roles-on-the-software-sub-team) map directly onto how a
feature branch's name is built out of slashes:

* A top-level ```<feature>``` branch (e.g. ```v2-shooter```) is owned day to day by a Task Manager, and can be
  created either by the Lead Software Developer or by the Task Manager themselves. It's branched off
  ```development```, and it's what eventually gets reviewed by the Lead Software Developer and merged back into
  ```development```.
* Underneath it, a Software Developer works in a ```<feature>/<subfeature>``` branch (e.g.
  ```v2-shooter/flywheel-sysid```), branched off the feature branch instead of off ```development``` directly.
  This one can be created either by the Task Manager, when they're assigning the subfeature out, or by the
  Software Developer themselves. Each slash-delimited segment narrows the scope one level further: the branch
  belongs to whoever owns that segment, and merges back up into the branch one level above it, via its own pull
  request, not straight into ```development```. The rule behind both bullets is the same one level up: a role can
  create branches at its own level and at every level beneath it, see
  [Roles on the Software Sub-Team](TEAM_DEVELOPMENT.md#roles-on-the-software-sub-team).
* Nothing stops a subfeature from splitting further, ```<feature>/<subfeature>/<sub-subfeature>```, when even a
  subfeature turns out to be too wide-scoped for one pull request to review sensibly. The rule holds at every
  level: branch off the level directly above you, and merge back into it, never skip a level.

So for a feature like a 2026 shooter, the chain might look like
```v2-shooter/flywheel-sysid``` → ```v2-shooter``` → ```development```: two pull requests, each reviewed by
whoever owns the tier above (a Task Manager approves the first, the Lead Software Developer approves the second).
This mirrors how a large feature has always been built at Team 190, several smaller branches merging into a
bigger integration branch before that finally merges into ```development```, for example
```v2-intake-stow-fixes```, ```v2-pathplanner```, and ```button-bindings``` merging into ```v2-bringup```, which
itself later merged into a season-long feature branch (```feature-v2```). The slash convention just makes that
same nesting explicit in the branch name itself, instead of leaving it for a teammate to infer from context. Nest
branches like this when a feature is big enough that reviewing it as one giant diff against ```development```
wouldn't be useful to anyone, not by default.

## Promoting ```development``` to ```main```

Shortly before an event, a mentor and the Lead Software Developer together open a pull request from
```development``` into ```main```, bringing the competition branch up to date with everything that's been built
and tested since the last event. Day to day the Lead Software Developer's highest-level integration authority is
```development```; promoting to ```main``` is the one exception, and it's a joint action with a mentor rather than
something the Lead Software Developer does alone, see
[Roles on the Software Sub-Team](TEAM_DEVELOPMENT.md#roles-on-the-software-sub-team). This is a deliberate, reviewed
step, not something that happens automatically on every merge, which is exactly why ```main``` can be trusted to
represent "what the robot currently runs" instead of "whatever was merged last."

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

## Issue and Pull Request Title Prefixes

Every issue and pull request title in ```2kxx-Robot-Code```, ```GompeiLib```, and ```GompeiVision``` starts with a
bracketed tag naming what kind of work it is: ```[Tag] Title```, for example ```[Feature] Add v2 shooter subsystem```
or ```[Fix] Climber PID overshoot at full extension```. A GitHub label (```bug```, ```enhancement```,
```documentation```) tells you what's going on if you're already looking at the issue on GitHub, but a prefix shows
up everywhere a label doesn't: the branch list, ```git log```, and merge-commit history all read cleanly without
ever touching GitHub's UI.

The tags mirror the branch categories from [Topic Branches](#topic-branches), so the tag on an issue tells you which
kind of branch is about to get created for it, before that branch exists:

| Tag             | Used for                                                                                                                | Branch type                                                                                    |
|------------------|--------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------|
| ```[Feature]```  | Season-long feature or subfeature work: a subsystem, an autonomous routine, a button layout, anything with a ```<feature>``` or ```<feature>/<subfeature>``` branch. | Feature branch                                                                                   |
| ```[Event]```    | Tuning and bugfixing tied to a specific competition, opened and closed inside that event's window.                       | Event branch                                                                                      |
| ```[Fix]```      | A small, isolated bug fix or targeted change that doesn't belong to a feature or an event.                                | Fix / testing branch                                                                              |
| ```[Refactor]``` | Off-season restructuring or technical debt that isn't tied to any single feature, see [Season Pace vs. Off-Season Pace](TEAM_DEVELOPMENT.md#season-pace-vs-off-season-pace). | Fix / testing branch, or a feature branch if the rework is large enough to warrant one            |
| ```[Docs]```     | Documentation-only changes: this knowledge base, or in-code Javadoc and READMEs.                                          | Fix / testing branch                                                                              |
| ```[Test]```     | Test-only changes, most commonly ```GompeiLib``` unit tests, see [Unit Testing](../robot_code/gompeilib/UNIT_TESTING.md). | Fix / testing branch                                                                              |

A subfeature issue keeps its parent feature's ```[Feature]``` tag rather than getting a tag of its own, the slash in
the branch name (```<feature>/<subfeature>```) is what narrows the scope, not the title prefix, see
[Feature and Subfeature Branch Naming](#feature-and-subfeature-branch-naming).

Whoever opens the issue picks the tag, and a pull request that closes an issue keeps that same tag in its own title,
so the tag stays consistent from issue, to branch, to PR, to merge commit. The one exception is the automated
```GompeiLib``` sync PRs described in [Automated Pull Requests](#automated-pull-requests) below, their titles are
generated by the sync pipeline itself and aren't expected to carry a tag.

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
conflicts happen. A conflict isn't a sign you did something wrong, it just means the [three-way merge](#merging)
touched the *same lines* on both sides and Git has no way to guess which version should win, so it stops and asks a
human to decide instead of guessing. This happens whether the merge is coming from ```git pull```, ```git merge```,
or GitHub resolving a pull request, it's the same underlying situation every time.

When it happens, Git edits the conflicting file in place and marks every conflicting section with conflict markers:

```
<<<<<<< HEAD
  arm.setPositionGoal(Rotation2d.fromDegrees(45));
=======
  arm.setPositionGoal(ArmConstants.SCORE_ANGLE);
>>>>>>> feature/v2-shooter
```

Everything between ```<<<<<<< HEAD``` and ```=======``` is what your current branch already had; everything between
```=======``` and ```>>>>>>> <other-branch>``` is what's coming in from the branch being merged. Resolving the
conflict means editing that section by hand into what the code *should* actually say, which might be one side, the
other side, some combination of both, or something new entirely, then deleting the conflict markers themselves, Git
doesn't remove them for you. In the example above, the fix is almost always the second version (a named constant
beats a hardcoded magic number), so resolving it means deleting everything except
```arm.setPositionGoal(ArmConstants.SCORE_ANGLE);``` and the markers around it.

Once every conflicted file is edited and marker-free, stage each one with ```git add <file>``` the same way you'd
stage any other change, this is how you tell Git "I've resolved this one," then run ```git commit``` (with no
message needed, Git pre-fills a merge commit message) to finish the merge. ```git status``` lists which files are
still conflicted at any point, so it's a reliable way to check you haven't missed one.

Pull the latest ```development``` into your branch regularly rather than waiting until the day before an event to
find out your two-week-old branch has diverged from everything else that shipped in the meantime; the longer a
branch goes without syncing, the more conflicting sections you'll have to work through at once, and the harder it
is to tell what each one *should* resolve to.
