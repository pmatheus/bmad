# CLAUDE.md Update Template

## Purpose

This template provides a standardized final step for all file-creating workflows to update the CLAUDE.md navigation index. By adding this step to workflows, newly created files are automatically registered in CLAUDE.md, enabling agents to discover and navigate to them in future work. This maintains a living documentation system without manual editing.

**Key Benefits:**
- Keeps project file map current and accurate
- Enables agents to find new files in future work sessions
- Maintains living navigation index automatically
- No manual CLAUDE.md editing required

## Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `{files_created}` | List of absolute file paths created by the workflow | `["path/to/file1.ext", "path/to/file2.ext"]` |
| `{documentation_dir}` | Documentation directory path for the project | `.bmad/documentation` |
| `{sprint_artifacts}` | Sprint artifacts directory path | `.bmad/sprint-artifacts` |
| `{story_key}` | Unique story identifier | `STORY-001` |
| `{epic_number}` | Epic number identifier | `1`, `2`, `3` |

## Instructions

This template should be added as the final step to ALL file-creating workflows. Follow these steps:

1. **Identify files created**: Compile a complete list of all files created during the workflow execution
2. **Prepare file list**: Format the file paths as a Python list in the `files_created` variable
3. **Create update task**: Use the Task pattern to delegate CLAUDE.md updates to a subagent
4. **Call update workflow**: Invoke `/bmad:meta:update-claude-md` to process the file updates
5. **Verify completion**: Ensure the update completes successfully before marking workflow complete

**Note:** If CLAUDE.md doesn't exist, this step can be skipped (generate-claude-md should be run first, but not blocking).

## Workflow

### Step 1: List Files Created
```
{List files created by this specific workflow}
```

### Step 2: Call Update Workflow

Invoke `/bmad:meta:update-claude-md` to add newly created files to CLAUDE.md navigation index.

### Step 3: Implementation Pattern

```python
files_created = [
    # List all files created in this workflow
    "path/to/file1.ext",
    "path/to/file2.ext",
    # ...
]

Task(
    subagent_type="general-purpose",
    description="Update CLAUDE.md file map",
    prompt=f"""
    Update CLAUDE.md file maps for newly created files.

    Files created: {files_created}

    Use /bmad:meta:update-claude-md workflow.

    This will:
    1. Generate descriptions for each file
    2. Add entries to appropriate CLAUDE.md (root or subfolder)
    3. Maintain alphabetical order
    4. Enforce size limits (420 root, 200 subfolder)
    5. Create subfolder CLAUDE.md if needed
    """
)
```

### Workflow-Specific Examples

#### dev-story.md
```python
# Files created during story implementation
files_created = [
    "src/components/UserProfile.tsx",
    "src/components/__tests__/UserProfile.test.tsx",
    "src/lib/user-utils.ts",
    "src/types/user.ts"
]
```

#### create-story.md
```python
# Story file created
files_created = [
    f"{sprint_artifacts}/stories/{story_key}.md"
]
```

#### prd.md
```python
# PRD file created
files_created = [
    f"{documentation_dir}/PRD.md"
]
```

#### tech-spec.md
```python
# Tech spec file created
files_created = [
    f"{documentation_dir}/tech-spec.md"
]
```

#### create-epics-and-stories.md
```python
# Epic files created
files_created = [
    f"{documentation_dir}/epic-1.md",
    f"{documentation_dir}/epic-2.md",
    f"{documentation_dir}/epic-3.md"
]
```

#### architecture.md
```python
# Architecture file created
files_created = [
    f"{documentation_dir}/architecture.md"
]
```

#### product-brief.md
```python
# Brief file created
files_created = [
    f"{documentation_dir}/brief.md"
]
```

#### epic-tech-context.md
```python
# Epic context files created
files_created = [
    f"{sprint_artifacts}/epic-{epic_number}-context.md"
]
```

#### sprint-planning.md
```python
# Sprint status file created
files_created = [
    f"{sprint_artifacts}/sprint-status.yaml"
]
```

#### workflow-init.md
```python
# Workflow status file created
files_created = [
    f"{documentation_dir}/bmm-workflow-status.yaml"
]
```

## Report

Upon completion of the CLAUDE.md update, the workflow should report:

1. **Files Processed**: List of all files that were added to CLAUDE.md
2. **Update Location**: Which CLAUDE.md file was updated (root or subfolder)
3. **Success Confirmation**: Explicit confirmation that the update completed successfully
4. **Any Issues**: Report if CLAUDE.md doesn't exist or if size limits were reached

**Example Report Format:**
```
CLAUDE.md Update Complete:
- Files added: 4
  - src/components/UserProfile.tsx
  - src/components/__tests__/UserProfile.test.tsx
  - src/lib/user-utils.ts
  - src/types/user.ts
- Updated: ./src/CLAUDE.md
- Status: Success
```

If CLAUDE.md doesn't exist:
```
CLAUDE.md Update Skipped:
- CLAUDE.md not found in project
- Recommendation: Run /bmad:meta:generate-claude-md first
- Files will need to be registered manually or on next CLAUDE.md generation
```
