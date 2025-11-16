---
description: Create comprehensive Product Requirements Document using intent-driven planning adapted to product type and complexity
---

# PRD - Product Requirements Document

## What This Does

Creates a comprehensive Product Requirements Document (PRD) through interactive discovery and planning. Uses intent-driven approach that adapts to your product type (API, mobile, SaaS, etc.) and domain complexity (healthcare, finance, etc.).

This workflow delegates to the **bmad-pm** (Product Manager) subagent, which specializes in:
- Strategic product planning and requirements analysis
- Market research and competitive analysis
- Breaking down complex features into clear requirements
- Creating comprehensive, actionable PRDs

## Prerequisites

1. BMAD plugin installed and initialized
2. Run `/bmad:meta:workflow-init` to set up project structure
3. (Optional but recommended) Product brief created via `/bmad:phase-1:product-brief`
4. (Optional for complex domains) Domain research via `/bmad:phase-1:domain-research`

## How It Works

### Track Routing

BMAD supports three project tracks:

- **BMad Method**: Full product development with comprehensive planning (uses this workflow)
- **Enterprise Method**: Enterprise-scale projects with extended planning (uses this workflow)
- **Quick Flow**: Single feature/bug fix (uses `/bmad:phase-2:tech-spec` instead)

**This workflow is for BMad Method and Enterprise Method tracks.**

### Process Overview

1. **Validate readiness**: Check workflow status, ensure correct track
2. **Delegate to bmad-pm**: Launch Product Manager subagent for PRD creation
3. **Interactive discovery**: PM agent guides you through product planning
4. **Living document**: PRD created incrementally as you discuss
5. **Epic breakdown**: Option to continue with epic decomposition or start fresh session

### What You'll Be Asked

The PM agent will guide you through:
- **Vision & Context**: What you're building and why
- **Success Criteria**: How you'll measure success
- **Scope Definition**: MVP vs growth vs vision features
- **Domain Requirements**: Special compliance, regulations, standards (if applicable)
- **Functional Requirements**: What the product must do
- **Non-Functional Requirements**: Performance, security, scale, etc.
- **Project-Specific Details**: Adapted to your product type

## Instructions

### Step 1: Check Workflow Status

**Action:** Read workflow status to determine project track and validate PRD hasn't already been completed.

```yaml
# Read configuration
config_file: .bmad/config.yaml
status_file: {output_folder}/bmm-workflow-status.yaml
```

**Load:**
- Project configuration from `.bmad/config.yaml`
- Workflow status from `{output_folder}/bmm-workflow-status.yaml`

**Validate:**
- Check if `project_track` is "BMad Method" or "Enterprise Method"
  - If "Quick Flow" → Redirect to `/bmad:phase-2:tech-spec`
- Check if PRD workflow already completed
  - If completed → Ask user if they want to overwrite
  - If "no" → Exit and suggest `/bmad:workflow-status`

**If no status file found:**
- Set `standalone_mode = true`
- Continue without status tracking
- Warn user that workflow tracking is unavailable

### Step 2: Gather Existing Context

**Action:** Check for existing input documents that inform the PRD.

**Smart document discovery** (check for both whole and sharded versions):

```
Product Brief:
  - {output_folder}/*brief*.md
  - {output_folder}/*brief*/index.md

Market Research:
  - {output_folder}/*research*.md
  - {output_folder}/*research*/index.md

Domain Research:
  - {output_folder}/*domain*.md
  - {output_folder}/*domain*/index.md

Project Documentation:
  - {output_folder}/docs/index.md
```

**For each found document:**
- Read the content (or index.md if sharded)
- Summarize key insights for PM agent
- Note file path for reference section

### Step 3: Launch Product Manager Subagent

**Action:** Delegate PRD creation to the bmad-pm subagent.

**Use the Task tool with these parameters:**

```javascript
{
  "subagent_type": "bmad-pm",
  "description": "Create comprehensive PRD",
  "prompt": `Create a comprehensive Product Requirements Document (PRD) for this project.

**Project Context:**
- Project Name: {project_name}
- Project Track: {project_track}
- Output Folder: {output_folder}
- User Name: {user_name}

**Existing Documents Available:**
{list_of_found_documents_with_paths}

**Configuration:**
- Communication Language: {communication_language}
- Document Output Language: {document_output_language}
- User Skill Level: {user_skill_level}

**Your Task:**

1. **Discovery & Planning**: Guide the user through comprehensive product planning:
   - Understand product vision and goals
   - Identify project type (API, mobile, SaaS, etc.)
   - Detect domain complexity (healthcare, finance, etc.)
   - Capture "product magic" - what makes it special
   - Define success criteria
   - Negotiate scope (MVP, Growth, Vision)
   - Gather functional requirements
   - Document non-functional requirements
   - Adapt questions to project type and domain

2. **Create Living PRD**: Write to {output_folder}/PRD.md continuously as you discover information. Use the PRD template structure from your agent instructions.

3. **Intent-Driven Approach**:
   - Adapt organically to the product type and context
   - Only include sections that matter for THIS product
   - Skip generic content
   - Weave the "product magic" throughout

4. **After PRD Complete**: Offer the user two options:
   a) Start a new session for epic breakdown (recommended for complex projects)
   b) Continue here with epic breakdown

   If option (b), proceed to break down requirements into epics and stories.

5. **Epic Breakdown** (if user chooses option b):
   - Transform requirements into implementable epics
   - Break epics into AI-agent-sized stories
   - Ensure vertical slicing (not horizontal layers)
   - Validate no forward dependencies
   - Create {output_folder}/epics.md with detailed breakdown
   - Ensure Epic 1 establishes foundation

**Output Files:**
- {output_folder}/PRD.md (required)
- {output_folder}/epics.md (optional, if user continues with epic breakdown)

**Validation:**
Use the PRD validation checklist to ensure completeness before finishing.

**When complete**, report back:
- Files created
- Key insights captured
- Recommended next steps
- Whether epic breakdown was included or should be separate session
`
}
```

**The PM agent will:**
- Load existing context documents
- Guide interactive discovery session
- Create comprehensive PRD adapted to project type
- Optionally create epic breakdown
- Validate completeness
- Update workflow status (if not standalone mode)

### Step 4: Update Workflow Status

**Action:** After PM agent completes, update workflow status.

**If not standalone_mode:**
1. Read `{output_folder}/bmm-workflow-status.yaml`
2. Update `workflow_status.prd` to file path: `{output_folder}/PRD.md`
3. If epics created, also update `workflow_status.create-epics-and-stories`
4. Save file, preserving all comments and structure

**Report to user:**
```
✅ PRD Complete!

Created:
- {output_folder}/PRD.md
{if_epics_created}
- {output_folder}/epics.md
{endif}

Next Steps:
{if_no_epics}
1. Run /bmad:phase-2:create-epics-and-stories to break down requirements into implementable stories
{endif}
2. Run /bmad:phase-3:architecture to create technical architecture
3. Run /bmad:workflow-status to see your full project status
```

## Key Principles

### Intent-Driven Planning

The PRD workflow adapts to your product:
- **Project Type Detection**: Automatically identifies if you're building an API, mobile app, SaaS platform, etc.
- **Domain Complexity**: Detects specialized domains (healthcare, finance) and adapts requirements
- **Adaptive Sections**: Only includes relevant sections (skips irrelevant NFRs, etc.)

### Living Document Approach

The PRD is built incrementally:
- Written continuously during discovery
- No waiting until the end
- You can review and refine as you go
- Product magic woven throughout

### Product Magic

Every great product has something special - the "magic moment" that makes users love it:
- Captured early in discovery
- Woven throughout all requirements
- Guides all subsequent work
- Keeps team focused on what matters

## Validation Checklist

The PM agent will validate the PRD ensures:

**Critical Items:**
- [ ] No template variables unfilled
- [ ] All FRs (functional requirements) numbered and traceable
- [ ] Epic 1 establishes foundation (if epics created)
- [ ] No forward dependencies between stories
- [ ] Vertical slicing (not horizontal layers)
- [ ] All FRs covered by stories (if epics created)

**Completeness:**
- [ ] Executive summary with vision
- [ ] Product magic clearly articulated
- [ ] Project classification (type, domain, complexity)
- [ ] Success criteria defined
- [ ] Product scope (MVP, Growth, Vision)
- [ ] Functional requirements comprehensive
- [ ] Non-functional requirements (when applicable)
- [ ] Project-specific sections included

**Quality:**
- [ ] Language clear and specific
- [ ] Requirements measurable and testable
- [ ] No jargon without definitions
- [ ] Professional polish
- [ ] References to source documents

## Output Files

### PRD.md

Comprehensive product requirements document including:
- Executive summary
- Product magic essence
- Project classification
- Success criteria
- Scope definition (MVP/Growth/Vision)
- Functional requirements (numbered)
- Non-functional requirements
- Project-specific sections (API specs, mobile requirements, etc.)
- References

### epics.md (Optional)

If user chooses to continue with epic breakdown:
- Epic list with goals
- Detailed story breakdown per epic
- User stories with acceptance criteria
- Dependencies and prerequisites
- Coverage mapping to FRs

## Examples

### Example 1: SaaS Project Management Tool

**Input:**
- User wants to build a project management tool for remote teams
- Focus on async communication and transparency
- Target: Small to medium tech teams

**PRD Adapts:**
- Project Type: SaaS B2B
- Includes: Multi-tenancy, permission models, subscription tiers
- Includes: Integration requirements (Slack, GitHub, etc.)
- Includes: UX principles for async workflows
- Product Magic: "Transparency by default - everyone knows project status without meetings"

**Output:**
- PRD.md with SaaS-specific sections
- Functional requirements for collaboration features
- NFRs for multi-tenant security and scale
- Integration specifications
- Clear MVP scope focused on core transparency features

### Example 2: Healthcare Mobile App

**Input:**
- User wants health tracking app for diabetes patients
- Must comply with HIPAA
- iOS and Android

**PRD Adapts:**
- Project Type: Mobile (iOS/Android)
- Domain: Healthcare (complex)
- Includes: HIPAA compliance requirements
- Includes: Medical device integration requirements
- Includes: Data privacy and security (HIPAA-specific)
- Includes: Platform-specific requirements
- Product Magic: "Makes daily tracking feel like self-care, not a chore"

**Output:**
- PRD.md with healthcare compliance sections
- Detailed privacy/security requirements
- Medical data handling specifications
- Platform-specific requirements
- Clear regulatory boundaries for MVP

### Example 3: Developer CLI Tool

**Input:**
- User wants CLI for database schema migrations
- Target: Backend developers using PostgreSQL/MySQL
- Open source project

**PRD Adapts:**
- Project Type: CLI Tool / Developer Tool
- Includes: CLI UX patterns
- Includes: Developer experience principles
- Includes: Error handling and debugging
- Skips: UI/visual design sections
- Product Magic: "Makes migrations feel safe and reversible"

**Output:**
- PRD.md focused on developer experience
- Detailed command specifications
- Error handling requirements
- Integration with existing workflows
- Clear scope for v1.0 open source release

## Notes

### Track Routing

- **Quick Flow projects** should use `/bmad:phase-2:tech-spec` instead of this workflow
- Quick Flow is for single features, bug fixes, or small atomic changes
- This workflow is for comprehensive product development

### Epic Breakdown Options

**Option A: New Session (Recommended for Complex Projects)**
- Keeps sessions focused and manageable
- Better context window management
- Clear separation of planning phases
- User runs `/bmad:phase-2:create-epics-and-stories` separately

**Option B: Continue Here**
- Good for simpler projects
- Maintains continuity
- PM agent continues into epic breakdown
- Single session for full planning

### Standalone Mode

If no workflow status file exists:
- Workflow runs without status tracking
- PRD still created successfully
- User manages next steps manually
- Consider running `/bmad:meta:workflow-init` for better tracking

### Session Management

For very complex products:
- PRD session can be extensive
- Consider breaking into multiple sessions
- Save PRD progress frequently
- Use new session for epic breakdown

## Related Workflows

- `/bmad:meta:workflow-init` - Initialize project structure (run first)
- `/bmad:phase-1:product-brief` - Quick product vision doc (optional, before PRD)
- `/bmad:phase-1:domain-research` - Research complex domains (optional, before PRD)
- `/bmad:phase-2:create-epics-and-stories` - Break PRD into epics (after PRD)
- `/bmad:phase-3:architecture` - Technical architecture (after PRD or epics)
- `/bmad:workflow-status` - Check project status (anytime)

## Troubleshooting

**"Quick Flow Track - Redirecting"**
- Your project is set to Quick Flow track
- Use `/bmad:phase-2:tech-spec` for focused technical specs
- PRD is for comprehensive product development

**"PRD already completed"**
- Workflow detects existing PRD.md
- Choose to overwrite or exit
- Consider creating PRD-v2.md manually if you want to keep both

**"No workflow status file"**
- Running in standalone mode
- PRD will still be created
- Run `/bmad:meta:workflow-init` for better project tracking

**Context window concerns**
- For very complex products, consider multiple sessions
- Product brief beforehand helps focus the PRD session
- Can do epic breakdown in separate session

**Domain complexity**
- If healthcare, finance, aerospace, etc., consider `/bmad:phase-1:domain-research` first
- PM agent will offer research options if complexity detected
- Better requirements with domain context loaded

## Success Criteria

PRD workflow succeeds when:
- [ ] PRD.md created with comprehensive requirements
- [ ] All critical validation items pass
- [ ] Product magic clearly articulated
- [ ] Requirements traceable and testable
- [ ] Appropriate detail for project type and domain
- [ ] Clear next steps provided to user
- [ ] Workflow status updated (if not standalone)

**Next phase:** Architecture or Epic Breakdown, depending on user choice and project needs.
