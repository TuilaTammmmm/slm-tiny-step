# State Machine & Decision Heuristics

This reference specifies the exact deterministic state transitions for the `atomic-coding` workflow.

---

## State Diagram

```mermaid
stateDiagram-v2
    [*] --> Idle: User prompt received
    Idle --> DirectAnswer: Prompt is trivial (typo / 1-line / query)
    Idle --> CheckAtomicDir: Prompt is coding task (>30 LOC or 2+ files)
    
    CheckAtomicDir --> InitRoadmap: .atomic/ does not exist
    CheckAtomicDir --> ReadRoadmap: .atomic/ exists
    
    InitRoadmap --> CreatePhaseFile: Generate 00_roadmap.md
    ReadRoadmap --> InspectCurrentPhase: Find [>] phase in roadmap
    
    InspectCurrentPhase --> CreatePhaseFile: Phase file missing
    InspectCurrentPhase --> ReadPhaseFile: Phase file exists
    
    CreatePhaseFile --> ExecuteAtomicStep: Populate 3-5 micro-tasks
    
    ReadPhaseFile --> ExecuteAtomicStep: Has pending [ ] or [>] tasks
    ReadPhaseFile --> ClosePhase: All tasks marked [x]
    
    ExecuteAtomicStep --> UpdatePhaseFile: Complete 1 task & test
    UpdatePhaseFile --> ReadPhaseFile: Check remaining tasks
    
    ClosePhase --> AdvanceRoadmap: Mark phase [x] in 00_roadmap.md
    AdvanceRoadmap --> CreatePhaseFile: Next phase available
    AdvanceRoadmap --> Complete: All roadmap phases marked [x]
    
    Complete --> [*]
    DirectAnswer --> [*]
```

---

## Deterministic Rules Summary

1. **Idle $\rightarrow$ CheckAtomicDir**:
   - `len(lines_to_modify) > 30` OR `affected_files >= 2` OR `user_prompt contains ["refactor", "build", "implement feature"]`

2. **Phase Boundary Rules**:
   - Max tasks per phase file: 5 tasks.
   - Max lines of code generated per turn: 40 lines.
   - Never write code for Phase $N+1$ while Phase $N$ has incomplete tasks.

3. **Disk Persistence**:
   - State lives strictly on disk (`.atomic/`). Chat history can be wiped or compacted at any time without losing position.
