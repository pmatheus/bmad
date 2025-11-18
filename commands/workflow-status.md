---
description: Lightweight status checker - answers "what should I do now?" for any agent. Reads YAML status file for workflow tracking. Use workflow-init for new projects.
---

# Workflow Status Check

## Purpose

This slash command helps you understand where you are in the BMAD Method workflow and what to do next. It reads your project's status tracking file and provides:
- Current progress overview
- Next recommended workflow
- Available optional workflows
- Quick actions to update status

**Prerequisites:** You must have initialized your project first with `/bmad:meta:workflow-init`. If you haven't done this yet, run that command first.

## Variables

The workflow uses the following variables extracted from project configuration and status files:

- `project` - Project name from status file
- `project_type` - Type of project (greenfield, brownfield, etc.)
- `project_level` - Project complexity level (0-4)
- `field_type` - Field type (software, game, etc.)
- `workflow_path` - Path to the workflow sequence YAML file
- `output_folder` - Project output folder from `.bmad/config.yaml`
- `workflow_status` - Dictionary of workflow IDs and their completion status
- `next_workflow` - The next workflow to execute
- `next_agent` - The agent responsible for the next workflow
- `calling_workflow` - (Service mode only) The workflow requesting validation
- `mode` - (Service mode only) The invocation mode: "validate", "data", "init-check", or "update"
- `data_request` - (Service mode only) Type of data requested: "project_config", "workflow_status", or "all"
- `action` - (Service mode only) Update action: "complete_workflow" or "skip_workflow"
- `workflow_id` - (Service mode only) Workflow ID to update
- `output_file` - (Service mode only) Output file path for completed workflow

**Status values in workflow_status:**
- File path (e.g., `docs/PRD.md`) - Workflow completed
- `required` - Workflow is required but not started
- `optional` - Workflow is optional
- `recommended` - Workflow is recommended
- `conditional` - Workflow depends on conditions
- `skipped` - Workflow was intentionally skipped

## Instructions

Follow these steps to check workflow status and provide next step recommendations:

1. **Load Configuration**: Read the project configuration from `.bmad/config.yaml` to get the output folder location.

2. **Check for Status File**: Look for `bmm-workflow-status.yaml` in the output folder. If no status file found, inform the user to run `/bmad:meta:workflow-init` and exit the workflow.

3. **Read and Parse Status**: If status file exists, read the YAML file and extract:
   - Metadata fields: `project`, `project_type`, `project_level`, `field_type`, `workflow_path`
   - Workflow status section: All workflow entries with their statuses
   - Completed workflows have status = file path (e.g., `docs/PRD.md`)
   - Pending workflows have status = `required`, `optional`, `recommended`, or `conditional`
   - Skipped workflows have status = `skipped`

4. **Determine Next Workflow**: Find the first workflow with status that is NOT a file path and NOT `skipped`. This is the next workflow to work on.

5. **Load Workflow Path**: Read the workflow path file specified in the `workflow_path` field (e.g., `.bmad/bmm/workflows/workflow-paths/bmm-method-track.yaml`). This file defines the sequence of workflows and which agent runs each one.

6. **Display Current Status**: Present a clear overview showing project metadata, progress by phase with status icons (✅ completed, 🔄 next, ⏸️ pending, ⏭️ skipped), and next steps with agent and command information.

7. **Offer Interactive Actions**: Use the AskUserQuestion tool to present options:
   - Start next workflow
   - View full status YAML
   - Mark workflow as complete
   - Mark workflow as skipped
   - Exit

8. **Handle User Selection**: Based on user choice, execute the appropriate action and update status file if needed.

**CRITICAL:** When updating status files, only write the file path as the status value for completed workflows - no other text, notes, or metadata. Always preserve ALL YAML structure and comments when updating files.

## Workflow

### Standard User Mode

1. Load `.bmad/config.yaml` → Get output folder
2. Check for `bmm-workflow-status.yaml` → If missing, guide user to init
3. Parse status YAML → Extract metadata and workflow statuses
4. Identify next workflow → First non-completed, non-skipped workflow
5. Load workflow path file → Get sequence and agent assignments
6. Display status overview → Show progress and next steps
7. Present action menu → Offer user options
8. Execute selected action → Handle completion, skipping, or starting workflows

### Service Modes (for other workflows to call)

Other workflows can invoke this workflow with special modes to avoid duplicating status logic:

#### Validate Mode
**Purpose:** Check if a workflow should proceed based on sequence

**Invocation:**
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

#### Data Mode
**Purpose:** Extract specific information from status file

**Invocation:**
```
Use SlashCommand tool with parameters:
- mode: "data"
- data_request: "project_config" | "workflow_status" | "all"
```

**Returns:**
- `project_config`: project name, type, level, field, workflow path
- `workflow_status`: All workflow statuses + completion stats
- `all`: Everything

#### Init-Check Mode
**Purpose:** Simple existence check

**Invocation:**
```
Use SlashCommand tool with parameters:
- mode: "init-check"
```

**Returns:**
- `status_exists`: true/false
- `suggestion`: What to do

#### Update Mode
**Purpose:** Centralized status file updates

**Invocation:**
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

## Report

### Status Display Format

Present status information using this format:

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

**Next Workflow:** {workflow_id}

**Agent:** {agent_name} ({agent_role})

**Command:** /bmad:phase-{N}:{workflow_id}

**What it does:** {workflow_description}
```

### User Action Responses

**Starting Next Workflow:**
```
Ready to run {workflow_id}!

Command: /bmad:phase-{N}:{workflow_id}

Note: This workflow will {workflow_description}.
The {agent_name} agent will guide you through the process.

Run the command above to continue.
```

**Marking Workflow Complete:**
```
✅ Updated {workflow_id} to completed: {output_file}
```

**Marking Workflow Skipped:**
```
✅ Marked {workflow_id} as skipped
```

**No Status File Found:**
```
No workflow status found. To get started:

Run: /bmad:meta:workflow-init

This will guide you through project setup and create your workflow path.
```

### Service Mode Responses

For service modes (validate, data, init-check, update), return structured data as JSON or YAML format appropriate for programmatic consumption by the calling workflow. Do not include decorative formatting or user-facing messages in service mode responses.

**Notes:**
- The status file uses YAML format with comments preserved
- File paths in status indicate completion (e.g., `prd: docs/PRD.md`)
- Keywords indicate pending state (`required`, `optional`, `recommended`, `conditional`)
- The word `skipped` indicates intentionally skipped workflows
- Workflow path files define the sequence and agent assignments
- Always preserve YAML structure and comments when updating files
