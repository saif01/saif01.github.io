# Md. Syful Islam — Portfolio

Static personal site (HTML5, CSS3, vanilla JavaScript). No frameworks, no jQuery, no build step.
Project skills live in `.claude/skills/` (graphify). Mirrors: `.agents/skills/`, `.cursor/skills/`, `.codex/skills/`.

## Graphify-first policy

A persistent knowledge graph lives at **`graphify-out/`** (repo root): **17 nodes / 32 edges** from
site JavaScript, scanned from the root (`.`), excluding vendor, images, documents, and agent
wiring (see `.graphifyignore`). When answering a natural-language question about the codebase,
treat it as a graphify query first — run `graphify query "<question>"` before falling back to
grep/read.

There is exactly **one** graph, at the repo root. Never create a nested one; nested graphify output
dirs are gitignored and must not be committed.

- "How does X work?" → `graphify query "<question>"`
- "What calls X?" / "Where is X used?" → `graphify explain "<NodeName>"`
- "How does A connect to B?" → `graphify path "<A>" "<B>"`
- Overview → `graphify-out/GRAPH_REPORT.md`

God nodes: `init()`, `onSubmit()`, `preferred()`, `current()`, `getStored()`, `apply()`,
`isOpen()`, `setOpen()`, `onScroll()`, `observeSections()`.

Keep it current from the **project root only**:

```bash
graphify update .   # AST-only, free — after code changes
graphify .          # full pipeline — when docs/PDFs/images are added
```

Never pass a subfolder as the scan root — that spawns a stray nested `graphify-out/`.
`assets/vendor/`, `assets/images/`, `assets/img/`, and `assets/documents/` are out of scope; say so
rather than guessing if a question touches them.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
