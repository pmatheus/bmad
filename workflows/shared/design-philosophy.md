# BMAD Design Philosophy

## Purpose

This document defines the core design principles that govern all BMAD workflows and agent behaviors. These principles ensure quality, productivity, maintainability, and excellent user experience across the entire BMAD Method. Every workflow, agent, and automation must adhere to these principles to maintain consistency and effectiveness.

This is a reference document to be consulted during workflow design, implementation, and code review processes.

## Variables

This is a reference document with no executable variables.

## Instructions

### Core Principles

Follow these 10 foundational principles in all BMAD workflows:

#### 1. Anti-Hallucination Insurance
**Context prevents invention:**
- Provide complete, grounded information from actual project files
- Reference existing code explicitly
- No assumptions or inventions
- If information missing, note as "unknown" rather than guess

**Story Context as single source of truth:**
- All implementation details in one structured file
- Developer agent never needs to guess or assume
- Existing patterns and interfaces explicitly referenced

#### 2. AC-Driven Development
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

#### 3. Reuse Over Rebuild
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

#### 4. Continuous Execution
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

#### 5. Parallel Autonomous Execution
**Run multiple operations concurrently:**
- Launch independent workers in single message
- File-based coordination (not shared state)
- Each worker has isolated context
- Maximize throughput

**Critical:** ONE message with multiple Task calls = true parallelism

#### 6. Tests Are Non-Negotiable
**Story incomplete without tests:**
- 100% pass rate required
- Tests cover all ACs
- Use existing test utilities
- No skipped/ignored tests

**If tests fail:** Keep working until passing, don't mark complete

#### 7. Context Window Awareness
**Monitor and manage token usage:**
- Check after major operations
- Save progress before depletion
- Provide clear resumption path
- 20% threshold for safety

**Enables:**
- Multi-session workflows
- Clean checkpoints
- Predictable behavior

#### 8. Zero-Tolerance Validation
**Code review with no shortcuts:**
- Every AC checked with evidence
- Every completed task verified
- False completions = HIGH severity
- Evidence-based findings required

**Maintains:**
- Quality standards
- Integrity
- Trust in automation

#### 9. Systematic Coverage
**Complete, methodical approach:**
- Every requirement validated
- Every task verified
- Every constraint checked
- No assumptions

**Ensures:**
- Nothing missed
- Comprehensive review
- Reliable outcomes

#### 10. Intelligent Resume
**Workflows survive interruption:**
- Automatic checkpoint saving
- Progress tracked at granular level
- Resume from exact stopping point
- Cumulative progress across sessions

**Benefits:**
- Long-running workflows viable
- Interruption-safe
- Predictable restart

## Workflow

### Application in Each Phase

#### Story Context Phase
1. Apply **Anti-hallucination**: Gather existing code references from actual project files
2. Apply **Reuse**: Identify interfaces and utilities to reuse
3. Apply **Systematic**: Validate all required sections are present and complete

#### Dev Story Phase
1. Apply **AC-driven**: Cite AC IDs in every change made
2. Apply **Continuous**: Work until done or blocked, no artificial pauses
3. Apply **Reuse**: Use Story Context interfaces and patterns
4. Apply **Tests**: Achieve 100% pass rate before completion

#### Code Review Phase
1. Apply **Zero-tolerance**: Validate every AC and task with evidence
2. Apply **Systematic**: Complete coverage checklist, no items skipped
3. Apply **Evidence**: Provide file:line references for all findings

#### Bring to Life Phase
1. Apply **Parallel**: Execute multiple stories concurrently when possible
2. Apply **Context-aware**: Monitor token usage throughout execution
3. Apply **Intelligent resume**: Use checkpoint system for long workflows
4. Apply **Autonomous**: No user prompts mid-flow unless blocked

### Why This Matters

**For Quality:**
- Anti-hallucination prevents invented code
- AC-driven ensures requirements met
- Zero-tolerance validates everything
- Tests ensure correctness

**For Productivity:**
- Continuous execution reduces friction
- Parallel operations maximize throughput
- Reuse prevents duplicate work
- Context awareness enables long workflows

**For Maintainability:**
- Traceability from AC to code
- Existing patterns followed
- Comprehensive validation
- Clear audit trail

**For User Experience:**
- Workflows run autonomously
- Progress transparently reported
- Clear next steps provided
- Blockers clearly communicated

## Report

### Philosophy in Practice: Good vs Bad Examples

When implementing workflows, agents should demonstrate adherence to these principles through clear examples:

#### Good: AC-Driven
```
Implementing AC-1.2.3: User can reset password
- Added password reset endpoint
- Validation per AC requirements
- Tests cover AC success and failure cases
```

#### Bad: Scope Creep
```
Added password reset, plus:
- Password strength meter (not in AC)
- Password history tracking (not in AC)
- Configurable password policies (not in AC)
```

#### Good: Reuse
```
Story Context shows AuthService exists
→ Extended AuthService with new method
→ Followed existing pattern
```

#### Bad: Rebuild
```
Ignored Story Context
→ Created new AuthManager utility
→ Duplicated existing functionality
```

#### Good: Continuous
```
Task 1: ✓ Complete
Task 2: ✓ Complete
Task 3: ✓ Complete
Tests: ✓ All passing
Status: Ready for review
```

#### Bad: Fragmented
```
Task 1: ✓ Complete
[Pause for review]
[Resume after approval]
Task 2: ✓ Complete
[Pause again]
```

#### Good: Evidence-Based
```
[High] SQL injection in user search (AC #2)
- File: src/api/users.ts:45
- Rationale: User input directly interpolated
- Suggestion: Use parameterized queries
```

#### Bad: Vague
```
[High] Security issue in user search
- Fix SQL problems
```

### Reporting Adherence

When documenting workflow execution or design decisions, always reference which principle(s) are being applied and provide concrete evidence of adherence through examples like those above.
