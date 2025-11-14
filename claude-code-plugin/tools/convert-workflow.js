#!/usr/bin/env node

/**
 * Workflow Conversion Helper
 *
 * Automates conversion of BMAD v1.x workflows (YAML + XML instructions)
 * to Claude Code native slash commands (markdown).
 *
 * Usage: node convert-workflow.js <source-workflow-dir> <target-command-file>
 */

const fs = require('fs-extra');
const path = require('path');
const yaml = require('js-yaml');

class WorkflowConverter {
  constructor(sourceDir, targetFile) {
    this.sourceDir = sourceDir;
    this.targetFile = targetFile;
    this.workflow = null;
    this.instructions = null;
  }

  async convert() {
    console.log(`\n🔄 Converting workflow from: ${this.sourceDir}`);
    console.log(`📝 Target file: ${this.targetFile}\n`);

    // Step 1: Load source files
    await this.loadSourceFiles();

    // Step 2: Convert to markdown
    const markdown = await this.generateMarkdown();

    // Step 3: Write target file
    await this.writeTargetFile(markdown);

    console.log('✅ Conversion complete!\n');
    console.log('⚠️  IMPORTANT: Manual review required!');
    console.log('   - Review XML→markdown conversion');
    console.log('   - Update variable references');
    console.log('   - Test the slash command');
    console.log('   - Add examples if needed\n');
  }

  async loadSourceFiles() {
    const workflowYamlPath = path.join(this.sourceDir, 'workflow.yaml');
    const instructionsPath = path.join(this.sourceDir, 'instructions.md');

    if (!fs.existsSync(workflowYamlPath)) {
      throw new Error(`workflow.yaml not found in ${this.sourceDir}`);
    }

    if (!fs.existsSync(instructionsPath)) {
      throw new Error(`instructions.md not found in ${this.sourceDir}`);
    }

    // Load workflow.yaml
    const workflowContent = await fs.readFile(workflowYamlPath, 'utf8');
    this.workflow = yaml.load(workflowContent);

    // Load instructions.md
    this.instructions = await fs.readFile(instructionsPath, 'utf8');

    console.log(`✓ Loaded workflow: ${this.workflow.name}`);
    console.log(`✓ Description: ${this.workflow.description}`);
  }

  async generateMarkdown() {
    const frontmatter = this.generateFrontmatter();
    const header = this.generateHeader();
    const whatThisDoes = this.generateWhatThisDoes();
    const instructions = this.convertInstructions();
    const notes = this.generateNotes();

    return `${frontmatter}\n${header}\n${whatThisDoes}\n${instructions}\n${notes}`;
  }

  generateFrontmatter() {
    return `---
description: ${this.workflow.description}
---\n`;
  }

  generateHeader() {
    const name = this.workflow.name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return `# ${name}\n`;
  }

  generateWhatThisDoes() {
    return `## What This Does\n
${this.workflow.description}\n
## Prerequisites\n
You must have installed the BMAD plugin and run workflow-init for your project.\n`;
  }

  convertInstructions() {
    let markdown = '## Instructions\n\n';

    // Remove XML tags and convert to markdown
    let converted = this.instructions;

    // Remove critical tags
    converted = converted.replace(/<critical>.*?<\/critical>/gs, '');

    // Remove workflow wrapper
    converted = converted.replace(/<workflow>/g, '');
    converted = converted.replace(/<\/workflow>/g, '');

    // Convert steps
    converted = this.convertSteps(converted);

    // Convert actions
    converted = this.convertActions(converted);

    // Convert asks
    converted = this.convertAsks(converted);

    // Convert checks
    converted = this.convertChecks(converted);

    // Convert output
    converted = this.convertOutput(converted);

    // Convert template-output
    converted = converted.replace(/<template-output>(.*?)<\/template-output>/g,
      'Store: `$1`');

    // Convert variables
    converted = this.convertVariables(converted);

    markdown += converted;

    return markdown;
  }

  convertSteps(text) {
    // Convert <step n="1" goal="...">
    return text.replace(/<step n="(\d+)" goal="(.*?)">/g, (match, num, goal) => {
      return `### Step ${num}: ${goal}\n`;
    }).replace(/<\/step>/g, '\n');
  }

  convertActions(text) {
    // Convert <action> tags to markdown
    return text.replace(/<action>(.*?)<\/action>/gs, (match, content) => {
      return `**Action:**\n${content.trim()}\n`;
    }).replace(/<action if="(.*?)">(.*?)<\/action>/gs, (match, condition, content) => {
      return `**If ${condition}:**\n${content.trim()}\n`;
    });
  }

  convertAsks(text) {
    // Convert <ask> to AskUserQuestion instructions
    return text.replace(/<ask>(.*?)<\/ask>/gs, (match, question) => {
      const cleaned = question.trim();
      return `\nUse AskUserQuestion tool:\n\`\`\`\n${cleaned}\n\`\`\`\n`;
    }).replace(/<ask if="(.*?)">(.*?)<\/ask>/gs, (match, condition, question) => {
      const cleaned = question.trim();
      return `\n**If ${condition}, use AskUserQuestion:**\n\`\`\`\n${cleaned}\n\`\`\`\n`;
    });
  }

  convertChecks(text) {
    // Convert <check> blocks
    return text.replace(/<check if="(.*?)">/g, (match, condition) => {
      return `\n**If ${condition}:**\n`;
    }).replace(/<\/check>/g, '\n');
  }

  convertOutput(text) {
    // Convert <output> blocks
    return text.replace(/<output>(.*?)<\/output>/gs, (match, content) => {
      return `\n**Display:**\n\`\`\`\n${content.trim()}\n\`\`\`\n`;
    });
  }

  convertVariables(text) {
    // Convert {variable} to instructions to read from config
    let converted = text;

    // Common variable conversions
    const variableMap = {
      '{output_folder}': 'Read `output_folder` from `.bmad/config.yaml`',
      '{user_name}': 'Read `user_name` from `.bmad/config.yaml`',
      '{project_name}': 'Read `project_name` from `.bmad/config.yaml`',
      '{project-root}': 'Current working directory',
      '{bmad_folder}': '`.bmad`',
    };

    for (const [varPattern, instruction] of Object.entries(variableMap)) {
      if (converted.includes(varPattern)) {
        // Add note about variable at the top of instructions
        const note = `\n**Configuration:** ${instruction}\n`;
        if (!converted.includes(note)) {
          converted = note + converted;
        }
      }
    }

    return converted;
  }

  generateNotes() {
    let notes = '\n## Notes\n\n';

    if (this.workflow.template) {
      notes += '- This workflow uses a template file\n';
    }

    if (this.workflow.validation) {
      notes += '- This workflow includes validation/checklist\n';
    }

    if (this.workflow.web_bundle) {
      notes += '- This workflow can be used as a standalone web bundle\n';
    }

    notes += '\n## Output Files\n\n';
    if (this.workflow.default_output_file) {
      const file = this.workflow.default_output_file.replace(/\{.*?\}/g, '<dynamic>');
      notes += `- ${file}\n`;
    }

    return notes;
  }

  async writeTargetFile(markdown) {
    // Ensure target directory exists
    await fs.ensureDir(path.dirname(this.targetFile));

    // Write markdown
    await fs.writeFile(this.targetFile, markdown, 'utf8');

    console.log(`\n✓ Created: ${this.targetFile}`);
  }
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length !== 2) {
    console.error('Usage: node convert-workflow.js <source-dir> <target-file>');
    console.error('');
    console.error('Example:');
    console.error('  node convert-workflow.js \\');
    console.error('    src/modules/bmm/workflows/product-brief \\');
    console.error('    claude-code-plugin/src/commands/phase-1/product-brief.md');
    process.exit(1);
  }

  const [sourceDir, targetFile] = args;

  const converter = new WorkflowConverter(sourceDir, targetFile);
  converter.convert().catch(error => {
    console.error('❌ Conversion failed:', error.message);
    process.exit(1);
  });
}

module.exports = WorkflowConverter;
