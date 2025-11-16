---
description: Automate complete story lifecycle (create-story → story-context → dev-story → code-review → story-done) until context depleted, using parallel subagents for maximum throughput
---

# Bring to Life - Automated Story Development Workflow

Automates the complete story development lifecycle for all stories until context depleted (<20%), using parallel subagent execution for maximum productivity.

## Purpose

Creates a fully automated development pipeline that runs multiple stories in parallel via independent subagents, coordinated through file-based state (sprint-status.yaml). Each story executes: create → context → dev → review → done.

**Key Principle:** Parallel Autonomous Development - Maximize productivity by running multiple story lifecycles concurrently until context constraints require pause.

## Quick Start

```bash
# Prerequisites: epics created, sprint planning run, stories in backlog
/bmad:phase-4:bring-to-life

# Workflow will:
# 1. Launch 2-4 parallel workers (one per story)
# 2. Each worker runs complete lifecycle
# 3. Workers coordinate via sprint-status.yaml locks
# 4. Continues until context < 20% or all stories done
```

## Prerequisites

See [shared/prerequisites.md#phase-4-bring-to-life](../shared/prerequisites.md)

**Workflow-specific:**
- [ ] At least one story in backlog status
- [ ] Sprint artifacts directory exists
- [ ] Epic files available

## Instructions

### Critical Parallel Execution Rule

**Before ANY step, analyze: Can operations run in parallel?**

- **YES** → Launch ALL subagents in SINGLE message (true parallelism)
- **NO** → Execute sequentially

```xml
<!-- ✅ CORRECT: One message, multiple workers -->
<function_calls>
  <invoke name="Task">Worker 1</invoke>
  <invoke name="Task">Worker 2</invoke>
  <invoke name="Task">Worker 3</invoke>
</function_calls>

<!-- ❌ WRONG: Separate messages = sequential -->
<function_calls>
  <invoke name="Task">Worker 1</invoke>
</function_calls>
<!-- Worker 2 only starts after Worker 1 completes -->
```

### 1. Load Configuration and Verify

See [shared/common-operations.md#load-configuration](../shared/common-operations.md)

Verify: sprint-status.yaml, epics.md or epic-{N}.md files exist.

### 2. Initialize Progress Tracking

Check for `{sprint_artifacts}/bring-to-life-checkpoint.md`:
- **Exists:** Resume from checkpoint (extract completed count)
- **Missing:** Start fresh (stories_completed = 0)
- **Initialize:** context_threshold = 20%

### 3. Main Loop: Parallel Development

```python
WHILE remaining_context > 20%:
  # 3A: Find Available Stories (Dependency-Aware)
  stories = find_stories_with_satisfied_dependencies(limit=4)

  IF stories is empty:
    BREAK  # All done or blocked

  # 3B: Launch Parallel Workers (SINGLE MESSAGE)
  FOR each story:
    claim_story(story, worker_id)
    launch_worker(story, worker_id)  # All in ONE message

  # 3C: Wait for Completion
  results = await_all_workers()

  # 3D: Aggregate Results
  stories_completed += count_successes(results)
  IF any_critical_blockers(results):
    save_checkpoint()
    RETURN

  # 3E: Check Context
  IF remaining_context < 20%:
    save_checkpoint()
    BREAK
```

### 3A: Find Available Stories (Dependency-Aware)

**Selection logic:**
```python
def find_available_stories(limit=4):
    for key, status in sprint_status:
        if status != "backlog": continue
        if is_epic_or_retro(key): continue

        # Check dependencies
        dependencies = extract_dependencies_from_story(key)
        all_satisfied = all(
            sprint_status[dep] == 'done' for dep in dependencies
        )

        if all_satisfied:
            stories.append(key)

    # Prioritize stories with no dependencies (parallel-safe)
    stories.sort(key=lambda s: has_dependencies(s))
    return stories[:limit]
```

**Story metadata format:**
```yaml
# In story file frontmatter
depends_on: ["2-2", "2-3"]  # or [] for no dependencies
```

### 3B: Launch Parallel Workers

**CRITICAL:** All Task calls in SINGLE message for true parallelism.

**Worker prompt template:**
```python
Task(
  subagent_type="bmad:bmad-dev",
  description=f"Story lifecycle worker {i}",
  prompt=f"""
Execute complete lifecycle for: {story_key}

Worker ID: worker-{i}
Coordination: File-based via sprint-status.yaml

Process:
1. CLAIM: Update sprint-status.yaml: {story_key} → "locked-worker-{i}"

2. EXECUTE LIFECYCLE:
   a. /bmad:phase-4:create-story for {story_key}
   b. /bmad:phase-4:story-context for {story_key}
      → Auto-continues to dev-story → code-review
      → Wait for complete chain

   c. MANDATORY REVIEW OUTCOME LOOP:
      RETRY_COUNT = 0
      MAX_RETRIES = 3

      WHILE RETRY_COUNT < MAX_RETRIES:
        outcome = read_code_review_outcome()

        IF outcome == "APPROVED":
          /bmad:phase-4:story-done
          BREAK

        ELIF outcome == "CHANGES_REQUESTED":
          Extract action items
          Re-run /bmad:phase-4:dev-story with items
          RETRY_COUNT += 1
          CONTINUE

        ELIF outcome == "BLOCKED":
          Report blocker
          BREAK

      IF RETRY_COUNT >= MAX_RETRIES AND not APPROVED:
        Mark as BLOCKED (reason: "Max retries exceeded")

3. RELEASE: Update sprint-status: {story_key} → "done" or "blocked"

4. REPORT:
   {{
     "worker_id": "worker-{i}",
     "story_key": "{story_key}",
     "status": "completed" | "blocked",
     "outcome": "approved" | "blocked" | "max_retries",
     "retry_count": <number>,
     "blocker": <details if blocked>
   }}

CRITICAL:
- Isolated context (parallel execution)
- Check sprint-status before each operation
- Update atomically (read-modify-write)
- ENFORCE review loop (NON-NEGOTIABLE)
- NEVER mark done if issues found
"""
)
```

### 3C-E: Monitor, Aggregate, Check Context

See [shared/common-operations.md#context-monitoring](../shared/common-operations.md)

**After each batch:**
- Collect worker results
- Handle blockers (critical → halt, non-critical → log)
- Update stories_completed
- Check context window (< 20% → save checkpoint)

### Checkpoint System

When context < 20% or blocker:

```markdown
# Bring to Life - Progress Checkpoint

**Date:** {date}
**Reason:** CONTEXT_DEPLETED | BLOCKER

## Progress
- Stories Completed: {count}
- Last Story: {key}
- Remaining: {count}

## Completed Stories
- ✅ {story} (worker)
...

## Blockers
{if any blockers, describe}

## Resumption
1. Clear conversation
2. Re-run /bmad:phase-4:bring-to-life
3. Auto-resumes from checkpoint
```

Save to: `{sprint_artifacts}/bring-to-life-checkpoint.md`

### Final Report

```
🎯 Session Complete

Reason: {CONTEXT_DEPLETED | ALL_DONE | BLOCKER}

Summary:
- Completed: {count} stories
- Success rate: {percent}%
- Context: {usage}%

Next Steps:
[Context depleted] → Clear conversation, re-run
[All done] → Run retrospectives
[Blocker] → Resolve blocker, re-run
```

## Key Constraints

- **File locks prevent races:** Workers use sprint-status.yaml atomically
- **Review loop enforced:** Workers MUST NOT skip review validation
- **20% threshold:** Ensures safe checkpoint creation
- **Max 4 parallel workers:** Optimal throughput vs coordination overhead
- **Dependency checking:** Only select stories with satisfied dependencies

## Auto-Continue

**NO auto-continue** - This is a terminal workflow that runs until complete or blocked.

User re-runs manually after:
- Clearing conversation (context depleted)
- Resolving blockers
- All stories complete (moves to retrospectives)

## Notes

- **Parallel execution:** 3-4x faster than sequential
- **Dependency-aware:** Respects `depends_on` metadata
- **File-based coordination:** No shared state, clean isolation
- **Checkpoint system:** Multi-session workflows supported
- **Review enforcement:** Quality loop runs automatically
- **No user prompts:** Fully autonomous until halt

**Philosophy:** Maximize autonomous development through parallelism, minimize intervention, respect context, provide clear resumption path.

---

**References:**
- Examples: [examples/bring-to-life.md](../examples/bring-to-life.md)
- Troubleshooting: [shared/troubleshooting.md#bring-to-life](../shared/troubleshooting.md)
- Philosophy: [shared/design-philosophy.md#parallel-execution](../shared/design-philosophy.md)
- Common Operations: [shared/common-operations.md](../shared/common-operations.md)
