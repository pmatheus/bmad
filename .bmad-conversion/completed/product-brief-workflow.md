# Product Brief Workflow - Conversion Complete

**Completed:** 2025-01-13
**Source:** `src/modules/bmm/workflows/1-analysis/product-brief/`
**Target:** `claude-code-plugin/src/commands/phase-1/product-brief.md`
**Priority:** P1
**Lines:** ~1,200 lines (converted from 524-line source + template)

## Summary

Intent-driven conversational product vision workflow that adapts to project context.

**Key Features:**
- Living document approach (writes continuously)
- Context-adaptive (hobby, startup, enterprise)
- Discovery-focused (natural conversation, not interrogation)
- Stories over demographics (specific user situations)
- Ruthless MVP scoping (challenges feature creep)
- Only what emerges (no template bloat)
- Document reflects their world (not rigid template)

## Source Complexity

**Original workflow:**
- 524 lines (instructions.md)
- Additional template file
- Highly conversational and adaptive
- Intent-driven facilitation (not template-filling)
- Multiple context dimensions (market, financial, technical, organizational)
- Living document approach (write continuously)
- Sharded document support

**Conversion approach:**
- Converted all XML steps to markdown
- Preserved intent-driven conversation flow
- Maintained context-adaptive approach
- Documented all context dimensions
- Created 3 comprehensive examples (hobby, startup, enterprise)
- Preserved "only what emerges" philosophy
- Maintained living document approach

## Conversion Notes

- Converted 524-line complex conversational workflow to ~1,200 lines
- Preserved all 10 steps of discovery process
- Maintained intent-driven facilitation approach
- Context dimensions documented (only explore what emerges)
- Living document approach preserved
- 3 comprehensive examples showing different project types
- Troubleshooting guide
- Related workflows navigation

## Key Patterns

**1. Intent-Driven Facilitation:**
- Adapt organically to what emerges
- Don't force template sections
- Follow natural flow of conversation
- Explore what matters, skip what doesn't

**2. Living Document:**
- Write continuously throughout conversation
- Capture insights immediately
- Build document section by section
- Don't wait until end

**3. Context-Adaptive:**
- Hobby: Light, fun, simple
- Startup: Market-focused, metrics-driven, ruthless scoping
- Enterprise: Strategic alignment, stakeholder management, compliance

**4. Stories Over Demographics:**
- Push beyond generic personas
- Specific situations, frustrations, workflows
- "Sales reps who waste 2 hours/day on data entry" not "busy professionals"

**5. Discovery Over Interrogation:**
- Natural conversation, not questionnaire
- "Walk me through..." not "What is..."
- Listen for depth cues
- Adapt questions based on responses

**6. Ruthless MVP Scoping:**
- Challenge feature creep relentlessly
- Core vs nice-to-have vs future
- "Do we need that for launch?"

**7. Only What Emerges:**
- Skip sections that don't matter
- Financial analysis for hobby? Skip.
- Market sizing for internal tools? Skip.

## Testing Status

- [ ] Not yet tested in Claude Code
- [ ] Needs installation to ~/.claude/
- [ ] Should test standalone mode
- [ ] Should test workflow mode
- [ ] Should test hobby project flow
- [ ] Should test startup project flow
- [ ] Should test enterprise project flow
- [ ] Should verify living document approach works
- [ ] Should test context-adaptive conversation

## Related Files

**Workflows:**
- Depends on: workflow-init (optional, for workflow mode)
- Depends on: research (optional, for additional context)
- Leads to: prd (RECOMMENDED next step for Level 2+)

**Source files (old):**
- workflow.yaml
- instructions.md (524 lines)
- template.md
- checklist.md

**Output files (new):**
- product-brief.md (command)

## Notes

**This is a UNIQUE workflow:**
- Only workflow that's purely conversational and intent-driven
- Only workflow that explicitly adapts to hobby/startup/enterprise contexts
- Only workflow with "living document" approach (writes continuously)
- Only workflow that skips irrelevant sections ("only what emerges")
- Only workflow that challenges feature creep during scoping

**Unique features:**
- Intent-driven facilitation (not template-filling)
- Context-adaptive conversation (3 project types)
- Living document (write continuously, not at end)
- Discovery over interrogation (natural flow)
- Stories over demographics (specific situations)
- Ruthless MVP scoping (challenges creep)
- Only what emerges (no template bloat)

**Usage pattern:**
- Level 2+ projects (significant features, strategic planning)
- Optional but valuable for clarifying vision
- Recommended before PRD workflow
- Can enhance any project with strategic clarity

**Document output varies:**
- Hobby projects: 2-3 pages (problem/solution/features)
- Startup ventures: 5-7 pages (+ market analysis, metrics)
- Enterprise initiatives: 10+ pages (+ strategic context)
