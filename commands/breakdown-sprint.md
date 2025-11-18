---
description: Break down sprint stories into granular development tasks with standards context
runInPlanMode: false
---

# Breakdown Sprint - Granular Task Generation

## Purpose

Break each story in a sprint into granular, actionable development tasks that reference project standards and provide clear implementation guidance. This command analyzes each story's acceptance criteria, loads relevant specifications and coding standards, and generates 5 types of tasks (setup, implementation, testing, documentation, review) with clear dependencies and time estimates. The generated tasks provide rich context for the bmad-dev agent to implement stories following project conventions.

## Variables

**Sprint Identification**:
- `{sprint_id}` - Sprint identifier (e.g., "sprint-1", "sprint-2")
- `{story-id}` - Story identifier (e.g., "1-1", "1-2")
- `{epic-id}` - Epic identifier the story belongs to

**Directory Paths**:
- `{sprint_artifacts}` - Sprint artifacts directory from config (usually `.bmad/sprint-artifacts`)
- `{documentation_dir}` - Documentation directory from config (usually `.bmad/documentation`)
- `{bmad_dir}` - BMAD directory from config (usually `.bmad`)

**Configuration Files**:
- `{bmad_dir}/config.yaml` - Project configuration with task generation settings
- `{sprint_artifacts}/sprint-status.yaml` - Current sprint tracking
- `{sprint_artifacts}/sprint-N/sprint-plan.yaml` - Sprint plan with story list
- `{sprint_artifacts}/sprint-N/stories/{story-id}.md` - Individual story files

**Standards Paths**:
- `{bmad_dir}/standards/global/` - Global coding standards (coding-style, conventions, error-handling, etc.)
- `{bmad_dir}/standards/architecture/` - Architecture patterns (app-router, api-routes, etc.)
- `{bmad_dir}/standards/frontend/` - Frontend-specific standards
- `{bmad_dir}/standards/backend/` - Backend-specific standards
- `{bmad_dir}/standards/testing/` - Testing standards
- `{bmad_dir}/standards/tooling/` - Tooling configuration standards

**Specification Paths**:
- `{documentation_dir}/technical/architecture.md` - System architecture
- `{documentation_dir}/technical/tech-stack.md` - Technology stack
- `{documentation_dir}/technical/backend-spec.md` - Backend/API specifications
- `{documentation_dir}/design/ux-spec.md` - UX specifications
- `{documentation_dir}/design/ui-spec.md` - UI specifications

**Task Generation Settings** (from config.yaml):
- `task_generation.min_tasks_per_story` - Minimum tasks per story (default: 3)
- `task_generation.max_tasks_per_story` - Maximum tasks per story (default: 15)
- `task_generation.default_task_time_minutes` - Default task time estimate (default: 30)
- `task_generation.include_review_tasks` - Include review tasks (default: true)
- `task_generation.include_documentation_tasks` - Include documentation tasks (default: true)
- `project_types` - List of project types (e.g., ["next-js", "python", "flutter"])

## Instructions

**Prerequisites**: Ensure sprint planning completed (`/bmad:sprint-planning`), sprint artifacts exist, stories created, and standards copied to `{bmad_dir}/standards/`.

**Usage**:
- `/bmad:breakdown-sprint` - Breaks down current sprint
- `/bmad:breakdown-sprint sprint-2` - Breaks down specific sprint

### 1. Identify Target Sprint

1.1. If no sprint specified as argument, read `{sprint_artifacts}/sprint-status.yaml` to get current sprint ID

1.2. Validate sprint exists by checking for `{sprint_artifacts}/sprint-N/sprint-plan.yaml`

1.3. Load sprint plan to extract the list of stories to process

1.4. **Error Handling**:
   - If sprint not found, list available sprints in `{sprint_artifacts}/` and prompt user
   - If `sprint-status.yaml` missing, prompt to run `/bmad:sprint-planning` first

### 2. Load Story Details

For each story in the sprint:

2.1. **Load Story File** at `{sprint_artifacts}/sprint-N/stories/{story-id}.md`:
   - Extract title, description, acceptance criteria, complexity

2.2. **Load Story Metadata** from epics.yaml or sprint-plan.yaml:
   - Epic ID
   - Dependencies on other stories
   - Priority level
   - Estimated story points

2.3. **Check Existing Tasks**:
   - Check if `{sprint_artifacts}/sprint-N/stories/{story-id}-tasks.yaml` exists
   - If exists, ask user to choose: Overwrite (regenerate all), Skip (move to next), or Append (add new tasks)

### 3. Gather Context for Task Generation

For each story, collect relevant specifications and standards:

3.1. **Load Relevant Specifications** based on story type:

**Always read**:
- `{documentation_dir}/technical/architecture.md`
- `{documentation_dir}/technical/tech-stack.md`

**If story involves UI/frontend**:
- `{documentation_dir}/design/ux-spec.md`
- `{documentation_dir}/design/ui-spec.md`

**If story involves backend/API**:
- `{documentation_dir}/technical/backend-spec.md`

**If story involves database**:
- `{documentation_dir}/technical/backend-spec.md` (data models section)

3.2. **Load Coding Standards** from `{bmad_dir}/standards/`:

**Always read**:
- `global/coding-style.md`
- `global/conventions.md`
- `global/error-handling.md`
- `testing/test-writing.md`

**Based on project type** (from config.yaml `project_types`):

If **Next.js/React**:
- `architecture/app-router.md` or `architecture/api-routes.md`
- `global/component-patterns.md`
- `global/file-organization.md`
- `state-management/*.md`
- `tooling/typescript.md`
- `tooling/eslint.md`

If **Python**:
- `global/typing.md`
- `global/imports.md`
- `tooling/pytest.md`
- `tooling/ruff.md`

If **Flutter**:
- `global/project-structure.md`
- `state-management/*.md`

If **Rust**:
- `global/safety.md`
- `global/documentation.md`
- `tooling/clippy.md`

**Based on story type**:
- Frontend story → `frontend/*.md`
- Backend story → `backend/*.md`

3.3. **Load Story Dependencies**:
   - If story has dependencies, read dependent story files to understand context
   - Note what's been implemented if dependency is completed
   - Identify interfaces/contracts that must be maintained

### 4. Generate Granular Tasks

Break each story into **5 task types** with clear structure:

4.1. **Setup Tasks** - Scaffolding, configuration, file creation
   - Examples: Create model/schema file, create API route file, create component structure, update configs, install dependencies
   - Include: `files_to_create`, `acceptance_criteria`, `estimated_time`, `standards_reference`
   - Dependencies: None (can run first)

4.2. **Implementation Tasks** - Core feature development
   - Examples: Implement business logic, create UI component, build API endpoint, write database query, integrate external API
   - Include: `files_to_modify`, `dependencies` (typically setup tasks), `acceptance_criteria` from story, `standards_reference`, `spec_reference`
   - Dependencies: Setup tasks

4.3. **Testing Tasks** - Unit tests, integration tests, E2E tests
   - Examples: Write unit tests for service, write component tests, write API integration tests, write E2E tests
   - Include: `files_to_create` (test files), test coverage requirements, edge cases, error conditions
   - Dependencies: Implementation tasks

4.4. **Documentation Tasks** - Code comments, API docs, README updates
   - Examples: Add JSDoc/docstrings, update API documentation, update README, add inline comments
   - Include: `files_to_modify`, documentation requirements (docstrings, API docs, README updates)
   - Dependencies: Implementation tasks (can run parallel with testing)

4.5. **Review/Integration Tasks** - Code review prep, integration checks
   - Examples: Run linter, check accessibility, verify standards compliance, integration testing
   - Include: Checklist (linter, formatter, type checking, accessibility, error handling verification, all tests)
   - Dependencies: Testing and documentation tasks

**Task Structure Template**:
```yaml
- id: {story-id}-task-N
  title: [Clear action-oriented title]
  type: [setup|implementation|testing|documentation|review]
  description: |
    Detailed description with:
    - Specific functionality to implement
    - References to spec sections
    - Standards to follow
    - Acceptance criteria from story
  files_to_create: [list of new files]
  files_to_modify: [list of files to change]
  dependencies: [list of task IDs]
  acceptance_criteria:
    - Specific, measurable criteria
    - Standards compliance checks
    - Success conditions
  estimated_time: "15-90min"
  status: pending
  standards_reference:
    - [relevant standards files]
  spec_reference:
    - [relevant spec sections with anchors]
```

### 5. Resolve Task Dependencies

5.1. **Establish Sequential Dependencies**:
   - Setup tasks: No dependencies (run first)
   - Implementation tasks: Depend on setup
   - Testing tasks: Depend on implementation
   - Documentation tasks: Depend on implementation
   - Review tasks: Depend on testing + documentation

5.2. **Identify Cross-Task Dependencies**:
   - If story has story dependencies, first tasks may depend on previous story completion
   - Note shared files for potential conflict awareness

5.3. **Identify Parallel Opportunities**:
   - Some implementation tasks can run in parallel (different files)
   - Documentation can run parallel with testing (if different files)

5.4. Generate dependency graph structure for visualization (optional)

### 6. Save Tasks to YAML

6.1. Create output file at `{sprint_artifacts}/sprint-N/stories/{story-id}-tasks.yaml`

6.2. **YAML Structure**:
```yaml
story_id: {story-id}
story_title: "{story-title}"
epic_id: {epic-id}
generated_at: "YYYY-MM-DDTHH:mm:ssZ"
total_tasks: N
estimated_total_time: "X-Y hours"

context:
  specs_referenced: [list]
  standards_referenced: [list]

tasks: [array of task objects]

summary:
  setup_tasks: N
  implementation_tasks: N
  testing_tasks: N
  documentation_tasks: N
  review_tasks: N
```

6.3. **Validation**:
   - Verify all task IDs are unique
   - Verify dependency tasks exist
   - Verify file paths are valid
   - Warn if estimated time seems too low (<15min) or too high (>90min)

### 7. Update Sprint Status

7.1. Update `{sprint_artifacts}/sprint-status.yaml` to add `tasks_generated: true` flag for the sprint

7.2. Track task generation timestamp and total task count

### 8. Generate Summary Report

8.1. Create breakdown summary at `{sprint_artifacts}/sprint-N/breakdown-summary.md`

8.2. **Summary Contents**:
   - Generation timestamp
   - Sprint identifier
   - Stories processed count
   - Total tasks generated
   - Estimated total time in hours
   - Per-story breakdown (tasks, time, types, file location)
   - Standards referenced (with usage counts)
   - Specifications referenced (with reference counts)
   - Next steps guidance

8.3. Display summary to user

## Workflow

```
START
  ↓
[Load Config & Identify Sprint]
  ├─ Parse command argument or read sprint-status.yaml
  ├─ Validate sprint exists
  └─ Load sprint plan
  ↓
[For Each Story in Sprint] ←─────────┐
  ↓                                  │
[Load Story Details]                │
  ├─ Read story markdown file        │
  ├─ Extract AC, metadata            │
  └─ Check for existing tasks        │
  ↓                                  │
[Gather Context]                    │
  ├─ Load relevant specifications    │
  │  └─ (architecture, backend, UX, UI)
  ├─ Load coding standards           │
  │  └─ (global, project-specific, tooling)
  └─ Load dependency stories         │
  ↓                                  │
[Generate Tasks by Type]            │
  ├─ Setup Tasks (no dependencies)   │
  ├─ Implementation Tasks (→ setup)  │
  ├─ Testing Tasks (→ implementation)│
  ├─ Documentation (→ implementation)│
  └─ Review Tasks (→ testing + docs) │
  ↓                                  │
[Resolve Dependencies]              │
  ├─ Sequential dependencies         │
  ├─ Cross-story dependencies        │
  └─ Parallel opportunities          │
  ↓                                  │
[Validate & Save]                   │
  ├─ Validate task IDs, dependencies │
  ├─ Save to YAML file               │
  └─ Continue to next story? ────────┘
  ↓
[Generate Summary Report]
  ├─ Aggregate statistics
  ├─ Create breakdown-summary.md
  └─ Update sprint-status.yaml
  ↓
[Display Results & Next Steps]
  ↓
END
```

**Error Handling Points**:
- Missing sprint-plan.yaml → Error: "Run /bmad:sprint-planning first"
- Missing story.md → Warning: "Skipping story {id}, file not found"
- Missing specs → Warning: "Using minimal context, recommend running workflow-init"
- Missing standards → Error: "Standards not found. Run /bmad:workflow-init"

**Integration Point**: Generated tasks are consumed by `/bmad:bring-to-life` which loads the tasks YAML and delegates each task to bmad-dev agent with full standards and spec context.

## Report

### Console Output Format

Display progress as tasks are generated:

```
Breakdown Sprint - Sprint {N}
Found {count} stories in sprint-{N}

Processing story {story-id}: {story-title}...
  Loading specs: {list of spec files}
  Loading standards: {count} files
  Generated {count} tasks ({min}-{max} hours estimated)
  Saved to: {file path}

Processing story {story-id}: {story-title}...
  [repeat for each story]

✓ Sprint breakdown complete!

Summary:
- {count} stories processed
- {count} tasks generated
- {min}-{max} hours estimated

Summary saved to: {sprint_artifacts}/sprint-{N}/breakdown-summary.md

Next: Run /bmad:bring-to-life to start implementation
```

### Generated Artifacts

**Per Story**:
- File: `{sprint_artifacts}/sprint-N/stories/{story-id}-tasks.yaml`
- Contains: All tasks with dependencies, estimates, standards/spec references

**Sprint Summary**:
- File: `{sprint_artifacts}/sprint-N/breakdown-summary.md`
- Contains:
  - Generation metadata (timestamp, sprint ID)
  - Per-story breakdown with task counts and estimates
  - Standards usage analysis (which standards referenced, how many times)
  - Specifications usage analysis (which specs referenced, how many times)
  - Total estimates and task type distribution
  - Next steps guidance

**Updated Files**:
- File: `{sprint_artifacts}/sprint-status.yaml`
- Updates: Add `tasks_generated: true` flag, generation timestamp, total task count

### Best Practices for Generated Tasks

Report adherence to these quality criteria:

1. **Granularity**: Tasks should be 15-90 minutes
   - Warn if tasks are too small (<15min) → overhead of context switching
   - Warn if tasks are too large (>90min) → hard to track progress

2. **Clear Acceptance Criteria**: Each task has measurable AC
   - Good: "Function accepts email/password, returns JWT token, handles validation errors"
   - Bad: "Make it work"

3. **Standards Context**: All tasks reference relevant standards
   - Ensures bmad-dev agent follows project conventions
   - Maintains consistency across codebase

4. **Spec Alignment**: Tasks link to specific spec sections
   - Ensures implementation matches design
   - Provides detailed context for developers

5. **Dependency Clarity**: Dependencies are explicit
   - Prevents implementing tasks out of order
   - Identifies parallel work opportunities

### Error and Warning Messages

**Errors** (stop execution):
- "Sprint not found: {sprint-id}. Available sprints: {list}"
- "Sprint plan missing: {file path}. Run /bmad:sprint-planning first"
- "Standards directory not found: {path}. Run /bmad:workflow-init to copy standards"
- "Config file missing or invalid: {path}"

**Warnings** (continue with limitations):
- "Story file not found: {file path}. Skipping story {story-id}"
- "Specification not found: {file path}. Using minimal context"
- "Standard not found: {file path}. Recommend running workflow-init"
- "Task time estimate seems high: {task-id} ({minutes}min). Consider breaking into smaller tasks"
- "Task time estimate seems low: {task-id} ({minutes}min). Consider consolidating with related tasks"

### Example Complete Session Output

```bash
$ /bmad:breakdown-sprint

Breakdown Sprint - Sprint 1
Found 5 stories in sprint-1

Processing story 1-1: User Registration...
  Loading specs: backend-spec.md, ux-spec.md
  Loading standards: 8 files
  Generated 8 tasks (4-6 hours estimated)
  Saved to: .bmad/sprint-artifacts/sprint-1/stories/1-1-tasks.yaml

Processing story 1-2: User Login...
  Loading specs: backend-spec.md, ux-spec.md
  Loading standards: 7 files
  Generated 6 tasks (3-4 hours estimated)
  Saved to: .bmad/sprint-artifacts/sprint-1/stories/1-2-tasks.yaml

Processing story 1-3: Password Reset...
  Loading specs: backend-spec.md, ux-spec.md, ui-spec.md
  Loading standards: 9 files
  Generated 7 tasks (4-5 hours estimated)
  Saved to: .bmad/sprint-artifacts/sprint-1/stories/1-3-tasks.yaml

Processing story 1-4: User Profile...
  Loading specs: backend-spec.md, ux-spec.md, ui-spec.md
  Loading standards: 10 files
  Generated 9 tasks (5-7 hours estimated)
  Saved to: .bmad/sprint-artifacts/sprint-1/stories/1-4-tasks.yaml

Processing story 1-5: Account Settings...
  Loading specs: backend-spec.md, ux-spec.md, ui-spec.md
  Loading standards: 8 files
  Generated 6 tasks (3-4 hours estimated)
  Saved to: .bmad/sprint-artifacts/sprint-1/stories/1-5-tasks.yaml

✓ Sprint breakdown complete!

Summary:
- 5 stories processed
- 36 tasks generated
- 19-26 hours estimated

Task Distribution:
- Setup: 10 tasks
- Implementation: 15 tasks
- Testing: 7 tasks
- Documentation: 5 tasks
- Review: 5 tasks

Most Referenced Standards:
- global/coding-style.md (25 references)
- global/error-handling.md (20 references)
- backend/api.md (15 references)
- testing/test-writing.md (12 references)

Most Referenced Specs:
- technical/backend-spec.md (28 references)
- design/ux-spec.md (18 references)
- design/ui-spec.md (12 references)

Summary saved to: .bmad/sprint-artifacts/sprint-1/breakdown-summary.md

Next Steps:
1. Review generated tasks in .bmad/sprint-artifacts/sprint-1/stories/
2. Adjust task breakdown if needed (edit YAML files)
3. Run /bmad:bring-to-life to start implementation
```
