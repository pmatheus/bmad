---
description: Facilitate project brainstorming sessions using interactive ideation techniques for product/software projects
---

# Brainstorm Project Workflow

## What This Does

Facilitates interactive brainstorming sessions specifically for software/product projects using proven creative ideation techniques:
- **Mind Mapping** - Visual organization of ideas
- **SCAMPER** - Systematic creative thinking (Substitute, Combine, Adapt, Modify, Put to other uses, Eliminate, Reverse)
- **Six Thinking Hats** - Multi-perspective analysis (White: Facts, Red: Emotions, Black: Risks, Yellow: Benefits, Green: Creativity, Blue: Process)
- **Brainstorming** - Rapid idea generation
- **Role Storming** - Perspective-taking ideation
- **Reverse Brainstorming** - Problem-focused thinking

**Project-focused context** ensures techniques are applied to software product development.

## Prerequisites

- BMAD plugin installed in Claude Code
- (Optional) workflow-status for progress tracking

## When to Use This

**Use brainstorm-project when:**
- Starting a new product or feature
- Need creative solutions to design challenges
- Want to explore multiple approaches
- Stuck and need fresh perspectives
- Team ideation session (facilitated by AI)

**Best timing:**
- Before product-brief (generate initial ideas)
- Before PRD (explore feature possibilities)
- Before architecture (ideate technical approaches)
- Anytime you need structured creative thinking

## Instructions

### Step 1: Load Configuration

Read configuration from `.bmad/config.yaml`:

```yaml
documentation_dir: .bmad
document_output_language: "English"
communication_language: "English"
user_name: "Your Name"
```

Store these values for use throughout the workflow.

### Step 2: Choose Your Approach

**Option A: Use Existing Brainstorming Slash Command (Recommended)**

The brainstorm-project workflow uses the core brainstorming workflow, which is available as a slash command:

```
/bmad:core:workflows:brainstorming
```

This launches an **interactive brainstorming session** with:
1. Menu of ideation techniques
2. Guided facilitation through selected technique
3. Captured session results
4. Saved output document

**Option B: Manual Brainstorming with Business Analyst**

Use the Task tool to invoke the Business Analyst for facilitated brainstorming:

```yaml
subagent_type: bmad-analyst
prompt: |
  I need help brainstorming for a software/product project.

  **Project Context:**
  [Brief description of your project or challenge]

  **What I need to ideate:**
  - [Specific area needing ideas - features, architecture, UX, business model, etc.]

  **Brainstorming Technique:**
  [SCAMPER / Mind Mapping / Six Thinking Hats / Brainstorming / Role Storming / Reverse Brainstorming]

  Please facilitate an interactive brainstorming session and capture the results.
```

### Step 3: Participate in Brainstorming Session

The facilitator (slash command or Business Analyst) will:

1. **Present technique menu** (if using slash command)
2. **Guide through ideation process** using selected technique
3. **Ask thought-provoking questions** to stimulate creativity
4. **Capture all ideas** without judgment
5. **Organize findings** in structured format
6. **Save session results** to `{documentation_dir}/brainstorming-session-{date}.md`

### Step 4: Review Brainstorming Results

The session output will include:

**Session Metadata:**
- Date and technique used
- Project context
- Participants

**Ideas Generated:**
- All ideas captured during session
- Organized by category or theme
- No filtering (all ideas preserved)

**Key Insights:**
- Patterns identified
- Promising directions
- Areas for further exploration

**Next Steps:**
- How to use brainstorming results
- Recommended follow-up activities
- Integration with product-brief or PRD

## Brainstorming Techniques Explained

### SCAMPER

Systematic creative thinking framework:
- **S**ubstitute - What can be replaced?
- **C**ombine - What can be merged?
- **A**dapt - What can be adjusted?
- **M**odify - What can be changed?
- **P**ut to other uses - New applications?
- **E**liminate - What can be removed?
- **R**everse - What can be flipped?

**Best for:** Feature innovation, product differentiation

### Mind Mapping

Visual organization of ideas radiating from central concept.

**Best for:** Understanding relationships, exploring possibilities

### Six Thinking Hats

Multi-perspective analysis:
- **White Hat** - Facts and information
- **Red Hat** - Emotions and intuition
- **Black Hat** - Risks and concerns
- **Yellow Hat** - Benefits and optimism
- **Green Hat** - Creativity and alternatives
- **Blue Hat** - Process and organization

**Best for:** Comprehensive evaluation, team alignment

### Brainstorming (Classic)

Rapid idea generation without judgment.

**Best for:** Quantity of ideas, creative freedom

### Role Storming

Perspective-taking from different stakeholders:
- User perspectives
- Developer perspectives
- Business perspectives
- Competitor perspectives

**Best for:** Empathy-driven design, understanding needs

### Reverse Brainstorming

Focus on problems/failures to understand solutions.

**Best for:** Risk identification, improvement opportunities

## Examples

### Example 1: Feature Brainstorming with SCAMPER

**Using Slash Command:**
```
/bmad:core:workflows:brainstorming
```

**Session:**
```
Facilitator: "Let's use SCAMPER to brainstorm features for your project management app."

Substitute: "What if we replace traditional task lists with visual kanban boards?"
Combine: "What if we merged calendar and task management into one view?"
Adapt: "How could we adapt collaboration features from chat apps?"
Modify: "What if task priorities were dynamic based on deadlines?"
Put to other uses: "Could the task tracking also serve as time tracking?"
Eliminate: "What if we removed complex permission systems for simplicity?"
Reverse: "What if projects organized tasks instead of tasks organizing projects?"

[Ideas captured and organized in session output]
```

**Output:** `brainstorming-session-2025-01-14.md` with:
- 15+ feature ideas generated
- Organized by SCAMPER category
- Key insights: Visual collaboration and simplicity themes emerged
- Next steps: Explore visual kanban and simplified permissions in product-brief

### Example 2: Architecture Brainstorming with Six Thinking Hats

**Using Business Analyst:**
```yaml
subagent_type: bmad-analyst
prompt: |
  I need help brainstorming architecture approaches for a real-time collaboration platform.

  **Project Context:**
  Building a collaborative whiteboard tool (like Miro/Figma) with real-time multi-user editing.

  **What I need to ideate:**
  - Architecture patterns for real-time sync
  - Technology stack options
  - Scalability approaches

  **Brainstorming Technique:** Six Thinking Hats

  Please facilitate a structured brainstorming session exploring different perspectives on the architecture.
```

**Session:**
```
Analyst (White Hat - Facts): "Real-time collaboration requires conflict-free data structures. Options: CRDT, OT, Event Sourcing."

Analyst (Yellow Hat - Benefits): "CRDTs allow offline editing and eventual consistency. No central server needed for conflict resolution."

Analyst (Black Hat - Risks): "CRDTs have large memory overhead. Complex to implement correctly. Limited support in libraries."

Analyst (Green Hat - Creativity): "What if we used hybrid approach? CRDT for canvas state, OT for text editing?"

Analyst (Red Hat - Intuition): "CRDT feels like the future-proof approach. Industry is moving that direction."

Analyst (Blue Hat - Process): "Let's prototype CRDT with existing library (Yjs, Automerge) before committing."

[Multi-perspective analysis captured]
```

**Output:** Business Analyst creates `brainstorming-session-2025-01-14.md` with:
- Architecture options analyzed from 6 perspectives
- Hybrid approach emerged as promising
- Recommended approach: Prototype with Yjs CRDT library
- Next steps: Technical spike, then architecture workflow

### Example 3: Problem-Solving with Reverse Brainstorming

**Using Slash Command:**
```
/bmad:core:workflows:brainstorming
```

**Session:**
```
Facilitator: "Let's use Reverse Brainstorming to identify risks in your e-commerce platform."

Facilitator: "How could we make checkout as frustrating as possible?"

- "Require account creation before seeing cart"
- "Hide shipping costs until final step"
- "Make payment form complex with many fields"
- "Use unclear error messages"
- "Lose cart data on page refresh"
- "Require password reset on every login"

Facilitator: "Now let's reverse these into positive requirements:"

✅ Allow guest checkout
✅ Show shipping costs early
✅ Simplify payment (autofill, saved cards)
✅ Clear, helpful error messages
✅ Persist cart across sessions
✅ Secure but convenient authentication

[Problems reversed into requirements]
```

**Output:** `brainstorming-session-2025-01-14.md` with:
- 12 potential problems identified
- Reversed into positive requirements
- Key insight: Transparency and simplicity are critical
- Next steps: Incorporate requirements into product-brief

## Notes

**Project-specific context:**
- Brainstorm-project is optimized for software/product projects
- General brainstorming workflow (core) works for any topic
- Project context helps facilitator ask relevant questions

**Brainstorming principles:**
- Quantity over quality (generate many ideas)
- No judgment during ideation (all ideas welcome)
- Build on others' ideas (yes, and...)
- Visual thinking helps (diagrams, sketches)
- Diverse perspectives create better ideas

**Integration with other workflows:**
- **product-brief** - Use brainstorming results to inform product vision
- **PRD** - Incorporate brainstormed features into requirements
- **architecture** - Use architecture brainstorming to explore options
- **research** - Brainstorm research questions before conducting research

**Output location:**
- Brainstorming sessions saved to `{documentation_dir}/brainstorming-session-{date}.md`
- All ideas preserved (no filtering)
- Organized by technique structure
- Next steps and insights included

## Troubleshooting

**Issue:** Slash command not available

**Solution:**
- Check BMAD plugin installation
- Verify `/bmad:core:workflows:brainstorming` exists
- Use Business Analyst alternative approach instead

**Issue:** Not generating enough ideas

**Solution:**
- Try different technique (SCAMPER often generates most ideas)
- Set quantity goal (aim for 20+ ideas)
- Allow wild ideas (don't self-censor)
- Build on each idea before moving to next

**Issue:** Ideas are too similar or conventional

**Solution:**
- Use Reverse Brainstorming to break conventional thinking
- Use Role Storming from unconventional perspectives
- Apply SCAMPER "Reverse" and "Eliminate" aggressively

**Issue:** Need team brainstorming (not just solo)

**Solution:**
- Run slash command in shared session
- Capture team members' ideas in the session
- Facilitator (AI) asks questions, team responds
- Works well for remote async brainstorming

**Issue:** Results not actionable

**Solution:**
- After brainstorming, ask facilitator to prioritize ideas
- Identify 3-5 most promising directions
- Create action items for each promising idea
- Integrate top ideas into product-brief or PRD

## Output Files

- `{documentation_dir}/brainstorming-session-{date}.md` - Complete session results
- `{sprint_artifacts}/bmm-workflow-status.yaml` - Updated with brainstorm-project completion (if tracking)

## Related Workflows

- **product-brief** - Use brainstorming results to inform product vision
- **research** - Brainstorm research questions before conducting research
- **prd** - Incorporate brainstormed features into requirements
- **architecture** - Use architecture brainstorming to explore technical options
- **core:brainstorming** - General-purpose brainstorming (not project-specific)
