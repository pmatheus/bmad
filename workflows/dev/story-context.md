---
description: Assemble comprehensive Story Context XML with acceptance criteria, code references, and testing guidance
---

# Story Context

## Purpose

Creates a Story Context XML file that serves as the single source of truth for story implementation. The context file prevents hallucinations by grounding the Developer agent in complete, structured information.

**Key Principle:** Story Context is anti-hallucination insurance. It provides complete, grounded context so the Developer agent never invents code that conflicts with existing patterns or requirements.

**What this workflow does:**
- Finds the first story with status "drafted"
- Gathers relevant documentation (5-15 references)
- Analyzes existing code for reuse opportunities
- Extracts dependencies and frameworks
- Generates testing ideas mapped to acceptance criteria
- Creates a structured `.context.xml` file
- Updates story status from "drafted" to "ready-for-dev"
- Auto-continues to dev-story workflow

## Variables

The following variables are used throughout this workflow:

| Variable | Description | Source | Example |
|----------|-------------|--------|---------|
| `{sprint_artifacts}` | Path to sprint artifacts directory | Configuration file `.bmad/config.yaml` | `.bmad/sprints/sprint-001` |
| `{epic_id}` | Epic identifier | Story file metadata | `E001` |
| `{story_id}` | Story identifier | Story file metadata | `S001` |
| `{story_key}` | Combined epic-story-name key | Sprint status YAML | `E001-S001-user-authentication` |
| `{story_title}` | Human-readable story title | Story file | `User Authentication` |
| `{context_file}` | Path to generated context XML | Derived from story_key | `{sprint_artifacts}/stories/{story_key}.context.xml` |
| `{relative_story_path}` | Project-relative path to story | Story file location | `.bmad/sprints/sprint-001/stories/E001-S001-user-authentication.md` |
| `{as_a}` | User role from story | Story file user story section | `registered user` |
| `{i_want}` | Capability from story | Story file user story section | `to log in securely` |
| `{so_that}` | Benefit from story | Story file user story section | `my data is protected` |
| `{current_date}` | Current timestamp | System date | `2025-11-18` |

## Instructions

### Prerequisites

See [shared/prerequisites.md#phase-4-story-context](../shared/prerequisites.md)

**Workflow-specific requirements:**
- Stories created and drafted
- Sprint status tracking active
- At least one story with status "drafted"

### Step-by-Step Instructions

**1. Load Configuration and Find Story**

See [shared/common-operations.md#load-configuration](../shared/common-operations.md)

Find the first drafted story from `{sprint_artifacts}/sprint-status.yaml` where:
- Key matches pattern: `{epic}-{story}-{name}`
- NOT an epic or retrospective
- Status equals "drafted"

If no drafted stories found:
```
📋 No drafted stories found in sprint-status.yaml

Next Steps:
1. Run /bmad:phase-4:create-story to draft more stories
2. Run /bmad:phase-4:sprint-planning to refresh tracking
```
→ HALT

**2. Parse Story File**

Extract from the story markdown file:

**Metadata:**
- Epic ID
- Story ID
- Story Title
- Current Status

**User Story:**
```markdown
As a [role]
I want [capability]
So that [benefit]
```
Extract: `as_a`, `i_want`, `so_that`

**Acceptance Criteria:**
```markdown
## Acceptance Criteria
- [ ] AC1: Description
- [ ] AC2: Description
```
Extract all AC items (maintain exact wording, NO invention)

**Tasks:**
```markdown
## Tasks
- [ ] Task 1
  - [ ] Subtask 1.1
- [ ] Task 2
```
Extract all tasks and subtasks

**3. Check for Existing Context File**

Context file path: `{sprint_artifacts}/stories/{story_key}.context.xml`

If file exists, use AskUserQuestion tool:
- Option 1: Replace - Generate new context file (overwrites)
- Option 2: Verify - Validate existing context against checklist
- Option 3: Cancel - Exit without changes

If "Verify": Jump to validation step, check existing context, report results, end
If "Cancel": HALT
If "Replace": Continue to generate new context

**4. Collect Relevant Documentation**

Document discovery strategy: Scan documentation for items relevant to story domain using keywords from story title, acceptance criteria, and tasks.

**Authoritative sources (priority order):**
1. Tech Spec (Level 0-1) - Comprehensive technical context
2. PRD (Level 2+) - Product requirements
3. Architecture - System design and patterns
4. UX Design - UI/UX specifications (if applicable)
5. Testing standards - Quality requirements
6. Module-specific docs - Domain documentation

**Search locations:** `.bmad/` folder, `docs/` folder, `src/` module docs, README files

**For each relevant document:**
- Extract title, section name
- Pull brief snippet (2-3 sentences max, NO invention)
- Convert path to **project-relative** (strip absolute prefix)
- Store as: `{path, title, section, snippet}`

**Aim for 5-15 relevant documents** (not too few, not too many)

**Example:**
```xml
<docs>
  <doc path="docs/architecture.md" title="System Architecture"
       section="Authentication Layer"
       snippet="Authentication uses JWT tokens with refresh token rotation." />
</docs>
```

**5. Analyze Existing Code**

Code discovery strategy: Search source tree for modules, files, and symbols matching story intent, AC keywords, and task keywords.

**Look for:**
- Controllers, services, components, utilities
- Tests
- Models/schemas
- API routes
- Database migrations

**Identify existing interfaces/APIs to reuse:**
- REST endpoints
- GraphQL resolvers
- Function signatures
- Class interfaces
- Type definitions

**Extract development constraints from:**
- Dev Notes section in story
- Architecture patterns
- Existing code patterns
- Testing requirements
- Coding standards

**For all code artifacts:**
- Convert paths to **project-relative**
- Note file kind (controller, service, component, test)
- Note symbol name (function/class/interface)
- Note line range if specific (e.g., "45-67")
- Explain reason for relevance

**Example:**
```xml
<code>
  <file path="src/auth/auth.service.ts" kind="service"
        symbol="AuthService" lines="45-67"
        reason="Existing auth service - extend for new login flow" />
</code>

<interfaces>
  <interface name="AuthAPI" kind="REST endpoint"
             signature="POST /auth/login { email, password } => { accessToken, refreshToken }"
             path="src/auth/auth.controller.ts" />
</interfaces>

<constraints>
  <constraint>Use NestJS dependency injection pattern for services</constraint>
  <constraint>All API routes must use DTOs for validation</constraint>
  <constraint>Password hashing must use bcrypt with salt rounds >= 10</constraint>
</constraints>
```

**6. Gather Dependencies and Frameworks**

Detect dependency manifests and parse:
- **Node.js**: `package.json` (dependencies, devDependencies)
- **Python**: `pyproject.toml`, `requirements.txt`
- **Go**: `go.mod`
- **Unity**: `Packages/manifest.json`, `Assets/`, `ProjectSettings/`
- **Rust**: `Cargo.toml`
- **Other**: Note frameworks/configs found

**Extract relevant dependencies:**
- Frameworks in use
- Libraries relevant to story
- Testing libraries
- Build tools

**Example:**
```xml
<dependencies>
  <node>
    <package name="@nestjs/core" version="^10.0.0" />
    <package name="bcrypt" version="^5.1.0" />
  </node>
  <node-dev>
    <package name="jest" version="^29.0.0" />
  </node-dev>
</dependencies>
```

**7. Testing Standards and Ideas**

Extract testing standards from:
- Architecture docs
- Testing documentation
- Existing test files
- Dev Notes in story

**Capture:**
- Test frameworks (Jest, Playwright, Vitest, etc.)
- Test patterns (AAA, Given-When-Then, etc.)
- Test file locations (glob patterns)
- Coverage requirements
- Testing layers (unit, integration, e2e)

**Generate test ideas** - Map each acceptance criterion to initial test ideas:
- What needs to be tested?
- Happy path tests
- Edge case tests
- Error condition tests

**Example:**
```xml
<tests>
  <standards>
    Use Jest for unit and integration tests.
    Follow AAA pattern (Arrange-Act-Assert).
    Minimum 80% code coverage required.
    All endpoints must have e2e tests.
  </standards>

  <locations>
    <pattern>src/**/*.spec.ts</pattern>
    <pattern>test/e2e/**/*.e2e-spec.ts</pattern>
  </locations>

  <ideas>
    <idea ac="1">
      Unit: Test AuthService.validateUser with correct credentials
      Unit: Test AuthService.validateUser with incorrect password
      E2E: Test POST /auth/login with valid credentials returns tokens
    </idea>
  </ideas>
</tests>
```

**8. Generate Story Context XML**

Create XML file: `{sprint_artifacts}/stories/{story_key}.context.xml`

**Structure:**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<story-context v="1.0">
  <metadata>
    <epicId>{epic_id}</epicId>
    <storyId>{story_id}</storyId>
    <title>{story_title}</title>
    <status>ready-for-dev</status>
    <generatedAt>{current_date}</generatedAt>
    <generator>BMAD Story Context Workflow</generator>
    <sourceStoryPath>{relative_story_path}</sourceStoryPath>
  </metadata>

  <story>
    <asA>{as_a}</asA>
    <iWant>{i_want}</iWant>
    <soThat>{so_that}</soThat>
    <tasks>
      {task elements from parsed tasks}
    </tasks>
  </story>

  <acceptanceCriteria>
    {criterion elements from parsed ACs}
  </acceptanceCriteria>

  <artifacts>
    <docs>
      {doc elements from documentation scan}
    </docs>
    <code>
      {file elements from code analysis}
    </code>
    <dependencies>
      {dependency elements from manifest scan}
    </dependencies>
  </artifacts>

  <constraints>
    {constraint elements from Dev Notes and architecture}
  </constraints>

  <interfaces>
    {interface elements from code analysis}
  </interfaces>

  <tests>
    <standards>{testing standards paragraph}</standards>
    <locations>
      {pattern elements for test locations}
    </locations>
    <ideas>
      {idea elements mapping to ACs}
    </ideas>
  </tests>
</story-context>
```

**Critical:** All paths must be **project-relative**, not absolute.

**9. Validate Context File**

Validation checklist:

- [ ] Story fields (asA/iWant/soThat) captured
- [ ] Acceptance criteria list matches story draft exactly (no invention)
- [ ] Tasks/subtasks captured as task list
- [ ] Relevant docs (5-15) included with path and snippets
- [ ] Relevant code references included with reason and line hints
- [ ] Interfaces/API contracts extracted if applicable
- [ ] Constraints include applicable dev rules and patterns
- [ ] Dependencies detected from manifests and frameworks
- [ ] Testing standards and locations populated
- [ ] XML structure follows story-context template format
- [ ] All paths are project-relative (not absolute)
- [ ] No invented information (all grounded in source)

If validation fails: Report specific issues, fix issues, re-validate

**10. Update Story File and Status**

See [shared/common-operations.md#update-story-file](../shared/common-operations.md)

Update story file:
1. Update Status line: `Status: drafted` → `Status: ready-for-dev`
2. Add/update Dev Agent Record section:

```markdown
## Dev Agent Record

### Context Reference
- [Story Context XML]({story_key}.context.xml)

### Implementation Notes
_Will be populated during implementation_
```

Update sprint-status.yaml:

See [shared/common-operations.md#update-sprint-status](../shared/common-operations.md)

Update: `development_status[{story_key}] = "ready-for-dev"`

## Workflow

### Context Assembly Process Flow

1. **Story Discovery** → Find first "drafted" story from sprint status
2. **Documentation Gathering** → Scan docs for relevant content (5-15 references)
3. **Code Analysis** → Find existing code to reuse
4. **Dependencies Discovery** → Extract frameworks and libraries from manifests
5. **Testing Standards** → Map test ideas to acceptance criteria
6. **XML Generation** → Create structured context file
7. **Validation** → Verify context against quality checklist
8. **Status Update** → Mark story as "ready-for-dev" in both story file and sprint status
9. **Auto-Continue** → Immediately run dev-story workflow

### Quick Start Example

```bash
# Prerequisites: stories created and drafted
/bmad:phase-4:story-context

# Workflow will:
# 1. Find first story with status "drafted"
# 2. Gather relevant docs (5-15 references)
# 3. Analyze existing code (reuse over rebuild)
# 4. Extract dependencies and frameworks
# 5. Generate testing ideas mapped to ACs
# 6. Create .context.xml file
# 7. Update status: drafted → ready-for-dev
# 8. Auto-continue to dev-story
```

### Auto-Continue Behavior

**Purpose:** Enable seamless workflow continuation to story implementation.

**Check prerequisites:**
- Story context file exists? ✓ (just created)
- Story marked as ready-for-dev? ✓ (just updated)
- User input needed? ✗ (dev agent works autonomously with story context)
- Configuration exists? ✓

**ALWAYS auto-continue to dev-story:**

```
🚀 Auto-continuing to story implementation...

Developer agent will implement {story_key} using the generated context.
This is a continuous autonomous process.
```

**Execute next workflow:**
Use SlashCommand tool with command: `/bmad:phase-4:dev-story`

**CRITICAL:**
- DO NOT ask user permission to continue
- Story context + dev-story is designed as a continuous flow
- The dev agent works autonomously until completion or blocker
- User can review after implementation completes

**Rationale:** Story context generation exists specifically to feed the dev agent. Once context is ready, there's no reason to pause - implementation should proceed immediately. This reduces friction and maintains workflow momentum.

### Key Constraints

- **Anti-hallucination:** All information grounded in actual project files
- **Reuse over rebuild:** Existing code explicitly referenced
- **Project-relative paths:** Portability and clarity
- **Comprehensive, not overwhelming:** 5-15 docs (not 50)
- **XML structure:** Parseable, structured, validated
- **No invention:** If information missing, noted as "unknown"
- **JIT generation:** Run for each drafted story as needed

## Report

### Completion Report Format

When the workflow completes successfully, report:

```
✅ Story context generated successfully!

**Story Details:**
- Story: {epic_id}.{story_id} - {story_title}
- Story Key: {story_key}
- Context File: {context_file}
- Status: drafted → ready-for-dev

**Context Includes:**
- Documentation artifacts: {count} documents
- Code references: {count} files
- Interfaces: {count} APIs/interfaces
- Dependencies: {count} packages
- Testing ideas: {count} test scenarios
- Development constraints: {count} rules

**Next Steps:**
1. Review the context file: {context_file}
2. Run /bmad:phase-4:dev-story to implement the story
3. Generate context for more drafted stories if needed

**Quality Check:**
All validation items passed ✓
```

### Verification Report Format

When verifying an existing context file, report:

```
🔍 Context Verification Results

**Story:** {epic_id}.{story_id} - {story_title}
**Context File:** {context_file}

**Validation Results:**
✓ Story fields captured correctly
✓ Acceptance criteria match story (no invention)
✓ Tasks/subtasks complete
✓ Documentation references: {count} (target: 5-15)
✓ Code references: {count}
✓ Interfaces extracted: {count}
✓ Constraints documented: {count}
✓ Dependencies listed: {count}
✓ Testing standards present
✓ XML structure valid
✓ All paths are project-relative
✓ No invented information detected

**Overall:** {PASS/FAIL}

{If FAIL, list specific issues found}
```

### Error/Halt Report Format

When the workflow cannot proceed, report:

```
❌ Story Context Workflow Halted

**Reason:** {specific reason}

**Current State:**
- Stories scanned: {count}
- Drafted stories found: {count}
- {other relevant state information}

**Action Required:**
{Specific steps user needs to take}

**Suggested Next Steps:**
1. {Step 1}
2. {Step 2}
```

### Reporting Guidelines

- **Transparency:** Always show what was analyzed and what was found
- **Specificity:** Use exact counts, file paths, and identifiers
- **Actionability:** If there's a problem, tell user exactly what to do
- **Traceability:** Reference the context file path for review
- **Validation:** Always confirm quality check passed
- **Continuity:** Indicate auto-continue to dev-story is happening

### Notes

- **Single source of truth:** Developer agent uses this file, not original story
- **Anti-hallucination insurance:** Complete grounded context prevents invention
- **Reuse emphasis:** Existing interfaces/APIs explicitly referenced
- **Quality over quantity:** Relevant docs only (5-15 sweet spot)
- **XML for structure:** Parseable, hierarchical, greppable
- **Status progression:** drafted → ready-for-dev
- **Validation required:** Checklist ensures quality
- **Auto-continue default:** Seamless flow to implementation

**Philosophy:** Prevent hallucinations by providing complete, structured, grounded context. Emphasize reuse over rebuild. Balance comprehensive with overwhelming. Enable autonomous development through quality context.

---

**References:**
- Examples: [examples/story-context-examples.md](../examples/story-context-examples.md)
- Troubleshooting: [shared/troubleshooting.md#story-context](../shared/troubleshooting.md)
- Philosophy: [shared/design-philosophy.md#anti-hallucination](../shared/design-philosophy.md)
- Common Operations: [shared/common-operations.md](../shared/common-operations.md)
