# Goal Execution Prompt

In `D:\project\skills\speak-human`, execute this goal:

`harness\goals\2026-08-22-speak-human-010-gpt-56-sol.md`

Requirements:

- Read `harness\goals\2026-08-22-speak-human-010-gpt-56-sol.md` and `docs/specs/2026-08-22-engineer-speak-human-skill.md` before making edits.
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
# Goal: 验证 Speak Human 0.1.0 在 GPT-5.6 Sol 上的实际表现

Spec: docs/specs/2026-08-22-engineer-speak-human-skill.md
Status: active.

## Source Task

- `harness/tasks.md`: `P1 验证 Speak Human 0.1.0 在 GPT-5.6 Sol 上的实际表现`

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

- Item: 可复现评估身份
  - Acceptance: 结果明确记录 `0.1.0`、`gpt-5.6-sol`、`medium` reasoning、Git 基线/dirty 状态及 skill、manifest、runner、suite、case hashes。
  - Evidence: Pending live runner output.
  - Status: `pending`
  - Unblocker: `Run both live lanes`

- Item: Activation gate
  - Acceptance: 12 个 accepted activation cases 全部符合 `yes`、`no`、`review` 预期，且无 invocation failure。
  - Evidence: Pending activation summary.
  - Status: `pending`
  - Unblocker: `Run activation lane first`

- Item: Behavior gate
  - Acceptance: 17 个 accepted behavior cases 无 invocation failure；逐项 rubric 审阅通过，approved copy、事实、权限、术语和动作均被保留，且无新增主张或虚构动作。
  - Evidence: Pending behavior summary and controller review.
  - Status: `pending`
  - Unblocker: `Activation gate must pass first`

## Required Gate Evidence

- Gate: Repository validation
  - Required: `yes`
  - Evidence: Pending fresh validator, self-test, official validator, CLI plan, and hygiene checks.
  - Status: `pending`
  - Unblocker: `Run preflight checks`

- Gate: GPT-5.6 Sol activation
  - Required: `yes`
  - Evidence: Pending 12 accepted activation results.
  - Status: `pending`
  - Unblocker: `Authorized live execution`

- Gate: GPT-5.6 Sol behavior review
  - Required: `yes`
  - Evidence: Pending 17 accepted behavior results and rubric review.
  - Status: `pending`
  - Unblocker: `Activation gate must pass`

- Gate: State synchronization
  - Required: `yes`
  - Evidence: Pending Goal, Task, Run, status, and evaluation report updates.
  - Status: `pending`
  - Unblocker: `Complete accepted-state review`

## Scope

- Record release candidate version `0.1.0` in a canonical repository file and the eval manifest.
- Extend live provenance with exact model, reasoning effort, Git baseline/dirty state, and existing artifact hashes.
- Run all accepted activation cases first with isolated `gpt-5.6-sol` sessions at `medium` reasoning.
- Only after activation passes, run all accepted behavior cases in the same configuration and review each output against `evals/rubric.md`.
- Correct only demonstrated general defects, then rerun the affected lane as needed.

## Non-Goals

- Do not launch workers or perform external side effects outside the accepted scope unless separately requested.
- Do not make destructive changes without explicit user approval.
- Do not add project-specific assumptions to the core harness contract.
- Do not install the skill into user scope or create a commit, tag, push, release, or publication.

## Context

- Source: 用户于 2026-08-22 确认版本 `0.1.0`，并明确授权使用 GPT-5.6 Sol 进行 live eval。
- Controller: 当前对话负责发起和验收；每个测试样本由无历史上下文的隔离 Codex 会话处理。
- Worktree: 当前 dirty checkout 包含待评估候选；结果必须记录 dirty provenance，不把它误报为 baseline commit 内容。


## Verification

- `node scripts/validate-evals.mjs --json`
- `node scripts/test-validate-evals.mjs`
- `node scripts/run-live-evals.mjs --lane activation --model gpt-5.6-sol --reasoning-effort medium --check-cli --json`
- `python -B -X utf8 <skill-creator>/scripts/quick_validate.py skills/speak-human`
- Authorized activation and behavior live commands recorded in evaluation evidence.
- `git diff --check`

## State Sync Notes

- Runtime Goal: current Codex thread Goal for completing the 0.1.0 live eval.
- Repository Goal/Run: this Goal and its prepared Run own durable evidence.
- Accepted-state owner: current controller; model outputs remain candidate evidence until rubric review.
- Remaining authorization: installation, commit, tag, push, release, and publish are outside this Goal.

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
