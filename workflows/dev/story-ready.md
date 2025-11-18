---
description: Mark a drafted story as ready for development - updates story file and sprint status
---

# Story Ready Workflow

## What This Does

Marks a drafted story as ready for development by:
1. Updating the story file status to `ready-for-dev`
2. Updating `sprint-status.yaml` to track the status change
3. Preserving sprint status file structure and order
4. Guiding next steps (story-context or dev-story)

**Simple status update workflow - no complex searching or analysis.**

---

## Prerequisites

- BMAD plugin installed (`/bmad:bmm:workflows:workflow-init` run)
- `sprint-planning` workflow run (creates `sprint-status.yaml`)
- At least one story with status `drafted` (created via `create-story`)
- Configuration file at `.bmad/config.yaml`

---

## How It Works

```
1. Read sprint-status.yaml → Find drafted stories
2. Let user select which story to mark ready (or auto-select first)
3. Update story file: Status → ready-for-dev
4. Update sprint-status.yaml: drafted → ready-for-dev
5. Suggest next steps (story-context recommended)
```

**Key behavior:**
- Reads COMPLETE sprint-status.yaml (preserves order and structure)
- Updates both story file AND sprint status (dual sync)
- Never downgrades status (drafted → ready only)
- Can accept story path directly or search sprint status

---

## Instructions

### Step 1: Load Configuration

Read configuration from `.bmad/config.yaml`:

```yaml
documentation_dir: path/to/output
sprint_artifacts: path/to/stories
user_name: User's name
```

**Variables needed:**
- `documentation_dir`: Where sprint-status.yaml is located
- `sprint_artifacts`: Where story files are stored
- `user_name`: For personalized messages

### Step 2: Find Drafted Stories

**If story path provided directly:**
- Use the provided path
- Extract story_key from filename (e.g., `1-2-user-auth.md` → `1-2-user-auth`)
- Skip to Step 3

**If no story path provided:**

1. Load COMPLETE file: `{documentation_dir}/sprint-status.yaml`
2. Read ALL lines from beginning to end (preserve order)
3. Parse `development_status` section
4. Find ALL stories where:
   - Key matches pattern: `number-number-name` (e.g., `1-2-user-auth`)
   - NOT an epic key (`epic-X`) or retrospective (`epic-X-retrospective`)
   - Status value equals `"drafted"`
5. Collect up to 10 drafted stories (for display)
6. Count total drafted stories found

**If no drafted stories found:**
```
📋 No drafted stories found in sprint-status.yaml

All stories are either still in backlog or already marked ready/in-progress/done.

**Options:**
1. Run `create-story` to draft more stories
2. Run `sprint-planning` to refresh story tracking
```
**HALT**

**If drafted stories found:**

Display available stories:
```
**Drafted Stories Available (X found):**

1. 1-1-story-title
2. 1-2-another-story
3. 2-1-story-name
...
```

Use AskUserQuestion to let user select which story to mark ready:
```yaml
questions:
  - question: "Which story would you like to mark as ready for development?"
    header: "Select Story"
    multiSelect: false
    options:
      - label: "1-1-story-title"
        description: "First story in epic 1"
      - label: "1-2-another-story"
        description: "Second story in epic 1"
      # ... up to 10 options
```

**If non-interactive mode:**
- Auto-select first story from the list

Resolve `story_key` from selection and find matching story file in `{sprint_artifacts}` directory.

### Step 3: Update Story File

1. Read the story file from resolved path
2. Extract `story_id` and `story_title` from file metadata
3. Find the "Status:" line (usually near top of file)
4. Update story file:
   ```markdown
   Status: ready-for-dev
   ```
5. Save the story file

**Example story file update:**
```diff
- Status: drafted
+ Status: ready-for-dev
```

### Step 4: Update Sprint Status

1. Load COMPLETE file: `{documentation_dir}/sprint-status.yaml`
2. Find `development_status` key matching `{story_key}`
3. Verify current status is `"drafted"` (expected previous state)
4. Update:
   ```yaml
   development_status:
     {story_key}: "ready-for-dev"
   ```
5. Save file, preserving ALL comments and structure including STATUS DEFINITIONS

**If story key not found:**
```
⚠️ Story file updated, but could not update sprint-status: {story_key} not found

You may need to run sprint-planning to refresh tracking.
```

**Example sprint-status.yaml update:**
```diff
development_status:
-  1-2-user-auth: "drafted"
+  1-2-user-auth: "ready-for-dev"
```

### Step 5: Confirm Completion

Display success message:
```
**Story Marked Ready for Development, {user_name}!**

✅ Story file updated: `{story_file}` → Status: ready-for-dev
✅ Sprint status updated: drafted → ready-for-dev

**Story Details:**
- **ID:** {story_id}
- **Key:** {story_key}
- **Title:** {story_title}
- **File:** `{story_file}`
- **Status:** ready-for-dev

**Next Steps:**

1. **Recommended:** Run `story-context` workflow to generate implementation context
   - Creates comprehensive context XML for DEV agent
   - Includes relevant architecture, dependencies, and existing code
   - Better quality implementation

2. **Alternative:** Skip context generation and go directly to `dev-story` workflow
   - Faster, but DEV agent will have less context
   - Only recommended for simple, well-understood stories

**To proceed:**
- For context generation: `/bmad:bmm:workflows:story-context`
- For direct implementation: `/bmad:bmm:workflows:dev-story`
```

---

## Key Principles

### 1. Preserve Sprint Status Structure

**Critical:** Always read COMPLETE sprint-status.yaml file:
- Read ALL lines from beginning to end
- Never skip content or sections
- Preserve order of stories
- Preserve all comments and STATUS DEFINITIONS
- Never reorder or restructure

**Why:** Sprint status is the single source of truth for story tracking.

### 2. Dual Sync (Story File + Sprint Status)

**Always update both:**
1. Story file Status field
2. sprint-status.yaml development_status entry

**Why:** Prevents inconsistencies between story files and tracking.

### 3. Never Downgrade Status

**Direction:** drafted → ready-for-dev only

**Not allowed:**
- ready-for-dev → drafted ❌
- in-progress → drafted ❌
- done → ready-for-dev ❌

**Why:** Status only moves forward through the lifecycle.

### 4. Simple Selection

**Two modes:**
1. **Direct path provided:** Use immediately, no search
2. **No path provided:** List drafted stories, let user select

**Why:** Flexible for both manual and automated workflows.

---

## Examples

### Example 1: Mark First Drafted Story as Ready

**Context:**
- Sprint status has 3 drafted stories
- User wants to start implementing first one

**Execution:**

1. **Read sprint-status.yaml:**
   ```yaml
   development_status:
     1-1-setup-project: "drafted"
     1-2-user-auth: "drafted"
     1-3-user-profile: "drafted"
   ```

2. **Display options:**
   ```
   **Drafted Stories Available (3 found):**
   1. 1-1-setup-project
   2. 1-2-user-auth
   3. 1-3-user-profile
   ```

3. **User selects:** `1-1-setup-project`

4. **Update story file:**
   ```markdown
   # Story 1.1: Setup Project Infrastructure

   Status: ready-for-dev  # ← Changed from "drafted"
   Epic: Epic 1 - Foundation
   ```

5. **Update sprint-status.yaml:**
   ```yaml
   development_status:
     1-1-setup-project: "ready-for-dev"  # ← Changed
     1-2-user-auth: "drafted"
     1-3-user-profile: "drafted"
   ```

6. **Result:**
   ```
   ✅ Story marked ready: 1-1-setup-project

   Next: Run story-context to prepare implementation context
   ```

**Files changed:**
- `stories/1-1-setup-project.md` (Status updated)
- `sprint-status.yaml` (Status updated)

---

### Example 2: Direct Path Provided (Non-Interactive)

**Context:**
- Automation script provides story path directly
- No user interaction needed

**Execution:**

1. **Story path provided:** `stories/2-3-payment-integration.md`

2. **Extract story_key:** `2-3-payment-integration`

3. **Read story file:**
   ```markdown
   # Story 2.3: Payment Integration

   Story ID: 2.3
   Status: drafted
   Epic: Epic 2 - Payments
   ```

4. **Update story file:**
   ```markdown
   Status: ready-for-dev  # ← Changed
   ```

5. **Update sprint-status.yaml:**
   ```yaml
   development_status:
     2-3-payment-integration: "ready-for-dev"  # ← Changed from "drafted"
   ```

6. **Result:**
   ```
   ✅ Story file updated: stories/2-3-payment-integration.md → Status: ready-for-dev
   ✅ Sprint status updated: drafted → ready-for-dev

   Story Details:
   - ID: 2.3
   - Key: 2-3-payment-integration
   - Title: Payment Integration
   ```

**No user interaction required - fully automated.**

---

### Example 3: No Drafted Stories Available

**Context:**
- All stories already marked ready or in progress
- sprint-planning shows no drafted stories

**Execution:**

1. **Read sprint-status.yaml:**
   ```yaml
   development_status:
     1-1-setup-project: "ready-for-dev"
     1-2-user-auth: "in-progress"
     1-3-user-profile: "done"
   ```

2. **Search for drafted stories:** None found

3. **Display message:**
   ```
   📋 No drafted stories found in sprint-status.yaml

   All stories are either still in backlog or already marked ready/in-progress/done.

   **Options:**
   1. Run `create-story` to draft more stories
   2. Run `sprint-planning` to refresh story tracking
   ```

4. **HALT** (no action taken)

**User action needed:** Create more stories or check sprint status.

---

## Troubleshooting

### Issue: Story key not found in sprint-status.yaml

**Symptoms:**
```
⚠️ Story file updated, but could not update sprint-status: 1-2-user-auth not found
```

**Cause:** sprint-status.yaml is out of sync with story files

**Solution:**
```bash
# Re-run sprint-planning to refresh tracking
/bmad:bmm:workflows:sprint-planning
```

**Why:** sprint-planning scans all story files and rebuilds the status tracking.

---

### Issue: No drafted stories found

**Symptoms:**
```
📋 No drafted stories found in sprint-status.yaml
```

**Cause:** No stories have been drafted yet, or all are already ready/in-progress/done

**Solution:**
```bash
# Create more stories
/bmad:bmm:workflows:create-story

# Or refresh sprint status
/bmad:bmm:workflows:sprint-planning
```

---

### Issue: Story status is not "drafted"

**Symptoms:**
```
Story status must be "drafted" to mark as ready
```

**Cause:** Story is already in a later state (ready-for-dev, in-progress, done)

**Solution:**
- Check current status in story file or sprint-status.yaml
- This workflow only moves drafted → ready-for-dev
- If story is already ready or later, no action needed

**Status flow:**
```
backlog → drafted → ready-for-dev → in-progress → review → done
          ↑                ↑
          create-story     story-ready (this workflow)
```

---

## Related Workflows

**Before story-ready:**
- `/bmad:bmm:workflows:sprint-planning` - Initialize sprint tracking
- `/bmad:bmm:workflows:create-story` - Draft a story (sets status to "drafted")

**After story-ready:**
- `/bmad:bmm:workflows:story-context` - Generate implementation context (RECOMMENDED)
- `/bmad:bmm:workflows:dev-story` - Implement the story

**Status management:**
- `/bmad:bmm:workflows:story-done` - Mark story as done after review

**Navigation:**
```
sprint-planning
  ↓
create-story (drafted)
  ↓
story-ready (ready-for-dev) ← YOU ARE HERE
  ↓
story-context (optional)
  ↓
dev-story (in-progress)
  ↓
code-review (review)
  ↓
story-done (done)
```

---

## Success Criteria

✅ **Story file updated** with `Status: ready-for-dev`

✅ **sprint-status.yaml updated** with matching status

✅ **File structure preserved** (all comments, order, definitions intact)

✅ **User receives clear next steps** (story-context or dev-story)

✅ **No errors** if story not found (clear messaging instead)

---

## Configuration

Reads from `.bmad/config.yaml`:

```yaml
documentation_dir: "docs/bmad"           # Where sprint-status.yaml is located
sprint_artifacts: "docs/bmad/stories" # Where story files are stored
user_name: "Developer"               # For personalized messages
```

---

## Output Files

### Modified Files

**1. Story File** (`{sprint_artifacts}/{story_key}.md`)
```markdown
Status: ready-for-dev  # ← Updated
```

**2. Sprint Status** (`{documentation_dir}/sprint-status.yaml`)
```yaml
development_status:
  {story_key}: "ready-for-dev"  # ← Updated from "drafted"
```

**No new files created - only status updates.**

---

## Notes

- **Simple workflow:** Just status updates, no analysis
- **Dual sync:** Updates both story file and sprint status
- **Preserves structure:** Never reorders or restructures sprint-status.yaml
- **Safe to re-run:** Can mark same story multiple times (idempotent)
- **Never downgrades:** Only moves status forward (drafted → ready-for-dev)
- **Flexible input:** Accepts direct path or searches sprint status
- **Clear next steps:** Recommends story-context for better implementation

**Typical usage:**
1. Developer reviews drafted story
2. Confirms it's ready to implement
3. Runs this workflow to update status
4. Proceeds to story-context or dev-story

**Time:** < 1 minute (just status updates)
