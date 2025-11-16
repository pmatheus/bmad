# BMAD Design Philosophy

## Core Principles

### 1. Anti-Hallucination Insurance
**Context prevents invention:**
- Provide complete, grounded information from actual project files
- Reference existing code explicitly
- No assumptions or inventions
- If information missing, note as "unknown" rather than guess

**Story Context as single source of truth:**
- All implementation details in one structured file
- Developer agent never needs to guess or assume
- Existing patterns and interfaces explicitly referenced

### 2. AC-Driven Development
**Every change maps to acceptance criteria:**
- Cite AC IDs throughout implementation
- No feature additions beyond ACs (prevents scope creep)
- No skipping AC items - all must be satisfied
- Trace changes to ACs in changelog

**Ensures:**
- Traceability
- Scope control
- Requirements met
- Quality validation

### 3. Reuse Over Rebuild
**Biggest waste: rebuilding what exists:**
- Identify existing implementations
- Reference existing interfaces
- Note established patterns
- Prevent duplicate code

**Story Context provides:**
- What interfaces already exist
- What utilities are available
- What patterns to follow
- Prevents reinvention

### 4. Continuous Execution
**Work until done or blocked:**
- No pauses for "milestones"
- No "session boundaries"
- No permission requests mid-flow
- Only halt for true blockers or completion

**Benefits:**
- Maintains flow state
- Reduces context switching
- Faster delivery
- Less back-and-forth

**Only halt for:**
- True completion
- Missing information
- Ambiguous requirements
- External dependencies unavailable
- Repeated failures

### 5. Parallel Autonomous Execution
**Run multiple operations concurrently:**
- Launch independent workers in single message
- File-based coordination (not shared state)
- Each worker has isolated context
- Maximize throughput

**Critical:** ONE message with multiple Task calls = true parallelism

### 6. Tests Are Non-Negotiable
**Story incomplete without tests:**
- 100% pass rate required
- Tests cover all ACs
- Use existing test utilities
- No skipped/ignored tests

**If tests fail:** Keep working until passing, don't mark complete

### 7. Context Window Awareness
**Monitor and manage token usage:**
- Check after major operations
- Save progress before depletion
- Provide clear resumption path
- 20% threshold for safety

**Enables:**
- Multi-session workflows
- Clean checkpoints
- Predictable behavior

### 8. Zero-Tolerance Validation
**Code review with no shortcuts:**
- Every AC checked with evidence
- Every completed task verified
- False completions = HIGH severity
- Evidence-based findings required

**Maintains:**
- Quality standards
- Integrity
- Trust in automation

### 9. Systematic Coverage
**Complete, methodical approach:**
- Every requirement validated
- Every task verified
- Every constraint checked
- No assumptions

**Ensures:**
- Nothing missed
- Comprehensive review
- Reliable outcomes

### 10. Intelligent Resume
**Workflows survive interruption:**
- Automatic checkpoint saving
- Progress tracked at granular level
- Resume from exact stopping point
- Cumulative progress across sessions

**Benefits:**
- Long-running workflows viable
- Interruption-safe
- Predictable restart

## Why This Matters

### For Quality
- Anti-hallucination prevents invented code
- AC-driven ensures requirements met
- Zero-tolerance validates everything
- Tests ensure correctness

### For Productivity
- Continuous execution reduces friction
- Parallel operations maximize throughput
- Reuse prevents duplicate work
- Context awareness enables long workflows

### For Maintainability
- Traceability from AC to code
- Existing patterns followed
- Comprehensive validation
- Clear audit trail

### For User Experience
- Workflows run autonomously
- Progress transparently reported
- Clear next steps provided
- Blockers clearly communicated

## Application in Workflows

### Story Context
- **Anti-hallucination:** Gather existing code references
- **Reuse:** Identify interfaces to reuse
- **Systematic:** Validate all sections present

### Dev Story
- **AC-driven:** Cite ACs in every change
- **Continuous:** Work until done or blocked
- **Reuse:** Use Story Context interfaces
- **Tests:** 100% pass rate required

### Code Review
- **Zero-tolerance:** Validate every AC and task
- **Systematic:** Complete coverage checklist
- **Evidence:** File:line references for all findings

### Bring to Life
- **Parallel:** Multiple stories concurrently
- **Context-aware:** Monitor token usage
- **Intelligent resume:** Checkpoint system
- **Autonomous:** No user prompts mid-flow

## Philosophy in Practice

### Good: AC-Driven
```
Implementing AC-1.2.3: User can reset password
- Added password reset endpoint
- Validation per AC requirements
- Tests cover AC success and failure cases
```

### Bad: Scope Creep
```
Added password reset, plus:
- Password strength meter (not in AC)
- Password history tracking (not in AC)
- Configurable password policies (not in AC)
```

### Good: Reuse
```
Story Context shows AuthService exists
→ Extended AuthService with new method
→ Followed existing pattern
```

### Bad: Rebuild
```
Ignored Story Context
→ Created new AuthManager utility
→ Duplicated existing functionality
```

### Good: Continuous
```
Task 1: ✓ Complete
Task 2: ✓ Complete
Task 3: ✓ Complete
Tests: ✓ All passing
Status: Ready for review
```

### Bad: Fragmented
```
Task 1: ✓ Complete
[Pause for review]
[Resume after approval]
Task 2: ✓ Complete
[Pause again]
```

### Good: Evidence-Based
```
[High] SQL injection in user search (AC #2)
- File: src/api/users.ts:45
- Rationale: User input directly interpolated
- Suggestion: Use parameterized queries
```

### Bad: Vague
```
[High] Security issue in user search
- Fix SQL problems
```
