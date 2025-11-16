---
description: Assemble comprehensive Story Context XML with acceptance criteria, code references, and testing guidance
---

# Story Context

Generates a dynamic Story Context file for a drafted story by gathering acceptance criteria, tasks, relevant documentation, existing code references, interfaces, constraints, and testing guidance.

## What This Does

This workflow creates a **Story Context XML file** that serves as the single source of truth for story implementation. The context file prevents hallucinations by grounding the Developer agent in:

- User story details (as a / I want / so that)
- Acceptance criteria (authoritative)
- Tasks and subtasks
- Relevant documentation artifacts
- Existing code and interfaces to reuse
- Dependencies and frameworks
- Development constraints and patterns
- Testing standards and ideas

**Key Principle:** Story Context is **anti-hallucination insurance**. It provides complete, grounded context so the Developer agent never invents code that conflicts with existing patterns or requirements.

## Prerequisites

Before running this workflow:

- [ ] BMAD plugin installed in Claude Code
- [ ] Project initialized (`/bmad:meta:workflow-init`)
- [ ] Stories created and drafted (`/bmad:phase-4:create-story`)
- [ ] Sprint status tracking active

**Required files:**
- `.bmad/config.yaml` - Project configuration
- `.bmad/sprint-artifacts/sprint-status.yaml` - Story tracking
- `.bmad/sprint-artifacts/stories/{story-key}.md` - Drafted story file
- Project documentation (PRD, Architecture, Tech Specs, etc.)
- Existing codebase (for code reference discovery)

**Story must have status "drafted"** to generate context.

## How It Works

### Context Assembly Process

**Step 1: Story Discovery**
- Find first story with status "drafted" in sprint-status.yaml
- OR use user-provided story path
- Read complete story file and parse sections

**Step 2: Documentation Gathering**
- Scan docs for items relevant to story domain
- Search keywords from story title, ACs, tasks
- Prefer authoritative sources: PRD, Tech Spec, Architecture, UX Design
- Extract relevant sections and snippets

**Step 3: Code Analysis**
- Search codebase for related modules, files, symbols
- Identify existing interfaces/APIs to reuse
- Extract development constraints from Dev Notes and architecture
- Find relevant test files

**Step 4: Dependencies Discovery**
- Detect dependency manifests (package.json, pyproject.toml, go.mod, etc.)
- Extract frameworks and libraries in use
- Note version constraints

**Step 5: Testing Standards**
- Extract testing standards from architecture and existing tests
- Identify test frameworks and patterns
- Map test ideas to acceptance criteria

**Step 6: XML Generation**
- Generate structured Story Context XML
- All paths are project-relative (not absolute)
- Validate against checklist
- Save to `.bmad/sprint-artifacts/stories/{story-key}.context.xml`

**Step 7: Status Update**
- Update story file: Status → "ready-for-dev"
- Update sprint-status.yaml: drafted → ready-for-dev
- Add context reference to Dev Agent Record

### Output Format (XML)

The context file follows this structure:

```xml
<story-context v="1.0">
  <metadata>
    <epicId>1</epicId>
    <storyId>2</storyId>
    <title>User Story Title</title>
    <status>ready-for-dev</status>
    <generatedAt>2025-01-13</generatedAt>
    <sourceStoryPath>stories/1-2-story.md</sourceStoryPath>
  </metadata>

  <story>
    <asA>user role</asA>
    <iWant>capability</iWant>
    <soThat>benefit</soThat>
    <tasks>
      <task>Task 1</task>
      <task>Task 2</task>
    </tasks>
  </story>

  <acceptanceCriteria>
    <criterion id="1">AC text</criterion>
    <criterion id="2">AC text</criterion>
  </acceptanceCriteria>

  <artifacts>
    <docs>
      <doc path="docs/prd.md" title="PRD" section="Authentication" snippet="..." />
    </docs>
    <code>
      <file path="src/auth/service.ts" kind="service" symbol="AuthService" lines="45-67" reason="Existing auth implementation to extend" />
    </code>
    <dependencies>
      <node>
        <package name="bcrypt" version="^5.1.0" />
      </node>
    </dependencies>
  </artifacts>

  <constraints>
    <constraint>Use existing AuthService pattern</constraint>
    <constraint>Follow REST API conventions in architecture</constraint>
  </constraints>

  <interfaces>
    <interface name="AuthAPI" kind="REST" signature="POST /auth/login" path="src/auth/routes.ts" />
  </interfaces>

  <tests>
    <standards>Jest for unit tests, Playwright for e2e</standards>
    <locations>src/**/*.test.ts</locations>
    <ideas>
      <idea ac="1">Test login with valid credentials</idea>
      <idea ac="2">Test login with invalid credentials</idea>
    </ideas>
  </tests>
</story-context>
```

## Instructions

### Step 1: Load Configuration

Read project configuration from `.bmad/config.yaml`:

```javascript
{
  output_folder: string,        // Where docs are stored (e.g., .bmad)
  user_name: string,            // Author name
  sprint_artifacts: string,     // Where sprint files go
  story_path: string,           // Stories directory
  bmad_folder: string           // BMAD install location
}
```

### Step 2: Find Drafted Story

**Read sprint status file:**

Look for: `.bmad/sprint-artifacts/sprint-status.yaml` OR `.bmad/sprint-status.yaml`

**Find first drafted story:**

```yaml
development_status:
  epic-1:
    status: contexted
  1-1-user-registration:
    status: ready-for-dev
  1-2-user-authentication:
    status: drafted  # ← Target this one
  1-3-password-reset:
    status: backlog
```

**Rules:**
- Read ALL lines from beginning to end (preserve order)
- Find FIRST story where:
  - Key matches pattern: `{epic}-{story}-{name}` (e.g., "1-2-user-auth")
  - NOT an epic key (epic-X) or retrospective
  - Status value equals "drafted"

**If no drafted stories found:**
```
📋 No drafted stories found in sprint-status.yaml

All stories are either still in backlog or already marked ready/in-progress/done.

**Next Steps:**
1. Run /bmad:phase-4:create-story to draft more stories
2. Run /bmad:phase-4:sprint-planning to refresh story tracking
```
→ HALT

**If story found:**
- Store story_key (e.g., "1-2-user-authentication")
- Find matching story file: `.bmad/sprint-artifacts/stories/{story_key}.md`
- Read COMPLETE story file

### Step 3: Parse Story File

Extract from story markdown file:

**Metadata:**
- Epic ID (e.g., 1)
- Story ID (e.g., 2)
- Story Title
- Current Status (should be "drafted")

**User Story:**
```markdown
## Story

As a [role]
I want [capability]
So that [benefit]
```

Extract:
- `as_a`: role
- `i_want`: capability
- `so_that`: benefit

**Acceptance Criteria:**
```markdown
## Acceptance Criteria

- [ ] AC1: Description
- [ ] AC2: Description
```

Extract all AC items (maintain exact wording, no invention)

**Tasks:**
```markdown
## Tasks

- [ ] Task 1
  - [ ] Subtask 1.1
  - [ ] Subtask 1.2
- [ ] Task 2
```

Extract all tasks and subtasks

### Step 4: Check for Existing Context File

**Context file path:**
`.bmad/sprint-artifacts/stories/{story_key}.context.xml`

**If file exists:**
```
⚠️ Context file already exists: {context_file}

**What would you like to do?**
1. Replace - Generate new context file (overwrites existing)
2. Verify - Validate existing context file
3. Cancel - Exit without changes
```

Use **AskUserQuestion** tool:
```yaml
questions:
  - question: "Context file already exists. What would you like to do?"
    header: "Action"
    multiSelect: false
    options:
      - label: "Replace"
        description: "Generate new context file (overwrites existing)"
      - label: "Verify"
        description: "Validate existing context file against checklist"
      - label: "Cancel"
        description: "Exit without changes"
```

**If user chooses "Verify":**
- Jump to validation step
- Check existing context against checklist
- Report validation results
- End workflow

**If user chooses "Cancel":**
- Output: "Context generation cancelled"
- HALT

**If user chooses "Replace":**
- Continue to generate new context file

### Step 5: Collect Relevant Documentation

**Document discovery strategy:**

Scan documentation for items relevant to story domain using keywords from:
- Story title
- Acceptance criteria
- Tasks

**Authoritative sources (priority order):**
1. **Tech Spec** (Level 0-1 projects) - Comprehensive technical context
2. **PRD** (Level 2+ projects) - Product requirements
3. **Architecture** - System design and patterns
4. **UX Design** - UI/UX specifications (if applicable)
5. **Testing standards** - Quality requirements
6. **Module-specific docs** - Domain documentation

**Search locations:**
- `.bmad/` folder
- `docs/` folder
- `src/` module documentation
- `README.md` files

**For each relevant document:**
- Extract title, section name
- Pull brief snippet (2-3 sentences max, NO invention)
- Convert path to **project-relative** (strip absolute path prefix)
- Store as: `{path, title, section, snippet}`

**Aim for 5-15 relevant documents** (not too few, not too many)

**Example:**
```xml
<docs>
  <doc
    path="docs/architecture.md"
    title="System Architecture"
    section="Authentication Layer"
    snippet="Authentication uses JWT tokens with refresh token rotation. Access tokens expire after 15 minutes." />
  <doc
    path="docs/prd.md"
    title="Product Requirements"
    section="User Authentication"
    snippet="Users must be able to log in with email and password. Password must meet complexity requirements." />
</docs>
```

### Step 6: Analyze Existing Code

**Code discovery strategy:**

Search source tree for modules, files, and symbols matching:
- Story intent keywords
- AC keywords
- Task keywords

**Look for:**
- Controllers
- Services
- Components
- Utilities
- Tests
- Models/Schemas
- API routes
- Database migrations

**Identify existing interfaces/APIs to reuse:**
- REST endpoints
- GraphQL resolvers
- Function signatures
- Class interfaces
- Type definitions

**Extract development constraints:**
- From Dev Notes section in story
- From architecture patterns
- From existing code patterns
- Testing requirements
- Coding standards

**For all code artifacts:**
- Convert paths to **project-relative**
- Note file kind (controller, service, component, test, etc.)
- Note symbol name (function/class/interface)
- Note line range if specific (e.g., "45-67")
- Explain reason for relevance

**Example:**
```xml
<code>
  <file
    path="src/auth/auth.service.ts"
    kind="service"
    symbol="AuthService"
    lines="45-67"
    reason="Existing authentication service - extend for new login flow" />
  <file
    path="src/auth/dto/login.dto.ts"
    kind="dto"
    symbol="LoginDto"
    lines=""
    reason="Request validation for login endpoint - reuse this pattern" />
</code>

<interfaces>
  <interface
    name="AuthAPI"
    kind="REST endpoint"
    signature="POST /auth/login { email, password } => { accessToken, refreshToken }"
    path="src/auth/auth.controller.ts" />
  <interface
    name="IAuthService"
    kind="interface"
    signature="interface IAuthService { validateUser(email: string, password: string): Promise<User> }"
    path="src/auth/interfaces/auth-service.interface.ts" />
</interfaces>

<constraints>
  <constraint>Use NestJS dependency injection pattern for services</constraint>
  <constraint>All API routes must use DTOs for validation</constraint>
  <constraint>Follow repository pattern for database access</constraint>
  <constraint>Password hashing must use bcrypt with salt rounds >= 10</constraint>
  <constraint>All endpoints require unit and e2e tests</constraint>
</constraints>
```

### Step 7: Gather Dependencies and Frameworks

**Detect dependency manifests:**

Look for and parse:
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
    <package name="@nestjs/jwt" version="^10.1.0" />
    <package name="bcrypt" version="^5.1.0" />
    <package name="passport" version="^0.6.0" />
    <package name="passport-jwt" version="^4.0.1" />
  </node>
  <node-dev>
    <package name="jest" version="^29.0.0" />
    <package name="supertest" version="^6.3.0" />
  </node-dev>
</dependencies>
```

### Step 8: Testing Standards and Ideas

**Extract testing standards:**

From:
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

**Generate test ideas:**

Map each acceptance criterion to initial test ideas:
- What needs to be tested?
- Happy path tests
- Edge case tests
- Error condition tests

**Example:**
```xml
<tests>
  <standards>
    Use Jest for unit and integration tests.
    Use Supertest for API testing.
    Follow AAA pattern (Arrange-Act-Assert).
    Minimum 80% code coverage required.
    All services must have unit tests.
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
      Unit: Test AuthService.validateUser with non-existent user
      E2E: Test POST /auth/login with valid credentials returns tokens
      E2E: Test POST /auth/login with invalid credentials returns 401
    </idea>
    <idea ac="2">
      Unit: Test password complexity validation in DTO
      E2E: Test POST /auth/login rejects weak password
    </idea>
  </ideas>
</tests>
```

### Step 9: Generate Story Context XML

**Create XML file:**

File path: `.bmad/sprint-artifacts/stories/{story_key}.context.xml`

**Use this structure:**

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

### Step 10: Validate Context File

**Validation checklist:**

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

**If validation fails:**
- Report specific issues
- Fix issues
- Re-validate

### Step 11: Update Story File and Status

**Update story file:**

File: `.bmad/sprint-artifacts/stories/{story_key}.md`

**Changes:**
1. Update Status line: `Status: drafted` → `Status: ready-for-dev`
2. Add/update Dev Agent Record section:

```markdown
## Dev Agent Record

### Context Reference
- [Story Context XML]({story_key}.context.xml)

### Implementation Notes
_Will be populated during implementation_
```

**Save story file**

**Update sprint status:**

File: `.bmad/sprint-artifacts/sprint-status.yaml` OR `.bmad/sprint-status.yaml`

**Changes:**
1. Load FULL file
2. Find `development_status` key matching `{story_key}`
3. Verify current status is "drafted"
4. Update: `development_status[{story_key}] = "ready-for-dev"`
5. Save file, preserving ALL comments and structure

**If story key not found:**
```
⚠️ Story file updated, but could not update sprint-status: {story_key} not found

You may need to run /bmad:phase-4:sprint-planning to refresh tracking.
```

### Step 12: Report Completion

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

### Step 13: Auto-Continue to Story Implementation

**Purpose:** Enable seamless workflow continuation to story implementation.

**Process:**

1. **Check next workflow:**
   - Next workflow: `dev-story`
   - Developer agent will implement the story using the context we just created

2. **Check prerequisites:**
   - Story context file exists? ✓ (just created)
   - Story marked as ready-for-dev? ✓ (just updated)
   - User input needed? ✗ (dev agent works autonomously with story context)
   - Configuration exists? ✓

3. **Auto-continue decision:**

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

**Rationale:**
Story context generation exists specifically to feed the dev agent. Once context is ready, there's no reason to pause - the implementation should proceed immediately. This reduces friction and maintains workflow momentum.

## Key Principles

### 1. Anti-Hallucination Insurance

**Context prevents invention:**
- Developer agent has ALL necessary information
- No need to guess about patterns, APIs, or constraints
- Existing code is explicitly referenced
- Testing standards are clear

**Grounded in reality:**
- All information comes from actual project files
- No assumptions or inventions
- If information is missing, it's noted as "unknown"

### 2. Reuse Over Rebuild

**Identify existing code:**
- Find similar implementations
- Reference existing interfaces
- Note established patterns
- Prevent duplicate code

**Example:**
```xml
<code>
  <file path="src/auth/auth.service.ts"
        reason="Existing auth - extend this, don't rebuild" />
</code>
```

### 3. Comprehensive, Not Overwhelming

**Balance:**
- Enough context to implement confidently
- Not so much that it's noise
- 5-15 documentation references (not 50)
- Relevant code only (not entire codebase)

**Quality over quantity**

### 4. Project-Relative Paths

**Why:**
- Portability (works on any machine)
- Clarity (easier to read)
- Convention (standard practice)

**Bad:** `/Users/john/projects/myapp/src/auth.ts`
**Good:** `src/auth.ts`

### 5. XML for Structure

**Why XML:**
- Structured, parseable format
- Clear hierarchy
- Easy to validate
- Greppable for specific sections

**Developer agent can:**
- Parse acceptance criteria programmatically
- Extract constraints reliably
- Find relevant code references
- Map tests to ACs

## Examples

### Example 1: SaaS Analytics - User Authentication Story

**Context:**
- Project: T3 Stack SaaS
- Epic 1, Story 2: User Login with Email/Password
- Status: drafted
- Existing: Some auth scaffolding from T3 template

**Workflow execution:**

1. **Discovery:**
   - Finds story "1-2-user-login" with status "drafted"
   - Reads story file
   - Parses ACs: 4 criteria (valid login, invalid password, account lockout, MFA support)

2. **Documentation gathering:**
   - PRD section on authentication (snippet: "Email/password with MFA support")
   - Architecture section on auth (snippet: "NextAuth.js for authentication")
   - UX design for login form
   - Total: 6 relevant docs

3. **Code analysis:**
   - Found: `src/server/auth.ts` (NextAuth config)
   - Found: `src/pages/api/auth/[...nextauth].ts` (API route)
   - Found: `src/server/api/routers/user.ts` (user router)
   - Interfaces: tRPC procedures for user management
   - Constraints: Use NextAuth, follow tRPC patterns
   - Total: 8 code references

4. **Dependencies:**
   - next-auth: ^4.22.0
   - @prisma/client: ^5.0.0
   - bcrypt: ^5.1.0
   - zod: ^3.21.0

5. **Testing:**
   - Standards: Vitest for unit, Playwright for e2e
   - Locations: `src/**/*.test.ts`, `tests/e2e/**/*.spec.ts`
   - Ideas: 12 test scenarios mapped to 4 ACs

6. **Output:**
   - File: `.bmad/sprint-artifacts/stories/1-2-user-login.context.xml` (280 lines)
   - Story status: drafted → ready-for-dev
   - Validation: All checks passed

7. **Result:**
   ```
   ✅ Story context generated successfully!

   Story: 1.2 - User Login with Email/Password
   Context: 6 docs, 8 code refs, 4 interfaces, 12 test ideas
   Status: ready-for-dev

   Next: Run /bmad:phase-4:dev-story
   ```

### Example 2: Healthcare Portal - HIPAA Audit Logging Story

**Context:**
- Project: Healthcare Patient Portal
- Epic 5, Story 3: Comprehensive Audit Trail
- Status: drafted
- Existing: Event sourcing infrastructure

**Workflow execution:**

1. **Discovery:**
   - Finds story "5-3-audit-trail" with status "drafted"
   - Reads story file
   - Parses ACs: 8 criteria (all events logged, immutable, HIPAA compliant, exportable, searchable, etc.)

2. **Documentation gathering:**
   - PRD section on compliance
   - Architecture: Event sourcing patterns
   - Tech Spec Epic 5: Audit logging design
   - HIPAA compliance checklist
   - Security requirements
   - Total: 12 relevant docs

3. **Code analysis:**
   - Found: `src/events/event-store.service.ts` (existing event store)
   - Found: `src/audit/audit.entity.ts` (audit schema)
   - Found: `src/compliance/hipaa-validator.ts` (compliance checks)
   - Found: `src/encryption/encryption.service.ts` (encryption layer)
   - Interfaces: IEventStore, IAuditService, IComplianceValidator
   - Constraints:
     - All events must be immutable
     - Encryption at rest required (AES-256)
     - Tamper-proof hashing (SHA-256)
     - Retention: 6 years minimum
   - Total: 15 code references

4. **Dependencies:**
   - @nestjs/core: ^10.0.0
   - event-store-db: ^2.0.0
   - crypto: built-in
   - bcrypt: ^5.1.0
   - jsonwebtoken: ^9.0.0

5. **Testing:**
   - Standards: Jest for unit, comprehensive compliance tests required
   - Locations: `src/**/*.spec.ts`, `test/compliance/**/*.spec.ts`
   - Ideas: 25 test scenarios (HIPAA-focused)
   - Special: Compliance test suite must validate all HIPAA requirements

6. **Output:**
   - File: `.bmad/sprint-artifacts/stories/5-3-audit-trail.context.xml` (450 lines)
   - Story status: drafted → ready-for-dev
   - Validation: All checks passed
   - Note: Context is large due to compliance requirements

7. **Result:**
   ```
   ✅ Story context generated successfully!

   Story: 5.3 - Comprehensive Audit Trail
   Context: 12 docs, 15 code refs, 5 interfaces, 25 test ideas
   Compliance: HIPAA requirements mapped
   Status: ready-for-dev

   Next: Run /bmad:phase-4:dev-story
   ```

### Example 3: Mobile Fitness - Offline Workout Sync Story

**Context:**
- Project: React Native Expo App
- Epic 2, Story 4: Background Workout Sync
- Status: drafted
- Existing: WatermelonDB setup, basic sync engine

**Workflow execution:**

1. **Discovery:**
   - Finds story "2-4-background-sync" with status "drafted"
   - Reads story file
   - Parses ACs: 6 criteria (background sync, conflict resolution, offline-first, battery efficient, etc.)

2. **Documentation gathering:**
   - PRD section on offline capabilities
   - Architecture: Offline-first design
   - UX design: Sync indicators and conflict UI
   - Mobile performance guidelines
   - Battery optimization docs
   - Total: 8 relevant docs

3. **Code analysis:**
   - Found: `src/database/sync-engine.ts` (existing sync)
   - Found: `src/database/models/Workout.ts` (WatermelonDB model)
   - Found: `src/services/background-tasks.ts` (Expo task manager)
   - Found: `src/hooks/useSync.ts` (sync hook)
   - Interfaces: ISyncEngine, IConflictResolver, IBackgroundTask
   - Constraints:
     - Use WatermelonDB sync primitives
     - Expo TaskManager for background work
     - NetInfo for connectivity checks
     - Last-write-wins for conflicts (with user override option)
   - Total: 11 code references

4. **Dependencies:**
   - @nozbe/watermelondb: ^0.27.0
   - expo-task-manager: ^11.0.0
   - expo-background-fetch: ^11.0.0
   - @react-native-community/netinfo: ^9.0.0
   - react-query: ^3.39.0

5. **Testing:**
   - Standards: Jest for unit, Detox for e2e mobile testing
   - Locations: `src/**/*.test.ts`, `e2e/**/*.e2e.ts`
   - Ideas: 18 test scenarios (offline scenarios, conflict cases, battery impact)
   - Special: Test battery drain (must be < 5% per hour during active sync)

6. **Output:**
   - File: `.bmad/sprint-artifacts/stories/2-4-background-sync.context.xml` (380 lines)
   - Story status: drafted → ready-for-dev
   - Validation: All checks passed

7. **Result:**
   ```
   ✅ Story context generated successfully!

   Story: 2.4 - Background Workout Sync
   Context: 8 docs, 11 code refs, 3 interfaces, 18 test ideas
   Mobile: Battery optimization constraints included
   Status: ready-for-dev

   Next: Run /bmad:phase-4:dev-story
   ```

## Troubleshooting

### No drafted stories found

**Error:**
```
📋 No drafted stories found in sprint-status.yaml
```

**Cause:** All stories are either backlog, ready-for-dev, in-progress, or done.

**Solution:**
1. Run `/bmad:phase-4:create-story` to draft more stories
2. Run `/bmad:phase-4:sprint-planning` to refresh tracking

### Story file not found

**Error:**
```
⚠️ Story file not found: .bmad/sprint-artifacts/stories/{story_key}.md
```

**Cause:** Story key in sprint-status doesn't match actual file.

**Solution:**
1. Check story file naming
2. Run `/bmad:phase-4:sprint-planning` to resync
3. Verify sprint_artifacts path in config

### Story status is not "drafted"

**Error:**
```
⚠️ Story status must be 'drafted' to generate context

Current status: ready-for-dev
```

**Cause:** Trying to generate context for story that's already progressed.

**Solution:**
- If you want to regenerate, the workflow will ask if you want to replace
- If story is already in-progress or done, context should already exist

### Missing documentation

**Warning:**
```
ℹ️ No documentation found for story domain

Context will be limited to code references and dependencies.
```

**This is OK for:**
- Brownfield projects (minimal new docs)
- Small stories (obvious implementation)
- Technical debt stories

**Otherwise:**
- Verify documentation exists in `.bmad/` or `docs/`
- Check if story keywords match doc content

### No relevant code found

**Warning:**
```
ℹ️ No existing code found matching story keywords

This appears to be net-new functionality.
```

**This is OK for:**
- First story in epic (nothing exists yet)
- New features (greenfield)
- First-time tech stack usage

**Context will include:**
- Documentation
- Dependencies
- Testing standards
- Constraints from architecture

### Dependency manifest not found

**Warning:**
```
ℹ️ No dependency manifest found

Dependencies section will be empty.
```

**Check:**
- Is this a Node/Python/Go project?
- Is manifest in expected location?
- Brownfield project (dependencies already established)?

### Context file very large

**Warning:**
```
ℹ️ Context file is 800+ lines

Consider if all references are necessary.
```

**Causes:**
- Complex story with many dependencies
- Compliance-heavy (HIPAA, SOC2, etc.)
- Integration story (many interfaces)

**This is OK if:**
- All references are relevant
- Developer needs full context
- Complexity is inherent to story

**Otherwise:**
- Review code references (too many?)
- Trim documentation snippets
- Focus on most relevant items

## Related Workflows

**Before this workflow:**
1. `/bmad:meta:workflow-init` - Initialize project
2. `/bmad:phase-2:prd` OR `/bmad:phase-2:tech-spec` - Requirements
3. `/bmad:phase-3:architecture` - System design
4. `/bmad:phase-2:create-epics-and-stories` - Create epics
5. `/bmad:phase-4:create-story` - Draft individual stories
6. `/bmad:phase-4:sprint-planning` - Initialize tracking

**After this workflow:**
1. `/bmad:phase-4:dev-story` - Implement the story (uses context)
2. `/bmad:phase-4:story-context` - Generate context for next drafted story

**Parallel workflows:**
- `/bmad:phase-4:story-context` - Run for each drafted story (JIT)
- `/bmad:workflow-status` - Check current phase

## Success Criteria

A successful context file includes:

**Story Information:**
- [ ] User story (as a / I want / so that) captured
- [ ] All acceptance criteria listed (exact match to story)
- [ ] All tasks and subtasks captured

**Artifacts:**
- [ ] 5-15 relevant documentation references
- [ ] Code references with reasons and line hints
- [ ] Existing interfaces/APIs to reuse
- [ ] Dependencies from manifests

**Constraints and Standards:**
- [ ] Development constraints from architecture
- [ ] Coding patterns to follow
- [ ] Testing standards and frameworks
- [ ] Quality requirements

**Testing:**
- [ ] Test locations identified
- [ ] Test ideas mapped to each AC
- [ ] Test frameworks and tools listed

**Technical Quality:**
- [ ] All paths are project-relative
- [ ] XML structure is valid
- [ ] No invented information
- [ ] Validation checklist passed

**Status Updates:**
- [ ] Story file updated to "ready-for-dev"
- [ ] Sprint status updated to "ready-for-dev"
- [ ] Context reference added to Dev Agent Record

## Notes

- **Single source of truth:** Developer agent uses this file, not original story
- **Anti-hallucination:** All info grounded in actual project files
- **Reuse over rebuild:** Existing code explicitly referenced
- **Project-relative paths:** Portability and clarity
- **XML structure:** Parseable, structured, validated
- **JIT generation:** Run for each drafted story as needed
- **Validation required:** Checklist ensures quality
- **Status progression:** drafted → ready-for-dev

## Configuration

Reads from `.bmad/config.yaml`:

```yaml
output_folder: .bmad
user_name: "Your Name"
sprint_artifacts: .bmad/sprint-artifacts
story_path: .bmad/sprint-artifacts/stories
bmad_folder: .bmad
```

**Story files:**
- Location: `.bmad/sprint-artifacts/stories/`
- Format: `{epic}-{story}-{name}.md`
- Example: `1-2-user-authentication.md`

**Context files:**
- Location: `.bmad/sprint-artifacts/stories/`
- Format: `{epic}-{story}-{name}.context.xml`
- Example: `1-2-user-authentication.context.xml`

**Sprint status:**
- Primary: `.bmad/sprint-artifacts/sprint-status.yaml`
- Fallback: `.bmad/sprint-status.yaml`
