---
description: Initialize a new BMM project by determining level, type, and creating workflow path (START HERE!)
---

# Workflow Init - Project Setup

Welcome to BMAD Method! This workflow will set up your project's workflow tracking system based on your project type, complexity, and goals.

## What This Does

This command:
1. Scans for existing work (PRDs, code, stories, etc.)
2. Helps you choose the right workflow path (Quick Flow, Method, or Enterprise)
3. Creates a `bmm-workflow-status.yaml` file to track your progress
4. Tells you what to do next

## Prerequisites

You must have run the BMAD plugin installation first:
```bash
bmad-install
```

This creates `.bmad/config.yaml` in your project.

## Instructions

### Step 1: Load Configuration

Read configuration from `.bmad/config.yaml`:
```yaml
output_folder: bmad-output
user_name: Your Name
```

Store these values for use throughout the workflow.

### Step 2: Comprehensive Project Scan

Perform a thorough scan for existing work. Check BOTH `{output_folder}/` and the project root.

**Check for BMM planning artifacts:**
- PRD files: `*prd*.md` or `*prd*/index.md`
- Tech-spec files: `*tech-spec*.md` or `*spec*.md`
- Epic files: `*epic*.md` or `*epic*/index.md`
- Architecture: `*architecture*.md` or `*arch*.md`
- UX Design: `*ux*.md` or `*design*.md`
- Product Brief: `*brief*.md`
- Research docs: `*research*.md`
- Brainstorm docs: `*brainstorm*.md`

**Check for implementation artifacts:**
- Story files: `stories/*.md` or `**/stories/*story*.md`
- Sprint status: `*sprint-status.yaml` or `sprint-status.yaml`
- Workflow status: `bmm-workflow-status.yaml`

**Check for codebase:**
- Source directories: `src/`, `lib/`, `app/`, `components/`, etc.
- Package files: `package.json`, `requirements.txt`, `Cargo.toml`, `go.mod`, `pom.xml`
- Git repository: `.git/`
- Framework config: `next.config.js`, `vite.config.js`, etc.

**Analyze and categorize project state:**
- **STATE 1:** Clean slate (no artifacts, no code or scaffold only)
- **STATE 2:** Planning in progress (has PRD or tech-spec, no implementation)
- **STATE 3:** Implementation in progress (has stories or sprint status)
- **STATE 4:** Legacy codebase (has code but no BMM artifacts)
- **STATE 5:** Partial/unclear (some artifacts, state unclear)

### Step 3: Get Project Name

Use AskUserQuestion to ask for the project name:
```yaml
questions:
  - question: "What's your project called?"
    header: "Project Name"
    multiSelect: false
    options:
      - label: "[User will type custom name]"
        description: "Enter your project name in the 'Other' field"
```

Store `project_name`.

### Step 4: Validate Project State with User

Based on the detected state, present appropriate options:

**If STATE 1 (Clean slate):**
```
Perfect! This looks like a fresh start.
```
Set `new_project = true`, continue to Step 5 (ask about their work).

**If STATE 2 (Planning artifacts found):**
Display what was found (PRD, architecture, etc. with file paths and modification dates).

Use AskUserQuestion:
```yaml
questions:
  - question: "What's your situation with these documents?"
    header: "Planning Status"
    multiSelect: false
    options:
      - label: "Continue this work"
        description: "These docs describe what I'm building now"
      - label: "Override/replace"
        description: "These are old, I'm starting something NEW"
      - label: "Already done"
        description: "This work is complete, I'm starting a NEW project"
      - label: "Not sure"
        description: "Let me explain my situation"
```

Handle responses:
- **Continue:** Set `continuing_existing_planning = true`, store artifacts, jump to Step 7 (detect track)
- **Override/replace:** Ask if they want to archive old docs, then set `new_project = true`, continue to Step 5
- **Already done:** Ask if they want to archive, then set `new_project = true`, continue to Step 5
- **Not sure:** Get more info via AskUserQuestion, guide them to appropriate choice

**If STATE 3 (Implementation in progress):**
Display found implementation work (stories, sprint status, etc.).

Use AskUserQuestion:
```yaml
questions:
  - question: "What's happening here?"
    header: "Implementation"
    multiSelect: false
    options:
      - label: "Continue implementation"
        description: "I'm still working on these stories"
      - label: "Completed"
        description: "This work is done, starting something NEW"
      - label: "Abandoned"
        description: "Stopping this, starting over"
      - label: "Not sure"
        description: "Let me explain"
```

Handle **Continue implementation:**
- Check if `bmm-workflow-status.yaml` exists
- If yes: Tell user they're already set up, run `/bmad:workflow-status` to see progress. Exit workflow.
- If no: Set `migrating_legacy_project = true`, store artifacts, jump to Step 7

Handle **Completed/Abandoned:** Offer to archive, then `new_project = true`, continue to Step 5.

**If STATE 4 (Legacy codebase):**
```
I see you have an existing codebase:

[List found code structure]

No BMM artifacts found - this project hasn't used BMAD Method yet.

💡 Note for brownfield projects:
You'll need to run /bmad:phase-1:document-project workflow before planning.
This analyzes your codebase and creates documentation that AI agents can use.
```

Set `field_type = "brownfield"`, `new_project = true`, continue to Step 5.

**If STATE 5 (Partial/unclear):**
Ask user what they're trying to do, analyze response, guide to appropriate path.

### Step 5: Ask User About Their Work (New Projects Only)

Skip this step if `continuing_existing_planning` or `migrating_legacy_project`.

Use AskUserQuestion to gather free-form description:
```yaml
questions:
  - question: "Tell me about what you're working on. What's the goal?"
    header: "Project Goal"
    multiSelect: false
    options:
      - label: "[User will describe in 'Other' field]"
        description: "Describe your project goals"
```

Analyze the description for:
- **Field type detection:**
  - Brownfield keywords: "existing", "current", "add to", "modify", "enhance", "refactor"
  - Greenfield keywords: "new", "build", "create", "from scratch", "start"
  - If codebase found: Default to brownfield unless user says "scaffold"

- **Project type detection:**
  - Game keywords: "game", "player", "level", "gameplay", "rpg", "fps", "puzzle"
  - Default to "software"

**If codebase exists and field type unclear:**
Ask user:
```yaml
questions:
  - question: "I see you have existing code here. Are you:"
    header: "Code Type"
    multiSelect: false
    options:
      - label: "Adding to/modifying existing code"
        description: "Brownfield - working with existing codebase"
      - label: "Starting fresh with scaffold"
        description: "Greenfield - scaffold is just a template"
      - label: "Something else"
        description: "Let me clarify"
```

**If project_type == game:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎮 GAME DEVELOPMENT DETECTED

Game development workflows are part of the BMad Game Development (BMGD) module.

BMM module is designed for software development. For game development, you'll need
the BMGD module which provides specialized game workflows and agents.

Would you like to:
a) Install BMGD module now (recommended for game projects)
b) Continue with BMM workflows (for software projects only)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

If (a): Provide installation instructions and exit.
If (b): Override to software, continue.

Store: `user_description`, `field_type`, `project_type`.

### Step 6: Offer Optional Discovery Workflows

```yaml
questions:
  - question: "Would you like to brainstorm or research before planning?"
    header: "Discovery"
    multiSelect: false
    options:
      - label: "Yes, brainstorm first"
        description: "Creative exploration and idea generation"
      - label: "Yes, research first"
        description: "Technical research, competitive analysis"
      - label: "Yes, both"
        description: "Brainstorm and research"
      - label: "No, I'm ready to plan"
        description: "Skip to planning workflows"
```

Set `brainstorm_requested` and `research_requested` based on choice.

### Step 7: Track Selection with Education

**If continuing existing planning or migrating:**
Auto-detect track from artifacts:
- Has PRD + Architecture → BMad Method
- Has PRD only → BMad Method
- Has tech-spec only → Quick Flow
- Has Security/DevOps docs → Enterprise Method

Display detected track and ask for confirmation.

**If new project:**
Present detailed explanation of each track:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 BMad Quick Flow - Fast Implementation Path

⏱️ Time: Hours to 1 day of planning
📝 Approach: Tech-spec focused - just enough detail to start coding
✅ Best for: Simple features, bug fixes, scope is crystal clear
⚠️ Trade-off: Less upfront planning = higher risk of rework
🤖 Agent Support: Basic - AI will have minimal context

Example: "Fix login bug" or "Add export button"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 BMad Method - Full Product Planning (RECOMMENDED)

⏱️ Time: 1-3 days of planning
📝 Approach: PRD + UX + Architecture - complete product and system design
✅ Best for:
  - GREENFIELD: Products, platforms, multi-feature initiatives
  - BROWNFIELD: Complex additions (new UIs + APIs, major refactors, new modules)

✅ Benefits:
  - AI agents have COMPLETE context for better code generation
  - Architecture distills massive codebases into focused solution design
  - Prevents architectural drift and ensures consistency
  - Fewer surprises and less rework during implementation
  - Faster overall delivery (planning investment pays off!)
  - Better code quality and maintainability

🤖 Agent Support: Exceptional - AI becomes a true coding partner

Example: "User dashboard with analytics" or "Payment integration system"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏢 BMad Enterprise Method - Extended Enterprise Planning

⏱️ Time: 3-7 days of planning
📝 Approach: BMad Method + Security Architecture + DevOps + Test Strategy
✅ Best for: Enterprise requirements, compliance, multi-tenant, mission-critical
✅ Benefits: All of BMad Method PLUS specialized planning for:
  - Security architecture and threat modeling
  - DevOps pipeline and infrastructure planning
  - Comprehensive test strategy
  - Compliance and audit requirements

🤖 Agent Support: Elite - comprehensive planning for complex enterprise systems

Example: "Multi-tenant SaaS platform" or "HIPAA-compliant patient portal"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Generate recommendation based on `user_description` and `field_type`:
- Complex keywords (dashboard, platform, system, integration) → Recommend Method
- Simple keywords (fix, bug, add button) → Mention Quick Flow
- Enterprise keywords (multi-tenant, compliance, security) → Recommend Enterprise
- Brownfield + complex → Strongly recommend Method (explain architecture benefit)

```yaml
questions:
  - question: "Which approach fits your situation?"
    header: "Track"
    multiSelect: false
    options:
      - label: "BMad Quick Flow"
        description: "Fast, minimal planning (I accept rework risk)"
      - label: "BMad Method (RECOMMENDED)"
        description: "Full planning for better AI results"
      - label: "BMad Enterprise Method"
        description: "Extended planning for enterprise needs"
      - label: "I'm not sure"
        description: "Help me decide"
```

If "not sure", gather more info and provide tailored guidance.

Map choice to track name:
- BMad Quick Flow → `"quick-flow"`
- BMad Method → `"method"`
- BMad Enterprise Method → `"enterprise"`

Store `selected_track`.

### Step 8: Product Brief Question (Greenfield Method/Enterprise Only)

Skip if `field_type == brownfield` OR `selected_track == quick-flow`.

If `field_type == greenfield` AND `selected_track` in [method, enterprise]:

```
One more optional workflow for greenfield projects:

📋 Product Brief - Strategic product planning document

This is OPTIONAL but recommended for greenfield BMad Method projects.
It helps you articulate:
  - Product vision and unique value proposition
  - Target users and their needs
  - Success criteria and goals
  - Market positioning and strategy

This comes BEFORE your PRD and helps inform it with strategic thinking.

Would you like to include Product Brief in your workflow?
```

```yaml
questions:
  - question: "Include Product Brief in your workflow?"
    header: "Product Brief"
    multiSelect: false
    options:
      - label: "Yes, include Product Brief"
        description: "Strategic planning before PRD"
      - label: "No, skip to PRD"
        description: "Go directly to PRD"
```

Store `product_brief_requested`.

### Step 9: Load Workflow Path and Build Status Structure

Determine path file based on `selected_track` and `field_type`:

**Path file mapping:**
- `quick-flow` + `greenfield` → Read workflow path from workflow paths (will need to be converted)
- `quick-flow` + `brownfield` → Quick flow brownfield path
- `method` + `greenfield` → Method greenfield path
- `method` + `brownfield` → Method brownfield path
- `enterprise` + `greenfield` → Enterprise greenfield path
- `enterprise` + `brownfield` → Enterprise brownfield path

**NOTE:** For Claude Code version, these path files will need to be converted to simple YAML or JSON format that can be easily read.

For now, create a basic structure:

**For Method track (most common):**
```yaml
phases:
  - name: "Phase 0: Discovery"
    optional: true
    workflows:
      - id: "brainstorm-project"
        name: "Brainstorm"
        agent: "analyst"
        status: "optional"
        include_if: brainstorm_requested
      - id: "research"
        name: "Research"
        agent: "analyst"
        status: "optional"
        include_if: research_requested
      - id: "product-brief"
        name: "Product Brief"
        agent: "pm"
        status: "optional"
        include_if: product_brief_requested

  - name: "Phase 1: Planning"
    workflows:
      - id: "prd"
        name: "PRD"
        agent: "pm"
        status: "required"
      - id: "validate-prd"
        name: "Validate PRD"
        agent: "pm"
        status: "optional"

  - name: "Phase 2: Solutioning"
    workflows:
      - id: "architecture"
        name: "Architecture"
        agent: "architect"
        status: "required"
      - id: "create-epics-and-stories"
        name: "Create Epics and Stories"
        agent: "pm"
        status: "required"

  - name: "Phase 3: Implementation"
    workflows:
      - id: "sprint-planning"
        name: "Sprint Planning"
        agent: "sm"
        status: "required"
      - id: "epic-tech-context"
        name: "Epic Tech Context"
        agent: "architect"
        status: "required"
      - id: "create-story"
        name: "Create Story"
        agent: "dev"
        status: "required"
      - id: "story-context"
        name: "Story Context"
        agent: "dev"
        status: "required"
      - id: "dev-story"
        name: "Dev Story"
        agent: "dev"
        status: "required"
```

Scan for existing completed workflows:
- Brainstorm: `{output_folder}/brainstorm*.md`
- Research: `{output_folder}/research*.md`
- Product Brief: `{output_folder}/*brief*.md`
- PRD: `{output_folder}/*prd*.md` or `*prd*/index.md`
- Tech-spec: `{output_folder}/*tech-spec*.md`
- Epics: `{output_folder}/*epic*.md`
- UX Design: `{output_folder}/*ux*.md` or `*design*.md`
- Architecture: `{output_folder}/*architecture*.md` or `*arch*.md`
- Sprint Planning: `{output_folder}/*sprint*.yaml`

For each found file, mark that workflow as completed in the structure.

### Step 10: Present Workflow Path and Create Status File

Display the personalized workflow path:

```
Perfect! Here's your personalized BMAD workflow path:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Track: BMad Method
Field Type: greenfield
Project: My Awesome App

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Phase 1: Planning
  ✅ PRD - Product Requirements Document (pm agent)
  ⏸️ Validate PRD (optional quality check) (pm agent)

🏗️ Phase 2: Solutioning
  ⏸️ Architecture - System design document (architect agent)
  ⏸️ Create Epics and Stories - Break down PRD (pm agent)

🚀 Phase 3: Implementation
  ⏸️ Sprint Planning - Create sprint tracking (sm agent)
  ⏸️ Epic Tech Context - Technical spec for epic (architect agent)
  ⏸️ Create Story - Generate user stories (dev agent)
  ⏸️ Story Context - Assemble implementation context (dev agent)
  ⏸️ Dev Story - Implement story (dev agent)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

If existing artifacts found, show them as completed.

Ask for confirmation:
```yaml
questions:
  - question: "Ready to create your workflow tracking file?"
    header: "Confirm"
    multiSelect: false
    options:
      - label: "Yes, create it"
        description: "Create bmm-workflow-status.yaml"
      - label: "No, cancel"
        description: "Exit without creating file"
```

If yes:

1. Create YAML structure:
```yaml
# BMad Method Workflow Status
# Generated: 2025-01-13T...

project: "My Awesome App"
project_type: "software"
project_level: 2
field_type: "greenfield"
workflow_path: "method-greenfield"
generated: "2025-01-13T..."

workflow_status:
  # Phase 1: Planning
  prd: required  # agent: pm
  validate-prd: optional  # agent: pm

  # Phase 2: Solutioning
  architecture: required  # agent: architect
  create-epics-and-stories: required  # agent: pm

  # Phase 3: Implementation
  sprint-planning: required  # agent: sm
  epic-tech-context: required  # agent: architect
  create-story: required  # agent: dev
  story-context: required  # agent: dev
  dev-story: required  # agent: dev
```

2. For any found artifacts, replace status with file path only:
```yaml
prd: docs/PRD.md  # agent: pm
```

3. Write to `{output_folder}/bmm-workflow-status.yaml`

4. Identify first non-completed workflow

5. Display success message:
```
✅ Workflow tracking created: bmad-output/bmm-workflow-status.yaml

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Next Workflow: prd
Agent: PM (Product Manager)
Command: /bmad:phase-2:prd

What it does: Create Product Requirements Document for your project

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Happy building with BMAD Method! 🚀

To check your progress anytime:
  /bmad:workflow-status
```

If no:
```
No problem! You can run workflow-init again anytime you're ready.

To get started later:
  /bmad:meta:workflow-init
```

## Output Files

- `{output_folder}/bmm-workflow-status.yaml` - Workflow tracking file
- Optionally: Archived old documents in `{output_folder}/archive/`

## Notes

- This is always the first workflow to run for new projects
- Can be run again to reset/reinitialize workflow tracking
- Automatically detects and preserves existing work
- Brownfield projects should run `/bmad:phase-1:document-project` before planning workflows
- The workflow status file tracks progress through all subsequent workflows

## Next Steps

After workflow-init completes:
1. Run the recommended next workflow (displayed at the end)
2. Check progress anytime with `/bmad:workflow-status`
3. Follow the workflow path in sequence for best results
