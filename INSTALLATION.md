# BMAD Method - Installation Guide

Complete installation and testing guide for the BMAD Method Claude Code plugin.

---

## Installation Methods

### Method 1: GitHub Marketplace (Recommended) ⭐

The easiest way to install BMAD Method:

```bash
# In Claude Code:
/plugin marketplace add pmatheus/bmad

# Install the plugin
/plugin install bmad-method

# Verify installation
/workflow-status
```

**Expected Output:**
```
BMAD Method is ready!
```

---

### Method 2: Manual Installation

If marketplace installation fails, use manual installation:

```bash
# 1. Clone the repository
git clone https://github.com/pmatheus/bmad.git
cd bmad

# 2. Copy to Claude Code plugins directory
cp -r .claude ~/.claude/plugins/bmad-method

# 3. Restart Claude Code if already running

# 4. Verify in Claude Code
/workflow-status
```

---

## Verification

After installation, verify all components are working:

### Check Available Commands

Type `/` in Claude Code and look for BMAD commands:

```
/workflow-status        ✓ Meta workflow
/workflow-init          ✓ Meta workflow

/product-brief          ✓ Phase 1 (Analysis)
/research               ✓ Phase 1
/domain-research        ✓ Phase 1
/brainstorm-project     ✓ Phase 1
/document-project       ✓ Phase 1

/prd                    ✓ Phase 2 (Planning)
/tech-spec              ✓ Phase 2
/create-epics-and-stories ✓ Phase 2

/architecture           ✓ Phase 3 (Solutioning)

/sprint-planning        ✓ Phase 4 (Implementation)
/epic-tech-context      ✓ Phase 4
/story-context          ✓ Phase 4
/create-story           ✓ Phase 4
/story-ready            ✓ Phase 4
/dev-story              ✓ Phase 4
/code-review            ✓ Phase 4
/story-done             ✓ Phase 4
/retrospective          ✓ Phase 4
```

**Total: 20 commands** ✓

### Check Subagents

Verify subagents are available (they're invoked automatically by workflows):

```bash
# Check subagents directory
ls ~/.claude/plugins/bmad-method/subagents/
```

**Expected:**
```
bmad-analyst.md       ✓ Business Analyst
bmad-architect.md     ✓ Software Architect
bmad-dev.md           ✓ Developer
bmad-pm.md            ✓ Product Manager
bmad-sm.md            ✓ Scrum Master
bmad-tea.md           ✓ Test Engineer
bmad-tech-writer.md   ✓ Technical Writer
bmad-ux.md            ✓ UX Designer
```

**Total: 8 subagents** ✓

---

## First Project Setup

### Quick Test (5 minutes)

```bash
# 1. Create a test directory
mkdir ~/bmad-test && cd ~/bmad-test

# 2. Start Claude Code
claude

# 3. Initialize BMAD
/workflow-init
# Choose: Level 0 (Quick Flow)

# 4. Check status
/workflow-status
# Should show: Initialized, Level 0

# 5. Verify config
cat .bmad/config.yaml
```

**Expected `.bmad/config.yaml`:**
```yaml
project_name: "bmad-test"
project_level: 0
output_folder: ".bmad"
user_name: "Your Name"
tech_stack: []
```

### Full Test (15 minutes)

Test a complete workflow:

```bash
# In Claude Code:

# 1. Initialize
/workflow-init
# Choose Level 0

# 2. Create tech spec
/tech-spec
# Describe: "Add user authentication with JWT"

# 3. Generate sprint
/sprint-planning

# 4. Create story
/create-story

# 5. Check generated files
ls .bmad/output/
# Should show: tech-spec.md, sprint files, story files
```

---

## Troubleshooting

### Issue: "Plugin 'bmad-method' not found in any marketplace"

**Solution 1: Verify marketplace**
```bash
# In Claude Code:
/plugin marketplace list
# Should show: bmad
```

**Solution 2: Re-add marketplace**
```bash
/plugin marketplace remove bmad
/plugin marketplace add pmatheus/bmad
/plugin install bmad-method
```

**Solution 3: Use manual installation** (see Method 2 above)

---

### Issue: Commands not showing up

**Solution 1: Verify plugin directory**
```bash
ls ~/.claude/plugins/bmad-method/commands/
# Should show: meta/ phase-1/ phase-2/ phase-3/ phase-4/ workflow-status.md
```

**Solution 2: Restart Claude Code**
```bash
# Exit and restart Claude Code
claude
```

---

### Issue: "Config file not found"

**Solution: Run workflow-init**
```bash
# In Claude Code:
/workflow-init
```

This creates `.bmad/config.yaml` in your project directory.

---

### Issue: Subagents not working

**Solution: Verify subagent files**
```bash
ls ~/.claude/plugins/bmad-method/subagents/
# Should show all 8 .md files

# Check a subagent file has proper frontmatter:
head -10 ~/.claude/plugins/bmad-method/subagents/bmad-pm.md
```

**Expected frontmatter:**
```markdown
---
description: Product Manager - PRD creation, requirements, user stories
subagent_type: bmad-pm
---
```

---

## Uninstallation

### Remove via Plugin Manager

```bash
# In Claude Code:
/plugin uninstall bmad-method
/plugin marketplace remove bmad
```

### Manual Removal

```bash
rm -rf ~/.claude/plugins/bmad-method
```

---

## Support

### Getting Help

- **GitHub Issues**: https://github.com/pmatheus/bmad/issues
- **Discussions**: https://github.com/pmatheus/bmad/discussions
- **Documentation**: See repository README.md

### Common Questions

**Q: Can I customize workflows?**
A: Yes! Edit files in `~/.claude/plugins/bmad-method/commands/`

**Q: Can I add my own subagents?**
A: Yes! Add `.md` files to `~/.claude/plugins/bmad-method/subagents/`

**Q: Where are project files stored?**
A: In `.bmad/` directory within your project

**Q: Can I use BMAD with existing projects?**
A: Yes! Use `/document-project` to analyze existing codebases

---

## Next Steps

After successful installation:

1. Read [QUICK-START.md](QUICK-START.md) for 5-minute tutorial
2. Read [README.md](README.md) for complete documentation
3. Try a Level 0 workflow on a test project
4. Explore individual workflow documentation in `.claude/commands/`

---

**Installation Complete!** 🎉

You're ready to build with BMAD Method.
