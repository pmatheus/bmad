---
description: Update CLAUDE.md file maps when files are created to maintain navigation index
---

# Update CLAUDE.md - File Map Maintenance

Updates CLAUDE.md file maps when new files are created, maintaining the living documentation that enables AI agents to navigate the project efficiently.

## Purpose

Keeps CLAUDE.md file maps current by automatically adding newly created files. Called by ALL workflows that create files (dev-story, create-story, prd, tech-spec, etc.).

**Key Principles:**
1. **Automatic updates**: Workflows call this, not users
2. **Atomic operations**: Read-modify-write pattern prevents corruption
3. **Size enforcement**: Auto-creates subfolder CLAUDE.md when limits exceeded
4. **Alphabetical order**: Maintains sorted file listings

## Quick Start

```bash
# Typically called by other workflows, not directly
/bmad:meta:update-claude-md

# Workflow will:
# 1. Receive list of files created
# 2. Generate descriptions for each file
# 3. Determine target CLAUDE.md (root vs subfolder)
# 4. Update file map sections alphabetically
# 5. Enforce size limits (420 root, 200 subfolder)
# 6. Create subfolder CLAUDE.md if needed
```

## Prerequisites

See [shared/prerequisites.md#meta-update-claude-md](../shared/prerequisites.md)

**Workflow-specific:**
- [ ] Root CLAUDE.md exists (run generate-claude-md first)
- [ ] Files to add are readable
- [ ] File paths are valid (relative to project root or output_folder)

## Instructions

### 1. Receive File List

**Input**: Array of file paths created/modified

**Expected format:**
```json
[
  "src/components/UserProfile.tsx",
  "src/lib/user-utils.ts",
  "src/app/dashboard/page.tsx",
  "output/stories/3-2.md"
]
```

**Validation:**
- Verify each file path exists
- Verify each file is readable
- Filter out files that shouldn't be in CLAUDE.md:
  - .git/, node_modules/, .next/, __pycache__/
  - .env, .env.local, secrets files
  - Build artifacts

### 2. Generate File Descriptions

**For each file, extract description** (priority order):

**2.1 Try first comment/docstring:**

**JavaScript/TypeScript:**
```javascript
/**
 * User profile card component with avatar and bio
 */
// OR
// User profile card component with avatar and bio
```

**Python:**
```python
"""User profile card component with avatar and bio"""
# OR
# User profile card component with avatar and bio
```

**Rust:**
```rust
/// User profile card component with avatar and bio
// OR
//! User profile card component with avatar and bio
```

**2.2 Try export statement (if no comment):**

**JavaScript/TypeScript:**
```javascript
export function UserProfile() { ... }
// → "UserProfile function"

export class UserService { ... }
// → "UserService class"

export const API_CONFIG = { ... }
// → "API_CONFIG constant"
```

**Python:**
```python
def user_profile(): ...
// → "user_profile function"

class UserService: ...
// → "UserService class"
```

**Rust:**
```rust
pub fn user_profile() { ... }
// → "user_profile function"

pub struct UserService { ... }
// → "UserService struct"
```

**2.3 Infer from filename (fallback):**

```python
def infer_from_filename(filename: str) -> str:
    """Generate description from filename patterns."""

    # Remove extension
    name = filename.rsplit('.', 1)[0]

    # Common patterns
    patterns = {
        'config': 'Configuration settings',
        'utils': 'Utility functions',
        'helpers': 'Helper functions',
        'constants': 'Constant definitions',
        'types': 'Type definitions',
        'index': 'Module entry point',
        'test': 'Test suite',
        'spec': 'Test specifications',
        'page': 'Page component',
        'layout': 'Layout component',
        'route': 'API route handler',
        'model': 'Data model',
        'schema': 'Database schema',
        'migration': 'Database migration'
    }

    # Check for pattern matches
    for pattern, description in patterns.items():
        if pattern in name.lower():
            return description

    # Default: capitalize and humanize filename
    return name.replace('-', ' ').replace('_', ' ').title()
```

**Format description** (5-10 words):
- Keep concise
- Remove articles (a, an, the) if needed for space
- Use present tense
- Be specific enough to distinguish from similar files

### 3. Determine Target CLAUDE.md Files

**For each file, determine which CLAUDE.md to update:**

**3.1 Extract directory:**
```python
directory = os.path.dirname(file_path)
```

**3.2 Check if subfolder CLAUDE.md exists:**
```python
subfolder_claude = os.path.join(directory, "CLAUDE.md")
if os.path.exists(subfolder_claude):
    target = subfolder_claude
else:
    target = "CLAUDE.md"  # Root
```

**3.3 Check if should create subfolder CLAUDE.md:**

**Conditions for creating subfolder CLAUDE.md:**
- Directory now has > 30 files
- Root CLAUDE.md would exceed 420 lines after update

**If conditions met:**
```python
if count_files_in_directory(directory) > 30:
    create_subfolder_claude_md(directory)
    move_directory_files_from_root_to_subfolder(directory)
    update_root_with_directory_summary(directory)
    target = subfolder_claude
```

**3.4 Always update root directory summary:**
- Even if file added to subfolder CLAUDE.md
- Update root's directory file count
- Ensure root has link to subfolder CLAUDE.md

### 4. Update File Map Section

**4.1 For Root CLAUDE.md:**

**Locate "## File Map" section:**
```python
content = read_file("CLAUDE.md")
sections = parse_markdown_sections(content)
file_map_section = sections["File Map"]
```

**Find appropriate directory subsection:**
```markdown
## File Map

### Source Code
- **src/app/** (24 files) - Next.js app router pages
  - See src/app/CLAUDE.md for detailed listing
- **src/components/** (15 files) - React components
  - Button.tsx - Primary button with variants
  - Input.tsx - Form input with validation
  ... ← Insert new file here
```

**If file is first in directory:**
```python
if directory not in file_map_section:
    # Create new directory subsection
    file_map_section += f"\n- **{directory}/** (1 file) - {directory_description}\n"
```

**Insert file entry alphabetically:**
```python
# Find insertion point (alphabetical order)
lines = file_map_section.split('\n')
directory_lines = [l for l in lines if l.startswith(f'  - {directory}/')]

# Insert new file in sorted position
new_entry = f"  - {filename} - {description}"
directory_lines_sorted = sorted(directory_lines + [new_entry])

# Replace old lines with sorted lines
file_map_section = '\n'.join(lines_with_new_sorted_entries)
```

**Update directory file count:**
```python
# Find directory header line
# e.g., "- **src/components/** (15 files) - React components"
# Increment count: (15 files) → (16 files)
directory_header = re.sub(
    r'\((\d+) files?\)',
    lambda m: f'({int(m.group(1)) + 1} files)',
    directory_header
)
```

**4.2 For Subfolder CLAUDE.md:**

**Locate "## File Map" section:**
```python
content = read_file(f"{directory}/CLAUDE.md")
sections = parse_markdown_sections(content)
file_map_section = sections["File Map"]
```

**Insert file entry alphabetically:**
```markdown
## File Map

- **ComponentA.tsx** - Primary component for feature X
- **ComponentB.tsx** - Secondary component for feature Y
- **NewFile.tsx** - {description}  ← Insert here (alphabetically)
- **helpers.ts** - Utility functions
```

**Simpler than root** (no directory grouping, just flat list):
```python
lines = file_map_section.split('\n')
new_entry = f"- **{filename}** - {description}"
sorted_lines = sorted(lines + [new_entry])
file_map_section = '\n'.join(sorted_lines)
```

### 5. Enforce Size Limits

**After updates, check line counts:**

**5.1 If Root CLAUDE.md > 420 lines:**

**Step 1: Identify largest directory section** (most files):
```python
def find_largest_directory_section(file_map):
    """Find directory with most files in root file map."""
    directories = {}

    for line in file_map.split('\n'):
        # Match: "- **src/components/** (15 files) - ..."
        match = re.search(r'\*\*(.+?)/\*\* \((\d+) files?\)', line)
        if match:
            dir_path, file_count = match.groups()
            directories[dir_path] = int(file_count)

    # Return directory with most files
    return max(directories.items(), key=lambda x: x[1])[0]
```

**Step 2: Create subfolder CLAUDE.md for that directory:**
```python
largest_dir = find_largest_directory_section(file_map)
create_subfolder_claude_md(largest_dir)
```

**Step 3: Move all file entries from root to subfolder:**
```python
# Extract all file entries for this directory from root
directory_files = extract_directory_files_from_root(largest_dir)

# Create subfolder CLAUDE.md with these files
create_subfolder_claude_with_files(largest_dir, directory_files)

# Remove individual file entries from root
remove_directory_files_from_root(largest_dir)

# Replace with directory summary in root
replace_with_directory_summary(largest_dir)
```

**Step 4: Verify root now ≤ 420 lines:**
```python
root_lines = count_lines("CLAUDE.md")
assert root_lines <= 420, f"Still exceeds 420 lines ({root_lines})"
```

**5.2 If Subfolder CLAUDE.md > 200 lines:**

**Step 1: Compress descriptions:**
```python
def compress_description(description: str) -> str:
    """Reduce description to 3-5 words."""

    # Remove articles
    description = re.sub(r'\b(a|an|the)\b\s*', '', description, flags=re.IGNORECASE)

    # Common abbreviations
    abbreviations = {
        'component': 'comp',
        'function': 'fn',
        'utility': 'util',
        'configuration': 'config',
        'definition': 'def',
        'management': 'mgmt',
        'authentication': 'auth',
        'authorization': 'authz'
    }

    for full, abbrev in abbreviations.items():
        description = description.replace(full, abbrev)

    # Limit to first 5 words
    words = description.split()[:5]
    return ' '.join(words)
```

**Step 2: If still > 200 lines, split directory:**
```python
# Split into logical sub-directories
# e.g., src/components/ → src/components/ui/, src/components/forms/

# Create sub-directory CLAUDE.md files
for sub_dir in sub_directories:
    create_subfolder_claude_md(sub_dir)

# Update parent with sub-directory summaries
update_parent_with_subdirectory_summaries()
```

### 6. Atomic Update Pattern

**Use read-modify-write pattern** to prevent corruption:

```python
def update_claude_md_atomic(file_path: str, updates: list[dict]):
    """
    Atomically update CLAUDE.md file map.

    Args:
        file_path: Path to CLAUDE.md
        updates: List of {file_path, description} dicts
    """
    # 1. Read current content
    with open(file_path, 'r') as f:
        content = f.read()

    # 2. Parse sections
    sections = parse_markdown_sections(content)

    # 3. Update file map section
    file_map = sections.get("File Map", "")

    for update in updates:
        file_path = update['file_path']
        description = update['description']

        # Insert alphabetically
        file_map = insert_file_entry_alphabetically(
            file_map,
            file_path,
            description
        )

    sections["File Map"] = file_map

    # 4. Reassemble content
    updated_content = reassemble_sections(sections)

    # 5. Check size
    line_count = len(updated_content.split('\n'))
    max_lines = 420 if file_path.endswith("CLAUDE.md") else 200

    if line_count > max_lines:
        updated_content = enforce_size_limit(updated_content, max_lines)

    # 6. Write atomically (write to temp, then move)
    temp_file = file_path + ".tmp"
    with open(temp_file, 'w') as f:
        f.write(updated_content)

    os.replace(temp_file, file_path)  # Atomic on Unix

    # 7. Verify
    verify_line_count(file_path, max_lines)
```

### 7. Handle Edge Cases

**7.1 New Directory Created:**

**If entire directory created with multiple files:**
```python
new_directory = detect_new_directory(file_paths)
if new_directory:
    # Add directory summary to root
    add_directory_summary_to_root(new_directory)

    # If created with > 30 files, create subfolder CLAUDE.md immediately
    if count_files_in_directory(new_directory) > 30:
        create_subfolder_claude_md(new_directory)
```

**7.2 File Moved/Renamed:**

**Input includes old_path and new_path:**
```python
if update_type == "rename":
    # Remove old entry from file map
    remove_file_entry(old_path)

    # Add new entry in correct location
    add_file_entry(new_path, description)
```

**7.3 File Deleted:**

**Input includes deleted file paths:**
```python
if update_type == "delete":
    # Remove entry from file map
    remove_file_entry(file_path)

    # Update directory file count
    decrement_directory_file_count(directory)

    # If directory now empty, remove directory section
    if count_files_in_directory(directory) == 0:
        remove_directory_section(directory)
```

**7.4 Batch Updates:**

**Multiple files created at once** (e.g., dev-story creates 8 files):

```python
def update_claude_md_batch(file_updates: list[dict]):
    """
    Update CLAUDE.md for multiple files at once.

    Args:
        file_updates: List of {file_path, description} dicts
    """
    # Group updates by target CLAUDE.md
    updates_by_target = {}
    for update in file_updates:
        target = determine_target_claude_md(update['file_path'])
        if target not in updates_by_target:
            updates_by_target[target] = []
        updates_by_target[target].append(update)

    # Process all files before writing
    # Single atomic update per CLAUDE.md file
    for target, updates in updates_by_target.items():
        update_claude_md_atomic(target, updates)

    # Maintain alphabetical order throughout
    verify_alphabetical_order(target)
```

### 8. Update Metadata

**Update last updated timestamp** (in subfolder CLAUDE.md):

```markdown
---

**Last Updated**: {ISO 8601 timestamp}
**Files**: {updated file count}
```

**Example:**
```markdown
---

**Last Updated**: 2025-01-17T10:30:00Z
**Files**: 47
```

### 9. Verification

**After all updates complete:**

**9.1 Verify line counts:**
```python
root_lines = count_lines("CLAUDE.md")
assert root_lines <= 420, f"Root exceeds 420 lines ({root_lines})"

for subfolder_claude in find_all_subfolder_claudes():
    lines = count_lines(subfolder_claude)
    assert lines <= 200, f"{subfolder_claude} exceeds 200 lines ({lines})"
```

**9.2 Verify alphabetical order:**
```python
def verify_alphabetical_order(claude_md_path: str):
    """Verify file entries are alphabetically sorted."""
    content = read_file(claude_md_path)
    file_map = extract_file_map_section(content)

    # Extract file entries
    file_entries = [line for line in file_map.split('\n') if line.startswith('- **')]

    # Verify sorted
    sorted_entries = sorted(file_entries)
    assert file_entries == sorted_entries, "File map not alphabetically sorted"
```

**9.3 Verify no duplicates:**
```python
def verify_no_duplicates(claude_md_path: str):
    """Verify no duplicate file entries."""
    content = read_file(claude_md_path)
    file_map = extract_file_map_section(content)

    # Extract file names
    file_names = [
        re.search(r'\*\*(.+?)\*\*', line).group(1)
        for line in file_map.split('\n')
        if line.startswith('- **')
    ]

    # Verify unique
    assert len(file_names) == len(set(file_names)), "Duplicate file entries found"
```

### 10. Report Results

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
  - {action description if any, e.g., "Created src/lib/CLAUDE.md (directory exceeded 30 files)"}
  - {action description if any, e.g., "Compressed descriptions in src/components/CLAUDE.md (approaching 200 line limit)"}

Status: All file maps current and within size limits
```

## Key Constraints

- **Atomic updates**: Read-modify-write pattern prevents corruption
- **Size enforcement**: Strict limits (420 root, 200 subfolder) automatically enforced
- **Alphabetical order**: Always maintain sorted file listings
- **No duplicates**: Prevent duplicate file entries
- **Automatic subfolder creation**: Create subfolder CLAUDE.md when directory > 30 files or root > 420 lines
- **Batch efficiency**: Process multiple files in single update per CLAUDE.md
- **Metadata currency**: Update timestamps and file counts

## Auto-Continue

**NO auto-continue** - This workflow completes independently.

Called by other workflows as final step after file creation.

## Notes

- **Called by workflows, not users**: This is an internal workflow
- **File description quality**: Meaningful descriptions critical for navigation
- **Size discipline**: Strict enforcement prevents bloat
- **Alphabetical order**: Makes files easy to find
- **Atomic operations**: Prevents corruption from concurrent updates
- **Subfolder auto-creation**: Scales to large projects automatically
- **Batch processing**: Efficient for workflows that create many files
- **Metadata maintenance**: Timestamps track freshness

**Philosophy**: CLAUDE.md file map is navigation index, not documentation. Keep entries concise, sorted, and current. Auto-create subfolders to scale to any project size while maintaining strict size limits.

---

**References:**
- Examples: [examples/update-claude-md-examples.md](../examples/update-claude-md-examples.md)
- Common Operations: [shared/common-operations.md](../shared/common-operations.md)
- Prerequisites: [shared/prerequisites.md](../shared/prerequisites.md)
- Generation Workflow: [meta/generate-claude-md.md](generate-claude-md.md)
