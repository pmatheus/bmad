---
description: Generate project-level CLAUDE.md with file map, coding standards, and operational context from agent-os profiles
---

# Generate CLAUDE.md - Project Context & Navigation

Generates comprehensive CLAUDE.md file combining navigation (file map), coding standards (from profiles), and operational guidance. CLAUDE.md becomes the primary context file for AI agents working on the project.

## Purpose

Creates living documentation that serves three critical functions:
1. **Navigation**: File map enables quick file discovery
2. **Standards**: Top 10-15 critical coding rules inline, full standards in .bmad/standards/
3. **Operations**: Common tasks, troubleshooting, environment setup

**Key Principles:**
1. **Profile Inheritance**: ALWAYS copy default profile + specific profile (nextjs, python, rust, etc.)
2. **Size Discipline**: Root ≤420 lines, subfolder ≤200 lines
3. **Living Document**: Auto-updated by workflows when files created
4. **AI-Optimized**: Structured sections with semantic tags

## Quick Start

```bash
# Prerequisites: Project initialized, .bmad/config.yaml exists
/bmad:meta:generate-claude-md

# Workflow will:
# 1. Detect framework (Next.js, Python, Rust, etc.)
# 2. Copy default profile standards → .bmad/standards/
# 3. Overlay specific profile standards → .bmad/standards/
# 4. Extract top 10-15 critical rules
# 5. Generate file map (directory-level)
# 6. Create root CLAUDE.md (≤420 lines)
# 7. Create subfolder CLAUDE.md for large directories (>30 files)
```

## Prerequisites

See [shared/prerequisites.md#meta-generate-claude-md](../shared/prerequisites.md)

**Workflow-specific:**
- [ ] .bmad/config.yaml exists (output_folder configured)
- [ ] ~/agent-os/profiles/ directory accessible
- [ ] ~/agent-os/profiles/default/ exists (REQUIRED - base for all profiles)

## Instructions

### 1. Load Configuration

See [shared/common-operations.md#load-configuration](../shared/common-operations.md)

Read from `.bmad/config.yaml`:
- `output_folder`, `project_name`
- `document_output_language`, `communication_language`

**Validation:**
- Verify .bmad/config.yaml exists
- Verify ~/agent-os/profiles/ accessible
- Verify ~/agent-os/profiles/default/ exists

### 2. Detect Project Framework

**Scan for framework indicators** (check in project root and output_folder):

**Next.js:**
- package.json contains `"next": "..."`
- next.config.js OR next.config.ts exists
- app/ directory (App Router) OR pages/ directory (Pages Router)

**Python:**
- pyproject.toml exists OR
- requirements.txt exists OR
- setup.py exists OR
- Pipfile exists

**Rust:**
- Cargo.toml exists
- Cargo.lock exists

**Flutter:**
- pubspec.yaml exists
- lib/ directory with .dart files
- android/ and ios/ directories exist

**Edge Functions (Supabase/Deno):**
- supabase/functions/ directory exists OR
- deno.json OR deno.jsonc exists
- TypeScript files with Deno imports

**Default/Unknown:**
- No specific framework detected
- Use as fallback for all projects

**Select profile:**
```python
if nextjs_detected:
    profile = "nextjs"
elif python_detected:
    profile = "python"
elif rust_detected:
    profile = "rust"
elif flutter_detected:
    profile = "flutter"
elif edge_functions_detected:
    profile = "edge-functions"
else:
    profile = "default"
```

**If PRD exists** (extract tech stack for confirmation):
- Read {output_folder}/PRD.md
- Look for "Tech Stack" or "Technology" section
- Override auto-detection if explicit framework specified

### 3. Analyze Project Structure

**Count files by type:**
```bash
# Count source files
find {output_folder} -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.py" -o -name "*.rs" -o -name "*.dart" -o -name "*.md" \) | wc -l
```

**Identify major directories:**
- src/
- lib/
- app/
- components/
- pages/
- api/
- tests/
- docs/

**For each directory:**
- Count files
- Identify if > 30 files (threshold for subfolder CLAUDE.md)
- List top-level files (for core files section)

**Scan for core utility files:**
- utils.*, helpers.*, constants.*, config.*
- API clients, database connections
- Shared types, interfaces

### 4. Copy Profile Standards to .bmad/standards/ (WITH INHERITANCE)

**CRITICAL**: All profiles inherit from default. ALWAYS copy both.

**Step 4.1**: Create directory structure
```bash
mkdir -p {output_folder}/.bmad/standards
```

**Step 4.2**: Copy default profile standards (BASE LAYER)
```bash
cp -r ~/agent-os/profiles/default/standards/* {output_folder}/.bmad/standards/
```

This copies:
- global/ (coding-style, conventions, validation, commenting, tech-stack, error-handling)
- backend/ (api, migrations, models, queries)
- frontend/ (accessibility, components, css, responsive)
- testing/ (test-writing)

**Step 4.3**: Copy specific profile standards (OVERLAY/EXTENSION)

**Only if detected profile is NOT default:**
```bash
if [ "$profile" != "default" ]; then
    cp -r ~/agent-os/profiles/${profile}/standards/* {output_folder}/.bmad/standards/
fi
```

This overlays/adds:
- **nextjs**: architecture/, state-management/, global/ (adds 4 files), tooling/
- **python**: global/ (overrides conventions.md, error-handling.md; adds typing.md, imports.md), tooling/
- **rust**: global/ (overrides conventions.md; adds patterns.md), tooling/
- **flutter**: global/ (minimal additions)
- **edge-functions**: global/ (minimal additions)

**Step 4.4**: Apply exclusions from profile-config.yml (if exists)

Check for `~/agent-os/profiles/{profile}/profile-config.yml`:
```yaml
inherits_from: default

# Optional exclusions
exclude_inherited_files:
  - standards/backend/api/*
  - standards/backend/database/migrations.md
```

If exclusions present:
```bash
for file in exclude_inherited_files:
    rm -f {output_folder}/.bmad/standards/${file}
```

**Result**: .bmad/standards/ now contains:
- Default profile (base layer)
- Specific profile (overlay/extensions)
- Excluded files removed (if configured)

### 5. Extract Top 10-15 Critical Rules

**Scan all files in .bmad/standards/** for critical rules:

**Priority order:**
1. Security rules (validation, auth, secrets)
2. Data integrity rules (migrations, queries, state)
3. Code organization rules (file size, naming, structure)
4. Testing requirements (coverage, critical paths)
5. Error handling patterns
6. Performance constraints

**Extraction pattern:**
- Look for sections marked "Critical", "Must", "Always", "Never"
- Look for security keywords: "validate", "sanitize", "escape", "auth"
- Look for data keywords: "migration", "transaction", "consistency"
- Look for org keywords: "file size", "naming", "directory structure"

**Format each rule** (1-2 lines):
```markdown
- **Rule**: Brief description
  - **Why**: Rationale
  - **Instead**: Alternative if violated
  - **See**: .bmad/standards/{category}/{file}.md
```

**Select 10-15 most critical rules** (40-60 lines total)

**Example rules:**
```markdown
1. **File Size Limit: 600 lines maximum**
   - **Why**: Maintainability and code review efficiency
   - **Instead**: Split into smaller modules by feature/responsibility
   - **See**: .bmad/standards/global/file-organization.md

2. **Always Validate User Input**
   - **Why**: Prevent injection attacks and data corruption
   - **Instead**: Use Zod/validator for all API inputs
   - **See**: .bmad/standards/global/validation.md

3. **Never Store Secrets in Code**
   - **Why**: Prevents credential leaks in version control
   - **Instead**: Use environment variables + secret management
   - **See**: .bmad/standards/global/coding-style.md
```

### 6. Generate Directory-Level File Map

**For each major directory**, generate summary:

```markdown
### Source Code
- **src/app/** (24 files) - Next.js app router pages and layouts
  - See src/app/CLAUDE.md for detailed file listing
- **src/components/** (15 files) - Reusable React components
  - Button.tsx - Primary button component with variants
  - Input.tsx - Form input with validation
  - Card.tsx - Container component with slots
  ... (list 5-10 key files per directory)
- **src/lib/** (8 files) - Utility functions and helpers
  - utils.ts - Common utility functions
  - api.ts - API client wrapper
```

**Rules:**
- If directory > 30 files: Note "See {dir}/CLAUDE.md for details"
- If directory ≤ 30 files: List key files inline (5-10 most important)
- Include file count in parentheses
- Brief directory purpose description

**Total**: 15-20 lines for file map section

### 7. Generate Core Context & Purpose (60-80 lines)

**7.1 Project Overview** (15-25 lines):

**If PRD exists:**
- Extract from PRD "Overview" or "Introduction" section
- Use PRD's "Problem Statement" for "Why"
- Use PRD's "Target Users" for "Who"

**If no PRD:**
- Infer from package.json "description"
- Infer from README.md if exists
- Use framework/language as hint for type

**Format:**
```markdown
### Project Overview
- **What**: {1-2 sentence description of what project does}
- **Why**: {problem it solves}
- **Who**: {target users/audience}
- **Status**: {development stage - planning/active/production}
```

**7.2 Tech Stack** (10-15 lines):

**From profile README or PRD:**
```markdown
### Tech Stack
- Framework: {e.g., Next.js 15, Flask, Actix Web}
- Language: {e.g., TypeScript, Python, Rust}
- Database: {e.g., PostgreSQL + Prisma, MongoDB, SQLite}
- Deployment: {e.g., Vercel, AWS, Docker}
- Key Libraries: {top 5-8 libraries}
```

**7.3 Core Files & Utilities** (30-40 lines):

List 10-15 most important files:
- Main entry points (index, main, app)
- Critical config files (database, auth, env)
- Key utility files (helpers, utils, constants)
- Shared types/interfaces

**Format:**
```markdown
### Core Files & Utilities
- **src/app/layout.tsx**: Root layout with providers and global styles
- **src/lib/db.ts**: Database connection and Prisma client
- **src/lib/auth.ts**: Authentication utilities and session management
- **src/components/ui/**: Shadcn UI component library
- **.env.example**: Environment variable template
... (10-15 files total)
```

**7.4 File Map** (from Step 6):
```markdown
### File Map
{Insert directory-level summary from Step 6}
```

### 8. Generate Guidelines & Constraints (180-220 lines)

**8.1 Code Style & Guidelines** (60-80 lines):

```markdown
### Code Style & Guidelines

<critical_notes>
#### Top 15 Critical Rules

{Insert 10-15 rules from Step 5}

</critical_notes>

**Full Standards**: See .bmad/standards/ for comprehensive guidelines
- [Architecture](.bmad/standards/architecture/) - {Framework-specific patterns}
- [Global](.bmad/standards/global/) - Coding style, imports, naming
- [Backend](.bmad/standards/backend/) - API, database, models
- [Frontend](.bmad/standards/frontend/) - Components, CSS, accessibility
- [State Management](.bmad/standards/state-management/) - {State library patterns}
- [Testing](.bmad/standards/testing/) - Test writing, coverage
- [Tooling](.bmad/standards/tooling/) - {Tool-specific configs}
```

**8.2 Testing Instructions** (30-40 lines):

**Detect test framework:**
- JavaScript/TypeScript: Jest, Vitest, Mocha
- Python: pytest, unittest
- Rust: cargo test, rstest

**Format:**
```markdown
### Testing Instructions

**Run Tests**:
```bash
{test_command}              # Run all tests
{test_watch_command}        # Watch mode
{test_coverage_command}     # Coverage report
```

**Test Location**:
- Unit tests: {path}
- Integration tests: {path}
- E2E tests: {path}

**Coverage Requirements**:
- Critical paths: 80% minimum
- Business logic: 90% minimum
- UI components: 70% minimum

**See**: .bmad/standards/testing/test-writing.md
```

**8.3 Developer Environment Setup** (25-35 lines):

**Detect dependencies:**
- Node.js version (from package.json engines)
- Python version (from pyproject.toml)
- Rust version (from rust-toolchain.toml)

**Format:**
```markdown
### Developer Environment Setup

**Prerequisites**:
- {Runtime} {version}+ (use {version manager})
- {Package manager} {version}+
- {Database} {version}+ (local or Docker)

**Setup Steps**:
```bash
{install_command}           # Install dependencies
cp .env.example .env        # Configure environment
{db_setup_command}          # Initialize database
{dev_command}               # Start dev server
```

**Environment Variables**:
- `{VAR_NAME}`: {description}
... (list key env vars)

**Common Issues**:
- {Issue} → {Solution}
```

**8.4 Repository Etiquette** (25-35 lines):

```markdown
### Repository Etiquette

**Branch Naming**:
- Feature: `feature/short-description`
- Bug: `fix/issue-number-description`
- Hotfix: `hotfix/critical-issue`

**Commit Messages**:
```
type(scope): Brief description

Longer explanation if needed

Fixes #123
```

**PR Process**:
1. Create feature branch
2. Make changes, commit frequently
3. Update tests
4. Run tests and build
5. Create PR with description
6. Address review comments
7. Squash and merge

**Merge Policy**: {Squash/Merge/Rebase} (specify based on project)
```

**8.5 Critical Notes/Guardrails** (40-50 lines):

```markdown
### Critical Notes/Guardrails

<system_context>
**Security**:
- DON'T store secrets in code
  - INSTEAD: Use environment variables
  - REASON: Prevents credential leaks in version control

- DON'T trust client input
  - INSTEAD: Validate all inputs with {validation library}
  - REASON: Prevents injection attacks and data corruption

**Performance**:
- {Framework-specific performance rules}

**Data Integrity**:
- DON'T modify database directly in production
  - INSTEAD: Use migrations
  - REASON: Maintains schema consistency and rollback capability

- DON'T delete data without soft-delete
  - INSTEAD: Add `deleted_at` timestamp
  - REASON: Data recovery and audit trail
</system_context>
```

### 9. Generate Workflow & Troubleshooting (80-100 lines)

**9.1 Common Tasks** (50-60 lines):

**Identify 5-8 most frequent operations** based on framework:
- Add new component/module
- Add new API endpoint
- Add new database model
- Run tests
- Deploy
- Add dependency

**Format** (step-by-step for each):
```markdown
### Common Tasks

#### {Task Name}
```bash
# 1. {Step description}
{command}

# 2. {Step description}
{command}

# 3. {Step description}
# See .bmad/standards/{category}/{file}.md for pattern

# 4. Update this file map
# Automated by dev-story workflow
```

... (5-8 tasks total)
```

**9.2 Unexpected Behaviors** (15-25 lines):

**Framework-specific common issues:**
- Hot reload issues
- Build errors
- Type errors
- Hydration mismatches (React)
- Import errors

**Format:**
```markdown
### Unexpected Behaviors

**{Issue Name}**:
- {Symptom description}
- {Workaround/solution}
- {Additional context}
```

**9.3 References** (15-20 lines):

```markdown
### References

**Detailed Standards**: .bmad/standards/
**Architecture Docs**: {path if exists}
**API Docs**: {path if exists}
**Contributing**: {path if exists}
**Troubleshooting**: .bmad/standards/troubleshooting.md
```

### 10. Generate Technical Context (20-40 lines)

```markdown
## Technical Context

### Tech Stack
{From Step 7.2}

### Key Dependencies
**Critical packages:**
- {package-1} ({version}) - {purpose}
- {package-2} ({version}) - {purpose}
... (5-8 most important)

**Version constraints:**
- {constraint description if any}

### Important Patterns
- **Architecture**: {MVC, Layered, Microservices, etc.}
- **State Management**: {Zustand, Redux, Context, etc.}
- **Data Fetching**: {TanStack Query, SWR, fetch, etc.}
- **Styling**: {Tailwind, CSS Modules, styled-components, etc.}
```

### 11. Assemble Root CLAUDE.md

**Combine all sections** in order:

```markdown
# {Project Name}

Generated: {ISO date} | Profile: {profile} ({default + specific}) | Auto-maintained by BMAD workflows

## Core Context & Purpose
{Section from Step 7}

## Guidelines & Constraints
{Section from Step 8}

## Workflow & Troubleshooting
{Section from Step 9}

## Technical Context
{Section from Step 10}

---

**Maintenance**: This file is auto-updated by BMAD workflows when files are created.
**Manual Updates**: Feel free to customize project-specific sections.
**Size Limit**: 420 lines max. If exceeded, content moved to .bmad/standards/.
```

**Count lines:**
```python
line_count = len(assembled_content.split('\n'))
```

**If > 420 lines:**
- Compress descriptions (remove articles, abbreviate)
- Move less critical content to .bmad/standards/
- Link to moved content

### 12. Create Subfolder CLAUDE.md Files

**For each directory with > 30 files:**

**12.1 Generate File Map** (150-170 lines):

Read all files in directory:
```python
for file in sorted(directory_files):
    description = extract_file_description(file)
    file_map += f"- **{file}** - {description}\n"
```

**Extract description** (priority order):
1. First JSDoc/docstring comment
2. Export statement (function/class name)
3. Filename inference

**Format:**
```markdown
## File Map

- **ComponentA.tsx** - Primary component for feature X with error handling
- **ComponentB.tsx** - Secondary component for feature Y
- **helpers.ts** - Utility functions for data transformation
- **types.ts** - TypeScript type definitions for this module
- **constants.ts** - Module-specific constants and configuration
... (alphabetically sorted, all files in directory)
```

**12.2 Generate Local Context** (30-50 lines):

```markdown
## Module Overview

**Purpose**: {What this directory/module does}

**Dependencies**:
- Internal: {other modules this depends on}
- External: {key libraries used}

## Local Context & Patterns

### Key Functions/Classes

**{ComponentA}** ({file}:{line}):
- {Description of what it does}
- {Key parameters/props}
- Used in: {locations}

... (3-5 key functions/classes)

### Common Patterns

**{Pattern Category}**:
- {Pattern description}
- See: .bmad/standards/{category}/{file}.md

... (2-3 pattern categories)

### Related Modules

- **{module path}**: {how it relates}
... (3-5 related modules)

---

**Last Updated**: {ISO date}
**Files**: {file count}
```

**12.3 Assemble Subfolder CLAUDE.md:**

```markdown
# {Directory Name} - {Purpose}

{Module Overview from 12.2}

{File Map from 12.1}

{Local Context from 12.2}
```

**Verify ≤ 200 lines:**
- If exceeded, compress descriptions
- Remove articles, abbreviate
- Reduce to 3-5 words per file

**Write to:** `{directory}/CLAUDE.md`

### 13. Validation & Enforcement

**13.1 Verify Line Counts:**
```python
root_lines = count_lines(root_claude_md)
assert root_lines <= 420, f"Root CLAUDE.md exceeds 420 lines ({root_lines})"

for subfolder_claude in subfolder_claudes:
    lines = count_lines(subfolder_claude)
    assert lines <= 200, f"{subfolder_claude} exceeds 200 lines ({lines})"
```

**13.2 Verify Completeness:**
- All required sections present
- Links to .bmad/standards/ valid
- No broken references
- Proper markdown formatting
- AI-friendly tags present (<system_context>, <critical_notes>)

**13.3 Verify Profile Inheritance:**
```bash
# Check default profile copied
test -d {output_folder}/.bmad/standards/global
test -f {output_folder}/.bmad/standards/global/coding-style.md

# Check specific profile overlaid (if not default)
if [ "$profile" != "default" ]; then
    # Verify specific profile files present
    test -f {output_folder}/.bmad/standards/tooling/{tool}.md
fi
```

### 14. Write Files

**Write root CLAUDE.md:**
```python
write_file(f"{output_folder}/CLAUDE.md", root_claude_md_content)
```

**Write subfolder CLAUDE.md files:**
```python
for directory, content in subfolder_claudes.items():
    write_file(f"{directory}/CLAUDE.md", content)
```

**Verify files written:**
```bash
test -f {output_folder}/CLAUDE.md
test -d {output_folder}/.bmad/standards
```

### 15. Report Results

```
✅ CLAUDE.md Generated Successfully

Root: {output_folder}/CLAUDE.md ({line_count} lines)

Standards Directory: .bmad/standards/
  - Base standards: default profile
  - Extended by: {profile} profile
  - Total standard files: {file_count}
  - Categories: {list categories}

Subfolder Maps: {count} created
  - {directory}/CLAUDE.md ({line_count} lines)
  - {directory}/CLAUDE.md ({line_count} lines)
  ...

Project Statistics:
  - Total files scanned: {count}
  - Major directories: {count}
  - Core files identified: {count}

Next Steps:
  1. Review CLAUDE.md and customize project-specific sections
  2. Add project-specific guardrails to Critical Notes section
  3. Update Common Tasks with your specific workflows
  4. CLAUDE.md will auto-update as files are created

Note: Commit CLAUDE.md and .bmad/standards/ to version control.
```

## Key Constraints

- **Profile inheritance**: ALWAYS copy default profile first, then specific profile
- **Size limits**: Root ≤420 lines (strict), subfolder ≤200 lines (strict)
- **Living document**: Will be updated by other workflows (update-claude-md)
- **AI-optimized**: Use semantic tags, structured sections
- **Framework detection**: Accurate detection critical for correct profile selection
- **Standards completeness**: All profile standards must be copied (merged)
- **File map accuracy**: Descriptions must be meaningful and concise
- **Critical rules**: Extract truly critical rules, not just any rules

## Auto-Continue

**NO auto-continue** - This workflow completes independently.

User should review and customize generated CLAUDE.md before proceeding with development.

## Notes

- **One-time generation**: Typically run once per project during initialization
- **Regeneration supported**: Can regenerate if CLAUDE.md deleted (uses PRD if available)
- **Profile inheritance is key**: Default profile provides base, specific profile extends/overrides
- **File map is primary**: Most valuable for AI navigation (60-70% of root CLAUDE.md)
- **Standards are secondary**: Top critical rules inline, full details in .bmad/standards/
- **Living documentation**: Other workflows will update file map automatically
- **Version control**: CLAUDE.md and .bmad/standards/ should be committed
- **Customization encouraged**: Users can add project-specific sections

**Philosophy**: CLAUDE.md is the "README for AI agents" - provides complete context for effective autonomous work. Combines navigation (file map), standards (critical rules), and operations (common tasks) in single, size-constrained file.

---

**References:**
- Examples: [examples/generate-claude-md-examples.md](../examples/generate-claude-md-examples.md)
- Common Operations: [shared/common-operations.md](../shared/common-operations.md)
- Prerequisites: [shared/prerequisites.md](../shared/prerequisites.md)
- Update Workflow: [meta/update-claude-md.md](update-claude-md.md)
