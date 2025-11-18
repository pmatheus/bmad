---
description: Implement a user story by delegating to the Developer agent for AC-driven, context-based development
---

# Develop Story (Implementation)

Implements a user story by delegating to the **bmad-dev** (Developer) subagent. The developer agent executes tasks, writes code, creates tests, and validates against acceptance criteria using Story Context XML for grounded, hallucination-free implementation.

## Purpose

Provides AC-driven development (every change maps to acceptance criteria), context-based implementation (reuse existing code), continuous execution (work until done or blocked), tests are non-negotiable (100% pass rate required).

**Key Principle:** Continuous execution without pausing. Work until ALL ACs satisfied, ALL tasks complete, ALL tests passing - or until blocked.

## Quick Start

```bash
# Prerequisites: story marked "ready-for-dev", context generated
/bmad:phase-4:dev-story

# Workflow will:
# 1. Find first "ready-for-dev" story
# 2. Load story and Story Context XML
# 3. Mark story in-progress
# 4. Implement ALL tasks continuously
# 5. Write tests (100% pass required)
# 6. Validate completion
# 7. Update sprint status: ready-for-review
# 8. Auto-continue to code-review
```

## Prerequisites

See [shared/prerequisites.md#phase-4-dev-story](../shared/prerequisites.md)

**Workflow-specific:**
- [ ] Story exists with status "ready-for-dev" or "in-progress"
- [ ] Story Context generated (STRONGLY RECOMMENDED - run story-context first)
- [ ] Epic tech spec available (optional but recommended)

## Instructions

### Story Implementation Flow

**Overview:**
1. Find Next Ready Story → First "ready-for-dev" or "in-progress"
2. Load Story and Context → Read story file and .context.xml
3. Check for Code Review Continuation → Resume after review if needed
4. Mark In-Progress → Update sprint status
5. Implement Continuously → Work through ALL tasks without pausing
6. Validate Completion → Verify all ACs, all tasks, all tests passing
7. Update Files → Story file, sprint status
8. Report and Auto-Continue → Report completion, proceed to code-review

### 1. Load Configuration and Find Story

See [shared/common-operations.md#load-configuration](../shared/common-operations.md)

**Find next ready story:**

From `{sprint_artifacts}/sprint-status.yaml`, find first story where:
- Status equals "ready-for-dev" (fresh implementation)
- OR Status equals "in-progress" (resume work)
- Key matches pattern: `{epic}-{story}-{name}`
- NOT an epic or retrospective

**If no ready stories found:**
```
📋 No stories ready for implementation.

Next Steps:
1. Run /bmad:phase-4:create-story to draft stories
2. Run /bmad:phase-4:story-context to mark stories ready-for-dev
3. Run /bmad:phase-4:sprint-planning to refresh tracking
```
→ HALT

### 2. Delegate to Developer Agent

See [shared/common-operations.md#delegate-to-subagent](../shared/common-operations.md)

**Task Configuration:**
- **subagent_type:** `"bmad-dev"`
- **description:** `"Implement next ready story"`
- **prompt:** Detailed delegation prompt (see template below)

**Delegation Prompt Template:**

```
**Project Context:**
- Project Name: {project_name}
- Output Folder: {documentation_dir}
- Sprint Artifacts: {sprint_artifacts}
- User Name: {user_name}
- User Skill Level: {user_skill_level}
- Today's Date: {current_date}

**Input Documents:**
- Sprint Status: {sprint_artifacts}/sprint-status.yaml
- Stories Directory: {sprint_artifacts}/stories/
- Story Context Directory: {sprint_artifacts}/stories/ (*.context.xml files)
- Epic Tech Specs: {sprint_artifacts}/tech-spec-epic-*.md
- Architecture: .bmad/architecture.md

**Your Task:**

You are implementing the next ready user story using AC-driven, context-based development.

**Process:**

1. **Find Next Ready Story:**
   - Read sprint status file: {sprint_artifacts}/sprint-status.yaml
   - Find first story with status "ready-for-dev" or "in-progress"
   - If none found, halt and inform user

2. **Load Story and Context:**
   - Read complete story file: {sprint_artifacts}/{story_key}.md
   - Parse: Story, Acceptance Criteria, Tasks, Dev Notes, Dev Agent Record, File List, Change Log, Status
   - Check for Story Context: {sprint_artifacts}/{story_key}.context.xml
   - If context exists, read it completely and pin to active memory (SINGLE SOURCE OF TRUTH)
   - If context missing, note it and proceed (quality will be lower)

3. **Check for Code Review Continuation:**
   - Check if "Senior Developer Review (AI)" section exists in story file
   - If yes: This is a resume after code review
     - Extract review action items from "Review Follow-ups (AI)" subsection
     - Count unchecked action items
     - Prioritize review follow-ups before continuing with regular tasks
     - Report: "Resuming story after code review. {X} action items remaining."
   - If no: This is fresh implementation
     - Report: "Starting fresh implementation of {story_key}"

4. **Mark Story In-Progress:**
   - Update sprint status: {story_key} status → "in-progress"
   - Save sprint status file

5. **Implement Continuously:**

   **CRITICAL:** Work through ALL tasks without stopping until the story is COMPLETE (all ACs satisfied, all tasks checked, all tests passing) OR you encounter an explicit blocker.

   For each task in Tasks/Subtasks:

   a. **Review Requirements:**
      - Read acceptance criteria that map to this task
      - Read dev notes
      - Review Story Context for existing code and patterns
      - Plan implementation approach

   b. **Implement Task:**
      - Write/update code following existing patterns (from Story Context)
      - Cite which AC you're implementing (e.g., "Implementing AC-1.1.2")
      - Reference existing interfaces and utilities from Story Context
      - Handle edge cases and error conditions
      - Update File List section with changed files

   c. **Write Tests:**
      - Write tests covering the acceptance criteria for this task
      - Use existing test fixtures/factories (from Story Context)
      - Run tests, ensure they pass
      - If tests fail, fix the code or tests until passing

   d. **Mark Task Complete:**
      - Update Tasks/Subtasks: change [ ] to [x] for completed task
      - Add notes to Dev Agent Record → Debug Log
      - Add entry to Change Log with timestamp and summary

   e. **Continue to Next Task:**
      - Move to next unchecked task
      - Repeat steps a-d
      - DO NOT pause for "milestone reviews" or "session boundaries"
      - ONLY halt if you encounter a blocker:
        - Missing information not in Story Context
        - Ambiguous requirement needing clarification
        - External dependency unavailable
        - 3 consecutive implementation failures

6. **Validate Story Completion:**

   Before marking story done, verify:

   - [ ] All acceptance criteria are satisfied
   - [ ] All tasks in Tasks/Subtasks are checked [x]
   - [ ] All tests are written and passing (100% pass rate)
   - [ ] Code follows existing patterns (per Story Context)
   - [ ] File List section updated with all changed files
   - [ ] Change Log updated with implementation notes
   - [ ] Dev Agent Record → Completion Notes written

   **If all checkboxes true:**
   - Story is complete, ready for code review
   - Update Status section to "review"
   - Update sprint status: {story_key} status → "review"

   **If any checkbox false:**
   - Continue working or document blocker

7. **Report Completion:**

   When story is complete (or blocked), report:

   **If complete:**
   ```
   Story {story_key} implementation complete.

   **Summary:**
   - Acceptance Criteria: {X}/{X} satisfied
   - Tasks: {X}/{X} completed
   - Tests: {X} written, {X}/{X} passing (100%)
   - Files Changed: {list of files}

   **Implementation Notes:**
   {brief summary of approach, decisions made, patterns followed}

   **Status:** Ready for code review

   **Recommended Next Step:** Run /bmad:phase-4:code-review
   ```

   **If blocked:**
   ```
   Story {story_key} blocked.

   **Blocker:** {description of blocker}
   **What's needed:** {what information, clarification, or resource is missing}
   **Progress so far:**
   - Acceptance Criteria: {X}/{Y} satisfied
   - Tasks: {X}/{Y} completed
   - Tests: {X} written, {X}/{Y} passing

   **Recommended Action:** {how user can unblock}
   ```

**Continuous Execution Reminder:**

DO NOT stop implementation because of:
- "Significant progress made"
- "Milestone reached"
- "Session boundary"
- "Time to review"

ONLY stop for:
- All work complete (all ACs satisfied, all tasks done, all tests passing)
- Explicit blocker (missing info, ambiguous requirement, external dependency)
- User instructs you to stop

**Story Context is Critical:**

If Story Context XML exists, it is your SINGLE SOURCE OF TRUTH:
- Trust it over model priors
- Reuse existing code it references
- Follow patterns it defines
- Use interfaces it provides

If Story Context is missing:
- Quality will be lower (more risk of hallucinations)
- You may rebuild what already exists
- Patterns may be inconsistent
- Recommend user runs /bmad:phase-4:story-context first
```

### 3. Developer Works Continuously

The bmad-dev subagent will now:
- Load the next ready story
- Read Story Context XML (if available)
- Implement all tasks continuously
- Write tests
- Validate against acceptance criteria
- Update story file
- Report completion or blocker

**This is autonomous** - the developer works without pausing unless blocked or complete.

**Your role:** Provide clarification if the developer encounters a blocker.

### 4. Auto-Continue to Code Review

**Purpose:** Enable seamless workflow continuation to code review when story implementation completes.

**Check story completion:**
- Was story marked as "review"? (dev agent sets this when done)
- Are all acceptance criteria satisfied?
- Are all tests passing?

**If story implementation completed successfully (status = "review"):**

```
🚀 Auto-continuing to code review...

Senior developer review will validate implementation and provide feedback.
```

**Execute next workflow:**
Use SlashCommand tool with command: `/bmad:phase-4:code-review`

**If developer reported a blocker:**

```
⚠️ Story implementation blocked.

Blocker: {blocker_description}

Please resolve the blocker, then re-run /bmad:phase-4:dev-story to resume.
```

**CRITICAL:**
- DO NOT ask user permission to continue if story is ready for review
- Code review is the natural next step after implementation
- Review runs autonomously and provides structured feedback
- User can address review feedback after review completes

**Rationale:** Code review is part of the standard development flow. Once implementation is complete, it should automatically proceed to review without user intervention. This maintains workflow momentum and ensures quality gates are applied consistently.

## Key Constraints

- **AC-driven development:** Every line of code maps to specific acceptance criterion
- **Story Context is truth:** If context exists, it's the single source of truth - reuse existing code
- **Continuous execution:** Work without pausing until done or blocked
- **Tests non-negotiable:** 100% pass rate required, no exceptions
- **Reuse over rebuild:** Use existing code/patterns from Story Context
- **No scope creep:** Only implement what's in acceptance criteria
- **Update story file continuously:** Check tasks, update File List, add Change Log entries

## Auto-Continue

**ALWAYS auto-continue** to code-review after story implementation completes.

Dev-story + code-review is a continuous flow. Once implementation is complete, proceed immediately to review without user intervention. This maintains workflow momentum and ensures quality gates are applied consistently.

## Notes

- **Story Context critical:** STRONGLY recommend running story-context before dev-story
- **Without context:** Risk of hallucinations, rebuilding existing code, inconsistent patterns
- **With context:** Reuse existing code, follow established patterns, higher quality
- **Continuous execution:** Work until done or blocked, no pausing for milestones
- **Tests required:** Story not done until all tests written and passing (100%)
- **Code review next:** Natural next step after implementation
- **Resume support:** Can resume after code review to address action items

**Philosophy:** AC-driven development ensures traceability and prevents scope creep. Story Context prevents hallucinations and ensures code reuse. Continuous execution reduces friction and speeds delivery. Tests are non-negotiable for quality. Code review ensures consistency and catches issues early.

---

**References:**
- Examples: [examples/dev-story-examples.md](../examples/dev-story-examples.md)
- Troubleshooting: [shared/troubleshooting.md#dev-story](../shared/troubleshooting.md)
- Philosophy: [shared/design-philosophy.md#ac-driven-development](../shared/design-philosophy.md)
- Common Operations: [shared/common-operations.md](../shared/common-operations.md)
