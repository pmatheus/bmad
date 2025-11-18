# UX Specification Workflow

## Purpose
Create comprehensive UX specifications including user flows, personas, journey maps, and interaction patterns. This workflow generates a complete UX specification document that defines how users will interact with the product, covering personas, journeys, flows, information architecture, interaction patterns, and content strategy.

## Variables
- `{documentation_dir}`: Root directory for project documentation (e.g., `.bmad/project-name`)
- `{documentation_language}`: Language for documentation output (e.g., "English", "Spanish")
- `{project_name}`: Name of the current project

## Instructions

### Prerequisites
Before starting this workflow:
1. Ensure product brief exists at `{documentation_dir}/product/product-brief.md`
2. Ensure PRD exists at `{documentation_dir}/product/PRD.md`
3. Verify project is initialized with workflow-init

### Required Inputs
Gather the following information:
- Product brief with product vision and goals
- PRD with user stories and requirements
- Target user information and demographics
- Business goals and success criteria

### Step-by-Step Process

**Step 1: Define User Personas**
1. Identify primary and secondary user types from PRD and product brief
2. For each persona, define:
   - Demographics (age, role, experience level)
   - Goals and motivations
   - Pain points and frustrations
   - Technical proficiency
   - Context of use (device, environment, frequency)

**Step 2: Map User Journeys**
1. For each major user goal from PRD:
   - Define the journey stages (awareness → consideration → action → retention)
   - Identify touchpoints at each stage
   - Map emotional states throughout journey
   - Highlight pain points and opportunities

**Step 3: Create User Flows**
1. For each key feature/user story:
   - Define entry points
   - Map decision points and paths
   - Include error states and edge cases
   - Define success criteria and exit points
2. Use standard flow notation:
   - Rectangles for screens/pages
   - Diamonds for decisions
   - Arrows for flow direction

**Step 4: Define Information Architecture**
1. Create site map or app structure
2. Define navigation patterns:
   - Primary navigation
   - Secondary navigation
   - Contextual navigation
3. Organize content hierarchy
4. Define search and filtering structures

**Step 5: Specify Interaction Patterns**
1. Define standard interactions:
   - Navigation patterns
   - Form interactions
   - Feedback mechanisms (loading, success, error)
   - Gestures (for mobile/touch interfaces)
2. Accessibility requirements:
   - Keyboard navigation
   - Screen reader support
   - Color contrast requirements
   - Focus management

**Step 6: Document Content Strategy**
1. Define content types and templates
2. Specify tone and voice guidelines
3. Define microcopy patterns:
   - Button labels
   - Error messages
   - Empty states
   - Success confirmations

**Step 7: Validate Output**
Run through validation checklist:
- [ ] All user personas are based on research or validated assumptions
- [ ] User journeys cover all major features from PRD
- [ ] User flows include error states and edge cases
- [ ] Information architecture supports user mental models
- [ ] Interaction patterns are consistent throughout
- [ ] Accessibility requirements meet WCAG AA standards
- [ ] Content strategy aligns with brand and user needs
- [ ] UX principles are specific to this project (not generic)

## Workflow

### Execution Flow
```
[Start]
  ↓
[Read Prerequisites]
  ↓
[Define User Personas] → Persona Document Section
  ↓
[Map User Journeys] → Journey Maps Section
  ↓
[Create User Flows] → User Flows Section
  ↓
[Define Information Architecture] → IA Section
  ↓
[Specify Interaction Patterns] → Interaction Patterns Section
  ↓
[Document Content Strategy] → Content Strategy Section
  ↓
[Validate Against Checklist]
  ↓
[Generate UX Spec Document] → `{documentation_dir}/design/ux-spec.md`
  ↓
[End]
```

### Document Structure Template
Generate `{documentation_dir}/design/ux-spec.md` with the following structure:

```markdown
# UX Specification - [Project Name]

## 1. User Personas

### Primary Persona: [Name]
- **Demographics**: Age, role, experience
- **Goals**: What they want to achieve
- **Pain Points**: Current frustrations
- **Technical Proficiency**: Beginner/Intermediate/Advanced
- **Context**: When, where, how they'll use the product

### Secondary Persona: [Name]
[Same structure]

## 2. User Journey Maps

### Journey: [User Goal]
**Stages**: Awareness → Consideration → Action → Retention

| Stage | Touchpoints | User Actions | Emotions | Pain Points | Opportunities |
|-------|-------------|--------------|----------|-------------|---------------|
| Awareness | ... | ... | ... | ... | ... |
| ... | ... | ... | ... | ... | ... |

## 3. User Flows

### Flow: [Feature Name]
**Entry Points**:
- Homepage
- Dashboard
- Direct link

**Flow Diagram**:
```
[Start] → [Screen 1] → <Decision?>
           ↓ Yes              ↓ No
      [Screen 2]         [Alternative]
```

**Success Criteria**: User completes [goal]

## 4. Information Architecture

### Site Map
```
Home
├── Feature A
│   ├── Sub-feature 1
│   └── Sub-feature 2
├── Feature B
└── Settings
```

### Navigation Patterns
- **Primary**: Top navigation bar with [links]
- **Secondary**: Sidebar with [sections]
- **Contextual**: Breadcrumbs, back buttons

## 5. Interaction Patterns

### Standard Interactions
- **Navigation**: Click/tap to navigate, keyboard shortcuts for power users
- **Forms**: Real-time validation, clear error messages, autosave
- **Feedback**:
  - Loading: Skeleton screens, progress indicators
  - Success: Toast notifications, confirmation messages
  - Error: Inline validation, helpful recovery suggestions

### Accessibility
- **Keyboard**: All features accessible via keyboard
- **Screen Reader**: Proper ARIA labels, semantic HTML
- **Contrast**: WCAG AA compliance minimum
- **Focus**: Visible focus indicators on all interactive elements

## 6. Content Strategy

### Content Types
- [Type 1]: Description, template, usage
- [Type 2]: Description, template, usage

### Tone and Voice
- **Overall Tone**: [Professional/Friendly/Casual/etc.]
- **Voice Characteristics**: [Clear, concise, helpful]
- **Do**: Use active voice, address user directly
- **Don't**: Use jargon, be condescending

### Microcopy Patterns
- **Buttons**: Action-oriented verbs (Save, Submit, Continue)
- **Errors**: "Oops! [What went wrong] [How to fix]"
- **Empty States**: "[Encouraging message] [Call to action]"
- **Success**: "Great! [What happened] [Next steps]"

## 7. UX Principles for This Project

1. **[Principle 1]**: Description and rationale
2. **[Principle 2]**: Description and rationale
3. **[Principle 3]**: Description and rationale

## 8. Key UX Metrics

- **Task Success Rate**: Percentage of users completing key flows
- **Time on Task**: Average time to complete key actions
- **Error Rate**: Frequency of user errors
- **User Satisfaction**: Survey scores, feedback sentiment
```

### Next Steps
After completing UX spec:
1. Create UI specification (visual design, components)
2. Validate UX spec with stakeholders
3. Use UX spec to inform technical architecture

## Report

### Completion Summary
Upon completion of this workflow, provide the following:

1. **Document Location**: Confirm the UX specification has been written to `{documentation_dir}/design/ux-spec.md`

2. **Personas Created**: List all user personas defined (primary and secondary)

3. **Coverage Summary**:
   - Number of user journeys mapped
   - Number of user flows created
   - Key features covered in information architecture
   - Number of interaction patterns defined

4. **Validation Status**: Confirm all checklist items have been addressed

5. **Key UX Insights**: Highlight 2-3 critical UX decisions or insights that emerged during specification creation

6. **Recommendations**: Any suggested next steps or areas requiring stakeholder validation

7. **Accessibility Compliance**: Confirm WCAG AA standards are addressed

### Example Report Format
```
UX Specification Complete

Document Location: .bmad/project-name/design/ux-spec.md

Personas Created:
- Primary: [Persona Name] - [Brief description]
- Secondary: [Persona Name] - [Brief description]

Coverage:
- 3 user journeys mapped
- 5 user flows created
- Complete information architecture with 4 main sections
- 12 interaction patterns defined

Validation: All checklist items addressed ✓

Key Insights:
1. [Insight about user needs or pain points]
2. [Insight about interaction patterns or accessibility]

Recommendations:
- Validate journey maps with user research
- Review accessibility requirements with development team

Next Steps: Proceed to UI specification or stakeholder validation
```
