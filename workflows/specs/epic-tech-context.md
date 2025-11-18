---
description: Generate comprehensive epic-level technical specifications with NFRs, acceptance criteria, and traceability
---

# Epic Tech Context

## Purpose

This workflow generates a **comprehensive technical specification** for a single epic by delegating to the Architect agent with full PRD and architecture context.

**Key outputs:**
- Overview and scope tied to PRD goals
- Detailed design (services, data models, APIs, workflows)
- Non-functional requirements (performance, security, reliability, observability)
- Dependencies and integration points
- Acceptance criteria and traceability mapping
- Risk assessment and test strategy

**Key Principle:** JIT (Just-In-Time) - Run this workflow for each epic as needed, not all at once. This keeps context fresh and reduces cognitive load.

**Prerequisites:**
- [ ] BMAD plugin installed in Claude Code
- [ ] Project initialized (`/bmad:meta:workflow-init`)
- [ ] PRD created (`/bmad:phase-2:prd`)
- [ ] Architecture document created (`/bmad:phase-3:architecture`)
- [ ] Epics created (`/bmad:phase-2:create-epics-and-stories`)
- [ ] Sprint planning initialized (`/bmad:phase-4:sprint-planning`)

## Variables

The following variables are used throughout this workflow:

| Variable | Source | Description | Example |
|----------|--------|-------------|---------|
| `{documentation_dir}` | `.bmad/config.yaml` | Where documentation files are stored | `.bmad` |
| `{user_name}` | `.bmad/config.yaml` | Author name for tech specs | `"John Developer"` |
| `{sprint_artifacts}` | `.bmad/config.yaml` | Where sprint artifacts are stored | `.bmad/sprint-artifacts` |
| `{bmad_folder}` | `.bmad/config.yaml` | BMAD installation location | `.bmad` |
| `{project_name}` | `.bmad/config.yaml` | Project name | `"Healthcare Portal"` |
| `{epic_id}` | User input or auto-suggested | Epic identifier (e.g., epic-2) | `epic-3` |
| `{epic_title}` | Extracted from epic document | Human-readable epic name | `"User Authentication System"` |
| `{current date}` | System date | Current date for documentation | `2025-11-18` |
| `{output_file}` | Generated | Tech spec output path | `{sprint_artifacts}/tech-spec-epic-{epic_id}.md` |

**Configuration file location:** `.bmad/config.yaml`

**Required input files:**
- `.bmad/config.yaml` - Project configuration
- `.bmad/PRD.md` OR `.bmad/PRD/index.md` (with sections) - Product requirements
- `.bmad/architecture.md` OR `.bmad/architecture/index.md` (with sections) - System architecture
- `{documentation_dir}/epics.md` OR `{documentation_dir}/epics/epic-{N}.md` (sharded) - Epic definitions
- `{sprint_artifacts}/sprint-status.yaml` - Epic tracking and status

**Optional input files:**
- `.bmad/ux-design.md` OR `.bmad/ux-design/index.md` (with sections) - UX design specifications
- `.bmad/GDD.md` OR `.bmad/GDD/index.md` (with sections) - Game design document (game projects)

## Instructions

### 1. Load Configuration

Read project configuration from `.bmad/config.yaml`:

```javascript
{
  documentation_dir: string,      // Where docs are stored (e.g., .bmad)
  user_name: string,              // Author name
  sprint_artifacts: string,       // Where sprint files go
  bmad_folder: string,            // BMAD install location
  project_name: string            // Project name
}
```

### 2. Discover Next Epic

**Read sprint status file:**

Look for: `{sprint_artifacts}/sprint-status.yaml`

**Find next epic:**
- Read ALL `development_status` entries
- Find all epics with status "backlog" (not yet contexted)
- Identify FIRST backlog epic as suggested default

**Present to user:**
```
📋 Next Epic Suggested: Epic 2: User Authentication System

Use this epic?
- Yes, use Epic 2
- No, let me specify a different epic_id
```

**If no backlog epics:**
```
✅ All epics are already contexted!

No epics with status "backlog" found.
Do you want to re-context an existing epic? Enter epic_id or quit.
```

**If user enters epic_id:**
- Store as `epic_id`
- Extract `epic_title` from epic document

### 3. Validate Epic Exists

Check that epic exists in `sprint-status.yaml`:

```yaml
development_status:
  epic-1:
    status: contexted
  epic-2:
    status: backlog  # ← Target this one
  epic-3:
    status: backlog
```

**If epic not found:**
```
⚠️ Epic {epic_id} not found in sprint-status.yaml

This epic hasn't been registered in the sprint plan yet.
Run sprint-planning workflow to initialize epic tracking.
```
→ HALT

**If epic already contexted:**
```
ℹ️ Epic {epic_id} already marked as contexted

Continuing to regenerate tech spec...
```
→ Continue (allows re-running)

### 4. Load Input Documents

**Document loading priority:** Whole document first, then sharded version if available.

**Efficiency Optimization:** When epics are sharded, load **only the specific epic needed**, not all epics. This provides huge token savings.

**Load PRD (whole or sharded):**

Priority order:
1. `.bmad/PRD.md` (whole document)
2. `.bmad/PRD/index.md` + all sections (sharded)

**Load Architecture (whole or sharded):**

Priority order:
1. `.bmad/architecture.md` (whole document)
2. `.bmad/architecture/index.md` + all sections (sharded)

**Load Epic (selective - for efficiency):**

If sharded:
- Read `{documentation_dir}/epics/index.md`
- Load ONLY `{documentation_dir}/epics/epic-{epic_id}.md`
- Skip other epic files (huge token savings)

If whole:
- Read `{documentation_dir}/epics.md`
- Extract Epic {epic_id} section only

**Example efficiency gain:**
```
# Inefficient (old way)
Load epics/epic-1.md (200 lines)
Load epics/epic-2.md (150 lines)
Load epics/epic-3.md (180 lines)  ← Need this one
Load epics/epic-4.md (220 lines)
Total: 750 lines

# Efficient (new way)
Load epics/epic-3.md (180 lines)  ← Only what's needed
Total: 180 lines

Savings: 570 lines (76% reduction)
```

**Load UX Design (optional, if exists):**

Priority order:
1. `.bmad/ux-design.md` (whole document)
2. `.bmad/ux-design/index.md` + all sections (sharded)

**Load GDD (optional, if exists - game projects):**

Priority order:
1. `.bmad/GDD.md` (whole document)
2. `.bmad/GDD/index.md` + all sections (sharded)

**If any required document missing:**
```
⚠️ Missing required documents:
- PRD: Not found at .bmad/PRD.md or .bmad/PRD/
- Architecture: Not found at .bmad/architecture.md or .bmad/architecture/

Please provide file paths or run the missing workflows first.
```
→ HALT and wait for user

### 5. Delegate to Architect

Use the **Task tool** to delegate to bmad-architect:

```javascript
{
  "subagent_type": "bmad-architect",
  "description": "Create epic tech spec",
  "prompt": `
**Project Context:**
- Project Name: {project_name from config}
- Author: {user_name from config}
- Date: {current date}
- Epic ID: {epic_id}
- Epic Title: {epic_title}

**Input Documents:**
- PRD: {path to PRD}
- Architecture: {path to architecture}
- Epic: {epic content or path}
- UX Design: {path if exists, or "Not applicable"}
- GDD: {path if exists for game projects, or "Not applicable"}

**Your Task:**

Create a comprehensive Epic Technical Specification for Epic {epic_id}: {epic_title}.

**Required Sections:**

1. **Overview** (1-2 paragraphs)
   - Reference PRD context and goals
   - Epic purpose and value

2. **Objectives and Scope**
   - In-scope: What this epic includes
   - Out-of-scope: What is explicitly excluded

3. **System Architecture Alignment**
   - Components referenced from architecture
   - Architectural constraints
   - Integration points

4. **Detailed Design**

   a. Services and Modules
      - Table listing: Service/Module | Responsibilities | Inputs/Outputs | Owner

   b. Data Models and Contracts
      - Entities, fields, types, relationships
      - Schema snippets where available
      - Normalized data model definitions

   c. APIs and Interfaces
      - Method | Path | Request/Response | Error Codes
      - Interface signatures
      - API endpoint specifications

   d. Workflows and Sequencing
      - Sequence diagrams as text
      - Steps, actors, data flow

5. **Non-Functional Requirements**

   a. Performance
      - Measurable targets (latency, throughput)
      - Link to PRD/Architecture requirements

   b. Security
      - Authentication/Authorization requirements
      - Data handling and encryption
      - Threat considerations

   c. Reliability/Availability
      - Availability targets
      - Recovery procedures
      - Degradation behavior

   d. Observability
      - Logging requirements
      - Metrics and monitoring
      - Tracing requirements

6. **Dependencies and Integrations**
   - External dependencies (with versions)
   - Third-party integrations
   - Internal service dependencies
   - Scan repository for dependency manifests (package.json, pyproject.toml, go.mod, etc.)

7. **Acceptance Criteria (Authoritative)**
   - Extract from PRD/Epic
   - Normalize into atomic, testable statements
   - Numbered list format

8. **Traceability Mapping**
   - Table format: AC → Spec Section(s) → Component(s)/API(s) → Test Idea
   - Every AC must map to implementation

9. **Risks, Assumptions, Open Questions**
   - Explicit list (label each as Risk/Assumption/Question)
   - Mitigation strategies or next steps

10. **Test Strategy Summary**
    - Test levels (unit, integration, e2e)
    - Frameworks and tools
    - Coverage of ACs
    - Edge case handling

**Output File:**

Create file at: {sprint_artifacts}/tech-spec-epic-{epic_id}.md

**Template:**

Use this structure:

\`\`\`markdown
# Epic Technical Specification: {epic_title}

Date: {date}
Author: {user_name}
Epic ID: {epic_id}
Status: Draft

---

## Overview

[1-2 paragraph summary]

## Objectives and Scope

**In Scope:**
- [bullet points]

**Out of Scope:**
- [bullet points]

## System Architecture Alignment

[Alignment summary]

## Detailed Design

### Services and Modules

| Service/Module | Responsibilities | Inputs/Outputs | Owner |
|----------------|------------------|----------------|-------|
| ...            | ...              | ...            | ...   |

### Data Models and Contracts

[Entity definitions, schemas]

### APIs and Interfaces

| Method | Path | Request | Response | Error Codes |
|--------|------|---------|----------|-------------|
| ...    | ...  | ...     | ...      | ...         |

### Workflows and Sequencing

[Sequence diagrams as text]

## Non-Functional Requirements

### Performance

[Measurable targets]

### Security

[Auth/authz, data handling, threats]

### Reliability/Availability

[Availability, recovery, degradation]

### Observability

[Logging, metrics, tracing]

## Dependencies and Integrations

[Structured list with versions]

## Acceptance Criteria (Authoritative)

1. [AC1]
2. [AC2]
...

## Traceability Mapping

| AC | Spec Section | Components/APIs | Test Idea |
|----|--------------|----------------|-----------|
| 1  | ...          | ...            | ...       |

## Risks, Assumptions, Open Questions

**Risks:**
- R1: [risk] → Mitigation: [strategy]

**Assumptions:**
- A1: [assumption] → Validation: [how]

**Open Questions:**
- Q1: [question] → Next Step: [action]

## Test Strategy Summary

[Test levels, frameworks, coverage, edge cases]
\`\`\`

**Validation Checklist:**

Before completing, verify:
- [ ] Overview clearly ties to PRD goals
- [ ] Scope explicitly lists in-scope and out-of-scope
- [ ] Design lists all services/modules with responsibilities
- [ ] Data models include entities, fields, and relationships
- [ ] APIs/interfaces specified with methods and schemas
- [ ] NFRs: performance, security, reliability, observability addressed
- [ ] Dependencies/integrations enumerated with versions
- [ ] Acceptance criteria are atomic and testable
- [ ] Traceability maps AC → Spec → Components → Tests
- [ ] Risks/assumptions/questions listed with mitigation
- [ ] Test strategy covers all ACs and critical paths

**When complete**, report:

\`\`\`
✅ Epic Tech Spec Created

Epic: {epic_id} - {epic_title}
File: {output_file}
Sections: [list completed sections]
ACs: [count]
Components: [count]
APIs: [count]
Risks: [count]

Quality: [validation status]
\`\`\`
  `
}
```

### 6. Update Epic Status

After architect completes the tech spec:

**Load sprint status file:**
- Read FULL file: `{sprint_artifacts}/sprint-status.yaml`

**Update epic status:**
```yaml
development_status:
  epic-{epic_id}:
    status: contexted  # ← Update from "backlog"
```

**Preserve file structure:**
- Keep ALL comments
- Maintain STATUS DEFINITIONS section
- Preserve formatting

**Save file**

**If epic key not found:**
```
⚠️ Could not update epic status: epic-{epic_id} not found
```

## Workflow

### Execution Sequence

```
1. Configuration Load
   ↓
2. Epic Discovery & Selection
   ├─→ Suggest first "backlog" epic
   ├─→ User confirms or specifies different epic_id
   └─→ Extract epic_title from document
   ↓
3. Epic Validation
   ├─→ Check epic exists in sprint-status.yaml
   ├─→ If not found: HALT with error
   └─→ If already contexted: Continue (allow regeneration)
   ↓
4. Document Loading (Selective & Efficient)
   ├─→ Load PRD (whole or all sharded sections)
   ├─→ Load Architecture (whole or all sharded sections)
   ├─→ Load ONLY target epic (not all epics if sharded)
   ├─→ Load UX Design (optional, if exists)
   ├─→ Load GDD (optional, if exists for games)
   └─→ If required docs missing: HALT with error
   ↓
5. Architect Delegation (via Task tool)
   ├─→ bmad-architect receives all context
   ├─→ Creates comprehensive tech spec with:
   │   ├─→ Overview & scope
   │   ├─→ Detailed design (services, models, APIs, workflows)
   │   ├─→ Non-functional requirements
   │   ├─→ Dependencies & integrations
   │   ├─→ Acceptance criteria (authoritative)
   │   ├─→ Traceability mapping
   │   ├─→ Risks, assumptions, questions
   │   └─→ Test strategy
   └─→ Saves to: {sprint_artifacts}/tech-spec-epic-{epic_id}.md
   ↓
6. Status Update
   ├─→ Load sprint-status.yaml
   ├─→ Update epic status: backlog → contexted
   └─→ Preserve file structure and formatting
   ↓
7. Completion Report
   └─→ Display success with file location and next steps
```

### Key Principles

**1. Just-In-Time (JIT) Specification**
- Context one epic at a time (not all at once)
- Keep specification fresh and relevant
- Reduce cognitive load
- Allow for learning from previous epics
- Avoid upfront planning overhead

**2. Selective Epic Loading**
- When epics are sharded, load ONLY the target epic
- Don't load all epic files into context
- Huge token savings for multi-epic projects (often 70-80% reduction)
- Other documents (PRD, Architecture) are loaded in full

**3. Grounded in Source Documents**
- All design decisions come from PRD and architecture
- Traceability required for every AC
- If information is missing, flag it as open question
- Maintain consistency with previous epic tech specs
- No invention - everything from source documents

**4. Comprehensive NFRs**
- Performance: Measurable targets
- Security: Concrete requirements
- Reliability: Specific SLAs
- Observability: Required signals
- Not optional: Every epic needs NFRs

**5. Test-Driven Design**
- Test strategy before implementation
- How will we test each AC?
- What edge cases need coverage?
- What test levels are needed?
- What frameworks will we use?
- Prevents "we'll test it later" syndrome

### Document Discovery Flow

```
PRD Loading:
  Check: .bmad/PRD.md (whole)
    ├─→ Found: Load entire document
    └─→ Not found:
        └─→ Check: .bmad/PRD/index.md (sharded)
            ├─→ Found: Load index + all sections
            └─→ Not found: ERROR - halt workflow

Architecture Loading:
  Check: .bmad/architecture.md (whole)
    ├─→ Found: Load entire document
    └─→ Not found:
        └─→ Check: .bmad/architecture/index.md (sharded)
            ├─→ Found: Load index + all sections
            └─→ Not found: ERROR - halt workflow

Epic Loading (SELECTIVE):
  Check: {documentation_dir}/epics/index.md (sharded)
    ├─→ Found: Load ONLY epics/epic-{epic_id}.md
    │   └─→ Skip loading other epic files (efficiency!)
    └─→ Not found:
        └─→ Check: {documentation_dir}/epics.md (whole)
            ├─→ Found: Load and extract Epic {epic_id} section
            └─→ Not found: ERROR - halt workflow

UX Design Loading (OPTIONAL):
  Check: .bmad/ux-design.md (whole)
    ├─→ Found: Load entire document
    └─→ Not found:
        └─→ Check: .bmad/ux-design/index.md (sharded)
            ├─→ Found: Load index + all sections
            └─→ Not found: Skip (not required)

GDD Loading (OPTIONAL - games only):
  Check: .bmad/GDD.md (whole)
    ├─→ Found: Load entire document
    └─→ Not found:
        └─→ Check: .bmad/GDD/index.md (sharded)
            ├─→ Found: Load index + all sections
            └─→ Not found: Skip (not required)
```

### Related Workflows

**Before this workflow:**
1. `/bmad:meta:workflow-init` - Initialize project structure
2. `/bmad:phase-2:prd` - Create product requirements
3. `/bmad:phase-3:architecture` - Define system architecture
4. `/bmad:phase-2:create-epics-and-stories` - Break down into epics
5. `/bmad:phase-4:sprint-planning` - Initialize sprint tracking

**After this workflow:**
1. `/bmad:phase-4:create-story` - Create individual story files
2. `/bmad:phase-4:story-context` - Assemble story implementation context
3. `/bmad:phase-4:dev-story` - Implement stories

**Parallel workflows:**
- `/bmad:phase-4:epic-tech-context` - Run for each epic (JIT approach)
- `/bmad:workflow-status` - Check current phase

### Success Criteria

A successful tech spec includes:

**Structure:**
- [ ] All 10 sections present and complete
- [ ] Template structure followed
- [ ] Markdown formatting correct

**Content Quality:**
- [ ] Overview ties to PRD goals
- [ ] Scope is explicit (in/out)
- [ ] Design is concrete (no vague "TBD")
- [ ] NFRs are measurable
- [ ] ACs are atomic and testable
- [ ] Traceability maps all ACs

**Traceability:**
- [ ] Every AC maps to spec section
- [ ] Every AC maps to component/API
- [ ] Every AC has test idea

**Risk Management:**
- [ ] Risks identified with mitigation
- [ ] Assumptions documented with validation plan
- [ ] Open questions noted with next steps

**Test Strategy:**
- [ ] Test levels defined
- [ ] Frameworks specified
- [ ] AC coverage planned
- [ ] Edge cases identified

**File Management:**
- [ ] Tech spec saved to correct location
- [ ] Epic status updated to "contexted"
- [ ] File is well-formatted markdown

### Troubleshooting

**Sprint status file not found:**
```
⚠️ sprint-status.yaml not found
```
→ Solution: Run `/bmad:phase-4:sprint-planning` to initialize sprint tracking.

**Epic not in sprint status:**
```
⚠️ Epic {epic_id} not found in sprint-status.yaml
```
→ Cause: Sprint planning hasn't registered this epic.
→ Solution: Run `/bmad:phase-4:sprint-planning` to scan epics and create status file.

**PRD or Architecture missing:**
```
⚠️ Missing required documents:
- PRD: Not found
- Architecture: Not found
```
→ Solution:
1. Run `/bmad:phase-2:prd` to create PRD
2. Run `/bmad:phase-3:architecture` to create architecture
3. Then re-run this workflow

**Epic has no acceptance criteria:**
```
ℹ️ Epic {epic_id} has no explicit acceptance criteria in PRD/Epic
```
→ Solution:
- Architect will flag this in "Open Questions"
- Update PRD or epic document with ACs
- Re-run workflow to include them

**Sharded documents partially loaded:**
```
⚠️ Found sharded PRD but some sections are missing
```
→ Solution:
- Check `.bmad/PRD/index.md` for expected sections
- Verify all section files exist
- Re-run `/bmad:phase-2:prd` if sections are missing

**Dependency manifest scan finds nothing:**
```
ℹ️ No dependency manifests found in repository
```
→ This is OK for:
- Brownfield projects (dependencies already established)
- Projects using monorepo tools (dependencies elsewhere)
- Documentation-only projects
→ Otherwise: Verify repository structure; Architect will note in "Open Questions"

## Report

### Completion Report Format

When the workflow completes successfully, provide this report:

```
✅ Tech Spec Generated Successfully!

**Epic Details:**
- Epic ID: {epic_id}
- Epic Title: {epic_title}
- Tech Spec File: {output_file}
- Epic Status: contexted (was backlog)

**Tech Spec Contents:**
- Sections: [number] of 10 required sections completed
- Acceptance Criteria: [count]
- Components/Services: [count]
- API Endpoints: [count]
- Data Models: [count]
- Dependencies: [count]
- Risks Identified: [count]
- Open Questions: [count]

**Quality Validation:**
- Traceability: [All ACs mapped / Some ACs missing traceability]
- NFRs Coverage: [Performance, Security, Reliability, Observability]
- Test Strategy: [Defined / Needs refinement]

**Note:** This is a JIT (Just-In-Time) workflow - run again for other epics as needed.

**Next Steps:**
1. Review the tech spec at: {output_file}
2. Run `/bmad:phase-4:create-story` to begin implementing stories under this epic
3. OR run `/bmad:phase-4:epic-tech-context` again for the next backlog epic
```

### Error Report Format

If the workflow encounters errors, report:

```
❌ Tech Spec Generation Failed

**Error Type:** [Configuration / Missing Documents / Validation]

**Issue:**
[Clear description of what went wrong]

**Required Action:**
[Specific steps to resolve the issue]

**Files Checked:**
- Configuration: [path] [✓ Found / ✗ Not found]
- PRD: [path] [✓ Found / ✗ Not found]
- Architecture: [path] [✓ Found / ✗ Not found]
- Epic: [path] [✓ Found / ✗ Not found]
- Sprint Status: [path] [✓ Found / ✗ Not found]

**Suggested Commands:**
[List of workflows to run to resolve the issue]
```

### Progress Updates

During execution, provide these progress updates:

**Step 1 - Configuration:**
```
📋 Loading configuration...
✓ Config loaded from: .bmad/config.yaml
```

**Step 2 - Epic Discovery:**
```
🔍 Scanning sprint status...
📋 Next Epic Suggested: Epic {epic_id}: {epic_title}
```

**Step 3 - Validation:**
```
✓ Epic {epic_id} validated in sprint status
```

**Step 4 - Document Loading:**
```
📚 Loading input documents...
✓ PRD loaded: [path] ([size] lines)
✓ Architecture loaded: [path] ([size] lines)
✓ Epic loaded: [path] ([size] lines)
[✓ UX Design loaded: [path] ([size] lines)] (if applicable)
[✓ GDD loaded: [path] ([size] lines)] (if applicable)
```

**Step 5 - Delegation:**
```
🏗️ Delegating to bmad-architect...
[Architect is creating comprehensive tech spec...]
```

**Step 6 - Status Update:**
```
✓ Sprint status updated: Epic {epic_id} → contexted
```

### Example Reports

**Example 1: SaaS Analytics Dashboard**
```
✅ Tech Spec Generated Successfully!

**Epic Details:**
- Epic ID: epic-3
- Epic Title: Real-Time Data Visualization
- Tech Spec File: .bmad/sprint-artifacts/tech-spec-epic-3.md
- Epic Status: contexted (was backlog)

**Tech Spec Contents:**
- Sections: 10 of 10 required sections completed
- Acceptance Criteria: 12
- Components/Services: 3 (WebSocket service, Data aggregation service, Cache layer)
- API Endpoints: 8 (tRPC)
- Data Models: 5 (ChartData, Dashboard, Widget, User, Session)
- Dependencies: 6 (Recharts, Socket.io, Redis, Next.js, tRPC, Prisma)
- Risks Identified: 4
- Open Questions: 2

**Quality Validation:**
- Traceability: All 12 ACs mapped to components and tests
- NFRs Coverage: Performance (100ms latency), Security (AES-256), Reliability (99.9%), Observability (full)
- Test Strategy: Defined (unit, integration, e2e with Jest, Playwright, k6)

**Next Steps:**
1. Review the tech spec at: .bmad/sprint-artifacts/tech-spec-epic-3.md
2. Run `/bmad:phase-4:create-story` to begin implementing stories under this epic
3. OR run `/bmad:phase-4:epic-tech-context` again for the next backlog epic
```

**Example 2: Healthcare HIPAA Compliance**
```
✅ Tech Spec Generated Successfully!

**Epic Details:**
- Epic ID: epic-5
- Epic Title: HIPAA-Compliant Audit Logging
- Tech Spec File: .bmad/sprint-artifacts/tech-spec-epic-5.md
- Epic Status: contexted (was backlog)

**Tech Spec Contents:**
- Sections: 10 of 10 required sections completed
- Acceptance Criteria: 18 (HIPAA-focused)
- Components/Services: 5 (Audit service, Event store, Compliance validator, Export service, Alert service)
- API Endpoints: 6
- Data Models: 4 (AuditEvent, ComplianceLog, AccessRecord, ExportJob)
- Dependencies: 7 (Event Store DB, HashiCorp Vault, AWS KMS, FIPS modules)
- Risks Identified: 7 (compliance-focused)
- Open Questions: 3

**Quality Validation:**
- Traceability: All 18 ACs mapped with HIPAA requirement references
- NFRs Coverage: Performance (10k events/sec), Security (FIPS 140-2, AES-256, TLS 1.3), Reliability (99.99%), Observability (compliance dashboards)
- Test Strategy: Defined (includes HIPAA compliance testing, penetration testing, audit trail validation)

**Compliance Note:** All HIPAA requirements mapped to acceptance criteria and test strategy.

**Next Steps:**
1. Review the tech spec at: .bmad/sprint-artifacts/tech-spec-epic-5.md
2. Review HIPAA compliance mappings in traceability section
3. Run `/bmad:phase-4:create-story` to begin implementing stories under this epic
```

**Example 3: Error - Missing Documents**
```
❌ Tech Spec Generation Failed

**Error Type:** Missing Documents

**Issue:**
Required architecture document not found in project.

**Required Action:**
Create system architecture before generating epic tech specs.

**Files Checked:**
- Configuration: .bmad/config.yaml ✓ Found
- PRD: .bmad/PRD.md ✓ Found
- Architecture: .bmad/architecture.md ✗ Not found
- Architecture (sharded): .bmad/architecture/index.md ✗ Not found
- Epic: .bmad/epics.md ✓ Found
- Sprint Status: .bmad/sprint-artifacts/sprint-status.yaml ✓ Found

**Suggested Commands:**
1. Run `/bmad:phase-3:architecture` to create system architecture
2. Then re-run `/bmad:phase-4:epic-tech-context`
```

### Notes on Reporting

**Always include:**
- Clear success/failure indicator
- Epic identification (ID and title)
- File location (absolute path)
- Quantitative metrics (counts)
- Next actionable steps

**Progress indicators:**
- Use emoji sparingly but consistently
- Provide clear status updates during long operations
- Show what's being loaded/processed
- Indicate when waiting for subagent completion

**Error messages:**
- Be specific about what's missing or wrong
- Provide concrete resolution steps
- List related files and their status
- Suggest exact commands to run

**Quality validation:**
- Summarize completeness of key sections
- Highlight any gaps or concerns
- Confirm traceability coverage
- Note compliance or special requirements
