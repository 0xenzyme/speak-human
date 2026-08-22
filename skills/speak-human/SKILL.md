---
name: speak-human
description: "Rewrite website and product UI copy when internal development language leaks into the user experience; preserve facts and claims rather than doing generic prose humanization."
---

# Speak Human

Use this skill to turn internal or developer-facing product language into the ordinary language a user or buyer should actually see. It is for product copy, labels, and interface text, not AI-detector evasion or generic personality rewriting.

Use this skill when a landing page, product UI, onboarding flow, metadata field, or marketing surface sounds like it is speaking to developers, designers, or an internal review rather than to the person using or buying the product.

The goal is not to make every sentence more persuasive. The goal is to expose the right product facts, value, and next action while keeping implementation rationale, internal decision criteria, and design-process language out of the rendered experience.

## Core Distinction

Classify every candidate string before rewriting it:

- **Product fact:** what exists, what it contains, what the user can do, or a limitation the user needs to know. Keep it, using the user's vocabulary.
- **User value:** why the fact matters to this audience. Express it plainly and concretely.
- **Next action:** what the user can do next. Name the object and outcome.
- **Internal rationale:** why the team chose a layout, metric, sequence, or acceptance criterion. Keep it in source notes, product docs, or design artifacts; do not present it as page copy.
- **Developer/process language:** implementation details, design contracts, evaluation language, or workflow labels. Keep it out of visible copy unless the audience explicitly needs it.

Do not confuse domain language with developer language. Terms such as “数据集”, “版本”, “文本”, “图片”, “视频”, “音频”, “授权” or “数据量” can be valid user-facing terms when they describe the product. Remove the meta-language around them, not the facts themselves.

## Rewrite Workflow

1. Read the complete visible path, not only the flagged sentence. Include the heading, supporting text, CTA, labels, metadata, and the next section.
2. Identify the audience and their immediate question: “这是什么？有什么？对我有什么用？下一步是什么？”
3. Mark internal language that describes a decision sequence, team goal, layout intent, or evaluation rubric. Treat it as context, not as copy.
4. Rewrite the hierarchy:
   - **Headline:** the product, outcome, or concrete value in ordinary language.
   - **Supporting copy:** the factual scope, content, or limitation that makes the headline credible.
   - **CTA:** a specific action and object, such as “查看数据集” or “申请样例”, when that action exists.
   - **Section labels:** short nouns users recognize; do not expose internal work phases.
5. Say each idea once. If a headline already states the value, let the next sentence add scope or evidence instead of restating the strategy.
6. Preserve factual caveats. Fixed examples, unavailable live data, permissions, pricing limits, and other material constraints must remain clear, but state them as user-relevant conditions rather than implementation notes.
7. Check the full copy at realistic desktop and mobile widths. Fix awkward wrapping, unexplained abbreviations, inconsistent nouns, and copy that only makes sense with hidden project context.

## Common Translations

Use these as patterns, not mandatory wording:

| Internal or developer-facing wording | User-facing direction |
| --- | --- |
| “先看数据规模，再判断是否匹配” | Lead with the offering and concrete scope, e.g. “海量训练数据，从文本到音频” |
| “采购前核对” | “数据资源” or a specific benefit/section name |
| “继续评估” | “进一步了解” or the actual next action |
| “展示能力/证明能力” | State the capability or inventory directly |
| “数据盘点/信息架构/首屏命题” | Describe the data, content, or user outcome, not the page construction |
| “固定示例/模拟数据” | Keep the disclosure when needed, e.g. “固定示例，不代表实时数量” |

The example translation works because it replaces the team's decision process with a concrete answer to the visitor's question. It does not mean every page should use “海量”, “从……到……” or a sales tone.

## Claim Safety

- Do not invent customer names, prices, benchmarks, quality scores, coverage, availability, delivery guarantees, compliance, or production counts.
- A static number may demonstrate information structure, but must be labeled as an example and must not be presented as live or sellable inventory.
- If a buyer decision depends on quality, licensing, format, delivery, or price and the product has no verified fact for it, do not imply that the decision is settled. Point to the concrete dataset details or leave the claim out.
- Keep legal, permission, safety, and accessibility language when it changes what the user may do.

## Boundaries

- Apply automatically to customer-facing and general product UI copy when it sounds like internal strategy or generated filler.
- On admin and operations screens, preserve precise operational terminology when it helps users complete work; remove only the meta-commentary about the team's process.
- Do not rewrite technical documentation, API contracts, database schemas, or internal runbooks unless the user explicitly asks for user-facing copy.
- Do not change behavior, claims, or legal meaning merely to make a sentence sound smoother. Surface the uncertainty and ask when a factual choice materially changes the result.

## Completion Check

Before handing off, confirm:

- A person unfamiliar with the implementation can understand what is offered.
- The headline is ordinary product language, not a team objective or decision rubric.
- The supporting copy adds concrete scope or evidence.
- The CTA names a real next action.
- Important limitations remain visible and honest.
- No `THESIS`, `FIRST VIEWPORT`, seed, candidate, sprint, API/DB note, or internal acceptance phrase leaked into rendered copy.
- The wording remains readable at the target breakpoints.
