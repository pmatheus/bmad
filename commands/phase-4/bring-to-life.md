---
description: Automate complete story lifecycle (create-story → story-context → dev-story → code-review → story-done) until context depleted, using intelligent dependency analysis to determine optimal execution strategy (sequential vs parallel)
---

# Bring to Life - Automated Story Development Workflow

Automates the complete story development lifecycle for all stories until context depleted (<20%), using **Ultra Think dependency analysis** to intelligently determine when to run stories sequentially vs in parallel.

## Purpose

Creates a fully automated development pipeline with intelligent execution strategy. Uses **priority-based selection** (pending fixes > dependencies > backlog) and **independence analysis** (file conflicts, API changes, dependencies) to determine optimal execution mode. Coordinated through file-based state (sprint-status.yaml).

Each story executes: create → context → dev → review → done.

**Key Principles:**
1. **Priority First:** Handle pending issues before new work
2. **Independence Determines Mode:** Conflicts → sequential, verified independent → parallel
3. **Dynamic Re-analysis:** Ultra Think runs every iteration (dependencies change as work completes)
4. **Correctness Over Speed:** Never sacrifice quality for parallelism

## Quick Start

```bash
# Prerequisites: epics created, sprint planning run, stories in backlog
/bmad:phase-4:bring-to-life

# Workflow will:
# 1. Run Ultra Think dependency analysis
# 2. Select stories by priority (fixes > deps > backlog)
# 3. Analyze independence (conflicts prevent parallelism)
# 4. Launch workers based on cluster size:
#    - 1 story (cluster=1) → Sequential mode
#    - 2-4 stories (cluster≥2) → Parallel mode (verified independent)
# 5. Workers coordinate via sprint-status.yaml locks
# 6. Re-run Ultra Think after each batch (dependencies change)
# 7. Continue until context < 20% or all stories done
```

## Prerequisites

See [shared/prerequisites.md#phase-4-bring-to-life](../shared/prerequisites.md)

**Workflow-specific:**
- [ ] At least one epic defined in sprint-status.yaml
- [ ] Sprint artifacts directory exists
- [ ] Epic files available (epics.md or epic-{N}.md)

**Note on Epic Context:**
- Epic context (epic-tech-context) is **required** before stories can be created
- Workflow will **automatically generate** epic context for any epic with status "backlog"
- You do not need to manually run epic-tech-context before bring-to-life
- If epic context generation fails, the epic will be marked "blocked" and workflow continues with other epics

## Instructions

### Critical Execution Strategy Rule

**Before ANY batch, Ultra Think analyzes: Should these stories run in parallel?**

**Decision factors:**
1. **Priority tier:** Are these pending fixes, dependencies, or backlog?
2. **Independence:** Do stories share files, APIs, or have dependency chains?
3. **Conflicts:** Database schema changes, API endpoint modifications, same epic relationships?

**Execution modes:**

- **SEQUENTIAL (cluster_size = 1):**
  - Launch single worker
  - Used when: dependency chain, single story remaining, or all others conflict
  - Example: Story A depends on Story B (must run sequentially)

- **PARALLEL (cluster_size ≥ 2):**
  - Launch ALL workers in SINGLE message (true parallelism)
  - Used when: stories verified independent (no file overlap, no conflicts)
  - Example: Stories from different epics with no shared components

```xml
<!-- ✅ CORRECT: Parallel launch (verified independent stories) -->
<function_calls>
  <invoke name="Task">Worker 1 (story 3-1)</invoke>
  <invoke name="Task">Worker 2 (story 3-2)</invoke>
  <invoke name="Task">Worker 3 (story 4-1)</invoke>
</function_calls>

<!-- ✅ CORRECT: Sequential launch (conflicting stories) -->
<function_calls>
  <invoke name="Task">Worker 1 (story 2-4)</invoke>
</function_calls>
<!-- Next iteration launches Worker 2 after story 2-4 completes -->

<!-- ❌ WRONG: Separate messages when stories ARE independent -->
<function_calls>
  <invoke name="Task">Worker 1 (story 3-1)</invoke>
</function_calls>
<!-- Worker 2 starts AFTER Worker 1 (lost parallelism opportunity) -->
```

**Key insight:** Status doesn't determine mode, independence does. Blocked stories can run in parallel if they're independent of each other.

### 1. Load Configuration and Verify

See [shared/common-operations.md#load-configuration](../shared/common-operations.md)

Verify: sprint-status.yaml, epics.md or epic-{N}.md files exist.

### 1.5 CLAUDE.md Validation

**Purpose:** Ensure agents can navigate project during multi-story development

**Check for CLAUDE.md:**
```bash
if [ ! -f "{output_folder}/CLAUDE.md" ]; then
  warn "No CLAUDE.md found - agents may struggle with navigation"
fi
```

**Why CLAUDE.md is critical for bring-to-life:**
- Multiple stories will reference existing code
- Agents need to locate files quickly across codebase
- File map prevents redundant Grep/Glob searches
- Coding standards ensure consistency across all stories
- Common tasks provide operational guidance

**If CLAUDE.md missing:**

Display warning:
```
⚠️ CLAUDE.md Not Found

bring-to-life will create multiple stories across many files.
Without CLAUDE.md, agents will have difficulty:
- Locating existing files and components
- Understanding project structure
- Following coding standards consistently
- Navigating the codebase efficiently

This may lead to:
- Slower story development
- Duplicate code creation
- Inconsistent patterns
- Difficulty finding related modules
```

**Ask user via AskUserQuestion:**
```
Question: "Generate CLAUDE.md now? (Recommended for multi-story development)"
Options:
- Yes, generate now (strongly recommended)
- No, continue without it (may impact efficiency)
```

**If user chooses Yes:**
```python
# Call generate-claude-md workflow
Task(
    subagent_type="general-purpose",
    description="Generate CLAUDE.md for navigation",
    prompt="""
    Generate CLAUDE.md file for project navigation and coding standards.

    Use /bmad:meta:generate-claude-md workflow.

    This is critical for bring-to-life workflow because:
    - Multiple workers need to navigate codebase
    - File map enables quick file discovery
    - Standards ensure consistency across stories

    Wait for completion before continuing with bring-to-life.
    """
)
```

**If user chooses No:**
- Log: "⚠️ Proceeding without CLAUDE.md - agents will use Grep/Glob for navigation (slower)"
- Continue to Step 2
- Note: CLAUDE.md can be generated later, but efficiency will be impacted

**If CLAUDE.md exists:**
- Verify it's current (check last updated timestamp)
- If outdated (> 30 days old), suggest regeneration
- Continue to Step 2

**Timing:** After Step 1 (config loaded), before Step 2 (initialize tracking)

### 2. Initialize Progress Tracking

Check for `{sprint_artifacts}/bring-to-life-checkpoint.md`:
- **Exists:** Resume from checkpoint (extract completed count, dependency graph state)
- **Missing:** Start fresh (stories_completed = 0)
- **Initialize:** context_threshold = 20%

### 2.5. Ultra Think: Dependency Analysis & Story Clustering

**PURPOSE:** Analyze ALL candidate stories to determine optimal execution strategy (sequential vs parallel) based on independence, not status.

**CRITICAL PRINCIPLE:** Status (blocked/review/backlog) determines PRIORITY, not execution mode. Independence determines whether stories can run in parallel.

#### Step 1: Gather All Candidate Stories

```python
def gather_all_candidates():
    candidates = {
        'priority_1': [],  # review/in-progress with pending issues
        'priority_2': [],  # explicit dependencies not yet satisfied
        'priority_3': []   # backlog with satisfied dependencies
    }

    for key, status in sprint_status:
        if is_epic_or_retro(key): continue

        # PRIORITY 1: Stories needing fixes (HIGHEST PRIORITY)
        if status in ["review", "in-progress"]:
            if has_pending_review_issues(key):
                candidates['priority_1'].append(key)
                continue

        # PRIORITY 2: Stories with explicit dependencies
        dependencies = extract_dependencies_from_story(key)
        if dependencies:
            # Check if dependencies are satisfied
            all_satisfied = all(
                sprint_status[dep] == 'done' for dep in dependencies
            )
            if all_satisfied:
                candidates['priority_3'].append(key)
            else:
                candidates['priority_2'].append(key)
        else:
            # PRIORITY 3: Backlog stories (no explicit dependencies)
            if status == "backlog":
                # CRITICAL: Verify epic is contexted before adding story
                epic_num = extract_epic_number(key)
                epic_key = f"epic-{epic_num}"

                # Only add story if its epic has been contexted
                if sprint_status.get(epic_key) == "contexted":
                    candidates['priority_3'].append(key)
                # If epic not contexted, skip story (will be available after epic context generated)

    return candidates
```

#### Step 2: Detect Review Outcomes

```python
def has_pending_review_issues(story_key):
    """
    Check if story has unresolved BLOCKED or CHANGES_REQUESTED review outcome.
    Returns True if story needs attention before proceeding to new work.
    """
    story_file_path = f"{stories_dir}/{story_key}.md"
    if not file_exists(story_file_path):
        return False

    story_content = read_file(story_file_path)

    # Look for review section
    if "## Senior Developer Review (AI)" not in story_content:
        return False

    # Extract review outcome
    review_section = extract_section(story_content, "Senior Developer Review")

    # Check for BLOCKED or CHANGES REQUESTED outcomes
    if "**Outcome:** BLOCKED" in review_section:
        return True
    if "**Outcome:** CHANGES REQUESTED" in review_section:
        return True

    return False
```

#### Step 3: Analyze Story Independence (Conflict Detection)

```python
def stories_conflict(story_a, story_b):
    """
    Determine if two stories conflict and cannot run in parallel.
    Returns True if conflict detected, False if safe to run in parallel.
    """

    # 1. Explicit dependency check
    deps_a = extract_dependencies_from_story(story_a)
    deps_b = extract_dependencies_from_story(story_b)

    if story_b in deps_a or story_a in deps_b:
        return True  # Direct dependency chain

    # 2. Implicit dependency: Shared file modifications
    files_a = extract_file_mentions(story_a)  # Parse ACs + tasks
    files_b = extract_file_mentions(story_b)

    file_overlap = files_a.intersection(files_b)
    if len(file_overlap) > 0:
        return True  # Both modify same files

    # 3. Implicit dependency: Database schema changes
    if modifies_db_schema(story_a) and modifies_db_schema(story_b):
        return True  # Likely migration conflicts

    # 4. Implicit dependency: API contract changes
    api_endpoints_a = extract_api_endpoints(story_a)
    api_endpoints_b = extract_api_endpoints(story_b)

    if api_endpoints_a.intersection(api_endpoints_b):
        return True  # Both modify same API endpoints

    # 5. Epic relationship heuristic (conservative)
    epic_a = extract_epic_number(story_a)
    epic_b = extract_epic_number(story_b)

    if epic_a == epic_b:
        # Same epic: check if clearly independent
        # (e.g., different modules, no shared infrastructure)
        if not clearly_independent(story_a, story_b):
            return True  # Conservative: assume related

    return False  # Safe to run in parallel
```

**Helper functions:**

```python
def extract_file_mentions(story_key):
    """
    Parse story file (ACs + tasks) to extract file paths mentioned.
    Returns set of file paths.
    """
    story_content = read_file(f"{stories_dir}/{story_key}.md")

    # Parse acceptance criteria and tasks sections
    acs = extract_section(story_content, "Acceptance Criteria")
    tasks = extract_section(story_content, "Development Tasks")

    # Regex patterns for file paths
    # Examples: src/app/page.tsx, components/Button.tsx, lib/utils.ts
    file_pattern = r'`([a-zA-Z0-9_\-/\.]+\.(tsx?|jsx?|py|md|json|yaml))`'

    files = set()
    for match in re.findall(file_pattern, acs + tasks):
        files.add(match[0])  # match[0] is the full file path

    return files

def modifies_db_schema(story_key):
    """Check if story mentions database/schema/migration keywords."""
    story_content = read_file(f"{stories_dir}/{story_key}.md")
    keywords = ["database", "schema", "migration", "model", "table", "query"]
    return any(keyword in story_content.lower() for keyword in keywords)

def extract_api_endpoints(story_key):
    """Extract API endpoint paths mentioned in story."""
    story_content = read_file(f"{stories_dir}/{story_key}.md")
    # Match patterns like /api/users, /api/v1/posts, etc.
    endpoint_pattern = r'`(/api/[a-zA-Z0-9_\-/]+)`'
    return set(re.findall(endpoint_pattern, story_content))

def clearly_independent(story_a, story_b):
    """
    Heuristic check: Are stories in same epic but clearly independent?
    Examples: different modules, no shared components.
    """
    # If no file overlap and different feature areas, likely independent
    files_a = extract_file_mentions(story_a)
    files_b = extract_file_mentions(story_b)

    if len(files_a) == 0 or len(files_b) == 0:
        return False  # Can't determine, assume dependent

    # Check if file paths share common directory prefix
    def get_module(files):
        if not files: return set()
        return set(f.split('/')[0] for f in files if '/' in f)

    modules_a = get_module(files_a)
    modules_b = get_module(files_b)

    # Different top-level modules = likely independent
    return modules_a.isdisjoint(modules_b)
```

#### Step 4: Form Independent Clusters

```python
def form_independent_clusters(stories):
    """
    Group stories into clusters where stories within each cluster
    are independent (can run in parallel).
    Returns list of clusters, sorted by size (largest first).
    """
    clusters = []
    remaining = stories.copy()

    while remaining:
        # Start new cluster with first remaining story
        cluster = [remaining[0]]
        remaining.remove(remaining[0])

        # Try to add more stories to this cluster
        for story in remaining.copy():
            conflicts_with_cluster = False

            # Check if story conflicts with ANY story in current cluster
            for cluster_story in cluster:
                if stories_conflict(story, cluster_story):
                    conflicts_with_cluster = True
                    break

            # If no conflicts, add to cluster
            if not conflicts_with_cluster:
                cluster.append(story)
                remaining.remove(story)

        clusters.append(cluster)

    # Sort clusters: larger first (maximize parallelism in first iteration)
    clusters.sort(key=lambda c: len(c), reverse=True)

    return clusters
```

#### Step 5: Select Next Cluster (Priority + Independence)

```python
def select_next_cluster():
    """
    Main selection function combining priority and independence analysis.
    Returns single cluster (list of 1+ story keys) to execute next.
    """
    candidates = gather_all_candidates()

    # Determine which priority tier to work on
    if candidates['priority_1']:
        working_set = candidates['priority_1']
        tier = "PRIORITY_1_FIXES"
    elif candidates['priority_2']:
        working_set = candidates['priority_2']
        tier = "PRIORITY_2_DEPENDENCIES"
    elif candidates['priority_3']:
        working_set = candidates['priority_3']
        tier = "PRIORITY_3_BACKLOG"
    else:
        return None, None  # No work available

    # Analyze independence within selected tier
    clusters = form_independent_clusters(working_set)

    # Return first cluster (could be size 1 or size N)
    return clusters[0], tier
```

#### Step 6: Detect Epics Needing Context

```python
def get_epics_needing_context():
    """
    Identify epics that need context generation before their stories can be created.
    Returns list of epic keys with status "backlog" (not yet contexted).
    """
    epics_need_context = []

    for key, status in sprint_status:
        # Skip non-epic entries
        if not key.startswith("epic-"):
            continue

        # Epic with status "backlog" needs context generation
        if status == "backlog":
            epics_need_context.append(key)

    return epics_need_context
```

**Purpose:** This function enables automatic epic context generation when bring-to-life encounters stories that cannot proceed because their parent epic hasn't been contexted.

**OUTCOME:** Returns story cluster + tier information
- Cluster size 1 → Sequential execution
- Cluster size 2+ → Parallel execution (verified independent)

### 3. Main Loop: Intelligent Story Development

**CRITICAL:** Uses Ultra Think (Section 2.5) to determine execution strategy dynamically.

```python
WHILE remaining_context > 20%:
  # 3A: Run Ultra Think - Get next story cluster
  story_cluster, tier = select_next_cluster()  # From Section 2.5

  IF story_cluster is None:
    # No candidate stories available - check WHY
    epics_needing_context = get_epics_needing_context()  # From Section 2.5, Step 6

    IF epics_needing_context:
      # AUTOMATIC EPIC CONTEXT GENERATION
      PRINT f"🔧 Generating context for {len(epics_needing_context)} epic(s): {epics_needing_context}"

      # Launch epic-tech-context for each epic
      # If multiple epics, launch in parallel (single message)
      epic_workers = []

      FOR epic_key in epics_needing_context:
        epic_workers.append(
          Task(
            subagent_type="bmad:bmad-architect",
            description=f"Generate epic context for {epic_key}",
            prompt=f"""
            Generate technical context for {epic_key} using /bmad:phase-4:epic-tech-context.

            This is required before stories in this epic can be created.

            After context generation:
            1. Verify epic-tech-spec-{epic_key}.md was created
            2. Update sprint-status.yaml: {epic_key} → "contexted"
            3. Report completion status

            Return: {{
              "epic_key": "{epic_key}",
              "status": "completed" | "failed",
              "spec_file": "path/to/epic-tech-spec-{epic_key}.md"
            }}
            """
          )
        )

      # Wait for all epic context workers to complete
      epic_results = await_all_workers(epic_workers)

      # Update sprint-status for successfully contexted epics
      FOR result in epic_results:
        IF result.status == "completed":
          update_sprint_status(result.epic_key, "contexted")
          PRINT f"✅ {result.epic_key} contexted"
        ELSE:
          PRINT f"❌ {result.epic_key} failed to context: {result.error}"
          # Mark epic as blocked so it doesn't retry indefinitely
          update_sprint_status(result.epic_key, "blocked")

      # Re-run Ultra Think with newly contexted epics
      # (Stories from contexted epics will now be available)
      CONTINUE

    ELSE:
      # Truly all done or all blocked
      BREAK  # Exit main loop

  cluster_size = len(story_cluster)

  # Log strategy decision
  PRINT f"Strategy: {tier}, Cluster Size: {cluster_size}"
  PRINT f"Stories: {story_cluster}"

  # 3B: Execute based on cluster size (dynamic mode selection)
  IF cluster_size == 1:
    MODE = "SEQUENTIAL"
    story = story_cluster[0]

    # Launch single worker
    result = launch_worker(story, "worker-seq-1")

    # Wait for completion
    results = [result]

  ELIF cluster_size >= 2:
    MODE = "PARALLEL"

    # SAFETY CHECK: Verify no hidden conflicts
    # (Extra validation before parallel launch)
    for i, story_a in enumerate(story_cluster):
        for story_b in story_cluster[i+1:]:
            if stories_conflict(story_a, story_b):
                ABORT "Cluster validation failed: {story_a} conflicts with {story_b}"

    # Launch multiple workers (ALL IN SINGLE MESSAGE)
    workers = []
    FOR i, story in enumerate(story_cluster):
        claim_story(story, f"worker-par-{i+1}")
        workers.append(launch_worker(story, f"worker-par-{i+1}"))

    # Wait for ALL workers to complete
    results = await_all_workers(workers)

  # 3C: Aggregate Results
  stories_completed += count_successes(results)

  # Handle blockers
  blockers = extract_blockers(results)
  IF blockers:
    FOR blocker in blockers:
        PRINT f"⚠️  Story {blocker.story_key} blocked: {blocker.reason}"
        # Update sprint-status to "blocked" status
        update_sprint_status(blocker.story_key, "blocked")

    # Determine if should halt or continue
    critical_blockers = filter_critical_blockers(blockers)
    IF critical_blockers:
        save_checkpoint(reason="CRITICAL_BLOCKER", blockers=critical_blockers)
        RETURN

  # 3D: Check Context
  IF remaining_context < 20%:
    save_checkpoint(reason="CONTEXT_DEPLETED")
    BREAK

  # Loop continues - Ultra Think will re-analyze available stories
  # (Dependencies may have resolved, new stories may be available)
```

**Key Loop Behaviors:**

1. **Re-runs Ultra Think each iteration:** Dependencies change as stories complete
2. **Dynamic mode selection:** Sequential (cluster=1) vs Parallel (cluster≥2)
3. **Safety validation:** Double-checks conflicts before parallel launch
4. **Blocker handling:** Distinguishes critical (halt) vs non-critical (log and continue)

### 3A: Story Selection via Ultra Think (Executed in Step 3)

**This section is now handled by Section 2.5's `select_next_cluster()` function.**

**Selection process:**
1. **Gather candidates** by priority tier (fixes > dependencies > backlog)
2. **Detect review outcomes** (BLOCKED/CHANGES_REQUESTED in story files)
3. **Analyze independence** (explicit deps, file overlap, API conflicts, epic relationships)
4. **Form clusters** (group independent stories together)
5. **Return first cluster** with tier metadata

**Metadata requirements:**

```yaml
# In story file frontmatter
depends_on: ["2-2", "2-3"]  # Explicit dependencies (or [] for none)
```

**Review outcome detection:**
- Reads story files for `## Senior Developer Review (AI)` section
- Checks for `**Outcome:** BLOCKED` or `**Outcome:** CHANGES REQUESTED`
- Stories with pending issues get highest priority (Tier 1)

**Independence criteria:**
- ✅ **Independent:** No shared files, different modules, no dependencies
- ❌ **Conflicting:** Shared files, same API endpoints, dependency chain, same epic (unless clearly separate)

### 3B: Worker Launch (Conditional: Sequential vs Parallel)

**MODE SELECTION:** Determined by cluster size from Section 3

**Sequential Mode (cluster_size == 1):**
- Launch single worker
- Wait for completion before proceeding
- Used for: single story in cluster (dependent or last remaining)

**Parallel Mode (cluster_size >= 2):**
- Launch ALL workers in SINGLE message (true parallelism)
- Wait for all completions before proceeding
- Used for: multiple independent stories in cluster

---

**Worker prompt template (used for both modes):**

```python
Task(
  subagent_type="bmad:bmad-dev",
  description=f"Story lifecycle worker {worker_id}",
  prompt=f"""
Execute complete lifecycle for: {story_key}

Worker ID: {worker_id}
Execution Mode: {mode}  # SEQUENTIAL or PARALLEL
Coordination: File-based via sprint-status.yaml

Process:
1. CLAIM: Update sprint-status.yaml: {story_key} → "locked-{worker_id}"

2. EXECUTE LIFECYCLE:
   a. /bmad:phase-4:create-story for {story_key}
      (Skip if story file already exists with content)

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
          Extract action items from review
          Re-run /bmad:phase-4:dev-story with items
          RETRY_COUNT += 1
          CONTINUE

        ELIF outcome == "BLOCKED":
          Report blocker (critical if infrastructure/external)
          BREAK

      IF RETRY_COUNT >= MAX_RETRIES AND not APPROVED:
        Mark as BLOCKED (reason: "Max retries exceeded")

3. RELEASE: Update sprint-status: {story_key} → "done" or "blocked"

4. REPORT (structured JSON):
   {{
     "worker_id": "{worker_id}",
     "story_key": "{story_key}",
     "mode": "{mode}",
     "status": "completed" | "blocked",
     "outcome": "approved" | "blocked" | "max_retries",
     "retry_count": <number>,
     "blocker": {{
       "reason": "<blocker description>",
       "critical": true | false
     }} if blocked
   }}

CRITICAL:
- Isolated context (enables parallel execution)
- Check sprint-status before EVERY operation (prevent race conditions)
- Update atomically (read-modify-write pattern)
- ENFORCE review loop (NON-NEGOTIABLE)
- NEVER mark done if ANY issues found
- Handle story file existence (resume from checkpoint scenario)
"""
)
```

**Launch examples:**

**Sequential launch (cluster_size = 1):**
```python
# Single worker, single message
result = Task(
  subagent_type="bmad:bmad-dev",
  description="Story lifecycle worker seq-1",
  prompt=worker_prompt(story="2-4", worker_id="worker-seq-1", mode="SEQUENTIAL")
)
```

**Parallel launch (cluster_size = 3):**
```python
# Three workers, SINGLE message with multiple Task calls
# Worker 1
Task(
  subagent_type="bmad:bmad-dev",
  description="Story lifecycle worker par-1",
  prompt=worker_prompt(story="3-1", worker_id="worker-par-1", mode="PARALLEL")
)

# Worker 2
Task(
  subagent_type="bmad:bmad-dev",
  description="Story lifecycle worker par-2",
  prompt=worker_prompt(story="3-2", worker_id="worker-par-2", mode="PARALLEL")
)

# Worker 3
Task(
  subagent_type="bmad:bmad-dev",
  description="Story lifecycle worker par-3",
  prompt=worker_prompt(story="3-3", worker_id="worker-par-3", mode="PARALLEL")
)

# ← All three launched in SINGLE message = true parallelism
```

### 3C-E: Monitor, Aggregate, Check Context

See [shared/common-operations.md#context-monitoring](../shared/common-operations.md)

**After each batch:**
- Collect worker results
- Handle blockers (critical → halt, non-critical → log)
- Update stories_completed
- Check context window (< 20% → save checkpoint)

### Checkpoint System

**Enhanced checkpoint tracks execution strategy context for intelligent resumption.**

When context < 20% or critical blocker:

```markdown
# Bring to Life - Progress Checkpoint

**Date:** {date} {time}
**Reason:** CONTEXT_DEPLETED | CRITICAL_BLOCKER | ALL_DONE

## Session Summary
- Stories Completed: {count}
- Stories Blocked: {count}
- Epics Contexted: {count}
- Epics Blocked: {count}
- Last Execution Mode: {SEQUENTIAL | PARALLEL}
- Last Cluster Size: {size}
- Last Tier: {PRIORITY_1_FIXES | PRIORITY_2_DEPENDENCIES | PRIORITY_3_BACKLOG}
- Context Usage: {percent}%

## Completed Stories
- ✅ {story-key} ({tier}, {mode}, worker-{id})
- ✅ {story-key} ({tier}, {mode}, worker-{id})
...

## Epic Context Generation
{if any epics were contexted or blocked}

**Contexted Epics:**
- ✅ {epic-key}: epic-tech-spec-{epic-key}.md created
...

**Blocked Epics:**
{if any}
- 🚫 {epic-key}: {error-reason}
  - Affected Stories: {list of stories that cannot proceed}
...

## Blocked Stories
{if any blockers}
- 🚫 {story-key}: {blocker-reason}
  - Critical: {yes/no}
  - Worker: {worker-id}
  - Retry Count: {count}
  - Review Outcome: {BLOCKED | CHANGES_REQUESTED | max_retries}
  - Action Items: {extracted from review if available}
...

## Dependency Graph State
{Snapshot of remaining work organized by dependencies}

**Priority 1 - Fixes (review/in-progress with pending issues):**
{if any}
- {story-key}: {pending-issue-summary}
...

**Priority 2 - Dependencies (explicit deps not satisfied):**
{if any}
- {story-key}: waiting on [{dep-1}, {dep-2}]
...

**Priority 3 - Backlog (ready to start):**
{if any}
- {story-key}: {no dependencies | deps satisfied}
...

## Next Run Strategy

**Recommended Approach:**
{Based on analysis}

{Example recommendations:}
- IF priority_1 exists:
  "Fix blocked stories first. Cluster analysis suggests {N} can run in parallel."

- IF priority_2 exists:
  "Work on stories with satisfied dependencies. Sequential execution recommended for dependency chain."

- IF only priority_3 exists:
  "Continue with backlog. Independence analysis suggests {N} stories can run in parallel."

**Specific Stories to Tackle:**
1. {story-key} ({reason why this one first})
2. {story-key} ({can run in parallel with #1 if independent})
...

## Resumption Instructions
1. Clear conversation (context depleted)
2. Re-run `/bmad:phase-4:bring-to-life`
3. Workflow auto-loads checkpoint
4. Ultra Think re-analyzes with checkpoint context
5. Continues with recommended strategy

## Context Notes
{Any important observations from this session}
- {note about patterns, common issues, etc.}

**Epic Context Notes:**
- Total epics processed: {contexted + blocked}
- Epic context generation added {estimated tokens} to context usage
- {any patterns observed in epic context generation}
...
```

Save to: `{sprint_artifacts}/bring-to-life-checkpoint.md`

**Checkpoint Loading (Section 2):**

When resuming from checkpoint:
1. Extract `stories_completed` count
2. Read `Dependency Graph State` to understand pending work
3. Read `Blocked Stories` to prioritize fixes
4. Use `Next Run Strategy` to inform Ultra Think analysis
5. Continue from where previous session stopped

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

- **File locks prevent races:** Workers use sprint-status.yaml atomically (read-modify-write)
- **Review loop enforced:** Workers MUST NOT skip review validation (non-negotiable)
- **20% context threshold:** Ensures safe checkpoint creation with room for cleanup
- **Dynamic parallelism:** Workers launched based on independence analysis (1-4 workers)
- **Priority-based selection:** Fixes > Dependencies > Backlog (status determines priority)
- **Independence-based execution:** Clustering determines sequential vs parallel (conflicts prevent parallelism)
- **Ultra Think re-analysis:** Runs every iteration (dependencies change as work completes)
- **Enhanced checkpoints:** Track dependency graph state, not just completion count
- **Safety validation:** Double-check conflicts before parallel launch (prevent race conditions)

## Auto-Continue

**NO auto-continue** - This is a terminal workflow that runs until complete or blocked.

User re-runs manually after:
- Clearing conversation (context depleted)
- Resolving blockers
- All stories complete (moves to retrospectives)

## Notes

- **Intelligent parallelism:** Uses Ultra Think to determine optimal execution strategy
- **Priority-aware:** Always handles pending issues before new work
- **Independence analysis:** Detects conflicts (file overlap, API changes, dependencies)
- **Dynamic mode selection:** Sequential for dependent work, parallel for independent work
- **Enhanced dependency tracking:** Respects explicit deps + detects implicit conflicts
- **File-based coordination:** No shared state, clean worker isolation
- **Enhanced checkpoint system:** Multi-session workflows with strategic context
- **Review enforcement:** Quality loop runs automatically, non-negotiable
- **No user prompts:** Fully autonomous until context depleted or critical blocker

**Performance:**
- Sequential mode: 1 story at a time (when conflicts exist or single story remaining)
- Parallel mode: 2-4 stories simultaneously (when verified independent)
- Speed gain: Varies by project (highly dependent work → minimal gain; independent work → 3-4x faster)

**Philosophy:**
Intelligent automation over blind parallelism. Prioritize correctness (handle pending issues first), maximize efficiency (parallel when safe), respect constraints (context + dependencies), provide clear resumption path (enhanced checkpoints with strategic guidance).

---

**References:**
- Examples: [examples/bring-to-life.md](../examples/bring-to-life.md)
- Troubleshooting: [shared/troubleshooting.md#bring-to-life](../shared/troubleshooting.md)
- Philosophy: [shared/design-philosophy.md#parallel-execution](../shared/design-philosophy.md)
- Common Operations: [shared/common-operations.md](../shared/common-operations.md)
