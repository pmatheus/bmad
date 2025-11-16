---
description: Generate and manage sprint status tracking file by extracting all epics and stories from epic files
---

# Sprint Planning

Generates a comprehensive sprint status tracking file that monitors all epics and stories through the development lifecycle, with intelligent status detection based on existing files.

## What This Does

This workflow creates a **sprint-status.yaml** file that:

- Extracts all epics and stories from epic files
- Tracks status of each epic and story
- Automatically detects current status based on existing files
- Preserves advanced statuses (never downgrades)
- Provides complete development tracking
- Enables other workflows to find next work items

**Key Principle:** **Single source of truth** for project status - all workflows read and update this file to track progress.

## Prerequisites

Before running this workflow:

- [ ] BMAD plugin installed in Claude Code
- [ ] Project initialized (`/bmad:meta:workflow-init`)
- [ ] Epics created (`/bmad:phase-2:create-epics-and-stories`)

**Required files:**
- `.bmad/config.yaml` - Project configuration
- `.bmad/epics.md` OR `.bmad/epics/epic-{N}.md` - Epic files with stories

## How It Works

### Epic and Story Discovery

**Find epic files:**

Priority order:
1. Whole document: `.bmad/epics.md`
2. Sharded documents: `.bmad/epics/index.md` + all epic files

**Extract work items:**

From epic files, extract:
- Epic numbers from headers (e.g., `## Epic 1:`, `## Epic 2:`)
- Story IDs and titles (e.g., `### Story 1.1: User Authentication`)
- Convert to kebab-case keys (e.g., `1-1-user-authentication`)

**Build inventory:**
- All epics
- All stories under each epic
- Retrospectives for each epic

### Intelligent Status Detection

**For each epic:**
- Check if tech spec exists: `.bmad/sprint-artifacts/tech-spec-epic-{N}.md`
- If exists → status: `contexted`
- If not → status: `backlog`

**For each story:**
- Check if story file exists: `.bmad/sprint-artifacts/stories/{story-key}.md`
  - If exists → upgrade to at least `drafted`
- Check if context exists: `.bmad/sprint-artifacts/stories/{story-key}.context.xml`
  - If exists → upgrade to at least `ready-for-dev`

**Preservation rule:**
- If existing status file has more advanced status, preserve it
- Never downgrade (e.g., don't change `done` to `drafted`)
- Only upgrade if file evidence found

### Status State Machine

**Epic Status Flow:**
```
backlog → contexted
```

**Story Status Flow:**
```
backlog → drafted → ready-for-dev → in-progress → review → done
```

**Retrospective Status:**
```
optional ↔ completed
```

### Output Format

```yaml
# generated: 2025-11-13
# project: My Project
# project_key: my-project
# tracking_system: file-system
# story_location: .bmad/sprint-artifacts/stories

# STATUS DEFINITIONS:
# [Full definitions included for reference]

generated: 2025-11-13
project: My Project
project_key: my-project
tracking_system: file-system
story_location: .bmad/sprint-artifacts/stories

development_status:
  epic-1: contexted
  1-1-user-authentication: done
  1-2-account-management: ready-for-dev
  1-3-password-reset: drafted
  1-4-mfa-setup: backlog
  epic-1-retrospective: optional

  epic-2: backlog
  2-1-profile-management: backlog
  2-2-settings: backlog
  epic-2-retrospective: optional
```

## Instructions

### Step 1: Load Configuration

Read project configuration from `.bmad/config.yaml`:

```javascript
{
  output_folder: string,        // Where docs are stored (e.g., .bmad)
  project_name: string,         // Project name
  sprint_artifacts: string,     // Sprint files location
  bmad_folder: string           // BMAD install location
}
```

### Step 2: Find and Load Epic Files

**Search for epic files:**

Priority order:
1. **Whole document:** `.bmad/epics.md` OR `.bmad/bmm-epics.md`
2. **Sharded documents:** `.bmad/epics/index.md`

**If whole document found:**
- Read entire file
- Process all epics and stories

**If sharded version found:**
- Read `.bmad/epics/index.md`
- Read ALL epic section files (e.g., `epic-1.md`, `epic-2.md`, etc.)
- Combine content

**If no epic files found:**
```
⚠️ No epic files found

Cannot generate sprint status without epics.

Run /bmad:phase-2:create-epics-and-stories to create epics first.
```
→ HALT

**Fuzzy matching:** Be flexible with file names:
- `epics.md`
- `bmm-epics.md`
- `user-stories.md`
- Any `*epic*.md` files

### Step 3: Parse Epics and Stories

**For each epic file, extract:**

**Epic headers:**
```markdown
## Epic 1: User Management
## Epic 2: Profile System
```

Extract:
- Epic number (1, 2, etc.)
- Epic title

**Story headers:**
```markdown
### Story 1.1: User Authentication
### Story 1.2: Account Management
### Story 2.1: Profile Editing
```

Extract:
- Epic number (1, 2, etc.)
- Story number (1, 2, etc.)
- Story title

**Convert to kebab-case keys:**

Original: `Story 1.1: User Authentication`

Conversion:
1. Replace period with dash: `1-1`
2. Convert title to kebab-case: `user-authentication`
3. Final key: `1-1-user-authentication`

**Examples:**
- `Story 1.1: User Authentication` → `1-1-user-authentication`
- `Story 2.3: Real-Time Data Sync` → `2-3-real-time-data-sync`
- `Story 3.5: HIPAA Compliance Report` → `3-5-hipaa-compliance-report`

**Build complete inventory:**
```javascript
{
  epics: [
    { number: 1, title: "User Management" },
    { number: 2, title: "Profile System" }
  ],
  stories: [
    { epic: 1, story: 1, key: "1-1-user-authentication", title: "User Authentication" },
    { epic: 1, story: 2, key: "1-2-account-management", title: "Account Management" },
    { epic: 2, story: 1, key: "2-1-profile-editing", title: "Profile Editing" }
  ]
}
```

### Step 4: Detect Current Status

**For each epic:**

Check if epic tech spec exists:

```
.bmad/sprint-artifacts/tech-spec-epic-{epic_num}.md
```

- If file exists → status: `contexted`
- If not exists → status: `backlog`

**For each story:**

Start with default: `backlog`

**Check 1: Story file exists?**
```
.bmad/sprint-artifacts/stories/{story-key}.md
```

If exists → upgrade to `drafted` (if not already higher)

**Check 2: Story context exists?**
```
.bmad/sprint-artifacts/stories/{story-key}.context.xml
```

If exists → upgrade to `ready-for-dev` (if not already higher)

**Check 3: Existing status file?**

If `.bmad/sprint-artifacts/sprint-status.yaml` exists:
- Read existing status for this story
- If existing status is more advanced, keep it
- Never downgrade

**Preservation logic:**

Status hierarchy (low to high):
1. backlog
2. drafted
3. ready-for-dev
4. in-progress
5. review
6. done

Example:
- File detection says: `drafted` (story file exists)
- Existing status file says: `in-progress`
- Result: Keep `in-progress` (more advanced)

Example 2:
- File detection says: `ready-for-dev` (context exists)
- Existing status file says: `backlog`
- Result: Upgrade to `ready-for-dev`

### Step 5: Build Sprint Status Structure

**For each epic, create entries in order:**

1. **Epic entry**
   - Key: `epic-{num}`
   - Status: `backlog` or `contexted` (from detection)

2. **Story entries**
   - Key: `{epic}-{story}-{title-kebab}`
   - Status: From detection (backlog/drafted/ready-for-dev/in-progress/review/done)

3. **Retrospective entry**
   - Key: `epic-{num}-retrospective`
   - Status: `optional` (or `completed` if exists in old file)

**Example structure:**
```yaml
development_status:
  epic-1: contexted
  1-1-user-authentication: done
  1-2-account-management: ready-for-dev
  1-3-password-reset: drafted
  1-4-mfa-setup: backlog
  epic-1-retrospective: optional

  epic-2: backlog
  2-1-profile-management: backlog
  2-2-settings: backlog
  epic-2-retrospective: optional
```

**Important:** Maintain order - epic, its stories, its retrospective, next epic...

### Step 6: Generate Sprint Status File

**File path:** `.bmad/sprint-artifacts/sprint-status.yaml`

**Full structure:**

```yaml
# generated: {current_date}
# project: {project_name}
# project_key: {project_key}
# tracking_system: file-system
# story_location: .bmad/sprint-artifacts/stories

# STATUS DEFINITIONS:
# ==================
# Epic Status:
#   - backlog: Epic exists in epic file but not contexted
#   - contexted: Epic tech context created (required before drafting stories)
#
# Story Status:
#   - backlog: Story only exists in epic file
#   - drafted: Story file created in stories folder
#   - ready-for-dev: Draft approved and story context created
#   - in-progress: Developer actively working on implementation
#   - review: Under code review
#   - done: Story completed
#
# Retrospective Status:
#   - optional: Can be completed but not required
#   - completed: Retrospective has been done
#
# WORKFLOW NOTES:
# ===============
# - Epics should be 'contexted' before stories can be 'drafted'
# - Stories can be worked in parallel if team capacity allows
# - Typically draft next story after previous one is 'done' to incorporate learnings
# - Dev moves story to 'review', then to 'done' after review passes

generated: {current_date}
project: {project_name}
project_key: {project_key or project_name_kebab}
tracking_system: file-system
story_location: .bmad/sprint-artifacts/stories

development_status:
  {epic entries in order}
```

**Critical notes:**

1. **Metadata appears TWICE:**
   - Once as comments (#) for documentation
   - Once as YAML key:value for parsing

2. **Order matters:**
   - Epic, its stories, its retrospective
   - Repeat for each epic
   - Maintains logical grouping

3. **Preserve structure:**
   - Keep all comments
   - Keep STATUS DEFINITIONS
   - Keep WORKFLOW NOTES

**Write to file:** `.bmad/sprint-artifacts/sprint-status.yaml`

### Step 7: Validate and Report

**Validation checks:**

- [ ] Every epic in epic files appears in sprint-status
- [ ] Every story in epic files appears in sprint-status
- [ ] Every epic has a corresponding retrospective entry
- [ ] No items in sprint-status that don't exist in epic files
- [ ] All status values are legal (match state machine)
- [ ] File is valid YAML syntax

**Count totals:**

```javascript
{
  total_epics: count,
  total_stories: count,
  epics_contexted: count,
  stories_drafted: count,
  stories_ready: count,
  stories_in_progress: count,
  stories_in_review: count,
  stories_done: count
}
```

**Report completion:**

```
✅ Sprint Status Generated Successfully

**File Location:** .bmad/sprint-artifacts/sprint-status.yaml

**Inventory:**
- Total Epics: {total_epics}
- Total Stories: {total_stories}

**Epic Status:**
- Backlog: {epics_backlog}
- Contexted: {epics_contexted}

**Story Status:**
- Backlog: {stories_backlog}
- Drafted: {stories_drafted}
- Ready for Dev: {stories_ready}
- In Progress: {stories_in_progress}
- In Review: {stories_in_review}
- Done: {stories_done}

**Completion:** {stories_done} / {total_stories} stories ({percentage}%)

**Next Steps:**
1. Review the generated sprint-status.yaml
2. Run /bmad:phase-4:epic-tech-context to context next epic
3. Run /bmad:phase-4:create-story to draft next story
4. Re-run /bmad:phase-4:sprint-planning to refresh auto-detected statuses
```

### Step 8: Auto-Continue to Epic Tech Context

**Purpose:** Enable seamless workflow continuation to epic contexting.

**Process:**

1. **Check next workflow:**
   - Next recommended workflow: `epic-tech-context`
   - Creates technical specifications for first epic

2. **Check prerequisites:**
   - sprint-status.yaml exists? ✓ (just created)
   - epics.md exists? ✓
   - User input needed? ✗ (epic-tech-context runs autonomously with architecture context)
   - Configuration exists? ✓

3. **Determine if epic-tech-context should run:**
   - Check if any epics have status "backlog"
   - Check if architecture.md exists (provides context for epic-tech-context)

4. **Auto-continue decision:**

   **IF** architecture.md exists AND at least one epic in backlog:

   ```
   🚀 Auto-continuing to epic tech context...

   Creating technical specification for first epic.
   ```

   **Execute next workflow:**
   Use SlashCommand tool with command: `/bmad:phase-4:epic-tech-context`

   **ELSE IF** architecture.md does NOT exist:

   ```
   ✅ Sprint Status Generated!

   📋 Next Step: Architecture Recommended

   Before creating epic tech specs, run architecture workflow:
   /bmad:phase-3:architecture

   Or skip directly to story creation:
   /bmad:phase-4:create-story
   ```

   **ELSE IF** all epics already contexted:

   ```
   ✅ Sprint Status Generated!

   All epics already contexted. Ready for story implementation.

   Next: /bmad:phase-4:create-story
   ```

**CRITICAL:** DO NOT ask user permission to continue if architecture exists and epics need contexting. Epic-tech-context runs autonomously.

## Key Principles

### 1. Single Source of Truth

**All workflows use this file:**
- `epic-tech-context` - Finds next backlog epic
- `create-story` - Finds next epic to draft from
- `story-context` - Finds next drafted story
- `dev-story` - Finds next ready-for-dev story
- `code-review` - Finds next review story

**Status updates:**
- Workflows update this file as they work
- Never have multiple sources of status
- This file is authoritative

### 2. Intelligent Status Detection

**Auto-detect from files:**
- Epic tech specs → contexted
- Story files → drafted
- Story context files → ready-for-dev

**Preserve advanced states:**
- Never downgrade status
- Only upgrade with evidence
- Respect manual overrides

### 3. Never Downgrade

**Status progression only:**
- backlog → drafted (✓)
- drafted → backlog (✗ never)
- in-progress → ready-for-dev (✗ never)

**Reason:** Protects work in progress from being reset by re-running sprint-planning.

### 4. Full Epic Loading

**Unlike selective workflows:**
- epic-tech-context loads ONE epic (selective)
- story-context loads ONE epic (selective)
- **sprint-planning loads ALL epics** (full)

**Why:** Need complete inventory for tracking.

### 5. Re-runnable

**Safe to re-run:**
- Refreshes auto-detected statuses
- Adds new epics/stories if epic files changed
- Preserves all advanced statuses
- Validates consistency

**When to re-run:**
- After adding new epics to epic files
- After adding new stories to epic files
- To refresh status detection
- To validate status file integrity

## Examples

### Example 1: SaaS Analytics - Initial Sprint Planning

**Context:**
- Project: T3 Stack SaaS Analytics
- 3 epics created with 15 total stories
- No work done yet

**Workflow execution:**

1. **Find epic files:**
   - Found: `.bmad/epics.md` (whole document)
   - Load entire file

2. **Parse epics:**
   - Epic 1: User Management (5 stories)
   - Epic 2: Dashboard System (6 stories)
   - Epic 3: Real-Time Updates (4 stories)

3. **Extract stories:**
   - 1-1-user-registration
   - 1-2-user-authentication
   - 1-3-password-reset
   - 1-4-mfa-setup
   - 1-5-session-management
   - 2-1-dashboard-layout
   - 2-2-widget-system
   - ... (15 total)

4. **Detect status:**
   - No tech specs exist → All epics: `backlog`
   - No story files exist → All stories: `backlog`
   - No existing status file → Fresh start

5. **Generate file:**
   ```yaml
   generated: 2025-11-13
   project: SaaS Analytics Platform
   tracking_system: file-system
   story_location: .bmad/sprint-artifacts/stories

   development_status:
     epic-1: backlog
     1-1-user-registration: backlog
     1-2-user-authentication: backlog
     1-3-password-reset: backlog
     1-4-mfa-setup: backlog
     1-5-session-management: backlog
     epic-1-retrospective: optional

     epic-2: backlog
     2-1-dashboard-layout: backlog
     ... (all stories)
   ```

6. **Result:**
   ```
   ✅ Sprint Status Generated

   Inventory:
   - Epics: 3
   - Stories: 15

   Epic Status:
   - Backlog: 3
   - Contexted: 0

   Story Status:
   - Backlog: 15
   - All others: 0

   Completion: 0 / 15 (0%)

   Next: Run /bmad:phase-4:epic-tech-context to context Epic 1
   ```

### Example 2: Healthcare Portal - Mid-Project Refresh

**Context:**
- Project: Healthcare Patient Portal
- 5 epics with 28 stories
- Epic 1-3 contexted, Epic 4-5 in backlog
- 12 stories done, 3 in-progress, 2 in review

**Workflow execution:**

1. **Find epic files:**
   - Found: `.bmad/epics/index.md` (sharded)
   - Load all: epic-1.md through epic-5.md

2. **Parse epics:**
   - Epic 1: User Auth (5 stories) - contexted
   - Epic 2: Patient Records (6 stories) - contexted
   - Epic 3: Appointments (7 stories) - contexted
   - Epic 4: Billing (5 stories) - backlog
   - Epic 5: Analytics (5 stories) - backlog

3. **Detect status:**
   - Tech specs exist for Epic 1-3 → `contexted`
   - No tech spec for Epic 4-5 → `backlog`
   - Read existing sprint-status.yaml
   - Preserve all advanced statuses

4. **File detection:**
   - 18 story files exist → at least `drafted`
   - 15 context files exist → at least `ready-for-dev`
   - Existing file says 12 are `done`, 3 `in-progress`, 2 `review`

5. **Status resolution:**
   - Keep `done` for 12 stories (most advanced)
   - Keep `in-progress` for 3 stories
   - Keep `review` for 2 stories
   - Upgrade to `ready-for-dev` for 3 with context but still backlog
   - Keep remaining as detected

6. **Generate file:**
   ```yaml
   generated: 2025-11-13
   project: Healthcare Patient Portal
   tracking_system: file-system
   story_location: .bmad/sprint-artifacts/stories

   development_status:
     epic-1: contexted
     1-1-user-registration: done
     1-2-user-authentication: done
     1-3-password-reset: done
     1-4-mfa-setup: in-progress
     1-5-session-management: ready-for-dev
     epic-1-retrospective: completed

     epic-2: contexted
     2-1-patient-search: done
     ... (epic 2 stories)
     epic-2-retrospective: optional

     epic-3: contexted
     3-1-appointment-booking: in-progress
     3-2-appointment-reminder: review
     ... (epic 3 stories)
     epic-3-retrospective: optional

     epic-4: backlog
     ... (epic 4 stories all backlog)

     epic-5: backlog
     ... (epic 5 stories all backlog)
   ```

7. **Result:**
   ```
   ✅ Sprint Status Refreshed

   Inventory:
   - Epics: 5
   - Stories: 28

   Epic Status:
   - Backlog: 2
   - Contexted: 3

   Story Status:
   - Backlog: 10
   - Drafted: 0
   - Ready: 3
   - In Progress: 3
   - In Review: 2
   - Done: 12

   Completion: 12 / 28 (43%)

   Next: Continue with in-progress stories
   ```

### Example 3: Mobile Fitness - New Epic Added

**Context:**
- Project: React Native Fitness App
- Originally had 2 epics, now added Epic 3
- Epic 1: 100% done, Epic 2: 60% done
- Re-running sprint-planning to add Epic 3

**Workflow execution:**

1. **Find epic files:**
   - Found: `.bmad/epics.md` (updated with Epic 3)

2. **Parse epics:**
   - Epic 1: Workout Tracking (6 stories) - all done
   - Epic 2: Social Features (5 stories) - 3 done, 2 in-progress
   - Epic 3: Nutrition Logging (7 stories) - **NEW!**

3. **Detect status:**
   - Epic 1 tech spec exists → `contexted`
   - Epic 2 tech spec exists → `contexted`
   - Epic 3 tech spec doesn't exist → `backlog`
   - Read existing sprint-status.yaml

4. **Preserve existing:**
   - Epic 1: All 6 stories still `done`
   - Epic 2: 3 stories `done`, 2 `in-progress`
   - Epic 3: All 7 stories `backlog` (new)

5. **Generate file:**
   ```yaml
   generated: 2025-11-13
   project: Fitness Tracker
   tracking_system: file-system
   story_location: .bmad/sprint-artifacts/stories

   development_status:
     epic-1: contexted
     1-1-workout-creation: done
     1-2-exercise-library: done
     ... (all 6 done)
     epic-1-retrospective: completed

     epic-2: contexted
     2-1-friend-system: done
     2-2-activity-feed: done
     2-3-challenges: done
     2-4-leaderboards: in-progress
     2-5-achievements: in-progress
     epic-2-retrospective: optional

     epic-3: backlog  # NEW EPIC!
     3-1-meal-logging: backlog
     3-2-nutrition-tracking: backlog
     3-3-calorie-goals: backlog
     3-4-macro-breakdown: backlog
     3-5-meal-suggestions: backlog
     3-6-food-database: backlog
     3-7-barcode-scanner: backlog
     epic-3-retrospective: optional
   ```

6. **Result:**
   ```
   ✅ Sprint Status Updated - New Epic Added

   Inventory:
   - Epics: 3 (+1 new)
   - Stories: 18 (+7 new)

   Epic Status:
   - Backlog: 1 (Epic 3)
   - Contexted: 2

   Story Status:
   - Backlog: 7 (all from Epic 3)
   - In Progress: 2
   - Done: 9

   Completion: 9 / 18 (50%)

   New Epic 3 added with 7 stories!

   Next: Continue Epic 2, then context Epic 3
   ```

## Troubleshooting

### No epic files found

**Error:**
```
⚠️ No epic files found

Cannot generate sprint status without epics.
```

**Solution:**
Run `/bmad:phase-2:create-epics-and-stories` to create epics first.

### Invalid YAML syntax

**Error:**
```
⚠️ Generated file has invalid YAML syntax
```

**Cause:** Usually from story titles with special characters.

**Solution:**
- Check story titles for `:`, `#`, `|`, etc.
- Ensure proper YAML escaping
- Re-run workflow

### Status file exists but corrupted

**Warning:**
```
⚠️ Existing sprint-status.yaml is corrupted

Backing up to sprint-status.yaml.backup and creating fresh file.
```

**Solution:**
- Existing file backed up
- Fresh file generated
- Review backup to recover any manual edits

### Stories missing from status file

**Error:**
```
⚠️ Validation failed: 3 stories from epic files not in status file
```

**Cause:** Epic files updated but sprint-planning not re-run.

**Solution:**
Re-run `/bmad:phase-4:sprint-planning` to sync.

### Statuses downgraded unexpectedly

**Error:**
```
⚠️ Warning: 2 stories had status downgraded
- 1-3-password-reset: was in-progress, now drafted
```

**Cause:** Bug in preservation logic.

**Solution:**
- Manually restore correct statuses in YAML file
- Report issue

## Related Workflows

**Before this workflow:**
1. `/bmad:meta:workflow-init` - Initialize project
2. `/bmad:phase-2:prd` - Create requirements
3. `/bmad:phase-2:create-epics-and-stories` - Create epics

**After this workflow:**
1. `/bmad:phase-4:epic-tech-context` - Context next backlog epic
2. `/bmad:phase-4:create-story` - Draft next story
3. `/bmad:phase-4:story-context` - Context next drafted story
4. `/bmad:phase-4:dev-story` - Implement next ready story
5. `/bmad:phase-4:code-review` - Review next completed story

**Parallel workflows:**
- `/bmad:phase-4:sprint-planning` - Re-run anytime to refresh
- `/bmad:workflow-status` - Check current phase

## Success Criteria

A successful sprint-planning execution includes:

**File Generation:**
- [ ] Sprint-status.yaml created or updated
- [ ] Valid YAML syntax
- [ ] All required fields present

**Inventory Complete:**
- [ ] Every epic from epic files included
- [ ] Every story from epic files included
- [ ] Every epic has retrospective entry

**Status Detection:**
- [ ] Epic statuses detected correctly
- [ ] Story statuses detected correctly
- [ ] Existing advanced statuses preserved
- [ ] No downgrades

**Validation:**
- [ ] All status values are legal
- [ ] No orphaned items
- [ ] Order maintained (epic → stories → retrospective)
- [ ] Metadata duplicated (comments + YAML)

**Documentation:**
- [ ] STATUS DEFINITIONS section included
- [ ] WORKFLOW NOTES section included
- [ ] Comments explain structure

## Notes

- **Re-runnable:** Safe to run multiple times, preserves work
- **Never downgrades:** Respects advanced statuses
- **Full epic loading:** Loads ALL epics (not selective)
- **Single source of truth:** All workflows use this file
- **Intelligent detection:** Auto-detects from file existence
- **Order matters:** Epic, stories, retrospective grouping
- **Metadata twice:** Comments for humans, YAML for parsing

## Configuration

Reads from `.bmad/config.yaml`:

```yaml
output_folder: .bmad
project_name: "Project Name"
sprint_artifacts: .bmad/sprint-artifacts
bmad_folder: .bmad
```

**Output file:**
- `.bmad/sprint-artifacts/sprint-status.yaml`

**Input files:**
- `.bmad/epics.md` (whole document)
- OR `.bmad/epics/epic-*.md` (sharded)
