---
description: Create next user story from epics/PRD with architecture context, learning from previous stories
---

# Create Story

## Purpose

This workflow generates comprehensive story files from epics that include:

- User story statement (as a / I want / so that)
- Acceptance criteria from epic/PRD
- Tasks and subtasks mapped to ACs
- Dev notes with architecture patterns and constraints
- **Learnings from previous story** (NEW files, patterns, services to REUSE)
- References to source documents
- Project structure alignment notes

**Key Principle:** **Previous Story Continuity** - Extract learnings, new services, and files from the last completed story to prevent recreating code and maintain architectural consistency.

**Prerequisites:**
- BMAD plugin installed in Claude Code
- Project initialized (`/bmad:meta:workflow-init`)
- Epics created (`/bmad:phase-2:create-epics-and-stories`)
- Sprint planning run (`/bmad:phase-4:sprint-planning`)
- Epic contexted (optional but recommended)

**Required files:**
- `.bmad/config.yaml` - Project configuration
- `{sprint_artifacts}/sprint-status.yaml` - Story tracking
- `{documentation_dir}/epics.md` OR `{documentation_dir}/epics/epic-{N}.md` - Epic files with stories
- `.bmad/PRD.md` (optional) - Product requirements
- `.bmad/architecture.md` (optional) - Architecture constraints
- `{sprint_artifacts}/tech-spec-epic-{N}.md` (optional) - Epic tech spec

## Variables

**From .bmad/config.yaml:**
- `{documentation_dir}` - Directory where documentation files are stored (e.g., `.bmad`)
- `{user_name}` - Author name for story attribution
- `{sprint_artifacts}` - Directory for sprint-related files (e.g., `.bmad/sprint-artifacts`)
- `{bmad_folder}` - BMAD installation directory (e.g., `.bmad`)

**Derived during workflow:**
- `{epic_num}` - Epic number extracted from story key (e.g., `1` from `1-3-password-reset`)
- `{story_num}` - Story number within epic (e.g., `3` from `1-3-password-reset`)
- `{story_title}` - Kebab-case story title (e.g., `password-reset`)
- `{story_id}` - Dotted story identifier (e.g., `1.3`)
- `{story_key}` - Full story key (e.g., `1-3-password-reset`)
- `{previous_story_key}` - Key of the immediately preceding story for learning extraction
- `{update_mode}` - Boolean flag indicating if updating existing story vs creating new

**File paths:**
- Story output: `{sprint_artifacts}/stories/{story_key}.md`
- Sprint status: `{sprint_artifacts}/sprint-status.yaml`
- Epic tech spec: `{sprint_artifacts}/tech-spec-epic-{epic_num}.md`
- Epic file (whole): `{documentation_dir}/epics.md`
- Epic file (sharded): `{documentation_dir}/epics/epic-{epic_num}.md`
- Previous story: `{sprint_artifacts}/stories/{previous_story_key}.md`

## Instructions

### Step 1: Load Configuration

Read project configuration from `.bmad/config.yaml` to extract:
- `documentation_dir` - Where docs are stored
- `user_name` - Author name
- `sprint_artifacts` - Sprint files location
- `bmad_folder` - BMAD install location

### Step 2: Find Next Backlog Story

**Read sprint status file:**
- File: `{sprint_artifacts}/sprint-status.yaml`
- Read COMPLETELY from start to end (order matters)

**Find first backlog story:**
- Look under `development_status` section
- Find first entry with status "backlog"
- Key must match pattern: `{epic}-{story}-{name}`
- Must NOT be an epic or retrospective entry

**If no backlog stories found:**
```
📋 No backlog stories found

All stories are either drafted or completed.

Options:
1. Run /bmad:phase-4:sprint-planning to refresh tracking
2. Add more stories to epic files
3. Check if sprint is complete
```
→ HALT

**Extract from story key** (e.g., "1-3-password-reset"):
- `epic_num`: 1
- `story_num`: 3
- `story_title`: "password-reset"
- `story_id`: "1.3"
- `story_key`: "1-3-password-reset"

**Verify story exists in epic files:**

If not found:
```
⚠️ Story {story_key} not found in epics.md

Epic files and sprint-status.yaml are out of sync.

Run /bmad:phase-4:sprint-planning to resync.
```
→ HALT

**Check if story file already exists:**

Path: `{sprint_artifacts}/stories/{story_key}.md`

If exists:
```
ℹ️ Story file already exists: {story_file}

Will update existing story rather than creating new one.
```
→ Set `update_mode = true`

### Step 3: Load Previous Story and Extract Learnings

**CRITICAL: Previous Story Continuity**

**Find previous story:**
1. In sprint-status.yaml, find current story key location
2. Identify entry IMMEDIATELY ABOVE current story
3. That's the previous story key

Example:
```yaml
1-2-user-authentication: done      # ← Previous
1-3-password-reset: backlog        # ← Current
```

**If previous story exists:**

Check status: `done`, `review`, or `in-progress`

**If status indicates work done:**

Load COMPLETE previous story file: `{sprint_artifacts}/stories/{previous_story_key}.md`

**Parse ALL sections:**

**A) Dev Agent Record → Completion Notes:**
Extract:
- New services/classes created
- Architectural decisions
- Technical debt items
- Recommendations for next story

**B) Dev Agent Record → File List:**
Extract:
- NEW files (understand new capabilities)
- MODIFIED files (track changes)
- DELETED files (removed functionality)

**C) Dev Notes:**
Extract:
- Patterns established
- TODOs for future stories
- Constraints discovered

**D) Senior Developer Review (if present):**
Extract:
- Review outcome
- Unresolved action items (unchecked [ ] items)
- Key findings affecting this story
- Architectural concerns

**E) Story Status:**
Note if "done" (confirmed complete) or "in-progress"/"review" (what's pending)

**Store learnings as structured data:**
```javascript
{
  new_files: [list with descriptions],
  modified_files: [list with context],
  new_services: [list with method signatures and usage],
  architectural_decisions: [list of decisions made],
  technical_debt: [list of deferred items],
  warnings_for_next: [list of recommendations],
  review_findings: [list from review section],
  pending_items: [unchecked action items]
}
```

**If no previous story or not yet implemented:**

Set: `previous_story_learnings = "First story in epic"` or `"Previous story not yet implemented"`

### Step 4: Load Source Documents

**Load documents in priority order:**

1. **Epic Tech Spec** (if exists)
   - Path: `{sprint_artifacts}/tech-spec-epic-{epic_num}.md`
   - Most detailed, epic-scoped requirements

2. **Epics File** (required)
   - Whole: `{documentation_dir}/epics.md`
   - Sharded: `{documentation_dir}/epics/epic-{epic_num}.md` (SELECTIVE LOAD - only this epic)
   - Contains acceptance criteria and story breakdown

3. **PRD** (if exists)
   - Whole: `.bmad/PRD.md`
   - Sharded: `.bmad/PRD/index.md` + sections
   - Business requirements and context

4. **Architecture** (if exists)
   - Whole: `.bmad/architecture.md`
   - Sharded: `.bmad/architecture/index.md` + sections
   - Architecture constraints and patterns

**Load completely:**
- Read all found documents
- Store content for citation
- Note which documents are available

### Step 5: Extract Requirements and Derive Story

**From tech spec or epic file:**

Extract for this specific story:
- Epic title/summary
- Acceptance criteria
- Component references
- Technical requirements

**From architecture:**

Extract relevant:
- Constraints
- Patterns
- Component boundaries
- Testing guidance

**Derive user story:**

Format:
```
As a [role from requirements],
I want [capability from ACs],
so that [benefit from PRD/tech spec].
```

**Grounded in sources - NO invention**

Example:
```
As a user,
I want to reset my password via email link,
so that I can regain access to my account if I forget my password.
```

### Step 6: Assemble Acceptance Criteria

**From tech spec (preferred):**

Extract ACs for this story, preserving numbering and exact wording.

**From epic file (fallback):**

Look for story section with acceptance criteria:
```markdown
### Story 1.3: Password Reset

**Acceptance Criteria:**
- User can request reset
- Email with secure link sent
- Link expires in 1 hour
```

**From PRD (last resort):**

Extract relevant requirements:
- Search for story topic in PRD
- Derive minimal, testable criteria
- NO invention - only what's explicit

### Step 7: Create Tasks and Subtasks

**Map tasks directly to ACs:**

```markdown
## Tasks / Subtasks

- [ ] Implement password reset request endpoint (AC: #1)
  - [ ] Create POST /auth/reset-password endpoint
  - [ ] Generate secure reset token
  - [ ] Store token with expiry in database
  - [ ] Send email with reset link

- [ ] Implement reset token validation (AC: #2)
  - [ ] Verify token exists and not expired
  - [ ] Return error if token invalid
  - [ ] Delete token after use

- [ ] Add tests (All ACs)
  - [ ] Unit tests for token generation
  - [ ] Unit tests for password validation
  - [ ] Integration tests for reset flow
  - [ ] E2E test for complete flow
```

**Include explicit testing:**
- Per testing standards from architecture
- Follow existing test framework patterns
- Cover all acceptance criteria

### Step 8: Add Dev Notes

**Architecture patterns:**
```markdown
## Dev Notes

**Architecture Patterns:**
- Use RESTful API conventions per architecture
- Follow repository pattern for database access
- Use middleware for authentication
- Email service for notifications

**Testing Standards:**
- Jest for unit tests
- Supertest for API tests
- Minimum 80% code coverage
- All endpoints must have e2e tests
```

**Constraints from architecture:**
```markdown
**Constraints:**
- Password must be hashed with bcrypt (12+ rounds)
- Reset tokens must be cryptographically secure
- Email sending must be async (don't block request)
- Token expiry: 1 hour (configurable)
```

**Source tree components:**
```markdown
**Components to Touch:**
- src/routes/auth.js - Add reset endpoints
- src/services/AuthService.js - Reset logic
- src/services/EmailService.js - Send emails
- src/repositories/UserRepository.js - Update password
- tests/integration/auth.test.js - Add tests
```

### Step 9: Add Learnings from Previous Story

**CRITICAL SECTION** - Prevents recreating existing code

**If previous story learnings exist:**

```markdown
### Learnings from Previous Story

**From Story {previous_story_key} (Status: {status})**

**Services to REUSE (DO NOT recreate):**
- `AuthService` base class at `src/services/AuthService.js`
  - Use `AuthService.hashPassword()` for password hashing
  - Use `AuthService.generateToken()` for JWT creation
- `UserRepository` at `src/repositories/UserRepository.js`
  - Use `UserRepository.update()` for password update
  - Use `UserRepository.findByEmail()` for user lookup

**Files Created (Available for this story):**
- `src/middleware/authMiddleware.js` - Request authentication
- `tests/integration/auth.test.js` - Auth test suite (follow patterns)

**Architectural Decisions to Maintain:**
- JWT authentication (not session-based)
- bcrypt with 12 salt rounds (already configured)
- httpOnly cookies for tokens

**Technical Debt to Address:**
- Email verification was deferred - consider if needed for reset flow

**Pending Review Items:**
- Rate limiting recommended - apply to reset endpoint too

[Source: stories/{previous_story_key}.md#Dev-Agent-Record]
```

**Format priorities:**
- **Services to REUSE** - Most important (prevents duplication)
- **Files Created** - What's available
- **Architectural Decisions** - Maintain consistency
- **Technical Debt** - Consider addressing
- **Pending Review Items** - Apply learnings

**Cite previous story file**

### Step 10: Add Project Structure Alignment

**If unified-project-structure.md exists:**

```markdown
### Project Structure Notes

**Alignment with Project Structure:**
- Auth routes: `src/routes/auth.js` (existing)
- Services: `src/services/` directory
- Repositories: `src/repositories/` directory
- Tests: `tests/integration/` for API tests

**Expected Paths:**
- Reset endpoint: `/api/auth/reset-password`
- Confirm endpoint: `/api/auth/reset-password/confirm`

**No conflicts detected** - aligns with established structure
```

### Step 11: Add References

```markdown
### References

**Technical Details:**
- Password requirements: [Source: .bmad/architecture.md#Security]
- Email service config: [Source: .bmad/architecture.md#Email]
- Token expiry: [Source: {sprint_artifacts}/tech-spec-epic-{epic_num}.md#Security]
- AC definitions: [Source: {documentation_dir}/epics.md#Epic-{epic_num}-Story-{story_num}]

**Previous Story:**
- Service usage: [Source: stories/{previous_story_key}.md#Completion-Notes]
```

### Step 12: Create Story File

**File path:** `{sprint_artifacts}/stories/{story_key}.md`

Example: `{sprint_artifacts}/stories/1-3-password-reset.md`

**Full structure:**

```markdown
# Story {story_id}: {Story Title}

Status: drafted

## Story

As a [role],
I want [capability],
so that [benefit].

## Acceptance Criteria

1. [Criterion from sources]
2. [Criterion from sources]
3. [Criterion from sources]

## Tasks / Subtasks

[Tasks from Step 7]

## Dev Notes

[Architecture patterns, constraints, components from Step 8]

### Learnings from Previous Story

[Critical learnings from Step 9]

### Project Structure Notes

[Alignment notes from Step 10]

### References

[Citations from Step 11]

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added by story-context workflow -->

### Agent Model Used

Claude Sonnet 4.5

### Debug Log References

### Completion Notes List

### File List
```

**Save to file**

### Step 13: Update Sprint Status

**Update sprint-status.yaml:**

File: `{sprint_artifacts}/sprint-status.yaml`

1. Load FULL file
2. Find `development_status[{story_key}]`
3. Verify current status is "backlog"
4. Update: `development_status[{story_key}] = "drafted"`
5. Save file, preserving ALL comments and structure

**If story key not found:**
```
⚠️ Could not update story status: {story_key} not found

Story file created but sprint-status not updated.

Run /bmad:phase-4:sprint-planning to resync.
```

## Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│ START: Create Story Workflow                                    │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 1. Load Configuration                                           │
│    - Read .bmad/config.yaml                                     │
│    - Extract paths and settings                                 │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. Find Next Backlog Story                                      │
│    - Read sprint-status.yaml completely                         │
│    - Find first "backlog" status story                          │
│    - Extract epic_num, story_num, story_key                     │
│    - Verify story exists in epic files                          │
└─────────────────────────────────────────────────────────────────┘
                            ↓
                    ┌───────────────┐
                    │ Found backlog │ No → [HALT: No backlog stories]
                    │    story?     │
                    └───────────────┘
                            ↓ Yes
┌─────────────────────────────────────────────────────────────────┐
│ 3. Load Previous Story and Extract Learnings                   │
│    - Find previous story key (entry above current)              │
│    - Check status (done/review/in-progress)                     │
│    - Load complete previous story file                          │
│    - Parse: Completion Notes, File List, Dev Notes, Review      │
│    - Extract: new_files, new_services, architectural_decisions, │
│      technical_debt, warnings, review_findings, pending_items   │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. Load Source Documents                                        │
│    - Epic tech spec (if exists)                                 │
│    - Epic file (selective load - only this epic)                │
│    - PRD (if exists)                                            │
│    - Architecture (if exists)                                   │
│    - Store all content for citation                             │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 5. Extract Requirements and Derive Story                        │
│    - Extract epic context, ACs, technical requirements          │
│    - Extract architecture constraints and patterns              │
│    - Derive user story (As a/I want/so that)                    │
│    - Ground in sources - NO invention                           │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 6. Assemble Acceptance Criteria                                 │
│    - From tech spec (preferred)                                 │
│    - OR from epic file                                          │
│    - OR from PRD (last resort)                                  │
│    - Preserve exact wording                                     │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 7. Create Tasks and Subtasks                                    │
│    - Map directly to ACs                                        │
│    - Include testing subtasks                                   │
│    - Cite architecture mandates                                 │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 8. Add Dev Notes                                                │
│    - Architecture patterns                                      │
│    - Constraints from architecture                              │
│    - Testing standards                                          │
│    - Components to touch                                        │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 9. Add Learnings from Previous Story                            │
│    - Services to REUSE (prevent duplication)                    │
│    - Files created (what's available)                           │
│    - Architectural decisions (maintain consistency)             │
│    - Technical debt (consider addressing)                       │
│    - Review findings (apply proactively)                        │
│    - Cite previous story file                                   │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 10. Add Project Structure Alignment                             │
│     - Align file paths with project structure                   │
│     - Note expected paths and locations                         │
│     - Identify any conflicts                                    │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 11. Add References                                              │
│     - Cite all technical details                                │
│     - Reference source documents                                │
│     - Link to previous story                                    │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 12. Create Story File                                           │
│     - Assemble complete story markdown                          │
│     - Path: {sprint_artifacts}/stories/{story_key}.md           │
│     - Save with all sections                                    │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 13. Update Sprint Status                                        │
│     - Load sprint-status.yaml                                   │
│     - Update story status: backlog → drafted                    │
│     - Preserve comments and structure                           │
│     - Save updated file                                         │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ END: Report completion                                          │
└─────────────────────────────────────────────────────────────────┘

Key Decision Points:
- If no backlog stories → HALT with guidance
- If story not in epic files → HALT with sync instructions
- If previous story exists with work done → Extract learnings
- If no previous story → Mark as "First story in epic"
- If story file exists → Update mode instead of create mode

Data Flow:
config.yaml → paths and settings
sprint-status.yaml → story_key, previous_story_key
previous story file → learnings structure
epic/tech-spec/PRD/architecture → requirements, ACs, constraints
→ assembled story file → saved to stories/ directory
→ sprint-status.yaml updated (backlog → drafted)
```

## Report

**Success Report Format:**

```
✅ Story Created Successfully!

**Story Details:**

- Story ID: {story_id}
- Story Key: {story_key}
- File: {sprint_artifacts}/stories/{story_key}.md
- Status: drafted (was backlog)

**Learnings Applied:**
- Reusing {ServiceName} from Story {previous_story_id}
- Reusing {ComponentName} from Story {previous_story_id}
- Following established {pattern} pattern
- Addressing pending review item: {item}
- Addressing technical debt: {debt_item}

**Next Steps:**

1. Review the drafted story
2. Run /bmad:phase-4:story-context to generate context and mark ready-for-dev
3. OR run /bmad:phase-4:story-ready to manually mark ready

**⚠️ Context-intensive workflows ahead - consider restarting agent**
```

**Error Report Formats:**

**No backlog stories found:**
```
📋 No backlog stories found

All stories are either drafted or completed.

Options:
1. Run /bmad:phase-4:sprint-planning to refresh tracking
2. Add more stories to epic files
3. Check if sprint is complete
```

**Story not found in epic files:**
```
⚠️ Story {story_key} not found in epics.md

Epic files and sprint-status.yaml are out of sync.

Run /bmad:phase-4:sprint-planning to resync.
```

**Previous story file not found:**
```
⚠️ Previous story file not found: {previous_story_key}.md

Continuing without previous story learnings.

This may result in recreating existing code.
```

**Sprint status update failed:**
```
⚠️ Could not update story status: {story_key} not found

Story file created but sprint-status not updated.

Run /bmad:phase-4:sprint-planning to resync.
```

**Story file already exists:**
```
ℹ️ Story file already exists: {story_file}

Updated existing story rather than creating new one.

Status: {old_status} → drafted
```

**Report Content Guidelines:**

1. **Always include:**
   - Story ID and key
   - File path (absolute)
   - Status transition (old → new)
   - Applied learnings summary
   - Next steps

2. **Learnings summary should highlight:**
   - Services/components being reused (prevents duplication)
   - Architectural patterns maintained (consistency)
   - Review items applied (quality improvement)
   - Technical debt addressed (code health)

3. **Next steps should:**
   - Guide user to story-context workflow (recommended path)
   - Mention story-ready as alternative
   - Warn about context-intensive workflows

4. **Warnings to include:**
   - Context exhaustion risk
   - Out-of-sync files detected
   - Missing optional documents
   - Update mode vs create mode

5. **Success criteria checklist:**
   - User story statement present
   - Acceptance criteria from sources
   - Tasks mapped to ACs
   - Dev notes comprehensive
   - Previous learnings extracted (if applicable)
   - References cited
   - Sprint status updated

**Related Workflows:**

**Before this workflow:**
1. `/bmad:meta:workflow-init` - Initialize project
2. `/bmad:phase-2:prd` - Create requirements
3. `/bmad:phase-2:create-epics-and-stories` - Create epics
4. `/bmad:phase-4:sprint-planning` - Initialize tracking
5. `/bmad:phase-4:epic-tech-context` - Context epic (recommended)

**After this workflow:**
1. `/bmad:phase-4:story-context` - Generate context (recommended)
2. `/bmad:phase-4:story-ready` - Mark ready manually
3. `/bmad:phase-4:dev-story` - Implement story

**Parallel workflows:**
- `/bmad:phase-4:create-story` - Run for each backlog story
- `/bmad:workflow-status` - Check current phase

## Examples

### Example 1: First Story in Epic

**Context:**
- Epic 1, Story 1: User Registration
- First story, no predecessor
- Epic tech spec exists

**Workflow execution:**

1. **Find story:** `1-1-user-registration` with status `backlog`
2. **Previous story:** None (first in epic)
3. **Load documents:** Tech spec, Epic, Architecture
4. **Extract ACs:** 5 criteria from tech spec
5. **Create tasks:** 10 tasks mapping to ACs
6. **Dev notes:** Architecture patterns, constraints, new components
7. **No previous learnings** (first story)

**Report:**
```
✅ Story Created: 1-1-user-registration

File: .bmad/sprint-artifacts/stories/1-1-user-registration.md
Status: backlog → drafted
ACs: 5
Tasks: 10

No previous story (first in epic)

Next: Run /bmad:phase-4:story-context
```

### Example 2: With Previous Story Learnings

**Context:**
- Epic 2, Story 3: Appointment Reminder System
- Previous story (2.2): Appointment Booking (done)
- Previous story created services and schemas

**Workflow execution:**

1. **Find story:** `2-3-appointment-reminder` with status `backlog`
2. **Previous story:** `2-2-appointment-booking` status `done`
3. **Extract learnings:**
   - New files: AppointmentService.js, AppointmentRepository.js, Appointment.js
   - New services: AppointmentService.create(), AppointmentService.getByPatient()
   - Decisions: PostgreSQL JSONB, UTC timezones, 30-min slots
   - Technical debt: Email reminders deferred (addressed in THIS story)
4. **Load documents:** Tech spec, Epic, Previous story
5. **Extract ACs:** 5 criteria for reminder system
6. **Create tasks:** 12 tasks including service reuse
7. **Dev notes with learnings:** Explicit REUSE instructions

**Report:**
```
✅ Story Created: 2-3-appointment-reminder

File: .bmad/sprint-artifacts/stories/2-3-appointment-reminder.md
Status: backlog → drafted
ACs: 5
Tasks: 12

Learnings Applied:
- Reusing AppointmentService (don't recreate)
- Reusing AppointmentRepository
- Following UTC timezone pattern
- Addressing technical debt from Story 2.2

Next: Run /bmad:phase-4:story-context
```

### Example 3: With Pending Review Items

**Context:**
- Epic 3, Story 2: Workout History View
- Previous story (3.1): Workout Creation (review - changes requested)
- Previous story has pending review items

**Workflow execution:**

1. **Find story:** `3-2-workout-history` with status `backlog`
2. **Previous story:** `3-1-workout-creation` status `review`
3. **Extract learnings including review:**
   - Services: WorkoutService.ts
   - Review findings: Missing pagination, no loading states, incomplete accessibility
   - Pending items: [High] Add pagination, [Medium] Loading spinners, [Medium] A11y labels
4. **Create tasks applying review learnings:**
   - Implement pagination from start
   - Add loading states throughout
   - Include accessibility labels
5. **Dev notes highlight proactive fixes**

**Report:**
```
✅ Story Created: 3-2-workout-history

File: .bmad/sprint-artifacts/stories/3-2-workout-history.md
Status: backlog → drafted
ACs: 4
Tasks: 15

Learnings Applied:
- Reusing WorkoutService
- Applying review findings (pagination, loading, a11y)
- Addressing technical debt (offline sync)

Review items from Story 3.1 applied proactively!

Next: Run /bmad:phase-4:story-context
```

## Troubleshooting

### No backlog stories found

**Message:**
```
📋 No backlog stories found

All stories drafted or completed.
```

**Solutions:**
1. Run `/bmad:phase-4:sprint-planning` to refresh
2. Add more stories to epic files
3. Check if sprint is complete

### Story not found in epic files

**Error:**
```
⚠️ Story {story_key} not found in epics.md

Sprint-status and epic files out of sync.
```

**Solution:**
- Run `/bmad:phase-4:sprint-planning` to resync
- OR add missing story to epic files

### Previous story file not found

**Warning:**
```
⚠️ Previous story file not found: {previous_story_key}.md

Continuing without previous story learnings.
```

**Impact:** Won't have learnings, may recreate code

**Solution:**
- Check if previous story file exists
- If missing, create it with `/bmad:phase-4:create-story`

### No epic tech spec found

**Warning:**
```
ℹ️ No tech spec found for Epic {N}

Using epic file for requirements.
```

**Impact:** Less detailed requirements

**Solution:**
- Run `/bmad:phase-4:epic-tech-context` to create tech spec
- OR continue with epic file (acceptable)

### Story file already exists

**Info:**
```
ℹ️ Story file already exists: {story_file}

Updating existing story.
```

**Behavior:** Updates existing file instead of creating new one

**This is OK:** Safe to re-run workflow

## Configuration

Reads from `.bmad/config.yaml`:

```yaml
documentation_dir: .bmad
user_name: "Your Name"
sprint_artifacts: .bmad/sprint-artifacts
bmad_folder: .bmad
```

**Output file:**
- `{sprint_artifacts}/stories/{epic}-{story}-{title}.md`
- Example: `.bmad/sprint-artifacts/stories/1-3-password-reset.md`

**Input files:**
- `{sprint_artifacts}/sprint-status.yaml` - Story tracking
- `{documentation_dir}/epics.md` OR `{documentation_dir}/epics/epic-{N}.md` - Epic files
- `{sprint_artifacts}/tech-spec-epic-{N}.md` - Tech spec (optional)
- `.bmad/PRD.md` - Requirements (optional)
- `.bmad/architecture.md` - Architecture (optional)
- Previous story file (for learnings)

## Key Principles

### 1. Previous Story Continuity

**Learn from predecessor:**
- Extract new files/services
- Understand architectural decisions
- Note technical debt
- Reuse, don't recreate

**Benefits:**
- Prevents code duplication
- Maintains consistency
- Applies review learnings
- Faster development

### 2. REUSE Over RECREATE

**Explicit instruction:**
- List services to REUSE
- Show file paths
- Explain how to use them
- Prevent reinventing

**Example:**
```
Use AuthService.hashPassword() - DO NOT recreate hashing logic
```

### 3. Grounded in Sources

**No invention:**
- All ACs from tech spec/epic/PRD
- All constraints from architecture
- All patterns from previous stories
- Citations for everything

### 4. Comprehensive Dev Notes

**Everything dev needs:**
- Architecture patterns
- Constraints
- Components to touch
- Previous story learnings (CRITICAL)
- Testing standards
- References

### 5. Selective Epic Loading

**Efficiency:**
- Load only the specific epic needed
- Not all epics (unlike sprint-planning)
- Reduces token usage
- Faster execution

## Notes

- **Previous story continuity:** CRITICAL feature - prevents code duplication
- **REUSE over RECREATE:** Explicit instruction to use existing services
- **Grounded in sources:** No invention, everything from documents
- **Selective epic loading:** Loads only needed epic (efficiency)
- **Comprehensive dev notes:** Everything developer needs
- **Review learnings applied:** Proactively address previous issues
- **Non-interactive:** Runs automatically without user prompts
- **Updates sprint status:** Marks story drafted
