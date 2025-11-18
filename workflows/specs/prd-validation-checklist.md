# PRD + Epics Validation Checklist

## Purpose

Comprehensive validation that PRD (and optionally epics) form a complete, implementable product plan. This checklist ensures planning output for Levels 2-4 software projects meets quality standards before proceeding to architecture and implementation phases.

**Scope**: Validates planning output for Levels 2-4 software projects

**Expected Outputs**:
- PRD.md with complete requirements
- epics.md with detailed breakdown (optional, may be separate session)
- Updated bmm-workflow-status.yaml

---

## Variables

This validation checklist does not use template variables. It is applied to existing documents in the project's output folder.

**Required Input Documents**:
- `PRD.md` (required) - The Product Requirements Document to validate
- `epics.md` (conditional) - The epics breakdown if created
- `product-brief.md` (optional) - Source document if exists
- `domain-brief.md` (optional) - Domain research if exists
- Research documents (optional) - Any referenced research files

**Configuration**:
- Project Level (2-4) - Determines depth of validation
- Project Type (SaaS, Mobile, API, etc.) - Determines applicable sections
- Epic Status (created/not created) - Controls epic-related validation

---

## Instructions

### 1. Document Loading

Load ALL relevant documents from the project's output folder:
- PRD.md (required)
- epics.md (if created)
- product-brief.md (if exists)
- domain-brief.md (if exists)
- research documents (if referenced)

**Important**: Load whole or sharded versions, but not both of each document.

### 2. Critical Failure Check (Must Pass First)

Before proceeding with detailed validation, verify NONE of these critical failures exist:

- ❌ **Template variables unfilled** (e.g., `{{variable}}` still present)
- ❌ **FRs contain technical implementation details** (should be in architecture phase)
- ❌ **No FR numbering/identification** (can't validate traceability)
- ❌ **If epics created: Epic 1 doesn't establish foundation** (violates sequencing principle)
- ❌ **If epics created: Stories have forward dependencies** (breaks sequential implementation)
- ❌ **If epics created: Stories not vertically sliced** (horizontal layers block value delivery)
- ❌ **If epics created: Epics don't cover all FRs** (orphaned requirements)

**If ANY critical failure exists**: STOP validation and report critical issues immediately. Do not proceed to detailed validation until critical failures are resolved.

### 3. PRD Document Completeness Validation

Verify the PRD contains all required core sections:

**Core Sections**:
- Executive Summary with vision alignment
- Product magic essence clearly articulated
- Project classification (type, domain, complexity)
- Success criteria defined
- Product scope (MVP, Growth, Vision) clearly delineated
- Functional requirements comprehensive and numbered (FR-001, FR-002, etc.)
- Non-functional requirements (when applicable - skip if not relevant)
- References section with source documents (if any)

**Project-Specific Sections** (Include Only If Applicable):
- **If complex domain:** Domain context and considerations documented
- **If innovation:** Innovation patterns and validation approach documented
- **If API/Backend:** Endpoint specification and authentication model included
- **If Mobile:** Platform requirements and device features documented
- **If SaaS B2B:** Tenant model and permission matrix included
- **If UI exists:** UX principles and key interactions documented

**Quality Checks**:
- No unfilled template variables (`{{variable}}`)
- All variables properly populated with meaningful content
- Product magic woven throughout (not just stated once)
- Language is clear, specific, and measurable
- Project type correctly identified and sections match
- Domain complexity appropriately addressed

### 4. Functional Requirements Quality Validation

**FR Format and Structure**:
- Each FR has unique identifier (FR-001, FR-002, etc.)
- FRs describe WHAT capabilities, not HOW to implement
- FRs are specific and measurable
- FRs are testable and verifiable
- FRs focus on user/business value
- No technical implementation details in FRs (those belong in architecture)

**FR Completeness**:
- All MVP scope features have corresponding FRs
- Growth features documented (even if deferred)
- Vision features captured for future reference
- Domain-mandated requirements included (if applicable)
- Innovation requirements captured with validation needs (if applicable)
- Project-type specific requirements complete

**FR Organization**:
- FRs organized by capability/feature area (not by tech stack)
- Related FRs grouped logically
- Dependencies between FRs noted when critical
- Priority/phase indicated (MVP vs Growth vs Vision)

### 5. Epics Document Completeness Validation (If Epics Created)

**Required Files**:
- epics.md exists in output folder (if epic breakdown was done)
- Epic list in PRD.md matches epics in epics.md (titles and count)
- All epics have detailed breakdown sections

**Epic Quality**:
- Each epic has clear goal and value proposition
- Each epic includes complete story breakdown
- Stories follow proper user story format: "As a [role], I want [goal], so that [benefit]"
- Each story has numbered acceptance criteria
- Prerequisites/dependencies explicitly stated per story
- Stories are AI-agent sized (completable in 2-4 hour session)

### 6. FR Coverage Validation (If Epics Created)

**Complete Traceability** - **MOST IMPORTANT VALIDATION**:
- **Every FR from PRD.md is covered by at least one story in epics.md**
- Each story references relevant FR numbers
- No orphaned FRs (requirements without stories)
- No orphaned stories (stories without FR connection)
- Coverage matrix verified (can trace FR → Epic → Stories)

**Coverage Quality**:
- Stories sufficiently decompose FRs into implementable units
- Complex FRs broken into multiple stories appropriately
- Simple FRs have appropriately scoped single stories
- Non-functional requirements reflected in story acceptance criteria
- Domain requirements embedded in relevant stories

### 7. Story Sequencing Validation (If Epics Created)

**Epic 1 Foundation Check**:
- **Epic 1 establishes foundational infrastructure**
- Epic 1 delivers initial deployable functionality
- Epic 1 creates baseline for subsequent epics
- Exception: If adding to existing app, foundation requirement adapted appropriately

**Vertical Slicing** - **SECOND MOST IMPORTANT VALIDATION**:
- **Each story delivers complete, testable functionality** (not horizontal layers)
- No "build database" or "create UI" stories in isolation
- Stories integrate across stack (data + logic + presentation when applicable)
- Each story leaves system in working/deployable state

**No Forward Dependencies**:
- **No story depends on work from a LATER story or epic**
- Stories within each epic are sequentially ordered
- Each story builds only on previous work
- Dependencies flow backward only (can reference earlier stories)
- Parallel tracks clearly indicated if stories are independent

**Value Delivery Path**:
- Each epic delivers significant end-to-end value
- Epic sequence shows logical product evolution
- User can see value after each epic completion
- MVP scope clearly achieved by end of designated epics

### 8. Scope Management Validation

**MVP Discipline**:
- MVP scope is genuinely minimal and viable
- Core features list contains only true must-haves
- Each MVP feature has clear rationale for inclusion
- No obvious scope creep in "must-have" list

**Future Work Captured**:
- Growth features documented for post-MVP
- Vision features captured to maintain long-term direction
- Out-of-scope items explicitly listed (if discussed)
- Deferred features have clear reasoning for deferral

**Clear Boundaries**:
- Requirements marked as MVP vs Growth vs Vision
- Epic sequencing aligns with MVP → Growth progression (if epics created)
- No confusion about what's in vs out of initial scope

### 9. Research and Context Integration Validation

**Source Document Integration**:
- **If product brief exists:** Key insights incorporated into PRD
- **If domain brief exists:** Domain requirements reflected in FRs
- **If research documents exist:** Research findings inform requirements
- **If competitive analysis exists:** Differentiation strategy clear in PRD
- All source documents referenced in PRD References section

**Research Continuity to Architecture**:
- Domain complexity considerations documented for architects
- Technical constraints from research captured
- Regulatory/compliance requirements clearly stated
- Integration requirements with existing systems documented
- Performance/scale requirements informed by research data

**Information Completeness for Next Phase**:
- PRD provides sufficient context for architecture decisions
- Epics provide sufficient detail for technical design (if created)
- Stories have enough acceptance criteria for implementation (if created)
- Non-obvious business rules documented
- Edge cases and special scenarios captured

### 10. Cross-Document Consistency Validation

**Terminology Consistency**:
- Same terms used across PRD and epics for concepts (if epics created)
- Feature names consistent between documents
- Epic titles match between PRD and epics.md (if epics created)
- No contradictions between PRD and epics

**Alignment Checks**:
- Success metrics in PRD align with story outcomes (if epics created)
- Product magic articulated in PRD reflected in epic goals (if epics created)
- Scope boundaries consistent across all documents

### 11. Readiness for Implementation Validation

**Architecture Readiness (Next Phase)**:
- PRD provides sufficient context for architecture workflow
- Technical constraints and preferences documented
- Integration points identified
- Performance/scale requirements specified
- Security and compliance needs clear

**Development Readiness (If Epics Created)**:
- Stories are specific enough to estimate
- Acceptance criteria are testable
- Technical unknowns identified and flagged
- Dependencies on external systems documented
- Data requirements specified

**Track-Appropriate Detail**:

**If BMad Method:**
- PRD supports full architecture workflow
- Epic structure supports phased delivery (if epics created)
- Scope appropriate for product/platform development
- Clear value delivery through epic sequence (if epics created)

**If Enterprise Method:**
- PRD addresses enterprise requirements (security, compliance, multi-tenancy)
- Epic structure supports extended planning phases (if epics created)
- Scope includes security, devops, and test strategy considerations
- Clear value delivery with enterprise gates (if epics created)

### 12. Quality and Polish Validation

**Writing Quality**:
- Language is clear and free of jargon (or jargon is defined)
- Sentences are concise and specific
- No vague statements ("should be fast", "user-friendly")
- Measurable criteria used throughout
- Professional tone appropriate for stakeholder review

**Document Structure**:
- Sections flow logically
- Headers and numbering consistent
- Cross-references accurate (FR numbers, section references)
- Formatting consistent throughout
- Tables/lists formatted properly

**Completeness Indicators**:
- No [TODO] or [TBD] markers remain
- No placeholder text
- All sections have substantive content
- Optional sections either complete or omitted (not half-done)

---

## Workflow

### Validation Sequence

Execute validation in this specific order to maximize efficiency and catch critical issues early:

**Step 1: Load Documents**
- Load PRD.md (required)
- Load epics.md (if created)
- Load product-brief.md (if exists)
- Load domain-brief.md (if exists)
- Load any referenced research documents

**Step 2: Critical Failure Check**
- Check all 7 critical failure conditions
- **If ANY critical failure found**: STOP and report immediately
- **If NO critical failures**: Proceed to detailed validation

**Step 3: Detailed Validation (Execute in Order)**
1. PRD completeness validation (Section 3)
2. Functional requirements quality validation (Section 4)
3. Epics completeness validation - if epics created (Section 5)
4. **FR coverage validation - if epics created (Section 6) - MOST IMPORTANT**
5. **Story sequencing validation - if epics created (Section 7) - SECOND MOST IMPORTANT**
6. Scope management validation (Section 8)
7. Research integration validation (Section 9)
8. Cross-document consistency validation (Section 10)
9. Readiness for implementation validation (Section 11)
10. Quality and polish validation (Section 12)

**Step 4: Calculate Validation Score**
- Count total validation items checked
- Count passed items
- Calculate pass rate: (passed / total) × 100
- Determine validation level based on pass rate

**Step 5: Determine Outcome**
- **0 Critical Failures + Pass Rate ≥ 95%**: ✅ EXCELLENT - Ready for architecture phase
- **0 Critical Failures + Pass Rate 85-94%**: ⚠️ GOOD - Minor fixes needed
- **0 Critical Failures + Pass Rate 70-84%**: ⚠️ FAIR - Important issues to address
- **0 Critical Failures + Pass Rate < 70%**: ❌ POOR - Significant rework required
- **1+ Critical Failures**: ❌ CRITICAL - Must fix critical issues before proceeding

---

## Report

### Validation Report Structure

Your validation report must include the following sections:

#### 1. Executive Summary

**Format**:
```
Validation Status: [EXCELLENT/GOOD/FAIR/POOR/CRITICAL]
Pass Rate: [X]%
Critical Failures: [count]
Documents Validated: [list of documents reviewed]
```

#### 2. Critical Failures (If Any)

**If critical failures exist**, list them prominently at the top:

```
🚨 CRITICAL FAILURES DETECTED - VALIDATION CANNOT PASS

1. [Critical failure description with specific location]
2. [Critical failure description with specific location]
...

ACTION REQUIRED: Fix all critical failures before proceeding with detailed validation.
```

#### 3. Validation Results by Category

For each validation category (sections 3-12), report:

**Category Name**: [e.g., "PRD Document Completeness"]
- **Pass Rate**: X/Y items passed (Z%)
- **Status**: ✅ Passed / ⚠️ Needs Attention / ❌ Failed

**Issues Found** (if any):
- [Specific issue with document reference and line number if possible]
- [Specific issue with document reference and line number if possible]

**What's Working Well**:
- [Highlight positive aspects]
- [Highlight positive aspects]

#### 4. Most Important Findings

Highlight the two most critical validations:

**FR Coverage Validation** (if epics created):
- Coverage rate: [X FRs covered out of Y total]
- Orphaned FRs: [list or "None"]
- Orphaned stories: [list or "None"]
- Coverage quality: [assessment]

**Story Sequencing Validation** (if epics created):
- Vertical slicing: [assessment]
- Forward dependencies: [list or "None"]
- Epic 1 foundation: [assessment]
- Value delivery path: [assessment]

#### 5. Specific Issues with Locations

Group all issues by severity:

**High Priority Issues**:
1. [Issue description] - Location: [PRD.md line X / epics.md Epic Y Story Z]
2. [Issue description] - Location: [specific reference]

**Medium Priority Issues**:
1. [Issue description] - Location: [specific reference]
2. [Issue description] - Location: [specific reference]

**Low Priority Issues** (Polish/Quality):
1. [Issue description] - Location: [specific reference]
2. [Issue description] - Location: [specific reference]

#### 6. Strengths

Highlight what's working well in the planning documents:
- [Specific strength with example]
- [Specific strength with example]
- [Specific strength with example]

#### 7. Concrete Fixes Required

Provide actionable next steps for each issue:

**For Critical Failures**:
1. [Specific action to take]
2. [Specific action to take]

**For High Priority Issues**:
1. [Specific action to take]
2. [Specific action to take]

**For Medium Priority Issues**:
1. [Specific action to take]
2. [Specific action to take]

**For Low Priority Issues**:
1. [Specific action to take] (optional, can be deferred)

#### 8. Recommendation and Next Steps

Based on validation outcome:

**If EXCELLENT (≥95%, 0 critical failures)**:
```
✅ RECOMMENDATION: Proceed to architecture workflow

This PRD [and epics] meet all quality standards and provide sufficient detail for architecture and implementation. No blocking issues identified.

NEXT STEP: Begin architecture workflow to define technical approach.
```

**If GOOD (85-94%, 0 critical failures)**:
```
⚠️ RECOMMENDATION: Address [X] minor issues, then proceed

This PRD [and epics] are solid with minor issues that should be fixed but are not blocking.

NEXT STEP: Fix the [X] medium priority issues listed above, then proceed to architecture workflow. Re-validation optional but recommended.
```

**If FAIR (70-84%, 0 critical failures)**:
```
⚠️ RECOMMENDATION: Address important issues before proceeding

This PRD [and epics] have important gaps that could cause problems during implementation.

NEXT STEP: Rework the following sections [list sections], then re-validate before proceeding to architecture.
```

**If POOR (<70%, 0 critical failures)**:
```
❌ RECOMMENDATION: Significant rework required

This PRD [and epics] require substantial revision to meet quality standards.

NEXT STEP: Rework [list major sections/areas], focusing on [specific areas like FR coverage, story sequencing, etc.], then re-validate completely.
```

**If CRITICAL (any critical failures)**:
```
🚨 RECOMMENDATION: Fix critical failures immediately

Critical failures prevent the PRD [and epics] from being usable for implementation.

NEXT STEP: Address all critical failures listed above, then re-run validation from the beginning. Do not proceed to detailed fixes until critical issues are resolved.
```

#### 9. Validation Metadata

Include technical details for traceability:
- Validation Date: [date]
- Validator: [AI agent or human]
- Documents Validated: [list with versions/dates if available]
- Total Validation Items: [count]
- Items Passed: [count]
- Items Failed: [count]
- Pass Rate: [percentage]

---

### Reporting Guidelines

**Be Thorough But Fair**: The goal is quality, not perfection. Use judgment in determining severity.

**Be Specific**: Always provide document names, section references, or line numbers when identifying issues.

**Be Actionable**: Each issue should have a clear fix. Avoid vague statements like "improve quality."

**Be Balanced**: Highlight what's working well, not just problems. Positive reinforcement helps teams understand what to replicate.

**Be Clear on Next Steps**: The reader should know exactly what to do next based on the validation outcome.

**Use Consistent Terminology**: Match terminology used in the PRD and epics. Don't introduce new terms in the validation report.

---

**Remember:** This validation ensures the planning phase is complete and implementation has everything needed to succeed. A failing validation is not a failure of the team—it's the validation doing its job to catch issues before they become expensive implementation problems.
