# 将 Speak Human 工程化为经行为验证的 UI 文案守卫

Created: 2026-08-22
Status: accepted
Target: `skills/speak-human/`
Harness state: Goal/Run 中的实现已完成；live model 与安装通道后置
Harness contract: `fixed`
Harness language: `zh-CN`

## 决策

- Speak Human 保持为独立 Codex skill，拥有自己的发布与评估生命周期。
- 将它工程化为前端开发过程中创建或修改用户可见文案时使用的守卫，而不只是显式改写工具。
- 修改 `SKILL.md` 前，先定义可观察行为和评估案例。
- 维护可扩展案例库，并明确生命周期、来源和晋级规则。
- 保留 skill 自动发现，不改成仅允许显式调用。
- 将确定性验证与可选 live model 评估分开。
- 不把该 skill 合并进 Agent Harness；Harness 只负责组织工作，不是 skill 的运行时依赖。

## 问题

当前 skill 在结构上有效，也包含区分产品事实与内部理由的实用规则，但还不能证明 GPT-5.6 在页面开发过程中能够稳定表现出预期行为。

当前缺口包括：

- discovery metadata 更强调显式改写，没有覆盖创建或编辑实际渲染的 UI 文案；
- 示例可能引入规模、覆盖范围等无依据主张；
- 词语黑名单可能误删合理的产品、运营或开发者术语；
- 层级和 CTA 指引可能暗示实际不存在的动作或行为；
- 已批准文案和内容数据源没有得到明确保护；
- 常见 UI 状态与面向开发者的产品覆盖不足；
- 已有结构验证，但 activation 与输出行为缺少可重复运行的评估套件。

## 预期结果

当 Codex 创建或编辑用户可见的界面文本时，Speak Human 应当：

1. 无需用户明确说“改写这段文案”也能正确激活；
2. 从渲染文本中移除实现说明、设计理由、评估准则、内部流程标签和生成式填充内容；
3. 保留已批准措辞、已验证事实、实质限制、法律含义、权限，以及适合目标用户的领域术语；
4. 不虚构主张、状态、动作、路由、权限或产品行为；
5. 除非用户明确要求扩大到布局或行为，只改进所请求界面范围内的文案；
6. 适用于营销页、产品流程、管理工具和开发者产品，同时不强加单一语气或销售风格。

## Scope

- 优化 skill 描述和调用元数据，使自动发现覆盖前端实现期间的可见文案工作。
- 围绕上下文分类与语义保真重构 `SKILL.md`，不再依赖固定词语替换。
- 为已批准文案、内容数据源、真实动作、范围约束、locale 和产品语气增加明确规则。
- 覆盖标题、标签、按钮、表单、空状态、加载状态、错误、成功消息、确认、权限状态、metadata 和无障碍标签。
- 在仓库层建立可扩展的中英文 activation 与 behavior 评估登记体系。
- 增加确定性评估数据验证和可选执行的 live Codex 评估路径。
- 记录可重复的源代码验证方法；另行授权后再验证用户级安装。

## Non-Goals

- 普通文章润色、虚构品牌语气或营销优化。
- 规避 AI 检测，或让生成文本伪装成人工创作。
- 默认改写技术文档、API 契约、数据库 schema、代码标识、日志或内部 runbook。
- 仅为了改善措辞而更改布局、导航、权限、工作流或应用行为。
- 虚构客户证据、指标、可用性、合规、安全、价格、交付或性能主张。
- 维护通用黑名单或翻译字典。
- 把每个新观察到的案例复制进 `SKILL.md`，或把单一产品措辞当作普遍规则。
- 要求输出固定措辞，或把文案快照作为主要测试策略。
- 在本范围内把 Speak Human 打包为 plugin 或集成进 Agent Harness。
- 未经单独授权执行 commit、push、release 或用户级安装。

## 行为契约

### 激活

当任务创建、编辑或审查网站或产品 UI 中实际渲染的文案时激活，尤其是 Codex 正在生成可见文本时。显式文案改写请求仍然支持。

如果范围内没有用户可见的产品文案，则不要因纯 CSS 修改、后端重构、内部代码命名、技术文档、API/schema 工作或普通文章编辑而激活。

边界案例应根据受众和文本承担的角色判断，不能只看关键词。同一个术语在某个产品中可能是内部语言泄漏，在另一个产品中却可能是用户必需语言。

### 语义保真

- 除非用户要求更改，否则将用户提供的已批准文案和仓库内容源视为权威。
- 保留每项影响能力、可用性、数量、质量、价格、权限、安全、合规、交付或法律含义的命题。
- 当目标用户理解或操作产品需要领域与技术术语时，保留这些术语。
- 只从渲染文本中移除内部理由；除非用户要求，不要从产品文档或源码注释中删除。
- 缺少事实或真实动作时，采用保守、直白的措辞，或明确指出缺失决策；不要用看似合理的产品行为填补空白。

### 动作完整性

- CTA 必须映射到当前实现范围内真实存在的动作、路由或控件。
- 不要仅因为常见页面模式通常包含 CTA 就新增 CTA。
- 保留 disabled、unavailable、permission-limited 和 read-only 状态。
- 只有恢复动作真实存在且当前用户可用时，错误或空状态文案才能说明该恢复方式。

### 不同界面的行为

| 界面类型 | 必需行为 |
| --- | --- |
| 营销页或 landing page | 说明具体价值与已验证证据；移除漏斗策略、说服策略和布局理由。 |
| 产品工作流 | 说明当前状态、受影响对象和真实下一动作，不暴露实现顺序。 |
| 管理或运营 UI | 保留完成工作所需的准确状态、标识、生命周期术语和控件。 |
| 开发者产品 | 在技术准确且与用户相关时，保留 API、协议、凭据、webhook、retry 和错误术语。 |
| 错误与空状态 | 说明当前真实情况；如果存在，给出一个合法的恢复方式或下一动作。 |

### 范围约束

- 检查足够的相邻可见上下文，确保修改后的文案连贯，但不要改写无关界面。
- 不要仅为了让可见文案更自然而重命名代码标识、路由、analytics event、schema 字段或 localization key。
- 保留现有界面语言和既定产品词汇。
- 任务包含可运行界面时，应在相关 breakpoint 验证文本适配；否则只记录版面适配风险，不扩大任务范围。

## Skill 设计

修订后的入口应保持简洁且自包含：

1. 一段有区分度、覆盖前端创建和编辑场景的 frontmatter description。
2. 一套针对已批准文案、事实、用户价值、真实动作、领域术语和内部语言的简短决策模型。
3. 与任务规模相称的渲染界面检查流程。
4. 针对语义、主张、动作和范围的安全约束。
5. 基于含义而不是禁用词的完成检查。

移除或替换现有固定翻译表和关键词黑名单。只有条件性内容足够多、确实需要渐进披露时，才新增 supporting reference。

`agents/openai.yaml` 应与最终 description 和 default prompt 保持一致。默认继续允许 implicit invocation。

## 评估架构

计划中的仓库结构：

```text
evals/
|-- manifest.json
|-- schemas/
|   |-- activation-case.schema.json
|   `-- behavior-case.schema.json
|-- cases/
|   |-- activation/
|   |   |-- core.json
|   |   `-- boundary.json
|   `-- behavior/
|       |-- marketing.json
|       |-- product-ui.json
|       |-- admin-ops.json
|       |-- developer-tools.json
|       `-- ui-states.json
`-- rubric.md
scripts/
|-- validate-evals.mjs
`-- run-live-evals.mjs
skills/speak-human/
|-- SKILL.md
`-- agents/openai.yaml
```

评估文件属于维护者资产；除非 skill 在运行时确实需要，否则必须放在可分发 skill 目录之外。manifest 声明 schema 版本、案例发现路径、必需覆盖组和门禁策略。runner 应发现符合契约的案例文件，而不是硬编码首批文件名。

### Activation 案例

每个案例记录：

- 稳定案例 ID 和 locale；
- 生命周期状态与来源；
- 用户请求和相关任务上下文；
- 界面类型；
- 预期 activation：`yes`、`no` 或 `review`；
- 简短路由理由。

初始矩阵必须包括：

- 包含生成式可见文案的 landing page 和产品页创建；
- 含内部流程语言的组件编辑；
- 纯 CSS 与纯后端修改；
- 技术文档和 API/schema 工作；
- 必须保留的管理术语；
- 包含合理技术语言的开发者工具 UI；
- 已经自然或已明确批准的文案；
- 只有部分工作涉及可见文本的混合请求。

### Behavior 案例

每个案例记录：

- 输入文案和足够的相邻界面上下文；
- 已批准文案与已验证事实；
- 可用动作和权限状态；
- 必须保留的命题；
- 不得继续出现在渲染结果中的内部意图；
- 不得推断的主张、动作与语义；
- 具有实质影响时的 breakpoint 或长度限制。

必需界面覆盖包括营销、SaaS 工作流、管理/运营、开发者工具、表单验证、加载、错误、成功、空状态、确认、权限、只读和无动作状态。

### 案例生命周期与扩展策略

案例库应随着真实使用暴露的新失败与边界条件持续增长。新案例只要符合当前 schema，就必须能在不修改 runner 的情况下加入。

每个案例只能处于一种生命周期状态：

- `candidate`：来自新观察，但尚未被接受为回归门禁；
- `accepted`：已经审查、去重、可复现，并纳入适用门禁；
- `retired`：保留原因，并在适用时记录替代或取代案例，但不再约束当前行为。

每个新案例必须包括：

- 稳定 ID、locale、界面标签和加入日期；
- `synthetic`、`real-redacted` 或 `regression` 等 origin 类型；
- 不包含客户数据或秘密、但足以复现判断的最小上下文；
- 预期语义不变量和失败的安全影响；
- 与重复、被取代或被收窄案例的关联。

加入案例并不自动意味着应向 `SKILL.md` 增加新指令。只有案例揭示通用决策缺口、在实质不同的界面中重复出现，或违反安全关键不变量时，才能把案例经验提升为运行时 skill 规则。产品特定措辞、孤立的风格偏好和近似重复案例应留在案例库中，不扩张入口指令。

出现真正不同的界面类型时，新增 behavior 案例文件和 manifest coverage group。只有该类型需要大量条件性指引、无法在 `SKILL.md` 中保持简洁时，才新增运行时 reference。Schema 变化需要递增版本、编写迁移说明，并验证现有 accepted 案例的兼容性。

维护循环如下：

1. 将观察到的场景脱敏后记录为 `candidate`；
2. 使用已记录的 skill 与模型版本复现；
3. 检查重复项，识别缺失或被违反的不变量；
4. 接受、合并、收窄或退役案例；
5. 只有满足晋级规则时才修改 skill；
6. 重新运行受影响分组与安全关键回归集。

### 评估准则

评估可观察不变量，而不是固定文案：

- skill 激活正确；
- 不泄漏内部理由或实现说明；
- 语义忠实并保留已批准文案；
- 不产生无依据主张；
- 不虚构动作、路由、权限或状态转换；
- 保留必需的领域与技术术语；
- 适用时清楚说明状态和恢复方式；
- 兼容 locale、语气、无障碍和布局适配要求。

安全关键失败不能被风格质量的平均分抵消。模型或 subagent 评分结果在独立审查前只属于候选证据。

### 验证通道

1. **确定性通道：** 验证 manifest 与 schemas、JSON 结构、跨文件唯一 ID、生命周期转换、必需字段、覆盖声明、取代关系、文件引用、skill 结构和空白字符；不得需要网络或模型调用。
2. **Live activation 通道：** 使用隔离的临时 Codex home，判断候选 skill 是否会被 activation 案例选中；记录运行模型、skill hash、case hash 和时间戳。
3. **Live behavior 通道：** 显式调用候选 skill 以隔离指令质量，再根据语义准则评分；不得以固定措辞作为通过条件。
4. **独立审查通道：** 不向审查者提供预期改写或怀疑缺陷，评估代表性输出。

Live 通道采取 opt-in，因为可能需要网络访问、凭据、可用模型和费用。仅接受本 Spec 并不授权执行这些通道。

## 交付阶段

### Stage 0：评估契约

- 增加带版本的 manifest、评估案例 schemas、生命周期规则、初始案例组、rubric 和确定性验证器。
- 在不修改当前 skill 的情况下完成验证，并记录 baseline failures。

### Stage 1：Skill 修订

- 只有 baseline 证据支持时，才修订 discovery metadata 和 `SKILL.md`。
- 移除相互矛盾、项目特定或基于关键词的指引。
- 应用案例到规则的晋级策略；不要为每个 accepted 案例扩张运行时指令。
- 让入口聚焦于非显而易见的决策。

### Stage 2：行为验证

- 运行确定性验证。
- 另行授权后运行隔离的 activation 与 behavior 评估。
- 对代表性的中英文案例执行独立前向测试。
- 修复已证明的失败，不为每个示例堆叠规则。

### Stage 3：文档与安装边界

- 用实际存在的验证命令和仓库结构更新 `README.md` 与 `AGENTS.md`。
- 使用官方 skill validator 验证可分发 skill。
- 将仓库验证与用户级安装分开。
- 后续如获安装授权，先更新用户级副本并核对源文件与安装文件 hash，再宣布刷新完成。

## 持久控制不变量

- `harness-rule:path-containment`：实现写入必须留在本仓库内；用户级安装是需要单独授权的操作。
- `harness-rule:candidate-accepted-evidence`：生成输出和自动评分在按 rubric 审查前仍属于候选证据。
- `harness-rule:authoritative-completion-state`：仅结构验证不能完成工作；行为门禁和状态同步也必须通过。
- `harness-rule:state-sync-evidence`：README、贡献者指南、评估结果与安装状态主张必须符合实际实现状态。
- `harness-rule:project-neutral-core`：示例和规则必须能跨产品泛化，不能把某个数据集、工作流或历史页面写成普遍策略。
- `harness-rule:durable-tier-boundary`：shaping 不创建 Goal 或 Run；只有 Spec 被接受并明确采用 Harness 或创建 Goal 后，持久执行才开始。

## Acceptance Criteria

- description 能为创建或修改可见 UI 文案的前端任务选择 Speak Human，但不会成为所有前端工作的 catchall。
- 高置信度正向和负向 activation 案例通过；已记录的边界案例不会悄然变成普遍规则。
- 符合契约的新案例可以加入可发现案例文件，不需要修改 runner。
- candidate、accepted 和 retired 案例可区分、可追溯，并按各自门禁角色验证。
- 案例产生的指引只能通过已记录的晋级规则进入 `SKILL.md`。
- 所有 approved copy 和 must-preserve 命题在 behavior 评估中保留。
- behavior 案例不得引入无依据主张、动作、路由、权限或状态转换。
- 目标用户需要时，保留合理的领域和开发者术语。
- 除非其本身就是产品领域，渲染输出中不出现内部开发、设计、评估和验收语言。
- 营销、产品、管理、开发者和常见 UI 状态案例均有中英文覆盖。
- 测试判断语义不变量，不要求固定输出措辞。
- 确定性验证可在本地运行，不需要网络访问。
- Live 评估记录模型与工件来源，且只在另行授权后运行。
- 最终可分发目录通过官方 skill validator。
- 只有完成授权安装和直接核验后，才报告仓库与安装 hash 相等。
- 文档只描述真实存在的命令和文件。
- 不引入 Agent Harness 运行时依赖，也不合并为 plugin。

## Spec Acceptance Checklist

- Item: 目标行为与激活边界
  - Acceptance: 预期结果、激活规则和 non-goals 与目标产品行为一致。
  - Evidence: 用户于 2026-08-22 指示实施本 Spec。
  - Status: `accepted`
  - Unblocker: `N/A`

- Item: 评估架构
  - Acceptance: 确定性、live activation、live behavior 与独立审查通道得到适当分离。
  - Evidence: 用户于 2026-08-22 审查修订后的可扩展架构后指示实施。
  - Status: `accepted`
  - Unblocker: `N/A`

- Item: 可扩展案例治理
  - Acceptance: 新用例可以登记、去重、晋级、取代和退役，不会把每个示例都变成运行时指令。
  - Evidence: 用户明确要求持续扩展，并于 2026-08-22 指示实施。
  - Status: `accepted`
  - Unblocker: `N/A`

- Item: Skill 修订边界
  - Acceptance: Spec 允许结合上下文修改指令，但不扩展到普通文案写作、产品行为变更或词语黑名单增长。
  - Evidence: 用户于 2026-08-22 指示实施本 Spec。
  - Status: `accepted`
  - Unblocker: `N/A`

- Item: 交付边界
  - Acceptance: 源代码修改、采用 Harness、commit/push 与用户级安装仍是相互独立的决策。
  - Evidence: 用户授权了 baseline commit 与实现；push、release、live 调用和用户级安装当时仍未授权。
  - Status: `accepted`
  - Unblocker: `N/A`

## Required Gate Evidence

- Gate: Spec 验收
  - Required: `yes`
  - Evidence: 用户于 2026-08-22 指示实施修订后的 Spec。
  - Status: `passed`
  - Unblocker: `N/A`

- Gate: 确定性验证
  - Required: `yes`
  - Evidence: `node scripts/validate-evals.mjs --json` 对 7 个文件中的 31 个案例验证通过；`node scripts/test-validate-evals.mjs` 通过 7 项正向/负向检查。
  - Status: `passed`
  - Unblocker: `N/A`

- Gate: 案例登记治理
  - Required: `yes`
  - Evidence: Manifest schema version 1 对 29 个 accepted 案例执行门禁，同时保留 1 个 candidate 和 1 个 retired 案例；schemas 与 validator 强制检查 ID、来源、覆盖率、重复项和替代关系。
  - Status: `passed`
  - Unblocker: `N/A`

- Gate: 语义安全
  - Required: `yes`
  - Evidence: `evals/results/2026-08-22-forward-test.md` 记录 5 项独立的代表性行为检查，未出现 approved copy、事实、权限、术语、主张或动作失败。
  - Status: `passed`
  - Unblocker: `N/A；完整 live model 矩阵仍需单独授权`

- Gate: 独立前向测试
  - Required: `yes`
  - Evidence: 只读盲审者在无法访问案例库、预期改写、baseline 缺陷或 git diff 的条件下，通过 4 个路由和 5 个 behavior 场景。
  - Status: `passed`
  - Unblocker: `N/A`

- Gate: 官方 skill 验证
  - Required: `yes`
  - Evidence: Skill Creator 的 `quick_validate.py skills/speak-human` 返回 `Skill is valid!`。
  - Status: `passed`
  - Unblocker: `N/A`

- Gate: Live model 评估
  - Required: `no`
  - Evidence: 已验证 runner help、plan-only 行为、Windows CLI 解析、来源记录、隔离计划和缺少授权时的拒绝；未发起模型调用。
  - Status: `deferred`
  - Unblocker: `需要用户单独授权`

- Gate: 用户级刷新
  - Required: `only if installation is requested`
  - Evidence: 未运行；明确不主张 source/install 相等。
  - Status: `not-authorized`
  - Unblocker: `需要用户单独授权`

## Verification

实现后的计划验证：

```powershell
node scripts/validate-evals.mjs
python -B -X utf8 <skill-creator>/scripts/quick_validate.py skills/speak-human
node <agent-harness>/scripts/agent-harness.mjs config validate --cwd . --json
git diff --check
```

只有 runner 与隔离契约存在后才会指定 live 命令。结构验证成功不得被描述为 GPT-5.6 行为已经得到证明。

## State Sync

- 当前记录：本 accepted Spec、Goal `harness/goals/2026-08-22-speak-human-ui.md`、Run `.harness/runs/20260822-210732-speak-human-ui`、Task 和有边界的 status。
- 当前仓库状态：Harness fixed contract 使用 `language.default=zh-CN`；baseline commit `5beaa90` 之后，实现和必需离线门禁均已完成。
- 评估证据：`evals/results/2026-08-22-baseline.md` 与 `evals/results/2026-08-22-forward-test.md`。
- 交付边界：当时实现改动尚未提交；未执行 live model 调用、用户级安装、push、release 或 publish。

## Pause Conditions

- 请求行为与已批准文案、已验证产品事实、法律含义、权限或无障碍要求发生 `conflict`。
- 拟议测试未经授权便需要网络访问、`paid` model 调用、`credentials` 或用户级写入。
- 评估 runner 无法证明结果由哪个模型或 skill 版本生成。
- Skill 修改需要超出已接受范围的应用 `product` 行为、布局、路由或内容数据源变更。
- 新证据表明 automatic activation 无法在避免不可接受误报的同时保持区分度；应暂停并等待新 `instruction`。
