# 🤖 AI Policy

Regardless of your opinion on AI, it has without a doubt become a big part of software development in the 2020s. This
article outlines the rules and regulations surrounding the use of AI when working with FRC 190 robot code.

## Why We Have This Policy

The reason for this policy is to foster a healthy relationship between students learning how to develop software and the
tools they use to do so. It can be very easy for people (not just students) to not realize how useful AI can be, and
become complacent about their learning, which can lead to a lack of autonomy when the tools aren't present. One of the
major goals of this policy is to prevent that from happening with students going through the software team on FRC 190.
Ultimately, FRC 190 is an educational program before it is a competitive one, and every rule in this policy is written
to protect that fact. The robot code we produce matters, but it matters far less than the understanding students walk
away with. AI tools are welcome here only to the extent that they deepen that understanding rather than replace it.

## Who This Applies To

These rules apply to any student/mentor developing code for any of the FRC 190 robots or robot adjacent projects:

* All 2kxx-Robot-Code Repositories
* GompeiLib
* GompeiVision
* GV-OS
* etc.

## What This Applies To

These rules apply to any AI-assisted tool used while developing FRC 190 software, including but not limited to:

* Chat-based assistants (e.g. ChatGPT, Claude, Gemini) used for coding help, debugging, or design discussion.
* AI coding agents, IDEs and CLI tools (e.g. Claude Code, OpenAI Codex, Gemini Antigravity, GitHub Copilot Workspace,
  Cursor's agent mode) that can read, write, or execute code on their own.
* AI-powered code review, refactoring, or documentation-generation tools.

This list is not exhaustive and is expected to grow as new tools emerge. If a tool isn't listed here but functions
similarly to one that is (i.e. it generates, modifies, or reasons about code on a student's behalf), it falls under this
policy. When in doubt, see [Questions](#questions).

## Permitted Uses

All the following are acceptable uses for AI in FRC 190 software development:

* Using AI for boilerplate, formatting, or non-decision-making scaffolding.
* Using AI as a sounding board for ideation and brainstorming when not working with another student.
* Using AI-assisted tooling for small, constrained tasks such as implementing common algorithms.
* Using AI to debug code by analyzing log data **AFTER** a list of potential bugs have been hypothesized and documented.
* Using AI to write documentation detailing the purpose and context of parts of the codebase.

## Prohibited Uses

All the following are unacceptable uses for AI in FRC 190 software development:

* Submitting AI-generated code the author cannot explain line-by-line if asked in review.
* Using AI to replace reading API documentation.
* Submitting AI-generated code as developer-written code.
* Using AI to write or modify safety-critical logic (soft limits, current limits, homing/zeroing routines, or anything
  else guarding hardware or people) without full human understanding and independent verification of that logic before
  it's tested on a robot.
* **vibe-coding**: where large tasks are delegated to AI, e.g. prompts such as:
    * "Implement an arm subsystem that ..."
    * "Fix the vision bug that results in ..."
    * "Design a superstructure that ..."
    * "Write a new Xbox controller layout based on ..."

## Disclosure Statements and Usage Reporting

Every FRC 190 repository provides a pull request template with sections already stubbed out for the items below. Use it
instead of writing the PR description from scratch; opening a PR against a Team-190 repo should pre-fill these sections
for you, and they just need to be filled in rather than deleted.

* Disclosure statement in the following format from
  the [Linux kernel](https://docs.kernel.org/process/coding-assistants.html), placed in the pull request description
  with one line per tool used:
    * `Assisted-by: AGENT_NAME:MODEL_VERSION [TOOL1] [TOOL2]`

  <details>
  <summary>Format Details and Examples</summary>

  Where `AGENT_NAME:MODEL_VERSION` identifies the AI tool and model used, and the optional bracketed `[TOOL1] [TOOL2]`
  list any specialized analysis tools the AI leaned on alongside itself (e.g. a linter or log-analysis tool). Basic
  development tools everyone already uses (git, Gradle, WPILib CLI, editors) should not be listed.

  For example:

    * `Assisted-by: Claude:claude-sonnet-5`
    * `Assisted-by: Claude Code:claude-opus-5 dataviz`
    * `Assisted-by: GitHub Copilot:gpt-4.1`
    * `Assisted-by: Gemini Antigravity:gemini-3-pro`
    * `Assisted-by: ChatGPT:o4-mini`

  </details>

* Environmental impact statement: a rough, good-faith estimate of the resource cost of the AI usage disclosed above,
  included alongside the `Assisted-by` line.

  <details>
  <summary>Methodology and Example</summary>

  AI providers do not publish exact per-query energy, water, or emissions figures, so there's no official source to copy
  a number from. That's the point: figuring out an honest estimate for *your own* session, using whatever public data
  you can dig up (a provider's sustainability report, published research on energy/water per token, the API's own
  pricing page for cost, token counts from the tool itself, etc.), is part of the disclosure. The goal isn't a precise
  ledger, it's making an invisible cost visible enough that it factors into whether reaching for AI was worth it.

  Hypothetical student's usage table, for reference on *format only*; do not reuse these numbers for a different
  session:

  | Metric          | Estimate                                                                      | Context                                  | Source                                                                                                            |
    |-----------------|-------------------------------------------------------------------------------|------------------------------------------|-------------------------------------------------------------------------------------------------------------------|
  | Session         | ~40-minute agentic session refactoring the elevator subsystem's state machine | N/A                                      | N/A, directly observed                                                                                            |
  | Input tokens    | ~78k                                                                          | Roughly a 140-page book you skimmed/read | Tool's own session/usage stats                                                                                    |
  | Output tokens   | ~7k                                                                           | Roughly a 12-page paper you wrote        | Tool's own session/usage stats                                                                                    |
  | Electricity     | ~45 Wh                                                                        | About running a laptop for 20 minutes    | Input + output tokens × published per-token energy estimates (e.g. Epoch AI research on LLM inference energy use) |
  | CO2e            | ~20 g                                                                         | About driving a gas car 50-100 m         | Electricity × regional grid carbon intensity (e.g. EPA eGRID / EIA average g CO2e per kWh)                        |
  | Water (cooling) | ~120 mL                                                                       | About half a bottle of water             | Electricity × data center water-usage-effectiveness research (e.g. UC Riverside, "Making AI Less Thirsty," 2023)  |
  | API cost        | ~$0.80                                                                        | Less than a vending machine snack        | Input + output tokens × the provider's published per-token input/output pricing for the model used                |

  The point isn't to guilt anyone out of using AI, it's the same reasoning as [Permitted Uses](#permitted-uses) and
  [Prohibited Uses](#prohibited-uses): a large agentic task run to avoid learning something costs real electricity,
  water, and money on top of the learning it also short-circuits. A quick, well-scoped question doesn't. Prefer the
  smallest tool/model that gets the job done, avoid re-running or regenerating output repeatedly to "reroll" an answer,
  and don't let an agent iterate unsupervised on a task a human could finish in the same time.
  </details>

* Chat log: the full transcript of the AI session (s) the contribution was built with, attached to or linked from the
  pull request. This isn't about catching anyone, it's what lets a reviewer see *how* an answer was reached, not just
  what came out the other end, which is the same reasoning behind [Review Standard](#review-standard).

  <details>
  <summary>How to attach one</summary>

    * Chat-based tools (ChatGPT, Claude, Gemini): use the tool's built-in share-link feature and paste the link in the
      PR description.
    * Agentic CLI/IDE tools (Claude Code, GitHub Copilot Workspace, Cursor, Gemini Antigravity): export or copy the
      session transcript into a file (e.g. `docs/ai-logs/<pr-number>.md`) and link it from the PR description. You can
      get access to this using open source tools such as https://github.com/jhlee0409/claude-code-history-viewer
    * If a tool has no export or share option, a full copy-paste of the conversation into the PR description is
      acceptable.

  Logs don't need to be edited for readability, but redact anything that genuinely shouldn't be shared (credentials,
  private team info unrelated to the code change) before attaching.

  </details>

If no AI tooling was used for a contribution, none of the above are required.

## Review Standard

AI assisted code is held to the same standard as non-AI assisted code. Students are expected to be able to understand
every line written by AI in context with the rest of the code project when asked about it in code reviews.

The developer who submits a contribution owns it, regardless of how much AI assistance was used to produce it. "The AI
wrote it that way" is not a defense for a bug, a safety issue, or code nobody on the team understands; if you submitted
it, you're expected to be able to explain and defend it like you wrote every line yourself.

## What Happens If This Policy Isn't Followed

This is a mentorship team, not a workplace, so this isn't enforced through penalties. In practice: if a PR is missing a
required disclosure, or a reviewer asks the author to explain their code, and they can't, the PR doesn't get merged
until that's resolved. That conversation happens with the reviewer first. If it keeps happening for the same person, a
mentor or the student software lead follows up directly until the issue is fixed.

## Questions

Any questions or concerns regarding this AI policy can be directed to the software mentor consortium or to the student
software lead.