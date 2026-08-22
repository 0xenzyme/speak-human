# Speak Human

Speak Human helps coding agents turn internal product language into clear, natural language for the people who use or buy the product.

It is designed for landing pages, product UI, onboarding, labels, buttons, metadata, and other visible interface text. It keeps product facts and material caveats intact while removing developer-process language, internal decision criteria, and generated filler.

## Install

Install the `speak-human` skill from the `skills/speak-human` directory using the skill installer, or copy that directory into the target agent's skills directory.

Once installed, invoke it explicitly with:

```text
$speak-human
```

It may also be selected automatically when a page or interface exposes internal development language instead of user-facing product language.

## What it protects

- Product facts, scope, limitations, and legal meaning stay intact.
- Static examples are not presented as live inventory or verified production data.
- Internal goals, layout rationale, acceptance criteria, and implementation notes stay out of rendered copy.
- Technical terms remain when they are meaningful to the intended audience.

## Layout

```text
skills/
└── speak-human/
    ├── SKILL.md
    └── agents/openai.yaml
```
