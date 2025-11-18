---
description: Identify disruption opportunities and architect business model innovation through strategic market analysis
---

# Innovation Strategy

## Purpose

This workflow guides you through a comprehensive strategic analysis process to identify breakthrough opportunities and architect sustainable business model innovation. It applies proven innovation frameworks to analyze markets, competitive dynamics, and business model innovation pathways.

**Use this when:**
- Exploring new market opportunities or strategic pivots
- Facing market pressure or competitive threats
- Analyzing business model innovation opportunities
- Planning strategic transformation or disruption plays
- Conducting strategic planning or innovation workshops

**Prerequisites:**
- BMAD plugin installed
- `/workflow-init` run (creates `.bmad/config.yaml`)

## Variables

The following variables are loaded from `.bmad/config.yaml`:

- `{documentation_dir}` - Directory where the innovation strategy document will be saved
- `{user_name}` - User's name for personalization throughout the process
- `{communication_language}` - Preferred language for communication
- `{date}` - Current date used in output filename (format: YYYY-MM-DD)

**Strategic Context Variables** (gathered from user):
- `{company_name}` - Company or business being analyzed
- `{strategic_driver}` - What's driving this strategic exploration
- `{current_business_model}` - Brief description of current business model
- `{constraints}` - Any constraints or boundaries that exist
- `{success_vision}` - What breakthrough success would look like

## Instructions

Follow these steps to complete the innovation strategy analysis:

1. **Load Configuration**
   - Read configuration from `.bmad/config.yaml`
   - Extract `documentation_dir`, `user_name`, and `communication_language`
   - Verify prerequisites are met

2. **Gather Strategic Context**
   - Ask the user about their strategic situation:
     - What company or business are we analyzing?
     - What's driving this strategic exploration?
     - What's your current business model in brief?
     - What constraints or boundaries exist?
     - What would breakthrough success look like?
   - If context data is provided (e.g., industry analysis, market research), load and incorporate it

3. **Delegate to Innovation Strategist Agent**
   - Use the Task tool to invoke the `bmad-innovation-strategist` subagent
   - Provide all gathered strategic context to the agent
   - The agent will conduct the full strategic analysis using proven frameworks

4. **Generate Output Document**
   - Create comprehensive innovation strategy document
   - Save to `{documentation_dir}/innovation-strategy-{date}.md`
   - Include all analysis sections and recommendations

5. **Confirm Completion**
   - Inform the user of completion
   - Provide the path to the saved document
   - Offer to clarify any aspects of the strategy

## Workflow

The Innovation Strategist agent guides through the following 8-phase analysis:

### Phase 1: Market Landscape Analysis
Using frameworks: TAM/SAM/SOM, Five Forces, Competitive Positioning
- Analyze total addressable market and segments
- Map competitive landscape and industry dynamics
- Identify market trends and forces

### Phase 2: Business Model Deconstruction
Using frameworks: Business Model Canvas, Value Proposition Canvas
- Map current business model components
- Analyze value creation and capture mechanisms
- Identify strengths and vulnerabilities

### Phase 3: Disruption Opportunity Identification
Using frameworks: Disruptive Innovation Theory, Jobs to be Done, Blue Ocean Strategy
- Identify overserved and underserved market segments
- Uncover jobs customers are trying to accomplish
- Find uncontested market spaces

### Phase 4: Innovation Generation
Using frameworks: Three Horizons, Value Chain Analysis, Partnership Strategy
- Generate horizon 1, 2, and 3 innovation opportunities
- Analyze value chain innovation possibilities
- Explore partnership and ecosystem opportunities

### Phase 5: Strategic Options Development
- Synthesize analysis into 3 distinct strategic directions
- Evaluate each option against success criteria
- Compare risk/reward profiles

### Phase 6: Recommendation
- Provide bold strategic recommendation with clear rationale
- Explain why this direction over alternatives
- Address anticipated objections

### Phase 7: Execution Roadmap
Phased implementation plan:
- **Phase 1 (0-3 months):** Foundation and validation activities
- **Phase 2 (3-9 months):** Core capability building and early wins
- **Phase 3 (9-18 months):** Scaling and optimization

### Phase 8: Metrics & Risk Mitigation
- Define success metrics for each phase
- Identify critical risks and mitigation strategies
- Establish decision gates and pivoting criteria

**Process Notes:**
- Innovation strategy requires 2-4 hours for thorough analysis
- User should have basic market knowledge or research prepared
- Best conducted with stakeholder alignment on strategic priorities
- May uncover uncomfortable truths about current business model
- Framework selection adapts based on business context and maturity
- Energy checkpoints throughout help manage cognitive load

## Report

### Output Document Structure

The final innovation strategy document (`{documentation_dir}/innovation-strategy-{date}.md`) includes:

1. **Executive Summary**
   - Strategic challenge and context
   - Key recommendation
   - Expected outcomes

2. **Strategic Context**
   - Company/business overview
   - Strategic drivers and constraints
   - Success vision

3. **Market Analysis & Competitive Insights**
   - Market landscape findings
   - Competitive dynamics
   - Industry forces and trends

4. **Current Business Model Assessment**
   - Business model canvas analysis
   - Strengths and vulnerabilities
   - Value proposition evaluation

5. **Disruption Opportunities Identified**
   - Underserved market segments
   - Jobs to be Done insights
   - Blue Ocean opportunities

6. **Innovation Initiatives & Strategic Options**
   - Three strategic direction options
   - Evaluation against success criteria
   - Risk/reward analysis

7. **Recommended Strategy**
   - Bold recommendation with clear rationale
   - Why this over alternatives
   - Response to anticipated objections

8. **Execution Roadmap**
   - 0-3 month foundation phase
   - 3-9 month building phase
   - 9-18 month scaling phase
   - Key milestones and deliverables

9. **Success Metrics & Risk Mitigation**
   - KPIs for each phase
   - Critical risks identified
   - Mitigation strategies
   - Decision gates and pivot criteria

### Completion Confirmation

Inform the user:
"Innovation strategy complete! Your strategic analysis has been saved to `{documentation_dir}/innovation-strategy-{date}.md`"

### Examples of Completed Analyses

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
