# BMAD Workflow Fixes - Analysis & Solutions

## Issues Identified

### 🔴 CRITICAL ISSUE #1: Incorrect Slash Command Paths

**Problem:** All workflow documentation uses incorrect slash command syntax.

**Current (WRONG):**
- `/bmad/workflow-init`
- `/bmad/prd`
- `/bmad/dev-story`
- `/bmad/create-epics-and-stories`

**Correct Format:**
- `/bmad:meta:workflow-init`
- `/bmad:phase-2:prd`
- `/bmad:phase-4:dev-story`
- `/bmad:phase-2:create-epics-and-stories`

**Impact:** Users and AI are told to run commands that don't exist, causing workflow failures.

**Files Affected:** Nearly ALL command files that reference other commands.

**Pattern:**
```
commands/{directory}/{command}.md → /bmad:{directory}:{command}

Special case:
commands/workflow-status.md → /bmad:workflow-status
```

---

### 🟡 ISSUE #2: Agent "Auto-Invoke" Descriptions are Misleading

**Problem:** Agent descriptions say "Auto-invoked" which might cause confusion about when agents are called.

**Example:**
```markdown
description: Product Manager agent for PRD creation, requirements gathering, and epic breakdown. Auto-invoked when working with product planning or PRD workflows.
```

**Reality:** Agents are NOT auto-invoked by the system. They must be explicitly called via the Task tool with `subagent_type`.

**Impact:** Minimal - just confusing documentation. But could cause AI to wait for auto-invocation that never happens.

**Recommendation:** Change "Auto-invoked" to "Use this agent" for clarity.

---

### 🟠 ISSUE #3: Missing Explicit Continuation Instructions

**Problem:** Workflows don't have clear "CONTINUE AUTOMATICALLY" instructions when all prerequisites are met.

**Current Pattern:**
```markdown
### Step 5: Present Results and Ask User

Show the user what was created and ask what they want to do next.
```

**Better Pattern:**
```markdown
### Step 5: Update Status and Continue

After completing this workflow:

1. Update workflow status file
2. Determine next workflow from sequence
3. IF next workflow has all prerequisites met:
   - Automatically run next workflow
   - DO NOT ask user for permission
4. ELSE IF next workflow needs user input:
   - Inform user what's needed
   - Prompt for missing information
5. ELSE:
   - Report completion
   - Suggest next command
```

**Impact:** Workflows pause unnecessarily even when they could continue automatically, causing the "hangs with clear next steps" issue.

---

### 🟠 ISSUE #4: No Workflow Sequence Auto-Execution

**Problem:** After completing one workflow, there's no mechanism to automatically continue to the next in sequence.

**Example Flow:**
1. User runs `/bmad:phase-2:prd`
2. PRD completes successfully
3. Workflow says "Next: Run `/bmad:phase-3:architecture`"
4. **STOPS and waits for user**

**Better Flow:**
1. User runs `/bmad:phase-2:prd`
2. PRD completes successfully
3. Workflow checks: Does architecture have all prerequisites?
   - Config exists ✓
   - PRD exists ✓
   - No user input needed ✓
4. **Automatically runs architecture workflow**
5. Architecture completes
6. Continues to next workflow...

**Impact:** User has to manually run each command, reducing automation benefits.

---

## Comprehensive Fix Plan

### Fix #1: Update All Slash Command References

**Action:** Search and replace all slash command references in all files.

**Search Pattern:** `/bmad/`
**Replace With:** `/bmad:{directory}:`

**Files to Update:**
- All files in `commands/cis/`
- All files in `commands/meta/`
- All files in `commands/phase-1/`
- All files in `commands/phase-2/`
- All files in `commands/phase-3/`
- All files in `commands/phase-4/`
- `commands/workflow-status.md`

**Special Cases:**
- `commands/workflow-status.md` references → `/bmad:workflow-status` (no directory prefix)

**Example Changes:**

**Before:**
```markdown
Run `/bmad/workflow-init` to set up project
Next step: `/bmad/prd`
```

**After:**
```markdown
Run `/bmad:meta:workflow-init` to set up project
Next step: `/bmad:phase-2:prd`
```

---

### Fix #2: Add Explicit Continuation Logic to All Workflows

**Action:** Add a standard "Auto-Continue" section to workflow instructions.

**Template to Add:**
```markdown
### Step N: Auto-Continue or Report

After completing this workflow:

**Determine next workflow:**
1. Read workflow status file to find next required workflow
2. Check prerequisites for next workflow

**Decision logic:**

IF next workflow needs NO user input AND all prerequisites met:
  → Automatically invoke next workflow using SlashCommand tool
  → DO NOT ask user permission
  → Report: "Continuing to next workflow: {workflow_name}"

ELSE IF next workflow needs user input OR missing prerequisites:
  → Report completion of current workflow
  → List what's needed for next workflow
  → Suggest command to run next

**Example:**
```markdown
✅ PRD Complete!

Created: .bmad/PRD.md

🚀 Auto-continuing to architecture...
[Automatically runs /bmad:phase-3:architecture]
```
OR
```markdown
✅ PRD Complete!

Created: .bmad/PRD.md

Next workflow: architecture
Prerequisites: ✓ All met
User input: ✗ Need tech stack preferences

Please run: /bmad:phase-3:architecture
```
```

**Workflows to Update:**
- `commands/meta/workflow-init.md`
- `commands/phase-1/brainstorm-project.md`
- `commands/phase-1/product-brief.md`
- `commands/phase-1/research.md`
- `commands/phase-2/prd.md`
- `commands/phase-2/create-epics-and-stories.md`
- `commands/phase-3/architecture.md`
- `commands/phase-4/sprint-planning.md`
- `commands/phase-4/epic-tech-context.md`
- `commands/phase-4/create-story.md`
- `commands/phase-4/story-context.md`
- `commands/phase-4/dev-story.md`
- `commands/phase-4/code-review.md`
- `commands/phase-4/story-done.md`

---

### Fix #3: Update Agent Descriptions

**Action:** Remove "Auto-invoked" language from agent descriptions.

**Before:**
```markdown
description: Product Manager agent for PRD creation, requirements gathering, and epic breakdown. Auto-invoked when working with product planning or PRD workflows.
```

**After:**
```markdown
description: Product Manager agent for PRD creation, requirements gathering, and epic breakdown. Use this agent for product planning and PRD workflows.
```

**Agents to Update:**
- `agents/bmad-pm.md`
- `agents/bmad-analyst.md`
- `agents/bmad-architect.md`
- `agents/bmad-sm.md`
- `agents/bmad-tea.md`

---

### Fix #4: Add Workflow Sequence Detection

**Action:** Create a helper function pattern for workflows to detect and auto-continue.

**Add to workflow-status.md:**
```markdown
## Auto-Continue Mode (Service Mode)

**Purpose:** Enable workflows to automatically continue to next workflow in sequence.

**How to invoke:**
```
Use SlashCommand tool with parameters:
- mode: "auto-continue"
- completed_workflow: "prd"
```

**Returns:**
- `should_continue`: true/false
- `next_workflow`: Workflow ID
- `next_command`: Full slash command path
- `prerequisites_met`: true/false
- `needs_user_input`: true/false
- `blocking_reason`: Why continuation is blocked (if blocked)

**Behavior:**

IF should_continue is true:
  → Caller should automatically invoke next_command
  → No user permission needed

IF should_continue is false:
  → Caller should report completion and suggest next command
  → User must manually invoke next workflow
```

---

## Implementation Priority

### Phase 1: Critical Fixes (Do First)
1. ✅ Fix all slash command paths (ISSUE #1)
2. ✅ Add continuation logic to key workflows (ISSUE #3)

### Phase 2: Enhancement (Do Second)
3. ✅ Add auto-continue mode to workflow-status (ISSUE #4)
4. ✅ Update agent descriptions (ISSUE #2)

### Phase 3: Testing
5. Test workflow sequences end-to-end
6. Verify auto-continuation works
7. Ensure no unwanted pauses

---

## Command Path Mapping Reference

| File Location | Correct Slash Command |
|---------------|----------------------|
| `commands/workflow-status.md` | `/bmad:workflow-status` |
| `commands/meta/workflow-init.md` | `/bmad:meta:workflow-init` |
| `commands/cis/design-thinking.md` | `/bmad:cis:design-thinking` |
| `commands/cis/innovation-strategy.md` | `/bmad:cis:innovation-strategy` |
| `commands/cis/problem-solving.md` | `/bmad:cis:problem-solving` |
| `commands/cis/storytelling.md` | `/bmad:cis:storytelling` |
| `commands/phase-1/brainstorm-project.md` | `/bmad:phase-1:brainstorm-project` |
| `commands/phase-1/document-project.md` | `/bmad:phase-1:document-project` |
| `commands/phase-1/domain-research.md` | `/bmad:phase-1:domain-research` |
| `commands/phase-1/product-brief.md` | `/bmad:phase-1:product-brief` |
| `commands/phase-1/research.md` | `/bmad:phase-1:research` |
| `commands/phase-2/create-epics-and-stories.md` | `/bmad:phase-2:create-epics-and-stories` |
| `commands/phase-2/prd.md` | `/bmad:phase-2:prd` |
| `commands/phase-2/tech-spec.md` | `/bmad:phase-2:tech-spec` |
| `commands/phase-3/architecture.md` | `/bmad:phase-3:architecture` |
| `commands/phase-4/code-review.md` | `/bmad:phase-4:code-review` |
| `commands/phase-4/create-story.md` | `/bmad:phase-4:create-story` |
| `commands/phase-4/dev-story.md` | `/bmad:phase-4:dev-story` |
| `commands/phase-4/epic-tech-context.md` | `/bmad:phase-4:epic-tech-context` |
| `commands/phase-4/retrospective.md` | `/bmad:phase-4:retrospective` |
| `commands/phase-4/security-test.md` | `/bmad:phase-4:security-test` |
| `commands/phase-4/sprint-planning.md` | `/bmad:phase-4:sprint-planning` |
| `commands/phase-4/story-context.md` | `/bmad:phase-4:story-context` |
| `commands/phase-4/story-done.md` | `/bmad:phase-4:story-done` |
| `commands/phase-4/story-ready.md` | `/bmad:phase-4:story-ready` |

---

## Next Steps

1. Review this analysis
2. Confirm fix approach
3. Apply fixes systematically
4. Test updated workflows
5. Verify auto-continuation behavior

---

*Generated: 2025-11-15*
*Version: 2.0.1-fixes*
