# 仓库指南

## 项目结构与模块组织

可安装 skill 位于 `skills/speak-human/`：`SKILL.md` 定义运行行为，`agents/openai.yaml` 定义发现元数据。`VERSION` 和 `evals/manifest.json` 记录候选版本。仅供维护者使用的资产位于仓库根目录。`evals/cases/` 存放 activation 与 behavior 套件，`evals/rubric.md` 定义语义审查标准。脚本位于 `scripts/`，持久规划记录位于 `docs/` 和 `harness/`。

## 文档语言

维护文档、Agents 展示文案和 Harness 人工维护记录默认使用简体中文。命令、路径、代码标识、schema 字段、协议名、模型名及案例原始语言保持英文或原始形式。已完成的 `.harness/runs/` 与 `evals/results/` 属于历史证据，除纠正事实错误外不因语言统一而改写。

## 开发与验证命令

本仓库没有构建步骤，也不需要安装依赖。

```powershell
node scripts\validate-evals.mjs
node scripts\test-validate-evals.mjs
node scripts\test-run-live-evals.mjs
node scripts\validate-evals.mjs --list
node scripts\run-live-evals.mjs --help
python -B -X utf8 "$env:USERPROFILE\.codex\skills\.system\skill-creator\scripts\quick_validate.py" skills\speak-human
git diff --check
```

第一条命令是仓库离线门禁。除非明确传入 `--execute`，live runner 只输出计划；模型调用和用户级安装都需要分别授权。

## 编码风格与命名约定

使用 UTF-8、两个空格的 JSON/YAML 缩进、规范化 JSON 格式、简短的 Markdown 标题和直接指令。Skill 目录使用小写 kebab-case。案例 ID 使用 `sh_act_*` 或 `sh_beh_*`；suite 和 tag 值使用小写 kebab-case。示例应保持产品中立，并对真实观察进行脱敏。

## 测试指南

行为发生变化时应新增或更新案例。`accepted` 案例参与覆盖门禁，`candidate` 案例收集证据，`retired` 案例必须说明原因，并在适用时提供可追溯替代项。测试语义不变量，不要求固定文案。已批准措辞、事实、限制、权限和真实动作必须保留；不受支持的主张或虚构动作均判定为失败。审查前应同时运行确定性验证器和官方 skill 验证器。

## Commit 与 Pull Request 指南

现有历史使用带范围、祈使式的消息，例如 `chore: initialize speak-human skill repository`；后续继续采用 `type: concise summary`。不要随意提交生成的 live 结果。Pull request 应说明行为缺口、列出受影响的案例 ID、解释生命周期变化并报告验证命令。修改前后文案只能作为证据，不能成为普遍要求的固定措辞。

## 安全与交付边界

不得在案例或结果中存储凭据、客户数据或未脱敏的生产文案。源代码验证、live 评估、用户级安装、commit、push 和 release 是不同步骤；只能报告实际完成的步骤。
