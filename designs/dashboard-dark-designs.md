---
name: Clarity ESG
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#45464c'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#575e70'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#141b2b'
  on-primary-container: '#7d8497'
  inverse-primary: '#c0c6db'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#001a42'
  on-tertiary-container: '#3980f4'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce2f7'
  primary-fixed-dim: '#c0c6db'
  on-primary-fixed: '#141b2b'
  on-primary-fixed-variant: '#404758'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#d8e2ff'
  tertiary-fixed-dim: '#adc6ff'
  on-tertiary-fixed: '#001a42'
  on-tertiary-fixed-variant: '#004395'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  container-margin: 1rem
  stack-gap: 1rem
  section-gap: 2rem
  card-padding: 1.25rem
  gutter: 1rem
---

## Brand & Style

The design system is engineered for the high-stakes world of ESG (Environmental, Social, and Governance) reporting and Greenhouse Gas (GHG) accounting. It balances the rigor of data-heavy enterprise software with a modern, clean aesthetic that promotes clarity and action.

The brand personality is **authoritative yet optimistic**. It speaks to corporate sustainability officers who need to navigate complex data without feeling overwhelmed. 

**Visual Style: Corporate / Modern Minimalist**
- **Cleanliness:** Massive whitespace and a neutral base palette to ensure data visualizations remain the focal point.
- **Precision:** Sharp, consistent alignment following a structured grid, inspired by high-density financial dashboards.
- **Impact:** Strategic use of vibrant colors is reserved exclusively for environmental indicators, creating a clear mental model where color always equals data.

## Colors

The palette is bifurcated into **Structural Colors** and **Data Colors**.

### Structural Colors
The UI relies on a high-contrast monochromatic base. 
- **Primary:** Deep Onyx (#111827) used for critical text and primary actions.
- **Surface:** A layered approach using White (#FFFFFF) for cards and Light Gray (#F9FAFB) for the background to create subtle separation without heavy borders.
- **Accents:** Muted grays for borders and secondary labels to maintain a "quiet" interface.

### Data Visualization
Data colors are vibrant and semantically assigned to specific GHG scopes and ESG metrics:
- **Green:** Positive environmental impact, offsets, and sustainability targets.
- **Blue:** Energy consumption, electricity, and Scope 2 emissions.
- **Orange/Red:** Direct emissions (Scope 1), fuel consumption, and areas requiring urgent mitigation.

## Typography

This design system utilizes **Hanken Grotesk** as the primary typeface for its contemporary, sharp terminals and excellent legibility in data-dense environments. It provides a professional, "Swiss-style" feel that fits financial and environmental reporting.

**JetBrains Mono** is introduced as a secondary label font. This monospaced choice is used for technical data points, GHG metric units (e.g., tCO2e), and ID tags, reinforcing the "accounting" nature of the application.

- **Headlines:** Use tight letter-spacing and bold weights to establish a clear hierarchy.
- **Body Text:** Optimized for readability with generous line heights.
- **Numerical Data:** Should always be rendered with tabular figures to ensure alignment in lists and tables.

## Layout & Spacing

The layout follows a **fluid-to-fixed model** optimized for mobile-first data consumption.

- **Mobile:** A single-column vertical stack with 16px (1rem) side margins. Data cards occupy the full width of the container.
- **Tablet/Desktop:** For reporting views, the system transitions to a 12-column grid. Cards can span 4, 6, or 12 columns depending on the complexity of the graph.
- **Spacing Rhythm:** An 8px base unit is used. Internal card padding is set to 20px (1.25rem) to ensure charts have enough breathing room from their titles and legends.
- **Density:** High. Information density is prioritized, but white space is used strategically between cards to prevent cognitive load.

## Elevation & Depth

To maintain the "clean and modern" requirement, the design system avoids heavy shadows and skeuomorphism.

- **Surface Tiers:** Depth is primarily communicated through tonal layering. The background is a soft gray (#F3F4F6), while interactive cards are pure white (#FFFFFF).
- **Outlines:** Cards and input fields use a 1px solid border (#E5E7EB). This "flat-border" approach provides a crisp, architectural look.
- **Shadows:** Use a single, highly-diffused "Ambient Shadow" for the primary active card or modal: `0 4px 20px rgba(0, 0, 0, 0.05)`. This shadow should be almost imperceptible, serving only to lift the element slightly from the background.
- **States:** Hover or active states are indicated by a subtle darkening of the border color rather than an increase in shadow.

## Shapes

The shape language is **Soft (0.25rem)**. 

This minimal rounding provides a modern touch while maintaining the serious, professional tone required for ESG reporting. 
- **Small Elements:** Buttons, checkboxes, and tags use the base 4px (0.25rem) radius.
- **Large Elements:** Data cards and modals use `rounded-lg` (8px / 0.5rem) to soften the large surface areas.
- **Graphs:** Bar charts and progress indicators should use slightly rounded caps (2px) to feel modern rather than strictly industrial.

## Components

### Buttons
- **Primary:** Solid Deep Onyx (#111827) with white text. No gradient. High-contrast.
- **Secondary:** Ghost style. 1px border (#D1D5DB) with Deep Onyx text.
- **Data Action:** A "Sustainability Green" variant used only for "Submit Report" or "Finalize Audit" actions.

### Cards (The "Container" for Data)
- White background, 1px light gray border, 8px corner radius.
- Headers should include a bold title in `headline-sm` and a `label-md` for the metric unit (e.g., "Total Emissions | tCO2e").

### Input Fields
- Understated styling. 1px border (#E5E7EB) that turns Primary Black on focus.
- Labels use `label-md` in a medium gray, placed above the field.

### Data Visualization Components
- **Trend Lines:** 2px stroke width. Use the data color palette.
- **Progress Bars:** Use a "Track and Indicator" model. The track is a 10% opacity version of the indicator's color.
- **Chips/Badges:** Used for "Scope 1", "Scope 2", and "Scope 3" tags. These use low-saturation background tints with high-saturation text of the same hue.

### Navigation
- **Mobile Bottom Bar:** Pure white background with a thin top border. Icons are simple 24px line art. Active state indicated by a Primary Black icon and a small 4px dot below.