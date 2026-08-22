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

Use `local`. 在 Goal 已有确认的 Spec 且文件归属清晰前，保持本地执行模式。

## Execution Role

Use `implementer`.

- `gate-only`：当前 thread 审查候选输出和验证证据，但不直接编辑实现文件。
- `implementer`：当前 thread 可以在已接受范围内编辑文件。
- Controller 是结果责任人和 accepted state 责任人。只有明确要求只审查时才使用 `gate-only`；否则 controller 可以直接实现前台工作。
- 普通、清晰的 change/build 请求由 Codex 直接处理。本持久 Goal 只使用 `gate-only` 或 `implementer` 角色。
- `harness-rule:durable-tier-boundary`：普通明确变更由 Codex 直接处理；已追踪的简单工作可以做一次有边界的 postflight sync。Harness 流程只用于恢复、审计、持久状态同步、milestone、DAG、多 worker 或高风险控制。持久 Goal 一旦存在，不得把 checklist、gate 或 state-sync 义务降级到 bounded tier。

## Codex-Native Execution

- 对已接受的长期 controller 工作，建立或复用兼容的 Codex runtime Goal，并使用 Codex Plan 管理当前多步进度。Controller 是结果与 accepted state 的责任人；只有明确的 review-only 或 gate-only 指令才禁止其直接实现。
- Runtime Goal 负责当前结果和续跑；Codex Plan 负责临时步骤。
- Codex runtime 负责 Thread/subagent 调度、并发、取消以及 model/effort 选择。
- 仓库 Goal/Run 负责跨任务恢复、持久依赖、证据、门禁和状态同步。
- 如果原生 Goal 或 Plan 不可用，继续在当前 thread 中执行；只有本持久 Run 确实要求时才记录降级来源。不得虚构 runtime identifier。

## Conversation Route

Use `current-thread`.

- `current-thread`：当前对话负责在锁定 cwd 中执行。
- `slot-thread`：编辑前移交给专用 slot 对话。
- `remote-control-worktree`：只有明确批准后，当前对话才能控制另一个已锁定 worktree。

## Execution Context Lock

- Conversation lane: `current-thread`
- Controller thread: `current-thread`
- Execution cwd: `D:\project\skills\speak-human`
- Execution branch: `master`
- Execution slot: `N/A`
- Remote-control worktree: `no`

## Execution DAG

使用 `run prepare` 生成 `dag.json`、`dag.md` 和各节点的
`agents/<node>/prompt.md`。Codex runtime 负责 worker 选择、委派、并发与取消；
Harness 记录归属和证据。

## Context Focus Routing

`harness-rule:project-neutral-core`：将持久目标规范为 `Milestone`、`Goal`、`Task`、`Run`、`Priority` 或 `Spec`；adapter 负责下游路径和事实，plugin core 保持项目中立。`harness-rule:path-containment`：配置写入、Goal/Spec 引用、Run 参数和 DAG 工件经过词法及现有父目录 realpath 检查后，必须留在配置根目录内。

## Cybernetic Stability

`harness-rule:state-sync-evidence`：持久完成必须包含经过验证的 State Sync Notes，并同步配置中的 Goal、Task、Run、gate 和 bounded status 记录。


## Spec Acceptance Checklist

- Item: 可复现评估身份
  - Acceptance: 结果明确记录 `0.1.0`、`gpt-5.6-sol`、`medium` reasoning、Git baseline/dirty 状态及 skill、manifest、runner、suite、case hashes。
  - Evidence: Canonical activation 与 behavior summaries 以及 `evals/results/live/2026-08-22-v0.1.0-gpt-5.6-sol-medium-review.md` 记录 version、model、effort、provider authorization、commit/dirty state、config hash 以及 skill、manifest、runner、suite、case hashes。
  - Status: `satisfied`
  - Unblocker: `N/A`

- Item: Activation 门禁
  - Acceptance: 12 个 accepted activation cases 全部符合 `yes`、`no`、`review` 预期，且无 invocation failure。
  - Evidence: `...activation-06/summary.json` 记录 12 calls、0 invocation failures、0 automatic failures、10 个 deterministic decisions，以及 2 个由 controller 接受的 contextual reviews。
  - Status: `satisfied`
  - Unblocker: `N/A`

- Item: Behavior 门禁
  - Acceptance: 17 个 accepted behavior cases 无 invocation failure；逐项 rubric 审阅通过，approved copy、事实、权限、术语和动作均被保留，且无新增主张或虚构动作。
  - Evidence: `...behavior-07/summary.json` 记录 17 calls 和 0 invocation failures；controller report 记录 17/17 rubric passes。唯一一项保守的 fragment-equality flag 经审查确认为 scorer false positive，并已在 runner v11 修正。
  - Status: `satisfied`
  - Unblocker: `N/A`

## Required Gate Evidence

- Gate: 仓库验证
  - Required: `yes`
  - Evidence: `validate-evals` 通过 31 个案例；validator self-test 通过 8/8；live runner safety 通过 7/7；runner v11 syntax/CLI plan、官方 skill validator、Harness config、canonical artifact assertions 和 `git diff --check` 均通过。
  - Status: `satisfied`
  - Unblocker: `N/A`

- Gate: GPT-5.6 Sol activation
  - Required: `yes`
  - Evidence: Canonical `activation-06` 使用 `gpt-5.6-sol`、`medium`、已授权 exact-host guard 和最终 skill hash；12/12 cases 通过 controller 验收，且无 invocation failure。
  - Status: `satisfied`
  - Unblocker: `N/A`

- Gate: GPT-5.6 Sol behavior 审查
  - Required: `yes`
  - Evidence: Canonical `behavior-07` 生成全部 17 个结果且无 invocation failure；`2026-08-22-v0.1.0-gpt-5.6-sol-medium-review.md` 记录每个案例的命题级 controller 验收。
  - Status: `satisfied`
  - Unblocker: `N/A`

- Gate: 状态同步
  - Required: `yes`
  - Evidence: 本 Goal 已 completed，Task 位于 Done，bounded status 为 completed，两个 Run DAG nodes 均已完成，持久审查报告记录 accepted evidence 与交付边界。
  - Status: `satisfied`
  - Unblocker: `N/A`

## Scope

- 在仓库权威文件和 eval manifest 中记录候选版本 `0.1.0`。
- 扩展 live provenance，记录准确 model、reasoning effort、Git baseline/dirty 状态和既有 artifact hashes。
- 先使用隔离的 `gpt-5.6-sol` session 和 `medium` reasoning 运行全部 accepted activation cases。
- 只有 activation 通过后，才使用相同配置运行全部 accepted behavior cases，并依据 `evals/rubric.md` 审查每项输出。
- 只修复已证明的通用缺陷，再按需重跑受影响通道。

## Non-Goals

- 除非另行请求，不启动 worker，也不执行超出已接受范围的外部副作用。
- 未经用户明确批准，不执行 destructive 变更。
- 不向 core Harness contract 加入项目特定假设。
- 不把 skill 安装到用户级范围，也不创建 commit、tag、push、release 或 publication。

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
- 已授权的 activation 与 behavior live 命令均记录在评估证据中。
- `git diff --check`

## State Sync Notes

- Runtime Goal：当前 Codex thread 中负责完成 0.1.0 live eval 的 Goal。
- Repository Goal/Run：本 Goal 与 `.harness/runs/20260822-224351-speak-human-010-gpt-56-sol` 负责持久证据。
- Accepted-state owner：当前 controller；模型输出在 rubric 审查前仍是 candidate evidence。
- Accepted evidence：canonical `activation-06`、canonical `behavior-07`、targeted v11 scorer follow-up，以及 `evals/results/live/2026-08-22-v0.1.0-gpt-5.6-sol-medium-review.md`。
- Task/status synchronization：`harness/tasks.md` 将本 Task 移到 Done；`harness/status.md` 记录 completed phase 与当前证据。
- Diagnostic evidence：早期 smoke、failed-runner 和 targeted-correction 目录保留为 non-canonical evidence，不计入 12/17 gate totals。
- Goal 完成时的交付边界：installation、commit、tag、push、release 和 publish 不属于 live-eval Run。
- Postflight delivery：2026-08-23 在另行获得用户授权后，源代码与证据以 `e574399259e195af71c753b0c911408e7a0b1037` 提交，推送到 private `0xenzyme/speak-human` 的 `master`，并安装到 `C:\Users\Admin\.codex\skills\speak-human`；已验证安装内容与 committed source hash 相等。未创建 tag、GitHub release 或公开 publication。
- Need user：None。
- Remaining：None。

## Completion Conditions

- 源 Goal/work item 的 acceptance 已满足。
- 验证命令通过；如有失败，已记录原因和下一步。
- Goal/Task Done 时产出 state-sync evidence 或 State Sync Notes。
- Status 文件使用有边界的当前状态快照；替换 status 章节，
  不追加历史 focus 日志。
- Project adapter 要求状态同步时，更新配置的状态记录（`harness/tasks.md`、`harness/status.md`）。

## Pause Conditions

- 引用的 `spec` 或 accepted scope 缺失、未确认，或与代码、`production` 约束及较新的用户 `instructions` 发生 `conflict`。
- 测量快照无法识别可靠观察状态、反馈质量不足以完成，或剩余缺口没有缩小。
- 工作需要 `credentials`、`paid APIs`、production access、`destructive` 命令、release 或已接受范围外的其他外部副作用。
- `Product` 方向、文件归属或 worktree 策略不清楚。
- 用户给出与本 Goal 冲突的新指令。
