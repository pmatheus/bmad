#!/usr/bin/env node

/**
 * Agent Conversion Helper
 *
 * Automates conversion of BMAD v1.x agents (YAML)
 * to Claude Code native subagents (markdown).
 *
 * Usage: node convert-agent.js <source-agent.yaml> <target-subagent.md>
 */

const fs = require('fs-extra');
const path = require('path');
const yaml = require('js-yaml');

class AgentConverter {
  constructor(sourceFile, targetFile) {
    this.sourceFile = sourceFile;
    this.targetFile = targetFile;
    this.agent = null;
  }

  async convert() {
    console.log(`\n🔄 Converting agent from: ${this.sourceFile}`);
    console.log(`📝 Target file: ${this.targetFile}\n`);

    // Step 1: Load source file
    await this.loadSourceFile();

    // Step 2: Convert to markdown
    const markdown = await this.generateMarkdown();

    // Step 3: Write target file
    await this.writeTargetFile(markdown);

    console.log('✅ Conversion complete!\n');
    console.log('⚠️  IMPORTANT: Manual enhancement required!');
    console.log('   - Add detailed "When invoked for..." sections');
    console.log('   - Create usage examples');
    console.log('   - Add quality standards');
    console.log('   - Test via Task tool invocation\n');
  }

  async loadSourceFile() {
    if (!fs.existsSync(this.sourceFile)) {
      throw new Error(`Source file not found: ${this.sourceFile}`);
    }

    const content = await fs.readFile(this.sourceFile, 'utf8');
    const parsed = yaml.load(content);
    this.agent = parsed.agent;

    console.log(`✓ Loaded agent: ${this.agent.metadata.title}`);
  }

  async generateMarkdown() {
    const frontmatter = this.generateFrontmatter();
    const header = this.generateHeader();
    const description = this.generateDescription();
    const toolsAvailable = this.generateToolsAvailable();
    const persona = this.generatePersona();
    const approach = this.generateApproach();
    const instructions = this.generateInstructions();
    const examples = this.generateExamples();
    const configuration = this.generateConfiguration();

    return `${frontmatter}\n${header}\n${description}\n${toolsAvailable}\n${persona}\n${approach}\n${instructions}\n${examples}\n${configuration}`;
  }

  generateFrontmatter() {
    const name = this.agent.metadata.name.toLowerCase().replace(/\s+/g, '-');
    const desc = `${this.agent.metadata.title} agent. Auto-invoked when working with ${this.inferUseCases()}.`;

    return `---
description: ${desc}
subagent_type: bmad-${name}
---\n`;
  }

  generateHeader() {
    return `# ${this.agent.metadata.title}\n`;
  }

  generateDescription() {
    let desc = '## Description\n\n';

    if (this.agent.persona && this.agent.persona.role) {
      desc += `${this.agent.persona.role}\n\n`;
    }

    desc += 'Use this agent when you need to:\n';

    // Extract use cases from menu items
    if (this.agent.menu && this.agent.menu.length > 0) {
      this.agent.menu.forEach(item => {
        desc += `- ${item.description}\n`;
      });
    }

    return desc + '\n';
  }

  generateToolsAvailable() {
    return `## Tools Available\n\nAll tools (Read, Write, Edit, Grep, Glob, WebFetch, WebSearch, AskUserQuestion, Task)\n\n`;
  }

  generatePersona() {
    let persona = '## Persona\n\n';

    if (!this.agent.persona) {
      return '';
    }

    if (this.agent.persona.role) {
      persona += `**Role:** ${this.agent.persona.role}\n\n`;
    }

    if (this.agent.persona.identity) {
      persona += `**Background:** ${this.agent.persona.identity}\n\n`;
    }

    if (this.agent.persona.communication_style) {
      persona += `**Communication Style:** ${this.agent.persona.communication_style}\n\n`;
    }

    if (this.agent.persona.principles) {
      persona += `**Core Principles:**\n${this.agent.persona.principles}\n\n`;
    }

    return persona;
  }

  generateApproach() {
    let approach = '## Approach\n\n';

    approach += '### 1. Understand Context First\n';
    approach += '- Read existing docs, PRDs, architecture\n';
    approach += '- Understand project level and complexity\n';
    approach += '- Identify what\'s been done and what\'s missing\n\n';

    approach += '### 2. Ask Clarifying Questions\n';
    approach += '- Use AskUserQuestion to understand requirements\n';
    approach += '- Never assume - always verify\n';
    approach += '- Focus on the "why" behind requests\n\n';

    approach += '### 3. Research When Needed\n';
    approach += '- Use WebSearch for information gaps\n';
    approach += '- Use bmad-verified-research skill for accuracy\n';
    approach += '- Always cite sources\n\n';

    approach += '### 4. Execute Systematically\n';
    approach += '- Follow established patterns and templates\n';
    approach += '- Reference relevant skills for best practices\n';
    approach += '- Validate outputs before returning\n\n';

    return approach;
  }

  generateInstructions() {
    let instructions = '## Instructions\n\n';

    if (!this.agent.menu || this.agent.menu.length === 0) {
      instructions += '### When Invoked\n\n';
      instructions += '[TODO: Add detailed instructions]\n\n';
      return instructions;
    }

    // Convert each menu item to an instruction section
    this.agent.menu.forEach((item, index) => {
      const title = item.description || item.trigger;
      instructions += `### When ${title.toLowerCase()}\n\n`;

      if (item.workflow) {
        instructions += `This invokes the ${item.trigger} workflow.\n\n`;
        instructions += '**Process:**\n';
        instructions += '1. [TODO: Add workflow steps]\n';
        instructions += '2. [TODO: Add implementation details]\n';
        instructions += '3. [TODO: Add validation steps]\n\n';
      } else if (item.action) {
        instructions += `**Action:** ${item.action}\n\n`;
      } else if (item.exec) {
        instructions += `This executes a task: ${item.exec}\n\n`;
      }

      instructions += '**Output Format:**\n';
      instructions += '[TODO: Specify output format]\n\n';
    });

    return instructions;
  }

  generateExamples() {
    let examples = '## Examples\n\n';

    examples += '### Example 1: [TODO: Add example title]\n\n';
    examples += '**Input:**\n```\n[TODO: Add example input]\n```\n\n';
    examples += '**Process:**\n';
    examples += '1. [TODO: Add process steps]\n\n';
    examples += '**Output:**\n```\n[TODO: Add example output]\n```\n\n';

    return examples;
  }

  generateConfiguration() {
    return `## Configuration\n\nReads configuration from \`.bmad/config.yaml\`:
\`\`\`yaml
output_folder: "bmad-output"    # Where to save artifacts
user_name: "Your Name"          # Author name
\`\`\`\n\n`;
  }

  inferUseCases() {
    const title = this.agent.metadata.title.toLowerCase();
    if (title.includes('product')) return 'product planning or PRD workflows';
    if (title.includes('architect')) return 'architecture design or technical specifications';
    if (title.includes('dev')) return 'story implementation or code development';
    if (title.includes('test')) return 'test strategy or test architecture';
    if (title.includes('analyst')) return 'requirements analysis or research';
    if (title.includes('scrum') || title.includes('sm')) return 'sprint planning or project coordination';
    if (title.includes('ux')) return 'UX design or user experience workflows';
    if (title.includes('writer')) return 'documentation or technical writing';
    return 'specialized workflows';
  }

  async writeTargetFile(markdown) {
    await fs.ensureDir(path.dirname(this.targetFile));
    await fs.writeFile(this.targetFile, markdown, 'utf8');
    console.log(`\n✓ Created: ${this.targetFile}`);
  }
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length !== 2) {
    console.error('Usage: node convert-agent.js <source-file.yaml> <target-file.md>');
    console.error('');
    console.error('Example:');
    console.error('  node convert-agent.js \\');
    console.error('    src/modules/bmm/agents/architect.agent.yaml \\');
    console.error('    claude-code-plugin/src/subagents/bmad-architect.md');
    process.exit(1);
  }

  const [sourceFile, targetFile] = args;

  const converter = new AgentConverter(sourceFile, targetFile);
  converter.convert().catch(error => {
    console.error('❌ Conversion failed:', error.message);
    process.exit(1);
  });
}

module.exports = AgentConverter;
