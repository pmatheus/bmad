---
description: Run after epic completion to review success, extract lessons learned, and prepare for the next epic
---

# Retrospective - Epic Completion Review

## Purpose

Facilitates a team retrospective after epic completion to review execution, extract lessons learned, check follow-through on previous commitments, identify discoveries that may affect the next epic, and prepare the team for future work.

This workflow uses **Party Mode** - natural multi-agent conversation with the user actively participating as Project Lead. All agent dialogue uses the format: `Name (Role): dialogue` to create authentic team dynamics.

**Use retrospective after:**
- Epic is fully or mostly complete (all stories done)
- Need to capture lessons learned from epic execution
- Planning to start next epic and want to prepare properly
- Team wants to reflect on what went well and what didn't

**Prerequisites:**
- BMAD plugin installed in Claude Code
- Epic marked complete in sprint-status.yaml (or near completion)
- Story files exist in sprint artifacts folder

## Variables

The following variables are used throughout this workflow:

**Configuration Variables:**
- `{bmad_folder}` - BMAD plugin installation directory (from .bmad/config.yaml)
- `{documentation_dir}` - Directory containing epics, PRD, architecture (from .bmad/config.yaml)
- `{sprint_artifacts}` - Directory containing stories and sprint-status.yaml (from .bmad/config.yaml)
- `{user_name}` - User's name for Party Mode dialogue (from .bmad/config.yaml)

**Epic Variables:**
- `{epic_number}` - Current epic number being reviewed
- `{prev_epic_num}` - Previous epic number (epic_number - 1)
- `{next_epic_num}` - Next epic number (epic_number + 1)
- `{epic_title}` - Title of the current epic
- `{next_epic_title}` - Title of the next epic

**Story Variables:**
- `{total_stories}` - Total number of stories in the epic
- `{completed_stories}` - Number of stories marked "done"
- `{done_stories}` - Count of completed stories
- `{pending_count}` - Number of stories not yet complete

**Metrics Variables:**
- `{completion_percentage}` - Percentage of stories completed
- `{actual_points}` - Actual story points delivered
- `{actual_sprints}` - Actual number of sprints used
- `{points_per_sprint}` - Average velocity (points/sprint)
- `{blocker_count}` - Number of blockers encountered
- `{debt_count}` - Number of technical debt items
- `{incident_count}` - Number of production incidents

**Action Variables:**
- `{action_count}` - Number of action items committed
- `{prep_task_count}` - Number of preparation tasks for next epic
- `{critical_count}` - Number of critical path items
- `{prep_days}` - Estimated days for preparation work

**Pattern Analysis Variables:**
- `{pattern_1_description}` - Description of first pattern found
- `{pattern_1_count}` - Number of stories where pattern appeared
- `{pattern_2_description}` - Description of second pattern found

**Date Variables:**
- `{YYYY-MM-DD}` - Current date in ISO format
- `{date}` - Current date for file naming

**Boolean Flags:**
- `{partial_retrospective}` - True if retro run before all stories complete
- `{first_retrospective}` - True if no previous retro exists
- `{next_epic_exists}` - True if next epic is defined

## Instructions

### 1. Identify Completed Epic

Read `.bmad/config.yaml` to get `documentation_dir`, `sprint_artifacts`, and `user_name`.

Load sprint status file from `{sprint_artifacts}/sprint-status.yaml` (primary) or `{documentation_dir}/sprint-status.yaml` (fallback).

Read ALL development_status entries from sprint-status.yaml and find the highest epic number with at least one story marked "done". Extract epic number from keys like "epic-X-retrospective" or story keys like "X-Y-story-name". Set detected_epic = highest epic number found.

Present finding to user using Party Mode:

```
Bob (Scrum Master): "Welcome to the retrospective, {user_name}. Let me help you identify which epic we just completed. I'll check sprint-status first, but you're the ultimate authority on what we're reviewing today."

Bob (Scrum Master): "Based on sprint-status.yaml, it looks like Epic {detected_epic} was recently completed. Is that the epic you want to review today?"
```

Use AskUserQuestion tool to confirm or get correct epic number. If user selects different epic, prompt for the correct number. If no epic detected, ask user directly or scan story directory.

Verify epic completion by finding all stories for the epic (keys starting with "{epic_number}-", excluding epic key and retrospective key). Count total stories and stories with status = "done".

If epic is not complete, present status and use AskUserQuestion to let user decide: (1) Complete remaining stories first, (2) Continue with partial retrospective, or (3) Run sprint-planning. If user chooses to halt, end workflow. If continuing, set partial_retrospective = true and warn about potential gaps.

### 2. Deep Story Analysis - Extract Lessons from Implementation

Introduce analysis phase in Party Mode.

Read all story files matching pattern: `{sprint_artifacts}/{epic_number}-*-*.md`

For each story, extract and analyze:

**Dev Notes and Struggles:** Look for sections "Dev Notes", "Implementation Notes", "Challenges", "Development Log". Identify where developers struggled, unexpected complexity, technical decisions that didn't work, estimate accuracy.

**Review Feedback Patterns:** Look for "Review", "Code Review", "SM Review", "Scrum Master Review". Identify recurring feedback themes, quality concerns, architectural misalignments, exemplary work.

**Lessons Learned:** Look for "Lessons Learned", "Retrospective Notes", "Takeaways". Extract explicit lessons, "aha moments", what would be done differently, successful experiments.

**Technical Debt Incurred:** Look for "Technical Debt", "TODO", "Known Issues", "Future Work". Document shortcuts taken, debt affecting next epic, severity and priority.

**Testing and Quality Insights:** Look for "Testing", "QA Notes", "Test Results". Note testing challenges, bug patterns, coverage gaps.

Synthesize patterns across all stories:
- Common struggles (issues in 2+ stories)
- Recurring review feedback themes
- Breakthrough moments and innovations
- Velocity patterns and trends

Present findings to team in Party Mode before moving to next step.

### 3. Load and Integrate Previous Epic Retrospective

Calculate prev_epic_num = epic_number - 1.

If prev_epic_num >= 1, search for previous retrospective file matching pattern: `{sprint_artifacts}/epic-{prev_epic_num}-retro-*.md`

If previous retro found, read the complete file and extract:
- Action items committed
- Lessons learned
- Process improvements
- Technical debt flagged
- Team agreements
- Preparation tasks

Cross-reference with current epic execution:

**Action Item Follow-Through:** For each action item from Epic {prev_epic_num} retro, check if it was completed by looking for evidence in current epic's story records. Mark each: ✅ Completed, ⏳ In Progress, ❌ Not Addressed.

**Lessons Applied:** For each lesson from Epic {prev_epic_num}, check if team applied it. Document successes and missed opportunities.

**Process Improvements Effectiveness:** For each process change, assess if it helped. Did it improve velocity, quality, or satisfaction? Should we keep, modify, or abandon?

**Technical Debt Status:** For each debt item from Epic {prev_epic_num}, check if addressed. Did unaddressed debt cause problems in Epic {epic_number}?

Present findings in Party Mode with specific counts (completed, in-progress, not addressed).

If no previous retro found, acknowledge this is likely the first retrospective and set first_retrospective = true.

### 4. Preview Next Epic with Change Detection

Calculate next_epic_num = epic_number + 1.

Attempt to load next epic by checking sharded file first: `{documentation_dir}/*epic*/epic-{next_epic_num}.md`. If not found, fallback to whole document: `{documentation_dir}/*epic*.md` and extract Epic {next_epic_num} section.

If next epic found, analyze for:
- Epic title and objectives
- Planned stories and complexity estimates
- Dependencies on Epic {epic_number} work
- New technical requirements
- Potential risks or unknowns
- Business goals and success criteria

Identify dependencies on completed work, note potential gaps or preparation needed (technical setup, knowledge gaps, refactoring, documentation).

Present next epic preview in Party Mode with dependency and preparation analysis. Set next_epic_exists = true.

If next epic NOT found, acknowledge end of roadmap or incomplete planning. Set next_epic_exists = false.

### 5. Initialize Retrospective with Rich Context

Read `{bmad_folder}/_cfg/agent-manifest.csv` to identify participating agents. Ensure key roles present: Product Owner, Scrum Master, Developers, Testing/QA, Architect.

Present epic summary in Party Mode with complete formatted output including:
- Delivery metrics (completed stories, velocity, duration, average velocity)
- Quality and technical metrics (blockers, tech debt, test coverage, incidents)
- Business outcomes (goals achieved, success criteria)

If next epic exists, include next epic preview section with dependencies, preparation needed, and technical prerequisites.

Set ground rules in Party Mode:
- Team roster
- Focus on learning and preparation
- Psychological safety (no blame, focus on systems)
- Everyone's voice matters
- Specific examples over generalizations

WAIT for user to respond or indicate readiness.

### 6. Epic Review Discussion - What Went Well, What Didn't

Start with successes in Party Mode. Have team members share what went well, engage user directly with "What stood out to you as going well?"

WAIT for user to respond, then have team members react to user's input.

Transition to challenges. Create safe space for team to share struggles, allow natural disagreements and conflicts to emerge. Facilitate conflict resolution by helping identify systemic issues rather than blame.

Synthesize user's input: "So it sounds like the core issue was {root_cause}, not any individual person's fault."

Surface patterns from story analysis that team may not have noticed. Engage user: "Did you notice these patterns during the epic?"

WAIT for user to share observations.

If previous retrospective exists, review follow-through on commitments. Present status of previous action items with evidence of impact. Engage user: "Looking at what we committed to last time and what we actually did - what's your reaction?"

WAIT for user to respond.

Summarize epic review with success themes, challenge themes, and key insights. Allow team members and user to add final thoughts.

### 7. Next Epic Preparation Discussion - Interactive and Collaborative

If next epic doesn't exist, skip to Step 8.

If next epic exists, present next epic and ask "are we ready? What do we need to prepare?"

Have team members surface concerns (dependency concerns, technical concerns, testing infrastructure needs, knowledge gaps). Engage user: "The team is surfacing some real concerns here. What's your sense of our readiness?"

WAIT for user to share assessment.

Create realistic preparation plan with team providing technical prep items and estimates. Surface business vs. technical tension naturally. Facilitate finding middle ground between stakeholder pressure and technical reality.

Engage user to validate or adjust preparation strategy: "The team is finding a workable compromise here. Does this approach make sense to you?"

WAIT for user response.

Work through preparation needs across all dimensions:
- Dependencies on Epic {epic_number} work
- Technical setup and infrastructure
- Knowledge gaps and research needs
- Documentation or specification work
- Testing infrastructure
- Refactoring or debt reduction
- External dependencies

For each area, facilitate discussion identifying specific needs, estimating effort, assigning ownership, determining criticality, surfacing risks, exploring parallel work.

Summarize preparation plan categorized as: CRITICAL (must complete before epic), PARALLEL (can happen during early stories), NICE-TO-HAVE (would help but not blocking).

Present total effort estimate and ask: "Does this preparation plan work for you?"

WAIT for user final validation.

### 8. Synthesize Action Items with Significant Change Detection

Introduce action item capture: "Let's capture concrete action items from everything we've discussed. I want specific, achievable actions with clear owners. Not vague aspirations."

Synthesize themes into actionable improvements with SMART criteria:
- Specific: Clear and unambiguous
- Measurable: Can verify completion
- Achievable: Realistic given constraints
- Relevant: Addresses real issues from retro
- Time-bound: Has clear deadline

Create action items with clear description, assigned owner, timeline/deadline, success criteria, and category.

Present action items in Party Mode with formatted sections:
- Process Improvements
- Technical Debt
- Documentation
- Team Agreements
- Epic {next_epic_num} Preparation Tasks
- Critical Path items

Allow team to negotiate timelines and priorities. Engage user for priority decisions when team needs direction.

WAIT for user to help resolve priority discussions.

**CRITICAL ANALYSIS - Detect if discoveries require epic updates:**

Check if any of the following are true:
- Architectural assumptions proven wrong during Epic {epic_number}
- Major scope changes affecting next epic
- Technical approach needs fundamental change
- Dependencies discovered that Epic {next_epic_num} doesn't account for
- User needs significantly different than understood
- Performance/scalability concerns affecting Epic {next_epic_num} design
- Security or compliance issues discovered
- Integration assumptions proven incorrect
- Team capacity or skill gaps more severe than planned
- Technical debt level unsustainable

If significant discoveries detected, trigger SIGNIFICANT DISCOVERY ALERT in Party Mode:

Present significant changes identified with impact descriptions. Show how Epic {next_epic_num}'s current plan assumes things that Epic {epic_number} proved wrong. List likely changes needed.

Recommend:
1. Review and update Epic {next_epic_num} definition
2. Update affected stories
3. Update architecture/technical specs if applicable
4. Hold alignment session with Product Owner
5. Update PRD sections affected

Mark "Epic Update Required: YES - Schedule epic planning review session"

Engage user: "This is significant. We need to address this before committing to Epic {next_epic_num}'s current plan. How do you want to handle it?"

WAIT for user to decide on handling significant changes.

If user agrees, add epic review session to critical path.

If no significant discoveries, confirm that Epic {next_epic_num} plan is still sound.

Finalize action plan and ensure user approves the complete plan.

### 9. Critical Readiness Exploration - Interactive Deep Dive

Introduce final readiness check: "Epic {epic_number} is marked complete in sprint-status, but is it REALLY done? I mean truly production-ready, stakeholders happy, no loose ends."

**Explore testing and quality:** Ask user about testing verification status.

WAIT for user to describe testing status.

Have QA add context. Ask user: "Are you confident Epic {epic_number} is production-ready from a quality perspective?"

WAIT for user to assess quality readiness.

If user expresses concerns, capture specific testing needed and add to critical path.

**Explore deployment and release:** Ask user about deployment status (live in production, scheduled, or pending).

WAIT for user to provide deployment status.

If not deployed, clarify timing and whether it works for starting Epic {next_epic_num}. Add deployment milestone to critical path.

**Explore stakeholder acceptance:** Ask user if stakeholders have seen and accepted deliverables, and if any feedback is pending.

WAIT for user to describe stakeholder acceptance status.

If acceptance incomplete, discuss whether to make it a critical path item.

WAIT for user decision and add to critical path if agreed.

**Explore technical health and stability:** Ask user gut-check question about how codebase feels after Epic {epic_number}.

WAIT for user to assess codebase health.

If user expresses stability concerns, help articulate technical concerns and estimate work needed. Ask if addressing stability is worth doing before Epic {next_epic_num}.

WAIT for user decision and add stability work to preparation if agreed.

**Explore unresolved blockers:** Ask user about unresolved blockers or technical issues carried forward.

WAIT for user to surface any blockers.

If blockers identified, capture them, describe impact if left unresolved, assign ownership, add to critical path with priority and deadline.

Synthesize readiness assessment covering: Testing & Quality, Deployment, Stakeholder Acceptance, Technical Health, Unresolved Blockers. For each, show status and any action needed.

Ask user: "Does this assessment match your understanding?"

WAIT for user to confirm or correct assessment.

Present final assessment: "Epic {epic_number} is {fully complete / complete from story perspective but has {critical_work_count} critical items before Epic {next_epic_num}}."

### 10. Retrospective Closure with Celebration and Commitment

Bring retrospective to close with formatted RETROSPECTIVE COMPLETE section showing:
- Epic reviewed
- Key takeaways (4 main lessons)
- Commitments made (action items, prep tasks, critical path items)
- Next steps

Have team members acknowledge commitments and express excitement for next epic.

Ask user: "Any final thoughts before we close?"

WAIT for user to share final reflections.

Acknowledge user's input and adjourn meeting in Party Mode.

### 11. Save Retrospective and Update Sprint Status

Ensure `{sprint_artifacts}/` folder exists.

Generate comprehensive retrospective summary document including all sections discussed:
- Epic summary and metrics
- Team participants
- Successes and challenges
- Key insights and learnings
- Previous retro follow-through analysis (if applicable)
- Next epic preview and dependencies
- Action items with owners and timelines
- Preparation tasks for next epic
- Critical path items
- Significant discoveries and epic update recommendations (if any)
- Readiness assessment
- Commitments and next steps

Format as readable markdown with clear sections.

Set filename: `{sprint_artifacts}/epic-{epic_number}-retro-{YYYY-MM-DD}.md`

Save retrospective document using Write tool.

Update sprint status file:
1. Read the FULL sprint-status.yaml file
2. Find development_status key "epic-{epic_number}-retrospective"
3. Update to: `epic-{epic_number}-retrospective: done`
4. Save file, preserving ALL comments and structure

Report success or warn if retrospective key not found.

### 12. Final Summary and Handoff

Present final summary showing:
- Epic reviewed
- Retrospective status and file location
- Commitments made (counts)
- Next steps (numbered list)
  1. Review retrospective summary
  2. Execute preparation sprint
  3. Review action items in next standup
  4. Schedule Epic {next_epic_num} planning review (if epic update needed) OR Begin Epic {next_epic_num} planning when prep complete

Include team performance summary and reminder if epic update required.

Close with team members saying farewell in Party Mode.

## Workflow

1. **Epic Identification** → Detect completed epic from sprint-status.yaml, confirm with user, verify completion status
2. **Story Analysis** → Read all story files, extract dev notes/struggles, review feedback, lessons learned, technical debt, testing insights, synthesize patterns
3. **Previous Retro Integration** → Load previous epic's retrospective (if exists), cross-reference action items, assess what was completed/applied
4. **Next Epic Preview** → Load next epic definition (if exists), analyze dependencies and preparation needs
5. **Context Setup** → Load agent manifest, present epic summary with metrics, set ground rules, wait for user readiness
6. **Epic Review Discussion** → Party Mode discussion of successes, challenges, patterns, previous retro follow-through, with user actively participating
7. **Next Epic Preparation** → Party Mode discussion of readiness and preparation needs, facilitate business vs. technical tension, create preparation plan with user validation
8. **Action Item Synthesis** → Create SMART action items, detect significant discoveries requiring epic updates, get user approval on complete plan
9. **Readiness Exploration** → Deep dive on testing, deployment, stakeholder acceptance, technical health, blockers with user assessments
10. **Closure and Celebration** → Summarize key takeaways, acknowledge team, get user's final reflections
11. **Document and Update** → Save comprehensive retrospective document, update sprint-status.yaml marking retro as done
12. **Handoff** → Present final summary with clear next steps and team performance

## Report

### Success Output

When the retrospective completes successfully, provide a comprehensive summary:

```
**✅ Retrospective Complete, {user_name}!**

**Epic Review:**
- Epic {epic_number}: {epic_title} reviewed
- Retrospective Status: completed
- Retrospective saved: {sprint_artifacts}/epic-{epic_number}-retro-{date}.md

**Commitments Made:**
- Action Items: {action_count}
- Preparation Tasks: {prep_task_count}
- Critical Path Items: {critical_count}

**Next Steps:**

1. **Review retrospective summary**: {sprint_artifacts}/epic-{epic_number}-retro-{date}.md

2. **Execute preparation sprint** (Est: {prep_days} days)
   - Complete {critical_count} critical path items
   - Execute {prep_task_count} preparation tasks
   - Verify all action items are in progress

3. **Review action items in next standup**
   - Ensure ownership is clear
   - Track progress on commitments
   - Adjust timelines if needed

4. [Epic update required OR begin epic planning when prep complete]

**Team Performance:**
Epic {epic_number} delivered {completed_stories} stories with {velocity_summary}. The retrospective surfaced {insight_count} key insights and {significant_discovery_count} significant discoveries. The team is well-positioned for Epic {next_epic_num} success.

[If significant discoveries:] ⚠️ **REMINDER**: Epic update required before starting Epic {next_epic_num}
```

### Partial Retrospective Output

When retrospective is run before all stories are complete, include warnings:

```
⚠️ **Partial Retrospective Completed**

Epic {epic_number} retrospective completed with {completed_stories}/{total_stories} stories done.

**Pending Stories:**
- {story_key_1}
- {story_key_2}

**Limitations:**
This retrospective analyzed only completed stories. Lessons from pending stories may require follow-up retrospective or review when stories complete.

[Standard success output follows]
```

### Significant Discovery Output

When significant discoveries require epic updates, emphasize the critical alert:

```
🚨 **SIGNIFICANT DISCOVERY ALERT** 🚨

During Epic {epic_number}, the team uncovered findings that require updating the plan for Epic {next_epic_num}.

**Significant Changes Identified:**
1. {significant_change_1} - Impact: {impact_description_1}
2. {significant_change_2} - Impact: {impact_description_2}

**Impact on Epic {next_epic_num}:**
The current plan assumes {wrong_assumptions}, but Epic {epic_number} revealed {actual_reality}.

**REQUIRED ACTIONS:**
- Schedule Epic {next_epic_num} planning review session BEFORE starting epic
- Update epic definition and affected stories
- Update architecture/technical specifications if needed
- Hold alignment session with Product Owner

⚠️ DO NOT START Epic {next_epic_num} until review is complete

[Standard success output follows]
```

### Error Outputs

**Epic Detection Failure:**
```
❌ Unable to detect completed epic from sprint-status.yaml

Attempted locations:
- {sprint_artifacts}/sprint-status.yaml
- {documentation_dir}/sprint-status.yaml

Please verify:
1. Sprint status file exists and is readable
2. Development_status section has entries
3. At least one epic has stories marked "done"

You can manually specify epic number to continue.
```

**File Access Errors:**
```
❌ Unable to access required files

Missing or inaccessible:
- [List missing files]

Please verify:
1. .bmad/config.yaml exists with correct paths
2. Sprint artifacts folder is accessible
3. Story files exist for Epic {epic_number}
```

**Sprint Status Update Failure:**
```
⚠️ Retrospective saved but sprint-status update failed

Retrospective document: {sprint_artifacts}/epic-{epic_number}-retro-{date}.md ✅
Sprint status update: ❌

Could not find key "epic-{epic_number}-retrospective" in sprint-status.yaml.

Manual action required:
Add or update this key in {sprint_artifacts}/sprint-status.yaml:
  epic-{epic_number}-retrospective: done
```

### Output Files Generated

The workflow generates these files:

**Primary Output:**
- `{sprint_artifacts}/epic-{epic_number}-retro-{YYYY-MM-DD}.md` - Comprehensive retrospective summary with all discussion, analysis, action items, and commitments

**Updated Files:**
- `{sprint_artifacts}/sprint-status.yaml` - Updated with retrospective marked as "done"

### Party Mode Dialogue Reporting

Throughout the workflow, all agent interactions are reported using Party Mode format:

```
Bob (Scrum Master): "Welcome to the retrospective, {user_name}."
Alice (Product Owner): "I'm excited to review what we accomplished."
Charlie (Senior Dev): "And what we learned - especially the hard lessons."
{user_name} (Project Lead): [User's actual response]
```

This creates an immersive, authentic team discussion experience where the user is an active participant, not an observer.
