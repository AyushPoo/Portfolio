import fs from "node:fs";
import path from "node:path";

const DEFAULT_MODELS = [
  "gemma-4-31b-it",
  "gemini-2.5-flash",
  "gemini-2.0-flash-lite",
];

const ALWAYS_INCLUDE = new Set(["bio.md", "resume.md", "projects.md"]);
const COMMON_WORDS = new Set([
  "about",
  "anything",
  "build",
  "from",
  "have",
  "keep",
  "long",
  "more",
  "product",
  "query",
  "should",
  "skip",
  "tell",
  "that",
  "this",
  "under",
  "want",
  "what",
  "with",
  "words",
  "your",
]);

export function getModelsToTry(env = process.env) {
  if (env.GEMINI_MODELS) {
    return env.GEMINI_MODELS
      .split(",")
      .map((model) => model.trim())
      .filter(Boolean);
  }

  if (env.GEMINI_MODEL) {
    return [env.GEMINI_MODEL.trim()].filter(Boolean);
  }

  return DEFAULT_MODELS;
}

export function buildKnowledgeBase({
  apiDir,
  query = "",
  maxChars = Number(process.env.KNOWLEDGE_MAX_CHARS || buildKnowledgeBase.defaultMaxChars),
}) {
  const knowledgeDir = path.join(apiDir, "knowledge");
  const files = [];

  const legacyBioPath = path.join(apiDir, "bio.md");
  if (fs.existsSync(legacyBioPath)) {
    files.push({ name: "bio.md", content: fs.readFileSync(legacyBioPath, "utf8") });
  }

  if (fs.existsSync(knowledgeDir)) {
    for (const file of fs.readdirSync(knowledgeDir)) {
      if (file.endsWith(".md")) {
        const filePath = path.join(knowledgeDir, file);
        files.push({ name: file, content: fs.readFileSync(filePath, "utf8") });
      }
    }
  }

  if (files.length === 0) {
    return "Ayush is a versatile professional.";
  }

  const queryTerms = tokenize(query);
  const ranked = files
    .map((file) => ({ ...file, score: scoreFile(file, queryTerms) }))
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));

  let output = "";
  for (const file of ranked) {
    if (file.score <= 0 && output.length > 0) {
      continue;
    }

    const header = `--- FILE: ${file.name} ---\n`;
    const remaining = maxChars - output.length - header.length - 2;
    if (remaining <= 0) {
      break;
    }

    output += `${header}${file.content.slice(0, remaining)}\n\n`;
  }

  return output.trim() || "Ayush is a versatile professional.";
}

export function sanitizeModelError(error) {
  const message = error?.message || String(error);

  if (message.includes("429") || /quota|rate limit/i.test(message)) {
    return "429 Too Many Requests: Gemini quota exceeded.";
  }

  if (message.includes("404") || /not found|not supported/i.test(message)) {
    return "Model unavailable or not supported by this API key.";
  }

  if (/api key|permission|unauthenticated/i.test(message)) {
    return "Gemini API key is missing, invalid, or lacks permission.";
  }

  return message.split("\n")[0].slice(0, 220);
}

function scoreFile(file, queryTerms) {
  const lowerName = file.name.toLowerCase();
  if (ALWAYS_INCLUDE.has(lowerName)) {
    return 100;
  }

  const haystack = `${file.name}\n${file.content.slice(0, 5000)}`.toLowerCase();
  return queryTerms.reduce((score, term) => {
    const nameBoost = lowerName.includes(term) ? 12 : 0;
    const contentBoost = haystack.includes(term) ? 2 : 0;
    return score + nameBoost + contentBoost;
  }, 0);
}

function tokenize(value) {
  const matches = value.toLowerCase().match(/[a-z0-9]{3,}/g) || [];
  return [...new Set(matches.filter((word) => !COMMON_WORDS.has(word)))];
}

buildKnowledgeBase.defaultMaxChars = 12000;
