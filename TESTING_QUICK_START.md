# BMAD Plugin - Quick Test Guide

Complete guide to test the BMAD plugin in a fresh project.

---

## Step 1: Update Plugin

First, ensure you have the latest version:

```bash
# In Claude Code:
/plugin uninstall bmad
/plugin install bmad
```

Or manual update:
```bash
cd ~/bmad
git pull
cp -r .claude ~/.claude/plugins/bmad
```

---

## Step 2: Create Test Project

```bash
# Create a new directory
mkdir ~/bmad-test-project
cd ~/bmad-test-project

# Initialize git (optional but recommended)
git init

# Create a simple project structure
mkdir src
echo "# Test Project" > README.md

# Start Claude Code
claude
```

---

## Step 3: Verify Plugin Loaded

In Claude Code, verify everything is loaded:

### Check Commands
```bash
# Type / and look for:
/workflow-init
/workflow-status
/product-brief
/prd
/architecture
/dev-story
/cis/innovation-strategy
/cis/design-thinking
# ... etc (should see 24 total)
```

### Check Agents
```bash
/agents

# Should list 13 agents:
# - bmad-pm
# - bmad-architect
# - bmad-dev
# - bmad-tea
# - bmad-analyst
# - bmad-sm
# - bmad-ux
# - bmad-tech-writer
# - bmad-innovation-strategist
# - bmad-creative-problem-solver
# - bmad-design-thinking-coach
# - bmad-brainstorming-coach
# - bmad-storyteller
```

---

## Step 4: Test Level 0 Flow (Quick - 5 min)

Perfect for testing basic functionality:

```bash
# 1. Initialize BMAD
/workflow-init
```

**Select:**
- Project Level: **0** (Quick Fix/Small Feature)
- Project Name: "Test Project"
- Tech Stack: Node.js (or whatever you want)

**Expected Output:**
- Creates `.bmad/` directory
- Creates `.bmad/config.yaml`
- Creates `.bmad/workflow-status.yaml`

**Verify:**
```bash
ls -la .bmad/
# Should show:
# - config.yaml
# - workflow-status.yaml
```

```bash
# 2. Check status
/workflow-status
```

**Expected:** Shows "Initialized at Level 0" and recommends next step

```bash
# 3. Create tech spec
/tech-spec
```

**Describe:** "Add user authentication with email/password and JWT tokens"

**Expected Output:**
- Creates `.bmad/output/tech-spec.md`
- Contains technical specifications
- Lists tasks and acceptance criteria

**Verify:**
```bash
cat .bmad/output/tech-spec.md
# Should have detailed tech spec
```

```bash
# 4. Generate sprint plan
/sprint-planning
```

**Expected:**
- Creates `.bmad/sprint-status.yaml`
- Shows sprint backlog

**Verify:**
```bash
cat .bmad/sprint-status.yaml
```

```bash
# 5. Create a story
/create-story
```

**Expected:**
- Creates `.bmad/output/stories/story-001.md`
- Story with acceptance criteria and tasks

**Verify:**
```bash
cat .bmad/output/stories/story-001.md
```

---

## Step 5: Test Agent Delegation

Test that workflows properly delegate to agents:

```bash
# Test Product Manager agent
/product-brief
```

**Watch for:** Should mention delegating to Product Manager (bmad-pm) agent

```bash
# Test Innovation Strategist
/cis/innovation-strategy
```

**Watch for:** Should delegate to bmad-innovation-strategist agent

**Expected Behavior:**
- Agent introduction (personality, role)
- Guided workflow specific to that agent
- Output file in `.bmad/output/`

---

## Step 6: Test Level 2 Flow (Full - 15-30 min)

For comprehensive testing:

```bash
# Start fresh
cd ..
mkdir bmad-test-full
cd bmad-test-full
claude
```

```bash
# 1. Initialize at Level 2
/workflow-init
```

**Select:**
- Level: **2** (Full Product)
- Name: "SaaS Project Manager"
- Stack: React, Node.js, PostgreSQL

```bash
# 2. Product Brief
/product-brief
```

**Interactive conversation:**
- Answer questions about your product
- Define vision, target users, value proposition
- Creates `.bmad/output/product-brief.md`

```bash
# 3. Research
/research
```

**Select:** Market research
**Expected:** Delegates to Business Analyst agent

```bash
# 4. PRD
/prd
```

**Expected:**
- Delegates to Product Manager agent
- Creates comprehensive `.bmad/output/prd.md`
- Includes requirements, user stories, success metrics

```bash
# 5. Break into Epics
/create-epics-and-stories
```

**Expected:**
- Creates `.bmad/output/epics/` directory
- Multiple epic files with stories

```bash
# 6. Architecture
/architecture
```

**Expected:**
- Delegates to Software Architect agent
- Creates `.bmad/output/architecture.md`
- System design, tech stack decisions, diagrams

```bash
# 7. Continue with sprint-planning, dev-story, etc.
/sprint-planning
/create-story
/dev-story
```

---

## Step 7: Test CIS Workflows

Test Creative Intelligence System workflows:

```bash
# 1. Innovation Strategy
/cis/innovation-strategy
```

**Expected:**
- Delegates to Innovation Strategist agent (Victor)
- Strategic analysis using Blue Ocean, Business Model Canvas
- Creates `.bmad/output/innovation-strategy-[date].md`

```bash
# 2. Design Thinking
/cis/design-thinking
```

**Expected:**
- Delegates to Design Thinking Coach (Maya)
- 5-phase process: Empathize, Define, Ideate, Prototype, Test
- Human-centered design output

```bash
# 3. Problem Solving
/cis/problem-solving
```

**Expected:**
- Delegates to Creative Problem Solver (Dr. Quinn)
- TRIZ, root cause analysis, systematic solution
- Creates problem-solving documentation

```bash
# 4. Storytelling
/cis/storytelling
```

**Expected:**
- Delegates to Storyteller (Sophia)
- Choose from 10 story frameworks
- Creates compelling narrative

---

## Step 8: Verify Generated Files

Check all generated files:

```bash
# Tree structure
tree .bmad/

# Should show:
.bmad/
├── config.yaml
├── workflow-status.yaml
├── sprint-status.yaml (if you ran sprint-planning)
└── output/
    ├── product-brief.md
    ├── prd.md
    ├── tech-spec.md
    ├── architecture.md
    ├── epics/
    │   ├── epic-001.md
    │   └── epic-002.md
    └── stories/
        ├── story-001.md
        └── story-002.md
```

---

## Common Issues & Solutions

### Issue: Commands not showing
**Solution:**
```bash
# Reinstall plugin
/plugin uninstall bmad
/plugin install bmad
# Restart Claude Code
```

### Issue: Agents not listed
**Solution:**
```bash
# Verify agent files exist
ls ~/.claude/plugins/bmad/agents/
# Should show 13 .md files

# Check frontmatter format:
head -10 ~/.claude/plugins/bmad/agents/bmad-pm.md
# Should have: name, description, model, color
```

### Issue: "Config file not found"
**Solution:**
```bash
# Run workflow-init first
/workflow-init
```

### Issue: Output files not created
**Solution:**
```bash
# Verify .bmad directory exists
ls -la .bmad/

# Check permissions
chmod -R u+w .bmad/
```

---

## Success Checklist

After testing, you should have:

- [x] Plugin installs without errors
- [x] 24 commands visible when typing `/`
- [x] 13 agents listed in `/agents`
- [x] `/workflow-init` creates `.bmad/` directory
- [x] `/workflow-status` shows current state
- [x] Workflows create output files in `.bmad/output/`
- [x] Agents are properly invoked (you see personality/style)
- [x] CIS workflows work and delegate to CIS agents
- [x] Config file (`.bmad/config.yaml`) is readable/editable
- [x] Sprint tracking (`.bmad/sprint-status.yaml`) works

---

## Quick Reference

### Fast Test (2 minutes)
```bash
mkdir test && cd test && claude
/workflow-init  # Level 0
/tech-spec      # Describe a feature
ls .bmad/output/
```

### Medium Test (10 minutes)
```bash
/workflow-init  # Level 1
/tech-spec
/sprint-planning
/create-story
/dev-story
```

### Full Test (30 minutes)
```bash
/workflow-init  # Level 2
/product-brief
/prd
/create-epics-and-stories
/architecture
/sprint-planning
/create-story
/dev-story
/code-review
```

---

## Next Steps After Testing

If everything works:
1. Use on a real project
2. Customize agents in `~/.claude/plugins/bmad/agents/`
3. Customize workflows in `~/.claude/plugins/bmad/commands/`
4. Share feedback via GitHub issues

If issues found:
1. Check troubleshooting section above
2. Open GitHub issue with details
3. Include error messages and steps to reproduce

---

**Happy Testing!** 🚀
