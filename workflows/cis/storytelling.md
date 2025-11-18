---
description: Craft compelling narratives using proven story frameworks for marketing, pitches, and brand storytelling
---

# Storytelling

## Purpose

Guides you through structured narrative development using proven story frameworks to create emotionally resonant and engaging stories. This workflow helps craft stories for marketing, pitches, brand narratives, case studies, and any context where compelling storytelling matters.

**When to Use:**
- Creating marketing or brand narratives
- Developing pitch decks or investor presentations
- Writing case studies or customer success stories
- Crafting origin stories or company narratives
- Building emotional connection with audiences
- Transforming data or insights into compelling narratives
- Developing content marketing or thought leadership pieces

**Prerequisites:**
- BMAD plugin installed
- `/workflow-init` run (creates `.bmad/config.yaml`)

## Variables

The following variables are used throughout this workflow:

- `{documentation_dir}` - Directory where story documents are saved (from `.bmad/config.yaml`)
- `{user_name}` - User's name for personalization (from `.bmad/config.yaml`)
- `{communication_language}` - Preferred language for communication (from `.bmad/config.yaml`)
- `{date}` - Current date in YYYY-MM-DD format for file naming
- `{story_purpose}` - The intended use of the story (marketing, pitch, brand narrative, case study)
- `{target_audience}` - The intended audience for the story
- `{key_messages}` - Core takeaways the audience should have
- `{constraints}` - Any limitations (length, tone, medium, brand guidelines)
- `{selected_framework}` - The story framework chosen from the 10 available options

## Instructions

### 1. Load Configuration

Read configuration from `.bmad/config.yaml` to retrieve:
- `documentation_dir` - Where to save the story document
- `user_name` - Your name for personalization
- `communication_language` - Preferred language

### 2. Gather Story Context

Ask the user about their storytelling needs:
- What's the purpose of this story? (marketing, pitch, brand narrative, case study)
- Who is your target audience?
- What key messages or takeaways do you want the audience to have?
- Any constraints? (length, tone, medium, brand guidelines)

If context data is provided (e.g., brand info, product details), load and incorporate it into `{story_purpose}`, `{target_audience}`, `{key_messages}`, and `{constraints}` variables.

### 3. Delegate to Storyteller Agent

Use the Task tool to invoke the `bmad-storyteller` subagent with the story context gathered in Step 2.

The agent will guide through the following narrative development process:

**a) Select Story Framework** - Choose from 10 proven frameworks:

*Transformation Narratives:*
- Hero's Journey - Classic transformation arc
- Pixar Story Spine - Emotional tension to resolution
- Customer Journey Story - Before/after transformation
- Challenge-Overcome Arc - Dramatic obstacle to victory

*Strategic Narratives:*
- Brand Story - Values, mission, positioning
- Pitch Narrative - Problem to solution structure
- Vision Narrative - Future-focused aspiration
- Origin Story - Foundational "how it began" narrative

*Specialized Narratives:*
- Data Storytelling - Transform insights into narrative
- Emotional Hooks - Craft powerful openings

**b) Gather Story Elements** - Framework-specific questions to draw out:
- Characters and their journeys
- Conflict and tension
- Transformation and change
- Core truth and authenticity

**c) Craft Emotional Arc** - Develop emotional journey:
- Beginning emotion
- Turning point shift
- Ending emotion
- Peaks and valleys

**d) Develop Opening Hook** - Create attention-grabbing opening:
- Surprising facts or questions
- Intriguing statements
- Relatable moments
- Concrete vivid details

**e) Write Core Narrative** - Three modes:
- User drafts with AI guidance
- AI writes first draft for user refinement
- Collaborative co-creation

**f) Create Story Variations** - Adapt for different contexts:
- Short version (1-3 sentences) - social media, emails
- Medium version (1-2 paragraphs) - blog intros, summaries
- Extended version - full narrative for articles, presentations

**g) Usage Guidelines** - Strategic deployment guidance:
- Best channels for this story
- Audience-specific adaptations
- Tone and voice consistency
- Visual or multimedia enhancements

### 4. Generate Output Document

Create storytelling output in `{documentation_dir}/story-{date}.md` with:
- Story purpose and target audience
- Selected framework and rationale
- Complete core narrative
- Story variations (short, medium, extended)
- Emotional arc and key touchpoints
- Opening hook
- Usage guidelines and deployment strategy
- Refinement notes

### 5. Confirm Completion

Inform the user:
"Story complete! Your narrative has been saved to `{documentation_dir}/story-{date}.md`"

## Workflow

```
┌─────────────────────────────────────┐
│ 1. Load Configuration               │
│    - Read .bmad/config.yaml         │
│    - Extract directory paths        │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ 2. Gather Story Context             │
│    - Story purpose                  │
│    - Target audience                │
│    - Key messages                   │
│    - Constraints                    │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ 3. Delegate to Storyteller Agent    │
│    ┌───────────────────────────┐   │
│    │ a) Select Framework       │   │
│    └───────────┬───────────────┘   │
│                ▼                    │
│    ┌───────────────────────────┐   │
│    │ b) Gather Story Elements  │   │
│    └───────────┬───────────────┘   │
│                ▼                    │
│    ┌───────────────────────────┐   │
│    │ c) Craft Emotional Arc    │   │
│    └───────────┬───────────────┘   │
│                ▼                    │
│    ┌───────────────────────────┐   │
│    │ d) Develop Opening Hook   │   │
│    └───────────┬───────────────┘   │
│                ▼                    │
│    ┌───────────────────────────┐   │
│    │ e) Write Core Narrative   │   │
│    └───────────┬───────────────┘   │
│                ▼                    │
│    ┌───────────────────────────┐   │
│    │ f) Create Story Variations│   │
│    └───────────┬───────────────┘   │
│                ▼                    │
│    ┌───────────────────────────┐   │
│    │ g) Usage Guidelines       │   │
│    └───────────────────────────┘   │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ 4. Generate Output Document         │
│    - Save to story-{date}.md        │
│    - Include all story components   │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ 5. Confirm Completion               │
│    - Notify user of saved file      │
└─────────────────────────────────────┘
```

## Report

After completing the storytelling workflow, provide the user with:

### Completion Summary

- **Story File Location**: Full path to the generated story document
- **Framework Used**: Which framework was selected and why it was appropriate
- **Story Variations**: Confirm all three versions (short, medium, extended) were created
- **Key Story Elements**: Briefly summarize the core narrative and emotional arc

### Story Quality Indicators

- **Authenticity Check**: Confirm the story is drawn from real experiences and truths
- **Conflict Presence**: Verify the story includes tension and struggle
- **Transformation Arc**: Confirm clear before/after or change journey
- **Emotional Touchpoints**: List key emotional moments identified

### Deployment Guidance

- **Primary Use Case**: The main context where this story should be used
- **Recommended Channels**: Top 2-3 channels for story deployment
- **Next Steps**: Suggested actions (e.g., test with audience, create visuals, adapt for additional formats)

### Output Files

- `{documentation_dir}/story-{date}.md` - Complete story with all variations and usage guidelines

### Example Report

```
Story Development Complete!

Your narrative has been saved to: /project/docs/story-2025-01-15.md

Framework Selected: Customer Journey Story (Before/After transformation)
Rationale: Best suited for demonstrating concrete ROI and transformation for VP-level decision makers

Story Variations Created:
✓ Short (2 sentences) - For social proof and sales snippets
✓ Medium (2 paragraphs) - For website case study summary
✓ Extended (500 words) - For full case study and sales enablement

Key Story Elements:
- Opening Hook: "Marketing team was spending 40 hours/week on reporting. Now it takes 4."
- Emotional Arc: Overwhelm → Hope → Confidence → Success
- Core Transformation: Manual processes to automated efficiency with 10x ROI
- Authenticity: Real customer data with specific metrics and quotes

Deployment Recommendations:
1. Lead with this case study in sales conversations with similar companies
2. Feature on website homepage as social proof
3. Create short version for LinkedIn company posts
4. Consider video testimonial to complement written narrative

Estimated time investment: 90 minutes
Story effectiveness rating: High (concrete metrics, relatable problem, clear transformation)
```

## Examples

**Example 1: SaaS Product Origin Story**

User Context:
- B2B SaaS founder wants origin story for website and pitch deck
- Bootstrapped company, started from personal pain point
- Target audience: SMB decision makers

Process:
1. Framework Selected: Origin Story + Hero's Journey blend
2. Story Elements: Founder's frustration with enterprise tools, late nights building MVP, first customer win
3. Emotional Arc: Frustration → Determination → Hope → Triumph
4. Opening Hook: "At 2 AM on a Tuesday, Sarah deleted the project management tool her team had paid $50K for."
5. Core Narrative: 500-word origin story emphasizing relatability and problem-solving
6. Variations: 2-sentence version for Twitter bio, paragraph for About page, full version for pitch deck
7. Result: Story resonates with SMB buyers who share enterprise tool frustration

**Example 2: Customer Success Case Study**

User Context:
- SaaS company wants case study for sales enablement
- Customer achieved 10x ROI in 6 months
- Target audience: VP-level decision makers in similar companies

Process:
1. Framework Selected: Customer Journey Story (Before/After transformation)
2. Story Elements: Customer's struggle with manual processes, implementation journey, transformation results
3. Emotional Arc: Overwhelm → Hope → Confidence → Success
4. Opening Hook: "Marketing team was spending 40 hours/week on reporting. Now it takes 4."
5. Core Narrative: Challenge-Solution-Results structure with specific metrics
6. Variations: Executive summary for sales decks, full case study for website, social proof snippets
7. Result: Case study cited in 60% of closed deals in target segment

**Example 3: Data Storytelling for Quarterly Business Review**

User Context:
- Product manager presenting user engagement insights to executives
- Data shows unexpected user behavior patterns
- Target audience: C-suite with limited time and attention

Process:
1. Framework Selected: Data Storytelling
2. Story Elements: Context (declining feature usage), insight (users found workaround), pattern (workaround more efficient), implication (feature redesign opportunity)
3. Emotional Arc: Concern → Curiosity → Revelation → Opportunity
4. Opening Hook: "Our most popular feature is being abandoned. But that's actually good news."
5. Core Narrative: Data reveals user innovation, validates product direction shift
6. Variations: 3-slide executive summary, detailed analysis for product team, blog post for thought leadership
7. Result: Executive approval for feature redesign, blog post generated inbound leads

**Example 4: Brand Narrative for Rebranding**

User Context:
- 20-year-old company undergoing digital transformation
- Need to maintain heritage while signaling innovation
- Target audience: Existing customers and new digital-native prospects

Process:
1. Framework Selected: Brand Story + Vision Narrative
2. Story Elements: Heritage of craftsmanship, evolution through customer needs, vision of accessible expertise
3. Emotional Arc: Nostalgia → Pride → Excitement → Aspiration
4. Opening Hook: "For 20 years, we've perfected our craft. Now we're perfecting how we share it."
5. Core Narrative: Bridge past excellence with future innovation, emphasize consistent values
6. Variations: Founder letter, website About page, employee onboarding story, investor update
7. Result: Rebrand maintains 95% customer retention while attracting younger demographic

## Notes

- Storytelling typically takes 1-3 hours depending on complexity and collaboration mode
- Best stories are authentic - drawn from real experiences and truths
- Show don't tell - use concrete vivid details over abstract statements
- Conflict and tension are essential - every story needs struggle
- Transformation matters more than achievements alone
- Framework selection adapts to story purpose and audience
- Multiple story variations maximize utility across channels
- Testing stories with target audience reveals what resonates
- Agent uses Socratic method to draw out user's story rather than writing for them (unless requested)
- Emotion drives memory - identify emotional touchpoints carefully
