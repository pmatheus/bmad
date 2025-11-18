---
description: Mark a drafted story as ready for development - updates story file and sprint status
---

# Story Ready Workflow

## Purpose

Marks a drafted story as ready for development by updating the story file status to `ready-for-dev` and synchronizing the status change in `sprint-status.yaml`. This is a simple status update workflow that maintains dual synchronization between story files and sprint tracking without performing complex searching or analysis.

**Prerequisites:**
- BMAD plugin installed (`/bmad:bmm:workflows:workflow-init` run)
- `sprint-planning` workflow run (creates `sprint-status.yaml`)
- At least one story with status `drafted` (created via `create-story`)
- Configuration file at `.bmad/config.yaml`

---

## Variables

The following variables are extracted from `.bmad/config.yaml`:

- **`documentation_dir`**: Directory where `sprint-status.yaml` is located (e.g., `docs/bmad`)
- **`sprint_artifacts`**: Directory where story files are stored (e.g., `docs/bmad/stories`)
- **`user_name`**: User's name for personalized messages in output
- **`story_key`**: Story identifier matching pattern `number-number-name` (e.g., `1-2-user-auth`), extracted from filename or selected by user
- **`story_id`**: Story identifier extracted from story file metadata (e.g., `1.2`)
- **`story_title`**: Title of the story extracted from story file
- **`story_file`**: Full path to the story file being updated

---

## Instructions

### 1. Load Configuration

Read configuration from `.bmad/config.yaml` to obtain:
- `documentation_dir`: Where sprint-status.yaml is located
- `sprint_artifacts`: Where story files are stored
- `user_name`: For personalized messages

### 2. Identify Target Story

**If story path provided directly:**
- Use the provided path as `story_file`
- Extract `story_key` from filename (e.g., `1-2-user-auth.md` → `1-2-user-auth`)
- Skip to step 3

**If no story path provided:**

1. Load COMPLETE file: `{documentation_dir}/sprint-status.yaml`
2. Read ALL lines from beginning to end (preserve order and structure)
3. Parse `development_status` section
4. Find ALL stories where:
   - Key matches pattern: `number-number-name` (e.g., `1-2-user-auth`)
   - NOT an epic key (`epic-X`) or retrospective (`epic-X-retrospective`)
   - Status value equals `"drafted"`
5. Collect up to 10 drafted stories for display
6. Count total drafted stories found

**If no drafted stories found:**
- Display message explaining no drafted stories exist
- Suggest running `create-story` to draft more stories or `sprint-planning` to refresh tracking
- HALT workflow

**If drafted stories found:**
- Display list of available drafted stories (up to 10)
- Use `AskUserQuestion` tool to let user select which story to mark ready
- Provide options with label (story key) and description
- In non-interactive mode: auto-select first story from list
- Resolve `story_key` from selection and find matching story file in `{sprint_artifacts}` directory

### 3. Update Story File

1. Read the story file from resolved path
2. Extract `story_id` and `story_title` from file metadata
3. Locate the "Status:" line (usually near top of file)
4. Update the status line to:
   ```markdown
   Status: ready-for-dev
   ```
5. Save the updated story file

**Example change:**
```diff
- Status: drafted
+ Status: ready-for-dev
```

### 4. Update Sprint Status File

1. Load COMPLETE file: `{documentation_dir}/sprint-status.yaml`
2. Read ALL lines preserving order, comments, and structure
3. Locate `development_status` section
4. Find key matching `{story_key}`
5. Verify current status is `"drafted"` (expected previous state)
6. Update the status value:
   ```yaml
   development_status:
     {story_key}: "ready-for-dev"
   ```
7. Save file preserving ALL comments, structure, and STATUS DEFINITIONS
8. Maintain exact order of all entries

**If story key not found in sprint-status.yaml:**
- Display warning that story file was updated but sprint status could not be updated
- Suggest running `sprint-planning` to refresh tracking
- Continue workflow (partial success)

**Example change:**
```diff
development_status:
-  1-2-user-auth: "drafted"
+  1-2-user-auth: "ready-for-dev"
```

### 5. Validate Status Transition

**Allowed transition:**
- `drafted` → `ready-for-dev` ✅

**Not allowed transitions:**
- `ready-for-dev` → `drafted` ❌
- `in-progress` → `drafted` ❌
- `done` → `ready-for-dev` ❌

If story is not in `drafted` status, display error message and halt.

### 6. Preserve Data Integrity

**Critical requirements:**
- Always read COMPLETE sprint-status.yaml file (ALL lines from beginning to end)
- Never skip content or sections
- Preserve order of all stories
- Preserve all comments and STATUS DEFINITIONS
- Never reorder or restructure
- Maintain dual sync between story file and sprint status
- Update both files atomically (story file first, then sprint status)

---

## Workflow

```
START
  ↓
1. Read .bmad/config.yaml
   → Extract: documentation_dir, sprint_artifacts, user_name
  ↓
2. Determine story selection mode
   ├─→ Story path provided? → Extract story_key from filename → Go to step 4
   └─→ No path provided? → Continue to step 3
  ↓
3. Search for drafted stories
   ├─→ Read sprint-status.yaml (COMPLETE file)
   ├─→ Parse development_status section
   ├─→ Filter stories with status="drafted"
   ├─→ Count drafted stories
   │
   ├─→ No drafted stories found?
   │   ├─→ Display "No drafted stories" message
   │   ├─→ Suggest: create-story or sprint-planning
   │   └─→ HALT
   │
   └─→ Drafted stories found?
       ├─→ Display list (up to 10 stories)
       ├─→ Ask user to select story (AskUserQuestion)
       ├─→ Non-interactive mode: auto-select first
       └─→ Resolve story_key from selection
  ↓
4. Update story file
   ├─→ Read story file from sprint_artifacts/{story_key}.md
   ├─→ Extract: story_id, story_title from metadata
   ├─→ Verify current status is "drafted"
   ├─→ Update Status: drafted → ready-for-dev
   └─→ Save story file
  ↓
5. Update sprint status file
   ├─→ Read sprint-status.yaml (COMPLETE file)
   ├─→ Locate development_status section
   ├─→ Find story_key entry
   ├─→ Verify current status is "drafted"
   ├─→ Update: drafted → ready-for-dev
   ├─→ Preserve ALL structure, comments, order
   └─→ Save sprint-status.yaml
  ↓
6. Validate dual sync
   ├─→ Story file updated? ✅
   └─→ Sprint status updated? ✅
  ↓
7. Report completion (see Report section)
  ↓
END
```

**Key decision points:**
- Story path provided vs. search required
- Drafted stories found vs. none found
- Interactive vs. non-interactive mode
- Story key found in sprint-status vs. not found

**Error handling:**
- No drafted stories: Display helpful message, suggest next steps, halt
- Story not found in sprint-status: Warn user, suggest sprint-planning refresh
- Invalid status transition: Display error, halt

---

## Report

Upon successful completion, display a structured success message:

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

**For partial success (story file updated but sprint status not found):**

```
⚠️ Story file updated, but could not update sprint-status: {story_key} not found

You may need to run sprint-planning to refresh tracking.

**Story file:** `{story_file}` → Status: ready-for-dev
```

**For no drafted stories found:**

```
📋 No drafted stories found in sprint-status.yaml

All stories are either still in backlog or already marked ready/in-progress/done.

**Options:**
1. Run `create-story` to draft more stories
2. Run `sprint-planning` to refresh story tracking
```

**Report should include:**
1. Clear success/failure indication (✅/⚠️/📋 symbols)
2. Story details (ID, key, title, file path, new status)
3. Files modified (story file and/or sprint-status.yaml)
4. Actionable next steps with specific workflow commands
5. Context about why each next step is recommended
6. Troubleshooting guidance if partial failure or no action taken

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
sprint_artifacts: "docs/bmad/stories"    # Where story files are stored
user_name: "Developer"                   # For personalized messages
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
