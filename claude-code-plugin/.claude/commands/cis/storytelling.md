---
description: Craft compelling narratives using proven story frameworks for marketing, pitches, and brand storytelling
---

# Storytelling

## What This Does

Guides you through structured narrative development using proven story frameworks to create emotionally resonant and engaging stories. This workflow helps craft stories for marketing, pitches, brand narratives, case studies, and any context where compelling storytelling matters.

## Prerequisites

- BMAD plugin installed
- `/workflow-init` run (creates `.bmad/config.yaml`)

## When to Use

- Creating marketing or brand narratives
- Developing pitch decks or investor presentations
- Writing case studies or customer success stories
- Crafting origin stories or company narratives
- Building emotional connection with audiences
- Transforming data or insights into compelling narratives
- Developing content marketing or thought leadership pieces

## Instructions

### Step 1: Load Configuration

Read configuration from `.bmad/config.yaml`:
- `output_folder` - Where to save the story document
- `user_name` - Your name for personalization
- `communication_language` - Preferred language

### Step 2: Gather Story Context

Ask the user about their storytelling needs:
- What's the purpose of this story? (marketing, pitch, brand narrative, case study)
- Who is your target audience?
- What key messages or takeaways do you want the audience to have?
- Any constraints? (length, tone, medium, brand guidelines)

If context data is provided (e.g., brand info, product details), load and incorporate it.

### Step 3: Delegate to Storyteller Agent

Use the Task tool to invoke the `bmad-storyteller` subagent with the story context gathered.

The agent will guide through narrative development:

1. **Select Story Framework** - Choose from 10 proven frameworks:

   **Transformation Narratives:**
   - Hero's Journey - Classic transformation arc
   - Pixar Story Spine - Emotional tension to resolution
   - Customer Journey Story - Before/after transformation
   - Challenge-Overcome Arc - Dramatic obstacle to victory

   **Strategic Narratives:**
   - Brand Story - Values, mission, positioning
   - Pitch Narrative - Problem to solution structure
   - Vision Narrative - Future-focused aspiration
   - Origin Story - Foundational "how it began" narrative

   **Specialized Narratives:**
   - Data Storytelling - Transform insights into narrative
   - Emotional Hooks - Craft powerful openings

2. **Gather Story Elements** - Framework-specific questions to draw out:
   - Characters and their journeys
   - Conflict and tension
   - Transformation and change
   - Core truth and authenticity

3. **Craft Emotional Arc** - Develop emotional journey:
   - Beginning emotion
   - Turning point shift
   - Ending emotion
   - Peaks and valleys

4. **Develop Opening Hook** - Create attention-grabbing opening:
   - Surprising facts or questions
   - Intriguing statements
   - Relatable moments
   - Concrete vivid details

5. **Write Core Narrative** - Three modes:
   - User drafts with AI guidance
   - AI writes first draft for user refinement
   - Collaborative co-creation

6. **Create Story Variations** - Adapt for different contexts:
   - Short version (1-3 sentences) - social media, emails
   - Medium version (1-2 paragraphs) - blog intros, summaries
   - Extended version - full narrative for articles, presentations

7. **Usage Guidelines** - Strategic deployment guidance:
   - Best channels for this story
   - Audience-specific adaptations
   - Tone and voice consistency
   - Visual or multimedia enhancements

### Step 4: Generate Output Document

Create storytelling output in `.bmad/output/story-[date].md` with:
- Story purpose and target audience
- Selected framework and rationale
- Complete core narrative
- Story variations (short, medium, extended)
- Emotional arc and key touchpoints
- Opening hook
- Usage guidelines and deployment strategy
- Refinement notes

### Step 5: Confirm Completion

Inform the user:
"Story complete! Your narrative has been saved to `.bmad/output/story-[date].md`"

## Output Files

- `.bmad/output/story-[date].md` - Complete story with all variations and usage guidelines

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
