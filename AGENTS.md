# Md. Syful Islam — Portfolio — Agent Guide

Static personal site (HTML5, CSS3, vanilla JavaScript). No frameworks, no jQuery, no build step.
Live: https://saif01.github.io

Project skills live in `.claude/skills/` (graphify). Mirrors: `.agents/skills/`, `.cursor/skills/`, `.codex/skills/`.

## Graphify-first policy (read before exploring code)

This project has a persistent knowledge graph at **`graphify-out/`** (repository root) covering
**17 nodes / 32 edges** from site JavaScript (`assets/js/main.js`), scanned from the root (`.`).
Consult the graph before reading raw source files; one graph lookup replaces dozens of file reads
(~AST-only, 0 LLM tokens).

There is exactly **one** graph, at the repo root. Never create a nested one (e.g.
`assets/graphify-out/`) — nested graphify output dirs are gitignored and must not be committed.

### Workflow for any codebase question

1. Query the graph first:
   - "How does X work?" → `graphify query "<question>"`
   - "What calls X?" / "Where is X used?" → `graphify explain "<NodeName>"`
   - "How does A connect to B?" → `graphify path "<A>" "<B>"`
   - Overview → read `graphify-out/GRAPH_REPORT.md`
2. Fall back to reading/grepping the cited files only if the graph is insufficient.
3. Cite `source_file` / `source_location` from the graph in answers.

### God nodes (start here)

`init()` (11), `onSubmit()` (7), `preferred()` (3), `current()` (3), `getStored()` (2),
`apply()` (2), `isOpen()` (2), `setOpen()` (2), `onScroll()` (2), `observeSections()` (2).

### Keeping the graph current

From the **project root** only (never a subfolder):

```bash
graphify update .   # AST-only, free — run after code changes
graphify .          # full pipeline — run when docs/PDFs/images are added
```

Passing a subfolder as the scan root creates a stray nested `graphify-out/` and fragments the graph.

### Out of scope

`assets/vendor/`, `assets/images/`, `assets/img/`, and `assets/documents/` are not in the graph
(see `.graphifyignore`). If a question touches them, say so — don't guess.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, invoke the `skill` tool with `skill: "graphify"` before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
