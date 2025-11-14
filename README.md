# BMAD Method for Claude Code

**Complete AI-assisted software development methodology**

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/pmatheus/bmad)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-Native-purple.svg)](https://claude.ai/code)

---

## 🎯 What is BMAD Method?

BMAD (Build, Measure, Adapt, Deliver) Method is a comprehensive AI-native software development methodology for Claude Code, providing:

- ✅ **20 Production Workflows** - From ideation to retrospectives
- ✅ **8 Specialized AI Agents** - Product Manager, Architect, Developer, Test Engineer, and more
- ✅ **5 Core Skills** - Anti-hallucination research, test architecture, delegation patterns
- ✅ **3 Project Levels** - Quick Flow (30min), BMad Method (weeks), Enterprise (months)

---

## 🚀 Quick Start

See **[TESTING_GUIDE.md](TESTING_GUIDE.md)** for complete installation and testing instructions.

### Installation

```bash
# Clone the repository
git clone https://github.com/pmatheus/bmad.git
cd bmad

# Create test project
mkdir -p /tmp/bmad-test-project
cd /tmp/bmad-test-project

# Start Claude Code
claude
```

Inside Claude Code:

```bash
# Add the marketplace
/plugin marketplace add /path/to/bmad/bmad-marketplace

# Install plugin
/plugin install bmad-method@bmad-marketplace

# Verify
/workflow-status
```

---

## 📋 Complete Development Flows

**Level 0-1: Quick Flow** (30 min - 2 hours)
```
/workflow-init → /tech-spec → /sprint-planning → /dev-story → /code-review → /story-done
```

**Level 2: BMad Method** (1-4 weeks)
```
/workflow-init → /product-brief → /research → /prd → /create-epics-and-stories
→ /architecture → /sprint-planning → /dev-story → /code-review → /retrospective
```

**Brownfield Projects**
```
/workflow-init → /document-project → /product-brief → /prd → implementation
```

---

## 📖 Documentation

- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** ⭐ - **START HERE** - Complete testing with step-by-step examples
- **[QUICK_TEST.md](QUICK_TEST.md)** - 15-minute quick validation
- **[claude-code-plugin/README.md](claude-code-plugin/README.md)** - Full plugin documentation
- **[claude-code-plugin/INSTALLATION.md](claude-code-plugin/INSTALLATION.md)** - Detailed installation guide

---

## 🎓 Key Features

### 20 Production Workflows

**Phase 1: Analysis (5)**
- `/product-brief`, `/research`, `/domain-research`, `/brainstorm-project`, `/document-project`

**Phase 2: Planning (3)**
- `/prd`, `/tech-spec`, `/create-epics-and-stories`

**Phase 3: Solutioning (1)**
- `/architecture`

**Phase 4: Implementation (9)**
- `/sprint-planning`, `/epic-tech-context`, `/story-context`, `/create-story`, `/story-ready`, `/dev-story`, `/code-review`, `/story-done`, `/retrospective`

**Meta (2)**
- `/workflow-init`, `/workflow-status`

### 8 Specialized Agents

- **bmad-pm** - Product Manager
- **bmad-architect** - Software Architect  
- **bmad-dev** - Developer
- **bmad-tea** - Test Engineer
- **bmad-analyst** - Business Analyst
- **bmad-sm** - Scrum Master
- **bmad-ux** - UX Designer
- **bmad-tech-writer** - Technical Writer

### Brownfield Documentation

- **Quick Scan** (2-5 min) - Pattern-based
- **Deep Scan** (10-30 min) - Selective reading
- **Exhaustive Scan** (30-120 min) - Complete analysis
- **Deep-Dive Mode** - Feature-level detail
- **12 Project Types** supported

---

## 🧪 Testing

**Quick Test (15 min):**
```bash
# Follow QUICK_TEST.md
```

**Full Test (1 hour):**
```bash
# Follow TESTING_GUIDE.md
```

---

## 📊 Migration Stats

**v1.x → v2.0 Claude Code Native:**
- ✅ 100% Workflows (20/20)
- ✅ 100% Agents (8/8)
- ✅ 90% Overall (production-ready)
- ✅ ~15,000 Lines Converted
- ✅ Quality: ⭐⭐⭐⭐⭐

---

## 🤝 Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md)

---

## 📄 License

MIT License

---

## 📞 Support

- **Testing:** [TESTING_GUIDE.md](TESTING_GUIDE.md)
- **Issues:** [GitHub Issues](https://github.com/pmatheus/bmad/issues)
- **Discussions:** [GitHub Discussions](https://github.com/pmatheus/bmad/discussions)

---

**Happy Building with BMAD Method!** 🚀
