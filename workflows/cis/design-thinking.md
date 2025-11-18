---
description: Guide human-centered design processes using empathy-driven methodologies through the 5 design thinking phases
---

# Design Thinking

## Purpose

This workflow guides you through the structured design thinking process - Empathize, Define, Ideate, Prototype, and Test - to create solutions deeply rooted in user needs. It applies human-centered design methodologies to solve complex problems with empathy and creativity.

**When to Use:**
- Designing new products, services, or features
- Solving complex user experience problems
- Conducting user research and insight gathering
- Running design sprints or innovation workshops
- Improving existing solutions based on user feedback
- When you need to deeply understand user needs before building

**Prerequisites:**
- BMAD plugin installed
- `/workflow-init` run (creates `.bmad/config.yaml`)

## Variables

The following variables are loaded from `.bmad/config.yaml`:

- `documentation_dir` - Directory path where design thinking output documents will be saved
- `user_name` - User's name for personalization of the workflow
- `communication_language` - Preferred language for communication and documentation
- `[date]` - Current date in appropriate format for file naming

## Instructions

1. **Load Configuration**
   - Read configuration from `.bmad/config.yaml`
   - Extract `documentation_dir`, `user_name`, and `communication_language`
   - Prepare output file path: `{documentation_dir}/design-thinking-[date].md`

2. **Gather Design Context**
   - Ask the user about their design challenge:
     - What problem or opportunity are you exploring?
     - Who are the primary users or stakeholders?
     - What constraints exist (time, budget, technology)?
     - What does success look like for this project?
     - Any existing research or context to consider?
   - If context data is provided (e.g., product context, user research), load and incorporate it

3. **Delegate to Design Thinking Coach Agent**
   - Use the Task tool to invoke the `bmad-design-thinking-coach` subagent
   - Pass the design context gathered in step 2
   - The agent will guide through all 5 design thinking phases (see Workflow section)

4. **Generate Output Document**
   - Create comprehensive design thinking documentation in `{documentation_dir}/design-thinking-[date].md`
   - Include all content specified in Report section below
   - Ensure document is well-structured and actionable

5. **Confirm Completion**
   - Inform the user: "Design thinking session complete! Your human-centered design work has been saved to `{documentation_dir}/design-thinking-[date].md`"
   - Provide brief summary of key insights and next steps

## Workflow

The Design Thinking Coach agent guides through 5 sequential phases:

### Phase 1: EMPATHIZE
Build deep understanding of users through:
- User interviews and observation
- Empathy mapping exercises
- Pain point identification
- Pattern recognition in user behavior
- Emotional and contextual insights

**Deliverables:** User insights, empathy maps, pain points

### Phase 2: DEFINE
Frame the problem clearly through:
- Point of View (POV) statements
- "How Might We" (HMW) questions
- Problem insights and opportunity areas
- Clear problem definition rooted in user needs

**Deliverables:** POV statements, HMW questions, problem definition

### Phase 3: IDEATE
Generate diverse solutions through:
- Brainstorming techniques (SCAMPER, Worst Possible Idea, etc.)
- Generate 15-30 ideas minimum
- Clustering related ideas
- Selecting top 2-3 concepts for prototyping

**Deliverables:** 15-30 ideas, clustered themes, top 2-3 selected concepts

### Phase 4: PROTOTYPE
Make ideas tangible through:
- Low-fidelity prototypes (paper, wireframes, mockups)
- Minimum viable to test assumptions
- Focus on what needs validation
- Resist polish too early - intentionally rough

**Deliverables:** Low-fidelity prototypes, testing scenarios

### Phase 5: TEST
Validate with users through:
- Test with 5-7 users (reveals 85% of usability issues)
- Observe what they do, not just what they say
- Synthesize learnings
- Plan next iteration

**Deliverables:** User feedback, key learnings, iteration plan

**Process Notes:**
- Full cycle typically takes 4-8 hours depending on complexity
- Empathy phase requires access to real users - plan accordingly
- Design thinking is iterative - multiple cycles are normal
- Energy checkpoints help manage intensity of creative work
- Best conducted as collaborative workshop when possible

## Report

The workflow generates a comprehensive design thinking document at `{documentation_dir}/design-thinking-[date].md` containing:

**Required Sections:**

1. **Design Challenge Statement**
   - Clear articulation of the problem or opportunity
   - User/stakeholder identification
   - Constraints and success criteria

2. **User Insights and Empathy Findings**
   - Key insights from user interviews and observation
   - Empathy maps and pain points
   - User behavior patterns
   - Emotional and contextual understanding

3. **Problem Definition**
   - Point of View (POV) statements
   - "How Might We" questions
   - Opportunity areas identified

4. **Ideation Results**
   - All generated ideas (15-30 minimum)
   - Idea clusters and themes
   - Selected concepts (top 2-3) with rationale

5. **Prototype Approach and Description**
   - Prototype type and fidelity level
   - What assumptions are being tested
   - Visual descriptions or references

6. **Testing Plan and User Feedback**
   - Testing methodology (5-7 users)
   - User feedback summary
   - Observation notes
   - Validation or invalidation of assumptions

7. **Key Learnings**
   - What worked and what didn't
   - Surprising insights
   - Critical features vs. nice-to-haves

8. **Next Iteration Plan**
   - Specific changes to make
   - Additional questions to explore
   - Timeline and next steps

9. **Success Metrics**
   - How success will be measured
   - Key performance indicators

**Example Output Structure:**

```markdown
# Design Thinking: [Challenge Name]
Date: [date]

## Design Challenge
[Problem statement and context]

## Phase 1: Empathize
[User insights, empathy maps, pain points]

## Phase 2: Define
POV: [Point of view statement]
HMW: [How might we questions]

## Phase 3: Ideate
[All ideas generated, clusters, selected concepts]

## Phase 4: Prototype
[Prototype description and approach]

## Phase 5: Test
[Testing results and user feedback]

## Key Learnings
[Major insights and discoveries]

## Next Iteration
[Specific action items and timeline]

## Success Metrics
[How we'll measure success]
```

**Completion Message Format:**
"Design thinking session complete! Your human-centered design work has been saved to `{documentation_dir}/design-thinking-[date].md`

Key Insights:
- [Top 2-3 insights from the session]

Next Steps:
- [Immediate action items]"
