---
description: Create next user story from epics/PRD with architecture context, learning from previous stories
---

# Create Story

Creates detailed story files from epics with acceptance criteria, tasks, dev notes, and learnings from previous stories to maintain continuity and prevent recreating existing code.

## What This Does

This workflow generates a **comprehensive story file** that includes:

- User story statement (as a / I want / so that)
- Acceptance criteria from epic/PRD
- Tasks and subtasks mapped to ACs
- Dev notes with architecture patterns and constraints
- **Learnings from previous story** (NEW files, patterns, services to REUSE)
- References to source documents
- Project structure alignment notes

**Key Principle:** **Previous Story Continuity** - Extract learnings, new services, and files from the last completed story to prevent recreating code and maintain architectural consistency.

## Prerequisites

Before running this workflow:

- [ ] BMAD plugin installed in Claude Code
- [ ] Project initialized (`/bmad:meta:workflow-init`)
- [ ] Epics created (`/bmad:phase-2:create-epics-and-stories`)
- [ ] Sprint planning run (`/bmad:phase-4:sprint-planning`)
- [ ] Epic contexted (optional but recommended)

**Required files:**
- `.bmad/config.yaml` - Project configuration
- `.bmad/sprint-artifacts/sprint-status.yaml` - Story tracking
- `.bmad/epics.md` OR `.bmad/epics/epic-{N}.md` - Epic files with stories
- `.bmad/PRD.md` (optional) - Product requirements
- `.bmad/architecture.md` (optional) - Architecture constraints
- `.bmad/sprint-artifacts/tech-spec-epic-{N}.md` (optional) - Epic tech spec

## How It Works

### Story Discovery

**Find next backlog story:**
1. Read `sprint-status.yaml` completely
2. Find FIRST story with status "backlog"
3. Extract epic number, story number, title
4. Verify story exists in epic files

**If no backlog stories found:**
```
📋 No backlog stories found

All stories are either drafted or completed.

Options:
1. Run /bmad:phase-4:sprint-planning to refresh tracking
2. Add more stories to epic files
3. Check if sprint is complete
```

### Previous Story Learning (CRITICAL)

**Find previous story:**
1. Load sprint-status.yaml completely
2. Find current story key
3. Identify story entry IMMEDIATELY ABOVE current story
4. If previous story exists and has status "done", "review", or "in-progress":
   - Load COMPLETE previous story file
   - Extract comprehensive learnings

**Parse previous story sections:**

**A) Dev Agent Record → Completion Notes:**
- New patterns/services created (to REUSE, not recreate)
- Architectural deviations or decisions made
- Technical debt deferred
- Warnings/recommendations for next story
- Interfaces/methods created

**B) Dev Agent Record → File List:**
- Files created (NEW) - understand new capabilities
- Files modified (MODIFIED) - track evolving components
- Files deleted (DELETED) - removed functionality

**C) Dev Notes:**
- "Future story" notes or TODOs
- Patterns established
- Constraints discovered

**D) Senior Developer Review (if present):**
- Review outcome
- Unresolved action items (unchecked [ ] items)
- Key findings affecting this story
- Architectural concerns

**E) Story Status:**
- If "done" - confirmed complete
- If "in-progress" or "review" - note what's pending

**Store learnings:**
```javascript
{
  new_files: [list],
  modified_files: [list],
  new_services: [list with descriptions],
  architectural_decisions: [list],
  technical_debt: [list],
  warnings_for_next: [list],
  review_findings: [list],
  pending_items: [unchecked action items]
}
```

### Document Loading

**Priority order:**
1. **Epic tech spec** (epic-scoped) - Most detailed
2. **Epics file** (acceptance criteria and breakdown)
3. **PRD** (business requirements and constraints)
4. **Architecture** (architecture constraints)

**Selective epic loading:**
- If sharded: Load ONLY the specific epic file needed
- If whole: Load and extract relevant epic

### Story Creation

**Derive user story:**
- Extract from epic/tech spec/PRD
- Clear role, action, benefit
- Grounded in source documents

**Assemble acceptance criteria:**
- From tech spec (preferred)
- Or from epic file
- Or derive from PRD (no invention)

**Create tasks:**
- Map directly to ACs
- Include testing subtasks
- Cite architecture mandates

**Add dev notes:**
- Architecture patterns
- Constraints
- Testing standards
- **Learnings from previous story** ← CRITICAL

**Project structure alignment:**
- Align file paths
- Module names
- Component locations
- Note conflicts

### Status Update

**Update sprint-status.yaml:**
- Story status: backlog → drafted
- Preserves all comments and structure

## Instructions

### Step 1: Load Configuration

Read project configuration from `.bmad/config.yaml`:

```javascript
{
  output_folder: string,        // Where docs are stored
  user_name: string,            // Author name
  sprint_artifacts: string,     // Sprint files location
  bmad_folder: string           // BMAD install location
}
```

### Step 2: Find Next Backlog Story

**Read sprint status file:**

File: `.bmad/sprint-artifacts/sprint-status.yaml` OR `.bmad/sprint-status.yaml`

**Read COMPLETELY from start to end** (order matters)

**Find first backlog story:**

```yaml
development_status:
  epic-1: contexted
  1-1-user-registration: done
  1-2-user-authentication: drafted
  1-3-password-reset: backlog  # ← Target this one
  1-4-mfa-setup: backlog
```

**Rules:**
- Key matches pattern: `{epic}-{story}-{name}`
- NOT an epic or retrospective
- Status equals "backlog"

**If no backlog stories:**
```
📋 No backlog stories found

Options:
1. Run /bmad:phase-4:sprint-planning to refresh
2. Add more stories to epic files
3. Check if sprint complete
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

Path: `.bmad/sprint-artifacts/stories/{story_key}.md`

If exists:
```
ℹ️ Story file already exists: {story_file}

Will update existing story rather than creating new one.
```
→ Set `update_mode = true`

### Step 3: Load Previous Story and Extract Learnings

**CRITICAL: Previous Story Continuity**

**Find previous story:**

1. In sprint-status.yaml, find current story key
2. Identify entry IMMEDIATELY ABOVE current story
3. That's the previous story key

Example:
```yaml
1-2-user-authentication: done      # ← Previous
1-3-password-reset: backlog        # ← Current
```

**If previous story exists:**

Check status: `done`, `review`, `in-progress`

**If status indicates work done:**

Load COMPLETE previous story file:
`.bmad/sprint-artifacts/stories/{previous_story_key}.md`

**Parse ALL sections:**

**Dev Agent Record → Completion Notes:**
```markdown
### Completion Notes List

- Created AuthService base class for all auth operations
- Implemented JWT token generation with 15min expiry
- Added UserRepository for database operations
- Schema migration: Added passwordHash field to User model
- Deferred email verification to next story (technical debt)
- Recommendation: Use AuthService.register() for signup flow
```

Extract:
- New services/classes created
- Architectural decisions
- Technical debt items
- Recommendations

**Dev Agent Record → File List:**
```markdown
### File List

- NEW: src/services/AuthService.js
- NEW: src/repositories/UserRepository.js
- NEW: src/middleware/authMiddleware.js
- NEW: tests/integration/auth.test.js
- MODIFIED: src/models/User.js
- MODIFIED: src/config/database.js
```

Extract:
- New files (understand new capabilities)
- Modified files (track changes)

**Dev Notes:**
```markdown
## Dev Notes

- Using bcrypt with 12 salt rounds per architecture
- JWT tokens stored in httpOnly cookies
- Refresh token rotation implemented
- TODO for next story: Add email verification
```

Extract:
- Patterns established
- TODOs for this story

**Senior Developer Review (if present):**
```markdown
## Senior Developer Review (AI)

**Outcome:** CHANGES REQUESTED

**Key Findings:**
- [Medium] Add rate limiting on login endpoint
- [Low] Consider adding password strength meter

**Action Items:**
- [ ] [Medium] Add rate limiting (5 attempts per 15min)
- [Low] Document JWT expiration policy
```

Extract:
- Unresolved action items (unchecked)
- Architectural concerns

**Store as structured learnings:**

```javascript
{
  new_files: [
    "src/services/AuthService.js - Base class for auth operations",
    "src/repositories/UserRepository.js - Database operations",
    "src/middleware/authMiddleware.js - Request authentication",
    "tests/integration/auth.test.js - Auth test suite"
  ],
  modified_files: [
    "src/models/User.js - Added passwordHash field",
    "src/config/database.js - Migration applied"
  ],
  new_services: [
    "AuthService.register() - User registration method",
    "AuthService.login() - User login with JWT",
    "UserRepository.create() - Create user record"
  ],
  architectural_decisions: [
    "Switched from session-based to JWT authentication",
    "Using bcrypt with 12 salt rounds",
    "httpOnly cookies for token storage",
    "Refresh token rotation implemented"
  ],
  technical_debt: [
    "Email verification deferred - should add in this or next story"
  ],
  warnings_for_next: [
    "Use AuthService.register() - don't recreate",
    "Follow auth test patterns in tests/integration/auth.test.js"
  ],
  review_findings: [
    "Rate limiting mentioned - consider for this story"
  ],
  pending_items: [
    "[Medium] Add rate limiting (5 attempts per 15min)"
  ]
}
```

**If no previous story or not yet implemented:**

Set: `previous_story_learnings = "First story in epic"` or `"Previous story not yet implemented"`

### Step 4: Load Source Documents

**Priority order:**

1. **Epic Tech Spec** (if exists)
   - Path: `.bmad/sprint-artifacts/tech-spec-epic-{epic_num}.md`
   - Most detailed, epic-scoped

2. **Epics File**
   - Whole: `.bmad/epics.md`
   - Sharded: `.bmad/epics/epic-{epic_num}.md` (SELECTIVE)
   - Has acceptance criteria and story breakdown

3. **PRD** (if exists)
   - Whole: `.bmad/PRD.md`
   - Sharded: `.bmad/PRD/index.md` + sections
   - Business requirements

4. **Architecture** (if exists)
   - Whole: `.bmad/architecture.md`
   - Sharded: `.bmad/architecture/index.md` + sections
   - Architecture constraints

**Load completely:**
- Read all found documents
- Store content for citation

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

Example from password reset:
```
As a user,
I want to reset my password via email link,
so that I can regain access to my account if I forget my password.
```

### Step 6: Assemble Acceptance Criteria

**From tech spec (preferred):**

Extract ACs for this story:
```
1. User can request password reset via email
2. Reset link expires after 1 hour
3. Password must meet complexity requirements
4. User receives confirmation email after reset
5. Old passwords cannot be reused (last 3)
```

**From epic file (fallback):**

Look for story section:
```markdown
### Story 1.3: Password Reset

**Acceptance Criteria:**
- User can request reset
- Email with secure link sent
- Link expires in 1 hour
- ...
```

**From PRD (fallback):**

Extract relevant requirements:
- Search for "password reset" in PRD
- Derive minimal, testable criteria
- NO invention - only what's explicit

### Step 7: Create Tasks and Subtasks

**Map to ACs:**

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

- [ ] Implement password update endpoint (AC: #3)
  - [ ] Create POST /auth/reset-password/confirm endpoint
  - [ ] Validate new password complexity
  - [ ] Check password history (last 3)
  - [ ] Hash and store new password
  - [ ] Invalidate all existing sessions

- [ ] Send confirmation email (AC: #4)
  - [ ] Email template for confirmation
  - [ ] Send on successful reset

- [ ] Add tests (All ACs)
  - [ ] Unit tests for token generation
  - [ ] Unit tests for password validation
  - [ ] Integration tests for reset flow
  - [ ] E2E test for complete flow
```

**Include explicit testing:**
- Per testing standards from architecture
- Follow existing test framework patterns

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

**From Story 1-2-user-authentication (Status: done)**

**Services to REUSE (DO NOT recreate):**
- `AuthService` base class at `src/services/AuthService.js`
  - Use `AuthService.hashPassword()` for password hashing
  - Use `AuthService.generateToken()` for JWT creation
- `UserRepository` at `src/repositories/UserRepository.js`
  - Use `UserRepository.update()` for password update
  - Use `UserRepository.findByEmail()` for user lookup
- `EmailService` at `src/services/EmailService.js`
  - Use `EmailService.send()` for email notifications

**Files Created (Available for this story):**
- `src/middleware/authMiddleware.js` - Request authentication
- `tests/integration/auth.test.js` - Auth test suite (follow patterns)

**Architectural Decisions to Maintain:**
- JWT authentication (not session-based)
- bcrypt with 12 salt rounds (already configured)
- httpOnly cookies for tokens
- Refresh token rotation

**Technical Debt to Address:**
- Email verification was deferred - consider if needed for reset flow

**Pending Review Items:**
- Rate limiting recommended - apply to reset endpoint too

**Schema Changes:**
- User model now has `passwordHash` field
- Migration already applied in previous story

[Source: stories/1-2-user-authentication.md#Dev-Agent-Record]
```

**Format:**
- **Services to REUSE** - Most important (prevents duplication)
- **Files Created** - What's available
- **Architectural Decisions** - Maintain consistency
- **Technical Debt** - Consider addressing
- **Pending Review Items** - Apply learnings
- **Schema Changes** - Understand current state

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
- Token expiry: [Source: .bmad/sprint-artifacts/tech-spec-epic-1.md#Security]
- AC definitions: [Source: .bmad/epics.md#Epic-1-Story-3]

**Previous Story:**
- AuthService usage: [Source: stories/1-2-user-authentication.md#Completion-Notes]
```

### Step 12: Create Story File

**File path:** `.bmad/sprint-artifacts/stories/{story_key}.md`

Example: `.bmad/sprint-artifacts/stories/1-3-password-reset.md`

**Full structure:**

```markdown
# Story 1.3: Password Reset

Status: drafted

## Story

As a user,
I want to reset my password via email link,
so that I can regain access to my account if I forget my password.

## Acceptance Criteria

1. User can request password reset via email
2. Reset link expires after 1 hour
3. Password must meet complexity requirements
4. User receives confirmation email after reset
5. Old passwords cannot be reused (last 3)

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

File: `.bmad/sprint-artifacts/sprint-status.yaml`

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

### Step 14: Report Completion

```
✅ Story Created Successfully!

**Story Details:**

- Story ID: 1.3
- Story Key: 1-3-password-reset
- File: .bmad/sprint-artifacts/stories/1-3-password-reset.md
- Status: drafted (was backlog)

**Learnings Applied:**
- Reusing AuthService from Story 1.2
- Reusing UserRepository from Story 1.2
- Following established JWT authentication pattern
- Addressing pending review item (rate limiting)

**Next Steps:**

1. Review the drafted story
2. Run /bmad:phase-4:story-context to generate context and mark ready-for-dev
3. OR run /bmad:phase-4:story-ready to manually mark ready

**⚠️ Context-intensive workflows ahead - consider restarting agent**
```

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
- Previous story learnings ← CRITICAL
- Testing standards
- References

### 5. Selective Epic Loading

**Efficiency:**
- Load only the specific epic needed
- Not all epics (unlike sprint-planning)
- Reduces token usage
- Faster execution

## Examples

### Example 1: SaaS Analytics - First Story in Epic

**Context:**
- Epic 1, Story 1: User Registration
- First story, no predecessor
- Epic tech spec exists

**Workflow execution:**

1. **Find story:**
   - Found: `1-1-user-registration` with status `backlog`

2. **Previous story:**
   - None (first in epic)
   - Set: `previous_story_learnings = "First story in epic"`

3. **Load documents:**
   - Tech spec: `.bmad/sprint-artifacts/tech-spec-epic-1.md`
   - Epic: `.bmad/epics.md` (Epic 1 section)
   - Architecture: `.bmad/architecture.md`

4. **Extract ACs:**
   - AC1: User can register with email and password
   - AC2: Email must be unique
   - AC3: Password must meet complexity
   - AC4: Email verification sent
   - AC5: User account created inactive

5. **Create tasks:**
   - Implement registration endpoint
   - Email uniqueness check
   - Password validation
   - Email service integration
   - Database schema setup
   - Unit and integration tests

6. **Dev notes:**
   - Architecture: REST API, repository pattern
   - Constraints: bcrypt 12 rounds, email verification required
   - Components: New (none exist yet)

7. **No previous learnings** (first story)

8. **Result:**
   ```
   ✅ Story Created: 1-1-user-registration

   File: stories/1-1-user-registration.md
   Status: backlog → drafted
   ACs: 5
   Tasks: 10

   No previous story (first in epic)

   Next: Run /bmad:phase-4:story-context
   ```

### Example 2: Healthcare Portal - With Previous Story Learnings

**Context:**
- Epic 2, Story 3: Appointment Reminder System
- Previous story (2.2): Appointment Booking (done)
- Previous story created services and schemas

**Workflow execution:**

1. **Find story:**
   - Found: `2-3-appointment-reminder` with status `backlog`

2. **Previous story:**
   - Key: `2-2-appointment-booking`
   - Status: `done`
   - Load complete file

3. **Extract learnings:**
   ```javascript
   {
     new_files: [
       "src/services/AppointmentService.js",
       "src/repositories/AppointmentRepository.js",
       "src/models/Appointment.js",
       "tests/integration/appointments.test.js"
     ],
     new_services: [
       "AppointmentService.create() - Book appointment",
       "AppointmentService.getByPatient() - Get patient appointments",
       "AppointmentRepository.find() - Query appointments"
     ],
     architectural_decisions: [
       "Using PostgreSQL JSONB for appointment metadata",
       "Timezone stored as UTC, converted on display",
       "30-minute booking slots"
     ],
     technical_debt: [
       "Email reminders deferred to next story (this one!)"
     ],
     warnings_for_next: [
       "Use AppointmentService for all appointment operations",
       "Follow test patterns in appointments.test.js"
     ]
   }
   ```

4. **Load documents:**
   - Tech spec: `.bmad/sprint-artifacts/tech-spec-epic-2.md`
   - Epic: `.bmad/epics/epic-2.md` (sharded, selective load)
   - Previous story: `stories/2-2-appointment-booking.md`

5. **Extract ACs:**
   - AC1: Send email reminder 24h before appointment
   - AC2: Send SMS reminder 2h before appointment
   - AC3: Allow patient to confirm/cancel via link
   - AC4: Update appointment status based on response
   - AC5: Retry failed notifications

6. **Create tasks:**
   - Implement reminder scheduler
   - Email notification service
   - SMS notification service (new)
   - Confirmation link handler
   - Status update logic
   - Retry mechanism
   - Tests

7. **Dev notes with learnings:**
   ```markdown
   ### Learnings from Previous Story

   **From Story 2-2-appointment-booking (Status: done)**

   **Services to REUSE (DO NOT recreate):**
   - `AppointmentService` at `src/services/AppointmentService.js`
     - Use `AppointmentService.getByDate()` to find appointments needing reminders
     - Use `AppointmentService.updateStatus()` to mark confirmed/cancelled
   - `AppointmentRepository` at `src/repositories/AppointmentRepository.js`
     - Use `AppointmentRepository.find()` for querying

   **Files Created:**
   - `src/models/Appointment.js` - Schema with metadata JSONB field
   - `tests/integration/appointments.test.js` - Follow test patterns

   **Architectural Decisions:**
   - Timezones in UTC, convert on display (maintain for reminders)
   - 30-minute slots (affects reminder timing)
   - PostgreSQL JSONB for metadata (can store reminder status)

   **Technical Debt to Address:**
   - Email reminders explicitly deferred to THIS story

   [Source: stories/2-2-appointment-booking.md]
   ```

8. **Result:**
   ```
   ✅ Story Created: 2-3-appointment-reminder

   File: stories/2-3-appointment-reminder.md
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

### Example 3: Mobile Fitness - With Pending Review Items

**Context:**
- Epic 3, Story 2: Workout History View
- Previous story (3.1): Workout Creation (review - changes requested)
- Previous story has pending review items

**Workflow execution:**

1. **Find story:**
   - Found: `3-2-workout-history` with status `backlog`

2. **Previous story:**
   - Key: `3-1-workout-creation`
   - Status: `review` (changes requested)
   - Load complete file including review

3. **Extract learnings with review findings:**
   ```javascript
   {
     new_files: [
       "src/screens/WorkoutCreateScreen.tsx",
       "src/components/ExerciseSelector.tsx",
       "src/services/WorkoutService.ts",
       "src/database/models/Workout.ts"
     ],
     new_services: [
       "WorkoutService.create() - Create workout",
       "WorkoutService.validateWorkout() - Validation logic"
     ],
     technical_debt: [
       "Offline sync partially implemented, needs completion"
     ],
     review_findings: [
       "Missing pagination on exercise selector (affects performance)",
       "No loading states for async operations",
       "Accessibility labels incomplete"
     ],
     pending_items: [
       "[High] Add pagination to exercise list",
       "[Medium] Add loading spinners for all async calls",
       "[Medium] Complete accessibility labels"
     ]
   }
   ```

4. **Dev notes with review learnings:**
   ```markdown
   ### Learnings from Previous Story

   **From Story 3-1-workout-creation (Status: review - changes requested)**

   **Services to REUSE:**
   - `WorkoutService` at `src/services/WorkoutService.ts`
     - Use `WorkoutService.getAll()` to fetch workouts (will need for history)
   - Workout model at `src/database/models/Workout.ts`

   **Files Created:**
   - `src/screens/WorkoutCreateScreen.tsx` - Pattern for screens
   - `src/components/ExerciseSelector.tsx` - Reusable component

   **Pending Review Items (Apply to THIS story):**
   - **Pagination Required**: Exercise selector had performance issues without pagination
     → Implement pagination on workout history list from the start
   - **Loading States**: Missing loading spinners flagged
     → Add loading states for all data fetches
   - **Accessibility**: Incomplete labels
     → Include accessibility labels in all components

   **Technical Debt:**
   - Offline sync partially done - ensure history works offline

   [Source: stories/3-1-workout-creation.md#Senior-Developer-Review]
   ```

5. **Tasks include review learnings:**
   ```markdown
   ## Tasks / Subtasks

   - [ ] Implement workout history screen (AC: #1)
     - [ ] Create WorkoutHistoryScreen.tsx
     - [ ] Add pagination from start (learnings from review)
     - [ ] Add loading states (learnings from review)
     - [ ] Add accessibility labels (learnings from review)
     - [ ] Implement pull-to-refresh

   - [ ] Fetch workout data (AC: #2)
     - [ ] Use WorkoutService.getAll() with pagination
     - [ ] Cache for offline access
     - [ ] Handle loading and error states

   - [ ] Display workout list (AC: #3)
     - [ ] WorkoutListItem component
     - [ ] Pagination controls
     - [ ] Empty state handling
   ```

6. **Result:**
   ```
   ✅ Story Created: 3-2-workout-history

   File: stories/3-2-workout-history.md
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

## Related Workflows

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

## Success Criteria

A successful story creation includes:

**Story Content:**
- [ ] User story statement (as a / I want / so that)
- [ ] Acceptance criteria (from sources, not invented)
- [ ] Tasks mapped to ACs
- [ ] Testing subtasks included

**Dev Notes:**
- [ ] Architecture patterns listed
- [ ] Constraints documented
- [ ] Components to touch identified
- [ ] Testing standards included

**Previous Story Learnings:**
- [ ] New files/services extracted (if previous story exists)
- [ ] Services to REUSE explicitly listed
- [ ] Architectural decisions documented
- [ ] Technical debt noted
- [ ] Review findings applied

**References:**
- [ ] All technical details cited
- [ ] Source documents referenced
- [ ] Previous story cited (if exists)

**Status Update:**
- [ ] Sprint-status.yaml updated (backlog → drafted)
- [ ] Comments and structure preserved

**File Quality:**
- [ ] Valid markdown
- [ ] Template structure followed
- [ ] Citations complete

## Notes

- **Previous story continuity:** CRITICAL feature - prevents code duplication
- **REUSE over RECREATE:** Explicit instruction to use existing services
- **Grounded in sources:** No invention, everything from documents
- **Selective epic loading:** Loads only needed epic (efficiency)
- **Comprehensive dev notes:** Everything developer needs
- **Review learnings applied:** Proactively address previous issues
- **Non-interactive:** Runs automatically without user prompts
- **Updates sprint status:** Marks story drafted

## Configuration

Reads from `.bmad/config.yaml`:

```yaml
output_folder: .bmad
user_name: "Your Name"
sprint_artifacts: .bmad/sprint-artifacts
bmad_folder: .bmad
```

**Output file:**
- `.bmad/sprint-artifacts/stories/{epic}-{story}-{title}.md`
- Example: `.bmad/sprint-artifacts/stories/1-3-password-reset.md`

**Input files:**
- `.bmad/sprint-artifacts/sprint-status.yaml` - Story tracking
- `.bmad/epics.md` OR `.bmad/epics/epic-{N}.md` - Epic files
- `.bmad/sprint-artifacts/tech-spec-epic-{N}.md` - Tech spec (optional)
- `.bmad/PRD.md` - Requirements (optional)
- `.bmad/architecture.md` - Architecture (optional)
- Previous story file (for learnings)
