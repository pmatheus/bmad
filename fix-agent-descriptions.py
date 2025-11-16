#!/usr/bin/env python3
"""
Fix agent descriptions to remove 'Auto-invoked' language
"""

import os
from pathlib import Path
from datetime import datetime
import shutil

# Agent files to update
AGENTS = {
    "agents/bmad-pm.md": {
        "old": "Auto-invoked when working with product planning or PRD workflows.",
        "new": "Use this agent for product planning and PRD workflows."
    },
    "agents/bmad-analyst.md": {
        "old": "Auto-invoked for analysis and research workflows.",
        "new": "Use this agent for analysis and research workflows."
    },
    "agents/bmad-architect.md": {
        "old": "Auto-invoked for architecture and solutioning workflows.",
        "new": "Use this agent for architecture and solutioning workflows."
    },
    "agents/bmad-sm.md": {
        "old": "Auto-invoked for sprint management and story creation workflows.",
        "new": "Use this agent for sprint management and story creation workflows."
    },
    "agents/bmad-tea.md": {
        "old": "Auto-invoked for testing workflows.",
        "new": "Use this agent for testing workflows."
    }
}

def create_backup():
    """Create backup of agents directory"""
    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    backup_dir = f".agent-backups-{timestamp}"

    print(f"📦 Creating backup in {backup_dir}...")
    shutil.copytree("agents", f"{backup_dir}/agents")
    return backup_dir

def fix_agent(file_path, old_text, new_text):
    """Fix agent description"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        if old_text in content:
            content = content.replace(old_text, new_text)

            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)

            return True

        return False

    except Exception as e:
        print(f"  ⚠️  Error fixing {file_path}: {e}")
        return False

def main():
    print("🔧 Fixing Agent Descriptions...")
    print()

    # Create backup
    backup_dir = create_backup()
    print()

    print("🔍 Updating agent files...")
    print()

    fixed_count = 0

    for file_path, changes in AGENTS.items():
        changed = fix_agent(file_path, changes["old"], changes["new"])
        if changed:
            fixed_count += 1
            print(f"  ✓ Fixed: {file_path}")
            print(f"    - Removed 'Auto-invoked' language")

    print()
    print("✅ Processing complete!")
    print(f"   Agents updated: {fixed_count}/{len(AGENTS)}")
    print(f"   Backup location: {backup_dir}")
    print()

if __name__ == "__main__":
    main()
