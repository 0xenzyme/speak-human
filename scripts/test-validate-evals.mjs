#!/usr/bin/env node

import {
  cpSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync
} from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const temporaryRoot = mkdtempSync(join(tmpdir(), "speak-human-validator-test-"));
let checks = 0;

function runValidator() {
  const result = spawnSync(process.execPath, [resolve(temporaryRoot, "scripts/validate-evals.mjs"), "--json"], {
    cwd: temporaryRoot,
    encoding: "utf8",
    maxBuffer: 10 * 1024 * 1024
  });
  let report = null;
  try {
    report = JSON.parse(result.stdout);
  } catch {
    // The assertion below reports stdout and stderr with the failed check.
  }
  return { result, report };
}

function assert(condition, message, execution = null) {
  if (condition) {
    return;
  }
  const details = execution
    ? `\nstdout:\n${execution.result.stdout}\nstderr:\n${execution.result.stderr}`
    : "";
  throw new Error(`${message}${details}`);
}

function mutateJson(relativePath, mutate, expectedError) {
  const path = resolve(temporaryRoot, relativePath);
  const original = readFileSync(path, "utf8");
  try {
    const value = JSON.parse(original);
    mutate(value);
    writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
    const execution = runValidator();
    assert(execution.result.status !== 0, `${relativePath}: mutation should fail validation`, execution);
    assert(execution.report?.errors?.some((error) => error.includes(expectedError)), `${relativePath}: expected error containing ${JSON.stringify(expectedError)}`, execution);
    checks += 1;
  } finally {
    writeFileSync(path, original, "utf8");
  }
}

try {
  cpSync(resolve(repoRoot, "evals"), resolve(temporaryRoot, "evals"), { recursive: true });
  cpSync(resolve(repoRoot, "skills"), resolve(temporaryRoot, "skills"), { recursive: true });
  cpSync(resolve(repoRoot, "scripts"), resolve(temporaryRoot, "scripts"), { recursive: true });
  cpSync(resolve(repoRoot, "VERSION"), resolve(temporaryRoot, "VERSION"));

  const baseline = runValidator();
  assert(baseline.result.status === 0 && baseline.report?.ok === true, "Unmodified temporary copy must pass validation", baseline);
  checks += 1;

  mutateJson("evals/cases/activation/boundary.json", (value) => {
    value.cases[0].id = "sh_act_marketing_page_zh";
  }, "duplicate case ID");

  mutateJson("evals/cases/activation/core.json", (value) => {
    delete value.cases[0].acceptedAt;
  }, "accepted case requires acceptedAt");

  mutateJson("evals/cases/activation/core.json", (value) => {
    delete value.cases[0].request;
  }, "missing required property request");

  mutateJson("evals/cases/activation/core.json", (value) => {
    value.cases[0].supersedes.push("sh_act_missing_case");
  }, "references missing case");

  mutateJson("evals/cases/behavior/ui-states.json", (value) => {
    const noAction = value.cases.find((item) => item.surface === "no-action");
    noAction.status = "candidate";
    delete noAction.acceptedAt;
  }, "coverage is missing surface=no-action");

  mutateJson("evals/cases/activation/boundary.json", (value) => {
    const legacy = value.cases.find((item) => item.id === "sh_act_css_only_legacy");
    delete legacy.duplicateOf;
  }, "exactly one canonical case");

  mutateJson("evals/manifest.json", (value) => {
    value.skill.version = "0.1.1";
  }, "versionFile must match manifest.skill.version");

  console.log(`PASS: ${checks} deterministic validator checks.`);
} finally {
  if (existsSync(temporaryRoot)
    && dirname(temporaryRoot) === resolve(tmpdir())
    && basename(temporaryRoot).startsWith("speak-human-validator-test-")) {
    rmSync(temporaryRoot, { recursive: true, force: true });
  }
}
