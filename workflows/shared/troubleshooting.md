# Troubleshooting Reference

## Purpose

This reference guide provides systematic troubleshooting solutions for common issues encountered across all BMAD workflows. It serves as a diagnostic resource to help identify, understand, and resolve configuration errors, workflow blocks, file system problems, and dependency conflicts that may arise during project development.

## Variables

This troubleshooting reference uses the following placeholder variables throughout:

- `{field}` - Name of missing or invalid configuration field
- `{key}` - Story key identifier (e.g., E1S1, E2S3)
- `{status}` - Story status value (drafted, ready-for-dev, in-progress, review, done, blocked)
- `{path}` - File system path to resources
- `{sprint_artifacts}` - Path to sprint artifacts directory (from config.yaml)
- `{epic}` - Epic identifier (e.g., E1, E2)
- `{story}` - Story identifier (e.g., S1, S2)
- `{name}` - Story descriptive name
- `{expected}` - Expected status value
- `{actual}` - Actual status value found
- `{N}` - Epic number
- `{package}` - Package/dependency name

## Instructions

### How to Use This Guide

1. **Identify the Error Category**
   - Note the error message or symptom you're experiencing
   - Match it to one of the main categories: Configuration, Sprint Status, Story Files, Context, Workflow-Specific, File System, or Dependencies

2. **Locate the Specific Issue**
   - Within the category, find the specific error message or symptom
   - Read the complete entry including error description, causes, and solutions

3. **Apply Solutions in Order**
   - Follow solutions sequentially as listed
   - Start with quickest/simplest solutions first
   - Verify each solution's success before proceeding

4. **Verify Resolution**
   - Re-run the failing workflow command
   - Check that error no longer appears
   - Confirm expected behavior restored

5. **Prevent Recurrence**
   - Review "Prevention" sections where provided
   - Update workflows or processes to avoid repeat issues
   - Document project-specific variations if needed

## Workflow

### Diagnostic Flow

```
Error Occurs
    ↓
1. Note exact error message
    ↓
2. Check Common Issues (Configuration, Sprint Status, Story Files, Context)
    ↓
3. If not resolved, check Workflow-Specific Issues
    ↓
4. If not resolved, check File System/Dependency Issues
    ↓
5. Apply solutions sequentially
    ↓
6. Verify resolution
    ↓
7. If still unresolved, use Getting Help section
```

### Issue Categories and Resolution Paths

#### Configuration Issues

**Missing config.yaml**
- **Error:** `Configuration file not found: .bmad/config.yaml`
- **Solution:**
  ```bash
  /bmad:meta:workflow-init
  ```

**Invalid configuration**
- **Error:** `Required field missing in config: {field}`
- **Solution:**
  ```bash
  # Edit config manually
  vi .bmad/config.yaml

  # Or re-run init
  /bmad:meta:workflow-init
  ```

#### Sprint Status Issues

**sprint-status.yaml not found**
- **Error:** `Sprint status file not found`
- **Solution:**
  ```bash
  /bmad:phase-4:sprint-planning
  ```

**Story key not found in sprint status**
- **Error:** `Story {key} not found in sprint-status.yaml`
- **Solution:**
  1. Check story file naming matches sprint status
  2. Run `/bmad:phase-4:sprint-planning` to resync
  3. Verify sprint_artifacts path in config

**No stories with target status**
- **Error:** `No {status} stories found`
- **Solutions by status:**
  - **No drafted:** Run `/bmad:phase-4:create-story`
  - **No ready-for-dev:** Run `/bmad:phase-4:story-context` or `/bmad:phase-4:story-ready`
  - **No review:** Run `/bmad:phase-4:dev-story` to implement
  - **All done:** Run `/bmad:phase-4:create-story` for next epic

#### Story File Issues

**Story file not found**
- **Error:** `Story file not found: {path}`
- **Causes:**
  - File naming mismatch with sprint status
  - Wrong sprint_artifacts path
  - File deleted
- **Solutions:**
  1. Check file exists: `ls {sprint_artifacts}/stories/`
  2. Check naming pattern: `{epic}-{story}-{name}.md`
  3. Run `/bmad:phase-4:sprint-planning` to resync

**Story status mismatch**
- **Error:** `Story status must be '{expected}' but is '{actual}'`
- **Solution:** Update sprint-status.yaml manually or run appropriate workflow to progress story

#### Context Issues

**Story Context missing**
- **Warning:** `No story context file found`
- **Impact:** Lower quality implementation, risk of hallucinations
- **Solution:**
  ```bash
  /bmad:phase-4:story-context
  ```
- **Prevention:** Always run story-context before dev-story

**Context file already exists**
- **Warning:** `Context file already exists`
- **Options:**
  1. **Replace:** Generate new (overwrites existing)
  2. **Verify:** Validate existing against checklist
  3. **Cancel:** Exit without changes

#### Workflow-Specific Issues

**bring-to-life: Context depletes too quickly**
- **Symptoms:** `Context window depleted after only 2 stories`
- **Solutions:**
  1. Increase story granularity (break into smaller pieces)
  2. Optimize context files (remove unnecessary refs)
  3. Clear conversation more frequently

**bring-to-life: Repeated review failures**
- **Symptoms:** `Story blocked after 3 review cycles`
- **Solutions:**
  1. Review story ACs (make more specific)
  2. Enhance story context (better docs)
  3. Manual intervention may be needed

**bring-to-life: All dependencies blocked**
- **Symptoms:** `No stories available - all blocked by dependencies`
- **Solutions:**
  1. Check dependency chains in story files
  2. Implement prerequisite stories first
  3. Review `depends_on` metadata for errors

**code-review: No stories with status "review"**
- **Solutions:**
  1. Run `/bmad:phase-4:dev-story` to implement
  2. Check sprint-status.yaml for current states
  3. Use ad-hoc review mode for specific files

**code-review: No epic tech spec**
- **Warning:** `No Tech Spec found for epic {N}`
- **Impact:** Cannot validate architecture alignment fully
- **Solution:**
  ```bash
  /bmad:phase-4:epic-tech-context
  ```

**code-review: Too many false completions**
- **Critical:** `8 tasks marked complete but NOT DONE`
- **Indicates:**
  - Work not actually completed
  - File list not updated
  - Incomplete implementation
- **Solution:**
  1. Review each false completion
  2. Either implement or uncheck task
  3. Update File List in Dev Agent Record
  4. Re-run `/bmad:phase-4:dev-story`

**story-context: No drafted stories**
- **Error:** `No drafted stories found`
- **Solutions:**
  1. Run `/bmad:phase-4:create-story` to draft more
  2. Run `/bmad:phase-4:sprint-planning` to refresh

**story-context: Missing documentation**
- **Warning:** `No documentation found for story domain`
- **OK for:**
  - Brownfield projects (minimal docs)
  - Small stories
  - Technical debt
- **Otherwise:**
  - Verify docs exist in `.bmad/` or `docs/`
  - Check story keywords match doc content

**story-context: No relevant code found**
- **Warning:** `No existing code found matching story keywords`
- **OK for:**
  - First story in epic
  - New features (greenfield)
  - First-time tech stack usage
- **Context will still include:**
  - Documentation
  - Dependencies
  - Testing standards
  - Constraints

**story-context: Context file very large (800+ lines)**
- **Causes:**
  - Complex story with many dependencies
  - Compliance-heavy (HIPAA, SOC2)
  - Integration story (many interfaces)
- **OK if all references are relevant**
- **Otherwise:**
  - Review code references (too many?)
  - Trim documentation snippets
  - Focus on most relevant items

**dev-story: No ready-for-dev stories**
- **Solutions:**
  1. Run `/bmad:phase-4:story-ready` to mark drafted stories
  2. Run `/bmad:phase-4:create-story` to create new stories
  3. Check if all stories are done

**dev-story: Developer halted - missing information**
- **Example:** `BLOCKER: AC requires consent verification, but interface not provided`
- **Solutions:**
  1. Provide missing info directly
  2. Update Story Context (re-run `/bmad:phase-4:story-context`)
  3. Clarify AC if ambiguous

**dev-story: Tests failing**
- **Diagnosis:** Developer should continue until passing
- **If halted with failing tests:**
  - Bug in implementation
  - Test environment issue
  - Dependency missing
- **Solution:** Fix environment, then re-run to resume

**dev-story: Developer rebuilt existing code**
- **Root Cause:** Story Context missing or incomplete
- **Prevention:**
  1. Always run `/bmad:phase-4:story-context`
  2. Ensure context finds all relevant code
  3. Review context XML before implementation
- **Remediation:** Code review catches this, creates action item

#### File System Issues

**Permission denied**
- **Error:** `Permission denied: {path}`
- **Solution:**
  ```bash
  chmod +w {path}
  ```

**Path not found**
- **Error:** `ENOENT: no such file or directory`
- **Causes:**
  - Incorrect path variable in config
  - File moved/deleted
  - Working directory wrong
- **Solutions:**
  1. Verify path in config
  2. Check file exists
  3. Use absolute paths if needed

**File in use**
- **Error:** `File is busy or locked`
- **Solution:**
  - Close other editors
  - Check for background processes
  - Restart if needed

#### Dependency Issues

**Package manager not found**
- **Error:** `npm/pip/cargo not found`
- **Solution:** Install required package manager for tech stack

**Dependency installation failed**
- **Error:** `Failed to install {package}`
- **Solutions:**
  1. Check network connection
  2. Verify package exists
  3. Check version constraints
  4. Review package registry settings

**Version conflict**
- **Error:** `Dependency conflict: {package}`
- **Solution:**
  1. Review version requirements
  2. Update lock file
  3. Resolve conflicts manually

### Getting Help

**Enable verbose logging**
- Check command output for detailed error messages

**Check workflow status**
```bash
/bmad:workflow-status
```

**Review recent changes**
```bash
cat {sprint_artifacts}/stories/{story-key}.md
# Check Change Log section
```

**Reset workflow state**
For corrupted state:
1. Backup current work
2. Re-run `/bmad:phase-4:sprint-planning`
3. Verify sprint-status.yaml
4. Resume workflows

## Report

### When Using This Troubleshooting Guide

When you encounter an error and use this guide to resolve it, document the following:

**1. Error Identification**
- Exact error message encountered
- Workflow command that triggered the error
- Context/circumstances when error occurred

**2. Resolution Applied**
- Which troubleshooting entry was used
- Specific solution(s) applied from the list
- Any modifications needed for your specific case

**3. Outcome**
- Whether the issue was resolved
- Any remaining symptoms or side effects
- Time taken to resolve

**4. Prevention**
- What process change will prevent recurrence
- Whether documentation needs updating
- If the error revealed a gap in workflow design

**5. Escalation (if unresolved)**
- All solutions attempted
- Current state of the system
- Any workarounds in place
- Specific help needed

This documentation helps improve the troubleshooting guide over time and assists others who may encounter similar issues.
