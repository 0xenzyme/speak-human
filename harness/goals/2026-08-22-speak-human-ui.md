# Goal: 将 Speak Human 工程化为可验证、可扩展的 UI 文案守卫

Spec: docs/specs/2026-08-22-engineer-speak-human-skill.md
Status: completed.

## Source Task

- `harness/tasks.md`: `P1 将 Speak Human 工程化为可验证、可扩展的 UI 文案守卫`

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

- Item: 可扩展评估登记体系
  - Acceptance: 带版本的 manifest 与 schemas 支持自动发现 activation 和 behavior 案例文件，并支持稳定 ID、生命周期、来源、覆盖率、取代关系和案例到规则的晋级；符合契约的案例无需修改 runner。
  - Evidence: Schema version 1 递归发现 7 个文件和 31 个案例；29 个 accepted、1 个 candidate 和 1 个 retired 案例通过结构、覆盖率、重复、生命周期与引用检查。Validator 自测通过 7 项检查。
  - Status: `satisfied`
  - Unblocker: `N/A`

- Item: 基于 baseline 的 skill 修订
  - Acceptance: 修订 `SKILL.md` 前先记录 baseline failures；最终 description 覆盖前端实现期间的可见文案工作，但不吸引无关任务。
  - Evidence: `evals/results/2026-08-22-baseline.md` 记录候选修订前的 commit `5beaa90`、source hashes、validator 状态和 6 个缺口。
  - Status: `satisfied`
  - Unblocker: `N/A`

- Item: 语义与动作安全
  - Acceptance: Accepted 案例保留已批准事实与术语，移除内部 meta-language，并且不引入无依据主张、动作、路由、权限或状态转换。
  - Evidence: `evals/results/2026-08-22-forward-test.md` 通过 4 项路由和 5 项代表性 behavior 检查，覆盖营销、产品、管理、开发者、权限、approved-copy 与 no-action 边界。
  - Status: `satisfied`
  - Unblocker: `N/A；特定模型的完整案例库证据后置`

- Item: 评估通道隔离
  - Acceptance: 确定性验证离线运行；live activation/behavior 需要显式执行参数、模型来源、隔离工件和单独授权。
  - Evidence: `run-live-evals.mjs` 默认仅输出计划，需要 `--execute` 和新输出路径；它在临时 Codex home 中只暂存一个用户 skill，只链接而不复制 auth，使用只读临时执行，并记录工件 hash。Plan 和 CLI 检查通过；未运行 live call。
  - Status: `satisfied`
  - Unblocker: `N/A`

- Item: 文档与状态同步
  - Acceptance: README、AGENTS、Spec、Task、Goal、Run 和 bounded status 准确描述已实现命令、证据、剩余授权边界和实际完成状态。
  - Evidence: `README.md`、`AGENTS.md`、本 Goal、accepted Spec、`harness/tasks.md`、`harness/status.md` 与 Run node 证据已于 2026-08-22 同步。
  - Status: `satisfied`
  - Unblocker: `N/A`

## Required Gate Evidence

- Gate: 确定性验证
  - Required: `yes`
  - Evidence: `node scripts/validate-evals.mjs --json` 报告 `ok=true`、31 个案例、7 个文件、2 个 schemas，且没有错误。
  - Status: `satisfied`
  - Unblocker: `N/A`

- Gate: 案例登记治理
  - Required: `yes`
  - Evidence: `node scripts/test-validate-evals.mjs` 通过 7 项检查，包括 duplicate ID、malformed case、lifecycle、missing reference、coverage 和 duplicate-content failures。
  - Status: `satisfied`
  - Unblocker: `N/A`

- Gate: 语义安全
  - Required: `yes`
  - Evidence: 独立前向测试在 5 个代表性安全关键场景中未发现 approved-copy、事实、权限、术语、unsupported-claim 或 invented-action 失败。
  - Status: `satisfied`
  - Unblocker: `N/A；live model 评估仍为可选且后置`

- Gate: 官方 skill 验证
  - Required: `yes`
  - Evidence: Skill Creator `quick_validate.py` 对 `skills/speak-human` 返回 `Skill is valid!`。
  - Status: `satisfied`
  - Unblocker: `N/A`

- Gate: 独立前向测试
  - Required: `yes`
  - Evidence: 与 eval 预期和既有结论隔离的只读审查者通过 4 个路由和 5 个 behavior 场景；证据记录在 `evals/results/2026-08-22-forward-test.md`。
  - Status: `satisfied`
  - Unblocker: `N/A`

- Gate: Live model 评估
  - Required: `no`
  - Evidence: 未授权；只完成 runner 实现。
  - Status: `deferred`
  - Unblocker: `如需执行，须由用户单独授权`

- Gate: 用户级安装与交付
  - Required: `no`
  - Evidence: Installation、push、release 和 publish 不在本 Goal 范围内。
  - Status: `deferred`
  - Unblocker: `如需执行，须由用户单独授权`

## Scope

- 实现 accepted Spec 所描述的带版本评估 manifest、schemas、案例库、rubric、确定性验证器和受控 live runner。
- 修订运行时指令前记录当前 skill 的 baseline 缺口。
- 在已接受的 activation、语义、动作和范围边界内修订 `skills/speak-human/SKILL.md` 与 `agents/openai.yaml`。
- 运行离线验证和独立前向测试，再修复已证明的失败。
- 使用已验证证据更新仓库文档和所有已配置 Harness 状态记录。

## Non-Goals

- 除非另行请求，不启动 worker，也不执行超出已接受范围的外部副作用。
- 未经用户明确批准，不执行 destructive 变更。
- 不向 core Harness contract 加入项目特定假设。
- 未经单独授权，不运行 live model 评估、不安装用户级 skill，也不执行 push、release 或 publish。
- 不为每个观察到的案例增加 runtime reference 或 `SKILL.md` 规则。

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

- Accepted Spec：`docs/specs/2026-08-22-engineer-speak-human-skill.md`
- Baseline commit：`5beaa90`
- Runtime Goal：当前 Codex thread 中负责实施 accepted Spec 的 Goal。
- Run evidence：`.harness/runs/20260822-210732-speak-human-ui`
- Implementation evidence：`evals/manifest.json`、2 个 schemas、7 个 case suites、31 个案例、rubric、确定性验证器、7 项自测、受控 live runner、修订后的 skill metadata 和已同步的贡献者文档。
- Verification evidence：repository validator、官方 skill validator、`git diff --check`、plan-only live runner/CLI 检查和独立前向测试均通过。
- Task/status synchronization：Task 与 bounded status 已完成，并指向本 Goal 和 Run。
- Commit boundary：baseline commit 为 `5beaa90`；当时实现改动尚未提交。
- Remaining authorization：当时 live model 调用、用户级安装、push、release 和 publish 仍未授权。

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
