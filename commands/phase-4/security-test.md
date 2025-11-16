---
description: Comprehensive security testing using specialized CTF agents for vulnerability assessment
---

# Security Test

## What This Does

Performs comprehensive security testing on a user story or feature using 8 specialized security agents. Tests for OWASP Top 10 vulnerabilities including authentication bypass, SQL injection, XSS, IDOR, SSRF, and LLM security issues.

**Security Agents Used:**
- ctf-auth-analyst - Authentication/authorization testing
- ctf-burp-web-expert - Web application security
- ctf-sql-injection-expert - SQL injection testing
- ctf-xss-expert - Cross-site scripting testing
- ctf-idor-expert - Insecure direct object reference testing
- ctf-ssrf-expert - Server-side request forgery testing
- ctf-ai-prompt-injection-agent - LLM prompt injection testing
- ctf-ai-jailbreak-agent - LLM jailbreak testing

## Prerequisites

- BMAD plugin installed
- `/workflow-init` has been run
- Story exists in `{sprint_artifacts}/stories/`
- Feature is implemented (code exists)
- Testing environment available (local/staging)

## Instructions

### Step 1: Identify Story to Test

**Action:** Use AskUserQuestion to get story identifier

```yaml
questions:
  - question: "Which story would you like to security test?"
    header: "Story"
    multiSelect: false
    options:
      - label: "Current story (latest in {sprint_artifacts}/stories/)"
        description: "Test the most recently created story"
      - label: "Specific story ID"
        description: "Enter story number (e.g., 001, 002)"
      - label: "All stories in current sprint"
        description: "Test all stories marked as 'in-progress' or 'ready-for-review'"
```

### Step 2: Load Story Context

**Action:** Read the story file and extract context

```bash
# Read story
cat {sprint_artifacts}/stories/story-{ID}.md

# Extract:
# - Feature name
# - Acceptance criteria
# - Endpoints/APIs
# - Files changed
# - User inputs
```

### Step 3: Load Configuration

**Action:** Read security configuration from `.bmad/config.yaml`

**Expected configuration:**
```yaml
security:
  enabled: true
  severity_threshold: "high"  # Block deployment on: critical, high, medium, low
  testing_env: "http://localhost:3000"
  burp_proxy: "127.0.0.1:8080"
```

**If security config missing:** Use defaults (all agents, threshold=high, env=localhost:3000)

### Step 4: Delegate to Security Engineer

**Action:** Use Task tool to delegate to bmad-security-engineer agent

**Prompt for Security Engineer:**
```
I need you to perform comprehensive security testing on the following story:

**Story**: {sprint_artifacts}/stories/story-{ID}.md

**Story Summary**:
{Brief summary of feature from story}

**Attack Surface**:
{Endpoints, APIs, user inputs identified from story}

**Tech Stack**:
{From .bmad/config.yaml}

**Testing Environment**: {From config or localhost:3000}

Please:
1. Analyze the story and identify security-relevant features
2. Determine which CTF security agents to delegate to
3. Coordinate comprehensive security testing
4. Aggregate findings from all agents
5. Generate a security test report
6. Save report to {output_folder}/security-reports/story-{ID}-security-report.md
7. Create fix stories for any Critical/High severity issues found
8. Provide deployment decision (APPROVED/BLOCKED/CONDITIONAL)

Use the Task tool to delegate to specialized CTF agents as needed.
```

### Step 5: Security Engineer Coordinates Testing

**The Security Engineer will:**

1. **Analyze Story**
   - Read story file
   - Identify attack surface (endpoints, inputs, APIs)
   - Determine feature risk level

2. **Select Appropriate Security Agents**

   Based on feature type:
   - Authentication/Authorization → ctf-auth-analyst
   - Web application → ctf-burp-web-expert
   - Database queries → ctf-sql-injection-expert
   - User inputs → ctf-xss-expert
   - API with IDs → ctf-idor-expert
   - External requests → ctf-ssrf-expert
   - AI/LLM features → ctf-ai-prompt-injection-agent, ctf-ai-jailbreak-agent

3. **Delegate to CTF Agents**

   Use Task tool to delegate to each selected agent:
   ```
   Task: ctf-auth-analyst
   Prompt: Test authentication for [feature] at [endpoint].
           Story: {sprint_artifacts}/stories/story-XXX.md
           Focus on: JWT validation, session management, password reset
   ```

4. **Aggregate Results**

   Collect findings from all agents and classify:
   - Critical (block deployment)
   - High (fix before deployment)
   - Medium (fix soon)
   - Low (track for future)

5. **Generate Security Report**

   Create comprehensive report with:
   - Executive summary
   - Findings by severity
   - Proof of concept for each vulnerability
   - Remediation guidance
   - Security checklist
   - Deployment decision

6. **Create Fix Stories**

   For each Critical/High issue, create a fix story:
   ```markdown
   # Story: Fix [Vulnerability Type] in [Feature]

   ## Security Issue
   [Description from security report]

   ## Severity
   Critical / High

   ## Impact
   [What attacker can do]

   ## Acceptance Criteria
   - [ ] [Specific fix implemented]
   - [ ] Security re-test passes
   - [ ] No regression in functionality

   ## Remediation Steps
   [From security report]

   ## References
   - OWASP: [Link]
   - Original Report: {output_folder}/security-reports/story-XXX-security-report.md
   ```

### Step 6: Review Security Report

**Action:** Display security report summary to user

**Report Location:** `{output_folder}/security-reports/story-{ID}-security-report.md`

**Display:**
```
╔══════════════════════════════════════════════════════════╗
║          Security Test Report - Story {ID}               ║
╚══════════════════════════════════════════════════════════╝

Feature: {Feature name}
Tested: {Date}
Status: {PASS/FAIL/CONDITIONAL}

FINDINGS:
  Critical: {X} issues
  High:     {X} issues
  Medium:   {X} issues
  Low:      {X} issues

DEPLOYMENT DECISION: {APPROVED/BLOCKED/CONDITIONAL}

NEXT STEPS:
  - {Created X fix stories}
  - {Re-test after fixes}
  - {Update security documentation}

Full Report: {output_folder}/security-reports/story-{ID}-security-report.md
```

### Step 7: Handle Results

**If Critical/High issues found:**

```yaml
Use AskUserQuestion:
  question: "Critical/High security issues found. How would you like to proceed?"
  header: "Action"
  multiSelect: false
  options:
    - label: "Start fixing issues now"
      description: "Mark story as blocked and start working on fix stories"
    - label: "Review report first"
      description: "Read the full security report before deciding"
    - label: "Accept risk (not recommended)"
      description: "Document why issues are acceptable and proceed"
```

**If passed (no Critical/High):**
- Mark story as security-approved
- Update story metadata
- Proceed to deployment

**If conditional (Medium issues):**
- Document issues for future fix
- Allow deployment
- Create backlog stories for Medium issues

### Step 8: Update Story Metadata

**Action:** Add security test results to story file

**Append to story:**
```markdown
---

## Security Testing

**Date**: {Date}
**Tested By**: Security Engineer (bmad-security-engineer)
**Status**: {PASS/FAIL/CONDITIONAL}

**Findings**:
- Critical: {X}
- High: {X}
- Medium: {X}
- Low: {X}

**Report**: {output_folder}/security-reports/story-{ID}-security-report.md

**Deployment Decision**: {APPROVED/BLOCKED/CONDITIONAL}
```

### Step 9: Update Sprint Status

**Action:** Update `{sprint_artifacts}/sprint-status.yaml`

**If security testing passed:**
```yaml
story-{ID}:
  status: "ready-for-deployment"
  security_tested: true
  security_status: "approved"
```

**If security testing failed:**
```yaml
story-{ID}:
  status: "blocked"
  security_tested: true
  security_status: "failed"
  blocking_issues: {X} critical, {X} high
```

## Output Files

**Security Report:**
- `{output_folder}/security-reports/story-{ID}-security-report.md`
- Comprehensive vulnerability assessment
- Proof of concepts for each finding
- Remediation guidance

**Fix Stories (if issues found):**
- `{sprint_artifacts}/stories/story-{ID}-fix-{vulnerability}.md`
- One story per Critical/High issue
- Contains remediation steps

**Updated Story:**
- `{sprint_artifacts}/stories/story-{ID}.md`
- Appended security test results

**Updated Sprint Status:**
- `{sprint_artifacts}/sprint-status.yaml`
- Reflects security testing status

## Configuration

**Security configuration in `.bmad/config.yaml`:**

```yaml
security:
  # Enable/disable security testing
  enabled: true

  # Severity threshold for blocking deployment
  # Options: critical, high, medium, low
  severity_threshold: "high"

  # Testing environment URL
  testing_env: "http://localhost:3000"

  # Burp Suite proxy (if using Burp MCP)
  burp_proxy: "127.0.0.1:8080"

  # Agents to use (default: all)
  agents:
    - ctf-auth-analyst
    - ctf-burp-web-expert
    - ctf-sql-injection-expert
    - ctf-xss-expert
    - ctf-idor-expert
    - ctf-ssrf-expert
    - ctf-ai-prompt-injection-agent
    - ctf-ai-jailbreak-agent

  # Testing scope
  scope:
    - "http://localhost:3000/*"

  # Excluded paths (don't test)
  exclude:
    - "/static/*"
    - "/assets/*"
```

## Integration with Other Workflows

### With `/code-review`

Security testing can be integrated into code review:

```bash
# In code review workflow, after functional review:
/security-test
```

### With `/story-done`

Before marking story as done:

```bash
# Check if security testing is required
if story.requires_security_testing:
  /security-test
  if security_status != "approved":
    block story-done
```

### With `/dev-story`

After implementation, before marking complete:

```bash
/dev-story         # Implement feature
/security-test     # Security validation
/code-review       # Final review
/story-done        # Mark complete
```

## Notes

**Security Testing Best Practices:**

1. **Test Early**: Run security tests during development, not after
2. **Test Often**: Re-test after any security-related changes
3. **Test Thoroughly**: Use all relevant agents, don't skip tests
4. **Document**: Save all reports for audit trail
5. **Fix Fast**: Prioritize Critical/High issues immediately
6. **Re-test**: Validate fixes with re-running security tests

**When to Run:**
- After implementing authentication/authorization features
- After adding user input fields
- After creating API endpoints
- After integrating third-party services
- After implementing LLM/AI features
- Before any production deployment

**Time Estimates:**
- Quick scan: 15-30 minutes (basic agents only)
- Standard scan: 30-60 minutes (all relevant agents)
- Deep scan: 1-2 hours (all agents + manual validation)

**Common Issues Found:**
- Missing input validation → XSS/SQLi
- Missing authorization checks → IDOR
- Weak JWT validation → Authentication bypass
- Missing SSRF protection → Internal service access
- Weak prompt isolation → LLM prompt injection

## Troubleshooting

**"No security agents available"**
- Verify CTF agents are in `agents/` directory
- Check plugin.json includes all 8 CTF agents

**"Testing environment not reachable"**
- Check `testing_env` in config.yaml
- Ensure application is running locally
- Verify port is correct

**"Burp Suite not working"**
- Launch Burp via: `java -jar burpsuite_pro.jar --project-file=test.burp`
- Check burp_proxy in config.yaml
- Verify Burp MCP server is running

**"Too many findings"**
- Focus on Critical/High first
- Use severity_threshold to filter
- Create fix stories in batches

**"Security testing taking too long"**
- Reduce number of agents used
- Focus on high-risk features only
- Use quick scan mode

## Examples

### Example 1: Test Login Feature

```
User: /security-test

Claude: Which story would you like to security test?
User: story-005 (User Login)

Claude: [Delegates to bmad-security-engineer]
Security Engineer: [Analyzes story-005]
  - Feature: JWT-based login
  - Attack surface: POST /api/login
  - Agents needed: ctf-auth-analyst, ctf-sql-injection-expert

Security Engineer: [Delegates to agents]
  - ctf-auth-analyst finds: Weak JWT secret (CRITICAL)
  - ctf-sql-injection-expert finds: No SQLi (PASS)

Security Engineer: [Generates report]
  - 1 Critical issue found
  - Creates fix story: story-006-fix-jwt-secret
  - Deployment decision: BLOCKED

Claude:
╔══════════════════════════════════════╗
║   Security Test - Story 005          ║
╚══════════════════════════════════════╝

FINDINGS:
  Critical: 1 issue (Weak JWT Secret)
  High:     0 issues
  Medium:   0 issues
  Low:      0 issues

DEPLOYMENT DECISION: BLOCKED

Fix story created: story-006-fix-jwt-secret.md
Report: {output_folder}/security-reports/story-005-security-report.md
```

### Example 2: Test User Profile API

```
User: /security-test

Claude: Which story?
User: story-008 (User Profile API)

Security Engineer: [Analyzes story-008]
  - Feature: GET/PUT /api/user/{id}
  - Agents: ctf-idor-expert, ctf-xss-expert

ctf-idor-expert: IDOR vulnerability found (HIGH)
  - Can access other users' profiles by changing ID

ctf-xss-expert: XSS in bio field (MEDIUM)
  - HTML not sanitized in user bio

Security Engineer:
  - 1 High, 1 Medium issue
  - Creates fix stories
  - Deployment: CONDITIONAL (fix High before deploy)

Claude: [Shows report]
```

---

**Security is everyone's responsibility. This workflow helps you test like an attacker, before attackers do.**
