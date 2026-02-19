# Redesign Homepage From Scratch Spec

## Why
The current homepage implementation suffers from rigid absolute positioning derived from a direct Figma export, resulting in poor responsiveness and layout issues. The visual hierarchy and spacing do not match the provided design screenshot, and the code is difficult to maintain.

## What Changes
- **Complete Rewrite**: Replace the entire content of `src/pages/Home/index.jsx` and `src/pages/Home/index.module.scss`.
- **Modern Layout**: Use Flexbox and CSS Grid for a fluid, responsive design.
- **Visual Fidelity**: Match the provided screenshot (`c:\dev\Karton\.figma\image\screenshot_3_4.png` and user uploaded image) for typography, spacing, and component styling.
- **Asset Reuse**: Utilize existing image assets from `public/image` but implement them with proper `img` tags or background images in CSS.

## Impact
- **Affected Specs**: `refactor-homepage-to-match-screenshot` (superseded by this spec).
- **Affected Code**: `src/pages/Home/index.jsx`, `src/pages/Home/index.module.scss`.
- **User Experience**: Significantly improved responsiveness and visual consistency with the design.

## ADDED Requirements
### Requirement: New Homepage Structure
The homepage SHALL be structured into the following distinct sections:
1.  **Hero Section**: Full-screen width, background image, large "Premium service..." heading.
2.  **Intro Section**: "King & Carter Premier..." text block.
3.  **Services Section**: "Services" heading, 4-column grid of vertical cards with bottom-left overlay text.
4.  **Experiences Section**: "Experiences" heading, 4-column grid of vertical cards (similar to Services).
5.  **Why King & Carter Section**: "Why King & Carter" heading, 5 circular feature elements arranged horizontally (stacking on mobile).
6.  **Contact Section**: Dark background, two-column layout (text/form vs image/decoration), input fields for Name, Email, Message, Checkboxes.
7.  **Footer**: Simple footer with links and copyright (if not part of global Layout, but screenshot shows specific footer content).

#### Scenario: Responsive Behavior
- **WHEN** the viewport width is reduced (e.g., mobile/tablet)
- **THEN** the grid columns (Services, Experiences) SHALL stack vertically or into fewer columns.
- **AND** the "Why King & Carter" circles SHALL wrap to fit the screen.

## MODIFIED Requirements
### Requirement: Home Component
- `Home/index.jsx` content will be completely replaced.
- `Home/index.module.scss` content will be completely replaced.

## REMOVED Requirements
- All previous absolute positioning and fixed-pixel coordinates are removed.
