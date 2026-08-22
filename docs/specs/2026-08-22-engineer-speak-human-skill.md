# Draft: Engineer Speak Human as a Behavior-Validated UI Copy Guardrail

Created: 2026-08-22
Status: draft
Target: `skills/speak-human/`
Harness state: shaping-only; no accepted Goal or Run
Harness contract: `fixed`
Harness language: `zh-CN`

## Decision

- Keep Speak Human as a standalone Codex skill with its own release and evaluation lifecycle.
- Engineer it as a guardrail for user-visible copy created or changed during frontend development, not only as an explicit copy-rewriting tool.
- Define observable behavior and evaluation cases before changing `SKILL.md`.
- Maintain an extensible case corpus with explicit lifecycle, provenance, and promotion rules.
- Preserve automatic skill discovery. Do not make invocation explicit-only.
- Keep deterministic validation separate from optional live model evaluation.
- Do not merge the skill into Agent Harness. Harness structures this work but is not a runtime dependency of the skill.

## Problem

The current skill is structurally valid and has useful rules for separating product facts from internal rationale. It does not yet prove the behavior expected from GPT-5.6 during page development.

Current gaps are:

- discovery metadata emphasizes explicit rewriting rather than creating or editing rendered UI copy;
- examples can introduce unsupported claims such as scale or coverage;
- a phrase blacklist can remove legitimate product, operations, or developer terminology;
- hierarchy and CTA guidance can imply actions or behavior that do not exist;
- approved copy and source-of-record content are not explicitly protected;
- common UI states and developer-facing products are underrepresented;
- structural validation exists, but activation and output behavior have no repeatable evaluation suite.

## Desired Outcome

When Codex creates or edits user-visible interface text, Speak Human should:

1. activate without requiring the user to say "rewrite this copy";
2. remove implementation commentary, design rationale, evaluation rubrics, internal workflow labels, and generated filler from rendered text;
3. preserve approved wording, verified facts, material limitations, legal meaning, permissions, and audience-appropriate domain terminology;
4. avoid inventing claims, states, actions, routes, permissions, or product behavior;
5. improve only the copy within the requested surface unless broader layout or behavior changes are explicitly requested;
6. remain useful for marketing pages, product workflows, admin tools, and developer products without imposing one voice or sales style.

## Scope

- Refine the skill description and invocation metadata so discovery covers visible-copy work during frontend implementation.
- Restructure `SKILL.md` around contextual classification and semantic preservation rather than fixed phrase replacement.
- Add explicit rules for approved copy, source-of-record content, real actions, scope containment, locale, and product voice.
- Cover headings, labels, buttons, forms, empty states, loading states, errors, success messages, confirmations, permission states, metadata, and accessibility labels.
- Add an extensible repository-level registry of activation and behavior evaluations in both Chinese and English.
- Add deterministic evaluation-data validation and an opt-in live Codex evaluation path.
- Document repeatable source validation and, when separately authorized, user-scope installation verification.

## Non-Goals

- Generic prose polishing, brand-voice invention, or marketing optimization.
- AI-detector evasion or making generated text appear human-authored.
- Rewriting technical documentation, API contracts, database schemas, code identifiers, logs, or internal runbooks by default.
- Changing layouts, navigation, permissions, workflows, or application behavior merely to improve wording.
- Inventing customer evidence, metrics, availability, compliance, security, pricing, delivery, or performance claims.
- Maintaining a universal blacklist or translation dictionary.
- Copying every newly observed case into `SKILL.md` or treating one product's wording as a universal rule.
- Requiring exact output wording or snapshotting prose as the primary test strategy.
- Packaging Speak Human as a plugin or integrating it into Agent Harness in this scope.
- Commit, push, release, or user-scope installation without separate authorization.

## Behavioral Contract

### Activation

Activate when the task creates, edits, or reviews rendered website or product UI copy, especially when Codex is generating the visible text. Explicit copy-rewrite requests remain supported.

Do not activate for a CSS-only change, backend refactor, internal code naming, technical documentation, API/schema work, or generic prose editing when no user-visible product copy is in scope.

Boundary cases must be decided by the audience and the role of the text, not by keywords. The same term can be internal leakage in one product and required user language in another.

### Semantic Preservation

- Treat user-provided approved copy and repository content sources as authoritative unless the user asks to change them.
- Preserve every proposition that affects capability, availability, quantity, quality, price, permission, safety, compliance, delivery, or legal meaning.
- Preserve domain and technical terms when the intended user needs them to understand or operate the product.
- Remove internal rationale only from rendered text; do not erase it from product documents or source comments unless requested.
- When facts or real actions are missing, use conservative literal wording or surface the missing decision. Do not fill gaps with plausible product behavior.

### Action Integrity

- A CTA must map to an action, route, or control that actually exists in the scoped implementation.
- Do not add a CTA merely because a page pattern normally has one.
- Preserve disabled, unavailable, permission-limited, and read-only states.
- Error and empty-state copy may explain recovery only when the recovery action is real and available to the current user.

### Surface-Specific Behavior

| Surface | Required behavior |
| --- | --- |
| Marketing or landing page | State the concrete offer and verified evidence; remove funnel, persuasion, and layout rationale. |
| Product workflow | State the current condition, affected object, and real next action without exposing implementation sequence. |
| Admin or operations UI | Preserve precise statuses, identifiers, lifecycle terms, and controls needed to do the work. |
| Developer product | Preserve API, protocol, credential, webhook, retry, and error terminology when technically accurate and user-relevant. |
| Errors and empty states | Explain what is true now and, when available, one legitimate recovery or next action. |

### Scope Containment

- Inspect enough surrounding visible context to keep the changed copy coherent, but do not rewrite unrelated surfaces.
- Do not rename code identifiers, routes, analytics events, schema fields, or localization keys solely to make visible copy sound natural.
- Preserve the interface language and established product vocabulary.
- Verify text fit at relevant breakpoints when the task includes a runnable interface; otherwise record layout-fit risk without expanding the task.

## Skill Design

The revised entrypoint should remain concise and self-contained:

1. A discriminating frontmatter description that covers frontend creation and editing.
2. A short decision model for approved copy, facts, user value, real actions, domain terms, and internal language.
3. A proportional workflow for inspecting the scoped rendered surface.
4. Semantic, claim, action, and scope safeguards.
5. A completion check based on meaning rather than forbidden words.

Remove or replace the current fixed translation table and keyword blacklist. Do not add supporting references unless conditional material becomes substantial enough to justify progressive disclosure.

`agents/openai.yaml` should remain aligned with the final description and default prompt. Implicit invocation remains enabled by default.

## Evaluation Architecture

Planned repository shape:

```text
evals/
|-- manifest.json
|-- schemas/
|   |-- activation-case.schema.json
|   `-- behavior-case.schema.json
|-- cases/
|   |-- activation/
|   |   |-- core.json
|   |   `-- boundary.json
|   `-- behavior/
|       |-- marketing.json
|       |-- product-ui.json
|       |-- admin-ops.json
|       |-- developer-tools.json
|       `-- ui-states.json
`-- rubric.md
scripts/
|-- validate-evals.mjs
`-- run-live-evals.mjs
skills/speak-human/
|-- SKILL.md
`-- agents/openai.yaml
```

Evaluation files are maintainer assets and must remain outside the distributable skill directory unless the skill needs them at runtime. The manifest declares the schema version, case discovery paths, required coverage groups, and gating policy. Runners discover conforming case files instead of hard-coding the initial filenames.

### Activation Cases

Each case records:

- stable case ID and locale;
- lifecycle status and provenance;
- user request and relevant task context;
- surface type;
- expected activation: `yes`, `no`, or `review`;
- short routing rationale.

The initial matrix must include:

- landing-page and product-page creation with generated visible copy;
- component edits containing internal process language;
- CSS-only and backend-only changes;
- technical documentation and API/schema work;
- admin terminology that must remain;
- developer-tool UI containing legitimate technical language;
- already-natural or explicitly approved copy;
- mixed requests where only part of the task changes visible text.

### Behavior Cases

Each case records:

- input copy and enough surrounding interface context;
- approved copy and verified facts;
- available actions and permission state;
- propositions that must remain;
- internal intents that must not remain rendered;
- claims, actions, and semantics that must not be inferred;
- breakpoint or length constraints when material.

Required surface coverage includes marketing, SaaS workflow, admin/operations, developer tooling, form validation, loading, error, success, empty, confirmation, permission, read-only, and no-action states.

### Case Lifecycle and Extension Policy

The corpus is designed to grow as real usage reveals new failures and boundary conditions. New cases must be addable without changing the runner when they conform to the current schema.

Each case has one lifecycle state:

- `candidate`: captured from a new observation but not yet accepted as a regression gate;
- `accepted`: reviewed, deduplicated, reproducible, and included in the applicable gate;
- `retired`: retained with a reason and replacement or superseding case when applicable, but no longer gates current behavior.

Every new case must include:

- a stable ID, locale, surface tags, and date added;
- origin type such as `synthetic`, `real-redacted`, or `regression`;
- the minimum context needed to reproduce the decision without customer data or secrets;
- expected semantic invariants and the safety impact of failure;
- links to any case it duplicates, supersedes, or narrows.

Adding a case does not automatically justify adding a new instruction to `SKILL.md`. Promote a case-derived lesson into the runtime skill only when it exposes a general decision gap, repeats across materially different surfaces, or violates a safety-critical invariant. Product-specific wording, isolated stylistic preferences, and near-duplicates stay in the corpus without expanding the entrypoint.

When a genuinely distinct surface family emerges, add a new behavior case file and manifest coverage group. Add a runtime reference only if that family requires substantial conditional guidance that cannot remain concise in `SKILL.md`. Schema changes require a version increment, migration notes, and compatibility validation for existing accepted cases.

The maintenance loop is:

1. capture and redact the observed scenario as `candidate`;
2. reproduce it against a recorded skill and model version;
3. check for duplicates and identify the missing or violated invariant;
4. accept, merge, narrow, or retire the case;
5. change the skill only when the promotion rule is met;
6. rerun affected groups plus the safety-critical regression set.

### Evaluation Rubric

Evaluate observable invariants rather than exact prose:

- correct skill activation;
- no leaked internal rationale or implementation commentary;
- semantic fidelity and approved-copy preservation;
- zero unsupported claims;
- zero invented actions, routes, permissions, or state transitions;
- preservation of required domain and technical terminology;
- clear state and recovery language where applicable;
- locale, voice, accessibility, and layout-fit compatibility.

Safety-critical failures cannot be averaged away by stylistic quality. Model-graded or subagent-graded results are candidate evidence until independently reviewed.

### Validation Lanes

1. **Deterministic lane:** validate the manifest and schemas, JSON structure, unique IDs across files, lifecycle transitions, required fields, coverage declarations, supersession links, file references, skill structure, and whitespace. It must not require network access or a model call.
2. **Live activation lane:** use an isolated temporary Codex home to determine whether the candidate skill is selected for activation cases. Record the runtime model, skill hash, case hash, and timestamp.
3. **Live behavior lane:** explicitly invoke the candidate skill to isolate instruction quality, then score outputs against the semantic rubric. Do not use exact wording as the pass condition.
4. **Independent review lane:** evaluate representative outputs without providing the intended rewrite or suspected defect to the reviewer.

Live lanes are opt-in because they can require network access, credentials, model availability, and cost. They are not authorized by acceptance of this spec alone.

## Delivery Stages

### Stage 0: Evaluation Contract

- Add the versioned manifest, evaluation case schemas, lifecycle rules, initial case groups, rubric, and deterministic validator.
- Validate the current skill without changing it and record baseline failures.

### Stage 1: Skill Revision

- Revise discovery metadata and `SKILL.md` only where baseline evidence supports a change.
- Remove contradictory, project-specific, or keyword-based guidance.
- Apply the case-to-rule promotion policy; do not expand runtime instructions for every accepted case.
- Keep the entrypoint focused on non-obvious decisions.

### Stage 2: Behavioral Verification

- Run deterministic validation.
- Run isolated activation and behavior evaluations when separately authorized.
- Perform an independent forward test against representative Chinese and English cases.
- Correct demonstrated failures without accumulating rules for every example.

### Stage 3: Documentation and Installation Boundary

- Update `README.md` and `AGENTS.md` with actual validation commands and repository layout.
- Validate the distributable skill with the official skill validator.
- Keep repository validation separate from user-scope installation.
- If installation is later authorized, update the user-scope copy and verify source/install hashes before calling the refresh complete.

## Durable Control Invariants

- `harness-rule:path-containment`: implementation writes stay inside this repository; user-scope installation is a separate authorized action.
- `harness-rule:candidate-accepted-evidence`: generated outputs and automated scores remain candidate evidence until reviewed against the rubric.
- `harness-rule:authoritative-completion-state`: structural validation alone cannot complete the work; behavioral gates and state sync must pass.
- `harness-rule:state-sync-evidence`: README, contributor guidance, evaluation results, and installed-state claims must match the actual implementation state.
- `harness-rule:project-neutral-core`: examples and rules must generalize across products and must not encode one dataset, workflow, or prior page as universal policy.
- `harness-rule:durable-tier-boundary`: shaping does not create a Goal or Run; durable execution begins only after spec acceptance and explicit Harness adoption or Goal creation.

## Acceptance Criteria

- The description selects Speak Human for frontend tasks that create or change visible UI copy without becoming a catchall for all frontend work.
- High-confidence positive and negative activation cases pass; documented boundary cases do not silently become universal rules.
- New conforming cases can be added in a discovered case file without runner changes.
- Candidate, accepted, and retired cases are distinguishable, traceable, and validated according to their gating role.
- Case-derived guidance enters `SKILL.md` only through the documented promotion rule.
- All approved-copy and must-preserve propositions survive behavior evaluation.
- No behavior case introduces an unsupported claim, action, route, permission, or state transition.
- Legitimate domain and developer terminology remains when required by the audience.
- Internal development, design, evaluation, and acceptance language is absent from rendered output unless it is itself the product domain.
- Marketing, product, admin, developer, and common UI-state cases are represented in both Chinese and English.
- Tests judge semantic invariants rather than exact output wording.
- Deterministic validation runs locally without network access.
- Live evaluation records model and artifact provenance and runs only with separate authorization.
- The official skill validator passes for the final distributable directory.
- Repository and installed hashes are reported as equal only after an authorized installation and direct verification.
- Documentation describes only commands and files that actually exist.
- No Agent Harness runtime dependency or plugin merge is introduced.

## Spec Acceptance Checklist

- Item: Target behavior and activation boundary
  - Acceptance: The desired outcome, activation rules, and non-goals match the intended product behavior.
  - Evidence: `TBD - user acceptance`
  - Status: `pending`
  - Unblocker: `Review this draft`

- Item: Evaluation architecture
  - Acceptance: Deterministic, live activation, live behavior, and independent review lanes are appropriately separated.
  - Evidence: `TBD - user acceptance`
  - Status: `pending`
  - Unblocker: `Review scope and cost boundary`

- Item: Extensible case governance
  - Acceptance: New use cases can be registered, deduplicated, promoted, superseded, and retired without turning every example into runtime instructions.
  - Evidence: `TBD - user acceptance`
  - Status: `pending`
  - Unblocker: `Review case lifecycle and promotion policy`

- Item: Skill revision boundary
  - Acceptance: The spec permits contextual instruction changes without generic copywriting, behavior changes, or phrase-blacklist growth.
  - Evidence: `TBD - user acceptance`
  - Status: `pending`
  - Unblocker: `Review behavioral contract`

- Item: Delivery boundary
  - Acceptance: Source changes, Harness adoption, commit/push, and user-scope installation remain separate decisions.
  - Evidence: `TBD - user acceptance`
  - Status: `pending`
  - Unblocker: `Confirm after shaping`

## Required Gate Evidence

- Gate: Spec acceptance
  - Required: `yes`
  - Evidence: `TBD - explicit user acceptance`
  - Status: `pending`
  - Unblocker: `Review this draft`

- Gate: Deterministic validation
  - Required: `yes`
  - Evidence: `TBD - command output and case coverage summary`
  - Status: `pending`
  - Unblocker: `Implement Stage 0`

- Gate: Case registry governance
  - Required: `yes`
  - Evidence: `TBD - schema version, lifecycle validation, duplicate and supersession checks`
  - Status: `pending`
  - Unblocker: `Implement Stage 0`

- Gate: Semantic safety
  - Required: `yes`
  - Evidence: `TBD - behavior results with zero safety-critical failures`
  - Status: `pending`
  - Unblocker: `Implement and run Stages 1-2`

- Gate: Independent forward test
  - Required: `yes`
  - Evidence: `TBD - reviewer result and examined cases`
  - Status: `pending`
  - Unblocker: `Complete candidate skill revision`

- Gate: User-scope refresh
  - Required: `only if installation is requested`
  - Evidence: `TBD - source/install hashes and active skill metadata`
  - Status: `not-authorized`
  - Unblocker: `Separate user authorization`

## Verification

Planned verification after implementation:

```powershell
node scripts/validate-evals.mjs
python -B -X utf8 <skill-creator>/scripts/quick_validate.py skills/speak-human
node <agent-harness>/scripts/agent-harness.mjs config validate --cwd . --json
git diff --check
```

Live commands will be specified only after their runner and isolation contract exist. A successful structural validator must not be reported as proof of GPT-5.6 behavior.

## State Sync

- Current record: this draft spec, `.harness/config.json`, `harness/tasks.md`, and `harness/status.md`.
- Current repository state: Harness fixed contract initialized with `language.default` set to `zh-CN`; the task is `spec-draft` with no Goal or Run.
- On acceptance: create and validate a Goal from this spec before implementation; do not prepare a Run while acceptance items remain pending.
- On implementation completion: update the spec checklist, evaluation evidence, `README.md`, and `AGENTS.md` before claiming completion.

## Pause Conditions

- The requested behavior conflicts with approved copy, verified product facts, legal meaning, permissions, or accessibility requirements.
- A proposed test requires network access, paid model calls, credentials, or user-scope mutation without authorization.
- The evaluation runner cannot prove which model or skill version produced a result.
- The skill change would require application behavior, layout, routing, or source-of-record content changes outside the accepted scope.
- New evidence shows that automatic activation cannot be made discriminating without unacceptable false positives.
