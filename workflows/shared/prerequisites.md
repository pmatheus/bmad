# Prerequisites Reference

## Standard Prerequisites

### All Workflows Require
- [ ] **BMAD plugin installed** in Claude Code
- [ ] **Project initialized** via `/bmad:meta:workflow-init`
- [ ] **`.bmad/config.yaml`** exists with valid configuration

## Phase-Specific Prerequisites

### Phase 1: Discovery
- [ ] Project concept defined
- [ ] Domain research completed (optional but recommended)

### Phase 2: Planning
**For PRD:**
- [ ] Product brief created OR user has requirements ready

**For Epics:**
- [ ] PRD exists (Level 2+) OR Tech Spec exists (Level 0-1)
- [ ] Architecture defined (optional but recommended)

### Phase 3: Architecture
- [ ] Requirements defined (PRD or Tech Spec)
- [ ] Project technology stack known

### Phase 4: Implementation

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

### Meta Workflows

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

## Required File Structure

### Minimal Setup
```
.bmad/
  config.yaml           # Project configuration
```

### Full Setup
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

## Configuration Requirements

### config.yaml Must Have
```yaml
documentation_dir: .bmad          # Required
sprint_artifacts: .bmad/sprint-artifacts  # Required
user_name: "Name"             # Required
bmad_folder: .bmad            # Required
project_name: "Name"          # Optional but recommended
user_skill_level: intermediate # Optional
```

## Dependency Detection

### Node.js
- `package.json` with dependencies

### Python
- `pyproject.toml` OR `requirements.txt`

### Go
- `go.mod`

### Rust
- `Cargo.toml`

### Unity
- `Packages/manifest.json` AND `Assets/` AND `ProjectSettings/`

## Checking Prerequisites

### Verify Configuration
```bash
cat .bmad/config.yaml
```

### Verify Sprint Status
```bash
cat {sprint_artifacts}/sprint-status.yaml
```

### Verify Story Files
```bash
ls {sprint_artifacts}/stories/
```

### Verify Documentation
```bash
ls .bmad/*.md
```
