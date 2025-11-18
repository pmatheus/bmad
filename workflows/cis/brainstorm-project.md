---
description: Facilitate project brainstorming sessions using interactive ideation techniques for product/software projects
---

# Brainstorm Project Workflow

## Purpose

Facilitates interactive brainstorming sessions specifically for software/product projects using proven creative ideation techniques:
- **Mind Mapping** - Visual organization of ideas
- **SCAMPER** - Systematic creative thinking (Substitute, Combine, Adapt, Modify, Put to other uses, Eliminate, Reverse)
- **Six Thinking Hats** - Multi-perspective analysis (White: Facts, Red: Emotions, Black: Risks, Yellow: Benefits, Green: Creativity, Blue: Process)
- **Brainstorming** - Rapid idea generation
- **SCAMPER** - Systematic creative thinking
- **Role Storming** - Perspective-taking ideation
- **Reverse Brainstorming** - Problem-focused thinking

**Project-focused context** ensures techniques are applied to software product development.

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

**Prerequisites:**
- BMAD plugin installed in Claude Code
- (Optional) workflow-status for progress tracking

## Variables

The following variables are used throughout this workflow:

- `{documentation_dir}` - Directory for storing documentation (from `.bmad/config.yaml`)
- `{document_output_language}` - Language for generated documents (from `.bmad/config.yaml`)
- `{communication_language}` - Language for communication (from `.bmad/config.yaml`)
- `{user_name}` - User's name for personalization (from `.bmad/config.yaml`)
- `{date}` - Current date for timestamping session outputs (format: YYYY-MM-DD)
- `{sprint_artifacts}` - Directory for sprint artifacts (typically `.bmad/sprints/current`)

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

### Brainstorming Techniques Reference

**SCAMPER** - Systematic creative thinking framework:
- **S**ubstitute - What can be replaced?
- **C**ombine - What can be merged?
- **A**dapt - What can be adjusted?
- **M**odify - What can be changed?
- **P**ut to other uses - New applications?
- **E**liminate - What can be removed?
- **R**everse - What can be flipped?

**Best for:** Feature innovation, product differentiation

**Mind Mapping** - Visual organization of ideas radiating from central concept.

**Best for:** Understanding relationships, exploring possibilities

**Six Thinking Hats** - Multi-perspective analysis:
- **White Hat** - Facts and information
- **Red Hat** - Emotions and intuition
- **Black Hat** - Risks and concerns
- **Yellow Hat** - Benefits and optimism
- **Green Hat** - Creativity and alternatives
- **Blue Hat** - Process and organization

**Best for:** Comprehensive evaluation, team alignment

**Brainstorming (Classic)** - Rapid idea generation without judgment.

**Best for:** Quantity of ideas, creative freedom

**Role Storming** - Perspective-taking from different stakeholders:
- User perspectives
- Developer perspectives
- Business perspectives
- Competitor perspectives

**Best for:** Empathy-driven design, understanding needs

**Reverse Brainstorming** - Focus on problems/failures to understand solutions.

**Best for:** Risk identification, improvement opportunities

## Workflow

1. **Initialize Session**
   - Load configuration from `.bmad/config.yaml`
   - Determine brainstorming approach (slash command vs. manual)
   - Gather project context and brainstorming goals

2. **Launch Brainstorming Session**
   - If using slash command: Execute `/bmad:core:workflows:brainstorming`
   - If using Business Analyst: Invoke with Task tool and project context
   - Facilitator presents technique menu (if applicable)

3. **Select Ideation Technique**
   - Choose from: SCAMPER, Mind Mapping, Six Thinking Hats, Brainstorming, Role Storming, or Reverse Brainstorming
   - Facilitator explains technique structure

4. **Guided Ideation Process**
   - Facilitator asks thought-provoking questions based on selected technique
   - Generate ideas without judgment (quantity over quality)
   - Capture all ideas in structured format
   - Build on ideas organically during session

5. **Organize and Capture Results**
   - Group ideas by category/theme
   - Identify patterns and key insights
   - Highlight promising directions
   - Preserve all ideas (no filtering)

6. **Save Session Output**
   - Create `{documentation_dir}/brainstorming-session-{date}.md`
   - Include: Session metadata, all ideas, key insights, next steps
   - Update `{sprint_artifacts}/bmm-workflow-status.yaml` (if tracking workflow progress)

7. **Review and Plan Next Steps**
   - Review session results
   - Identify top 3-5 most promising ideas
   - Determine how to integrate into product-brief, PRD, or architecture workflow

## Report

Upon completion, provide a summary report containing:

### Session Overview
- **Date:** {date}
- **Technique Used:** [Selected brainstorming technique]
- **Project Context:** [Brief description of project/challenge]
- **Session Duration:** [Approximate time spent]
- **Facilitator:** [Slash command or Business Analyst]

### Ideas Generated
- **Total Ideas:** [Count of ideas generated]
- **Categories:** [List of categories/themes]
- **Top Ideas:** [3-5 most promising ideas with brief descriptions]

### Key Insights
- **Patterns Identified:** [Common themes or patterns across ideas]
- **Promising Directions:** [Areas showing most potential]
- **Surprising Discoveries:** [Unexpected insights or directions]

### Output Files Created
- `{documentation_dir}/brainstorming-session-{date}.md` - Complete session results with all ideas, organized by technique structure
- `{sprint_artifacts}/bmm-workflow-status.yaml` - Updated workflow status (if applicable)

### Next Steps
- **Immediate Actions:** [What to do with brainstorming results]
- **Recommended Follow-up:** [Suggested next workflows]
  - Use product-brief to develop product vision from brainstormed ideas
  - Incorporate top features into PRD requirements
  - Explore architecture options using brainstormed technical approaches
  - Conduct research on promising directions identified

### Integration Recommendations
- **For product-brief:** [How to use brainstorming results in product vision]
- **For PRD:** [Which features to incorporate into requirements]
- **For architecture:** [Technical approaches to explore further]
- **For research:** [Areas requiring deeper investigation]

### Session Statistics
- **Ideas per Category:** [Breakdown of ideas by category]
- **Diversity Score:** [Assessment of idea variety]
- **Actionability:** [Number of ideas ready for immediate consideration]

**Example Report Output:**

```markdown
# Brainstorming Session Report
Date: 2025-01-14
Technique: SCAMPER
Project: Project Management App Feature Exploration

## Ideas Generated
Total Ideas: 18
Categories: Visual Collaboration (6), Simplification (5), Integration (4), Innovation (3)

Top Ideas:
1. Visual kanban boards replacing traditional task lists
2. Merged calendar-task view for unified planning
3. Dynamic priority adjustment based on deadlines
4. Simplified permissions for faster team setup
5. Task tracking doubles as time tracking

## Key Insights
- Strong theme around visual collaboration emerged
- Simplicity over complexity was recurring benefit
- Integration with existing tools highly valued
- Traditional task list paradigm may be limiting

## Next Steps
1. Develop visual kanban concept in product-brief
2. Prototype merged calendar-task view
3. Research simplified permission models
4. Include top 5 ideas in PRD feature requirements

## Output Files
- `.bmad/brainstorming-session-2025-01-14.md` (complete session)
- `.bmad/sprints/current/bmm-workflow-status.yaml` (updated)
```

**Brainstorming Principles Applied:**
- Quantity over quality (generate many ideas)
- No judgment during ideation (all ideas welcome)
- Build on others' ideas (yes, and...)
- Visual thinking helps (diagrams, sketches)
- Diverse perspectives create better ideas

**Troubleshooting Notes:**

| Issue | Solution |
|-------|----------|
| Slash command not available | Use Business Analyst alternative approach |
| Not generating enough ideas | Try SCAMPER, set quantity goal (20+ ideas), allow wild ideas |
| Ideas too similar/conventional | Use Reverse Brainstorming or Role Storming from unconventional perspectives |
| Need team brainstorming | Run slash command in shared session, AI facilitates team input |
| Results not actionable | Ask facilitator to prioritize, identify 3-5 most promising, create action items |

**Related Workflows:**
- **product-brief** - Use brainstorming results to inform product vision
- **research** - Brainstorm research questions before conducting research
- **prd** - Incorporate brainstormed features into requirements
- **architecture** - Use architecture brainstorming to explore technical options
- **core:brainstorming** - General-purpose brainstorming (not project-specific)
