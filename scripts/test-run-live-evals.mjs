#!/usr/bin/env node

import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync
} from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const temporaryRoot = mkdtempSync(join(tmpdir(), "speak-human-live-runner-test-"));
const authHome = resolve(temporaryRoot, "auth-home");
const runnerPath = resolve(temporaryRoot, "scripts/run-live-evals.mjs");
let checks = 0;

function assert(condition, message, execution = null) {
  if (condition) {
    return;
  }
  const details = execution
    ? `\nstdout:\n${execution.stdout}\nstderr:\n${execution.stderr}`
    : "";
  throw new Error(`${message}${details}`);
}

function runRunner(extraArgs) {
  return spawnSync(process.execPath, [
    runnerPath,
    "--lane", "activation",
    "--model", "gpt-5.6-sol",
    "--reasoning-effort", "medium",
    "--case", "sh_act_css_only",
    "--auth-home", authHome,
    ...extraArgs
  ], {
    cwd: temporaryRoot,
    encoding: "utf8",
    maxBuffer: 10 * 1024 * 1024
  });
}

function writeProviderConfig(baseUrl, extra = "") {
  writeFileSync(resolve(authHome, "config.toml"), [
    'model_provider = "EvalProvider"',
    "",
    "[model_providers.EvalProvider]",
    'name = "Eval Provider"',
    `base_url = ${JSON.stringify(baseUrl)}`,
    'wire_api = "responses"',
    "requires_openai_auth = true",
    extra
  ].filter(Boolean).join("\n") + "\n", "utf8");
}

try {
  cpSync(resolve(repoRoot, "evals"), resolve(temporaryRoot, "evals"), { recursive: true });
  cpSync(resolve(repoRoot, "skills"), resolve(temporaryRoot, "skills"), { recursive: true });
  cpSync(resolve(repoRoot, "scripts"), resolve(temporaryRoot, "scripts"), { recursive: true });
  cpSync(resolve(repoRoot, "VERSION"), resolve(temporaryRoot, "VERSION"));
  mkdirSync(authHome, { recursive: true });
  writeFileSync(resolve(authHome, "auth.json"), "{}\n", "utf8");

  writeProviderConfig("https://eval.example.invalid/v1");
  const customPlan = runRunner(["--timeout-seconds", "120", "--json"]);
  assert(customPlan.status === 0, "Custom-provider plan must succeed", customPlan);
  const plan = JSON.parse(customPlan.stdout);
  assert(plan.networkOrModelCall === false, "Plan mode must not make a model call", customPlan);
  assert(plan.providerAuthorization.required === true, "Custom provider must require explicit host authorization", customPlan);
  assert(plan.providerAuthorization.host === "eval.example.invalid", "Plan must disclose the exact authorization host", customPlan);
  assert(plan.providerAuthorization.exactMatchProvided === false, "Plan must record the missing host match", customPlan);
  assert(!customPlan.stdout.includes("/v1"), "Plan output must not disclose the provider path", customPlan);
  checks += 1;

  const missingHostOutput = resolve(temporaryRoot, "evals/results/live/test-missing-host");
  const missingHost = runRunner(["--execute", "--output", "evals/results/live/test-missing-host"]);
  assert(missingHost.status !== 0, "Execution without an exact provider host must fail", missingHost);
  assert(missingHost.stderr.includes("--allow-provider-host eval.example.invalid"), "Failure must name the required host flag", missingHost);
  assert(!existsSync(missingHostOutput), "Rejected execution must not create an output directory", missingHost);
  checks += 1;

  const wrongHost = runRunner([
    "--allow-provider-host", "wrong.example.invalid",
    "--execute", "--output", "evals/results/live/test-wrong-host"
  ]);
  assert(wrongHost.status !== 0, "A mismatched provider host must fail", wrongHost);
  assert(!existsSync(resolve(temporaryRoot, "evals/results/live/test-wrong-host")), "Mismatched host must not create artifacts", wrongHost);
  checks += 1;

  writeProviderConfig("https://eval.example.invalid/v1", 'experimental_bearer_token = "DO_NOT_LEAK_SENTINEL"');
  const secretConfig = runRunner(["--json"]);
  assert(secretConfig.status !== 0, "Direct bearer tokens must be rejected", secretConfig);
  assert(!`${secretConfig.stdout}${secretConfig.stderr}`.includes("DO_NOT_LEAK_SENTINEL"), "Secret values must not appear in diagnostics", secretConfig);
  checks += 1;

  writeProviderConfig("https://api.openai.com/v1");
  const officialPlan = runRunner(["--json"]);
  assert(officialPlan.status === 0, "Official OpenAI host plan must succeed", officialPlan);
  const official = JSON.parse(officialPlan.stdout);
  assert(official.providerAuthorization.required === false, "Official OpenAI host must not require a custom-host flag", officialPlan);
  checks += 1;

  const invalidTimeout = runRunner(["--timeout-seconds", "5"]);
  assert(invalidTimeout.status !== 0 && invalidTimeout.stderr.includes("30 through 1800"), "Invalid timeout must fail before execution", invalidTimeout);
  checks += 1;

  writeProviderConfig("https://eval.example.invalid/v1");
  const escapedOutput = runRunner([
    "--allow-provider-host", "eval.example.invalid",
    "--execute", "--output", "../outside-live-results"
  ]);
  assert(escapedOutput.status !== 0 && escapedOutput.stderr.includes("must be a descendant"), "Output path containment must be enforced", escapedOutput);
  checks += 1;

  console.log(`PASS: ${checks} live runner safety checks.`);
} finally {
  if (existsSync(temporaryRoot)
    && dirname(temporaryRoot) === resolve(tmpdir())
    && basename(temporaryRoot).startsWith("speak-human-live-runner-test-")) {
    rmSync(temporaryRoot, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
  }
}
