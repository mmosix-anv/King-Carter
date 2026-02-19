# Homepage Visual Consistency and CSS Refactor Spec

## Why
The current homepage does not visually match the provided screenshot and relies on messy, absolute-positioned CSS that breaks full-width responsiveness and stacking.

## What Changes
- Rebuild the Home page sections to match the screenshot hierarchy and spacing.
- Replace absolute positioning with flex/flow for layout; keep absolute only for card overlays.
- Normalize typography (sizes, weights) to achieve the screenshot’s hierarchy.
- Align card overlays (title and badges) bottom-left over images.
- Add centered call-to-action under the intro band.
- Ensure “Why King & Carter” circles align in one row with centered labels.
- Make the contact section full-width with readable inputs and submit.
- **BREAKING**: Remove legacy absolute positions and fixed heights in Home SCSS.

## Impact
- Affected specs: homepage visual parity, responsive layout, typography consistency.
- Affected code: 
  - c:\dev\Karton\kc-web\src\pages\Home\index.module.scss
  - c:\dev\Karton\kc-web\src\pages\Home\index.jsx
  - c:\dev\Karton\kc-web\src\App.css (global box-sizing/type face only if needed)

## ADDED Requirements
### Requirement: Homepage visual parity
The system SHALL present the homepage matching the screenshot’s structure and spacing.

#### Scenario: Success case
- WHEN the user opens “/”
- THEN the hero shows heading above subheading with correct sizes,
- AND an intro band centered with a CTA,
- AND Services and Experiences display three image cards with bottom-left text overlays,
- AND “Why King & Carter” shows five circles in one row with centered text,
- AND the contact section spans full width with inputs and a working submit button.

## MODIFIED Requirements
### Requirement: Homepage CSS layout model
- The homepage layout MUST use flex/flow for stacking sections and responsive behavior.
- Absolute positioning MAY be used inside cards strictly for text overlays.
- Fixed pixel heights MUST be removed; use min-height, intrinsic content, and responsive units.

## REMOVED Requirements
### Requirement: Figma-export absolute layout
**Reason**: Causes overlap and breaks responsiveness; does not match screenshot.
**Migration**: Convert absolute containers to flex columns and use overlay absolutes only inside cards. Adjust typography and spacing to match screenshot tokens.

