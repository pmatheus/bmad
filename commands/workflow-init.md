---
description: Initialize project with comprehensive specs and standards-driven development setup
runInPlanMode: false
---

# Workflow Init - Spec-Driven Project Initialization

## Purpose

Initialize a BMAD project with:
- Configuration creation (no plugin dependency)
- Project type detection and standards copying from agent-os
- Comprehensive specification creation guided by CIS agents
- Proper folder structure for docs and orchestration
- Foundation for spec-driven development

## Quick Start

```bash
/bmad:workflow-init

# This workflow will:
# 1. Create config.yaml with user prompts
# 2. Detect project type and copy standards from agent-os
# 3. Guide through CIS-driven specification creation
# 4. Create CLAUDE.md and README.md at project root
# 5. Set up folder structure for development
```

---

## Step 1: Create Configuration (Config First!)

### 1.1: Check for Existing Config

Check if `.bmad/config.yaml` exists.

**If exists**:
- Load and validate required fields
- If missing fields, prompt user for missing values only
- Continue to Step 2

**If NOT exists**:
- Proceed to create new config

### 1.2: Prompt User for Configuration

Use **AskUserQuestion** to prompt for:

**Question 1: Project Name**
- Header: "Project Name"
- Question: "What is your project name?"
- Input: Text field
- Validation: Required, min 2 chars

**Question 2: BMAD Directory**
- Header: "BMAD Dir"
- Question: "Where should BMAD store orchestration files?"
- Options:
  - `.bmad` (default, recommended)
  - `.bmad-custom`
  - Other (custom path)
- Default: `.bmad`

**Question 3: Documentation Directory**
- Header: "Docs Dir"
- Question: "Where should documentation deliverables be stored?"
- Options:
  - `docs` (default, recommended - at project root)
  - `.bmad/docs` (keep everything in .bmad)
  - Other (custom path)
- Default: `docs`

**Question 4: Communication Language**
- Header: "Comm Language"
- Question: "What language for internal communication (CLAUDE.md, story files, checkpoints)?"
- Options:
  - English (en)
  - Spanish (es)
  - Portuguese (pt)
  - French (fr)
  - German (de)
- Default: English (en)

**Question 5: Documentation Language**
- Header: "Doc Language"
- Question: "What language for user-facing documentation (README, PRD, specs)?"
- Options:
  - English (en)
  - Spanish (es)
  - Portuguese (pt)
  - French (fr)
  - German (de)
- Default: English (en)

**Question 6: User Name** (optional)
- Header: "Your Name"
- Question: "Your name (optional, for attribution in docs)?"
- Input: Text field
- Default: Empty

### 1.3: Create config.yaml

Create `.bmad/config.yaml` with values:

```yaml
# BMAD Project Configuration
project_name: "{user_provided_name}"
bmad_dir: "{user_provided_or_default_.bmad}"
documentation_dir: "{user_provided_or_default_docs}"
sprint_artifacts: "{bmad_dir}/sprint-artifacts"  # Auto-calculated
communication_language: "{user_provided_or_default_en}"
documentation_language: "{user_provided_or_default_en}"
user_name: "{user_provided_or_empty}"

# Project type (detected in Step 2)
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

---

## Step 2: Create Directory Structure

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

**Verification**:
- Confirm all directories created successfully
- Log paths created

---

## Step 3: Detect Project Type and Copy Standards

### 3.1: Detect Project Type

Scan project files to determine technology stack:

**Node.js/Next.js/React Detection**:
```bash
if [ -f "package.json" ]; then
  # Read package.json dependencies
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

**Update config.yaml**:
```yaml
project_types: [nextjs, python]  # Example if both detected
```

### 3.2: Copy Standards from agent-os

**Source**: `/Users/user/agent-os/profiles/`

#### Always Copy Default Standards

Copy from: `/Users/user/agent-os/profiles/default/standards/`

**Structure to copy**:
```
default/standards/
├── backend/
│   ├── api.md
│   ├── migrations.md
│   ├── models.md
│   └── queries.md
├── frontend/
│   ├── accessibility.md
│   ├── components.md
│   ├── css.md
│   └── responsive.md
├── global/
│   ├── coding-style.md
│   ├── commenting.md
│   ├── conventions.md
│   ├── error-handling.md
│   ├── tech-stack.md
│   └── validation.md
└── testing/
    └── test-writing.md
```

**Copy command**:
```bash
cp -r /Users/user/agent-os/profiles/default/standards/* {bmad_dir}/standards/
```

#### Copy Project-Type Standards

For each detected project type, copy additional standards:

**If Next.js**:
```bash
cp -r /Users/user/agent-os/profiles/nextjs/standards/* {bmad_dir}/standards/
```

This adds:
```
architecture/
├── api-routes.md
├── app-router.md
├── middleware.md
└── server-client.md
global/
├── component-patterns.md
├── file-organization.md
├── imports.md
└── naming.md
state-management/
├── tanstack-query.md
└── zustand.md
tooling/
├── eslint.md
├── prettier.md
├── shadcn-ui.md
├── tailwind.md
└── typescript.md
```

**If Python**:
```bash
cp -r /Users/user/agent-os/profiles/python/standards/* {bmad_dir}/standards/
```

**If Flutter**:
```bash
cp -r /Users/user/agent-os/profiles/flutter/standards/* {bmad_dir}/standards/
```

**If Rust**:
```bash
cp -r /Users/user/agent-os/profiles/rust/standards/* {bmad_dir}/standards/
```

**If Edge Functions**:
```bash
cp -r /Users/user/agent-os/profiles/edge-functions/standards/* {bmad_dir}/standards/
```

#### Handle File Conflicts

If a file exists in both default and project-type profiles (same category/filename):

**Strategy**: Keep both with prefixes
```bash
# Example: global/conventions.md exists in both default and python
mv {bmad_dir}/standards/global/conventions.md {bmad_dir}/standards/global/default-conventions.md
cp /Users/user/agent-os/profiles/python/standards/global/conventions.md {bmad_dir}/standards/global/python-conventions.md
```

### 3.3: Generate Standards README

Create `{bmad_dir}/standards/README.md`:

```markdown
# Project Standards

Standards copied from agent-os profiles on {date}.

## Detected Project Types
{list of detected types}

## Categories

### backend/
API design, database migrations, models, queries
- Source: default profile

### frontend/
Components, CSS, accessibility, responsive design
- Source: default profile

### global/
Coding style, conventions, error handling, validation
- Sources: default profile{, nextjs profile, python profile, etc.}

### testing/
Test writing standards
- Source: default profile

{If Next.js detected:}
### architecture/
Next.js App Router, API routes, middleware, server/client components
- Source: nextjs profile

### state-management/
TanStack Query, Zustand patterns
- Source: nextjs profile

### tooling/
ESLint, Prettier, TypeScript, Tailwind configuration
- Source: nextjs profile

{If Python detected:}
### tooling/
pytest, ruff, uv usage
- Source: python profile

## How These Are Used

1. **breakdown-sprint**: References standards when generating tasks
2. **bring-to-life**: bmad-dev agent follows standards during implementation
3. **code-review**: Validates code against these standards

## Customization

You can customize these standards for your project:
- Edit files directly in this directory
- Add new standard files
- Remove standards that don't apply

Changes are automatically picked up in subsequent development tasks.
```

**Log completion**:
```
✓ Copied standards from agent-os profiles
  - default profile: {count} files
  {- nextjs profile: {count} files}
  {- python profile: {count} files}
✓ Standards saved to {bmad_dir}/standards/
```

---

## Step 4: Determine Project Maturity

Ask user about project state:

**Question**: "Is this a new project (greenfield) or existing codebase (brownfield)?"

**Options**:
1. **Greenfield** - New project, need to create specifications
2. **Brownfield** - Existing codebase, need to document current state

**If Greenfield** → Continue to Step 5 (Spec Creation)
**If Brownfield** → Jump to Step 6 (Document Existing Project)

---

## Step 5: CIS-Guided Specification Creation (Greenfield)

Guide user through comprehensive specification creation using auxiliary workflows.

### 5.1: Product Discovery (Optional)

Ask: "Do you need help defining your product idea?"

**If yes**, offer CIS workflows:

**Brainstorming** (if user needs ideation):
```
Execute: ~/.claude/plugins/marketplaces/bmad/workflows/cis/brainstorm-project.md
Output: {documentation_dir}/product/ideas.md
```

**Problem Definition** (if user needs clarity):
```
Execute: ~/.claude/plugins/marketplaces/bmad/workflows/cis/problem-solving.md
Output: {documentation_dir}/product/problem-statement.md
```

### 5.2: Product Brief (Required)

```
Execute: ~/.claude/plugins/marketplaces/bmad/workflows/specs/product-brief.md
Prompt user for: vision, goals, target users, key features
Output: {documentation_dir}/product/product-brief.md (in {documentation_language})
```

### 5.3: Product Requirements Document (Required)

```
Execute: ~/.claude/plugins/marketplaces/bmad/workflows/specs/prd.md
Input: product-brief.md
Output: {documentation_dir}/product/PRD.md (in {documentation_language})
```

### 5.4: Design Specifications (If UI Product)

Ask: "Does this project have a user interface?"

**If yes**:

**UX Specification**:
```
Execute: ~/.claude/plugins/marketplaces/bmad/workflows/specs/ux-spec.md
Define: user flows, personas, journey maps, information architecture
Output: {documentation_dir}/design/ux-spec.md (in {documentation_language})
```

**UI Specification**:
```
Execute: ~/.claude/plugins/marketplaces/bmad/workflows/specs/ui-spec.md
Define: design system, components, design tokens, layouts
Output: {documentation_dir}/design/ui-spec.md (in {documentation_language})
```

### 5.5: Technical Specifications (Required)

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
Document: chosen languages, frameworks, libraries, tools
Output: {documentation_dir}/technical/tech-stack.md (in {documentation_language})
```

### 5.6: Update Workflow State

Update `{bmad_dir}/config.yaml`:
```yaml
workflow_state:
  initialized: true
  specs_complete: true
  epics_created: false
  sprints_planned: false
```

**Skip to Step 7** (Generate Project Files)

---

## Step 6: Document Existing Project (Brownfield)

For existing codebases, document current state:

### 6.1: Scan Codebase

Analyze existing code:
```
Execute: ~/.claude/plugins/marketplaces/bmad/workflows/specs/domain-research.md
Scan: src/, lib/, app/, components/ directories
Analyze: file structure, patterns, dependencies
```

### 6.2: Generate Documentation

**Architecture Documentation**:
```
Analyze codebase structure
Generate: {documentation_dir}/technical/architecture.md
Include:
  - Current system architecture
  - Data models discovered
  - API endpoints found
  - External integrations
```

**Tech Stack Documentation**:
```
Detect from package files (package.json, requirements.txt, etc.)
Generate: {documentation_dir}/technical/tech-stack.md
Include:
  - Languages and versions
  - Frameworks and libraries
  - Build tools
  - Development dependencies
```

**Backend Specification** (if applicable):
```
Analyze API routes, database connections
Generate: {documentation_dir}/technical/backend-spec.md
Document existing endpoints, models, services
```

### 6.3: Create Retrospective PRD

Ask: "Would you like to create a PRD based on existing functionality?"

**If yes**:
```
Analyze existing features from code
Execute: ~/.claude/plugins/marketplaces/bmad/workflows/specs/prd.md
Mode: Retrospective (document what exists)
Output: {documentation_dir}/product/PRD.md
```

### 6.4: Update Workflow State

```yaml
workflow_state:
  initialized: true
  specs_complete: true
  brownfield_documented: true
  epics_created: false
```

---

## Step 7: Generate Project Files

### 7.1: Create CLAUDE.md (At Project Root)

**Location**: Project root (parent of {bmad_dir})

**Language**: {communication_language}

```
Execute: ~/.claude/plugins/marketplaces/bmad/workflows/utils/generate-claude-md.md
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

### 7.2: Create README.md (At Project Root)

**Location**: Project root

**Language**: {documentation_language}

**Content**:
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

---

## Step 8: Summary and Next Steps

Display completion summary:

```
✓ Project initialized successfully!

Configuration:
  - Config: {bmad_dir}/config.yaml
  - Project: {project_name}
  - Types: {detected_project_types}
  - Docs Language: {documentation_language}
  - Comm Language: {communication_language}

Standards:
  - Copied from agent-os profiles
  - Location: {bmad_dir}/standards/
  - Categories: {list_categories}

Specifications:
  {If greenfield:}
  - Product Brief: {documentation_dir}/product/product-brief.md
  - PRD: {documentation_dir}/product/PRD.md
  - Architecture: {documentation_dir}/technical/architecture.md
  {- UX Spec: {documentation_dir}/design/ux-spec.md}
  {- UI Spec: {documentation_dir}/design/ui-spec.md}
  {- Backend Spec: {documentation_dir}/technical/backend-spec.md}

  {If brownfield:}
  - Documented existing codebase
  - Architecture: {documentation_dir}/technical/architecture.md
  - Tech Stack: {documentation_dir}/technical/tech-stack.md

Project Files:
  - CLAUDE.md (project root)
  - README.md (project root)

📋 Next Steps:

1. Review generated specifications in {documentation_dir}/
2. Review coding standards in {bmad_dir}/standards/
3. Run /bmad:create-epics-stories to break specs into development work
4. Run /bmad:sprint-planning to organize work into sprints
5. Run /bmad:breakdown-sprint to create granular tasks
6. Run /bmad:bring-to-life to start implementation

Need help? Check CLAUDE.md for workflow guidance.
```

---

## Error Handling

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

---

## Configuration Reference

Final `{bmad_dir}/config.yaml` structure:

```yaml
# Project Configuration
project_name: "My Awesome Project"
bmad_dir: .bmad
documentation_dir: docs
sprint_artifacts: .bmad/sprint-artifacts
communication_language: en
documentation_language: en
user_name: "Developer Name"

# Detected Project Types
project_types:
  - nextjs
  - python

# Sprint Settings (set by sprint-planning)
sprint_duration_weeks: 2
team_velocity_points: 20

# Workflow State
workflow_state:
  initialized: true
  specs_complete: true
  brownfield_documented: false
  epics_created: false
  sprints_planned: false
  current_sprint: null
  current_story: null
  current_task: null
```

---

## File Structure After Init

```
project-root/
├── CLAUDE.md                    # Project navigation (communication_language)
├── README.md                    # User docs (documentation_language)
├── docs/                        # documentation_dir
│   ├── product/
│   │   ├── product-brief.md
│   │   └── PRD.md
│   ├── design/
│   │   ├── ux-spec.md
│   │   └── ui-spec.md
│   ├── technical/
│   │   ├── architecture.md
│   │   ├── tech-stack.md
│   │   └── backend-spec.md
│   └── README.md
├── .bmad/                       # bmad_dir
│   ├── config.yaml
│   └── standards/               # Copied from agent-os
│       ├── backend/
│       ├── frontend/
│       ├── global/
│       ├── testing/
│       ├── architecture/        # If Next.js/Flutter
│       ├── state-management/    # If Next.js/Flutter
│       ├── tooling/            # Project-type specific
│       └── README.md
└── src/                         # User's code
```
