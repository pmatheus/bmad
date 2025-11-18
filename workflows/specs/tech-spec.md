---
description: Create context-rich technical specification for Level 0-1 projects - includes stack analysis, brownfield integration, and story generation
---

# Tech-Spec Workflow

## Purpose

Creates a comprehensive technical specification for **Quick Flow (Level 0-1)** projects by gathering all available context, analyzing brownfield codebases, detecting project stacks, creating focused technical specifications, and generating epic + stories (1-5 stories) with context-rich documentation that often eliminates the need for story-context.

**Quick Flow = Tech-spec only, no PRD needed**

**When to use tech-spec:**
- **Level 0:** Single atomic change (bug fix, add one field, single file)
- **Level 1:** Small coherent feature (2-5 related changes, OAuth integration, profile page)

**Story count:**
- **1 story:** Simple changes (bug fix, single feature, isolated change)
- **2-5 stories:** Coherent feature set (multiple related changes)

**If > 5 stories:** Use full BMad Method instead (PRD → Architecture → Epics)

## Variables

All variables are read from `.bmad/config.yaml`:

- `project_name` - Name of the project
- `documentation_dir` - Directory where all documentation is stored (default: `docs/bmad`)
- `sprint_artifacts` - Directory where story files are stored (default: `docs/bmad/sprint_artifacts`)
- `user_name` - Name of the user/developer
- `communication_language` - Language for agent communication (default: `English`)
- `document_output_language` - Language for generated documents (default: `English`)
- `user_skill_level` - User's technical skill level: `expert`, `intermediate`, or `beginner`

**Runtime variables** (determined during execution):

- `standalone_mode` - Boolean indicating if running without workflow status file
- `story_count` - Number of stories to generate (1-5)
- `field_type` - Project type: `greenfield` (new) or `brownfield` (existing)
- `selected_track` - Workflow track from status file (e.g., `quick-flow-greenfield`)
- `project_stack_summary` - Comprehensive analysis of project's technology stack
- `existing_structure_summary` - Analysis of brownfield codebase structure (brownfield only)
- `existing_conventions` - Detected code style and conventions (brownfield only)

## Instructions

### Prerequisites

Before running this workflow:
- BMAD plugin installed (`/bmad:bmm:workflows:workflow-init` run) OR standalone mode
- Configuration file at `.bmad/config.yaml`
- For brownfield: existing codebase to analyze
- For greenfield: project idea and stack preference

### Key Principles

Follow these principles throughout execution:

**1. Context is King**
- Gather ALL available context before generating spec (docs, stack, brownfield analysis, dependencies)
- Context-rich specs enable direct development without additional context assembly

**2. Living Document Approach**
- Write to tech-spec.md continuously as requirements emerge (don't wait until end)
- Capture decisions in real-time and build incrementally

**3. Brownfield Intelligence**
- Detect and conform to existing patterns (code style, test patterns, file organization, naming conventions)
- New code integrates seamlessly with existing codebase

**4. Definitiveness Over Ambiguity**
- Always use specific, definitive language
- ✅ Use: "React 18.2.0", "src/components/UserProfile.tsx", "Uses Jest with coverage threshold of 80%"
- ❌ Never use: "latest", "recent", "current", "maybe", "could", "probably", "should work", "might need"

**5. Stack Awareness**
- Use project's actual dependencies (exact framework versions, available testing frameworks, existing build/test scripts, installed libraries)
- Ensures spec is implementable with project's actual stack

**6. Context-Rich Stories**
- Stories reference tech-spec as primary context
- Comprehensive enough to skip story-context workflow
- Include brownfield analysis, exact versions, patterns, and specific file paths

### Step 1: Validate Workflow Readiness

**Check for workflow status file:**

1. Check if `.bmad/bmm-workflow-status.yaml` exists

**If status file NOT found (standalone mode):**

Display:
```
No workflow status file found. Tech-spec workflow can run standalone or as part of BMM workflow path.

**Recommended:** Run `workflow-init` first for project context tracking and workflow sequencing.
**Quick Start:** Continue in standalone mode - perfect for rapid prototyping and quick changes!
```

Use AskUserQuestion to ask: "Continue in standalone mode or exit to run workflow-init?"

**If user chooses standalone:**

Set `standalone_mode = true`

Display: "Great! Let's quickly configure your project..."

Ask user for **story count:**
```yaml
questions:
  - question: "How many user stories do you think this work requires?"
    header: "Story Count"
    multiSelect: false
    options:
      - label: "1"
        description: "Single story - Bug fix, small isolated feature, single file change. Generates: tech-spec + minimal epic + 1 story"
      - label: "2"
        description: "2 stories - Small coherent feature with 2 related changes"
      - label: "3"
        description: "3 stories - Feature set with 3 related changes"
      - label: "4"
        description: "4 stories - Larger feature set"
      - label: "5"
        description: "5 stories - Complex feature set (max for Quick Flow)"
```

Capture response as `story_count` (1-5).

**Validate:** If > 5, suggest using full BMad Method instead.

Ask user for **field type:**
```yaml
questions:
  - question: "Is this a greenfield (new/empty codebase) or brownfield (existing codebase) project?"
    header: "Project Type"
    multiSelect: false
    options:
      - label: "greenfield"
        description: "Starting fresh, no existing code aside from starter templates"
      - label: "brownfield"
        description: "Adding to or modifying existing functional code or project"
```

Capture response as `field_type` (greenfield or brownfield).

Display confirmation:
```
Perfect! Running as:
- Story Count: {story_count} {story_count == 1 ? "story (minimal epic)" : "stories (detailed epic)"}
- Field Type: {field_type}
- Mode: Standalone (no status file tracking)

Let's build your tech-spec!
```

**If status file found (workflow mode):**

1. Load COMPLETE file: `.bmad/bmm-workflow-status.yaml`
2. Parse `workflow_status` section
3. Check status of "tech-spec" workflow
4. Get `selected_track` from metadata (should be quick-flow-greenfield or quick-flow-brownfield)
5. Get `field_type` from metadata
6. Find first non-completed workflow

**Validation checks:**

**If selected_track is NOT quick-flow:**
```
**Incorrect Workflow for Level {level}**
Tech-spec is for Quick Flow (Level 0-1) projects.
**Correct workflow:** `prd` (for Level 2+)

Do you want to continue anyway?
```

**If tech-spec already completed:**
```
⚠️ Tech-spec already completed: {file_path}
Re-running will overwrite the existing tech-spec. Continue? (y/n)
```

**If tech-spec not next expected workflow:**
```
⚠️ Next expected workflow: {next_workflow}. Tech-spec is out of sequence.
Continue with tech-spec anyway? (y/n)
```

Set `standalone_mode = false` if workflow mode.

### Step 2: Comprehensive Context Discovery

Welcome user and explain context gathering:
```
I'm going to gather all available context about your project before we dive into the technical spec. This includes:

- Any existing documentation (product briefs, research)
- Brownfield codebase analysis (if applicable)
- Your project's tech stack and dependencies
- Existing code patterns and structure

This ensures the tech-spec is grounded in reality and gives developers everything they need.
```

**PHASE 1: Load Existing Documents**

Search for and load documents (using fuzzy matching):

1. **Product Brief:**
   - Search: `{documentation_dir}/*brief*.md`
   - Sharded: `{documentation_dir}/*brief*/index.md`
   - If found: Load completely and extract key context

2. **Research Documents:**
   - Search: `{documentation_dir}/*research*.md`
   - Sharded: `{documentation_dir}/*research*/index.md`
   - If found: Load completely and extract insights

3. **Document-Project Output (CRITICAL for brownfield):**
   - Check: `{documentation_dir}/docs/index.md`
   - If found: This is brownfield codebase map - load ALL shards!
   - Extract: File structure, key modules, existing patterns, naming conventions

**Note on sharded documents:** If index.md found, read it to understand structure, then read ALL section files listed in index.

Create summary of what was found and ask user if there are other documents to consider:
```
**Loaded Documents:**
- {list of found documents with key insights}

**Detected:**
- Project type: {field_type}
- {any key insights from docs}

Are there any other documents or information I should consider before proceeding?
```

**PHASE 2: Intelligently Detect Project Stack**

Discover setup files in project root:

**Common dependency manifests:**
- `package.json` (Node.js/JavaScript)
- `requirements.txt`, `pyproject.toml` (Python)
- `Gemfile` (Ruby)
- `go.mod` (Go)
- `Cargo.toml` (Rust)
- `composer.json` (PHP)
- `pom.xml`, `build.gradle` (Java)
- Others as appropriate

**Extract critical information:**
1. Framework name and **EXACT version** (e.g., "React 18.2.0", "Django 4.2.1")
2. All production dependencies with specific versions
3. Dev tools and testing frameworks (Jest, pytest, ESLint, etc.)
4. Available build/test scripts
5. Project type (web app, API, CLI, library, etc.)

**Assess currency:**
- Identify if major dependencies are outdated (>2 years old)
- Use WebSearch to find current recommended versions if needed
- Note migration complexity in summary

**For Greenfield Projects:**

If `field_type == greenfield`:
1. Use WebSearch to discover current best practices and official starter templates
2. Recommend appropriate starters based on detected framework or user's intended stack
3. Present benefits conversationally: setup time saved, modern patterns, testing included

Ask user:
```yaml
questions:
  - question: "Would you like to use a starter template for faster setup?"
    header: "Starter Template"
    multiSelect: false
    options:
      - label: "Yes, use recommended starter"
        description: "Faster setup, modern patterns, testing included"
      - label: "No, start from scratch"
        description: "Full control, manual setup"
      - label: "Show me options first"
        description: "Let me see what's available"
```

Capture preference and include in implementation stack if accepted.

Store comprehensive findings as `project_stack_summary`.

**PHASE 3: Brownfield Codebase Reconnaissance**

If `field_type == brownfield` OR document-project output found:

Analyze existing project structure:

**1. Directory Structure:**
- Identify main code directories (src/, lib/, app/, components/, services/)
- Note organization patterns (feature-based, layer-based, domain-driven)
- Identify test directories and patterns

**2. Code Patterns:**
- Look for dominant patterns (class-based, functional, MVC, microservices)
- Identify naming conventions (camelCase, snake_case, PascalCase)
- Note file organization patterns

**3. Key Modules/Services:**
- Identify major modules or services already in place
- Note entry points (main.js, app.py, index.ts)
- Document important utilities or shared code

**4. Testing Patterns & Standards (CRITICAL):**
- Identify test framework (from dependency manifest)
- Note test file naming patterns (.test.js, _test.py, .spec.ts, Test.java)
- Document test organization (tests/, __tests__, spec/, test/)
- Look for test config files (jest.config.js, pytest.ini, .rspec)
- Check for coverage requirements (in CI config, test scripts)
- Identify mocking/stubbing libraries (jest.mock, unittest.mock, sinon)
- Note assertion styles (expect, assert, should)

**5. Code Style & Conventions (MUST CONFORM):**
- Check for linter config (.eslintrc, .pylintrc, rubocop.yml)
- Check for formatter config (.prettierrc, .black, .editorconfig)
- Identify code style:
  - Semicolons: yes/no (JavaScript/TypeScript)
  - Quotes: single/double
  - Indentation: spaces/tabs, size
  - Line length limits
- Import/export patterns (named vs default, organization)
- Error handling patterns (try/catch, Result types, error classes)
- Logging patterns (console, winston, logging module, specific formats)
- Documentation style (JSDoc, docstrings, YARD, JavaDoc)

Store as `existing_structure_summary`.

**CRITICAL: Confirm Conventions with User**

Display detected conventions:
```
I've detected these conventions in your codebase:

**Code Style:**
{detected_code_style}

**Test Patterns:**
{detected_test_patterns}

**File Organization:**
{detected_file_organization}

Should I follow these existing conventions for the new code?
```

Ask user:
```yaml
questions:
  - question: "Should I follow existing conventions or establish new standards?"
    header: "Code Conventions"
    multiSelect: false
    options:
      - label: "Follow existing"
        description: "Conform to detected patterns and styles"
      - label: "New standards"
        description: "Establish different conventions"
```

If user chooses "New standards":
- Ask: "What conventions would you like to use instead? (Or should I suggest modern best practices?)"
- Capture new conventions OR use WebSearch for current best practices

Store confirmed conventions as `existing_conventions`.

**Display comprehensive context summary:**
```
**Context Gathered:**

{project_stack_summary}
{existing_structure_summary if brownfield}
{existing_conventions if brownfield}

Ready to define technical requirements!
```

### Step 3: Define Technical Requirements

Start interactive technical discovery conversation with user.

**Guidance:**
- Adapt tone to `{user_skill_level}` (from config)
- Ask focused technical questions
- Build living document continuously (write as you discover)
- Reference gathered context to inform questions

**Core technical areas to explore:**

1. **Change Description:**
   - What specifically needs to be built/changed?
   - Why is this needed?
   - What problem does it solve?

2. **Technical Approach:**
   - How will this be implemented?
   - What components/modules are involved?
   - Integration points with existing code (brownfield)?

3. **Data & State:**
   - What data structures are needed?
   - Database changes required?
   - State management approach?

4. **APIs & Interfaces:**
   - New endpoints or interfaces?
   - Request/response formats?
   - Authentication/authorization?

5. **Testing Strategy:**
   - Unit tests required?
   - Integration tests?
   - Test coverage expectations?

6. **Non-Functional Requirements:**
   - Performance expectations?
   - Security considerations?
   - Accessibility requirements?

**Write to tech-spec.md continuously** as technical requirements emerge.

**Use existing context** to inform spec:
- Reference brownfield modules/patterns
- Use exact framework versions from stack analysis
- Conform to existing conventions (if applicable)
- Reference specific file paths and integration points

### Step 4: Validate Specification

Perform self-validation of tech-spec.md:

**Validation criteria:**

1. **Context Gathering:** Comprehensive / Partial / Insufficient
   - All available docs loaded?
   - Stack fully analyzed?
   - Brownfield patterns documented?

2. **Definitiveness:** All definitive / Some ambiguity / Major issues
   - Specific versions (not "latest" or "recent")?
   - Exact file paths?
   - Clear implementation steps?
   - No ambiguous language ("maybe", "could", "probably")?

3. **Brownfield Integration:** N/A / Excellent / Partial / Missing
   - Existing patterns referenced?
   - Integration points identified?
   - Conventions confirmed?

4. **Stack Alignment:** Perfect / Good / Partial / None
   - Matches detected stack?
   - Uses project's dependencies?
   - Follows project patterns?

5. **Implementation Readiness:** Yes / No
   - Developer can implement from spec alone?
   - All questions answered?
   - Clear acceptance criteria?

Generate validation report:
```
**Validation Report:**

- Context Gathering: {score}
- Definitiveness: {score}
- Brownfield Integration: {score}
- Stack Alignment: {score}
- Implementation Readiness: {score}
```

**If validation issues found:**

Display:
```
⚠️ **Validation Issues Detected:**

{list_of_issues}

I can fix these automatically. Shall I proceed?
```

Ask user to fix issues or proceed with warnings.

**If validation passes:**

Display:
```
✅ **Validation Passed!**

**Scores:**
- Context Gathering: {score}
- Definitiveness: {score}
- Brownfield Integration: {score}
- Stack Alignment: {score}
- Implementation Readiness: ✅ Ready

Tech-spec is high quality and ready for story generation!
```

### Step 5: Generate Epic and Context-Rich Stories

Delegate to bmad-pm subagent for story generation:

Use Task tool with `subagent_type: bmad-pm`:
```
Generate epic and {story_count} stories from tech-spec.

**Context:**
- Tech-spec: {documentation_dir}/tech-spec.md (comprehensive, context-rich)
- Story count: {story_count}
- Epic structure: {story_count == 1 ? "Minimal (single story)" : "Detailed"}
- Field type: {field_type}

**Instructions:**
1. Read tech-spec.md completely
2. Generate epics.md with epic structure
3. Generate {story_count} story files: story-{epic-slug}-N.md (where N = 1 to {story_count})
4. Each story should reference tech-spec.md as primary context
5. Stories should be comprehensive enough to skip story-context workflow

**Output files:**
- {documentation_dir}/epics.md
- {documentation_dir}/sprint_artifacts/story-{epic-slug}-1.md
- {documentation_dir}/sprint_artifacts/story-{epic-slug}-2.md (if story_count >= 2)
- ... through story-{epic-slug}-{story_count}.md

**Story template:** Use BDD format with Given/When/Then
**Epic template:** Vertical slice, deliverable focus
```

**Files generated:**
- `epics.md` - Epic structure (minimal for 1 story, detailed for multiple)
- `sprint_artifacts/story-{epic-slug}-N.md` - Story files (N = 1 to {story_count})

All stories reference tech-spec.md as primary context.

### Step 6: Finalize and Guide Next Steps

**Update workflow status (if not standalone):**

If `standalone_mode != true`:
1. Load COMPLETE file: `.bmad/bmm-workflow-status.yaml`
2. Find `workflow_status` key "tech-spec"
3. Update: `workflow_status["tech-spec"] = "{documentation_dir}/tech-spec.md"`
4. Save file, preserving ALL comments and structure

Display completion message:
```
**✅ Tech-Spec Complete, {user_name}!**

**Deliverables Created:**

- ✅ **tech-spec.md** - Context-rich technical specification
  - Includes: brownfield analysis, framework details, existing patterns
- ✅ **epics.md** - Epic structure {story_count == 1 ? "(minimal for single story)" : `with ${story_count} stories`}
- ✅ **story-{epic-slug}-1.md** - First story
{story_count > 1 ? `- ✅ **story-{epic-slug}-2.md** - Second story` : ""}
{story_count > 2 ? `- ✅ **story-{epic-slug}-3.md** - Third story` : ""}
{story_count > 3 ? `- ✅ **Additional stories** through story-{epic-slug}-${story_count}.md` : ""}

**What Makes This Tech-Spec Special:**

The tech-spec is comprehensive enough to serve as the primary context document:
- ✨ Brownfield codebase analysis (if applicable)
- ✨ Exact framework and library versions from your project
- ✨ Existing patterns and code references
- ✨ Specific file paths and integration points
- ✨ Complete developer resources

**Next Steps:**

**🎯 Recommended Path - Direct to Development:**

Since the tech-spec is CONTEXT-RICH, you can often skip story-context generation!

{story_count == 1 ? `
**For Your Single Story:**

1. Run \`dev-story\` workflow
   - Select story-{epic-slug}-1.md
   - Tech-spec provides all the context needed!

💡 **Optional:** Only run \`story-context\` if this is unusually complex
` : `
**For Your ${story_count} Stories - Iterative Approach:**

1. **Start with Story 1:**
   - Run \`dev-story\` workflow
   - Select story-{epic-slug}-1.md
   - Tech-spec provides context

2. **After Story 1 Complete:**
   - Repeat for story-{epic-slug}-2.md
   - Continue through story ${story_count}

💡 **Alternative:** Use \`sprint-planning\` to organize all stories as a coordinated sprint

💡 **Optional:** Run \`story-context\` for complex stories needing additional context
`}

**Your Tech-Spec:**
- 📄 Saved to: \`{documentation_dir}/tech-spec.md\`
- Epic & Stories: \`{documentation_dir}/epics.md\` + \`{sprint_artifacts}/\`
- Contains: All context, decisions, patterns, and implementation guidance
- Ready for: Direct development!

The tech-spec is your single source of truth! 🚀
```

### Troubleshooting

**Issue: No stack detected (empty project)**

Symptoms:
```
No dependency manifest found in project root
```

Cause: Greenfield project with no package files yet

Solution:
- Workflow will ask user for intended stack
- Or recommend starter template with modern stack
- Or suggest creating package.json/requirements.txt first

---

**Issue: Brownfield conventions unclear**

Symptoms:
```
Multiple conflicting patterns detected in codebase
```

Cause: Inconsistent codebase or mixed conventions

Solution:
- Workflow will show detected conflicts
- Ask user which pattern to follow
- Or suggest establishing new consistent standards

---

**Issue: Stack too outdated**

Symptoms:
```
Warning: Major dependencies >2 years old
- React 16.8.0 (released 2019, current: 18.2.0)
```

Cause: Brownfield project with old dependencies

Solution:
- Workflow will note migration complexity
- Recommend upgrade path if reasonable
- Or work with existing versions if upgrade too risky

---

**Issue: > 5 stories estimated**

Symptoms:
```
You estimated 7 stories - too many for Quick Flow
```

Cause: Project complexity exceeds Level 1

Solution:
```
For projects requiring >5 stories, use full BMad Method:
1. Run workflow-init with Level 2+ track
2. Use prd workflow for requirements
3. Use architecture workflow for technical design
4. Use create-epics-and-stories for comprehensive breakdown

Quick Flow (tech-spec) is for 1-5 story projects only.
```

## Workflow

The tech-spec workflow follows this execution sequence:

```
1. Validate workflow readiness
   ├─ Check for status file (.bmad/bmm-workflow-status.yaml)
   ├─ If NOT found: Enter standalone mode
   │  ├─ Display standalone mode message
   │  ├─ Ask: Continue standalone or exit?
   │  └─ If continue: Ask story count (1-5) and field type (greenfield/brownfield)
   └─ If found: Enter workflow mode
      ├─ Load and parse status file
      ├─ Validate selected_track is quick-flow
      ├─ Check if tech-spec already completed
      └─ Verify workflow sequence

2. Comprehensive context discovery
   ├─ PHASE 1: Load existing documents
   │  ├─ Search for product brief
   │  ├─ Search for research documents
   │  ├─ Load document-project output (brownfield map)
   │  └─ Ask user about additional documents
   ├─ PHASE 2: Intelligently detect project stack
   │  ├─ Discover dependency manifests in project root
   │  ├─ Extract framework versions and dependencies
   │  ├─ Assess currency (identify outdated dependencies)
   │  └─ For greenfield: Recommend starter templates
   └─ PHASE 3: Brownfield codebase reconnaissance (if brownfield)
      ├─ Analyze directory structure
      ├─ Identify code patterns
      ├─ Document key modules/services
      ├─ Detect testing patterns and standards
      ├─ Identify code style and conventions
      └─ Confirm conventions with user

3. Define technical requirements
   ├─ Start interactive discovery conversation
   ├─ Explore core technical areas:
   │  ├─ Change description
   │  ├─ Technical approach
   │  ├─ Data & state
   │  ├─ APIs & interfaces
   │  ├─ Testing strategy
   │  └─ Non-functional requirements
   └─ Write to tech-spec.md continuously (living document)

4. Validate specification
   ├─ Check context gathering (comprehensive/partial/insufficient)
   ├─ Check definitiveness (all definitive/some ambiguity/major issues)
   ├─ Check brownfield integration (excellent/partial/missing/N/A)
   ├─ Check stack alignment (perfect/good/partial/none)
   ├─ Check implementation readiness (yes/no)
   ├─ Generate validation report
   └─ If issues found: Ask to fix or proceed with warnings

5. Generate epic and context-rich stories
   ├─ Delegate to bmad-pm subagent
   ├─ Generate epics.md (minimal if 1 story, detailed if multiple)
   ├─ Generate story files: story-{epic-slug}-N.md (N = 1 to story_count)
   └─ Stories reference tech-spec.md as primary context

6. Finalize and guide next steps
   ├─ If not standalone: Update workflow status file
   ├─ Display completion message with deliverables
   ├─ Explain what makes this tech-spec special
   └─ Provide clear next steps (direct to dev-story)
```

**Key workflow behaviors:**

- **Living document:** Writes to tech-spec.md continuously (not at end)
- **Context first:** Gathers ALL available context before spec generation
- **Brownfield intelligence:** Detects and conforms to existing patterns
- **Stack awareness:** Uses exact framework versions and dependencies
- **Context-rich stories:** Often eliminates need for story-context workflow
- **Validation built-in:** Self-checks before story generation

**Decision points:**

1. **Standalone vs workflow mode:** Determined by presence of status file
2. **Story count:** User selects 1-5 stories (>5 requires full BMad Method)
3. **Field type:** User selects greenfield or brownfield
4. **Starter template:** For greenfield, user decides if using starter
5. **Conventions:** For brownfield, user confirms following existing or new standards
6. **Validation issues:** User decides to fix or proceed with warnings

## Report

At the conclusion of the tech-spec workflow, report to the user using this structure:

### Success Report

Display completion message:

```
**✅ Tech-Spec Complete, {user_name}!**

**Deliverables Created:**

- ✅ **tech-spec.md** - Context-rich technical specification
  - Location: `{documentation_dir}/tech-spec.md`
  - Includes: brownfield analysis, framework details, existing patterns

- ✅ **epics.md** - Epic structure {story_count == 1 ? "(minimal for single story)" : `with ${story_count} stories`}
  - Location: `{documentation_dir}/epics.md`

- ✅ **Story Files** - {story_count} user {story_count == 1 ? "story" : "stories"}
  - Location: `{sprint_artifacts}/story-{epic-slug}-N.md` (N = 1 to {story_count})
  - Primary context reference: tech-spec.md
```

### Quality Summary

Highlight what makes this tech-spec special:

```
**What Makes This Tech-Spec Special:**

The tech-spec is comprehensive enough to serve as the primary context document:
- ✨ {brownfield ? "Brownfield codebase analysis with existing patterns" : "Greenfield starter template recommendations"}
- ✨ Exact framework and library versions from your project
- ✨ {brownfield ? "Existing code references and integration points" : "Modern best practices and setup guidance"}
- ✨ Specific file paths and implementation details
- ✨ Complete developer resources and testing strategy
```

### Validation Scores

Report the validation results:

```
**Validation Scores:**
- Context Gathering: {score}
- Definitiveness: {score}
- Brownfield Integration: {score}
- Stack Alignment: {score}
- Implementation Readiness: ✅ Ready
```

### Next Steps Guidance

Provide clear next steps based on story count:

**For single story (story_count == 1):**
```
**Next Steps:**

**🎯 Recommended Path - Direct to Development:**

Since the tech-spec is CONTEXT-RICH, you can skip story-context generation!

**For Your Single Story:**

1. Run `dev-story` workflow
   - Select story-{epic-slug}-1.md
   - Tech-spec provides all the context needed!

💡 **Optional:** Only run `story-context` if this is unusually complex
```

**For multiple stories (story_count > 1):**
```
**Next Steps:**

**🎯 Recommended Path - Direct to Development:**

Since the tech-spec is CONTEXT-RICH, you can skip story-context generation!

**For Your {story_count} Stories - Iterative Approach:**

1. **Start with Story 1:**
   - Run `dev-story` workflow
   - Select story-{epic-slug}-1.md
   - Tech-spec provides context

2. **After Story 1 Complete:**
   - Repeat for story-{epic-slug}-2.md
   - Continue through story {story_count}

💡 **Alternative:** Use `sprint-planning` to organize all stories as a coordinated sprint

💡 **Optional:** Run `story-context` for complex stories needing additional context
```

### File Locations

Summarize where all artifacts were saved:

```
**Your Tech-Spec Files:**

- 📄 Tech-Spec: `{documentation_dir}/tech-spec.md`
- 📄 Epic: `{documentation_dir}/epics.md`
- 📄 Stories: `{sprint_artifacts}/story-{epic-slug}-N.md` (N = 1 to {story_count})

**Contains:**
- All context, decisions, patterns, and implementation guidance
- Ready for direct development!

The tech-spec is your single source of truth! 🚀
```

### Success Criteria Checklist

At the end of the report, confirm all success criteria were met:

```
**Success Criteria:**

✅ Context gathered comprehensively (docs, stack, brownfield)
✅ Tech-spec created with definitive language (no ambiguity)
✅ Stack alignment (exact versions, existing dependencies)
✅ {brownfield ? "Brownfield integration (patterns detected, conventions confirmed)" : "Greenfield setup (starter templates recommended)"}
✅ Epic + stories generated ({story_count} {story_count == 1 ? "story" : "stories"} with full context)
✅ Validation passed (implementation-ready)
✅ Clear next steps (direct to dev-story)
```

### Related Workflows Reference

Provide navigation guidance for related workflows:

```
**Related Workflows:**

**Before tech-spec:**
- `workflow-init` - Initialize project (recommended)
- `product-brief` - Product vision (optional, for context)
- `document-project` - Brownfield analysis (optional, tech-spec does this)

**After tech-spec:**
- `dev-story` - Implement stories (recommended next step)
- `sprint-planning` - Organize stories (optional, for multiple stories)
- `story-context` - Additional context (optional, usually not needed)

**Alternatives:**
- `prd` - For Level 2+ projects (>5 stories)
- `architecture` - For complex technical design

**Navigation:**
Quick Flow (Level 0-1):
  workflow-init (Level 0-1 track)
    ↓
  tech-spec (you are here)
    ↓
  dev-story (direct implementation)

Full BMad Method (Level 2+):
  workflow-init (Level 2+ track)
    ↓
  prd → architecture → create-epics-and-stories
    ↓
  dev-story
```

### Output File Structure

Document the structure of generated files:

**Tech-Spec** (`{documentation_dir}/tech-spec.md`):
```markdown
# Technical Specification: {Change Title}

## Context
{Brownfield analysis, stack details, existing patterns}

## Requirements
{Detailed technical requirements}

## Implementation Approach
{How to build this}

## Testing Strategy
{Test requirements}

## Acceptance Criteria
{Definitive success criteria}
```

**Epic** (`{documentation_dir}/epics.md`):
```markdown
# Epic: {Epic Title}

**Stories:** {story_count}

{Minimal structure if 1 story, detailed if multiple}
```

**Stories** (`{sprint_artifacts}/story-{epic-slug}-N.md`):
```markdown
# Story {N}: {Story Title}

**Status:** backlog
**Epic:** {Epic Title}

## Story
{BDD format with Given/When/Then}

## Context Reference
Primary: tech-spec.md (comprehensive context)

## Acceptance Criteria
{Specific, testable criteria}
```

**Workflow Status** (`.bmad/bmm-workflow-status.yaml`) - if workflow mode:
```yaml
workflow_status:
  tech-spec: "{documentation_dir}/tech-spec.md"  # ← Updated
```

### Execution Summary

Provide a summary of what was accomplished:

```
**Execution Summary:**

- **Mode:** {standalone_mode ? "Standalone" : "Workflow"}
- **Story Count:** {story_count}
- **Field Type:** {field_type}
- **Starter Template:** {starter_template_used ? "Yes - " + template_name : "No"}
- **Documents Loaded:** {count} documents
- **Stack Detected:** {framework_name} {framework_version}
- **Brownfield Analysis:** {brownfield ? "Complete" : "N/A"}
- **Validation:** ✅ Passed
- **Time:** Approximately {estimated_time} minutes

**Typical usage time:** 30-60 minutes (depending on complexity)
```

### Notes for User

Include important notes about the tech-spec:

```
**Important Notes:**

- **Quick Flow only:** For Level 0-1 projects (1-5 stories max)
- **Context-rich:** Tech-spec serves as primary context document
- **Living document:** Built continuously during discovery
- **Brownfield intelligence:** Conforms to existing patterns
- **Stack awareness:** Uses exact versions from your project
- **Definitive language:** No ambiguity (e.g., "React 18.2.0" not "latest React")
- **Direct to development:** Often eliminates need for story-context workflow

**For > 5 stories:** Use full BMad Method (prd → architecture → epics)
```
