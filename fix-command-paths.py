#!/usr/bin/env python3
"""
BMAD Command Path Fix Script
Fixes all incorrect slash command references
"""

import os
import re
from pathlib import Path
from datetime import datetime
import shutil

# Command path mappings
REPLACEMENTS = {
    # Meta commands
    "/bmad/workflow-init": "/bmad:meta:workflow-init",

    # CIS commands
    "/bmad/design-thinking": "/bmad:cis:design-thinking",
    "/bmad/innovation-strategy": "/bmad:cis:innovation-strategy",
    "/bmad/problem-solving": "/bmad:cis:problem-solving",
    "/bmad/storytelling": "/bmad:cis:storytelling",

    # Phase 1 commands
    "/bmad/brainstorm-project": "/bmad:phase-1:brainstorm-project",
    "/bmad/document-project": "/bmad:phase-1:document-project",
    "/bmad/domain-research": "/bmad:phase-1:domain-research",
    "/bmad/product-brief": "/bmad:phase-1:product-brief",
    "/bmad/research": "/bmad:phase-1:research",

    # Phase 2 commands
    "/bmad/create-epics-and-stories": "/bmad:phase-2:create-epics-and-stories",
    "/bmad/prd": "/bmad:phase-2:prd",
    "/bmad/tech-spec": "/bmad:phase-2:tech-spec",
    "/bmad/prd-validation-checklist": "/bmad:phase-2:prd-validation-checklist",

    # Phase 3 commands
    "/bmad/architecture": "/bmad:phase-3:architecture",

    # Phase 4 commands
    "/bmad/code-review": "/bmad:phase-4:code-review",
    "/bmad/create-story": "/bmad:phase-4:create-story",
    "/bmad/dev-story": "/bmad:phase-4:dev-story",
    "/bmad/epic-tech-context": "/bmad:phase-4:epic-tech-context",
    "/bmad/retrospective": "/bmad:phase-4:retrospective",
    "/bmad/security-test": "/bmad:phase-4:security-test",
    "/bmad/sprint-planning": "/bmad:phase-4:sprint-planning",
    "/bmad/story-context": "/bmad:phase-4:story-context",
    "/bmad/story-done": "/bmad:phase-4:story-done",
    "/bmad/story-ready": "/bmad:phase-4:story-ready",

    # Workflow status (no directory prefix)
    "/bmad/workflow-status": "/bmad:workflow-status",
}

def create_backup():
    """Create backup of commands directory"""
    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    backup_dir = f".command-path-backups-{timestamp}"

    print(f"📦 Creating backup in {backup_dir}...")
    shutil.copytree("commands", f"{backup_dir}/commands")
    return backup_dir

def fix_file(file_path):
    """Fix command paths in a single file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content
        changes = []

        # Apply all replacements
        for old_path, new_path in REPLACEMENTS.items():
            if old_path in content:
                content = content.replace(old_path, new_path)
                changes.append(f"{old_path} → {new_path}")

        # Only write if changed
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True, changes

        return False, []

    except Exception as e:
        print(f"  ⚠️  Error fixing {file_path}: {e}")
        return False, []

def main():
    print("🔧 Fixing BMAD Command Paths...")
    print()

    # Create backup
    backup_dir = create_backup()
    print()

    # Find all markdown files
    print("🔍 Scanning and fixing command files...")
    print()

    commands_dir = Path("commands")
    markdown_files = list(commands_dir.rglob("*.md"))

    fixed_count = 0
    total_changes = 0

    for file_path in markdown_files:
        changed, changes = fix_file(file_path)
        if changed:
            fixed_count += 1
            total_changes += len(changes)
            print(f"  ✓ Fixed: {file_path}")
            for change in changes:
                print(f"    - {change}")

    print()
    print("✅ Processing complete!")
    print(f"   Files processed: {len(markdown_files)}")
    print(f"   Files modified: {fixed_count}")
    print(f"   Total changes: {total_changes}")
    print(f"   Backup location: {backup_dir}")
    print()
    print("🧪 To verify changes:")
    print("   grep -r '/bmad/' commands/")
    print()
    print("♻️  To restore from backup:")
    print(f"   rm -rf commands && cp -R {backup_dir}/commands .")
    print()

if __name__ == "__main__":
    main()
