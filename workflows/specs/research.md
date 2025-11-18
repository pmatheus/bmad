---
description: Comprehensive market and domain research workflow to validate problem space and inform product strategy
---

# Research Workflow

## Purpose

This workflow conducts **comprehensive market and domain research** to validate the problem space, understand competitive landscape, and gather insights that inform product strategy. It's designed to help teams make evidence-based decisions before committing to a full product development cycle.

**Key outputs:**
- Market analysis and opportunity assessment
- Competitive landscape mapping
- User needs and pain points validation
- Technical feasibility assessment
- Risk and opportunity identification
- Research-backed recommendations

**Key Principle:** Evidence-based decision making - Use research to validate assumptions before investing in detailed product planning.

**Prerequisites:**
- [ ] BMAD plugin installed in Claude Code
- [ ] Project initialized (`/bmad:meta:workflow-init`)
- [ ] Product brief created (optional but recommended: `/bmad:phase-1:product-brief`)

## Variables

The following variables are used throughout this workflow:

| Variable | Source | Description | Example |
|----------|--------|-------------|---------|
| `{documentation_dir}` | `.bmad/config.yaml` | Where documentation files are stored | `.bmad` |
| `{user_name}` | `.bmad/config.yaml` | Author name for research document | `"Jane Analyst"` |
| `{bmad_folder}` | `.bmad/config.yaml` | BMAD installation location | `.bmad` |
| `{project_name}` | `.bmad/config.yaml` | Project name | `"AI-Powered CRM"` |
| `{current_date}` | System date | Current date for documentation | `2025-11-18` |
| `{research_focus}` | User input | Research focus areas (market/competitive/technical/user) | `"market,competitive"` |
| `{output_file}` | Generated | Research document output path | `{documentation_dir}/research.md` |

**Configuration file location:** `.bmad/config.yaml`

**Required input files:**
- `.bmad/config.yaml` - Project configuration

**Optional input files:**
- `.bmad/product-brief.md` - Product vision and context (highly recommended)
- `.bmad/brainstorm.md` - Initial brainstorming notes

## Instructions

### 1. Load Configuration

Read project configuration from `.bmad/config.yaml`:

```javascript
{
  documentation_dir: string,      // Where docs are stored (e.g., .bmad)
  user_name: string,              // Author name
  bmad_folder: string,            // BMAD install location
  project_name: string            // Project name
}
```

### 2. Validate Workflow Readiness

**Check for workflow status file:**

1. Check if `.bmad/bmm-workflow-status.yaml` exists

**If status file NOT found (standalone mode):**

Set `standalone_mode = true`

Display: "Research workflow can run standalone or as part of BMM workflow. Running in standalone mode - great for exploring your market opportunity!"

**If status file found (workflow mode):**

1. Load COMPLETE file: `.bmad/bmm-workflow-status.yaml`
2. Parse `workflow_status` section
3. Check status of "research" workflow
4. Get `project_level` from metadata
5. Find first non-completed workflow

**Validation checks:**

**If project_level < 2:**
```
9 Research workflow is optional for Level 0-1 (Quick Flow)

Your project is Level {project_level} (Quick Flow). Research is valuable but optional.

Continue with research anyway?
- Yes, conduct research (recommended for strategic clarity)
- No, skip to tech-spec or PRD
```

**If research already completed:**
```
9 Research workflow already completed

Status shows research was completed on {completion_date}.

Options:
- Continue to update/refresh research
- Skip to next workflow: {next_workflow_name}
```

### 3. Load Context Documents

**Attempt to load product brief (if exists):**

Check for: `.bmad/product-brief.md`

**If found:**
- Load entire document
- Extract: Problem statement, target users, solution vision
- Use as anchor for research focus

**If not found:**
```
9 No product brief found

Research will be more exploratory without product brief context.

Recommendation: Run `/bmad:phase-1:product-brief` first for focused research.

Proceed with open-ended research?
- Yes, proceed (exploratory research)
- No, create product brief first (recommended)
```

**Attempt to load brainstorming notes (if exists):**

Check for: `.bmad/brainstorm.md`

**If found:**
- Load document
- Use as context for research areas

### 4. Define Research Scope

**Present research focus options:**

```
=Ë Research Focus Areas

Select focus areas for this research (multi-select):

Market Research:
- Market size and growth trends
- Market segmentation and target segments
- Market maturity and adoption curves
- Regulatory environment and compliance needs

Competitive Analysis:
- Direct and indirect competitors
- Competitive positioning and differentiation
- Feature comparison and gap analysis
- Pricing models and market positioning

User Research:
- User personas and demographics
- Pain points and unmet needs
- User behavior patterns
- Willingness to pay and value perception

Technical Feasibility:
- Technology landscape and maturity
- Technical risks and constraints
- Integration requirements
- Scalability and performance considerations

Strategic Assessment:
- Go-to-market considerations
- Business model viability
- Partnership and ecosystem opportunities
- Risks and mitigation strategies

Select research areas:
- All areas (comprehensive research)
- Market + Competitive (most common)
- Custom selection
```

**Capture user selection as:** `{research_focus}`

### 5. Gather Research Questions

**Based on research focus, generate key questions:**

For each selected area, present 3-5 key questions to investigate.

**Example for Market Research:**
```
=Ë Market Research Questions

Key questions we'll investigate:
1. What is the total addressable market (TAM) for this solution?
2. What are the primary market segments and their characteristics?
3. What are the current market trends affecting adoption?
4. What regulatory or compliance factors affect this market?
5. What are the barriers to entry for new solutions?
```

**Allow user to:**
- Accept generated questions
- Add custom questions
- Remove irrelevant questions
- Prioritize questions

### 6. Delegate to Analyst

Use the **Task tool** to delegate to bmad-analyst:

```javascript
{
  "subagent_type": "bmad-analyst",
  "description": "Conduct comprehensive research",
  "prompt": `
**Project Context:**
- Project Name: {project_name from config}
- Author: {user_name from config}
- Date: {current_date}
- Research Focus: {research_focus}

**Input Documents:**
- Product Brief: {path if exists, or "Not provided"}
- Brainstorm Notes: {path if exists, or "Not provided"}

**Research Scope:**

{research_focus areas and questions}

**Your Task:**

Conduct comprehensive research to answer the key questions and provide evidence-based insights.

**Research Methods:**

Use these approaches as appropriate:
1. **Web Search**: Use WebSearch tool for current market data, trends, reports
2. **Competitive Analysis**: Research competitor websites, documentation, pricing
3. **Technical Research**: Investigate technology maturity, frameworks, platforms
4. **Industry Reports**: Find relevant analyst reports, whitepapers, case studies
5. **Regulatory Research**: Identify compliance requirements, regulations, standards

**Required Sections:**

1. **Executive Summary** (1 page)
   - Key findings overview
   - Critical insights
   - Recommended actions
   - Go/No-Go recommendation with rationale

2. **Market Analysis** (if in scope)
   - Market size and growth (TAM, SAM, SOM)
   - Market segmentation
   - Market trends and drivers
   - Market maturity assessment
   - Regulatory landscape
   - Sources cited with dates

3. **Competitive Landscape** (if in scope)
   - Competitor matrix (features, pricing, positioning)
   - Competitive positioning map
   - Differentiation opportunities
   - Competitive threats
   - Market gaps and white space
   - Sources cited with links

4. **User Research** (if in scope)
   - User personas and segments
   - Pain points and needs validation
   - User behavior patterns
   - Value perception and pricing sensitivity
   - User quotes or data points (if available)
   - Sources cited

5. **Technical Feasibility** (if in scope)
   - Technology landscape
   - Platform and framework options
   - Technical risks and constraints
   - Integration considerations
   - Scalability and performance factors
   - Technology maturity assessment
   - Sources cited

6. **Strategic Assessment** (if in scope)
   - SWOT analysis
   - Go-to-market considerations
   - Business model viability
   - Partnership opportunities
   - Risk assessment with mitigation
   - Investment requirements estimate

7. **Recommendations**
   - Strategic recommendations (prioritized)
   - Next steps and action items
   - Areas requiring deeper research
   - Decision points and criteria

8. **Appendices**
   - Research sources and citations
   - Detailed competitor profiles
   - Market data tables
   - Technical research notes
   - Methodology notes

**Research Quality Standards:**

- [ ] All claims backed by credible sources
- [ ] Sources cited with dates and links
- [ ] Multiple sources for critical claims
- [ ] Distinguish between facts and assumptions
- [ ] Quantify findings wherever possible
- [ ] Note confidence level for key findings
- [ ] Identify gaps in available data
- [ ] Flag contradictory information

**Output Format:**

Create comprehensive research document at: {output_file}

**Template:**

\`\`\`markdown
# Research Report: {project_name}

Date: {date}
Author: {user_name}
Research Focus: {research_focus}
Status: {Draft/Final}

---

## Executive Summary

[1-2 page summary of key findings, insights, and recommendations]

**Key Findings:**
1. [Finding 1]
2. [Finding 2]
3. [Finding 3]

**Critical Insights:**
- [Insight 1]
- [Insight 2]

**Recommendation:** [Go/No-Go with clear rationale]

---

## Market Analysis

[Market size, segmentation, trends, maturity, regulations]

### Market Size and Growth

**Total Addressable Market (TAM):** [size and source]
**Serviceable Addressable Market (SAM):** [size and source]
**Serviceable Obtainable Market (SOM):** [size and source]

[Detailed analysis with charts/tables as text]

### Market Trends

[Key trends affecting this market]

**Sources:**
- [Source 1 with link and date]
- [Source 2 with link and date]

---

## Competitive Landscape

[Competitor analysis, positioning, differentiation opportunities]

### Competitor Matrix

| Competitor | Key Features | Pricing | Target Market | Strength | Weakness |
|------------|--------------|---------|---------------|----------|----------|
| Competitor A | ... | ... | ... | ... | ... |
| Competitor B | ... | ... | ... | ... | ... |

### Competitive Positioning

[Analysis of how competitors position themselves]

### Differentiation Opportunities

[White space and gaps in market]

**Sources:**
- [Source 1 with link and date]
- [Source 2 with link and date]

---

## User Research

[User personas, pain points, needs, behavior patterns]

### User Personas

**Persona 1: [Name]**
- Demographics: [details]
- Pain Points: [list]
- Goals: [list]
- Behaviors: [list]

### Pain Points Validation

[Evidence of user pain points from research]

**Sources:**
- [Source 1 with link and date]
- [Source 2 with link and date]

---

## Technical Feasibility

[Technology landscape, options, risks, constraints]

### Technology Options

| Technology | Maturity | Pros | Cons | Adoption |
|------------|----------|------|------|----------|
| Option A | ... | ... | ... | ... |
| Option B | ... | ... | ... | ... |

### Technical Risks

[Identified technical risks and mitigation strategies]

**Sources:**
- [Source 1 with link and date]
- [Source 2 with link and date]

---

## Strategic Assessment

[SWOT, GTM, business model, partnerships, risks]

### SWOT Analysis

**Strengths:**
- [S1]
- [S2]

**Weaknesses:**
- [W1]
- [W2]

**Opportunities:**
- [O1]
- [O2]

**Threats:**
- [T1]
- [T2]

### Business Model Viability

[Analysis of revenue model, cost structure, unit economics]

### Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Risk 1 | High/Med/Low | High/Med/Low | [Strategy] |
| Risk 2 | High/Med/Low | High/Med/Low | [Strategy] |

---

## Recommendations

### Strategic Recommendations (Prioritized)

1. **[Recommendation 1]** (High Priority)
   - Rationale: [why]
   - Impact: [expected outcome]
   - Effort: [resource estimate]
   - Timeline: [timeframe]

2. **[Recommendation 2]** (Medium Priority)
   - Rationale: [why]
   - Impact: [expected outcome]
   - Effort: [resource estimate]
   - Timeline: [timeframe]

### Next Steps

1. [Action item 1]
2. [Action item 2]
3. [Action item 3]

### Areas Requiring Deeper Research

- [Gap 1]
- [Gap 2]

### Decision Points

**Key decisions to make:**
1. [Decision 1] - Criteria: [what determines this]
2. [Decision 2] - Criteria: [what determines this]

---

## Appendices

### A. Research Sources

[Comprehensive list of all sources with links, dates, credibility notes]

### B. Competitor Profiles

[Detailed profiles of key competitors]

### C. Market Data

[Detailed market data tables and charts]

### D. Technical Research

[Detailed technical research notes]

### E. Methodology

[How research was conducted, limitations, assumptions]
\`\`\`

**When complete**, report:

\`\`\`
 Research Completed

Project: {project_name}
File: {output_file}
Focus Areas: {research_focus}
Sources Consulted: [count]
Key Findings: [count]
Recommendations: [count]

Quality Indicators:
- Sources cited: [count]
- Data points: [count]
- Competitors analyzed: [count]
- User personas: [count]
- Risks identified: [count]

Go/No-Go Recommendation: [recommendation]
\`\`\`
  `
}
```

### 7. Update Workflow Status

After analyst completes the research:

**If workflow status file exists:**

**Load workflow status file:**
- Read FULL file: `.bmad/bmm-workflow-status.yaml`

**Update research status:**
```yaml
workflow_status:
  research:
    status: completed  #  Update from "pending" or "in_progress"
    completed_at: {current_date}
    artifacts:
      - {output_file}
```

**Preserve file structure:**
- Keep ALL comments
- Maintain section organization
- Preserve formatting

**Save file**

### 8. Suggest Next Steps

Based on research findings and project level:

**If Go recommendation:**
```
 Research supports proceeding with this project!

Recommended next steps:
1. Review research findings at: {output_file}
2. Run `/bmad:phase-2:prd` to create detailed product requirements
3. Share research report with stakeholders for alignment

Optional:
- Run `/bmad:phase-1:domain-research` for deeper domain-specific research
- Conduct additional user interviews based on research gaps
```

**If No-Go recommendation:**
```
  Research suggests reconsidering this project direction

Key concerns identified:
- [Concern 1]
- [Concern 2]

Options:
1. Review research findings at: {output_file}
2. Pivot based on research insights
3. Conduct deeper research in specific areas
4. Consider alternative approaches identified in research

Would you like to:
- Discuss pivot options
- Conduct follow-up research
- Proceed anyway (not recommended)
```

**If Conditional Go:**
```
¡ Research supports proceeding with conditions

Key conditions:
- [Condition 1]
- [Condition 2]

Recommended next steps:
1. Review research findings at: {output_file}
2. Address identified conditions
3. Run `/bmad:phase-2:prd` with research insights incorporated
```

## Workflow

### Execution Sequence

```
1. Configuration Load
   “
2. Workflow Readiness Validation
    ’ Check workflow status file
    ’ Validate project level appropriateness
    ’ Check for existing research
   “
3. Context Document Loading
    ’ Load product brief (if exists) - provides focus
    ’ Load brainstorm notes (if exists) - provides context
    ’ If no context: Flag as exploratory research
   “
4. Research Scope Definition
    ’ Present research focus areas (multi-select)
    ’ User selects: market/competitive/user/technical/strategic
    ’ Store as {research_focus}
   “
5. Research Questions Generation
    ’ Generate 3-5 key questions per focus area
    ’ User reviews and refines questions
    ’ Prioritize questions
   “
6. Analyst Delegation (via Task tool)
    ’ bmad-analyst receives all context
    ’ Conducts research using:
       ’ WebSearch for market data, trends, reports
       ’ Competitive analysis (websites, docs, pricing)
       ’ Technical research (frameworks, platforms)
       ’ Industry reports and whitepapers
       ’ Regulatory research
    ’ Creates comprehensive research report with:
       ’ Executive summary with Go/No-Go
       ’ Market analysis (if in scope)
       ’ Competitive landscape (if in scope)
       ’ User research (if in scope)
       ’ Technical feasibility (if in scope)
       ’ Strategic assessment (if in scope)
       ’ Recommendations (prioritized)
       ’ Appendices with sources
    ’ Saves to: {output_file}
   “
7. Workflow Status Update (if in workflow mode)
    ’ Load bmm-workflow-status.yaml
    ’ Update research status: pending ’ completed
    ’ Record completion date and artifacts
    ’ Preserve file structure
   “
8. Next Steps Guidance
    ’ If Go: Suggest PRD creation
    ’ If No-Go: Suggest pivot or deeper research
    ’ If Conditional: List conditions and next steps
```

### Key Principles

**1. Evidence-Based Decision Making**
- All claims must be backed by credible sources
- Multiple sources for critical findings
- Distinguish facts from assumptions
- Quantify findings wherever possible
- Note confidence levels and data gaps

**2. Comprehensive Coverage**
- Address all selected research focus areas
- Answer all key research questions
- Identify market opportunities and threats
- Assess feasibility across multiple dimensions
- Provide clear Go/No-Go recommendation

**3. Actionable Insights**
- Strategic recommendations prioritized by impact
- Clear next steps with timelines
- Decision criteria defined
- Gaps identified for follow-up research
- Risk mitigation strategies provided

**4. Source Transparency**
- All sources cited with dates and links
- Credibility assessment of sources
- Multiple sources for critical claims
- Methodology documented
- Limitations acknowledged

**5. Context Awareness**
- Leverage product brief if available
- Adapt research depth to project level
- Focus on most critical questions first
- Distinguish exploratory vs. focused research
- Align with overall project goals

### Document Discovery Flow

```
Product Brief Loading (OPTIONAL):
  Check: .bmad/product-brief.md
     ’ Found: Load entire document
        ’ Extract: problem, users, solution vision
        ’ Use as research anchor
     ’ Not found: Flag as exploratory research
         ’ Offer to create product brief first

Brainstorm Notes Loading (OPTIONAL):
  Check: .bmad/brainstorm.md
     ’ Found: Load as additional context
     ’ Not found: Skip (not required)

Workflow Status Loading (OPTIONAL):
  Check: .bmad/bmm-workflow-status.yaml
     ’ Found: Validate phase and update status
     ’ Not found: Run in standalone mode
```

### Related Workflows

**Before this workflow:**
1. `/bmad:meta:workflow-init` - Initialize project structure
2. `/bmad:phase-1:product-brief` - Define product vision (recommended)
3. `/bmad:phase-1:brainstorm-project` - Initial ideation (optional)

**After this workflow:**
1. `/bmad:phase-1:domain-research` - Deeper domain-specific research (optional)
2. `/bmad:phase-2:prd` - Create product requirements document
3. `/bmad:phase-2:tech-spec` - Technical specification (Level 0-1)

**Alternative workflows:**
- `/bmad:phase-1:document-project` - For brownfield projects
- Skip to `/bmad:phase-2:prd` - If research already exists

### Success Criteria

A successful research report includes:

**Structure:**
- [ ] All selected sections present and complete
- [ ] Executive summary with clear recommendation
- [ ] Markdown formatting correct
- [ ] Appendices with comprehensive sources

**Content Quality:**
- [ ] All research questions answered
- [ ] Claims backed by credible sources
- [ ] Sources cited with dates and links
- [ ] Quantitative data included
- [ ] Confidence levels noted
- [ ] Data gaps identified

**Analysis Depth:**
- [ ] Market sizing with TAM/SAM/SOM (if applicable)
- [ ] Competitor matrix with 3+ competitors (if applicable)
- [ ] User personas with pain points (if applicable)
- [ ] Technical options evaluated (if applicable)
- [ ] SWOT analysis complete (if applicable)

**Strategic Value:**
- [ ] Clear Go/No-Go recommendation with rationale
- [ ] Strategic recommendations prioritized
- [ ] Next steps defined
- [ ] Decision criteria specified
- [ ] Risk mitigation strategies provided

**Research Rigor:**
- [ ] Multiple sources for key findings (3+ sources)
- [ ] Recent sources (within 1-2 years for market data)
- [ ] Credible sources (analyst reports, industry leaders)
- [ ] Methodology documented
- [ ] Limitations acknowledged

**Actionability:**
- [ ] Recommendations specific and actionable
- [ ] Next steps with timelines
- [ ] Resource requirements estimated
- [ ] Success criteria defined
- [ ] Follow-up research areas identified

### Troubleshooting

**No product brief found:**
```
9 Product brief not found

Research will be exploratory without product context.
```
’ Solution: This is OK for exploratory research. For focused research, run `/bmad:phase-1:product-brief` first.

**Research scope too broad:**
```
  Research scope may be too broad for single report
```
’ Solution:
1. Prioritize most critical research areas
2. Start with market + competitive (most common)
3. Run follow-up research for additional areas
4. Use `/bmad:phase-1:domain-research` for deep dives

**Limited sources available:**
```
9 Limited public information available for this market
```
’ Solution:
- Note confidence levels as "Low" for affected findings
- Flag need for primary research (interviews, surveys)
- Identify assumptions and validate with stakeholders
- Consider expert consultations or paid reports

**Conflicting information found:**
```
  Conflicting data found across sources
```
’ Solution:
- Document all sources and their claims
- Note discrepancies explicitly
- Use most recent and credible sources
- Indicate confidence level as "Medium"
- Recommend follow-up validation

**WebSearch not available:**
```
  WebSearch tool not available in this environment
```
’ Solution:
- Use WebFetch tool for specific URLs
- Rely on existing knowledge (note as limitation)
- Flag areas requiring manual research
- Provide research questions for user to investigate

**Research takes too long:**
```
ñ Research is taking longer than expected
```
’ Solution:
- Analyst should provide periodic progress updates
- Focus on critical questions first
- Time-box research activities
- Document what was covered and what needs follow-up

## Report

### Completion Report Format

When the workflow completes successfully, provide this report:

```
 Research Completed Successfully!

**Project Details:**
- Project Name: {project_name}
- Research Document: {output_file}
- Focus Areas: {research_focus}
- Author: {user_name}
- Date: {current_date}

**Research Scope:**
- Focus Areas: [list of areas researched]
- Key Questions: [count] questions investigated
- Sources Consulted: [count]
- Pages Generated: [approximate page count]

**Key Findings Summary:**
1. [Top finding 1]
2. [Top finding 2]
3. [Top finding 3]

**Research Metrics:**
- Market Size (TAM): [if applicable]
- Competitors Analyzed: [count]
- User Personas Created: [count]
- Technical Options Evaluated: [count]
- Risks Identified: [count]
- Recommendations: [count]

**Recommendation:** [Go / No-Go / Conditional Go]

**Rationale:** [1-2 sentence summary of recommendation basis]

**Next Steps:**
1. Review detailed research at: {output_file}
2. [Next workflow recommendation based on Go/No-Go]
3. [Additional action items]

**Areas Flagged for Follow-Up:**
- [Gap 1] - [why it matters]
- [Gap 2] - [why it matters]

**Quality Indicators:**
- Source Recency: [% of sources within 2 years]
- Source Credibility: [High/Medium/Low]
- Data Completeness: [% of questions fully answered]
- Confidence Level: [High/Medium/Low]
```

### Error Report Format

If the workflow encounters errors, report:

```
L Research Workflow Failed

**Error Type:** [Configuration / Context / Research]

**Issue:**
[Clear description of what went wrong]

**Required Action:**
[Specific steps to resolve the issue]

**Files Checked:**
- Configuration: [path] [ Found /  Not found]
- Product Brief: [path] [ Found /  Not found / í Skipped]
- Brainstorm Notes: [path] [ Found /  Not found / í Skipped]
- Workflow Status: [path] [ Found /  Not found / í Standalone]

**Suggested Commands:**
[List of workflows or actions to resolve the issue]
```

### Progress Updates

During execution, provide these progress updates:

**Step 1 - Configuration:**
```
=Ë Loading configuration...
 Config loaded from: .bmad/config.yaml
```

**Step 2 - Validation:**
```
= Checking workflow readiness...
 Project level {level} validated
[ Product brief found / 9 Product brief not found - exploratory mode]
```

**Step 3 - Scope Definition:**
```
=Ë Defining research scope...
Selected focus areas: {research_focus}
Generated {count} key research questions
```

**Step 4 - Research Execution:**
```
= Conducting research...
[Analyst is investigating {focus_area}...]
```

**Step 5 - Analysis Progress:**
```
=Ê Analyzing {area}...
- Consulted {count} sources
- Identified {count} key findings
```

**Step 6 - Report Generation:**
```
=Ý Generating research report...
- Executive summary: 
- {Focus area 1}: 
- {Focus area 2}: 
- Recommendations: 
```

**Step 7 - Status Update:**
```
 Workflow status updated: research ’ completed
```

### Example Reports

**Example 1: SaaS Product Research**
```
 Research Completed Successfully!

**Project Details:**
- Project Name: AI-Powered Sales Intelligence Platform
- Research Document: .bmad/research.md
- Focus Areas: Market, Competitive, Technical
- Author: Jane Analyst
- Date: 2025-11-18

**Research Scope:**
- Focus Areas: Market Analysis, Competitive Landscape, Technical Feasibility
- Key Questions: 15 questions investigated
- Sources Consulted: 24 (analyst reports, competitor sites, tech docs)
- Pages Generated: ~18 pages

**Key Findings Summary:**
1. Market: $12B TAM, 28% CAGR, underserved mid-market segment
2. Competition: 4 major players focused on enterprise, gap in SMB
3. Technical: AI/ML infrastructure mature, integration complexity moderate

**Research Metrics:**
- Market Size (TAM): $12.4B (2025), $31.8B (2030)
- Competitors Analyzed: 7 (4 direct, 3 indirect)
- User Personas Created: 3 (Sales Manager, SDR, VP Sales)
- Technical Options Evaluated: 3 AI platforms, 2 integration approaches
- Risks Identified: 5 (market, technical, competitive)
- Recommendations: 8 strategic recommendations

**Recommendation:** Go with conditions

**Rationale:** Strong market opportunity in underserved mid-market, but requires focused positioning and efficient GTM strategy to compete with well-funded competitors.

**Next Steps:**
1. Review detailed research at: .bmad/research.md
2. Address condition: Define differentiation strategy for mid-market
3. Run `/bmad:phase-2:prd` to create product requirements
4. Schedule stakeholder review of research findings

**Areas Flagged for Follow-Up:**
- Pricing sensitivity in mid-market (needs user interviews)
- Integration partner ecosystem (needs partnership exploration)

**Quality Indicators:**
- Source Recency: 87% within last 2 years
- Source Credibility: High (Gartner, Forrester, direct research)
- Data Completeness: 93% of questions fully answered
- Confidence Level: High
```

**Example 2: Healthcare Compliance Research**
```
 Research Completed Successfully!

**Project Details:**
- Project Name: HIPAA-Compliant Telemedicine Platform
- Research Document: .bmad/research.md
- Focus Areas: Market, Competitive, User, Strategic (Compliance-focused)
- Author: John Analyst
- Date: 2025-11-18

**Research Scope:**
- Focus Areas: Market, Competitive, User Research, Strategic Assessment
- Key Questions: 22 questions (including compliance requirements)
- Sources Consulted: 31 (regulatory docs, analyst reports, user studies)
- Pages Generated: ~24 pages

**Key Findings Summary:**
1. Market: $87B telehealth market, 42% growth, regulatory clarity improving
2. Compliance: HIPAA, state licensing, prescribing regulations create barriers
3. Users: Providers want simplicity, patients want convenience, both need trust

**Research Metrics:**
- Market Size (TAM): $87.3B (2025), $298.9B (2030)
- Competitors Analyzed: 9 (6 direct, 3 adjacent)
- User Personas Created: 4 (Primary Care MD, Specialist, Patient, Admin)
- Technical Options Evaluated: 5 platforms (HIPAA-compliant video, EHR integration)
- Risks Identified: 12 (regulatory, market, technical, operational)
- Recommendations: 11 strategic recommendations

**Recommendation:** Go (with significant compliance investment required)

**Rationale:** Market opportunity is massive and growing rapidly. Compliance is complex but well-understood. Success requires excellence in regulatory adherence and user experience - both non-negotiable.

**Next Steps:**
1. Review detailed research at: .bmad/research.md
2. Engage HIPAA compliance consultant before PRD
3. Budget for compliance infrastructure and audits
4. Run `/bmad:phase-2:prd` with strong compliance focus
5. Plan for state-by-state licensing strategy

**Areas Flagged for Follow-Up:**
- State licensing requirements (needs legal analysis per state)
- Insurance reimbursement landscape (needs payer partnerships)
- Prescribing regulations by state (needs detailed regulatory research)

**Quality Indicators:**
- Source Recency: 94% within last 2 years (regulatory docs current)
- Source Credibility: High (HHS, state agencies, industry analysts)
- Data Completeness: 100% critical questions answered, 85% overall
- Confidence Level: High for compliance, Medium for market sizing
```

**Example 3: No-Go Recommendation**
```
  Research Complete - Reconsider Project Direction

**Project Details:**
- Project Name: Blockchain-Based Social Network
- Research Document: .bmad/research.md
- Focus Areas: Market, Competitive, Technical, User
- Author: Jane Analyst
- Date: 2025-11-18

**Research Scope:**
- Focus Areas: All areas (comprehensive)
- Key Questions: 18 questions investigated
- Sources Consulted: 27
- Pages Generated: ~16 pages

**Key Findings Summary:**
1. Market: Crowded with 12+ competitors, declining user growth (-15% YoY)
2. Users: Low willingness to pay, strong privacy concerns, high churn
3. Technical: Blockchain adds cost without clear user benefit

**Research Metrics:**
- Market Size (TAM): $4.2B (declining from $5.1B in 2023)
- Competitors Analyzed: 12 (saturated market)
- User Personas Created: 3 (all show low engagement)
- Technical Options Evaluated: 4 blockchain platforms
- Risks Identified: 9 (mostly high probability + high impact)
- Recommendations: 3 (all suggest pivoting)

**Recommendation:** No-Go

**Rationale:** Market is oversaturated with declining growth. Users show low willingness to pay and high churn. Blockchain adds technical complexity and cost without addressing core user needs. Multiple well-funded competitors have failed in past 2 years.

**Critical Concerns:**
- Market declining 15% YoY with no reversal signals
- User acquisition cost ($47) exceeds lifetime value ($23)
- 8 of 12 competitors have shut down or pivoted (2022-2024)
- Blockchain infrastructure cost 3-5x higher than traditional tech
- No clear value proposition differentiating from existing solutions

**Recommended Actions:**
1. Review detailed research at: .bmad/research.md
2. Consider pivot options:
   - Remove blockchain, focus on niche community (gaming, creators)
   - Build privacy-focused messaging (different market)
   - Enterprise collaboration tool (B2B vs B2C)
3. Conduct follow-up research on pivot directions
4. Reassess problem worth solving

**If Proceeding Anyway:**
- Acknowledge high risk of failure (>80% based on comp analysis)
- Secure runway for 18+ months (longer sales cycles)
- Plan for aggressive pivots based on early data
- Focus on specific niche (not broad social network)
```

### Notes on Reporting

**Always include:**
- Clear Go/No-Go/Conditional recommendation
- Rationale for recommendation (evidence-based)
- Quantitative metrics where available
- Source quality indicators
- Next actionable steps
- Areas requiring follow-up

**Progress indicators:**
- Provide updates every 2-3 minutes during research
- Show what area is being researched
- Indicate sources being consulted
- Note findings as they emerge

**Quality signals:**
- Source count and recency
- Data completeness percentage
- Confidence level assessment
- Gaps and limitations acknowledged

**Recommendation clarity:**
- Go: Clear path forward with next steps
- No-Go: Clear rationale with pivot suggestions
- Conditional: Specific conditions that must be met

**Actionability:**
- Specific next workflows to run
- Concrete actions with owners (where applicable)
- Timeline estimates for next steps
- Resource requirements noted
