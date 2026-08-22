---
name: speak-human
description: "Guard user-visible website and product UI copy when Codex creates, edits, or reviews frontend interfaces. Use for rendered headings, labels, buttons, forms, states, metadata, and accessibility text; preserve approved copy, verified facts, real actions, permissions, and audience-required technical terms. Do not use for CSS-only or backend work, code identifiers, technical docs, or generic prose."
---

# Speak Human

Keep rendered interface text focused on what the user needs to know or do. Apply this skill while creating a frontend as well as when explicitly rewriting copy. The goal is semantic integrity and clear user language, not a universal sales voice or generic prose polishing.

## Decide Whether It Applies

Apply the skill when the task creates, changes, or reviews text that people will encounter in a website or product interface, including headings, labels, buttons, helper text, validation, loading, errors, success messages, empty states, confirmations, permission states, metadata, and accessibility names.

Do not activate for CSS-only changes, backend refactors, code naming, schemas, logs, technical documentation, internal runbooks, or generic writing with no rendered product copy. For a mixed task, apply the guardrail only to the visible-copy portion.

Approved copy is a protection boundary, not automatic permission to rewrite it. When a frontend task includes wording the user or repository marks as approved, preserve it unless the request explicitly changes that wording.

## Establish the Copy Contract

Before editing, separate these categories:

- **Authoritative wording:** user-approved text, source-of-record content, legal language, required disclosures, and established localization strings. Keep it exact unless change is authorized.
- **Verified product facts:** capability, scope, quantity, availability, quality, price, delivery, security, compliance, and material limitations supported by the task or repository. Preserve their meaning.
- **Real actions and states:** controls, routes, permissions, recovery paths, and lifecycle states that exist for the current user. Describe only what is actually available.
- **Audience vocabulary:** product, operational, or technical terms the intended user needs. Preserve precise terms even when they also appear in source code.
- **Internal language:** implementation commentary, layout rationale, persuasion strategy, evaluation criteria, team workflow, and generated filler. Remove it from rendered copy when it does not serve the audience.

Classify by context, not by a word list. Terms such as candidate, API, webhook, retry, version, dataset, or authorization may be essential in an operations or developer product and irrelevant on a consumer page.

## Work Proportionally

1. Read the request, the active content source, and enough neighboring UI to understand the surface. Prefer repository facts over plausible assumptions.
2. Inventory only the rendered strings in scope. Include alternate states and accessibility text that the implementation creates or changes.
3. Identify the audience, interface locale, established product vocabulary, and current state or permission boundary.
4. Mark authoritative wording and every proposition whose change could affect claims, limitations, legality, permissions, availability, counts, or user expectations.
5. Rewrite minimally. State the concrete offer or current condition, name the affected object, and give a next action only when a matching control or route exists and is available.
6. Check adjacent headings, labels, states, and actions for consistency. If the interface is runnable, verify that text remains readable at relevant breakpoints; otherwise avoid speculative layout work.

When essential facts are missing, use conservative literal wording or omit the unsupported proposition. Ask only when the missing choice would materially change meaning or implementation.

## Adapt to the Surface

- **Marketing:** Lead with the actual offer and verified evidence. Remove funnel strategy, page-construction rationale, and unsupported superlatives.
- **Product workflow:** State what is happening, which object is affected, what changed, and the real recovery or next action. Preserve partial and uncertain outcomes.
- **Admin and operations:** Keep exact statuses, counts, identifiers, lifecycle distinctions, and permission terms needed to operate the system. Remove commentary about the team's review process.
- **Developer product:** Keep accurate API, protocol, credential, webhook, retry, and error terminology. Remove implementation details that do not help the developer diagnose or act.
- **Common UI states:** Distinguish loading, success, partial success, error, empty, disabled, permission-limited, read-only, and unavailable states. Do not turn one state into another for smoother copy.

## Safety Invariants

- Do not invent or strengthen capabilities, evidence, customer claims, scale, quality, availability, pricing, delivery, compliance, security, or guarantees.
- Do not invent a CTA, route, control, recovery step, permission, or state transition because a familiar page pattern usually has one.
- Do not turn permission to view, inspect, or review into authority to approve, adopt, publish, deploy, delete, or otherwise change downstream state.
- Preserve approved wording and every material limitation, legal condition, permission boundary, and accessibility meaning.
- Do not erase legitimate domain or technical terminology merely because it sounds internal outside its intended context.
- Do not change layout, navigation, behavior, code identifiers, routes, analytics events, schema fields, or localization keys solely to improve visible wording.
- Do not rewrite unrelated surfaces. Remove internal rationale from rendered output, not from source comments or product documents unless requested.
- Keep the existing interface language and product voice; do not impose marketing language on operational tools.

## Completion Check

Before handing off, verify:

- Every factual proposition is traceable to the request or repository, and authoritative copy remains intact.
- Every stated action exists, is available in the current state, and names its object or outcome.
- Status, permission, uncertainty, counts, and limitations retain their original meaning.
- Internal development or design rationale is absent from rendered copy unless it is legitimate audience vocabulary.
- The changed copy covers relevant success, failure, empty, loading, disabled, and accessibility states without expanding scope.
- The wording is coherent with neighboring UI and fits the implemented surface.
