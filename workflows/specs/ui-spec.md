# UI Specification Workflow

## Purpose

Create comprehensive UI specifications including visual design system, component library, screen designs, and design tokens. This workflow transforms UX specifications and product requirements into detailed visual design documentation that guides development teams in implementing consistent, accessible, and responsive user interfaces.

## Variables

- `{documentation_dir}` - Root directory for project documentation
- `{documentation_language}` - Language for documentation output (e.g., English, Spanish)
- `{project_name}` - Name of the project being documented

## Instructions

### Prerequisites
Before starting this workflow, ensure:
1. UX spec exists in `{documentation_dir}/design/ux-spec.md`
2. PRD exists in `{documentation_dir}/product/PRD.md`
3. Project initialized with workflow-init

### Inputs Required
- UX specification (user flows, interaction patterns)
- Product brief (brand guidelines, if any)
- PRD (features and requirements)
- Target platforms (web, mobile, desktop)

### Validation Checklist
Before marking as complete, verify:
- [ ] All design tokens are defined with consistent naming
- [ ] Color contrast meets WCAG AA standards
- [ ] Component library covers all UI elements from UX flows
- [ ] All interactive states are specified for each component
- [ ] Responsive behavior is defined for all breakpoints
- [ ] Animations enhance UX without causing motion sickness
- [ ] Accessibility requirements are specific and measurable
- [ ] Design tokens can be exported for implementation

## Workflow

### Step 1: Define Visual Design Principles
1. Establish design direction:
   - Modern/Classic/Minimalist/Bold/etc.
   - Brand alignment
   - Industry standards and expectations
2. Define visual hierarchy rules
3. Set spacing and layout principles

### Step 2: Create Design Tokens

1. **Color System**:
   - Primary colors (brand colors)
   - Secondary/accent colors
   - Semantic colors (success, warning, error, info)
   - Neutral colors (grays, backgrounds, borders)
   - Text colors (primary, secondary, disabled)
   - Dark mode variants (if applicable)

2. **Typography**:
   - Font families (headings, body, mono)
   - Font sizes (scale: xs, sm, base, lg, xl, 2xl, etc.)
   - Font weights (light, regular, medium, semibold, bold)
   - Line heights
   - Letter spacing

3. **Spacing System**:
   - Spacing scale (4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, etc.)
   - Padding conventions
   - Margin conventions
   - Gap/gutter standards

4. **Border/Radius**:
   - Border widths
   - Border radius scale (none, sm, base, lg, full)
   - Border colors

5. **Shadows/Elevation**:
   - Shadow levels (sm, base, md, lg, xl)
   - Elevation system for z-index

### Step 3: Design Component Library

For each component type, specify:

1. **Visual States**:
   - Default
   - Hover
   - Active/Pressed
   - Focus
   - Disabled
   - Loading
   - Error

2. **Variants**:
   - Sizes (sm, md, lg)
   - Colors/themes (primary, secondary, destructive, ghost, etc.)
   - Styles (solid, outline, text)

3. **Component Specifications**:

#### Core Components
- **Button**: Primary, secondary, destructive, ghost, icon, sizes, states
- **Input**: Text, number, email, password, search, textarea, sizes, states
- **Select/Dropdown**: Single select, multi-select, searchable, sizes, states
- **Checkbox**: Standard, indeterminate, sizes, states
- **Radio**: Standard, sizes, states
- **Toggle/Switch**: Standard, sizes, states
- **Link**: Standard, underlined, button-style, sizes, states

#### Feedback Components
- **Alert/Toast**: Success, warning, error, info, dismissible
- **Modal/Dialog**: Sizes, with/without overlay, animations
- **Tooltip**: Positions (top, right, bottom, left), sizes
- **Progress**: Linear, circular, determinate, indeterminate
- **Skeleton**: Text, image, card patterns
- **Badge**: Sizes, colors, positions

#### Navigation Components
- **Nav Bar**: Horizontal, vertical, collapsible
- **Breadcrumbs**: Standard, with icons, max items
- **Tabs**: Horizontal, vertical, sizes, styles
- **Pagination**: Standard, compact, with page size selector
- **Sidebar**: Collapsible, pinned, overlay

#### Layout Components
- **Card**: Standard, with header/footer, bordered, elevated
- **Container**: Max widths, padding, centering
- **Grid**: Columns, gaps, responsive breakpoints
- **Divider**: Horizontal, vertical, with text

#### Data Display
- **Table**: Sortable, filterable, selectable rows, sticky headers
- **List**: Ordered, unordered, description lists
- **Avatar**: Sizes, with fallback, with status indicator
- **Icon**: Sizes, colors, variants

### Step 4: Define Screen Layouts

For each major screen/view from UX flows:
1. Layout structure (header, sidebar, main, footer)
2. Grid system and responsive breakpoints
3. Component placement
4. Content hierarchy
5. Responsive behavior (desktop, tablet, mobile)

### Step 5: Specify Animations and Transitions

1. **Transition Timing**:
   - Duration scale (fast: 150ms, base: 200ms, slow: 300ms)
   - Easing functions (ease-in, ease-out, ease-in-out, spring)

2. **Animation Patterns**:
   - Page transitions
   - Modal/dialog entry/exit
   - Dropdown/menu animations
   - Loading animations
   - Hover effects
   - Focus animations

### Step 6: Define Responsive Behavior

1. **Breakpoints**:
   - Mobile: 0-640px
   - Tablet: 641-1024px
   - Desktop: 1025px+
   - (Adjust based on project needs)

2. **Responsive Patterns**:
   - Navigation collapse/expand
   - Grid column changes
   - Component size adjustments
   - Typography scaling
   - Image/media handling

### Step 7: Accessibility Specifications

1. **Color Contrast**: All text meets WCAG AA (AAA preferred)
2. **Focus Indicators**: Visible on all interactive elements
3. **Touch Targets**: Minimum 44x44px on mobile
4. **Text Sizes**: Minimum 16px for body text
5. **Icon Sizes**: Minimum 24x24px for interactive icons

### Step 8: Generate Complete Documentation

Generate `{documentation_dir}/design/ui-spec.md` with the following structure:

```markdown
# UI Specification - [Project Name]

## 1. Visual Design Principles

- **Design Direction**: [Modern/Minimalist/etc.]
- **Visual Hierarchy**: [How elements are prioritized visually]
- **Spacing Philosophy**: [Consistent spacing rationale]
- **Brand Alignment**: [How design reflects brand]

## 2. Design Tokens

### Colors
```css
/* Primary Colors */
--color-primary-50: #...;
--color-primary-100: #...;
...
--color-primary-900: #...;

/* Semantic Colors */
--color-success: #...;
--color-warning: #...;
--color-error: #...;
--color-info: #...;

/* Neutrals */
--color-gray-50: #...;
...
--color-gray-900: #...;

/* Text Colors */
--color-text-primary: #...;
--color-text-secondary: #...;
--color-text-disabled: #...;
```

### Typography
```css
/* Font Families */
--font-sans: 'Inter', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', monospace;

/* Font Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */

/* Font Weights */
--font-light: 300;
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;

/* Line Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

### Spacing
```css
--spacing-1: 0.25rem;  /* 4px */
--spacing-2: 0.5rem;   /* 8px */
--spacing-3: 0.75rem;  /* 12px */
--spacing-4: 1rem;     /* 16px */
--spacing-6: 1.5rem;   /* 24px */
--spacing-8: 2rem;     /* 32px */
--spacing-12: 3rem;    /* 48px */
--spacing-16: 4rem;    /* 64px */
```

### Border Radius
```css
--radius-none: 0;
--radius-sm: 0.125rem;   /* 2px */
--radius-base: 0.25rem;  /* 4px */
--radius-md: 0.375rem;   /* 6px */
--radius-lg: 0.5rem;     /* 8px */
--radius-xl: 0.75rem;    /* 12px */
--radius-2xl: 1rem;      /* 16px */
--radius-full: 9999px;
```

### Shadows
```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-base: 0 1px 3px rgba(0, 0, 0, 0.1);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1);
```

## 3. Component Library

### Button

**Variants**:
- Primary: Solid background, primary color
- Secondary: Outline style
- Destructive: Red/error color
- Ghost: Transparent background, hover effect
- Link: Text-only style

**Sizes**:
- sm: height 32px, padding 8px 12px, text-sm
- md: height 40px, padding 10px 16px, text-base
- lg: height 48px, padding 12px 20px, text-lg

**States**:
- Default: [colors, padding, border, etc.]
- Hover: [color changes, shadow, etc.]
- Active: [pressed state styling]
- Focus: [focus ring color and offset]
- Disabled: [opacity, cursor, colors]
- Loading: [spinner, disabled state]

**Code Example**:
```html
<button class="btn btn-primary btn-md">
  Click me
</button>
```

### Input

**Variants**:
- Text, Number, Email, Password, Search, Textarea

**Sizes**:
- sm, md, lg

**States**:
- Default, Focus, Error, Disabled, Read-only

**Specifications**:
[Detailed specifications...]

[Continue for all components...]

## 4. Screen Layouts

### Layout: Dashboard
- **Structure**: Header (60px) + Sidebar (240px) + Main content
- **Grid**: 12-column grid, 24px gutters
- **Responsive**:
  - Desktop (1025px+): Sidebar visible, 12 columns
  - Tablet (641-1024px): Sidebar collapsible, 8 columns
  - Mobile (0-640px): Sidebar overlay, 4 columns

### Layout: [Other Key Screens]
[Repeat for each major screen type]

## 5. Animations & Transitions

### Timing
```css
--duration-fast: 150ms;
--duration-base: 200ms;
--duration-slow: 300ms;

--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

### Animation Patterns
- **Page Transitions**: Fade in (200ms, ease-out)
- **Modal Entry**: Scale + fade (200ms, ease-out)
- **Dropdown**: Slide down + fade (150ms, ease-out)
- **Hover Effects**: Color/shadow (150ms, ease-in-out)

## 6. Responsive Breakpoints

```css
/* Mobile First */
--breakpoint-sm: 640px;   /* Small tablets */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Desktops */
--breakpoint-xl: 1280px;  /* Large desktops */
--breakpoint-2xl: 1536px; /* Extra large */
```

### Responsive Behavior
- **Typography**: Scale down 1 size on mobile
- **Spacing**: Reduce to 75% on mobile
- **Components**: Use smaller size variants
- **Grid**: Reduce columns (12 → 8 → 4)

## 7. Accessibility Requirements

- **Color Contrast**: All text meets WCAG AA (4.5:1 for normal, 3:1 for large)
- **Focus Indicators**: 2px solid ring with offset, visible on all interactive elements
- **Touch Targets**: Minimum 44x44px
- **Text Sizes**: Minimum 16px for body, 14px for small
- **Icon Sizes**: Minimum 24x24px for interactive, 16x16px for decorative

## 8. Dark Mode (if applicable)

[Specify dark mode color tokens and variations]

## 9. Design Tools & Resources

- **Design Files**: [Link to Figma/Sketch files]
- **Icon Library**: [Which icon set: Heroicons, Lucide, etc.]
- **Illustration Style**: [If applicable]
- **Image Guidelines**: [Aspect ratios, optimization, formats]

## 10. Implementation Notes

- **CSS Framework**: [Tailwind CSS/Custom CSS/etc.]
- **Component Library**: [shadcn/ui, Radix, Headless UI, etc.]
- **CSS-in-JS**: [Styled-components, Emotion, etc., if applicable]
- **Design Token Format**: [CSS variables, JSON, Tailwind config]
```

## Report

### Output File
Write the complete UI specification to: `{documentation_dir}/design/ui-spec.md` (in `{documentation_language}`)

### Completion Summary
Upon completion, provide a summary including:

1. **Design System Overview**:
   - Design direction and visual principles established
   - Number of design tokens defined (colors, typography, spacing, etc.)
   - Design token format used (CSS variables, JSON, Tailwind config)

2. **Component Library Coverage**:
   - Total number of components specified
   - Component categories covered (Core, Feedback, Navigation, Layout, Data Display)
   - All interactive states documented per component

3. **Responsive Design**:
   - Breakpoints defined
   - Number of screen layouts specified
   - Responsive patterns documented

4. **Accessibility Compliance**:
   - WCAG conformance level (AA/AAA)
   - Accessibility features documented
   - Touch target and text size standards confirmed

5. **Validation Status**:
   - Checklist completion status
   - Any items requiring stakeholder review
   - Dependencies identified for implementation

6. **Next Steps**:
   - Create component library in code (following standards in `.bmad/standards/`)
   - Generate design tokens file (CSS/JSON)
   - Validate with stakeholders and UX team
   - Use for epic and story breakdown

### Deliverable Confirmation
Confirm the following have been created:
- [ ] `{documentation_dir}/design/ui-spec.md` exists and is complete
- [ ] All sections (1-10) are populated with project-specific details
- [ ] Design tokens are ready for export to implementation
- [ ] Component specifications include all required states and variants
- [ ] Accessibility requirements are specific and measurable
