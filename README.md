# FRC 190 Software Knowledge Base

A structured training curriculum for Team 190's programming students, covering the full stack of
competition robot software: Java fundamentals, robot code architecture, control systems, networking,
vision and localization, and team software engineering practices.

Built with [Docusaurus](https://docusaurus.io/) and published at
[team-190.github.io/190-Software-Knowledge-Base](https://team-190.github.io/190-Software-Knowledge-Base/).

## Structure

Content lives under `docs/`, organized into sections that build on each other:

* **FRC Hardware** — the roboRIO/SystemCore and the rest of the robot's electrical stack
* **Java** — fundamentals, control flow, OOP, data structures, advanced concepts
* **190 Robot Code** — lifecycle, architecture, hardware abstraction, subsystem state management,
  logging, and GompeiLib
* **Controls** — open loop, closed loop, motion profiling, motors/commutation, and hardware
  communication protocols
* **Networking** — IP addressing, ports/transport, DNS, FRC network topology, NetworkTables
* **Vision & Localization** — odometry, cameras, vision processing, coordinate frames, pose
  estimation, sensor fusion, latency
* **Software Engineering Practices** — version control, code quality, team development,
  contributing guidelines, AI policy

Sidebar ordering and grouping is defined in `sidebars.ts`; it's the source of truth for how pages
relate to each other, not just the folder layout under `docs/`.

## Local Development

Install dependencies:

```
$ npm install
```

Start a local dev server (most changes hot-reload without a restart):

```
$ npm run start
```

Type-check the site:

```
$ npm run typecheck
```

Build the static site into `build/`:

```
$ npm run build
```