# UX Specification Workflow

## Purpose
Create comprehensive UX specifications including user flows, personas, journey maps, and interaction patterns.

## Prerequisites
- Product brief exists in `{documentation_dir}/product/product-brief.md`
- PRD exists in `{documentation_dir}/product/PRD.md`
- Project initialized with workflow-init

## Inputs
- Product brief
- PRD with user stories and requirements
- Target user information
- Business goals

## Process

### Step 1: Define User Personas
1. Identify primary and secondary user types
2. For each persona, define:
   - Demographics (age, role, experience level)
   - Goals and motivations
   - Pain points and frustrations
   - Technical proficiency
   - Context of use (device, environment, frequency)

### Step 2: Map User Journeys
1. For each major user goal from PRD:
   - Define the journey stages (awareness → consideration → action → retention)
   - Identify touchpoints at each stage
   - Map emotional states throughout journey
   - Highlight pain points and opportunities

### Step 3: Create User Flows
1. For each key feature/user story:
   - Define entry points
   - Map decision points and paths
   - Include error states and edge cases
   - Define success criteria and exit points
2. Use standard flow notation:
   - Rectangles for screens/pages
   - Diamonds for decisions
   - Arrows for flow direction

### Step 4: Define Information Architecture
1. Create site map or app structure
2. Define navigation patterns:
   - Primary navigation
   - Secondary navigation
   - Contextual navigation
3. Organize content hierarchy
4. Define search and filtering structures

### Step 5: Specify Interaction Patterns
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

### Step 6: Document Content Strategy
1. Define content types and templates
2. Specify tone and voice guidelines
3. Define microcopy patterns:
   - Button labels
   - Error messages
   - Empty states
   - Success confirmations

## Output Structure

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

## Validation Checklist

- [ ] All user personas are based on research or validated assumptions
- [ ] User journeys cover all major features from PRD
- [ ] User flows include error states and edge cases
- [ ] Information architecture supports user mental models
- [ ] Interaction patterns are consistent throughout
- [ ] Accessibility requirements meet WCAG AA standards
- [ ] Content strategy aligns with brand and user needs
- [ ] UX principles are specific to this project (not generic)

## Output
Write to: `{documentation_dir}/design/ux-spec.md` (in `{documentation_language}`)

## Next Steps
After completing UX spec:
1. Create UI specification (visual design, components)
2. Validate UX spec with stakeholders
3. Use UX spec to inform technical architecture
