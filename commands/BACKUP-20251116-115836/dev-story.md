---
description: Implement a user story by delegating to the Developer agent for AC-driven, context-based development
---

# Develop Story (Implementation)

## What This Does

Implements a user story by delegating to the **bmad-dev** (Developer) subagent. The developer agent executes tasks, writes code, creates tests, and validates against acceptance criteria using Story Context XML for grounded, hallucination-free implementation.

**Philosophy:** AC-driven development (every change maps to acceptance criteria), context-based implementation (reuse existing code), continuous execution (work until done or blocked), tests are non-negotiable (100% pass rate required).

**Output:** Implemented story with all tasks complete, tests passing, and code ready for review

---

## Prerequisites

- **BMAD plugin installed** - The bmad-dev subagent must be available
- **workflow-init run** - Project configured with `.bmad/config.yaml`
- **Story exists** - At least one story file created (run `/bmad:phase-4:create-story`)
- **Story is ready** - Story status is "ready-for-dev" or "in-progress"
- **Story Context generated** (strongly recommended) - Run `/bmad:phase-4:story-context` first for best results

---

## How It Works

This workflow delegates story implementation to the **bmad-dev** subagent, who:

1. **Finds next ready story** - Reads sprint status, identifies story with status "ready-for-dev"
2. **Loads story and context** - Reads story file and Story Context XML (if available)
3. **Marks story in-progress** - Updates sprint status to track active work
4. **Plans implementation** - Reviews acceptance criteria, tasks, Story Context
5. **Implements continuously** - Works through all tasks without pausing until done or blocked
6. **Writes tests** - Creates tests per acceptance criteria, ensures 100% pass rate
7. **Validates completion** - Verifies all ACs satisfied, all tasks checked, all tests passing
8. **Updates story file** - Marks tasks complete, adds implementation notes
9. **Reports completion** - Summarizes what was implemented, recommends next step (code review)

**Key Principle:** The developer works **continuously** without stopping for "milestone reviews" or "session boundaries". Only halts for explicit blockers (missing info, failed tests, ambiguous requirements) or true completion.

---

## Instructions

### Step 1: Verify Prerequisites

Check that required files and structure exist:

```bash
# Configuration must exist
cat .bmad/config.yaml

# Sprint status should exist (from sprint-planning workflow)
cat {sprint_artifacts}/sprint-status.yaml

# At least one story file should exist
ls {sprint_artifacts}/stories/story-*.md
```

**If missing:**
- Config → Run `/bmad:meta:workflow-init`
- Sprint status → Run `/bmad:phase-4:sprint-planning`
- Stories → Run `/bmad:phase-4:create-story`

### Step 2: Check Story Readiness

Verify at least one story is ready for development:

```bash
# Check sprint status for ready stories
cat {sprint_artifacts}/sprint-status.yaml | grep -A 1 "ready-for-dev"
```

A story is "ready-for-dev" when:
- Story file exists
- Acceptance criteria are defined
- Tasks are outlined
- (Optionally) Story Context XML has been generated

**If no ready stories:** Run `/bmad:phase-4:story-ready` to mark drafted stories as ready, or `/bmad:phase-4:story-context` to generate context and mark ready.

### Step 3: (Recommended) Generate Story Context

For best results, generate Story Context XML before implementing:

```bash
# Generates context for next ready story
/bmad:phase-4:story-context
```

Story Context provides:
- Existing code interfaces to reuse
- Patterns to follow
- Architectural constraints
- Testing guidance
- Prevents hallucinations

**Can skip:** Developer can work without context, but quality and accuracy are lower.

### Step 4: Load Project Configuration

Read configuration to provide context to the developer:

```bash
cat .bmad/config.yaml
```

Extract:
- `project_name`
- `output_folder` (usually `.bmad`)
- `sprint_artifacts` (usually `.bmad/stories`)
- `user_name`
- `user_skill_level` (beginner/intermediate/expert)

### Step 5: Delegate to Developer Agent

Use the **Task tool** to delegate story implementation to bmad-dev:

**Task Configuration:**
- **subagent_type:** `"bmad-dev"`
- **description:** `"Implement next ready story"`
- **prompt:** Detailed instructions (see below)

**Delegation Prompt Template:**

```
**Project Context:**
- Project Name: {project_name from config}
- Output Folder: {output_folder from config}
- Sprint Artifacts Folder: {sprint_artifacts from config}
- User Name: {user_name from config}
- User Skill Level: {user_skill_level from config}
- Today's Date: {current date}

**Input Documents:**

- Sprint Status: {output_folder}/sprint-status.yaml
- Stories Directory: {sprint_artifacts}/ (contains story-*.md files)
- Story Context Directory: {sprint_artifacts}/ (contains story-*.context.xml files, if generated)
- Epic Tech Specs: {output_folder}/epics/epic-*-tech-spec.md (if available)
- Architecture: {output_folder}/architecture.md

**Your Task:**

You are implementing the next ready user story using AC-driven, context-based development.

**Process:**

1. **Find Next Ready Story:**
   - Read sprint status file: {sprint_artifacts}/sprint-status.yaml
   - Find first story with status "ready-for-dev"
   - If no "ready-for-dev" stories, check for "in-progress" stories (resume work)
   - If none found, halt and inform user no stories are ready

2. **Load Story and Context:**
   - Read the complete story file: {sprint_artifacts}/{story_key}.md
   - Parse sections: Story, Acceptance Criteria, Tasks/Subtasks, Dev Notes, Dev Agent Record, File List, Change Log, Status
   - Check for Story Context: {sprint_artifacts}/{story_key}.context.xml
   - If context exists, read it completely and pin it to active memory (it's your single source of truth)
   - If context doesn't exist, note it and proceed with story file only (quality will be lower)

3. **Check for Code Review Continuation:**
   - Check if "Senior Developer Review (AI)" section exists in story file
   - If yes: This is a resume after code review
     - Extract review action items from "Review Follow-ups (AI)" subsection
     - Count unchecked action items
     - Prioritize review follow-ups before continuing with regular tasks
     - Report: "Resuming story after code review. {X} action items remaining to address."
   - If no: This is fresh implementation
     - Report: "Starting fresh implementation of {story_key}"

4. **Mark Story In-Progress:**
   - Update sprint status: {story_key} status → "in-progress"
   - Save sprint status file

5. **Implement Continuously:**

   **This is critical:** Work through ALL tasks without stopping until the story is COMPLETE (all ACs satisfied, all tasks checked, all tests passing) OR you encounter an explicit blocker.

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
      - Add notes to Dev Agent Record → Debug Log about implementation approach
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
   - Update Status section to "ready-for-review"
   - Update sprint status: {story_key} status → "ready-for-review"

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

   **Recommended Next Step:** Run /bmad:phase-4:code-review to perform senior developer review
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

Work continuously until done or blocked. This reduces friction and speeds delivery.

**Story Context is Critical:**

If Story Context XML exists, it is your SINGLE SOURCE OF TRUTH:
- Trust it over model priors
- Reuse existing code it references
- Follow patterns it defines
- Use interfaces it provides

If Story Context is missing, you can still implement, but:
- Quality will be lower (more risk of hallucinations)
- You may rebuild what already exists
- Patterns may be inconsistent

Recommend user runs /bmad:phase-4:story-context first if context is missing.
```

### Step 6: Developer Works Continuously

The bmad-dev subagent will now:

- Load the next ready story
- Read Story Context XML (if available)
- Implement all tasks continuously
- Write tests
- Validate against acceptance criteria
- Update story file
- Report completion or blocker

**This is autonomous** - the developer works without pausing unless blocked or complete.

**Your role:** Provide clarification if the developer encounters a blocker (ambiguous requirement, missing dependency, etc.)

### Step 7: Review Implementation

Once the developer reports completion:

```bash
# Review the updated story file
cat {sprint_artifacts}/stories/{story_key}.md

# Check which files were changed
# (listed in File List section of story)

# Run tests to verify passing
{test command from architecture or tech spec}
```

**Verify:**
- All tasks are checked [x]
- File List is updated
- Change Log has entries
- Status is "ready-for-review"

### Step 8: Next Steps

After story implementation:

**Option A: Code Review (Recommended)**
```bash
/bmad:phase-4:code-review
```
Performs senior developer code review, provides feedback, creates action items.

**Option B: Mark Story Done (if review not needed)**
```bash
/bmad:phase-4:story-done
```
Marks story as complete in sprint status.

**Option C: Continue Next Story**
```bash
/bmad:phase-4:dev-story
```
Automatically finds and implements the next ready story.

### Step 9: Auto-Continue to Code Review

**Purpose:** Enable seamless workflow continuation to code review when story implementation completes.

**Process:**

1. **Check story completion:**
   - Was story marked as "ready-for-review"? (dev agent sets this when done)
   - Are all acceptance criteria satisfied?
   - Are all tests passing?

2. **Check prerequisites for code-review:**
   - Story file exists with implementation? ✓
   - Story status is "ready-for-review"? ✓
   - User input needed? ✗ (code-review runs autonomously)

3. **Auto-continue decision:**

   **IF** story implementation completed successfully (status = "ready-for-review"):

   ```
   🚀 Auto-continuing to code review...

   Senior developer review will validate implementation and provide feedback.
   ```

   **Execute next workflow:**
   Use SlashCommand tool with command: `/bmad:phase-4:code-review`

   **ELSE IF** developer reported a blocker:

   ```
   ⚠️  Story implementation blocked.

   Blocker: {blocker_description}

   Please resolve the blocker, then re-run /bmad:phase-4:dev-story to resume.
   ```

   **ELSE IF** story is still in progress:

   ```
   ⏸️  Story implementation in progress.

   Developer is still working. Check story file for progress updates.
   ```

**CRITICAL:**
- DO NOT ask user permission to continue if story is ready for review
- Code review is the natural next step after implementation
- Review runs autonomously and provides structured feedback
- User can address review feedback after review completes

**Rationale:**
Code review is part of the standard development flow. Once implementation is complete, it should automatically proceed to review without user intervention. This maintains workflow momentum and ensures quality gates are applied consistently.

---

## Key Principles

### 1. AC-Driven Development

Every line of code maps to a specific acceptance criterion:

- **Cite AC IDs** when implementing ("Implementing AC-1.2.3")
- **Don't add features** not in acceptance criteria (scope creep)
- **Don't skip AC items** - all must be satisfied
- **Trace changes to ACs** in Change Log

**Why:** Ensures traceability, prevents scope creep, guarantees requirements are met.

### 2. Story Context is Truth

Story Context XML is the single source of truth for implementation:

- **Existing code** - What interfaces and utilities already exist
- **Patterns** - How similar code is structured
- **Constraints** - Architectural rules to follow
- **Testing guidance** - How to write tests for this story

**Without Story Context:** Developer may hallucinate (invent non-existent code), rebuild existing utilities, or use inconsistent patterns.

**With Story Context:** Developer reuses existing code, follows established patterns, produces consistent implementation.

**Strongly recommended:** Run `/bmad:phase-4:story-context` before `/bmad:phase-4:dev-story` for best results.

### 3. Reuse Over Rebuild

The biggest waste in development is rebuilding what already exists:

- Authentication already configured? Use it.
- Database client exists? Reuse it.
- Validation utilities present? Don't rewrite them.
- Test fixtures available? Use them.

**Story Context tells you what exists.** Use it.

### 4. Continuous Execution

When implementing a story, work continuously without pausing:

- **Don't stop for "milestones"** - Keep working until done
- **Don't ask permission to continue** - Just execute
- **Don't pause for "reviews"** - Complete the work first

**Only halt for real blockers:**
- Missing information not in Story Context
- Ambiguous requirement needing user clarification
- External dependency unavailable
- Repeated implementation failures (3+ in a row)

**Why:** Reduces back-and-forth, speeds delivery, maintains flow state.

### 5. Tests Are Non-Negotiable

A story isn't done until tests are written and passing:

- **All tests pass** (100% pass rate)
- **Tests cover all ACs** - Every acceptance criterion has test coverage
- **Use existing test utilities** - Fixtures, factories, helpers from Story Context

**If tests fail:** Keep working. Fix code or tests until passing. Don't mark story complete with failing tests.

### 6. Update Story File Continuously

As you work, update the story file:

- **Check off tasks** as you complete them ([x])
- **Update File List** with changed files
- **Add Change Log entries** with timestamp and summary
- **Write Debug Log notes** about implementation approach
- **Update Status** when moving to next phase (ready-for-review, done)

**Why:** Maintains accurate status, provides audit trail, enables resume if interrupted.

---

## Examples

### Example 1: Implementing Authentication Story (First Story in Epic)

**Context:**
- Project: TurboMetrics SaaS analytics platform
- Story: `story-1.1-user-signup-login.md`
- Status: ready-for-dev
- Story Context: Generated (exists)
- Epic Tech Spec: Available

**Workflow Execution:**

1. **User runs command:**
   ```
   /bmad:phase-4:dev-story
   ```

2. **Workflow delegates to bmad-dev:**
   ```
   Delegating to bmad-dev (Developer agent)...
   ```

3. **Developer loads story:**
   ```
   [bmad-dev]:
   Found story: story-1.1-user-signup-login
   Status: ready-for-dev

   Loading story file... ✓
   Loading Story Context: story-1.1-user-signup-login.context.xml... ✓

   Story Context shows:
   - NextAuth.js already configured
   - Prisma User model exists
   - Will extend existing setup (not build custom auth)

   Marking story in-progress...
   ```

4. **Developer implements continuously:**
   ```
   [bmad-dev]:
   Task 1: Add Credentials provider to NextAuth
   Implementing AC-1.1.2, AC-1.1.3 (account creation, login)
   File: src/server/auth.ts
   Using bcrypt for password hashing (per tech spec)
   ✓ Complete

   Task 2: Create signup API endpoint
   Implementing AC-1.1.1, AC-1.1.2 (signup form, account creation)
   File: src/app/api/auth/signup/route.ts
   Validating email format, password strength
   ✓ Complete

   Task 3: Create signup form component
   Implementing AC-1.1.1 (signup form submission)
   File: src/app/signup/page.tsx
   Using React Hook Form (existing pattern)
   ✓ Complete

   Task 4: Write tests
   File: src/app/api/auth/signup/route.test.ts
   - Test signup with valid credentials ✓
   - Test signup with invalid email ✓
   - Test signup with weak password ✓
   - Test duplicate email handling ✓

   File: src/server/auth.test.ts
   - Test login with valid credentials ✓
   - Test login with invalid credentials ✓
   - Test password hashing ✓

   Running tests... 7/7 passing (100%)

   All tasks complete.
   All acceptance criteria satisfied.
   Story ready for code review.

   Updating story file...
   - Tasks: 4/4 checked
   - File List: 5 files changed
   - Change Log: 4 entries added
   - Status: ready-for-review

   Updating sprint status: story-1.1 → ready-for-review
   ```

5. **Developer reports completion:**
   ```
   [bmad-dev]:
   Story story-1.1-user-signup-login implementation complete.

   **Summary:**
   - Acceptance Criteria: 4/4 satisfied
   - Tasks: 4/4 completed
   - Tests: 7 written, 7/7 passing (100%)
   - Files Changed:
     - src/server/auth.ts (extended NextAuth config)
     - src/app/api/auth/signup/route.ts (new signup endpoint)
     - src/app/signup/page.tsx (new signup form)
     - src/app/api/auth/signup/route.test.ts (new tests)
     - src/server/auth.test.ts (extended tests)

   **Implementation Notes:**
   Extended existing NextAuth.js configuration rather than building custom authentication.
   Reused existing Prisma client and User model.
   Followed React Hook Form pattern from Story Context.
   All tests passing, no hallucinated code.

   **Status:** Ready for code review

   **Recommended Next Step:** Run /bmad:phase-4:code-review
   ```

6. **User reviews and continues:**
   ```
   # Review the story
   cat {sprint_artifacts}/stories/story-1.1-user-signup-login.md

   # Run code review
   /bmad:phase-4:code-review

   # Or implement next story
   /bmad:phase-4:dev-story
   ```

**Key Points:**
- Continuous execution (didn't pause between tasks)
- Reused existing code (NextAuth, Prisma)
- Cited AC IDs throughout
- All tests passing before completion
- Clear summary report

---

### Example 2: Implementing HIPAA-Compliant Export (Complex Compliance)

**Context:**
- Project: MediConnect patient portal
- Story: `story-3.2-export-patient-records.md`
- Status: ready-for-dev
- Story Context: Generated (includes PHI handling patterns)
- Epic Tech Spec: HIPAA compliance requirements documented

**Workflow Execution:**

1. **Developer loads story:**
   ```
   [bmad-dev]:
   Found story: story-3.2-export-patient-records
   Status: ready-for-dev

   Loading Story Context... ✓

   HIPAA compliance constraints detected:
   - PHI encryption utilities exist: src/lib/phi/encryption.ts
   - Audit logging required: src/lib/audit/logger.ts
   - Access control patterns defined

   Will use existing compliance utilities.
   ```

2. **Developer encounters blocker:**
   ```
   [bmad-dev]:
   ⚠️ BLOCKER: AC-3.2.5 requires consent verification before export.

   Story Context references consent checking pattern, but I don't see
   the consent verification utility interface.

   Need: Path to consent verification utility or clarification on consent handling.

   HALTING implementation.
   ```

3. **User provides missing info:**
   ```
   The consent utility is at src/lib/phi/consent.ts
   Use verifyConsent(patientId, providerId) function.
   ```

4. **Developer resumes:**
   ```
   [bmad-dev]:
   Consent utility located: src/lib/phi/consent.ts ✓

   Resuming implementation...

   Task 1: Add export button to patient page
   Implementing AC-3.2.1
   File: src/app/patients/[id]/page.tsx
   ✓ Complete

   Task 2: Create export API endpoint
   Implementing AC-3.2.2, AC-3.2.3, AC-3.2.4, AC-3.2.5
   File: src/server/api/routers/patient.ts

   Adding exportToPdf tRPC procedure:
   - Access verification using existing pattern ✓
   - Consent verification using src/lib/phi/consent.ts ✓
   - PDF generation using @react-pdf/renderer ✓
   - Audit logging using src/lib/audit/logger.ts ✓
   - Encryption using src/lib/phi/encryption.ts ✓

   All existing compliance utilities reused.
   No custom crypto or audit logic.

   ✓ Complete

   Task 3: Write compliance-focused tests
   File: src/server/api/routers/patient.test.ts
   - Test export with valid access ✓
   - Test export blocked without access ✓
   - Test export blocked without consent ✓
   - Test PDF content matches patient data ✓
   - Test audit log entry created ✓
   - Test PDF is encrypted ✓

   Running tests... 6/6 passing (100%)

   All HIPAA compliance requirements verified.
   Story ready for code review.
   ```

5. **Developer reports completion:**
   ```
   [bmad-dev]:
   Story story-3.2-export-patient-records implementation complete.

   **Summary:**
   - Acceptance Criteria: 5/5 satisfied
   - Tasks: 3/3 completed
   - Tests: 6 written, 6/6 passing (100%)

   **Compliance Verification:**
   ✓ PHI access audit logged
   ✓ Consent verified before export
   ✓ PDF encrypted in transit
   ✓ No custom crypto (used existing utilities)

   **Status:** Ready for code review

   **Recommended Next Step:** Run /bmad:phase-4:code-review
   ```

**Key Points:**
- Halted when missing information (consent utility)
- Didn't invent or assume - requested clarification
- Reused all existing compliance utilities
- Verified HIPAA requirements explicitly
- Clear blocker reporting and resume after clarification

---

### Example 3: Resuming After Code Review (Rework Scenario)

**Context:**
- Project: FitFlow mobile fitness tracker
- Story: `story-2.1-workout-tracking.md`
- Status: in-progress (previously implemented, code reviewed, changes requested)
- Code Review: Completed, 3 action items remain

**Story File Contains:**
```markdown
## Senior Developer Review (AI)

**Review Date:** 2025-01-12
**Reviewer:** Senior Dev Agent
**Outcome:** Changes Requested

**Action Items:**
- [x] HIGH: Add input validation for workout duration (must be > 0)
- [ ] MED: Extract repetitive form validation logic into utility function
- [ ] LOW: Add loading state to save button

### Tasks/Subtasks
- [x] Create workout form component
- [x] Create save workout API
- [x] Write tests
- [ ] **[AI-Review]** Add input validation for duration
- [ ] **[AI-Review]** Extract form validation to utility
- [ ] **[AI-Review]** Add button loading state
```

**Workflow Execution:**

1. **Developer detects code review continuation:**
   ```
   [bmad-dev]:
   ⏯️ Resuming Story After Code Review (2025-01-12)

   **Review Outcome:** Changes Requested
   **Action Items:** 3 total, 2 remaining
   **Priorities:** 0 High (done), 1 Medium, 1 Low

   **Strategy:** Will address remaining review follow-up tasks before
   continuing with any other work.
   ```

2. **Developer implements review action items:**
   ```
   [bmad-dev]:
   Task: Add input validation for duration [AI-Review MED]
   Implementing code review feedback.
   File: src/components/WorkoutForm.tsx

   Extracting form validation logic to utility function as requested.
   File: src/lib/validation/workoutValidation.ts (new)

   Updating WorkoutForm to use new validation utility.
   ✓ Complete

   Task: Add button loading state [AI-Review LOW]
   File: src/components/WorkoutForm.tsx
   Adding isLoading state to save button.
   ✓ Complete

   Running tests... 8/8 passing (100%)
   (includes 2 new tests for validation)

   All review action items addressed.
   Story ready for re-review.
   ```

3. **Developer reports completion:**
   ```
   [bmad-dev]:
   Story story-2.1-workout-tracking review follow-ups complete.

   **Code Review Action Items:**
   - [x] Add input validation (MED)
   - [x] Extract validation utility (MED)
   - [x] Add loading state (LOW)

   **Changes Made:**
   - Created src/lib/validation/workoutValidation.ts
   - Updated src/components/WorkoutForm.tsx
   - Added 2 new validation tests

   **Tests:** 8/8 passing (100%)

   **Status:** Ready for re-review

   **Recommended Next Step:** Run /bmad:phase-4:code-review again for re-review
   ```

**Key Points:**
- Detected code review continuation automatically
- Prioritized review action items
- Addressed all feedback
- Reported completion with reference to review items
- Ready for re-review

---

## Troubleshooting

### Problem: "No ready-for-dev stories found"

**Symptoms:** Workflow says no stories are ready to implement

**Diagnosis:**
```bash
# Check sprint status
cat {sprint_artifacts}/sprint-status.yaml | grep -A 1 development_status
```

**Solutions:**
1. **Stories are "drafted":** Run `/bmad:phase-4:story-ready` to mark as ready
2. **No stories exist:** Run `/bmad:phase-4:create-story` to create stories from epics
3. **Stories are "done":** All work complete! Run `/bmad:phase-4:create-story` for next epic

### Problem: "Story Context missing"

**Symptoms:** Developer reports "No context file found, proceeding with story only"

**Impact:** Lower quality implementation, risk of hallucinations, may rebuild existing code

**Solution:**
```bash
# Generate Story Context for next ready story
/bmad:phase-4:story-context
```

**Prevention:** Always run story-context before dev-story for best results

### Problem: "Developer halted - missing information"

**Symptoms:** Developer reports blocker and stops

**Example:**
```
BLOCKER: AC-2.3.4 requires consent verification, but consent utility
interface not provided in Story Context.
```

**Solutions:**
1. **Provide missing info:** Answer developer's question directly
2. **Update Story Context:** Re-run `/bmad:phase-4:story-context` if context is stale
3. **Clarify AC:** If requirement is ambiguous, update story file and re-run

### Problem: "Tests failing"

**Symptoms:** Developer reports tests not passing

**Diagnosis:** Developer should continue working until tests pass (continuous execution)

**If developer halts with failing tests:**
- Bug in implementation (developer should fix)
- Test environment issue (user needs to fix)
- Dependency missing (user needs to install)

**Solution:** Provide necessary environment fixes, then re-run `/bmad:phase-4:dev-story` to resume

### Problem: "Developer rebuilt existing code"

**Symptoms:** Code review reveals duplication of existing utilities

**Root Cause:** Story Context was missing or didn't include the existing utility

**Prevention:**
1. Always run `/bmad:phase-4:story-context` before implementation
2. Ensure story-context workflow finds all relevant existing code
3. Review Story Context XML before implementation starts

**Remediation:** Code review should catch this, create action item to use existing utility

### Problem: "Implementation doesn't match architecture"

**Symptoms:** Code uses different patterns than architecture specifies

**Root Cause:** Story Context didn't include architectural constraints, or developer ignored them

**Diagnosis:**
```bash
# Check if epic tech spec exists
cat {output_folder}/epics/epic-{n}-tech-spec.md

# Check if architecture patterns are documented
cat .bmad/architecture.md
```

**Solution:**
- Ensure epic-tech-context was run (creates epic tech spec)
- Ensure architecture workflow was run
- Story Context should reference these documents

**Remediation:** Code review creates action items to align with architecture

---

## Related Workflows

### Prerequisite Workflows

These should typically run **before** dev-story:

- **`/bmad:meta:workflow-init`** - Initialize project structure
- **`/bmad:phase-3:architecture`** - Define architectural patterns
- **`/bmad:phase-2:create-epics-and-stories`** - Break PRD into stories
- **`/bmad:phase-4:sprint-planning`** - Generate sprint status tracking
- **`/bmad:phase-4:story-context`** - Generate Story Context XML (STRONGLY RECOMMENDED)
- **`/bmad:phase-4:story-ready`** - Mark drafted story as ready-for-dev

### Follow-Up Workflows

These should typically run **after** dev-story:

- **`/bmad:phase-4:code-review`** - Perform senior developer code review (RECOMMENDED NEXT)
- **`/bmad:phase-4:story-done`** - Mark story as complete after review passes
- **`/bmad:phase-4:dev-story`** - Implement next ready story (repeat)

### Related Workflows

- **`/bmad/correct-course`** - Navigate significant changes during sprint
- **`/bmad:phase-4:retrospective`** - Review epic completion, extract lessons

---

## Success Criteria

Your story implementation is successful when:

**Completeness:**
- [ ] All acceptance criteria satisfied
- [ ] All tasks in Tasks/Subtasks section checked [x]
- [ ] All tests written and passing (100% pass rate)
- [ ] Story file updated (File List, Change Log, Dev Agent Record, Status)
- [ ] Sprint status updated (story marked ready-for-review or done)

**Quality:**
- [ ] Code follows existing patterns (per Story Context)
- [ ] Existing code reused appropriately (didn't rebuild)
- [ ] No hallucinated code (everything grounded in context or requirements)
- [ ] No scope creep (only AC features implemented)
- [ ] Architectural patterns followed

**Traceability:**
- [ ] Every change maps to specific acceptance criteria
- [ ] AC IDs cited in implementation notes
- [ ] File List includes all changed files
- [ ] Change Log documents implementation approach

**Testing:**
- [ ] Tests cover all acceptance criteria
- [ ] Tests use existing fixtures/factories (per Story Context)
- [ ] All tests passing (100% pass rate)
- [ ] No skipped or ignored tests

**Documentation:**
- [ ] Dev Agent Record → Completion Notes written
- [ ] Change Log has timestamped entries
- [ ] Debug Log includes implementation decisions
- [ ] Status reflects current state (ready-for-review, done)

**When all criteria met:** Story is complete and ready for code review or to be marked done.

---

## Notes

### Story Context is Critical

**With Story Context XML:**
- Developer reuses existing code
- Follows established patterns
- Produces consistent implementation
- Avoids hallucinations
- Higher quality, faster implementation

**Without Story Context XML:**
- Developer may hallucinate (invent non-existent code)
- May rebuild existing utilities
- May use inconsistent patterns
- Lower quality, slower implementation

**Strongly recommend:** Always run `/bmad:phase-4:story-context` before `/bmad:phase-4:dev-story`

### Continuous Execution Reduces Friction

Traditional development: Code a bit, pause for review, continue, pause again...

**BMAD dev-story:** Work continuously until done or blocked.

**Benefits:**
- Maintains flow state
- Reduces context switching
- Faster delivery
- Less back-and-forth

**Only halt for:**
- True completion (all ACs, all tasks, all tests passing)
- Explicit blocker (missing info, ambiguous requirement)
- User instruction to stop

**Not reasons to halt:**
- "Made significant progress"
- "Reached a milestone"
- "Time for a review"
- "Session boundary"

### AC-Driven Development is Strict

Every line of code should map to an acceptance criterion:

**Scope control:**
- If it's not in AC, don't build it (prevents scope creep)
- If AC isn't satisfied, story isn't done (ensures completeness)

**Traceability:**
- Change Log entries cite AC IDs
- Code comments reference ACs
- Tests map to ACs

**This prevents feature bloat and ensures requirements are met.**

### Tests Are Non-Negotiable

A story isn't done until:
- All tests written
- All tests passing (100% pass rate)
- Tests cover all acceptance criteria

**No exceptions.** If tests fail, keep working. Don't mark story complete.

### Developer Agent Knows When to Ask

The bmad-dev agent is trained to:
- **Halt when missing information** (don't guess or invent)
- **Ask clarifying questions** when requirements are ambiguous
- **Request missing dependencies** when needed
- **Work continuously** when path is clear

**Trust the developer** to know when to stop and ask vs. when to continue.

### Code Review is the Next Step

After story implementation, the recommended next step is code review:

```bash
/bmad:phase-4:code-review
```

Code review:
- Validates AC satisfaction
- Checks architectural alignment
- Reviews code quality
- Ensures tests are comprehensive
- Creates action items for issues

**Only after code review passes** should you mark story done.

---

**Ready to implement stories?** Run `/bmad:phase-4:dev-story` when you have stories marked "ready-for-dev" in your sprint status.

**Best practice flow:**
1. `/bmad:phase-4:story-context` - Generate context
2. `/bmad:phase-4:dev-story` - Implement story
3. `/bmad:phase-4:code-review` - Review implementation
4. Address review feedback (re-run `/bmad:phase-4:dev-story` if needed)
5. `/bmad:phase-4:story-done` - Mark complete

**Core Philosophy:** AC-driven development, Story Context is truth, reuse over rebuild, continuous execution, tests are non-negotiable.
