# BMAD Method Conversion Tracking

This directory tracks the incremental conversion of BMAD Method from a tool-agnostic framework to a Claude Code native plugin.

---

## Purpose

**Problem:** Converting the entire repository at once would blow up the context window.

**Solution:** Incremental conversion with progress tracking, one component at a time.

---

## Directory Structure

```
.bmad-conversion/
├── README.md              # This file
├── progress.json          # Machine-readable progress tracking
├── current-task.md        # What to work on next (READ THIS FIRST!)
├── completed/             # Saved copies of completed conversions
├── in-progress/           # Current work (if partially done)
└── notes/                 # Session notes and learnings
    └── session-YYYY-MM-DD-*.md
```

---

## Workflow

### Starting a New Session

1. **Read context:** `.claude/CLAUDE.md`
2. **Check current task:** `current-task.md`
3. **Review progress:** `progress.json`
4. **Read last session notes:** `notes/session-*.md`

### During Conversion

1. **Work on ONE item** (workflow OR agent)
2. **Use automation:** `convert-workflow.js` or `convert-agent.js`
3. **Manual enhancement:** Review and improve
4. **Test immediately:** Install and test in Claude Code
5. **Save progress:** Update `progress.json`

### Ending a Session

1. **Update progress.json:** Mark completion status
2. **Save to completed/:** Copy converted file
3. **Update current-task.md:** Write next task
4. **Create session notes:** Record learnings
5. **Commit if significant:** Git commit the progress

---

## Files

### progress.json

**Machine-readable progress tracking:**
- Overall completion percentages
- Lists of completed conversions
- Lists of pending tasks (P0, P1, P2)
- Next immediate tasks
- Automation tool references
- General notes

**Update after each conversion:**
```json
{
  "completed": {
    "workflows": [
      {
        "name": "workflow-name",
        "source": "src/...",
        "target": "claude-code-plugin/...",
        "completed_date": "2025-01-13",
        "priority": "P0",
        "tested": true,
        "notes": "Any important notes"
      }
    ]
  }
}
```

### current-task.md

**Human-readable next task definition:**
- What to work on next
- Why this task is important
- Source and target locations
- Conversion command to run
- Manual enhancement steps
- Success criteria
- What to do after completion
- Alternative tasks if blocked

**Always read this first when starting work!**

### completed/

**Saved copies of finished conversions:**
- Backup of converted files
- Named: `{workflow-or-agent-name}.md`
- Allows comparison with future changes
- Proof of completion

**Save after each conversion:**
```bash
cp claude-code-plugin/src/commands/phase-2/prd.md \
   .bmad-conversion/completed/prd-workflow.md
```

### in-progress/

**Partially completed work:**
- Use if conversion is interrupted
- Save state before ending session
- Resume next session from here

### notes/

**Session notes and learnings:**
- Format: `session-YYYY-MM-DD-topic.md`
- What was accomplished
- Time taken
- Issues encountered
- Learnings and insights
- Context for next session

---

## Priority System

### P0 - Critical (Convert First)
- **Workflows:** workflow-init, workflow-status, prd, architecture, create-epics-and-stories, dev-story
- **Agents:** Product Manager, Architect, Developer
- **Why:** Core functionality, critical path, most used

### P1 - High Priority
- **Workflows:** product-brief, epic-tech-context, create-story, story-context, code-review, story-ready, story-done, sprint-planning, tech-spec
- **Agents:** Test Engineer, Business Analyst, Scrum Master
- **Why:** Frequently used, important features

### P2 - Medium Priority
- **Workflows:** brainstorm-project, domain-research, research, document-project, validate-prd, validate-architecture
- **Agents:** UX Designer, Technical Writer
- **Why:** Less frequently used, optional features

---

## Automation Tools

### convert-workflow.js

**Location:** `claude-code-plugin/tools/convert-workflow.js`

**Usage:**
```bash
node claude-code-plugin/tools/convert-workflow.js \
  src/modules/bmm/workflows/path/to/workflow \
  claude-code-plugin/src/commands/phase-N/workflow-name.md
```

**What it does:**
- Reads workflow.yaml and instructions.md
- Converts XML tags to markdown
- Generates frontmatter
- Creates initial structure

**What you must do:**
- Review all conversions
- Fix any errors
- Add examples
- Enhance instructions
- Test thoroughly

### convert-agent.js

**Location:** `claude-code-plugin/tools/convert-agent.js`

**Usage:**
```bash
node claude-code-plugin/tools/convert-agent.js \
  src/modules/bmm/agents/agent-name.agent.yaml \
  claude-code-plugin/src/subagents/bmad-agent-name.md
```

**What it does:**
- Reads agent YAML
- Extracts persona and menu
- Generates basic structure
- Creates frontmatter

**What you must do:**
- Add detailed "When invoked for..." sections
- Create concrete examples
- Add quality standards
- Test via Task tool

---

## Testing Checklist

### After Each Workflow Conversion
- [ ] Frontmatter correct
- [ ] XML→markdown complete
- [ ] Variables reference config
- [ ] AskUserQuestion formatted correctly
- [ ] Examples added
- [ ] Install to ~/.claude/commands/bmad/
- [ ] Test in Claude Code
- [ ] Output files created correctly
- [ ] No runtime errors

### After Each Agent Conversion
- [ ] Frontmatter with subagent_type
- [ ] Persona preserved
- [ ] Instructions for each use case
- [ ] Examples provided
- [ ] Configuration section
- [ ] Install to ~/.claude/subagents/bmad/
- [ ] Test via Task tool
- [ ] Instructions clear and actionable

---

## Context Window Management

### Signs Context is Too Large
- Responses getting slower
- Token limit errors
- Difficulty maintaining focus
- Session > 150k tokens

### What to Do
1. Finish current conversion
2. Save all progress to .bmad-conversion/
3. Update current-task.md with exact next step
4. Create detailed session notes
5. End conversation
6. Start fresh, read .claude/CLAUDE.md first

---

## Quick Commands

```bash
# Check current task
cat .bmad-conversion/current-task.md

# See overall progress
cat .bmad-conversion/progress.json | grep -A 10 "overall_progress"

# List completed conversions
ls .bmad-conversion/completed/

# Read last session notes
ls -t .bmad-conversion/notes/ | head -1 | xargs -I {} cat .bmad-conversion/notes/{}

# Update progress (example)
# Edit progress.json manually or with jq
```

---

## Success Metrics

Track in progress.json:

- **Workflows:** X/22 completed (Y%)
- **Agents:** X/8 completed (Y%)
- **Skills:** X/7 completed (Y%)
- **Overall:** X% complete

**Target:** 100% of P0 components in 1 week

---

## Documentation References

**Must read every session:**
- `.claude/CLAUDE.md` - Session context and patterns
- `.bmad-conversion/current-task.md` - What to do next

**For reference:**
- `IMPLEMENTATION_GUIDE.md` - Detailed conversion patterns
- `CLAUDE_CODE_MIGRATION_PLAN.md` - Architecture decisions
- `PROGRESS_REPORT.md` - Overall status

**Examples:**
- `claude-code-plugin/src/commands/workflow-status.md` - Simple workflow
- `claude-code-plugin/src/commands/meta/workflow-init.md` - Complex workflow
- `claude-code-plugin/src/subagents/bmad-pm.md` - Agent

---

## Git Strategy

### When to Commit

**After each completed conversion:**
```bash
git add .bmad-conversion/
git add claude-code-plugin/src/{commands,subagents}/
git commit -m "Convert {workflow-or-agent-name} to Claude Code native

- Automated conversion + manual enhancement
- Tested: {yes/no}
- Priority: {P0/P1/P2}
- Notes: {any important notes}
"
```

**After each session:**
```bash
git add .bmad-conversion/
git commit -m "Update conversion progress - {date}

Session summary:
- Converted: {list}
- Next: {next task}
- Overall: {percentage}% complete
"
```

---

## Troubleshooting

### Automation Script Fails
- Check source file exists
- Verify target directory exists (create if needed)
- Review error message
- Run with node debug flag: `node --inspect-brk ...`

### Conversion Doesn't Work
- Review XML→markdown transformation
- Check variable references
- Validate frontmatter YAML
- Test in isolated Claude Code instance

### Can't Find Files
- Use `find` command: `find . -name "workflow.yaml"`
- Check IMPLEMENTATION_GUIDE.md for paths
- Review source structure in current BMAD

### Progress Lost
- Check .bmad-conversion/ directory
- Review git history: `git log --oneline`
- Look for session notes
- Check completed/ folder

---

## Remember

**One conversion at a time**
**Save progress frequently**
**Test before marking complete**
**Update current-task.md for next session**

**The goal is steady progress, not speed.**

---

**Status:** Foundation complete, ready for incremental conversion
**Next:** See `current-task.md`
