---
description: Analyzes and documents brownfield projects by scanning codebase, architecture, and patterns to create comprehensive reference documentation for AI-assisted development
---

# Document Project Workflow

**Analyzes brownfield codebases to create comprehensive documentation for AI-assisted development.**

This workflow performs intelligent project documentation with three modes:
- **Initial Scan**: First-time documentation of a project
- **Full Rescan**: Update existing documentation with latest changes
- **Deep-Dive**: Exhaustive analysis of specific features/modules/folders

The workflow automatically detects project type (web, mobile, backend, CLI, library, etc.), repository structure (monolith, monorepo, multi-part), and generates tailored documentation based on project-specific requirements.

---

## Prerequisites

- BMAD plugin installed and configured
- `workflow-init` has been run (optional - workflow can run standalone)
- Target project exists and is accessible

---

## What This Workflow Does

### Automatic Project Detection
- Scans directory structure and configuration files
- Identifies project type using pattern matching (12 supported types)
- Detects repository architecture (monolith, monorepo, or multi-part)
- Determines technology stack and dependencies

### Smart Documentation Generation
- **Quick Scan** (2-5 min): Pattern-based analysis, no source reading
- **Deep Scan** (10-30 min): Reads critical files based on project type
- **Exhaustive Scan** (30-120 min): Reads all source files

### Comprehensive Output
Creates structured documentation in `{output_folder}/`:
- `index.md` - Master documentation index
- `project-overview.md` - Architecture and structure
- `source-tree.md` - Directory tree with descriptions
- `deep-dive-{area}.md` - Detailed feature/module analysis (optional)
- `project-scan-report.json` - State file for resumability

---

## Instructions

### Step 1: Check Existing State

**If you're resuming an in-progress scan:**

Read the state file to check for existing work:

```bash
cat {output_folder}/project-scan-report.json
```

**The state file contains:**
- Workflow mode (initial_scan, full_rescan, deep_dive)
- Scan level (quick, deep, exhaustive)
- Completed steps and current position
- Project type classification (cached for resume)
- Timestamps for all activities

**Use AskUserQuestion to prompt:**

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

**If resuming:**
- Load cached project type(s) from state file
- Continue from `current_step` in state file
- Skip project detection (already done)

**If starting fresh:**
- Archive old state to `{output_folder}/.archive/project-scan-report-[timestamp].json`
- Proceed to Step 2

---

### Step 2: Validate Workflow Status (Optional)

**If workflow tracking exists:**

Use the Task tool to invoke workflow-status in data mode:

```markdown
Read `.bmad/workflow-status.yaml` to extract:
- `field_type`: "greenfield" or "brownfield"
- `current_phase`: Current workflow phase
- `project_level`: Project complexity level
```

**If greenfield project detected:**

Use AskUserQuestion:

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

**If brownfield, validate sequencing:**

The workflow can run standalone, but typically runs after:
- `product-brief` (for brownfield PRD creation)
- `prd` (when documenting existing project)

---

### Step 3: Check for Existing Documentation

Check if documentation already exists:

```bash
ls -la {output_folder}/index.md
```

**If `index.md` exists:**

Read the file to extract metadata (generation date, project structure, parts count).

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

**Action based on selection:**

1. **Re-scan entire project**:
   - Set `workflow_mode = "full_rescan"`
   - Proceed to Step 4 (select scan level)

2. **Deep-dive into specific area**:
   - Set `workflow_mode = "deep_dive"`
   - Set `scan_level = "exhaustive"`
   - Skip to Step 6 (Deep-Dive Mode)

3. **Cancel**:
   - Exit workflow

**If `index.md` does NOT exist:**
- Set `workflow_mode = "initial_scan"`
- Proceed to Step 4

---

### Step 4: Select Scan Depth Level

**Only for initial_scan or full_rescan modes (skip for deep_dive).**

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

**Map selection to scan level:**
- Option 1 → `scan_level = "quick"`
- Option 2 → `scan_level = "deep"`
- Option 3 → `scan_level = "exhaustive"`

**Initialize state file:**

Create `{output_folder}/project-scan-report.json`:

```json
{
  "workflow_version": "2.0.0",
  "timestamps": {
    "started": "[CURRENT_TIMESTAMP]",
    "last_updated": "[CURRENT_TIMESTAMP]"
  },
  "mode": "[workflow_mode]",
  "scan_level": "[scan_level]",
  "project_root": "[project_root_path]",
  "output_folder": ".bmad/output",
  "completed_steps": [],
  "current_step": "detect_project_structure",
  "findings": {},
  "outputs_generated": ["project-scan-report.json"],
  "resume_instructions": "Starting project structure detection"
}
```

---

### Step 5: Full Scan Mode (Initial or Rescan)

**Delegate to Technical Writer agent for complete project scan.**

This mode performs 12 comprehensive steps:

#### 5.1 Detect Project Structure and Type

**Ask user for project root:**

```yaml
questions:
  - question: "What is the root directory of the project to document?"
    header: "Project Root"
    multiSelect: false
    options:
      - label: "Current directory"
        description: "Use the current working directory"
      - label: "Specify path"
        description: "Enter a custom path (choose 'Other')"
```

**Scan the project root for key indicators:**

Use Glob and Read tools to detect:
- Directory structure: `client/`, `server/`, `api/`, `src/`, `app/`, etc.
- Key files: `package.json`, `go.mod`, `requirements.txt`, `Cargo.toml`, etc.
- Technology markers from config files

**Determine repository architecture:**

- **Monolith**: Single cohesive codebase (one `src/` or `app/` folder)
- **Monorepo**: Multiple packages/apps (e.g., `packages/*`, `apps/*`)
- **Multi-part**: Separate client/server folders

**If multi-part or monorepo detected:**

List detected parts and confirm with user:

```yaml
questions:
  - question: "I detected multiple parts in this project: [LIST_OF_PARTS]. Is this correct? Should I document each part separately?"
    header: "Multi-part"
    multiSelect: false
    options:
      - label: "Yes, document separately"
        description: "Each part gets its own project type classification"
      - label: "No, treat as single project"
        description: "Document as one unified project"
      - label: "Let me specify manually"
        description: "I'll tell you the correct parts (choose 'Other')"
```

**Detect project type for each part:**

Match against 12 supported project types using file patterns:

| Project Type | Key File Patterns | Critical Directories |
|--------------|------------------|---------------------|
| web | `package.json`, `tsconfig.json`, `*.config.js`, `.jsx/.tsx` files | `src/components`, `src/pages`, `public/` |
| mobile | `package.json` + `react-native`, OR `pubspec.yaml` (Flutter), OR `AndroidManifest.xml` | `android/`, `ios/`, `lib/` |
| backend | `package.json` + `express/fastify`, OR `go.mod`, OR `requirements.txt` + Django/Flask | `src/api`, `src/routes`, `src/controllers` |
| cli | `package.json` with `bin` field, OR `Cargo.toml` with `[[bin]]`, OR `setup.py` with `console_scripts` | `src/commands`, `bin/` |
| library | `package.json` with `main`/`module`, OR `Cargo.toml` `[lib]`, OR `setup.py` without CLI | `src/`, `lib/` |
| desktop | `package.json` + `electron`, OR `.csproj` (WPF), OR `Qt` files | `src/main`, `src/renderer` |
| game | `package.json` + `phaser/three.js`, OR Unity project files, OR Godot `.godot` | `assets/`, `scenes/`, `scripts/` |
| data | `requirements.txt` + `pandas/numpy`, OR `Pipfile` + Jupyter | `notebooks/`, `data/`, `models/` |
| extension | `manifest.json` (browser), OR `extension.js` (VS Code) | `src/background`, `src/content`, `src/popup` |
| infra | `terraform` files, OR `docker-compose.yml`, OR `k8s/*.yaml` | `terraform/`, `k8s/`, `helm/` |
| embedded | `platformio.ini`, OR `*.ino` (Arduino), OR `CMakeLists.txt` + embedded toolchain | `src/`, `lib/`, `include/` |

**For each part, create a classification:**

```json
{
  "part_name": "Client",
  "root_path": "./client",
  "project_type_id": "web",
  "technologies": ["React", "TypeScript", "Vite"],
  "package_manager": "npm"
}
```

**Confirm classification with user:**

```yaml
questions:
  - question: "I've classified this project: [SUMMARY]. Does this look correct?"
    header: "Classification"
    multiSelect: false
    options:
      - label: "Yes, correct"
        description: "Proceed with this classification"
      - label: "No, let me edit"
        description: "I'll provide corrections (choose 'Other')"
```

**Update state file:**

```json
{
  "completed_steps": ["detect_project_structure"],
  "current_step": "scan_dependencies",
  "project_classification": {
    "repository_type": "multi-part",
    "parts": [ /* array of part classifications */ ]
  }
}
```

#### 5.2 Scan Dependencies and Tech Stack

**For each part, extract dependencies:**

Read package manifests:
- `package.json` → `dependencies`, `devDependencies`
- `requirements.txt` / `Pipfile` → Python packages
- `go.mod` → Go modules
- `Cargo.toml` → Rust crates
- `pom.xml` / `build.gradle` → Java dependencies

**Categorize dependencies:**

- **Core Framework**: React, Vue, Angular, Express, FastAPI, etc.
- **UI Libraries**: Material-UI, Tailwind, Bootstrap, shadcn/ui
- **State Management**: Redux, MobX, Zustand, Pinia
- **Testing**: Jest, Vitest, Playwright, Cypress, pytest
- **Build Tools**: Vite, Webpack, esbuild, Rollup
- **Utilities**: lodash, date-fns, axios, zod

**Identify development setup:**

- Node version (from `.nvmrc`, `package.json` engines)
- Package manager (npm, yarn, pnpm, bun)
- TypeScript configuration
- Linting/formatting (ESLint, Prettier)
- CI/CD (GitHub Actions, GitLab CI, etc.)

**Update state file with findings.**

#### 5.3 Scan Directory Structure

**Use Glob tool to map directory tree:**

```bash
# Get all directories (excluding common ignore patterns)
**/
!node_modules/**
!dist/**
!build/**
!coverage/**
!.git/**
```

**For each directory, determine purpose:**

Use naming conventions and contents to classify:

| Directory Pattern | Purpose |
|------------------|---------|
| `src/components`, `components/` | UI components |
| `src/pages`, `pages/`, `app/*/page.tsx` | Page components / routes |
| `src/api`, `src/routes`, `routes/` | API endpoints |
| `src/services`, `services/` | Business logic |
| `src/utils`, `utils/`, `lib/` | Utility functions |
| `src/hooks`, `hooks/` | React hooks |
| `src/store`, `src/state`, `store/` | State management |
| `src/types`, `types/` | TypeScript types |
| `src/models`, `models/` | Data models |
| `src/middleware`, `middleware/` | Middleware |
| `tests/`, `__tests__/`, `*.test.*`, `*.spec.*` | Tests |
| `public/`, `static/`, `assets/` | Static assets |
| `docs/`, `documentation/` | Documentation |
| `scripts/`, `tools/` | Build/dev scripts |

**Generate directory tree with descriptions:**

For each directory at depth ≤ 3:
- Include file count
- Add 1-sentence purpose description
- Note if it's a critical directory for the project type

**Update state file.**

#### 5.4 Scan Configuration Files

**Read and document all config files:**

Based on scan level:

- **Quick Scan**: Read only key configs (package.json, tsconfig.json, etc.)
- **Deep Scan**: Read all configs in critical directories
- **Exhaustive Scan**: Read ALL config files

**Extract configuration insights:**

- Build configuration (Vite, Webpack, etc.)
- TypeScript compiler options
- Testing setup and coverage targets
- Linting rules and code style
- Environment variables (`.env.example`)
- Database configuration
- API endpoints and base URLs
- Feature flags

**Document unusual or notable configurations.**

**Update state file.**

#### 5.5 Identify Critical Files

**Based on project type, locate critical files:**

For **web** projects:
- Entry point: `src/main.tsx`, `src/index.tsx`
- App root: `src/App.tsx`, `src/app/layout.tsx`
- Router config: `src/router.tsx`, `src/app/routes.tsx`
- API client: `src/api/*`, `src/services/api.ts`

For **backend** projects:
- Entry point: `src/index.ts`, `src/main.ts`, `server.ts`
- Route definitions: `src/routes/*`, `src/api/*`
- Database models: `src/models/*`, `src/entities/*`
- Middleware: `src/middleware/*`

For **mobile** projects:
- Entry point: `App.tsx`, `index.js`
- Navigation: `src/navigation/*`
- Screens: `src/screens/*`
- Native modules: `android/`, `ios/`

**For each critical file:**
- Note its role in the application
- Extract key exports (classes, functions, types)
- Identify dependencies

**Update state file.**

#### 5.6 Scan Based on Scan Level

**QUICK SCAN:**
- Read only: configs, manifests, README, key files from step 5.5
- Do NOT read source files
- Generate documentation from patterns and file metadata

**DEEP SCAN:**
- Read files in critical directories (from project type requirements)
- For **web**: Read `src/components/*`, `src/pages/*`, `src/api/*`
- For **backend**: Read `src/routes/*`, `src/controllers/*`, `src/models/*`
- For **mobile**: Read `src/screens/*`, `src/navigation/*`, `src/components/*`
- Extract: exports, imports, function signatures, component props

**EXHAUSTIVE SCAN:**
- Read ALL source files (excluding node_modules, dist, build)
- For EACH file, extract:
  - Purpose (1-2 sentence description)
  - All exports with signatures
  - All imports (dependencies)
  - Key implementation details
  - Side effects (API calls, DB queries, etc.)
  - Error handling patterns
  - TODOs/FIXMEs
- Build complete file inventory

**Use Read tool extensively. Update state file after each batch.**

#### 5.7 Extract API Endpoints (if applicable)

**If project has API routes (`requires_api_scan=true` in project type):**

Search for route definitions using Grep:

```bash
# Express/Fastify patterns
app.get|app.post|app.put|app.delete|app.patch|router.get|router.post

# FastAPI patterns
@app.get|@app.post|@router.get|@router.post

# Go patterns
HandleFunc|Handle|GET|POST|PUT|DELETE

# Django patterns
path\(|re_path\(
```

**For each endpoint, document:**
- HTTP method (GET, POST, PUT, DELETE, PATCH)
- Route path (e.g., `/api/users/:id`)
- Handler function name
- Request parameters (path, query, body)
- Response schema (if available)
- Authentication requirements
- Middleware applied

**Group endpoints by resource or feature.**

**Update state file.**

#### 5.8 Extract Data Models (if applicable)

**If project uses data models (`requires_data_models=true`):**

Search for model definitions using Grep:

```bash
# TypeScript/JavaScript
interface |type |class.*Model|Schema

# Python (SQLAlchemy, Django)
class.*Model\)|db.Model|models.Model

# Go
type.*struct

# Prisma/TypeORM
model |@Entity
```

**For each model, document:**
- Model name
- Fields/properties with types
- Relationships (foreign keys, references)
- Constraints (required, unique, default)
- Validation rules

**Update state file.**

#### 5.9 Extract UI Components (if applicable)

**If project has UI components (`requires_ui_components=true`):**

Find component files using Glob:

```bash
# React/Vue/Svelte components
src/components/**/*.{tsx,jsx,vue,svelte}
src/pages/**/*.{tsx,jsx,vue,svelte}
app/**/page.tsx
app/**/layout.tsx
```

**For each component, document:**
- Component name
- Props interface (TypeScript types)
- Hooks used (useState, useEffect, custom hooks)
- Child components rendered
- State management (local, Redux, Context)

**Categorize components:**
- **Pages/Routes**: Top-level page components
- **Layouts**: Layout wrappers (Header, Footer, Sidebar)
- **Features**: Feature-specific components
- **UI**: Reusable UI components (Button, Input, Card)
- **Forms**: Form components

**Update state file.**

#### 5.10 Identify Testing Strategy

**Scan test files using Glob:**

```bash
**/*.test.{ts,tsx,js,jsx,py}
**/*.spec.{ts,tsx,js,jsx,py}
__tests__/**/*
tests/**/*
test/**/*
```

**Analyze testing approach:**

- **Unit tests**: Count of unit test files
- **Integration tests**: API/service integration tests
- **E2E tests**: Playwright, Cypress, Selenium tests
- **Test frameworks**: Jest, Vitest, pytest, Go testing
- **Coverage setup**: Coverage thresholds, tools used
- **Testing utilities**: Testing Library, test helpers

**Calculate metrics:**
- Total test files
- Test-to-source file ratio
- Coverage percentage (if available in config)

**Identify gaps:**
- Untested critical files
- Missing E2E tests for key flows
- Low coverage areas

**Update state file.**

#### 5.11 Generate Documentation Files

**Delegate to Technical Writer agent:**

Use the Task tool with `subagent_type: bmad-tech-writer`:

**Prompt for Technical Writer:**

> Using all collected data from the project scan, generate comprehensive documentation:
>
> **Files to create in `{output_folder}/`:**
>
> 1. **`index.md`** - Master documentation index linking all generated docs
> 2. **`project-overview.md`** - High-level architecture, tech stack, structure summary
> 3. **`source-tree.md`** - Annotated directory tree with purpose descriptions
> 4. **`api-endpoints.md`** - Complete API documentation (if applicable)
> 5. **`data-models.md`** - Database schema and model documentation (if applicable)
> 6. **`ui-components.md`** - Component inventory with props and usage (if applicable)
> 7. **`testing-strategy.md`** - Testing approach, coverage, gaps
>
> **Use the following data:**
> [Provide all collected data from steps 5.1-5.10 from state file]
>
> **Follow these templates:**
> - Read `.bmad-conversion/reference-templates/project-documentation/` for format guidance
>
> **Documentation must include:**
> - Clear headings and sections
> - Code examples where relevant
> - Mermaid diagrams for architecture/flow
> - Tables for structured data (endpoints, models)
> - Links between related sections
> - Generation timestamp and metadata

**Technical Writer will:**
- Create all documentation files using CommonMark
- Generate Mermaid diagrams for architecture
- Ensure proper linking and navigation
- Add metadata headers to each file

#### 5.12 Finalize and Update Status

**Update state file with completion:**

```json
{
  "completed_steps": [
    "detect_project_structure",
    "scan_dependencies",
    "scan_directory_structure",
    "scan_configuration",
    "identify_critical_files",
    "scan_source_files",
    "extract_api_endpoints",
    "extract_data_models",
    "extract_ui_components",
    "analyze_testing",
    "generate_documentation",
    "finalize"
  ],
  "current_step": "complete",
  "timestamps": {
    "started": "[START_TIME]",
    "last_updated": "[CURRENT_TIME]",
    "completed": "[CURRENT_TIME]"
  },
  "outputs_generated": [
    "index.md",
    "project-overview.md",
    "source-tree.md",
    "api-endpoints.md",
    "data-models.md",
    "ui-components.md",
    "testing-strategy.md",
    "project-scan-report.json"
  ]
}
```

**If workflow tracking exists:**

Invoke workflow-status to update:

```markdown
Use Task tool with workflow-status:
- mode: update
- action: complete_workflow
- workflow_name: document-project
```

**Display completion message:**

```markdown
✅ **Document Project Workflow Complete!**

**Documentation Generated:**
- Mode: [workflow_mode]
- Scan Level: [scan_level]
- Output: `{output_folder}/index.md` and [N] related files

**Project Classification:**
- Repository Type: [monolith/monorepo/multi-part]
- Project Type(s): [web/backend/mobile/etc.]
- Parts Documented: [count]

**Next Steps:**
- Review generated documentation in `{output_folder}/`
- Use for brownfield PRD creation with `prd` workflow
- Reference during architecture and implementation

**Generated Files:**
[List all output files with brief descriptions]

---

*Documentation generated by BMAD Method v2.0*
*Timestamp: [ISO_TIMESTAMP]*
```

---

### Step 6: Deep-Dive Mode (Detailed Feature Analysis)

**For exhaustive analysis of specific areas (features, modules, folders).**

**This mode is ONLY used when:**
- User explicitly requests deep-dive
- Existing documentation exists and user wants detailed area analysis
- Need comprehensive understanding of a specific part of codebase

#### 6.1 Load Existing Documentation Context

**Read existing documentation:**

```bash
cat {output_folder}/index.md
cat {output_folder}/project-overview.md
cat {output_folder}/source-tree.md
```

**Extract project structure to understand available areas.**

#### 6.2 Identify Area for Deep-Dive

**Analyze project structure and suggest deep-dive options:**

Based on project type and structure, suggest:

**For web/mobile apps:**
- API Routes by group (e.g., "User Management - 12 endpoints")
- Feature modules (e.g., "Dashboard - 23 files")
- UI component groups (e.g., "Forms - 15 components")

**For backend:**
- API endpoint groups
- Service modules
- Database model groups

**For libraries:**
- Public API surface
- Core functionality modules
- Plugin/extension systems

**Use AskUserQuestion to get target:**

```yaml
questions:
  - question: "What area would you like to deep-dive into?"
    header: "Deep-Dive"
    multiSelect: false
    options:
      - label: "[SUGGESTED_AREA_1]"
        description: "[COUNT] files in `[PATH]`"
      - label: "[SUGGESTED_AREA_2]"
        description: "[COUNT] files in `[PATH]`"
      - label: "Custom folder/file path"
        description: "Specify your own target (choose 'Other')"
```

**Parse user input to determine:**
- `target_type`: "folder" | "file" | "feature" | "api_group" | "component_group"
- `target_path`: Absolute path to scan
- `target_name`: Human-readable name
- `target_scope`: List of all files to analyze

**Confirm with user:**

```yaml
questions:
  - question: "Target: [target_name], Type: [target_type], Path: [target_path]. Estimated files to analyze: [count]. This will read EVERY file in this area. Proceed?"
    header: "Confirm"
    multiSelect: false
    options:
      - label: "Yes, proceed"
        description: "Start exhaustive deep-dive scan"
      - label: "No, choose different area"
        description: "Go back to area selection"
```

#### 6.3 Exhaustive Scan of Target Area

**This is the most detailed scan possible. EVERY file must be read completely.**

**If target_type is "folder":**

1. Get complete recursive file list from target_path
2. Filter out: `node_modules/`, `.git/`, `dist/`, `build/`, `coverage/`, `*.min.js`, `*.map`
3. For EVERY remaining file:
   - Read complete file contents (ALL lines)
   - Extract ALL exports (functions, classes, types, interfaces, constants)
   - Extract ALL imports (dependencies)
   - Identify purpose from comments and code structure
   - Write 1-2 sentences (minimum) describing behavior, side effects, assumptions
   - Extract function signatures with parameter types and return types
   - Note any TODOs, FIXMEs, or comments
   - Identify patterns (hooks, components, services, controllers, etc.)
   - Capture: `purpose`, `exports`, `imports`, `key_details`, `side_effects`, `error_handling`, `testing`

**If target_type is "file":**

1. Read complete file at target_path
2. Extract all information as above
3. Read all files it imports (follow import chain 1 level deep)
4. Find all files that import this file (dependents via Grep)
5. Store all in file inventory

**If target_type is "api_group":**

1. Identify all route/controller files in API group
2. Read all route handlers completely
3. Read associated middleware, controllers, services
4. Read data models and schemas used
5. Extract complete request/response schemas
6. Document authentication and authorization requirements

**If target_type is "feature":**

1. Search codebase for all files related to feature name (Grep)
2. Include: UI components, API endpoints, models, services, tests
3. Read each file completely

**If target_type is "component_group":**

1. Get all component files in group (Glob)
2. Read each component completely
3. Extract: Props interfaces, hooks used, child components, state management

**Create comprehensive file inventory:**

For each file, document:

```markdown
### `[FILE_PATH]`

**Purpose:** [What this file does - 1-2 sentences]

**Lines of Code:** [LOC]

**Exports:**
- `functionName(param: Type): ReturnType` - [Description]
- `ClassName` - [Description with key methods]
- `TypeName` - [Type/interface description]
- `CONSTANT_NAME: Type` - [Description]

**Imports/Dependencies:**
- `import { X } from 'module'` - [Why it's used]

**Used By:** [List of files that import this]

**Key Implementation Details:**
- [Important logic, algorithms, patterns]

**State Management:** [If applicable - Redux, Context, local state]

**Side Effects:**
- [API calls, database queries, file I/O, external services]

**Error Handling:** [Try/catch blocks, error boundaries, validation]

**Testing:** [Associated test files and coverage notes]

**Comments/TODOs:**
- [Inline documentation or planned work]
```

#### 6.4 Analyze Relationships and Data Flow

**Build dependency graph:**

1. Create graph with files as nodes
2. Add edges for import relationships
3. Identify circular dependencies (if any)
4. Find entry points (files not imported by others in scope)
5. Find leaf nodes (files that don't import others in scope)

**Trace data flow:**

1. Follow function calls and data transformations
2. Track API calls and their responses
3. Document state updates and propagation
4. Map database queries and mutations

**Identify integration points:**

1. External APIs consumed
2. Internal APIs/services called
3. Shared state accessed
4. Events published/subscribed
5. Database tables accessed

**Generate diagrams:**

Use Technical Writer to create Mermaid diagrams:
- Dependency graph (file relationships)
- Data flow diagram
- Component hierarchy (for UI)
- API call flow

#### 6.5 Find Related Code and Reuse Opportunities

**Search codebase OUTSIDE scanned area for:**

1. Similar file/folder naming patterns (Grep)
2. Similar function signatures
3. Similar component structures
4. Similar API patterns
5. Reusable utilities that could be used

**Identify code reuse opportunities:**

1. Shared utilities available
2. Design patterns used elsewhere
3. Component libraries available
4. Helper functions that could apply

**Find reference implementations:**

1. Similar features in other parts of codebase
2. Established patterns to follow
3. Testing approaches used elsewhere

#### 6.6 Generate Deep-Dive Documentation

**Delegate to Technical Writer agent:**

Use Task tool with `subagent_type: bmad-tech-writer`:

**Prompt:**

> Create comprehensive deep-dive documentation for: **[target_name]**
>
> **Output file:** `{output_folder}/deep-dive-[sanitized_target_name].md`
>
> **Include all sections:**
> 1. Overview and Purpose
> 2. Complete File Inventory (from step 6.3)
> 3. Dependency Graph (Mermaid diagram)
> 4. Data Flow Analysis (Mermaid diagram)
> 5. Integration Points
> 6. Related Code References
> 7. Reuse Opportunities
> 8. Implementation Guidance (risks, gotchas, verification steps)
> 9. Testing Recommendations
> 10. Future Enhancements (from TODOs/FIXMEs)
>
> **Data to use:**
> [Provide all collected data from steps 6.3-6.5]
>
> **Template reference:**
> `.bmad-conversion/reference-templates/project-documentation/deep-dive-template.md`

**Update state file:**

```json
{
  "deep_dive_targets": [
    {
      "target_name": "[target_name]",
      "target_path": "[target_path]",
      "files_analyzed": [count],
      "output_file": "deep-dive-[sanitized_target_name].md",
      "timestamp": "[ISO_TIMESTAMP]"
    }
  ],
  "outputs_generated": [..., "deep-dive-[name].md"]
}
```

#### 6.7 Update Master Index

**Read existing `index.md`.**

**Check if "Deep-Dive Documentation" section exists.**

**If not, add section:**

```markdown
## Deep-Dive Documentation

Detailed exhaustive analysis of specific areas:
```

**Add link to new deep-dive doc:**

```markdown
- [**[target_name]** Deep-Dive](./deep-dive-[sanitized_target_name].md) - Comprehensive analysis of [target_description] ([file_count] files, [total_loc] LOC) - *Generated [date]*
```

**Update index metadata:**

```markdown
**Last Updated:** [date]
**Deep-Dives:** [count]
```

**Save updated `index.md`.**

#### 6.8 Offer to Continue or Complete

**Display summary:**

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Deep-Dive Documentation Complete! ✓

**Generated:** `{output_folder}/deep-dive-[target_name].md`
**Files Analyzed:** [file_count]
**Lines of Code Scanned:** [total_loc]
**Time Taken:** ~[duration]

**Documentation Includes:**
- Complete file inventory with all exports
- Dependency graph and data flow
- Integration points and API contracts
- Testing analysis and coverage
- Related code and reuse opportunities
- Implementation guidance

**Index Updated:** `{output_folder}/index.md` now includes link to this deep-dive

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Ask if user wants to continue:**

```yaml
questions:
  - question: "Would you like to deep-dive another area or finish the workflow?"
    header: "Continue"
    multiSelect: false
    options:
      - label: "Deep-dive another area"
        description: "Analyze another feature/module/folder"
      - label: "Finish"
        description: "Complete workflow and exit"
```

**If "Deep-dive another area":**
- Clear current deep_dive_target
- Go back to Step 6.2 (select new area)

**If "Finish":**
- Display final completion message
- Update workflow status (if tracking exists)
- Exit workflow

---

## State Management and Resumability

**The workflow is fully resumable at any point.**

### State File Schema

`{output_folder}/project-scan-report.json`:

```json
{
  "workflow_version": "2.0.0",
  "timestamps": {
    "started": "ISO_TIMESTAMP",
    "last_updated": "ISO_TIMESTAMP",
    "completed": "ISO_TIMESTAMP (optional)"
  },
  "mode": "initial_scan | full_rescan | deep_dive",
  "scan_level": "quick | deep | exhaustive",
  "project_root": "absolute_path",
  "output_folder": ".bmad/output",
  "completed_steps": ["step_id_1", "step_id_2", ...],
  "current_step": "step_id",
  "project_classification": {
    "repository_type": "monolith | monorepo | multi-part",
    "parts": [
      {
        "part_name": "string",
        "root_path": "string",
        "project_type_id": "web | backend | mobile | ...",
        "technologies": ["array"],
        "package_manager": "npm | yarn | pnpm | ..."
      }
    ]
  },
  "findings": {
    "dependencies": {},
    "directory_structure": {},
    "api_endpoints": [],
    "data_models": [],
    "ui_components": [],
    "testing_analysis": {}
  },
  "deep_dive_targets": [
    {
      "target_name": "string",
      "target_path": "string",
      "files_analyzed": 0,
      "output_file": "string",
      "timestamp": "ISO_TIMESTAMP"
    }
  ],
  "outputs_generated": ["file1.md", "file2.md", ...],
  "resume_instructions": "Human-readable next step"
}
```

### Resuming from State

**When resuming (Step 1 user selects "Resume"):**

1. Load state file
2. Extract `current_step`, `completed_steps`, `mode`, `scan_level`
3. Load cached `project_classification` (skip re-detection)
4. Continue from `current_step`
5. Use `findings` from state to avoid re-scanning

**Critical: Update state file after EVERY major step.**

---

## Output Files

### Generated Documentation Structure

```
{output_folder}/
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

## Notes

### Performance Characteristics

- **Quick Scan**: 2-5 minutes (pattern-based, no source reading)
- **Deep Scan**: 10-30 minutes (selective file reading based on project type)
- **Exhaustive Scan**: 30-120 minutes (reads all source files)
- **Deep-Dive**: 15-60 minutes per area (exhaustive analysis of specific section)

### Resumability

The workflow can be interrupted and resumed at any point. The state file tracks:
- Completed steps (to avoid re-work)
- Current step (where to resume)
- Cached project classification (skip re-detection)
- All findings (accumulated data)

### Project Type Detection

The workflow uses pattern matching to detect 12 project types:

1. **web** - Web applications (React, Vue, Angular, Next.js, etc.)
2. **mobile** - Mobile apps (React Native, Flutter, native)
3. **backend** - Backend services (Express, FastAPI, Go, etc.)
4. **cli** - Command-line tools
5. **library** - Libraries and packages
6. **desktop** - Desktop applications (Electron, WPF, Qt)
7. **game** - Game projects (Unity, Godot, Phaser)
8. **data** - Data science / ML projects (Jupyter, pandas)
9. **extension** - Browser/IDE extensions
10. **infra** - Infrastructure as code (Terraform, K8s)
11. **embedded** - Embedded systems (Arduino, PlatformIO)

Each type has specific documentation requirements (API scan, data models, UI components, etc.).

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

### Integration with Other Workflows

**Typical flow for brownfield projects:**

1. `workflow-init` - Initialize project tracking
2. `document-project` - Document existing codebase (Deep or Exhaustive scan)
3. `product-brief` - Define product vision using documentation
4. `prd` - Create PRD referencing brownfield documentation
5. `architecture` - Design architecture changes
6. `create-epics-and-stories` - Break down into stories
7. `dev-story` - Implement changes

**Deep-dive usage:**

After initial documentation, use deep-dive mode to:
- Understand specific features before enhancement
- Document complex modules for team onboarding
- Analyze integration points before refactoring

### Technical Writer Agent Role

The Technical Writer agent (`bmad-tech-writer`) is heavily used in this workflow for:

- Generating well-structured markdown documentation
- Creating Mermaid diagrams (architecture, flow, dependencies)
- Writing clear, concise descriptions
- Formatting tables and code examples
- Ensuring consistent documentation style
- Adding proper metadata and timestamps

Delegate all documentation generation to this specialized agent.

---

## Examples

### Example 1: Initial Scan of React + Express Project

**Scenario:** First-time documentation of a full-stack web app.

**User flow:**

1. Run workflow: User invokes `document-project`
2. No existing state or docs found
3. User selects: **Deep Scan** (option 2)
4. Workflow detects: Multi-part project (client/ + server/)
5. Classification:
   - Part 1: Client (project_type: web, tech: React + TypeScript)
   - Part 2: Server (project_type: backend, tech: Express + TypeScript)
6. User confirms classification
7. Workflow scans:
   - Dependencies (package.json for both parts)
   - Directory structure (src/components/, src/api/, etc.)
   - Config files (tsconfig.json, vite.config.ts, etc.)
   - API endpoints (Express routes)
   - UI components (React components)
   - Data models (TypeScript interfaces)
   - Tests (Jest, Vitest)
8. Technical Writer generates 7 documentation files
9. Completion message with file list

**Time:** ~15 minutes

**Output:**
- `index.md` - Links to all docs
- `project-overview.md` - Architecture diagram, tech stack
- `source-tree.md` - Annotated directory tree
- `api-endpoints.md` - 24 REST endpoints documented
- `ui-components.md` - 47 components cataloged
- `data-models.md` - 12 TypeScript interfaces/types
- `testing-strategy.md` - Jest + Vitest setup, 67% coverage

### Example 2: Deep-Dive into Authentication Feature

**Scenario:** Existing documentation, need detailed understanding of auth system.

**User flow:**

1. Run workflow: User invokes `document-project`
2. Existing `index.md` found
3. User selects: **Deep-dive into specific area** (option 2)
4. Workflow suggests areas based on source-tree.md
5. User selects: "Authentication System - 15 files"
6. Workflow confirms: Will read all 15 files
7. User confirms
8. Exhaustive scan:
   - Reads all auth files completely
   - Extracts: Login flow, JWT handling, password hashing, session management
   - Builds dependency graph
   - Traces data flow (login request → validation → token generation → response)
   - Identifies integration points (Redis for sessions, bcrypt for passwords)
   - Finds related code (authorization middleware elsewhere)
9. Technical Writer generates deep-dive doc
10. `index.md` updated with link to deep-dive
11. User asked: Continue or finish?
12. User selects: **Finish**

**Time:** ~25 minutes

**Output:**
- `deep-dive-authentication-system.md` - 2,500 lines of comprehensive docs
  - File inventory (15 files, full details)
  - Dependency graph (Mermaid diagram)
  - Data flow diagram (login, logout, refresh)
  - Integration points (Redis, bcrypt, JWT)
  - Security considerations
  - Testing coverage (12 test files)
  - Implementation guidance

### Example 3: Resume Interrupted Exhaustive Scan

**Scenario:** Exhaustive scan interrupted at step 8 (extracting data models).

**User flow:**

1. Run workflow: User invokes `document-project`
2. State file found from 3 hours ago
3. Workflow displays progress:
   - Mode: initial_scan
   - Scan Level: exhaustive
   - Completed: 7/12 steps
   - Current: extract_data_models
4. User selects: **Resume from where we left off** (option 1)
5. Workflow loads:
   - Cached project classification (skip re-detection)
   - Cached findings (dependencies, directory structure, etc.)
6. Continues from step 8:
   - Extracts data models
   - Extracts UI components
   - Analyzes testing
   - Generates documentation
   - Finalizes
7. Completion message

**Time:** ~45 minutes (to complete remaining 5 steps)

**Total time saved:** ~60 minutes (avoided repeating first 7 steps)

---

**This workflow is the foundation for brownfield project understanding in BMAD Method.**
