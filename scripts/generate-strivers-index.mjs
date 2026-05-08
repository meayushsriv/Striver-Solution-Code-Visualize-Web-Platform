import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const striversDir = path.join(root, "Strivers");
const outFile = path.join(root, "public", "strivers-index.json");

const languageByExtension = {
  ".cpp": "cpp",
  ".cc": "cpp",
  ".cxx": "cpp",
  ".java": "java",
  ".py": "python",
  ".sql": "sql",
  ".js": "javascript",
  ".ts": "typescript"
};

const difficultyHints = [
  { rx: /easy/i, value: "Easy" },
  { rx: /medium/i, value: "Medium" },
  { rx: /hard/i, value: "Hard" }
];

const topicKeywords = [
  "Arrays",
  "Graphs",
  "DP",
  "Trees",
  "Binary Search",
  "Greedy",
  "Stack",
  "Queue",
  "String",
  "Linked List",
  "Recursion",
  "Math"
];

function pickDifficulty(parts) {
  const joined = parts.join(" / ");
  for (const item of difficultyHints) {
    if (item.rx.test(joined)) return item.value;
  }
  return "Unknown";
}

function pickTopic(parts) {
  const joined = parts.join(" ").toLowerCase();
  const match = topicKeywords.find((topic) => joined.includes(topic.toLowerCase()));
  return match ?? "General";
}

function toTitle(fileName) {
  return fileName
    .replace(/\.[^.]+$/, "")
    .replace(/^\d+[\s._-]*/g, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function walk(dir, rel = "") {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name.startsWith(".git")) continue;
    const nextRel = path.join(rel, entry.name);
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(abs, nextRel)));
    } else {
      files.push({ abs, rel: nextRel });
    }
  }
  return files;
}

async function main() {
  await fs.mkdir(path.dirname(outFile), { recursive: true });
  const allFiles = await walk(striversDir);
  const problems = [];

  for (const file of allFiles) {
    const ext = path.extname(file.abs).toLowerCase();
    if (!languageByExtension[ext]) continue;
    const relFromStrivers = file.rel.split(path.sep).join("/");
    const pathParts = relFromStrivers.split("/");
    const fileName = pathParts[pathParts.length - 1];
    const folderParts = pathParts.slice(0, -1);
    const stat = await fs.stat(file.abs);
    const code = await fs.readFile(file.abs, "utf8");

    problems.push({
      id: relFromStrivers.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      title: toTitle(fileName),
      fileName,
      relativePath: relFromStrivers,
      language: languageByExtension[ext],
      topic: pickTopic(folderParts),
      difficulty: pickDifficulty(folderParts),
      tags: Array.from(new Set([pickTopic(folderParts), pickDifficulty(folderParts)])),
      statement: `Imported from local Strivers repository: ${relFromStrivers}`,
      approach:
        "Use dry run and visualization to inspect loops, recursion, and state transitions for this solution.",
      complexity: {
        time: "Analyze interactively",
        space: "Analyze interactively"
      },
      code,
      updatedAt: stat.mtime.toISOString()
    });
  }

  problems.sort((a, b) => a.title.localeCompare(b.title));

  await fs.writeFile(
    outFile,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        count: problems.length,
        problems
      },
      null,
      2
    ),
    "utf8"
  );

  process.stdout.write(`Generated ${problems.length} indexed solutions.\n`);
}

main().catch((error) => {
  process.stderr.write(`${error?.stack ?? error}\n`);
  process.exitCode = 1;
});
