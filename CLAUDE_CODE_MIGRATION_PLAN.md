# BMAD Method → Claude Code Native Plugin Migration Plan

## Executive Summary

This document outlines the transformation of BMAD Method from a tool-agnostic framework into a **Claude Code-native plugin** that fully leverages Claude Code's built-in capabilities: subagents (Task tool), slash commands (SlashCommand tool), and skills (Skill tool).

---

## Current Architecture vs Target Architecture

### Current (Tool-Agnostic)
```
BMAD Method
├── Core Framework (XML execution engine)
├── Agents (interactive menu-driven)
├── Workflows (YAML config + instructions.md)
├── Multi-IDE support (15 platforms)
└── Web bundles (standalone XML)
```

**Problems:**
- Heavy XML parsing overhead
- Menu-based interaction (not conversational)
- Custom execution engine instead of native Task tool
- Compilation step required
- Not leveraging Claude Code primitives

### Target (Claude Code Native)
```
~/.claude/
├── commands/bmad/          # Slash commands (workflows)
├── skills/bmad/            # Skills (reusable patterns)
└── subagents/bmad/         # Native subagents (agents)

BMAD-METHOD/ (plugin repo)
├── src/
│   ├── commands/           # Slash command definitions
│   ├── skills/             # Skill definitions
│   └── subagents/          # Subagent definitions
├── tools/
│   └── install-plugin.js   # Claude Code plugin installer
└── docs/                   # Documentation
```

**Benefits:**
- Zero runtime overhead (native Claude Code)
- Conversational interaction (no menus)
- Stateless subagents (Task tool manages context)
- No compilation needed
- Full Claude Code integration

---

## Mapping Strategy

### 1. Agents → Subagents (Task Tool)

**Current Agent Structure:**
```yaml
agent:
  metadata: {...}
  persona: {...}
  menu: [...]
  prompts: [...]
```

**Target Subagent Structure:**
```markdown
# Agent Name

## Description
Short description for when to use this agent

## Tools Available
List of Claude Code tools this agent can access

## Instructions
Clear, direct instructions for autonomous operation

## Examples
Example invocations and expected outputs
```

**Conversion Rules:**
- **Persona** → Collapse into Instructions section (conversational tone)
- **Menu** → Remove (replaced with conversational Task calls)
- **Critical Actions** → Merge into Instructions as "First Steps"
- **Prompts** → Integrate into Instructions as subsections
- **Handler Logic** → Remove (native Task tool handles execution)

**Subagent Types (from Claude Code):**
```
general-purpose     # For complex multi-step tasks
Explore            # For codebase exploration
Plan               # For planning tasks
```

**Custom BMAD Subagents:**
```
bmad-pm            # Product Manager (PRD creation)
bmad-architect     # System Architect (architecture decisions)
bmad-dev           # Developer (story implementation)
bmad-tea           # Test Engineer (test strategy)
bmad-analyst       # Business Analyst (requirements)
bmad-ux            # UX Designer (design facilitation)
bmad-sm            # Scrum Master (project coordination)
bmad-tech-writer   # Technical Writer (documentation)
```

### 2. Workflows → Slash Commands

**Current Workflow Structure:**
```
workflow/
├── workflow.yaml          # Config + variables
├── instructions.md        # Step-by-step logic
├── template.md           # Optional template
└── checklist.md          # Optional validation
```

**Target Slash Command Structure:**
```
.claude/commands/bmad/{module}/{workflow-name}.md
```

**Content Format:**
```markdown
---
description: Short description for the Available Commands list
---

# Workflow instructions as plain markdown

Variables resolved at runtime via:
- Claude Code environment
- AskUserQuestion tool
- Reading config files directly
```

**Conversion Rules:**
- **workflow.yaml variables** → Read from `.bmad/config.yaml` at runtime
- **instructions.md** → Direct markdown in slash command
- **<invoke-workflow>** → Nested SlashCommand tool calls
- **<ask>** → AskUserQuestion tool
- **<action>** → Direct instructions to Claude
- **template.md** → Inline as example in instructions
- **checklist.md** → Append as "Validation Steps" section

**Key Workflows to Convert:**
```
Phase 1 (Analysis):
/bmad/brainstorm-project
/bmad/product-brief
/bmad/domain-research
/bmad/research

Phase 2 (Planning):
/bmad/prd
/bmad/architecture
/bmad/create-epics-and-stories
/bmad/sprint-planning

Phase 3 (Solutioning):
/bmad/epic-tech-context
/bmad/create-story

Phase 4 (Implementation):
/bmad/story-context
/bmad/dev-story
/bmad/code-review
/bmad/story-ready
/bmad/story-done

Meta:
/bmad/workflow-init
/bmad/workflow-status
/bmad/document-project
```

### 3. Reusable Patterns → Skills

**Skills to Extract:**

```
~/.claude/skills/bmad/
├── anti-hallucination-research/
│   ├── SKILL.md
│   └── scripts/verified-research.py
├── story-context-assembly/
│   ├── SKILL.md
│   └── scripts/gather-context.py
├── epic-breakdown/
│   ├── SKILL.md
│   └── examples/epic-structure.md
├── prd-creation/
│   ├── SKILL.md
│   └── templates/prd-template.md
├── subagent-delegation/
│   ├── SKILL.md
│   └── examples/task-delegation.md
└── test-architecture/
    ├── SKILL.md
    └── patterns/test-patterns.md
```

**Skill Content:**
```yaml
---
name: skill-name
description: When and how to use this pattern
---

# Pattern Documentation

## When to Use
Clear triggers for using this skill

## How It Works
Step-by-step explanation

## Code Examples
Working, proven code

## References
Links to docs, related skills
```

**Key Patterns:**
- **bmad-verified-research** (already exists as skill)
- **bmad-story-context-generation** (already exists as skill)
- **bmad-subagent-patterns** (already exists as skill)
- **bmad-test-architecture** (already exists as skill)
- **bmad-workflow-orchestration** (already exists as skill)
- **bmad-sprint-tracking** → New skill for sprint-status.yaml management
- **bmad-pm** → New skill for PRD creation patterns

---

## Directory Structure

### Source Repository (BMAD-METHOD)
```
BMAD-METHOD/
├── src/
│   ├── commands/              # Slash command definitions
│   │   ├── phase-1/
│   │   │   ├── brainstorm-project.md
│   │   │   ├── product-brief.md
│   │   │   └── research.md
│   │   ├── phase-2/
│   │   │   ├── prd.md
│   │   │   ├── architecture.md
│   │   │   └── create-epics-and-stories.md
│   │   ├── phase-3/
│   │   │   ├── epic-tech-context.md
│   │   │   └── create-story.md
│   │   ├── phase-4/
│   │   │   ├── story-context.md
│   │   │   ├── dev-story.md
│   │   │   ├── code-review.md
│   │   │   ├── story-ready.md
│   │   │   └── story-done.md
│   │   └── meta/
│   │       ├── workflow-init.md
│   │       ├── workflow-status.md
│   │       └── document-project.md
│   │
│   ├── subagents/             # Subagent definitions
│   │   ├── bmad-pm.md
│   │   ├── bmad-architect.md
│   │   ├── bmad-dev.md
│   │   ├── bmad-tea.md
│   │   ├── bmad-analyst.md
│   │   ├── bmad-ux.md
│   │   ├── bmad-sm.md
│   │   └── bmad-tech-writer.md
│   │
│   └── skills/                # Skill definitions
│       ├── bmad-pm/
│       │   ├── SKILL.md
│       │   └── templates/
│       ├── bmad-sprint-tracking/
│       │   ├── SKILL.md
│       │   └── scripts/
│       ├── bmad-story-context-generation/
│       │   ├── SKILL.md
│       │   └── scripts/
│       ├── bmad-subagent-patterns/
│       │   ├── SKILL.md
│       │   └── examples/
│       ├── bmad-test-architecture/
│       │   ├── SKILL.md
│       │   └── patterns/
│       ├── bmad-verified-research/
│       │   ├── SKILL.md
│       │   └── protocols/
│       └── bmad-workflow-orchestration/
│           ├── SKILL.md
│           └── examples/
│
├── tools/
│   └── install-plugin.js      # Installation script
│
├── templates/                  # Document templates
│   ├── prd-template.md
│   ├── epic-template.md
│   ├── story-template.md
│   └── architecture-template.md
│
├── docs/                       # Documentation
│   ├── installation.md
│   ├── quickstart.md
│   ├── workflows.md
│   ├── subagents.md
│   └── skills.md
│
└── package.json               # NPM package config
```

### Installed Structure (~/.claude/)
```
~/.claude/
├── commands/bmad/
│   ├── phase-1/
│   │   ├── brainstorm-project.md
│   │   ├── product-brief.md
│   │   └── research.md
│   ├── phase-2/
│   │   ├── prd.md
│   │   ├── architecture.md
│   │   └── create-epics-and-stories.md
│   ├── phase-3/
│   │   ├── epic-tech-context.md
│   │   └── create-story.md
│   ├── phase-4/
│   │   ├── story-context.md
│   │   ├── dev-story.md
│   │   ├── code-review.md
│   │   ├── story-ready.md
│   │   └── story-done.md
│   └── meta/
│       ├── workflow-init.md
│       ├── workflow-status.md
│       └── document-project.md
│
├── skills/bmad/
│   ├── bmad-pm/
│   ├── bmad-sprint-tracking/
│   ├── bmad-story-context-generation/
│   ├── bmad-subagent-patterns/
│   ├── bmad-test-architecture/
│   ├── bmad-verified-research/
│   └── bmad-workflow-orchestration/
│
└── subagents/bmad/            # (if Claude Code supports custom subagents)
    ├── bmad-pm.md
    ├── bmad-architect.md
    ├── bmad-dev.md
    ├── bmad-tea.md
    ├── bmad-analyst.md
    ├── bmad-ux.md
    ├── bmad-sm.md
    └── bmad-tech-writer.md
```

---

## Installation Flow

### Current Installation
```bash
npx bmad-method@alpha install
```

1. User selects modules (bmm, bmb, cis, bmgd)
2. User selects IDE (15 options)
3. User provides configuration (output folder, etc.)
4. System compiles YAML → MD/XML
5. System copies to `.bmad/` folder
6. System creates IDE-specific artifacts

### Target Installation
```bash
npx @bmad/claude-code-plugin install
# or
claude-code plugin install bmad-method
```

**Simplified Flow:**
1. Ask user for configuration (output folder, user name)
2. Copy slash commands to `~/.claude/commands/bmad/`
3. Copy skills to `~/.claude/skills/bmad/`
4. (Optional) Copy subagents if supported
5. Create config file in project: `.bmad/config.yaml`
6. Done (no compilation needed)

**Installation Script:** `tools/install-plugin.js`

```javascript
#!/usr/bin/env node
const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const inquirer = require('inquirer');

async function install() {
  // 1. Ask user for config
  const answers = await inquirer.prompt([
    { type: 'input', name: 'outputFolder', message: 'Output folder for artifacts:', default: 'bmad-output' },
    { type: 'input', name: 'userName', message: 'Your name:', default: os.userInfo().username },
    { type: 'confirm', name: 'installAll', message: 'Install all workflows?', default: true }
  ]);

  const claudeDir = path.join(os.homedir(), '.claude');
  const projectRoot = process.cwd();

  // 2. Copy commands
  await fs.copy(
    path.join(__dirname, '../src/commands'),
    path.join(claudeDir, 'commands/bmad')
  );

  // 3. Copy skills
  await fs.copy(
    path.join(__dirname, '../src/skills'),
    path.join(claudeDir, 'skills/bmad')
  );

  // 4. Copy subagents (if supported)
  await fs.copy(
    path.join(__dirname, '../src/subagents'),
    path.join(claudeDir, 'subagents/bmad')
  );

  // 5. Create project config
  const config = {
    output_folder: answers.outputFolder,
    user_name: answers.userName,
    bmad_version: '2.0.0',
    installed_date: new Date().toISOString()
  };

  await fs.ensureDir(path.join(projectRoot, '.bmad'));
  await fs.writeFile(
    path.join(projectRoot, '.bmad/config.yaml'),
    `# BMAD Method Configuration\noutput_folder: ${config.output_folder}\nuser_name: ${config.user_name}\n`
  );

  console.log('✅ BMAD Method plugin installed successfully!');
  console.log(`\nAvailable commands:`);
  console.log(`  /bmad/product-brief`);
  console.log(`  /bmad/prd`);
  console.log(`  /bmad/architecture`);
  console.log(`  ... and 20+ more\n`);
}

install().catch(console.error);
```

---

## Conversion Examples

### Example 1: Agent → Subagent

**Current: bmm/agents/pm.agent.yaml**
```yaml
agent:
  metadata:
    name: "Product Manager"
    icon: "🎯"

  persona:
    role: "Senior Product Manager"
    identity: "Strategic product thinker..."
    communication_style: "Collaborative and inquisitive..."

  menu:
    - trigger: "prd"
      workflow: "{bmad_folder}/bmm/workflows/prd/workflow.yaml"
      description: "Create Product Requirements Document"
    - trigger: "epics"
      workflow: "{bmad_folder}/bmm/workflows/create-epics-and-stories/workflow.yaml"
      description: "Break PRD into epics and stories"
```

**Target: subagents/bmad-pm.md**
```markdown
---
description: Product Manager agent for PRD creation, requirements gathering, and epic breakdown. Auto-invoked when working with product planning or PRD workflows.
subagent_type: bmad-pm
---

# Product Manager

## Description
Strategic product management agent specializing in PRD creation, requirements analysis, and breaking down complex features into epics and stories. Use this agent when you need to:
- Create Product Requirements Documents (PRDs)
- Define product vision and strategy
- Break down features into epics and stories
- Analyze market requirements
- Prioritize features and roadmap items

## Tools Available
All tools (Read, Write, Edit, Grep, Glob, WebFetch, WebSearch, AskUserQuestion)

## Approach
As a Senior Product Manager, I take a collaborative and strategic approach:
1. **Understand context first** - Read existing product docs, PRDs, architecture
2. **Ask clarifying questions** - Use AskUserQuestion to understand user needs
3. **Research when needed** - Use WebSearch for market/competitive analysis
4. **Think strategically** - Focus on "why" before "what"
5. **Be specific** - Concrete acceptance criteria and success metrics
6. **Iterate collaboratively** - Work with user to refine requirements

## Instructions

### When invoked for PRD creation:
1. Read any existing product brief from `{output_folder}/*brief*.md`
2. If no brief exists, ask user about:
   - Product vision and goals
   - Target users and use cases
   - Key features and priorities
   - Success metrics
3. Create PRD using template from bmad-pm skill
4. Include:
   - Executive Summary
   - User Stories and Use Cases
   - Functional Requirements
   - Non-Functional Requirements
   - Success Metrics
   - Out of Scope
5. Save to `{output_folder}/PRD.md`

### When invoked for epic breakdown:
1. Read PRD from `{output_folder}/PRD.md`
2. Analyze requirements and identify logical groupings
3. Create epics that:
   - Represent vertical slices of functionality
   - Are independently valuable
   - Can be completed in 2-4 sprints
4. Break each epic into user stories (5-10 stories per epic)
5. Save epic files to `{output_folder}/epics/epic-{N}-{name}.md`

### When invoked for requirements analysis:
1. Read existing requirements/user feedback
2. Identify gaps, conflicts, or ambiguities
3. Organize requirements by:
   - Functional vs Non-Functional
   - Must-have vs Should-have vs Could-have
   - User-facing vs Technical
4. Provide recommendations with rationale

## Output Format
- PRDs: Use template from bmad-pm skill
- Epics: Use template from bmad-pm skill
- Stories: Use template from bmad-pm skill
- Analysis: Structured markdown with clear sections

## Examples

### Example 1: Creating PRD
```
User: Create a PRD for a task management app
PM Agent:
1. Reads product brief if exists
2. Asks clarifying questions about target users, key features, integrations
3. Creates comprehensive PRD covering all requirements
4. Saves to bmad-output/PRD.md
```

### Example 2: Breaking down into epics
```
User: Break this PRD into epics and stories
PM Agent:
1. Reads PRD.md
2. Identifies 5 main epics (User Auth, Task Management, Collaboration, Notifications, Reporting)
3. Creates detailed epic files with user stories
4. Saves to bmad-output/epics/
```

## Configuration
Reads configuration from `.bmad/config.yaml`:
- `output_folder`: Where to save artifacts
- `user_name`: User name for authorship
```

### Example 2: Workflow → Slash Command

**Current: bmm/workflows/prd/workflow.yaml + instructions.md**

**workflow.yaml:**
```yaml
name: "prd"
description: "Unified PRD workflow for BMad Method"
config_source: "{project-root}/{bmad_folder}/bmm/config.yaml"
user_name: "{config_source}:user_name"
output_folder: "{config_source}:output_folder"
instructions: "{installed_path}/instructions.md"
template: "{installed_path}/template.md"
```

**instructions.md:**
```xml
<step>Load product brief</step>
<step>If brief exists, read it</step>
<step optional="true">Research market/competitors</step>
<step>Create PRD following template</step>
<step>Save to output folder</step>
```

**Target: commands/phase-2/prd.md**
```markdown
---
description: Unified PRD workflow for BMad Method and Enterprise Method tracks. Produces strategic PRD and tactical epic breakdown.
---

# Create Product Requirements Document (PRD)

You are creating a comprehensive Product Requirements Document. Follow these steps:

## Configuration
Read configuration from `.bmad/config.yaml` to get:
- `output_folder`: Where to save the PRD
- `user_name`: Author name

## Steps

### 1. Gather Context
Read any existing product brief:
- Check `{output_folder}/*brief*.md` (whole file)
- Check `{output_folder}/*brief*/index.md` (sharded file)
- If found, read and internalize the product vision

### 2. Research (Optional but Recommended)
If the product domain is unfamiliar:
- Use WebSearch to research market trends
- Use WebSearch to understand competitive landscape
- Use WebFetch to study similar products

### 3. Delegate to PM Agent
Use the Task tool to invoke the bmad-pm subagent:

```
Task tool:
- subagent_type: bmad-pm
- description: Create comprehensive PRD
- prompt: |
    Create a Product Requirements Document for [product name].

    Product Brief location: {output_folder}/product-brief.md
    Save PRD to: {output_folder}/PRD.md

    Include:
    - Executive Summary
    - User Stories and Use Cases
    - Functional Requirements (detailed)
    - Non-Functional Requirements
    - Success Metrics
    - Out of Scope items

    Use the bmad-pm skill for PRD template and best practices.
```

### 4. Validate Output
After the PM agent completes:
- Verify PRD was created at `{output_folder}/PRD.md`
- Check that all required sections are present
- Confirm requirements are specific and testable

### 5. Next Steps
Inform the user:
```
✅ PRD created successfully at {output_folder}/PRD.md

Next steps:
- Review the PRD and provide feedback
- Run /bmad/architecture to create technical architecture
- Run /bmad/create-epics-and-stories to break down into epics
```

## Template Reference
The bmad-pm skill contains the PRD template structure. The PM agent will use it automatically.

## Validation Checklist
- [ ] Executive Summary clearly explains product vision
- [ ] User stories follow "As a [role], I want [action] so that [benefit]" format
- [ ] Functional requirements are specific and testable
- [ ] Non-functional requirements include performance, security, scalability
- [ ] Success metrics are measurable
- [ ] Out of scope items are explicitly listed
```

### Example 3: Reusable Pattern → Skill

**Current: Embedded in workflow instructions**
```xml
<!-- Anti-hallucination protocol embedded in research workflow -->
<step>Search for authoritative sources</step>
<step>Cross-reference findings with multiple sources</step>
<step>Cite sources explicitly with URLs</step>
<step>Separate verified facts from inferences</step>
```

**Target: skills/bmad-verified-research/SKILL.md**
```yaml
---
name: bmad-verified-research
description: Anti-hallucination research protocol - source verification, cross-referencing, explicit citation, verified vs. inferred separation
---

# Verified Research Protocol

## When to Use
Use this skill whenever you need to research information and ensure accuracy:
- Market research for PRDs
- Technology evaluation for architecture decisions
- Competitive analysis
- Domain-specific regulations or standards
- Best practices research

## Anti-Hallucination Protocol

### 1. Source Quality Hierarchy
**Tier 1 - Authoritative:**
- Official documentation
- Academic papers
- Government/regulatory sources
- Primary sources

**Tier 2 - Reliable:**
- Industry publications
- Expert blogs (verified authors)
- Case studies from reputable companies

**Tier 3 - Secondary:**
- General tech blogs
- Forum discussions
- Social media (for trends only)

### 2. Verification Process
1. **Find multiple sources** - Minimum 3 independent sources for key facts
2. **Check publication dates** - Prefer recent sources (< 2 years for tech)
3. **Cross-reference** - Verify facts appear in multiple sources
4. **Document sources** - Record URL, title, author, date

### 3. Citation Format
Always cite sources inline:
```
According to [Source Name]([URL], [Date]), [fact].
```

Example:
```
According to MongoDB's official documentation (https://mongodb.com/docs, 2024-01),
replica sets provide automatic failover.
```

### 4. Separate Verified from Inferred
Use clear markers:
```markdown
## Verified Facts
- [Fact 1] (Source: [URL])
- [Fact 2] (Source: [URL])

## Inferences & Analysis
Based on the verified facts above, we can infer:
- [Inference 1] (reasoning...)
- [Inference 2] (reasoning...)
```

## Code Example: Research Script

```python
#!/usr/bin/env python3
"""
Verified Research Helper
Automates source tracking and citation management
"""

import json
from datetime import datetime

class ResearchTracker:
    def __init__(self):
        self.sources = []
        self.facts = []

    def add_source(self, url, title, author=None, date=None):
        """Record a source"""
        self.sources.append({
            'url': url,
            'title': title,
            'author': author,
            'date': date or datetime.now().isoformat(),
            'tier': self._classify_source(url)
        })

    def _classify_source(self, url):
        """Classify source reliability"""
        tier1_domains = ['mongodb.com/docs', 'python.org', 'github.com']
        if any(d in url for d in tier1_domains):
            return 'Tier 1 - Authoritative'
        return 'Tier 2 - Reliable'

    def add_fact(self, fact, source_urls):
        """Record a verified fact with sources"""
        self.facts.append({
            'fact': fact,
            'sources': source_urls,
            'verified': len(source_urls) >= 3
        })

    def generate_report(self):
        """Generate research report"""
        report = "# Research Report\n\n"
        report += "## Verified Facts\n"
        for f in self.facts:
            if f['verified']:
                report += f"- {f['fact']}\n"
                for url in f['sources']:
                    report += f"  - Source: {url}\n"
        report += "\n## Sources\n"
        for s in self.sources:
            report += f"- [{s['title']}]({s['url']}) ({s['tier']})\n"
        return report

# Usage
tracker = ResearchTracker()
tracker.add_source('https://mongodb.com/docs/manual/replication/',
                   'MongoDB Replication', date='2024-01')
tracker.add_fact('MongoDB replica sets provide automatic failover',
                 ['https://mongodb.com/docs/manual/replication/'])
print(tracker.generate_report())
```

## References
- OWASP Top 10 for LLM Applications (https://owasp.org/www-project-top-10-for-large-language-model-applications/)
- Google's AI Research Guidelines
- Academic citation standards (APA, MLA)
```

---

## Migration Phases

### Phase 1: Foundation (Week 1)
- [ ] Create new directory structure
- [ ] Set up installation script
- [ ] Create configuration system
- [ ] Document conversion guidelines

### Phase 2: Core Workflows (Week 2-3)
- [ ] Convert Phase 1 workflows (Analysis)
- [ ] Convert Phase 2 workflows (Planning)
- [ ] Convert Phase 3 workflows (Solutioning)
- [ ] Convert Phase 4 workflows (Implementation)
- [ ] Test each converted workflow

### Phase 3: Subagents (Week 4)
- [ ] Convert PM agent
- [ ] Convert Architect agent
- [ ] Convert Developer agent
- [ ] Convert TEA agent
- [ ] Convert other agents (Analyst, UX, SM, Tech Writer)
- [ ] Test subagent invocation

### Phase 4: Skills (Week 5)
- [ ] Extract and formalize existing skills
- [ ] Create new skills from patterns
- [ ] Add code examples and scripts
- [ ] Test skill auto-invocation

### Phase 5: Testing & Documentation (Week 6)
- [ ] End-to-end testing
- [ ] Create quickstart guide
- [ ] Create workflow documentation
- [ ] Create subagent documentation
- [ ] Create skill documentation

### Phase 6: Release (Week 7)
- [ ] Publish to NPM
- [ ] Create migration guide for existing users
- [ ] Announce Claude Code native plugin
- [ ] Gather feedback

---

## Benefits of Native Claude Code Plugin

### Performance
- **Zero compilation** - Direct markdown, no YAML parsing
- **Zero runtime overhead** - No custom execution engine
- **Faster startup** - No XML loading or menu rendering

### User Experience
- **Conversational** - Natural Task tool delegation vs menu selection
- **Discoverable** - `/` autocomplete shows all workflows
- **Contextual** - Skills auto-invoke when relevant
- **Stateless** - No menu state to manage

### Maintainability
- **Simpler codebase** - No XML execution engine
- **Standard patterns** - Use Claude Code primitives
- **Easier debugging** - Markdown vs XML parsing
- **Better IDE integration** - Native slash commands

### Extensibility
- **Easy to add workflows** - Just add markdown file
- **Easy to customize** - Edit markdown directly
- **Easy to share** - Copy slash command files
- **Plugin ecosystem** - NPM distribution

---

## Breaking Changes for Users

### What Changes
1. **No more menu-based agents** - Use Task tool instead
2. **No more `.bmad/` compilation** - Direct installation to `~/.claude/`
3. **Slash command format** - `/bmad/{workflow}` instead of `/bmad:{module}:workflows:{workflow}`
4. **Configuration location** - Still `.bmad/config.yaml` in project

### What Stays the Same
1. **Workflow functionality** - Same capabilities, different execution
2. **Output artifacts** - Same PRDs, epics, stories, etc.
3. **Templates** - Same document templates
4. **Process** - Same phases and workflow order
5. **Configuration format** - Same config.yaml structure

### Migration Path for Existing Users
1. **Backup existing** `.bmad/` folder
2. **Uninstall old** BMAD Method
3. **Install new** Claude Code plugin
4. **Copy config** from old `.bmad/config.yaml` to new
5. **Resume work** - All artifacts are compatible

---

## Success Metrics

### Technical
- [ ] Installation < 30 seconds
- [ ] Zero runtime errors
- [ ] 100% workflow coverage
- [ ] All subagents tested
- [ ] All skills documented

### User Experience
- [ ] Faster workflow execution (50%+ improvement)
- [ ] Higher discoverability (autocomplete)
- [ ] Positive user feedback
- [ ] Active usage metrics

### Adoption
- [ ] 100+ downloads in first month
- [ ] 5+ community contributions
- [ ] Migration guide used by existing users
- [ ] Featured in Claude Code plugin directory

---

## Next Steps

1. **Review this plan** - Get feedback from stakeholders
2. **Create GitHub project** - Track migration tasks
3. **Start Phase 1** - Foundation work
4. **Iterate weekly** - Demo progress, gather feedback
5. **Ship MVP** - Core workflows + 3 subagents + 3 skills
6. **Expand gradually** - Add remaining workflows/agents
7. **Community feedback** - Iterate based on usage

---

## Questions to Resolve

1. **Subagent support** - Does Claude Code support custom subagents? Or only via Task tool descriptions?
2. **Skill auto-invocation** - Does Claude reliably auto-invoke skills? Or should we be explicit?
3. **Config management** - Should we use `.bmad/config.yaml` or move to `.claude/config.yaml`?
4. **Template location** - Keep in BMAD repo or install to `~/.claude/templates/bmad/`?
5. **Module separation** - Single plugin with all modules, or separate plugins (bmm, bmb, cis)?

---

**Document Version:** 1.0
**Last Updated:** 2025-01-13
**Author:** BMAD Method Team
**Status:** Draft - Pending Review
