# Atomic Coding Skill ⚛️

[English](README.md) | [Tiếng Việt](README.vi.md)

> **Deterministic Planning, Context Sharding & Micro-Step Memory for AI Agents (Optimized for SLMs like LFM-3, OpenCode, Codex, Antigravity, Claude Code, Cursor).**

When coding with Small Language Models (SLMs) such as **LFM-3**, agents often experience **context drift**, **forgetting previous steps**, or **generating truncated/broken code**. `atomic-coding` eliminates this problem through strict, deterministic protocols:

1. **No Code Without Plan:** Enforces planning before writing code if a task touches $\ge 2$ files or $>30$ LOC.
2. **Context Sharding:** Keeps plans partitioned across lightweight physical markdown files (`.atomic/00_roadmap.md`, `01_phase.md`), keeping active context footprint $<300$ tokens at all times.
3. **One Step Per Turn:** Confines each agent turn to **exactly one** micro-task ($\le 30-40$ LOC), anchoring state via a 3-point cursor.

---

## ⚡ 1-Line Universal Installation

Run directly in your terminal using `npx`, `pnpm`, or `bun` (works out of the box on Windows, macOS, and Linux):

```bash
# Using npx directly from GitHub (No clone needed):
npx github:TuilaTammmmm/slm-tiny-step

# Or if published to npm registry:
npx atomic-coding

---

## 🖥️ Interactive Terminal Selection

Upon running `npx atomic-coding`, an interactive menu appears in your terminal:

```text
   =====================================================
                ATOMIC CODING SKILL INSTALLER           
        Deterministic Planning & Micro-Step Memory      
   =====================================================

  Select installation scope:

  [1] Global - Entire system (Available to all projects with @atomic-coding)
  [2] Folder - Current directory (Installs .agents/skills for this project)

  Enter choice [1/2] (Default: 1): 
```

- **[1] Global:** Installs into system config directories (`~/.gemini`, `~/.config/opencode`, `~/.claude`, `~/.codex`). Every project on your machine can invoke `@atomic-coding`.
- **[2] Folder:** Installs into the current directory (`.agents/skills/atomic-coding` and `.agents/rules/`). Perfect for committing to Git to share with your team.

*(You can bypass the prompt with flags: `npx atomic-coding global` or `npx atomic-coding folder`)*

---

## 🎯 How to Invoke `@atomic-coding`

Once installed (Global or Folder), invoke the agent using any of the following methods:

1. **Direct `@` mention in chat:**
   > *"@atomic-coding refactor the user authentication flow"*

2. **Natural instruction:**
   > *"Apply atomic-coding skill to implement the file upload feature"*

---

## 🔄 How the Agent Executes Tasks

```
[User Request]
       │
       ▼
[Check .atomic/ Directory]
       │
       ├─► Not Found ──► Step 1: Create .atomic/00_roadmap.md (Top-level milestones only)
       │
       └─► Found ─────► Step 2: Open active phase file (e.g. .atomic/01_auth.md)
                                │
                                ▼
                        Step 3: Execute EXACTLY 1 micro-task ([>])
                                - Emit [ATOMIC STATE] 3-point anchor
                                - Write code (<= 30-40 LOC)
                                - Tick [x] on disk
                                │
                                ▼
                        Step 4: When all tasks in phase are [x]:
                                - Mark phase [x] in 00_roadmap.md
                                - Advance [>] to next phase
```

---

## 📂 Repository Structure

```text
atomic-coding/
├── package.json              # npm package definition
├── bin/
│   └── cli.js                # Universal Node.js installer (Zero external deps)
├── SKILL.md                  # Core skill instructions & state machine rules
├── resources/                # Production templates (roadmap, phase, 3-point cursor)
├── references/               # Technical specs & decision heuristics
├── examples/                 # End-to-end JWT auth walkthrough
├── README.md                 # English documentation
└── README.vi.md              # Vietnamese documentation
```
