---
description: Collaborative exploration of domain-specific requirements, regulations, and patterns for complex projects (healthcare, fintech, aerospace, etc.)
---

# Domain Research Workflow

## What This Does

Provides deep domain-specific research for regulated or complex industries:
- **Healthcare/Medical** - HIPAA, FDA, clinical validation, HL7/FHIR
- **Financial Services** - KYC/AML, PCI DSS, regional compliance
- **Aerospace/Defense** - DO-178C, ITAR, safety analysis
- **Government/Public Sector** - Accessibility, security clearances
- **Legal** - Compliance, audit trails, e-discovery
- **Insurance** - Actuarial requirements, state regulations
- **Education** - FERPA, LMS standards, accessibility
- **Energy/Utilities** - NERC CIP, safety regulations
- **Other specialized domains** - Industry-specific requirements

**Uses collaborative exploration** with the user to understand practical implications.

## Prerequisites

- BMAD plugin installed in Claude Code
- Web research access for current regulations
- (Optional) workflow-status for progress tracking

## When to Use This

**Use domain-research when:**
- Building in a regulated industry (healthcare, finance, etc.)
- Safety or compliance concerns exist
- Industry standards must be followed
- Stakeholders beyond users have requirements
- Project failure would have serious consequences

**Don't use for:**
- General market research (use research workflow instead)
- Simple projects without domain complexity
- Personal or hobby projects

**This workflow delegates to the Business Analyst agent.**

## Instructions

### Step 1: Identify Your Domain

**Common domains requiring deep research:**

**Healthcare/Medical:**
- FDA approval pathways (510k, De Novo, PMA)
- HIPAA compliance for patient data
- Clinical validation requirements
- Integration with hospital systems (HL7, FHIR, DICOM)
- Patient safety and liability

**Financial Services:**
- KYC/AML requirements
- Payment processing (PCI DSS)
- Regional compliance (US, EU, specific countries)
- Fraud prevention
- Audit trails and reporting

**Aerospace/Defense:**
- DO-178C certification levels
- Safety analysis (FMEA, FTA)
- Simulation validation
- Real-time performance guarantees
- Export control (ITAR)

**Government/Public Sector:**
- Section 508 accessibility
- Security clearance requirements
- FISMA compliance
- Public records laws
- Procurement regulations

**Legal:**
- Bar association ethics rules
- Client confidentiality (attorney-client privilege)
- E-discovery requirements
- Audit trails for billing
- Conflict of interest checking

**Insurance:**
- Actuarial calculation requirements
- State-specific regulations
- Claims processing standards
- Data retention requirements
- NAIC compliance

**Education:**
- FERPA student privacy
- LMS/LTI standards
- Accessibility (WCAG, Section 508)
- Grade book requirements
- Student data security

### Step 2: Invoke Business Analyst Agent

The domain-research workflow is handled by the **Business Analyst agent** who specializes in regulatory and compliance research.

Use the Task tool to invoke the Business Analyst:

```yaml
subagent_type: bmad-analyst
prompt: |
  I need domain-specific research for a [your domain] project.

  **Project Description:**
  [Brief description of what you're building]

  **Domain:** [Healthcare / Fintech / Aerospace / Government / Legal / etc.]

  **Key Concerns:**
  - [Regulation/standard you're worried about]
  - [Compliance requirement]
  - [Safety or security concern]

  **Questions:**
  - What regulations apply to this project?
  - What industry standards must we follow?
  - What are the practical implications for development?
  - What risks should we be aware of?

  Please conduct collaborative domain research with web sources and create a domain brief with actionable recommendations.
```

### Step 3: Business Analyst Conducts Domain Research

The Business Analyst will:

1. **Domain Detection** - Identifies primary domain and complexity
2. **Concern Mapping** - Explores critical regulatory/compliance concerns
3. **Requirements Research** - Web research on current standards and regulations
4. **Practical Implications** - Translates research into development impacts
5. **Domain Patterns** - Explores how others solve similar problems
6. **Risk Assessment** - Identifies risks and mitigation strategies
7. **Validation Strategy** - Plans compliance and technical validation
8. **Decision Documentation** - Captures key decisions and rationale
9. **Recommendations** - Creates actionable must-have/should-have/nice-to-have lists
10. **PRD Integration** - Packages findings for PRD workflow
11. **Saves domain-brief.md** to `.bmad/output/domain-brief.md`

### Step 4: Review Domain Brief

The Business Analyst will create a comprehensive domain brief with:

**Domain Overview:**
- Primary domain identified
- Complexity level (high/medium)
- Key characteristics

**Regulatory Requirements:**
- Applicable regulations with sources
- Compliance pathways
- Timeline implications

**Industry Standards:**
- Required standards
- Best practices
- Integration requirements

**Practical Implications:**
- Architecture impacts
- Development effort
- Special expertise needed
- Testing requirements
- Timeline considerations
- Cost implications

**Domain Patterns:**
- Common architectural patterns
- Case studies from successful products
- Pros/cons of each approach
- When to use each pattern

**Risk Assessment:**
- Regulatory risks
- Technical risks
- Market risks
- Mitigation strategies

**Validation Strategy:**
- Compliance validation approach
- Technical validation requirements
- Domain expert involvement
- User testing needs

**Key Decisions:**
- Domain approach chosen
- Compliance strategy
- Risk acceptance/mitigation
- Rationale documented

**Recommendations:**
- **Must Have** (domain critical)
- **Should Have** (domain important)
- **Consider** (domain nice-to-have)
- Development sequence
- Expertise needed
- Timeline considerations

**Summary for PRD:**
- Key requirements to incorporate
- Impacts on functional/non-functional requirements
- Architecture considerations
- Development impacts
- Reference documentation

## Examples

### Example 1: Healthcare Telehealth Platform

**User Request:**
```
I need domain research for a telehealth platform connecting doctors and patients.
```

**Task tool invocation:**
```yaml
subagent_type: bmad-analyst
prompt: |
  I need domain-specific research for a telehealth platform.

  **Project Description:**
  Video consultation platform connecting licensed physicians with patients for remote healthcare visits.

  **Domain:** Healthcare/Medical

  **Key Concerns:**
  - HIPAA compliance for patient data
  - State medical licensing (doctors practicing across state lines)
  - Video quality requirements for medical diagnosis
  - Prescription workflows
  - Integration with EHR systems

  **Questions:**
  - Do we need FDA clearance?
  - What HIPAA requirements apply?
  - How do other telehealth platforms handle multi-state licensing?
  - What are the technical requirements for compliant video?

  Please conduct domain research and create actionable recommendations.
```

**Output:** Business Analyst creates `domain-brief.md` with:
- HIPAA compliance requirements (technical safeguards, BAAs)
- FDA classification (likely not a medical device, but verify)
- Multi-state licensing research (state-by-state vs. interstate compact)
- Video quality standards for telehealth
- EHR integration patterns (FHIR APIs)
- Prescription workflows (e-prescribing standards)
- Risk mitigation strategies
- Recommended architecture (BAA-compliant hosting, encryption, audit logs)
- Must-have vs should-have vs nice-to-have features
- Timeline: HIPAA compliance can be built incrementally, start with core security

### Example 2: FinTech Payment Processing

**User Request:**
```
I need domain research for a payment processing platform for small businesses.
```

**Task tool invocation:**
```yaml
subagent_type: bmad-analyst
prompt: |
  I need domain-specific research for a payment processing platform.

  **Project Description:**
  Payment processing and invoicing platform for small businesses. Handle credit cards, ACH, and potentially cryptocurrency.

  **Domain:** Financial Services

  **Key Concerns:**
  - PCI DSS compliance
  - KYC/AML requirements
  - Money transmitter licenses (state by state)
  - Fraud prevention
  - Regional compliance (starting US, maybe EU later)

  **Questions:**
  - What PCI DSS level applies to us?
  - Do we need money transmitter licenses in all 50 states?
  - What KYC is required for small business customers?
  - How do competitors handle fraud detection?

  Please conduct domain research with current regulations.
```

**Output:** Business Analyst creates `domain-brief.md` with:
- PCI DSS Level 1 vs 2 determination (depends on transaction volume)
- Money transmitter licensing research (expensive, consider payment facilitator model instead)
- KYC requirements (Tier 1 for small businesses)
- Fraud detection patterns (velocity checks, device fingerprinting, machine learning)
- Regional compliance (state-by-state requirements, EU PSD2 if expanding)
- Recommended approach: Start as payment facilitator (Stripe Connect, etc.), avoid direct licensing
- Must-have: PCI DSS SAQ, KYC onboarding, fraud rules
- Should-have: 3D Secure, chargeback management
- Timeline: 3-6 months for compliance infrastructure before launch

### Example 3: Aerospace Flight Planning Software

**User Request:**
```
I need domain research for flight planning software for small aircraft.
```

**Task tool invocation:**
```yaml
subagent_type: bmad-analyst
prompt: |
  I need domain-specific research for flight planning software.

  **Project Description:**
  Flight planning and navigation software for general aviation pilots (small aircraft, not commercial airlines).

  **Domain:** Aerospace

  **Key Concerns:**
  - FAA certification requirements
  - Real-time performance requirements
  - Safety-critical software standards
  - Integration with avionics
  - Weather data accuracy

  **Questions:**
  - Do we need DO-178C certification?
  - What safety analysis is required?
  - Can we use consumer-grade tablets or need certified hardware?
  - What are the liability concerns?

  Please conduct domain research on aerospace software requirements.
```

**Output:** Business Analyst creates `domain-brief.md` with:
- DO-178C analysis (Level D or E for non-critical flight planning, not full certification)
- EFB (Electronic Flight Bag) classification (Class 1/2/3 determination)
- FAA TSO requirements (likely not needed for Class 1 EFB)
- Safety analysis (FMEA for critical functions)
- Weather data requirements (TAF/METAR integration, certified sources)
- Integration patterns (Bluetooth to avionics vs standalone)
- Liability considerations (disclaimers, pilot responsibility, insurance)
- Recommended approach: Class 1 EFB (no certification), pilot-in-command responsibility
- Must-have: Reliable weather data, offline mode, database updates
- Should-have: Integration with flight databases (airports, airspace)
- Timeline: 6-12 months development, ongoing database maintenance

## Notes

**Domain research delegation:**
- All domain research workflows delegate to Business Analyst agent
- Business Analyst specializes in regulatory and compliance research
- Collaborative exploration approach (not just data dump)
- Creates actionable recommendations, not just research findings

**Living document approach:**
- Domain brief is written continuously as research progresses
- User is involved throughout (collaborative)
- Decisions are documented with rationale
- Findings are immediately translated to practical implications

**Typical domains:**
- Healthcare/Medical (HIPAA, FDA, clinical standards)
- Financial Services (PCI DSS, KYC/AML, regional compliance)
- Aerospace/Defense (DO-178C, ITAR, safety analysis)
- Government/Public Sector (accessibility, security, procurement)
- Legal (ethics, confidentiality, audit trails)
- Insurance (actuarial, state regulations, claims processing)
- Education (FERPA, LMS standards, accessibility)
- Energy/Utilities (NERC CIP, safety regulations)

**Anti-hallucination protocol:**
- All regulatory claims cited with sources
- Web research used for current regulations
- Conflicting sources presented (not arbitrarily chosen)
- Confidence levels flagged
- Facts vs analysis vs speculation distinguished

**Output location:**
- Domain brief saved to `.bmad/output/domain-brief.md`
- Comprehensive citations and sources
- Actionable recommendations for PRD
- Integration guidance for architecture

## Troubleshooting

**Issue:** Business Analyst agent not available

**Solution:**
- Ensure BMAD plugin is installed
- Check that bmad-analyst subagent exists
- Use Task tool with `subagent_type: bmad-analyst`

**Issue:** Domain not in common list

**Solution:**
- Still use domain-research workflow
- Business Analyst will adapt to your specific domain
- Provide as much context as possible about industry

**Issue:** Too much regulatory information, overwhelmed

**Solution:**
- Ask Business Analyst to prioritize must-have vs nice-to-have
- Focus on MVP compliance first
- Plan for iterative compliance (not all at once)

**Issue:** Regulations seem contradictory

**Solution:**
- Ask Business Analyst to present both interpretations
- Consider consulting domain expert or lawyer
- Document ambiguity and mitigation approach

**Issue:** Need general research, not domain-specific

**Solution:**
- Use `/bmad:bmm:workflows:research` instead
- Domain-research is for regulated industries only
- Research workflow handles market/technical/competitive research

## Output Files

- `.bmad/output/domain-brief.md` - Comprehensive domain analysis and recommendations
- `.bmad/sprint-artifacts/bmm-workflow-status.yaml` - Updated with domain-research completion (if tracking)

## Related Workflows

- **research** - General market/technical/competitive research (not domain-specific)
- **product-brief** - May trigger domain-research for regulated industries
- **prd** - Incorporates domain brief findings into requirements
- **architecture** - Domain requirements heavily influence architecture decisions
