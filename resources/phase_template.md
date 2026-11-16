# PHASE [X]: [Phase Name]

Parent Milestone: [Phase X in .atomic/00_roadmap.md]
Total Tasks: [3 to 5 tasks max]
Status: IN_PROGRESS

---

## Micro-Tasks

- [>] 1. [Atomic Step 1]: Define interfaces/types in `src/types/foo.ts` (< 25 LOC)
- [ ] 2. [Atomic Step 2]: Implement single helper function in `src/utils/foo_helper.ts`
- [ ] 3. [Atomic Step 3]: Add unit test for helper in `tests/foo_helper.test.ts`
- [ ] 4. [Atomic Step 4]: Wire helper into primary service `src/services/foo.ts`

---

## Execution Constraints
- Maximum 1 task executed per turn.
- Immediately mark `[>]` as `[x]` upon completion and promote next `[ ]` to `[>]`.
- If an issue arises: add `- [!] Fix: <issue>` under the current task.
