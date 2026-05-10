#!/usr/bin/env node
// Validate product-hunt/launch.yml against product-hunt/spec.yml.
// Exits 1 on any hard-rule violation, 0 otherwise (soft warnings still print).

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import yaml from "js-yaml";

const dir = path.dirname(fileURLToPath(import.meta.url));
const specPath = path.join(dir, "spec.yml");
const launchPath = path.join(dir, "launch.yml");

const spec = yaml.load(readFileSync(specPath, "utf8"));
const launch = yaml.load(readFileSync(launchPath, "utf8"));

const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const GREEN = "\x1b[32m";
const DIM = "\x1b[2m";
const RESET = "\x1b[0m";

let hardErrors = 0;
let softWarnings = 0;

function countWords(s) {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

function report(level, field, msg) {
  if (level === "error") {
    console.log(`${RED}✗ ${field}${RESET} ${msg}`);
    hardErrors++;
  } else if (level === "warn") {
    console.log(`${YELLOW}! ${field}${RESET} ${msg}`);
    softWarnings++;
  } else {
    console.log(`${GREEN}✓ ${field}${RESET} ${DIM}${msg}${RESET}`);
  }
}

for (const [field, rules] of Object.entries(spec.fields)) {
  const value = launch[field];
  const isHard = rules.type === "hard";
  const fail = isHard ? "error" : "warn";

  if (value === undefined || value === null || value === "") {
    report(fail, field, `is missing`);
    continue;
  }

  if (rules.max_items !== undefined) {
    if (!Array.isArray(value)) {
      report(fail, field, `must be a list`);
      continue;
    }
    if (value.length > rules.max_items) {
      report(fail, field, `${value.length} items > max ${rules.max_items}`);
    } else {
      report("ok", field, `${value.length}/${rules.max_items} items`);
    }
    continue;
  }

  if (typeof value !== "string") {
    report(fail, field, `must be a string`);
    continue;
  }

  const text = value.trim();

  if (rules.max_chars !== undefined) {
    if (text.length > rules.max_chars) {
      report(
        fail,
        field,
        `${text.length} chars > max ${rules.max_chars}`
      );
    } else {
      report(
        "ok",
        field,
        `${text.length}/${rules.max_chars} chars`
      );
    }
  }

  if (rules.min_words !== undefined || rules.max_words !== undefined) {
    const w = countWords(text);
    const min = rules.min_words ?? 0;
    const max = rules.max_words ?? Infinity;
    if (w < min) {
      report(fail, field, `${w} words < min ${min}`);
    } else if (w > max) {
      report(fail, field, `${w} words > max ${max}`);
    } else {
      report(
        "ok",
        field,
        `${w} words (target ${min}-${max})`
      );
    }
  }
}

console.log("");
if (hardErrors > 0) {
  console.log(
    `${RED}FAIL${RESET}: ${hardErrors} hard error(s), ${softWarnings} soft warning(s)`
  );
  process.exit(1);
}
console.log(
  `${GREEN}PASS${RESET}: ${softWarnings} soft warning(s)`
);
