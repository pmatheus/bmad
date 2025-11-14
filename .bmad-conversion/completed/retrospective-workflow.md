# Retrospective Workflow Conversion - COMPLETE

**Conversion Date:** 2025-01-14
**Priority:** P2 (Medium - Optional)
**Status:** ✅ Complete

## Source Files

- `src/modules/bmm/workflows/4-implementation/retrospective/workflow.yaml`
- `src/modules/bmm/workflows/4-implementation/retrospective/instructions.md`

## Target Files

- `claude-code-plugin/src/commands/phase-4/retrospective.md` (1,457 lines)

## Conversion Summary

Successfully converted the **retrospective workflow** from XML/YAML format to Claude Code native markdown command format.

### Workflow Characteristics

**Type:** Interactive Party Mode retrospective facilitation
**Complexity:** Very High (12 steps, multi-agent conversation simulation)
**Agent Used:** Scrum Master (facilitating), plus full team (PM, Architect, Dev, QA, etc.)

### Key Features Converted

**1. Epic Discovery and Verification**
- Smart epic detection from sprint-status.yaml
- Handles partial epic completion (warns user)
- Fallback to user input if detection fails

**2. Deep Story Analysis**
- Reads ALL story files for the completed epic
- Extracts dev notes, review feedback, lessons learned, technical debt
- Synthesizes patterns across stories (common struggles, breakthroughs)
- Identifies recurring issues that appeared in 2+ stories

**3. Previous Retrospective Integration (Accountability Loop)**
- Loads previous epic's retrospective
- Checks follow-through on action items (✅ Completed, ⏳ In Progress, ❌ Not Addressed)
- Creates continuity and learning loop
- Prevents repeating mistakes

**4. Next Epic Preview**
- Loads next epic definition (sharded or whole document)
- Analyzes dependencies on completed epic
- Identifies preparation gaps and prerequisites
- Helps team prepare properly before starting next work

**5. Party Mode Team Discussion**
- Natural multi-agent conversation
- User actively participates (not observer)
- Authentic team dynamics (disagreements, emotions)
- Scrum Master maintains psychological safety (no blame)
- Format: `Name (Role): dialogue`

**6. Significant Change Detection**
- Actively checks if Epic N discoveries affect Epic N+1 plan
- Flags architectural assumption violations
- Triggers epic review session if needed
- Prevents starting next epic on wrong assumptions

**7. Action Item Synthesis**
- SMART criteria (Specific, Measurable, Achievable, Relevant, Time-bound)
- Clear owners, timelines, success criteria
- Categories: process, technical debt, documentation, team agreements

**8. Next Epic Preparation Planning**
- Technical setup, knowledge gaps, refactoring needs
- Critical vs parallel vs nice-to-have categorization
- Realistic effort estimation
- Balances business pressure vs technical reality

**9. Critical Readiness Exploration**
- Verifies testing, deployment, stakeholder acceptance, stability
- Don't assume "done" means truly ready
- Surfaces blockers before moving forward
- Adds critical path items as needed

**10. Retrospective Document Generation**
- Comprehensive markdown summary
- Saved to `.bmad/sprint-artifacts/epic-{N}-retro-{date}.md`
- Updates sprint-status.yaml to mark retro as "done"

### Conversion Approach

**XML → Markdown Transformations:**
- `<step n="1" goal="...">` → `### Step 1: {goal}`
- `<action>` → Markdown bullet points or paragraphs
- `<ask>` → AskUserQuestion tool usage
- `<check if="...">` → **If condition:** blocks
- `<output>` → Party Mode dialogue blocks
- `{variable}` → Read from `.bmad/config.yaml` or detect dynamically

**Party Mode Dialogue:**
- All agent dialogue preserved in format: `Name (Role): dialogue`
- Example: `Bob (Scrum Master): "Welcome to the retrospective..."`
- Creates authentic team conversation
- User prompted with: `{user_name} (Project Lead): [Participating]`

**Key Workflow Logic:**
- 12 major steps converted from XML to sequential markdown instructions
- Conditional logic preserved (If epic incomplete, If next epic exists, etc.)
- Multiple user interaction points ("WAIT for user" moments)
- Synthesis of patterns, action items, readiness assessment

### Examples Provided

**Example 1:** Standard Epic Retrospective
- 5 stories completed, next epic planned
- Team discussion of successes/challenges
- 6 action items generated
- 10 hours prep work identified

**Example 2:** Retrospective with Significant Discovery
- Architectural assumption violated during epic
- Significant change detection triggered
- Epic review session scheduled
- Prevented building on broken foundation

**Example 3:** Partial Retrospective (Epic Not Fully Complete)
- 4/6 stories done, user wants to proceed
- Warnings about limitations documented
- Team aware of potential gaps
- May need follow-up retro after remaining stories

### File Locations

**Sprint Status:** `.bmad/sprint-artifacts/sprint-status.yaml`
**Story Files:** `.bmad/sprint-artifacts/{epic_number}-{story_number}-*.md`
**Epic Files:** `{output_folder}/*epic*/epic-{epic_number}.md` (sharded) or `{output_folder}/*epic*.md` (whole)
**Previous Retro:** `.bmad/sprint-artifacts/epic-{prev_epic_num}-retro-*.md`
**Output Retro:** `.bmad/sprint-artifacts/epic-{epic_number}-retro-{YYYY-MM-DD}.md`

### Testing Status

**Manual Testing:** Not yet tested
**Validation:** Structure validated, needs real epic data to test

### Notes

**Party Mode is central:**
- All agent dialogue uses "Name (Role): dialogue" format
- User is active participant throughout
- Facilitator (Scrum Master) maintains psychological safety

**Deep story analysis critical:**
- Don't skip reading ALL story files
- Extract patterns, not just individual lessons
- Synthesize recurring themes

**Accountability loop:**
- Previous retro integration creates continuity
- Checks follow-through on commitments
- Learning loop prevents repeating mistakes

**Change detection prevents misalignment:**
- Catches when Epic N discoveries invalidate Epic N+1 assumptions
- Forces epic review before proceeding
- Critical for maintaining architectural integrity

**Readiness exploration prevents premature next epic:**
- "Done" in sprint-status ≠ truly ready
- Verify testing, deployment, acceptance, stability
- Surface concerns before committing to next epic

### Success Criteria

- ✅ All 12 steps converted from XML to markdown
- ✅ Party Mode dialogue preserved
- ✅ Conditional logic maintained
- ✅ User interaction points preserved
- ✅ File I/O logic converted (Read/Write tools)
- ✅ 3 comprehensive examples provided
- ✅ Troubleshooting section included
- ✅ Output files documented

### Estimated Conversion Time

~1 hour

### Actual Conversion Time

~1 hour

### Complexity Rating

9/10 (Very High)
- Most complex P2 workflow
- 12 steps with deep logic
- Party Mode simulation
- Multiple analysis phases
- Significant change detection
- Used frequently (after every epic)

### Priority Justification (P2 → High Value)

While labeled P2 (optional), retrospective is actually **high value**:
- Used after EVERY epic completion
- Creates learning loop and continuous improvement
- Prevents repeating mistakes
- Ensures team readiness before next epic
- Catches architectural misalignments early

**Recommendation:** Should be considered essential for teams serious about learning and improvement.

---

**Conversion Quality:** High
**Documentation Quality:** Comprehensive
**Ready for Testing:** Yes
**Ready for Production Use:** Needs validation with real epic data
