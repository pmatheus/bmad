---
description: Break down ALL sprints in parallel using subagents for granular task generation
runInPlanMode: false
---

# Breakdown Sprints - Parallel Multi-Sprint Task Generation

## Purpose

Break down ALL sprints in the project into granular, actionable development tasks using parallel subagent processing. This command discovers all sprints in the sprint artifacts directory, creates a task tracking list, and processes up to 4 sprints simultaneously using dedicated subagents. Each subagent applies the breakdown-sprint workflow logic to generate 5 types of tasks (setup, implementation, testing, documentation, review) with standards and specifications context. The result is a comprehensive task breakdown across all sprints ready for implementation.

## Variables

**Sprint Discovery**:
- `{sprint_artifacts}` - Sprint artifacts directory from config (usually `.bmad/sprint-artifacts`)
- `{sprint_pattern}` - Pattern to match sprint directories (`sprint-*/`)
- `{discovered_sprints}` - List of all sprint IDs found in sprint_artifacts

**Parallel Processing**:
- `{batch_size}` - Maximum parallel subagents (default: 4)
- `{current_batch}` - Current batch being processed
- `{total_batches}` - Total number of batches needed

**Task Tracking**:
- `{sprints_to_process}` - List of sprints that need breakdown (have sprint-plan.yaml but no tasks)
- `{sprints_completed}` - List of sprints with tasks already generated
- `{sprints_skipped}` - List of sprints skipped (no sprint-plan.yaml or other issues)

**Directory Paths** (inherited from breakdown-sprint):
- `{documentation_dir}` - Documentation directory from config (usually `.bmad/documentation`)
- `{bmad_dir}` - BMAD directory from config (usually `.bmad`)

**Configuration Files**:
- `{bmad_dir}/config.yaml` - Project configuration
- `{sprint_artifacts}/sprint-status.yaml` - Sprint tracking across all sprints
- `{sprint_artifacts}/sprint-N/sprint-plan.yaml` - Individual sprint plans
- `{sprint_artifacts}/sprint-N/breakdown-summary.md` - Per-sprint breakdown summaries

**Aggregation Output**:
- `{sprint_artifacts}/all-sprints-breakdown-summary.md` - Master summary across all sprints
- `{sprint_artifacts}/breakdown-timestamp.txt` - Timestamp of breakdown completion

## Instructions

**Prerequisites**: Ensure sprint planning completed for all sprints (`/bmad:sprint-planning`), sprint artifacts exist with sprint plans, stories created, and standards copied to `{bmad_dir}/standards/`.

### 1. Discover All Sprints

1.1. Read `{bmad_dir}/config.yaml` to get `sprint_artifacts` path

1.2. List all directories matching pattern `{sprint_artifacts}/sprint-*/`

1.3. For each discovered sprint directory:
   - Extract sprint ID (e.g., "sprint-1", "sprint-2", "sprint-3")
   - Check for existence of `sprint-plan.yaml`
   - Check for existing task breakdown files (`stories/*-tasks.yaml`)
   - Categorize as: needs_breakdown, already_broken_down, or incomplete

1.4. **Error Handling**:
   - If no sprint directories found, error: "No sprints found in {sprint_artifacts}/. Run /bmad:sprint-planning first"
   - If `config.yaml` missing, error: "Config file not found. Run /bmad:workflow-init first"

### 2. Create Task Tracking List

2.1. Use TodoWrite tool to create task list with all sprints that need breakdown:
   - Status: pending for each sprint to process
   - Content format: "Break down sprint-{N}" (imperative form)
   - ActiveForm format: "Breaking down sprint-{N}" (present continuous)

2.2. Display summary to user:
   - Total sprints discovered
   - Sprints needing breakdown
   - Sprints already broken down (if any)
   - Sprints with issues (missing sprint-plan.yaml, etc.)

2.3. If no sprints need breakdown:
   - Display message: "All sprints already have task breakdowns"
   - Ask user: "Regenerate? (yes/no)"
   - If no, exit with success message

### 3. Process Sprints in Parallel Batches

3.1. **Calculate Batching**:
   - Determine total batches needed: `ceil(sprints_to_process / batch_size)`
   - Split sprints into batches of up to 4

3.2. **For Each Batch**:

   3.2.1. Mark batch sprints as in_progress in TodoWrite (exactly 1-4 tasks)

   3.2.2. Create parallel Task tool calls (1-4 simultaneous subagents):

   Each subagent receives this delegation prompt:
   ```
   You are tasked with breaking down sprint-{N} into granular development tasks.

   Read /Users/user/BMAD-METHOD/commands/breakdown-sprint.md and follow its Instructions section exactly for sprint-{N}.

   Execute all 8 instruction steps:
   1. Identify Target Sprint (sprint-{N})
   2. Load Story Details for all stories in sprint
   3. Gather Context (specs and standards)
   4. Generate Granular Tasks (5 types)
   5. Resolve Task Dependencies
   6. Save Tasks to YAML
   7. Update Sprint Status
   8. Generate Summary Report

   Report back with structured results:

   ## Sprint {N} Breakdown Results

   **Status**: Success | Failed | Partial

   **Stories Processed**: {count}
   - Story IDs: [{list}]

   **Tasks Generated**: {total_count}
   - Setup: {count}
   - Implementation: {count}
   - Testing: {count}
   - Documentation: {count}
   - Review: {count}

   **Time Estimates**: {min}-{max} hours

   **Files Created**:
   - [{list of task YAML files}]
   - {breakdown-summary.md path}

   **Standards Referenced**: {count} unique standards
   - Most used: [{top 3 with counts}]

   **Specs Referenced**: {count} unique specs
   - Most used: [{top 3 with counts}]

   **Errors/Warnings**:
   - [{list any issues encountered}]

   **Next Steps**: Ready for /bmad:bring-to-life
   ```

   3.2.3. Wait for all subagents in batch to complete

   3.2.4. Mark completed sprints as completed in TodoWrite

   3.2.5. Collect results from each subagent response

   3.2.6. Handle errors:
      - If subagent fails, mark sprint with error status
      - Log error message for aggregation report
      - Continue with next batch (don't abort)

3.3. **Progress Tracking**:
   - After each batch, display: "Batch {N}/{total} complete: {sprints} processed"
   - Update TodoWrite status for completed sprints
   - Continue to next batch

### 4. Aggregate Results Across All Sprints

4.1. **Collect Per-Sprint Data** from subagent responses:
   - Stories processed per sprint
   - Tasks generated per sprint (by type)
   - Time estimates per sprint
   - Standards usage per sprint
   - Specs usage per sprint
   - Errors/warnings per sprint

4.2. **Calculate Aggregate Statistics**:
   - Total sprints processed
   - Total stories across all sprints
   - Total tasks across all sprints (by type breakdown)
   - Total time estimates (min-max range)
   - Most referenced standards (aggregate counts)
   - Most referenced specs (aggregate counts)
   - Success rate (sprints completed / sprints attempted)

4.3. **Identify Cross-Sprint Patterns**:
   - Common standards used across all sprints
   - Common specs referenced across all sprints
   - Average tasks per story
   - Average time per sprint
   - Task type distribution trends

### 5. Generate Master Summary Report

5.1. Create `{sprint_artifacts}/all-sprints-breakdown-summary.md` with:

```markdown
# All Sprints Breakdown Summary

**Generated**: {timestamp}
**Total Sprints Processed**: {count}
**Total Stories**: {count}
**Total Tasks**: {count}
**Estimated Total Time**: {min}-{max} hours

## Sprint Overview

| Sprint | Stories | Tasks | Est. Time | Status | Summary File |
|--------|---------|-------|-----------|--------|--------------|
| sprint-1 | {count} | {count} | {hours} | ✓ | [Link](sprint-1/breakdown-summary.md) |
| sprint-2 | {count} | {count} | {hours} | ✓ | [Link](sprint-2/breakdown-summary.md) |
| ... | ... | ... | ... | ... | ... |

## Task Distribution Across All Sprints

- **Setup Tasks**: {count} ({percentage}%)
- **Implementation Tasks**: {count} ({percentage}%)
- **Testing Tasks**: {count} ({percentage}%)
- **Documentation Tasks**: {count} ({percentage}%)
- **Review Tasks**: {count} ({percentage}%)

## Most Referenced Standards

1. `{standard-path}` - {count} references across {sprint-count} sprints
2. `{standard-path}` - {count} references across {sprint-count} sprints
3. `{standard-path}` - {count} references across {sprint-count} sprints
...

## Most Referenced Specifications

1. `{spec-path}` - {count} references across {sprint-count} sprints
2. `{spec-path}` - {count} references across {sprint-count} sprints
3. `{spec-path}` - {count} references across {sprint-count} sprints
...

## Breakdown Quality Metrics

- **Average Tasks per Story**: {number}
- **Average Time per Story**: {hours}
- **Task Granularity**: {percentage}% within 15-90min range
- **Standards Coverage**: {percentage}% of tasks reference standards
- **Spec Alignment**: {percentage}% of tasks reference specs

## Errors and Warnings

{List any errors or warnings from any sprint breakdown}

## Per-Sprint Details

### Sprint 1
- Stories: [{list}]
- Tasks: {count} ({type breakdown})
- Time: {min}-{max} hours
- File: [breakdown-summary.md](sprint-1/breakdown-summary.md)

### Sprint 2
- Stories: [{list}]
- Tasks: {count} ({type breakdown})
- Time: {min}-{max} hours
- File: [breakdown-summary.md](sprint-2/breakdown-summary.md)

...

## Next Steps

1. Review individual sprint breakdowns in respective directories
2. Adjust any task breakdowns if needed (edit YAML files)
3. Run `/bmad:bring-to-life` to start parallel implementation across sprints
4. Use sprint-status.yaml to track overall progress

## Files Generated

**Per Sprint**:
- `sprint-{N}/stories/{story-id}-tasks.yaml` - Task breakdowns
- `sprint-{N}/breakdown-summary.md` - Sprint-specific summary

**Aggregate**:
- `all-sprints-breakdown-summary.md` - This file
- `breakdown-timestamp.txt` - Completion timestamp
```

5.2. Save timestamp to `{sprint_artifacts}/breakdown-timestamp.txt`

5.3. Update `{sprint_artifacts}/sprint-status.yaml`:
   - Add `all_sprints_breakdown_complete: true`
   - Add `breakdown_timestamp: {timestamp}`
   - Add `total_tasks_generated: {count}`

### 6. Display Results to User

6.1. Display final aggregated summary:
   - Total sprints processed
   - Total stories and tasks
   - Total estimated time
   - Success/failure counts
   - Link to master summary file

6.2. Display any errors or warnings from any sprint

6.3. Display next steps guidance

## Workflow

```
START
  ↓
[Read Config & Sprint Artifacts Path]
  ↓
[Discover All Sprint Directories]
  ├─ List sprint-*/ directories
  ├─ Check for sprint-plan.yaml
  ├─ Check for existing task files
  └─ Categorize: needs_breakdown, complete, incomplete
  ↓
[Create Task Tracking List] ← TodoWrite
  ├─ Add all sprints needing breakdown
  ├─ Set status: pending
  └─ Display summary to user
  ↓
[Calculate Batching]
  ├─ Total sprints / batch_size (4)
  └─ Create batch groups
  ↓
[FOR EACH BATCH] ←───────────────────┐
  ↓                                  │
[Mark Batch Sprints as in_progress]  │
  (TodoWrite: exactly 1-4 tasks)     │
  ↓                                  │
[Launch Parallel Subagents]          │
  ├─ Task 1: Sprint N subagent       │
  ├─ Task 2: Sprint N+1 subagent     │
  ├─ Task 3: Sprint N+2 subagent     │
  └─ Task 4: Sprint N+3 subagent     │
  ↓                                  │
[Wait for All Subagents to Complete] │
  ↓                                  │
[Collect Subagent Results]           │
  ├─ Parse structured responses      │
  ├─ Extract stats, files, errors    │
  └─ Store per-sprint results        │
  ↓                                  │
[Mark Batch Sprints as completed]    │
  (TodoWrite: update status)         │
  ↓                                  │
[Display Batch Progress]             │
  └─ "Batch X/Y complete"            │
  ↓                                  │
[Next Batch?] ───Yes────────────────┘
  │
  No
  ↓
[Aggregate Results]
  ├─ Sum totals across sprints
  ├─ Calculate averages
  ├─ Identify patterns
  └─ Compile errors/warnings
  ↓
[Generate Master Summary Report]
  ├─ Create all-sprints-breakdown-summary.md
  ├─ Save breakdown timestamp
  └─ Update sprint-status.yaml
  ↓
[Display Final Results]
  ├─ Show aggregate statistics
  ├─ Show success/failure counts
  ├─ Link to summary file
  └─ Display next steps
  ↓
END
```

**Error Handling Points**:
- No sprints found → Error: "Run /bmad:sprint-planning first"
- Config missing → Error: "Run /bmad:workflow-init first"
- Subagent failure → Log error, continue with other sprints (don't abort entire process)
- Missing sprint-plan.yaml → Skip sprint, log warning
- All sprints already broken down → Ask user to confirm regeneration

**Parallelization Strategy**:
- Process 4 sprints simultaneously (configurable via batch_size)
- Each sprint gets independent subagent with full breakdown-sprint logic
- Subagents work in isolation (no shared state except file system)
- Results aggregated after all batches complete

**Integration Point**: Generated tasks across all sprints are consumed by `/bmad:bring-to-life` which can process multiple sprints in parallel or sequentially based on dependencies and resource availability.

## Report

### Console Output Format

Display progress as batches are processed:

```
Breakdown Sprints - Parallel Multi-Sprint Processing
Discovered {count} sprints in {sprint_artifacts}/

Sprint Categorization:
- Need breakdown: {count} sprints [{list of IDs}]
- Already broken down: {count} sprints [{list of IDs}]
- Incomplete/Skipped: {count} sprints [{list of IDs with reasons}]

Processing {count} sprints in {batch_count} batches of up to 4...

═══════════════════════════════════════════════════════════
Batch 1/{batch_count} - Processing 4 sprints in parallel...
═══════════════════════════════════════════════════════════

→ Launching subagent for sprint-1...
→ Launching subagent for sprint-2...
→ Launching subagent for sprint-3...
→ Launching subagent for sprint-4...

[Subagents running in parallel...]

✓ sprint-1 complete: 5 stories, 36 tasks, 19-26 hours
✓ sprint-2 complete: 4 stories, 28 tasks, 15-20 hours
✓ sprint-3 complete: 6 stories, 42 tasks, 22-30 hours
✓ sprint-4 complete: 5 stories, 35 tasks, 18-24 hours

Batch 1/{batch_count} complete: 4 sprints processed

═══════════════════════════════════════════════════════════
Batch 2/{batch_count} - Processing 2 sprints in parallel...
═══════════════════════════════════════════════════════════

→ Launching subagent for sprint-5...
→ Launching subagent for sprint-6...

[Subagents running in parallel...]

✓ sprint-5 complete: 5 stories, 38 tasks, 20-27 hours
✓ sprint-6 complete: 3 stories, 22 tasks, 12-16 hours

Batch 2/{batch_count} complete: 2 sprints processed

═══════════════════════════════════════════════════════════
All Batches Complete - Aggregating Results...
═══════════════════════════════════════════════════════════

Final Summary:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total Sprints Processed: 6/6 (100% success)
Total Stories: 28
Total Tasks: 201
  - Setup: 45 tasks (22%)
  - Implementation: 80 tasks (40%)
  - Testing: 42 tasks (21%)
  - Documentation: 20 tasks (10%)
  - Review: 14 tasks (7%)

Estimated Total Time: 106-143 hours

Task Quality Metrics:
- Average tasks per story: 7.2
- Average time per story: 3.8-5.1 hours
- Granularity (15-90min): 94%
- Standards coverage: 98%
- Spec alignment: 96%

Most Referenced Standards:
1. global/coding-style.md (156 references across 6 sprints)
2. global/error-handling.md (142 references across 6 sprints)
3. testing/test-writing.md (98 references across 6 sprints)

Most Referenced Specs:
1. technical/backend-spec.md (168 references across 6 sprints)
2. design/ux-spec.md (124 references across 6 sprints)
3. design/ui-spec.md (89 references across 6 sprints)

Per-Sprint Details:
┌─────────┬─────────┬───────┬────────────┬────────┐
│ Sprint  │ Stories │ Tasks │ Est. Time  │ Status │
├─────────┼─────────┼───────┼────────────┼────────┤
│ sprint-1│    5    │  36   │ 19-26 hrs  │   ✓    │
│ sprint-2│    4    │  28   │ 15-20 hrs  │   ✓    │
│ sprint-3│    6    │  42   │ 22-30 hrs  │   ✓    │
│ sprint-4│    5    │  35   │ 18-24 hrs  │   ✓    │
│ sprint-5│    5    │  38   │ 20-27 hrs  │   ✓    │
│ sprint-6│    3    │  22   │ 12-16 hrs  │   ✓    │
└─────────┴─────────┴───────┴────────────┴────────┘

Errors/Warnings: None

✓ All sprint breakdowns complete!

Summary saved to: {sprint_artifacts}/all-sprints-breakdown-summary.md

Next Steps:
1. Review master summary: {sprint_artifacts}/all-sprints-breakdown-summary.md
2. Review individual sprint breakdowns in each sprint-N/ directory
3. Adjust any task breakdowns if needed (edit YAML files)
4. Run /bmad:bring-to-life to start parallel implementation
```

### Generated Artifacts

**Per Sprint** (created by subagents):
- File: `{sprint_artifacts}/sprint-N/stories/{story-id}-tasks.yaml`
- Contains: All tasks with dependencies, estimates, standards/spec references

**Per Sprint Summary** (created by subagents):
- File: `{sprint_artifacts}/sprint-N/breakdown-summary.md`
- Contains: Sprint-specific breakdown statistics

**Master Aggregated Summary**:
- File: `{sprint_artifacts}/all-sprints-breakdown-summary.md`
- Contains:
  - Aggregate statistics across all sprints
  - Per-sprint overview table
  - Task distribution across all sprints
  - Most referenced standards and specs (with cross-sprint counts)
  - Quality metrics (averages, percentages)
  - Errors/warnings from all sprints
  - Per-sprint details with links
  - Next steps guidance

**Timestamp File**:
- File: `{sprint_artifacts}/breakdown-timestamp.txt`
- Contains: ISO timestamp of breakdown completion

**Updated Files**:
- File: `{sprint_artifacts}/sprint-status.yaml`
- Updates:
  - `all_sprints_breakdown_complete: true`
  - `breakdown_timestamp: {timestamp}`
  - `total_tasks_generated: {count}`
  - Per-sprint task counts

### Parallel Processing Benefits

Report highlights of parallel approach:

1. **Speed**: 4x faster than sequential processing
   - 6 sprints processed in 2 batches instead of 6 sequential runs
   - Total time: ~10-15 minutes vs 40-60 minutes sequential

2. **Consistency**: All sprints use same breakdown logic
   - Each subagent executes identical breakdown-sprint workflow
   - Standards and specs applied uniformly

3. **Independence**: Sprints processed without interference
   - No shared state between subagents
   - Failures isolated to individual sprints

4. **Scalability**: Handles any number of sprints
   - Automatic batching for large projects
   - Configurable batch_size for resource management

### Error and Warning Messages

**Errors** (stop execution):
- "No sprints found in {sprint_artifacts}/. Run /bmad:sprint-planning first"
- "Config file not found: {path}. Run /bmad:workflow-init first"
- "Sprint artifacts directory not found: {path}"

**Warnings** (continue with limitations):
- "Sprint {N} missing sprint-plan.yaml, skipping"
- "Sprint {N} already has task breakdowns. Include in regeneration? (yes/no)"
- "Subagent for sprint-{N} failed: {error message}. See sprint log for details"
- "Sprint {N} breakdown partial: {count} stories failed"

### Best Practices for Parallel Breakdown

Report adherence to these quality criteria:

1. **Batch Size**: Default 4 concurrent subagents
   - Balances speed vs resource usage
   - Prevents overwhelming system with too many parallel processes

2. **Task Tracking**: Real-time status updates
   - TodoWrite keeps user informed of progress
   - Shows which sprints are pending, in_progress, completed

3. **Error Isolation**: Individual sprint failures don't abort entire process
   - Log errors for failed sprints
   - Continue with remaining sprints
   - Report failures in final summary

4. **Result Aggregation**: Comprehensive cross-sprint analysis
   - Identify patterns across all sprints
   - Calculate aggregate statistics
   - Provide project-level insights

5. **Delegation Pattern**: Clear subagent responsibilities
   - Each subagent receives complete breakdown-sprint instructions
   - Structured response format for easy parsing
   - Independent execution with clear success/failure criteria

### Example Complete Session Output

```bash
$ /bmad:breakdown-sprints

Breakdown Sprints - Parallel Multi-Sprint Processing
Discovered 6 sprints in .bmad/sprint-artifacts/

Sprint Categorization:
- Need breakdown: 6 sprints [sprint-1, sprint-2, sprint-3, sprint-4, sprint-5, sprint-6]
- Already broken down: 0 sprints
- Incomplete/Skipped: 0 sprints

Processing 6 sprints in 2 batches of up to 4...

═══════════════════════════════════════════════════════════
Batch 1/2 - Processing 4 sprints in parallel...
═══════════════════════════════════════════════════════════

→ Launching subagent for sprint-1...
→ Launching subagent for sprint-2...
→ Launching subagent for sprint-3...
→ Launching subagent for sprint-4...

[Processing... This may take 5-10 minutes depending on sprint complexity]

✓ sprint-1 complete: 5 stories, 36 tasks (8 setup, 15 impl, 7 test, 4 docs, 2 review), 19-26 hours
✓ sprint-2 complete: 4 stories, 28 tasks (6 setup, 12 impl, 6 test, 3 docs, 1 review), 15-20 hours
✓ sprint-3 complete: 6 stories, 42 tasks (9 setup, 18 impl, 9 test, 4 docs, 2 review), 22-30 hours
✓ sprint-4 complete: 5 stories, 35 tasks (8 setup, 14 impl, 8 test, 3 docs, 2 review), 18-24 hours

Batch 1/2 complete: 4 sprints processed (141 tasks, 74-100 hours)

═══════════════════════════════════════════════════════════
Batch 2/2 - Processing 2 sprints in parallel...
═══════════════════════════════════════════════════════════

→ Launching subagent for sprint-5...
→ Launching subagent for sprint-6...

[Processing...]

✓ sprint-5 complete: 5 stories, 38 tasks (8 setup, 16 impl, 8 test, 4 docs, 2 review), 20-27 hours
✓ sprint-6 complete: 3 stories, 22 tasks (6 setup, 9 impl, 4 test, 2 docs, 1 review), 12-16 hours

Batch 2/2 complete: 2 sprints processed (60 tasks, 32-43 hours)

═══════════════════════════════════════════════════════════
All Batches Complete - Aggregating Results...
═══════════════════════════════════════════════════════════

Final Summary:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total Sprints Processed: 6/6 (100% success)
Total Stories: 28
Total Tasks: 201
  - Setup: 45 tasks (22%)
  - Implementation: 80 tasks (40%)
  - Testing: 42 tasks (21%)
  - Documentation: 20 tasks (10%)
  - Review: 14 tasks (7%)

Estimated Total Time: 106-143 hours

Task Quality Metrics:
- Average tasks per story: 7.2
- Average time per story: 3.8-5.1 hours
- Granularity (15-90min): 94% tasks in optimal range
- Standards coverage: 98% tasks reference standards
- Spec alignment: 96% tasks reference specs

Most Referenced Standards:
1. global/coding-style.md (156 references across 6 sprints)
2. global/error-handling.md (142 references across 6 sprints)
3. testing/test-writing.md (98 references across 6 sprints)
4. global/conventions.md (87 references across 6 sprints)
5. backend/api.md (76 references across 5 sprints)

Most Referenced Specs:
1. technical/backend-spec.md (168 references across 6 sprints)
2. design/ux-spec.md (124 references across 6 sprints)
3. design/ui-spec.md (89 references across 6 sprints)
4. technical/architecture.md (145 references across 6 sprints)

Per-Sprint Details:
┌─────────┬─────────┬───────┬────────────┬────────┬────────────────────────────────────┐
│ Sprint  │ Stories │ Tasks │ Est. Time  │ Status │ Summary File                       │
├─────────┼─────────┼───────┼────────────┼────────┼────────────────────────────────────┤
│ sprint-1│    5    │  36   │ 19-26 hrs  │   ✓    │ sprint-1/breakdown-summary.md      │
│ sprint-2│    4    │  28   │ 15-20 hrs  │   ✓    │ sprint-2/breakdown-summary.md      │
│ sprint-3│    6    │  42   │ 22-30 hrs  │   ✓    │ sprint-3/breakdown-summary.md      │
│ sprint-4│    5    │  35   │ 18-24 hrs  │   ✓    │ sprint-4/breakdown-summary.md      │
│ sprint-5│    5    │  38   │ 20-27 hrs  │   ✓    │ sprint-5/breakdown-summary.md      │
│ sprint-6│    3    │  22   │ 12-16 hrs  │   ✓    │ sprint-6/breakdown-summary.md      │
└─────────┴─────────┴───────┴────────────┴────────┴────────────────────────────────────┘

Errors/Warnings: None

Files Generated:
- 28 story task files (stories/{story-id}-tasks.yaml)
- 6 sprint summaries (sprint-N/breakdown-summary.md)
- 1 master summary (all-sprints-breakdown-summary.md)
- Updated sprint-status.yaml with task counts

✓ All sprint breakdowns complete!

Processing Time: ~12 minutes (vs ~60 minutes sequential)

Summary saved to: .bmad/sprint-artifacts/all-sprints-breakdown-summary.md

Next Steps:
1. Review master summary: .bmad/sprint-artifacts/all-sprints-breakdown-summary.md
2. Review individual sprint breakdowns in each sprint-N/ directory
3. Adjust any task breakdowns if needed (edit YAML files directly)
4. Run /bmad:bring-to-life to start parallel implementation across all sprints
5. Use sprint-status.yaml to track overall project progress
```
