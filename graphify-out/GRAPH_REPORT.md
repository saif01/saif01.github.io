# Graph Report - .  (2026-08-18)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 17 nodes · 32 edges · 3 communities (2 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `176e2ef0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2

## God Nodes (most connected - your core abstractions)
1. `init()` - 11 edges
2. `onSubmit()` - 7 edges
3. `preferred()` - 3 edges
4. `current()` - 3 edges
5. `getStored()` - 2 edges
6. `apply()` - 2 edges
7. `isOpen()` - 2 edges
8. `setOpen()` - 2 edges
9. `onScroll()` - 2 edges
10. `observeSections()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `init()` --calls--> `preferred()`  [EXTRACTED]
  assets/js/main.js → assets/js/main.js  _Bridges community 2 → community 0_
- `init()` --calls--> `onSubmit()`  [EXTRACTED]
  assets/js/main.js → assets/js/main.js  _Bridges community 0 → community 1_

## Import Cycles
- None detected.

## Communities (3 total, 1 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.25
Nodes (8): apply(), clearField(), getStored(), init(), isOpen(), observeSections(), onScroll(), setOpen()

### Community 1 - "Community 1"
Cohesion: 0.52
Nodes (6): mailto(), onSubmit(), setStatus(), showErrors(), validate(), values()

## Knowledge Gaps
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `init()` connect `Community 0` to `Community 1`, `Community 2`?**
  _High betweenness centrality (0.183) - this node is a cross-community bridge._
- **Why does `onSubmit()` connect `Community 1` to `Community 0`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._