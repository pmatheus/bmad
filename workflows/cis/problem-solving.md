---
description: Apply systematic problem-solving methodologies to crack complex challenges with proven frameworks
---

# Problem Solving

## What This Does

Guides you through systematic problem-solving using proven methodologies to diagnose root causes, generate creative solutions, and develop implementation plans. This workflow prevents jumping to solutions prematurely by ensuring thorough diagnosis and structured evaluation.

## Prerequisites

- BMAD plugin installed
- `/workflow-init` run (creates `.bmad/config.yaml`)

## When to Use

- Tackling complex or recurring problems
- Need root cause analysis before implementing solutions
- Stuck with a problem that resists obvious fixes
- Want systematic approach instead of trial-and-error
- Managing technical, organizational, or process challenges
- Need objective evaluation of solution alternatives

## Instructions

### Step 1: Load Configuration

Read configuration from `.bmad/config.yaml`:
- `documentation_dir` - Where to save the problem-solving analysis
- `user_name` - Your name for personalization
- `communication_language` - Preferred language

### Step 2: Gather Problem Context

Ask the user about their problem:
- What problem are you trying to solve?
- How did you first notice this problem?
- Who is experiencing this problem?
- When and where does it occur?
- What's the impact or cost of this problem?
- What would success look like?

If context data is provided (e.g., problem brief, previous attempts), load and incorporate it.

### Step 3: Delegate to Creative Problem Solver Agent

Use the Task tool to invoke the `bmad-creative-problem-solver` subagent with the problem context gathered.

The agent will guide through systematic problem-solving:

1. **Define and Refine Problem** - Transform vague complaints into precise problem statements

2. **Diagnose and Bound Problem** - Use Is/Is Not Analysis to understand scope and patterns

3. **Root Cause Analysis** - Apply Five Whys, Fishbone Diagram, or Systems Thinking
   - Distinguish symptoms from root causes
   - Identify contributing factors
   - Understand system dynamics

4. **Analyze Forces and Constraints** - Force Field Analysis and constraint identification
   - What drives toward solution?
   - What resists change?
   - What limits solution space?

5. **Generate Solutions** - Apply creative and systematic methods
   - TRIZ, Morphological Analysis, Biomimicry
   - Lateral Thinking, Assumption Busting, Reverse Brainstorming
   - Generate 10-15 solution ideas minimum

6. **Evaluate and Select** - Systematic evaluation against criteria
   - Decision Matrix, Cost-Benefit Analysis, Risk Assessment
   - Clear recommendation with rationale

7. **Plan Implementation** - Detailed action plan with ownership
   - Implementation strategy (pilot, phased, big bang)
   - Action steps, timeline, resources, responsibilities
   - PDCA cycle for iterative improvement

8. **Establish Monitoring** - Metrics, validation, and risk mitigation
   - Success metrics and targets
   - Validation plan and pilot testing
   - Risk mitigation and adjustment triggers

### Step 4: Generate Output Document

Create problem-solving analysis in `{documentation_dir}/problem-solution-[date].md` with:
- Refined problem statement and context
- Problem boundaries (Is/Is Not Analysis)
- Root cause analysis and contributing factors
- Driving/restraining forces and constraints
- Generated solutions and creative alternatives
- Solution evaluation and recommendation
- Implementation plan with timeline and responsibilities
- Success metrics, validation plan, and risk mitigation
- Key learnings

### Step 5: Confirm Completion

Inform the user:
"Problem-solving analysis complete! Your systematic solution has been saved to `{documentation_dir}/problem-solution-[date].md`"

## Output Files

- `{documentation_dir}/problem-solution-[date].md` - Comprehensive problem-solving documentation

## Examples

**Example 1: Software Performance Degradation**

User Context:
- Web application response time increased by 300% over 3 months
- Users complaining, some churning
- Team has tried caching and database optimization with minimal improvement

Process:
1. Problem Statement: "API response time degraded from 200ms to 800ms affecting 60% of users"
2. Is/Is Not Analysis: Only affects authenticated users, only during business hours, started after feature X launch
3. Root Cause (Five Whys): Feature X queries all user permissions on every request (N+1 query problem)
4. Solution Generation: Permission caching, query optimization, background sync, permission service
5. Evaluation: Permission caching wins on impact/effort ratio
6. Implementation: 2-week sprint with before/after metrics, gradual rollout
7. Result: Response time reduced to 180ms, user satisfaction recovered

**Example 2: Team Communication Breakdown**

User Context:
- Cross-functional team missing deadlines
- Blame shifting between engineering and product
- Previous attempt at daily standups failed

Process:
1. Problem Refinement: "Product and engineering have different definitions of 'done', causing rework"
2. Is/Is Not: Happens on complex features, not simple bugs; new team members struggle more
3. Root Cause (Fishbone): No acceptance criteria, unclear dependencies, async communication gaps
4. Force Field: Driving - management pressure, team motivation | Restraining - time pressure, tool overload
5. Solution Generation: Definition of Done checklist, story templates, weekly sync, pair programming
6. Evaluation: Story templates + weekly sync selected (low effort, high impact)
7. Implementation: Pilot with one squad for 2 sprints, measure rework rate
8. Result: Rework reduced 70%, team morale improved, scaled to all squads

**Example 3: Manufacturing Quality Issues**

User Context:
- Defect rate increased from 2% to 8% in past quarter
- Expensive rework and customer complaints
- Quality team can't identify pattern

Process:
1. Problem Statement: "8% defect rate in final assembly causing $200K/month rework cost"
2. Is/Is Not: Only on Line B, only on afternoon shift, only for Product Family Y
3. Root Cause (Systems Thinking): Afternoon shift uses different supplier parts due to stockouts; those parts have tighter tolerances requiring calibration adjustment
4. Constraint: Can't change suppliers short-term due to contracts
5. Solution Generation: Recalibrate for supplier parts, improve inventory to avoid stockouts, dual-calibration settings, supplier quality audit
6. Evaluation: Dual-calibration wins (immediate impact, low cost)
7. Implementation: 1-week calibration update with operator training, daily defect monitoring
8. Result: Defect rate dropped to 1.5%, identified supplier quality issue for contract renegotiation

## Notes

- Systematic problem-solving takes 2-4 hours depending on complexity
- Root cause analysis prevents treating symptoms instead of causes
- Generating 10-15 solutions increases likelihood of breakthrough ideas
- Energy checkpoints help manage cognitive intensity
- Framework selection adapts to problem type (technical, organizational, process)
- Implementation without monitoring leads to recurring problems
- Encourage honest assessment of constraints and forces
- Optional lessons learned step captures insights for future problems
- Best when user has good knowledge of problem context
