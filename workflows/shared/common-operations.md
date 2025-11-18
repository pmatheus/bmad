# Common Operations Reference

## Purpose

This reference document provides reusable patterns, operations, and code snippets for BMM workflow agents. It serves as a centralized guide for common tasks including file operations, delegation patterns, status management, validation, error handling, and CLAUDE.md maintenance.

**Use this reference when:**
- Reading or updating sprint status files
- Delegating work to subagents
- Validating story or context files
- Handling errors gracefully
- Managing CLAUDE.md file maps
- Converting between absolute and project-relative paths

## Variables

**Configuration Variables:**
- `{documentation_dir}` - Documentation folder (typically `.bmad`)
- `{sprint_artifacts}` - Sprint artifacts folder (typically `.bmad/sprint-artifacts`)
- `{story_path}` - Stories folder (`{sprint_artifacts}/stories`)
- `{bmad_folder}` - BMAD configuration folder (`.bmad`)
- `{project_name}` - Project name from config
- `{user_name}` - User name from config
- `{user_skill_level}` - User skill level from config

**Story Variables:**
- `{story_key}` - Story identifier matching pattern `{epic}-{story}-{name}`
- `{epic}` - Epic identifier (e.g., `epic-1`)
- `{status}` - Story status (backlog, drafted, ready-for-dev, in-progress, review, done)
- `{date}` - Current date for change log entries

**Path Variables:**
- `{path}` - Generic file path placeholder
- `{file_path}` - Absolute file path
- `{projectRoot}` - Project root directory

**Delegation Variables:**
- `{agent-name}` - Subagent identifier (e.g., `pm`, `dev`, `architect`)
- `{description}` - Task description for delegation

## Instructions

This is a reference document, not an executable workflow. Consult the relevant sections below as needed during workflow execution.

### File Operations

**1. Load Project Configuration**
```javascript
// Read .bmad/config.yaml
{
  documentation_dir: string,        // e.g., .bmad
  sprint_artifacts: string,         // e.g., .bmad/sprint-artifacts
  user_name: string,
  user_skill_level: string,
  bmad_folder: string,
  project_name: string
}
```

**2. Read Sprint Status**
```yaml
# File: {sprint_artifacts}/sprint-status.yaml
development_status:
  epic-1: contexted
  1-1-story: done
  1-2-story: review
  1-3-story: backlog
```

**Finding first story by status:**
- Read ALL lines (preserve order)
- Match pattern: `{epic}-{story}-{name}`
- NOT an epic (`epic-X`) or retrospective
- Status equals target value

**3. Update Sprint Status**
1. Load FULL file
2. Find `development_status[{story_key}]`
3. Verify current status
4. Update to new status
5. Save file, preserving ALL comments and structure

**4. Update Story File**

**Add section:**
Append to end of file with `---` separator

**Update status:**
Change `Status: {old}` → `Status: {new}`

**Add change log entry:**
```markdown
## Change Log
- {date} - {description} - {outcome}
```

### Delegation Patterns

**5. Delegate to Subagent (Task Tool)**
```xml
<invoke name="Task">
  <parameter name="subagent_type">bmad:{agent-name}</parameter>
  <parameter name="description">Clear description of task</parameter>
  <parameter name="prompt">
Project Context:
- Project Name: {from config}
- Output Folder: {from config}
- Sprint Artifacts: {from config}

Your Task:
{specific instructions}

Process:
{step-by-step workflow}

Expected Output:
{what should be delivered}
  </parameter>
</invoke>
```

**6. Parallel Delegation**

For independent operations, invoke multiple Task calls in SINGLE message:
```xml
<function_calls>
  <invoke name="Task">Worker 1</invoke>
  <invoke name="Task">Worker 2</invoke>
  <invoke name="Task">Worker 3</invoke>
</function_calls>
```

**Critical:** ONE message = parallel execution, multiple messages = sequential

### Status Management

**7. Story Status Progression**
```
backlog → drafted → ready-for-dev → in-progress → review → done
```

**8. Auto-Continue Decision Tree**
```
IF workflow_complete AND next_workflow_ready AND no_user_input_needed:
  → Auto-continue with SlashCommand tool
ELSE:
  → Pause and report next steps
```

### Validation

**9. Story File Validation**
- [ ] Story key matches pattern
- [ ] All required sections exist
- [ ] Status field present
- [ ] Acceptance criteria listed
- [ ] Tasks defined

**10. Context File Validation**
- [ ] All paths are project-relative (not absolute)
- [ ] XML structure is valid
- [ ] No invented information
- [ ] All sources referenced

### Error Handling

**11. File Not Found**
```
⚠️ {File type} not found: {path}

{Suggested action to resolve}
```

**12. Prerequisites Missing**
```
⚠️ Prerequisites not met

Missing: {list}

Please run:
1. {command to fix}
2. {next command}
```

**13. No Stories Available**
```
📋 No {status} stories found

{Explanation of why}

Next Steps:
1. {action 1}
2. {action 2}
```

### Path Handling

**14. Convert to Project-Relative**
```javascript
// Bad: /Users/user/project/src/auth.ts
// Good: src/auth.ts

const projectRelative = absolutePath.replace(projectRoot, '').replace(/^\//, '');
```

### CLAUDE.md Operations

**15. Update File Map**

**Purpose:** Keep CLAUDE.md navigation index current when files are created

**When to call:**
- After creating ANY project file (source, config, doc, story, etc.)
- At end of dev-story (source files created)
- At end of create-story (story files created)
- At end of prd/tech-spec/architecture (documentation files created)

**Pattern:**
```python
def update_claude_md_file_map(files: list[str]):
    """
    Update CLAUDE.md file maps for newly created files.

    Steps:
    1. Generate descriptions for each file
    2. Determine target CLAUDE.md files (root/subfolder)
    3. Insert entries alphabetically
    4. Enforce size limits (420 root, 200 subfolder)
    5. Create subfolder CLAUDE.md if needed
    """
    for file_path in files:
        description = extract_file_description(file_path)
        target_claude = determine_target_claude_md(file_path)
        update_file_map_section(target_claude, file_path, description)

    enforce_size_limits()
```

**Example usage:**
```python
# At end of workflow that created files
files_created = [
    "src/components/Button.tsx",
    "src/lib/utils.ts",
    "src/app/page.tsx"
]

Task(
    subagent_type="general-purpose",
    description="Update CLAUDE.md file map",
    prompt=f"""
    Update CLAUDE.md file maps for newly created files.

    Files: {files_created}

    Use /bmad:meta:update-claude-md workflow.
    """
)
```

**Size enforcement:**
- Root > 420 lines → Create subfolder CLAUDE.md
- Subfolder > 200 lines → Compress descriptions or split

**Key points:**
- Atomic read-modify-write prevents corruption
- Alphabetical order maintained automatically
- File descriptions extracted from comments or inferred
- Subfolder CLAUDE.md auto-created when directory > 30 files

## Workflow

This is a reference document without a linear workflow. Agents should consult relevant sections based on their current task:

1. **Before starting any workflow:** Load project configuration
2. **When reading sprint data:** Use sprint status reading pattern
3. **When updating story status:** Follow sprint status update procedure
4. **When delegating work:** Use appropriate delegation pattern (single or parallel)
5. **When validating files:** Apply relevant validation checklist
6. **When encountering errors:** Use standardized error reporting format
7. **When handling paths:** Convert to project-relative format
8. **After creating files:** Update CLAUDE.md file maps

## Report

Agents using this reference should not generate separate reports. Instead:

**Integration Approach:**
- Apply patterns directly within workflow execution
- Follow error handling templates for consistent user communication
- Use validation checklists to verify work quality
- Document any deviations from standard patterns in workflow reports

**When Creating New Workflows:**
- Reference specific sections by number (e.g., "Using delegation pattern from Common Operations #5")
- Maintain consistency with established patterns
- Report any gaps or needed additions to this reference

**Quality Standards:**
- All file operations must preserve structure and comments
- All paths in context files must be project-relative
- All delegations must include complete context
- All error messages must be actionable
