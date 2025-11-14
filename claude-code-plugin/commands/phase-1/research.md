---
description: Adaptive research workflow supporting market research, technical evaluation, competitive intelligence, and deep research prompt generation
---

# Research Workflow

## What This Does

Provides comprehensive research capabilities across multiple research types:
- **Market Research** - Market size, trends, competitors, user needs
- **Technical Research** - Architecture evaluation, technology assessment, tool comparison
- **Competitive Intelligence** - Competitor analysis, positioning, differentiation
- **User Research** - Customer insights, pain points, needs analysis
- **Domain Research** - Industry-specific research (handled by domain-research workflow)
- **Deep Research Prompts** - Generates comprehensive research prompts for AI platforms

**Uses live web data** from current year with **verified sources and citations**.

## Prerequisites

- BMAD plugin installed in Claude Code
- Web research access enabled
- (Optional) workflow-status for progress tracking

## When to Use This

**Use research workflow when you need to:**
- Understand market landscape before building product
- Evaluate technical approaches or architectures
- Analyze competitors and market positioning
- Gather customer insights and pain points
- Generate comprehensive research prompts for deep analysis
- Validate assumptions with current data

**This workflow delegates to the Business Analyst agent.**

## Instructions

### Step 1: Determine Research Type

**Ask yourself what you're researching:**

1. **Market/Business questions** → Market Research
   - Market size, growth rates, trends
   - Customer segments, needs, pain points
   - Pricing analysis, business models

2. **Competitor questions** → Competitive Intelligence
   - Who are the key players?
   - What are their strengths/weaknesses?
   - Market positioning and differentiation

3. **Technology questions** → Technical Research
   - Architecture patterns and best practices
   - Technology stack evaluation
   - Tool/framework comparison
   - Performance and scalability considerations

4. **Customer questions** → User Research
   - User personas and segments
   - Pain points and needs
   - User behavior patterns
   - Feature priorities

5. **Industry/Domain questions** → Use `/bmad:bmm:workflows:domain-research`
   - Industry regulations (HIPAA, PCI-DSS, GDPR, etc.)
   - Domain-specific requirements
   - Compliance and standards

6. **Creating research prompts** → Deep Research Prompt Generator
   - Generates comprehensive prompts for AI platforms
   - Structured research frameworks
   - Multi-perspective analysis guides

### Step 2: Invoke Business Analyst Agent

The research workflow is handled by the **Business Analyst agent** who specializes in evidence-based research with verified sources.

Use the Task tool to invoke the Business Analyst:

```yaml
subagent_type: bmad-analyst
prompt: |
  I need help with research.

  **Research Type:** [Market Research / Technical Research / Competitive Intelligence / User Research / Deep Research Prompt]

  **Research Topic:** [Describe what you want to research]

  **Key Questions:**
  - [Question 1]
  - [Question 2]
  - [Question 3]

  **Context:** [Any relevant context about the project]

  Please conduct research using live web data from {current_year}, cite all sources with URLs, and provide evidence-based findings.
```

### Step 3: Business Analyst Conducts Research

The Business Analyst will:

1. **Clarify research scope** through conversation
2. **Conduct web research** using current data
3. **Verify sources** (minimum 2 sources per claim)
4. **Document findings** with citations
5. **Distinguish facts from analysis**
6. **Provide actionable insights**
7. **Save research document** to `.bmad/output/research-{type}-{date}.md`

### Step 4: Review Research Output

The Business Analyst will create a comprehensive research document with:

**For Market Research:**
- Market overview and size
- Growth trends and projections
- Competitive landscape
- Customer segments and needs
- Opportunities and threats
- All claims cited with sources

**For Technical Research:**
- Technology landscape
- Architecture patterns and best practices
- Tool/framework comparison matrix
- Performance and scalability considerations
- Security and compliance factors
- Implementation recommendations
- All technical claims cited with sources

**For Competitive Intelligence:**
- Competitor profiles
- Market positioning analysis
- SWOT analysis for key competitors
- Differentiation opportunities
- Competitive threats
- All competitive data cited with sources

**For User Research:**
- User personas and segments
- Pain points and needs analysis
- User behavior patterns
- Feature priorities
- Design implications
- All user insights cited with sources

**For Deep Research Prompts:**
- Comprehensive research framework
- Multi-perspective analysis structure
- Specific questions to investigate
- Source discovery strategies
- Ready-to-use prompts for AI platforms

## Anti-Hallucination Protocol

The Business Analyst follows strict anti-hallucination guidelines:

1. **Never present information without verified sources**
2. **Always cite sources with URLs**
3. **Require 2+ independent sources for critical claims**
4. **When sources conflict, present both views**
5. **Flag uncertain data with confidence levels:**
   - [High Confidence]
   - [Medium Confidence]
   - [Low Confidence - verify]
6. **Distinguish clearly between:**
   - **FACTS** (from sources)
   - **ANALYSIS** (interpretation)
   - **SPECULATION** (educated guesses)

## Examples

### Example 1: Market Research

**User Request:**
```
I need market research for a project management SaaS targeting small businesses.
```

**Task tool invocation:**
```yaml
subagent_type: bmad-analyst
prompt: |
  I need market research for a project management SaaS targeting small businesses (1-50 employees).

  **Research Type:** Market Research

  **Key Questions:**
  - What is the market size for project management software for SMBs?
  - Who are the major competitors?
  - What are typical customer pain points?
  - What pricing models work best in this market?

  Please use current 2025 data and cite all sources.
```

**Output:** Business Analyst creates `research-market-2025-01-14.md` with:
- Market size: $X billion (Source: Gartner Report 2024)
- Growth rate: Y% CAGR (Source: Forrester Research 2024)
- Top 5 competitors with analysis
- Customer pain points from 3 industry studies
- Pricing analysis with sources
- Opportunities and recommendations

### Example 2: Technical Research

**User Request:**
```
I need to evaluate architecture patterns for a real-time collaboration platform.
```

**Task tool invocation:**
```yaml
subagent_type: bmad-analyst
prompt: |
  I need technical research on architecture patterns for a real-time collaboration platform (similar to Figma/Miro).

  **Research Type:** Technical Research

  **Key Questions:**
  - What architecture patterns work best for real-time collaboration?
  - How do leading platforms (Figma, Miro) handle real-time sync?
  - What are the tradeoffs between CRDT, OT, and event sourcing?
  - What tech stacks are commonly used?

  Please use current technical articles and cite all sources.
```

**Output:** Business Analyst creates `research-technical-2025-01-14.md` with:
- Architecture pattern comparison (CRDT vs OT vs Event Sourcing)
- Case studies from Figma, Miro, Google Docs
- Technology stack recommendations with justifications
- Performance considerations
- Implementation complexity analysis
- All technical claims cited with authoritative sources

### Example 3: Deep Research Prompt Generation

**User Request:**
```
I need a comprehensive research prompt to analyze the AI code assistant market.
```

**Task tool invocation:**
```yaml
subagent_type: bmad-analyst
prompt: |
  I need to generate a deep research prompt for analyzing the AI code assistant market.

  **Research Type:** Deep Research Prompt

  **Topic:** AI Code Assistants (GitHub Copilot, Cursor, Claude Code, etc.)

  Please create a comprehensive research framework I can use with other AI platforms.
```

**Output:** Business Analyst creates `research-deep-prompt-2025-01-14.md` with:
- Structured research framework
- 50+ specific research questions organized by category
- Multi-perspective analysis guide (technical, business, user, competitive)
- Source discovery strategies
- Ready-to-use prompts for different AI platforms
- Validation criteria for research findings

## Notes

**Research delegation:**
- All research workflows delegate to Business Analyst agent
- Business Analyst specializes in evidence-based research
- Trained to use web search and verify sources
- Maintains anti-hallucination protocols

**Research types:**
- **Market Research** - Business, customers, competitors
- **Technical Research** - Architecture, tools, frameworks
- **Competitive Intelligence** - Competitor analysis
- **User Research** - Customer insights and needs
- **Domain Research** - Industry-specific (use domain-research workflow instead)
- **Deep Research Prompts** - Generates research frameworks

**Web research enabled:**
- Uses WebSearch tool for current data
- Always cites sources with URLs
- Requires 2+ sources for critical claims
- Flags data confidence levels

**Output location:**
- Research documents saved to `.bmad/output/research-{type}-{date}.md`
- Comprehensive citations and sources
- Actionable insights and recommendations

## Troubleshooting

**Issue:** Business Analyst agent not available

**Solution:**
- Ensure BMAD plugin is installed
- Check that bmad-analyst subagent exists in `claude-code-plugin/src/subagents/`
- Use Task tool with `subagent_type: bmad-analyst`

**Issue:** No web search results

**Solution:**
- Verify web search is enabled in your environment
- Try more specific search queries
- Check if topic is too niche or recent

**Issue:** Insufficient sources cited

**Solution:**
- Ask Business Analyst to find more sources
- Request specific source types (academic, industry reports, etc.)
- Broaden search terms if topic is too narrow

**Issue:** Research too broad or unfocused

**Solution:**
- Narrow research scope with specific questions
- Focus on one aspect at a time
- Use Deep Research Prompt workflow to structure inquiry

**Issue:** Domain-specific research needed (HIPAA, PCI-DSS, etc.)

**Solution:**
- Use `/bmad:bmm:workflows:domain-research` instead
- Specialized for regulatory and compliance research
- Delegates to Business Analyst with domain focus

## Output Files

- `.bmad/output/research-{type}-{date}.md` - Comprehensive research document
- `.bmad/sprint-artifacts/bmm-workflow-status.yaml` - Updated with research completion (if tracking)

## Related Workflows

- **domain-research** - Industry-specific regulatory research
- **product-brief** - Uses research to inform product vision
- **prd** - May incorporate research findings
- **architecture** - Technical research informs architecture decisions
