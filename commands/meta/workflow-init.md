---
description: Initialize a new BMM project by determining level, type, and creating workflow path (START HERE!)
---

# Workflow Init - Project Setup

Welcome to BMAD Method! This workflow sets up your project's workflow tracking system based on your project type, complexity, and goals.

## Purpose

Scans for existing work (PRDs, code, stories), helps you choose the right workflow path (Quick Flow, Method, or Enterprise), creates `bmm-workflow-status.yaml` file to track progress, and tells you what to do next.

**Key Principle:** Detect project state, guide to appropriate track, establish tracking foundation.

## Quick Start

```bash
# Prerequisites: BMAD plugin installed (bmad-install)
/bmad:meta:workflow-init

# Workflow will:
# 1. Scan for existing work (PRDs, code, stories, etc.)
# 2. Detect project state (clean slate, planning, implementation, legacy)
# 3. Validate state with user
# 4. Get project details (name, type, domain)
# 5. Determine appropriate track (Quick Flow, Method, Enterprise)
# 6. Create bmm-workflow-status.yaml tracking file
# 7. Guide to next step
```

## Prerequisites

See [shared/prerequisites.md#meta-workflow-init](../shared/prerequisites.md)

**Workflow-specific:**
- [ ] BMAD plugin installed (`bmad-install` creates `.bmad/config.yaml`)

## Instructions

### 1. Load Configuration

See [shared/common-operations.md#load-configuration](../shared/common-operations.md)

Read from `.bmad/config.yaml`:
- `output_folder`, `sprint_artifacts`, `bmad_folder`
- `document_output_language`, `communication_language`
- `user_name`, `project_name`, `user_skill_level`

**Validation:**
- Verify `.bmad/config.yaml` exists
- Verify required fields present
- If config incomplete, warn user to reinstall BMAD plugin

### 2. Comprehensive Project Scan

Perform thorough scan for existing work in both `{output_folder}/` and project root.

**Check for BMM planning artifacts:**
- PRD files: `*prd*.md` or `*prd*/index.md`
- Tech-spec files: `*tech-spec*.md` or `*spec*.md`
- Epic files: `*epic*.md` or `*epic*/index.md`
- Architecture: `*architecture*.md` or `*arch*.md`
- UX Design: `*ux*.md` or `*design*.md`
- Product Brief: `*brief*.md`
- Research/brainstorm docs

**Check for implementation artifacts:**
- Story files: `stories/*.md` or `**/stories/*story*.md`
- Sprint status: `*sprint-status.yaml`
- Workflow status: `bmm-workflow-status.yaml`

**Check for codebase:**
- Source directories: `src/`, `lib/`, `app/`, `components/`
- Package files: `package.json`, `requirements.txt`, `Cargo.toml`, `go.mod`, `pom.xml`
- Git repository: `.git/`
- Framework config: `next.config.js`, `vite.config.js`, etc.

**Analyze and categorize project state:**
- **STATE 1:** Clean slate (no artifacts, no code or scaffold only)
- **STATE 2:** Planning in progress (has PRD or tech-spec, no implementation)
- **STATE 3:** Implementation in progress (has stories or sprint status)
- **STATE 4:** Legacy codebase (has code but no BMM artifacts)
- **STATE 5:** Partial/unclear (some artifacts, state unclear)

### 3. Validate Project State with User

Based on detected state, present appropriate options using AskUserQuestion tool.

**If STATE 1 (Clean slate):**
```
Perfect! This looks like a fresh start.
```
Set `new_project = true`, continue to Step 4.

**If STATE 2 (Planning artifacts found):**
Display what was found (PRD, architecture, etc. with file paths and modification dates).

Ask: "What's your situation with these documents?"
- Option 1: Continue this work → Set `continuing_existing_planning = true`, jump to Step 6
- Option 2: Override/replace → Ask to archive, set `new_project = true`, continue to Step 4
- Option 3: Already done → Ask to archive, set `new_project = true`, continue to Step 4
- Option 4: Not sure → Get more info, guide to appropriate choice

**If STATE 3 (Implementation in progress):**
Display found implementation work.

Ask: "What's happening here?"
- Option 1: Continue implementation → Set `continuing_implementation = true`, jump to Step 7
- Option 2: Completed → Ask to archive, set `new_project = true`, continue to Step 4
- Option 3: Abandoned → Set `new_project = true`, continue to Step 4
- Option 4: Not sure → Get more info, guide to choice

**If STATE 4 (Legacy codebase):**
Display codebase info (framework, languages, size).

Ask: "What are you doing with this codebase?"
- Option 1: Document it → Route to documentation workflow
- Option 2: Add feature → Quick Flow track
- Option 3: Major overhaul → Method track
- Option 4: New greenfield → New project

**If STATE 5 (Partial/unclear):**
Display all found artifacts, ask user to explain situation, guide to appropriate path.

### 4. Get Project Details (New Projects Only)

**Get project name:**
Use AskUserQuestion: "What's your project called?"

**Get project type:**
Ask: "What are you building?"
- Options: Web app (SaaS/B2B/B2C), Mobile app (iOS/Android/Cross-platform), API/Backend service, Desktop app, Browser extension, CLI tool, Library/SDK, Data pipeline/ETL, AI/ML system, Blockchain/Web3, IoT/Embedded, Game, Other

**Get domain complexity:**
Ask: "Does your project involve any specialized domains?"
- Options: Healthcare (HIPAA), Finance (PCI-DSS), Legal/Compliance, Education, Government, E-commerce, Real-time systems, IoT, AI/ML, Blockchain, Gaming, Social media, None of these

Store: `project_name`, `project_type`, `domain_complexity`

### 5. Determine Track and Create Workflow Status

**Track routing logic:**

**Quick Flow Track** (Fastest):
- Single feature or bug fix
- Existing codebase
- 1-3 day work

**BMad Method Track** (Standard):
- New product or major feature
- Moderate complexity
- Weeks to months
- Full planning desired

**Enterprise Method Track** (Comprehensive):
- Complex domain (healthcare, finance, compliance)
- Enterprise scale
- Extended planning needed
- High stakes/regulations

**Route based on:**
- Project type + domain complexity
- User answers
- Detected state

Ask user to confirm track selection.

### 6. Create bmm-workflow-status.yaml

**File path:** `{output_folder}/bmm-workflow-status.yaml`

**Structure:**

```yaml
# BMad Method Workflow Status
# Generated: {date}

project_name: "{project_name}"
project_track: "{Quick Flow | BMad Method | Enterprise Method}"
project_type: "{project_type}"
domain_complexity: "{domain_complexity}"

workflow_status:
  workflow-init: completed
  product-brief: {not-started | in-progress | completed}
  prd: {not-started | in-progress | completed | path/to/PRD.md}
  tech-spec: {not-started | in-progress | completed | path/to/tech-spec.md}
  architecture: {not-started | in-progress | completed | path/to/architecture.md}
  create-epics-and-stories: {not-started | in-progress | completed | path/to/epics.md}

phase_completion:
  phase_1_planning: {not-started | in-progress | completed}
  phase_2_requirements: {not-started | in-progress | completed}
  phase_3_architecture: {not-started | in-progress | completed}
  phase_4_implementation: {not-started | in-progress | completed}

current_phase: "{phase_1_planning | phase_2_requirements | etc.}"
```

**If continuing existing work:**
- Pre-populate workflow_status with found artifacts
- Set appropriate phase_completion states
- Set current_phase based on progress

**If new project:**
- Initialize all to "not-started"
- Set current_phase based on track

### 7. Report and Guide Next Steps

**For new projects:**

```
✅ Project initialized: {project_name}

**Track:** {track_name}
**Type:** {project_type}
**Domain:** {domain_complexity}

**Status file created:** {output_folder}/bmm-workflow-status.yaml

**Next Steps:**

{QUICK FLOW}
1. Run /bmad:phase-2:tech-spec to define your feature
2. Run /bmad:phase-4:dev-story to implement

{BMAD METHOD}
1. Run /bmad:phase-1:product-brief to clarify your vision
2. Run /bmad:phase-2:prd to create requirements
3. Run /bmad:phase-3:architecture for system design

{ENTERPRISE METHOD}
1. Run /bmad:phase-1:product-brief for vision
2. Run /bmad:phase-1:domain-research for compliance research
3. Run /bmad:phase-2:prd for comprehensive requirements
4. Run /bmad:phase-3:architecture for system design

Run /bmad:workflow-status anytime to see your progress.
```

**For continuing work:**

```
✅ Project status loaded: {project_name}

**Current Phase:** {current_phase}
**Track:** {track_name}

**Progress:**
{list of completed workflows}

**Next Recommended Step:**
{next appropriate workflow based on progress}

Run /bmad:workflow-status for detailed status.
```

## Key Constraints

- **State detection:** Scan comprehensively, detect state accurately
- **User validation:** Always confirm detected state with user
- **Track routing:** Guide to appropriate track based on type and complexity
- **Status tracking:** Create workflow status file for progress tracking
- **Clear guidance:** Tell user exactly what to do next
- **Resume support:** Can resume existing work, not just start new projects

## Notes

- **START HERE:** This is the first workflow to run for any BMAD project
- **Smart detection:** Scans for existing work, doesn't assume clean slate
- **Track routing:** Guides to Quick Flow, Method, or Enterprise based on needs
- **Flexible:** Supports new projects, resuming work, or documenting legacy code
- **Status file:** Central tracking for all workflow progress
- **No auto-continue:** User should review initialization before proceeding

**Philosophy:** Meet users where they are. Detect existing work, validate state, guide to appropriate track, establish tracking foundation, provide clear next steps.

---

**References:**
- Examples: [examples/workflow-init-examples.md](../examples/workflow-init-examples.md)
- Troubleshooting: [shared/troubleshooting.md#workflow-init](../shared/troubleshooting.md)
- Philosophy: [shared/design-philosophy.md#track-routing](../shared/design-philosophy.md)
- Common Operations: [shared/common-operations.md](../shared/common-operations.md)
