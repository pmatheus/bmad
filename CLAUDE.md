# BMAD Method → Claude Code Migration - Active Context

**CRITICAL: READ THIS FIRST ON EVERY SESSION**

This repository is undergoing conversion from a tool-agnostic framework to a Claude Code native plugin.

---

## Current Migration Status

**Phase:** Foundation Complete, Incremental Conversion In Progress
**Date Started:** 2025-01-13
**Completion:** ~25% (foundation + 3 proof-of-concept conversions)

### Conversion Progress Tracking

**Location:** `.bmad-conversion/` directory contains:
- `progress.json` - Machine-readable progress tracking
- `current-task.md` - What to work on next
- `completed/` - List of completed conversions
- `in-progress/` - Current conversion work
- `notes/` - Session notes and learnings

**ALWAYS check `.bmad-conversion/current-task.md` before starting work!**

---

## Incremental Conversion Strategy

**⚠️ IMPORTANT: Do NOT attempt to convert everything at once!**

The context window will blow up. Instead:

1. **Check current task:** Read `.bmad-conversion/current-task.md`
2. **Work on ONE item:** Convert one workflow OR one agent at a time
3. **Save progress:** Update `.bmad-conversion/progress.json`
4. **Update current task:** Write next task to `current-task.md`
5. **Session notes:** Record learnings in `.bmad-conversion/notes/session-{date}.md`

### Workflow for Each Conversion

```bash
# 1. Check what to do next
cat .bmad-conversion/current-task.md

# 2. Convert ONE item (workflow or agent)
node claude-code-plugin/tools/convert-workflow.js <source> <target>
# OR
node claude-code-plugin/tools/convert-agent.js <source> <target>

# 3. Manual review and enhancement
# Edit the converted file

# 4. Test the conversion
# Install to ~/.claude/ and test

# 5. Mark as complete
# Update .bmad-conversion/progress.json
# Move to .bmad-conversion/completed/

# 6. Update current task
# Write next task to .bmad-conversion/current-task.md
```

---

## Priority Order (P0 First!)

### P0 Workflows (Critical - Convert First)
- [x] workflow-init
- [x] workflow-status
- [ ] prd
- [ ] architecture
- [ ] create-epics-and-stories
- [ ] dev-story

### P0 Agents (Critical - Convert First)
- [x] Product Manager (bmad-pm)
- [ ] Architect (bmad-architect)
- [ ] Developer (bmad-dev)

### P1 Workflows (High Priority)
- [ ] product-brief
- [ ] epic-tech-context
- [ ] create-story
- [ ] story-context
- [ ] code-review
- [ ] story-ready
- [ ] story-done
- [ ] sprint-planning
- [ ] tech-spec

### P1 Agents (High Priority)
- [ ] Test Engineer (bmad-tea)
- [ ] Business Analyst (bmad-analyst)
- [ ] Scrum Master (bmad-sm)

### P2 Workflows (Medium Priority)
- [ ] brainstorm-project
- [ ] domain-research
- [ ] research
- [ ] document-project
- [ ] validate-prd
- [ ] validate-architecture

### P2 Agents (Medium Priority)
- [ ] UX Designer (bmad-ux)
- [ ] Technical Writer (bmad-tech-writer)

---

## Key Conversion Patterns

### Workflow Conversion
```markdown
---
description: One-line description from workflow.yaml
---

# Workflow Name

## What This Does
Brief explanation

## Prerequisites
- BMAD plugin installed
- workflow-init run

## Instructions

### Step 1: Load Configuration
Read from `.bmad/config.yaml`

### Step 2: [Action Name]
Detailed instructions

### Step N: Save Output
Where files are created

## Notes
Important caveats

## Output Files
List of created files
```

### Agent Conversion
```markdown
---
description: Agent description with use cases
subagent_type: bmad-{name}
---

# Agent Name

## Description
What this agent does

## Tools Available
All tools

## Persona
Role, background, style, principles

## Approach
How the agent works

## Instructions

### When [Use Case 1]
Detailed steps

### When [Use Case 2]
Detailed steps

## Examples
2-3 concrete examples

## Configuration
Reads from `.bmad/config.yaml`
```

---

## Important Conversion Notes

### XML → Markdown Transformations

**Steps:**
```xml
<step n="1" goal="Do something">
```
→
```markdown
### Step 1: Do something
```

**Actions:**
```xml
<action>Do this</action>
```
→
```markdown
**Action:** Do this
```

**Questions:**
```xml
<ask>Question?</ask>
```
→
```markdown
Use AskUserQuestion tool:
```yaml
questions:
  - question: "Question?"
    header: "Header"
    multiSelect: false
    options: [...]
```
\```
```

**Conditional Logic:**
```xml
<check if="condition">
```
→
```markdown
**If condition:**
```

**Variable References:**
```
{output_folder} → Read `output_folder` from `.bmad/config.yaml`
{user_name} → Read `user_name` from `.bmad/config.yaml`
{project-root} → Current working directory
```

---

## File Locations

### Source Files (v1.x)
- Workflows: `src/modules/bmm/workflows/*/`
- Agents: `src/modules/bmm/agents/*.agent.yaml`

### Target Files (v2.0 Claude Code Native)
- Commands: `claude-code-plugin/src/commands/`
- Subagents: `claude-code-plugin/src/subagents/`
- Skills: `claude-code-plugin/src/skills/`

### Conversion Tracking
- Progress: `.bmad-conversion/progress.json`
- Current task: `.bmad-conversion/current-task.md`
- Completed: `.bmad-conversion/completed/`
- Notes: `.bmad-conversion/notes/`

---

## Automation Tools

### Convert Workflow
```bash
node claude-code-plugin/tools/convert-workflow.js \
  src/modules/bmm/workflows/path/to/workflow \
  claude-code-plugin/src/commands/phase-N/workflow-name.md
```

### Convert Agent
```bash
node claude-code-plugin/tools/convert-agent.js \
  src/modules/bmm/agents/agent-name.agent.yaml \
  claude-code-plugin/src/subagents/bmad-agent-name.md
```

**⚠️ Scripts provide initial conversion. Manual review and enhancement ALWAYS required!**

---

## Testing Checklist

After each conversion:
- [ ] Frontmatter is correct
- [ ] All XML converted to markdown
- [ ] Variables converted to config reads
- [ ] Examples added
- [ ] File tested in Claude Code
- [ ] No runtime errors
- [ ] Progress updated

---

## Session Workflow

**Starting a new session:**
1. Read `.bmad-conversion/current-task.md`
2. Read `.bmad-conversion/progress.json`
3. Read last session notes in `.bmad-conversion/notes/`
4. Start work on current task

**Ending a session:**
1. Update `.bmad-conversion/progress.json`
2. Write current status to `.bmad-conversion/current-task.md`
3. Save session notes to `.bmad-conversion/notes/session-{date}.md`
4. Commit changes if significant progress made

---

## Documentation References

### Quick Reference
- **Architecture:** `CLAUDE_CODE_MIGRATION_PLAN.md`
- **Implementation Guide:** `IMPLEMENTATION_GUIDE.md`
- **Progress Report:** `PROGRESS_REPORT.md`
- **Next Steps:** `NEXT_STEPS.md`

### Examples
- **Simple Workflow:** `claude-code-plugin/src/commands/workflow-status.md`
- **Complex Workflow:** `claude-code-plugin/src/commands/meta/workflow-init.md`
- **Agent:** `claude-code-plugin/src/subagents/bmad-pm.md`

---

## Context Window Management

**If context is getting large:**
1. Finish current conversion
2. Save all progress to `.bmad-conversion/`
3. End session with clear notes
4. Start fresh session
5. Read `.bmad-conversion/current-task.md` to resume

**Signs context is too large:**
- Responses getting slower
- Errors about token limits
- Difficulty maintaining focus

**Recovery:**
- Save progress immediately
- Start new conversation
- Load only current task context

---

## Quick Commands

```bash
# Check current task
cat .bmad-conversion/current-task.md

# See progress
cat .bmad-conversion/progress.json | grep -A 2 "current"

# List completed conversions
ls .bmad-conversion/completed/

# Read last session notes
ls -t .bmad-conversion/notes/ | head -1 | xargs -I {} cat .bmad-conversion/notes/{}

# Convert next P0 workflow
# (See current-task.md for specific command)

# Test a conversion
# Install to ~/.claude and test in Claude Code
```

---

**REMEMBER: One conversion at a time. Save progress frequently. Check current-task.md always!**
