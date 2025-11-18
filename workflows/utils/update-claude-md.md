---
description: Update CLAUDE.md file maps when files are created to maintain navigation index
---

# Update CLAUDE.md - File Map Maintenance

## Purpose

Updates CLAUDE.md file maps when new files are created, maintaining the living documentation that enables AI agents to navigate the project efficiently. This workflow is called by ALL workflows that create files (dev-story, create-story, prd, tech-spec, etc.) to automatically keep the file maps current.

**Key Principles:**
1. **Automatic updates**: Workflows call this, not users
2. **Atomic operations**: Read-modify-write pattern prevents corruption
3. **Size enforcement**: Auto-creates subfolder CLAUDE.md when limits exceeded
4. **Alphabetical order**: Maintains sorted file listings

## Variables

- **file_paths**: Array of file paths created/modified that need to be added to CLAUDE.md
  - Format: `["src/components/UserProfile.tsx", "src/lib/user-utils.ts", "output/stories/3-2.md"]`
  - Can be passed as JSON array or newline-separated list
- **update_type**: Type of update operation (default: "add")
  - Values: "add", "rename", "delete", "batch"
- **old_path**: Previous file path (only for rename operations)
- **new_path**: New file path (only for rename operations)
- **documentation_dir**: Project documentation root directory (default: project root)
- **max_root_lines**: Maximum lines for root CLAUDE.md (default: 420)
- **max_subfolder_lines**: Maximum lines for subfolder CLAUDE.md (default: 200)
- **directory_split_threshold**: File count to trigger subfolder CLAUDE.md creation (default: 30)

## Instructions

### 1. Receive and Validate File List

**Input**: Array of file paths created/modified

**Validation steps:**
1. Verify each file path exists and is readable
2. Filter out files that shouldn't be in CLAUDE.md:
   - .git/, node_modules/, .next/, __pycache__/
   - .env, .env.local, secrets files
   - Build artifacts
3. Convert relative paths to absolute paths if needed
4. Deduplicate file list

### 2. Generate File Descriptions

**For each file, extract description using priority order:**

**2.1 Try first comment/docstring:**
- **JavaScript/TypeScript**: `/** ... */` or `// ...` at top of file
- **Python**: `"""..."""` or `# ...` at top of file
- **Rust**: `/// ...` or `//! ...` at top of file
- **Markdown**: Frontmatter description or first heading

**2.2 Try export statement (if no comment):**
- Extract main function, class, or constant name
- Generate description: "{name} {type}" (e.g., "UserProfile function")

**2.3 Infer from filename (fallback):**
- Use common patterns (config, utils, helpers, types, etc.)
- Default: capitalize and humanize filename

**Format requirements:**
- 5-10 words maximum
- Remove articles (a, an, the) if needed for space
- Use present tense
- Be specific enough to distinguish from similar files

### 3. Determine Target CLAUDE.md Files

**For each file:**

1. **Extract directory**: Get parent directory of file
2. **Check if subfolder CLAUDE.md exists**: If yes, use subfolder; if no, use root
3. **Check if should create subfolder CLAUDE.md**:
   - Directory now has > 30 files (directory_split_threshold)
   - Root CLAUDE.md would exceed 420 lines after update
4. **If conditions met**: Create subfolder CLAUDE.md and migrate directory files from root

### 4. Update File Map Section

**4.1 For Root CLAUDE.md:**
- Locate "## File Map" section
- Find appropriate directory subsection
- Insert file entry alphabetically within directory group
- Update directory file count: `(15 files)` → `(16 files)`
- Add directory summary if first file in new directory

**4.2 For Subfolder CLAUDE.md:**
- Locate "## File Map" section
- Insert file entry alphabetically (flat list, no grouping)
- Simpler structure than root

**Alphabetical sorting:**
- Files must be sorted alphabetically within their sections
- Case-insensitive sorting
- Maintain consistent indentation

### 5. Enforce Size Limits

**After updates, check line counts:**

**5.1 If Root CLAUDE.md > 420 lines:**
1. Identify largest directory section (most files)
2. Create subfolder CLAUDE.md for that directory
3. Move all file entries from root to subfolder
4. Replace with directory summary in root
5. Verify root now ≤ 420 lines

**5.2 If Subfolder CLAUDE.md > 200 lines:**
1. Compress descriptions (remove articles, use abbreviations)
2. If still > 200 lines, split directory into sub-directories
3. Create sub-directory CLAUDE.md files
4. Update parent with sub-directory summaries

### 6. Atomic Update Pattern

**Use read-modify-write pattern to prevent corruption:**
1. Read current CLAUDE.md content
2. Parse markdown sections
3. Update file map section with new entries
4. Reassemble content
5. Check size limits
6. Write to temp file
7. Atomically replace original (os.replace)
8. Verify line count and alphabetical order

### 7. Handle Edge Cases

**7.1 New Directory Created:**
- Add directory summary to root
- If created with > 30 files, create subfolder CLAUDE.md immediately

**7.2 File Moved/Renamed:**
- Remove old entry from file map
- Add new entry in correct location

**7.3 File Deleted:**
- Remove entry from file map
- Update/decrement directory file count
- Remove directory section if directory now empty

**7.4 Batch Updates:**
- Group updates by target CLAUDE.md
- Process all files before writing
- Single atomic update per CLAUDE.md file
- Maintain alphabetical order throughout

### 8. Update Metadata

**For subfolder CLAUDE.md files, update footer:**
```markdown
---

**Last Updated**: {ISO 8601 timestamp}
**Files**: {updated file count}
```

### 9. Verification

**After all updates complete:**
1. **Verify line counts**: Root ≤ 420, subfolders ≤ 200
2. **Verify alphabetical order**: File entries are sorted
3. **Verify no duplicates**: No duplicate file entries exist
4. **Verify all files added**: Cross-check input list with updates

## Workflow

```
START
  │
  ├─→ [1] Receive file list
  │     │
  │     ├─→ Validate file paths exist
  │     ├─→ Filter excluded patterns
  │     └─→ Deduplicate list
  │
  ├─→ [2] Generate descriptions for each file
  │     │
  │     ├─→ Try first comment/docstring
  │     ├─→ Try export statement
  │     └─→ Infer from filename (fallback)
  │
  ├─→ [3] Determine target CLAUDE.md for each file
  │     │
  │     ├─→ Check if subfolder CLAUDE.md exists
  │     ├─→ Check if should create subfolder CLAUDE.md
  │     └─→ Group files by target CLAUDE.md
  │
  ├─→ [4] For each target CLAUDE.md:
  │     │
  │     ├─→ Read current content (atomic)
  │     ├─→ Parse "## File Map" section
  │     ├─→ Insert new entries alphabetically
  │     ├─→ Update directory file counts
  │     └─→ Reassemble content
  │
  ├─→ [5] Enforce size limits
  │     │
  │     ├─→ Check root ≤ 420 lines
  │     │     └─→ If exceeded: create subfolder CLAUDE.md for largest directory
  │     │
  │     └─→ Check subfolders ≤ 200 lines
  │           └─→ If exceeded: compress descriptions or split directory
  │
  ├─→ [6] Atomic write for each CLAUDE.md
  │     │
  │     ├─→ Write to temporary file
  │     ├─→ Atomically replace original
  │     └─→ Verify file written
  │
  ├─→ [7] Update metadata
  │     │
  │     └─→ Update timestamp and file count in subfolder CLAUDE.md
  │
  ├─→ [8] Verification
  │     │
  │     ├─→ Verify line counts within limits
  │     ├─→ Verify alphabetical order
  │     ├─→ Verify no duplicates
  │     └─→ Verify all files added
  │
  └─→ [9] Report results
        │
        └─→ END
```

**Edge Case Handling:**
- **New directory**: Add directory summary, check if needs subfolder CLAUDE.md
- **Rename**: Remove old entry, add new entry
- **Delete**: Remove entry, update counts, cleanup empty sections
- **Batch**: Group by target, single atomic update per file

**Key Constraints:**
- **Atomic updates**: Read-modify-write prevents corruption
- **Size enforcement**: 420 root, 200 subfolder (strict)
- **Alphabetical order**: Always maintain sorted listings
- **No duplicates**: Prevent duplicate entries
- **Automatic subfolder creation**: When directory > 30 files or root > 420 lines
- **Batch efficiency**: Process multiple files in single update

## Report

**Success Report Format:**

```
✅ CLAUDE.md Updated

Files added: {count}
  - {file_path} → {target_claude_md}
  - {file_path} → {target_claude_md}
  ...

CLAUDE.md files updated:
  - CLAUDE.md ({line_count} lines) - Within limit ✓
  - src/components/CLAUDE.md ({line_count} lines) - Within limit ✓
  - src/app/CLAUDE.md ({line_count} lines) - Within limit ✓

Actions taken:
  - {action description if any}
  - {action description if any}

Status: All file maps current and within size limits
```

**Actions to report:**
- Created subfolder CLAUDE.md (specify directory and reason)
- Compressed descriptions (specify which CLAUDE.md and why)
- Split directory into sub-directories (specify which)
- Migrated entries from root to subfolder (specify which)

**Error Report Format:**

```
❌ CLAUDE.md Update Failed

Error: {error message}

Failed files:
  - {file_path}: {specific error}
  - {file_path}: {specific error}

Successfully added:
  - {file_path} → {target_claude_md}

Recommendations:
  - {suggested action}
  - {suggested action}
```

**Verification Summary:**
- Line counts for all CLAUDE.md files
- Alphabetical order status
- Duplicate check status
- Files processed vs. files added

**Prerequisites:**
- Root CLAUDE.md exists (run generate-claude-md first if missing)
- Files to add are readable
- File paths are valid (relative to project root or documentation_dir)
- No concurrent updates to CLAUDE.md files

---

**Notes:**
- **Called by workflows, not users**: This is an internal workflow
- **File description quality**: Meaningful descriptions critical for navigation
- **Size discipline**: Strict enforcement prevents bloat
- **Alphabetical order**: Makes files easy to find
- **Atomic operations**: Prevents corruption from concurrent updates
- **Subfolder auto-creation**: Scales to large projects automatically
- **Batch processing**: Efficient for workflows that create many files
- **Metadata maintenance**: Timestamps track freshness

**Philosophy**: CLAUDE.md file map is navigation index, not documentation. Keep entries concise, sorted, and current. Auto-create subfolders to scale to any project size while maintaining strict size limits.

**References:**
- Examples: [examples/update-claude-md-examples.md](../examples/update-claude-md-examples.md)
- Common Operations: [shared/common-operations.md](../shared/common-operations.md)
- Prerequisites: [shared/prerequisites.md](../shared/prerequisites.md)
- Generation Workflow: [meta/generate-claude-md.md](generate-claude-md.md)
