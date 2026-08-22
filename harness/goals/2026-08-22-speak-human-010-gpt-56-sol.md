# Goal: 验证 Speak Human 0.1.0 在 GPT-5.6 Sol 上的实际表现

Spec: docs/specs/2026-08-22-engineer-speak-human-skill.md
Status: completed.
Run: `.harness/runs/20260822-224351-speak-human-010-gpt-56-sol`

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
  - Evidence: Canonical activation and behavior summaries plus `evals/results/live/2026-08-22-v0.1.0-gpt-5.6-sol-medium-review.md` record version, model, effort, provider authorization, commit/dirty state, config hash, and skill, manifest, runner, suite, and case hashes.
  - Status: `satisfied`
  - Unblocker: `N/A`

- Item: Activation gate
  - Acceptance: 12 个 accepted activation cases 全部符合 `yes`、`no`、`review` 预期，且无 invocation failure。
  - Evidence: `...activation-06/summary.json` records 12 calls, 0 invocation failures, 0 automatic failures, 10 deterministic decisions, and 2 contextual reviews accepted by the controller.
  - Status: `satisfied`
  - Unblocker: `N/A`

- Item: Behavior gate
  - Acceptance: 17 个 accepted behavior cases 无 invocation failure；逐项 rubric 审阅通过，approved copy、事实、权限、术语和动作均被保留，且无新增主张或虚构动作。
  - Evidence: `...behavior-07/summary.json` records 17 calls and 0 invocation failures; the controller report records 17/17 rubric passes. Its single conservative fragment-equality flag was reviewed as a scorer false positive and corrected in runner v11.
  - Status: `satisfied`
  - Unblocker: `N/A`

## Required Gate Evidence

- Gate: Repository validation
  - Required: `yes`
  - Evidence: `validate-evals` passed 31 cases; validator self-test passed 8/8; live runner safety passed 7/7; runner v11 syntax/CLI plan, official skill validator, Harness config, canonical artifact assertions, and `git diff --check` passed.
  - Status: `satisfied`
  - Unblocker: `N/A`

- Gate: GPT-5.6 Sol activation
  - Required: `yes`
  - Evidence: Canonical `activation-06` used `gpt-5.6-sol` at `medium` with the authorized exact-host guard and final skill hash; 12/12 cases passed controller acceptance with no invocation failure.
  - Status: `satisfied`
  - Unblocker: `N/A`

- Gate: GPT-5.6 Sol behavior review
  - Required: `yes`
  - Evidence: Canonical `behavior-07` produced all 17 results with no invocation failure; `2026-08-22-v0.1.0-gpt-5.6-sol-medium-review.md` records proposition-level controller acceptance for every case.
  - Status: `satisfied`
  - Unblocker: `N/A`

- Gate: State synchronization
  - Required: `yes`
  - Evidence: This Goal is completed, the Task is in Done, bounded status is completed, both Run DAG nodes are completed, and the durable review report records accepted evidence and delivery boundaries.
  - Status: `satisfied`
  - Unblocker: `N/A`

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
- Authorization: 用户已明确授权将 skill 与合成 eval prompts 发送到当前配置的 `sub.videofree.fun` provider，覆盖本 Goal 的 12 个 activation 与 17 个 behavior calls。


## Verification

- `node scripts/validate-evals.mjs --json`
- `node scripts/test-validate-evals.mjs`
- `node scripts/run-live-evals.mjs --lane activation --model gpt-5.6-sol --reasoning-effort medium --check-cli --json`
- `python -B -X utf8 <skill-creator>/scripts/quick_validate.py skills/speak-human`
- Authorized activation and behavior live commands recorded in evaluation evidence.
- `git diff --check`

## State Sync Notes

- Runtime Goal: current Codex thread Goal for completing the 0.1.0 live eval.
- Repository Goal/Run: this Goal and `.harness/runs/20260822-224351-speak-human-010-gpt-56-sol` own durable evidence.
- Accepted-state owner: current controller; model outputs remain candidate evidence until rubric review.
- Accepted evidence: canonical `activation-06`, canonical `behavior-07`, targeted v11 scorer follow-up, and `evals/results/live/2026-08-22-v0.1.0-gpt-5.6-sol-medium-review.md`.
- Task/status synchronization: `harness/tasks.md` moves this Task to Done; `harness/status.md` records the completed phase and current evidence.
- Diagnostic evidence: earlier smoke, failed-runner, and targeted-correction directories remain non-canonical evidence and are not counted in the 12/17 gate totals.
- Delivery boundary at Goal completion: installation, commit, tag, push, release, and publish were not part of the live-eval Run.
- Postflight delivery: on 2026-08-23, after separate user authorization, source and evidence were committed as `e574399259e195af71c753b0c911408e7a0b1037`, pushed to private `0xenzyme/speak-human` on `master`, and installed to `C:\Users\Admin\.codex\skills\speak-human` with committed-source hash equality verified. No tag, GitHub release, or public publication was created.
- Need user: None.
- Remaining: None.

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
