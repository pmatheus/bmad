---
description: Automate complete story lifecycle (create-story → story-context → dev-story → code-review → story-done) until context depleted, using parallel subagents for maximum throughput
---

# Bring to Life - Automated Story Development Workflow

Automates the complete story development lifecycle for all stories in all sprints until the main agent's context window is depleted to less than 20%, **using parallel subagent execution** for maximum productivity.

## What This Does

This workflow creates a **fully automated development pipeline** that:

- **Runs multiple stories in parallel** using independent subagents
- Coordinates via file-based state management (sprint-status.yaml)
- For each story: create-story → story-context → dev-story → code-review → story-done
- Monitors context window usage across all parallel executions
- Saves progress when context drops below 20%
- Provides resumption instructions for the user

**Key Principle:** **Parallel Autonomous Development** - Maximizes productivity by running multiple story lifecycles concurrently, coordinated through file-based state locks until context constraints require a pause.

## Prerequisites

- [ ] BMAD plugin installed in Claude Code
- [ ] Project initialized (`/bmad:meta:workflow-init`)
- [ ] Epics created (`/bmad:phase-2:create-epics-and-stories`)
- [ ] Sprint planning run (`/bmad:phase-4:sprint-planning`)
- [ ] At least one story in backlog status

**Required files:**
- `.bmad/config.yaml` - Project configuration
- `.bmad/sprint-artifacts/sprint-status.yaml` - Story tracking
- `.bmad/epics.md` OR `.bmad/epics/epic-{N}.md` - Epic files with stories

## How It Works

### Parallel Story Development Loop

**Main orchestrator launches multiple subagent workers in parallel:**

```
WHILE context > 20%:
  1. Find next N backlog stories (where N = available parallelism, typically 2-4)
  2. Launch N parallel subagents, each executing complete story lifecycle:
     - Worker 1: Story A (create → context → dev → review → done)
     - Worker 2: Story B (create → context → dev → review → done)
     - Worker 3: Story C (create → context → dev → review → done)
     - Worker 4: Story D (create → context → dev → review → done)
  3. Workers coordinate via sprint-status.yaml file locks
  4. Each worker marks story as "locked-{worker_id}" during work
  5. Monitor all workers, collect completion reports
  6. Aggregate completed stories count
  7. Check context window
  8. IF context < 20%: Save progress, pause, notify user
  9. ELSE: Launch next batch of parallel workers
```

### File-Based Coordination

**sprint-status.yaml serves as coordination mechanism:**

```yaml
development_status:
  1-3-password-reset: "locked-worker-1"  # Worker 1 processing
  1-4-mfa-setup: "locked-worker-2"       # Worker 2 processing
  2-1-profile: "locked-worker-3"         # Worker 3 processing
  2-2-settings: "backlog"                # Available for next worker
```

**Lock protocol:**
1. Worker claims story: backlog → locked-{worker_id}
2. Worker completes lifecycle
3. Worker updates final status: locked-{worker_id} → done
4. Other workers skip locked stories

**Collision avoidance:**
- Each worker reads sprint-status.yaml before claiming
- Atomic file operations (read-modify-write with retry)
- Workers skip stories already locked by others
- Main orchestrator detects deadlocks (no progress after N attempts)

### Context Window Monitoring

**Check after each story completion:**
- Current context usage (tokens used / total tokens)
- Remaining context percentage
- If < 20% remaining → Save progress and pause

### Progress Saving

When context drops below 20%:
1. Update sprint-status.yaml with current story states
2. Create progress checkpoint: `.bmad/sprint-artifacts/bring-to-life-checkpoint.md`
3. Log completed stories count
4. Log remaining stories count
5. Provide clear resumption instructions

## Instructions

### ⚠️ CRITICAL: Parallel Execution Philosophy

**Before executing any step, think hard about what needs to be sequential vs. what can be done in parallel.**

**Rule:** If operations CAN be done in parallel, you MUST spawn the appropriate subagents in a SINGLE command.

**Why this matters:**
- Single message with multiple Task calls = **True parallel execution** (workers get isolated contexts)
- Multiple messages with Task calls = **Sequential execution** (workers run one after another)

**Example - Correct parallel execution:**
```xml
<!-- ✅ ONE message containing 4 Task calls -->
<!-- This spawns 4 independent workers with isolated contexts executing concurrently -->

<function_calls>
<invoke name="Task">
  <parameter name="subagent_type">bmad:bmad-dev</parameter>
  <parameter name="description">Story lifecycle worker 1</parameter>
  <parameter name="prompt">...</parameter>
</invoke>
<invoke name="Task">
  <parameter name="subagent_type">bmad:bmad-dev</parameter>
  <parameter name="description">Story lifecycle worker 2</parameter>
  <parameter name="prompt">...</parameter>
</invoke>
<invoke name="Task">
  <parameter name="subagent_type">bmad:bmad-dev</parameter>
  <parameter name="description">Story lifecycle worker 3</parameter>
  <parameter name="prompt">...</parameter>
</invoke>
<invoke name="Task">
  <parameter name="subagent_type">bmad:bmad-dev</parameter>
  <parameter name="description">Story lifecycle worker 4</parameter>
  <parameter name="prompt">...</parameter>
</invoke>
</function_calls>
```

**Example - Wrong sequential execution:**
```xml
<!-- ❌ WRONG: Separate messages - workers run one after another -->

<!-- Message 1 -->
<function_calls>
<invoke name="Task">Worker 1</invoke>
</function_calls>

<!-- Message 2 (after worker 1 completes) -->
<function_calls>
<invoke name="Task">Worker 2</invoke>
</function_calls>
```

**Remember:** Always ask yourself "Can these operations run in parallel?" If yes, launch all subagents in a single message.

---

### Step 1: Load Configuration and Verify Prerequisites

Read project configuration from `.bmad/config.yaml`:

```javascript
{
  output_folder: string,
  sprint_artifacts: string,
  user_name: string,
  bmad_folder: string
}
```

**Verify required files exist:**
- `.bmad/sprint-artifacts/sprint-status.yaml`
- `.bmad/epics.md` OR `.bmad/epics/epic-{N}.md`

**If prerequisites missing:**
```
⚠️ Prerequisites not met

Missing required files. Please run:
1. /bmad:meta:workflow-init (if config missing)
2. /bmad:phase-2:create-epics-and-stories (if epics missing)
3. /bmad:phase-4:sprint-planning (if sprint-status missing)
```
→ HALT

### Step 2: Initialize Progress Tracking

**Check for existing checkpoint:**

File: `.bmad/sprint-artifacts/bring-to-life-checkpoint.md`

**If checkpoint exists:**
- Read checkpoint file
- Extract last completed story
- Extract stories completed count
- Display: "Resuming from checkpoint: {stories_completed} stories done"

**If no checkpoint:**
- Initialize: `stories_completed = 0`
- Display: "Starting fresh bring-to-life workflow"

**Initialize context monitoring:**
- `initial_context_usage` = Current token usage
- `context_threshold` = 0.20 (20%)

### Step 3: Enter Parallel Development Loop

**Main loop with parallel worker orchestration:**

```
WHILE (remaining_context_percentage > 20%):

  # Step 3A: Find Next N Backlog Stories
  available_stories = find_available_backlog_stories(limit=4)

  IF available_stories is empty:
    # No more backlog stories
    BREAK

  parallelism = min(len(available_stories), 4)  # Max 4 parallel workers

  # Step 3B: Launch Parallel Workers
  workers = []
  FOR i in range(parallelism):
    story = available_stories[i]
    worker_id = f"worker-{i+1}"

    # Claim story with lock
    claim_story(story, worker_id)

    # Launch worker subagent in parallel
    worker = launch_worker_subagent(
      story_key=story.key,
      worker_id=worker_id,
      task_description=f"Execute complete story lifecycle for {story.key}"
    )
    workers.append(worker)

  # Step 3C: Wait for All Workers to Complete
  # Workers execute in parallel, main orchestrator monitors
  results = await_all_workers(workers)

  # Step 3D: Aggregate Results
  FOR result in results:
    IF result.status == "completed":
      stories_completed += 1
    ELIF result.status == "blocked":
      log_blocker(result.blocker)
      IF result.blocker.is_critical:
        # Critical blocker - halt entire workflow
        save_progress_checkpoint(stories_completed, blocker=result.blocker)
        RETURN

  # Step 3E: Check Context Window
  remaining_context_percentage = check_context_window()

  IF (remaining_context_percentage < 20%):
    save_progress_checkpoint(stories_completed)
    BREAK

  # Step 3F: Continue to next batch
  continue
```

### Step 3A: Find Available Backlog Stories (Parallel)

**Read sprint-status.yaml and find multiple unlocked stories:**

```yaml
development_status:
  1-3-password-reset: backlog      # ✅ Available
  1-4-mfa-setup: backlog           # ✅ Available
  2-1-profile: locked-worker-1     # ❌ Locked (skip)
  2-2-settings: backlog            # ✅ Available
  2-3-preferences: backlog         # ✅ Available
```

**Selection logic:**
```python
def find_available_backlog_stories(limit=4):
    stories = []
    sprint_status = read_sprint_status()

    for key, status in sprint_status['development_status'].items():
        # Skip epics and retrospectives
        if is_epic_or_retro(key):
            continue

        # Only select backlog stories (not locked)
        if status == "backlog":
            stories.append({
                'key': key,
                'epic': extract_epic(key),
                'story': extract_story(key)
            })

            if len(stories) >= limit:
                break

    return stories
```

**Returns:** List of up to N available backlog stories

**If no stories available:**
```
✅ All Stories Complete or In-Progress!

No more backlog stories available.
- All stories either complete, in-progress, or locked by workers

Check for worker completion...
```

### Step 3B: Launch Parallel Worker Subagents

**CRITICAL PARALLEL EXECUTION REQUIREMENT:**

Before launching workers, **think hard about what needs to be sequential vs. parallel:**

**SEQUENTIAL operations (must be done in order):**
- Reading sprint-status.yaml to find available stories
- Claiming stories with locks (per worker, but decision is sequential)
- Checking context window after batch completes
- Saving progress checkpoint

**PARALLEL operations (can be done concurrently):**
- ✅ **Story lifecycle execution** - Each story is independent
- ✅ **create-story** for different stories
- ✅ **story-context** for different stories
- ✅ **dev-story** for different stories (workers have isolated contexts)
- ✅ **code-review** for different stories
- ✅ **story-done** for different stories

**If operations CAN be done in parallel, you MUST spawn the appropriate subagents in a SINGLE command.**

**Use Task tool to launch multiple workers in a SINGLE message:**

This is CRITICAL - you must send ONE message containing multiple Task tool calls. This ensures Claude Code spawns workers as true parallel subagents with their own isolated contexts.

```python
# ⚠️ CRITICAL: All Task calls MUST be in a SINGLE message for true parallelism
# Each worker gets its own isolated context and executes concurrently

# DO THIS (correct - parallel):
# Send one message with 4 Task calls
Task(subagent_type="bmad:bmad-dev", description="Story lifecycle worker 1", prompt="""...""")
Task(subagent_type="bmad:bmad-dev", description="Story lifecycle worker 2", prompt="""...""")
Task(subagent_type="bmad:bmad-dev", description="Story lifecycle worker 3", prompt="""...""")
Task(subagent_type="bmad:bmad-dev", description="Story lifecycle worker 4", prompt="""...""")

# DON'T DO THIS (wrong - sequential):
# Send message with Task 1, wait, then send message with Task 2, etc.
```

**Worker prompt template for each parallel worker:**

```python
Task(
  subagent_type="bmad:bmad-dev",
  description="Story lifecycle worker 1",
  prompt=f"""
Execute complete story lifecycle for story: {story_1_key}

**Worker ID:** worker-1
**Coordination:** File-based via sprint-status.yaml
**Execution Mode:** Parallel (isolated context)

**Process:**
1. CLAIM STORY: Update sprint-status.yaml:
   {story_1_key}: "locked-worker-1"

2. EXECUTE LIFECYCLE:
   a. Run /bmad:phase-4:create-story for {story_1_key}
   b. Run /bmad:phase-4:story-context for {story_1_key}
   c. Run /bmad:phase-4:dev-story for {story_1_key}
      (dev-story auto-continues to code-review)
   d. Handle review outcome:
      - APPROVED: Run /bmad:phase-4:story-done
      - CHANGES: Re-run dev-story, then re-review
      - BLOCKED: Report blocker, stop

3. RELEASE LOCK: Update sprint-status.yaml:
   {story_1_key}: "done" (or "blocked" if blocker)

4. REPORT: Return completion status and any blockers

**CRITICAL:**
- You are running in PARALLEL with other workers
- You have your own isolated context
- Check sprint-status.yaml before each operation
- If story lock stolen by another worker, HALT immediately
- Update sprint-status.yaml atomically (read-modify-write)
- Report any errors or blockers clearly
- DO NOT wait for other workers - execute independently
"""
)

# Repeat for worker 2, 3, 4 with their respective story keys
# ALL in the SAME message to ensure parallel execution
```

**Parallelism verification:**

After sending the Task calls, verify parallel execution:
```
✅ Correct: Claude Code spawns 4 independent subagents with isolated contexts
✅ Correct: All 4 workers execute concurrently
✅ Correct: Workers coordinate only via sprint-status.yaml file locks
✅ Correct: Each worker has own context window and operates independently

❌ Wrong: Workers execute sequentially (one after another)
❌ Wrong: Workers share context (they should be isolated)
```

**Each worker receives:**
- Story key to process
- Unique worker ID for locking
- Complete lifecycle instructions
- File coordination protocol
- Error handling guidelines
- Explicit parallel execution mode indication

### Step 3C: Monitor Worker Progress and Aggregate Results

**Workers execute in parallel, main orchestrator monitors:**

```python
def await_all_workers(workers):
    """
    Wait for all worker subagents to complete.
    Workers report back via their Task tool completion.
    """
    results = []

    # Each worker returns completion report
    for worker in workers:
        result = worker.get_result()  # Blocks until worker completes
        results.append(result)

    return results
```

**Each worker reports:**

```json
{
  "worker_id": "worker-1",
  "story_key": "1-3-password-reset",
  "status": "completed",  // or "blocked"
  "blocker": null,  // or blocker details if blocked
  "stories_completed": 1,
  "errors": []
}
```

**Aggregate results:**

```python
def aggregate_results(results):
    total_completed = 0
    blockers = []

    for result in results:
        if result['status'] == 'completed':
            total_completed += result['stories_completed']
        elif result['status'] == 'blocked':
            blockers.append({
                'story': result['story_key'],
                'blocker': result['blocker'],
                'worker': result['worker_id']
            })

    return {
        'completed': total_completed,
        'blockers': blockers,
        'critical_blocker': any(b['blocker']['is_critical'] for b in blockers)
    }
```

**Critical blocker handling:**

If ANY worker reports critical blocker:
1. Stop launching new worker batches
2. Wait for in-progress workers to finish
3. Save progress checkpoint with blocker details
4. Exit workflow with blocker report

### Step 5: Execute Story Lifecycle

**For each story, run complete lifecycle:**

#### 5A: Create Story (draft from backlog)

Execute: `/bmad:phase-4:create-story`

**This workflow will:**
- Find the story in backlog
- Generate story file with ACs, tasks, dev notes
- Extract learnings from previous story
- Update status: backlog → drafted

**Expected outcome:**
- Story file created: `.bmad/sprint-artifacts/stories/{story_key}.md`
- Status updated to "drafted"

**If error:**
- Log error to checkpoint
- Skip this story
- Continue to next story

#### 5B: Generate Story Context

Execute: `/bmad:phase-4:story-context`

**This workflow will:**
- Load drafted story
- Collect relevant documentation
- Analyze existing code
- Gather dependencies
- Generate Story Context XML
- Update status: drafted → ready-for-dev

**Expected outcome:**
- Context file created: `.bmad/sprint-artifacts/stories/{story_key}.context.xml`
- Status updated to "ready-for-dev"

**Critical:** Story Context prevents hallucinations and ensures code reuse

**If error:**
- Log error to checkpoint
- Skip this story
- Continue to next story

#### 5C: Implement Story

Execute: `/bmad:phase-4:dev-story`

**This workflow will:**
- Load story and context
- Mark story in-progress
- Implement all tasks continuously
- Write tests
- Validate against ACs
- Update status: ready-for-dev → review (when complete)
- **Auto-continue to code-review** (built into dev-story)

**Expected outcome:**
- Story implemented
- Tests passing
- Status updated to "review"
- Code review automatically triggered

**If blocker encountered:**
- Developer agent will report blocker
- Log blocker to checkpoint
- **Decision point:**
  - If blocker is critical (missing info, ambiguous requirement):
    - Save checkpoint
    - Exit loop
    - Notify user of blocker
  - If blocker is minor (test failure, fixable issue):
    - Attempt to resolve
    - Continue if resolved

#### 5D: Code Review (Auto-triggered by dev-story)

**Note:** Code review is automatically triggered by dev-story workflow

Execute: `/bmad:phase-4:code-review`

**This workflow will:**
- Systematic AC validation
- Task completion verification
- Security and quality review
- Generate findings and action items
- Determine outcome: APPROVE, CHANGES REQUESTED, or BLOCKED

**Expected outcomes:**

**If APPROVED:**
- Status: review → done (ready for story-done)
- Proceed to Step 5E

**If CHANGES REQUESTED:**
- Status: review → in-progress
- Action items added to story file
- **Auto-continue:** Re-run dev-story to address action items
- Loop back to Step 5C

**If BLOCKED:**
- Status: stays "review"
- High severity blockers logged
- Save checkpoint
- Exit loop
- Notify user of blockers

#### 5E: Mark Story Done (If Approved)

**Only if code review outcome = APPROVED:**

Execute: `/bmad:phase-4:story-done`

**This workflow will:**
- Update story file: Status → done
- Add completion notes
- Update sprint-status.yaml: review → done

**Expected outcome:**
- Story marked complete
- `stories_completed += 1`

### Step 6: Context Window Monitoring

**After each story completion, check context:**

```javascript
current_token_usage = get_current_token_usage()
total_tokens = 200000  // or whatever the model limit is
remaining_tokens = total_tokens - current_token_usage
remaining_percentage = (remaining_tokens / total_tokens) * 100

if (remaining_percentage < 20) {
  // Context depleted - save progress and pause
  return "CONTEXT_DEPLETED"
}
```

**Display periodic updates:**

After every story completion:
```
📊 Progress Update

Stories completed: {stories_completed}
Context usage: {current_token_usage} / {total_tokens} ({percentage}%)
Remaining context: {remaining_percentage}%

✅ Story {story_key} complete - continuing to next story...
```

### Step 7: Handle Review Feedback Loop

**If code review requests changes:**

1. **Parse action items** from review notes
2. **Re-run dev-story** to address action items
   - Developer agent will detect code review continuation
   - Prioritize review action items
   - Implement fixes
   - Re-run tests
3. **Re-run code-review** for re-review
4. **Repeat until APPROVED or BLOCKED**

**Maximum iterations:** 3 review cycles per story
- If story still not approved after 3 cycles → Mark as BLOCKED
- Log to checkpoint
- Skip to next story

### Step 8: Save Progress Checkpoint

**When context < 20% or blocker encountered:**

Create checkpoint file: `.bmad/sprint-artifacts/bring-to-life-checkpoint.md`

**Checkpoint structure:**

```markdown
# Bring to Life - Progress Checkpoint

**Session Date:** {date}
**Checkpoint Reason:** {CONTEXT_DEPLETED | BLOCKER | USER_INTERRUPT}

## Progress Summary

**Stories Completed:** {stories_completed}
**Last Completed Story:** {last_story_key}
**Stories Remaining:** {remaining_count}

## Completed Stories This Session

- ✅ {story_1_key} - {story_1_title}
- ✅ {story_2_key} - {story_2_title}
- ✅ {story_3_key} - {story_3_title}
...

## Remaining Stories

- [ ] {story_key} - {story_title} (status: {status})
- [ ] {story_key} - {story_title} (status: {status})
...

## Blockers (if any)

{blocker_description}

Story: {blocked_story_key}
Blocker Type: {blocker_type}
Required Action: {required_action}

## Context Window Status

**Usage at checkpoint:** {token_usage} / {total_tokens} ({percentage}%)
**Remaining:** {remaining_percentage}%

## Resumption Instructions

To resume the bring-to-life workflow:

1. **Clear the conversation** to free up context window
2. **Re-run this workflow:** `/bmad:phase-4:bring-to-life`
3. **Workflow will resume** from checkpoint automatically

**Or continue manually:**
1. Review completed stories above
2. Address any blockers listed
3. Run `/bmad:phase-4:create-story` for next backlog story
4. Continue with story-context → dev-story → code-review → story-done

---

**Checkpoint saved:** {checkpoint_file_path}
```

**Save checkpoint file**

### Step 9: Report Session Summary

**Display final summary:**

```
🎯 Bring to Life Session Complete

**Completion Reason:** {CONTEXT_DEPLETED | ALL_STORIES_DONE | BLOCKER_ENCOUNTERED}

**Session Summary:**
- Stories completed: {stories_completed}
- Success rate: {success_rate}%
- Time elapsed: {elapsed_time}

**Context Window:**
- Usage: {token_usage} / {total_tokens} ({percentage}%)
- Remaining: {remaining_percentage}%

**Completed Stories:**
{list_of_completed_stories}

**Remaining Stories:**
- Backlog: {backlog_count}
- Drafted: {drafted_count}
- Ready-for-dev: {ready_count}
- In-progress: {in_progress_count}

**Next Steps:**

{IF CONTEXT_DEPLETED}
⚠️ Context window depleted to {remaining_percentage}%

To continue:
1. Clear this conversation
2. Re-run: /bmad:phase-4:bring-to-life
3. Workflow will resume from checkpoint

{IF ALL_STORIES_DONE}
✅ All stories complete!

Recommended next steps:
1. Run /bmad:phase-4:retrospective for each epic
2. Review all completed stories
3. Plan next phase or epic

{IF BLOCKER_ENCOUNTERED}
⛔ Critical blocker encountered

Blocker: {blocker_description}
Story: {blocked_story_key}

Required action:
{required_action}

After resolving blocker:
- Re-run: /bmad:phase-4:bring-to-life to resume

**Checkpoint saved:** .bmad/sprint-artifacts/bring-to-life-checkpoint.md
```

## Key Principles

### 1. Parallel Autonomous Execution

**CRITICAL: Think hard about sequential vs. parallel operations**

Before any step, analyze:
- **Can these operations run in parallel?** → Launch all subagents in a SINGLE message
- **Must these run sequentially?** → Execute in order, one after another

**Run multiple stories concurrently:**
- Launch 2-4 worker subagents in parallel (SINGLE message with multiple Task calls)
- Each worker executes complete story lifecycle independently
- Each worker gets its own isolated context
- Workers coordinate via file-based locks (sprint-status.yaml)
- No pauses between batches (unless context depleted)
- No user prompts for permission
- Fully automated lifecycle

**Parallelism implementation:**
```xml
<!-- ✅ CORRECT: One message, multiple workers, true parallelism -->
<function_calls>
  <invoke name="Task">Worker 1</invoke>
  <invoke name="Task">Worker 2</invoke>
  <invoke name="Task">Worker 3</invoke>
  <invoke name="Task">Worker 4</invoke>
</function_calls>
```

**Parallelism benefits:**
- **3-4x throughput** compared to sequential execution
- Better utilization of available resources
- Faster time-to-completion for large backlogs
- Context window used more efficiently
- Workers have isolated contexts (no interference)

**Only halt for:**
- Context window < 20%
- Critical blocker (missing info, ambiguous requirement)
- All stories complete

### 2. File-Based Coordination

**sprint-status.yaml as coordination mechanism:**
- Workers claim stories with locks: `locked-worker-{id}`
- Atomic read-modify-write operations
- Collision avoidance (workers skip locked stories)
- Clean release on completion: `locked-worker-{id}` → `done`

**Lock protocol prevents:**
- Race conditions (two workers on same story)
- Duplicate work
- Incomplete state transitions

### 3. Context Window Awareness

**Monitor continuously:**
- Check after each batch completion
- Save progress before depletion
- Provide clear resumption path

**20% threshold:**
- Ensures enough context to save progress
- Prevents mid-batch interruption
- Allows clean checkpoint

### 4. Intelligent Resume

**Checkpoint system:**
- Tracks progress automatically (batch-level granularity)
- Enables resume from exact stopping point
- Preserves session history and batch execution details

**Resume behavior:**
- Auto-detects existing checkpoint
- Continues from last completed batch
- Cumulative progress tracking across sessions
- Maintains parallelism settings

### 5. Blocker Handling

**Critical blockers (halt immediately):**
- Missing required information
- Ambiguous requirement needing user clarification
- External dependency unavailable
- Repeated failures (3+ review cycles)

**Non-critical blockers (attempt resolution):**
- Test failures (dev agent fixes)
- Code review changes requested (dev agent addresses)
- Minor implementation issues (dev agent resolves)

### 6. Progress Transparency

**Continuous updates:**
- After each batch completion (not individual stories)
- Shows all workers' progress in parallel
- Context window status after batch
- Cumulative progress across all batches

**Clear reporting:**
- What was completed (by batch and worker)
- What remains
- Why it stopped
- How to resume
- Parallelism metrics (throughput improvement)

## Examples

### Example 1: Parallel Execution of 12 Stories Before Context Depletion

**Context:**
- Project: T3 Stack SaaS
- 15 total stories across 3 epics
- 12 stories in backlog
- Clean start (no checkpoint)
- Parallelism: 4 workers

**Execution:**

1. **Initialize:**
   ```
   🚀 Starting Bring to Life Workflow (Parallel Mode)

   Stories in backlog: 12
   Parallelism: 4 workers
   Target: Complete as many as possible until context < 20%

   Launching first batch of 4 workers...
   ```

2. **Batch 1: 4 stories in parallel**
   ```
   📦 Batch 1: Launching 4 parallel workers

   Worker 1: 1-3-password-reset
   Worker 2: 1-4-mfa-setup
   Worker 3: 2-1-profile-management
   Worker 4: 2-2-settings

   [Workers execute concurrently]

   ✅ Worker 1: 1-3-password-reset → done
   ✅ Worker 2: 1-4-mfa-setup → done
   ✅ Worker 3: 2-1-profile-management → done
   ✅ Worker 4: 2-2-settings → done

   📊 Progress: 4 stories complete, context: 65% remaining

   Launching next batch...
   ```

3. **Batch 2: 4 more stories in parallel**
   ```
   📦 Batch 2: Launching 4 parallel workers

   Worker 1: 2-3-preferences
   Worker 2: 2-4-notifications
   Worker 3: 3-1-dashboard-layout
   Worker 4: 3-2-widget-system

   [Workers execute concurrently]

   ✅ Worker 1: 2-3-preferences → done
   ✅ Worker 2: 2-4-notifications → done
   ✅ Worker 3: 3-1-dashboard-layout → done
   ✅ Worker 4: 3-2-widget-system → done

   📊 Progress: 8 stories complete, context: 35% remaining

   Launching next batch...
   ```

4. **Batch 3: 4 more stories (partial completion)**
   ```
   📦 Batch 3: Launching 4 parallel workers

   Worker 1: 3-3-data-visualization
   Worker 2: 3-4-analytics-dashboard
   Worker 3: 3-5-export-data
   Worker 4: 3-6-api-documentation

   [Workers execute concurrently]

   ✅ Worker 1: 3-3-data-visualization → done
   ✅ Worker 2: 3-4-analytics-dashboard → done
   ✅ Worker 3: 3-5-export-data → done
   ✅ Worker 4: 3-6-api-documentation → done

   📊 Progress: 12 stories complete, context: 18% remaining
   ```

5. **Context depletion detected:**
   ```
   ⚠️ Context window depleted to 18%

   Completed 12 stories in 3 parallel batches
   Saving progress checkpoint...
   ```

6. **Checkpoint saved:**
   ```markdown
   # Bring to Life - Progress Checkpoint

   Session Date: 2025-01-13
   Checkpoint Reason: CONTEXT_DEPLETED
   Execution Mode: PARALLEL (4 workers)

   Stories Completed: 12
   Batches Executed: 3
   Last Batch: Stories 3-3 through 3-6
   Stories Remaining: 3

   Completed Stories (by batch):
   Batch 1:
   - ✅ 1-3-password-reset (worker-1)
   - ✅ 1-4-mfa-setup (worker-2)
   - ✅ 2-1-profile-management (worker-3)
   - ✅ 2-2-settings (worker-4)

   Batch 2:
   - ✅ 2-3-preferences (worker-1)
   - ✅ 2-4-notifications (worker-2)
   - ✅ 3-1-dashboard-layout (worker-3)
   - ✅ 3-2-widget-system (worker-4)

   Batch 3:
   - ✅ 3-3-data-visualization (worker-1)
   - ✅ 3-4-analytics-dashboard (worker-2)
   - ✅ 3-5-export-data (worker-3)
   - ✅ 3-6-api-documentation (worker-4)

   Context Usage: 164,000 / 200,000 (82%)
   Remaining: 18%
   ```

7. **Final summary:**
   ```
   🎯 Bring to Life Session Complete

   Completion Reason: CONTEXT_DEPLETED

   Session Summary:
   - Stories completed: 12 (in 3 parallel batches)
   - Parallelism: 4 workers per batch
   - Success rate: 100%
   - Throughput: 4x faster than sequential

   Context Window:
   - Usage: 164,000 / 200,000 (82%)
   - Remaining: 18%

   Next Steps:
   1. Clear this conversation
   2. Re-run: /bmad:phase-4:bring-to-life
   3. Workflow will resume from checkpoint
   4. Remaining 3 stories will complete in final batch

   Checkpoint saved: .bmad/sprint-artifacts/bring-to-life-checkpoint.md
   ```

**User action:** Clear conversation, re-run workflow to complete remaining 3 stories

**Performance:** 12 stories completed in parallel (vs ~3-4 if sequential) = **3-4x throughput improvement**

---

### Example 2: Blocker Encountered During Implementation

**Context:**
- Resuming from previous session
- 3 stories remaining
- Story 3-4 has ambiguous requirement

**Execution:**

1. **Resume from checkpoint:**
   ```
   🔄 Resuming from checkpoint

   Previous session: 12 stories completed
   Remaining: 3 stories

   Continuing with story 3-4-analytics-dashboard...
   ```

2. **Story 3-4: Blocker encountered**
   ```
   📝 Story 3-4-analytics-dashboard

   ✅ create-story → drafted
   ✅ story-context → ready-for-dev
   ⛔ dev-story → BLOCKED

   Blocker: AC-3.4.2 requires "real-time updates" but frequency not specified

   Developer needs clarification:
   - Update frequency? (1s, 5s, 30s?)
   - Push or poll?
   - WebSocket or SSE?

   Cannot proceed without this information.
   ```

3. **Save checkpoint with blocker:**
   ```markdown
   # Bring to Life - Progress Checkpoint

   Checkpoint Reason: BLOCKER

   Stories Completed: 12 (no new completions this session)

   Blocker:
   Story: 3-4-analytics-dashboard
   Blocker Type: Ambiguous Requirement
   Description: AC-3.4.2 "real-time updates" frequency not specified
   Required Action: Clarify update frequency, push/poll strategy, protocol
   ```

4. **Final summary:**
   ```
   🎯 Bring to Life Session Complete

   Completion Reason: BLOCKER_ENCOUNTERED

   ⛔ Critical blocker in story 3-4-analytics-dashboard

   Blocker: Ambiguous requirement - "real-time updates" frequency not specified

   Required action:
   - Clarify AC-3.4.2 requirements
   - Update story file or PRD with clarification
   - Re-run /bmad:phase-4:bring-to-life to resume

   Stories remaining: 3
   ```

**User action:** Clarify requirement, update story file, re-run workflow

---

### Example 3: All Stories Complete

**Context:**
- Final session of project
- 2 stories remaining in backlog

**Execution:**

1. **Resume from checkpoint:**
   ```
   🔄 Resuming from checkpoint

   Previous sessions: 13 stories completed
   Remaining: 2 stories

   Continuing with story 3-5-export-data...
   ```

2. **Complete final 2 stories:**
   ```
   📝 Story 3-5-export-data
   ✅ Complete lifecycle → done

   📝 Story 3-6-api-documentation
   ✅ Complete lifecycle → done

   📊 Progress: 15 stories complete
   ```

3. **No more backlog stories:**
   ```
   ✅ All Stories Complete!

   No more backlog stories found.
   All 15 stories in all 3 epics have been completed.

   Session Summary:
   - Stories completed this session: 2
   - Total stories in project: 15
   - Success rate: 100%
   ```

4. **Final summary:**
   ```
   🎯 Bring to Life Session Complete

   Completion Reason: ALL_STORIES_DONE

   🎉 Congratulations! All stories implemented and reviewed.

   Total stories completed: 15
   Epics completed: 3

   Next Steps:
   1. Run /bmad:phase-4:retrospective for Epic 1
   2. Run /bmad:phase-4:retrospective for Epic 2
   3. Run /bmad:phase-4:retrospective for Epic 3
   4. Review all completed work
   5. Plan next phase or project
   ```

**Project complete!**

---

## Troubleshooting

### Issue: Context depletes too quickly

**Symptoms:**
```
⚠️ Context window depleted after only 2 stories
```

**Causes:**
- Very large story context files
- Complex codebases with many references
- Long epic tech specs

**Solutions:**
1. **Increase story granularity** - Break stories into smaller pieces
2. **Optimize context files** - Remove unnecessary documentation references
3. **Clear conversation more frequently** - Run bring-to-life in smaller batches

### Issue: Repeated review failures

**Symptoms:**
```
⛔ Story blocked after 3 review cycles
```

**Causes:**
- Insufficient story context
- Ambiguous acceptance criteria
- Complex compliance requirements

**Solutions:**
1. **Review story ACs** - Make acceptance criteria more specific
2. **Enhance story context** - Re-run story-context with better docs
3. **Manual intervention** - Implement story manually, then resume

### Issue: Blocker on first story

**Symptoms:**
```
⛔ Blocker encountered immediately
No stories completed
```

**Causes:**
- Missing prerequisite information
- Incomplete epic tech specs
- Ambiguous PRD

**Solutions:**
1. **Run epic-tech-context** first for all epics
2. **Review and clarify PRD** requirements
3. **Ensure architecture docs exist**
4. **Address blocker** then re-run

### Issue: Checkpoint not resuming

**Symptoms:**
```
Starting fresh bring-to-life workflow
(Expected: Resuming from checkpoint)
```

**Causes:**
- Checkpoint file missing or corrupted
- Checkpoint path incorrect

**Solutions:**
1. **Check checkpoint file exists:**
   ```bash
   cat .bmad/sprint-artifacts/bring-to-life-checkpoint.md
   ```
2. **Verify sprint-status.yaml** has correct story statuses
3. **Re-run sprint-planning** to refresh tracking

---

## Related Workflows

**Prerequisites:**
1. `/bmad:meta:workflow-init` - Initialize project
2. `/bmad:phase-2:prd` - Create requirements
3. `/bmad:phase-2:create-epics-and-stories` - Create epics and stories
4. `/bmad:phase-4:sprint-planning` - Initialize tracking

**Component workflows (automated by bring-to-life):**
1. `/bmad:phase-4:create-story` - Draft story from backlog
2. `/bmad:phase-4:story-context` - Generate Story Context XML
3. `/bmad:phase-4:dev-story` - Implement story (auto-continues to code-review)
4. `/bmad:phase-4:code-review` - Review implementation
5. `/bmad:phase-4:story-done` - Mark complete

**Post-completion:**
1. `/bmad:phase-4:retrospective` - Epic retrospective (run for each epic)

---

## Success Criteria

✅ **Multiple stories completed** in automated sequence

✅ **Context monitoring** working (stops at < 20%)

✅ **Progress checkpoint** saved when paused

✅ **Clear resume path** provided to user

✅ **Blocker handling** graceful (saves progress, notifies user)

✅ **Sprint status tracking** updated throughout

✅ **No manual intervention** required (until context depletion or blocker)

✅ **Session summary** comprehensive and actionable

---

## Configuration

Reads from `.bmad/config.yaml`:

```yaml
output_folder: .bmad
sprint_artifacts: .bmad/sprint-artifacts
user_name: "Your Name"
bmad_folder: .bmad
```

**Checkpoint file:**
- `.bmad/sprint-artifacts/bring-to-life-checkpoint.md`

**Story files:**
- `.bmad/sprint-artifacts/stories/{story-key}.md`

**Sprint status:**
- `.bmad/sprint-artifacts/sprint-status.yaml`

---

## Notes

- **Parallel execution** - Runs 2-4 stories concurrently (3-4x faster than sequential)
- **File-based coordination** - Workers use sprint-status.yaml locks for synchronization
- **Fully automated** - Runs until context depleted or all stories done
- **Context aware** - Monitors usage, saves progress proactively after each batch
- **Resumable** - Clean checkpoint system for multi-session workflows
- **Transparent** - Progress updates after each batch (shows all workers)
- **Safe** - Handles blockers gracefully, doesn't skip or force through
- **Complete lifecycle** - Every story goes through full workflow
- **Review feedback loop** - Automatically addresses code review changes
- **No user prompts** - Runs autonomously (no permission requests)

**Typical usage:**
1. Run `/bmad:phase-4:bring-to-life` after sprint planning
2. Let it run until context depletes (processes multiple batches in parallel)
3. Clear conversation
4. Re-run to resume from checkpoint
5. Repeat until all stories done
6. Run retrospectives for each epic

**Time:** Variable (depends on story count and complexity)
- **~30-50 stories per session** with parallel execution (vs ~10-20 sequential)
- Multiple sessions typically needed for large projects
- **3-4x faster** than sequential execution

**Parallelism notes:**
- Uses single message with multiple Task tool calls for true concurrency
- Workers coordinate via atomic file operations on sprint-status.yaml
- Each worker runs complete story lifecycle independently
- Main orchestrator monitors all workers and aggregates results
- Lock protocol prevents race conditions and duplicate work

**Philosophy:** Maximize autonomous development through parallelism, minimize manual intervention, respect context constraints, provide clear resumption path, leverage file-based coordination.
