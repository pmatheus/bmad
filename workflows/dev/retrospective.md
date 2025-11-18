---
description: Run after epic completion to review success, extract lessons learned, and prepare for the next epic
---

# Retrospective - Epic Completion Review

## What This Does

Facilitates a team retrospective after epic completion to:
- Review epic execution (successes, challenges, insights)
- Extract lessons learned from story records
- Check follow-through on previous retrospective commitments
- Identify significant discoveries that may affect next epic
- Create actionable improvements for future work
- Prepare team for next epic with clear dependencies and prerequisites

This workflow uses **Party Mode** - natural multi-agent conversation with the user actively participating.

## Prerequisites

- BMAD plugin installed in Claude Code
- Epic marked complete in sprint-status.yaml (or near completion)
- Story files exist in sprint artifacts folder

## When to Use This

**Use retrospective after:**
- Epic is fully or mostly complete (all stories done)
- Need to capture lessons learned from epic execution
- Planning to start next epic and want to prepare properly
- Team wants to reflect on what went well and what didn't

**Party Mode Protocol:**
- All agent dialogue uses format: `Name (Role): dialogue`
- Example: `Bob (Scrum Master): "Let's begin..."`
- Example: `{user_name} (Project Lead): [responds]`
- Natural back-and-forth with user actively participating
- Disagreements, diverse perspectives, authentic team dynamics

## Instructions

### Step 1: Identify Completed Epic

**Read configuration to understand project structure:**

Read `.bmad/config.yaml` to get:
- `documentation_dir` - where epics/PRD/architecture are located
- `sprint_artifacts` - where stories and sprint-status.yaml are located
- `user_name` - the user's name for Party Mode dialogue

**Load sprint status file:**

Read the sprint status file from either:
- `{sprint_artifacts}/sprint-status.yaml` (primary)
- `{documentation_dir}/sprint-status.yaml` (fallback)

**Detect completed epic:**

1. Read ALL development_status entries from sprint-status.yaml
2. Find the highest epic number with at least one story marked "done"
3. Extract epic number from keys like "epic-X-retrospective" or story keys like "X-Y-story-name"
4. Set detected_epic = highest epic number found with completed stories

**Present finding to user:**

```
Bob (Scrum Master): "Welcome to the retrospective, {user_name}. Let me help you identify which epic we just completed. I'll check sprint-status first, but you're the ultimate authority on what we're reviewing today."

Bob (Scrum Master): "Based on sprint-status.yaml, it looks like Epic {detected_epic} was recently completed. Is that the epic you want to review today?"
```

Use AskUserQuestion tool to confirm or get correct epic number:

```yaml
questions:
  - question: "Is Epic {detected_epic} the epic you want to review?"
    header: "Epic Selection"
    multiSelect: false
    options:
      - label: "Yes, Epic {detected_epic}"
        description: "Review the detected epic"
      - label: "Different epic number"
        description: "I'll specify which epic to review"
```

**If user selects "Different epic number":**
- Prompt user to provide the correct epic number
- Set epic_number = user-provided number

**If no epic detected in sprint-status:**
- Ask user directly which epic number they completed
- Fall back to scanning story directory for highest numbered story files

**Verify epic completion status:**

1. Find all stories for the epic in sprint-status.yaml:
   - Look for keys starting with "{epic_number}-" (e.g., "1-1-", "1-2-")
   - Exclude epic key itself ("epic-{epic_number}")
   - Exclude retrospective key ("epic-{epic_number}-retrospective")

2. Count total stories and stories with status = "done"

3. Determine if complete: true if all stories done, false otherwise

**If epic is not complete:**

```
Alice (Product Owner): "Wait, Bob - I'm seeing that Epic {epic_number} isn't actually complete yet."

Bob (Scrum Master): "Let me check... you're right, Alice."

**Epic Status:**
- Total Stories: {total_stories}
- Completed (Done): {done_stories}
- Pending: {pending_count}

**Pending Stories:**
{list pending story keys}

Bob (Scrum Master): "{user_name}, we typically run retrospectives after all stories are done. What would you like to do?"

**Options:**
1. Complete remaining stories before running retrospective (recommended)
2. Continue with partial retrospective (not ideal, but possible)
3. Run sprint-planning to refresh story tracking
```

Use AskUserQuestion tool to let user decide.

**If user chooses to halt:**
- End workflow with message about completing remaining stories first

**If user chooses to continue:**
- Set partial_retrospective = true
- Warn that partial retro might miss lessons from pending stories

### Step 2: Deep Story Analysis - Extract Lessons from Implementation

**Introduce analysis phase:**

```
Bob (Scrum Master): "Before we start the team discussion, let me review all the story records to surface key themes. This'll help us have a richer conversation."

Charlie (Senior Dev): "Good idea - those dev notes always have gold in them."
```

**For each story in epic, read the complete story file:**

Read all story files matching pattern: `{sprint_artifacts}/{epic_number}-*-*.md`

**Extract and analyze from each story:**

**Dev Notes and Struggles:**
- Look for sections: "## Dev Notes", "## Implementation Notes", "## Challenges", "## Development Log"
- Identify where developers struggled or made mistakes
- Note unexpected complexity or gotchas discovered
- Record technical decisions that didn't work out
- Track where estimates were way off (too high or too low)

**Review Feedback Patterns:**
- Look for: "## Review", "## Code Review", "## SM Review", "## Scrum Master Review"
- Identify recurring feedback themes across stories
- Note which types of issues came up repeatedly
- Track quality concerns or architectural misalignments
- Document praise or exemplary work

**Lessons Learned:**
- Look for: "## Lessons Learned", "## Retrospective Notes", "## Takeaways"
- Extract explicit lessons documented during development
- Identify "aha moments" or breakthroughs
- Note what would be done differently
- Track successful experiments or approaches

**Technical Debt Incurred:**
- Look for: "## Technical Debt", "## TODO", "## Known Issues", "## Future Work"
- Document shortcuts taken and why
- Track debt items that affect next epic
- Note severity and priority

**Testing and Quality Insights:**
- Look for: "## Testing", "## QA Notes", "## Test Results"
- Note testing challenges or surprises
- Track bug patterns or regression issues
- Document test coverage gaps

**Synthesize patterns across all stories:**

**Common Struggles:**
- Identify issues that appeared in 2+ stories
- Example: "3 out of 5 stories had API authentication issues"
- Note areas where team consistently struggled

**Recurring Review Feedback:**
- Identify feedback themes
- Example: "Error handling was flagged in every review"
- Track where team improved over epic course

**Breakthrough Moments:**
- Document key discoveries
- Example: "Story 3 discovered the caching pattern we used for rest of epic"
- Track innovative solutions worth repeating

**Velocity Patterns:**
- Calculate average completion time per story
- Note velocity trends
- Example: "First 2 stories took 3x longer than estimated"

```
Bob (Scrum Master): "Okay, I've reviewed all {total_stories} story records. I found some really interesting patterns we should discuss."

Dana (QA Engineer): "I'm curious what you found, Bob. I noticed some things in my testing too."

Bob (Scrum Master): "We'll get to all of it. But first, let me load the previous epic's retro to see if we learned from last time."
```

### Step 3: Load and Integrate Previous Epic Retrospective

**Calculate previous epic number:**

prev_epic_num = epic_number - 1

**If prev_epic_num >= 1:**

Search for previous retrospective file:
- Pattern: `{sprint_artifacts}/epic-{prev_epic_num}-retro-*.md`

**If previous retro found:**

```
Bob (Scrum Master): "I found our retrospective from Epic {prev_epic_num}. Let me see what we committed to back then..."
```

Read the complete previous retrospective file.

**Extract key elements:**
- Action items committed - what did team agree to improve?
- Lessons learned - what insights were captured?
- Process improvements - what changes were agreed upon?
- Technical debt flagged - what debt was documented?
- Team agreements - what commitments were made?
- Preparation tasks - what was needed for this epic?

**Cross-reference with current epic execution:**

**Action Item Follow-Through:**
- For each action item from Epic {prev_epic_num} retro, check if it was completed
- Look for evidence in current epic's story records
- Mark each: ✅ Completed, ⏳ In Progress, ❌ Not Addressed

**Lessons Applied:**
- For each lesson from Epic {prev_epic_num}, check if team applied it
- Look for evidence in dev notes, review feedback, or outcomes
- Document successes and missed opportunities

**Process Improvements Effectiveness:**
- For each process change agreed to, assess if it helped
- Did it improve velocity, quality, or team satisfaction?
- Should we keep, modify, or abandon the change?

**Technical Debt Status:**
- For each debt item from Epic {prev_epic_num}, check if addressed
- Did unaddressed debt cause problems in Epic {epic_number}?

```
Bob (Scrum Master): "Interesting... in Epic {prev_epic_num}'s retro, we committed to {action_count} action items."

Alice (Product Owner): "How'd we do on those, Bob?"

Bob (Scrum Master): "We completed {completed_count}, made progress on {in_progress_count}, but didn't address {not_addressed_count}."

Charlie (Senior Dev): *looking concerned* "Which ones didn't we address?"

Bob (Scrum Master): "We'll discuss that in the retro. Some of them might explain challenges we had this epic."

Elena (Junior Dev): "That's... actually pretty insightful."

Bob (Scrum Master): "That's why we track this stuff. Pattern recognition helps us improve."
```

**If no previous retro found:**

```
Bob (Scrum Master): "I don't see a retrospective for Epic {prev_epic_num}. Either we skipped it, or this is your first retro."

Alice (Product Owner): "Probably our first one. Good time to start the habit!"
```

Set first_retrospective = true

### Step 4: Preview Next Epic with Change Detection

**Calculate next epic number:**

next_epic_num = epic_number + 1

```
Bob (Scrum Master): "Before we dive into the discussion, let me take a quick look at Epic {next_epic_num} to understand what's coming."

Alice (Product Owner): "Good thinking - helps us connect what we learned to what we're about to do."
```

**Attempt to load next epic:**

**Try sharded first (more specific):**
- Check if file exists: `{documentation_dir}/*epic*/epic-{next_epic_num}.md`
- If found, load it

**Fallback to whole document:**
- Check if file exists: `{documentation_dir}/*epic*.md`
- If found, load entire epics document and extract Epic {next_epic_num} section

**If next epic found:**

Analyze next epic for:
- Epic title and objectives
- Planned stories and complexity estimates
- Dependencies on Epic {epic_number} work
- New technical requirements or capabilities needed
- Potential risks or unknowns
- Business goals and success criteria

**Identify dependencies on completed work:**
- What components from Epic {epic_number} does Epic {next_epic_num} rely on?
- Are all prerequisites complete and stable?
- Any incomplete work that creates blocking dependencies?

**Note potential gaps or preparation needed:**
- Technical setup required (infrastructure, tools, libraries)
- Knowledge gaps to fill (research, training, spikes)
- Refactoring needed before starting next epic
- Documentation or specifications to create

```
Bob (Scrum Master): "Alright, I've reviewed Epic {next_epic_num}: '{next_epic_title}'"

Alice (Product Owner): "What are we looking at?"

Bob (Scrum Master): "{story_count} stories planned, building on the {dependency_description} from Epic {epic_number}."

Charlie (Senior Dev): "Dependencies concern me. Did we finish everything we need for that?"

Bob (Scrum Master): "Good question - that's exactly what we need to explore in this retro."
```

Set next_epic_exists = true

**If next epic NOT found:**

```
Bob (Scrum Master): "Hmm, I don't see Epic {next_epic_num} defined yet."

Alice (Product Owner): "We might be at the end of the roadmap, or we haven't planned that far ahead yet."

Bob (Scrum Master): "No problem. We'll still do a thorough retro on Epic {epic_number}. The lessons will be valuable whenever we plan the next work."
```

Set next_epic_exists = false

### Step 5: Initialize Retrospective with Rich Context

**Load agent manifest:**

Read `{bmad_folder}/_cfg/agent-manifest.csv` to identify which agents participated in Epic {epic_number}.

**Ensure key roles present:**
- Product Owner
- Scrum Master (facilitating)
- Developers
- Testing/QA
- Architect

**Present epic summary:**

```
Bob (Scrum Master): "Alright team, everyone's here. Let me set the stage for our retrospective."

═══════════════════════════════════════════════════════════
🔄 TEAM RETROSPECTIVE - Epic {epic_number}: {epic_title}
═══════════════════════════════════════════════════════════

Bob (Scrum Master): "Here's what we accomplished together."

**EPIC {epic_number} SUMMARY:**

Delivery Metrics:
- Completed: {completed_stories}/{total_stories} stories ({completion_percentage}%)
- Velocity: {actual_points} story points
- Duration: {actual_sprints} sprints
- Average velocity: {points_per_sprint} points/sprint

Quality and Technical:
- Blockers encountered: {blocker_count}
- Technical debt items: {debt_count}
- Test coverage: {coverage_info}
- Production incidents: {incident_count}

Business Outcomes:
- Goals achieved: {goals_met}/{total_goals}
- Success criteria: {criteria_status}

Alice (Product Owner): "Those numbers tell a good story. {completion_percentage}% completion is {excellent/concerning}."

Charlie (Senior Dev): "I'm more interested in that technical debt number - {debt_count} items is {concerning/manageable}."

Dana (QA Engineer): "{incident_count} production incidents - {clean epic/we should talk about those}."
```

**If next epic exists:**

```
═══════════════════════════════════════════════════════════
**NEXT EPIC PREVIEW:** Epic {next_epic_num}: {next_epic_title}
═══════════════════════════════════════════════════════════

Dependencies on Epic {epic_number}:
{list_dependencies}

Preparation Needed:
{list_preparation_gaps}

Technical Prerequisites:
{list_technical_prereqs}

Bob (Scrum Master): "And here's what's coming next. Epic {next_epic_num} builds on what we just finished."

Elena (Junior Dev): "Wow, that's a lot of dependencies on our work."

Charlie (Senior Dev): "Which means we better make sure Epic {epic_number} is actually solid before moving on."
```

**Set ground rules:**

```
Bob (Scrum Master): "Team assembled for this retrospective:"

{list_participating_agents}

Bob (Scrum Master): "{user_name}, you're joining us as Project Lead. Your perspective is crucial here."

{user_name} (Project Lead): [Participating in the retrospective]

Bob (Scrum Master): "Our focus today:"
1. Learning from Epic {epic_number} execution
2. Preparing for Epic {next_epic_num} success

Bob (Scrum Master): "Ground rules: psychological safety first. No blame, no judgment. We focus on systems and processes, not individuals. Everyone's voice matters. Specific examples are better than generalizations."

Alice (Product Owner): "And everything shared here stays in this room - unless we decide together to escalate something."

Bob (Scrum Master): "Exactly. {user_name}, any questions before we dive in?"
```

**WAIT for user to respond or indicate readiness**

### Step 6: Epic Review Discussion - What Went Well, What Didn't

**Start with successes:**

```
Bob (Scrum Master): "Let's start with the good stuff. What went well in Epic {epic_number}?"

Bob (Scrum Master): *pauses, creating space*

Alice (Product Owner): "I'll start. The user authentication flow we delivered exceeded my expectations. The UX is smooth, and early user feedback has been really positive."

Charlie (Senior Dev): "I'll add to that - the caching strategy we implemented in Story {breakthrough_story_num} was a game-changer. We cut API calls by 60% and it set the pattern for the rest of the epic."

Dana (QA Engineer): "From my side, testing went smoother than usual. The dev team's documentation was way better this epic - actually usable test plans!"

Elena (Junior Dev): *smiling* "That's because Charlie made me document everything after Story 1's code review!"

Charlie (Senior Dev): *laughing* "Tough love pays off."
```

**Engage user in discussion:**

```
Bob (Scrum Master): "{user_name}, what stood out to you as going well in this epic?"
```

**WAIT for user to respond** - this is a KEY USER INTERACTION moment

After user responds, have 1-2 team members react to or build on what user shared.

**Transition to challenges:**

```
Bob (Scrum Master): "Okay, we've celebrated some real wins. Now let's talk about challenges - where did we struggle? What slowed us down?"

Bob (Scrum Master): *creates safe space with tone and pacing*

Elena (Junior Dev): *hesitates* "Well... I really struggled with the database migrations in Story {difficult_story_num}. The documentation wasn't clear, and I had to redo it three times. Lost almost a full sprint on that story alone."

Charlie (Senior Dev): *defensive* "Hold on - I wrote those migration docs, and they were perfectly clear. The issue was that the requirements kept changing mid-story!"

Alice (Product Owner): *frustrated* "That's not fair, Charlie. We only clarified requirements once, and that was because the technical team didn't ask the right questions during planning!"

Charlie (Senior Dev): *heat rising* "We asked plenty of questions! You said the schema was finalized, then two days into development you wanted to add three new fields!"

Bob (Scrum Master): *intervening calmly* "Let's take a breath here. This is exactly the kind of thing we need to unpack."

Bob (Scrum Master): "Elena, you spent almost a full sprint on Story {difficult_story_num}. Charlie, you're saying requirements changed. Alice, you feel the right questions weren't asked up front."

Bob (Scrum Master): "{user_name}, you have visibility across the whole project. What's your take on this situation?"
```

**WAIT for user to respond and help facilitate conflict resolution**

Use user's response to guide discussion toward systemic understanding rather than blame.

```
Bob (Scrum Master): [Synthesizes user's input] "So it sounds like the core issue was {root_cause}, not any individual person's fault."

Elena (Junior Dev): "That makes sense. If we'd had {preventive_measure}, I probably could have avoided those redos."

Charlie (Senior Dev): *softening* "Yeah, and I could have been clearer about assumptions in the docs. Sorry for getting defensive, Alice."

Alice (Product Owner): "I appreciate that. I could've been more proactive about flagging the schema additions earlier, too."

Bob (Scrum Master): "This is good. We're identifying systemic improvements, not assigning blame."
```

**Surface patterns from story analysis:**

```
Bob (Scrum Master): "Speaking of patterns, I noticed something when reviewing all the story records..."

Bob (Scrum Master): "{pattern_1_description} - this showed up in {pattern_1_count} out of {total_stories} stories."

Dana (QA Engineer): "Oh wow, I didn't realize it was that widespread."

Bob (Scrum Master): "Yeah. And there's more - {pattern_2_description} came up in almost every code review."

Charlie (Senior Dev): "That's... actually embarrassing. We should've caught that pattern earlier."

Bob (Scrum Master): "No shame, Charlie. Now we know, and we can improve. {user_name}, did you notice these patterns during the epic?"
```

**WAIT for user to share their observations**

**If previous retrospective exists, review follow-through:**

```
Bob (Scrum Master): "Before we move on, I want to circle back to Epic {prev_epic_num}'s retrospective."

Bob (Scrum Master): "We made some commitments in that retro. Let's see how we did."

Bob (Scrum Master): "Action item 1: {prev_action_1}. Status: {prev_action_1_status}"

Alice (Product Owner): "We {nailed/didn't do} that one!"

Charlie (Senior Dev): "And it {helped/hurt}! I noticed {evidence_of_impact}."

Bob (Scrum Master): "{user_name}, looking at what we committed to last time and what we actually did - what's your reaction?"
```

**WAIT for user to respond**

**Summarize epic review:**

```
Bob (Scrum Master): "Alright, we've covered a lot of ground. Let me summarize what I'm hearing..."

Bob (Scrum Master): "**Successes:**"
{list_success_themes}

Bob (Scrum Master): "**Challenges:**"
{list_challenge_themes}

Bob (Scrum Master): "**Key Insights:**"
{list_insight_themes}

Bob (Scrum Master): "Does that capture it? Anyone have something important we missed?"
```

Allow team members and user to add any final thoughts on epic review.

### Step 7: Next Epic Preparation Discussion - Interactive and Collaborative

**If next epic doesn't exist:**

```
Bob (Scrum Master): "Normally we'd discuss preparing for the next epic, but since Epic {next_epic_num} isn't defined yet, let's skip to action items."
```

Skip to Step 8.

**If next epic exists:**

```
Bob (Scrum Master): "Now let's shift gears. Epic {next_epic_num} is coming up: '{next_epic_title}'"

Bob (Scrum Master): "The question is: are we ready? What do we need to prepare?"

Alice (Product Owner): "From my perspective, we need to make sure {dependency_concern_1} from Epic {epic_number} is solid before we start building on it."

Charlie (Senior Dev): *concerned* "I'm worried about {technical_concern_1}. We have {technical_debt_item} from this epic that'll blow up if we don't address it before Epic {next_epic_num}."

Dana (QA Engineer): "And I need {testing_infrastructure_need} in place, or we're going to have the same testing bottleneck we had in Story {bottleneck_story_num}."

Elena (Junior Dev): "I'm less worried about infrastructure and more about knowledge. I don't understand {knowledge_gap} well enough to work on Epic {next_epic_num}'s stories."

Bob (Scrum Master): "{user_name}, the team is surfacing some real concerns here. What's your sense of our readiness?"
```

**WAIT for user to share their assessment**

Use user's input to guide deeper exploration of preparation needs.

**Create realistic preparation plan:**

```
Alice (Product Owner): [Reacts to what user said] "I agree with {user_name} about {point_of_agreement}, but I'm still worried about {lingering_concern}."

Charlie (Senior Dev): "Here's what I think we need technically before Epic {next_epic_num} can start..."

Charlie (Senior Dev): "1. {tech_prep_item_1} - estimated {hours_1} hours"
Charlie (Senior Dev): "2. {tech_prep_item_2} - estimated {hours_2} hours"
Charlie (Senior Dev): "3. {tech_prep_item_3} - estimated {hours_3} hours"

Elena (Junior Dev): "That's like {total_hours} hours! That's a full sprint of prep work!"

Charlie (Senior Dev): "Exactly. We can't just jump into Epic {next_epic_num} on Monday."

Alice (Product Owner): *frustrated* "But we have stakeholder pressure to keep shipping features. They're not going to be happy about a 'prep sprint.'"

Bob (Scrum Master): "Let's think about this differently. What happens if we DON'T do this prep work?"

Dana (QA Engineer): "We'll hit blockers in the middle of Epic {next_epic_num}, velocity will tank, and we'll ship late anyway."

Charlie (Senior Dev): "Worse - we'll ship something built on top of {technical_concern_1}, and it'll be fragile."

Bob (Scrum Master): "{user_name}, you're balancing stakeholder pressure against technical reality. How do you want to handle this?"
```

**WAIT for user to provide direction on preparation approach**

**Explore middle ground:**

```
Alice (Product Owner): [Potentially disagrees with user's approach] "I hear what you're saying, {user_name}, but from a business perspective, {business_concern}."

Charlie (Senior Dev): [Potentially supports or challenges] "The business perspective is valid, but {technical_counter_argument}."

Bob (Scrum Master): "We have healthy tension here between business needs and technical reality. That's good - it means we're being honest."

Bob (Scrum Master): "Let's explore a middle ground. Charlie, which of your prep items are absolutely critical vs. nice-to-have?"

Charlie (Senior Dev): "{critical_prep_item_1} and {critical_prep_item_2} are non-negotiable. {nice_to_have_prep_item} can wait."

Alice (Product Owner): "And can any of the critical prep happen in parallel with starting Epic {next_epic_num}?"

Charlie (Senior Dev): *thinking* "Maybe. If we tackle {first_critical_item} before the epic starts, we could do {second_critical_item} during the first sprint."

Dana (QA Engineer): "But that means Story 1 of Epic {next_epic_num} can't depend on {second_critical_item}."

Alice (Product Owner): *looking at epic plan* "Actually, Stories 1 and 2 are about {independent_work}, so they don't depend on it. We could make that work."

Bob (Scrum Master): "{user_name}, the team is finding a workable compromise here. Does this approach make sense to you?"
```

**WAIT for user to validate or adjust preparation strategy**

**Work through preparation needs across all dimensions:**

- Dependencies on Epic {epic_number} work
- Technical setup and infrastructure
- Knowledge gaps and research needs
- Documentation or specification work
- Testing infrastructure
- Refactoring or debt reduction
- External dependencies (APIs, integrations, etc.)

For each area, facilitate discussion that:
- Identifies specific needs with concrete examples
- Estimates effort realistically based on Epic {epic_number} experience
- Assigns ownership to specific agents
- Determines criticality and timing
- Surfaces risks of NOT doing the preparation
- Explores parallel work opportunities
- Brings user in for key decisions

**Summarize preparation plan:**

```
Bob (Scrum Master): "I'm hearing a clear picture of what we need before Epic {next_epic_num}. Let me summarize..."

**CRITICAL PREPARATION (Must complete before epic starts):**
{list_critical_prep_items_with_owners_and_estimates}

**PARALLEL PREPARATION (Can happen during early stories):**
{list_parallel_prep_items_with_owners_and_estimates}

**NICE-TO-HAVE PREPARATION (Would help but not blocking):**
{list_nice_to_have_prep_items}

Bob (Scrum Master): "Total critical prep effort: {critical_hours} hours ({critical_days} days)"

Alice (Product Owner): "That's manageable. We can communicate that to stakeholders."

Bob (Scrum Master): "{user_name}, does this preparation plan work for you?"
```

**WAIT for user final validation of preparation plan**

### Step 8: Synthesize Action Items with Significant Change Detection

```
Bob (Scrum Master): "Let's capture concrete action items from everything we've discussed."

Bob (Scrum Master): "I want specific, achievable actions with clear owners. Not vague aspirations."
```

**Synthesize themes into actionable improvements:**

Create specific action items with:
- Clear description of the action
- Assigned owner (specific agent or role)
- Timeline or deadline
- Success criteria (how we'll know it's done)
- Category (process, technical, documentation, team, etc.)

**Ensure action items are SMART:**
- Specific: Clear and unambiguous
- Measurable: Can verify completion
- Achievable: Realistic given constraints
- Relevant: Addresses real issues from retro
- Time-bound: Has clear deadline

**Present action items:**

```
Bob (Scrum Master): "Based on our discussion, here are the action items I'm proposing..."

═══════════════════════════════════════════════════════════
📝 EPIC {epic_number} ACTION ITEMS:
═══════════════════════════════════════════════════════════

**Process Improvements:**

1. {action_item_1}
   Owner: {agent_1}
   Deadline: {timeline_1}
   Success criteria: {criteria_1}

2. {action_item_2}
   Owner: {agent_2}
   Deadline: {timeline_2}
   Success criteria: {criteria_2}

Charlie (Senior Dev): "I can own action item 1, but {timeline_1} is tight. Can we push it to {alternative_timeline}?"

Bob (Scrum Master): "What do others think? Does that timing still work?"

Alice (Product Owner): "{alternative_timeline} works for me, as long as it's done before Epic {next_epic_num} starts."

Bob (Scrum Master): "Agreed. Updated to {alternative_timeline}."

**Technical Debt:**

1. {debt_item_1}
   Owner: {agent_3}
   Priority: {priority_1}
   Estimated effort: {effort_1}

2. {debt_item_2}
   Owner: {agent_4}
   Priority: {priority_2}
   Estimated effort: {effort_2}

Dana (QA Engineer): "For debt item 1, can we prioritize that as high? It caused testing issues in three different stories."

Charlie (Senior Dev): "I marked it medium because {reasoning}, but I hear your point."

Bob (Scrum Master): "{user_name}, this is a priority call. Testing impact vs. {reasoning} - how do you want to prioritize it?"
```

**WAIT for user to help resolve priority discussions**

```
**Documentation:**
1. {doc_need_1}
   Owner: {agent_5}
   Deadline: {timeline_3}

2. {doc_need_2}
   Owner: {agent_6}
   Deadline: {timeline_4}

**Team Agreements:**
- {agreement_1}
- {agreement_2}
- {agreement_3}

Bob (Scrum Master): "These agreements are how we're committing to work differently going forward."

Elena (Junior Dev): "I like agreement 2 - that would've saved me on Story {difficult_story_num}."

═══════════════════════════════════════════════════════════
🚀 EPIC {next_epic_num} PREPARATION TASKS:
═══════════════════════════════════════════════════════════

**Technical Setup:**
[ ] {setup_task_1}
    Owner: {owner_1}
    Estimated: {est_1}

[ ] {setup_task_2}
    Owner: {owner_2}
    Estimated: {est_2}

**Knowledge Development:**
[ ] {research_task_1}
    Owner: {owner_3}
    Estimated: {est_3}

**Cleanup/Refactoring:**
[ ] {refactor_task_1}
    Owner: {owner_4}
    Estimated: {est_4}

**Total Estimated Effort:** {total_hours} hours ({total_days} days)

═══════════════════════════════════════════════════════════
⚠️ CRITICAL PATH:
═══════════════════════════════════════════════════════════

**Blockers to Resolve Before Epic {next_epic_num}:**

1. {critical_item_1}
   Owner: {critical_owner_1}
   Must complete by: {critical_deadline_1}

2. {critical_item_2}
   Owner: {critical_owner_2}
   Must complete by: {critical_deadline_2}
```

**CRITICAL ANALYSIS - Detect if discoveries require epic updates:**

Check if any of the following are true based on retrospective discussion:
- Architectural assumptions from planning proven wrong during Epic {epic_number}
- Major scope changes or descoping that affects next epic
- Technical approach needs fundamental change for Epic {next_epic_num}
- Dependencies discovered that Epic {next_epic_num} doesn't account for
- User needs significantly different than originally understood
- Performance/scalability concerns that affect Epic {next_epic_num} design
- Security or compliance issues discovered that change approach
- Integration assumptions proven incorrect
- Team capacity or skill gaps more severe than planned
- Technical debt level unsustainable without intervention

**If significant discoveries detected:**

```
═══════════════════════════════════════════════════════════
🚨 SIGNIFICANT DISCOVERY ALERT 🚨
═══════════════════════════════════════════════════════════

Bob (Scrum Master): "{user_name}, we need to flag something important."

Bob (Scrum Master): "During Epic {epic_number}, the team uncovered findings that may require updating the plan for Epic {next_epic_num}."

**Significant Changes Identified:**

1. {significant_change_1}
   Impact: {impact_description_1}

2. {significant_change_2}
   Impact: {impact_description_2}

Charlie (Senior Dev): "Yeah, when we discovered {technical_discovery}, it fundamentally changed our understanding of {affected_area}."

Alice (Product Owner): "And from a product perspective, {product_discovery} means Epic {next_epic_num}'s stories are based on wrong assumptions."

Dana (QA Engineer): "If we start Epic {next_epic_num} as-is, we're going to hit walls fast."

**Impact on Epic {next_epic_num}:**

The current plan for Epic {next_epic_num} assumes:
- {wrong_assumption_1}
- {wrong_assumption_2}

But Epic {epic_number} revealed:
- {actual_reality_1}
- {actual_reality_2}

This means Epic {next_epic_num} likely needs:
{list_likely_changes_needed}

**RECOMMENDED ACTIONS:**

1. Review and update Epic {next_epic_num} definition based on new learnings
2. Update affected stories to reflect reality
3. Consider updating architecture or technical specifications if applicable
4. Hold alignment session with Product Owner before starting Epic {next_epic_num}
5. Update PRD sections affected by new understanding (if applicable)

Bob (Scrum Master): "**Epic Update Required**: YES - Schedule epic planning review session"

Bob (Scrum Master): "{user_name}, this is significant. We need to address this before committing to Epic {next_epic_num}'s current plan. How do you want to handle it?"
```

**WAIT for user to decide on how to handle significant changes**

Add epic review session to critical path if user agrees.

```
Alice (Product Owner): "I agree with {user_name}'s approach. Better to adjust the plan now than fail mid-epic."

Charlie (Senior Dev): "This is why retrospectives matter. We caught this before it became a disaster."

Bob (Scrum Master): "Adding to critical path: Epic {next_epic_num} planning review session before epic kickoff."
```

**If no significant discoveries:**

```
Bob (Scrum Master): "Good news - nothing from Epic {epic_number} fundamentally changes our plan for Epic {next_epic_num}. The plan is still sound."

Alice (Product Owner): "We learned a lot, but the direction is right."
```

**Finalize action plan:**

```
Bob (Scrum Master): "Let me show you the complete action plan..."

Bob (Scrum Master): "That's {total_action_count} action items, {prep_task_count} preparation tasks, and {critical_count} critical path items."

Bob (Scrum Master): "Everyone clear on what they own?"
```

Give each agent with assignments a moment to acknowledge ownership.

**Ensure user approves the complete action plan**

### Step 9: Critical Readiness Exploration - Interactive Deep Dive

```
Bob (Scrum Master): "Before we close, I want to do a final readiness check."

Bob (Scrum Master): "Epic {epic_number} is marked complete in sprint-status, but is it REALLY done?"

Alice (Product Owner): "What do you mean, Bob?"

Bob (Scrum Master): "I mean truly production-ready, stakeholders happy, no loose ends that'll bite us later."

Bob (Scrum Master): "{user_name}, let's walk through this together."
```

**Explore testing and quality:**

```
Bob (Scrum Master): "{user_name}, tell me about the testing for Epic {epic_number}. What verification has been done?"
```

**WAIT for user to describe testing status**

```
Dana (QA Engineer): [Responds to what user shared] "I can add to that - {additional_testing_context}."

Dana (QA Engineer): "But honestly, {testing_concern_if_any}."

Bob (Scrum Master): "{user_name}, are you confident Epic {epic_number} is production-ready from a quality perspective?"
```

**WAIT for user to assess quality readiness**

**If user expresses concerns:**

```
Bob (Scrum Master): "Okay, let's capture that. What specific testing is still needed?"

Dana (QA Engineer): "I can handle {testing_work_needed}, estimated {testing_hours} hours."

Bob (Scrum Master): "Adding to critical path: Complete {testing_work_needed} before Epic {next_epic_num}."
```

Add testing completion to critical path.

**Explore deployment and release:**

```
Bob (Scrum Master): "{user_name}, what's the deployment status for Epic {epic_number}? Is it live in production, scheduled for deployment, or still pending?"
```

**WAIT for user to provide deployment status**

**If not yet deployed:**

```
Charlie (Senior Dev): "If it's not deployed yet, we need to factor that into Epic {next_epic_num} timing."

Bob (Scrum Master): "{user_name}, when is deployment planned? Does that timing work for starting Epic {next_epic_num}?"
```

**WAIT for user to clarify deployment timeline**

Add deployment milestone to critical path with agreed timeline.

**Explore stakeholder acceptance:**

```
Bob (Scrum Master): "{user_name}, have stakeholders seen and accepted the Epic {epic_number} deliverables?"

Alice (Product Owner): "This is important - I've seen 'done' epics get rejected by stakeholders and force rework."

Bob (Scrum Master): "{user_name}, any feedback from stakeholders still pending?"
```

**WAIT for user to describe stakeholder acceptance status**

**If acceptance incomplete or feedback pending:**

```
Alice (Product Owner): "We should get formal acceptance before moving on. Otherwise Epic {next_epic_num} might get interrupted by rework."

Bob (Scrum Master): "{user_name}, how do you want to handle stakeholder acceptance? Should we make it a critical path item?"
```

**WAIT for user decision**

Add stakeholder acceptance to critical path if user agrees.

**Explore technical health and stability:**

```
Bob (Scrum Master): "{user_name}, this is a gut-check question: How does the codebase feel after Epic {epic_number}?"

Bob (Scrum Master): "Stable and maintainable? Or are there concerns lurking?"

Charlie (Senior Dev): "Be honest, {user_name}. We've all shipped epics that felt... fragile."
```

**WAIT for user to assess codebase health**

**If user expresses stability concerns:**

```
Charlie (Senior Dev): "Okay, let's dig into that. What's causing those concerns?"

Charlie (Senior Dev): [Helps user articulate technical concerns]

Bob (Scrum Master): "What would it take to address these concerns and feel confident about stability?"

Charlie (Senior Dev): "I'd say we need {stability_work_needed}, roughly {stability_hours} hours."

Bob (Scrum Master): "{user_name}, is addressing this stability work worth doing before Epic {next_epic_num}?"
```

**WAIT for user decision**

Add stability work to preparation sprint if user agrees.

**Explore unresolved blockers:**

```
Bob (Scrum Master): "{user_name}, are there any unresolved blockers or technical issues from Epic {epic_number} that we're carrying forward?"

Dana (QA Engineer): "Things that might create problems for Epic {next_epic_num} if we don't deal with them?"

Bob (Scrum Master): "Nothing is off limits here. If there's a problem, we need to know."
```

**WAIT for user to surface any blockers**

**If blockers identified:**

```
Bob (Scrum Master): "Let's capture those blockers and figure out how they affect Epic {next_epic_num}."

Charlie (Senior Dev): "For {blocker_1}, if we leave it unresolved, it'll {impact_description_1}."

Alice (Product Owner): "That sounds critical. We need to address that before moving forward."

Bob (Scrum Master): "Agreed. Adding to critical path: Resolve {blocker_1} before Epic {next_epic_num} kickoff."

Bob (Scrum Master): "Who owns that work?"
```

Assign blocker resolution to appropriate agent.
Add to critical path with priority and deadline.

**Synthesize readiness assessment:**

```
Bob (Scrum Master): "Okay {user_name}, let me synthesize what we just uncovered..."

**EPIC {epic_number} READINESS ASSESSMENT:**

Testing & Quality: {quality_status}
{If concerns: ⚠️ Action needed: {quality_action_needed}}

Deployment: {deployment_status}
{If pending: ⚠️ Scheduled for: {deployment_date}}

Stakeholder Acceptance: {acceptance_status}
{If incomplete: ⚠️ Action needed: {acceptance_action_needed}}

Technical Health: {stability_status}
{If concerns: ⚠️ Action needed: {stability_action_needed}}

Unresolved Blockers: {blocker_status}
{If exist: ⚠️ Must resolve: {blocker_list}}

Bob (Scrum Master): "{user_name}, does this assessment match your understanding?"
```

**WAIT for user to confirm or correct assessment**

```
Bob (Scrum Master): "Based on this assessment, Epic {epic_number} is {fully complete and clear to proceed / complete from story perspective but has {critical_work_count} critical items before Epic {next_epic_num}}."

Alice (Product Owner): "This level of thoroughness is why retrospectives are valuable."

Charlie (Senior Dev): "Better to catch this now than three stories into the next epic."
```

### Step 10: Retrospective Closure with Celebration and Commitment

```
Bob (Scrum Master): "We've covered a lot of ground today. Let me bring this retrospective to a close."

═══════════════════════════════════════════════════════════
✅ RETROSPECTIVE COMPLETE
═══════════════════════════════════════════════════════════

Bob (Scrum Master): "Epic {epic_number}: {epic_title} - REVIEWED"

**Key Takeaways:**

1. {key_lesson_1}
2. {key_lesson_2}
3. {key_lesson_3}
4. {key_lesson_4}

Alice (Product Owner): "That first takeaway is huge - {impact_of_lesson_1}."

Charlie (Senior Dev): "And lesson 2 is something we can apply immediately."

Bob (Scrum Master): "Commitments made today:"
- Action Items: {action_count}
- Preparation Tasks: {prep_task_count}
- Critical Path Items: {critical_count}

Dana (QA Engineer): "That's a lot of commitments. We need to actually follow through this time."

Bob (Scrum Master): "Agreed. Which is why we'll review these action items in our next standup."

═══════════════════════════════════════════════════════════
🎯 NEXT STEPS:
═══════════════════════════════════════════════════════════

1. Execute Preparation Sprint (Est: {prep_days} days)
2. Complete Critical Path items before Epic {next_epic_num}
3. Review action items in next standup
4. {Epic {next_epic_num} planning review session / Begin Epic {next_epic_num} planning when prep complete}

Elena (Junior Dev): "{prep_days} days of prep work is significant, but necessary."

Alice (Product Owner): "I'll communicate the timeline to stakeholders. They'll understand if we frame it as 'ensuring Epic {next_epic_num} success.'"

═══════════════════════════════════════════════════════════

Bob (Scrum Master): "Before we wrap, I want to take a moment to acknowledge the team."

Bob (Scrum Master): "Epic {epic_number} delivered {completed_stories} stories with {velocity_description} velocity. We overcame {blocker_count} blockers. We learned a lot. That's real work by real people."

Charlie (Senior Dev): "Hear, hear."

Alice (Product Owner): "I'm proud of what we shipped."

Dana (QA Engineer): "And I'm excited about Epic {next_epic_num} - especially now that we're prepared for it."

Bob (Scrum Master): "{user_name}, any final thoughts before we close?"
```

**WAIT for user to share final reflections**

```
Bob (Scrum Master): [Acknowledges what user shared] "Thank you for that, {user_name}."

Bob (Scrum Master): "Alright team - great work today. We learned a lot from Epic {epic_number}. Let's use these insights to make Epic {next_epic_num} even better."

Bob (Scrum Master): "See you all when prep work is done. Meeting adjourned!"

═══════════════════════════════════════════════════════════
```

### Step 11: Save Retrospective and Update Sprint Status

**Ensure retrospectives folder exists:**

Check if `{sprint_artifacts}/` folder exists. Create if needed.

**Generate comprehensive retrospective summary document including:**

- Epic summary and metrics
- Team participants
- Successes and strengths identified
- Challenges and growth areas
- Key insights and learnings
- Previous retro follow-through analysis (if applicable)
- Next epic preview and dependencies
- Action items with owners and timelines
- Preparation tasks for next epic
- Critical path items
- Significant discoveries and epic update recommendations (if any)
- Readiness assessment
- Commitments and next steps

**Format as readable markdown with clear sections.**

**Set filename:**

Use format: `{sprint_artifacts}/epic-{epic_number}-retro-{YYYY-MM-DD}.md`

Example: `{sprint_artifacts}/epic-1-retro-2025-01-14.md`

**Save retrospective document using Write tool.**

```
✅ Retrospective document saved: {sprint_artifacts}/epic-{epic_number}-retro-{date}.md
```

**Update sprint status file:**

1. Read the FULL sprint-status.yaml file
2. Find development_status key "epic-{epic_number}-retrospective"
3. Verify current status (typically "optional" or "pending")
4. Update to: `epic-{epic_number}-retrospective: done`
5. Save file, preserving ALL comments and structure including STATUS DEFINITIONS

**If update successful:**

```
✅ Retrospective marked as completed in sprint-status.yaml

Retrospective key: epic-{epic_number}-retrospective
Status: {previous_status} → done
```

**If retrospective key not found:**

```
⚠️ Could not update retrospective status: epic-{epic_number}-retrospective not found in sprint-status.yaml

Retrospective document was saved successfully, but sprint-status.yaml may need manual update.
```

### Step 12: Final Summary and Handoff

Present final summary:

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

{If epic update needed:}
4. **IMPORTANT: Schedule Epic {next_epic_num} planning review session**
   - Significant discoveries from Epic {epic_number} require epic updates
   - Review and update affected stories
   - Align team on revised approach
   - Do NOT start Epic {next_epic_num} until review is complete

{If no epic update needed:}
4. **Begin Epic {next_epic_num} planning when preparation complete**
   - Run epic-tech-context for Epic {next_epic_num}
   - Or continue with existing contexted epics
   - Ensure all critical path items are done first

**Team Performance:**
Epic {epic_number} delivered {completed_stories} stories with {velocity_summary}. The retrospective surfaced {insight_count} key insights and {significant_discovery_count} significant discoveries. The team is well-positioned for Epic {next_epic_num} success.

{If significant discoveries:}
⚠️ **REMINDER**: Epic update required before starting Epic {next_epic_num}

---

Bob (Scrum Master): "Great session today, {user_name}. The team did excellent work."

Alice (Product Owner): "See you at epic planning!"

Charlie (Senior Dev): "Time to knock out that prep work."
```

## Examples

### Example 1: Standard Epic Retrospective

**Scenario:** User just completed Epic 1 (authentication system) with 5 stories. All stories are done. Epic 2 is planned (user profiles).

**Execution:**

1. **Detect epic:** Sprint-status shows Epic 1 with 5/5 stories done
2. **Story analysis:** Review all 5 story files, extract dev notes, review feedback, lessons
3. **Previous retro:** None found (first epic)
4. **Next epic preview:** Epic 2 loaded, identifies dependency on Epic 1 auth components
5. **Team discussion:** Party Mode conversation about what went well (auth flow, caching), what didn't (migration issues, changing requirements), patterns discovered (error handling gaps)
6. **Preparation:** Team identifies need for auth refactoring (4 hours), testing infrastructure (6 hours) before Epic 2
7. **Action items:** 3 process improvements, 2 tech debt items, 1 documentation need
8. **Readiness check:** Testing complete, deployed to staging, stakeholders happy, no blockers
9. **Save:** Retrospective document saved to `{sprint_artifacts}/epic-1-retro-2025-01-14.md`

**Outcome:** Team has clear preparation plan (10 hours work) and 6 action items before starting Epic 2.

### Example 2: Retrospective with Significant Discovery

**Scenario:** User completed Epic 2 (user profiles) but discovered during implementation that the original architecture approach for file uploads won't scale. Epic 3 is planned (file sharing feature).

**Execution:**

1. **Detect epic:** Epic 2 complete (4/4 stories done)
2. **Story analysis:** Story 3 dev notes reveal file upload performance issues, need for different storage approach
3. **Previous retro:** Epic 1 retro loaded, team had committed to "improve error handling" (completed ✅) and "add integration tests" (not done ❌)
4. **Next epic preview:** Epic 3 loaded, HEAVILY depends on file upload functionality
5. **Team discussion:** Discovery that current file upload approach won't scale emerges during challenges discussion
6. **Significant change detection:** System detects architectural assumption violated, Epic 3 affected
7. **Alert triggered:** "SIGNIFICANT DISCOVERY ALERT" - Epic 3 assumes file uploads work at scale, but Epic 2 revealed this is wrong
8. **User decision:** User agrees to schedule Epic 3 planning review session to redesign file sharing approach
9. **Action items:** Include "Review and update Epic 3 based on file upload discovery" as critical path item
10. **Save:** Retrospective saved with significant discovery documented

**Outcome:** Epic 3 planning review scheduled, prevented team from building file sharing feature on broken foundation.

### Example 3: Partial Retrospective (Epic Not Fully Complete)

**Scenario:** User wants to run retrospective for Epic 4 but 2 out of 6 stories are still in progress.

**Execution:**

1. **Detect epic:** Epic 4 shows 4/6 stories done, 2 pending
2. **Warning presented:** Bob (Scrum Master) warns that partial retro might miss lessons from pending stories
3. **User decision:** User presented with options: (1) Complete stories first (2) Continue partial retro (3) Refresh sprint-status
4. **User chooses:** Continue with partial retro (accepts limitations)
5. **Flag set:** partial_retrospective = true
6. **Story analysis:** Only analyzes 4 completed stories, notes that 2 stories are excluded
7. **Team discussion:** Charlie warns "we might miss important lessons from pending stories"
8. **Action items:** Standard action items created, but noted that may need follow-up after stories 5-6 complete
9. **Save:** Retrospective saved with note about partial completion

**Outcome:** Retrospective completed with limitations documented, team aware of potential gaps.

## Notes

**Party Mode is central to this workflow:**
- All agent dialogue must use "Name (Role): dialogue" format
- Create authentic team dynamics (disagreements, emotions, perspectives)
- User is active participant, not observer
- Scrum Master maintains psychological safety (no blame)

**Deep story analysis is critical:**
- Don't skip reading ALL story files
- Extract patterns across stories, not just individual lessons
- Synthesize recurring themes (struggles, review feedback, breakthroughs)

**Previous retro integration creates accountability:**
- Always load and review previous epic's retrospective
- Check follow-through on action items (completed, in-progress, not addressed)
- Create continuity and learning loop

**Significant change detection prevents misalignment:**
- Actively check if Epic {N} discoveries affect Epic {N+1} plan
- Flag architectural assumption violations
- Trigger epic review session if needed
- Don't let team start next epic on wrong assumptions

**Critical readiness exploration prevents premature next epic:**
- Don't assume "done" in sprint-status means truly ready
- Verify testing, deployment, stakeholder acceptance, stability
- Surface blockers and concerns before moving forward
- Add critical path items as needed

**Action items must be SMART:**
- Specific, Measurable, Achievable, Relevant, Time-bound
- Avoid vague aspirations like "improve code quality"
- Prefer "Add error handling validation to PR checklist by next sprint"

**File locations:**
- Sprint status: `{sprint_artifacts}/sprint-status.yaml` or `{documentation_dir}/sprint-status.yaml`
- Story files: `{sprint_artifacts}/{epic_number}-{story_number}-*.md`
- Epic files: `{documentation_dir}/*epic*/epic-{epic_number}.md` (sharded) or `{documentation_dir}/*epic*.md` (whole)
- Previous retro: `{sprint_artifacts}/epic-{prev_epic_num}-retro-*.md`
- Output retro: `{sprint_artifacts}/epic-{epic_number}-retro-{YYYY-MM-DD}.md`

## Troubleshooting

**Issue:** Can't detect completed epic

**Solution:**
- Check sprint-status.yaml exists and is readable
- Verify development_status section has entries
- Fall back to asking user directly for epic number
- Can scan story directory as last resort

**Issue:** No previous retrospective found but should exist

**Solution:**
- Check file naming: `epic-{N}-retro-*.md` pattern
- Verify retrospectives folder location
- Ask user if they skipped previous retro
- Treat as first retrospective if truly missing

**Issue:** Next epic not found

**Solution:**
- This is normal if at end of roadmap
- Skip next epic preparation discussion (Step 7)
- Focus on general action items and lessons learned
- Still create valuable retrospective without next epic context

**Issue:** User doesn't engage in Party Mode discussion

**Solution:**
- Explicitly prompt user with direct questions
- Use AskUserQuestion tool if needed for key decisions
- Have team members ask user questions directly
- Create space for user input with "WAIT for user" moments

**Issue:** Too many action items created

**Solution:**
- Focus on most impactful items only
- Combine related items
- Prioritize ruthlessly (critical vs nice-to-have)
- Aim for 5-10 total action items, not 20+
- Better to complete few items than partially address many

## Output Files

- `{sprint_artifacts}/epic-{epic_number}-retro-{YYYY-MM-DD}.md` - Comprehensive retrospective summary
- `{sprint_artifacts}/sprint-status.yaml` - Updated with retrospective marked as "done"
