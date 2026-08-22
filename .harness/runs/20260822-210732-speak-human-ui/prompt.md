# Goal Execution Prompt

In `D:\project\skills\speak-human`, execute this goal:

`harness\goals\2026-08-22-speak-human-ui.md`

Requirements:

- Read `harness\goals\2026-08-22-speak-human-ui.md` and `docs/specs/2026-08-22-engineer-speak-human-skill.md` before making edits.
- Apply Commentary Policy `minimal`: Use one short kickoff that combines skill, reason, scope, boundaries, and next action. Do not narrate routine UI-visible tool activity or repeat unchanged boundaries. Later commentary must add a new material fact unless it is a one-sentence host-required heartbeat. Report cadence: `material-transition-or-host-heartbeat`. Notify on: blocker, risk, scope-or-authorization-change, user-decision, failed-verification, state-transition.
- Follow the repository instructions and configured harness paths.
- Follow the goal's Scope, Non-Goals, Work Mode Recommendation, Verification, Completion Conditions, and Pause Conditions.
- Follow the goal's Execution Role: `implementer`.
- Controller means outcome owner and accepted-state owner. It may implement foreground work unless Execution Role is explicitly `gate-only`.
- If Execution Role is `gate-only`, keep the current thread review-only; the Codex runtime decides whether and how to delegate implementation.
- For accepted long-running controller work, establish or reuse a compatible Codex runtime Goal and use Codex Plan for current multi-step progress. Controller means outcome owner and accepted-state owner; only explicit review-only or gate-only direction prohibits foreground implementation.
- Runtime Goal owns the current outcome and continuation; Codex Plan owns transient steps. Reuse compatible active state and never invent runtime ids.
- `harness-rule:durable-tier-boundary`: ordinary clear change/build uses Codex directly; already tracked simple work may use one bounded postflight sync; Harness ceremony is reserved for recovery, audit, persistent state sync, milestones, DAGs, multiple workers, or high-risk control. The supplied Goal/Run remains authoritative and must not be downgraded.
- `harness-rule:project-neutral-core`: Normalize the durable target to `Milestone`, `Goal`, `Task`, `Run`, `Priority`, or `Spec`; adapters own downstream paths and facts while plugin core remains project-neutral. `harness-rule:path-containment`: configured writes, Goal/Spec references, Run arguments, and DAG artifacts stay inside configured roots after lexical and existing-parent realpath checks.
- `harness-rule:authoritative-completion-state`: Task/Goal is the accepted-state authority with active, completed, or blocked phase; blocked is resumable and non-complete, Run stores evidence, and status is a bounded projection.
- `harness-rule:state-sync-evidence`: durable completion includes verified State Sync Notes and synchronization of the configured Goal, Task, Run, gate, and bounded status records.
- `harness-rule:candidate-accepted-evidence`: execution and worker output remains candidate evidence until the accepted-state owner verifies and records it.
- `harness-rule:run-dag-ownership`: Harness records ready nodes, dependencies, ownership, verification, and candidate evidence; the Codex runtime owns scheduling, delegation, concurrency, and cancellation.
- Follow the goal's Conversation Route: `current-thread`.
- Confirm Execution Context Lock before editing: lane `current-thread`, cwd `D:\project\skills\speak-human`, branch `master`, remote-control worktree `no`.
- Treat implementation output as candidate evidence until required checklist and gate evidence is satisfied and accepted by the control lane.
- Treat State Sync Notes as part of Goal/Task Done. Executors must provide them; the accepted-state owner verifies them before recording accepted Goal, Task, status, run, or gate state.
- `harness-rule:bounded-status-snapshot`: The configured status file is a bounded current-state snapshot, not an append-only history log. Replace current status sections when syncing state; keep historical details in tasks, goals, runs, and gate records.
- Do not close if feedback quality is weak, stale, delayed, or advisory; verify, re-orient, ask, or pause when the remaining gap is not shrinking or the loop is saturated.
- Final user-facing closeout must include explicit `Need user` and `Remaining` values. Use `Need user: None` and `Remaining: None` for routine closeouts with no true pause trigger or follow-up instead of asking broad confirmation questions.
- Do not deploy, publish, start a daemon, or automatically launch additional Codex sessions unless the accepted scope and controller explicitly authorize it.
- After implementation, run the goal's verification commands, produce State Sync Notes, and update configured state records (`harness/tasks.md`, `harness/status.md`) when the project adapter requires state sync. Status-file updates must replace bounded snapshot sections instead of appending historical focus logs.

## Goal Content

~~~md
# Goal: 将 Speak Human 工程化为可验证、可扩展的 UI 文案守卫

Spec: docs/specs/2026-08-22-engineer-speak-human-skill.md
Status: active.

## Source Task

- `harness/tasks.md`: `P1 将 Speak Human 工程化为可验证、可扩展的 UI 文案守卫`

## Read First

1. `AGENTS.md`
2. `harness/tasks.md`
3. `.harness/config.json`
4. `harness/status.md`
5. `docs/specs/2026-08-22-engineer-speak-human-skill.md`

## Work Mode Recommendation

Use `local` until the goal has a confirmed spec and clear file ownership.

## Execution Role

Use `implementer`.

- `gate-only`: the current thread reviews candidate output and verification evidence, but does not directly edit implementation files.
- `implementer`: the current thread may edit files inside the accepted scope.
- Controller means outcome owner and accepted-state owner. Use `gate-only` only when review-only behavior is explicit; otherwise a controller may implement foreground work.
- Ordinary clear change/build requests use Codex directly. This durable Goal uses only `gate-only` or `implementer` roles.
- `harness-rule:durable-tier-boundary`: ordinary clear change/build uses Codex directly; already tracked simple work may use one bounded postflight sync; Harness ceremony is reserved for recovery, audit, persistent state sync, milestones, DAGs, multiple workers, or high-risk control. Once this durable Goal exists, do not downgrade its checklist, gate, or state-sync obligations to the bounded tier.

## Codex-Native Execution

- For accepted long-running controller work, establish or reuse a compatible Codex runtime Goal and use Codex Plan for current multi-step progress. Controller means outcome owner and accepted-state owner; only explicit review-only or gate-only direction prohibits foreground implementation.
- Runtime Goal owns the current outcome and continuation; Codex Plan owns transient steps.
- Codex runtime owns Thread/subagent scheduling, concurrency, cancellation, and model/effort selection.
- Repository Goal/Run owns cross-task recovery, durable dependencies, evidence, gates, and state sync.
- If native Goal or Plan is unavailable, continue in the current thread and record degraded provenance only when this durable Run requires it. Never invent runtime identifiers.

## Conversation Route

Use `current-thread`.

- `current-thread`: the current conversation owns execution in the locked cwd.
- `slot-thread`: hand off to a dedicated slot conversation before editing.
- `remote-control-worktree`: the current conversation may control a different locked worktree only when explicitly approved.

## Execution Context Lock

- Conversation lane: `current-thread`
- Controller thread: `current-thread`
- Execution cwd: `D:\project\skills\speak-human`
- Execution branch: `master`
- Execution slot: `N/A`
- Remote-control worktree: `no`

## Execution DAG

Use `run prepare` to generate `dag.json`, `dag.md`, and per-node
`agents/<node>/prompt.md` files. The Codex runtime owns worker selection,
delegation, concurrency, and cancellation; Harness records ownership and evidence.

## Context Focus Routing

`harness-rule:project-neutral-core`: Normalize the durable target to `Milestone`, `Goal`, `Task`, `Run`, `Priority`, or `Spec`; adapters own downstream paths and facts while plugin core remains project-neutral. `harness-rule:path-containment`: configured writes, Goal/Spec references, Run arguments, and DAG artifacts stay inside configured roots after lexical and existing-parent realpath checks.

## Cybernetic Stability

`harness-rule:state-sync-evidence`: durable completion includes verified State Sync Notes and synchronization of the configured Goal, Task, Run, gate, and bounded status records.


## Spec Acceptance Checklist

- Item: Extensible evaluation registry
  - Acceptance: Versioned manifest and schemas support discovered activation and behavior case files, stable IDs, lifecycle states, provenance, coverage, supersession, and case-to-rule promotion without runner changes for conforming cases.
  - Evidence: `TBD`
  - Status: `pending`
  - Unblocker: `Implement Stage 0 and run deterministic validation`

- Item: Baseline-driven skill revision
  - Acceptance: Baseline failures are recorded before `SKILL.md` is revised; the final description covers visible-copy work during frontend implementation without attracting unrelated work.
  - Evidence: `TBD`
  - Status: `pending`
  - Unblocker: `Record baseline, then implement Stage 1`

- Item: Semantic and action safety
  - Acceptance: Accepted cases preserve approved facts and terminology, remove internal meta-language, and introduce no unsupported claim, action, route, permission, or state transition.
  - Evidence: `TBD`
  - Status: `pending`
  - Unblocker: `Run behavior evaluation and independent review`

- Item: Evaluation lane separation
  - Acceptance: Deterministic validation is offline; live activation/behavior require explicit execution flags, model provenance, isolated artifacts, and separate authorization.
  - Evidence: `TBD`
  - Status: `pending`
  - Unblocker: `Implement runners without making live calls`

- Item: Documentation and state sync
  - Acceptance: README, AGENTS, Spec, Task, Goal, Run, and bounded status describe the implemented commands, evidence, remaining authorization boundaries, and actual completion state.
  - Evidence: `TBD`
  - Status: `pending`
  - Unblocker: `Complete Stage 3`

## Required Gate Evidence

- Gate: Deterministic validation
  - Required: `yes`
  - Evidence: `TBD`
  - Status: `pending`
  - Unblocker: `Implement and run repository validation`

- Gate: Case registry governance
  - Required: `yes`
  - Evidence: `TBD`
  - Status: `pending`
  - Unblocker: `Validate lifecycle, coverage, duplicate IDs, and references`

- Gate: Semantic safety
  - Required: `yes`
  - Evidence: `TBD`
  - Status: `pending`
  - Unblocker: `Evaluate accepted behavior cases`

- Gate: Official skill validation
  - Required: `yes`
  - Evidence: `TBD`
  - Status: `pending`
  - Unblocker: `Run skill-creator quick_validate.py`

- Gate: Independent forward test
  - Required: `yes`
  - Evidence: `TBD`
  - Status: `pending`
  - Unblocker: `Test the candidate skill in an independent context`

- Gate: Live model evaluation
  - Required: `no`
  - Evidence: Not authorized; runner implementation only.
  - Status: `deferred`
  - Unblocker: `Separate user authorization if desired`

- Gate: User-scope installation and delivery
  - Required: `no`
  - Evidence: Installation, push, release, and publish remain outside this Goal.
  - Status: `deferred`
  - Unblocker: `Separate user authorization if desired`

## Scope

- Implement the versioned evaluation manifest, schemas, case corpus, rubric, deterministic validator, and guarded live runner described by the accepted Spec.
- Record the current skill's baseline gaps before revising runtime instructions.
- Revise `skills/speak-human/SKILL.md` and `agents/openai.yaml` within the accepted activation, semantic, action, and scope boundaries.
- Run offline validation and an independent forward test, then correct demonstrated failures.
- Update repository documentation and all configured Harness state records with verified evidence.

## Non-Goals

- Do not launch workers or perform external side effects outside the accepted scope unless separately requested.
- Do not make destructive changes without explicit user approval.
- Do not add project-specific assumptions to the core harness contract.
- Do not run live model evaluations, install the user-scope skill, push, release, or publish without separate authorization.
- Do not add a runtime reference or `SKILL.md` rule for every observed case.

## Context

- Source: 用户已确认先建立工程化评估体系，并要求 Harness 默认使用中文输出、案例库支持持续扩展。

- Notes: spec 已接受；live model 调用、用户级安装、push 和 release 仍未授权。

## Verification

- `node scripts/validate-evals.mjs`
- `node scripts/run-live-evals.mjs --help`
- `python -B -X utf8 <skill-creator>/scripts/quick_validate.py skills/speak-human`
- `node <agent-harness>/scripts/agent-harness.mjs config validate --cwd . --json`
- `node <agent-harness>/scripts/agent-harness.mjs goal validate --cwd . --goal harness/goals/2026-08-22-speak-human-ui.md --json`
- `git diff --check`

## State Sync Notes

- Accepted Spec: `docs/specs/2026-08-22-engineer-speak-human-skill.md`
- Baseline commit: `5beaa90`
- Runtime Goal: current Codex thread goal for implementing the accepted Spec.
- Run evidence: `TBD`
- Task/status synchronization: `TBD`
- Remaining authorization: live model calls, user-scope installation, push, release, and publish remain unauthorized.

## Completion Conditions

- The source Goal/work item acceptance is satisfied.
- Verification commands pass or any failure is documented with next steps.
- State-sync evidence or State Sync Notes are produced as part of Goal/Task Done.
- Status-file updates use a bounded current-state snapshot; replace status
  sections instead of appending historical focus logs.
- Update configured state records (`harness/tasks.md`, `harness/status.md`) when the project adapter requires state sync.

## Pause Conditions

- The referenced spec or accepted scope is missing, unconfirmed, or conflicts with code, production constraints, or newer user instructions.
- The measurement snapshot cannot identify a reliable observed state, feedback quality is insufficient for completion, or the remaining gap is not shrinking.
- The work requires credentials, paid APIs, production access, destructive commands, release, or another external side effect outside accepted scope.
- Product direction, file ownership, or worktree policy is unclear.
- User gives new instructions that conflict with this goal.
~~~
