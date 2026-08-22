# Repository Guidelines

## Project Structure & Module Organization

The distributable skill lives in `skills/speak-human/`. Its `SKILL.md` file contains YAML front matter and the instructions that govern rewriting behavior. `skills/speak-human/agents/openai.yaml` defines the display name, short description, and default prompt shown by compatible agents. The root `README.md` documents the purpose, installation, and package layout.

Keep files required at runtime inside `skills/speak-human/` so they are included when the skill is installed. Add folders such as `examples/`, `references/`, or `scripts/` only when they support a concrete use case.

## Development and Validation Commands

This repository has no build step or runtime dependencies. From the repository root, use:

```powershell
rg --files
Get-Content -Raw skills\speak-human\SKILL.md
git diff --check
git diff -- README.md skills/speak-human
```

These commands inspect the package, review the complete instruction flow, catch whitespace errors, and show the effective change. After installing the skill locally, invoke `$speak-human` against representative UI copy for an end-to-end check.

## Coding Style & Naming Conventions

Write Markdown and YAML as UTF-8. Use short, descriptive Markdown headings and direct, imperative instructions. Indent YAML with two spaces. Skill names and directories use lowercase kebab-case, such as `speak-human`; user-facing names use title case, such as `Speak Human`.

Keep `SKILL.md` front matter limited to valid metadata. Examples should contrast a specific internal phrase with natural user-facing wording. Preserve product facts, caveats, permissions, and legal meaning; never improve fluency by inventing claims.

## Testing Guidelines

There is currently no automated test suite or coverage target. Manually test at least one example containing internal process language and one containing legitimate technical terminology that should remain. Confirm that the result is understandable without project context, names a real next action, and introduces no unsupported facts. Recheck `README.md`, `SKILL.md`, and `openai.yaml` when names, prompts, or installation details change.

## Commit & Pull Request Guidelines

The repository has no commit history yet, so no established convention exists. Use concise, imperative, scoped messages, for example `docs: clarify claim-safety guidance`. Pull requests should explain the user-facing problem, list changed paths, include before/after copy examples, and report manual validation. Link relevant issues; include screenshots only when agent UI metadata or presentation changes.
