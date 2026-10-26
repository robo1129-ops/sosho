import { readdir } from "node:fs/promises";
import { join, relative } from "node:path";
import { spawnSync } from "node:child_process";

const root = new URL("../", import.meta.url).pathname.replace(/^\/(\w):/, "$1:");
const extensions = new Set([".js", ".mjs", ".cjs"]);
const ignored = new Set(["node_modules", ".git"]);

async function collect(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (ignored.has(entry.name)) continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collect(path)));
    else if (extensions.has(path.slice(path.lastIndexOf(".")))) files.push(path);
  }
  return files;
}

const files = (await collect(root)).sort();
let failed = false;
for (const file of files) {
  const result = spawnSync(process.execPath, ["--check", file], { encoding: "utf8" });
  if (result.status !== 0) {
    failed = true;
    process.stderr.write(`Syntax error: ${relative(root, file)}\n`);
    process.stderr.write(result.stderr);
  }
}

if (failed) process.exit(1);
console.log(`JavaScript syntax OK: ${files.length} files`);
