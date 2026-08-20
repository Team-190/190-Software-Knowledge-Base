# 📈 Team Development

Robot code doesn't get written by one person. It gets written by a roster of students at wildly different points in
their programming journey, some of whom joined this year and some of whom are about to graduate, working together
under a deadline that doesn't move. Team development is about making sure knowledge, not just code, gets passed
down and doesn't disappear every time a senior class graduates.

## This Knowledge Base *Is* the Onboarding Path

This curriculum exists because "shadow a veteran until it makes sense" doesn't scale and doesn't survive graduation.
Working through it in order (Java fundamentals, then robot code architecture, then controls, then vision and
localization, then this section) is how a new student is meant to go from "never written a line of Java" to
"can independently own a subsystem." If you're a veteran student, pointing a rookie at the relevant section here
instead of re-explaining everything from scratch every single time is the entire point, use it.

If you find yourself explaining something to a teammate that isn't written down anywhere in this knowledge base,
that's a sign the knowledge base is missing something, not just a one-off conversation. Consider whether it belongs
here so the next person doesn't need you to repeat it.

## Roles on the Software Sub-Team

Not everyone on the software sub-team is doing the same job at the same time. Three student roles form a ladder,
each stepping up in scope, and each tied to a level of the git branch hierarchy, see
[Feature and Subfeature Branch Naming](GIT_STANDARDS.md#feature-and-subfeature-branch-naming) for how that
hierarchy shows up in a branch name itself. These roles aren't rigid job titles, they shift as students gain
experience, sometimes within the same season. The point of naming them is that when you open a pull request, it
should be clear who you expect to review it and why.

Two rules repeat at every level of the ladder below: a role creates the GitHub issues for the role beneath it,
never for itself, and a role can create branches for its own level and for every level beneath it. A Software
Developer sits at the bottom of both, so they never create their own issues, but they do create their own branch.
Whoever creates an issue is also the one who picks its title tag, see
[Issue and Pull Request Title Prefixes](GIT_STANDARDS.md#issue-and-pull-request-title-prefixes).

### Software Developer

Every student starts here. A Software Developer writes isolated code in a ```<feature>/<subfeature>/...```
branch, which they branch off their Task Manager's feature branch themselves, completing tightly focused tasks,
common ones being:

* Writing a specific sub-command
* Implementing subfeatures of a subsystem
* Implementing individual utility classes or functions
* Fixing isolated bugs
* Adding or updating tests
* Making small, well-defined changes to existing behavior

Beyond writing the code itself, a Software Developer is expected to:

* Work the GitHub issues their Task Manager has already created for them, rather than creating their own, and
  keep those issues updated with progress, blockers, and testing notes.
* Make sure their own code works before requesting review: test in simulation where practical, test on the real
  robot when practical and safe, verify existing functionality hasn't broken, and resolve known errors, warnings,
  and failing tests before asking for approval.
* Open a pull request once their work is ready for integration, clearly describing the changes made, the testing
  performed, and any known limitations, then request review from the appropriate Task Manager or Lead Software
  Developer.
* Review peers' work when appropriate, participate in simulation and real-robot testing, and help inform
  architecture decisions for the small portions of the codebase they touch.
* Work within the git organization according to the team's workflows and pipelines, respond to review feedback
  and make requested changes before approval, and never approve their own pull requests or merge their own work.

### Task Manager

A Task Manager manages a robot feature branch, using the ```<feature>/...``` naming convention, and makes
architecture decisions for that individual feature. They lead a 1-3 developer subgroup on a wide-scoped robot
task, common ones being:

* Implementing a subsystem
* Designing a complex multi-subsystem behavior or command
* Implementing a full autonomous routine
* Implementing a button layout
* Debugging and fixing faulty robot behavior

A Task Manager is expected to:

* Create the feature branch itself if the Lead Software Developer hasn't already, as well as the
  ```<feature>/<subfeature>/...``` branch for each Software Developer in their subgroup.
* Break larger features into appropriately sized issues and assign that work to Software Developers, creating the
  issues for the individual subfeature-level tasks required to complete the feature, since Software Developers
  don't create their own.
* Maintain the feature branch, making sure the work being integrated into it stays compatible with the overall
  feature, and review subgroup members' code.
* Approve pull requests from lower-level branches into the feature branch, only once the code has been
  adequately tested, and keep the feature branch buildable and functional as development progresses.
* Coordinate simulation and real-robot testing of the feature, resolve or escalate architectural conflicts within
  it, and recognize when a change is outside their scope of authority so it can go to the Lead Software Developer
  instead.
* Prepare a completed feature for the Lead Software Developer's review, making sure it's sufficiently tested and
  documented before requesting approval to merge it into ```development```. A Task Manager does not merge code
  into ```development``` without Lead Software Developer approval.

### Lead Software Developer

The Lead Software Developer maintains the overall technical direction and architecture of the software codebase,
and defines and maintains the team's development workflow and git organization, including managing
```development``` itself.

They're expected to:

* Create and manage feature-level issues, breaking large software initiatives into features and cross-feature
  changes that can be delegated to Task Managers, along with issues for software-wide tasks, architectural work,
  and technical debt that don't belong to any one feature.
* Create and manage the top-level ```<feature>``` branches for major robot features (and lower-level branches
  when necessary), and review and approve pull requests from feature branches into ```development```.
* Review architecture decisions that affect multiple subsystems or the overall codebase, and resolve
  disagreements between Task Managers over architecture or implementation.
* Ensure that code merged into ```development``` meets the team's standards for correctness, testing,
  maintainability, architecture, documentation, and git workflow, verifying a feature has been adequately tested
  before approving its merge.
* Coordinate full-system integration testing, and establish and maintain the team's coding standards, review
  standards, and testing expectations.
* Mentor Task Managers and Software Developers in software design, git, testing, debugging, and code review,
  helping students grow into making increasingly broad technical decisions on their own.

The Lead Software Developer has final student authority over software architecture and
```development```-branch integration decisions, and having permission to merge directly is not a reason to
bypass the review process. Day to day, their highest-level integration authority is ```development```: promoting
```development``` to ```main``` is the one exception, and it isn't theirs to do alone, a mentor and the Lead
Software Developer promote ```main``` together, see
[Promoting development to main](GIT_STANDARDS.md#promoting-development-to-main).

## Code Review Is a Teaching Tool, Not Just a Gate

[Code Quality](CODE_QUALITY.md) covers review as a way of catching bugs before they reach the field. On a student
team, review does something else just as important: it's usually where a rookie actually learns how the codebase is
supposed to work. A comment like "we use the [set-state pattern](../robot_code/SUBSYSTEM_STATE_MANAGEMENT.md) here
instead of a factory command because this subsystem has to persist a goal across periodic calls" teaches more than
any amount of reading docs in isolation, because it's tied to real code the student just wrote.

If you're reviewing a teammate's code, explain the *why* behind a requested change, not just the change itself.
"Move this to the IO layer" is a demand. "Move this to the IO layer, because the subsystem shouldn't know whether
it's talking to a real motor or a simulated one, see Hardware Abstraction" is a lesson that sticks the next time
they write a subsystem from scratch.

## Working Across Repositories and Sub-Teams

Software work doesn't happen in isolation from the rest of the team. A vision-assisted alignment feature might
require changes in ```GompeiVision``` *and* ```2kxx-Robot-Code```. A new mechanism means the software sub-team is
waiting on the build sub-team's CAD and the electrical sub-team's wiring before hardware abstraction code can be
tested for real. Being explicit about what you need from another sub-team, and by when, avoids a situation where
software finishes a feature the week before an event and only then discovers the hardware it depends on isn't
built yet.

```GompeiLib``` is the clearest example of this kind of shared ownership: it's maintained across seasons and
across whoever happens to be a lead student in a given year, synced into the season repo through the automated
pipeline described in [Sync](../robot_code/gompeilib/SYNC.md). Treat changes to it accordingly, a fix or a new
utility there outlives the current season and the current roster.

## Season Pace vs. Off-Season Pace

Build season (the six weeks between kickoff and a team's first competition) and the off-season demand different
things from how the team develops software:

* **During build season**, the priority is shipping a working robot. Feature branches move fast, event branches
  exist for last-minute, at-competition tuning, and code review needs to happen quickly without becoming a
  bottleneck. All of that still lands on ```development```, not ```main```, see
  [Git Standards](GIT_STANDARDS.md#two-long-lived-branches-main-and-development); ```main``` only gets updated
  once, right before the event, when a mentor and the Lead Software Developer together promote ```development```
  up to it, see [Roles on the Software Sub-Team](#roles-on-the-software-sub-team).
* **In the off-season**, there's room to do the things build season never has time for: paying down technical debt
  in ```GompeiLib```, writing the unit tests that season code skips, prototyping a "v2" of a mechanism
  (```v2-bringup```, ```turret-testing```), and updating this knowledge base itself.

Knowing which mode the team is in should shape how much process you expect around a given change. Insisting on the
same level of ceremony for an event-branch hotfix as for an off-season refactor slows down the wrong thing at the
wrong time.
