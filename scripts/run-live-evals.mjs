#!/usr/bin/env node

import { createHash } from "node:crypto";
import {
  cpSync,
  existsSync,
  linkSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  symlinkSync,
  writeFileSync
} from "node:fs";
import { homedir, tmpdir } from "node:os";
import { basename, dirname, isAbsolute, join, relative, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = resolve(repoRoot, "evals/manifest.json");
const validatorPath = resolve(repoRoot, "scripts/validate-evals.mjs");
const runnerVersion = 11;
const supportedReasoningEfforts = new Set(["none", "low", "medium", "high", "xhigh", "max"]);
const actionRoles = new Set(["action", "button", "link"]);

function usage() {
  return [
    "Usage:",
    "  node scripts/run-live-evals.mjs --lane <activation|behavior> --model <MODEL> --reasoning-effort <EFFORT> [options]",
    "",
    "Default behavior is a read-only plan. It never calls a model.",
    "",
    "Options:",
    "  --lane NAME          Evaluation lane: activation or behavior.",
    "  --model MODEL        Exact Codex model identifier to record and use.",
    "  --reasoning-effort EFFORT  Exact reasoning effort to record and use.",
    "  --timeout-seconds N  Per-case timeout; defaults to 600 seconds.",
    "  --allow-provider-host HOST  Required exact host match for a custom provider.",
    "  --case ID            Run one case; repeat to select multiple cases.",
    "  --include-candidate  Include candidate cases when no --case is given.",
    "  --output PATH        New result directory under evals/results/live/.",
    "  --auth-home PATH     Codex home containing auth.json; contents are never copied.",
    "  --check-cli          Verify the local Codex launcher without making a model call.",
    "  --execute            Make live model calls after all safety checks pass.",
    "  --json               Print plan or summary as JSON.",
    "  --help               Show this help message.",
    "",
    "Live execution requires --execute, --output, --lane, and --model. It stages the",
    "candidate skill in a temporary Codex home, links auth.json without reading it,",
    "uses an empty workspace, read-only sandboxing, ignored user config/rules, and",
    "ephemeral sessions. It never installs or changes the user-scope skill."
  ].join("\n");
}

function parseArgs(argv) {
  const options = {
    lane: null,
    model: null,
    reasoningEffort: null,
    timeoutSeconds: 600,
    allowProviderHost: null,
    caseIds: [],
    includeCandidate: false,
    output: null,
    authHome: null,
    checkCli: false,
    execute: false,
    json: false,
    help: false
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const takeValue = () => {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) {
        throw new Error(`${arg} requires a value`);
      }
      index += 1;
      return value;
    };
    if (arg === "--lane") {
      options.lane = takeValue();
    } else if (arg === "--model") {
      options.model = takeValue();
    } else if (arg === "--reasoning-effort") {
      options.reasoningEffort = takeValue();
    } else if (arg === "--timeout-seconds") {
      options.timeoutSeconds = Number(takeValue());
    } else if (arg === "--allow-provider-host") {
      options.allowProviderHost = takeValue().toLowerCase();
    } else if (arg === "--case") {
      options.caseIds.push(takeValue());
    } else if (arg === "--include-candidate") {
      options.includeCandidate = true;
    } else if (arg === "--output") {
      options.output = takeValue();
    } else if (arg === "--auth-home") {
      options.authHome = takeValue();
    } else if (arg === "--check-cli") {
      options.checkCli = true;
    } else if (arg === "--execute") {
      options.execute = true;
    } else if (arg === "--json") {
      options.json = true;
    } else if (arg === "--help" || arg === "-h") {
      options.help = true;
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }
  return options;
}

function fail(message, exitCode = 2) {
  console.error(message);
  process.exit(exitCode);
}

let options;
try {
  options = parseArgs(process.argv.slice(2));
} catch (error) {
  console.error(error.message);
  console.error(usage());
  process.exit(2);
}

if (options.help) {
  console.log(usage());
  process.exit(0);
}

if (!options.lane || !["activation", "behavior"].includes(options.lane)) {
  fail("--lane must be activation or behavior");
}
if (!options.model) {
  fail("--model is required so every plan and result has exact model provenance");
}
if (!supportedReasoningEfforts.has(options.reasoningEffort)) {
  fail("--reasoning-effort must be one of none, low, medium, high, xhigh, or max");
}
if (!Number.isInteger(options.timeoutSeconds) || options.timeoutSeconds < 30 || options.timeoutSeconds > 1800) {
  fail("--timeout-seconds must be an integer from 30 through 1800");
}
if (options.allowProviderHost && !/^[a-z0-9.-]+$/.test(options.allowProviderHost)) {
  fail("--allow-provider-host must be a hostname without a scheme, port, path, or wildcard");
}
if (options.execute && !options.output) {
  fail("--output is required with --execute; live artifacts must use a new isolated result directory");
}

const validator = spawnSync(process.execPath, [validatorPath, "--json"], {
  cwd: repoRoot,
  encoding: "utf8",
  maxBuffer: 10 * 1024 * 1024
});
if (validator.status !== 0) {
  fail(`Deterministic validation must pass before a live plan or run.\n${validator.stdout}${validator.stderr}`, 1);
}

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

function gitValue(args) {
  const result = spawnSync("git", args, { cwd: repoRoot, encoding: "utf8" });
  return result.status === 0 ? result.stdout.trim() : null;
}

function containedPath(root, requested, label) {
  const absolutePath = isAbsolute(requested) ? resolve(requested) : resolve(repoRoot, requested);
  const pathFromRoot = relative(root, absolutePath);
  if (!pathFromRoot || pathFromRoot.startsWith("..") || isAbsolute(pathFromRoot)) {
    fail(`${label} must be a descendant of ${relative(repoRoot, root)}`);
  }
  return absolutePath;
}

function walkJson(root) {
  const files = [];
  const visit = (directory) => {
    for (const entry of readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const path = resolve(directory, entry.name);
      if (entry.isDirectory()) {
        visit(path);
      } else if (entry.isFile() && entry.name.endsWith(".json")) {
        files.push(path);
      }
    }
  };
  visit(root);
  return files;
}

function hashBytes(value) {
  return createHash("sha256").update(value).digest("hex");
}

function hashFile(path) {
  return hashBytes(readFileSync(path));
}

function hashDirectory(root) {
  const files = [];
  const visit = (directory) => {
    for (const entry of readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const path = resolve(directory, entry.name);
      if (entry.isDirectory()) {
        visit(path);
      } else if (entry.isFile()) {
        files.push(path);
      }
    }
  };
  visit(root);
  const hash = createHash("sha256");
  for (const file of files) {
    hash.update(relative(root, file).replaceAll("\\", "/"));
    hash.update("\0");
    hash.update(readFileSync(file));
    hash.update("\0");
  }
  return hash.digest("hex");
}

function parseTomlString(raw, label) {
  if (raw.startsWith('"') && raw.endsWith('"')) {
    try {
      return JSON.parse(raw);
    } catch {
      fail(`${label} must use a simple quoted TOML string`);
    }
  }
  if (raw.startsWith("'") && raw.endsWith("'")) {
    return raw.slice(1, -1);
  }
  fail(`${label} must use a simple quoted TOML string`);
}

function extractProviderConfig(configHome) {
  const configPath = resolve(configHome, "config.toml");
  if (!existsSync(configPath)) {
    return {
      text: null,
      host: null,
      metadata: { source: "codex-default", providerId: null, configHash: null }
    };
  }
  const source = readFileSync(configPath, "utf8");
  const root = source.split(/\r?\n/).find((line) => /^\s*model_provider\s*=/.test(line));
  if (!root) {
    return {
      text: null,
      host: null,
      metadata: { source: "codex-default", providerId: null, configHash: null }
    };
  }
  const providerId = parseTomlString(root.replace(/^\s*model_provider\s*=\s*/, "").trim(), "model_provider");
  if (!/^[A-Za-z0-9_-]+$/.test(providerId)) {
    fail("The active model_provider ID cannot be represented safely in the temporary eval config");
  }
  const lines = source.split(/\r?\n/);
  const header = `[model_providers.${providerId}]`;
  const start = lines.findIndex((line) => line.trim() === header);
  if (start < 0) {
    fail(`Active provider section ${header} was not found`);
  }
  const stringKeys = new Set(["name", "base_url", "env_key", "wire_api"]);
  const booleanKeys = new Set(["requires_openai_auth"]);
  const values = new Map();
  for (let index = start + 1; index < lines.length; index += 1) {
    const line = lines[index].trim();
    if (line.startsWith("[")) {
      break;
    }
    const match = line.match(/^([A-Za-z0-9_]+)\s*=\s*(.+)$/);
    if (!match) {
      continue;
    }
    const [, key, raw] = match;
    if (stringKeys.has(key)) {
      values.set(key, JSON.stringify(parseTomlString(raw.trim(), `${header}.${key}`)));
    } else if (booleanKeys.has(key)) {
      if (!/^(true|false)$/.test(raw.trim())) {
        fail(`${header}.${key} must be a boolean`);
      }
      values.set(key, raw.trim());
    } else if (["experimental_bearer_token", "http_headers", "env_http_headers"].includes(key)) {
      fail(`${header}.${key} cannot be copied into an isolated eval home; use OpenAI auth or an environment-key provider`);
    }
  }
  const configLines = [`model_provider = ${JSON.stringify(providerId)}`, "", header];
  for (const key of ["name", "base_url", "env_key", "wire_api", "requires_openai_auth"]) {
    if (values.has(key)) {
      configLines.push(`${key} = ${values.get(key)}`);
    }
  }
  const text = `${configLines.join("\n")}\n`;
  const baseUrl = values.has("base_url") ? JSON.parse(values.get("base_url")) : null;
  let host = null;
  if (baseUrl) {
    try {
      const parsed = new URL(baseUrl);
      if (!["http:", "https:"].includes(parsed.protocol) || !parsed.hostname) {
        throw new Error("unsupported URL");
      }
      host = parsed.hostname.toLowerCase();
    } catch {
      fail(`${header}.base_url must be an absolute HTTP or HTTPS URL`);
    }
  }
  return {
    text,
    host,
    metadata: {
      source: "allowlisted-active-config",
      providerId,
      baseUrlHash: baseUrl ? hashBytes(baseUrl) : null,
      wireApi: values.has("wire_api") ? JSON.parse(values.get("wire_api")) : null,
      requiresOpenAIAuth: values.get("requires_openai_auth") === "true",
      credentialMode: values.has("env_key") ? "environment-key" : "openai-auth",
      configHash: hashBytes(text)
    }
  };
}

const discoveryRoot = resolve(repoRoot, manifest.discovery[options.lane].root);
const records = [];
for (const file of walkJson(discoveryRoot)) {
  const suite = JSON.parse(readFileSync(file, "utf8"));
  for (const item of suite.cases) {
    records.push({ case: item, suite: suite.suite, file });
  }
}

const allById = new Map(records.map((record) => [record.case.id, record]));
let selected;
if (options.caseIds.length > 0) {
  selected = options.caseIds.map((id) => {
    const record = allById.get(id);
    if (!record) {
      fail(`Unknown ${options.lane} case: ${id}`);
    }
    return record;
  });
} else {
  const statuses = options.includeCandidate ? new Set(["accepted", "candidate"]) : new Set(["accepted"]);
  selected = records.filter((record) => statuses.has(record.case.status));
}
if (selected.length === 0) {
  fail("No cases selected");
}

const configuredAuthHome = options.authHome
  ? resolve(options.authHome)
  : resolve(process.env.CODEX_HOME || join(homedir(), ".codex"));
const providerConfig = extractProviderConfig(configuredAuthHome);
const providerAuthorizationRequired = Boolean(providerConfig.host && providerConfig.host !== "api.openai.com");
const providerHostMatches = !providerAuthorizationRequired || options.allowProviderHost === providerConfig.host;
const skillDirectory = resolve(repoRoot, manifest.skill.directory);
const provenance = {
  runnerVersion,
  manifestSchemaVersion: manifest.schemaVersion,
  skillVersion: manifest.skill.version,
  model: options.model,
  reasoningEffort: options.reasoningEffort,
  timeoutSeconds: options.timeoutSeconds,
  sourceCommit: gitValue(["rev-parse", "HEAD"]),
  sourceDirty: Boolean(gitValue(["status", "--porcelain", "--untracked-files=all"])),
  provider: providerConfig.metadata,
  lane: options.lane,
  skillHash: hashDirectory(skillDirectory),
  manifestHash: hashFile(manifestPath),
  runnerHash: hashFile(fileURLToPath(import.meta.url))
};
const plan = {
  mode: options.execute ? "live" : "plan-only",
  networkOrModelCall: options.execute,
  provenance,
  cases: selected.map((record) => ({
    id: record.case.id,
    status: record.case.status,
    locale: record.case.locale,
    surface: record.case.surface,
    caseHash: hashBytes(JSON.stringify(record.case))
  })),
  isolation: {
    temporaryCodexHome: true,
    temporaryEmptyWorkspace: true,
    onlyStagedUserSkill: manifest.skill.name,
    userConfigMode: "temporary allowlisted provider-only config",
    userRulesIgnored: true,
    pluginLoadingDisabled: true,
    sandbox: "read-only",
    sessionPersistence: "ephemeral",
    authHandling: "temporary filesystem link; contents are not read or copied",
    userScopeInstall: false
  },
  providerAuthorization: {
    required: providerAuthorizationRequired,
    host: providerAuthorizationRequired ? providerConfig.host : null,
    exactMatchProvided: providerHostMatches
  }
};

if (!options.execute) {
  if (options.checkCli) {
    const invocation = resolveCodexInvocation();
    const check = spawnSync(invocation.command, [...invocation.prefixArgs, "--version"], { encoding: "utf8" });
    if (check.status !== 0) {
      fail(`Codex CLI check failed: ${check.stderr || check.error?.message || "unknown error"}`);
    }
    plan.cliCheck = {
      version: check.stdout.trim(),
      launcher: invocation.launcher,
      modelCall: false
    };
  }
  if (options.json) {
    console.log(JSON.stringify(plan, null, 2));
  } else {
    console.log(`PLAN ONLY: ${selected.length} ${options.lane} case(s) with model ${options.model}.`);
    console.log("No network request or model call was made. Add --execute and --output to authorize a live run.");
    selected.forEach((record) => console.log(`- ${record.case.id} (${record.case.status}, ${record.case.locale}, ${record.case.surface})`));
  }
  process.exit(0);
}

if (!providerHostMatches) {
  fail(`Live execution for the configured custom provider requires --allow-provider-host ${providerConfig.host}`);
}

const resultsRoot = resolve(repoRoot, manifest.resultsRoot, "live");
const outputDirectory = containedPath(resultsRoot, options.output, "--output");
if (existsSync(outputDirectory)) {
  fail(`Refusing to overwrite existing live result directory: ${relative(repoRoot, outputDirectory)}`);
}

const authFile = resolve(configuredAuthHome, "auth.json");
if (!existsSync(authFile) || !statSync(authFile).isFile()) {
  fail("Live execution requires auth.json in --auth-home (or the active Codex home). The runner will link it but never read or copy it.");
}

function resolveCodexInvocation() {
  if (process.platform !== "win32") {
    return { command: "codex", prefixArgs: [], launcher: "path-executable" };
  }
  const executableLookup = spawnSync("where.exe", ["codex.exe"], { encoding: "utf8" });
  const executable = executableLookup.status === 0
    ? executableLookup.stdout.split(/\r?\n/).map((line) => line.trim()).find(Boolean)
    : null;
  if (executable) {
    return { command: executable, prefixArgs: [], launcher: "windows-executable" };
  }
  const shimLookup = spawnSync("where.exe", ["codex.cmd"], { encoding: "utf8" });
  const shims = shimLookup.status === 0
    ? shimLookup.stdout.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
    : [];
  for (const shim of shims) {
    const entrypoint = resolve(dirname(shim), "node_modules", "@openai", "codex", "bin", "codex.js");
    if (existsSync(entrypoint)) {
      return {
        command: process.execPath,
        prefixArgs: [entrypoint],
        launcher: "windows-npm-entrypoint"
      };
    }
  }
  fail("Codex CLI is unavailable: no codex.exe or resolvable npm codex.cmd entrypoint was found");
}

const codexInvocation = resolveCodexInvocation();
const versionCheck = spawnSync(codexInvocation.command, [...codexInvocation.prefixArgs, "--version"], { encoding: "utf8" });
if (versionCheck.status !== 0) {
  fail(`Codex CLI is unavailable: ${versionCheck.stderr || versionCheck.error?.message || "unknown error"}`);
}
const codexVersion = versionCheck.stdout.trim();
mkdirSync(outputDirectory, { recursive: true });

const activationOutputSchema = {
  type: "object",
  additionalProperties: false,
  required: ["caseId", "decision", "selectedSkill", "reason"],
  properties: {
    caseId: { type: "string" },
    decision: { enum: ["use-skill", "no-skill", "review"] },
    selectedSkill: { enum: [manifest.skill.name, null] },
    reason: { type: "string" }
  }
};
const behaviorOutputSchema = {
  type: "object",
  additionalProperties: false,
  required: ["caseId", "copy", "notes"],
  properties: {
    caseId: { type: "string" },
    copy: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["role", "text"],
        properties: {
          role: { type: "string" },
          text: { type: "string", minLength: 1 }
        }
      }
    },
    notes: { type: "string" }
  }
};

function activationPrompt(record) {
  return [
    `This is an isolated activation evaluation for the candidate skill ${manifest.skill.name}. Do not run tools or modify files.`,
    `Use normal skill discovery to decide whether ${manifest.skill.name} applies. Ignore whether a different skill might also apply.`,
    `Use decision=\"use-skill\" and selectedSkill=\"${manifest.skill.name}\" when it should activate.`,
    "Use decision=\"no-skill\" and selectedSkill=null when it should not activate.",
    "Use decision=\"review\" and selectedSkill=null when activation depends on missing product or audience context.",
    "Do not select the candidate merely because this prompt asks you to evaluate it.",
    "Return only the required JSON object.",
    "",
    JSON.stringify({
      caseId: record.case.id,
      locale: record.case.locale,
      request: record.case.request,
      context: record.case.context
    }, null, 2)
  ].join("\n");
}

function behaviorPrompt(record) {
  const item = record.case;
  return [
    "Use $speak-human to rewrite only the supplied rendered interface copy.",
    "Do not run tools, modify files, invent product behavior, or provide a preferred implementation.",
    "Use only roles present in inputCopy. Do not add a role, change a role or control type, or return more fragments for a role than were supplied.",
    "Return one rewritten fragment for every supplied non-action role; removing internal language must not drop a verified fact, state, permission, or limitation.",
    "For a supplied button, link, or action role, keep that same role and replace vague text with the applicable supplied available-action label.",
    "A vague original label does not make the control unsupported. Omit the action role only when no applicable supplied action exists; name omissions in notes.",
    "Return only the required JSON object.",
    "",
    JSON.stringify({
      caseId: item.id,
      locale: item.locale,
      surface: item.surface,
      context: item.context,
      inputCopy: item.inputCopy,
      approvedCopy: item.approvedCopy,
      verifiedFacts: item.verifiedFacts,
      availableActions: item.availableActions,
      permissionState: item.permissionState,
      layoutConstraints: item.layoutConstraints
    }, null, 2)
  ].join("\n");
}

function redact(text) {
  return text
    .replace(/sk-[A-Za-z0-9_-]{16,}/g, "[REDACTED_OPENAI_KEY]")
    .replace(/("(?:access_token|refresh_token|id_token)"\s*:\s*")[^"]+("?)/gi, "$1[REDACTED_TOKEN]$2");
}

function linkAuth(source, target) {
  try {
    symlinkSync(source, target, "file");
    return "symbolic-link";
  } catch (symbolicLinkError) {
    try {
      linkSync(source, target);
      return "hard-link";
    } catch (hardLinkError) {
      throw new Error(`Could not create a non-copying auth link: ${hardLinkError.message}; symbolic-link attempt: ${symbolicLinkError.message}`);
    }
  }
}

function parseModelOutput(path, caseId) {
  if (!existsSync(path)) {
    throw new Error("Codex did not write the final response file");
  }
  const value = JSON.parse(readFileSync(path, "utf8"));
  if (value.caseId !== caseId) {
    throw new Error(`Output caseId ${value.caseId ?? "<missing>"} does not match ${caseId}`);
  }
  return value;
}

function activationAssessment(item, output) {
  const selectedSpeakHuman = output.selectedSkill === manifest.skill.name;
  if (item.expectedActivation === "yes") {
    return {
      pass: output.decision === "use-skill" && selectedSpeakHuman,
      expected: "use-skill:speak-human"
    };
  }
  if (item.expectedActivation === "no") {
    return {
      pass: output.decision === "no-skill" && !selectedSpeakHuman,
      expected: "no-skill"
    };
  }
  return {
    pass: null,
    expected: "contextual-boundary",
    reviewRequired: true,
    observedDecision: output.decision,
    observedSelectedSkill: output.selectedSkill
  };
}

function approvedCopyAssessment(item, output) {
  const outputFragments = output.copy ?? [];
  const inputRoleCounts = new Map();
  const outputRoleCounts = new Map();
  for (const fragment of item.inputCopy) {
    inputRoleCounts.set(fragment.role, (inputRoleCounts.get(fragment.role) ?? 0) + 1);
  }
  for (const fragment of outputFragments) {
    outputRoleCounts.set(fragment.role, (outputRoleCounts.get(fragment.role) ?? 0) + 1);
  }
  const missing = item.approvedCopy.filter((approved) => !outputFragments.some((fragment) => (
    fragment.role === approved.role && fragment.text.includes(approved.text)
  )));
  const blank = outputFragments
    .filter((fragment) => typeof fragment.text !== "string" || fragment.text.trim().length === 0)
    .map((fragment) => fragment.role);
  const unsupportedActions = item.availableActions.length === 0
    ? outputFragments
      .filter((fragment) => actionRoles.has(fragment.role.toLowerCase()))
      .map((fragment) => fragment.role)
    : [];
  const introducedRoles = [...outputRoleCounts.keys()].filter((role) => !inputRoleCounts.has(role));
  const excessiveRoles = [...outputRoleCounts.entries()]
    .filter(([role, count]) => count > (inputRoleCounts.get(role) ?? 0))
    .map(([role]) => role);
  const missingNonActionRoles = [...inputRoleCounts.entries()]
    .filter(([role, count]) => !actionRoles.has(role.toLowerCase()) && (outputRoleCounts.get(role) ?? 0) < count)
    .map(([role]) => role);
  const missingSupportedActionRoles = item.availableActions.length > 0
    ? [...inputRoleCounts.entries()]
      .filter(([role, count]) => actionRoles.has(role.toLowerCase()) && (outputRoleCounts.get(role) ?? 0) < count)
      .map(([role]) => role)
    : [];
  return {
    pass: missing.length === 0
      && blank.length === 0
      && unsupportedActions.length === 0
      && introducedRoles.length === 0
      && excessiveRoles.length === 0
      && missingNonActionRoles.length === 0
      && missingSupportedActionRoles.length === 0,
    missing,
    blank,
    unsupportedActions,
    introducedRoles,
    excessiveRoles,
    missingNonActionRoles,
    missingSupportedActionRoles,
    reviewRequired: true,
    note: "Verbatim approved-copy inclusion, blank-fragment, action-presence, and role-shape checks are automated; semantic rubric review remains required."
  };
}

const startedAt = new Date().toISOString();
const runResults = [];
const cleanupWarnings = [];
let temporaryCodexHome = null;
let temporaryWorkspace = null;

try {
  temporaryCodexHome = mkdtempSync(join(tmpdir(), "speak-human-codex-home-"));
  temporaryWorkspace = mkdtempSync(join(tmpdir(), "speak-human-workspace-"));
  mkdirSync(resolve(temporaryCodexHome, "skills"), { recursive: true });
  if (providerConfig.text) {
    writeFileSync(resolve(temporaryCodexHome, "config.toml"), providerConfig.text, "utf8");
  }
  cpSync(skillDirectory, resolve(temporaryCodexHome, "skills", manifest.skill.name), { recursive: true });
  const authLinkType = linkAuth(authFile, resolve(temporaryCodexHome, "auth.json"));

  for (const record of selected) {
    const caseDirectory = resolve(outputDirectory, record.case.id);
    mkdirSync(caseDirectory, { recursive: false });
    const prompt = options.lane === "activation" ? activationPrompt(record) : behaviorPrompt(record);
    const outputSchema = options.lane === "activation" ? activationOutputSchema : behaviorOutputSchema;
    const promptPath = resolve(caseDirectory, "prompt.txt");
    const schemaPath = resolve(caseDirectory, "output-schema.json");
    const responsePath = resolve(caseDirectory, "response.json");
    writeFileSync(promptPath, `${prompt}\n`, "utf8");
    writeFileSync(schemaPath, `${JSON.stringify(outputSchema, null, 2)}\n`, "utf8");

    const codexArgs = [
      "exec",
      "--ephemeral",
      "--ignore-rules",
      "--disable",
      "plugins",
      "--disable",
      "apps",
      "--disable",
      "remote_plugin",
      "--disable",
      "plugin_sharing",
      "--sandbox",
      "read-only",
      "--skip-git-repo-check",
      "--color",
      "never",
      "--json",
      "--model",
      options.model,
      "--config",
      `model_reasoning_effort=${JSON.stringify(options.reasoningEffort)}`,
      "--cd",
      temporaryWorkspace,
      "--output-schema",
      schemaPath,
      "--output-last-message",
      responsePath,
      "-"
    ];
    const invocationStartedAt = new Date().toISOString();
    const invocation = spawnSync(codexInvocation.command, [...codexInvocation.prefixArgs, ...codexArgs], {
      cwd: temporaryWorkspace,
      env: {
        ...process.env,
        CODEX_HOME: temporaryCodexHome
      },
      input: prompt,
      encoding: "utf8",
      maxBuffer: 20 * 1024 * 1024,
      timeout: options.timeoutSeconds * 1000
    });
    writeFileSync(resolve(caseDirectory, "events.jsonl"), redact(invocation.stdout || ""), "utf8");
    writeFileSync(resolve(caseDirectory, "stderr.log"), redact(invocation.stderr || ""), "utf8");

    const result = {
      caseId: record.case.id,
      caseStatus: record.case.status,
      caseHash: hashBytes(JSON.stringify(record.case)),
      suiteFileHash: hashFile(record.file),
      startedAt: invocationStartedAt,
      finishedAt: new Date().toISOString(),
      exitCode: invocation.status,
      signal: invocation.signal,
      authLinkType,
      output: null,
      assessment: null,
      error: null
    };
    try {
      if (invocation.error?.code === "ETIMEDOUT") {
        throw new Error(`Codex exceeded the ${options.timeoutSeconds}-second per-case timeout`);
      }
      if (invocation.error) {
        throw new Error(`Codex invocation failed: ${invocation.error.message}`);
      }
      if (invocation.status !== 0) {
        throw new Error(`Codex exited with status ${invocation.status ?? "unknown"}`);
      }
      result.output = parseModelOutput(responsePath, record.case.id);
      result.assessment = options.lane === "activation"
        ? activationAssessment(record.case, result.output)
        : approvedCopyAssessment(record.case, result.output);
    } catch (error) {
      result.error = error.message;
    }
    writeFileSync(resolve(caseDirectory, "result.json"), `${JSON.stringify(result, null, 2)}\n`, "utf8");
    runResults.push(result);
  }
} finally {
  for (const temporaryPath of [temporaryWorkspace, temporaryCodexHome]) {
    if (temporaryPath && dirname(temporaryPath) === resolve(tmpdir()) && basename(temporaryPath).startsWith("speak-human-")) {
      try {
        rmSync(temporaryPath, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
      } catch (error) {
        cleanupWarnings.push(`${basename(temporaryPath)}: ${error.code ?? error.message}`);
      }
    }
  }
}

const failedInvocations = runResults.filter((result) => result.error);
const failedAssessments = runResults.filter((result) => result.assessment?.pass === false);
const reviewRequiredResults = runResults.filter((result) => result.assessment?.reviewRequired === true);
const summary = {
  ...plan,
  codexVersion,
  codexLauncher: codexInvocation.launcher,
  startedAt,
  finishedAt: new Date().toISOString(),
  outputDirectory: relative(repoRoot, outputDirectory).replaceAll("\\", "/"),
  casesRun: runResults.length,
  invocationFailures: failedInvocations.length,
  assessmentFailures: failedAssessments.length,
  reviewRequiredCases: reviewRequiredResults.length,
  cleanupWarnings,
  gateStatus: failedInvocations.length > 0 || failedAssessments.length > 0
    ? "failed"
    : reviewRequiredResults.length > 0
      ? "review-required"
      : "passed",
  results: runResults
};
writeFileSync(resolve(outputDirectory, "summary.json"), `${JSON.stringify(summary, null, 2)}\n`, "utf8");

if (options.json) {
  console.log(JSON.stringify(summary, null, 2));
} else {
  console.log(`LIVE ${options.lane}: ${runResults.length} case(s); status=${summary.gateStatus}; artifacts=${summary.outputDirectory}`);
}
if (summary.gateStatus === "failed") {
  process.exitCode = 1;
}
