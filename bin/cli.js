#!/usr/bin/env node

/**
 * Atomic Coding Skill - Universal Installer (Node.js CLI)
 * Supports: npx atomic-coding, pnpm dlx atomic-coding, bunx atomic-coding
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = path.resolve(__dirname, '..');

// Terminal ANSI colors
const cyan = (text) => `\x1b[36m${text}\x1b[0m`;
const yellow = (text) => `\x1b[33m${text}\x1b[0m`;
const green = (text) => `\x1b[32m${text}\x1b[0m`;
const white = (text) => `\x1b[37m${text}\x1b[0m`;
const darkCyan = (text) => `\x1b[34m${text}\x1b[0m`;

function printBanner() {
  console.log('');
  console.log(cyan('   ====================================================='));
  console.log(cyan('                ATOMIC CODING SKILL INSTALLER           '));
  console.log(darkCyan('        Deterministic Planning & Micro-Step Memory      '));
  console.log(cyan('   ====================================================='));
  console.log('');
}

function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function copySkillPackage(destDir) {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  // Copy SKILL.md
  fs.copyFileSync(path.join(packageRoot, 'SKILL.md'), path.join(destDir, 'SKILL.md'));

  // Copy subdirectories
  for (const sub of ['resources', 'references', 'examples']) {
    const srcSub = path.join(packageRoot, sub);
    if (fs.existsSync(srcSub)) {
      copyDirectory(srcSub, path.join(destDir, sub));
    }
  }
  console.log(`   ${green('[+]')} Skill installed to: ${destDir}`);
}

function registerRule(ruleFilePath) {
  const ruleDir = path.dirname(ruleFilePath);
  if (!fs.existsSync(ruleDir)) {
    fs.mkdirSync(ruleDir, { recursive: true });
  }
  const ruleContent = `# @atomic-coding Anchor Rule
When the user mentions \`@atomic-coding\` or when working on tasks touching >=2 files or >30 lines:
- Strictly follow \`.agents/skills/atomic-coding/SKILL.md\`.
- Enforce the sharded \`.atomic/\` planning directory and 1 atomic micro-task per turn.
`;
  fs.writeFileSync(ruleFilePath, ruleContent, 'utf8');
  console.log(`   ${green('[+]')} Registered @atomic-coding trigger rule in: ${ruleFilePath}`);
}

async function promptScope() {
  const arg = process.argv[2]?.toLowerCase();
  if (arg === 'global' || arg === 'g') return 'Global';
  if (arg === 'folder' || arg === 'local' || arg === 'f' || arg === 'l') return 'Folder';

  console.log(yellow('  Select installation scope:\n'));
  console.log(white('  [1] Global - Entire system (Available to all projects with @atomic-coding)'));
  console.log(white('  [2] Folder - Current directory (Installs .agents/skills for this project)\n'));

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question('  Enter choice [1/2] (Default: 1): ', (answer) => {
      rl.close();
      const trimmed = answer.trim();
      if (trimmed === '2') {
        resolve('Folder');
      } else {
        resolve('Global');
      }
    });
  });
}

async function run() {
  printBanner();
  const scope = await promptScope();
  const homeDir = os.homedir();

  console.log('');
  if (scope === 'Global') {
    console.log(yellow('>> Installing in GLOBAL mode (Entire system)...'));

    // Antigravity Global
    copySkillPackage(path.join(homeDir, '.gemini', 'config', 'skills', 'atomic-coding'));
    copySkillPackage(path.join(homeDir, '.gemini', 'config', '.agents', 'skills', 'atomic-coding'));

    // OpenCode Global
    copySkillPackage(path.join(homeDir, '.config', 'opencode', 'skills', 'atomic-coding'));
    copySkillPackage(path.join(homeDir, '.opencode', 'skills', 'atomic-coding'));

    // Claude Code & Codex Global
    copySkillPackage(path.join(homeDir, '.claude', 'skills', 'atomic-coding'));
    copySkillPackage(path.join(homeDir, '.codex', 'skills', 'atomic-coding'));

    // Global trigger rules for universal @ mention
    registerRule(path.join(homeDir, '.gemini', 'config', '.agents', 'rules', 'atomic-coding.md'));
    registerRule(path.join(homeDir, '.config', 'opencode', 'rules', 'atomic-coding.md'));
  } else {
    const cwd = process.cwd();
    console.log(yellow(`>> Installing in FOLDER mode (${cwd})...`));

    copySkillPackage(path.join(cwd, '.agents', 'skills', 'atomic-coding'));
    copySkillPackage(path.join(cwd, '.agent', 'skills', 'atomic-coding'));
    registerRule(path.join(cwd, '.agents', 'rules', 'atomic-coding.md'));
  }

  console.log('');
  console.log(cyan('   ====================================================='));
  console.log(green('   [OK] Installation completed successfully!'));
  console.log(white('   How to invoke: Type @atomic-coding in chat or say:'));
  console.log(yellow("   'Apply atomic-coding skill for this task'"));
  console.log(cyan('   ====================================================='));
  console.log('');
}

run().catch((err) => {
  console.error('Installation failed:', err);
  process.exit(1);
});
