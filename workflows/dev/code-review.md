---
description: Senior Developer systematic code review with AC validation, task verification, and structured findings
---

# Code Review

Performs a systematic Senior Developer review on completed stories, validating every acceptance criterion, verifying every completed task, and generating structured review notes with evidence-based findings.

## Purpose

Provides comprehensive, systematic code review with zero-tolerance validation - every AC checked, every task verified, all findings evidence-based. Tasks marked complete but not actually done = HIGH SEVERITY finding. This is an uncompromising gatekeeper.

**Key Principle:** SYSTEMATIC VALIDATION - No shortcuts. No assumptions. Every claim is verified with evidence.

## Quick Start

```bash
# Prerequisites: story implemented and marked "review" status
/bmad:phase-4:code-review

# Workflow will:
# 1. Find first story with status "review"
# 2. Validate ALL ACs with evidence
# 3. Verify ALL completed tasks
# 4. Perform quality/security review
# 5. Determine outcome (APPROVE/CHANGES/BLOCKED)
# 6. Update sprint status accordingly
```

## Prerequisites

See [shared/prerequisites.md#phase-4-code-review](../shared/prerequisites.md)

**Workflow-specific:**
- [ ] Story implemented and marked "review" status
- [ ] Story context file exists (warning if missing)
- [ ] Epic tech spec available (warning if missing)

## Instructions

### Two Review Modes

**Story Review Mode** (Default):
- Finds first story with status "review" in sprint-status
- Performs systematic validation against ACs and tasks
- Appends review to story file
- Updates sprint status based on outcome

**Ad-Hoc Review Mode** (Fallback):
- Reviews any specified files
- Focus on user-specified criteria
- Generates standalone report
- No sprint status updates

### 1. Load Configuration and Find Story

See [shared/common-operations.md#load-configuration](../shared/common-operations.md)

**Find first story with status "review":**

From `{sprint_artifacts}/sprint-status.yaml`, find first story where:
- Key matches pattern: `{epic}-{story}-{name}`
- NOT an epic or retrospective
- Status equals "review"

**If no stories with status "review":**

Use AskUserQuestion tool:
- Option 1: Run dev-story
- Option 2: Check sprint status
- Option 3: Ad-hoc review (asks for files and focus)

**If ad-hoc selected:**
- Set `ad_hoc_review_mode = true`
- Parse: `review_files`, `review_focus`, `review_context`
- Skip to validation with custom scope

### 2. Parse Story and Load Context

**Extract from story file:**
- Metadata: Epic number, story number, title, status
- Sections: Story, Acceptance Criteria, Tasks, Dev Notes, Dev Agent Record, Change Log

**Locate files:**
- Story context: From Dev Agent Record → Context Reference
- Epic tech spec: `{sprint_artifacts}/tech-spec-epic-{epic_num}.md`
- Architecture docs: `.bmad/architecture.md`, `.bmad/ux-design.md`

**If files missing:** Record warnings in review notes, continue with limited context

### 3. Detect Tech Stack and Best Practices

Scan dependency manifests:
- `package.json` → Node.js/JavaScript (Express, React, Next.js)
- `pyproject.toml`/`requirements.txt` → Python (FastAPI, Django, Flask)
- `go.mod` → Go
- `Cargo.toml` → Rust
- `pom.xml`/`build.gradle` → Java/JVM

Synthesize best-practices note: framework versions, security practices, testing patterns, performance optimizations.

### 4. Systematic Validation

#### Step 4A: AC VALIDATION (Story Mode)

**For EACH acceptance criterion:**

1. Read AC requirement completely
2. Search changed files for evidence
3. Determine status:
   - **IMPLEMENTED**: Full implementation with tests
   - **PARTIAL**: Implementation incomplete or tests missing
   - **MISSING**: No implementation found

4. Record evidence:
   - File path and line numbers
   - Code snippets proving AC met
   - Test coverage for AC

5. If PARTIAL or MISSING:
   - Flag as finding
   - Severity: HIGH (critical ACs), MEDIUM (important), LOW (nice-to-have)

6. Document in AC validation table:

| AC# | Description | Status | Evidence | Tests |
|-----|-------------|--------|----------|-------|
| 1 | User can log in | IMPLEMENTED | auth.service.ts:45-67 | ✓ Unit, E2E |
| 2 | Password validation | PARTIAL | Missing complexity check | ✗ No unit test |
| 3 | Account lockout | MISSING | Not found | ✗ No tests |

**Generate AC Coverage Summary with visual indicators.**

#### Step 4B: TASK VERIFICATION (Story Mode)

**For EACH task marked COMPLETED [x]:**

1. Read task description completely
2. Search changed files for evidence task was done
3. Determine verification status:
   - **VERIFIED COMPLETE**: Clear evidence task done
   - **QUESTIONABLE**: Unclear if fully complete
   - **NOT DONE**: Task marked complete but NOT DONE

4. **CRITICAL - FALSE COMPLETION DETECTION:**
   - If marked [x] but NOT DONE → **HIGH SEVERITY** finding
   - Message: "Task marked complete but implementation not found: {task}"
   - This is a critical integrity issue

5. Document in task validation table with evidence

**For tasks marked INCOMPLETE [ ]:**
- Note it was not claimed complete
- Check if actually done anyway (helpful correction, not a finding)

**Generate Task Completion Summary with critical flags.**

#### Step 4C: CROSS-CHECK EPIC TECH-SPEC

From tech spec, extract: required services/modules, data model, API specs, NFRs, dependencies, architecture constraints.

**Check implementation against specs:**
- Required components present?
- APIs match specifications?
- NFRs addressed?
- Dependencies correct?

**Architecture violations** → HIGH SEVERITY:
- Layering violations
- Dependency rule violations
- Security violations
- Performance violations (N+1 query, no pagination)

#### Step 4D: COMPILE VALIDATION FINDINGS

**Structured findings by severity:**

**HIGH Severity:**
- Missing critical AC implementations
- Tasks falsely marked complete
- Critical architecture violations
- Security vulnerabilities
- Data integrity issues

**MEDIUM Severity:**
- Partial AC implementations
- Questionable task completions
- Missing tests for ACs
- Non-critical architecture violations
- Code quality issues

**LOW Severity:**
- Code style inconsistencies
- Missing documentation
- Minor performance optimizations
- Nice-to-have improvements

### 5. Code Quality and Risk Review

**For each changed file, review:**

**Error Handling:** Try/catch blocks, error logging, user-friendly messages, recovery strategies

**Input Validation:** All inputs validated, type checking, sanitization, validation errors handled

**Security Review (OWASP Top 10):**
- Injection risks (SQL, XSS, command injection)
- Auth/Authz (authentication required, authorization checked)
- Secret management (no secrets in code, env vars used)
- Unsafe defaults, redirects, CORS
- Dependencies with known vulnerabilities

**Performance Review:** N+1 queries, pagination, inefficient algorithms, memory leaks, blocking operations

**Test Quality:** Meaningful assertions, edge cases, deterministic, proper fixtures/mocks, AAA pattern

**Capture findings with format:**
```
[Severity] Issue description
- File: path/to/file.ts:line
- AC: #X (if related)
- Rationale: Why this is an issue
- Suggestion: Specific fix
```

### 6. Decide Review Outcome

**BLOCKED:** (Status stays "review")
- ANY HIGH severity finding
- AC missing or PARTIAL with HIGH severity
- Task falsely marked complete
- Critical architecture violation
- Security vulnerability
- Cannot proceed until resolved

**CHANGES REQUESTED:** (Status → "in-progress")
- Any MEDIUM severity findings
- Multiple LOW severity findings (> 5)
- Quality improvements needed
- Can proceed after fixes

**APPROVE:** (Status → "done")
- ALL ACs IMPLEMENTED with tests
- ALL completed tasks VERIFIED
- No HIGH or MEDIUM findings
- Only minor LOW severity items

### 7. Prepare Comprehensive Review Report

**Structure:**

```markdown
# Senior Developer Review (AI)

**Reviewer:** {user_name}
**Date:** {date}
**Outcome:** [APPROVE | CHANGES REQUESTED | BLOCKED]

## Summary
{2-3 sentence overview}

## Outcome Justification
{Why this outcome - reference key findings}

## Key Findings

### HIGH Severity
- [High] {finding with file:line reference}

### MEDIUM Severity
- [Medium] {finding with file:line reference}

### LOW Severity
- [Low] {finding with file:line reference}

## Acceptance Criteria Coverage
**Summary:** {X} of {Y} fully implemented

{AC validation table}

**Findings:**
{AC-specific findings}

## Task Completion Validation
**Summary:** {X} of {Y} verified, {Z} questionable, {W} falsely marked

{Task validation table}

**CRITICAL FINDINGS:**
{False completion flags}

## Test Coverage and Gaps
{Coverage summary and gaps}

## Architectural Alignment
{Tech spec compliance and violations}

## Security Notes
{Security findings and compliance}

## Best-Practices and References
{Framework, libraries, latest considerations}

## Action Items

**Code Changes Required:**
- [ ] [High] {action} [file: path]
- [ ] [Medium] {action} [file: path]

**Advisory Notes:**
{Optional improvements}

**Total:** {count} required actions, {count} advisory notes
```

**CRITICAL:** Must include complete AC validation checklist and task validation checklist.

### 8. Append Review and Update Status

**If ad-hoc review mode:**
- Create standalone review report: `.bmad/code-review-{date}.md`
- Output: Path to review report

**If story review mode:**
- Append review to story file: `{sprint_artifacts}/stories/{story_key}.md`
- Add Change Log entry: `{date} - Senior Developer Review notes appended - {outcome}`
- Update story status based on outcome

**Update sprint-status.yaml:**

See [shared/common-operations.md#update-sprint-status](../shared/common-operations.md)

Target status based on outcome:
- APPROVE → `done`
- CHANGES REQUESTED → `in-progress`
- BLOCKED → `review` (stays)

### 9. Report Completion - NO Auto-Continue

**Story review mode:**

```
✅ Story Review Complete!

**Story Details:**
- Story: {epic}.{story} - {title}
- Review Outcome: {outcome}
- Sprint Status: {old} → {new}
- Action Items: {count} ({high} High, {med} Medium, {low} Low)

**Acceptance Criteria:** {X} of {Y} fully implemented
**Tasks Verified:** {X} of {Y} claimed complete
**Critical Issues:** {Z} tasks falsely marked complete

**Next Steps:**
1. Review the Senior Developer Review notes appended to story
2. If APPROVED: ✓ Story is done, continue with next story
3. If CHANGES REQUESTED: Address {count} action items and re-run dev-story
4. If BLOCKED: Resolve {high_count} HIGH severity blockers before proceeding
```

**Ad-hoc review mode:**

```
✅ Ad-Hoc Code Review Complete!

**Review Details:**
- Files Reviewed: {files}
- Review Focus: {focus}
- Review Outcome: {outcome}
- Action Items: {count}
- Review Report: .bmad/code-review-{date}.md

**Next Steps:**
1. Review the detailed findings in the review report
2. Address action items in the code
3. Re-run review on updated code if needed
```

**CRITICAL:**
- DO NOT auto-continue after code review
- User should review findings
- This is a quality gate - user oversight is valuable

## Key Constraints

- **Zero-tolerance validation:** Every AC checked, every task verified with evidence
- **False completions = CRITICAL:** Tasks marked [x] but NOT DONE are HIGH severity
- **Evidence required:** All findings must have file:line references
- **Severity drives outcome:** HIGH = BLOCKED, MEDIUM = CHANGES, LOW = ADVISORY
- **Systematic coverage:** Complete AC and task validation tables required
- **Best practices:** Latest framework/security guidelines referenced

## Notes

- **No shortcuts:** Every claim verified with evidence
- **Integrity issue:** False task completions flagged prominently
- **Two modes:** Story review (systematic) or ad-hoc review (custom)
- **Quality gate:** User reviews findings before proceeding
- **Action items tracked:** Can be added to backlog, story tasks, epic follow-ups
- **Security focus:** OWASP Top 10 compliance checked
- **Test coverage:** Verified for all ACs

**Philosophy:** Uncompromising gatekeeper that ensures quality through systematic validation, evidence-based findings, and clear outcome determination.

---

**References:**
- Examples: [examples/code-review-examples.md](../examples/code-review-examples.md)
- Troubleshooting: [shared/troubleshooting.md#code-review](../shared/troubleshooting.md)
- Philosophy: [shared/design-philosophy.md#systematic-validation](../shared/design-philosophy.md)
- Common Operations: [shared/common-operations.md](../shared/common-operations.md)
