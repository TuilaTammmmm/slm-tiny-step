#!/usr/bin/env node

/**
 * SLM Tiny Step Skill - Universal Installer (Node.js CLI)
 * Supports: npx github:TuilaTammmmm/slm-tiny-step
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
  console.log(cyan('               SLM TINY STEP SKILL INSTALLER            '));
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
  const ruleContent = `# @slm-tiny-step Anchor Rule
When the user mentions \`@slm-tiny-step\` or \`@atomic-coding\` or when working on tasks touching >=2 files or >30 lines:
- Strictly follow \`.agents/skills/slm-tiny-step/SKILL.md\`.
- Enforce the sharded \`.atomic/\` planning directory and 1 atomic micro-task per turn.
`;
  fs.writeFileSync(ruleFilePath, ruleContent, 'utf8');
  console.log(`   ${green('[+]')} Registered @slm-tiny-step trigger rule in: ${ruleFilePath}`);
}

async function promptScope() {
  const arg = process.argv[2]?.toLowerCase();
  if (arg === 'global' || arg === 'g') return 'Global';
  if (arg === 'folder' || arg === 'local' || arg === 'f' || arg === 'l') return 'Folder';

  console.log(yellow('  Select installation scope:\n'));
  console.log(white('  [1] Global - Entire system (Available to all projects with @slm-tiny-step)'));
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
    copySkillPackage(path.join(homeDir, '.gemini', 'config', 'skills', 'slm-tiny-step'));
    copySkillPackage(path.join(homeDir, '.gemini', 'config', '.agents', 'skills', 'slm-tiny-step'));

    // OpenCode Global
    copySkillPackage(path.join(homeDir, '.config', 'opencode', 'skills', 'slm-tiny-step'));
    copySkillPackage(path.join(homeDir, '.opencode', 'skills', 'slm-tiny-step'));

    // Claude Code & Codex Global
    copySkillPackage(path.join(homeDir, '.claude', 'skills', 'slm-tiny-step'));
    copySkillPackage(path.join(homeDir, '.codex', 'skills', 'slm-tiny-step'));

    // Global trigger rules for universal @ mention
    registerRule(path.join(homeDir, '.gemini', 'config', '.agents', 'rules', 'slm-tiny-step.md'));
    registerRule(path.join(homeDir, '.config', 'opencode', 'rules', 'slm-tiny-step.md'));
  } else {
    const cwd = process.cwd();
    console.log(yellow(`>> Installing in FOLDER mode (${cwd})...`));

    copySkillPackage(path.join(cwd, '.agents', 'skills', 'slm-tiny-step'));
    copySkillPackage(path.join(cwd, '.agent', 'skills', 'slm-tiny-step'));
    registerRule(path.join(cwd, '.agents', 'rules', 'slm-tiny-step.md'));
  }

  console.log('');
  console.log(cyan('   ====================================================='));
  console.log(green('   [OK] Installation completed successfully!'));
  console.log(white('   How to invoke: Type @slm-tiny-step in chat or say:'));
  console.log(yellow("   'Apply slm-tiny-step skill for this task'"));
  console.log(cyan('   ====================================================='));
  console.log('');
}

run().catch((err) => {
  console.error('Installation failed:', err);
  process.exit(1);
});
