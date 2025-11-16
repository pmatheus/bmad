# Workflow Continuation Logic Template

## Pattern to Add to All Workflows

Add this section at the end of each workflow, before the "Notes" or "Related Workflows" section:

```markdown
### Step N: Auto-Continue or Report Next Steps

**Purpose:** Enable seamless workflow continuation when possible.

**Process:**

1. **Update Workflow Status** (if not standalone mode):
   - Read `{output_folder}/bmm-workflow-status.yaml`
   - Update this workflow's status to completed file path
   - Save file, preserving structure

2. **Determine Next Workflow:**
   - Read workflow status to find next required workflow
   - Identify the first workflow with status that is NOT a file path and NOT "skipped"

3. **Check Prerequisites:**
   ```
   For next workflow, verify:
   - Required input files exist
   - Configuration present
   - No user input needed for basic execution
   ```

4. **Decision Logic:**

   **IF** next workflow can auto-continue (all prerequisites met, no user input needed):
   ```
   ✅ {Current Workflow} Complete!

   Created: {list of files}

   🚀 Auto-continuing to next workflow: {next_workflow_name}

   [Execute next workflow by invoking slash command]
   Use SlashCommand tool with: {next_command_path}
   ```

   **ELSE IF** next workflow needs user input:
   ```
   ✅ {Current Workflow} Complete!

   Created: {list of files}

   📋 Next Workflow: {next_workflow_name}

   This workflow requires:
   - {list of user decisions needed}
   - {list of custom inputs}

   To continue, run: {next_command_path}
   ```

   **ELSE IF** workflow sequence complete:
   ```
   ✅ {Current Workflow} Complete!

   Created: {list of files}

   🎉 Workflow sequence complete!

   Your project is ready for: {next phase description}

   To check status: /bmad:workflow-status
   ```

5. **CRITICAL: DO NOT ask user permission** to continue if all prerequisites are met.
   Just continue automatically.

6. **CRITICAL: DO NOT pause** for user acknowledgment between workflows.
   Only pause when user input is genuinely needed.
```

---

## Workflows That Can Auto-Continue

These workflows typically DON'T need user input and can auto-continue:

- `/bmad:phase-2:create-epics-and-stories` → `/bmad:phase-4:sprint-planning`
  - Prerequisites: epics.md exists
  - No user input needed

- `/bmad:phase-4:sprint-planning` → `/bmad:phase-4:epic-tech-context` (if epic-tech-context needed)
  - Prerequisites: sprint-status.yaml exists
  - No user input needed

- `/bmad:phase-4:story-context` → `/bmad:phase-4:dev-story`
  - Prerequisites: story context generated
  - No user input needed (dev agent works autonomously)

- `/bmad:phase-4:dev-story` → `/bmad:phase-4:code-review` (after story complete)
  - Prerequisites: story implementation complete
  - No user input needed

---

## Workflows That NEED User Input

These workflows typically require user decisions and should NOT auto-continue:

- `/bmad:meta:workflow-init` → (user selects track, optional workflows)
  - Needs: Project name, track selection, optional workflow choices

- `/bmad:phase-2:prd` → (user participates in discovery)
  - Needs: Product vision, requirements, scope decisions

- `/bmad:phase-3:architecture` → (user makes tech stack decisions)
  - Needs: Technology choices, architectural decisions

- `/bmad:phase-4:epic-tech-context` → (user may provide epic-specific constraints)
  - Needs: Optional technical constraints, architecture decisions for epic

---

## Example: Auto-Continue from create-epics-and-stories to sprint-planning

**In `/bmad:phase-2:create-epics-and-stories.md`, add:**

```markdown
### Step 7: Auto-Continue to Sprint Planning

After creating epics and stories:

1. **Update workflow status:**
   - Mark create-epics-and-stories as complete
   - Set status to epics.md file path

2. **Check next workflow:**
   - Next required: sprint-planning

3. **Check prerequisites:**
   - epics.md exists? ✓
   - User input needed? ✗ (sprint-planning auto-generates tracking)

4. **Auto-continue:**
   ```
   ✅ Epics and Stories Created!

   Created: {output_folder}/epics.md
   - {X} epics defined
   - {Y} stories created

   🚀 Auto-continuing to sprint planning...

   [Execute /bmad:phase-4:sprint-planning]
   ```

5. **Execute next workflow:**
   Use SlashCommand tool with command "/bmad:phase-4:sprint-planning"
```

---

## Example: Pause for User Input from PRD

**In `/bmad:phase-2:prd.md`, add:**

```markdown
### Step 6: Report Completion (No Auto-Continue)

PRD workflow involves extensive user collaboration, so we don't auto-continue.

1. **Update workflow status:**
   - Mark prd as complete
   - Set status to PRD.md file path

2. **Report to user:**
   ```
   ✅ PRD Complete!

   Created: {output_folder}/PRD.md

   📋 Next Workflows (run in order):

   1. /bmad:phase-3:architecture - Define technical architecture
   2. /bmad:phase-2:create-epics-and-stories - Break down requirements

   💡 Tip: Architecture can be run before or after epic breakdown, depending on preference.

   To check your progress: /bmad:workflow-status
   ```

3. **Do NOT auto-continue** - user may want to review PRD first
```

---

## Testing Auto-Continuation

After implementing continuation logic, test with these scenarios:

**Test 1: Full Sequence**
```bash
/bmad:meta:workflow-init
# Should pause for user input

# After init, run:
/bmad:phase-2:prd
# Should pause after PRD (user collaboration needed)

# After PRD, run:
/bmad:phase-2:create-epics-and-stories
# Should AUTO-CONTINUE to sprint-planning ✓

# sprint-planning completes:
# Should AUTO-CONTINUE to epic-tech-context or create-story ✓
```

**Test 2: Story Implementation Flow**
```bash
/bmad:phase-4:story-context
# Should AUTO-CONTINUE to dev-story ✓

# dev-story completes:
# Should AUTO-CONTINUE to code-review ✓

# code-review completes:
# Should pause (user may want to review findings)
```

**Test 3: Blocked Continuation**
```bash
/bmad:phase-4:create-story
# Creates story-1.1.md
# Should mark story as "drafted", NOT auto-continue to dev-story
# (because story needs to be marked "ready" first)
```

---

## Implementation Checklist

- [ ] Add continuation logic to workflow-init
- [ ] Add continuation logic to prd (pause for user)
- [ ] Add continuation logic to create-epics-and-stories (auto-continue)
- [ ] Add continuation logic to architecture (pause for user)
- [ ] Add continuation logic to sprint-planning (auto-continue)
- [ ] Add continuation logic to epic-tech-context (auto-continue)
- [ ] Add continuation logic to create-story (pause - story needs ready)
- [ ] Add continuation logic to story-context (auto-continue to dev-story)
- [ ] Add continuation logic to dev-story (auto-continue to code-review)
- [ ] Add continuation logic to code-review (pause for user review)
- [ ] Add continuation logic to story-done (auto-continue to next story?)
- [ ] Test full workflow sequences
- [ ] Verify no unwanted pauses
- [ ] Verify pauses where user input needed

---

*Template Version: 1.0*
*Date: 2025-11-15*
