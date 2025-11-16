---
description: Generate comprehensive epic-level technical specifications with NFRs, acceptance criteria, and traceability
---

# Epic Tech Context

Creates detailed technical specifications for individual epics by delegating to the Architect agent with full PRD and architecture context.

## What This Does

This workflow generates a **comprehensive technical specification** for a single epic, including:

- Overview and scope tied to PRD goals
- Detailed design (services, data models, APIs, workflows)
- Non-functional requirements (performance, security, reliability, observability)
- Dependencies and integration points
- Acceptance criteria and traceability mapping
- Risk assessment and test strategy

**Key Principle:** JIT (Just-In-Time) - Run this workflow for each epic as needed, not all at once. This keeps context fresh and reduces cognitive load.

## Prerequisites

Before running this workflow:

- [ ] BMAD plugin installed in Claude Code
- [ ] Project initialized (`/bmad:meta:workflow-init`)
- [ ] PRD created (`/bmad:phase-2:prd`)
- [ ] Architecture document created (`/bmad:phase-3:architecture`)
- [ ] Epics created (`/bmad:phase-2:create-epics-and-stories`)
- [ ] Sprint planning initialized (`/bmad:phase-4:sprint-planning`)

**Required files:**
- `.bmad/config.yaml` - Project configuration
- `.bmad/PRD.md` (or `.bmad/PRD/index.md` if sharded)
- `.bmad/architecture.md` (or `.bmad/architecture/index.md` if sharded)
- `.bmad/epics.md` OR `.bmad/epics/epic-{N}.md` (sharded)
- `.bmad/sprint-artifacts/sprint-status.yaml` - Epic tracking

## How It Works

### Document Discovery (Selective Epic Loading)

**Efficiency Optimization:** This workflow loads **only the specific epic needed**, not all epics. This provides huge gains when epics are sharded.

**Epic Discovery:**
1. Read `sprint-status.yaml` to find next "backlog" epic
2. If epics are sharded (`epics/index.md` exists):
   - Load ONLY `epics/epic-{N}.md` for the target epic
   - Skip loading other epic files
3. If whole document exists (`epics.md`), load and extract relevant epic

**Other Documents (full load):**
- PRD: Load whole document or all sharded sections
- Architecture: Load whole document or all sharded sections
- UX Design (if exists): Load for UI-focused epics
- GDD (if exists): Load for game projects

**Priority:** Whole document first, then sharded version if available.

### Delegation to Architect

The workflow delegates to the **bmad-architect** agent who:
1. Reviews PRD and architecture for context
2. Extracts the specific epic's requirements
3. Creates comprehensive technical specification
4. Maps acceptance criteria to components
5. Identifies dependencies and risks
6. Defines test strategy

### Status Tracking

Updates `sprint-status.yaml`:
- Epic status: `backlog` → `contexted`
- Indicates epic is ready for story creation

## Instructions

### Step 1: Load Configuration

Read project configuration from `.bmad/config.yaml`:

```javascript
{
  output_folder: string,      // Where docs are stored (e.g., .bmad)
  user_name: string,          // Author name
  sprint_artifacts: string,   // Where sprint files go
  bmad_folder: string         // BMAD install location
}
```

### Step 2: Discover Next Epic

**Read sprint status file:**

Look for: `.bmad/sprint-artifacts/sprint-status.yaml` OR `.bmad/sprint-status.yaml`

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

### Step 3: Validate Epic Exists

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

### Step 4: Load Input Documents

**Load PRD (whole or sharded):**

Priority order:
1. `.bmad/PRD.md` (whole document)
2. `.bmad/PRD/index.md` + all sections (sharded)

**Load Architecture (whole or sharded):**

Priority order:
1. `.bmad/architecture.md` (whole document)
2. `.bmad/architecture/index.md` + all sections (sharded)

**Load Epic (selective):**

If sharded:
- Read `.bmad/epics/index.md`
- Load ONLY `.bmad/epics/epic-{epic_id}.md`
- Skip other epic files

If whole:
- Read `.bmad/epics.md`
- Extract Epic {epic_id} section

**Load UX Design (if exists):**

Priority order:
1. `.bmad/ux-design.md` (whole document)
2. `.bmad/ux-design/index.md` + all sections (sharded)

**Load GDD (if exists - game projects):**

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

### Step 5: Delegate to Architect

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

### Step 6: Update Epic Status

After architect completes the tech spec:

**Load sprint status file:**
- Read FULL file: `.bmad/sprint-artifacts/sprint-status.yaml`

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

### Step 7: Report Completion

```
✅ Tech Spec Generated Successfully!

**Epic Details:**
- Epic ID: {epic_id}
- Epic Title: {epic_title}
- Tech Spec File: {output_file}
- Epic Status: contexted (was backlog)

**Note:** This is a JIT (Just-In-Time) workflow - run again for other epics as needed.

**Next Steps:**
1. Run `/bmad:phase-4:create-story` to begin implementing stories under this epic
2. OR run `/bmad:phase-4:epic-tech-context` again for the next backlog epic
```

## Key Principles

### 1. Just-In-Time (JIT) Specification

**Don't context all epics at once:**
- Context one epic at a time
- Keep specification fresh and relevant
- Reduce cognitive load
- Allow for learning from previous epics

**Benefits:**
- Fresh context when actually needed
- Can incorporate learnings from previous epics
- Reduces upfront planning overhead
- Maintains focus

### 2. Selective Epic Loading

**Efficiency for large projects:**
- When epics are sharded, load ONLY the target epic
- Don't load all epic files into context
- Huge token savings for multi-epic projects

**Example:**
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

### 3. Grounded in Source Documents

**No invention:**
- All design decisions come from PRD and architecture
- Traceability required for every AC
- If information is missing, flag it as open question
- Maintain consistency with previous epic tech specs

### 4. Comprehensive NFRs

**Non-functional requirements are critical:**
- Performance: Measurable targets
- Security: Concrete requirements
- Reliability: Specific SLAs
- Observability: Required signals

**Not optional:** Every epic needs NFRs, not just "functional" epics.

### 5. Test-Driven Design

**Test strategy before implementation:**
- How will we test each AC?
- What edge cases need coverage?
- What test levels are needed?
- What frameworks will we use?

**Prevents "we'll test it later" syndrome.**

## Examples

### Example 1: SaaS Analytics Dashboard - Real-Time Data Visualization Epic

**Context:**
- Project: SaaS Analytics Platform (T3 Stack)
- Epic 3: Real-Time Data Visualization
- PRD: 300 lines, Architecture: 250 lines, Epic: 80 lines
- Files: Whole documents (not sharded)

**Workflow execution:**

1. **Discovery:**
   ```
   📋 Next Epic Suggested: Epic 3: Real-Time Data Visualization

   Use this epic?
   → User selects "Yes"
   ```

2. **Document loading:**
   - Load `.bmad/PRD.md` (whole document)
   - Load `.bmad/architecture.md` (whole document)
   - Extract Epic 3 from `.bmad/epics.md`
   - No UX design doc needed (data visualization)

3. **Delegation to bmad-architect:**
   - Reviews PRD goals for dashboard
   - Reviews architecture: tRPC, Prisma, WebSockets
   - Creates tech spec with:
     - Services: WebSocket service, Data aggregation service, Cache layer
     - Data models: ChartData, Dashboard, Widget schemas
     - APIs: 8 tRPC endpoints (getData, subscribe, updateWidget, etc.)
     - NFRs: 100ms latency target, 1000 concurrent users, AES-256 for sensitive data
     - Dependencies: Recharts, Socket.io, Redis
     - ACs: 12 testable criteria
     - Traceability: Maps each AC to component and test

4. **Output:**
   - File: `.bmad/sprint-artifacts/tech-spec-epic-3.md` (450 lines)
   - Epic status: backlog → contexted

5. **Result:**
   ```
   ✅ Tech Spec Generated Successfully!

   Epic: Epic 3 - Real-Time Data Visualization
   File: .bmad/sprint-artifacts/tech-spec-epic-3.md
   ACs: 12 | Components: 3 | APIs: 8 | Risks: 4

   Next: Run /bmad:phase-4:create-story for Epic 3
   ```

### Example 2: Healthcare Patient Portal - HIPAA Compliance Epic

**Context:**
- Project: Healthcare Patient Portal
- Epic 5: HIPAA-Compliant Audit Logging
- PRD: 800 lines (sharded), Architecture: 600 lines (sharded), Epic: 120 lines
- Files: Sharded documents

**Workflow execution:**

1. **Discovery:**
   ```
   📋 Next Epic Suggested: Epic 5: HIPAA-Compliant Audit Logging

   Use this epic?
   → User selects "Yes"
   ```

2. **Document loading (sharded):**
   - Load `.bmad/PRD/index.md` + all sections (800 lines total)
   - Load `.bmad/architecture/index.md` + all sections (600 lines total)
   - Load ONLY `.bmad/epics/epic-5.md` (120 lines) ← Selective loading
   - Skip loading epic-1.md through epic-4.md (saves ~400 lines)

3. **Delegation to bmad-architect:**
   - Reviews PRD: HIPAA requirements, audit trail needs
   - Reviews architecture: Event sourcing, immutable logs, encryption
   - Creates tech spec with:
     - Services: Audit service, Event store, Compliance validator
     - Data models: AuditEvent, ComplianceLog, AccessRecord schemas
     - APIs: 6 audit endpoints (logEvent, queryAudit, exportCompliance, etc.)
     - NFRs:
       - Performance: Log 10,000 events/sec
       - Security: AES-256 encryption at rest, TLS 1.3 in transit, FIPS 140-2
       - Reliability: 99.99% uptime, tamper-proof logs
       - Observability: Real-time compliance dashboards
     - Dependencies: Event Store DB, HashiCorp Vault, AWS KMS
     - ACs: 18 testable criteria (HIPAA-focused)
     - Traceability: Maps each AC to HIPAA requirement and test
     - Risks: 7 compliance risks with mitigation strategies

4. **Output:**
   - File: `.bmad/sprint-artifacts/tech-spec-epic-5.md` (650 lines)
   - Epic status: backlog → contexted
   - Includes explicit HIPAA compliance mappings

5. **Result:**
   ```
   ✅ Tech Spec Generated Successfully!

   Epic: Epic 5 - HIPAA-Compliant Audit Logging
   File: .bmad/sprint-artifacts/tech-spec-epic-5.md
   ACs: 18 | Components: 5 | APIs: 6 | Risks: 7

   Compliance: HIPAA requirements mapped

   Next: Run /bmad:phase-4:create-story for Epic 5
   ```

### Example 3: Mobile Fitness App - Offline-First Data Sync Epic

**Context:**
- Project: Mobile Fitness Tracker (React Native + Expo)
- Epic 2: Offline-First Workout Sync
- PRD: 500 lines, Architecture: 400 lines, Epic: 100 lines, UX Design: 200 lines
- Files: Whole documents with UX design

**Workflow execution:**

1. **Discovery:**
   ```
   📋 Next Epic Suggested: Epic 2: Offline-First Workout Sync

   Use this epic?
   → User selects "Yes"
   ```

2. **Document loading:**
   - Load `.bmad/PRD.md` (whole document)
   - Load `.bmad/architecture.md` (whole document)
   - Extract Epic 2 from `.bmad/epics.md`
   - Load `.bmad/ux-design.md` (UX-heavy project - critical context)

3. **Delegation to bmad-architect:**
   - Reviews PRD: Offline-first requirements, sync strategy
   - Reviews architecture: SQLite, background sync, conflict resolution
   - Reviews UX: Sync indicators, conflict UI, offline badges
   - Creates tech spec with:
     - Services: Sync engine, Conflict resolver, Device sensor service
     - Data models: Workout, Exercise, SyncQueue, ConflictLog schemas
     - APIs: 10 endpoints (syncWorkout, resolveConflict, getSyncStatus, etc.)
     - NFRs:
       - Performance: Sync 1000 workouts in <10 sec, sensor read at 100Hz
       - Security: E2E encryption, biometric auth
       - Reliability: 100% offline functionality, graceful degradation
       - Observability: Sync status, conflict logs, sensor health
     - Dependencies: WatermelonDB, Expo SQLite, NetInfo, React Query
     - ACs: 15 testable criteria (offline scenarios)
     - Traceability: Maps ACs to UX flows and components
     - Risks: Conflict resolution edge cases, battery drain

4. **Output:**
   - File: `.bmad/sprint-artifacts/tech-spec-epic-2.md` (580 lines)
   - Epic status: backlog → contexted
   - Includes UX-driven design decisions

5. **Result:**
   ```
   ✅ Tech Spec Generated Successfully!

   Epic: Epic 2 - Offline-First Workout Sync
   File: .bmad/sprint-artifacts/tech-spec-epic-2.md
   ACs: 15 | Components: 4 | APIs: 10 | Risks: 5

   UX Design: Integrated (sync indicators, conflict UI)

   Next: Run /bmad:phase-4:create-story for Epic 2
   ```

## Troubleshooting

### Sprint status file not found

**Error:**
```
⚠️ sprint-status.yaml not found
```

**Solution:**
Run `/bmad:phase-4:sprint-planning` to initialize sprint tracking.

### Epic not in sprint status

**Error:**
```
⚠️ Epic {epic_id} not found in sprint-status.yaml
```

**Cause:** Sprint planning hasn't registered this epic.

**Solution:**
Run `/bmad:phase-4:sprint-planning` to scan epics and create status file.

### PRD or Architecture missing

**Error:**
```
⚠️ Missing required documents:
- PRD: Not found
- Architecture: Not found
```

**Solution:**
1. Run `/bmad:phase-2:prd` to create PRD
2. Run `/bmad:phase-3:architecture` to create architecture
3. Then re-run this workflow

### Epic has no acceptance criteria

**Warning:**
```
ℹ️ Epic {epic_id} has no explicit acceptance criteria in PRD/Epic
```

**Solution:**
- Architect will flag this in "Open Questions"
- Update PRD or epic document with ACs
- Re-run workflow to include them

### Sharded documents partially loaded

**Warning:**
```
⚠️ Found sharded PRD but some sections are missing
```

**Solution:**
- Check `.bmad/PRD/index.md` for expected sections
- Verify all section files exist
- Re-run `/bmad:phase-2:prd` if sections are missing

### Dependency manifest scan finds nothing

**Warning:**
```
ℹ️ No dependency manifests found in repository
```

**This is OK for:**
- Brownfield projects (dependencies already established)
- Projects using monorepo tools (dependencies elsewhere)
- Documentation-only projects

**Otherwise:**
- Verify repository structure
- Architect will note this in "Open Questions"

## Related Workflows

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
- `/bmad:phase-4:epic-tech-context` - Run for each epic (JIT)
- `/bmad:workflow-status` - Check current phase

## Success Criteria

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

## Notes

- **JIT workflow:** Run for each epic as needed, not all at once
- **Selective loading:** Only loads the specific epic needed when sharded
- **Delegation:** Full work done by bmad-architect agent
- **Traceability:** Every AC must map to implementation
- **NFRs required:** Not optional, every epic needs them
- **Test-first:** Test strategy before implementation
- **Grounded:** No invention, everything from source documents
- **Repeatable:** Can re-run for same epic to regenerate

## Configuration

Reads from `.bmad/config.yaml`:

```yaml
output_folder: .bmad
user_name: "Your Name"
sprint_artifacts: .bmad/sprint-artifacts
bmad_folder: .bmad
project_name: "Project Name"
```

**Sprint status file:**
- Primary: `.bmad/sprint-artifacts/sprint-status.yaml`
- Fallback: `.bmad/sprint-status.yaml`

**Tech spec output:**
- `.bmad/sprint-artifacts/tech-spec-epic-{epic_id}.md`
