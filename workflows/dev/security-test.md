---
description: Comprehensive security testing using specialized CTF agents for vulnerability assessment
---

# Security Test

## Purpose

Performs comprehensive security testing on user stories or features using 8 specialized CTF security agents. Tests for OWASP Top 10 vulnerabilities including authentication bypass, SQL injection, XSS, IDOR, SSRF, and LLM security issues. Generates security reports, creates fix stories for critical issues, and provides deployment decisions based on configurable severity thresholds.

**Security Agents Used:**
- ctf-auth-analyst - Authentication/authorization testing
- ctf-burp-web-expert - Web application security
- ctf-sql-injection-expert - SQL injection testing
- ctf-xss-expert - Cross-site scripting testing
- ctf-idor-expert - Insecure direct object reference testing
- ctf-ssrf-expert - Server-side request forgery testing
- ctf-ai-prompt-injection-agent - LLM prompt injection testing
- ctf-ai-jailbreak-agent - LLM jailbreak testing

## Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `{sprint_artifacts}` | Directory containing sprint artifacts and stories | `.bmad/projects/{project_id}/sprints/current` |
| `{documentation_dir}` | Directory for documentation and reports | `.bmad/projects/{project_id}/documentation` |
| `{ID}` | Story identifier number | `001`, `002`, `003` |
| `{Date}` | Current date for timestamps | `2025-11-18` |
| `{Feature name}` | Name of the feature being tested | `User Login`, `Profile API` |
| `{project_id}` | Current project identifier | From `.bmad/config.yaml` |

**Configuration Variables (from `.bmad/config.yaml`):**

| Variable | Description | Default |
|----------|-------------|---------|
| `security.enabled` | Enable/disable security testing | `true` |
| `security.severity_threshold` | Severity level that blocks deployment | `high` |
| `security.testing_env` | Testing environment URL | `http://localhost:3000` |
| `security.burp_proxy` | Burp Suite proxy address | `127.0.0.1:8080` |
| `security.agents` | List of security agents to use | All 8 CTF agents |
| `security.scope` | URLs in scope for testing | `["http://localhost:3000/*"]` |
| `security.exclude` | Paths to exclude from testing | `["/static/*", "/assets/*"]` |

## Instructions

### Step 1: Identify Story to Test

Use AskUserQuestion to determine which story needs security testing.

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

Read the story file and extract relevant security context:

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

Read security configuration from `.bmad/config.yaml`. If security config is missing, use defaults (all agents, threshold=high, env=localhost:3000).

**Expected configuration:**
```yaml
security:
  enabled: true
  severity_threshold: "high"  # Block deployment on: critical, high, medium, low
  testing_env: "http://localhost:3000"
  burp_proxy: "127.0.0.1:8080"
  agents:
    - ctf-auth-analyst
    - ctf-burp-web-expert
    - ctf-sql-injection-expert
    - ctf-xss-expert
    - ctf-idor-expert
    - ctf-ssrf-expert
    - ctf-ai-prompt-injection-agent
    - ctf-ai-jailbreak-agent
  scope:
    - "http://localhost:3000/*"
  exclude:
    - "/static/*"
    - "/assets/*"
```

### Step 4: Delegate to Security Engineer

Use Task tool to delegate comprehensive security testing to bmad-security-engineer agent.

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
6. Save report to {documentation_dir}/security-reports/story-{ID}-security-report.md
7. Create fix stories for any Critical/High severity issues found
8. Provide deployment decision (APPROVED/BLOCKED/CONDITIONAL)

Use the Task tool to delegate to specialized CTF agents as needed.
```

### Step 5: Review Security Report

Display security report summary to user.

**Report Location:** `{documentation_dir}/security-reports/story-{ID}-security-report.md`

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

Full Report: {documentation_dir}/security-reports/story-{ID}-security-report.md
```

### Step 6: Handle Results

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

### Step 7: Update Story Metadata

Add security test results to the story file.

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

**Report**: {documentation_dir}/security-reports/story-{ID}-security-report.md

**Deployment Decision**: {APPROVED/BLOCKED/CONDITIONAL}
```

### Step 8: Update Sprint Status

Update `{sprint_artifacts}/sprint-status.yaml` with security testing results.

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

## Workflow

### Security Engineer Coordination Process

The Security Engineer agent coordinates the entire security testing process:

1. **Analyze Story**
   - Read story file from `{sprint_artifacts}/stories/story-{ID}.md`
   - Identify attack surface (endpoints, inputs, APIs)
   - Determine feature risk level based on functionality

2. **Select Appropriate Security Agents**

   Based on feature type, delegate to relevant agents:
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

   Collect findings from all agents and classify by severity:
   - Critical (block deployment immediately)
   - High (fix before deployment)
   - Medium (fix soon, deployment conditional)
   - Low (track for future)

5. **Generate Security Report**

   Create comprehensive report in `{documentation_dir}/security-reports/story-{ID}-security-report.md` with:
   - Executive summary
   - Findings by severity
   - Proof of concept for each vulnerability
   - Remediation guidance
   - Security checklist
   - Deployment decision

6. **Create Fix Stories**

   For each Critical/High issue, create a fix story in `{sprint_artifacts}/stories/`:
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
   - Original Report: {documentation_dir}/security-reports/story-XXX-security-report.md
   ```

### Integration with Other Workflows

**With `/code-review`:**
```bash
# In code review workflow, after functional review:
/security-test
```

**With `/story-done`:**
```bash
# Check if security testing is required
if story.requires_security_testing:
  /security-test
  if security_status != "approved":
    block story-done
```

**With `/dev-story`:**
```bash
/dev-story         # Implement feature
/security-test     # Security validation
/code-review       # Final review
/story-done        # Mark complete
```

### Output Files

**Security Report:**
- `{documentation_dir}/security-reports/story-{ID}-security-report.md`
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

### Prerequisites

- BMAD plugin installed
- `/workflow-init` has been run
- Story exists in `{sprint_artifacts}/stories/`
- Feature is implemented (code exists)
- Testing environment available (local/staging)

### Best Practices

1. **Test Early**: Run security tests during development, not after
2. **Test Often**: Re-test after any security-related changes
3. **Test Thoroughly**: Use all relevant agents, don't skip tests
4. **Document**: Save all reports for audit trail
5. **Fix Fast**: Prioritize Critical/High issues immediately
6. **Re-test**: Validate fixes by re-running security tests

### When to Run

- After implementing authentication/authorization features
- After adding user input fields
- After creating API endpoints
- After integrating third-party services
- After implementing LLM/AI features
- Before any production deployment

### Time Estimates

- Quick scan: 15-30 minutes (basic agents only)
- Standard scan: 30-60 minutes (all relevant agents)
- Deep scan: 1-2 hours (all agents + manual validation)

### Common Issues Found

- Missing input validation → XSS/SQLi
- Missing authorization checks → IDOR
- Weak JWT validation → Authentication bypass
- Missing SSRF protection → Internal service access
- Weak prompt isolation → LLM prompt injection

## Report

### Report Summary

After completing security testing, provide a comprehensive summary to the user:

**1. Test Overview**
```
Security Testing Complete - Story {ID}

Feature Tested: {Feature name}
Test Date: {Date}
Testing Environment: {URL}
Agents Used: {List of agents}
Test Duration: {Duration}
```

**2. Findings Summary**
```
SECURITY FINDINGS:
├── Critical Issues: {X}
├── High Severity: {X}
├── Medium Severity: {X}
└── Low Severity: {X}

DEPLOYMENT DECISION: {APPROVED / BLOCKED / CONDITIONAL}
```

**3. Actions Taken**
```
ACTIONS COMPLETED:
✓ Security report generated
✓ {X} fix stories created for Critical/High issues
✓ Story metadata updated
✓ Sprint status updated
```

**4. Next Steps**
```
RECOMMENDED NEXT STEPS:
{If BLOCKED}
1. Review security report: {path to report}
2. Implement fixes in created stories: {list story IDs}
3. Re-run security testing after fixes
4. Proceed to deployment only after approval

{If CONDITIONAL}
1. Review Medium severity issues in report
2. Deploy feature to production
3. Schedule fixes for Medium issues in next sprint
4. Create backlog stories for Low issues

{If APPROVED}
1. Feature is security-approved for deployment
2. Review report for informational findings: {path to report}
3. Proceed to /story-done
```

**5. Report Location**

Provide direct paths to all generated artifacts:
```
GENERATED FILES:
- Security Report: {documentation_dir}/security-reports/story-{ID}-security-report.md
- Fix Stories: {sprint_artifacts}/stories/story-{ID}-fix-*.md
- Updated Story: {sprint_artifacts}/stories/story-{ID}.md
- Sprint Status: {sprint_artifacts}/sprint-status.yaml
```

**6. Issue Details (If Any Found)**

For each Critical/High issue, provide brief details:
```
CRITICAL/HIGH ISSUES REQUIRING IMMEDIATE ATTENTION:

Issue #1: {Vulnerability Type}
- Severity: {Critical/High}
- Component: {Affected endpoint/feature}
- Impact: {Brief description of what attacker can do}
- Fix Story: story-{ID}-fix-{vulnerability}.md
- OWASP Reference: {Link}

Issue #2: ...
```

### Troubleshooting Report

If issues occur during security testing, report them clearly:

**"No security agents available"**
- Verify CTF agents are in `agents/` directory
- Check plugin.json includes all 8 CTF agents
- Solution: Review plugin configuration

**"Testing environment not reachable"**
- Check `testing_env` in config.yaml
- Ensure application is running locally
- Verify port is correct
- Current config: {show current config}

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

### Example Reports

#### Example 1: Test Login Feature

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
Report: {documentation_dir}/security-reports/story-005-security-report.md
```

#### Example 2: Test User Profile API

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

Claude: [Shows report with actionable next steps]
```

---

**Security is everyone's responsibility. This workflow helps you test like an attacker, before attackers do.**
