# End-to-End Walkthrough Example

This example demonstrates how an AI agent using `atomic-coding` handles a feature request: **"Add JWT authentication with SQLite user store"**.

---

### Step 1: Initialization
Agent receives: *"Add JWT authentication with SQLite user store"*.
Because this touches DB, routes, and auth logic ($> 30$ LOC, $\ge 2$ files), the agent does NOT output code immediately.

Agent creates `.atomic/00_roadmap.md`:
```markdown
# MASTER ROADMAP - JWT AUTH & SQLITE
- [>] Phase 1: Auth Models & JWT Config (.atomic/01_models_config.md)
- [ ] Phase 2: SQLite User Repository (.atomic/02_sqlite_repo.md)
- [ ] Phase 3: Password Hashing & Token Service (.atomic/03_token_service.md)
- [ ] Phase 4: Express Auth Middleware & Login Route (.atomic/04_routes.md)
- [ ] Phase 5: Verification & End-to-End Test (.atomic/05_verification.md)
```

---

### Step 2: Elaborating Phase 1
Agent creates `.atomic/01_models_config.md`:
```markdown
# PHASE 1: Auth Models & JWT Config
- [>] 1. Create User and TokenPayload interfaces in `src/types/auth.ts`
- [ ] 2. Create JWT config schema & env parser in `src/config/jwt.ts`
- [ ] 3. Add unit test for JWT config validation in `tests/jwt_config.test.ts`
```

---

### Step 3: Turn 1 Execution
Agent responds:
```markdown
> [ATOMIC STATE]
> - [x] Done: Initialized .atomic roadmap & Phase 1
> - [>] Working: Task 1: Create User and TokenPayload interfaces in src/types/auth.ts
> - [ ] Next: Task 2: Create JWT config schema in src/config/jwt.ts

```typescript
// src/types/auth.ts
export interface User {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

export interface TokenPayload {
  userId: string;
  email: string;
}
```
Updated `.atomic/01_models_config.md` task 1 to [x].
```

---

### Step 4: Turn 2 Execution
Agent responds:
```markdown
> [ATOMIC STATE]
> - [x] Done: Task 1: Created User and TokenPayload interfaces in src/types/auth.ts
> - [>] Working: Task 2: Create JWT config schema & env parser in src/config/jwt.ts
> - [ ] Next: Task 3: Add unit test for JWT config validation

[Writes only the jwt.ts config code]
```

---

### Step 5: Phase 1 Completion
Once all 3 tasks in `01_models_config.md` are marked `[x]`:
Agent updates `.atomic/00_roadmap.md`:
- `[x] Phase 1`
- `[>] Phase 2: SQLite User Repository (.atomic/02_sqlite_repo.md)`

Then proceeds to Phase 2. At no point is the agent overwhelmed or drifting off course!
