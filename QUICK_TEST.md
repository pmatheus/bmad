# BMAD Method Plugin - Quick Test Guide

**Use this guide to quickly test the plugin installation.**

---

## 🚀 Installation (5 minutes)

```bash
# 1. Start Claude Code in test project
cd /tmp/bmad-test-project
claude

# 2. Add marketplace
/plugin marketplace add /Users/user/BMAD-METHOD/bmad-marketplace

# 3. Install plugin
/plugin install bmad-method@bmad-marketplace

# 4. Verify
/workflow-status
```

**Expected:** Plugin installs successfully, workflow-status shows "No workflow in progress"

---

## ✅ Quick Smoke Tests (10 minutes)

### Test 1: Verify Commands (2 min)

```bash
# List commands (type / and press tab)
/

# Try workflow-status
/workflow-status

# Try workflow-init help
/workflow-init
```

**Expected:** All 20 commands available, workflow-status runs, workflow-init asks questions

### Test 2: Initialize Project (3 min)

```bash
/workflow-init
```

**Answer prompts:**
- Level: `0` (Quick Flow)
- Type: `greenfield`
- Name: `Test Project`
- Description: `Testing BMAD Method plugin`

**Expected:**
- `.bmad/` directory created
- `workflow-status.yaml` created
- `config.yaml` created
- "Workflow initialized" message

### Test 3: Create Tech Spec (5 min)

```bash
/tech-spec
```

**Follow prompts:**
- Feature: `User login form`
- Description: `Simple login with email/password`

**Expected:**
- `.bmad/output/tech-spec.md` created
- File contains problem, solution, acceptance criteria
- Workflow status updated

---

## 🧪 Full Workflow Test (30 minutes)

### Level 0: Quick Flow End-to-End

```bash
# 1. Initialize (already done above)
/workflow-status
# Should show: Level 0, Quick Flow, Phase 2

# 2. Sprint planning
/sprint-planning
# Creates sprint-status.yaml

# 3. Create story
/create-story
# Generates story-001 from tech spec

# 4. Mark ready
/story-ready
# Assembles story context

# 5. Develop (TDD)
/dev-story
# Implements with tests
# (Will ask for confirmation to modify files)

# 6. Code review
/code-review
# Reviews implemented code

# 7. Mark done
/story-done
# Marks story complete
```

**Expected:** Full flow completes without errors, `.bmad/output/stories/` contains story file

---

## 🤖 Agent Test (5 minutes)

### Test Agent Invocation

In chat (not a slash command):

```
Use the bmad-pm agent to help me understand how to write good user stories.
```

**Expected:**
- Claude invokes bmad-pm agent via Task tool
- Agent provides expert product management guidance
- Response includes user story format, acceptance criteria tips

### Test Another Agent

```
Have the bmad-architect agent review my tech stack choices for a React + Node.js app.
```

**Expected:**
- Claude invokes bmad-architect agent
- Agent provides architectural guidance
- Mentions best practices, patterns, considerations

---

## 📋 Brownfield Test (15 minutes)

### Test Document Project

```bash
# 1. Create a sample project structure
cd /tmp/bmad-test-project
mkdir -p src/{components,pages,api}
echo "export function hello() { return 'Hello'; }" > src/api/hello.js
echo '{"name": "test-app", "version": "1.0.0"}' > package.json

# 2. Run document-project
/document-project
```

**Answer prompts:**
- Mode: `Initial Scan`
- Scan level: `Quick Scan`
- Project root: `.` (current directory)

**Expected:**
- Detects project type (web/backend/library)
- Generates `.bmad/output/index.md`
- Generates project documentation files
- Completes in < 5 minutes

---

## 🎯 Success Criteria

### ✅ Installation Success
- [ ] Plugin installs without errors
- [ ] All 20 commands available via `/`
- [ ] All 8 agents available via `/agents`
- [ ] `/workflow-status` runs successfully

### ✅ Workflow Success
- [ ] `/workflow-init` creates `.bmad/` structure
- [ ] `/tech-spec` generates spec document
- [ ] `/sprint-planning` creates sprint tracking
- [ ] `/create-story` generates story file
- [ ] Full flow completes without errors

### ✅ Agent Success
- [ ] Agents can be invoked via chat
- [ ] bmad-pm provides PM guidance
- [ ] bmad-architect provides architecture guidance
- [ ] Agents use specialized knowledge

### ✅ Brownfield Success
- [ ] `/document-project` detects project type
- [ ] Generates documentation in `.bmad/output/`
- [ ] Quick scan completes in < 5 min

---

## 🐛 Common Issues

### Plugin Not Found

```bash
# Check marketplace is added
/plugin marketplace list

# Should show: bmad-marketplace

# If not, add again:
/plugin marketplace add /Users/user/BMAD-METHOD/bmad-marketplace
```

### Commands Not Available

```bash
# Restart Claude Code
# Exit and restart

# Then check:
/plugin list
# Should show: bmad-method
```

### Workflow Errors

```bash
# Check .bmad/ directory exists
ls .bmad/

# Check config files
cat .bmad/config.yaml
cat .bmad/workflow-status.yaml

# Re-initialize if needed
rm -rf .bmad/
/workflow-init
```

---

## 📞 Next Steps After Testing

### If All Tests Pass ✅

1. **Document findings** - Note any issues or improvements
2. **Test on real project** - Try with actual codebase
3. **Test advanced workflows** - Try Level 2 BMad Method
4. **Provide feedback** - Share results and suggestions

### If Tests Fail ❌

1. **Check error messages** - Note exact errors
2. **Verify file locations** - Confirm paths are correct
3. **Check JSON syntax** - Validate manifests with `jq`
4. **Review logs** - Use `claude --debug` for details
5. **Report issues** - Document and report

---

## 🎊 Congratulations!

If you've completed all tests successfully, the BMAD Method plugin is working correctly!

**You're ready to:**
- Use BMAD Method on real projects
- Build features with Level 0 Quick Flow
- Develop products with Level 2 BMad Method
- Document brownfield projects
- Leverage specialized agents

---

**Happy Building with BMAD Method!** 🚀

*Quick Test Guide v1.0*
*For BMAD Method v2.0*
