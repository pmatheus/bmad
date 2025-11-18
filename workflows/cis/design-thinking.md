---
description: Guide human-centered design processes using empathy-driven methodologies through the 5 design thinking phases
---

# Design Thinking

## What This Does

Walks you through the structured design thinking process - Empathize, Define, Ideate, Prototype, and Test - to create solutions deeply rooted in user needs. This workflow applies human-centered design methodologies to solve complex problems with empathy and creativity.

## Prerequisites

- BMAD plugin installed
- `/workflow-init` run (creates `.bmad/config.yaml`)

## When to Use

- Designing new products, services, or features
- Solving complex user experience problems
- Conducting user research and insight gathering
- Running design sprints or innovation workshops
- Improving existing solutions based on user feedback
- When you need to deeply understand user needs before building

## Instructions

### Step 1: Load Configuration

Read configuration from `.bmad/config.yaml`:
- `documentation_dir` - Where to save the design thinking output
- `user_name` - Your name for personalization
- `communication_language` - Preferred language

### Step 2: Gather Design Context

Ask the user about their design challenge:
- What problem or opportunity are you exploring?
- Who are the primary users or stakeholders?
- What constraints exist (time, budget, technology)?
- What does success look like for this project?
- Any existing research or context to consider?

If context data is provided (e.g., product context, user research), load and incorporate it.

### Step 3: Delegate to Design Thinking Coach Agent

Use the Task tool to invoke the `bmad-design-thinking-coach` subagent with the design context gathered.

The agent will guide through the 5 design thinking phases:

1. **EMPATHIZE** - Build deep understanding of users
   - User interviews, observation, empathy mapping
   - Pain point identification
   - Pattern recognition in user behavior

2. **DEFINE** - Frame the problem clearly
   - Point of View (POV) statements
   - "How Might We" questions
   - Problem insights and opportunity areas

3. **IDEATE** - Generate diverse solutions
   - Brainstorming, SCAMPER, Worst Possible Idea
   - 15-30 ideas minimum
   - Clustering and selecting top 2-3 concepts

4. **PROTOTYPE** - Make ideas tangible
   - Low-fidelity prototypes (paper, wireframes, mockups)
   - Minimum viable to test assumptions
   - Focus on what needs validation

5. **TEST** - Validate with users
   - Test with 5-7 users
   - Observe what they do, not just what they say
   - Synthesize learnings and plan iteration

### Step 4: Generate Output Document

Create design thinking output in `{documentation_dir}/design-thinking-[date].md` with:
- Design challenge statement
- User insights and empathy findings
- Problem definition (POV, HMW questions)
- Generated ideas and selected concepts
- Prototype approach and description
- Testing plan and user feedback
- Key learnings and next iteration plan
- Success metrics

### Step 5: Confirm Completion

Inform the user:
"Design thinking session complete! Your human-centered design work has been saved to `{documentation_dir}/design-thinking-[date].md`"

## Output Files

- `{documentation_dir}/design-thinking-[date].md` - Complete design thinking documentation

## Examples

**Example 1: Mobile App for Fitness Tracking**

User Context:
- Designing fitness app for busy professionals
- Existing apps feel overwhelming and time-consuming
- Need differentiation in crowded market

Process:
1. Empathize: Interviews reveal users want "micro-workouts" during work breaks
2. Define: POV - Busy professionals need guilt-free fitness that fits their schedule
3. Ideate: Generate 20 ideas, select "5-minute office workout challenges"
4. Prototype: Paper prototype of notification flow and exercise animations
5. Test: Users love simplicity but want social accountability features
6. Next Iteration: Add team challenges and progress sharing

**Example 2: Healthcare Patient Portal**

User Context:
- Hospital redesigning patient portal
- Low adoption rates and user complaints
- Particularly challenging for elderly users

Process:
1. Empathize: Shadowing elderly patients reveals technology anxiety and vision issues
2. Define: HMW - How might we make health information accessible to all ages?
3. Ideate: Voice interface, simplified navigation, family proxy access
4. Prototype: High-contrast wireframes with large fonts and voice navigation
5. Test: Elderly users successfully complete tasks with voice guidance
6. Key Learning: Family proxy access is critical feature, not nice-to-have

**Example 3: Retail Store Experience Redesign**

User Context:
- Specialty store wants to compete with online shopping
- Customers coming in but not converting
- Staff interactions feel transactional

Process:
1. Empathize: Observation shows customers want expert advice but hesitate to ask
2. Define: POV - Shoppers need approachable expertise to make confident decisions
3. Ideate: Expert stations, product storytelling, hands-on demos, personal shoppers
4. Prototype: Mockup of "Discovery Zone" with expert on duty and demo products
5. Test: Customers spend 3x longer in store, conversion up 40%
6. Next Steps: Roll out to 3 pilot stores before chain-wide implementation

## Notes

- Full design thinking cycle typically takes 4-8 hours depending on complexity
- Empathy phase requires access to real users - plan accordingly
- Low-fidelity prototypes are intentionally rough - resist polish too early
- Testing with 5-7 users reveals 85% of usability issues
- Design thinking is iterative - multiple cycles are normal
- Energy checkpoints help manage intensity of creative work
- Framework selection adapts to your specific design context
- Best conducted as collaborative workshop when possible
