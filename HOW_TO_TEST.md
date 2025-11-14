# How to Test BMAD Method Plugin

**GitHub Repository:** https://github.com/pmatheus/bmad

This guide provides the exact commands to test the BMAD Method plugin installation.

---

## 📋 Prerequisites Check

```bash
# Check Claude Code is installed
claude --version

# Check you're in the BMAD-METHOD directory
pwd
# Should show: /Users/user/BMAD-METHOD

# Check Git is initialized
git status
```

---

## 🚀 Quick Installation Test (5 minutes)

### Step 1: Create Test Project

```bash
# Create and navigate to test project
mkdir -p /tmp/bmad-test-project
cd /tmp/bmad-test-project

# Initialize git
git init
echo "# BMAD Test Project" > README.md
git add README.md
git commit -m "Initial commit"
```

### Step 2: Start Claude Code

```bash
# Start Claude Code in test project
claude
```

### Step 3: Install Plugin (Inside Claude Code)

```bash
# Add the local marketplace
/plugin marketplace add /Users/user/BMAD-METHOD/bmad-marketplace

# Install the plugin
/plugin install bmad-method@bmad-marketplace

# Verify installation
/plugin list
```

**Expected Output:**
```
Installed Plugins:
✓ bmad-method@bmad-marketplace (v2.0.0)
```

### Step 4: Verify Commands

```bash
# Check workflow status
/workflow-status
```

**Expected Output:**
```
No workflow currently in progress.

To start a new project workflow:
- Run /workflow-init to initialize tracking
```

### Step 5: Verify Agents

```bash
# List agents
/agents
```

**Expected Output:**
```
Available Agents:
- bmad-pm
- bmad-architect
- bmad-dev
- bmad-tea
- bmad-analyst
- bmad-sm
- bmad-ux
- bmad-tech-writer
```

---

## ✅ Basic Workflow Test (10 minutes)

### Step 6: Initialize Workflow

```bash
/workflow-init
```

**Answer the prompts:**
- Level: `0` (Quick Flow)
- Type: `greenfield`
- Name: `Test Project`
- Description: `Testing BMAD Method`
- Output folder: (press Enter for default)

**Verify:**
```bash
# In a new terminal (not Claude Code)
ls -la /tmp/bmad-test-project/.bmad/
```

**Expected:**
```
.bmad/
├── config.yaml
├── workflow-status.yaml
└── output/
```

### Step 7: Create Tech Spec

```bash
# Back in Claude Code
/tech-spec
```

**Answer prompts** (example):
- Feature: `User login with email/password`
- Problem: `Users need to authenticate`
- Solution: `JWT-based authentication with bcrypt password hashing`

**Verify:**
```bash
# In terminal
cat /tmp/bmad-test-project/.bmad/output/tech-spec.md
```

**Should contain:**
- Problem statement
- Solution overview
- Technical design
- Acceptance criteria

### Step 8: Test Agent

**In Claude Code chat** (not a slash command):
```
Use the bmad-pm agent to explain how to write good user stories.
```

**Expected:**
- Claude invokes bmad-pm agent
- Agent provides product management guidance
- Response includes user story format

---

## 🎯 Success Criteria

If all steps complete without errors, the plugin is working!

✅ Plugin installs successfully
✅ All commands available
✅ All agents available
✅ Workflows create proper file structure
✅ Agents can be invoked

---

## 📖 Full Testing

For comprehensive testing, see:
- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Complete test suite with all workflows
- **[QUICK_TEST.md](QUICK_TEST.md)** - 15-minute validation

---

## 🐛 Troubleshooting

### Plugin Not Found

```bash
# Check marketplace path is correct
ls /Users/user/BMAD-METHOD/bmad-marketplace/.claude-plugin/marketplace.json

# Re-add marketplace
/plugin marketplace add /Users/user/BMAD-METHOD/bmad-marketplace
```

### Commands Not Showing

```bash
# Restart Claude Code
# Exit and run: claude

# Check plugin is enabled
/plugin list
```

### Directory Not Created

```bash
# Check you're in the right directory
pwd

# Check permissions
ls -la .

# Try manual creation
mkdir -p .bmad/output
```

---

## 📞 Next Steps

After successful basic test:

1. **Try full workflow** - Follow TESTING_GUIDE.md Phase 3
2. **Test brownfield** - Follow TESTING_GUIDE.md Phase 5
3. **Use on real project** - Apply to actual codebase
4. **Report findings** - GitHub Issues if problems

---

## 🎉 You're Ready!

If basic tests pass, you're ready to:
- Build features with BMAD Method
- Document brownfield projects
- Leverage specialized agents
- Ship production code with AI assistance

---

**Happy Building!** 🚀

*Quick How-To Guide for BMAD Method v2.0*
*GitHub: https://github.com/pmatheus/bmad*
