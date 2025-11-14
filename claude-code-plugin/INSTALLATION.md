# BMAD Method Plugin - Installation Guide

This guide explains how to install and test the BMAD Method plugin for Claude Code.

---

## Prerequisites

1. **Claude Code installed** - Ensure you have Claude Code CLI installed
2. **Git** - For version control integration
3. **Terminal access** - For running installation commands

---

## Installation Methods

### Method 1: Local Development Marketplace (Recommended for Testing)

This method is ideal for development and testing.

#### Step 1: Add the Local Marketplace

From the BMAD-METHOD repository root:

```bash
# Navigate to the repository root
cd /Users/user/BMAD-METHOD

# Start Claude Code from a test project
cd /tmp/bmad-test-project
claude
```

Inside Claude Code, add the marketplace:

```bash
/plugin marketplace add /Users/user/BMAD-METHOD/bmad-marketplace
```

#### Step 2: Install the Plugin

```bash
/plugin install bmad-method@bmad-marketplace
```

#### Step 3: Verify Installation

Check that commands and agents are available:

```bash
# List available commands (should see BMAD workflows)
/

# View agents
/agents

# Try a command
/workflow-status
```

---

### Method 2: Direct Installation (Advanced)

For advanced users who want to link directly to the plugin directory.

#### Step 1: Create Symbolic Link

```bash
# Create plugin directory if it doesn't exist
mkdir -p ~/.claude/plugins

# Create symbolic link to the plugin
ln -s /Users/user/BMAD-METHOD/claude-code-plugin ~/.claude/plugins/bmad-method
```

#### Step 2: Restart Claude Code

The plugin should be automatically loaded on next Claude Code session.

---

## Testing the Installation

### Test 1: Verify Commands Are Available

Start Claude Code in a test project:

```bash
cd /tmp/bmad-test-project
claude
```

Test basic commands:

```bash
# Check workflow status
/workflow-status

# Initialize a project
/workflow-init

# View help for a command
/prd --help
```

### Test 2: Verify Agents Are Available

```bash
# Open agent management
/agents

# Or directly use the Task tool to invoke an agent
```

In chat, try:

```
Use the bmad-pm agent to help me understand product management workflows
```

### Test 3: Run a Complete Workflow

#### Test Level 0 Quick Flow

```bash
# Initialize workflow
/workflow-init

# Select Level 0 (Quick Flow)
# Answer questions about your project

# Create tech spec
/tech-spec

# Create sprint plan
/sprint-planning

# Create story
/create-story

# Develop story
/dev-story
```

#### Test Level 2 BMad Method

```bash
# Initialize workflow
/workflow-init

# Select Level 2 (BMad Method)

# Create product brief
/product-brief

# Create PRD
/prd

# Create architecture
/architecture

# Create epics and stories
/create-epics-and-stories

# Sprint planning
/sprint-planning

# Develop story
/dev-story

# Code review
/code-review

# Complete story
/story-done

# Retrospective
/retrospective
```

### Test 4: Brownfield Documentation

```bash
# Test document-project workflow
/document-project

# Select "Initial Scan"
# Choose scan level (Quick/Deep/Exhaustive)
# Review generated documentation in .bmad/output/
```

---

## Troubleshooting

### Plugin Not Found

**Issue:** `/plugin install` says plugin not found

**Solution:**
1. Verify marketplace was added correctly:
   ```bash
   /plugin marketplace list
   ```

2. Check marketplace path is correct:
   ```bash
   ls /Users/user/BMAD-METHOD/bmad-marketplace/.claude-plugin/marketplace.json
   ```

3. Verify plugin.json exists:
   ```bash
   ls /Users/user/BMAD-METHOD/claude-code-plugin/.claude-plugin/plugin.json
   ```

### Commands Not Available

**Issue:** Commands don't show up after installation

**Solution:**
1. Restart Claude Code session
2. Verify plugin is enabled:
   ```bash
   /plugin list
   ```

3. Check if commands are in the right location:
   ```bash
   ls /Users/user/BMAD-METHOD/claude-code-plugin/src/commands/
   ```

### Agents Not Working

**Issue:** Agents don't respond or aren't available

**Solution:**
1. Check agent files exist:
   ```bash
   ls /Users/user/BMAD-METHOD/claude-code-plugin/src/subagents/
   ```

2. View agent list:
   ```bash
   /agents
   ```

3. Verify frontmatter in agent files is correct (YAML format)

### JSON Syntax Errors

**Issue:** Plugin fails to load due to JSON errors

**Solution:**
1. Validate plugin.json:
   ```bash
   cat /Users/user/BMAD-METHOD/claude-code-plugin/.claude-plugin/plugin.json | jq .
   ```

2. Validate marketplace.json:
   ```bash
   cat /Users/user/BMAD-METHOD/bmad-marketplace/.claude-plugin/marketplace.json | jq .
   ```

3. Fix any JSON syntax errors (missing commas, quotes, brackets)

---

## Uninstalling

### Remove Plugin

```bash
/plugin uninstall bmad-method@bmad-marketplace
```

### Remove Marketplace

```bash
/plugin marketplace remove bmad-marketplace
```

### Clean Symbolic Links (if using Method 2)

```bash
rm ~/.claude/plugins/bmad-method
```

---

## Directory Structure

After installation, the plugin provides:

### Commands (20 workflows)
- `/workflow-status` - Check current workflow status
- `/workflow-init` - Initialize new project workflow
- **Phase 1 (Analysis):**
  - `/product-brief` - Create product vision
  - `/research` - Conduct market/technical research
  - `/domain-research` - Research regulated domains
  - `/brainstorm-project` - Ideation and brainstorming
  - `/document-project` - Document brownfield projects
- **Phase 2 (Planning):**
  - `/prd` - Create Product Requirements Document
  - `/tech-spec` - Create technical specification
  - `/create-epics-and-stories` - Break PRD into stories
- **Phase 3 (Solutioning):**
  - `/architecture` - Design system architecture
- **Phase 4 (Implementation):**
  - `/epic-tech-context` - Generate technical specs for epics
  - `/story-context` - Assemble story context
  - `/create-story` - Create new story
  - `/story-ready` - Mark story ready for dev
  - `/dev-story` - Develop story
  - `/code-review` - Review completed story
  - `/story-done` - Mark story as done
  - `/sprint-planning` - Plan sprint
  - `/retrospective` - Run epic retrospective

### Agents (8 specialized)
- `bmad-pm` - Product Manager
- `bmad-architect` - Software Architect
- `bmad-dev` - Developer
- `bmad-tea` - Test Engineer
- `bmad-analyst` - Business Analyst
- `bmad-sm` - Scrum Master
- `bmad-ux` - UX Designer
- `bmad-tech-writer` - Technical Writer

### Skills (5 core)
- `bmad-verified-research` - Anti-hallucination research
- `bmad-story-context-generation` - Story context assembly
- `bmad-subagent-patterns` - Delegation patterns
- `bmad-test-architecture` - Test strategy generation
- `bmad-workflow-orchestration` - Workflow execution

---

## Next Steps

After successful installation:

1. **Read the Documentation:**
   - Review workflow guides in each command
   - Understand agent specializations
   - Learn skill usage patterns

2. **Start with Level 0:**
   - Begin with a simple tech-spec workflow
   - Learn the `.bmad/` directory structure
   - Understand workflow status tracking

3. **Graduate to Level 2:**
   - Try a full BMad Method project
   - Practice product brief → PRD → architecture flow
   - Run retrospectives

4. **Advanced Usage:**
   - Document brownfield projects
   - Customize workflows for your team
   - Extend with custom agents/skills

---

## Support

For issues, questions, or contributions:
- GitHub: https://github.com/your-org/bmad-method
- Documentation: See individual workflow files
- Issues: https://github.com/your-org/bmad-method/issues

---

**Enjoy using BMAD Method with Claude Code!** 🚀
