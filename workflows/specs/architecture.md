---
description: Create system architecture through collaborative decision-making, delegating to the Architect agent
---

# Create Architecture

## What This Does

Creates a decision-focused architecture document by delegating to the **bmad-architect** subagent. The architect facilitates collaborative technical decision-making, selecting technology stacks, defining patterns, and creating clear architectural guidance that prevents AI-agent implementation conflicts.

**Philosophy:** Decision-focused architecture (not exhaustive documentation), boring technology (proven over novel), scale-appropriate design (match complexity to needs), and AI-agent consistency (prevent conflicts during implementation).

**Output:** `architecture.md` in your project's `.bmad` folder

---

## Prerequisites

- **BMAD plugin installed** - The bmad-architect subagent must be available
- **workflow-init run** - Project configured with `.bmad/config.yaml`
- **PRD created** - Product Requirements Document must exist (run `/bmad:phase-2:prd` first)
- **Epics created** (optional but recommended) - Having epics helps architect understand scope

---

## How It Works

This workflow delegates the architecture creation to the **bmad-architect** subagent, who:

1. **Loads project context** - Reads PRD, epics, UX design (if available), configuration
2. **Discovers starter templates** - Finds modern CLI starters that make good default decisions
3. **Identifies required decisions** - Analyzes requirements to determine what needs to be decided
4. **Facilitates collaborative decision-making** - Works with you to make technology and pattern choices
5. **Addresses cross-cutting concerns** - Error handling, logging, authentication, testing strategy
6. **Defines project structure** - Source tree, epic mapping, integration points
7. **Designs novel patterns** (if needed) - Creates custom architectural patterns for unique requirements
8. **Documents implementation patterns** - Clear guidance for dev agents to follow
9. **Creates architecture.md** - Comprehensive but decision-focused architecture document

**Key Principle:** The architect adapts communication style based on your skill level (beginner, intermediate, expert) for optimal collaboration.

---

## Instructions

### Step 1: Verify Prerequisites

Check that required files exist:

```bash
# Configuration must exist
cat .bmad/config.yaml

# PRD must exist
ls .bmad/PRD.md  # or .bmad/prd/index.md
```

**If PRD is missing:** Run `/bmad:phase-2:prd` first.

**If config is missing:** Run `/bmad:meta:workflow-init` first.

### Step 2: Gather Optional Context

If available, gather additional context to provide to the architect:

```bash
# Epics (optional but helpful)
ls .bmad/epics*.md

# UX design (optional)
ls .bmad/*ux*.md

# Document project analysis (brownfield projects)
ls .bmad/index.md
```

The architect can work with or without these, but they provide valuable context.

### Step 3: Load Project Configuration

Read the project configuration to get context for the architect:

```bash
# Read configuration
cat .bmad/config.yaml
```

Extract key information:
- `project_name` - Project name
- `documentation_dir` - Where files are saved (usually `.bmad`)
- `user_name` - Your name (for personalization)
- `level` - Project level (0 = Quick, 1 = BMad, 2 = Enterprise)
- `phase` - Current phase (should be "planning" or "solutioning")

### Step 4: Delegate to Architect Agent

Use the **Task tool** to delegate architecture creation to the bmad-architect subagent:

**Task Configuration:**
- **subagent_type:** `"bmad-architect"`
- **description:** `"Create system architecture from PRD"`
- **prompt:** Detailed instructions (see below)

**Delegation Prompt Template:**

```
**Project Context:**
- Project Name: {project_name from config}
- Output Folder: {documentation_dir from config}
- User Name: {user_name from config}
- Project Level: {level from config}
- Current Phase: {phase from config}
- Today's Date: {current date}

**Input Documents:**

Required:
- PRD: {path to PRD - could be .bmad/PRD.md or .bmad/prd/index.md}

Optional (include if available):
- Epics: {path to epics file(s)}
- UX Design: {path to UX design if exists}
- Document Project: {path to .bmad/index.md if brownfield project}

**Configuration:**
- User Skill Level: {user_skill_level from config or ask user: beginner/intermediate/expert}
- Communication Language: {communication_language from config or default "English"}
- Document Output Language: {document_output_language from config or default "English"}

**Your Task:**

You are facilitating collaborative architectural decision-making for this project. Your goal is to create a decision-focused architecture document that prevents AI-agent implementation conflicts.

**Process:**

1. **Load and Understand Context:**
   - Read the PRD thoroughly
   - Read epics if available
   - Read UX design if available
   - Extract functional requirements, non-functional requirements, technical constraints
   - Count epics and stories to assess scale
   - Identify complexity indicators (real-time, multi-tenant, regulated, etc.)
   - Reflect your understanding back to {user_name}

2. **Discover Starter Templates:**
   - Based on PRD analysis, identify primary technology domain (web, mobile, API, CLI, etc.)
   - Use WebSearch to find relevant starter templates (Next.js, Expo, NestJS, etc.)
   - Investigate what each starter provides by default
   - Present options to {user_name} adapted to their skill level
   - If accepted, document the initialization command and decisions provided by starter
   - Mark starter-provided decisions as "PROVIDED BY STARTER" in your tracking

3. **Adapt Facilitation Style:**
   - Expert mode: Technical terminology, move quickly, focus on edge cases
   - Intermediate mode: Balance technical accuracy with clarity, explain complex patterns briefly
   - Beginner mode: Use analogies, explain concepts simply, protect from complexity overload

4. **Identify Required Decisions:**
   - Analyze PRD against common architectural patterns
   - Create priority list: CRITICAL (blocks everything), IMPORTANT (shapes architecture), NICE-TO-HAVE (can defer)
   - Exclude decisions already made by starter template
   - Announce decision plan to {user_name}

5. **Facilitate Collaborative Decision-Making:**
   - For each decision in priority order:
     - Present the decision adapted to {user_name}'s skill level
     - If involving specific technology, verify current stable version using WebSearch
     - Ask {user_name} for their preference
     - Provide deeper explanation if requested
     - Record decision: category, choice, version, affected epics, rationale
     - Check for cascading implications

6. **Address Cross-Cutting Concerns:**
   - Error handling strategy (how will all agents handle errors?)
   - Logging approach (structured? format? levels?)
   - Date/time handling (timezone? format? library?)
   - Authentication pattern (where? how? token format?)
   - API response format (structure? status codes? errors?)
   - Testing strategy (unit? integration? E2E?)
   - For beginners, explain why these matter and why we decide them now

7. **Define Project Structure:**
   - Create comprehensive source tree (root config, source organization, tests, build, docs)
   - Map epics to architectural boundaries
   - Define integration points (component communication, API boundaries, service interactions)

8. **Design Novel Patterns (if needed):**
   - Scan PRD for concepts without standard solutions
   - For each novel pattern: name it, explain the problem, design the solution, show implementation sketch, map to affected epics
   - Use collaborative brainstorming if complex

9. **Document Implementation Patterns:**
   - Code organization patterns
   - Naming conventions
   - Error handling approaches
   - Logging strategies
   - Testing patterns
   - Security practices
   - Performance considerations

10. **Create Architecture Document:**
    - Write to: {documentation_dir}/architecture.md
    - Include: Executive summary, project initialization command (if using starter), decision summary table, project structure, epic-to-architecture mapping, technology stack details, implementation patterns, consistency rules, novel pattern designs (if any), ADRs (key decisions with rationale)
    - Format: Markdown, clear sections, decision-focused (not exhaustive)
    - Optimize for AI-agent consumption (clear, unambiguous, explicit)

**Architecture Document Structure:**

```markdown
# Architecture

## Executive Summary
[Brief overview of system architecture]

## Project Initialization
[Starter command if applicable, or manual setup steps]

## Decision Summary
| Category | Decision | Version | Affects Epics | Rationale |
| -------- | -------- | ------- | ------------- | --------- |
[Decision rows...]

## Project Structure
[Source tree]

## Epic to Architecture Mapping
[Which epics live where]

## Technology Stack Details
[Core technologies, integration points]

## Novel Pattern Designs
[Custom patterns if needed]

## Implementation Patterns
[Code organization, naming, error handling, logging, testing]

## Consistency Rules
[Patterns all AI agents must follow]

## Data Architecture
[Data models and relationships]

## API Contracts
[API specifications]

## Security Architecture
[Security approach]

## Performance Considerations
[Performance strategies]

## Deployment Architecture
[Deployment approach]

## Development Environment
[Prerequisites, setup commands]

## Architecture Decision Records (ADRs)
[Key decisions with rationale]
```

**Validation Checklist:**

Before completing, verify:
- [ ] All critical technology decisions documented
- [ ] Versions verified using WebSearch (not hardcoded/outdated)
- [ ] Starter template selected and command documented (or manual setup defined)
- [ ] Project structure defined with clear epic boundaries
- [ ] Cross-cutting concerns addressed (error handling, logging, auth, testing)
- [ ] Implementation patterns clearly documented
- [ ] Consistency rules defined for AI-agent compliance
- [ ] Novel patterns designed (if required by unique requirements)
- [ ] Architecture optimized for AI-agent implementation (clear, explicit, unambiguous)
- [ ] Boring technology philosophy followed (prefer proven over novel)
- [ ] Scale-appropriate design (match complexity to actual needs, not imagined future)
- [ ] Decisions focused on "WHY" (rationale) not just "WHAT" (choice)

**When complete**, report back with:
- Summary of architectural approach chosen
- Key technology decisions made
- Number of epics mapped to architecture
- Any novel patterns designed
- Path to created architecture.md
- Recommended next steps (typically: epic tech context OR create stories)
```

### Step 5: Architect Works Interactively

The bmad-architect subagent will now work collaboratively with you to:

- Understand your project requirements
- Discover and evaluate starter templates
- Make technology stack decisions together
- Address cross-cutting concerns
- Define project structure
- Design novel patterns if needed
- Create the architecture document

**This is interactive** - the architect will ask questions, present options, and collaborate with you to make the best decisions for your project.

**Your role:** Answer questions, express preferences, provide constraints or requirements not in the PRD.

### Step 6: Review Architecture Document

Once the architect completes, review the created architecture:

```bash
# Read the architecture
cat .bmad/architecture.md
```

**Check for:**
- Decision summary table is complete
- Technology versions are current (verified via WebSearch)
- Project structure makes sense for your epics
- Implementation patterns are clear
- Novel patterns address your unique requirements
- ADRs explain WHY decisions were made

**If revisions needed:** Work with the architect to refine specific sections.

### Step 7: Update Workflow Status (if using workflow tracking)

If you ran `/bmad:meta:workflow-init`, update the workflow status:

1. Read current status: `cat .bmad/bmm-workflow-status.yaml`
2. Update `create-architecture` status to `completed`
3. Update `last_updated` date
4. Save the file

**Next recommended workflow:** Either `epic-tech-context` (create detailed epic tech specs) or `create-story` (start creating implementation stories)

---

## Key Principles

### 1. Decision-Focused Architecture

Architecture documents **decisions and rationale**, not exhaustive system details:

- **Document WHY** - Why was this technology chosen? What alternatives were considered?
- **Not comprehensive** - Don't document every class and method
- **Focus on constraints** - What must developers follow? What are the boundaries?
- **Enable autonomy** - Give dev agents enough to implement wisely without micromanagement

**Why:** Decision-focused architecture stays relevant as implementation evolves. Comprehensive docs go stale quickly.

### 2. Boring Technology

Prefer proven, stable technology over cutting-edge or novel choices:

- **Default to industry standards** - Use what's widely adopted
- **Prefer established frameworks** - Long-term support, large communities
- **Avoid bleeding edge** - Don't be an early adopter without clear justification
- **Justify novelty** - If using new tech, document WHY it's necessary

**Why:** Boring tech reduces risk, improves maintainability, and makes hiring easier. Novel tech creates dependencies on scarce expertise.

### 3. Scale-Appropriate Design

Match technical complexity to **actual** project needs, not imagined future scale:

- **Solve current problems** - Don't over-engineer for "someday we might need..."
- **YAGNI** - You Aren't Gonna Need It
- **Start simple** - Add complexity when actually needed
- **Question complexity** - Does this project really need microservices? Event sourcing? GraphQL?

**Why:** Premature optimization wastes time, creates maintenance burden, and slows development. Most projects never reach scale that justifies complex architecture.

### 4. AI-Agent Consistency

Architecture must prevent implementation conflicts between AI agents:

- **Explicit over implicit** - No assumptions, state everything clearly
- **Concrete over abstract** - Not "a database" but "PostgreSQL 16"
- **Prescriptive over descriptive** - "Use Next.js API routes" not "some API layer"
- **Examples over explanation** - Show code examples of patterns

**Why:** AI agents implementing different stories need consistent architecture to create coherent systems. Vague architecture causes conflicts, inconsistent patterns, and integration nightmares.

### 5. Starter Templates Save Time

Modern CLI starters (create-next-app, create-expo-app, etc.) make excellent default architectural decisions:

- **Leverage defaults** - Starters embody community best practices
- **Document what's provided** - Track which decisions the starter made
- **Don't reinvent** - Use the starter's structure unless there's a clear reason not to
- **First story: initialization** - Running the starter command should be the first implementation story

**Why:** Starters save hours of configuration, establish good patterns, and provide tested foundations.

---

## Examples

### Example 1: SaaS Analytics Dashboard (Standard Web App)

**Context:**
- Project: TurboMetrics SaaS analytics platform
- Epics: 5 (User Management, Dashboard Builder, Data Integration, Reporting, Billing)
- Stories: 23 total
- User skill level: Intermediate
- Complexity: Standard SaaS with some real-time features

**Architecture Process:**

1. **Architect loads context:**
   ```
   "I'm reviewing your PRD for TurboMetrics. I see 5 epics with 23 stories.

    Key aspects:
    - Real-time dashboard updates (WebSocket requirement)
    - Multi-tenant SaaS (data isolation critical)
    - Third-party data integrations (OAuth, APIs)
    - Freemium billing model

    This will need careful auth, data isolation, and real-time architecture."
   ```

2. **Discovers starter template:**
   ```
   "I found create-t3-app which provides:
    - Next.js 14 (App Router)
    - TypeScript
    - Tailwind CSS
    - tRPC (type-safe APIs)
    - NextAuth.js (authentication)
    - Prisma (database ORM)

    This is perfect for a SaaS app with your requirements. Use it?"
   ```

3. **Makes collaborative decisions:**
   ```
   Database: PostgreSQL 16 (multi-tenant with row-level security)
   Real-time: Pusher (managed WebSocket service, simpler than self-hosted)
   Testing: Vitest + Playwright
   Deployment: Vercel (Next.js optimized)
   Error tracking: Sentry
   ```

4. **Addresses cross-cutting concerns:**
   ```
   - Error handling: Centralized error boundary with Sentry reporting
   - Logging: Structured JSON logs with Pino
   - Authentication: NextAuth.js with JWT sessions
   - API format: tRPC procedures (type-safe)
   - Testing: Component tests with Testing Library, E2E with Playwright
   ```

5. **Defines structure:**
   ```
   src/
   ├── app/              # Next.js App Router pages
   ├── server/
   │   ├── api/          # tRPC routers
   │   ├── auth/         # Auth config
   │   └── db/           # Prisma client
   ├── components/       # React components
   └── lib/              # Utilities
   ```

6. **Maps epics:**
   ```
   - Epic 1 (User Management): src/server/api/routers/user.ts + src/app/dashboard/users/
   - Epic 2 (Dashboard Builder): src/app/dashboard/builder/ + src/components/builder/
   - Epic 3 (Data Integration): src/server/api/routers/integrations.ts
   - Epic 4 (Reporting): src/app/dashboard/reports/ + src/lib/reporting/
   - Epic 5 (Billing): src/server/api/routers/billing.ts + Stripe webhook integration
   ```

7. **Novel pattern: Multi-tenant data isolation**
   ```markdown
   ## Novel Pattern: Row-Level Security for Multi-Tenancy

   **Problem:** Multiple customers share the database; must ensure data isolation

   **Solution:** PostgreSQL Row-Level Security policies

   **Implementation:**
   - All tables have `tenant_id` column
   - Prisma middleware injects tenant_id filter
   - RLS policies enforce at database level
   - Session contains tenant_id claim

   **Code Example:**
   [Shows Prisma middleware and RLS policy SQL]
   ```

**Output:** `architecture.md` with:
- T3 stack initialization command
- Decision table (PostgreSQL, Pusher, Vercel, etc.)
- Project structure
- Multi-tenant pattern design
- Implementation patterns for consistency
- Security architecture (auth, RLS, API security)

**Time:** ~1.5 hours of collaborative decision-making

---

### Example 2: Healthcare Patient Portal (Complex Compliance Domain)

**Context:**
- Project: MediConnect patient portal
- Epics: 6 (Patient Auth, Medical Records, Appointment Scheduling, Telehealth, Billing, Messaging)
- Stories: 31 total
- User skill level: Expert
- Complexity: HIPAA compliance, PHI handling, strict security requirements

**Architecture Process:**

1. **Architect identifies compliance requirements:**
   ```
   "HIPAA compliance detected. This changes everything:
    - PHI encryption at rest and in transit required
    - Audit logging mandatory for all PHI access
    - BAA needed for all third-party services
    - Access controls must be role-based
    - Session timeouts enforced

    Proceeding with healthcare-grade architecture."
   ```

2. **Discovers starter (but rejects it):**
   ```
   "Found create-next-app but standard starters don't include HIPAA compliance patterns.
    We'll need custom setup with:
    - Hardened Next.js config
    - HIPAA-compliant hosting (AWS with BAA)
    - Encrypted database fields
    - Comprehensive audit logging
   ```

3. **Makes compliance-driven decisions:**
   ```
   Database: PostgreSQL 15 + pgcrypto (field-level encryption)
   Hosting: AWS (HIPAA-eligible services with BAA)
   Auth: NextAuth.js + AWS Cognito (HIPAA-compliant identity provider)
   File storage: S3 with server-side encryption
   Audit: Custom audit log table + CloudWatch
   Session: Short-lived JWT (15 min), strict timeout
   ```

4. **Addresses compliance cross-cutting concerns:**
   ```
   - Error handling: Sanitized errors (no PHI in error messages), all errors logged
   - Logging: Structured audit logs for all PHI access (who, what, when, why)
   - Authentication: Multi-factor required, role-based access control
   - API format: REST with encrypted payloads for PHI endpoints
   - Testing: Automated compliance checks, PHI mock data generator
   ```

5. **Defines security-first structure:**
   ```
   src/
   ├── app/
   ├── server/
   │   ├── api/
   │   │   ├── auth/         # MFA, RBAC
   │   │   ├── audit/        # Audit logging
   │   │   └── phi/          # PHI-handling endpoints (encrypted)
   │   └── db/
   │       ├── encrypted-fields/  # Field-level encryption helpers
   │       └── audit-logger/      # Automatic PHI access logging
   └── lib/
       └── security/         # Encryption, sanitization, validation
   ```

6. **Novel pattern: Automatic PHI audit logging**
   ```markdown
   ## Novel Pattern: Transparent PHI Access Auditing

   **Problem:** HIPAA requires auditing all PHI access; manual logging error-prone

   **Solution:** Prisma middleware automatically logs PHI table access

   **Implementation:**
   - PHI tables tagged in Prisma schema
   - Middleware intercepts all queries
   - Audit log created with: user_id, action, table, record_id, timestamp, reason (from context)
   - Failures trigger alerts

   **Code Example:**
   [Shows Prisma middleware with audit logging]
   ```

**Output:** `architecture.md` with:
- Manual setup steps (no standard starter works)
- HIPAA compliance architecture decision table
- Security-first project structure
- Automatic audit logging pattern
- Encryption patterns for PHI
- Access control implementation (RBAC)
- Deployment to HIPAA-eligible AWS services

**Key Difference:** Compliance requirements drive every decision. Boring tech still applies (proven HIPAA patterns), but scale-appropriate doesn't (can't skimp on security).

**Time:** ~2 hours (more compliance discussion)

---

### Example 3: Mobile Fitness Tracker (Different Platform)

**Context:**
- Project: FitFlow fitness tracker mobile app
- Epics: 4 (User Profile, Workout Tracking, Progress Analytics, Social Features)
- Stories: 18 total
- User skill level: Beginner
- Complexity: Offline-first mobile app, device integrations (pedometer, heart rate)

**Architecture Process:**

1. **Architect explains mobile architecture:**
   ```
   "For a mobile fitness tracker, we need an app that works offline (gym has no WiFi!).

    Think of it like a notebook - you write in it even without internet, then when you
    get WiFi, it syncs your notes to the cloud.

    Your app will be similar: track workouts offline, sync when connected."
   ```

2. **Discovers mobile starter:**
   ```
   "I found create-expo-app, which is like a pre-built mobile app foundation.

    It gives you:
    - React Native (write code once, works on iPhone AND Android!)
    - TypeScript (catches errors before they happen)
    - Expo Router (navigation between screens)
    - Easy access to phone sensors (pedometer, camera, etc.)

    This is perfect for FitFlow. Should we use it? (I strongly recommend yes!)"
   ```

3. **Makes beginner-friendly decisions:**
   ```
   App Framework: Expo (managed React Native)
   Backend: Supabase (database + auth + file storage, all in one)
   Offline Storage: AsyncStorage + React Query (caches data on phone)
   Charts: Victory Native (fitness graphs and progress charts)
   Device Sensors: Expo sensors (pedometer, heart rate via phone)
   ```

4. **Explains cross-cutting concerns simply:**
   ```
   "Let's make some decisions about how the app works overall:

    - When something goes wrong: Show friendly message, log to Sentry (error tracking service)
    - Tracking user activity: Log important events (workout started, goal achieved) to help you debug
    - Dates and times: Store in UTC (universal time), show in user's local timezone
    - User login: Email + password via Supabase, or Apple/Google sign-in
    - Talking to server: GraphQL (fetches exactly the data you need, nothing extra)
    - Testing: Jest for code tests, Detox for 'robot testing' (simulates user tapping buttons)"
   ```

5. **Defines mobile structure:**
   ```
   app/
   ├── (tabs)/           # Bottom tab navigation
   │   ├── index.tsx     # Home/Dashboard
   │   ├── workouts.tsx  # Workout tracking
   │   ├── progress.tsx  # Progress analytics
   │   └── social.tsx    # Social features
   ├── workout/
   │   ├── [id].tsx      # Workout detail screen
   │   └── new.tsx       # Create workout screen
   └── profile/
       └── edit.tsx      # Edit profile screen

   lib/
   ├── api/              # Supabase client
   ├── offline/          # Offline sync logic
   └── sensors/          # Device sensor integrations
   ```

6. **Maps epics to screens:**
   ```
   - Epic 1 (User Profile): app/profile/ + lib/api/profile.ts
   - Epic 2 (Workout Tracking): app/workout/ + app/(tabs)/workouts.tsx + lib/sensors/
   - Epic 3 (Progress Analytics): app/(tabs)/progress.tsx + lib/analytics/
   - Epic 4 (Social Features): app/(tabs)/social.tsx + lib/api/social.ts
   ```

7. **Novel pattern: Offline-first workout sync**
   ```markdown
   ## Novel Pattern: Offline Workout Tracking with Background Sync

   **Problem (explained for beginners):**
   When you're at the gym, you might not have WiFi. But you want to track your workout NOW,
   not wait until you get home. Also, your phone might die mid-workout!

   **Solution:**
   Think of it like writing in a notebook, then mailing copies to your friend later.

   **How it works:**
   1. You track a workout → Saved immediately on your phone (AsyncStorage)
   2. When you get WiFi → App automatically sends workout to cloud (Supabase)
   3. If phone dies → Workout is still saved on phone, syncs next time app opens
   4. If you use different phone → Cloud has your data, downloads to new phone

   **Code Explanation:**
   [Shows React Query with offline mutation queue, explained with comments]
   ```

**Output:** `architecture.md` with:
- Expo CLI initialization command
- Mobile-optimized decision table (Expo, Supabase, AsyncStorage)
- Mobile app structure (screens and navigation)
- Offline-first architecture pattern
- Device sensor integration approach
- Simple sync logic (offline → online)
- Beginner-friendly explanations throughout

**Key Difference:** Architecture document includes educational explanations for beginners. Same technical decisions, but explained in simpler terms.

**Time:** ~1 hour (faster because mobile starters are opinionated, slower because beginner needs more explanation)

---

## Troubleshooting

### Problem: "PRD not found"

**Symptoms:** Workflow says it can't find the PRD

**Diagnosis:**
```bash
# Check for PRD
ls .bmad/PRD.md
ls .bmad/prd/index.md
ls .bmad/*prd*.md
```

**Solutions:**
1. **PRD doesn't exist:** Run `/bmad:phase-2:prd` first to create it
2. **PRD has different name:** Provide the correct path when delegating to architect
3. **PRD in different location:** Update `.bmad/config.yaml` `documentation_dir` setting

### Problem: "Config file not found"

**Symptoms:** Can't read `.bmad/config.yaml`

**Diagnosis:**
```bash
ls .bmad/config.yaml
```

**Solution:** Run `/bmad:meta:workflow-init` to create project structure and configuration

### Problem: "Architecture is too generic"

**Symptoms:** Architecture document doesn't address project-specific needs

**Diagnosis:** PRD may be too vague, or architect didn't have enough context

**Solutions:**
1. **Improve PRD specificity:** Add technical constraints, non-functional requirements, unique features
2. **Provide UX design:** If you have UX specs, make them available to the architect
3. **Provide document project analysis:** For brownfield projects, run document-project workflow first
4. **Collaborate more:** During architecture creation, provide more detail when architect asks questions

### Problem: "Architect suggests over-engineered solution"

**Symptoms:** Recommendations feel too complex for project needs (microservices for simple CRUD app, event sourcing, etc.)

**Diagnosis:** Architect may have misunderstood project scale

**Solutions:**
1. **Clarify scale in PRD:** Add explicit scale expectations (expected users, data volume, team size)
2. **Push back during collaboration:** When architect suggests complex patterns, ask "Do we really need this?"
3. **Invoke YAGNI principle:** Remind architect: "You Aren't Gonna Need It - let's start simpler"
4. **Reference boring technology:** Ask "Is there a more boring/proven/simpler approach?"

### Problem: "Decisions feel arbitrary"

**Symptoms:** Technology choices seem random or lack clear rationale

**Diagnosis:** Architect may not be documenting WHY sufficiently

**Solutions:**
1. **Request rationale:** Ask architect to explain WHY each major decision
2. **Check decision summary table:** Should include "Rationale" column
3. **Review ADRs section:** Architecture Decision Records should explain trade-offs
4. **Reference PRD requirements:** Ensure decisions trace back to actual requirements

### Problem: "Architecture conflicts with team expertise"

**Symptoms:** Recommended stack doesn't match team's skills

**Diagnosis:** Architect doesn't know about team constraints

**Solutions:**
1. **Add team context to PRD:** Document team's expertise, existing codebases, organizational constraints
2. **Mention during collaboration:** When architect asks about technology choices, mention team skills
3. **Invoke boring technology:** "Our team knows Python well - can we use that instead of learning Go?"
4. **Revise specific decisions:** Work with architect to swap technologies while keeping overall architecture

### Problem: "Can't decide between options"

**Symptoms:** Stuck choosing between equally valid technology choices

**Diagnosis:** Analysis paralysis - both options are probably fine

**Solutions:**
1. **Go with boring:** When in doubt, choose the more established/popular option
2. **Go with starter default:** If using a starter template, use what it provides
3. **Flip a coin:** Seriously. For equivalent choices, the decision itself matters less than moving forward
4. **Time-box decision:** Give yourself 5 minutes, then commit to one and move on

---

## Related Workflows

### Prerequisite Workflows

These should typically be run **before** architecture:

- **`/bmad:meta:workflow-init`** - Initialize project structure and configuration
- **`/bmad:phase-2:prd`** - Create Product Requirements Document (REQUIRED)
- **`/bmad:phase-2:create-epics-and-stories`** - Break PRD into epics (optional but recommended)
- **`/bmad/create-ux-design`** - Define UX (optional, but helpful for architectural decisions)

### Follow-Up Workflows

These should typically be run **after** architecture:

- **`/bmad:phase-4:epic-tech-context`** - Create detailed technical specs for each epic (RECOMMENDED NEXT)
- **`/bmad:phase-4:create-story`** - Create individual user story files
- **`/bmad:phase-4:sprint-planning`** - Generate sprint status tracking
- **`/bmad:phase-4:dev-story`** - Implement individual stories using architecture guidance

### Parallel/Related Workflows

These can be run alongside architecture workflow:

- **`/bmad:phase-1:document-project`** - Analyze existing codebase (brownfield projects)
- **`/bmad:phase-2:tech-spec`** - Quick tech spec for small changes (Level 0 projects)

---

## Success Criteria

Your architecture is ready when:

**Completeness:**
- [ ] All critical technology decisions documented
- [ ] Technology versions are current (verified via WebSearch)
- [ ] Project structure defined with clear boundaries
- [ ] Epics mapped to architectural components
- [ ] Cross-cutting concerns addressed (error handling, logging, auth, testing)
- [ ] Implementation patterns documented
- [ ] Consistency rules defined for AI-agent compliance

**Quality:**
- [ ] Decisions include rationale (WHY, not just WHAT)
- [ ] Architecture is decision-focused (not exhaustive documentation)
- [ ] Boring technology philosophy followed (proven over novel)
- [ ] Scale-appropriate design (matches actual needs, not imagined future)
- [ ] AI-agent optimized (clear, explicit, unambiguous)

**Practicality:**
- [ ] Starter template selected and initialization command documented (or manual setup defined)
- [ ] First implementation story is clear (usually "run starter CLI command")
- [ ] Development environment prerequisites listed
- [ ] Setup commands documented

**Traceability:**
- [ ] All decisions trace back to PRD requirements
- [ ] NFRs (non-functional requirements) addressed
- [ ] Technical constraints acknowledged
- [ ] Novel patterns designed for unique requirements

**AI-Agent Readiness:**
- [ ] Implementation patterns are prescriptive, not descriptive
- [ ] Code examples provided where helpful
- [ ] Naming conventions defined
- [ ] Error handling approach clear
- [ ] Testing strategy documented

**When all criteria met:** Architecture is complete, ready for epic tech context or story creation.

---

## Notes

### Collaboration is Key

Unlike automated workflows, architecture creation is **collaborative**. The architect asks questions, presents options, and works WITH you to make decisions. This isn't autopilot - it's pair programming your architecture.

**Your input matters:** The best architecture emerges from combining architect expertise with your product vision and constraints.

### Decision-Focused Philosophy

This workflow creates **decision-focused architecture**, not exhaustive system documentation:

- **Documents WHY** decisions were made
- **Provides constraints** for implementation
- **Enables autonomy** for dev agents
- **Stays relevant** as code evolves

Traditional comprehensive architecture docs go stale quickly. Decision-focused architecture has longer shelf life.

### Boring Technology Wins

The architect has strong bias toward **boring (proven) technology**:

- Prefer Next.js over experimental frameworks
- Prefer PostgreSQL over novel databases
- Prefer REST over GraphQL (unless clear benefit)
- Prefer managed services over self-hosted

This isn't lack of ambition - it's **reducing risk**. Novel technology creates dependencies on scarce expertise, documentation, and community support.

**Override when justified:** If your requirements clearly benefit from novel tech, the architect will discuss trade-offs.

### Scale-Appropriate Design

Most projects don't need:
- Microservices (monolith is fine)
- Event sourcing (CRUD is fine)
- GraphQL (REST is fine)
- Complex caching layers (database is fine)
- Service mesh (direct calls are fine)

**Start simple.** Add complexity when you have evidence it's needed, not because "someday we might need it."

YAGNI: You Aren't Gonna Need It.

### Starter Templates Save Hours

Modern CLI starters (create-next-app, create-expo-app, create-t3-app, etc.) make excellent architectural decisions:

- Proven patterns from community experience
- Up-to-date dependencies
- Configured build tools
- Testing setup
- Linting and formatting

**Use them.** Don't reinvent the wheel. The first implementation story should usually be "run the starter CLI command."

### AI-Agent Consistency Critical

The architecture you create will guide AI agents implementing different stories. Vague architecture causes chaos:

- ❌ "Use a database" → Agents might pick different databases
- ✅ "Use PostgreSQL 16 via Prisma ORM" → All agents use same stack

- ❌ "RESTful API" → Agents might create inconsistent endpoint patterns
- ✅ "Next.js API routes in /app/api/ following this pattern: [shows example]" → Consistent implementation

**Be explicit.** Show examples. Provide code snippets. Leave no room for interpretation.

### Adaptation to Skill Level

The architect adapts communication to your skill level:

- **Beginner:** Analogies, simple explanations, protective guidance
- **Intermediate:** Balance of technical detail and clarity
- **Expert:** Technical terminology, fast-paced, edge case focus

**This affects time:** Beginner architects need more explanation time. Expert architects move faster.

**Set skill level accurately** in `.bmad/config.yaml` for optimal experience.

---

**Ready to create your architecture?** Run this workflow when you have a PRD and you're ready to make technical decisions about how to build your system.

**Next step after architecture:** Typically `/bmad:phase-4:epic-tech-context` to create detailed epic-level technical specifications, or `/bmad:phase-4:create-story` to start breaking epics into implementable stories.
