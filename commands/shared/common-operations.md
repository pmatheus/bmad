# Common Operations Reference

## File Operations

### Load Project Configuration
```javascript
// Read .bmad/config.yaml
{
  output_folder: string,        // e.g., .bmad
  sprint_artifacts: string,     // e.g., .bmad/sprint-artifacts
  user_name: string,
  user_skill_level: string,
  bmad_folder: string,
  project_name: string
}
```

### Read Sprint Status
```yaml
# File: {sprint_artifacts}/sprint-status.yaml
development_status:
  epic-1: contexted
  1-1-story: done
  1-2-story: review
  1-3-story: backlog
```

**Find first story by status:**
- Read ALL lines (preserve order)
- Match pattern: `{epic}-{story}-{name}`
- NOT an epic (`epic-X`) or retrospective
- Status equals target value

### Update Sprint Status
1. Load FULL file
2. Find `development_status[{story_key}]`
3. Verify current status
4. Update to new status
5. Save file, preserving ALL comments and structure

### Update Story File
**Add section:**
Append to end of file with `---` separator

**Update status:**
Change `Status: {old}` → `Status: {new}`

**Add change log entry:**
```markdown
## Change Log
- {date} - {description} - {outcome}
```

## Delegation Patterns

### Delegate to Subagent (Task Tool)
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

### Parallel Delegation
For independent operations, invoke multiple Task calls in SINGLE message:
```xml
<function_calls>
  <invoke name="Task">Worker 1</invoke>
  <invoke name="Task">Worker 2</invoke>
  <invoke name="Task">Worker 3</invoke>
</function_calls>
```

**Critical:** ONE message = parallel execution, multiple messages = sequential

## Status Updates

### Story Status Progression
```
backlog → drafted → ready-for-dev → in-progress → review → done
```

### Auto-Continue Decision Tree
```
IF workflow_complete AND next_workflow_ready AND no_user_input_needed:
  → Auto-continue with SlashCommand tool
ELSE:
  → Pause and report next steps
```

## Validation

### Story File Validation
- [ ] Story key matches pattern
- [ ] All required sections exist
- [ ] Status field present
- [ ] Acceptance criteria listed
- [ ] Tasks defined

### Context File Validation
- [ ] All paths are project-relative (not absolute)
- [ ] XML structure is valid
- [ ] No invented information
- [ ] All sources referenced

## Error Handling

### File Not Found
```
⚠️ {File type} not found: {path}

{Suggested action to resolve}
```

### Prerequisites Missing
```
⚠️ Prerequisites not met

Missing: {list}

Please run:
1. {command to fix}
2. {next command}
```

### No Stories Available
```
📋 No {status} stories found

{Explanation of why}

Next Steps:
1. {action 1}
2. {action 2}
```

## Path Handling

### Convert to Project-Relative
```javascript
// Bad: /Users/user/project/src/auth.ts
// Good: src/auth.ts

const projectRelative = absolutePath.replace(projectRoot, '').replace(/^\//, '');
```

### Common Path Variables
- `{output_folder}` - Usually `.bmad`
- `{sprint_artifacts}` - Usually `.bmad/sprint-artifacts`
- `{story_path}` - `{sprint_artifacts}/stories`
- `{bmad_folder}` - `.bmad`
