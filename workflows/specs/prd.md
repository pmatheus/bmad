---
description: Create comprehensive Product Requirements Document using intent-driven planning adapted to product type and complexity
---

# PRD - Product Requirements Document

Creates a comprehensive Product Requirements Document (PRD) through interactive discovery and planning. Uses intent-driven approach that adapts to your product type (API, mobile, SaaS, etc.) and domain complexity (healthcare, finance, etc.).

## Purpose

Delegates to **bmad-pm** (Product Manager) subagent for strategic product planning, requirements analysis, market research, and creating comprehensive, actionable PRDs.

**Key Principle:** Intent-driven discovery, adapt to product type and domain, create living document, ensure comprehensive requirements capture.

**Track Routing:** This workflow is for BMad Method and Enterprise Method tracks. Quick Flow track uses `/bmad:phase-2:tech-spec` instead.

## Variables

| Variable | Description | Source |
|----------|-------------|--------|
| `project_name` | Name of the project | `.bmad/config.yaml` |
| `project_track` | Project track (BMad Method, Enterprise Method, Quick Flow) | `bmm-workflow-status.yaml` |
| `documentation_dir` | Directory for documentation output | `.bmad/config.yaml` |
| `user_name` | Name of the user/author | `.bmad/config.yaml` |
| `communication_language` | Language for agent communication | `.bmad/config.yaml` |
| `document_output_language` | Language for document output | `.bmad/config.yaml` |
| `user_skill_level` | User's technical skill level | `.bmad/config.yaml` |
| `standalone_mode` | Whether running without workflow tracking | Computed (true if no status file) |
| `FR_count` | Number of Functional Requirements captured | Output of PM agent |
| `NFR_count` | Number of Non-Functional Requirements captured | Output of PM agent |
| `domain` | Detected domain (healthcare, finance, etc.) | Output of PM agent |
| `PRD_summary` | Summary of PRD created | Output of PM agent |

## Instructions

### Prerequisites

See [shared/prerequisites.md#phase-2-prd](../shared/prerequisites.md)

**Workflow-specific:**
- [ ] On BMad Method or Enterprise Method track (not Quick Flow)
- [ ] (Optional but recommended) Product brief created
- [ ] (Optional for complex domains) Domain research completed

### Quick Start

```bash
# Prerequisites: workflow-init run, on Method or Enterprise track
/bmad:phase-2:prd

# Workflow will:
# 1. Check workflow status and validate track
# 2. Gather existing context (product brief, research)
# 3. Delegate to bmad-pm (Product Manager agent)
# 4. Guide interactive discovery (vision, scope, requirements)
# 5. Create living PRD.md as you discuss
# 6. Option to continue to epic breakdown or pause
```

### Key Constraints

- **Method/Enterprise only:** This workflow is for comprehensive planning tracks
- **Quick Flow uses tech-spec:** Single feature projects use tech-spec instead
- **Intent-driven:** Open-ended discovery, adapt to product type and domain
- **Living document:** PRD created continuously during discovery
- **Comprehensive:** All sections completed (vision, scope, FRs, NFRs, risks)
- **Actionable FRs:** Requirements clear enough to decompose into stories
- **Domain adaptation:** Questions adapt to healthcare, finance, etc.
- **No auto-continue:** User reviews PRD before continuing to epic breakdown

## Workflow

### Step 1: Check Workflow Status and Validate Track

**Read workflow status:**
- Configuration from `.bmad/config.yaml`
- Workflow status from `{documentation_dir}/bmm-workflow-status.yaml`

**Validate:**
- Check if `project_track` is "BMad Method" or "Enterprise Method"
  - If "Quick Flow" → Redirect to `/bmad:phase-2:tech-spec`
- Check if PRD workflow already completed
  - If completed → Ask user if they want to overwrite

**If no status file found:**
- Set `standalone_mode = true`
- Continue without status tracking
- Warn user that workflow tracking is unavailable

### Step 2: Gather Existing Context

**Smart document discovery** (check for both whole and sharded versions):

```
Product Brief: {documentation_dir}/*brief*.md or *brief*/index.md
Market Research: {documentation_dir}/*research*.md or *research*/index.md
Domain Research: {documentation_dir}/*domain*.md or *domain*/index.md
Project Docs: {documentation_dir}/docs/index.md
```

**For each found document:**
- Read the content (or index.md if sharded)
- Summarize key insights for PM agent
- Note file path for reference section

### Step 3: Delegate to Product Manager Subagent

See [shared/common-operations.md#delegate-to-subagent](../shared/common-operations.md)

**Task Configuration:**
- **subagent_type:** `"bmad-pm"`
- **description:** `"Create comprehensive PRD"`
- **prompt:** Delegation prompt (see template below)

**Delegation Prompt Template:**

```
**Project Context:**
- Project Name: {project_name}
- Project Track: {project_track}
- Output Folder: {documentation_dir}
- User Name: {user_name}

**Existing Documents Available:**
{list_of_found_documents_with_paths}

**Configuration:**
- Communication Language: {communication_language}
- Document Output Language: {document_output_language}
- User Skill Level: {user_skill_level}

**Your Task:**

1. **Discovery & Planning**: Guide the user through comprehensive product planning:
   - Understand product vision and goals
   - Identify project type (API, mobile, SaaS, etc.)
   - Detect domain complexity (healthcare, finance, etc.)
   - Capture "product magic" - what makes it special
   - Define success criteria
   - Negotiate scope (MVP, Growth, Vision)
   - Gather functional requirements
   - Document non-functional requirements
   - Adapt questions to project type and domain

2. **Create Living PRD**: Write to {documentation_dir}/PRD.md continuously as you discover information. Use the PRD template structure.

3. **Intent-Driven Approach**: Ask open-ended questions, listen actively, probe for deeper understanding, adapt to user's communication style.

4. **Domain Adaptation**: If healthcare/HIPAA → ask about PHI, consent, audit. If finance → ask about PCI-DSS, transactions, fraud. Adapt to detected domain.

5. **Comprehensive Coverage**: Ensure all PRD sections completed:
   - Product Vision & Context
   - Success Criteria & Metrics
   - Scope Definition (MVP/Growth/Vision)
   - Domain Requirements (if applicable)
   - Functional Requirements (FRs)
   - Non-Functional Requirements (NFRs)
   - Assumptions & Constraints
   - Out of Scope
   - Risk Assessment

6. **Validate Completeness**: Before finishing, review PRD with user, confirm all sections complete, validate FRs are actionable.

**Output File:**
- {documentation_dir}/PRD.md (required)

**Template Structure:**

```markdown
# {project_name} - Product Requirements Document

**Author:** {user_name}
**Date:** {date}
**Version:** 1.0

## 1. Product Vision & Context

[What you're building and why]

**Product Magic:** [What makes it special/unique]

**Target Users:** [Who will use this]

**Market Context:** [Problem being solved, opportunity]

## 2. Success Criteria & Metrics

[How you'll measure success]

**North Star Metric:** [Primary success indicator]

**Key Metrics:**
- Metric 1: [description, target]
- Metric 2: [description, target]

## 3. Scope Definition

**MVP (Must Have):**
- Feature 1
- Feature 2

**Growth (Should Have):**
- Feature 3

**Vision (Could Have):**
- Feature 4

## 4. Domain Requirements

[If healthcare, finance, etc. - specialized requirements]

**Compliance:**
- Regulation 1 (e.g., HIPAA, PCI-DSS)

**Standards:**
- Standard 1

## 5. Functional Requirements

**FR-001:** [Capability description]
- User action
- System response
- Acceptance criteria

**FR-002:** [Next requirement]

[Continue...]

## 6. Non-Functional Requirements

**Performance:**
- NFR-001: [Performance requirement]

**Security:**
- NFR-002: [Security requirement]

**Scalability:**
- NFR-003: [Scale requirement]

**Usability:**
- NFR-004: [UX requirement]

## 7. Assumptions & Constraints

**Assumptions:**
- Assumption 1

**Constraints:**
- Constraint 1 (technical, time, budget)

## 8. Out of Scope

[What we're explicitly NOT building]

## 9. Risk Assessment

**Risk 1:** [Description]
- Likelihood: High/Med/Low
- Impact: High/Med/Low
- Mitigation: [Strategy]
```

**When complete**, report:
- Number of FRs and NFRs captured
- Key domain requirements
- MVP scope clarity
- Any risks or open questions
- Recommend next step (epic breakdown)
```

### Step 4: Update Workflow Status

**If workflow status file exists:**
1. Read `{documentation_dir}/bmm-workflow-status.yaml`
2. Update `workflow_status.prd` to: `{documentation_dir}/PRD.md`
3. Update `phase_completion.phase_2_requirements` to: `completed`
4. Save file, preserving all comments

**If standalone mode:**
- Skip workflow status update
- Continue to report

### Step 5: Offer to Continue to Epic Breakdown

**Ask user:**
"Would you like to continue to epic breakdown now, or pause here?"

**If continue:**
```
🚀 Continuing to epic breakdown...
```
Use SlashCommand tool: `/bmad:phase-2:create-epics-and-stories`

**If pause:**
```
✅ PRD saved. Run /bmad:phase-2:create-epics-and-stories when ready.
```

**Note:** Do NOT auto-continue. User may want to review PRD before breaking down into epics.

## Report

Present the completion report to the user in this format:

```
✅ PRD Complete!

Created:
- {documentation_dir}/PRD.md
  - {FR_count} Functional Requirements
  - {NFR_count} Non-Functional Requirements
  - {domain} domain requirements captured

Summary:
{PRD_summary}

Key Highlights:
- Product Magic: [What makes it special]
- MVP Scope: [Core features]
- Key Risks: [Top 2-3 risks identified]

Next Steps:
1. Run /bmad:phase-2:create-epics-and-stories to break down into implementable stories
2. Or run /bmad:phase-3:architecture to design technical architecture first
3. Run /bmad:workflow-status to see your progress

PRD is your requirements foundation - ready for epic breakdown!
```

**Report Components:**
- **File paths:** Absolute path to PRD.md created
- **Metrics:** FR count, NFR count, domain requirements
- **Summary:** High-level overview of PRD contents from PM agent
- **Key highlights:** Product magic, MVP scope, top risks
- **Next steps:** Clear options for continuing workflow
- **Status:** Confirmation of workflow status update (if applicable)

**Quality Indicators in Report:**
- Number of requirements shows completeness
- Domain requirements show adaptation to specialized needs
- MVP clarity shows scope definition success
- Risks identified show thorough analysis

---

## Notes

- **PM agent expertise:** bmad-pm specializes in strategic product planning
- **Interactive discovery:** Guided conversation, not form-filling
- **Product magic:** Capture what makes product special/unique
- **Scope negotiation:** MVP vs Growth vs Vision clarity critical
- **Domain awareness:** Automatically adapts to healthcare, finance, compliance needs
- **FR quality:** Requirements must be specific, testable, actionable
- **No auto-continue:** User reviews PRD before continuing to epic breakdown

**Philosophy:** Intent-driven discovery reveals true requirements. Adapt to product type and domain. Create living document during conversation. Balance comprehensiveness with clarity. Prepare solid foundation for epic breakdown.

---

**References:**
- Examples: [examples/prd-examples.md](../examples/prd-examples.md)
- Troubleshooting: [shared/troubleshooting.md#prd](../shared/troubleshooting.md)
- Philosophy: [shared/design-philosophy.md#intent-driven-planning](../shared/design-philosophy.md)
- Common Operations: [shared/common-operations.md](../shared/common-operations.md)
