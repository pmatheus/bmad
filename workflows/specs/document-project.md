---
description: Analyzes and documents brownfield projects by scanning codebase, architecture, and patterns to create comprehensive reference documentation for AI-assisted development
---

# Document Project Workflow

## Purpose

This workflow performs intelligent project documentation with three modes for analyzing brownfield codebases to create comprehensive documentation for AI-assisted development:

- **Initial Scan**: First-time documentation of a project
- **Full Rescan**: Update existing documentation with latest changes
- **Deep-Dive**: Exhaustive analysis of specific features/modules/folders

The workflow automatically detects project type (web, mobile, backend, CLI, library, etc.), repository structure (monolith, monorepo, multi-part), and generates tailored documentation based on project-specific requirements.

## Variables

- `{documentation_dir}` - Directory where documentation is stored (default: `.bmad/output`)
- `{project_root}` - Root directory of the project being documented
- `workflow_mode` - Current workflow mode: `initial_scan`, `full_rescan`, or `deep_dive`
- `scan_level` - Depth of analysis: `quick` (2-5 min), `deep` (10-30 min), or `exhaustive` (30-120 min)
- `target_name` - Human-readable name for deep-dive target
- `target_path` - Absolute path to deep-dive target
- `target_type` - Type of deep-dive target: `folder`, `file`, `feature`, `api_group`, or `component_group`
- `current_step` - Current step in workflow execution for resumability
- `completed_steps` - Array of completed step IDs for resumability

## Instructions

### Prerequisites

- BMAD plugin installed and configured
- `workflow-init` has been run (optional - workflow can run standalone)
- Target project exists and is accessible

### Step 1: Check Existing State

If resuming an in-progress scan, read the state file to check for existing work:

```bash
cat {documentation_dir}/project-scan-report.json
```

The state file contains workflow mode, scan level, completed steps, current position, project type classification (cached for resume), and timestamps.

Use AskUserQuestion to prompt:

```yaml
questions:
  - question: "I found an in-progress workflow from [TIMESTAMP]. Current progress: [MODE] scan at [SCAN_LEVEL], completed [X/Y] steps. Would you like to resume, start fresh, or cancel?"
    header: "Resume"
    multiSelect: false
    options:
      - label: "Resume from where we left off"
        description: "Continue from the last completed step"
      - label: "Start fresh"
        description: "Archive old state and begin new scan"
      - label: "Cancel"
        description: "Exit without changes"
```

If resuming: Load cached project type(s) from state file, continue from `current_step`, skip project detection.

If starting fresh: Archive old state to `{documentation_dir}/.archive/project-scan-report-[timestamp].json`, proceed to Step 2.

### Step 2: Validate Workflow Status (Optional)

If workflow tracking exists, read `.bmad/workflow-status.yaml` to extract `field_type`, `current_phase`, and `project_level`.

If greenfield project detected, use AskUserQuestion:

```yaml
questions:
  - question: "This is a greenfield project. Documentation workflow is typically for brownfield projects. Continue anyway to document planning artifacts?"
    header: "Greenfield"
    multiSelect: false
    options:
      - label: "Yes, continue"
        description: "Document planning artifacts and structure"
      - label: "No, cancel"
        description: "Exit workflow"
```

If brownfield, validate that workflow typically runs after `product-brief` or `prd`.

### Step 3: Check for Existing Documentation

Check if documentation already exists:

```bash
ls -la {documentation_dir}/index.md
```

If `index.md` exists, read the file to extract metadata (generation date, project structure, parts count).

Use AskUserQuestion:

```yaml
questions:
  - question: "I found existing documentation generated on [DATE]. What would you like to do?"
    header: "Existing Docs"
    multiSelect: false
    options:
      - label: "Re-scan entire project"
        description: "Update all documentation with latest changes"
      - label: "Deep-dive into specific area"
        description: "Exhaustive analysis of a feature/module/folder"
      - label: "Cancel"
        description: "Keep existing documentation as-is"
```

Action based on selection:
- **Re-scan entire project**: Set `workflow_mode = "full_rescan"`, proceed to Step 4
- **Deep-dive into specific area**: Set `workflow_mode = "deep_dive"`, set `scan_level = "exhaustive"`, skip to Step 6
- **Cancel**: Exit workflow

If `index.md` does NOT exist: Set `workflow_mode = "initial_scan"`, proceed to Step 4.

### Step 4: Select Scan Depth Level

Only for initial_scan or full_rescan modes (skip for deep_dive).

Use AskUserQuestion:

```yaml
questions:
  - question: "Choose your scan depth level:"
    header: "Scan Level"
    multiSelect: false
    options:
      - label: "Quick Scan (2-5 minutes) [DEFAULT]"
        description: "Pattern-based analysis without reading source files. Scans configs, manifests, directory structure. Best for quick overview."
      - label: "Deep Scan (10-30 minutes)"
        description: "Reads files in critical directories based on project type. Best for comprehensive brownfield PRD documentation."
      - label: "Exhaustive Scan (30-120 minutes)"
        description: "Reads ALL source files in project. Best for complete analysis, migration planning, detailed audit."
```

Map selection to scan level:
- Option 1 → `scan_level = "quick"`
- Option 2 → `scan_level = "deep"`
- Option 3 → `scan_level = "exhaustive"`

Initialize state file at `{documentation_dir}/project-scan-report.json` with workflow version, timestamps, mode, scan level, project root, documentation directory, completed steps (empty), current step ("detect_project_structure"), findings (empty), outputs generated, and resume instructions.

### Step 5: Full Scan Mode (Initial or Rescan)

Delegate to Technical Writer agent for complete project scan.

#### 5.1 Detect Project Structure and Type

Ask user for project root using AskUserQuestion (current directory or specify path).

Scan the project root for key indicators using Glob and Read tools to detect directory structure, key files (package.json, go.mod, requirements.txt, Cargo.toml), and technology markers.

Determine repository architecture:
- **Monolith**: Single cohesive codebase
- **Monorepo**: Multiple packages/apps
- **Multi-part**: Separate client/server folders

If multi-part or monorepo detected, list detected parts and confirm with user.

Detect project type for each part by matching against 12 supported project types (web, mobile, backend, cli, library, desktop, game, data, extension, infra, embedded) using file patterns and critical directories.

Create classification for each part with part name, root path, project type ID, technologies, and package manager.

Confirm classification with user and update state file.

#### 5.2 Scan Dependencies and Tech Stack

For each part, extract dependencies from package manifests (package.json, requirements.txt, go.mod, Cargo.toml, pom.xml, build.gradle).

Categorize dependencies into core framework, UI libraries, state management, testing, build tools, and utilities.

Identify development setup including Node version, package manager, TypeScript configuration, linting/formatting, and CI/CD.

Update state file with findings.

#### 5.3 Scan Directory Structure

Use Glob tool to map directory tree (excluding node_modules, dist, build, coverage, .git).

For each directory, determine purpose using naming conventions and contents. Generate directory tree with descriptions including file count and 1-sentence purpose description for each directory at depth ≤ 3.

Update state file.

#### 5.4 Scan Configuration Files

Read and document all config files based on scan level:
- **Quick Scan**: Read only key configs
- **Deep Scan**: Read all configs in critical directories
- **Exhaustive Scan**: Read ALL config files

Extract configuration insights including build configuration, TypeScript options, testing setup, linting rules, environment variables, database configuration, API endpoints, and feature flags.

Document unusual or notable configurations. Update state file.

#### 5.5 Identify Critical Files

Based on project type, locate critical files:
- **Web**: Entry point, app root, router config, API client
- **Backend**: Entry point, route definitions, database models, middleware
- **Mobile**: Entry point, navigation, screens, native modules

For each critical file, note its role, extract key exports, and identify dependencies. Update state file.

#### 5.6 Scan Based on Scan Level

**QUICK SCAN**: Read only configs, manifests, README, key files. Do NOT read source files. Generate documentation from patterns and file metadata.

**DEEP SCAN**: Read files in critical directories based on project type. Extract exports, imports, function signatures, component props.

**EXHAUSTIVE SCAN**: Read ALL source files. For EACH file extract purpose, all exports with signatures, all imports, key implementation details, side effects, error handling patterns, and TODOs/FIXMEs. Build complete file inventory.

Use Read tool extensively. Update state file after each batch.

#### 5.7 Extract API Endpoints (if applicable)

If project has API routes, search for route definitions using Grep for common patterns (Express, FastAPI, Go, Django).

For each endpoint, document HTTP method, route path, handler function name, request parameters, response schema, authentication requirements, and middleware applied.

Group endpoints by resource or feature. Update state file.

#### 5.8 Extract Data Models (if applicable)

If project uses data models, search for model definitions using Grep for common patterns (TypeScript/JavaScript, Python, Go, Prisma/TypeORM).

For each model, document model name, fields/properties with types, relationships, constraints, and validation rules.

Update state file.

#### 5.9 Extract UI Components (if applicable)

If project has UI components, find component files using Glob for React/Vue/Svelte patterns.

For each component, document component name, props interface, hooks used, child components rendered, and state management approach.

Categorize components into pages/routes, layouts, features, UI, and forms. Update state file.

#### 5.10 Identify Testing Strategy

Scan test files using Glob. Analyze testing approach including unit tests, integration tests, E2E tests, test frameworks, coverage setup, and testing utilities.

Calculate metrics (total test files, test-to-source ratio, coverage percentage).

Identify gaps such as untested critical files, missing E2E tests, and low coverage areas. Update state file.

#### 5.11 Generate Documentation Files

Delegate to Technical Writer agent using Task tool with `subagent_type: bmad-tech-writer`.

Provide prompt to generate comprehensive documentation including:
1. `index.md` - Master documentation index
2. `project-overview.md` - High-level architecture and tech stack
3. `source-tree.md` - Annotated directory tree
4. `api-endpoints.md` - Complete API documentation (if applicable)
5. `data-models.md` - Database schema and model documentation (if applicable)
6. `ui-components.md` - Component inventory with props and usage (if applicable)
7. `testing-strategy.md` - Testing approach, coverage, gaps

Provide all collected data from steps 5.1-5.10. Reference templates in `.bmad-conversion/reference-templates/project-documentation/`.

Technical Writer will create all documentation files using CommonMark, generate Mermaid diagrams, ensure proper linking, and add metadata headers.

#### 5.12 Finalize and Update Status

Update state file with completion including all completed steps, current step ("complete"), timestamps (started, last_updated, completed), and outputs generated.

If workflow tracking exists, invoke workflow-status to update with mode: update, action: complete_workflow, workflow_name: document-project.

Display completion message with documentation generated, project classification, next steps, and generated files list.

### Step 6: Deep-Dive Mode (Detailed Feature Analysis)

For exhaustive analysis of specific areas (features, modules, folders). Only used when user explicitly requests deep-dive, existing documentation exists, or comprehensive understanding of specific part is needed.

#### 6.1 Load Existing Documentation Context

Read existing documentation files (index.md, project-overview.md, source-tree.md) to extract project structure and understand available areas.

#### 6.2 Identify Area for Deep-Dive

Analyze project structure and suggest deep-dive options based on project type and structure (API routes, feature modules, UI component groups, service modules, etc.).

Use AskUserQuestion to get target with suggested areas or custom folder/file path option.

Parse user input to determine `target_type`, `target_path`, `target_name`, and `target_scope`.

Confirm with user including estimated files to analyze.

#### 6.3 Exhaustive Scan of Target Area

This is the most detailed scan possible. EVERY file must be read completely.

For each target type (folder, file, api_group, feature, component_group), perform comprehensive scan:
- Get complete file list
- Filter out build artifacts
- For EVERY file: read complete contents, extract ALL exports and imports, identify purpose, write detailed descriptions, extract function signatures, note TODOs/FIXMEs, identify patterns, capture purpose/exports/imports/key_details/side_effects/error_handling/testing

Create comprehensive file inventory with detailed documentation for each file including purpose, LOC, exports with descriptions, imports/dependencies, used by list, key implementation details, state management, side effects, error handling, testing, and comments/TODOs.

#### 6.4 Analyze Relationships and Data Flow

Build dependency graph with files as nodes and edges for import relationships. Identify circular dependencies, entry points, and leaf nodes.

Trace data flow following function calls, tracking API calls, documenting state updates, and mapping database queries.

Identify integration points including external APIs, internal services, shared state, events, and database tables.

Generate Mermaid diagrams using Technical Writer for dependency graph, data flow diagram, component hierarchy, and API call flow.

#### 6.5 Find Related Code and Reuse Opportunities

Search codebase outside scanned area for similar patterns, function signatures, component structures, API patterns, and reusable utilities.

Identify code reuse opportunities including shared utilities, design patterns, component libraries, and helper functions.

Find reference implementations including similar features, established patterns, and testing approaches.

#### 6.6 Generate Deep-Dive Documentation

Delegate to Technical Writer agent using Task tool.

Create comprehensive deep-dive documentation for target including:
1. Overview and Purpose
2. Complete File Inventory
3. Dependency Graph (Mermaid)
4. Data Flow Analysis (Mermaid)
5. Integration Points
6. Related Code References
7. Reuse Opportunities
8. Implementation Guidance
9. Testing Recommendations
10. Future Enhancements

Output file: `{documentation_dir}/deep-dive-[sanitized_target_name].md`

Update state file with deep_dive_targets array including target_name, target_path, files_analyzed, output_file, and timestamp.

#### 6.7 Update Master Index

Read existing `index.md`. Check if "Deep-Dive Documentation" section exists. If not, add section.

Add link to new deep-dive doc with target name, description, file count, LOC, and generation date.

Update index metadata with last updated date and deep-dives count. Save updated `index.md`.

#### 6.8 Offer to Continue or Complete

Display summary of deep-dive completion including generated file path, files analyzed, lines of code scanned, time taken, documentation contents, and index update.

Ask if user wants to continue with AskUserQuestion offering "Deep-dive another area" or "Finish" options.

If continuing, clear current deep_dive_target and go back to Step 6.2.

If finishing, display final completion message, update workflow status, and exit workflow.

## Workflow

### Execution Flow

The workflow follows this execution sequence:

```
START
  |
  v
[1] Check Existing State
  |-- State file exists? --> Ask: Resume / Start Fresh / Cancel
  |     |-- Resume --> Load cached data, skip to saved step
  |     |-- Start Fresh --> Archive old state, continue
  |     |-- Cancel --> EXIT
  |
  v
[2] Validate Workflow Status (Optional)
  |-- Workflow tracking exists?
  |     |-- Greenfield? --> Ask: Continue / Cancel
  |     |-- Brownfield --> Validate sequencing
  |
  v
[3] Check for Existing Documentation
  |-- index.md exists?
  |     |-- YES --> Ask: Re-scan / Deep-dive / Cancel
  |     |     |-- Re-scan --> workflow_mode = "full_rescan"
  |     |     |-- Deep-dive --> workflow_mode = "deep_dive" --> Go to [6]
  |     |     |-- Cancel --> EXIT
  |     |-- NO --> workflow_mode = "initial_scan"
  |
  v
[4] Select Scan Depth Level
  |-- Ask: Quick / Deep / Exhaustive
  |-- Initialize state file
  |
  v
[5] Full Scan Mode
  |
  |-- [5.1] Detect Project Structure and Type
  |     |-- Scan directory structure and key files
  |     |-- Determine repository architecture
  |     |-- Classify project type(s)
  |     |-- Confirm with user
  |     |-- Update state file
  |
  |-- [5.2] Scan Dependencies and Tech Stack
  |     |-- Extract dependencies from manifests
  |     |-- Categorize dependencies
  |     |-- Identify development setup
  |     |-- Update state file
  |
  |-- [5.3] Scan Directory Structure
  |     |-- Map directory tree
  |     |-- Determine directory purposes
  |     |-- Generate annotated tree
  |     |-- Update state file
  |
  |-- [5.4] Scan Configuration Files
  |     |-- Read configs based on scan level
  |     |-- Extract configuration insights
  |     |-- Document notable configs
  |     |-- Update state file
  |
  |-- [5.5] Identify Critical Files
  |     |-- Locate critical files by project type
  |     |-- Extract key exports and dependencies
  |     |-- Update state file
  |
  |-- [5.6] Scan Based on Scan Level
  |     |-- Quick: Pattern-based, no source reading
  |     |-- Deep: Read critical directories
  |     |-- Exhaustive: Read ALL source files
  |     |-- Update state file after each batch
  |
  |-- [5.7] Extract API Endpoints (if applicable)
  |     |-- Search for route definitions
  |     |-- Document each endpoint
  |     |-- Group by resource/feature
  |     |-- Update state file
  |
  |-- [5.8] Extract Data Models (if applicable)
  |     |-- Search for model definitions
  |     |-- Document each model
  |     |-- Update state file
  |
  |-- [5.9] Extract UI Components (if applicable)
  |     |-- Find component files
  |     |-- Document each component
  |     |-- Categorize components
  |     |-- Update state file
  |
  |-- [5.10] Identify Testing Strategy
  |     |-- Scan test files
  |     |-- Analyze testing approach
  |     |-- Calculate metrics
  |     |-- Identify gaps
  |     |-- Update state file
  |
  |-- [5.11] Generate Documentation Files
  |     |-- Delegate to Technical Writer agent
  |     |-- Create 7 documentation files
  |     |-- Generate Mermaid diagrams
  |
  |-- [5.12] Finalize and Update Status
  |     |-- Update state file with completion
  |     |-- Update workflow status (if tracking exists)
  |     |-- Display completion message
  |
  v
EXIT

---

[6] Deep-Dive Mode (Separate Flow)
  |
  |-- [6.1] Load Existing Documentation Context
  |     |-- Read existing docs
  |     |-- Extract project structure
  |
  |-- [6.2] Identify Area for Deep-Dive
  |     |-- Suggest deep-dive options
  |     |-- Ask user for target
  |     |-- Parse and confirm target
  |
  |-- [6.3] Exhaustive Scan of Target Area
  |     |-- Get complete file list
  |     |-- Read EVERY file completely
  |     |-- Extract comprehensive details
  |     |-- Create file inventory
  |
  |-- [6.4] Analyze Relationships and Data Flow
  |     |-- Build dependency graph
  |     |-- Trace data flow
  |     |-- Identify integration points
  |     |-- Generate diagrams
  |
  |-- [6.5] Find Related Code and Reuse Opportunities
  |     |-- Search for similar patterns
  |     |-- Identify reuse opportunities
  |     |-- Find reference implementations
  |
  |-- [6.6] Generate Deep-Dive Documentation
  |     |-- Delegate to Technical Writer
  |     |-- Create comprehensive deep-dive doc
  |     |-- Update state file
  |
  |-- [6.7] Update Master Index
  |     |-- Read existing index.md
  |     |-- Add deep-dive section if needed
  |     |-- Add link to new deep-dive doc
  |     |-- Save updated index
  |
  |-- [6.8] Offer to Continue or Complete
  |     |-- Display summary
  |     |-- Ask: Continue / Finish
  |     |-- Continue --> Go to [6.2]
  |     |-- Finish --> EXIT
```

### State Management and Resumability

The workflow is fully resumable at any point using the state file at `{documentation_dir}/project-scan-report.json`.

The state file tracks:
- Workflow version, timestamps (started, last_updated, completed)
- Mode (initial_scan, full_rescan, deep_dive)
- Scan level (quick, deep, exhaustive)
- Project root and documentation directory
- Completed steps and current step
- Project classification (cached)
- Findings (accumulated data)
- Deep-dive targets
- Outputs generated
- Resume instructions

When resuming, load state file, extract current step and completed steps, load cached project classification, continue from current step, and use findings to avoid re-scanning.

Critical: Update state file after EVERY major step.

### Project Type Detection

The workflow uses pattern matching to detect 12 project types, each with specific documentation requirements:

1. **web** - Web applications (React, Vue, Angular, Next.js)
2. **mobile** - Mobile apps (React Native, Flutter, native)
3. **backend** - Backend services (Express, FastAPI, Go)
4. **cli** - Command-line tools
5. **library** - Libraries and packages
6. **desktop** - Desktop applications (Electron, WPF, Qt)
7. **game** - Game projects (Unity, Godot, Phaser)
8. **data** - Data science / ML projects (Jupyter, pandas)
9. **extension** - Browser/IDE extensions
10. **infra** - Infrastructure as code (Terraform, K8s)
11. **embedded** - Embedded systems (Arduino, PlatformIO)

Each type has key file patterns, critical directories, and determines whether API scan, data models, or UI components documentation is required.

### Performance Characteristics

- **Quick Scan**: 2-5 minutes (pattern-based, no source reading)
- **Deep Scan**: 10-30 minutes (selective file reading based on project type)
- **Exhaustive Scan**: 30-120 minutes (reads all source files)
- **Deep-Dive**: 15-60 minutes per area (exhaustive analysis of specific section)

### Integration with Other Workflows

Typical flow for brownfield projects:
1. `workflow-init` - Initialize project tracking
2. `document-project` - Document existing codebase (Deep or Exhaustive scan)
3. `product-brief` - Define product vision using documentation
4. `prd` - Create PRD referencing brownfield documentation
5. `architecture` - Design architecture changes
6. `create-epics-and-stories` - Break down into stories
7. `dev-story` - Implement changes

Deep-dive usage: After initial documentation, use deep-dive mode to understand specific features before enhancement, document complex modules for onboarding, or analyze integration points before refactoring.

### Technical Writer Agent Role

The Technical Writer agent (`bmad-tech-writer`) is heavily used for:
- Generating well-structured markdown documentation
- Creating Mermaid diagrams (architecture, flow, dependencies)
- Writing clear, concise descriptions
- Formatting tables and code examples
- Ensuring consistent documentation style
- Adding proper metadata and timestamps

Delegate all documentation generation to this specialized agent.

## Report

### Completion Report Format

At workflow completion, provide a comprehensive report with the following structure:

**For Full Scan Mode (Initial/Rescan):**

```markdown
## Document Project Workflow Complete!

### Documentation Generated

- **Mode**: [initial_scan / full_rescan]
- **Scan Level**: [quick / deep / exhaustive]
- **Output Directory**: `{documentation_dir}/`
- **Time Elapsed**: ~[duration]

### Project Classification

- **Repository Type**: [monolith / monorepo / multi-part]
- **Project Type(s)**: [web / backend / mobile / etc.]
- **Parts Documented**: [count]
- **Technologies Detected**: [list of main technologies]

### Generated Files

1. **`index.md`** - Master documentation index linking all generated docs
2. **`project-overview.md`** - High-level architecture, tech stack ([X] pages)
3. **`source-tree.md`** - Annotated directory tree ([X] directories documented)
4. **`api-endpoints.md`** - Complete API documentation ([X] endpoints) [if applicable]
5. **`data-models.md`** - Database schema and models ([X] models) [if applicable]
6. **`ui-components.md`** - Component inventory ([X] components) [if applicable]
7. **`testing-strategy.md`** - Testing approach, coverage ([X]% coverage)
8. **`project-scan-report.json`** - State file for resumability

### Key Findings

- **Total Source Files Analyzed**: [count]
- **Lines of Code Scanned**: [total LOC]
- **Dependencies**: [count] production, [count] development
- **Test Files**: [count] ([X]% test-to-source ratio)
- **Coverage**: [X]% (if available)

### Next Steps

- Review generated documentation in `{documentation_dir}/`
- Use for brownfield PRD creation with `prd` workflow
- Reference during architecture and implementation phases
- Create deep-dive documentation for complex areas if needed

---

*Documentation generated by BMAD Method v2.0*
*Timestamp: [ISO_TIMESTAMP]*
```

**For Deep-Dive Mode:**

```markdown
## Deep-Dive Documentation Complete!

### Target Analysis

- **Target Name**: [target_name]
- **Target Type**: [folder / file / feature / api_group / component_group]
- **Target Path**: `[target_path]`
- **Files Analyzed**: [file_count]
- **Lines of Code Scanned**: [total_loc]
- **Time Elapsed**: ~[duration]

### Generated Documentation

**File**: `{documentation_dir}/deep-dive-[sanitized_target_name].md`

**Sections Included**:
1. Overview and Purpose
2. Complete File Inventory ([X] files with full details)
3. Dependency Graph (Mermaid diagram)
4. Data Flow Analysis (Mermaid diagram)
5. Integration Points ([X] external integrations, [X] internal services)
6. Related Code References ([X] similar patterns found)
7. Reuse Opportunities ([X] reusable components/utilities identified)
8. Implementation Guidance (risks, gotchas, verification steps)
9. Testing Recommendations (current: [X]% coverage)
10. Future Enhancements ([X] TODOs/FIXMEs documented)

### Key Insights

- **Entry Points**: [list of entry files]
- **Core Dependencies**: [list of key dependencies]
- **External APIs**: [list of external services]
- **State Management**: [approach used]
- **Testing Status**: [X] test files, [X]% coverage

### Index Updated

Master index at `{documentation_dir}/index.md` now includes link to this deep-dive under "Deep-Dive Documentation" section.

### Continue?

[Present AskUserQuestion for continuing with another area or finishing]

---

*Documentation generated by BMAD Method v2.0*
*Timestamp: [ISO_TIMESTAMP]*
```

### Progress Updates

During execution, provide periodic progress updates:

```markdown
### Step [X] of [Y]: [Step Name]

**Status**: In Progress
**Current Action**: [Specific action being performed]
**Files Processed**: [count] / [total]
**Elapsed Time**: ~[duration]

[Brief description of what's being done]
```

### Error Reporting

If errors occur during workflow execution:

```markdown
### Error Encountered

**Step**: [step_name]
**Error**: [error_message]
**Impact**: [description of impact]

**State Saved**: The workflow state has been saved to `{documentation_dir}/project-scan-report.json`

**Recovery Options**:
1. Resume from this point after addressing the error
2. Skip this step and continue (if non-critical)
3. Cancel workflow and review logs

**Recommendation**: [suggested action]
```

### Resumption Report

When resuming from saved state:

```markdown
### Resuming Document Project Workflow

**Original Start**: [original_timestamp]
**Interrupted At**: [interrupted_timestamp]
**Resuming At**: [current_timestamp]
**Time Since Interruption**: [duration]

**Progress Saved**:
- Mode: [workflow_mode]
- Scan Level: [scan_level]
- Completed Steps: [X] / [Y]
- Current Step: [current_step_name]

**Cached Data Loaded**:
- Project classification: [summary]
- Dependencies: [count] loaded
- Directory structure: [count] directories mapped
- [Other cached findings]

**Continuing from**: [current_step_name]
**Remaining Steps**: [Y-X]
**Estimated Time to Complete**: ~[duration]
```

---

## Notes

### Best Practices

**When to use Quick Scan:**
- Initial project exploration
- Quick overview for unfamiliar codebase
- Time-constrained situations

**When to use Deep Scan:**
- Creating brownfield PRD
- Comprehensive understanding needed
- Planning major refactor or migration

**When to use Exhaustive Scan:**
- Complete audit required
- Migration planning (framework upgrade, language port)
- Security review
- Documentation for long-term maintenance

**When to use Deep-Dive:**
- Understanding complex feature implementation
- Planning feature enhancement
- Debugging intricate issues
- Onboarding to specific module

### Output Files Structure

```
{documentation_dir}/
├── index.md                          # Master index (ALWAYS generated)
├── project-overview.md               # High-level architecture
├── source-tree.md                    # Annotated directory tree
├── api-endpoints.md                  # API documentation (if applicable)
├── data-models.md                    # Data model schemas (if applicable)
├── ui-components.md                  # Component inventory (if applicable)
├── testing-strategy.md               # Testing approach and coverage
├── deep-dive-{area-name}.md          # Deep-dive docs (if created)
├── project-scan-report.json          # State file for resumability
└── .archive/                         # Archived old state files
    └── project-scan-report-{timestamp}.json
```

---

**This workflow is the foundation for brownfield project understanding in BMAD Method.**
