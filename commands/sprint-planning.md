---
description: Generate and manage sprint status tracking file by extracting all epics and stories from epic files
---

# Sprint Planning

## Purpose

This workflow generates a comprehensive **sprint-status.yaml** file that serves as the **single source of truth** for project status tracking. It extracts all epics and stories from epic files, detects their current status based on existing files, and maintains a complete development lifecycle tracking system that all other workflows use to find and update work items.

**What it does:**
- Extracts all epics and stories from epic files
- Tracks status of each epic and story
- Automatically detects current status based on existing files
- Preserves advanced statuses (never downgrades)
- Provides complete development tracking
- Enables other workflows to find next work items

**Key capabilities:**
- Re-runnable without losing progress
- Intelligent status detection from file system
- Preservation of advanced states
- Validation and consistency checking
- Seamless integration with other workflows

## Variables

All variables are read from `.bmad/config.yaml`:

| Variable | Type | Description |
|----------|------|-------------|
| `documentation_dir` | string | Directory where documentation is stored (e.g., `.bmad`) |
| `project_name` | string | Name of the project |
| `project_key` | string | Kebab-case project identifier (derived from project_name if not set) |
| `sprint_artifacts` | string | Directory for sprint-related files (e.g., `.bmad/sprint-artifacts`) |
| `bmad_folder` | string | BMAD installation directory |
| `current_date` | string | Current date in YYYY-MM-DD format (auto-generated) |

**Derived paths:**
- Epic files: `{documentation_dir}/epics.md` OR `{documentation_dir}/epics/epic-*.md`
- Tech specs: `{sprint_artifacts}/tech-spec-epic-{N}.md`
- Story files: `{sprint_artifacts}/stories/{story-key}.md`
- Story context: `{sprint_artifacts}/stories/{story-key}.context.xml`
- Output file: `{sprint_artifacts}/sprint-status.yaml`

**Status values:**

Epic statuses:
- `backlog` - Epic exists in epic file but not contexted
- `contexted` - Epic tech context created

Story statuses:
- `backlog` - Story only exists in epic file
- `drafted` - Story file created in stories folder
- `ready-for-dev` - Draft approved and story context created
- `in-progress` - Developer actively working on implementation
- `review` - Under code review
- `done` - Story completed

Retrospective statuses:
- `optional` - Can be completed but not required
- `completed` - Retrospective has been done

## Instructions

### Prerequisites Check

Before running this workflow, verify:

- [ ] BMAD plugin installed in Claude Code
- [ ] Project initialized (`/bmad:meta:workflow-init`)
- [ ] Epics created (`/bmad:phase-2:create-epics-and-stories`)

**Required files:**
- `.bmad/config.yaml` - Project configuration
- `{documentation_dir}/epics.md` OR `{documentation_dir}/epics/epic-{N}.md` - Epic files with stories

### Step 1: Load Configuration

Read project configuration from `.bmad/config.yaml`:

```javascript
{
  documentation_dir: string,        // Where docs are stored
  project_name: string,             // Project name
  project_key: string,              // Project identifier
  sprint_artifacts: string,         // Sprint files location
  bmad_folder: string               // BMAD install location
}
```

Store these values for use throughout the workflow.

### Step 2: Find and Load Epic Files

**Search for epic files in priority order:**

1. **Whole document:** `{documentation_dir}/epics.md` OR `{documentation_dir}/bmm-epics.md`
2. **Sharded documents:** `{documentation_dir}/epics/index.md`

**If whole document found:**
- Read entire file
- Process all epics and stories from single file

**If sharded version found:**
- Read `{documentation_dir}/epics/index.md`
- Read ALL epic section files (e.g., `epic-1.md`, `epic-2.md`, etc.)
- Combine content for processing

**If no epic files found:**
```
⚠️ No epic files found

Cannot generate sprint status without epics.

Run /bmad:phase-2:create-epics-and-stories to create epics first.
```
→ HALT workflow

**Fuzzy matching:** Be flexible with file names:
- `epics.md`, `bmm-epics.md`, `user-stories.md`
- Any `*epic*.md` files in documentation directory

### Step 3: Parse Epics and Stories

**Extract epic headers:**
```markdown
## Epic 1: User Management
## Epic 2: Profile System
```

From each epic header, extract:
- Epic number (1, 2, etc.)
- Epic title

**Extract story headers:**
```markdown
### Story 1.1: User Authentication
### Story 1.2: Account Management
### Story 2.1: Profile Editing
```

From each story header, extract:
- Epic number (1, 2, etc.)
- Story number (1, 2, etc.)
- Story title

**Convert to kebab-case keys:**

Conversion process:
1. Replace period with dash: `1.1` → `1-1`
2. Convert title to kebab-case: `User Authentication` → `user-authentication`
3. Combine: `1-1-user-authentication`

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
{sprint_artifacts}/tech-spec-epic-{epic_num}.md
```

- If file exists → status: `contexted`
- If not exists → status: `backlog`

**For each story:**

Start with default: `backlog`

**Check 1: Story file exists?**
```
{sprint_artifacts}/stories/{story-key}.md
```
If exists → upgrade to `drafted` (if not already higher)

**Check 2: Story context exists?**
```
{sprint_artifacts}/stories/{story-key}.context.xml
```
If exists → upgrade to `ready-for-dev` (if not already higher)

**Check 3: Existing status file?**

If `{sprint_artifacts}/sprint-status.yaml` exists:
- Read existing status for this story/epic
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

**Example 1:**
- File detection says: `drafted` (story file exists)
- Existing status file says: `in-progress`
- Result: Keep `in-progress` (more advanced)

**Example 2:**
- File detection says: `ready-for-dev` (context exists)
- Existing status file says: `backlog`
- Result: Upgrade to `ready-for-dev` (file evidence found)

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

**File path:** `{sprint_artifacts}/sprint-status.yaml`

**Full structure:**

```yaml
# generated: {current_date}
# project: {project_name}
# project_key: {project_key}
# tracking_system: file-system
# story_location: {sprint_artifacts}/stories

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
story_location: {sprint_artifacts}/stories

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

**Write to file:** `{sprint_artifacts}/sprint-status.yaml`

### Step 7: Validate Generated File

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
  epics_backlog: count,
  epics_contexted: count,
  stories_backlog: count,
  stories_drafted: count,
  stories_ready: count,
  stories_in_progress: count,
  stories_in_review: count,
  stories_done: count,
  completion_percentage: (stories_done / total_stories * 100)
}
```

**If validation fails:**
- Report specific validation errors
- Do not proceed to next step
- Provide corrective guidance

### Step 8: Determine Next Workflow

**Check for auto-continuation to epic-tech-context:**

**IF** architecture.md exists AND at least one epic in backlog:
- Auto-continue to `/bmad:phase-4:epic-tech-context`
- No user permission needed (runs autonomously)

**ELSE IF** architecture.md does NOT exist:
- Recommend running `/bmad:phase-3:architecture` first
- Or skip directly to `/bmad:phase-4:create-story`

**ELSE IF** all epics already contexted:
- Recommend `/bmad:phase-4:create-story` for next work

## Workflow

```
┌─────────────────────────────────────┐
│ 1. Load Configuration               │
│    └─ Read .bmad/config.yaml        │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│ 2. Find Epic Files                  │
│    ├─ Try epics.md (whole)          │
│    ├─ Try epics/index.md (sharded)  │
│    └─ HALT if not found             │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│ 3. Parse Epics & Stories            │
│    ├─ Extract epic headers          │
│    ├─ Extract story headers         │
│    ├─ Convert to kebab-case keys    │
│    └─ Build inventory               │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│ 4. Detect Current Status            │
│    ├─ Check tech spec files         │
│    ├─ Check story files             │
│    ├─ Check context files           │
│    ├─ Read existing sprint-status   │
│    └─ Apply preservation logic      │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│ 5. Build Status Structure           │
│    ├─ Create epic entries           │
│    ├─ Create story entries          │
│    ├─ Create retrospective entries  │
│    └─ Maintain proper order         │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│ 6. Generate Sprint Status File      │
│    ├─ Add metadata (comments+YAML)  │
│    ├─ Add status definitions        │
│    ├─ Add workflow notes            │
│    ├─ Add development_status        │
│    └─ Write to sprint-status.yaml   │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│ 7. Validate Generated File          │
│    ├─ Check completeness            │
│    ├─ Check consistency             │
│    ├─ Validate YAML syntax          │
│    ├─ Count totals                  │
│    └─ Report validation results     │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│ 8. Determine Next Workflow          │
│    ├─ Check architecture.md exists  │
│    ├─ Check for backlog epics       │
│    ├─ Auto-continue if appropriate  │
│    └─ Or recommend next step        │
└─────────────────────────────────────┘
```

**Key principles:**

1. **Single Source of Truth** - All workflows use this file for status
2. **Intelligent Status Detection** - Auto-detect from file existence
3. **Never Downgrade** - Preserve advanced statuses, only upgrade with evidence
4. **Full Epic Loading** - Load ALL epics (not selective)
5. **Re-runnable** - Safe to run multiple times without losing progress

**Status state machines:**

Epic: `backlog → contexted`
Story: `backlog → drafted → ready-for-dev → in-progress → review → done`
Retrospective: `optional ↔ completed`

## Report

### Completion Report Format

```
✅ Sprint Status Generated Successfully

**File Location:** {sprint_artifacts}/sprint-status.yaml

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
{context-dependent recommendation}
```

### Context-Dependent Recommendations

**If architecture exists AND epics in backlog:**
```
🚀 Auto-continuing to epic tech context...

Creating technical specification for first epic.
```
Then execute: `/bmad:phase-4:epic-tech-context`

**If architecture does NOT exist:**
```
📋 Next Step: Architecture Recommended

Before creating epic tech specs, run architecture workflow:
/bmad:phase-3:architecture

Or skip directly to story creation:
/bmad:phase-4:create-story
```

**If all epics already contexted:**
```
✅ All epics already contexted. Ready for story implementation.

Next: /bmad:phase-4:create-story
```

**If new epics added:**
```
✅ Sprint Status Updated - New Epic Added

New Epic {N} added with {count} stories!

Next: Continue current epic, then context Epic {N}
```

### Error Reporting

**No epic files found:**
```
⚠️ No epic files found

Cannot generate sprint status without epics.

Run /bmad:phase-2:create-epics-and-stories to create epics first.
```

**Invalid YAML syntax:**
```
⚠️ Generated file has invalid YAML syntax

Cause: Story titles with special characters (:, #, |, etc.)

Solution: Check story titles and ensure proper YAML escaping
```

**Existing file corrupted:**
```
⚠️ Existing sprint-status.yaml is corrupted

Backing up to sprint-status.yaml.backup and creating fresh file.

Review backup to recover any manual edits.
```

**Validation failed:**
```
⚠️ Validation failed: {count} stories from epic files not in status file

Cause: Epic files updated but sprint-planning not re-run.

Solution: Re-run /bmad:phase-4:sprint-planning to sync.
```

**Status downgrade detected:**
```
⚠️ Warning: {count} stories had status downgraded

Details:
- {story-key}: was {old_status}, now {new_status}

Solution: Manually restore correct statuses in YAML file
```

### Validation Checklist Report

After generation, report validation status:

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
- [ ] No downgrades occurred

**Structure Validation:**
- [ ] All status values are legal
- [ ] No orphaned items
- [ ] Order maintained (epic → stories → retrospective)
- [ ] Metadata duplicated (comments + YAML)

**Documentation:**
- [ ] STATUS DEFINITIONS section included
- [ ] WORKFLOW NOTES section included
- [ ] Comments explain structure
