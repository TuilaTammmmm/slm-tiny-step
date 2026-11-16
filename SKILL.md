---
name: atomic-coding
description: >-
  Enforces strict phase-based planning, context sharding, and ultra-small atomic task decomposition for coding tasks.
  Use whenever a coding task touches 2+ files, exceeds 30 lines of code, involves multi-step architecture/refactoring,
  or when running on small language models (SLMs like LFM-3) that require state-anchored execution via .atomic/ directory.
---

# Atomic Coding: Sharded Planning & Micro-Step Execution

A deterministic, token-efficient skill designed to eliminate context drift, hallucination, and incomplete code generation—especially for Small Language Models (SLMs like LFM-3) and multi-turn agent sessions.

---

## 🛑 The 3 Non-Negotiable Laws

1. **NO CODE WITHOUT A PLAN (`NO_CODE_WITHOUT_PLAN`):**
   * Never output code directly upon receiving a task that changes $> 30$ lines of code or touches $\ge 2$ files.
   * You must establish or read the `.atomic/` planning directory first.

2. **CONTEXT SHARDING OVER DISK (`DISK_BACKED_MEMORY`):**
   * Never store large task plans in chat history.
   * Plans must be sharded across separate Markdown files on disk under `.atomic/`:
     - `00_roadmap.md`: High-level master roadmap (5–7 phases max).
     - `0X_<phase_name>.md`: Granular phase file containing only 3–5 micro-tasks for the active phase.

3. **SINGLE ATOMIC STEP PER TURN (`ONE_STEP_PER_TURN`):**
   * Each AI turn must perform **exactly one** micro-task marked with `[>]`.
   * A single micro-task must not exceed 30–40 lines of code change or 1 cohesive logical operation.
   * Update the task state (`[>]` $\rightarrow$ `[x]`) on disk immediately after execution.

---

## ⚡ Quantitative Triggers: When to do What

| Trigger Condition | Action Required | Tool / File Operation |
| :--- | :--- | :--- |
| **New complex task & `.atomic/` does not exist** | Create Master Roadmap | Write `.atomic/00_roadmap.md` |
| **Current phase has no detail file yet** | Create Phase Detail File | Write `.atomic/0X_<phase>.md` (Max 3-5 items) |
| **Current phase file has pending `[ ]` tasks** | Execute next task `[>]` | `read_file` phase file $\rightarrow$ execute code $\rightarrow$ `edit_file` tick `[x]` |
| **All tasks in current phase are `[x]`** | Close phase & advance | Mark `[x]` in `00_roadmap.md`, set `[>]` to next phase |
| **User asks a simple question or 1-line typo fix** | Direct answer (Bypass) | No `.atomic/` needed |

---

## 🔄 The 4-Step Operational Protocol

### Step 1: Initialize Roadmap (`00_roadmap.md`)
When starting a multi-step task, create `.atomic/00_roadmap.md`:
* List only the top-level architectural milestones (Phases 1 to N, max 7).
* Do NOT write implementation details or full code in the roadmap.
* Mark the first phase as active: `[>]`.

*(See template: [resources/roadmap_template.md](./resources/roadmap_template.md))*

---

### Step 2: Elaborate Active Phase Just-In-Time (`0X_<phase>.md`)
When entering an active phase:
* Create or open `.atomic/0X_<phase>.md`.
* Break down the phase into **3 to 5 atomic micro-tasks**.
* An atomic task must be:
  - Defining interfaces/types only.
  - OR writing a single isolated helper function.
  - OR writing 1 unit test for that helper.
  - OR wiring one endpoint handler.

*(See template: [resources/phase_template.md](./resources/phase_template.md))*

---

### Step 3: Execute with 3-Point Sliding Cursor
At the start of every implementation response, output the 3-point status block:

```markdown
> [ATOMIC STATE]
> - [x] Done: Step N-1 (<summary>)
> - [>] Working: Step N (<single goal for this turn>)
> - [ ] Next: Step N+1 (<next step>)
```

* Execute **only** the code for Step N.
* Update the phase file: change Step N to `[x]` and set Step N+1 to `[>]`.

---

### Step 4: Phase Completion & Handoff
When all tasks in `0X_<phase>.md` are marked `[x]`:
1. Open `.atomic/00_roadmap.md`.
2. Mark the completed phase as `[x]`.
3. Set the next phase to `[>]`.
4. Close `0X_<phase>.md` and proceed to generate the next phase file.

---

## 🛡️ Error Handling & Bug Recovery Rule
If a bug, compiler error, or test failure occurs during Step N:
* **Do NOT jump to other steps or rewrite previous code.**
* Insert a sub-task directly below Step N: `- [!] Fix: <error description>`.
* Resolve the bug in that same file before advancing.

---

## 🔗 References & Templates
- [Roadmap Template](./resources/roadmap_template.md)
- [Phase File Template](./resources/phase_template.md)
- [3-Point Cursor Spec](./resources/cursor_template.md)
- [State Machine Spec & Flowchart](./references/state_machine.md)
- [End-to-End Walkthrough](./examples/walkthrough.md)
