---
description: Identify disruption opportunities and architect business model innovation through strategic market analysis
---

# Innovation Strategy

## What This Does

Guides you through a comprehensive strategic analysis process to identify breakthrough opportunities and architect sustainable business model innovation. This workflow applies proven innovation frameworks to analyze markets, competitive dynamics, and business model innovation pathways.

## Prerequisites

- BMAD plugin installed
- `/workflow-init` run (creates `.bmad/config.yaml`)

## When to Use

- Exploring new market opportunities or strategic pivots
- Facing market pressure or competitive threats
- Analyzing business model innovation opportunities
- Planning strategic transformation or disruption plays
- Conducting strategic planning or innovation workshops

## Instructions

### Step 1: Load Configuration

Read configuration from `.bmad/config.yaml`:
- `output_folder` - Where to save the innovation strategy document
- `user_name` - Your name for personalization
- `communication_language` - Preferred language

### Step 2: Gather Strategic Context

Ask the user about their strategic situation:
- What company or business are we analyzing?
- What's driving this strategic exploration?
- What's your current business model in brief?
- What constraints or boundaries exist?
- What would breakthrough success look like?

If context data is provided (e.g., industry analysis, market research), load and incorporate it.

### Step 3: Delegate to Innovation Strategist Agent

Use the Task tool to invoke the `bmad-innovation-strategist` subagent with the strategic context gathered.

The agent will guide through:

1. **Market Landscape Analysis** - Using frameworks like TAM/SAM/SOM, Five Forces, Competitive Positioning
2. **Business Model Deconstruction** - Using Business Model Canvas, Value Proposition Canvas
3. **Disruption Opportunity Identification** - Using Disruptive Innovation Theory, Jobs to be Done, Blue Ocean
4. **Innovation Generation** - Using Three Horizons, Value Chain Analysis, Partnership Strategy
5. **Strategic Options Development** - Synthesize 3 distinct strategic directions
6. **Recommendation** - Bold strategic recommendation with clear rationale
7. **Execution Roadmap** - Phased implementation plan (0-3, 3-9, 9-18 months)
8. **Metrics & Risk Mitigation** - Success metrics and risk management

### Step 4: Generate Output Document

Create innovation strategy document in `.bmad/output/innovation-strategy-[date].md` with:
- Strategic context and challenge
- Market analysis and competitive insights
- Current business model assessment
- Disruption opportunities identified
- Innovation initiatives and options
- Recommended strategy with rationale
- Execution roadmap by phase
- Success metrics and risk mitigation

### Step 5: Confirm Completion

Inform the user:
"Innovation strategy complete! Your strategic analysis has been saved to `.bmad/output/innovation-strategy-[date].md`"

## Output Files

- `.bmad/output/innovation-strategy-[date].md` - Comprehensive innovation strategy document

## Examples

**Example 1: SaaS Platform Facing Market Pressure**

User Context:
- B2B SaaS platform in project management space
- Facing competitive pressure from new entrants
- Plateau in growth, high churn in SMB segment

Process:
1. Market analysis reveals SMB segment is overserved while solopreneurs/freelancers underserved
2. Business model analysis shows heavy customer acquisition costs
3. Disruption opportunity: "Good enough" solution for freelancers at 1/10th price
4. Recommended strategy: Launch freemium tier targeting freelancers, upsell to teams
5. 18-month roadmap with metrics for each phase

**Example 2: Traditional Retail Exploring Digital Transformation**

User Context:
- 50-year-old specialty retail chain
- Strong brand but declining foot traffic
- Hesitant about e-commerce due to past failures

Process:
1. Market analysis using Five Forces reveals direct-to-consumer opportunity
2. Jobs to be Done uncovers customers "hiring" product for gift-giving and expertise
3. Disruption opportunity: Curated subscription model + virtual styling
4. Recommended strategy: Hybrid model preserving stores as experience centers
5. Phased approach starting with pilot market validation

**Example 3: Healthcare Startup Seeking Differentiation**

User Context:
- Telehealth platform in crowded market
- Struggling to differentiate from competitors
- Limited venture capital runway

Process:
1. Blue Ocean analysis identifies uncontested space in chronic condition management
2. Platform Revolution framework suggests network effects through peer support
3. Innovation opportunity: Community-driven chronic disease management platform
4. Recommended strategy: Pivot from general telehealth to condition-specific communities
5. Capital-efficient roadmap focusing on one condition initially

## Notes

- Innovation strategy requires 2-4 hours for thorough analysis
- User should have basic market knowledge or research prepared
- Best conducted with stakeholder alignment on strategic priorities
- May uncover uncomfortable truths about current business model
- Framework selection adapts based on business context and maturity
- Energy checkpoints throughout help manage cognitive load
