# Speak Human

Speak Human is a Codex skill that keeps generated website and product UI copy clear, factual, and appropriate for its audience. It applies while an agent creates, edits, or reviews rendered interface text, not only when a user explicitly asks for a rewrite.

Current release candidate: `0.1.0`. The canonical version is recorded in `VERSION` and `evals/manifest.json`.

The guardrail removes internal development and design commentary while preserving approved wording, verified facts, limitations, permissions, real actions, and legitimate operational or developer terminology. It does not rewrite generic prose or authorize layout, behavior, route, or source-of-record changes.

## Repository Layout

```text
skills/speak-human/                 Distributable skill
|-- SKILL.md
`-- agents/openai.yaml
evals/
|-- manifest.json                  Discovery, coverage, and gating policy
|-- schemas/                       Activation and behavior case contracts
|-- cases/                         Versioned, auto-discovered case suites
|-- rubric.md                      Semantic review criteria
`-- results/                       Recorded evaluation evidence
scripts/
|-- validate-evals.mjs             Offline deterministic gate
`-- run-live-evals.mjs             Explicitly authorized Codex evaluations
```

Evaluation assets stay outside `skills/speak-human/`; installing the skill does not install its development harness.

## Validate

The repository has no build step or package dependencies. Run these commands from the repository root:

```powershell
node scripts\validate-evals.mjs
node scripts\test-validate-evals.mjs
node scripts\test-run-live-evals.mjs
node scripts\validate-evals.mjs --list
python -B -X utf8 "$env:USERPROFILE\.codex\skills\.system\skill-creator\scripts\quick_validate.py" skills\speak-human
git diff --check
```

The deterministic validator checks both schemas, canonical JSON, unique IDs, lifecycle fields, duplicate and supersession links, accepted-case coverage, skill metadata, path containment, and text hygiene. Its self-test proves the main failure paths against disposable temporary copies. Neither command makes a network or model call.

## Extend the Case Corpus

Add conforming JSON suites anywhere under the activation or behavior discovery roots; the runner finds them recursively.

1. Capture a minimal, redacted scenario as `candidate` with a stable `sh_act_*` or `sh_beh_*` ID, locale, origin, date, tags, and safety impact.
2. Record facts and semantic invariants, not a preferred rewrite.
3. Link duplicates, replacements, and superseded cases explicitly.
4. Run the deterministic validator and review the case before changing it to `accepted`.
5. Add runtime guidance only when evidence reveals a general decision gap, repeated cross-surface failure, or safety-critical invariant.

`accepted` cases gate behavior. `candidate` cases collect evidence, and `retired` cases remain traceable without gating.

## Live Evaluation Boundary

Without `--execute`, the live runner only prints a plan:

```powershell
node scripts\run-live-evals.mjs --lane activation --model <model> --reasoning-effort medium --timeout-seconds 600 --case sh_act_marketing_page_zh
```

Add `--check-cli` to verify the local non-interactive Codex launcher without making a model call. The runner uses the documented [`codex exec` non-interactive mode](https://developers.openai.com/codex/noninteractive/).

A live run additionally requires explicit authorization and a new path under `evals/results/live/`:

```powershell
node scripts\run-live-evals.mjs --lane behavior --model <model> --reasoning-effort medium --timeout-seconds 600 --allow-provider-host <host> --execute --output evals/results/live/<run-id>
```

The runner stages the candidate as the only user skill in a temporary Codex home, links (never copies or reads) local authentication, and writes only allowlisted non-secret provider settings into the temporary config. A custom provider requires an exact `--allow-provider-host` match before any output directory or model call is created. The runner also disables plugin loading, uses an empty workspace and read-only sandbox, and records version, model, reasoning effort, timeout, provider-config hash, Git state, and artifact hashes. Behavior output remains candidate evidence until reviewed against `evals/rubric.md`.

Activation cases with `expectedActivation: review` are also reported as `review-required`: the runner records the model's contextual decision but does not mechanically force a literal `review` answer. A controller must assess whether the reason respects the documented boundary.

Behavior output keeps supplied interface roles and control types stable. Non-action roles must remain; a supplied action role is relabeled to an applicable real action, or omitted only when no such action exists. Empty, missing, or newly invented controls fail the automatic pre-review checks. Approved text must remain verbatim in the same role; contextual meaning is still reviewed manually.

Live calls, user-scope installation, commit, push, and release are separate actions. A source validation result does not prove that an installed copy was refreshed.
