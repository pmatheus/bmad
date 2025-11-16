---
description: Transform PRD requirements into bite-sized stories organized in epics for AI-agent implementation
---

# Create Epics and Stories

Breaks down Product Requirements Document (PRD) into implementable epics and user stories. Delegates to the **bmad-pm** (Product Manager) subagent for requirements analysis, epic structure design, and story decomposition with BDD acceptance criteria.

## Purpose

Creates comprehensive epic breakdown with natural groupings based on business value, vertically-sliced stories sized for single AI-agent completion, sequential ordering with no forward dependencies, and proper foundation establishment in Epic 1.

**Key Principle:** Vertical slicing (complete features, not horizontal layers), Epic 1 establishes foundation, stories sized for 2-4 hour AI-agent sessions.

## Quick Start

```bash
# Prerequisites: PRD.md exists in output folder
/bmad:phase-2:create-epics-and-stories

# Workflow will:
# 1. Load PRD and extract requirements
# 2. Delegate to bmad-pm (Product Manager agent)
# 3. Propose epic structure for validation
# 4. Decompose epics into BDD stories
# 5. Validate FR coverage and quality
# 6. Create epics.md
# 7. Auto-continue to sprint-planning
```

## Prerequisites

See [shared/prerequisites.md#phase-2-create-epics](../shared/prerequisites.md)

**Workflow-specific:**
- [ ] PRD.md must exist (run `/bmad:phase-2:prd` first)
- [ ] (Optional) Product brief and domain brief for context

## Instructions

### 1. Validate Prerequisites and Load Configuration

**Validate PRD exists:**
- Try whole document: `{output_folder}/*prd*.md`
- Try sharded version: `{output_folder}/prd/index.md`
- If not found → Error: "PRD.md not found. Run /bmad:phase-2:prd first."

**Check if epics already completed:**
- If yes → Ask user if they want to overwrite

See [shared/common-operations.md#load-configuration](../shared/common-operations.md)

Extract: `project_name`, `output_folder`, `user_name`, `communication_language`, `document_output_language`, `user_skill_level`, `project_track`

### 2. Delegate to Product Manager Subagent

See [shared/common-operations.md#delegate-to-subagent](../shared/common-operations.md)

**Task Configuration:**
- **subagent_type:** `"bmad-pm"`
- **description:** `"Break down PRD into epics and stories"`
- **prompt:** Delegation prompt (see template below)

**Delegation Prompt Template:**

```
**Project Context:**
- Project Name: {project_name}
- Project Track: {project_track}
- Output Folder: {output_folder}
- User Name: {user_name}

**Input Documents:**
- PRD: {prd_file_path} (required - LOAD THIS FIRST)
{if_product_brief_exists}
- Product Brief: {product_brief_path}
{endif}
{if_domain_brief_exists}
- Domain Brief: {domain_brief_path}
{endif}

**Configuration:**
- Communication Language: {communication_language}
- Document Output Language: {document_output_language}
- User Skill Level: {user_skill_level}

**Your Task:**

1. **Load and Analyze PRD**:
   - Read complete PRD.md (or index.md if sharded)
   - Extract all functional requirements (FRs)
   - Extract non-functional requirements (NFRs)
   - Understand project type and domain complexity
   - Note "product magic" and success criteria
   - Identify MVP vs Growth vs Vision scope boundaries

2. **Propose Epic Structure**:
   - Analyze requirements to find natural epic groupings
   - Name epics based on VALUE, not technical layers
     - Good: "User Onboarding", "Content Discovery", "Compliance Framework"
     - Avoid: "Database Layer", "API Endpoints", "Frontend"
   - Each epic should:
     - Have clear business goal and user value
     - Be independently valuable
     - Contain 3-8 related capabilities
     - Be deliverable in cohesive phase
   - **CRITICAL for Epic 1:** Must establish foundation
     - Story 1.1: Project setup, infrastructure, deployment pipeline
     - Creates baseline for all subsequent work
   - Present proposed structure to user for validation

3. **Decompose Each Epic into Stories**:
   - Break down each epic into bite-sized stories
   - Stories sized for single AI-agent session (2-4 hours)
   - Use BDD format for acceptance criteria:

     **Story Pattern:**
     As a [user type],
     I want [specific capability],
     So that [clear value/benefit].

     **Acceptance Criteria:**
     Given [precondition]
     When [action]
     Then [expected outcome]
     And [additional criteria]

     **Prerequisites:** [Only previous stories - never forward dependencies]

     **Technical Notes:** [Implementation guidance, affected components]

   - Ensure stories are:
     - Vertically sliced (complete feature, not layers)
     - Sequentially ordered (logical progression)
     - Independently valuable when possible
     - Small enough for single-session completion
     - Clear enough for autonomous implementation

4. **Create Living Document**:
   - Write to {output_folder}/epics.md continuously as you work
   - Use epic breakdown template structure
   - Include epic overview summary at the top
   - Number stories as Epic.Story (e.g., 1.1, 1.2, 2.1)

5. **Validate Coverage and Quality**:
   - Ensure all FRs from PRD covered by stories
   - Verify Epic 1 establishes proper foundation
   - Check all stories are vertically sliced
   - Confirm no forward dependencies
   - Validate story sizing appropriate
   - Ensure BDD acceptance criteria clear and testable
   - Verify domain/compliance requirements distributed properly

6. **Review with User**:
   - Present complete epic breakdown
   - Confirm epic structure makes sense
   - Validate story breakdown is actionable
   - Get approval before finalizing

**Output File:**
- {output_folder}/epics.md (required)

**Template Structure:**

```markdown
# {project_name} - Epic Breakdown

**Author:** {user_name}
**Date:** {current_date}

## Overview

[Epic summary with count and high-level groupings]

---

## Epic 1: [Foundation Epic Title]

[Epic goal and value statement]

### Story 1.1: [Project Setup and Infrastructure]

As a [developer/team],
I want [project initialization and core infrastructure],
So that [we have a foundation for building features].

**Acceptance Criteria:**

**Given** [clean slate or existing repo]
**When** [setup is executed]
**Then** [project structure, build system, deployment pipeline ready]

**And** [core dependencies configured]
**And** [basic CI/CD pipeline functional]

**Prerequisites:** None (this is the foundation)

**Technical Notes:** [Specific setup requirements, tech stack initialization]

### Story 1.2: [Next Foundation Story]

[Continue pattern...]

---

## Epic 2: [Second Epic Title]

[Epic goal and value statement]

### Story 2.1: [First Story Title]

[Continue BDD pattern...]

---

[Additional epics...]
```

**Validation Checklist:**
Before completing, verify:
- [ ] All FRs from PRD.md mapped to stories
- [ ] Epic 1 establishes foundation (Story 1.1 is setup)
- [ ] All stories vertically sliced
- [ ] No forward dependencies (stories only reference previous work)
- [ ] BDD acceptance criteria clear and testable
- [ ] Story sizing appropriate (2-4 hour sessions)
- [ ] Epic groupings make business sense
- [ ] Sequential ordering enables incremental value delivery

**When complete**, report back:
- Number of epics created
- Number of stories per epic
- FR coverage confirmation
- Any risks or dependencies identified
- Recommended next step (architecture workflow)
```

### 3. Update Workflow Status and Report

**If workflow status file exists:**
1. Read `{output_folder}/bmm-workflow-status.yaml`
2. Update `workflow_status.create-epics-and-stories` to: `{output_folder}/epics.md`
3. Save file, preserving all comments and structure

**Report to user:**
```
✅ Epic Breakdown Complete!

Created:
- {output_folder}/epics.md
  - {epic_count} epics
  - {story_count} total stories
  - All FRs from PRD covered

Summary:
{epic_summary}

Next Steps:
1. Run /bmad:phase-3:architecture to create technical architecture
2. Run /bmad:phase-4:epic-tech-context to create technical specs for epics
3. Run /bmad:workflow-status to see your project status

Epic 1 establishes the foundation - ready for architecture decisions!
```

### 4. Auto-Continue to Sprint Planning

**Purpose:** Enable seamless workflow continuation to sprint planning.

**Check prerequisites:**
- epics.md exists? ✓ (just created)
- User input needed? ✗ (sprint-planning auto-generates tracking)
- Configuration exists? ✓

**If workflow status file exists AND epics.md created successfully:**

```
🚀 Auto-continuing to sprint planning...

Sprint planning will create tracking file for your {story_count} stories.
```

**Execute next workflow:**
Use SlashCommand tool with command: `/bmad:phase-4:sprint-planning`

**CRITICAL:** DO NOT ask user permission to continue. Sprint planning requires no user input and should run automatically.

## Key Constraints

- **Vertical slicing:** Each story delivers complete, testable functionality across all layers
- **Sequential dependencies:** No forward dependencies (story can only depend on previous stories)
- **Epic 1 foundation:** Story 1.1 always establishes project setup, infrastructure, deployment
- **BDD format:** Given-When-Then acceptance criteria for clarity and testability
- **Story sizing:** 2-4 hour AI-agent sessions
- **Value-based epics:** Epic names describe business value, not technical layers
- **FR coverage:** All functional requirements from PRD mapped to stories

## Auto-Continue

**ALWAYS auto-continue** to sprint-planning after epic breakdown completes.

Sprint planning creates tracking file from epics.md. No user input needed. This maintains workflow momentum.

## Notes

- **Vertical vs horizontal:** Stories deliver complete features (DB + API + UI), not just one layer
- **Epic 1 critical:** Always establishes foundation - enables all subsequent work
- **BDD clarity:** Given-When-Then format makes requirements testable and guides implementation
- **PM agent expertise:** bmad-pm specializes in requirements analysis and decomposition
- **No forward deps:** Stories build on previous work only, enables incremental delivery
- **Story sizing:** Right-sized for single AI-agent session (2-4 hours)

**Philosophy:** Epic breakdown transforms requirements into implementable units. Vertical slicing ensures complete features. Epic 1 foundation enables systematic building. BDD acceptance criteria guide autonomous implementation. Sequential ordering enables incremental value delivery.

---

**References:**
- Examples: [examples/create-epics-examples.md](../examples/create-epics-examples.md)
- Troubleshooting: [shared/troubleshooting.md#create-epics](../shared/troubleshooting.md)
- Philosophy: [shared/design-philosophy.md#vertical-slicing](../shared/design-philosophy.md)
- Common Operations: [shared/common-operations.md](../shared/common-operations.md)
