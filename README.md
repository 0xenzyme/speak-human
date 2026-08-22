# Speak Human

Speak Human 是一个 Codex skill，用于让生成的网站和产品 UI 文案保持清晰、真实，并符合目标用户的理解方式。只要 agent 正在创建、编辑或审查界面中实际展示的文本，就应考虑使用它，不要求用户必须明确提出“改写文案”。

当前候选版本为 `0.1.0`，权威版本记录在 `VERSION` 和 `evals/manifest.json` 中。

该守卫会从界面文案中移除内部开发说明和设计理由，同时保留已批准措辞、已验证事实、限制条件、权限边界、真实动作，以及合理的运营或开发者术语。它不负责改写普通文章，也不授权更改布局、行为、路由或内容数据源。

维护文档和 Harness 记录默认以简体中文为主；命令、路径、代码标识、协议名、模型名和案例原始语言保持原样。

## 仓库结构

```text
skills/speak-human/                 可分发 skill
|-- SKILL.md
`-- agents/openai.yaml
evals/
|-- manifest.json                  发现、覆盖率和门禁策略
|-- schemas/                       激活与行为案例契约
|-- cases/                         带版本、可自动发现的案例套件
|-- rubric.md                      语义审查准则
`-- results/                       已记录的评估证据
scripts/
|-- validate-evals.mjs             离线确定性门禁
`-- run-live-evals.mjs             需要明确授权的 Codex 评估
```

评估资产保留在 `skills/speak-human/` 之外；安装 skill 不会同时安装其开发 Harness。

## 验证

本仓库没有构建步骤，也不需要安装依赖。请在仓库根目录运行：

```powershell
node scripts\validate-evals.mjs
node scripts\test-validate-evals.mjs
node scripts\test-run-live-evals.mjs
node scripts\validate-evals.mjs --list
python -B -X utf8 "$env:USERPROFILE\.codex\skills\.system\skill-creator\scripts\quick_validate.py" skills\speak-human
git diff --check
```

确定性验证器会检查两份 schema、规范化 JSON、唯一 ID、生命周期字段、重复和取代关系、已接受案例覆盖率、skill 元数据、路径边界及文本卫生。自测会在一次性临时副本中验证主要失败路径。这些命令都不会发起网络请求或模型调用。

## 扩展案例库

可以在 activation 或 behavior 的发现根目录下任意位置添加符合契约的 JSON 套件，runner 会递归发现它们。

1. 将最小且已脱敏的场景记录为 `candidate`，并提供稳定的 `sh_act_*` 或 `sh_beh_*` ID、locale、origin、日期、标签和安全影响。
2. 记录事实与语义不变量，不记录偏好的固定改写。
3. 明确关联重复、替代和被取代案例。
4. 先运行确定性验证并完成人工审查，再将案例改为 `accepted`。
5. 只有证据揭示通用决策缺口、跨界面重复失败或安全关键不变量时，才增加运行时指引。

`accepted` 案例参与门禁，`candidate` 案例用于收集证据，`retired` 案例保留可追溯性但不再参与门禁。

## Live 评估边界

不传入 `--execute` 时，live runner 只输出执行计划：

```powershell
node scripts\run-live-evals.mjs --lane activation --model <model> --reasoning-effort medium --timeout-seconds 600 --case sh_act_marketing_page_zh
```

加入 `--check-cli` 可以验证本地非交互式 Codex 启动器，而不会调用模型。runner 使用官方说明中的 [`codex exec` 非交互模式](https://developers.openai.com/codex/noninteractive/)。

执行 live run 还需要明确授权，并指定 `evals/results/live/` 下的新路径：

```powershell
node scripts\run-live-evals.mjs --lane behavior --model <model> --reasoning-effort medium --timeout-seconds 600 --allow-provider-host <host> --execute --output evals/results/live/<run-id>
```

runner 会在临时 Codex home 中把候选版本作为唯一的用户 skill，只链接本地认证信息而不复制或读取，并且只向临时配置写入允许列表中的非敏感 provider 设置。自定义 provider 必须精确匹配 `--allow-provider-host`，之后才会创建输出目录或发起模型调用。runner 还会禁用插件加载，使用空工作区和只读 sandbox，并记录版本、模型、reasoning effort、超时、provider 配置哈希、Git 状态及工件哈希。behavior 输出在依照 `evals/rubric.md` 完成人工审查前仍只是候选证据。

`expectedActivation: review` 的 activation 案例也会报告为 `review-required`：runner 记录模型结合上下文作出的判断，但不会机械要求其输出字面值 `review`。控制器必须判断理由是否遵守既定边界。

behavior 输出必须保持给定的界面角色和控件类型稳定。非动作角色必须保留；给定的动作角色应改写为适用的真实动作，只有确实不存在该动作时才能省略。控件为空、缺失或凭空新增都会导致自动预审失败。已批准文本必须在相同角色中逐字保留，其上下文含义仍需人工审查。

Live 调用、用户级安装、commit、push 和 release 是彼此独立的操作。源代码验证通过不能证明已安装副本已经刷新。
