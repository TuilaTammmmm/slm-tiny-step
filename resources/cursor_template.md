# 3-Point Sliding Cursor Spec

Whenever the agent begins an implementation turn, it must emit this lightweight anchor block at the very top of its response. This guarantees context retention even across long turn histories.

---

## Format

```markdown
> [ATOMIC STATE]
> - [x] Done: Step [X-1]: [Brief summary of completed work]
> - [>] Working: Step [X]: [Single focused objective for this turn]
> - [ ] Next: Step [X+1]: [Next pending task in queue]
```

## Example in Action

```markdown
> [ATOMIC STATE]
> - [x] Done: Step 1: Defined UserProfile interface in types/user.ts
> - [>] Working: Step 2: Implement validateUserProfile() helper
> - [ ] Next: Step 3: Add unit test for validateUserProfile()

[Only output code required for validateUserProfile() here]
```
