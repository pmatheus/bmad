---
description: Senior Developer systematic code review with AC validation, task verification, and structured findings
---

# Code Review

Performs a systematic Senior Developer review on completed stories, validating every acceptance criterion, verifying every completed task, and generating structured review notes with evidence-based findings.

## What This Does

This workflow provides **comprehensive, systematic code review** with:

- **Zero-tolerance validation**: Every AC checked, every task verified
- Evidence-based findings (file:line references)
- Security, quality, and architecture review
- Best-practices validation against latest standards
- Structured action items with severity levels
- Automatic status updates based on review outcome

**Key Principle:** **SYSTEMATIC VALIDATION** - No shortcuts. No assumptions. Every claim is verified with evidence. Tasks marked complete but not actually done = HIGH SEVERITY finding. This is an uncompromising gatekeeper.

## Prerequisites

Before running this workflow:

- [ ] BMAD plugin installed in Claude Code
- [ ] Project initialized (`/bmad/workflow-init`)
- [ ] Story implemented and marked "review" status
- [ ] Story context file exists
- [ ] Epic tech spec available (for architecture validation)

**For story review mode:**
- `.bmad/sprint-artifacts/sprint-status.yaml` - Story tracking
- `.bmad/sprint-artifacts/stories/{story-key}.md` - Story file with status "review"
- `.bmad/sprint-artifacts/stories/{story-key}.context.xml` - Story context
- `.bmad/sprint-artifacts/tech-spec-epic-{N}.md` - Epic specification

**For ad-hoc review mode:**
- Code files to review
- Review focus/criteria

## How It Works

### Two Review Modes

**1. Story Review Mode** (Default)
- Finds first story with status "review" in sprint-status
- Performs systematic validation against ACs and tasks
- Appends review to story file
- Updates sprint status based on outcome

**2. Ad-Hoc Review Mode** (Fallback)
- Reviews any specified files
- Focus on user-specified criteria (quality, security, performance, etc.)
- Generates standalone review report
- No sprint status updates

### Systematic Validation Process

**AC Validation:**
1. Read each acceptance criterion
2. Search changed files for evidence
3. Determine: IMPLEMENTED, PARTIAL, or MISSING
4. Record file:line evidence
5. Check for corresponding tests
6. Flag any gaps as findings

**Task Verification:**
1. Read each task marked complete [x]
2. Search changed files for proof task was done
3. Determine: VERIFIED, QUESTIONABLE, or NOT DONE
4. **CRITICAL**: Task marked complete but NOT DONE = HIGH SEVERITY
5. Record file:line evidence
6. Flag false completions prominently

**Quality Review:**
- Error handling
- Input validation
- Security (injection, auth, secrets)
- Performance anti-patterns
- Test quality
- Architecture alignment

### Review Outcomes

**APPROVE** → Status: done
- All ACs implemented
- All completed tasks verified
- No significant issues

**CHANGES REQUESTED** → Status: in-progress
- MEDIUM severity findings
- Multiple LOW severity issues
- Quality improvements needed

**BLOCKED** → Status: review (stays)
- HIGH severity findings
- AC missing
- Task falsely marked complete
- Critical architecture violation

## Instructions

### Step 1: Load Configuration

Read project configuration from `.bmad/config.yaml`:

```javascript
{
  output_folder: string,        // Where docs are stored
  user_name: string,            // Reviewer name
  sprint_artifacts: string,     // Sprint files location
  user_skill_level: string,     // Communication style (not review rigor)
  bmad_folder: string           // BMAD install location
}
```

### Step 2: Find Story Ready for Review

**Read sprint status file:**

Look for: `.bmad/sprint-artifacts/sprint-status.yaml` OR `.bmad/sprint-status.yaml`

**Find first story with status "review":**

```yaml
development_status:
  epic-1:
    status: contexted
  1-1-user-registration:
    status: done
  1-2-user-authentication:
    status: review  # ← Target this one
  1-3-password-reset:
    status: ready-for-dev
```

**Rules:**
- Read ALL lines from start to end (preserve order)
- Find FIRST story where:
  - Key matches pattern: `{epic}-{story}-{name}`
  - NOT an epic or retrospective
  - Status equals "review"

**If no stories with status "review":**

Use **AskUserQuestion** tool:
```yaml
questions:
  - question: "No stories with status 'review' found. What would you like to do?"
    header: "Action"
    multiSelect: false
    options:
      - label: "Run dev-story"
        description: "Implement a story and mark ready for review"
      - label: "Check sprint status"
        description: "Review current story states in sprint-status.yaml"
      - label: "Ad-hoc review"
        description: "Review specific code files with custom criteria"
```

**If "Ad-hoc review" selected:**

Ask user:
```
What code would you like me to review?

Provide:
- File path(s) or directory to review
- What to review for:
  • General quality and standards
  • Requirements compliance
  • Security concerns
  • Performance issues
  • Architecture alignment
  • Something else (specify)
```

Parse user input:
- `review_files`: File paths or directories
- `review_focus`: What aspects to review
- `review_context`: Additional context

Set `ad_hoc_review_mode = true` and skip to Step 4 (validation) with custom scope.

**If story found:**
- Store `story_key`
- Find story file: `.bmad/sprint-artifacts/stories/{story_key}.md`
- Read COMPLETE story file

### Step 3: Parse Story File and Load Context

**Extract from story file:**

**Metadata:**
- Epic number (e.g., 1)
- Story number (e.g., 2)
- Story title
- Current status (must be "review")

**Sections:**
- **Story**: User story text
- **Acceptance Criteria**: Numbered list of ACs
- **Tasks/Subtasks**: Task list with completion state ([x] or [ ])
- **Dev Notes**: Development guidelines
- **Dev Agent Record**:
  - Context Reference: Path to `.context.xml` file
  - Completion Notes: Implementation summary
  - File List: Changed/added files
- **Change Log**: Version history

**Locate story context file:**

From Dev Agent Record → Context Reference, read path(s).

If missing, search for: `.bmad/sprint-artifacts/stories/{epic}-{story}-*.context.xml`

**If no context file found:**
```
⚠️ WARNING: No story context file found

Continuing review, but context is limited.
```
→ Record as warning in review notes

**Locate epic tech spec:**

Search `.bmad/sprint-artifacts/tech-spec-epic-{epic_num}.md`

**If no tech spec found:**
```
⚠️ WARNING: No Tech Spec found for epic {epic_num}

Cannot validate architecture alignment fully.
```
→ Record as warning in review notes

**Load architecture documentation:**

Search for:
- `.bmad/architecture.md` (or `.bmad/architecture/index.md` if sharded)
- `.bmad/ux-design.md` (if exists, for UI stories)
- Testing standards documentation
- Coding standards documentation

Collect:
- Architectural patterns
- Testing requirements
- Security guidelines
- Coding standards

### Step 4: Detect Tech Stack and Best Practices

**Detect primary ecosystem:**

Scan for dependency manifests:
- `package.json` → Node.js/JavaScript
- `pyproject.toml` / `requirements.txt` → Python
- `go.mod` → Go
- `Cargo.toml` → Rust
- `pom.xml` / `build.gradle` → Java/JVM
- `Packages/manifest.json` → Unity

**Record key frameworks:**
- Node/Express, React/Vue/Angular, Next.js
- Python/FastAPI, Django, Flask
- Go/Gin, Echo
- Etc.

**Synthesize best-practices note:**

Capture latest considerations:
- Framework version updates
- Security best practices
- Testing patterns
- Performance optimizations

### Step 5: Systematic Validation

**If ad-hoc review mode:**
- Use `review_files` as file list
- Focus on `review_focus` aspects
- Use `review_context` for guidance
- Skip AC checking (no story context)
- Verify architecture alignment if docs exist

**If story review mode:**

#### Step 5A: SYSTEMATIC ACCEPTANCE CRITERIA VALIDATION

**For EACH acceptance criterion:**

1. Read AC requirement completely
2. Search changed files for evidence
3. Determine status:
   - **IMPLEMENTED**: Full implementation with tests
   - **PARTIAL**: Implementation incomplete or tests missing
   - **MISSING**: No implementation found

4. Record evidence:
   - File path and line numbers
   - Code snippets proving AC is met
   - Test coverage for AC

5. Check for tests:
   - Unit tests for AC logic
   - Integration tests for AC workflows
   - E2E tests for AC user flows

6. If PARTIAL or MISSING:
   - Flag as finding
   - Severity: Based on AC criticality
   - HIGH for critical ACs (auth, security, data integrity)
   - MEDIUM for important ACs (features, UX)
   - LOW for nice-to-have ACs

7. Document in AC validation table:

| AC# | Description | Status | Evidence | Tests |
|-----|-------------|--------|----------|-------|
| 1 | User can log in | IMPLEMENTED | auth.service.ts:45-67 | ✓ Unit, E2E |
| 2 | Password validation | PARTIAL | Missing complexity check | ✗ No unit test |
| 3 | Account lockout | MISSING | Not found | ✗ No tests |

**Generate AC Coverage Summary:**
```
Acceptance Criteria Coverage: 1 of 3 fully implemented

- ✓ AC1: Fully implemented with tests
- ⚠️ AC2: PARTIAL - Missing password complexity validation
- ✗ AC3: MISSING - No account lockout implementation found
```

#### Step 5B: SYSTEMATIC TASK COMPLETION VALIDATION

**For EACH task marked as COMPLETED [x]:**

1. Read task description completely
2. Search changed files for evidence task was done
3. Determine verification status:
   - **VERIFIED COMPLETE**: Clear evidence task was done
   - **QUESTIONABLE**: Unclear if task fully complete
   - **NOT DONE**: Task marked complete but NOT DONE

4. Record evidence:
   - File path and line numbers
   - Code changes proving task completion
   - Artifacts created (tests, docs, migrations, etc.)

5. **CRITICAL - FALSE COMPLETION DETECTION:**
   - If marked [x] but NOT DONE → **HIGH SEVERITY** finding
   - Message: "Task marked complete but implementation not found: {task description}"
   - This is a critical integrity issue
   - Must be flagged prominently

6. If QUESTIONABLE:
   - Flag as **MEDIUM SEVERITY** finding
   - Message: "Task completion unclear: {task description}"
   - Request clarification

7. Document in task validation table:

| Task | Marked | Verified | Evidence |
|------|--------|----------|----------|
| Implement login endpoint | [x] | ✓ COMPLETE | auth.controller.ts:23-45 |
| Add password hashing | [x] | ⚠️ QUESTIONABLE | bcrypt used but salt rounds unclear |
| Create unit tests | [x] | ✗ NOT DONE | No test files found |

**For EACH task marked as INCOMPLETE [ ]:**

1. Note it was not claimed complete
2. Check if actually done anyway (devs forget checkboxes)
3. If done but not marked:
   - Note in review (helpful correction, not a finding)
   - Example: "Task not marked complete but appears done: {task}"

**Generate Task Completion Summary:**
```
Task Completion: 5 tasks claimed complete

- ✓ 3 tasks verified complete
- ⚠️ 1 task questionable
- ✗ 1 task FALSELY marked complete (HIGH SEVERITY)

CRITICAL: Task "Create unit tests" marked [x] but no test files found.
This is a HIGH SEVERITY finding requiring immediate attention.
```

#### Step 5C: CROSS-CHECK EPIC TECH-SPEC REQUIREMENTS

**Validate against epic tech spec:**

From tech spec, extract:
- Required services/modules
- Data model requirements
- API specifications
- NFRs (performance, security, reliability)
- Dependencies
- Architecture constraints

**Check implementation:**
- Are required components present?
- Do APIs match specifications?
- Are NFRs addressed?
- Are dependencies correct?

**Architecture violations:**

If critical constraints violated:
- Layering violations (e.g., controller calling database directly)
- Dependency rule violations (e.g., wrong library used)
- Security violations (e.g., no auth on protected endpoint)
- Performance violations (e.g., N+1 query, no pagination)

→ Flag as **HIGH SEVERITY** finding

#### Step 5D: COMPILE VALIDATION FINDINGS

**Structured findings list:**

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

### Step 6: Code Quality and Risk Review

**For each changed file, review:**

**Error Handling:**
- Try/catch blocks present?
- Errors logged properly?
- Error messages user-friendly?
- Error recovery strategies?

**Input Validation:**
- All inputs validated?
- Type checking?
- Sanitization?
- Validation errors handled?

**Security Review:**
- **Injection risks**: SQL injection, XSS, command injection
- **Auth/Authz**: Authentication required? Authorization checked?
- **Secret management**: No secrets in code? Environment variables used?
- **Unsafe defaults**: Secure defaults set?
- **Redirects**: Validated redirects? No open redirects?
- **CORS**: Properly configured?
- **Dependencies**: Known vulnerabilities?

**Performance Review:**
- N+1 queries?
- Missing pagination?
- Inefficient algorithms?
- Memory leaks?
- Blocking operations?

**Test Quality:**
- Meaningful assertions?
- Edge cases covered?
- Deterministic (no flakiness)?
- Proper fixtures/mocks?
- AAA pattern followed?

**Capture findings:**

Format:
```
[Severity] Issue description
- File: path/to/file.ts:line
- AC: #X (if related)
- Rationale: Why this is an issue
- Suggestion: Specific fix
```

Example:
```
[High] SQL injection vulnerability in user search
- File: src/api/users.ts:45
- AC: #2 (User search)
- Rationale: User input directly interpolated into SQL query
- Suggestion: Use parameterized queries or ORM

[Medium] Missing error handling on API call
- File: src/services/auth.service.ts:78
- AC: #1 (User login)
- Rationale: Network errors not caught, app could crash
- Suggestion: Wrap in try/catch, return user-friendly error
```

### Step 7: Decide Review Outcome

**Determine outcome based on findings:**

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
- Only minor LOW severity items (optional improvements)

### Step 8: Prepare Comprehensive Review Report

**Structure:**

```markdown
# Senior Developer Review (AI)

**Reviewer:** {user_name}
**Date:** {date}
**Outcome:** [APPROVE | CHANGES REQUESTED | BLOCKED]

## Summary

{2-3 sentence overview of review and key concerns}

## Outcome Justification

[APPROVE] All ACs implemented, all tasks verified, no significant issues.

[CHANGES REQUESTED] {count} MEDIUM severity findings require attention before completion.

[BLOCKED] HIGH severity findings block story completion:
- {High severity issue 1}
- {High severity issue 2}

## Key Findings

### HIGH Severity
- [High] {finding with file:line reference}
- [High] {finding with file:line reference}

### MEDIUM Severity
- [Medium] {finding with file:line reference}
- [Medium] {finding with file:line reference}

### LOW Severity
- [Low] {finding with file:line reference}

## Acceptance Criteria Coverage

**Summary:** {X} of {Y} acceptance criteria fully implemented

| AC# | Description | Status | Evidence | Tests |
|-----|-------------|--------|----------|-------|
| 1 | {AC text} | IMPLEMENTED | {file:line} | ✓ Unit, E2E |
| 2 | {AC text} | PARTIAL | {file:line} | ✗ Missing |
| 3 | {AC text} | MISSING | Not found | ✗ None |

**Findings:**
- ⚠️ AC2: Missing password complexity validation (MEDIUM severity)
- ✗ AC3: No account lockout implementation found (HIGH severity)

## Task Completion Validation

**Summary:** {X} of {Y} completed tasks verified, {Z} questionable, {W} falsely marked complete

| Task | Marked | Verified | Evidence |
|------|--------|----------|----------|
| {Task 1} | [x] | ✓ COMPLETE | {file:line} |
| {Task 2} | [x] | ⚠️ QUESTIONABLE | {reason} |
| {Task 3} | [x] | ✗ NOT DONE | **No implementation found** |

**CRITICAL FINDINGS:**
- ✗ Task "{task description}" marked [x] but NOT DONE (HIGH SEVERITY)
  Evidence: Searched {files}, no implementation found
  Action: Implement or uncheck task

## Test Coverage and Gaps

**Coverage:**
- AC1: ✓ Unit tests, ✓ E2E tests
- AC2: ✗ No unit tests for password validation
- AC3: ✗ No tests (AC not implemented)

**Gaps:**
- Missing unit tests for AC2 (MEDIUM severity)
- Missing all tests for AC3 (BLOCKED by AC3 not implemented)
- No edge case tests for error conditions (LOW severity)

## Architectural Alignment

**Tech Spec Compliance:**
- ✓ Uses specified auth library (passport-jwt)
- ✓ Follows repository pattern
- ⚠️ Missing rate limiting (MEDIUM severity)

**Architecture Violations:**
- [High] Controller directly calls database (violates layering)
  File: src/auth/auth.controller.ts:67
  Should: Use service layer

## Security Notes

**Findings:**
- [High] SQL injection vulnerability in user search (src/api/users.ts:45)
- [Medium] Passwords not hashed with sufficient rounds (bcrypt rounds < 10)
- [Low] Missing CSRF protection (advisory for production)

**Compliance:**
- ✓ HTTPS enforced
- ✓ JWT tokens used correctly
- ⚠️ No rate limiting (could allow brute force)

## Best-Practices and References

**Framework:** Node.js + Express + TypeScript
**Auth:** passport-jwt ^4.0.1
**Testing:** Jest ^29.0.0

**Latest Considerations:**
- Express security best practices: https://expressjs.com/en/advanced/best-practice-security.html
- OWASP Top 10 (2021): https://owasp.org/www-project-top-ten/
- TypeScript strict mode enabled ✓
- ESLint configured ✓

## Action Items

**Code Changes Required:**
- [ ] [High] Fix SQL injection in user search (AC #2) [file: src/api/users.ts:45]
- [ ] [High] Implement account lockout feature (AC #3) [new file needed]
- [ ] [High] Add service layer, remove direct DB access [file: src/auth/auth.controller.ts:67]
- [ ] [Medium] Add unit tests for password validation (AC #2) [file: tests/unit/auth.test.ts]
- [ ] [Medium] Increase bcrypt salt rounds to 12 [file: src/auth/auth.service.ts:34]
- [ ] [Medium] Implement rate limiting [file: src/middleware/rate-limit.ts]

**Advisory Notes:**
- Note: Consider adding CSRF protection for production deployment
- Note: Document JWT expiration policy in README
- Note: Add OpenAPI/Swagger documentation for auth endpoints

**Total:** 6 required actions (3 High, 3 Medium), 3 advisory notes
```

**CRITICAL:** Must include complete AC validation checklist and task validation checklist - this is evidence that systematic review was performed.

### Step 9: Append Review to Story and Update Status

**If ad-hoc review mode:**

Create standalone review report:

File: `.bmad/code-review-{date}.md`

Include sections:
- Review Type: Ad-Hoc Code Review
- Reviewer, Date
- Files Reviewed
- Review Focus
- Outcome
- Summary
- Key Findings
- Test Coverage and Gaps
- Architectural Alignment
- Security Notes
- Best-Practices and References
- Action Items

Output: `Review saved to: .bmad/code-review-{date}.md`

**If story review mode:**

**Update story file:**

File: `.bmad/sprint-artifacts/stories/{story_key}.md`

**Append new section at end:**

```markdown
---

## Senior Developer Review (AI)

{Review report from Step 8}
```

**Add Change Log entry:**

```markdown
## Change Log

- {date} - Senior Developer Review notes appended - {outcome}
```

**Update Status if outcome determines:**

- APPROVE → `Status: done`
- CHANGES REQUESTED → `Status: in-progress`
- BLOCKED → `Status: review` (stays)

**Save story file**

### Step 10: Update Sprint Status

**If ad-hoc review mode:**
- Skip sprint status update (no story context)
- Output: `Ad-hoc review complete - no sprint status to update`

**If story review mode:**

**Determine target status:**
- Outcome "Approve" → `target_status = "done"`
- Outcome "Changes Requested" → `target_status = "in-progress"`
- Outcome "Blocked" → `target_status = "review"` (stay in review)

**Update sprint-status.yaml:**

File: `.bmad/sprint-artifacts/sprint-status.yaml` OR `.bmad/sprint-status.yaml`

1. Load FULL file
2. Find `development_status[{story_key}]`
3. Verify current status is "review"
4. Update: `development_status[{story_key}] = {target_status}`
5. Save file, preserving ALL comments and structure

**If successful:**
```
✅ Sprint status updated: review → {target_status}
```

**If story key not found:**
```
⚠️ Could not update sprint-status: {story_key} not found

Review saved to story file, but sprint-status.yaml may be out of sync.
Run /bmad/sprint-planning to refresh tracking.
```

### Step 11: Persist Action Items

**If ad-hoc review mode:**

All action items in standalone review report.

Ask user: `Would you like me to create tracking items for these action items?`

If yes:
- Create or open `.bmad/backlog.md`
- Append rows: Date | Story | Epic | Type | Severity | Owner | Status | Notes

**If story review mode:**

**Normalize action items:**

Structure:
- Description
- Severity (High/Med/Low)
- Type (Bug/TechDebt/Enhancement)
- Suggested owner
- Related AC/file references

**Add to story Tasks:**

If action items exist, ask: `Add {count} follow-up items to story Tasks?`

If yes, append to story under "Tasks / Subtasks":

```markdown
### Review Follow-ups (AI)

- [ ] [AI-Review][High] Fix SQL injection in user search (AC #2)
- [ ] [AI-Review][High] Implement account lockout (AC #3)
- [ ] [AI-Review][Medium] Add unit tests for password validation
```

**Add to backlog:**

Create or open `.bmad/backlog.md`

Append rows for each action item:
```
| {date} | {epic}.{story} | {epic} | {type} | {severity} | TBD | Open | {notes with file refs} |
```

**Add to epic tech spec:**

If epic tech spec exists, open it.

Create or append to section: "Post-Review Follow-ups"

```markdown
## Post-Review Follow-ups

**From Story {epic}.{story} - {story_title}:**
- [High] Fix SQL injection in user search
- [High] Implement account lockout feature
- [Medium] Add unit tests for password validation
```

**Save all modified files**

### Step 12: Report Completion

**If ad-hoc review mode:**

```
✅ Ad-Hoc Code Review Complete!

**Review Details:**
- Files Reviewed: {review_files}
- Review Focus: {review_focus}
- Review Outcome: {outcome}
- Action Items: {count} ({high} High, {med} Medium, {low} Low)
- Review Report: .bmad/code-review-{date}.md

**Next Steps:**
1. Review the detailed findings in the review report
2. If changes requested: Address action items in the code
3. If blocked: Resolve blockers before proceeding
4. Re-run review on updated code if needed
```

**If story review mode:**

```
✅ Story Review Complete!

**Story Details:**
- Story: {epic}.{story} - {story_title}
- Story Key: {story_key}
- Review Outcome: {outcome}
- Sprint Status: {previous_status} → {target_status}
- Action Items: {count} ({high} High, {med} Medium, {low} Low)

**Acceptance Criteria:** {implemented} of {total} fully implemented
**Tasks Verified:** {verified} of {claimed_complete} claimed complete
**Critical Issues:** {false_completions} tasks falsely marked complete

**Next Steps:**
1. Review the Senior Developer Review notes appended to story
2. If APPROVED: ✓ Story is done, continue with next story
3. If CHANGES REQUESTED: Address {count} action items and re-run /bmad/dev-story
4. If BLOCKED: Resolve {high_count} HIGH severity blockers before proceeding
```

## Key Principles

### 1. Zero-Tolerance Validation

**No shortcuts:**
- Every AC checked with evidence
- Every completed task verified
- No assumptions
- No "looks good enough"

**Task marked [x] but NOT DONE = CRITICAL FAILURE**
- This is an integrity issue
- HIGH SEVERITY finding
- Must be flagged prominently
- Must be resolved before approval

### 2. Evidence-Based Findings

**Every finding includes:**
- File path and line numbers
- Specific code references
- Related AC or task
- Concrete suggestions

**Bad:** "Login endpoint has issues"
**Good:** "[High] SQL injection in login (AC #1) [file: src/auth.ts:45] - Use parameterized query"

### 3. Severity-Driven Outcomes

**HIGH = BLOCKED**
- Cannot proceed
- Must be fixed
- Examples: Missing AC, security vulnerability, false task completion

**MEDIUM = CHANGES REQUESTED**
- Should be fixed before done
- Can proceed after addressing
- Examples: Missing tests, partial AC, quality issues

**LOW = ADVISORY**
- Nice to have
- Optional improvements
- Examples: Style, documentation, optimizations

### 4. Systematic Coverage

**AC Validation:**
- Every AC checked
- Evidence required
- Tests verified
- Gaps flagged

**Task Verification:**
- Every completed task verified
- False completions = HIGH severity
- Evidence required
- Questionable = MEDIUM severity

### 5. Comprehensive Security Review

**OWASP Top 10 focus:**
- Injection (SQL, XSS, Command)
- Broken Auth
- Sensitive Data Exposure
- XML External Entities
- Broken Access Control
- Security Misconfiguration
- XSS
- Insecure Deserialization
- Using Components with Known Vulnerabilities
- Insufficient Logging & Monitoring

## Examples

### Example 1: SaaS Analytics - User Authentication Story (BLOCKED)

**Context:**
- Story 1.2: User Login with Email/Password
- Epic 1: User Management
- 4 ACs, 8 tasks claimed complete
- Status: review

**Review process:**

1. **AC Validation:**
   - AC1: User can log in → IMPLEMENTED ✓
   - AC2: Password validation → PARTIAL (no complexity check) ⚠️
   - AC3: Account lockout → MISSING ✗
   - AC4: MFA support → MISSING ✗

   Summary: 1/4 ACs fully implemented

2. **Task Verification:**
   - Task "Implement login endpoint" [x] → VERIFIED ✓
   - Task "Add password hashing" [x] → VERIFIED ✓
   - Task "Add unit tests" [x] → **NOT DONE** ✗ (No tests found)
   - Task "Add e2e tests" [x] → **NOT DONE** ✗ (No tests found)
   - Task "Implement account lockout" [x] → **NOT DONE** ✗
   - Task "Add MFA" [x] → **NOT DONE** ✗

   Summary: 2/8 verified, 4 **FALSELY marked complete** (HIGH SEVERITY)

3. **Findings:**
   - [High] AC3 missing: No account lockout implementation
   - [High] AC4 missing: No MFA implementation
   - [High] Task "Add unit tests" marked complete but NOT DONE
   - [High] Task "Add e2e tests" marked complete but NOT DONE
   - [High] Task "Implement account lockout" marked complete but NOT DONE
   - [High] Task "Add MFA" marked complete but NOT DONE
   - [Medium] AC2 partial: Missing password complexity validation
   - [Medium] No rate limiting (security issue)

4. **Outcome:** **BLOCKED**
   - 6 HIGH severity findings
   - 2 ACs missing
   - 4 tasks falsely marked complete
   - Cannot approve until resolved

5. **Status update:** review → review (stays blocked)

6. **Result:**
   ```
   ✅ Story Review Complete - BLOCKED

   Story: 1.2 - User Login
   Outcome: BLOCKED (6 HIGH severity findings)
   Status: Stays in review

   CRITICAL: 4 tasks falsely marked complete
   - "Add unit tests" - NO TESTS FOUND
   - "Add e2e tests" - NO TESTS FOUND
   - "Implement account lockout" - NOT IMPLEMENTED
   - "Add MFA" - NOT IMPLEMENTED

   Action Required:
   - Implement missing ACs (3, 4)
   - Add all required tests
   - Fix false task completions
   - Re-run dev-story

   Review notes appended to story file.
   ```

### Example 2: Healthcare Portal - HIPAA Audit Logging (CHANGES REQUESTED)

**Context:**
- Story 5.3: Comprehensive Audit Trail
- Epic 5: Compliance
- 8 ACs, 12 tasks claimed complete
- Status: review

**Review process:**

1. **AC Validation:**
   - AC1-6: All IMPLEMENTED ✓ (event logging, immutability, encryption, export, search, retention)
   - AC7: Tamper detection → PARTIAL (hash present but no verification endpoint) ⚠️
   - AC8: Compliance reporting → IMPLEMENTED ✓

   Summary: 7/8 ACs fully implemented, 1 partial

2. **Task Verification:**
   - 10/12 tasks VERIFIED ✓
   - 1 task QUESTIONABLE (tamper detection verification unclear)
   - 1 task incomplete but not marked [x]

3. **Findings:**
   - [Medium] AC7 partial: Hash created but no verification endpoint
   - [Medium] Missing unit tests for tamper detection
   - [Low] Consider adding compliance dashboard
   - [Low] Add more comprehensive audit log examples to docs

4. **Security Review:**
   - ✓ AES-256 encryption at rest
   - ✓ SHA-256 hashing for tamper-proof
   - ✓ 6-year retention configured
   - ⚠️ [Medium] No rate limiting on audit export endpoint

5. **Outcome:** **CHANGES REQUESTED**
   - 3 MEDIUM severity findings
   - 2 LOW severity suggestions
   - All CRITICAL ACs implemented
   - No false task completions

6. **Status update:** review → in-progress

7. **Result:**
   ```
   ✅ Story Review Complete - CHANGES REQUESTED

   Story: 5.3 - Comprehensive Audit Trail
   Outcome: CHANGES REQUESTED (3 MEDIUM findings)
   Status: review → in-progress

   ACs: 7/8 fully implemented (AC7 partial)
   Tasks: 10/12 verified complete

   Required Changes:
   - [Medium] Add tamper verification endpoint (AC7)
   - [Medium] Add unit tests for tamper detection
   - [Medium] Add rate limiting on audit export

   Advisory:
   - Consider compliance dashboard
   - Add audit log examples to docs

   High quality implementation overall.
   Address MEDIUM issues and resubmit.

   Review notes appended to story file.
   ```

### Example 3: Mobile Fitness - Background Sync (APPROVED)

**Context:**
- Story 2.4: Background Workout Sync
- Epic 2: Offline Capabilities
- 6 ACs, 14 tasks claimed complete
- Status: review

**Review process:**

1. **AC Validation:**
   - All 6 ACs IMPLEMENTED ✓
   - All have comprehensive tests ✓
   - Evidence found for all requirements

2. **Task Verification:**
   - 14/14 tasks VERIFIED ✓
   - All completed tasks have evidence
   - No false completions
   - No questionable items

3. **Findings:**
   - [Low] Consider adding sync analytics
   - [Low] Document battery impact in README

4. **Quality Review:**
   - ✓ Error handling comprehensive
   - ✓ Offline-first properly implemented
   - ✓ Conflict resolution tested
   - ✓ Battery optimization considered
   - ✓ Test coverage: 95%

5. **Security Review:**
   - ✓ E2E encryption
   - ✓ Auth tokens properly stored
   - ✓ No sensitive data in logs

6. **Outcome:** **APPROVED**
   - ALL ACs implemented with tests
   - ALL tasks verified complete
   - No HIGH or MEDIUM findings
   - 2 LOW advisory suggestions

7. **Status update:** review → done

8. **Result:**
   ```
   ✅ Story Review Complete - APPROVED

   Story: 2.4 - Background Workout Sync
   Outcome: APPROVED ✓
   Status: review → done

   ACs: 6/6 fully implemented with comprehensive tests
   Tasks: 14/14 verified complete
   Test Coverage: 95%

   Quality: Excellent
   - Comprehensive error handling
   - Well-tested edge cases
   - Battery optimization implemented
   - Clean, maintainable code

   Advisory Suggestions:
   - Consider adding sync analytics
   - Document battery impact in README

   Congratulations! Story is complete and ready for production.

   Review notes appended to story file.
   ```

## Troubleshooting

### No stories with status "review"

**Message:**
```
📋 No stories with status "review" found
```

**Options:**
1. Run `/bmad/dev-story` to implement a story
2. Check `sprint-status.yaml` for current states
3. Use ad-hoc review mode

### Story file not found

**Error:**
```
⚠️ Story file not found: {story_key}.md
```

**Solution:**
- Check file naming in stories directory
- Run `/bmad/sprint-planning` to resync
- Verify sprint_artifacts path in config

### No story context file

**Warning:**
```
⚠️ WARNING: No story context file found
```

**Impact:** Review continues but context limited

**Solution:**
- Run `/bmad/story-context` to generate context
- Or continue with limited context validation

### No epic tech spec

**Warning:**
```
⚠️ WARNING: No Tech Spec found for epic {N}
```

**Impact:** Cannot validate architecture alignment fully

**Solution:**
- Run `/bmad/epic-tech-context` to create tech spec
- Or continue without architecture validation

### Too many false completions

**Critical:**
```
BLOCKED: 8 tasks marked complete but NOT DONE
```

**This indicates:**
- Developer didn't actually complete work
- Or developer forgot to update file list
- Or incomplete implementation

**Solution:**
1. Review each false completion
2. Either implement or uncheck task
3. Update File List in Dev Agent Record
4. Re-run `/bmad/dev-story` to complete work

### All ACs missing

**Critical:**
```
BLOCKED: 0 of 6 ACs implemented
```

**This indicates:**
- Story was marked for review prematurely
- Or implementation is in wrong location
- Or File List is incomplete/incorrect

**Solution:**
1. Verify implementation exists
2. Update File List if code exists
3. Or continue implementation with `/bmad/dev-story`

## Related Workflows

**Before this workflow:**
1. `/bmad/workflow-init` - Initialize project
2. `/bmad/prd` - Requirements
3. `/bmad/architecture` - System design
4. `/bmad/create-epics-and-stories` - Create epics
5. `/bmad/create-story` - Draft stories
6. `/bmad/story-context` - Generate context
7. `/bmad/dev-story` - Implement story (marks "review")

**After this workflow:**
1. **If APPROVED:** Story done, move to next
2. **If CHANGES REQUESTED:** `/bmad/dev-story` to fix issues
3. **If BLOCKED:** Fix blockers, then `/bmad/dev-story`

**Parallel workflows:**
- `/bmad/code-review` - Run for each story marked "review"
- `/bmad/workflow-status` - Check current phase

## Success Criteria

A successful review includes:

**Systematic Validation:**
- [ ] Every AC validated with evidence
- [ ] Every completed task verified
- [ ] Complete AC validation table
- [ ] Complete task verification table
- [ ] All false completions flagged (if any)

**Quality Review:**
- [ ] Error handling checked
- [ ] Input validation reviewed
- [ ] Security review performed
- [ ] Performance review done
- [ ] Test quality assessed
- [ ] Architecture alignment verified

**Comprehensive Findings:**
- [ ] All findings have severity
- [ ] All findings have file:line references
- [ ] All findings have suggestions
- [ ] Findings grouped by severity
- [ ] Action items are concrete and trackable

**Outcome Decision:**
- [ ] Outcome matches findings (APPROVE/CHANGES/BLOCKED)
- [ ] Justification is clear
- [ ] Status update appropriate

**Documentation:**
- [ ] Review appended to story file (story mode)
- [ ] OR standalone report created (ad-hoc mode)
- [ ] Sprint status updated (story mode)
- [ ] Action items tracked (backlog, tasks, epic)
- [ ] Evidence trail complete

## Notes

- **Zero tolerance:** Every AC, every task checked with evidence
- **False completions = CRITICAL:** Tasks marked [x] but NOT DONE are HIGH severity
- **Evidence required:** All findings must have file:line references
- **Severity drives outcome:** HIGH = BLOCKED, MEDIUM = CHANGES, LOW = ADVISORY
- **Two modes:** Story review (systematic) or ad-hoc review (custom)
- **Systematic validation required:** No shortcuts, no assumptions
- **Best practices:** Latest framework/security guidelines referenced
- **Action items tracked:** Backlog, story tasks, epic follow-ups

## Configuration

Reads from `.bmad/config.yaml`:

```yaml
output_folder: .bmad
user_name: "Your Name"
sprint_artifacts: .bmad/sprint-artifacts
user_skill_level: "intermediate"  # affects communication style only
bmad_folder: .bmad
```

**Story files:**
- Location: `.bmad/sprint-artifacts/stories/`
- Format: `{epic}-{story}-{name}.md`
- Must have status "review"

**Context files:**
- `.bmad/sprint-artifacts/stories/{story-key}.context.xml`

**Tech specs:**
- `.bmad/sprint-artifacts/tech-spec-epic-{N}.md`

**Ad-hoc reviews:**
- Output: `.bmad/code-review-{date}.md`
