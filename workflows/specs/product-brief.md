---
description: Interactive product brief creation through conversational discovery - adapts to hobby, startup, or enterprise context
---

# Product Brief Workflow

## Purpose

Creates a product vision document through **intent-driven conversational discovery** that:
- Understands project context (hobby, startup, enterprise)
- Discovers the problem worth solving through natural conversation
- Shapes the solution vision collaboratively
- Identifies target users with specific stories (not demographics)
- Defines success measures that match their context
- Scopes MVP features ruthlessly
- Explores relevant dimensions (market, financial, technical, organizational)
- Builds a **living document** continuously (not at end)
- Refines based on feedback to fit their needs (not a template)

**Intent-driven facilitation: Adapts organically to what emerges, not template-filling.**

**When to Use:**
- Level 2+ projects requiring strategic planning
- Market-facing products, enterprise initiatives, startup ventures
- Projects needing stakeholder alignment
- Optional but valuable for any project with strategic clarity needs

**For Level 0-1 (Quick Flow):** Use `/bmad:bmm:workflows:tech-spec` instead (simpler, faster)

## Variables

| Variable | Description | Source |
|----------|-------------|--------|
| `standalone_mode` | Boolean flag indicating if running standalone (true) or within workflow (false) | Determined by presence of `.bmad/bmm-workflow-status.yaml` |
| `project_name` | Name of the project | `.bmad/config.yaml` |
| `documentation_dir` | Directory for documentation output | `.bmad/config.yaml` |
| `user_name` | User's name for personalized communication | `.bmad/config.yaml` |
| `user_skill_level` | User's expertise level (expert/intermediate/beginner) | `.bmad/config.yaml` |
| `communication_language` | Language for agent communication | `.bmad/config.yaml` |
| `document_output_language` | Language for document generation | `.bmad/config.yaml` |
| `project_level` | Project complexity level (0-3) | `.bmad/bmm-workflow-status.yaml` (if exists) |
| `workflow_status` | Current status of all workflows | `.bmad/bmm-workflow-status.yaml` (if exists) |
| `context_type` | Project context detected (hobby/startup/enterprise) | Inferred from conversation |
| `date` | Current date for file naming | System date (YYYY-MM-DD format) |

## Instructions

### 1. Validate Workflow Readiness

**Check for workflow status file:**
- Check if `.bmad/bmm-workflow-status.yaml` exists

**If status file NOT found (standalone mode):**
- Set `standalone_mode = true`
- Display: "Product Brief can run standalone or as part of BMM workflow path. Running in standalone mode - great for exploring your product vision!"

**If status file found (workflow mode):**
- Load COMPLETE file: `.bmad/bmm-workflow-status.yaml`
- Parse `workflow_status` section
- Check status of "product-brief" workflow
- Get `project_level` from metadata
- Find first non-completed workflow
- Set `standalone_mode = false`

**Validation checks:**

**If project_level < 2:**
```
**Note: Level {level} Project**

Product Brief is most valuable for Level 2+ projects, but can help clarify vision for any project.
```

**If product-brief already completed:**
```
⚠️ Product Brief already completed: {file_path}
Re-running will overwrite the existing brief. Continue? (y/n)
```
Use AskUserQuestion for confirmation.

**If product-brief not next expected workflow:**
```
⚠️ Next expected workflow: {next_workflow}. Product Brief is out of sequence.
Continue with Product Brief anyway? (y/n)
```

### 2. Begin the Journey and Understand Context

**Welcome user warmly** and start with open exploration.

Adapt tone to `{user_skill_level}`:
- **Expert:** "Let's define your product vision. What are you building?"
- **Intermediate:** "I'm here to help shape your product vision. Tell me about your idea."
- **Beginner:** "Hi! I'm going to help you figure out exactly what you want to build. Let's start with your idea - what got you excited about this?"

**Open exploration questions:**
- What sparked this idea?
- What are you hoping to build?
- Who is this for - yourself, a business, users you know?

**Listen for context clues:**
- **Personal/hobby:** Fun, learning, small audience
- **Startup/solopreneur:** Market opportunity, competition matters
- **Enterprise/corporate:** Stakeholders, compliance, strategic alignment
- **Technical enthusiasm:** Implementation focused
- **Business opportunity:** Market/revenue focused
- **Problem frustration:** Solution focused

**Sense from initial response:**
- Formality level they prefer
- Business vs technical thinking style
- Existing materials to share
- Domain confidence level

Ask: "What's the project name, and what got you excited about building this?"

**Create initial document sections:**
- Project name
- Executive summary (initial)
- Initial vision

**If they mention existing documents:**
- Search for product brief: `{documentation_dir}/*brief*.md` or `{documentation_dir}/*brief*/index.md` (sharded)
- Search for research: `{documentation_dir}/*research*.md` or `{documentation_dir}/*research*/index.md` (sharded)
- Search for brainstorming: `{documentation_dir}/*brainstorm*.md` or `{documentation_dir}/*brainstorm*/index.md` (sharded)
- If sharded (index.md found): Read index, then read ALL section files
- Extract key themes and insights
- Reference naturally: "I see from your research that..."
- Use to accelerate discovery, not repeat questions

**Begin writing to product-brief document** with initial sections.

### 3. Discover the Problem Worth Solving

Guide problem discovery through **natural conversation** (not interrogation).

**DON'T ask:** "What problem does this solve?"

**DO explore conversationally** based on their context:

**For hobby projects:**
- "What's annoying you that this would fix?"
- "What would this make easier or more fun?"
- "Show me what the experience is like today without this"

**For business ventures:**
- "Walk me through the frustration your users face today"
- "What's the cost of this problem - time, money, opportunities?"
- "Who's suffering most from this? Tell me about them"
- "What solutions have people tried? Why aren't they working?"

**For enterprise:**
- "What's driving the need for this internally?"
- "Which teams/processes are most affected?"
- "What's the business impact of not solving this?"
- "Are there compliance or strategic drivers?"

**Listen for depth cues:**
- Brief answers → dig deeper with follow-ups
- Detailed passion → let them flow, capture everything
- Uncertainty → help them explore with examples
- Multiple problems → help prioritize the core issue

**Adapt your response:**
- If they struggle: offer analogies, examples, frameworks
- If they're clear: validate and push for specifics
- If they're technical: explore implementation challenges
- If they're business-focused: quantify impact

**Immediately capture what emerges:**
- Problem statement
- Problem impact (if metrics, costs, or business impact mentioned)
- Existing solutions gaps (if current solutions or competitors mentioned)

Reflect understanding: "So the core issue is {problem_summary}, and {impact_if_mentioned}. Let me capture that..."

### 4. Shape the Solution Vision

Transition naturally from problem to solution.

**Explore based on energy and context:**

**For builders/makers:**
- "How do you envision this working?"
- "Walk me through the experience you want to create"
- "What's the 'magic moment' when someone uses this?"

**For business minds:**
- "What's your unique approach to solving this?"
- "How is this different from what exists today?"
- "What makes this the RIGHT solution now?"

**For enterprise:**
- "What would success look like for the organization?"
- "How does this fit with existing systems/processes?"
- "What's the transformation you're enabling?"

**Go deeper based on responses:**
- If innovative → explore the unique angle
- If standard → focus on execution excellence
- If technical → discuss key capabilities
- If user-focused → paint the journey

**Web research when relevant:**

If they mention competitors or market:
```
Use WebSearch: "{competitor/market} latest features 2024"
Use findings to sharpen differentiation discussion
```

**Capture emerging insights:**
- Proposed solution
- Key differentiators (if unique differentiation discussed)

Continue building the living document.

### 5. Understand the People Who Need This

Discover target users through **storytelling, not demographics**.

**Facilitate based on project type:**

**Personal/hobby:**
- "Who else would love this besides you?"
- "Tell me about someone who would use this"
- Keep it light and informal

**Startup/business:**
- "Describe your ideal first customer - not demographics, but their situation"
- "What are they doing today without your solution?"
- "What would make them say 'finally, someone gets it!'?"
- "Are there different types of users with different needs?"

**Enterprise:**
- "Which roles/departments will use this?"
- "Walk me through their current workflow"
- "Who are the champions vs skeptics?"
- "What about indirect stakeholders?"

**Push beyond generic personas:**

❌ NOT: "busy professionals"
✅ DO: "Sales reps who waste 2 hours/day on data entry"

❌ NOT: "tech-savvy users"
✅ DO: "Developers who know Docker but hate configuring it"

❌ NOT: "small businesses"
✅ DO: "Shopify stores doing $10-50k/month wanting to scale"

**For each user type that emerges:**
- Current behavior/workflow
- Specific frustrations
- What they'd value most
- Their technical comfort level

**Capture user insights:**
- Primary user segment
- Secondary user segment (only if truly different needs)
- User journey (if workflow discussed)

### 6. Define What Success Looks Like

Explore success measures that **match their context**.

**For personal projects:**
- "How will you know this is working well?"
- "What would make you proud of this?"
- Keep metrics simple and meaningful

**For startups:**
- "What metrics would convince you this is taking off?"
- "What user behaviors show they love it?"
- "What business metrics matter most - users, revenue, retention?"
- Push for specific targets: "100 users" not "lots of users"

**For enterprise:**
- "How will the organization measure success?"
- "What KPIs will stakeholders care about?"
- "What are the must-hit metrics vs nice-to-haves?"

**Only dive deep into metrics if they show interest.**
**Skip entirely for pure hobby projects.**
**Focus on what THEY care about measuring.**

**Capture success measures (if discussed):**
- Success metrics
- Business objectives (if business objectives mentioned)
- Key performance indicators (if KPIs matter to them)

Keep the document growing with each discovery.

### 7. Discover the MVP Scope

**CRITICAL: Focus on FEATURES not epics** - epics come in Phase 2.

Guide MVP scoping based on their maturity:

**For experimental/hobby:**
- "What's the ONE thing this must do to be useful?"
- "What would make a fun first version?"
- Embrace simplicity

**For business ventures:**
- "What's the smallest version that proves your hypothesis?"
- "What features would make early adopters say 'good enough'?"
- "What's tempting to add but would slow you down?"
- Be ruthless about scope creep

**For enterprise:**
- "What's the pilot scope that demonstrates value?"
- "Which capabilities are must-have for initial rollout?"
- "What can we defer to Phase 2?"

**Use this framing:**
- **Core features:** "Without this, the product doesn't work"
- **Nice-to-have:** "This would be great, but we can launch without it"
- **Future vision:** "This is where we're headed eventually"

**Challenge feature creep:**
- "Do we need that for launch, or could it come later?"
- "What if we started without that - what breaks?"
- "Is this core to proving the concept?"

**Capture MVP scope:**
- Core features
- Out of scope (if scope creep discussed)
- Future vision features (if future features mentioned)
- MVP success criteria (if success criteria for MVP mentioned)

### 8. Explore Relevant Context Dimensions

**CRITICAL: Only explore what emerges naturally** - skip what doesn't matter.

Based on the conversation so far, **selectively explore:**

**IF financial aspects emerged:**
- Development investment needed
- Revenue potential or cost savings
- ROI timeline
- Budget constraints

Capture as: Financial considerations

**IF market competition mentioned:**
- Competitive landscape
- Market opportunity size
- Differentiation strategy
- Market timing

Use WebSearch: "{market} size trends 2024"
Capture as: Market analysis

**IF technical preferences surfaced:**
- Platform choices (web/mobile/desktop)
- Technology stack preferences
- Integration needs
- Performance requirements

Capture as: Technical preferences

**IF organizational context emerged:**
- Strategic alignment
- Stakeholder buy-in needs
- Change management considerations
- Compliance requirements

Capture as: Organizational context

**IF risks or concerns raised:**
- Key risks and mitigation
- Critical assumptions
- Open questions needing research

Capture as: Risks and assumptions

**IF timeline pressures mentioned:**
- Launch timeline
- Critical milestones
- Dependencies

Capture as: Timeline constraints

**Skip anything that hasn't naturally emerged.**
**Don't force sections that don't fit their context.**

### 9. Refine and Complete the Living Document

Review what's been captured with the user.

"Let me show you what we've built together..."

**Present the actual document sections created so far:**
- Not a summary, but the real content
- Shows the document has been growing throughout

Ask:
```
Looking at this, what stands out as most important to you?
Is there anything critical we haven't explored?
Does this capture your vision?
```

**Based on their response:**
- Refine sections that need more depth
- Add any missing critical elements
- Remove or simplify sections that don't matter
- Ensure the document fits THEIR needs, not a template

Make final refinements based on feedback.

Create executive summary that captures the essence.

**Ensure document structure makes sense for what was discovered:**
- **Hobbyist projects:** 2-3 pages focused on problem/solution/features
- **Startup ventures:** 5-7 pages with market analysis and metrics
- **Enterprise briefs:** 10+ pages with full strategic context

**The document should reflect their world, not force their world into a template.**

### 10. Complete and Save the Product Brief

The document has been building throughout conversation. Now ensure it's complete and well-organized.

**If research documents were provided:**
- Append summary of incorporated research
- List supporting materials

Ask user:
```yaml
questions:
  - question: "Your product brief is ready! What would you like to do?"
    header: "Finalize Brief"
    multiSelect: false
    options:
      - label: "Review specific sections"
        description: "Let's go through particular areas together"
      - label: "Make final adjustments"
        description: "I have some changes to make"
      - label: "Save and move forward"
        description: "This looks great, let's proceed"
```

Make any requested refinements.

**Save product brief** to `{documentation_dir}/product-brief-{project_name}-{date}.md`

**Update workflow status (if not standalone):**

If `standalone_mode != true`:
1. Load COMPLETE file: `.bmad/bmm-workflow-status.yaml`
2. Find `workflow_status` key "product-brief"
3. Update: `workflow_status["product-brief"] = "{documentation_dir}/product-brief-{project_name}-{date}.md"`
4. Save file, preserving ALL comments and structure
5. Find first non-completed workflow (next workflow)

## Workflow

```
1. Validate readiness
   → Check workflow status
   → Determine standalone vs workflow mode
   → Validate project level and sequence
   ↓
2. Begin journey
   → Understand context (hobby/startup/enterprise)
   → Load existing documents if mentioned
   → Create initial document sections
   ↓
3. Discover problem
   → What's worth solving?
   → Why now?
   → Capture problem statement and impact
   ↓
4. Shape solution
   → How does this work?
   → What makes it different?
   → Web research if competitors mentioned
   ↓
5. Understand users
   → Who needs this? (stories, not demographics)
   → Capture user segments and journeys
   ↓
6. Define success
   → What does winning look like?
   → Capture metrics (if relevant to context)
   ↓
7. Scope MVP
   → Core vs nice-to-have vs future
   → Challenge feature creep ruthlessly
   ↓
8. Explore context
   → Market, financial, technical (only what emerges)
   → Skip irrelevant sections
   ↓
9. Refine document
   → Show what we've built
   → Get feedback and refine
   ↓
10. Complete brief
    → Final adjustments
    → Save and guide next steps
    → Update workflow status
```

**Key behavior:**
- **Living document:** Writes continuously throughout conversation
- **Context-adaptive:** Adjusts tone and depth to project type
- **Discovery-focused:** "Why" and "What matters" over template-filling
- **Natural flow:** Only explores what emerges naturally
- **User-driven:** Document structure reflects their needs, not rigid template

**Prerequisites:**
- BMAD plugin installed (`/bmad:bmm:workflows:workflow-init` run) OR standalone mode
- Configuration file at `.bmad/config.yaml`
- Optional: Existing research, brainstorming docs, or initial ideas

**Related Workflows:**

**Before product-brief:**
- `/bmad:bmm:workflows:workflow-init` - Initialize project (RECOMMENDED)
- `/bmad:bmm:workflows:research` - Market/domain research (optional, for additional context)
- `/bmad:bmm:workflows:brainstorm-project` - Brainstorming (optional, product-brief can do discovery)

**After product-brief:**
- `/bmad:bmm:workflows:prd` - Detailed requirements (Level 2+) (RECOMMENDED next step)
- `/bmad:bmm:workflows:architecture` - Technical design (after PRD)

**Alternatives:**
- `/bmad:bmm:workflows:tech-spec` - For Level 0-1 projects (simpler, faster)

**Navigation:**
```
Level 2+ Flow:
  workflow-init
    ↓
  product-brief (you are here) ← Optional but valuable
    ↓
  prd → architecture → create-epics-and-stories
    ↓
  dev-story
```

## Report

Display completion message:
```
**✅ Product Brief Complete, {user_name}!**

Your product vision has been captured in a document that reflects what matters most for your {context_type} project.

**Document saved:** {documentation_dir}/product-brief-{project_name}-{date}.md

{if standalone_mode:
**Next steps:**
- Run `workflow-init` to set up guided workflow tracking
- Or proceed directly to the PRD workflow if you know your path
}
{else:
**What's next:** {next_workflow}

The next phase will take your brief and create the detailed planning artifacts needed for implementation.
}

Remember: This brief captures YOUR vision. It grew from our conversation, not from a rigid template. It's ready to guide the next phase of bringing your idea to life.
```

**Success Criteria:**

✅ **Product vision captured** through natural conversation

✅ **Living document built** continuously (not at end)

✅ **Context-adapted** to project type (hobby/startup/enterprise)

✅ **Users understood** through stories (not demographics)

✅ **MVP scoped ruthlessly** (core vs nice-to-have vs future)

✅ **Only relevant sections** included (no template bloat)

✅ **Ready for PRD** (clear vision to elaborate on)

**Output Files:**

**1. Product Brief** (`{documentation_dir}/product-brief-{project_name}-{date}.md`)

Structure varies by project type:

**Hobby project (2-3 pages):**
```markdown
# Product Brief: {Project Name}

## Executive Summary
{Vision}

## Problem
{What's being solved}

## Solution
{How it works}

## Users
{Who needs this}

## Success
{How we'll know it's working}

## MVP Features
{What we're building first}

## Technical Preferences
{If discussed}
```

**Startup venture (5-7 pages):**
```markdown
# Product Brief: {Project Name}

## Executive Summary

## Problem
- Problem statement
- Impact and cost
- Existing solutions gaps

## Solution
- Proposed solution
- Key differentiators

## Target Users
- Primary user segment
- User journey

## Success Metrics
- Success metrics
- Business objectives

## MVP Scope
- Core features
- Out of scope
- Future vision

## Market Analysis
{From WebSearch}

## Financial Considerations

## Technical Preferences

## Timeline Constraints
```

**Enterprise initiative (10+ pages):**
```markdown
# Product Brief: {Project Name}

## Executive Summary

## Problem
- Problem statement
- Business impact
- Stakeholder drivers

## Solution
- Proposed solution
- Organizational transformation

## Users and Stakeholders
- Primary users
- Secondary users
- Stakeholders (champions, skeptics)

## Success Metrics
- KPIs
- Business objectives

## MVP Scope
- Pilot scope
- Full rollout features
- Future phases

## Organizational Context
- Strategic alignment
- Stakeholder buy-in
- Change management

## Risks and Assumptions
- Key risks
- Mitigation strategies
- Critical assumptions

## Timeline Constraints
- Pilot timeline
- Full rollout timeline
- Critical milestones
```

**2. Modified Files (if workflow mode):**

Workflow Status (`.bmad/bmm-workflow-status.yaml`)
```yaml
workflow_status:
  product-brief: "{documentation_dir}/product-brief-{project_name}-{date}.md"  # ← Updated
```

**Typical Usage:**
1. User has Level 2+ project idea
2. Runs product-brief workflow
3. Conversational discovery (30-60 minutes)
4. Living document built continuously
5. Refined based on feedback
6. Proceeds to PRD workflow with clear vision

**Time:** 30-60 minutes (depending on project complexity)

**Document length varies:**
- Hobby: 2-3 pages
- Startup: 5-7 pages
- Enterprise: 10+ pages

---

## Key Principles

### 1. Intent-Driven Facilitation

**Adapt organically to what emerges:**
- Don't force template sections
- Follow the natural flow of conversation
- Explore what matters to them, skip what doesn't

**Why:** Every project is unique. Templates create noise, not clarity.

### 2. Living Document Approach

**Write continuously throughout conversation:**
- Capture insights immediately
- Build document section by section
- Don't wait until end

**Why:** Prevents forgetting details, demonstrates progress, enables real-time refinement.

### 3. Context-Adaptive Conversation

**Adjust to project type:**
- **Hobby projects:** Light, fun, simple
- **Startup ventures:** Market-focused, metrics-driven, ruthless scoping
- **Enterprise initiatives:** Strategic alignment, stakeholder management, compliance

**Why:** One size doesn't fit all. Conversation must match their world.

### 4. Stories Over Demographics

**Push beyond generic personas:**
- Not "busy professionals" → "Sales reps who waste 2 hours/day on data entry"
- Specific situations, frustrations, workflows

**Why:** Generic personas are useless. Specific stories reveal real needs.

### 5. Discovery Over Interrogation

**Natural conversation, not questionnaire:**
- "Walk me through..." not "What is..."
- Listen for depth cues
- Adapt questions based on their responses

**Why:** People think through conversation, not forms.

### 6. Ruthless MVP Scoping

**Challenge feature creep relentlessly:**
- Core vs nice-to-have vs future
- "Do we need that for launch?"
- "What if we started without that?"

**Why:** Scope creep kills projects. MVP is about learning, not completeness.

### 7. Only What Emerges

**Skip sections that don't matter:**
- Financial analysis for hobby projects? Skip it.
- Market sizing for internal tools? Skip it.
- Compliance for simple apps? Skip it.

**Why:** Irrelevant sections create busywork, not value.

---

## Examples

### Example 1: Hobby Project (Developer Tool)

**Context:**
- Personal project
- Developer building tool for themselves
- No business intent

**Execution:**

1. **Begin journey:**
   ```
   User: "I'm building a CLI tool to automate my deployment scripts. I keep forgetting steps and breaking things."

   Detected context: Personal/hobby, technical focus, problem frustration

   Initial vision captured:
   - Project name: deploy-buddy
   - Problem: Manual deployment errors
   ```

2. **Discover problem:**
   ```
   "Walk me through what happens when you deploy today..."

   User: "I have like 10 different commands I run in order. If I mess up the order or forget to set environment variables, stuff breaks. Then I spend an hour debugging."

   Problem captured:
   - Manual deployment process error-prone
   - 10-step process easy to mess up
   - Costs 1+ hours when it breaks
   ```

3. **Shape solution:**
   ```
   "How do you envision this working?"

   User: "Just run `deploy-buddy prod` and it handles everything - sets vars, runs commands in order, checks for errors, rolls back if needed."

   Solution captured:
   - Single command execution
   - Environment variable management
   - Error checking and rollback
   ```

4. **Understand users:**
   ```
   "Who else would love this besides you?"

   User: "Probably just me for now. Maybe share with a few dev friends later."

   Users captured:
   - Primary: Solo developer (myself)
   - Future: Developer friends with similar workflows
   ```

5. **Define success:**
   ```
   "How will you know this is working well?"

   User: "If I never break prod deployments again. That'd be huge."

   Success: Zero production deployment errors
   ```

6. **Scope MVP:**
   ```
   "What's the ONE thing this must do to be useful?"

   User: "Handle my current deployment script. Just wrap what I do manually."

   Core features:
   - Execute deployment commands in order
   - Environment variable setup
   - Basic error detection

   Future:
   - Multiple environments
   - Custom scripts
   - Rollback automation
   ```

7. **Context dimensions:**
   ```
   Financial? Skip (hobby project)
   Market? Skip (personal tool)
   Technical preferences? Yes!

   User: "I want to use Node.js since that's what I know."

   Technical captured:
   - Node.js CLI
   - npm package
   ```

8. **Result:**
   ```
   ✅ Product Brief Complete!

   Document: 2 pages
   - Problem: Manual deployment errors
   - Solution: CLI automation tool
   - User: Solo developer
   - Success: Zero prod errors
   - MVP: Wrap existing deployment script
   - Tech: Node.js CLI

   Next: Run tech-spec workflow (Level 0-1 project)
   ```

**Document length:** 2 pages (focused on problem/solution/features)

---

### Example 2: Startup Venture (SaaS Product)

**Context:**
- Startup idea
- Market opportunity
- Revenue-focused

**Execution:**

1. **Begin journey:**
   ```
   User: "I want to build a tool for freelancers to manage client invoices. I'm a freelancer and invoicing is such a pain."

   Detected context: Startup/solopreneur, market opportunity, personal frustration

   Initial vision captured:
   - Project name: InvoiceFlow
   - Personal experience driving idea
   ```

2. **Discover problem:**
   ```
   "Walk me through the frustration you face today..."

   User: "I use a mix of Google Sheets, email, and PayPal. Clients forget to pay, I forget to follow up, tracking what's paid vs outstanding is messy. Costs me probably 20 hours a month in admin work."

   Problem impact:
   - 20 hours/month wasted on invoicing admin
   - Late payments due to poor tracking
   - Unprofessional scattered tools

   "What solutions have you tried?"

   User: "I looked at FreshBooks and QuickBooks but they're overkill for freelancers. Too expensive ($30-50/month) and way too complex."

   Existing solutions gaps:
   - Current tools too complex for freelancers
   - Pricing too high ($30-50/month)
   - Designed for companies, not individuals
   ```

3. **Shape solution:**
   ```
   "What's your unique approach?"

   User: "Simple, beautiful invoices. Automatic payment reminders. One-click payments. That's it. No accounting, no inventory, no enterprise features."

   Key differentiators:
   - Freelancer-focused simplicity
   - Beautiful design
   - Affordable pricing (<$15/month)
   - Zero accounting complexity
   ```

4. **Understand users:**
   ```
   "Describe your ideal first customer..."

   User: "Freelance designers and developers making $5-15k/month. They have 3-10 clients. Not beginners, but not agencies yet. They care about looking professional but hate admin work."

   Primary user:
   - Freelance designers/developers
   - $5-15k/month revenue
   - 3-10 active clients
   - Values professionalism
   - Hates admin work
   - Technical comfort: moderate
   ```

5. **Define success:**
   ```
   "What metrics would convince you this is taking off?"

   User: "If I can get 100 paying users in 6 months, that'd prove the concept. Revenue-wise, maybe $1-2k/month to start."

   Success metrics:
   - 100 paying users in 6 months
   - $1-2k MRR initial target
   - 80%+ payment rate (invoices paid on time)

   Business objectives:
   - Validate freelancer market
   - Achieve profitability within 12 months
   ```

6. **Scope MVP:**
   ```
   "What's the smallest version that proves your hypothesis?"

   User: "Create invoice, send it, accept payment, automatic reminders. That's enough."

   Core features:
   - Invoice creation and customization
   - Email delivery
   - Payment collection (Stripe integration)
   - Automatic payment reminders

   Nice-to-have (defer):
   - Client portal
   - Expense tracking
   - Time tracking

   Future vision:
   - Multi-currency
   - Recurring invoices
   - Team collaboration
   ```

7. **Context dimensions:**

   **Financial:**
   ```
   "What's your development investment?"

   User: "Maybe 3-4 months full-time development. I can bootstrap it."

   Financial:
   - 3-4 months development time
   - Bootstrap (no external funding)
   - Target: $10-15/month per user pricing
   ```

   **Market:**
   ```
   WebSearch: "freelance invoicing market size 2024"

   Market analysis:
   - Freelance economy: 59M in US (2023)
   - Growing 8% YoY
   - Existing players: FreshBooks ($30/mo), QuickBooks ($25/mo)
   - Gap: Simple, affordable freelancer tools
   ```

   **Technical:**
   ```
   User: "I'm thinking Next.js + PostgreSQL + Stripe."

   Technical preferences:
   - Web app (Next.js)
   - PostgreSQL database
   - Stripe payment processing
   - Email via SendGrid
   ```

8. **Result:**
   ```
   ✅ Product Brief Complete!

   Document: 6 pages
   - Problem: Freelancer invoicing pain (20hrs/month wasted)
   - Solution: Simple, beautiful invoicing tool
   - Market: 59M freelancers, growing 8% YoY
   - User: Freelance designers/devs, $5-15k/month
   - Success: 100 users in 6 months, $1-2k MRR
   - MVP: Invoice + send + payment + reminders
   - Financials: 3-4 month development, $10-15/mo pricing
   - Tech: Next.js, PostgreSQL, Stripe

   Next: Run prd workflow (Level 2+ project)
   ```

**Document length:** 6 pages (with market analysis and metrics)

---

### Example 3: Enterprise Initiative (Internal Tool)

**Context:**
- Enterprise project
- Internal operations improvement
- Stakeholder alignment needed

**Execution:**

1. **Begin journey:**
   ```
   User: "We need to streamline our IT support ticket system. Current process is a mess - tickets get lost, response times are terrible."

   Detected context: Enterprise/corporate, operational improvement, organizational pain

   Initial vision captured:
   - Project name: ServiceDesk Plus
   - Problem: IT support inefficiency
   ```

2. **Discover problem:**
   ```
   "What's driving the need for this internally?"

   User: "IT team is drowning. 500+ employees, tickets via email, Slack, phone. No central tracking. Average resolution time is 3 days. CTO wants this fixed."

   "What's the business impact?"

   User: "Employees lose 2-4 hours/week waiting for IT support. That's 1,000-2,000 hours/week company-wide. At average salary, that's $50-100k/week in lost productivity."

   Problem impact:
   - 500 employees affected
   - 2-4 hours/week lost per person
   - $50-100k/week lost productivity
   - Average resolution time: 3 days
   - Executive (CTO) mandate
   ```

3. **Shape solution:**
   ```
   "What would success look like for the organization?"

   User: "Central ticket portal, automated routing, SLA tracking, knowledge base. Reduce resolution time to <1 day."

   Solution:
   - Centralized ticket management
   - Automated ticket routing
   - SLA tracking and alerts
   - Knowledge base integration
   - Goal: <1 day average resolution
   ```

4. **Understand users:**
   ```
   "Which roles will use this?"

   User: "Employees submit tickets (500 people), IT team manages them (12 people), IT managers monitor (3 people). Different needs for each."

   User segments:
   - Employees (500): Submit tickets, track status
   - IT team (12): Manage and resolve tickets
   - IT managers (3): Monitor SLAs, reporting

   Stakeholders:
   - Champions: CTO, IT Director
   - Users: All employees
   - Skeptics: Some IT staff (change resistance)
   ```

5. **Define success:**
   ```
   "How will the organization measure success?"

   User: "Resolution time <1 day, 90% SLA compliance, employee satisfaction >4/5."

   KPIs:
   - Average resolution time: <24 hours (from 3 days)
   - SLA compliance: 90%+
   - Employee satisfaction: >4/5 rating
   - Ticket volume reduction (via knowledge base): 20%
   ```

6. **Scope MVP:**
   ```
   "What's the pilot scope that demonstrates value?"

   User: "Start with IT department only (pilot with 50 people), then roll out company-wide."

   Core features (pilot):
   - Ticket submission portal
   - Ticket assignment and routing
   - Status tracking
   - Basic SLA alerts

   Phase 2 (company-wide):
   - Knowledge base
   - Advanced reporting
   - Integrations (Slack, email)
   - Mobile app
   ```

7. **Context dimensions:**

   **Organizational:**
   ```
   "What's the strategic alignment?"

   User: "Part of digital transformation initiative. CTO wants to improve internal efficiency across all departments."

   Organizational context:
   - Strategic initiative: Digital transformation
   - Executive sponsor: CTO
   - Change management: Training required for IT team
   - Stakeholder buy-in: IT Director (champion), IT staff (need convincing)
   ```

   **Timeline:**
   ```
   "What's the launch timeline?"

   User: "CTO wants pilot in 3 months, full rollout in 6 months."

   Timeline:
   - Pilot (50 users): 3 months
   - Full rollout (500 users): 6 months
   - Critical milestone: Q2 board presentation
   ```

   **Risks:**
   ```
   User: "IT team might resist change. They're used to email."

   Risks and assumptions:
   - Risk: IT team change resistance
   - Mitigation: Involve IT in design, comprehensive training
   - Assumption: Current email-based system will remain as fallback during pilot
   ```

8. **Result:**
   ```
   ✅ Product Brief Complete!

   Document: 8 pages
   - Problem: IT support inefficiency ($50-100k/week lost)
   - Solution: Centralized ticket management system
   - Users: 500 employees, 12 IT staff, 3 managers
   - Success: <24hr resolution, 90% SLA compliance, >4/5 satisfaction
   - MVP: Pilot with 50 users in 3 months
   - Organizational: Digital transformation initiative, CTO sponsor
   - Timeline: 3-month pilot, 6-month full rollout
   - Risks: Change resistance, mitigation via training

   Next: Run prd workflow (Level 2+ enterprise project)
   ```

**Document length:** 8 pages (full strategic context)

---

## Troubleshooting

### Issue: User unsure about project scope

**Symptoms:**
```
User: "I don't know if this is small or large..."
```

**Solution:**
- Describe levels conversationally
- Ask: "How many distinct features are you envisioning?"
- 1-5 features → Level 0-1 (tech-spec might be better)
- 6+ features → Level 2+ (product-brief appropriate)

---

### Issue: User has no existing docs to load

**Symptoms:**
```
No product brief, research, or brainstorming docs found
```

**Solution:**
- This is normal! Product brief is often the first document
- Proceed with conversational discovery
- No documents needed to start

---

### Issue: User gets stuck on success metrics

**Symptoms:**
```
User: "I don't know what metrics matter..."
```

**Solution:**
- Adapt to project type
- Hobby projects: "How will YOU know it's working?" (simple, personal)
- Startups: "What would convince you this is worth pursuing?" (validation-focused)
- Enterprise: "What will your stakeholders ask about?" (KPI-focused)
- Skip metrics entirely if they're genuinely unsure

---

### Issue: Scope keeps growing during conversation

**Symptoms:**
```
User keeps adding features: "Oh, and it should also..."
```

**Solution:**
- Gently redirect to MVP scoping
- Ask: "Do we need that for launch, or could it come later?"
- Capture in "Future vision features" section
- Emphasize: MVP is about learning, not completeness

---

## Notes

- **Intent-driven, not template-driven:** Adapts to what emerges naturally
- **Living document:** Writes continuously throughout conversation
- **Context-adaptive:** Adjusts to hobby, startup, or enterprise projects
- **Discovery-focused:** Natural conversation, not interrogation
- **Stories over demographics:** Specific user situations, not generic personas
- **Ruthless MVP scoping:** Challenges feature creep relentlessly
- **Only what emerges:** Skips irrelevant sections (no template bloat)
- **Document reflects their world:** Structure matches their needs, not rigid template

**Configuration:**

Reads from `.bmad/config.yaml`:

```yaml
project_name: "project-name"
documentation_dir: "docs/bmad"
user_name: "Developer"
communication_language: "English"
document_output_language: "English"
user_skill_level: "intermediate"  # expert/intermediate/beginner
```
