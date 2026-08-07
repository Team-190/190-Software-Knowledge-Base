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

Not everyone on the software sub-team is doing the same job at the same time:

* **Mentors** set technical direction, review architecture-level decisions, and are the final backstop before
  something questionable makes it onto the competition robot.
* **Lead / veteran students** own specific subsystems or shared infrastructure (like ```GompeiLib```), review
  pull requests from less experienced teammates, and are usually the first point of contact when something breaks.
* **Rookies and newer students** work on scoped, well-defined pieces of a subsystem, with the expectation that
  their code gets reviewed closely, not as a formality, but because review is how they learn the team's actual
  conventions instead of just what compiles.

These roles aren't rigid job titles, they shift as students gain experience. The point of naming them is that when
you open a pull request, it should be clear who you expect to review it and why.

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
  [Version Control](VERSION_CONTROL.md#two-long-lived-branches-main-and-development); ```main``` only gets updated
  once, right before the event, when a mentor or lead promotes ```development``` up to it.
* **In the off-season**, there's room to do the things build season never has time for: paying down technical debt
  in ```GompeiLib```, writing the unit tests that season code skips, prototyping a "v2" of a mechanism
  (```v2-bringup```, ```turret-testing```), and updating this knowledge base itself.

Knowing which mode the team is in should shape how much process you expect around a given change. Insisting on the
same level of ceremony for an event-branch hotfix as for an off-season refactor slows down the wrong thing at the
wrong time.
