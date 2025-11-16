---
description: Lightweight status checker - answers "what should I do now?" for any agent. Reads YAML status file for workflow tracking. Use workflow-init for new projects.
---

# Workflow Status Check

Check your current project workflow status and get recommendations for next steps.

## What This Does

This slash command helps you understand where you are in the BMAD Method workflow and what to do next. It reads your project's status tracking file and provides:
- Current progress overview
- Next recommended workflow
- Available optional workflows
- Quick actions to update status

## Prerequisites

You must have initialized your project first with `/bmad:meta:workflow-init`. If you haven't done this yet, run that command first.

## Instructions

### Step 1: Load Configuration

Read the project configuration from `.bmad/config.yaml` to get the output folder location.

### Step 2: Check for Status File

Look for `bmm-workflow-status.yaml` in the output folder.

**If no status file found:**
```
No workflow status found. To get started:

Run: /bmad:meta:workflow-init

This will guide you through project setup and create your workflow path.
```
Exit the workflow.

**If status file found:**
Continue to Step 3.

### Step 3: Read and Parse Status

Read the YAML file and extract:

**Metadata fields:**
- `project` - Project name
- `project_type` - greenfield, brownfield, etc.
- `project_level` - 0-4 (complexity level)
- `field_type` - software, game, etc.
- `workflow_path` - Path to the workflow sequence file

**Workflow status section:**
- Extract all workflow entries with their statuses
- Completed workflows have status = file path (e.g., `docs/PRD.md`)
- Pending workflows have status = `required`, `optional`, `recommended`, or `conditional`
- Skipped workflows have status = `skipped`

**Determine next workflow:**
- Find the first workflow with status that is NOT a file path and NOT `skipped`
- This is the next workflow to work on

### Step 4: Load Workflow Path

Read the workflow path file specified in the `workflow_path` field (e.g., `.bmad/bmm/workflows/workflow-paths/bmm-method-track.yaml`).

This file defines the sequence of workflows and which agent runs each one.

### Step 5: Display Current Status

Present a clear overview:

```markdown
## 📊 Current Status

**Project:** {project} (Level {project_level} {project_type})

**Path:** {workflow_path}

**Progress:**

Phase 1 (Analysis):
- brainstorm-project (CIS Agent): ✅ docs/brainstorm.md
- product-brief (PM): ✅ docs/product-brief.md
- domain-research (Analyst): ⏭️ skipped

Phase 2 (Planning):
- prd (PM): 🔄 Next
- architecture (Architect): ⏸️ required
- create-epics-and-stories (PM): ⏸️ required
- sprint-planning (SM): ⏸️ required

Phase 3 (Solutioning):
- epic-tech-context (Architect): ⏸️ required
- create-story (DEV): ⏸️ required

Phase 4 (Implementation):
- story-context (DEV): ⏸️ required
- dev-story (DEV): ⏸️ required
- code-review (DEV): ⏸️ required
- story-done (SM): ⏸️ required

## 🎯 Next Steps

**Next Workflow:** prd

**Agent:** PM (Product Manager)

**Command:** /bmad:phase-2:prd

**What it does:** Create Product Requirements Document (PRD) for your project
```

### Step 6: Offer Interactive Actions

Use the AskUserQuestion tool to present options:

```yaml
questions:
  - question: "What would you like to do?"
    header: "Action"
    multiSelect: false
    options:
      - label: "Start next workflow (prd)"
        description: "Run the next planned workflow with PM agent"
      - label: "View full status YAML"
        description: "See the complete bmm-workflow-status.yaml file"
      - label: "Mark workflow as complete"
        description: "Update status to mark a workflow as done"
      - label: "Mark workflow as skipped"
        description: "Skip an optional workflow"
      - label: "Exit"
        description: "Return to normal conversation"
```

### Step 7: Handle User Selection

Based on user choice:

**Option 1: Start next workflow**
```
Ready to run prd!

Command: /bmad:phase-2:prd

Note: This workflow will create your Product Requirements Document.
The PRD agent will guide you through the process.

Run the command above to continue.
```

**Option 2: View full status YAML**
Read and display the complete `bmm-workflow-status.yaml` file.

**Option 3: Mark workflow as complete**
Ask user:
- Which workflow ID? (e.g., `prd`)
- What file was created? (e.g., `docs/PRD.md`)

Then:
1. Read the YAML file
2. Update the workflow_status section:
   ```yaml
   prd: docs/PRD.md  # ONLY the file path, no other text
   ```
3. Save the YAML file preserving ALL structure and comments
4. Confirm: `✅ Updated prd to completed: docs/PRD.md`

**CRITICAL:** Only write the file path as the status value - no other text, notes, or metadata.

**Option 4: Mark workflow as skipped**
Ask user:
- Which workflow ID to skip?

Then:
1. Read the YAML file
2. Update the workflow_status section:
   ```yaml
   domain-research: skipped
   ```
3. Save the YAML file
4. Confirm: `✅ Marked domain-research as skipped`

**Option 5: Exit**
Return to normal conversation.

## Service Modes (for other workflows to call)

Other workflows can invoke this workflow with special modes to avoid duplicating status logic. These modes are NOT for direct user invocation.

### Validate Mode
**Purpose:** Check if a workflow should proceed based on sequence

**How to invoke:**
```
Use SlashCommand tool with parameters:
- mode: "validate"
- calling_workflow: "prd"
```

**Returns:**
- `should_proceed`: true/false
- `warning`: Warning message if any
- `suggestion`: Recommendation text
- `next_workflow`: What should run next
- `project_level`, `project_type`, `field_type`: Project metadata

### Data Mode
**Purpose:** Extract specific information from status file

**How to invoke:**
```
Use SlashCommand tool with parameters:
- mode: "data"
- data_request: "project_config" | "workflow_status" | "all"
```

**Returns:**
Based on `data_request`:
- `project_config`: project name, type, level, field, workflow path
- `workflow_status`: All workflow statuses + completion stats
- `all`: Everything

### Init-Check Mode
**Purpose:** Simple existence check

**How to invoke:**
```
Use SlashCommand tool with parameters:
- mode: "init-check"
```

**Returns:**
- `status_exists`: true/false
- `suggestion`: What to do

### Update Mode
**Purpose:** Centralized status file updates

**How to invoke:**
```
Use SlashCommand tool with parameters:
- mode: "update"
- action: "complete_workflow" | "skip_workflow"
- workflow_id: "prd"
- output_file: "docs/PRD.md" (for complete_workflow)
```

**Returns:**
- `success`: true/false
- `next_workflow`: Next workflow ID (for complete_workflow)
- `next_agent`: Next agent (for complete_workflow)
- `error`: Error message if failed

## Notes

- The status file uses YAML format with comments preserved
- File paths in status indicate completion (e.g., `prd: docs/PRD.md`)
- Keywords indicate pending state (`required`, `optional`, `recommended`, `conditional`)
- The word `skipped` indicates intentionally skipped workflows
- Workflow path files define the sequence and agent assignments
- Always preserve YAML structure and comments when updating files
