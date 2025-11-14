# BMAD Method - Quick Start Guide

Get up and running with BMAD Method in 5 minutes!

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/pmatheus/bmad.git
cd BMAD-METHOD/claude-code-plugin

# 2. Install to Claude Code
cp -r .claude ~/.claude/plugins/bmad-method

# 3. Verify
claude
# In Claude Code:
/workflow-status
```

You should see: "BMAD Method is ready!"

## Your First Project

### Level 0: Quick Fix (30 minutes)

Perfect for bug fixes or small changes.

```bash
# Navigate to your project
cd ~/my-project

# In Claude Code:
/workflow-init
# Choose Level 0

/tech-spec
# Describe the bug fix

/sprint-planning
# Review sprint plan

/create-story
# Generate story

/dev-story
# Implement with tests

/code-review
# Review code quality

/story-done
# Mark complete
```

### Level 1-2: New Feature or Product (1-4 weeks)

Full development cycle with planning and architecture.

```bash
# In Claude Code:
/workflow-init
# Choose Level 2

/product-brief
# Define product vision interactively

/research
# Market and technical research

/prd
# Create Product Requirements Document

/create-epics-and-stories
# Break into development units

/architecture
# Design system architecture

/sprint-planning
# Plan development sprints

# Then for each story:
/create-story
/story-context
/dev-story
/code-review
/story-done

# After epic completion:
/retrospective
```

## Essential Commands

### Check Status
```
/workflow-status
```
Shows current phase, completed steps, next actions.

### Create Story
```
/create-story
```
Generates next user story from epic.

### Implement Story
```
/dev-story
```
Executes TDD implementation with tests.

### Review Code
```
/code-review
```
Senior developer review with feedback.

## Project Structure

After initialization:

```
your-project/
├── .bmad/
│   ├── config.yaml           # Your project config
│   ├── workflow-status.yaml  # Progress tracking
│   ├── output/
│   │   ├── product-brief.md
│   │   ├── prd.md
│   │   ├── architecture.md
│   │   ├── epics/
│   │   └── stories/
│   └── docs/
└── src/                      # Your code
```

## Configuration

Edit `.bmad/config.yaml` after initialization:

```yaml
project_name: "My Awesome App"
project_level: 2
output_folder: ".bmad"
user_name: "Your Name"
tech_stack:
  - React
  - Node.js
  - PostgreSQL
testing_framework: "Jest"
```

## Common Workflows

### Starting Fresh Product
```
/workflow-init → /product-brief → /research → /prd → /architecture → /sprint-planning
```

### Documenting Existing Project
```
/workflow-init → /document-project → /architecture → /prd
```

### Adding Feature to Existing Project
```
/workflow-status → /create-story → /dev-story → /code-review → /story-done
```

## Tips

1. **Always start with `/workflow-status`** - Shows where you are
2. **Use `/workflow-init` once per project** - Sets up tracking
3. **Level 0-1 for speed** - Skip product brief and PRD
4. **Level 2+ for quality** - Full planning and architecture
5. **`/document-project` for brownfield** - Understand existing code first

## Troubleshooting

### Commands not found
```bash
# Verify installation
ls ~/.claude/plugins/bmad-method

# Should show:
# commands/  subagents/  skills/
```

### Config file missing
```bash
# Run in your project directory
/workflow-init
```

### Stories not generating
```bash
# Ensure you've run these first:
/prd
/create-epics-and-stories
/sprint-planning
```

## Next Steps

- Read [README.md](./README.md) for complete documentation
- Explore individual command files in `.claude/commands/`
- Check out specialized agents in `.claude/subagents/`
- See [INSTALLATION.md](./INSTALLATION.md) for advanced setup

## Support

- GitHub Issues: https://github.com/pmatheus/bmad/issues
- Discussions: https://github.com/pmatheus/bmad/discussions

Happy building with BMAD Method! 🚀
