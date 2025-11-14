# Session Notes: create-epics-and-stories Workflow Conversion

**Date:** 2025-01-13
**Duration:** ~1 hour
**Focus:** Convert create-epics-and-stories workflow (P0 - Critical)

---

## Summary

Successfully converted the create-epics-and-stories workflow from BMAD v1.x to Claude Code native command format. This P0 workflow breaks down PRD requirements into implementable epics and user stories using BDD format, vertical slicing, and proper sequencing principles.

---

## Work Completed

### create-epics-and-stories Command Conversion ✅

**File Created:** `claude-code-plugin/src/commands/phase-2/create-epics-and-stories.md`

**Approach:**
- **Manual conversion** (consistent with PRD workflow approach)
- Source was ~170 lines of workflow logic
- Target is ~520 lines of comprehensive documentation

**Key Features Implemented:**
- Clear delegation to bmad-pm subagent
- BDD (Behavior-Driven Development) acceptance criteria format
- Vertical slicing principle (complete features, not layers)
- Epic 1 foundation principle (Story 1.1 always project setup)
- Sequential dependencies (no forward dependencies)
- Story sizing for AI agents (2-4 hour sessions)
- 3 detailed examples (SaaS PM Tool, Healthcare Mobile, CLI Tool)
- Comprehensive validation checklist
- Troubleshooting section

**Technical Decisions:**
- Delegate to bmad-pm (same agent as PRD workflow)
- Detailed Task tool prompt with step-by-step instructions
- PRD.md required as input (validates prerequisite)
- Living document approach (write incrementally)
- BDD format for acceptance criteria (Given-When-Then)
- Clear validation of vertical slicing and sequencing

### Progress Tracking Updated ✅

**Files Updated:**
- `.bmad-conversion/progress.json`
- `.bmad-conversion/current-task.md`
- `.bmad-conversion/completed/` (workflow saved)

**Progress Stats After This Conversion:**
- Workflows: 4/22 (18%) - was 3/22 (14%)
- Agents: 1/8 (12%) - unchanged
- Skills: 5/7 (71%) - unchanged
- Overall: 29% - was 27%

---

## Key Principles Documented

### 1. Vertical Slicing (Not Horizontal Layers)

**Explained with examples:**
- Bad: "Create database schema", "Build API", "Create UI"
- Good: "User can register account" (DB + API + UI complete)

This principle ensures each story delivers complete, testable functionality.

### 2. Epic 1 Foundation Principle

**Always establishes foundation:**
- Story 1.1: Project setup, infrastructure, deployment
- Creates baseline for all subsequent work
- Exception: Brownfield projects adapt but still create foundation

### 3. Sequential Dependencies (No Forward Dependencies)

**Critical for AI-agent implementation:**
- Stories only depend on previous work
- Can implement epics in order
- No waiting for future epics
- Enables incremental value delivery

### 4. BDD Acceptance Criteria

**Given-When-Then format:**
```
Given [precondition]
When [action]
Then [expected outcome]
And [additional criteria]
```

Makes requirements testable and clear for AI agents.

### 5. Story Sizing for AI Agents

**2-4 hour implementation estimate:**
- Too Big: "Build complete authentication system" (split it)
- Too Small: "Add database column" (combine it)
- Just Right: "User can register with email verification"

---

## Examples Created

### Example 1: SaaS Project Management Tool

**18 stories across 4 epics:**
- Epic 1: Foundation and User Management (5 stories)
- Epic 2: Project and Task Management (6 stories)
- Epic 3: Collaboration Features (4 stories)
- Epic 4: Reporting and Analytics (3 stories)

**Shows:** Natural business value groupings, vertical slicing

### Example 2: Healthcare Mobile App

**16 stories across 4 epics:**
- Epic 1: Security Foundation (HIPAA compliance framework in Story 1.1)
- Epic 2: Health Data Management (with audit logging)
- Epic 3: Care Management (medications, appointments)
- Epic 4: Medical Records Integration (FHIR)

**Shows:** Complex domain handling, compliance distribution, foundation adaptation

### Example 3: Developer CLI Tool

**13 stories across 4 epics:**
- Epic 1: CLI Foundation
- Epic 2: Migration Creation
- Epic 3: Migration Execution
- Epic 4: Multi-Database Support

**Shows:** Simpler project structure, clear progression, focused scope

---

## Challenges Encountered

### Challenge 1: Explaining Vertical Slicing

**Issue:** Abstract concept - "vertical vs horizontal" not immediately clear

**Solution:**
- Created clear examples showing bad vs good
- Explained with concrete user stories
- Emphasized "complete feature across all layers"
- Added to Key Principles section with multiple examples

### Challenge 2: BDD Format Clarity

**Issue:** Source used BDD but didn't explain the format clearly

**Solution:**
- Documented Given-When-Then pattern explicitly
- Explained why this format matters (testable, clear)
- Showed format in all examples
- Provided template in delegation prompt

### Challenge 3: Epic 1 Foundation Exception

**Issue:** Greenfield vs brownfield projects have different needs

**Solution:**
- Documented primary rule (greenfield = full setup)
- Noted exception (brownfield = adapted foundation)
- Explained in "Epic 1 Foundation Principle" section
- Covered in troubleshooting

---

## Delegation Pattern Refinement

### Improved from PRD Workflow

**More detailed Task tool prompt:**
1. Explicit 6-step process for PM agent
2. Clear input requirements (PRD.md path)
3. Detailed story pattern and BDD template
4. Comprehensive validation checklist
5. Expected output file structure shown
6. Quality criteria before completion

**Template for future workflows:**
```javascript
{
  "subagent_type": "bmad-{agent}",
  "description": "Brief task description",
  "prompt": `
    **Project Context:** [vars]
    **Input Documents:** [paths]
    **Configuration:** [settings]
    **Your Task:**
    1. [Step 1]
    2. [Step 2]
    ...
    **Output File:** [path]
    **Template Structure:** [markdown template]
    **Validation Checklist:** [criteria]
    **When complete**, report back: [summary]
  `
}
```

---

## Files Created

1. `claude-code-plugin/src/commands/phase-2/create-epics-and-stories.md` (520 lines)
2. `.bmad-conversion/completed/create-epics-and-stories-workflow.md` (backup)
3. `.bmad-conversion/notes/session-2025-01-13-create-epics-and-stories.md` (this file)

**Total:** ~550 lines of documentation

---

## Testing Status

**Current:** Not tested

**Reason:** Requires:
- Plugin installed to `~/.claude/`
- Test project initialized
- PRD.md created (from `/bmad/prd` workflow)
- bmad-pm subagent available

**Plan:** Test after architect agent + architecture workflow converted
- Will enable end-to-end planning phase testing
- Can test full flow: workflow-init → prd → create-epics-and-stories → architecture

**Testing Blockers:**
- Need PRD workflow tested first (provides input)
- Could create manual PRD.md for testing, but better to test full flow

---

## Next Steps

### Immediate Next: Architect Agent (P0)

**Why architect agent next:**
- Needed for architecture workflow
- P0 priority (critical path)
- Similar structure to bmad-pm (established pattern)
- Enables next major planning workflow

**After architect agent:**
- Convert architecture workflow (P0)
- This completes the core planning phase conversions
- Enables comprehensive testing of planning workflows

### Alternative Consideration: Testing

**Could start testing now:**
- Have enough workflows for partial testing
- workflow-init → workflow-status → prd → create-epics-and-stories
- Would validate delegation pattern works
- Would identify issues early

**Decision:** Continue with architect agent
- Better to have architecture workflow complete
- Enables full planning phase testing
- Current pattern working well (2 workflows, 1 agent proven)

---

## Lessons Learned

### 1. Principle-Based Documentation

Don't just convert mechanics - explain WHY:
- Vertical slicing WHY: Complete testable features
- Epic 1 foundation WHY: Enables all subsequent work
- No forward deps WHY: Sequential AI-agent implementation
- BDD format WHY: Testable, clear expectations

### 2. Examples as Teaching Tools

Each example should show different aspect:
- Example 1: Standard business app
- Example 2: Complex domain (healthcare, compliance)
- Example 3: Different project type (CLI vs web)

Variety helps users understand adaptation.

### 3. Troubleshooting Sections Matter

Users will encounter:
- Prerequisites not met ("PRD.md not found")
- Overwrite scenarios ("Epics already exist")
- Confusion about principles ("Epic 1 doesn't feel like foundation")
- Scope concerns ("Too many stories")

Document these proactively.

### 4. Validation Checklists Essential

Clear success criteria help:
- PM agent knows what to validate
- Users understand quality expectations
- Testing has clear pass/fail criteria
- Reviews have objective standards

---

## Time Breakdown

- Reading source files: 10 min
- Converting workflow (manual): 35 min
- Adding examples: 15 min
- Updating progress tracking: 5 min
- Creating session notes: 10 min

**Total:** ~1 hour 15 min

---

## Conversion Quality Assessment

### Strengths

✅ **Comprehensive documentation** - All key principles explained
✅ **Clear delegation** - Detailed Task tool prompt
✅ **Excellent examples** - 3 different project types
✅ **Principle-focused** - WHY, not just WHAT
✅ **Validation integration** - Clear success criteria
✅ **Troubleshooting** - Common issues documented

### Areas for Potential Improvement

⚠️ **Testing needed** - Can't validate until PRD workflow tested
⚠️ **Template structure** - Could be a separate reference file (like validation checklist)
⚠️ **BDD format** - Could link to external BDD resources for deeper learning

**Overall Assessment:** High quality conversion, ready for testing once prerequisites available.

---

## Pattern Comparison: PRD vs create-epics-and-stories

### Similarities
- Both delegate to bmad-pm
- Both use manual conversion approach
- Both have comprehensive examples
- Both include validation checklists
- Both explain key principles

### Differences
- create-epics-and-stories simpler (4 steps vs 11)
- create-epics-and-stories has clear prerequisite (PRD.md)
- create-epics-and-stories more focused scope
- PRD more adaptive (intent-driven planning)

### Pattern Consistency

✅ Same delegation pattern
✅ Same documentation structure
✅ Same example format (3 examples, different types)
✅ Same troubleshooting approach
✅ Same validation style

**Consistency enables:** Predictable user experience, easier maintenance, reusable patterns

---

## Recommendations

### For Next Agent Conversion (Architect)

1. **Follow bmad-pm pattern** - Structure proven
2. **Focus on use cases** - Architecture creation, epic tech context
3. **Document decision frameworks** - How to choose tech stack, architecture patterns
4. **Include examples** - Monolith vs microservices, tech stack selection
5. **Reference architecture template** - Show expected output structure

### For Testing Phase

1. **Create test project** - Fresh directory for testing
2. **Test in sequence** - workflow-init → prd → epics → architecture
3. **Document all issues** - Track for fixes
4. **Validate delegation** - Ensure Task tool works with bmad-pm
5. **Check output quality** - Files created correctly, content complete

---

## Context Window Status

**At This Point:** ~84k / 200k (42%)

**Status:** Healthy - can continue with agent conversion

**Management:**
- Can comfortably add architect agent (~30-40k tokens)
- Session notes help preserve context
- current-task.md provides clear continuation point

---

## Final Notes

The create-epics-and-stories workflow establishes critical implementation principles:
- Vertical slicing ensures complete features
- Epic 1 foundation enables sequential development
- BDD format makes stories testable and clear
- Story sizing matches AI-agent capabilities

These principles are essential for AI-agent development methodology. The conversion preserves and enhances these principles with clear documentation and examples.

**Confidence Level:** High - comprehensive, well-documented, follows established patterns.
**Testing Priority:** Medium-High - important but needs PRD first.
**Next Conversion Readiness:** Ready for architect agent conversion.

---

**Conversion Complete** ✅
