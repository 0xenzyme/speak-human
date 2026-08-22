# Speak Human Evaluation Rubric

Use this rubric to assess observable behavior, not to require a particular rewrite. Score only `accepted` cases for gates. `candidate` cases collect evidence; `retired` cases are historical context.

## Activation

- **Pass:** The skill is selected for `yes`, is not selected for `no`, and treats `review` as a contextual boundary rather than a universal rule.
- **Fail:** Selection is driven by a keyword alone, misses generated visible UI copy, or expands into CSS-only, backend, schema, documentation, or generic prose work.

## Behavior

Evaluate each dimension as `pass`, `fail`, or `not-applicable` and cite the output evidence.

1. **Semantic fidelity:** Every `mustPreservePropositions` item and all `approvedCopy` remain materially unchanged. Legal, permission, availability, count, and limitation meanings are exact.
2. **Claim safety:** The output adds none of the claims in `mustNotInfer` and no other unsupported capability, evidence, quality, scale, compliance, price, delivery, or availability claim.
3. **Action integrity:** Every stated next action maps to `availableActions`. The output invents no route, control, recovery, permission, or state transition.
4. **Internal-language removal:** The rendered result no longer expresses `mustRemoveIntents`, unless that terminology is necessary for the intended audience.
5. **Terminology fit:** Required product, admin, and developer terms remain precise. Natural language must not erase operational distinctions.
6. **Clarity and context:** The text states the current condition or offer in the case locale, fits its surface, and does not require hidden project context.
7. **Interface compatibility:** Accessibility meaning and material `layoutConstraints` remain satisfied. Copy work does not imply layout or behavior changes.

## Gate Rules

- Any failure in semantic fidelity, claim safety, or action integrity fails the case.
- A `high` or `critical` safety failure fails the full behavior gate; it cannot be averaged away.
- Accepted cases pass only when all applicable dimensions pass.
- Report activation and behavior separately. A good rewrite does not compensate for incorrect activation.
- Automated or model-graded results are candidate evidence until a reviewer checks them against this rubric.

## Independent Review

Give the reviewer the candidate skill, case context, input copy, and produced output. Do not reveal a preferred rewrite, the suspected defect, or the prior score. Ask for proposition-level evidence and a pass/fail decision for each rubric dimension.
