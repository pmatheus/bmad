# Tech-Spec Workflow - Conversion Complete

**Completed:** 2025-01-13
**Source:** `src/modules/bmm/workflows/2-plan-workflows/tech-spec/`
**Target:** `claude-code-plugin/src/commands/phase-2/tech-spec.md`
**Priority:** P1
**Lines:** ~1,100 lines (converted from 975-line source + templates)

## Summary

Comprehensive technical specification workflow for Quick Flow (Level 0-1) projects.

**Key Features:**
- Context-rich spec generation (docs, stack, brownfield analysis)
- Living document approach (writes continuously)
- Brownfield intelligence (detects patterns, conventions)
- Stack awareness (exact versions from package files)
- Starter template recommendations (greenfield)
- Validation built-in (definitiveness, completeness)
- Epic + story generation (1-5 stories)
- Context-rich stories (often eliminates need for story-context)

## Source Complexity

**Original workflow:**
- 975 lines (instructions.md)
- Additional templates (tech-spec, epic, story)
- Complex context discovery
- Multiple phases (docs, stack, brownfield, requirements)
- Story generation sub-workflow
- Validation logic

**Conversion approach:**
- Converted all XML steps to markdown
- Preserved all 3 phases of context discovery
- Maintained brownfield reconnaissance logic
- Integrated validation criteria
- Added delegation to bmad-pm for story generation
- Created 3 comprehensive examples

## Conversion Notes

- Converted 975-line complex workflow to ~1,100 lines
- Preserved all context discovery phases
- Maintained brownfield intelligence
- Stack detection and analysis preserved
- Starter template recommendation flow included
- Validation criteria documented
- Story generation delegated to bmad-pm subagent
- 3 comprehensive examples (greenfield, brownfield, starter template)
- Troubleshooting guide
- Related workflows navigation

## Key Patterns

**1. Context Discovery (3 Phases):**
- Phase 1: Load existing documents (product brief, research, brownfield docs)
- Phase 2: Detect project stack (exact versions, dependencies)
- Phase 3: Brownfield reconnaissance (patterns, conventions, modules)

**2. Living Document:**
- Write to tech-spec.md continuously (not at end)
- Capture decisions in real-time

**3. Brownfield Intelligence:**
- Detect code style (semicolons, quotes, indentation)
- Detect test patterns (naming, organization, frameworks)
- Detect conventions (error handling, logging, docs)
- Confirm with user before conforming

**4. Definitiveness:**
- Always exact versions ("React 18.2.0" not "latest React")
- Specific file paths (not generic descriptions)
- No ambiguous language ("maybe", "could", "probably")

**5. Validation:**
- Context gathering score
- Definitiveness score
- Brownfield integration score
- Stack alignment score
- Implementation readiness check

## Testing Status

- [ ] Not yet tested in Claude Code
- [ ] Needs installation to ~/.claude/
- [ ] Should test standalone mode
- [ ] Should test workflow mode
- [ ] Should test greenfield path
- [ ] Should test brownfield path
- [ ] Should test starter template recommendation
- [ ] Should test story generation (1 story vs multiple)
- [ ] Should verify delegation to bmad-pm works

## Related Files

**Workflows:**
- Depends on: workflow-init (optional, for workflow mode)
- Depends on: product-brief (optional, for additional context)
- Depends on: document-project (optional, tech-spec does brownfield analysis)
- Leads to: dev-story (direct implementation)
- Leads to: sprint-planning (optional, for multiple stories)

**Subagents:**
- Uses: bmad-pm (for story generation in Step 5)

**Source files (old):**
- workflow.yaml
- instructions.md (975 lines)
- tech-spec-template.md
- epics-template.md
- user-story-template.md
- instructions-generate-stories.md
- checklist.md

**Output files (new):**
- tech-spec.md (command)

## Notes

**This is a CRITICAL workflow:**
- Primary workflow for Level 0-1 (Quick Flow) projects
- Replaces PRD + Architecture for simple projects (1-5 stories)
- Context-rich enough to skip story-context workflow
- Brownfield intelligence makes it extremely valuable for existing codebases
- Living document approach prevents forgetting details
- Validation ensures high quality output

**Unique features:**
- Only workflow that does comprehensive brownfield reconnaissance
- Only workflow that detects and conforms to existing conventions
- Only workflow that recommends starter templates
- Only workflow with built-in validation logic
- Context-rich stories often eliminate need for story-context

**Usage pattern:**
- Level 0-1 projects (1-5 stories)
- Bug fixes, small features, isolated changes
- Brownfield additions (respects existing patterns)
- Greenfield quick starts (with starter templates)
