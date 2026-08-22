# Project Goals

Keep this active index bounded. Retain actionable work and only the configured
recent-Done window; move older terminal records to the configured task archive.

## Now

## Next


## Later


## Done

- [x] P1 验证 Speak Human 0.1.0 在 GPT-5.6 Sol 上的实际表现
  - Type: live evaluation
  - Status: completed
  - Spec: `docs/specs/2026-08-22-engineer-speak-human-skill.md`
  - Goal: `harness/goals/2026-08-22-speak-human-010-gpt-56-sol.md`
  - Run: `.harness/runs/20260822-224351-speak-human-010-gpt-56-sol`
  - Completed: `gpt-5.6-sol`、`medium` reasoning、`sub.videofree.fun` exact-host guard 下，12/12 activation 与 17/17 behavior 通过控制器验收，0 invocation failure。
  - Evidence: `evals/results/live/2026-08-22-v0.1.0-gpt-5.6-sol-medium-review.md` 记录 canonical runs、hash、逐案 rubric 与修正过程。
  - Delivery: `e574399` 已推送到 private `0xenzyme/speak-human` 的 `master`；用户级安装已按提交源哈希校验完成。
  - Boundary: tag、GitHub release 与公开发布未执行。

- [x] P1 将 Speak Human 工程化为可验证、可扩展的 UI 文案守卫
  - Type: skill engineering
  - Status: completed
  - Spec: `docs/specs/2026-08-22-engineer-speak-human-skill.md`
  - Goal: `harness/goals/2026-08-22-speak-human-ui.md`
  - Run: `.harness/runs/20260822-210732-speak-human-ui`
  - Completed: 建立 schema version 1 的自动发现案例库，包含 31 个双语 activation/behavior 案例及 candidate/accepted/retired 生命周期。
  - Completed: 按 baseline 修订 skill 与元数据，实现离线验证器、7 项负向自测和默认 plan-only 的隔离 live runner。
  - Verification: 仓库验证、官方 skill 验证、独立 4 项路由与 5 项行为前向测试、CLI 只读计划和 `git diff --check` 均通过。
  - Boundary: live model、用户级安装、implementation commit、push、release 和 publish 未执行。

- [x] P1 初始化 Agent Harness fixed contract
  - Status: completed
  - Completed: 创建 `.harness/config.json`、`harness/tasks.md`、`harness/status.md` 及 Goal/Run 目录。
  - Completed: 将 `language.default` 配置为 `zh-CN`。
