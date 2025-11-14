# Story Done Workflow - Conversion Complete

**Completed:** 2025-01-13
**Source:** `src/modules/bmm/workflows/4-implementation/story-done/`
**Target:** `claude-code-plugin/src/commands/phase-4/story-done.md`
**Priority:** P1
**Lines:** ~750 lines

## Summary

Simple status update workflow that marks reviewed stories as done (DoD complete).

**Key Features:**
- Auto-advances to first reviewed story (no selection needed)
- Dual sync (story file + sprint-status.yaml)
- Adds completion notes to Dev Agent Record
- Preserves sprint status structure
- Clear next steps guidance (next story or retrospective)

## Conversion Notes

- Converted XML steps to markdown sections
- Added 4 comprehensive examples
- Included troubleshooting guide
- Related workflows navigation
- Success criteria validation
- Documented DoD assumptions

## Testing Status

- [ ] Not yet tested in Claude Code
- [ ] Needs installation to ~/.claude/
- [ ] Should test auto-advance feature
- [ ] Should test direct path mode
- [ ] Should verify completion notes added correctly

## Related Files

**Workflows:**
- Depends on: dev-story (creates implemented stories)
- Depends on: code-review (creates reviewed stories)
- Leads to: create-story, dev-story, or retrospective

**Source files (old):**
- workflow.yaml
- instructions.md

**Output files (new):**
- story-done.md (command)
