import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  buildKnowledgeBase,
  getModelsToTry,
  sanitizeModelError,
} from "./chat-helpers.mjs";

test("getModelsToTry prefers hosted Gemma and skips Pro fallback", () => {
  assert.deepEqual(getModelsToTry({}), [
    "gemma-4-31b-it",
    "gemini-2.5-flash",
    "gemini-2.0-flash-lite",
  ]);
});

test("buildKnowledgeBase default budget stays below Gemma free-tier TPM headroom", () => {
  assert.ok(buildKnowledgeBase.defaultMaxChars <= 12000);
});

test("getModelsToTry honors a comma-separated env override", () => {
  assert.deepEqual(
    getModelsToTry({ GEMINI_MODELS: "gemini-2.0-flash, gemini-2.5-flash-lite" }),
    ["gemini-2.0-flash", "gemini-2.5-flash-lite"]
  );
});

test("buildKnowledgeBase selects relevant files and respects the character budget", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-kb-"));
  const knowledgeDir = path.join(root, "knowledge");
  fs.mkdirSync(knowledgeDir);
  fs.writeFileSync(path.join(knowledgeDir, "bio.md"), "Ayush bio and founder background.");
  fs.writeFileSync(path.join(knowledgeDir, "GradeSense Story.md"), "GradeSense founder story ".repeat(50));
  fs.writeFileSync(path.join(knowledgeDir, "Unrelated.md"), "unrelated gaming memo ".repeat(50));

  const kb = buildKnowledgeBase({
    apiDir: root,
    query: "What is the GradeSense founder story?",
    maxChars: 450,
  });

  assert.match(kb, /bio\.md/);
  assert.match(kb, /GradeSense Story\.md/);
  assert.doesNotMatch(kb, /Unrelated\.md/);
  assert.ok(kb.length <= 450);
});

test("sanitizeModelError keeps quota signal without leaking full provider payload", () => {
  const message = "[GoogleGenerativeAI Error]: Error fetching from url: [429 Too Many Requests] You exceeded your current quota. token_count detail";
  assert.equal(sanitizeModelError({ message }), "429 Too Many Requests: Gemini quota exceeded.");
});
