#!/bin/bash

# BMAD Command Path Fix Script
# Fixes all incorrect slash command references

echo "🔧 Fixing BMAD Command Paths..."echo ""

# Create backup
BACKUP_DIR=".command-path-backups-$(date +%Y%m%d-%H%M%S)"
echo "📦 Creating backup in $BACKUP_DIR..."
mkdir -p "$BACKUP_DIR"
cp -R commands "$BACKUP_DIR/"

# Define replacement mappings
declare -A replacements=(
  # Meta commands
  ["/bmad/workflow-init"]="/bmad:meta:workflow-init"
  ["/bmad:workflow-init"]="/bmad:meta:workflow-init"

  # CIS commands
  ["/bmad/design-thinking"]="/bmad:cis:design-thinking"
  ["/bmad/innovation-strategy"]="/bmad:cis:innovation-strategy"
  ["/bmad/problem-solving"]="/bmad:cis:problem-solving"
  ["/bmad/storytelling"]="/bmad:cis:storytelling"

  # Phase 1 commands
  ["/bmad/brainstorm-project"]="/bmad:phase-1:brainstorm-project"
  ["/bmad/document-project"]="/bmad:phase-1:document-project"
  ["/bmad/domain-research"]="/bmad:phase-1:domain-research"
  ["/bmad/product-brief"]="/bmad:phase-1:product-brief"
  ["/bmad/research"]="/bmad:phase-1:research"

  # Phase 2 commands
  ["/bmad/create-epics-and-stories"]="/bmad:phase-2:create-epics-and-stories"
  ["/bmad/prd"]="/bmad:phase-2:prd"
  ["/bmad/tech-spec"]="/bmad:phase-2:tech-spec"
  ["/bmad/prd-validation-checklist"]="/bmad:phase-2:prd-validation-checklist"

  # Phase 3 commands
  ["/bmad/architecture"]="/bmad:phase-3:architecture"

  # Phase 4 commands
  ["/bmad/code-review"]="/bmad:phase-4:code-review"
  ["/bmad/create-story"]="/bmad:phase-4:create-story"
  ["/bmad/dev-story"]="/bmad:phase-4:dev-story"
  ["/bmad/epic-tech-context"]="/bmad:phase-4:epic-tech-context"
  ["/bmad/retrospective"]="/bmad:phase-4:retrospective"
  ["/bmad/security-test"]="/bmad:phase-4:security-test"
  ["/bmad/sprint-planning"]="/bmad:phase-4:sprint-planning"
  ["/bmad/story-context"]="/bmad:phase-4:story-context"
  ["/bmad/story-done"]="/bmad:phase-4:story-done"
  ["/bmad/story-ready"]="/bmad:phase-4:story-ready"

  # Workflow status (no directory prefix)
  ["/bmad/workflow-status"]="/bmad:workflow-status"
)

# Function to fix a file
fix_file() {
  local file="$1"
  local temp_file="${file}.tmp"
  local changed=0

  cp "$file" "$temp_file"

  for old_path in "${!replacements[@]}"; do
    new_path="${replacements[$old_path]}"
    if grep -q "$old_path" "$file" 2>/dev/null; then
      sed -i.bak "s|$old_path|$new_path|g" "$temp_file"
      changed=1
    fi
  done

  if [ $changed -eq 1 ]; then
    mv "$temp_file" "$file"
    rm -f "${temp_file}.bak"
    echo "  ✓ Fixed: $file"
  else
    rm -f "$temp_file" "${temp_file}.bak"
  fi
}

# Fix all markdown files in commands directory
echo ""
echo "🔍 Scanning and fixing command files..."
echo ""

file_count=0
while IFS= read -r -d '' file; do
  fix_file "$file"
  ((file_count++))
done < <(find commands -name "*.md" -type f -print0)

echo ""
echo "✅ Processing complete!"
echo "   Files processed: $file_count"
echo "   Backup location: $BACKUP_DIR"
echo ""
echo "🧪 To verify changes:"
echo "   grep -r '/bmad/' commands/"
echo ""
echo "♻️  To restore from backup:"
echo "   rm -rf commands && cp -R $BACKUP_DIR/commands ."
echo ""
