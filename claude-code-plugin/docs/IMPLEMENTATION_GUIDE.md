# BMAD Method - Claude Code Plugin Implementation Guide

This guide provides step-by-step instructions for completing the conversion of BMAD Method from a tool-agnostic framework to a Claude Code native plugin.

---

## Overview

**Status:** Foundation complete, conversion in progress

**Completed:**
- ✅ Architecture design
- ✅ Directory structure
- ✅ Installation script
- ✅ Proof-of-concept conversions:
  - `workflow-status` command
  - `bmad-pm` subagent
- ✅ Documentation

**Remaining:**
- 🔲 Convert all workflows to slash commands
- 🔲 Convert all agents to subagents
- 🔲 Extract and formalize all skills
- 🔲 Create templates
- 🔲 Testing
- 🔲 Release

---

## Phase 1: Convert Core Workflows (Priority Order)

### 1.1 Meta Workflows (Critical Path)

These workflows are foundational and should be converted first.

#### `/bmad/workflow-init`
**Source:** `src/modules/bmm/workflows/workflow-status/init/`
**Target:** `claude-code-plugin/src/commands/workflow-init.md`
**Priority:** P0 (Critical)

**Conversion steps:**
1. Read `workflow.yaml` and `instructions.md`
2. Convert XML `<step>`, `<action>`, `<ask>` to markdown sections
3. Replace `{output_folder}` with instructions to read from config
4. Convert workflow path selection to AskUserQuestion
5. Keep YAML status file creation logic
6. Test by running command in Claude Code

**Key transformations:**
```xml
<ask>Question?</ask>
```
→
```markdown
Use AskUserQuestion tool to ask:
- Question?
```

```xml
<action>Do something with {variable}</action>
```
→
```markdown
Do something (read variable from .bmad/config.yaml)
```

#### ✅ `/bmad/workflow-status` (DONE)
Already completed as proof-of-concept.

### 1.2 Phase 1 Workflows (Analysis)

#### `/bmad/brainstorm-project`
**Source:** `src/modules/bmm/workflows/1-analysis/brainstorm-project/`
**Target:** `claude-code-plugin/src/commands/phase-1/brainstorm-project.md`
**Priority:** P1

**Conversion steps:**
1. This workflow delegates to CIS module brainstorming
2. Convert to SlashCommand invocation pattern
3. May need to inline CIS brainstorming if not converting full CIS module
4. Alternative: Delegate to general-purpose Task agent with brainstorming instructions

#### `/bmad/product-brief`
**Source:** `src/modules/bmm/workflows/1-analysis/product-brief/`
**Target:** `claude-code-plugin/src/commands/phase-1/product-brief.md`
**Priority:** P1

**Conversion steps:**
1. Read template.md and convert to inline template in instructions
2. Convert interactive questions to AskUserQuestion calls
3. Keep template output logic
4. Save to output folder

#### `/bmad/domain-research`
**Source:** `src/modules/bmm/workflows/1-analysis/domain-research/`
**Target:** `claude-code-plugin/src/commands/phase-1/domain-research.md`
**Priority:** P2 (Optional workflow)

**Conversion steps:**
1. Delegate to bmad-analyst subagent
2. Include bmad-verified-research skill reference
3. Structure for different research types

#### `/bmad/research`
**Source:** `src/modules/bmm/workflows/1-analysis/research/`
**Target:** `claude-code-plugin/src/commands/phase-1/research.md`
**Priority:** P1

**Conversion steps:**
1. Convert multi-mode research workflow
2. Support different research types
3. Always use bmad-verified-research skill
4. Delegate heavy research to Task agent

### 1.3 Phase 2 Workflows (Planning)

#### `/bmad/prd`
**Source:** `src/modules/bmm/workflows/2-plan-workflows/prd/`
**Target:** `claude-code-plugin/src/commands/phase-2/prd.md`
**Priority:** P0 (Critical)

**Conversion steps:**
1. Read workflow.yaml for config
2. Delegate to bmad-pm subagent with clear instructions
3. Reference bmad-pm skill for templates
4. Include validation checklist at end
5. Test complete flow

**Template:**
```markdown
## Step 3: Delegate to PM Agent

Use Task tool:
- subagent_type: bmad-pm
- description: Create comprehensive PRD
- prompt: |
    Create PRD for {product name}.

    Input: {output_folder}/product-brief.md (if exists)
    Output: {output_folder}/PRD.md

    Use bmad-pm skill for template and best practices.
```

#### `/bmad/architecture`
**Source:** `src/modules/bmm/workflows/2-plan-workflows/architecture/`
**Target:** `claude-code-plugin/src/commands/phase-2/architecture.md`
**Priority:** P0 (Critical)

**Conversion steps:**
1. Complex interactive workflow with multiple decision points
2. Use AskUserQuestion for all architecture decisions
3. Delegate to bmad-architect subagent
4. Include architecture templates
5. Support both greenfield and brownfield

#### `/bmad/create-epics-and-stories`
**Source:** `src/modules/bmm/workflows/2-plan-workflows/prd/create-epics-and-stories/`
**Target:** `claude-code-plugin/src/commands/phase-2/create-epics-and-stories.md`
**Priority:** P0 (Critical)

**Conversion steps:**
1. Read PRD
2. Delegate to bmad-pm for epic breakdown
3. Use epic and story templates
4. Create epic files in structured format
5. Generate epic index

#### `/bmad/sprint-planning`
**Source:** `src/modules/bmm/workflows/2-plan-workflows/sprint-planning/`
**Target:** `claude-code-plugin/src/commands/phase-2/sprint-planning.md`
**Priority:** P1

**Conversion steps:**
1. Read all epic files
2. Extract all stories
3. Create sprint-status.yaml tracking file
4. Use bmad-sprint-tracking skill
5. Generate sprint plan

#### `/bmad/tech-spec`
**Source:** `src/modules/bmm/workflows/2-plan-workflows/tech-spec/`
**Target:** `claude-code-plugin/src/commands/phase-2/tech-spec.md`
**Priority:** P1 (Level 0-1 projects only)

**Conversion steps:**
1. Simplified PRD for small projects
2. Delegate to bmad-pm or bmad-architect
3. Single document output
4. Include technical details

### 1.4 Phase 3 Workflows (Solutioning)

#### `/bmad/epic-tech-context`
**Source:** `src/modules/bmm/workflows/3-solutioning/epic-tech-context/`
**Target:** `claude-code-plugin/src/commands/phase-3/epic-tech-context.md`
**Priority:** P0 (Critical)

**Conversion steps:**
1. Read epic file
2. Read architecture
3. Delegate to bmad-architect for technical specification
4. Create detailed tech spec for epic
5. Include acceptance criteria mapping

#### `/bmad/create-story`
**Source:** `src/modules/bmm/workflows/3-solutioning/create-story/`
**Target:** `claude-code-plugin/src/commands/phase-3/create-story.md`
**Priority:** P0 (Critical)

**Conversion steps:**
1. Read epic-tech-context
2. Determine next story to create
3. Use story template
4. Delegate to bmad-dev subagent
5. Save story file

### 1.5 Phase 4 Workflows (Implementation)

#### `/bmad/story-context`
**Source:** `src/modules/bmm/workflows/4-implementation/story-context/`
**Target:** `claude-code-plugin/src/commands/phase-4/story-context.md`
**Priority:** P0 (Critical)

**Conversion steps:**
1. Read story file
2. Gather relevant context (epic, architecture, existing code)
3. Use bmad-story-context-generation skill
4. Assemble context XML/markdown
5. Return context for implementation

#### `/bmad/dev-story`
**Source:** `src/modules/bmm/workflows/4-implementation/dev-story/`
**Target:** `claude-code-plugin/src/commands/phase-4/dev-story.md`
**Priority:** P0 (Critical)

**Conversion steps:**
1. Invoke /bmad/story-context first
2. Delegate to bmad-dev subagent with full context
3. Implement story following acceptance criteria
4. Run tests
5. Update story status

#### `/bmad/code-review`
**Source:** `src/modules/bmm/workflows/4-implementation/code-review/`
**Target:** `claude-code-plugin/src/commands/phase-4/code-review.md`
**Priority:** P1

**Conversion steps:**
1. Read story file
2. Read git diff for changes
3. Delegate to bmad-dev for code review
4. Check against acceptance criteria
5. Append review notes to story

#### `/bmad/story-ready`
**Source:** `src/modules/bmm/workflows/4-implementation/story-ready/`
**Target:** `claude-code-plugin/src/commands/phase-4/story-ready.md`
**Priority:** P1

**Conversion steps:**
1. Simple status update workflow
2. Update sprint-status.yaml
3. Move story from TODO → IN PROGRESS
4. No subagent needed

#### `/bmad/story-done`
**Source:** `src/modules/bmm/workflows/4-implementation/story-done/`
**Target:** `claude-code-plugin/src/commands/phase-4/story-done.md`
**Priority:** P1

**Conversion steps:**
1. Validate Definition of Done
2. Update sprint-status.yaml
3. Move story to DONE
4. Advance story queue

#### `/bmad/document-project`
**Source:** `src/modules/bmm/workflows/4-implementation/document-project/`
**Target:** `claude-code-plugin/src/commands/meta/document-project.md`
**Priority:** P2

**Conversion steps:**
1. Analyze brownfield codebase
2. Generate documentation
3. Delegate to bmad-tech-writer
4. Use Task agent with Explore for codebase analysis

---

## Phase 2: Convert All Agents to Subagents

### Priority Order

1. **P0 (Critical):** PM, Architect, DEV
2. **P1 (High):** TEA, Analyst, SM
3. **P2 (Medium):** UX Designer, Tech Writer

### 2.1 Product Manager (DONE)

✅ Already completed as proof-of-concept.

### 2.2 Architect

**Source:** `src/modules/bmm/agents/architect.agent.yaml`
**Target:** `claude-code-plugin/src/subagents/bmad-architect.md`
**Priority:** P0

**Persona to extract:**
- Role, identity, communication style from YAML
- Convert to "Approach" section

**Menu items to convert:**
- Workflows become instructions (e.g., "When invoked for architecture:")
- Each trigger becomes a usage pattern

**Template:**
```markdown
---
description: System Architect for architecture design, technical decisions, and epic specifications
subagent_type: bmad-architect
---

# Architect

## Description
[From metadata]

## Tools Available
All tools

## Persona
[Extract from agent.persona section]

## Approach
[Convert communication_style and principles]

## Instructions

### When Creating Architecture
[Convert from architecture workflow]

### When Creating Epic Tech Context
[Convert from epic-tech-context workflow]

### When Making Technical Decisions
[Convert from technical decision patterns]

## Output Formats
[Specify templates]

## Configuration
[Same as PM]

## Examples
[Create 2-3 examples]
```

### 2.3 Developer (DEV)

**Source:** `src/modules/bmm/agents/dev.agent.yaml`
**Target:** `claude-code-plugin/src/subagents/bmad-dev.md`
**Priority:** P0

**Special considerations:**
- DEV has many menu items (story implementation, code review, etc.)
- Create separate instruction sections for each
- Reference bmad-test-architecture skill
- Include coding standards and best practices

### 2.4 Test Engineer (TEA)

**Source:** `src/modules/bmm/agents/tea.agent.yaml`
**Target:** `claude-code-plugin/src/subagents/bmad-tea.md`
**Priority:** P1

**Special considerations:**
- Test strategy and architecture expert
- References bmad-test-architecture skill heavily
- Include test patterns, fixtures, factories
- Network-first testing approach

### 2.5 Business Analyst

**Source:** `src/modules/bmm/agents/analyst.agent.yaml`
**Target:** `claude-code-plugin/src/subagents/bmad-analyst.md`
**Priority:** P1

**Special considerations:**
- Requirements analysis and research
- Domain research expert
- Uses bmad-verified-research skill

### 2.6 Scrum Master

**Source:** `src/modules/bmm/agents/sm.agent.yaml`
**Target:** `claude-code-plugin/src/subagents/bmad-sm.md`
**Priority:** P1

**Special considerations:**
- Sprint planning and tracking
- Status updates and coordination
- Retrospectives

### 2.7 UX Designer

**Source:** `src/modules/bmm/agents/ux-designer.agent.yaml`
**Target:** `claude-code-plugin/src/subagents/bmad-ux.md`
**Priority:** P2

**Special considerations:**
- Design facilitation
- Visual exploration
- User research

### 2.8 Technical Writer

**Source:** `src/modules/bmm/agents/tech-writer.agent.yaml`
**Target:** `claude-code-plugin/src/subagents/bmad-tech-writer.md`
**Priority:** P2

**Special considerations:**
- Documentation creation
- Style guides
- API documentation

---

## Phase 3: Extract and Formalize Skills

Skills already exist in the repo but need to be properly structured for Claude Code.

### 3.1 Existing Skills to Convert

#### ✅ bmad-verified-research (Already exists)
Location: `.claude/skills/bmad-verified-research/SKILL.md`
Action: Review and ensure it matches new format

#### ✅ bmad-story-context-generation (Already exists)
Location: `.claude/skills/bmad-story-context-generation/SKILL.md`
Action: Review and ensure it matches new format

#### ✅ bmad-subagent-patterns (Already exists)
Location: `.claude/skills/bmad-subagent-patterns/SKILL.md`
Action: Review and enhance for Task tool usage

#### ✅ bmad-test-architecture (Already exists)
Location: `.claude/skills/bmad-test-architecture/SKILL.md`
Action: Review and ensure TEA patterns are documented

#### ✅ bmad-workflow-orchestration (Already exists)
Location: `.claude/skills/bmad-workflow-orchestration/SKILL.md`
Action: Update for slash command orchestration

### 3.2 New Skills to Create

#### bmad-pm
**Target:** `claude-code-plugin/src/skills/bmad-pm/SKILL.md`
**Priority:** P0

**Purpose:** PRD templates, epic breakdown patterns, story creation templates

**Contents:**
- PRD template (full markdown)
- Epic template
- Story template
- Acceptance criteria patterns
- Success metrics examples
- Code examples for parsing/generating

**Structure:**
```
bmad-pm/
├── SKILL.md
├── templates/
│   ├── prd-template.md
│   ├── epic-template.md
│   └── story-template.md
├── examples/
│   ├── example-prd.md
│   └── example-epic.md
└── scripts/
    └── story-parser.py
```

#### bmad-sprint-tracking
**Target:** `claude-code-plugin/src/skills/bmad-sprint-tracking/SKILL.md`
**Priority:** P1

**Purpose:** Sprint status management, YAML manipulation, story lifecycle

**Contents:**
- sprint-status.yaml format documentation
- Story state transitions (backlog → drafted → ready → in-progress → done)
- YAML update patterns
- Code examples for status updates

**Structure:**
```
bmad-sprint-tracking/
├── SKILL.md
├── examples/
│   └── sprint-status.yaml
└── scripts/
    ├── update-status.py
    └── query-status.py
```

---

## Phase 4: Create Templates

Templates are used by workflows and agents for consistent document generation.

### 4.1 Document Templates

**Location:** `claude-code-plugin/templates/`

#### prd-template.md
Full PRD template with all sections (already embedded in bmad-pm subagent).
Extract to standalone file for reference.

#### epic-template.md
Epic file structure with stories.

#### story-template.md
Individual story structure.

#### architecture-template.md
Architecture document structure.

#### tech-spec-template.md
Technical specification for epics.

### 4.2 Configuration Templates

#### config.yaml
Default configuration template.

#### sprint-status.yaml
Sprint tracking file template.

#### workflow-paths/
Different workflow path templates (bmm-method, quick-flow, etc.).

---

## Phase 5: Testing

### 5.1 Unit Testing

Test individual components in isolation.

#### Test Slash Commands
For each command:
1. Install to `~/.claude/commands/bmad/`
2. Invoke via `/bmad/{command}`
3. Verify all steps execute
4. Verify output files created
5. Verify error handling

#### Test Subagents
For each subagent:
1. Install to `~/.claude/subagents/bmad/`
2. Invoke via Task tool
3. Verify instructions followed
4. Verify output format
5. Verify error handling

#### Test Skills
For each skill:
1. Install to `~/.claude/skills/bmad/`
2. Verify auto-invocation (mention skill name)
3. Verify code examples work
4. Verify documentation clarity

### 5.2 Integration Testing

Test complete workflows end-to-end.

#### Test Case 1: Level 2 Greenfield Project
```
1. /bmad/workflow-init → Create workflow path
2. /bmad/product-brief → Create brief
3. /bmad/prd → Create PRD (uses bmad-pm)
4. /bmad/architecture → Create architecture (uses bmad-architect)
5. /bmad/create-epics-and-stories → Break down (uses bmad-pm)
6. /bmad/sprint-planning → Create sprint plan
7. /bmad/epic-tech-context → Tech spec for EPIC-1
8. /bmad/create-story → Create STORY-1
9. /bmad/story-context → Assemble context
10. /bmad/dev-story → Implement story (uses bmad-dev)
11. /bmad/code-review → Review code
12. /bmad/story-done → Mark complete
13. /bmad/workflow-status → Verify status updated
```

Verify:
- All files created in correct locations
- YAML status file updated correctly
- Templates used properly
- Subagents invoked successfully
- Skills referenced appropriately

#### Test Case 2: Level 0 Quick Fix
```
1. /bmad/workflow-init → Select Quick Flow
2. /bmad/tech-spec → Create simple tech spec
3. /bmad/dev-story → Implement directly
4. /bmad/workflow-status → Verify completion
```

#### Test Case 3: Brownfield Documentation
```
1. /bmad/document-project → Analyze and document existing codebase
2. Verify comprehensive documentation generated
```

### 5.3 Error Handling Testing

Test edge cases and errors:

- Missing config file
- Invalid YAML in status file
- Missing dependencies (PRD before architecture)
- File write permissions
- Corrupted templates
- Network errors (for research workflows)
- Invalid user input

---

## Phase 6: Documentation

### 6.1 User Documentation

#### Quickstart Guide
**Target:** `claude-code-plugin/docs/quickstart.md`

- Installation steps
- First workflow (workflow-init)
- Complete example project
- Common patterns

#### Workflow Reference
**Target:** `claude-code-plugin/docs/workflows.md`

- List all workflows with descriptions
- When to use each workflow
- Inputs and outputs
- Examples

#### Subagent Reference
**Target:** `claude-code-plugin/docs/subagents.md`

- List all subagents
- When to invoke each
- Expected inputs/outputs
- Examples of Task tool invocation

#### Skill Reference
**Target:** `claude-code-plugin/docs/skills.md`

- List all skills
- When each auto-invokes
- How to use explicitly
- Code examples

### 6.2 Developer Documentation

#### Contributing Guide
**Target:** `claude-code-plugin/docs/CONTRIBUTING.md`

- How to add workflows
- How to add subagents
- How to add skills
- Code style
- Testing requirements
- PR process

#### Architecture Documentation
**Target:** `claude-code-plugin/docs/ARCHITECTURE.md`

- How slash commands work
- How subagents are invoked
- How skills are referenced
- Configuration system
- Template system

---

## Phase 7: Release

### 7.1 Pre-Release Checklist

- [ ] All P0 workflows converted and tested
- [ ] All P0 subagents converted and tested
- [ ] All skills documented and tested
- [ ] Templates created
- [ ] Installation script tested on clean machine
- [ ] Documentation complete
- [ ] README accurate
- [ ] CHANGELOG created
- [ ] License file included
- [ ] package.json metadata correct

### 7.2 Release Process

1. **Version bump:** Update version in `package.json`
2. **Git tag:** Create release tag
3. **NPM publish:** Publish to NPM registry
4. **GitHub release:** Create GitHub release with notes
5. **Documentation site:** Update docs site
6. **Announcement:** Blog post, Discord, social media

### 7.3 Post-Release

1. **Monitor issues:** Watch GitHub issues closely
2. **Gather feedback:** Discord, GitHub Discussions
3. **Iteration:** Plan v2.1 based on feedback
4. **Migration support:** Help v1.x users migrate

---

## Automation Scripts

To speed up conversion, create helper scripts:

### convert-workflow.js
```javascript
// Automates workflow conversion
// Reads YAML + XML, outputs markdown template
// Human review still required
```

### convert-agent.js
```javascript
// Automates agent conversion
// Reads agent.yaml, outputs subagent markdown template
// Human review still required
```

### validate-all.js
```javascript
// Validates all conversions
// Checks frontmatter, structure, completeness
```

---

## Conversion Workflow

For each workflow/agent:

1. **Read source files** - Understand current implementation
2. **Create target file** - Use templates from proof-of-concept
3. **Convert step-by-step** - Transform XML/YAML to markdown
4. **Test locally** - Install and run in Claude Code
5. **Iterate** - Fix issues, improve clarity
6. **Document** - Add to workflow/subagent reference
7. **Commit** - Create PR for review

---

## Timeline Estimate

**Assumptions:**
- 1 developer working full-time
- Prior experience with BMAD Method

**Phase 1: Workflows** (2 weeks)
- Meta workflows: 2 days
- Phase 1 workflows: 2 days
- Phase 2 workflows: 3 days
- Phase 3 workflows: 2 days
- Phase 4 workflows: 3 days

**Phase 2: Subagents** (1 week)
- PM, Architect, DEV: 3 days
- TEA, Analyst, SM: 2 days
- UX, Tech Writer: 2 days

**Phase 3: Skills** (3 days)
- Review existing: 1 day
- Create new (PM, Sprint): 2 days

**Phase 4: Templates** (2 days)
- Extract and organize templates

**Phase 5: Testing** (1 week)
- Unit tests: 2 days
- Integration tests: 3 days
- Error handling: 2 days

**Phase 6: Documentation** (3 days)
- User docs: 2 days
- Developer docs: 1 day

**Phase 7: Release** (1 day)
- Pre-release checklist
- Publishing

**Total: ~5 weeks**

---

## Success Criteria

### Functional
- [ ] All P0 workflows work end-to-end
- [ ] All P0 subagents can be invoked via Task tool
- [ ] Installation script works on clean machine
- [ ] Documentation is complete and accurate

### Performance
- [ ] Workflows execute 50%+ faster than v1.x
- [ ] No runtime errors in normal usage
- [ ] Installation completes in < 30 seconds

### User Experience
- [ ] Commands discoverable via autocomplete
- [ ] Subagent delegation works smoothly
- [ ] Skills auto-invoke appropriately
- [ ] Error messages are helpful

### Quality
- [ ] Code follows best practices
- [ ] Documentation is clear
- [ ] Examples work as shown
- [ ] Tests pass consistently

---

## Getting Help

Questions during implementation:

1. **Check existing conversions:** workflow-status, bmad-pm
2. **Reference migration plan:** CLAUDE_CODE_MIGRATION_PLAN.md
3. **Review Claude Code docs:** https://docs.claude.com/claude-code
4. **Ask in discussions:** GitHub Discussions
5. **Join Discord:** BMAD community

---

## Next Steps

1. **Review this guide** - Understand the full scope
2. **Set up dev environment** - Clone repo, install dependencies
3. **Start with one workflow** - Pick a simple Phase 1 workflow
4. **Test thoroughly** - Ensure it works before moving on
5. **Build momentum** - Convert more workflows, iterate
6. **Get feedback early** - Share with beta testers
7. **Ship iteratively** - Release MVP, then enhance

---

**Ready to start converting?**

Pick your first workflow and follow the conversion pattern from the proof-of-concept examples!
