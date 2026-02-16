#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const sceneDir = path.resolve('src/scene/scenes');

if (!fs.existsSync(sceneDir)) {
  console.error(`Scene directory not found: ${sceneDir}`);
  process.exit(1);
}

const sceneFiles = fs
  .readdirSync(sceneDir)
  .filter((file) => file.endsWith('.js'))
  .map((file) => path.join(sceneDir, file));

const importRegex = /^\s*import\s+(?:[^'";]+?\s+from\s+)?['"]([^'"]+)['"]/;
const missingImports = [];

function resolveImportCandidates(filePath, specifier) {
  const importPath = path.resolve(path.dirname(filePath), specifier);

  if (path.extname(importPath)) {
    return [importPath];
  }

  return [
    `${importPath}.js`,
    `${importPath}.mjs`,
    `${importPath}.cjs`,
    path.join(importPath, 'index.js')
  ];
}

for (const filePath of sceneFiles) {
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);

  lines.forEach((line, index) => {
    const match = line.match(importRegex);

    if (!match) {
      return;
    }

    const specifier = match[1];

    if (!specifier.startsWith('.')) {
      return;
    }

    const candidates = resolveImportCandidates(filePath, specifier);
    const resolved = candidates.some((candidate) => fs.existsSync(candidate));

    if (!resolved) {
      missingImports.push({
        filePath: path.relative(process.cwd(), filePath),
        line: index + 1,
        specifier
      });
    }
  });
}

if (missingImports.length > 0) {
  console.error('Missing relative imports detected in scene files:');
  for (const entry of missingImports) {
    console.error(`- ${entry.filePath}:${entry.line} -> ${entry.specifier}`);
  }
  process.exit(1);
}

console.log(`Scene import check passed for ${sceneFiles.length} files.`);
