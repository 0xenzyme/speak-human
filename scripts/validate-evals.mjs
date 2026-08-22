#!/usr/bin/env node

import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync
} from "node:fs";
import { dirname, isAbsolute, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = resolve(repoRoot, "evals/manifest.json");

function usage() {
  return [
    "Usage: node scripts/validate-evals.mjs [options]",
    "",
    "Options:",
    "  --json       Print the validation report as JSON.",
    "  --list       List discovered cases after validation.",
    "  --case ID    Include one case in the detailed report.",
    "  --help       Show this help message.",
    "",
    "This command is deterministic, dependency-free, and makes no network or model calls."
  ].join("\n");
}

function parseArgs(argv) {
  const options = { json: false, list: false, caseId: null, help: false };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--json") {
      options.json = true;
    } else if (arg === "--list") {
      options.list = true;
    } else if (arg === "--case") {
      options.caseId = argv[index + 1] ?? null;
      index += 1;
      if (!options.caseId) {
        throw new Error("--case requires a case ID");
      }
    } else if (arg === "--help" || arg === "-h") {
      options.help = true;
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }
  return options;
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

const errors = [];
const warnings = [];
const parsedJson = new Map();

function addError(message) {
  errors.push(message);
}

function repoPath(logicalPath, label) {
  if (typeof logicalPath !== "string" || logicalPath.length === 0) {
    addError(`${label} must be a non-empty repository-relative path`);
    return null;
  }
  const absolutePath = resolve(repoRoot, logicalPath);
  const relativePath = relative(repoRoot, absolutePath);
  if (relativePath.startsWith("..") || isAbsolute(relativePath)) {
    addError(`${label} escapes the repository: ${logicalPath}`);
    return null;
  }
  return absolutePath;
}

function readJson(absolutePath, label) {
  if (!absolutePath || !existsSync(absolutePath)) {
    addError(`${label} does not exist`);
    return null;
  }
  try {
    const text = readFileSync(absolutePath, "utf8");
    const value = JSON.parse(text);
    parsedJson.set(absolutePath, { text, value });
    return value;
  } catch (error) {
    addError(`${label} is not valid JSON: ${error.message}`);
    return null;
  }
}

function listJsonFiles(root) {
  if (!root || !existsSync(root)) {
    addError(`Case discovery root does not exist: ${root ?? "<invalid>"}`);
    return [];
  }
  if (!statSync(root).isDirectory()) {
    addError(`Case discovery root is not a directory: ${root}`);
    return [];
  }
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

function stableValue(value) {
  if (Array.isArray(value)) {
    return `[${value.map(stableValue).join(",")}]`;
  }
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableValue(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function isDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

function resolveLocalRef(schemaRoot, ref) {
  if (!ref.startsWith("#/")) {
    return null;
  }
  return ref.slice(2).split("/").reduce((current, part) => {
    const key = part.replaceAll("~1", "/").replaceAll("~0", "~");
    return current?.[key];
  }, schemaRoot);
}

function validateSchema(value, schema, path, schemaRoot, output) {
  if (!schema || typeof schema !== "object") {
    output.push(`${path}: invalid schema node`);
    return;
  }
  if (schema.$ref) {
    const target = resolveLocalRef(schemaRoot, schema.$ref);
    if (!target) {
      output.push(`${path}: unresolved schema reference ${schema.$ref}`);
      return;
    }
    validateSchema(value, target, path, schemaRoot, output);
    return;
  }
  if (Object.hasOwn(schema, "const") && stableValue(value) !== stableValue(schema.const)) {
    output.push(`${path}: must equal ${JSON.stringify(schema.const)}`);
  }
  if (schema.enum && !schema.enum.some((item) => stableValue(item) === stableValue(value))) {
    output.push(`${path}: must be one of ${schema.enum.map((item) => JSON.stringify(item)).join(", ")}`);
  }
  if (schema.type) {
    const typeMatches = schema.type === "array"
      ? Array.isArray(value)
      : schema.type === "object"
        ? value !== null && typeof value === "object" && !Array.isArray(value)
        : schema.type === "integer"
          ? Number.isInteger(value)
          : typeof value === schema.type;
    if (!typeMatches) {
      output.push(`${path}: must be ${schema.type}`);
      return;
    }
  }
  if (typeof value === "string") {
    if (schema.minLength !== undefined && value.length < schema.minLength) {
      output.push(`${path}: must contain at least ${schema.minLength} character(s)`);
    }
    if (schema.pattern && !(new RegExp(schema.pattern).test(value))) {
      output.push(`${path}: must match ${schema.pattern}`);
    }
    if (schema.format === "date" && !isDate(value)) {
      output.push(`${path}: must be a valid YYYY-MM-DD date`);
    }
  }
  if (Array.isArray(value)) {
    if (schema.minItems !== undefined && value.length < schema.minItems) {
      output.push(`${path}: must contain at least ${schema.minItems} item(s)`);
    }
    if (schema.uniqueItems) {
      const seen = new Set();
      for (const item of value) {
        const fingerprint = stableValue(item);
        if (seen.has(fingerprint)) {
          output.push(`${path}: must not contain duplicate items`);
          break;
        }
        seen.add(fingerprint);
      }
    }
    if (schema.items) {
      value.forEach((item, index) => validateSchema(item, schema.items, `${path}[${index}]`, schemaRoot, output));
    }
  }
  if (value !== null && typeof value === "object" && !Array.isArray(value)) {
    for (const required of schema.required ?? []) {
      if (!Object.hasOwn(value, required)) {
        output.push(`${path}: missing required property ${required}`);
      }
    }
    for (const [key, item] of Object.entries(value)) {
      if (schema.properties?.[key]) {
        validateSchema(item, schema.properties[key], `${path}.${key}`, schemaRoot, output);
      } else if (schema.additionalProperties === false) {
        output.push(`${path}: unknown property ${key}`);
      }
    }
  }
}

function normalizeText(value) {
  return typeof value === "string"
    ? value.normalize("NFKC").trim().replace(/\s+/gu, " ").toLocaleLowerCase("en-US")
    : "";
}

function caseFingerprint(record) {
  const item = record.case;
  if (record.kind === "activation") {
    return stableValue([
      item.locale,
      normalizeText(item.request),
      normalizeText(item.context)
    ]);
  }
  return stableValue([
    item.locale,
    normalizeText(item.context),
    Array.isArray(item.inputCopy)
      ? item.inputCopy.map((fragment) => [fragment?.role, normalizeText(fragment?.text)])
      : []
  ]);
}

function validateLifecycle(record) {
  const item = record.case;
  const label = item.id ?? `${relative(repoRoot, record.file)}[${record.index}]`;
  if (item.status === "accepted") {
    if (!item.acceptedAt) {
      addError(`${label}: accepted case requires acceptedAt`);
    }
    if (item.retiredAt || item.retirementReason || item.replacedBy) {
      addError(`${label}: accepted case cannot contain retirement fields`);
    }
  } else if (item.status === "candidate") {
    if (item.acceptedAt || item.retiredAt || item.retirementReason || item.replacedBy) {
      addError(`${label}: candidate case cannot contain acceptance or retirement fields`);
    }
  } else if (item.status === "retired") {
    if (!item.retiredAt || !item.retirementReason) {
      addError(`${label}: retired case requires retiredAt and retirementReason`);
    }
  }
  if (item.addedAt && item.acceptedAt && item.acceptedAt < item.addedAt) {
    addError(`${label}: acceptedAt cannot precede addedAt`);
  }
  if (item.addedAt && item.retiredAt && item.retiredAt < item.addedAt) {
    addError(`${label}: retiredAt cannot precede addedAt`);
  }
  if (item.acceptedAt && item.retiredAt && item.retiredAt < item.acceptedAt) {
    addError(`${label}: retiredAt cannot precede acceptedAt`);
  }
}

const manifest = readJson(manifestPath, "evals/manifest.json");
if (!manifest) {
  const report = {
    ok: false,
    schemaVersion: null,
    files: { caseFiles: 0, schemas: 0 },
    cases: { total: 0, byKind: {}, byLifecycle: {} },
    selectedCase: null,
    warnings,
    errors
  };
  if (options.json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.error("FAIL: evals/manifest.json could not be loaded.");
    errors.forEach((error) => console.error(`ERROR: ${error}`));
  }
  process.exit(1);
}

if (manifest.schemaVersion !== 1) {
  addError("manifest.schemaVersion must be 1");
}
if (typeof manifest.skill?.version !== "string"
  || !/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(manifest.skill.version)) {
  addError("manifest.skill.version must be a stable semantic version such as 0.1.0");
}
if (!manifest.discovery || typeof manifest.discovery !== "object") {
  addError("manifest.discovery must define case roots");
}
if (!manifest.lifecycle?.gatingStatuses?.includes("accepted")) {
  addError("manifest.lifecycle.gatingStatuses must include accepted");
}

const allRecords = [];
const caseFiles = [];
const schemas = {};

for (const kind of ["activation", "behavior"]) {
  const discovery = manifest.discovery?.[kind];
  if (!discovery) {
    addError(`manifest.discovery.${kind} is required`);
    continue;
  }
  const root = repoPath(discovery.root, `manifest.discovery.${kind}.root`);
  const schemaPath = repoPath(discovery.schema, `manifest.discovery.${kind}.schema`);
  const schema = readJson(schemaPath, `${kind} schema`);
  schemas[kind] = schema;
  const files = listJsonFiles(root);
  if (files.length === 0) {
    addError(`No ${kind} case files were discovered`);
  }
  for (const file of files) {
    caseFiles.push(file);
    const suite = readJson(file, relative(repoRoot, file));
    if (!suite || !schema) {
      continue;
    }
    const schemaErrors = [];
    validateSchema(suite, schema, relative(repoRoot, file), schema, schemaErrors);
    schemaErrors.forEach(addError);
    if (suite.kind !== kind) {
      addError(`${relative(repoRoot, file)}: kind must be ${kind}`);
    }
    if (suite.schemaVersion !== manifest.schemaVersion) {
      addError(`${relative(repoRoot, file)}: schemaVersion must match the manifest`);
    }
    if (Array.isArray(suite.cases)) {
      suite.cases.forEach((item, index) => {
        const record = { kind, suite: suite.suite, file, index, case: item };
        allRecords.push(record);
        validateLifecycle(record);
      });
    }
  }
}

const recordsById = new Map();
for (const record of allRecords) {
  const id = record.case.id;
  if (typeof id !== "string") {
    continue;
  }
  if (recordsById.has(id)) {
    addError(`${id}: duplicate case ID in ${relative(repoRoot, record.file)} and ${relative(repoRoot, recordsById.get(id).file)}`);
  } else {
    recordsById.set(id, record);
  }
}

for (const record of allRecords) {
  const item = record.case;
  if (typeof item.id !== "string") {
    continue;
  }
  const references = [
    ...(Array.isArray(item.supersedes) ? item.supersedes.map((id) => ["supersedes", id]) : []),
    ...(item.duplicateOf ? [["duplicateOf", item.duplicateOf]] : []),
    ...(item.replacedBy ? [["replacedBy", item.replacedBy]] : [])
  ];
  for (const [field, targetId] of references) {
    const target = recordsById.get(targetId);
    if (!target) {
      addError(`${item.id}: ${field} references missing case ${targetId}`);
    } else if (target.kind !== record.kind) {
      addError(`${item.id}: ${field} must reference another ${record.kind} case`);
    } else if (targetId === item.id) {
      addError(`${item.id}: ${field} cannot reference itself`);
    }
  }
  for (const targetId of Array.isArray(item.supersedes) ? item.supersedes : []) {
    const target = recordsById.get(targetId);
    if (target && target.case.status !== "retired") {
      addError(`${item.id}: superseded case ${targetId} must be retired`);
    }
  }
  if (item.replacedBy) {
    const replacement = recordsById.get(item.replacedBy);
    if (replacement && !(replacement.case.supersedes ?? []).includes(item.id)) {
      addError(`${item.id}: replacement ${item.replacedBy} must list this case in supersedes`);
    }
  }
}

const fingerprintGroups = new Map();
for (const record of allRecords) {
  if (!record.case.id || record.kind === "behavior" && !Array.isArray(record.case.inputCopy)) {
    continue;
  }
  const fingerprint = `${record.kind}:${caseFingerprint(record)}`;
  const group = fingerprintGroups.get(fingerprint) ?? [];
  group.push(record);
  fingerprintGroups.set(fingerprint, group);
}

for (const group of fingerprintGroups.values()) {
  if (group.length < 2) {
    continue;
  }
  const ids = new Set(group.map((record) => record.case.id));
  const canonical = group.filter((record) => !record.case.duplicateOf);
  if (canonical.length !== 1) {
    addError(`Duplicate case content must have exactly one canonical case: ${[...ids].join(", ")}`);
  }
  for (const record of group) {
    if (record.case.duplicateOf && !ids.has(record.case.duplicateOf)) {
      addError(`${record.case.id}: duplicateOf must point to the canonical case with identical content`);
    }
  }
}

for (const record of allRecords) {
  const duplicateId = record.case.duplicateOf;
  if (!duplicateId) {
    continue;
  }
  const target = recordsById.get(duplicateId);
  if (target && caseFingerprint(target) !== caseFingerprint(record)) {
    addError(`${record.case.id}: duplicateOf target ${duplicateId} does not have identical normalized input`);
  }
}

const lifecycleCounts = Object.fromEntries(["candidate", "accepted", "retired"].map((status) => [
  status,
  allRecords.filter((record) => record.case.status === status).length
]));
for (const status of manifest.lifecycle?.requiredRepresentedStatuses ?? []) {
  if (!lifecycleCounts[status]) {
    addError(`Lifecycle status ${status} has no registered case`);
  }
}

const gatingStatuses = new Set(manifest.lifecycle?.gatingStatuses ?? []);
const gating = allRecords.filter((record) => gatingStatuses.has(record.case.status));

function requireCoverage(kind, field, values) {
  for (const expected of values ?? []) {
    if (!gating.some((record) => record.kind === kind && record.case[field] === expected)) {
      addError(`Accepted ${kind} coverage is missing ${field}=${expected}`);
    }
  }
}

requireCoverage("activation", "locale", manifest.coverage?.activation?.locales);
requireCoverage("activation", "expectedActivation", manifest.coverage?.activation?.expectations);
requireCoverage("activation", "surface", manifest.coverage?.activation?.surfaces);
requireCoverage("behavior", "locale", manifest.coverage?.behavior?.locales);
requireCoverage("behavior", "surface", manifest.coverage?.behavior?.surfaces);

for (const family of manifest.coverage?.behavior?.localeFamilies ?? []) {
  for (const locale of family.locales ?? []) {
    const present = gating.some((record) => record.kind === "behavior"
      && record.case.locale === locale
      && family.surfaces?.includes(record.case.surface));
    if (!present) {
      addError(`Behavior family ${family.id} is missing accepted locale ${locale}`);
    }
  }
}

const requiredPaths = [
  [manifest.rubric, "manifest.rubric"],
  [manifest.skill?.versionFile, "manifest.skill.versionFile"],
  [manifest.skill?.directory, "manifest.skill.directory"],
  [manifest.skill?.entrypoint, "manifest.skill.entrypoint"],
  [manifest.skill?.metadata, "manifest.skill.metadata"],
  [manifest.resultsRoot, "manifest.resultsRoot"],
  ...Object.entries(manifest.runners ?? {}).map(([name, path]) => [path, `manifest.runners.${name}`])
];
for (const [logicalPath, label] of requiredPaths) {
  const absolutePath = repoPath(logicalPath, label);
  if (absolutePath && !existsSync(absolutePath)) {
    addError(`${label} does not exist: ${logicalPath}`);
  }
}

const versionFilePath = repoPath(manifest.skill?.versionFile, "manifest.skill.versionFile");
if (versionFilePath && existsSync(versionFilePath)) {
  const recordedVersion = readFileSync(versionFilePath, "utf8").trim();
  if (recordedVersion !== manifest.skill.version) {
    addError(`manifest.skill.versionFile must match manifest.skill.version (${manifest.skill.version})`);
  }
}

const entrypointPath = repoPath(manifest.skill?.entrypoint, "manifest.skill.entrypoint");
if (entrypointPath && existsSync(entrypointPath)) {
  const skillText = readFileSync(entrypointPath, "utf8");
  const frontmatter = skillText.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!frontmatter) {
    addError("Skill entrypoint must start with YAML frontmatter");
  } else {
    const name = frontmatter[1].match(/^name:\s*([^\r\n]+)$/m)?.[1]?.trim().replace(/^['"]|['"]$/g, "");
    const description = frontmatter[1].match(/^description:\s*([^\r\n]+)$/m)?.[1]?.trim();
    if (name !== manifest.skill.name) {
      addError(`Skill frontmatter name must be ${manifest.skill.name}`);
    }
    if (!description) {
      addError("Skill frontmatter description is required");
    }
  }
}

const metadataPath = repoPath(manifest.skill?.metadata, "manifest.skill.metadata");
if (metadataPath && existsSync(metadataPath)) {
  const metadataText = readFileSync(metadataPath, "utf8");
  if (!metadataText.includes(`$${manifest.skill.name}`)) {
    addError(`Skill metadata default prompt must reference $${manifest.skill.name}`);
  }
}

const textFiles = new Set([
  manifestPath,
  versionFilePath,
  ...caseFiles,
  ...Object.values(manifest.discovery ?? {}).map((item) => repoPath(item.schema, "schema path")).filter(Boolean),
  repoPath(manifest.rubric, "manifest.rubric"),
  entrypointPath,
  metadataPath,
  ...Object.entries(manifest.runners ?? {}).map(([name, path]) => repoPath(path, `manifest.runners.${name}`))
].filter(Boolean));

for (const file of textFiles) {
  if (!existsSync(file) || !statSync(file).isFile()) {
    continue;
  }
  const text = readFileSync(file, "utf8");
  const label = relative(repoRoot, file);
  if (text.charCodeAt(0) === 0xfeff) {
    addError(`${label}: UTF-8 BOM is not allowed`);
  }
  if (!text.endsWith("\n")) {
    addError(`${label}: file must end with a newline`);
  }
  if (/[ \t]+$/mu.test(text)) {
    addError(`${label}: trailing whitespace found`);
  }
}

for (const [file, parsed] of parsedJson) {
  const canonical = `${JSON.stringify(parsed.value, null, 2)}\n`;
  if (parsed.text.replaceAll("\r\n", "\n") !== canonical) {
    addError(`${relative(repoRoot, file)}: JSON must use two-space canonical formatting`);
  }
}

if (options.caseId && !recordsById.has(options.caseId)) {
  addError(`Requested case does not exist: ${options.caseId}`);
}

finish();

function finish() {
  const byKind = Object.fromEntries(["activation", "behavior"].map((kind) => [kind, {
    total: allRecords?.filter?.((record) => record.kind === kind).length ?? 0,
    accepted: allRecords?.filter?.((record) => record.kind === kind && record.case.status === "accepted").length ?? 0
  }]));
  const selected = options.caseId && recordsById?.get?.(options.caseId)
    ? recordsById.get(options.caseId)
    : null;
  const report = {
    ok: errors.length === 0,
    schemaVersion: manifest?.schemaVersion ?? null,
    files: {
      caseFiles: caseFiles?.length ?? 0,
      schemas: Object.values(schemas ?? {}).filter(Boolean).length
    },
    cases: {
      total: allRecords?.length ?? 0,
      byKind,
      byLifecycle: typeof lifecycleCounts === "undefined" ? {} : lifecycleCounts
    },
    selectedCase: selected ? {
      kind: selected.kind,
      suite: selected.suite,
      file: relative(repoRoot, selected.file),
      case: selected.case
    } : null,
    warnings,
    errors
  };

  if (options.json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    if (options.list && allRecords) {
      for (const record of [...allRecords].sort((a, b) => a.case.id.localeCompare(b.case.id))) {
        console.log(`${record.case.id}\t${record.kind}\t${record.case.status}\t${record.case.locale}\t${record.case.surface}`);
      }
    }
    const total = report.cases.total;
    console.log(`${report.ok ? "PASS" : "FAIL"}: ${total} cases in ${report.files.caseFiles} files; ${report.cases.byLifecycle.accepted ?? 0} accepted, ${report.cases.byLifecycle.candidate ?? 0} candidate, ${report.cases.byLifecycle.retired ?? 0} retired.`);
    for (const warning of warnings) {
      console.warn(`WARN: ${warning}`);
    }
    for (const error of errors) {
      console.error(`ERROR: ${error}`);
    }
  }
  if (!report.ok) {
    process.exitCode = 1;
  }
}
