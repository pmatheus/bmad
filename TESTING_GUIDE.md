# BMAD Method - Complete Testing Guide

**GitHub Repository:** https://github.com/pmatheus/bmad

This guide provides step-by-step instructions for testing the BMAD Method plugin.

---

## 📋 Prerequisites

Before testing, ensure you have:

- ✅ **Claude Code** installed and working
- ✅ **Git** installed
- ✅ **GitHub CLI** installed (optional, for cloning)
- ✅ **Terminal** access

---

## 🚀 Installation Methods

### Method 1: Local Development (Recommended for Testing)

**Best for:** Testing during development, iterating on changes

#### Step 1: Clone the Repository

```bash
# Using GitHub CLI
gh repo clone pmatheus/bmad

# Or using Git
git clone https://github.com/pmatheus/bmad.git

# Navigate to the repository
cd bmad
```

#### Step 2: Create Test Project

```bash
# Create a test project directory
mkdir -p /tmp/bmad-test-project
cd /tmp/bmad-test-project

# Initialize git
git init
echo "# BMAD Test Project" > README.md
git add README.md
git commit -m "Initial commit"
```

#### Step 3: Install Plugin in Claude Code

```bash
# Start Claude Code
claude
```

Inside Claude Code session:

```bash
# Add the local marketplace
/plugin marketplace add /path/to/bmad/bmad-marketplace

# For example, if you cloned to ~/Projects/bmad:
/plugin marketplace add ~/Projects/bmad/bmad-marketplace

# Install the plugin
/plugin install bmad-method@bmad-marketplace

# Verify installation
/plugin list
/workflow-status
```

---

### Method 2: GitHub Installation (Future - After Publishing)

**Best for:** Production use, stable releases

```bash
# This will be available once the plugin is published to a GitHub-based marketplace

# Add GitHub marketplace
/plugin marketplace add pmatheus/bmad

# Install plugin
/plugin install bmad-method@pmatheus
```

---

## ✅ Testing Checklist

### Phase 1: Installation Tests (5 minutes)

#### Test 1.1: Verify Installation

```bash
# In Claude Code
/plugin list
```

**Expected Output:**
```
Installed Plugins:
✓ bmad-method@bmad-marketplace (v2.0.0)
  - 20 commands available
  - 8 agents available
```

**Success Criteria:**
- [ ] Plugin appears in list
- [ ] Version is 2.0.0
- [ ] No error messages

---

#### Test 1.2: Verify Commands Available

```bash
# In Claude Code, type / and press TAB to see autocomplete
/
```

**Expected Commands:**
- `/workflow-status`
- `/workflow-init`
- `/product-brief`
- `/research`
- `/domain-research`
- `/brainstorm-project`
- `/document-project`
- `/prd`
- `/tech-spec`
- `/create-epics-and-stories`
- `/architecture`
- `/sprint-planning`
- `/epic-tech-context`
- `/story-context`
- `/create-story`
- `/story-ready`
- `/dev-story`
- `/code-review`
- `/story-done`
- `/retrospective`

**Success Criteria:**
- [ ] All 20 commands visible
- [ ] Commands have descriptions
- [ ] No duplicate commands

---

#### Test 1.3: Verify Agents Available

```bash
/agents
```

**Expected Agents:**
- `bmad-pm` - Product Manager
- `bmad-architect` - Software Architect
- `bmad-dev` - Developer
- `bmad-tea` - Test Engineer
- `bmad-analyst` - Business Analyst
- `bmad-sm` - Scrum Master
- `bmad-ux` - UX Designer
- `bmad-tech-writer` - Technical Writer

**Success Criteria:**
- [ ] All 8 agents visible
- [ ] Each has proper description
- [ ] No errors when viewing

---

### Phase 2: Basic Workflow Tests (15 minutes)

#### Test 2.1: Workflow Status (No Active Workflow)

```bash
/workflow-status
```

**Expected Output:**
```
No workflow currently in progress.

To start a new project workflow:
- Run /workflow-init to initialize tracking

To work without workflow tracking:
- Any workflow can run standalone
- Status tracking provides guidance but is optional
```

**Success Criteria:**
- [ ] Command runs without errors
- [ ] Message is clear and helpful
- [ ] Suggests next steps

---

#### Test 2.2: Initialize Workflow (Level 0)

```bash
/workflow-init
```

**Answer Prompts:**
- **Project Level:** `0` (Quick Flow - atomic change)
- **Field Type:** `greenfield` (New project)
- **Project Name:** `Test Project`
- **Project Description:** `Testing BMAD Method plugin installation`
- **Output Folder:** Press Enter (use default: `.bmad/output`)

**Expected Results:**

1. **Directory Structure Created:**
```bash
ls -la .bmad/
```

Should show:
```
.bmad/
├── config.yaml
├── workflow-status.yaml
└── output/
```

2. **Config File:**
```bash
cat .bmad/config.yaml
```

Should contain:
```yaml
project_name: "Test Project"
project_level: 0
field_type: "greenfield"
output_folder: ".bmad/output"
# ... other config
```

3. **Status File:**
```bash
cat .bmad/workflow-status.yaml
```

Should contain:
```yaml
current_phase: "2-plan"
next_workflow: "tech-spec"
# ... other status
```

**Success Criteria:**
- [ ] `.bmad/` directory created
- [ ] `config.yaml` exists with correct values
- [ ] `workflow-status.yaml` exists
- [ ] `output/` directory created
- [ ] Completion message shown

---

#### Test 2.3: Check Updated Status

```bash
/workflow-status
```

**Expected Output:**
```
📊 Workflow Status: Test Project

Project Level: 0 (Quick Flow - atomic change)
Field Type: greenfield
Current Phase: Phase 2 - Planning

✅ Completed Workflows:
  - workflow-init

⏭️  Next Workflow: tech-spec
   Agent: bmad-architect
   Description: Create technical specification

Run /tech-spec to continue
```

**Success Criteria:**
- [ ] Shows correct project info
- [ ] Shows completed workflow-init
- [ ] Suggests next workflow (tech-spec)
- [ ] No errors

---

#### Test 2.4: Create Tech Spec

```bash
/tech-spec
```

**Follow Interactive Prompts:**

The workflow will ask questions about your technical specification. Example answers:

**Feature/Bug Description:**
```
Add user login functionality with email and password authentication
```

**Technical Approach:**
```
- Create login form component (React)
- Implement authentication API endpoint (Express)
- Use JWT for session management
- Store hashed passwords in database
```

**Acceptance Criteria:**
```
1. User can enter email and password
2. Form validates input (email format, password length)
3. API authenticates credentials
4. JWT token returned on success
5. Error messages shown on failure
6. Session persists across page reloads
```

**Expected Results:**

1. **Tech Spec File Created:**
```bash
cat .bmad/output/tech-spec.md
```

Should contain:
- Problem statement
- Solution overview
- Technical design
- Implementation plan
- Testing strategy
- Acceptance criteria

2. **Status Updated:**
```bash
/workflow-status
```

Should show:
- Completed: workflow-init, tech-spec
- Next: sprint-planning

**Success Criteria:**
- [ ] Tech spec file created in `.bmad/output/`
- [ ] File is well-formatted markdown
- [ ] Contains all sections
- [ ] Status updated correctly

---

### Phase 3: Complete Level 0 Flow (30 minutes)

#### Test 3.1: Sprint Planning

```bash
/sprint-planning
```

**Expected Results:**

1. **Sprint Status File:**
```bash
cat .bmad/sprint-status.yaml
```

Should contain:
```yaml
sprint:
  number: 1
  status: in-progress
stories:
  - id: "001"
    title: "User Login"
    status: "backlog"
    # ... story details
```

**Success Criteria:**
- [ ] `sprint-status.yaml` created
- [ ] Contains story from tech-spec
- [ ] Story status is "backlog"

---

#### Test 3.2: Create Story

```bash
/create-story
```

**Expected Results:**

1. **Story File Created:**
```bash
cat .bmad/output/stories/story-001-user-login.md
```

Should contain:
- User story format
- Acceptance criteria
- Tasks and subtasks
- Testing requirements
- Implementation guidance

2. **Status Updated:**
```bash
cat .bmad/sprint-status.yaml
```

Story status should be: `drafted`

**Success Criteria:**
- [ ] Story file created
- [ ] File has proper format
- [ ] Status updated to "drafted"

---

#### Test 3.3: Story Ready

```bash
/story-ready
```

**Expected Results:**

1. **Story Context Assembled** (internal process)

2. **Status Updated:**
```bash
cat .bmad/sprint-status.yaml
```

Story status should be: `ready-for-dev`

**Success Criteria:**
- [ ] Status updated to "ready-for-dev"
- [ ] No errors during context assembly

---

#### Test 3.4: Develop Story

```bash
/dev-story
```

**This is the most complex test** - it will:
1. Read story context
2. Write tests FIRST (TDD)
3. Implement code to pass tests
4. Ask for permission to create/modify files

**Expected Interactions:**

Claude will ask permission to:
- Create test files
- Create implementation files
- Modify existing files

**For testing purposes, you can:**
- Approve all changes (`y` to all prompts)
- Review each change individually
- Decline if you just want to test the flow without actual implementation

**Expected Results:**

1. **Test Files Created** (if approved):
```bash
ls src/__tests__/
# Should show test files
```

2. **Implementation Files Created** (if approved):
```bash
ls src/
# Should show implementation files
```

3. **Story Updated:**
```bash
cat .bmad/output/stories/story-001-user-login.md
```

Should have "Implementation Notes" section added.

4. **Status Updated:**
```bash
cat .bmad/sprint-status.yaml
```

Story status should be: `in-progress`

**Success Criteria:**
- [ ] Test files proposed/created
- [ ] Implementation files proposed/created
- [ ] Story file updated with notes
- [ ] Status updated to "in-progress"
- [ ] TDD approach followed (tests first)

---

#### Test 3.5: Code Review

```bash
/code-review
```

**Expected Results:**

1. **Review Performed:**
- Claude reviews the implemented code
- Checks against acceptance criteria
- Looks for issues (security, performance, quality)

2. **Review Notes Added:**
```bash
cat .bmad/output/stories/story-001-user-login.md
```

Should have "Code Review" section with:
- Critical issues (if any)
- Warnings (if any)
- Suggestions (if any)
- Overall assessment

**Success Criteria:**
- [ ] Review completes without errors
- [ ] Review notes added to story
- [ ] Issues categorized by severity
- [ ] Specific recommendations provided

---

#### Test 3.6: Story Done

```bash
/story-done
```

**Expected Results:**

1. **Status Updated:**
```bash
cat .bmad/sprint-status.yaml
```

Story status should be: `done`

2. **Workflow Status:**
```bash
/workflow-status
```

Should show story completed.

**Success Criteria:**
- [ ] Status updated to "done"
- [ ] Workflow recognizes completion
- [ ] No errors

---

### Phase 4: Agent Tests (15 minutes)

#### Test 4.1: Product Manager Agent

In chat (not a slash command):

```
Use the bmad-pm agent to explain how to write effective user stories with good acceptance criteria.
```

**Expected Results:**
- Claude invokes bmad-pm via Task tool
- Agent provides expert product management guidance
- Response includes:
  - User story format (As a... I want... So that...)
  - Acceptance criteria best practices
  - INVEST criteria
  - Examples

**Success Criteria:**
- [ ] Agent invoked successfully
- [ ] Response is expert-level
- [ ] Includes practical examples
- [ ] Follows product management principles

---

#### Test 4.2: Architect Agent

```
Use the bmad-architect agent to review the architecture for a React + Node.js + PostgreSQL application with authentication.
```

**Expected Results:**
- Claude invokes bmad-architect via Task tool
- Agent provides architectural guidance:
  - Technology stack assessment
  - Architecture patterns (MVC, clean architecture)
  - Security considerations (JWT, password hashing)
  - Database design
  - API design
  - Deployment considerations

**Success Criteria:**
- [ ] Agent invoked successfully
- [ ] Comprehensive architecture guidance
- [ ] Addresses security and scalability
- [ ] Provides specific recommendations

---

#### Test 4.3: Developer Agent

```
Use the bmad-dev agent to explain Test-Driven Development best practices for a React component.
```

**Expected Results:**
- Agent provides TDD guidance:
  - Write test first
  - Red-Green-Refactor cycle
  - Testing Library best practices
  - Mock strategies
  - Coverage targets

**Success Criteria:**
- [ ] Agent invoked successfully
- [ ] TDD principles explained clearly
- [ ] React-specific testing guidance
- [ ] Practical code examples

---

#### Test 4.4: Test Engineer Agent

```
Use the bmad-tea agent to design a test strategy for the user login feature.
```

**Expected Results:**
- Agent provides test strategy:
  - Unit tests (component, API)
  - Integration tests
  - E2E tests
  - Test fixtures and factories
  - Coverage requirements
  - Quality gates

**Success Criteria:**
- [ ] Agent invoked successfully
- [ ] Comprehensive test strategy
- [ ] Multiple test levels covered
- [ ] Specific to the feature

---

### Phase 5: Brownfield Documentation Test (20 minutes)

#### Test 5.1: Create Sample Project Structure

```bash
# Create a sample JavaScript/React project
mkdir -p src/{components,pages,api,utils}

# Create sample files
cat > src/api/users.js << 'EOF'
export async function getUsers() {
  const response = await fetch('/api/users');
  return response.json();
}

export async function createUser(userData) {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return response.json();
}
EOF

cat > src/components/UserList.jsx << 'EOF'
import React, { useEffect, useState } from 'react';
import { getUsers } from '../api/users';

export function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
EOF

cat > package.json << 'EOF'
{
  "name": "test-app",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "vite": "^4.0.0",
    "@vitejs/plugin-react": "^3.0.0"
  }
}
EOF
```

---

#### Test 5.2: Run Document Project (Quick Scan)

```bash
/document-project
```

**Answer Prompts:**
- **Mode:** `1` (Initial Scan)
- **Scan Level:** `1` (Quick Scan - 2-5 min)
- **Project Root:** `.` (current directory)

**Expected Results:**

1. **Project Type Detected:**
   - Type: `web`
   - Technologies: React, JavaScript, Vite

2. **Documentation Generated:**
```bash
ls .bmad/output/
```

Should show:
```
index.md
project-overview.md
source-tree.md
ui-components.md (if applicable)
api-endpoints.md (if applicable)
project-scan-report.json
```

3. **Index Content:**
```bash
cat .bmad/output/index.md
```

Should contain:
- Project classification
- Technology stack
- Directory structure summary
- Links to other docs

4. **Completion Time:**
   - Should complete in < 5 minutes

**Success Criteria:**
- [ ] Project type detected correctly
- [ ] Documentation files created
- [ ] Files are well-formatted
- [ ] Index links work
- [ ] Completed in < 5 min

---

#### Test 5.3: Deep-Dive Documentation (Optional)

```bash
/document-project
```

**Answer Prompts:**
- **Mode:** `2` (Deep-dive into specific area)
- **Area:** `API endpoints` (or specify folder: `src/api`)

**Expected Results:**

1. **Deep-Dive Doc Created:**
```bash
cat .bmad/output/deep-dive-api-endpoints.md
```

Should contain:
- Complete file inventory
- All exports with signatures
- Dependencies
- Data flow
- Implementation guidance

**Success Criteria:**
- [ ] Deep-dive doc created
- [ ] Comprehensive detail
- [ ] All files analyzed
- [ ] Dependency graph included

---

### Phase 6: Level 2 Flow Test (Optional - 1 hour)

For comprehensive testing, try a full Level 2 BMad Method flow:

```bash
# 1. Initialize Level 2
/workflow-init
# Select Level 2, Greenfield

# 2. Product Brief
/product-brief
# Define product vision

# 3. Research
/research
# Choose research type

# 4. PRD
/prd
# Generate comprehensive PRD

# 5. Epics & Stories
/create-epics-and-stories
# Break into development units

# 6. Architecture
/architecture
# Design system

# 7. Sprint Planning
/sprint-planning
# Plan sprint

# 8. Development Cycle
/create-story
/story-ready
/dev-story
/code-review
/story-done

# 9. Retrospective
/retrospective
# Party Mode review
```

**Success Criteria:**
- [ ] All workflows complete
- [ ] Proper file structure
- [ ] Coherent artifacts
- [ ] Status tracking works

---

## 🐛 Troubleshooting

### Issue: Plugin Not Found

```bash
# Check marketplace is added
/plugin marketplace list

# Re-add if needed
/plugin marketplace add /path/to/bmad/bmad-marketplace
```

### Issue: Commands Not Available

```bash
# Check plugin is installed
/plugin list

# Reinstall if needed
/plugin uninstall bmad-method@bmad-marketplace
/plugin install bmad-method@bmad-marketplace
```

### Issue: Workflow Errors

```bash
# Check .bmad directory
ls -la .bmad/

# Check config
cat .bmad/config.yaml

# Re-initialize if corrupted
rm -rf .bmad/
/workflow-init
```

### Issue: Agent Not Working

```bash
# Check agents list
/agents

# Try explicit invocation
Use the bmad-pm agent to help me.
```

---

## 📊 Test Results Template

### Installation Tests
- [ ] Plugin installs successfully
- [ ] All 20 commands available
- [ ] All 8 agents available
- [ ] No installation errors

### Workflow Tests
- [ ] workflow-init creates structure
- [ ] tech-spec generates document
- [ ] sprint-planning creates tracking
- [ ] create-story generates story
- [ ] story-ready updates status
- [ ] dev-story implements with TDD
- [ ] code-review provides feedback
- [ ] story-done completes flow

### Agent Tests
- [ ] bmad-pm provides PM guidance
- [ ] bmad-architect provides architecture guidance
- [ ] bmad-dev provides dev guidance
- [ ] bmad-tea provides test strategy

### Brownfield Tests
- [ ] document-project detects project type
- [ ] Quick scan completes < 5 min
- [ ] Documentation generated correctly
- [ ] Deep-dive provides detail

### Overall Assessment
- **Installation:** ⭐⭐⭐⭐⭐
- **Workflows:** ⭐⭐⭐⭐⭐
- **Agents:** ⭐⭐⭐⭐⭐
- **Documentation:** ⭐⭐⭐⭐⭐

**Ready for Production:** YES / NO

---

## 📞 Reporting Issues

If you encounter issues:

1. **Document the error:**
   - Command that failed
   - Exact error message
   - Steps to reproduce

2. **Check logs:**
   ```bash
   claude --debug
   ```

3. **Report on GitHub:**
   - https://github.com/pmatheus/bmad/issues

4. **Include context:**
   - Claude Code version
   - OS version
   - Plugin version

---

## 🎉 Success!

If all tests pass:

✅ **BMAD Method plugin is working correctly!**

**You're ready to:**
- Use on real projects
- Share with your team
- Contribute improvements
- Build amazing software with AI assistance

---

**Happy Testing!** 🚀

*Testing Guide v1.0 for BMAD Method v2.0*
*GitHub: https://github.com/pmatheus/bmad*
