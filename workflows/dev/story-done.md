---
description: Mark a story as done after review - updates story file, adds completion notes, updates sprint status
---

# Story Done Workflow

## Purpose

Marks a story as done (Definition of Done complete) by updating the story file status to `done`, adding completion notes to Dev Agent Record section, and updating `sprint-status.yaml` to track completion while preserving file structure and order.

**Simple status update workflow - run after code review approval.**

**Prerequisites:**
- BMAD plugin installed (`/bmad:bmm:workflows:workflow-init` run)
- `sprint-planning` workflow run (creates `sprint-status.yaml`)
- At least one story with status `review` (completed via `code-review`)
- Configuration file at `.bmad/config.yaml`

---

## Variables

The following variables are used in this workflow:

- `{documentation_dir}`: Directory where `sprint-status.yaml` is located (from `.bmad/config.yaml`)
- `{sprint_artifacts}`: Directory where story files are stored in `stories/` subdirectory (from `.bmad/config.yaml`)
- `{user_name}`: User's name for personalized messages (from `.bmad/config.yaml`)
- `{date}`: Current date (system-generated)
- `{story_key}`: Story identifier matching pattern `number-number-name` (e.g., `1-2-user-auth`)
- `{story_id}`: Story ID from story file metadata (e.g., `1.2`)
- `{story_title}`: Story title from story file metadata (e.g., `User Authentication`)

**Configuration File** (`.bmad/config.yaml`):
```yaml
documentation_dir: "docs/bmad"      # Where sprint-status.yaml is located
sprint_artifacts: "docs/bmad"       # Where stories/ subdirectory is located
user_name: "Developer"              # For personalized messages
```

---

## Instructions

### Step 1: Load Configuration

Read configuration from `.bmad/config.yaml` to obtain:
- `documentation_dir`: Where sprint-status.yaml is located
- `sprint_artifacts`: Where story files are stored (in `stories/` subdirectory)
- `user_name`: For personalized messages
- `date`: Current date (system-generated)

### Step 2: Find Reviewed Story

**If story path provided directly:**
1. Use the provided path
2. Read COMPLETE story file and parse sections
3. Extract `story_key` from filename or story metadata
4. Verify Status is `review` - if not, HALT with error message:
   ```
   Story status must be "review" to mark as done
   Current status: {current_status}

   Required flow:
   in-progress → code-review → review → story-done → done
   ```
5. Skip to Step 3

**If no story path provided:**
1. Load COMPLETE file: `{documentation_dir}/sprint-status.yaml`
2. Read ALL lines from beginning to end (preserve order)
3. Parse `development_status` section
4. Find FIRST story (reading top to bottom) where:
   - Key matches pattern: `number-number-name` (e.g., `1-2-user-auth`)
   - NOT an epic key (`epic-X`) or retrospective (`epic-X-retrospective`)
   - Status value equals `"review"`

**If no reviewed story found:**
Display message and HALT:
```
📋 No stories with status "review" found

All stories are either still in development or already done.

**Next Steps:**
1. Run `dev-story` to implement stories
2. Run `code-review` if stories need review first
3. Check sprint-status.yaml for current story states
```

**If reviewed story found:**
1. Use the first reviewed story automatically (no user selection needed)
2. Find matching story file in `{sprint_artifacts}/stories/` using `story_key` pattern
3. Read the COMPLETE story file

### Step 3: Update Story File

1. Extract `story_id` and `story_title` from story file metadata
2. Find the "Status:" line (usually near top of file)
3. Update story file to `Status: done`
4. Add completion notes to Dev Agent Record section:
   - Find "## Dev Agent Record" section
   - Add completion notes:
     ```markdown
     ### Completion Notes
     **Completed:** {date}
     **Definition of Done:** All acceptance criteria met, code reviewed, tests passing
     ```
5. Save the story file

**Example story file update:**
```diff
- Status: review
+ Status: done

## Dev Agent Record

[existing content...]

+ ### Completion Notes
+ **Completed:** 2025-01-13
+ **Definition of Done:** All acceptance criteria met, code reviewed, tests passing
```

### Step 4: Update Sprint Status

1. Load COMPLETE file: `{documentation_dir}/sprint-status.yaml`
2. Find `development_status` key matching `{story_key}`
3. Verify current status is `"review"` (expected previous state)
4. Update to:
   ```yaml
   development_status:
     {story_key}: "done"
   ```
5. Save file, preserving ALL comments and structure including STATUS DEFINITIONS

**If story key not found:**
Display warning:
```
⚠️ Story file updated, but could not update sprint-status: {story_key} not found

Story is marked Done in file, but sprint-status.yaml may be out of sync.
```

**Example sprint-status.yaml update:**
```diff
development_status:
-  1-2-user-auth: "review"
+  1-2-user-auth: "done"
```

### Step 5: Confirm Completion

Display success message with next steps (see Report section below).

---

## Workflow

The workflow follows this execution sequence:

```
1. Read sprint-status.yaml → Find reviewed stories
2. Auto-select first reviewed story (or use provided path)
3. Update story file: Status → done
4. Add completion notes to Dev Agent Record
5. Update sprint-status.yaml: review → done
6. Suggest next steps (next story or epic retrospective)
```

**Key Behavior:**
- Reads COMPLETE sprint-status.yaml (preserves order and structure)
- Updates both story file AND sprint status (dual sync)
- Adds completion timestamp and notes
- Auto-advances to first reviewed story (no selection needed)
- Never downgrades status (review → done only)

**Key Principles:**

### 1. Auto-Advance to First Reviewed Story
- Automatically selects first story with status `review`
- No user interaction needed - streamlines the workflow
- After code review, the next logical step is marking approved story as done

### 2. Preserve Sprint Status Structure
- Always read COMPLETE sprint-status.yaml file
- Read ALL lines from beginning to end
- Never skip content or sections
- Preserve order of stories
- Preserve all comments and STATUS DEFINITIONS
- Never reorder or restructure

### 3. Dual Sync (Story File + Sprint Status)
- Always update both:
  1. Story file Status field
  2. sprint-status.yaml development_status entry
- Prevents inconsistencies between story files and tracking

### 4. Add Completion Evidence
- Always add completion notes:
  - Timestamp of completion
  - Confirmation that DoD is met
  - Adds to Dev Agent Record section
- Provides audit trail and completion evidence

### 5. Never Downgrade Status
- Direction: review → done only
- Not allowed:
  - done → review ❌
  - done → in-progress ❌
  - in-progress → done ❌ (must go through review first)
- Status only moves forward through the lifecycle

**Status Flow:**
```
story-ready (ready-for-dev)
  ↓
story-context (optional)
  ↓
dev-story (in-progress)
  ↓
code-review (review)
  ↓
story-done (done) ← THIS WORKFLOW
  ↓
retrospective (if epic complete)
```

---

## Report

Upon successful completion, display the following message to the user:

```
**Story Approved and Marked Done, {user_name}!**

✅ Story file updated → Status: done
✅ Sprint status updated: review → done

**Completed Story:**
- **ID:** {story_id}
- **Key:** {story_key}
- **Title:** {story_title}
- **Completed:** {date}

**Next Steps:**

1. Continue with next story in your backlog
   - Run `create-story` for next backlog story
   - Or run `dev-story` if ready stories exist
2. Check epic completion status
   - Run `retrospective` workflow to check if epic is complete
   - Epic retrospective will verify all stories are done
```

**Modified Files:**
1. **Story File** (`{sprint_artifacts}/stories/{story_key}.md`)
   - Status updated to `done`
   - Completion notes added to Dev Agent Record section

2. **Sprint Status** (`{documentation_dir}/sprint-status.yaml`)
   - Development status updated from `review` to `done`

**Success Criteria:**
- ✅ Story file updated with `Status: done`
- ✅ Completion notes added to Dev Agent Record section
- ✅ sprint-status.yaml updated with matching status
- ✅ File structure preserved (all comments, order, definitions intact)
- ✅ User receives clear next steps (next story or retrospective)
- ✅ No errors if story not found (clear messaging instead)

---

## Examples

### Example 1: Mark First Reviewed Story as Done

**Context:**
- Sprint status has 2 reviewed stories
- Code review approved first story
- User wants to mark it done

**Execution:**

1. **Read sprint-status.yaml:**
   ```yaml
   development_status:
     1-1-setup-project: "done"
     1-2-user-auth: "review"
     1-3-user-profile: "review"
     2-1-dashboard: "in-progress"
   ```

2. **Auto-select first reviewed story:** `1-2-user-auth`

3. **Read story file:**
   ```markdown
   # Story 1.2: User Authentication

   Story ID: 1.2
   Status: review
   Epic: Epic 1 - Foundation

   ## Dev Agent Record

   ### Implementation Notes
   - Implemented login/logout endpoints
   - Added JWT authentication
   - Created user sessions
   ```

4. **Update story file:**
   ```markdown
   Status: done  # ← Changed from "review"

   ## Dev Agent Record

   ### Implementation Notes
   - Implemented login/logout endpoints
   - Added JWT authentication
   - Created user sessions

   ### Completion Notes  # ← ADDED
   **Completed:** 2025-01-13
   **Definition of Done:** All acceptance criteria met, code reviewed, tests passing
   ```

5. **Update sprint-status.yaml:**
   ```yaml
   development_status:
     1-1-setup-project: "done"
     1-2-user-auth: "done"  # ← Changed from "review"
     1-3-user-profile: "review"
     2-1-dashboard: "in-progress"
   ```

6. **Result:**
   ```
   ✅ Story Approved and Marked Done!

   Completed Story:
   - ID: 1.2
   - Key: 1-2-user-auth
   - Title: User Authentication
   - Completed: 2025-01-13

   Next Steps:
   1. Continue with next story (1-3-user-profile in review)
   2. Check epic completion status
   ```

**Files changed:**
- `stories/1-2-user-auth.md` (Status updated, completion notes added)
- `sprint-status.yaml` (Status updated)

---

### Example 2: Direct Path Provided (Non-Interactive)

**Context:**
- Automation script provides story path directly
- No search needed

**Execution:**

1. **Story path provided:** `stories/3-4-analytics-dashboard.md`

2. **Extract story_key:** `3-4-analytics-dashboard`

3. **Read story file:**
   ```markdown
   # Story 3.4: Analytics Dashboard

   Story ID: 3.4
   Status: review
   Epic: Epic 3 - Analytics

   ## Dev Agent Record

   ### Implementation Notes
   - Built dashboard UI with React
   - Integrated Chart.js for visualizations
   - Added real-time data updates
   ```

4. **Verify status is "review":** ✅ Confirmed

5. **Update story file:**
   ```markdown
   Status: done  # ← Changed

   ## Dev Agent Record

   ### Implementation Notes
   - Built dashboard UI with React
   - Integrated Chart.js for visualizations
   - Added real-time data updates

   ### Completion Notes  # ← ADDED
   **Completed:** 2025-01-13
   **Definition of Done:** All acceptance criteria met, code reviewed, tests passing
   ```

6. **Update sprint-status.yaml:**
   ```yaml
   development_status:
     3-4-analytics-dashboard: "done"  # ← Changed from "review"
   ```

7. **Result:**
   ```
   ✅ Story file updated → Status: done
   ✅ Sprint status updated: review → done

   Completed Story:
   - ID: 3.4
   - Key: 3-4-analytics-dashboard
   - Title: Analytics Dashboard
   - Completed: 2025-01-13
   ```

**No user interaction required - fully automated.**

---

### Example 3: No Reviewed Stories Available

**Context:**
- No stories with status "review"
- All stories either in development or already done

**Execution:**

1. **Read sprint-status.yaml:**
   ```yaml
   development_status:
     1-1-setup-project: "done"
     1-2-user-auth: "done"
     1-3-user-profile: "in-progress"
     2-1-dashboard: "ready-for-dev"
   ```

2. **Search for reviewed stories:** None found

3. **Display message:**
   ```
   📋 No stories with status "review" found

   All stories are either still in development or already done.

   **Next Steps:**
   1. Run `dev-story` to implement stories
   2. Run `code-review` if stories need review first
   3. Check sprint-status.yaml for current story states
   ```

4. **HALT** (no action taken)

**User action needed:** Complete more stories or run code review.

---

### Example 4: Story Status Not "review" (Error)

**Context:**
- Story path provided, but status is "in-progress" not "review"
- Cannot mark as done without review

**Execution:**

1. **Story path provided:** `stories/2-2-payment-flow.md`

2. **Read story file:**
   ```markdown
   Status: in-progress  # ← Not "review"!
   ```

3. **Verify status:** ❌ Status is "in-progress", not "review"

4. **HALT with error:**
   ```
   Story status must be "review" to mark as done

   Current status: in-progress

   **Required flow:**
   in-progress → code-review → review → story-done → done
                                ↑
                       You need to run code-review first
   ```

**User action needed:** Run code-review workflow to move story to "review" status.

---

## Troubleshooting

### Issue: Story key not found in sprint-status.yaml

**Symptoms:**
```
⚠️ Story file updated, but could not update sprint-status: 2-3-payment not found
```

**Cause:** sprint-status.yaml is out of sync with story files

**Solution:**
```bash
# Re-run sprint-planning to refresh tracking
/bmad:bmm:workflows:sprint-planning
```

**Why:** sprint-planning scans all story files and rebuilds the status tracking.

---

### Issue: No reviewed stories found

**Symptoms:**
```
📋 No stories with status "review" found
```

**Cause:** No stories have been code reviewed yet, or all reviewed stories already marked done

**Solution:**
```bash
# Run code review on completed stories
/bmad:bmm:workflows:code-review

# Or implement more stories
/bmad:bmm:workflows:dev-story

# Or check sprint status
cat {documentation_dir}/sprint-status.yaml
```

---

### Issue: Story status is not "review"

**Symptoms:**
```
Story status must be "review" to mark as done
Current status: in-progress
```

**Cause:** Story hasn't been code reviewed yet

**Solution:**
```bash
# Run code review first
/bmad:bmm:workflows:code-review
```

**Status flow:**
```
in-progress → code-review → review → story-done → done
                               ↑           ↑
                        review complete   this workflow
```

**Why:** Stories must pass code review before being marked done.

---

### Issue: Dev Agent Record section not found

**Symptoms:**
```
Warning: Could not find "## Dev Agent Record" section
Completion notes not added
```

**Cause:** Story file doesn't have Dev Agent Record section

**Solution:**
- Story is still marked done (status updated)
- Completion notes couldn't be added (non-critical)
- Manually add section if needed:
  ```markdown
  ## Dev Agent Record

  ### Completion Notes
  **Completed:** 2025-01-13
  **Definition of Done:** All acceptance criteria met, code reviewed, tests passing
  ```

**Why:** Dev Agent Record is created during dev-story, but might be missing in older stories.

---

## Related Workflows

**Before story-done:**
- `/bmad:bmm:workflows:dev-story` - Implement the story (sets status to "in-progress")
- `/bmad:bmm:workflows:code-review` - Review the implementation (sets status to "review")

**After story-done:**
- `/bmad:bmm:workflows:create-story` - Draft next story from backlog
- `/bmad:bmm:workflows:dev-story` - Implement next ready story
- `/bmad:bmm:workflows:retrospective` - Check if epic is complete (all stories done)

**Status management:**
- `/bmad:bmm:workflows:story-ready` - Mark drafted story as ready for dev

---

## Notes

- **Simple workflow:** Just status updates and completion notes
- **Auto-advance:** Automatically selects first reviewed story (no user selection)
- **Dual sync:** Updates both story file and sprint status
- **Preserves structure:** Never reorders or restructures sprint-status.yaml
- **Safe to re-run:** Can mark same story multiple times (idempotent)
- **Never downgrades:** Only moves status forward (review → done)
- **Completion evidence:** Adds timestamp and DoD confirmation
- **Clear next steps:** Recommends next story or epic retrospective

**Typical usage:**
1. Developer completes implementation (dev-story)
2. Code review approves story (code-review → status: review)
3. Runs this workflow to mark story done
4. Proceeds to next story or epic retrospective

**Time:** < 1 minute (just status updates)

**Definition of Done (DoD) assumed:**
- All acceptance criteria met
- Code reviewed and approved
- Tests passing
- Documentation updated
- No known bugs or issues
