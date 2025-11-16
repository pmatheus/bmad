---
description: Transform PRD requirements into bite-sized stories organized in epics for AI-agent implementation
---

# Create Epics and Stories

## What This Does

Breaks down Product Requirements Document (PRD) into implementable epics and user stories. Creates a comprehensive epic breakdown document with:
- Natural epic groupings based on business value
- User stories in BDD (Behavior-Driven Development) format
- Vertical slicing (not horizontal layers)
- Sequential ordering with no forward dependencies
- Proper foundation establishment in Epic 1

This workflow delegates to the **bmad-pm** (Product Manager) subagent, which specializes in:
- Requirements analysis and decomposition
- Epic structure design
- Story sizing for AI-agent completion
- Traceability mapping (FRs → Epics → Stories)

## Prerequisites

1. BMAD plugin installed and initialized
2. Run `/bmad:meta:workflow-init` to set up project structure
3. **PRD.md must exist** in output folder (run `/bmad:phase-2:prd` first)
4. (Optional) Product brief and domain brief for additional context

## How It Works

### Process Overview

1. **Load PRD**: Read and analyze requirements from PRD.md
2. **Delegate to bmad-pm**: Launch Product Manager subagent for epic breakdown
3. **Propose Epic Structure**: PM agent identifies natural epic groupings
4. **Decompose to Stories**: Break each epic into bite-sized, implementable stories
5. **Validate Coverage**: Ensure all FRs mapped to stories, proper sequencing
6. **Create epics.md**: Comprehensive breakdown document with BDD acceptance criteria

### Story Sizing Philosophy

Stories are sized for **single AI-agent completion** in one focused session:
- Vertically sliced (complete feature, not just one layer)
- Clear acceptance criteria in BDD format
- 2-4 hour implementation estimate
- Independently testable
- No forward dependencies

### Epic 1 Foundation Principle

**Critical:** Epic 1 always establishes the foundation:
- Project setup and initialization
- Core infrastructure
- Deployment pipeline basics
- Essential dependencies
- Enables all subsequent epics

## Instructions

### Step 1: Validate Prerequisites

**Action:** Ensure PRD exists and workflow status is ready.

```yaml
# Required files
prd_file: {output_folder}/PRD.md (or sharded: {output_folder}/prd/index.md)

# Optional context
product_brief: {output_folder}/*product*brief*.md
domain_brief: {output_folder}/*domain*brief*.md

# Workflow status
status_file: {output_folder}/bmm-workflow-status.yaml
```

**Validate:**
- Check if PRD.md exists (required)
  - Try whole document: `{output_folder}/*prd*.md`
  - Try sharded version: `{output_folder}/prd/index.md`
  - If not found → Error: "PRD.md not found. Run /bmad:phase-2:prd first."
- Load workflow status if exists
- Check if epics already completed
  - If yes → Ask user if they want to overwrite

### Step 2: Load Configuration

**Action:** Read project configuration.

```yaml
# Read from .bmad/config.yaml
project_name: {config.project_name}
output_folder: {config.output_folder}
user_name: {config.user_name}
communication_language: {config.communication_language}
document_output_language: {config.document_output_language}
user_skill_level: {config.user_skill_level}
project_track: {status.project_track} (from workflow status if exists)
```

### Step 3: Launch Product Manager Subagent

**Action:** Delegate epic breakdown to the bmad-pm subagent.

**Use the Task tool with these parameters:**

```javascript
{
  "subagent_type": "bmad-pm",
  "description": "Break down PRD into epics and stories",
  "prompt": `Transform the Product Requirements Document (PRD) into a comprehensive epic and story breakdown.

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
   - Read the complete PRD.md (or index.md if sharded)
   - Extract all functional requirements (FRs)
   - Extract non-functional requirements (NFRs)
   - Understand project type and domain complexity
   - Note the "product magic" and success criteria
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
   - Use the epic breakdown template structure
   - Include epic overview summary at the top
   - Number stories as Epic.Story (e.g., 1.1, 1.2, 2.1, etc.)

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
Use the following structure for epics.md:

\`\`\`markdown
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
\`\`\`

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
`
}
```

**The PM agent will:**
- Load PRD and extract requirements
- Propose natural epic structure
- Break down each epic into stories
- Use BDD format for acceptance criteria
- Ensure vertical slicing and proper sequencing
- Validate FR coverage
- Create comprehensive epics.md
- Get user validation throughout

### Step 4: Update Workflow Status

**Action:** After PM agent completes, update workflow status.

**If workflow status file exists:**
1. Read `{output_folder}/bmm-workflow-status.yaml`
2. Update `workflow_status.create-epics-and-stories` to file path: `{output_folder}/epics.md`
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

### Step 5: Auto-Continue to Sprint Planning

**Purpose:** Enable seamless workflow continuation to sprint planning.

**Process:**

1. **Check next workflow:**
   - Next required workflow: `sprint-planning`
   - Sprint planning creates tracking file for story implementation

2. **Check prerequisites:**
   - epics.md exists? ✓ (just created)
   - User input needed? ✗ (sprint-planning auto-generates tracking from epics.md)
   - Configuration exists? ✓

3. **Auto-continue decision:**

   **IF** workflow status file exists AND epics.md created successfully:

   ```
   🚀 Auto-continuing to sprint planning...

   Sprint planning will create tracking file for your {story_count} stories.
   ```

   **Execute next workflow:**
   Use SlashCommand tool with command: `/bmad:phase-4:sprint-planning`

   **ELSE:**

   Report completion and suggest next command:
   ```
   ✅ Epic Breakdown Complete!

   Next recommended workflow: sprint-planning

   Run: /bmad:phase-4:sprint-planning

   This will create sprint status tracking for your stories.
   ```

**CRITICAL:** DO NOT ask user permission to continue. Sprint planning requires no user input and should run automatically after epic breakdown completes.

## Key Principles

### Vertical Slicing (Not Horizontal Layers)

**Bad (Horizontal):**
- Story: "Create database schema"
- Story: "Build API endpoints"
- Story: "Create UI components"

**Good (Vertical):**
- Story: "User can register account" (database + API + UI)
- Story: "User can log in" (database + API + UI)
- Story: "User can reset password" (database + API + UI)

Each story delivers **complete, testable functionality** across all layers.

### Sequential Dependencies (No Forward Dependencies)

**Bad:**
- Story 2.3 depends on Story 3.1 (forward dependency)
- Can't implement Story 2.3 until Epic 3 started

**Good:**
- Story 2.3 depends only on Stories 1.1, 1.2, 2.1, 2.2 (backward dependencies)
- Can implement epics and stories in order
- Each story builds on previous work

### Epic 1 Foundation

Every project needs a foundation. Epic 1 always includes:
- Story 1.1: Project setup, infrastructure, deployment pipeline
- Core dependencies and configuration
- Basic CI/CD pipeline
- Foundation that enables all subsequent work

**Exception:** If adding to existing application, Epic 1 adapts:
- Still establishes foundation for NEW work
- Integrates with existing infrastructure
- May be lighter-weight than greenfield

### BDD Acceptance Criteria

Use Given-When-Then format for clarity:

```
Given [precondition or initial state]
When [action or trigger]
Then [expected outcome]
And [additional criteria]
```

This format:
- Makes requirements testable
- Clarifies expected behavior
- Guides implementation
- Enables automated testing

## Validation Checklist

The PM agent validates epic breakdown ensures:

**Critical Items:**
- [ ] All FRs from PRD mapped to stories
- [ ] Epic 1 establishes foundation (Story 1.1 is setup)
- [ ] All stories vertically sliced
- [ ] No forward dependencies
- [ ] BDD acceptance criteria clear and testable
- [ ] Story sizing appropriate (2-4 hour sessions)

**Quality Checks:**
- [ ] Epic groupings based on business value
- [ ] Epic names describe value, not tech layers
- [ ] Each epic has 3-8 related capabilities
- [ ] Stories numbered as Epic.Story (1.1, 1.2, etc.)
- [ ] Prerequisites clearly stated
- [ ] Technical notes provide implementation guidance
- [ ] Domain/compliance requirements distributed
- [ ] Sequential ordering enables incremental value

**Coverage:**
- [ ] No orphaned FRs (requirements without stories)
- [ ] No orphaned stories (stories without FR connection)
- [ ] NFRs reflected in story acceptance criteria
- [ ] Innovation requirements captured
- [ ] Domain-specific requirements included

## Output Files

### epics.md

Comprehensive epic and story breakdown including:
- Overview with epic summary
- Epic groupings with value statements
- User stories in BDD format
- Numbered acceptance criteria (Given-When-Then)
- Prerequisites and dependencies
- Technical implementation notes
- FR traceability

## Examples

### Example 1: SaaS Project Management Tool

**Input (from PRD):**
- FR-001: User registration and authentication
- FR-002: Create and manage projects
- FR-003: Task creation and assignment
- FR-004: Team collaboration features
- FR-005: Reporting and analytics
- NFR: Multi-tenant architecture

**Epic Breakdown Created:**
```
Epic 1: Foundation and User Management (5 stories)
  1.1: Project setup and deployment pipeline
  1.2: User registration and authentication
  1.3: User profile management
  1.4: Team invitation system
  1.5: Multi-tenant data isolation

Epic 2: Project and Task Management (6 stories)
  2.1: Create and view projects
  2.2: Project settings and permissions
  2.3: Create and manage tasks
  2.4: Task assignment and ownership
  2.5: Task status workflow
  2.6: Task filtering and search

Epic 3: Collaboration Features (4 stories)
  3.1: Real-time notifications
  3.2: Task comments and discussions
  3.3: File attachments
  3.4: @mentions and activity feed

Epic 4: Reporting and Analytics (3 stories)
  4.1: Project progress dashboard
  4.2: Team productivity metrics
  4.3: Custom report builder
```

**Key Features:**
- Epic 1 establishes foundation (Story 1.1)
- Vertical slicing (each story complete feature)
- Sequential dependencies (no forward deps)
- All FRs covered by stories
- 18 total stories, sized for AI agents

### Example 2: Healthcare Mobile App

**Input (from PRD):**
- FR-001: Secure user registration (HIPAA)
- FR-002: Health data tracking
- FR-003: Medication reminders
- FR-004: Doctor appointment scheduling
- FR-005: Medical records access
- NFR: HIPAA compliance throughout

**Epic Breakdown Created:**
```
Epic 1: Security Foundation and User Onboarding (4 stories)
  1.1: Project setup with HIPAA compliance framework
  1.2: Secure registration with identity verification
  1.3: Biometric authentication
  1.4: Consent and privacy controls

Epic 2: Health Data Management (5 stories)
  2.1: Daily health metrics entry (glucose, BP, weight)
  2.2: Historical data viewing and trends
  2.3: Data export (encrypted PDF)
  2.4: Data sharing with healthcare providers
  2.5: HIPAA audit logging

Epic 3: Care Management (4 stories)
  3.1: Medication list management
  3.2: Medication reminders and notifications
  3.3: Appointment scheduling integration
  3.4: Doctor notes and care plan viewing

Epic 4: Medical Records Integration (3 stories)
  4.1: EHR system connection (FHIR)
  4.2: Medical document viewing
  4.3: Emergency access card
```

**Key Features:**
- HIPAA compliance woven throughout
- Epic 1 Story 1.1 establishes compliance framework
- Domain requirements (HIPAA) distributed to relevant stories
- Vertical slicing with security included
- 16 total stories

### Example 3: Developer CLI Tool

**Input (from PRD):**
- FR-001: Database connection management
- FR-002: Schema migration creation
- FR-003: Migration execution (up/down)
- FR-004: Migration rollback
- FR-005: Migration status and history
- NFR: PostgreSQL and MySQL support

**Epic Breakdown Created:**
```
Epic 1: CLI Foundation and Connection Management (3 stories)
  1.1: Project setup, CLI framework, distribution
  1.2: Database connection configuration
  1.3: Connection validation and testing

Epic 2: Migration Creation and Management (4 stories)
  2.1: Generate migration file template
  2.2: Migration naming and versioning
  2.3: Migration validation (syntax check)
  2.4: Migration status command

Epic 3: Migration Execution (4 stories)
  3.1: Execute pending migrations (up)
  3.2: Rollback last migration (down)
  3.3: Rollback to specific version
  3.4: Dry-run mode (preview changes)

Epic 4: Multi-Database Support (2 stories)
  4.1: PostgreSQL adapter
  4.2: MySQL adapter
```

**Key Features:**
- Simple, focused CLI tool
- Epic 1 Story 1.1 establishes CLI framework
- Clear progression from setup → create → execute
- Multi-database support as separate epic
- 13 total stories

## Notes

### When to Run This Workflow

**Option A: Part of PRD Workflow**
- User chooses to continue PRD session with epic breakdown
- PM agent goes directly from PRD → epics
- Single session for complete planning

**Option B: Standalone (Recommended for Complex Projects)**
- Run separately after PRD complete
- Fresh session focused on decomposition
- Better context window management
- Clear separation of concerns

### Integration with Other Workflows

**Before:**
- `/bmad:phase-2:prd` - Must have PRD.md

**After:**
- `/bmad:phase-3:architecture` - Technical architecture decisions
- `/bmad:phase-4:epic-tech-context` - Technical specs per epic
- `/bmad:phase-4:create-story` - Individual story implementation plans
- `/bmad:phase-4:sprint-planning` - Sprint status tracking

### Story Sizing Guidelines

**Too Big (Split It):**
- "Build complete authentication system"
- "Implement all reporting features"
- Takes >4 hours to implement

**Too Small (Combine It):**
- "Add database column"
- "Create single API endpoint"
- Takes <1 hour to implement

**Just Right:**
- "User can register account with email verification"
- "User can reset password via email"
- Takes 2-4 hours, delivers complete feature

### Handling Complex Domains

For healthcare, finance, aerospace, etc.:
- Compliance requirements distributed to relevant stories
- May need dedicated compliance/validation epics
- Technical notes include regulatory context
- Story acceptance criteria include compliance checks
- Expert review may be needed

## Troubleshooting

**"PRD.md not found"**
- Run `/bmad:phase-2:prd` first to create PRD
- Check output folder location
- Ensure PRD workflow completed successfully

**"Epics already exist"**
- Workflow detects existing epics.md
- Choose to overwrite or exit
- Consider creating epics-v2.md manually if you want both versions

**"Too many stories"**
- Normal for complex projects (20-40 stories common)
- Stories will be implemented incrementally
- Sprint planning workflow helps manage flow

**"Epic 1 doesn't feel like foundation"**
- For greenfield: Epic 1 Story 1.1 must be project setup
- For brownfield: Epic 1 adapts but still creates foundation for new work
- May need to adjust epic groupings

**Context window concerns**
- Complex projects → run as standalone (not part of PRD session)
- PM agent writes incrementally to epics.md (living document)
- Can pause and resume if needed

## Related Workflows

- `/bmad:phase-2:prd` - Create PRD (run first)
- `/bmad:phase-3:architecture` - Technical architecture (run after)
- `/bmad:phase-4:epic-tech-context` - Epic technical specs (run after)
- `/bmad:phase-4:sprint-planning` - Sprint tracking setup (run after)
- `/bmad:phase-4:create-story` - Individual story generation (run during implementation)
- `/bmad:workflow-status` - Check project status (anytime)

## Success Criteria

Epic breakdown succeeds when:
- [ ] epics.md created with comprehensive breakdown
- [ ] All FRs from PRD mapped to stories
- [ ] Epic 1 establishes proper foundation
- [ ] All stories vertically sliced
- [ ] No forward dependencies
- [ ] BDD acceptance criteria clear and testable
- [ ] Story sizing appropriate (2-4 hours)
- [ ] Epic groupings based on business value
- [ ] Workflow status updated
- [ ] Clear next steps provided to user

**Next phase:** Architecture workflow to define technical approach, or epic-tech-context for detailed epic-level technical specs.
