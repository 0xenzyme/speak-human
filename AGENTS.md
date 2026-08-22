# Repository Guidelines

## Project Structure & Module Organization

The installable skill is in `skills/speak-human/`: `SKILL.md` defines behavior and `agents/openai.yaml` defines discovery metadata. `VERSION` and `evals/manifest.json` record the release candidate version. Maintainer-only assets live at the root. `evals/cases/` contains activation and behavior suites; `evals/rubric.md` defines semantic review. Scripts are in `scripts/`, and durable planning records are in `docs/` and `harness/`.

## Development and Validation Commands

There is no build step or dependency installation.

```powershell
node scripts\validate-evals.mjs
node scripts\test-validate-evals.mjs
node scripts\test-run-live-evals.mjs
node scripts\validate-evals.mjs --list
node scripts\run-live-evals.mjs --help
python -B -X utf8 "$env:USERPROFILE\.codex\skills\.system\skill-creator\scripts\quick_validate.py" skills\speak-human
git diff --check
```

The first command is the offline repository gate. The live runner is plan-only unless `--execute` is explicitly supplied; model calls and user-scope installation require separate authorization.

## Coding Style & Naming Conventions

Use UTF-8, two-space JSON/YAML indentation, canonical JSON formatting, short Markdown headings, and direct instructions. Skill directories use lowercase kebab-case. Case IDs use `sh_act_*` or `sh_beh_*`; suite and tag values use lowercase kebab-case. Keep examples product-neutral and redact real observations.

## Testing Guidelines

Add or update cases for behavior changes. `accepted` cases gate coverage; `candidate` cases gather evidence; `retired` cases require a reason and traceable replacement when applicable. Test semantic invariants rather than exact prose. Approved wording, facts, limitations, permissions, and real actions must survive; unsupported claims or invented actions are failures. Run both the deterministic validator and official skill validator before review.

## Commit & Pull Request Guidelines

The initial history uses scoped, imperative messages such as `chore: initialize speak-human skill repository`; continue with `type: concise summary`. Do not commit generated live results casually. Pull requests should state the behavioral gap, list affected case IDs, explain any lifecycle changes, and report validation commands. Include before/after copy only as evidence, never as a universal required wording.

## Security & Delivery Boundaries

Never store credentials, customer data, or unredacted production copy in cases or results. Source validation, live evaluation, user-scope installation, commit, push, and release are distinct steps; report only the steps actually completed.
