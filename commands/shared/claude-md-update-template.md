# CLAUDE.md Update Template

**This template should be added as the final step to ALL file-creating workflows.**

## Final Step: Update CLAUDE.md

**Files created in this workflow:**
```
{List files created by this specific workflow}
```

**Update CLAUDE.md file map:**

Call `/bmad:meta:update-claude-md` to add newly created files to CLAUDE.md navigation index.

**Implementation:**
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

**Purpose:**
- Keeps project file map current
- Enables agents to find new files in future work
- Maintains living navigation index
- Automatic - no manual CLAUDE.md editing required

**Note:** If CLAUDE.md doesn't exist, this step can be skipped (generate-claude-md should be run first, but not blocking).

---

## Workflow-Specific Examples

### dev-story.md
```python
# Files created during story implementation
files_created = [
    "src/components/UserProfile.tsx",
    "src/components/__tests__/UserProfile.test.tsx",
    "src/lib/user-utils.ts",
    "src/types/user.ts"
]
```

### create-story.md
```python
# Story file created
files_created = [
    f"{sprint_artifacts}/stories/{story_key}.md"
]
```

### prd.md
```python
# PRD file created
files_created = [
    f"{output_folder}/PRD.md"
]
```

### tech-spec.md
```python
# Tech spec file created
files_created = [
    f"{output_folder}/tech-spec.md"
]
```

### create-epics-and-stories.md
```python
# Epic files created
files_created = [
    f"{output_folder}/epic-1.md",
    f"{output_folder}/epic-2.md",
    f"{output_folder}/epic-3.md"
]
```

### architecture.md
```python
# Architecture file created
files_created = [
    f"{output_folder}/architecture.md"
]
```

### product-brief.md
```python
# Brief file created
files_created = [
    f"{output_folder}/brief.md"
]
```

### epic-tech-context.md
```python
# Epic context files created
files_created = [
    f"{sprint_artifacts}/epic-{epic_number}-context.md"
]
```

### sprint-planning.md
```python
# Sprint status file created
files_created = [
    f"{sprint_artifacts}/sprint-status.yaml"
]
```

### workflow-init.md
```python
# Workflow status file created
files_created = [
    f"{output_folder}/bmm-workflow-status.yaml"
]
```
