import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

function rmrf(targetPath) {
  try {
    if (!fs.existsSync(targetPath)) return;
    fs.rmSync(targetPath, { recursive: true, force: true, maxRetries: 3 });
  } catch {
    // If removal fails on Windows/OneDrive, fall back to best-effort.
    try {
      spawnSync('cmd', ['/c', 'rmdir', '/s', '/q', targetPath], { stdio: 'inherit' });
    } catch {}
  }
}

const cwd = process.cwd();
const nextDir = path.join(cwd, '.next');

// Prevent intermittent Windows/OneDrive build-clean issues.
rmrf(nextDir);
try {
  const buildIdPath = path.join(cwd, '.next-build-id');
  if (fs.existsSync(buildIdPath)) fs.rmSync(buildIdPath, { force: true });
} catch {}

const result = spawnSync(
  'node',
  ['node_modules/next/dist/bin/next', 'build', '--no-lint'],
  { stdio: 'inherit', cwd }
);

process.exit(result.status ?? 1);

