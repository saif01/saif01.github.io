# Graph Report - saif01.github.io  (2026-08-18)

## Corpus Check
- 5 files · ~6,512 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 63 nodes · 74 edges · 9 communities (8 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fda92a9d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- init
- main.js
- current
- Graphify-first policy (read before exploring code)
- Md. Syful Islam — Portfolio
- MD. SYFUL ISLAM
- Md. Syful Islam — Portfolio
- CORE EXPERTISE
- SELECTED ENTERPRISE PROJECTS

## God Nodes (most connected - your core abstractions)
1. `init()` - 11 edges
2. `MD. SYFUL ISLAM` - 10 edges
3. `Md. Syful Islam — Portfolio` - 8 edges
4. `onSubmit()` - 7 edges
5. `CORE EXPERTISE` - 7 edges
6. `Graphify-first policy (read before exploring code)` - 5 edges
7. `SELECTED ENTERPRISE PROJECTS` - 5 edges
8. `preferred()` - 3 edges
9. `current()` - 3 edges
10. `Md. Syful Islam — Portfolio — Agent Guide` - 3 edges

## Surprising Connections (you probably didn't know these)
- `init()` --calls--> `preferred()`  [EXTRACTED]
  assets/js/main.js → assets/js/main.js  _Bridges community 2 → community 0_
- `init()` --calls--> `onSubmit()`  [EXTRACTED]
  assets/js/main.js → assets/js/main.js  _Bridges community 0 → community 1_

## Import Cycles
- None detected.

## Communities (9 total, 1 thin omitted)

### Community 0 - "init"
Cohesion: 0.25
Nodes (8): apply(), clearField(), getStored(), init(), isOpen(), observeSections(), onScroll(), setOpen()

### Community 1 - "main.js"
Cohesion: 0.52
Nodes (6): mailto(), onSubmit(), setStatus(), showErrors(), validate(), values()

### Community 3 - "Graphify-first policy (read before exploring code)"
Cohesion: 0.25
Nodes (7): God nodes (start here), graphify, Graphify-first policy (read before exploring code), Keeping the graph current, Md. Syful Islam — Portfolio — Agent Guide, Out of scope, Workflow for any codebase question

### Community 4 - "Md. Syful Islam — Portfolio"
Cohesion: 0.50
Nodes (3): graphify, Graphify-first policy, Md. Syful Islam — Portfolio

### Community 5 - "MD. SYFUL ISLAM"
Cohesion: 0.15
Nodes (12): AI & AUTOMATION LEADERSHIP, Bachelor of Science in Computer Science, C.P. Bangladesh Co. Ltd. | Department Manager - Application Development, DEPARTMENT MANAGER, EDUCATION, LANGUAGES, Master's in Information Technology, MD. SYFUL ISLAM (+4 more)

### Community 6 - "Md. Syful Islam — Portfolio"
Cohesion: 0.22
Nodes (8): Contact, Customization, Features, Local preview, Md. Syful Islam — Portfolio, Sections, Stack, Structure

### Community 7 - "CORE EXPERTISE"
Cohesion: 0.29
Nodes (7): AI & Automation, Architecture & Operations, CORE EXPERTISE, Full-Stack Engineering, Google & Integrations, Infrastructure & DevOps, Leadership & Delivery

### Community 8 - "SELECTED ENTERPRISE PROJECTS"
Cohesion: 0.40
Nodes (5): C.P. Bangladesh Corporate & Recruitment Platform, CP Five Star, CP Five Star POS, IT Portal - Enterprise Application Platform, SELECTED ENTERPRISE PROJECTS

## Knowledge Gaps
- **32 isolated node(s):** `Workflow for any codebase question`, `God nodes (start here)`, `Keeping the graph current`, `Out of scope`, `graphify` (+27 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `MD. SYFUL ISLAM` connect `MD. SYFUL ISLAM` to `SELECTED ENTERPRISE PROJECTS`, `CORE EXPERTISE`?**
  _High betweenness centrality (0.127) - this node is a cross-community bridge._
- **Why does `CORE EXPERTISE` connect `CORE EXPERTISE` to `MD. SYFUL ISLAM`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Why does `SELECTED ENTERPRISE PROJECTS` connect `SELECTED ENTERPRISE PROJECTS` to `MD. SYFUL ISLAM`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **What connects `Workflow for any codebase question`, `God nodes (start here)`, `Keeping the graph current` to the rest of the system?**
  _32 weakly-connected nodes found - possible documentation gaps or missing edges._