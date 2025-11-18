# Prerequisites Reference

## Purpose

This reference document defines the prerequisites and dependencies required for all BMAD workflows. It provides a comprehensive checklist system for verifying that necessary files, configurations, and project states are in place before executing any workflow command. Use this document to validate readiness before starting any phase or workflow.

## Variables

This is a reference document and does not use runtime variables. However, the following placeholders may appear in examples:

- `{sprint_artifacts}` - Path to sprint artifacts directory (from config.yaml)
- `{story-key}` - Unique identifier for a story file
- `{N}` - Epic number identifier
- `{documentation_dir}` - Path to documentation directory (from config.yaml)

## Instructions

### How to Use This Reference

1. **Identify Your Workflow**: Locate the workflow you plan to execute (e.g., Phase 1, Phase 2, Phase 4)
2. **Check Standard Prerequisites**: Verify all items in "Standard Prerequisites" are complete
3. **Check Phase-Specific Prerequisites**: Review the checklist for your specific workflow
4. **Verify File Structure**: Ensure required files exist using the file structure section
5. **Validate Configuration**: Check config.yaml contains all required fields
6. **Run Verification Commands**: Execute the checking commands to confirm prerequisites
7. **Resolve Missing Items**: Complete any missing prerequisites before proceeding

### Standard Prerequisites

All workflows require:
- [ ] **BMAD plugin installed** in Claude Code
- [ ] **Project initialized** via `/bmad:meta:workflow-init`
- [ ] **`.bmad/config.yaml`** exists with valid configuration

### Phase-Specific Prerequisites

#### Phase 1: Discovery
- [ ] Project concept defined
- [ ] Domain research completed (optional but recommended)

#### Phase 2: Planning

**For PRD:**
- [ ] Product brief created OR user has requirements ready

**For Epics:**
- [ ] PRD exists (Level 2+) OR Tech Spec exists (Level 0-1)
- [ ] Architecture defined (optional but recommended)

#### Phase 3: Architecture
- [ ] Requirements defined (PRD or Tech Spec)
- [ ] Project technology stack known

#### Phase 4: Implementation

**For Create Story:**
- [ ] Epics created
- [ ] Sprint planning run (sprint-status.yaml exists)
- [ ] At least one story in backlog

**For Story Context:**
- [ ] Story drafted
- [ ] Story file exists with ACs and tasks
- [ ] Sprint status tracking active

**For Dev Story:**
- [ ] Story exists with status "ready-for-dev" or "in-progress"
- [ ] Story Context generated (strongly recommended)

**For Code Review:**
- [ ] Story implemented with status "review"
- [ ] Story context file exists (optional)
- [ ] Epic tech spec available (optional)

**For Story Done:**
- [ ] Story reviewed and approved
- [ ] All tests passing

**For Bring to Life:**
- [ ] Epics created
- [ ] Sprint planning run
- [ ] At least one story in backlog

**For Retrospective:**
- [ ] Epic completed (all stories done)

#### Meta Workflows

**For Workflow Init:**
- [ ] BMAD plugin installed
- [ ] Project directory accessible

**For Generate CLAUDE.md:**
- [ ] .bmad/config.yaml exists (documentation_dir configured)
- [ ] ~/agent-os/profiles/ directory accessible
- [ ] ~/agent-os/profiles/default/ exists (REQUIRED - base for all profiles)
- [ ] Specific profile exists OR use default as fallback (optional)
- [ ] PRD.md for tech stack extraction (optional)
- [ ] Project files for file map generation (optional)

**For Update CLAUDE.md:**
- [ ] Root CLAUDE.md exists (run generate-claude-md first)
- [ ] Files to add are readable
- [ ] File paths are valid

## Workflow

### Required File Structure

**Minimal Setup:**
```
.bmad/
  config.yaml           # Project configuration
```

**Full Setup:**
```
.bmad/
  config.yaml           # Project configuration
  architecture.md       # System architecture (or architecture/)
  prd.md                # Requirements (Level 2+)
  tech-spec.md          # Requirements (Level 0-1)
  sprint-artifacts/
    sprint-status.yaml  # Story tracking
    stories/
      {story-key}.md    # Story files
      {story-key}.context.xml  # Story contexts
    tech-spec-epic-{N}.md  # Epic specs
```

### Configuration Requirements

**config.yaml Must Have:**
```yaml
documentation_dir: .bmad          # Required
sprint_artifacts: .bmad/sprint-artifacts  # Required
user_name: "Name"             # Required
bmad_folder: .bmad            # Required
project_name: "Name"          # Optional but recommended
user_skill_level: intermediate # Optional
```

### Dependency Detection

**Node.js:**
- `package.json` with dependencies

**Python:**
- `pyproject.toml` OR `requirements.txt`

**Go:**
- `go.mod`

**Rust:**
- `Cargo.toml`

**Unity:**
- `Packages/manifest.json` AND `Assets/` AND `ProjectSettings/`

### Verification Commands

**Verify Configuration:**
```bash
cat .bmad/config.yaml
```

**Verify Sprint Status:**
```bash
cat {sprint_artifacts}/sprint-status.yaml
```

**Verify Story Files:**
```bash
ls {sprint_artifacts}/stories/
```

**Verify Documentation:**
```bash
ls .bmad/*.md
```

## Report

### For Users

When checking prerequisites manually:

1. **List Missing Items**: Clearly identify which prerequisites are not met
2. **Provide Next Steps**: Indicate which workflow to run to satisfy missing prerequisites
3. **Show File Paths**: Display absolute paths to files that need to be created or verified
4. **Indicate Severity**: Distinguish between required items and optional recommendations

### For Workflows

When a workflow checks prerequisites programmatically:

1. **Early Exit on Failure**: Stop execution immediately if critical prerequisites are missing
2. **Clear Error Messages**: Explain what is missing and why it's needed
3. **Suggest Resolution**: Provide the exact command to run to satisfy the prerequisite
4. **Log Checks**: Document which prerequisites were verified successfully

Example error format:
```
ERROR: Missing prerequisite for {workflow_name}
  - Missing: {prerequisite_item}
  - Reason: {why_needed}
  - Solution: Run `{command_to_fix}`
```

Example success format:
```
✓ All prerequisites satisfied for {workflow_name}
  - Config validated
  - Required files present
  - Project state ready
```
