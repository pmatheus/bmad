#!/usr/bin/env node

/**
 * BMAD Method - Claude Code Plugin Installer
 *
 * Installs BMAD Method as a Claude Code native plugin by copying:
 * - Slash commands to ~/.claude/commands/bmad/
 * - Skills to ~/.claude/skills/bmad/
 * - Subagents to ~/.claude/subagents/bmad/ (if supported)
 * - Creates project config at .bmad/config.yaml
 */

const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const chalk = require('chalk');
const inquirer = require('inquirer');
const yaml = require('js-yaml');

// Constants
const CLAUDE_DIR = path.join(os.homedir(), '.claude');
const COMMANDS_DIR = path.join(CLAUDE_DIR, 'commands', 'bmad');
const SKILLS_DIR = path.join(CLAUDE_DIR, 'skills', 'bmad');
const SUBAGENTS_DIR = path.join(CLAUDE_DIR, 'subagents', 'bmad');
const PROJECT_ROOT = process.cwd();
const BMAD_CONFIG_DIR = path.join(PROJECT_ROOT, '.bmad');
const SRC_DIR = path.join(__dirname, '..', 'src');

// Banner
const BANNER = `
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   ██████╗ ███╗   ███╗ █████╗ ██████╗                        ║
║   ██╔══██╗████╗ ████║██╔══██╗██╔══██╗                       ║
║   ██████╔╝██╔████╔██║███████║██║  ██║                       ║
║   ██╔══██╗██║╚██╔╝██║██╔══██║██║  ██║                       ║
║   ██████╔╝██║ ╚═╝ ██║██║  ██║██████╔╝                       ║
║   ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═╝╚═════╝                        ║
║                                                               ║
║   Claude Code Plugin Installer                               ║
║   Version 2.0.0                                              ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
`;

class BMadInstaller {
  constructor() {
    this.config = {};
    this.stats = {
      commandsInstalled: 0,
      skillsInstalled: 0,
      subagentsInstalled: 0,
    };
  }

  async run() {
    try {
      console.log(chalk.cyan(BANNER));

      // Step 1: Check prerequisites
      await this.checkPrerequisites();

      // Step 2: Gather user configuration
      await this.gatherConfiguration();

      // Step 3: Confirm installation
      const confirmed = await this.confirmInstallation();
      if (!confirmed) {
        console.log(chalk.yellow('\n Installation cancelled by user.'));
        return;
      }

      // Step 4: Install components
      await this.installCommands();
      await this.installSkills();
      await this.installSubagents();

      // Step 5: Create project configuration
      await this.createProjectConfig();

      // Step 6: Display summary
      this.displaySummary();

    } catch (error) {
      console.error(chalk.red('\n Installation failed:'), error.message);
      process.exit(1);
    }
  }

  async checkPrerequisites() {
    console.log(chalk.blue('\n📋 Checking prerequisites...'));

    // Check if Claude Code directory exists
    if (!fs.existsSync(CLAUDE_DIR)) {
      console.log(chalk.yellow(`\n⚠️  Claude Code directory not found at: ${CLAUDE_DIR}`));
      const { createDir } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'createDir',
          message: 'Would you like to create it?',
          default: true,
        },
      ]);

      if (createDir) {
        await fs.ensureDir(CLAUDE_DIR);
        console.log(chalk.green('✓ Created Claude Code directory'));
      } else {
        throw new Error('Claude Code directory is required for installation');
      }
    } else {
      console.log(chalk.green('✓ Claude Code directory found'));
    }

    // Check if source files exist
    if (!fs.existsSync(SRC_DIR)) {
      throw new Error(`Source directory not found: ${SRC_DIR}`);
    }
    console.log(chalk.green('✓ Source files found'));

    // Check for existing BMAD installation
    const hasExistingCommands = fs.existsSync(COMMANDS_DIR);
    const hasExistingSkills = fs.existsSync(SKILLS_DIR);
    const hasExistingConfig = fs.existsSync(path.join(BMAD_CONFIG_DIR, 'config.yaml'));

    if (hasExistingCommands || hasExistingSkills || hasExistingConfig) {
      console.log(chalk.yellow('\n⚠️  Existing BMAD installation detected'));
      const { overwrite } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: 'This will overwrite existing BMAD files. Continue?',
          default: false,
        },
      ]);

      if (!overwrite) {
        throw new Error('Installation cancelled to preserve existing files');
      }

      // Backup existing installation
      await this.backupExisting();
    }
  }

  async backupExisting() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(BMAD_CONFIG_DIR, `backup-${timestamp}`);

    console.log(chalk.blue(`\n📦 Creating backup at: ${backupDir}`));

    await fs.ensureDir(backupDir);

    if (fs.existsSync(path.join(BMAD_CONFIG_DIR, 'config.yaml'))) {
      await fs.copy(
        path.join(BMAD_CONFIG_DIR, 'config.yaml'),
        path.join(backupDir, 'config.yaml')
      );
    }

    console.log(chalk.green('✓ Backup created'));
  }

  async gatherConfiguration() {
    console.log(chalk.blue('\n⚙️  Configuration'));

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'outputFolder',
        message: 'Output folder for artifacts (relative to project root):',
        default: 'bmad-output',
        validate: (input) => input.trim().length > 0 || 'Output folder is required',
      },
      {
        type: 'input',
        name: 'userName',
        message: 'Your name (for authorship in documents):',
        default: os.userInfo().username,
        validate: (input) => input.trim().length > 0 || 'User name is required',
      },
      {
        type: 'confirm',
        name: 'installAllCommands',
        message: 'Install all workflow commands?',
        default: true,
      },
      {
        type: 'confirm',
        name: 'installAllSkills',
        message: 'Install all skills?',
        default: true,
      },
      {
        type: 'confirm',
        name: 'installSubagents',
        message: 'Install subagents (experimental - may not be supported yet)?',
        default: false,
      },
    ]);

    this.config = answers;
  }

  async confirmInstallation() {
    console.log(chalk.blue('\n📋 Installation Summary'));
    console.log(chalk.white('  Project Root:    ') + chalk.cyan(PROJECT_ROOT));
    console.log(chalk.white('  Output Folder:   ') + chalk.cyan(this.config.outputFolder));
    console.log(chalk.white('  User Name:       ') + chalk.cyan(this.config.userName));
    console.log(chalk.white('  Commands:        ') + chalk.cyan(this.config.installAllCommands ? 'All' : 'Selected'));
    console.log(chalk.white('  Skills:          ') + chalk.cyan(this.config.installAllSkills ? 'All' : 'Selected'));
    console.log(chalk.white('  Subagents:       ') + chalk.cyan(this.config.installSubagents ? 'Yes' : 'No'));

    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Proceed with installation?',
        default: true,
      },
    ]);

    return confirm;
  }

  async installCommands() {
    if (!this.config.installAllCommands) {
      console.log(chalk.yellow('\n⏭️  Skipping command installation'));
      return;
    }

    console.log(chalk.blue('\n📝 Installing slash commands...'));

    const commandsSourceDir = path.join(SRC_DIR, 'commands');

    if (!fs.existsSync(commandsSourceDir)) {
      console.log(chalk.yellow('⚠️  No commands found to install'));
      return;
    }

    // Ensure target directory exists
    await fs.ensureDir(COMMANDS_DIR);

    // Copy all command files
    await fs.copy(commandsSourceDir, COMMANDS_DIR, {
      overwrite: true,
      filter: (src) => {
        // Only copy markdown files
        return fs.statSync(src).isDirectory() || src.endsWith('.md');
      },
    });

    // Count installed commands
    const commands = await this.getMarkdownFiles(COMMANDS_DIR);
    this.stats.commandsInstalled = commands.length;

    console.log(chalk.green(`✓ Installed ${this.stats.commandsInstalled} commands to ${COMMANDS_DIR}`));

    // List installed commands
    commands.slice(0, 5).forEach((cmd) => {
      const relativePath = path.relative(COMMANDS_DIR, cmd);
      const commandName = path.basename(cmd, '.md');
      console.log(chalk.gray(`  - /bmad/${relativePath.replace(/\.md$/, '').replace(/\\/g, '/')}`));
    });

    if (commands.length > 5) {
      console.log(chalk.gray(`  ... and ${commands.length - 5} more`));
    }
  }

  async installSkills() {
    if (!this.config.installAllSkills) {
      console.log(chalk.yellow('\n⏭️  Skipping skill installation'));
      return;
    }

    console.log(chalk.blue('\n🎯 Installing skills...'));

    const skillsSourceDir = path.join(SRC_DIR, 'skills');

    if (!fs.existsSync(skillsSourceDir)) {
      console.log(chalk.yellow('⚠️  No skills found to install'));
      return;
    }

    // Ensure target directory exists
    await fs.ensureDir(SKILLS_DIR);

    // Copy all skill directories
    await fs.copy(skillsSourceDir, SKILLS_DIR, {
      overwrite: true,
    });

    // Count installed skills
    const skills = await this.getSkillDirectories(SKILLS_DIR);
    this.stats.skillsInstalled = skills.length;

    console.log(chalk.green(`✓ Installed ${this.stats.skillsInstalled} skills to ${SKILLS_DIR}`));

    // List installed skills
    skills.forEach((skill) => {
      const skillName = path.basename(skill);
      console.log(chalk.gray(`  - ${skillName}`));
    });
  }

  async installSubagents() {
    if (!this.config.installSubagents) {
      console.log(chalk.yellow('\n⏭️  Skipping subagent installation (not enabled)'));
      return;
    }

    console.log(chalk.blue('\n🤖 Installing subagents...'));

    const subagentsSourceDir = path.join(SRC_DIR, 'subagents');

    if (!fs.existsSync(subagentsSourceDir)) {
      console.log(chalk.yellow('⚠️  No subagents found to install'));
      return;
    }

    // Ensure target directory exists
    await fs.ensureDir(SUBAGENTS_DIR);

    // Copy all subagent files
    await fs.copy(subagentsSourceDir, SUBAGENTS_DIR, {
      overwrite: true,
      filter: (src) => {
        // Only copy markdown files
        return fs.statSync(src).isDirectory() || src.endsWith('.md');
      },
    });

    // Count installed subagents
    const subagents = await this.getMarkdownFiles(SUBAGENTS_DIR);
    this.stats.subagentsInstalled = subagents.length;

    console.log(chalk.green(`✓ Installed ${this.stats.subagentsInstalled} subagents to ${SUBAGENTS_DIR}`));

    // List installed subagents
    subagents.forEach((agent) => {
      const agentName = path.basename(agent, '.md');
      console.log(chalk.gray(`  - ${agentName}`));
    });

    console.log(chalk.yellow('\n⚠️  Note: Custom subagents may not be fully supported yet in Claude Code.'));
    console.log(chalk.yellow('   Use the Task tool with subagent descriptions in your prompts.'));
  }

  async createProjectConfig() {
    console.log(chalk.blue('\n⚙️  Creating project configuration...'));

    // Ensure .bmad directory exists
    await fs.ensureDir(BMAD_CONFIG_DIR);

    // Create config object
    const config = {
      output_folder: this.config.outputFolder,
      user_name: this.config.userName,
      bmad_version: '2.0.0',
      installed_date: new Date().toISOString(),
      project_root: PROJECT_ROOT,
    };

    // Write config as YAML
    const configPath = path.join(BMAD_CONFIG_DIR, 'config.yaml');
    const yamlContent = yaml.dump(config, {
      indent: 2,
      lineWidth: 80,
      noRefs: true,
    });

    const configWithComments = `# BMAD Method Configuration
# This file is used by BMAD workflows and agents
# Auto-generated on ${new Date().toISOString()}

${yamlContent}`;

    await fs.writeFile(configPath, configWithComments, 'utf8');

    console.log(chalk.green(`✓ Created config at ${configPath}`));

    // Create output folder
    const outputPath = path.join(PROJECT_ROOT, this.config.outputFolder);
    await fs.ensureDir(outputPath);
    console.log(chalk.green(`✓ Created output folder at ${outputPath}`));
  }

  displaySummary() {
    console.log(chalk.green.bold('\n✅ Installation Complete!'));
    console.log(chalk.white('\n📊 Summary:'));
    console.log(chalk.white('  Commands installed:   ') + chalk.cyan(this.stats.commandsInstalled));
    console.log(chalk.white('  Skills installed:     ') + chalk.cyan(this.stats.skillsInstalled));
    console.log(chalk.white('  Subagents installed:  ') + chalk.cyan(this.stats.subagentsInstalled));

    console.log(chalk.white('\n🚀 Getting Started:'));
    console.log(chalk.gray('  1. Restart Claude Code (if currently running)'));
    console.log(chalk.gray('  2. In Claude Code, type "/" to see available commands'));
    console.log(chalk.gray('  3. Start with: /bmad/workflow-init'));

    console.log(chalk.white('\n📖 Available Commands (examples):'));
    console.log(chalk.cyan('  /bmad/workflow-init      ') + chalk.gray('- Initialize a new project'));
    console.log(chalk.cyan('  /bmad/workflow-status    ') + chalk.gray('- Check current status'));
    console.log(chalk.cyan('  /bmad/product-brief      ') + chalk.gray('- Create product brief'));
    console.log(chalk.cyan('  /bmad/prd                ') + chalk.gray('- Create PRD'));
    console.log(chalk.cyan('  /bmad/architecture       ') + chalk.gray('- Design architecture'));

    console.log(chalk.white('\n🎯 Skills (auto-invoked when relevant):'));
    console.log(chalk.gray('  - bmad-pm'));
    console.log(chalk.gray('  - bmad-verified-research'));
    console.log(chalk.gray('  - bmad-story-context-generation'));
    console.log(chalk.gray('  - bmad-subagent-patterns'));
    console.log(chalk.gray('  - bmad-test-architecture'));

    console.log(chalk.white('\n📁 Files Created:'));
    console.log(chalk.gray(`  - ${path.join(BMAD_CONFIG_DIR, 'config.yaml')}`));
    console.log(chalk.gray(`  - ${path.join(PROJECT_ROOT, this.config.outputFolder)}/`));

    console.log(chalk.white('\n💡 Tips:'));
    console.log(chalk.gray('  - Edit config at .bmad/config.yaml to customize settings'));
    console.log(chalk.gray('  - All artifacts will be saved to ' + this.config.outputFolder + '/'));
    console.log(chalk.gray('  - Use /bmad/workflow-status anytime to check progress'));

    console.log(chalk.cyan('\n🔗 Documentation: https://github.com/your-repo/bmad-method'));
    console.log(chalk.cyan('📧 Support: https://github.com/your-repo/bmad-method/issues'));
    console.log('');
  }

  // Helper methods

  async getMarkdownFiles(dir) {
    const files = [];

    async function walk(directory) {
      const entries = await fs.readdir(directory, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(directory, entry.name);

        if (entry.isDirectory()) {
          await walk(fullPath);
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
          files.push(fullPath);
        }
      }
    }

    await walk(dir);
    return files;
  }

  async getSkillDirectories(dir) {
    const skills = [];
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const skillPath = path.join(dir, entry.name);
        // Check if directory contains a SKILL.md file
        if (fs.existsSync(path.join(skillPath, 'SKILL.md'))) {
          skills.push(skillPath);
        }
      }
    }

    return skills;
  }
}

// Run installer
if (require.main === module) {
  const installer = new BMadInstaller();
  installer.run().catch((error) => {
    console.error(chalk.red('Fatal error:'), error);
    process.exit(1);
  });
}

module.exports = BMadInstaller;
