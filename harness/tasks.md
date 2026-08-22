# Project Goals

Keep this active index bounded. Retain actionable work and only the configured
recent-Done window; move older terminal records to the configured task archive.

## Now

- [ ] P1 将 Speak Human 工程化为可验证、可扩展的 UI 文案守卫
  - Type: skill engineering
  - Status: spec-draft
  - Draft: `docs/specs/2026-08-22-engineer-speak-human-skill.md`
  - Source: 用户已确认先建立工程化评估体系，并要求 Harness 默认使用中文输出、案例库支持持续扩展。
  - Acceptance: 接受行为契约、可扩展案例治理、验证分层和交付边界后，才创建 Goal 并进入实现。
  - Notes: 当前仅 shaping；没有 Goal、Run、live model 调用、用户级安装或交付授权。

## Next


## Later


## Done

- [x] P1 初始化 Agent Harness fixed contract
  - Status: completed
  - Completed: 创建 `.harness/config.json`、`harness/tasks.md`、`harness/status.md` 及 Goal/Run 目录。
  - Completed: 将 `language.default` 配置为 `zh-CN`。
