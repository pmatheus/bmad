---
description: Initialize project with comprehensive specs and standards-driven development setup
runInPlanMode: false
---

# Workflow Init - Spec-Driven Project Initialization

## Purpose

Initialize a BMAD project with complete configuration, standards, and specification foundation:
- Create configuration with user preferences (no plugin dependency)
- Detect project type and copy standards from agent-os
- Guide comprehensive specification creation via CIS agents (greenfield) or document existing codebase (brownfield)
- Generate CLAUDE.md and README.md at project root
- Establish proper folder structure for documentation and orchestration
- Provide foundation for spec-driven development workflow

## Variables

### User-Provided Variables
- `{user_provided_name}` - Project name (required, min 2 chars)
- `{bmad_dir}` - BMAD orchestration directory (default: `.bmad`)
- `{documentation_dir}` - Documentation deliverables directory (default: `docs`)
- `{communication_language}` - Language for internal communication (default: `en`)
- `{documentation_language}` - Language for user-facing documentation (default: `en`)
- `{user_name}` - Developer name for attribution (optional)

### Auto-Calculated Variables
- `{sprint_artifacts}` - Derived as `{bmad_dir}/sprint-artifacts`
- `{project_types}` - Array of detected project types (nextjs, python, flutter, rust, go, edge-functions, etc.)
- `{detected_project_types}` - Comma-separated list of detected types for display

### Workflow State Variables
- `{specs_complete}` - Boolean indicating specification completion status
- `{brownfield_documented}` - Boolean indicating brownfield documentation completion
- `{epics_created}` - Boolean tracking epic creation
- `{sprints_planned}` - Boolean tracking sprint planning
- `{current_sprint}` - Current sprint identifier (null initially)
- `{current_story}` - Current story identifier (null initially)

### Path Constants
- Agent-OS source: `/Users/user/agent-os/profiles/`
- Default profile: `/Users/user/agent-os/profiles/default/standards/`
- Project-type profiles: `/Users/user/agent-os/profiles/{project_type}/standards/`

### Date Variable
- `{date}` - Current date for timestamping (use `date` command)

## Instructions

### 1. Create Configuration (Config First!)

#### 1.1: Check for Existing Config
Check if `.bmad/config.yaml` exists.
- **If exists**: Load and validate required fields; prompt user only for missing values; continue to instruction 2
- **If NOT exists**: Proceed to create new config

#### 1.2: Prompt User for Configuration
Use **AskUserQuestion** to collect:

1. **Project Name**
   - Header: "Project Name"
   - Question: "What is your project name?"
   - Input: Text field
   - Validation: Required, min 2 chars

2. **BMAD Directory**
   - Header: "BMAD Dir"
   - Question: "Where should BMAD store orchestration files?"
   - Options: `.bmad` (default), `.bmad-custom`, Other
   - Default: `.bmad`

3. **Documentation Directory**
   - Header: "Docs Dir"
   - Question: "Where should documentation deliverables be stored?"
   - Options: `docs` (default), `.bmad/docs`, Other
   - Default: `docs`

4. **Communication Language**
   - Header: "Comm Language"
   - Question: "What language for internal communication (CLAUDE.md, story files, checkpoints)?"
   - Options: English (en), Spanish (es), Portuguese (pt), French (fr), German (de)
   - Default: English (en)

5. **Documentation Language**
   - Header: "Doc Language"
   - Question: "What language for user-facing documentation (README, PRD, specs)?"
   - Options: English (en), Spanish (es), Portuguese (pt), French (fr), German (de)
   - Default: English (en)

6. **User Name** (optional)
   - Header: "Your Name"
   - Question: "Your name (optional, for attribution in docs)?"
   - Input: Text field
   - Default: Empty

#### 1.3: Create config.yaml
Create `.bmad/config.yaml` with structure:
```yaml
# BMAD Project Configuration
project_name: "{user_provided_name}"
bmad_dir: "{bmad_dir}"
documentation_dir: "{documentation_dir}"
sprint_artifacts: "{bmad_dir}/sprint-artifacts"
communication_language: "{communication_language}"
documentation_language: "{documentation_language}"
user_name: "{user_name}"

# Project type (detected in instruction 3)
project_types: []

# Sprint settings (set later by sprint-planning)
sprint_duration_weeks: 2
team_velocity_points: 20

# Workflow state (managed by commands)
workflow_state:
  initialized: true
  specs_complete: false
  epics_created: false
  sprints_planned: false
  current_sprint: null
  current_story: null
```

### 2. Create Directory Structure

Create the following directories:
```bash
mkdir -p {bmad_dir}
mkdir -p {bmad_dir}/sprint-artifacts
mkdir -p {bmad_dir}/sprint-artifacts/stories
mkdir -p {bmad_dir}/standards
mkdir -p {documentation_dir}/product
mkdir -p {documentation_dir}/design
mkdir -p {documentation_dir}/technical
```

Verify all directories created successfully and log paths.

### 3. Detect Project Type and Copy Standards

#### 3.1: Detect Project Type
Scan project files to determine technology stack:

**Node.js/Next.js/React Detection**:
```bash
if [ -f "package.json" ]; then
  # Check dependencies in package.json
  if grep -q '"next"' package.json; then
    project_types += "nextjs"
  elif grep -q '"react"' package.json; then
    project_types += "react"
  else
    project_types += "nodejs"
  fi
fi
```

**Python Detection**:
```bash
if [ -f "requirements.txt" ] || [ -f "pyproject.toml" ] || [ -f "setup.py" ]; then
  project_types += "python"
fi
```

**Flutter/Dart Detection**:
```bash
if [ -f "pubspec.yaml" ]; then
  if grep -q 'flutter:' pubspec.yaml; then
    project_types += "flutter"
  else
    project_types += "dart"
  fi
fi
```

**Rust Detection**:
```bash
if [ -f "Cargo.toml" ]; then
  project_types += "rust"
fi
```

**Go Detection**:
```bash
if [ -f "go.mod" ]; then
  project_types += "go"
fi
```

**Edge Functions Detection**:
```bash
if [ -d "supabase/functions" ] || [ -d "netlify/edge-functions" ]; then
  project_types += "edge-functions"
fi
```

Update `config.yaml` with detected types:
```yaml
project_types: [nextjs, python]  # Example
```

#### 3.2: Copy Standards from agent-os

**Always Copy Default Standards**:
```bash
cp -r /Users/user/agent-os/profiles/default/standards/* {bmad_dir}/standards/
```

This includes:
- `backend/` - API, migrations, models, queries
- `frontend/` - Accessibility, components, CSS, responsive
- `global/` - Coding style, commenting, conventions, error handling, tech stack, validation
- `testing/` - Test writing standards

**Copy Project-Type Standards**:
For each detected project type, copy additional standards:

- **If Next.js**: `cp -r /Users/user/agent-os/profiles/nextjs/standards/* {bmad_dir}/standards/`
- **If Python**: `cp -r /Users/user/agent-os/profiles/python/standards/* {bmad_dir}/standards/`
- **If Flutter**: `cp -r /Users/user/agent-os/profiles/flutter/standards/* {bmad_dir}/standards/`
- **If Rust**: `cp -r /Users/user/agent-os/profiles/rust/standards/* {bmad_dir}/standards/`
- **If Edge Functions**: `cp -r /Users/user/agent-os/profiles/edge-functions/standards/* {bmad_dir}/standards/`

**Handle File Conflicts**:
If a file exists in both default and project-type profiles, keep both with prefixes:
```bash
# Example: global/conventions.md exists in both
mv {bmad_dir}/standards/global/conventions.md {bmad_dir}/standards/global/default-conventions.md
cp /Users/user/agent-os/profiles/python/standards/global/conventions.md {bmad_dir}/standards/global/python-conventions.md
```

#### 3.3: Generate Standards README
Create `{bmad_dir}/standards/README.md` documenting:
- Date standards were copied
- Detected project types
- Categories and their sources (default profile, nextjs profile, etc.)
- How standards are used (breakdown-sprint, bring-to-life, code-review)
- Customization guidance

### 4. Determine Project Maturity

Ask user: "Is this a new project (greenfield) or existing codebase (brownfield)?"

**Options**:
1. **Greenfield** - New project, need to create specifications → Continue to instruction 5
2. **Brownfield** - Existing codebase, need to document current state → Jump to instruction 6

### 5. CIS-Guided Specification Creation (Greenfield)

#### 5.1: Product Discovery (Optional)
Ask: "Do you need help defining your product idea?"

**If yes**, offer CIS workflows:
- **Brainstorming** (if ideation needed): Execute `~/.claude/plugins/marketplaces/bmad/workflows/cis/brainstorm-project.md` → Output: `{documentation_dir}/product/ideas.md`
- **Problem Definition** (if clarity needed): Execute `~/.claude/plugins/marketplaces/bmad/workflows/cis/problem-solving.md` → Output: `{documentation_dir}/product/problem-statement.md`

#### 5.2: Product Brief (Required)
```
Execute: ~/.claude/plugins/marketplaces/bmad/workflows/specs/product-brief.md
Prompt: vision, goals, target users, key features
Output: {documentation_dir}/product/product-brief.md (in {documentation_language})
```

#### 5.3: Product Requirements Document (Required)
```
Execute: ~/.claude/plugins/marketplaces/bmad/workflows/specs/prd.md
Input: product-brief.md
Output: {documentation_dir}/product/PRD.md (in {documentation_language})
```

#### 5.4: Design Specifications (If UI Product)
Ask: "Does this project have a user interface?"

**If yes**:
- **UX Specification**: Execute `~/.claude/plugins/marketplaces/bmad/workflows/specs/ux-spec.md` → Define user flows, personas, journey maps, information architecture → Output: `{documentation_dir}/design/ux-spec.md`
- **UI Specification**: Execute `~/.claude/plugins/marketplaces/bmad/workflows/specs/ui-spec.md` → Define design system, components, design tokens, layouts → Output: `{documentation_dir}/design/ui-spec.md`

#### 5.5: Technical Specifications (Required)

**Architecture Design**:
```
Execute: ~/.claude/plugins/marketplaces/bmad/workflows/specs/architecture.md
Define: system architecture, data models, integrations, infrastructure
Output: {documentation_dir}/technical/architecture.md (in {documentation_language})
```

**Backend Specification** (if backend component):
```
Execute: ~/.claude/plugins/marketplaces/bmad/workflows/specs/backend-spec.md
Define: API endpoints, database schema, services, authentication
Output: {documentation_dir}/technical/backend-spec.md (in {documentation_language})
```

**Tech Stack Documentation**:
```
Execute: ~/.claude/plugins/marketplaces/bmad/workflows/specs/tech-spec.md
Document: languages, frameworks, libraries, tools
Output: {documentation_dir}/technical/tech-stack.md (in {documentation_language})
```

#### 5.6: Update Workflow State
Update `{bmad_dir}/config.yaml`:
```yaml
workflow_state:
  initialized: true
  specs_complete: true
  epics_created: false
  sprints_planned: false
```

Skip to instruction 7 (Generate Project Files).

### 6. Document Existing Project (Brownfield)

#### 6.1: Scan Codebase
```
Execute: ~/.claude/plugins/marketplaces/bmad/workflows/specs/domain-research.md
Scan: src/, lib/, app/, components/ directories
Analyze: file structure, patterns, dependencies
```

#### 6.2: Generate Documentation

**Architecture Documentation**:
- Analyze codebase structure
- Generate: `{documentation_dir}/technical/architecture.md`
- Include: Current system architecture, data models discovered, API endpoints found, external integrations

**Tech Stack Documentation**:
- Detect from package files (package.json, requirements.txt, etc.)
- Generate: `{documentation_dir}/technical/tech-stack.md`
- Include: Languages/versions, frameworks/libraries, build tools, dev dependencies

**Backend Specification** (if applicable):
- Analyze API routes, database connections
- Generate: `{documentation_dir}/technical/backend-spec.md`
- Document: Existing endpoints, models, services

#### 6.3: Create Retrospective PRD
Ask: "Would you like to create a PRD based on existing functionality?"

**If yes**:
```
Analyze existing features from code
Execute: ~/.claude/plugins/marketplaces/bmad/workflows/specs/prd.md
Mode: Retrospective (document what exists)
Output: {documentation_dir}/product/PRD.md
```

#### 6.4: Update Workflow State
```yaml
workflow_state:
  initialized: true
  specs_complete: true
  brownfield_documented: true
  epics_created: false
```

### 7. Generate Project Files

#### 7.1: Create CLAUDE.md (At Project Root)
```
Execute: ~/.claude/plugins/marketplaces/bmad/workflows/utils/generate-claude-md.md
Language: {communication_language}
Scan:
  - {documentation_dir}/ for all documentation
  - {bmad_dir}/standards/ for standards
  - src/ for codebase structure
Output: CLAUDE.md (at project root)
```

**CLAUDE.md should include**:
- Project overview
- File structure map
- Key documentation locations
- Standards references
- Development workflow guide
- Links to specs

#### 7.2: Create README.md (At Project Root)
Language: `{documentation_language}`

**Content structure**:
```markdown
# {project_name}

[Brief project description from product brief]

## Getting Started

[Setup instructions based on tech stack]

## Documentation

- [Product Brief]({documentation_dir}/product/product-brief.md)
- [PRD]({documentation_dir}/product/PRD.md)
- [Architecture]({documentation_dir}/technical/architecture.md)
- [Tech Stack]({documentation_dir}/technical/tech-stack.md)

## Development

See [CLAUDE.md](./CLAUDE.md) for development workflow and standards.

## Project Structure

```
{project_name}/
├── {documentation_dir}/     # Product and technical documentation
├── {bmad_dir}/             # BMAD orchestration and standards
├── src/                    # Source code
└── tests/                  # Tests
```

## Built With BMAD Method

This project uses the BMAD Method for spec-driven development.
```

### 8. Error Handling

**If agent-os profiles not found**:
```
ERROR: agent-os profiles not found at /Users/user/agent-os/profiles/

The BMAD framework requires agent-os for coding standards.

Please install agent-os:
1. Clone: git clone https://github.com/your-org/agent-os.git ~/agent-os
2. Verify: ls ~/agent-os/profiles/default/standards/

Then re-run /bmad:workflow-init
```

**If directory creation fails**:
```
ERROR: Could not create directory: {path}

Check permissions and try again.
```

**If specification workflow fails**:
```
WARNING: {workflow_name} failed or was skipped

You can run it later manually:
Execute: ~/.claude/plugins/marketplaces/bmad/workflows/specs/{workflow_name}.md
```

## Workflow

```
START
  ↓
[1] Create Configuration
  ├─→ Check existing config.yaml
  ├─→ Prompt for user inputs (name, dirs, languages)
  └─→ Write config.yaml
  ↓
[2] Create Directory Structure
  ├─→ Create bmad_dir structure
  ├─→ Create sprint-artifacts/
  ├─→ Create documentation_dir structure
  └─→ Verify all paths
  ↓
[3] Detect Project Type & Copy Standards
  ├─→ Scan for language markers (package.json, requirements.txt, etc.)
  ├─→ Detect project types (nextjs, python, flutter, rust, go, edge-functions)
  ├─→ Copy default standards from agent-os
  ├─→ Copy project-type specific standards
  ├─→ Handle file conflicts with prefixes
  ├─→ Generate standards README.md
  └─→ Update config.yaml with detected types
  ↓
[4] Determine Project Maturity
  └─→ Ask: Greenfield or Brownfield?
      ├─→ [Greenfield] → Continue to [5]
      └─→ [Brownfield] → Jump to [6]
  ↓
[5] CIS-Guided Specification Creation (Greenfield Path)
  ├─→ [5.1] Product Discovery (optional)
  │     ├─→ Brainstorming (if needed)
  │     └─→ Problem Definition (if needed)
  ├─→ [5.2] Product Brief (required)
  ├─→ [5.3] PRD (required)
  ├─→ [5.4] Design Specs (if UI)
  │     ├─→ UX Specification
  │     └─→ UI Specification
  ├─→ [5.5] Technical Specs (required)
  │     ├─→ Architecture
  │     ├─→ Backend Spec (if applicable)
  │     └─→ Tech Stack
  ├─→ [5.6] Update workflow_state.specs_complete = true
  └─→ Jump to [7]
  ↓
[6] Document Existing Project (Brownfield Path)
  ├─→ [6.1] Scan Codebase
  ├─→ [6.2] Generate Documentation
  │     ├─→ Architecture
  │     ├─→ Tech Stack
  │     └─→ Backend Spec (if applicable)
  ├─→ [6.3] Create Retrospective PRD (optional)
  ├─→ [6.4] Update workflow_state (specs_complete, brownfield_documented)
  └─→ Continue to [7]
  ↓
[7] Generate Project Files
  ├─→ [7.1] Create CLAUDE.md (project root, communication_language)
  └─→ [7.2] Create README.md (project root, documentation_language)
  ↓
[8] Error Handling (applied throughout)
  ├─→ agent-os not found → Display install instructions
  ├─→ Directory creation fails → Check permissions
  └─→ Spec workflow fails → Provide manual execution command
  ↓
END → Display Summary & Next Steps
```

**Decision Points**:
- **Existing Config**: If config exists, load and validate; prompt only for missing values
- **Project Maturity**: Greenfield (create specs) vs Brownfield (document existing)
- **Product Discovery**: Optional brainstorming/problem-solving for greenfield
- **UI Project**: Conditional UX/UI spec creation
- **Backend Component**: Conditional backend spec creation
- **Retrospective PRD**: Optional for brownfield projects

**Parallel Operations** (can execute concurrently):
- Multiple project type detection scans
- Multiple standards copying operations (after detection)
- Multiple specification workflow executions (within same category)

## Report

### Summary Report Structure

Display completion summary with the following sections:

#### 1. Configuration Summary
```
✓ Project initialized successfully!

Configuration:
  - Config: {bmad_dir}/config.yaml
  - Project: {project_name}
  - Types: {detected_project_types}
  - Docs Language: {documentation_language}
  - Comm Language: {communication_language}
```

#### 2. Standards Summary
```
Standards:
  - Copied from agent-os profiles
  - Location: {bmad_dir}/standards/
  - Sources:
    - default profile: {file_count} files
    {- nextjs profile: {file_count} files}
    {- python profile: {file_count} files}
  - Categories: {list_categories}
```

#### 3. Specifications Summary

**For Greenfield Projects**:
```
Specifications:
  - Product Brief: {documentation_dir}/product/product-brief.md
  - PRD: {documentation_dir}/product/PRD.md
  - Architecture: {documentation_dir}/technical/architecture.md
  {- UX Spec: {documentation_dir}/design/ux-spec.md}
  {- UI Spec: {documentation_dir}/design/ui-spec.md}
  {- Backend Spec: {documentation_dir}/technical/backend-spec.md}
  - Tech Stack: {documentation_dir}/technical/tech-stack.md
```

**For Brownfield Projects**:
```
Specifications:
  - Documented existing codebase
  - Architecture: {documentation_dir}/technical/architecture.md
  - Tech Stack: {documentation_dir}/technical/tech-stack.md
  {- Backend Spec: {documentation_dir}/technical/backend-spec.md}
  {- Retrospective PRD: {documentation_dir}/product/PRD.md}
```

#### 4. Project Files
```
Project Files:
  - CLAUDE.md (project root, {communication_language})
  - README.md (project root, {documentation_language})
```

#### 5. File Structure Overview
```
File Structure:
{project_name}/
├── CLAUDE.md
├── README.md
├── {documentation_dir}/
│   ├── product/
│   ├── design/
│   └── technical/
├── {bmad_dir}/
│   ├── config.yaml
│   ├── standards/
│   └── sprint-artifacts/
└── src/
```

#### 6. Next Steps
```
📋 Next Steps:

1. Review generated specifications in {documentation_dir}/
2. Review coding standards in {bmad_dir}/standards/
3. Run /bmad:create-epics-stories to break specs into development work
4. Run /bmad:sprint-planning to organize work into sprints
5. Run /bmad:breakdown-sprint to create granular tasks
6. Run /bmad:bring-to-life to start implementation

Need help? Check CLAUDE.md for workflow guidance.
```

### Error Reporting

For any errors encountered during execution, report:
- **Error type**: Clear categorization (config error, permission error, workflow error)
- **Error location**: Which instruction step failed
- **Error message**: Specific error details
- **Resolution steps**: Clear actions to resolve the issue
- **Continuation guidance**: How to continue after resolving the error

### Progress Indicators

Throughout execution, display progress indicators:
- `✓` for completed steps
- `→` for in-progress operations
- `!` for warnings
- `✗` for errors

Example:
```
✓ Config created: .bmad/config.yaml
✓ Directories created
→ Detecting project type...
✓ Detected: nextjs, python
→ Copying standards from agent-os...
✓ Standards copied: 42 files
```

### Reference Information

Include at end of report:

**Configuration Reference**:
- Location of config.yaml
- All configuration values set
- Workflow state flags

**Quick Start Commands**:
```bash
# View configuration
cat {bmad_dir}/config.yaml

# View standards
ls {bmad_dir}/standards/

# View specifications
ls {documentation_dir}/

# Start development workflow
/bmad:create-epics-stories
```
