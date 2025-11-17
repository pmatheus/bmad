# CLAUDE.md Workflow Implementation Summary

## ✅ Completed Files

### Core Workflows Created
1. **commands/meta/generate-claude-md.md** - Initial CLAUDE.md generation with profile inheritance
2. **commands/meta/update-claude-md.md** - File map maintenance workflow

### Documentation Updated
3. **commands/shared/common-operations.md** - Added CLAUDE.md operations section
4. **commands/shared/prerequisites.md** - Added prerequisites for new workflows
5. **commands/shared/claude-md-update-template.md** - Template for adding to workflows

### Critical Integration
6. **commands/meta/workflow-init.md** - Added Step 3.5 (CLAUDE.md check)
7. **commands/phase-4/bring-to-life.md** - Added Step 1.5 (CLAUDE.md validation)

## 📋 Remaining Tasks

### Phase 2 Workflows (Planning) - ADD FINAL STEP

All files in `commands/phase-2/`:

#### 1. prd.md
**Location:** Add as final step after PRD creation
**Files created:** `{output_folder}/PRD.md`

```markdown
### Final Step: Update CLAUDE.md

**Files created in this workflow:**
- PRD.md

**Update CLAUDE.md:**
```python
files_created = [f"{output_folder}/PRD.md"]

Task(
    subagent_type="general-purpose",
    description="Update CLAUDE.md file map",
    prompt=f"""
    Update CLAUDE.md file maps for newly created files.

    Files created: {files_created}

    Use /bmad:meta:update-claude-md workflow.
    """
)
```

**Purpose:** Adds PRD to documentation section of file map
```

#### 2. tech-spec.md
**Location:** Add as final step after tech spec creation
**Files created:** `{output_folder}/tech-spec.md`

```markdown
### Final Step: Update CLAUDE.md

**Files created in this workflow:**
- tech-spec.md

**Update CLAUDE.md:**
```python
files_created = [f"{output_folder}/tech-spec.md"]

Task(
    subagent_type="general-purpose",
    description="Update CLAUDE.md file map",
    prompt=f"""
    Update CLAUDE.md file maps for newly created files.

    Files created: {files_created}

    Use /bmad:meta:update-claude-md workflow.
    """
)
```

**Purpose:** Adds tech spec to documentation section of file map
```

#### 3. create-epics-and-stories.md
**Location:** Add as final step after epic files created
**Files created:** `{output_folder}/epic-*.md` (multiple files)

```markdown
### Final Step: Update CLAUDE.md

**Files created in this workflow:**
- epic-1.md, epic-2.md, epic-3.md, etc.

**Update CLAUDE.md:**
```python
# Collect all epic files created
epic_files = glob.glob(f"{output_folder}/epic-*.md")
files_created = [f for f in epic_files if f not in existing_files]

Task(
    subagent_type="general-purpose",
    description="Update CLAUDE.md file map",
    prompt=f"""
    Update CLAUDE.md file maps for newly created files.

    Files created: {files_created}

    Use /bmad:meta:update-claude-md workflow.
    """
)
```

**Purpose:** Adds all epic files to planning artifacts section
```

### Phase 3 Workflows (Architecture) - ADD FINAL STEP

#### 4. commands/phase-3/architecture.md
**Location:** Add as final step after architecture doc created
**Files created:** `{output_folder}/architecture.md`

```markdown
### Final Step: Update CLAUDE.md

**Files created in this workflow:**
- architecture.md

**Update CLAUDE.md:**
```python
files_created = [f"{output_folder}/architecture.md"]

Task(
    subagent_type="general-purpose",
    description="Update CLAUDE.md file map",
    prompt=f"""
    Update CLAUDE.md file maps for newly created files.

    Files created: {files_created}

    Use /bmad:meta:update-claude-md workflow.

    Additionally, update the "Core Context & Purpose" section
    to reflect architectural decisions from architecture.md.
    """
)
```

**Purpose:** Adds architecture doc + updates core context section
```

### Phase 4 Workflows (Implementation) - ADD FINAL STEP

All files in `commands/phase-4/`:

#### 5. create-story.md
**Location:** Add as final step after story file created
**Files created:** `{sprint_artifacts}/stories/{story-key}.md`

```markdown
### Final Step: Update CLAUDE.md

**Files created in this workflow:**
- stories/{story-key}.md

**Update CLAUDE.md:**
```python
files_created = [f"{sprint_artifacts}/stories/{story_key}.md"]

Task(
    subagent_type="general-purpose",
    description="Update CLAUDE.md file map",
    prompt=f"""
    Update CLAUDE.md file maps for newly created files.

    Files created: {files_created}

    Use /bmad:meta:update-claude-md workflow.
    """
)
```

**Purpose:** Adds story file to sprint artifacts section
```

#### 6. dev-story.md ⭐ **MOST IMPORTANT**
**Location:** Add as final step after source code files created
**Files created:** Multiple source files (components, utils, types, tests, etc.)

```markdown
### Final Step: Update CLAUDE.md

**Files created in this workflow:**
- All source code files implemented during story development

**Update CLAUDE.md:**
```python
# Collect all files created during story implementation
files_created = [
    # Examples (actual files will vary by story):
    "src/components/UserProfile.tsx",
    "src/components/__tests__/UserProfile.test.tsx",
    "src/lib/user-utils.ts",
    "src/types/user.ts"
]

Task(
    subagent_type="general-purpose",
    description="Update CLAUDE.md file map",
    prompt=f"""
    Update CLAUDE.md file maps for newly created files.

    Files created: {files_created}

    Use /bmad:meta:update-claude-md workflow.

    This is critical for maintaining navigation across stories.
    """
)
```

**Purpose:** Adds all source files to appropriate sections (src/, lib/, components/, etc.)
**Note:** This is the most important update as dev-story creates the most files
```

#### 7. epic-tech-context.md
**Location:** Add as final step after epic context created
**Files created:** `{sprint_artifacts}/epic-{N}-context.md`

```markdown
### Final Step: Update CLAUDE.md

**Files created in this workflow:**
- epic-{N}-context.md

**Update CLAUDE.md:**
```python
files_created = [f"{sprint_artifacts}/epic-{epic_number}-context.md"]

Task(
    subagent_type="general-purpose",
    description="Update CLAUDE.md file map",
    prompt=f"""
    Update CLAUDE.md file maps for newly created files.

    Files created: {files_created}

    Use /bmad:meta:update-claude-md workflow.
    """
)
```

**Purpose:** Adds epic context to sprint artifacts section
```

#### 8. sprint-planning.md
**Location:** Add as final step after sprint status created
**Files created:** `{sprint_artifacts}/sprint-status.yaml`

```markdown
### Final Step: Update CLAUDE.md

**Files created in this workflow:**
- sprint-status.yaml

**Update CLAUDE.md:**
```python
files_created = [f"{sprint_artifacts}/sprint-status.yaml"]

Task(
    subagent_type="general-purpose",
    description="Update CLAUDE.md file map",
    prompt=f"""
    Update CLAUDE.md file maps for newly created files.

    Files created: {files_created}

    Use /bmad:meta:update-claude-md workflow.
    """
)
```

**Purpose:** Adds sprint status to sprint artifacts section
```

#### 9. security-test.md (Conditional)
**Location:** Add as final step IF test files were created
**Files created:** Varies (test files if created)

```markdown
### Final Step: Update CLAUDE.md (If Files Created)

**Files created in this workflow:**
- {Conditional - only if test files were created}

**Update CLAUDE.md:**
```python
if files_created:  # Only if security testing created new test files
    Task(
        subagent_type="general-purpose",
        description="Update CLAUDE.md file map",
        prompt=f"""
        Update CLAUDE.md file maps for newly created files.

        Files created: {files_created}

        Use /bmad:meta:update-claude-md workflow.
        """
    )
```

**Purpose:** Adds security test files if created
**Note:** This is conditional - only update if files were actually created
```

### Phase 1 Workflows (Discovery) - ADD FINAL STEP

#### 10. commands/phase-1/product-brief.md
**Location:** Add as final step after brief created
**Files created:** `{output_folder}/brief.md`

```markdown
### Final Step: Update CLAUDE.md

**Files created in this workflow:**
- brief.md

**Update CLAUDE.md:**
```python
files_created = [f"{output_folder}/brief.md"]

Task(
    subagent_type="general-purpose",
    description="Update CLAUDE.md file map",
    prompt=f"""
    Update CLAUDE.md file maps for newly created files.

    Files created: {files_created}

    Use /bmad:meta:update-claude-md workflow.
    """
)
```

**Purpose:** Adds product brief to documentation section
```

### Meta Workflows - ALREADY UPDATED

#### ✅ workflow-init.md
**Status:** COMPLETED - Step 3.5 added for CLAUDE.md check

### Summary of Remaining Work

**Total files to update:** 10 workflows
- Phase 1: 1 file (product-brief.md)
- Phase 2: 3 files (prd.md, tech-spec.md, create-epics-and-stories.md)
- Phase 3: 1 file (architecture.md)
- Phase 4: 5 files (create-story.md, dev-story.md, epic-tech-context.md, sprint-planning.md, security-test.md)

**Priority:**
1. **High Priority:** dev-story.md (creates most files)
2. **High Priority:** create-story.md (frequently used)
3. **Medium Priority:** prd.md, tech-spec.md, architecture.md, create-epics-and-stories.md
4. **Lower Priority:** product-brief.md, epic-tech-context.md, sprint-planning.md, security-test.md

### Example Files to Create

#### 11. commands/examples/generate-claude-md-examples.md
Should include examples of:
- Small Next.js project (50 files) - Root only
- Medium Python project (150 files) - Root + 2 subfolders
- Large monorepo (500 files) - Root + 10 subfolders
- Project with PRD (tech stack extraction)
- Regeneration after deletion
- Profile inheritance visualization (default + nextjs)

#### 12. commands/examples/update-claude-md-examples.md
Should include examples of:
- Single file added to existing directory
- New directory created with 5 files
- Directory grows from 25→35 files (triggers subfolder CLAUDE.md creation)
- Root exceeds 420 lines (auto-split)
- Batch update (dev-story creates 8 files)

## Implementation Notes

### For Each Workflow Update:
1. Find the final step (usually after file creation completes)
2. Add new section: "### Final Step: Update CLAUDE.md"
3. Use template from claude-md-update-template.md
4. Customize files_created list for that specific workflow
5. Add workflow-specific purpose note

### Pattern to Follow:
```markdown
### Final Step: Update CLAUDE.md

**Files created:** {list}
**Update CLAUDE.md:** {Task call to update-claude-md}
**Purpose:** {why this matters}
```

### Testing Checklist:
- [ ] All 10 workflows updated with final step
- [ ] Each workflow specifies correct files_created
- [ ] Task calls use correct subagent_type
- [ ] Example files created with realistic scenarios
- [ ] All references to shared docs are correct

## Key Design Decisions

1. **Profile Inheritance:** ALWAYS copy default + specific profile (not just specific)
2. **Size Limits:** Strict enforcement (420 root, 200 subfolder) with auto-splitting
3. **Living Document:** Auto-updated by workflows, not manual editing
4. **Non-blocking:** CLAUDE.md generation is helpful but not required
5. **Atomic Updates:** Read-modify-write pattern prevents corruption
6. **Alphabetical Order:** Always maintained for easy file finding

## Future Enhancements

- Auto-regenerate CLAUDE.md when profile updated
- Detect when CLAUDE.md needs refresh (file map incomplete)
- Add CLAUDE.md diff viewer (show what changed)
- Support for custom profile creation
- CLAUDE.md templates for common project types
