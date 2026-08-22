# Project Status

`harness-rule:bounded-status-snapshot`: this file is a bounded current-state
snapshot, not an append-only history log. Replace current sections when syncing
state; keep historical details in task entries, Goal files, run logs, and gate
records.

## Focus

- Current focus: 评审 Speak Human 工程化 spec 及其可持续案例扩展机制。

## State

- Current phase: `spec-draft`
- Authoritative Task/Goal: `harness/tasks.md` 中的当前 P1 Task；尚无 Goal。
- Projection updated: 2026-08-22

## Verification

- Last checked: 2026-08-22
- Last command: `agent-harness orient next --cwd . --json`
- Result: fixed contract 与 `zh-CN` 配置有效；当前任务为 `spec-draft`，route 为 `shape`。

## Evidence

- Accepted evidence: 用户确认先工程化，并要求 Harness 中文输出及案例库持续扩展。
- Candidate evidence: `docs/specs/2026-08-22-engineer-speak-human-skill.md`。
- Deferred evidence: Stage 0 基线结果、live activation、live behavior、独立前向测试及用户级安装证据。

## Route Notes

- Current route: `shape`
- Why: spec 尚未接受，当前工作是完善行为契约、评估架构和扩展治理。
- Confirmation needed: 用户接受修改后的 spec 后，才能创建 Goal 或开始实现。
- Idea Inbox candidates: 无。
- Optional competition status: 未启用。

## Blockers
