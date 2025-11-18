---
description: Create context-rich technical specification for Level 0-1 projects - includes stack analysis, brownfield integration, and story generation
---

# Tech-Spec Workflow

## What This Does

Creates a comprehensive technical specification for **Quick Flow (Level 0-1)** projects by:
1. Gathering all available context (docs, codebase, stack)
2. Analyzing brownfield codebases (patterns, conventions, existing modules)
3. Detecting project stack with exact versions
4. Creating focused technical specification
5. Generating epic + stories (1 story for simple changes, 2-5 stories for features)
6. Providing context-rich documentation (often eliminates need for story-context)

**Quick Flow = Tech-spec only, no PRD needed**

---

## Prerequisites

- BMAD plugin installed (`/bmad:bmm:workflows:workflow-init` run) OR standalone mode
- Configuration file at `.bmad/config.yaml`
- For brownfield: existing codebase to analyze
- For greenfield: project idea and stack preference

---

## Level 0-1 Projects (Quick Flow)

**When to use tech-spec:**
- **Level 0:** Single atomic change (bug fix, add one field, single file)
- **Level 1:** Small coherent feature (2-5 related changes, OAuth integration, profile page)

**Story count:**
- **1 story:** Simple changes (bug fix, single feature, isolated change)
- **2-5 stories:** Coherent feature set (multiple related changes)

**If > 5 stories:** Use full BMad Method instead (PRD → Architecture → Epics)

---

## How It Works

```
1. Validate workflow readiness → Check status file or run standalone
2. Comprehensive context discovery:
   - Load existing docs (product brief, research)
   - Detect project stack (exact versions)
   - Analyze brownfield codebase (patterns, conventions)
3. Define technical requirements → Create living tech-spec
4. Validate specification → Check completeness and clarity
5. Generate epic + stories → 1-5 stories with full context
6. Finalize and guide → Next steps for direct development
```

**Key behavior:**
- **Living document:** Writes to tech-spec.md continuously (not at end)
- **Context is king:** Gathers ALL available context before spec
- **Brownfield intelligence:** Detects and conforms to existing patterns
- **Stack awareness:** Exact framework versions, dependencies
- **Context-rich stories:** Often eliminates need for story-context workflow

---

## Instructions

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

---

## Key Principles

### 1. Context is King

**Gather ALL available context before generating spec:**
- Existing documentation (briefs, research)
- Project stack (exact versions)
- Brownfield analysis (patterns, conventions)
- Dependencies and frameworks

**Why:** Context-rich specs enable direct development without additional context assembly.

### 2. Living Document Approach

**Write to tech-spec.md continuously** as requirements emerge:
- Don't wait until end
- Capture decisions in real-time
- Build incrementally

**Why:** Prevents forgetting details, ensures completeness.

### 3. Brownfield Intelligence

**Detect and conform to existing patterns:**
- Code style (semicolons, quotes, indentation)
- Test patterns (naming, organization, frameworks)
- File organization (feature-based, layer-based)
- Naming conventions

**Why:** New code integrates seamlessly with existing codebase.

### 4. Definitiveness Over Ambiguity

**Always use specific, definitive language:**
- ✅ "React 18.2.0" (not "latest React")
- ✅ "src/components/UserProfile.tsx" (not "a user profile component")
- ✅ "Uses Jest with coverage threshold of 80%" (not "good test coverage")

**Never use:**
- ❌ "latest", "recent", "current"
- ❌ "maybe", "could", "probably"
- ❌ "should work", "might need"

**Why:** Developers need exact instructions, not approximations.

### 5. Stack Awareness

**Use project's actual dependencies:**
- Exact framework versions from package files
- Available testing frameworks
- Existing build/test scripts
- Installed libraries

**Why:** Ensures spec is implementable with project's actual stack.

### 6. Context-Rich Stories

**Stories reference tech-spec as primary context:**
- Comprehensive enough to skip story-context workflow
- Include brownfield analysis
- Include exact versions and patterns
- Include specific file paths

**Why:** Faster development, less context assembly overhead.

---

## Examples

### Example 1: Greenfield Single Story (Bug Fix)

**Context:**
- New React project
- 1 story needed (bug fix)
- Greenfield (no existing code)

**Execution:**

1. **Validate readiness:**
   - No status file → standalone mode
   - User selects: 1 story, greenfield

2. **Context discovery:**
   - No existing docs
   - Detect stack: package.json shows React 18.2.0, Jest 29.5.0
   - No brownfield analysis needed

3. **Stack analysis:**
   ```
   **Detected Stack:**
   - Framework: React 18.2.0
   - Testing: Jest 29.5.0, React Testing Library 14.0.0
   - Build: Vite 4.3.9
   - Project type: Web app
   ```

4. **Define requirements:**
   - User describes bug: "Email validation allows invalid emails"
   - Technical approach: Update validateEmail() function
   - Testing: Add test cases for edge cases

5. **Validate spec:**
   ```
   ✅ Validation Passed!
   - Context Gathering: Comprehensive
   - Definitiveness: All definitive
   - Brownfield Integration: N/A (greenfield)
   - Stack Alignment: Perfect
   - Implementation Readiness: ✅ Ready
   ```

6. **Generate stories:**
   - Epic: "Email Validation Fix"
   - Story 1: "Fix email validation to reject invalid formats"

7. **Result:**
   ```
   ✅ Tech-Spec Complete!

   Deliverables:
   - tech-spec.md (email validation fix spec)
   - epics.md (minimal epic)
   - story-email-validation-fix-1.md

   Next: Run dev-story to implement!
   ```

**Files created:**
- `tech-spec.md` (validation fix spec with React/Jest context)
- `epics.md` (minimal epic structure)
- `sprint_artifacts/story-email-validation-fix-1.md`

---

### Example 2: Brownfield Multiple Stories (OAuth Integration)

**Context:**
- Existing Express.js API
- 3 stories needed (OAuth integration)
- Brownfield (existing auth system)

**Execution:**

1. **Validate readiness:**
   - Status file found → workflow mode
   - Level: Quick Flow (Level 1)
   - Field type: brownfield

2. **Context discovery:**

   **Loaded documents:**
   - Product brief: "Add Google OAuth login"
   - Document-project: Brownfield codebase map

   **Stack detected:**
   ```
   Framework: Express 4.18.2
   Auth: Passport.js 0.6.0 (already installed!)
   Testing: Jest 29.5.0, Supertest 6.3.3
   Database: PostgreSQL with Sequelize ORM
   ```

   **Brownfield analysis:**
   ```
   Existing Auth System:
   - File: src/auth/LocalStrategy.js (email/password)
   - User model: src/models/User.js
   - Auth routes: src/routes/auth.js

   Code Style:
   - Semicolons: yes
   - Quotes: single
   - Indentation: 2 spaces
   - Test files: *.test.js in __tests__/

   Conventions:
   - Async/await (not callbacks)
   - Error handling: try/catch with next(error)
   - Logging: Winston logger
   ```

3. **Confirm conventions:**
   ```
   Detected conventions:
   - Code style: Semicolons, single quotes, 2 spaces
   - Test pattern: *.test.js in __tests__/
   - Auth pattern: Passport strategies

   Follow existing? Yes
   ```

4. **Define requirements:**
   - Add Google OAuth strategy
   - Integrate with existing User model
   - Add OAuth routes alongside existing auth routes
   - Maintain existing error handling patterns

5. **Validate spec:**
   ```
   ✅ Validation Passed!
   - Context Gathering: Comprehensive
   - Definitiveness: All definitive
   - Brownfield Integration: Excellent
   - Stack Alignment: Perfect
   - Implementation Readiness: ✅ Ready
   ```

6. **Generate stories:**
   - Epic: "Google OAuth Integration"
   - Story 1: "Add Google OAuth Strategy with Passport.js"
   - Story 2: "Integrate OAuth with User Model"
   - Story 3: "Add OAuth Routes and Error Handling"

7. **Result:**
   ```
   ✅ Tech-Spec Complete!

   Deliverables:
   - tech-spec.md (OAuth integration with brownfield context)
   - epics.md (detailed epic with 3 stories)
   - story-oauth-integration-1.md (Strategy)
   - story-oauth-integration-2.md (User Model)
   - story-oauth-integration-3.md (Routes)

   Tech-spec includes:
   - Existing auth system analysis
   - Passport.js 0.6.0 integration approach
   - User model extension points
   - Exact file paths and conventions

   Next: Run dev-story to implement Story 1!
   ```

**Files created:**
- `tech-spec.md` (comprehensive OAuth spec with brownfield analysis)
- `epics.md` (detailed epic)
- `sprint_artifacts/story-oauth-integration-1.md`
- `sprint_artifacts/story-oauth-integration-2.md`
- `sprint_artifacts/story-oauth-integration-3.md`

---

### Example 3: Greenfield Feature with Starter Template

**Context:**
- New Django project
- 4 stories needed (User profile feature)
- Greenfield (no code yet)

**Execution:**

1. **Validate readiness:**
   - No status file → standalone mode
   - User selects: 4 stories, greenfield

2. **Context discovery:**
   - No existing docs
   - No stack detected (empty project)

3. **Stack recommendation:**
   ```
   No existing stack detected. Let me recommend current best practices...

   **Recommended Stack:**
   - Framework: Django 5.0 (latest stable)
   - Database: PostgreSQL 16
   - Testing: pytest-django 4.7.0
   - API: Django REST Framework 3.14.0

   **Starter Template Available:**
   - cookiecutter-django
   - Includes: User auth, PostgreSQL setup, pytest, DRF, Docker
   - Setup time: ~5 minutes vs 2+ hours manual

   Would you like to use this starter?
   ```

4. **User accepts starter:**
   ```
   ✅ Using cookiecutter-django starter template

   Stack will include:
   - Django 5.0
   - PostgreSQL 16 with psycopg3
   - pytest-django for testing
   - DRF for API
   - Pre-configured Docker setup
   ```

5. **Define requirements:**
   - User profile page with avatar upload
   - Profile edit functionality
   - Public/private profile toggle
   - Profile API endpoints

6. **Validate spec:**
   ```
   ✅ Validation Passed!
   - Context Gathering: Comprehensive
   - Definitiveness: All definitive
   - Brownfield Integration: N/A (greenfield with starter)
   - Stack Alignment: Perfect
   - Implementation Readiness: ✅ Ready
   ```

7. **Generate stories:**
   - Epic: "User Profile Feature"
   - Story 1: "Create Profile Model and Database Schema"
   - Story 2: "Build Profile View and Edit Pages"
   - Story 3: "Implement Avatar Upload with Storage"
   - Story 4: "Create Profile API Endpoints"

8. **Result:**
   ```
   ✅ Tech-Spec Complete!

   Deliverables:
   - tech-spec.md (profile feature with Django 5.0/DRF context)
   - epics.md (detailed epic with 4 stories)
   - story-user-profile-1.md (Model)
   - story-user-profile-2.md (Views)
   - story-user-profile-3.md (Upload)
   - story-user-profile-4.md (API)

   Tech-spec includes:
   - cookiecutter-django starter instructions
   - Django 5.0 and DRF 3.14.0 patterns
   - PostgreSQL schema design
   - pytest-django testing approach
   - Docker setup considerations

   Next: Run sprint-planning to organize all 4 stories!
   ```

**Files created:**
- `tech-spec.md` (comprehensive profile feature spec with starter template)
- `epics.md` (detailed epic with 4 stories)
- `sprint_artifacts/story-user-profile-1.md`
- `sprint_artifacts/story-user-profile-2.md`
- `sprint_artifacts/story-user-profile-3.md`
- `sprint_artifacts/story-user-profile-4.md`

---

## Troubleshooting

### Issue: No stack detected (empty project)

**Symptoms:**
```
No dependency manifest found in project root
```

**Cause:** Greenfield project with no package files yet

**Solution:**
- Workflow will ask user for intended stack
- Or recommend starter template with modern stack
- Or suggest creating package.json/requirements.txt first

---

### Issue: Brownfield conventions unclear

**Symptoms:**
```
Multiple conflicting patterns detected in codebase
```

**Cause:** Inconsistent codebase or mixed conventions

**Solution:**
- Workflow will show detected conflicts
- Ask user which pattern to follow
- Or suggest establishing new consistent standards

---

### Issue: Stack too outdated

**Symptoms:**
```
Warning: Major dependencies >2 years old
- React 16.8.0 (released 2019, current: 18.2.0)
```

**Cause:** Brownfield project with old dependencies

**Solution:**
- Workflow will note migration complexity
- Recommend upgrade path if reasonable
- Or work with existing versions if upgrade too risky

---

### Issue: > 5 stories estimated

**Symptoms:**
```
You estimated 7 stories - too many for Quick Flow
```

**Cause:** Project complexity exceeds Level 1

**Solution:**
```
For projects requiring >5 stories, use full BMad Method:
1. Run workflow-init with Level 2+ track
2. Use prd workflow for requirements
3. Use architecture workflow for technical design
4. Use create-epics-and-stories for comprehensive breakdown

Quick Flow (tech-spec) is for 1-5 story projects only.
```

---

## Related Workflows

**Before tech-spec:**
- `/bmad:bmm:workflows:workflow-init` - Initialize project (RECOMMENDED)
- `/bmad:bmm:workflows:product-brief` - Product vision (optional, for context)
- `/bmad:bmm:workflows:document-project` - Brownfield analysis (optional, tech-spec does this)

**After tech-spec:**
- `/bmad:bmm:workflows:dev-story` - Implement stories (RECOMMENDED next step)
- `/bmad:bmm:workflows:sprint-planning` - Organize stories (optional, for multiple stories)
- `/bmad:bmm:workflows:story-context` - Additional context (optional, usually not needed)

**Alternatives:**
- `/bmad:bmm:workflows:prd` - For Level 2+ projects (>5 stories)
- `/bmad:bmm:workflows:architecture` - For complex technical design

**Navigation:**
```
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

---

## Success Criteria

✅ **Context gathered comprehensively** (docs, stack, brownfield)

✅ **Tech-spec created** with definitive language (no ambiguity)

✅ **Stack alignment** (exact versions, existing dependencies)

✅ **Brownfield integration** (patterns detected, conventions confirmed)

✅ **Epic + stories generated** (1-5 stories with full context)

✅ **Validation passed** (implementation-ready)

✅ **Clear next steps** (direct to dev-story)

---

## Configuration

Reads from `.bmad/config.yaml`:

```yaml
project_name: "project-name"
documentation_dir: "docs/bmad"
sprint_artifacts: "docs/bmad/sprint_artifacts"
user_name: "Developer"
communication_language: "English"
document_output_language: "English"
user_skill_level: "intermediate"  # expert/intermediate/beginner
```

---

## Output Files

### Created Files

**1. Tech-Spec** (`{documentation_dir}/tech-spec.md`)
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

**2. Epic** (`{documentation_dir}/epics.md`)
```markdown
# Epic: {Epic Title}

**Stories:** {story_count}

{Minimal structure if 1 story, detailed if multiple}
```

**3. Stories** (`{sprint_artifacts}/story-{epic-slug}-N.md`)
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

**Modified Files (if workflow mode):**

**4. Workflow Status** (`.bmad/bmm-workflow-status.yaml`)
```yaml
workflow_status:
  tech-spec: "{documentation_dir}/tech-spec.md"  # ← Updated
```

---

## Notes

- **Quick Flow only:** For Level 0-1 projects (1-5 stories max)
- **Context-rich:** Gathers ALL available context before spec
- **Living document:** Writes continuously (not at end)
- **Brownfield intelligence:** Detects and conforms to existing patterns
- **Stack awareness:** Uses exact versions from project
- **Definitive language:** No ambiguity ("React 18.2.0" not "latest React")
- **Context-rich stories:** Often eliminates need for story-context workflow
- **Starter template support:** Recommends modern starters for greenfield
- **Validation built-in:** Self-checks before story generation

**Typical usage:**
1. Developer has Level 0-1 project (1-5 stories)
2. Runs tech-spec workflow
3. Workflow gathers context (docs, stack, brownfield)
4. Interactive conversation defines requirements
5. Tech-spec validated and stories generated
6. Proceeds directly to dev-story (no story-context needed)

**Time:** 30-60 minutes (depending on complexity)

**For > 5 stories:** Use full BMad Method (prd → architecture → epics)
