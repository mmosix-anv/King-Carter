# Admin Panel Styling System

This directory contains the foundational styling system for the Enhanced Admin Panel.

## Overview

The admin panel uses a consistent design system built with SCSS modules. All styling is centralized in `base.scss`, which defines variables for colors, typography, spacing, and other design tokens.

## File Structure

```
apps/web/src/admin/styles/
├── base.scss          # Core styling variables and utilities
└── README.md          # This file
```

## Using the Base Styles

To use the base styling system in your component SCSS module:

```scss
@import '../../admin/styles/base.scss';

.myComponent {
  background: $color-bg-card;
  padding: $padding-lg;
  border-radius: $border-radius-base;
  color: $color-text-primary;
}
```

## Design Tokens

### Colors

#### Primary Colors
- `$color-primary` - Gold (#D4AF37) - Primary brand color
- `$color-primary-dark` - Darker gold for hover states
- `$color-primary-darker` - Even darker for active states
- `$color-primary-light` - Light gold for backgrounds

#### Neutral Colors
- `$color-dark` - Dark background (#191919)
- `$color-text-primary` - Primary text color
- `$color-text-secondary` - Secondary text color
- `$color-text-muted` - Muted text color
- `$color-white` - White

#### Background Colors
- `$color-bg-page` - Page background (#f8f9fa)
- `$color-bg-card` - Card background (white)
- `$color-bg-input` - Input background
- `$color-bg-hover` - Hover background
- `$color-bg-active` - Active background

#### Border Colors
- `$color-border` - Default border
- `$color-border-dark` - Darker border
- `$color-border-focus` - Focus border (primary color)

#### Status Colors
- `$color-success` - Success state (#28a745)
- `$color-danger` - Danger/error state (#e74c3c)
- `$color-warning` - Warning state (#f39c12)
- `$color-info` - Info state (#3498db)

### Typography

#### Font Families
- `$font-family-base` - Inter with fallbacks
- `$font-family-heading` - Inter for headings

#### Font Sizes
- `$font-size-xs` - 0.75rem (12px)
- `$font-size-sm` - 0.875rem (14px)
- `$font-size-base` - 1rem (16px)
- `$font-size-lg` - 1.1rem (17.6px)
- `$font-size-xl` - 1.25rem (20px)
- `$font-size-2xl` - 1.5rem (24px)
- `$font-size-3xl` - 2rem (32px)
- `$font-size-4xl` - 2.5rem (40px)

#### Font Weights
- `$font-weight-normal` - 400
- `$font-weight-medium` - 500
- `$font-weight-semibold` - 600
- `$font-weight-bold` - 700

#### Line Heights
- `$line-height-tight` - 1.25
- `$line-height-normal` - 1.5
- `$line-height-relaxed` - 1.6

### Spacing

The spacing system is based on a 4px unit (`$spacing-unit`):

- `$spacing-0` - 0
- `$spacing-1` - 4px
- `$spacing-2` - 8px
- `$spacing-3` - 12px
- `$spacing-4` - 16px
- `$spacing-5` - 20px
- `$spacing-6` - 24px
- `$spacing-8` - 32px
- `$spacing-10` - 40px
- `$spacing-12` - 48px
- `$spacing-16` - 64px

#### Common Spacing Values
- `$padding-xs` - 8px
- `$padding-sm` - 12px
- `$padding-base` - 16px
- `$padding-lg` - 24px
- `$padding-xl` - 32px

- `$margin-xs` - 8px
- `$margin-sm` - 12px
- `$margin-base` - 16px
- `$margin-lg` - 24px
- `$margin-xl` - 32px

### Layout

#### Container Widths
- `$container-sm` - 640px
- `$container-md` - 768px
- `$container-lg` - 1024px
- `$container-xl` - 1200px

#### Breakpoints
- `$breakpoint-xs` - 480px
- `$breakpoint-sm` - 640px
- `$breakpoint-md` - 768px
- `$breakpoint-lg` - 1024px
- `$breakpoint-xl` - 1280px

#### Z-index Layers
- `$z-index-dropdown` - 1000
- `$z-index-sticky` - 1020
- `$z-index-fixed` - 1030
- `$z-index-modal-backdrop` - 1040
- `$z-index-modal` - 1050
- `$z-index-popover` - 1060
- `$z-index-tooltip` - 1070

### Borders & Radius

#### Border Widths
- `$border-width-thin` - 1px
- `$border-width-base` - 2px
- `$border-width-thick` - 3px

#### Border Radius
- `$border-radius-sm` - 6px
- `$border-radius-base` - 8px
- `$border-radius-lg` - 12px
- `$border-radius-xl` - 16px
- `$border-radius-full` - 9999px (circular)

### Shadows

- `$shadow-xs` - Minimal shadow
- `$shadow-sm` - Small shadow
- `$shadow-base` - Base shadow
- `$shadow-md` - Medium shadow
- `$shadow-lg` - Large shadow (with gold tint)
- `$shadow-xl` - Extra large shadow
- `$shadow-focus` - Focus ring shadow
- `$shadow-focus-danger` - Danger focus ring
- `$shadow-focus-warning` - Warning focus ring

### Transitions

- `$transition-fast` - 0.15s ease
- `$transition-base` - 0.2s ease
- `$transition-slow` - 0.3s ease
- `$transition-all` - All properties with slow timing
- `$transition-colors` - Color transitions
- `$transition-transform` - Transform transitions

## Mixins

### Responsive Breakpoint Mixin

```scss
@include respond-to(md) {
  // Styles for screens <= 768px
}
```

Available breakpoints: `xs`, `sm`, `md`, `lg`, `xl`

### Button Reset Mixin

```scss
@include button-reset;
```

Removes default button styling.

### Card Style Mixin

```scss
@include card;
```

Applies standard card styling with background, border, and padding.

### Focus Ring Mixin

```scss
@include focus-ring;
```

Applies the standard focus ring styling.

### Truncate Text Mixin

```scss
@include truncate;
```

Truncates text with ellipsis.

## Utility Classes

The following utility classes are available globally:

- `.admin-container` - Standard container with max-width and padding
- `.admin-card` - Card styling
- `.admin-text-muted` - Muted text color
- `.admin-text-primary` - Primary color text
- `.admin-text-danger` - Danger color text
- `.admin-text-success` - Success color text

## Animations

Pre-defined animations:
- `fadeIn` - Fade in from transparent
- `slideUp` - Slide up from below
- `slideDown` - Slide down from above
- `spin` - Continuous rotation (for loading spinners)

Usage:
```scss
.myElement {
  animation: fadeIn $transition-base;
}
```

## Best Practices

1. **Always import base.scss** at the top of your component SCSS module
2. **Use variables instead of hardcoded values** for consistency
3. **Use the spacing scale** for margins and padding
4. **Use mixins** for common patterns like responsive breakpoints
5. **Follow the naming convention** for CSS classes (camelCase in SCSS modules)
6. **Keep component styles scoped** using SCSS modules
7. **Use semantic color names** (e.g., `$color-danger` instead of `$color-red`)

## Responsive Design

All admin components should be responsive. Use the `respond-to` mixin for breakpoints:

```scss
.myComponent {
  display: flex;
  gap: $spacing-8;

  @include respond-to(md) {
    flex-direction: column;
    gap: $spacing-4;
  }
}
```

## Accessibility

- All interactive elements should have visible focus states
- Use the `$shadow-focus` variable for focus rings
- Ensure sufficient color contrast (WCAG AA minimum)
- Use semantic HTML and ARIA attributes where appropriate

## Examples

### Creating a Button

```scss
@import '../../admin/styles/base.scss';

.button {
  background: $color-primary;
  color: $color-dark;
  padding: $padding-sm $padding-lg;
  border: $border-width-thin solid $color-primary;
  border-radius: $border-radius-base;
  font-weight: $font-weight-semibold;
  font-family: $font-family-base;
  cursor: pointer;
  transition: $transition-all;

  &:hover {
    background: $color-primary-dark;
  }

  &:focus {
    @include focus-ring;
  }

  @include respond-to(md) {
    width: 100%;
  }
}
```

### Creating a Card

```scss
@import '../../admin/styles/base.scss';

.card {
  @include card;
  
  &:hover {
    border-color: $color-primary;
    box-shadow: $shadow-lg;
  }
}

.cardTitle {
  font-size: $font-size-xl;
  font-weight: $font-weight-semibold;
  color: $color-text-primary;
  margin-bottom: $margin-base;
}

.cardContent {
  color: $color-text-secondary;
  line-height: $line-height-relaxed;
}
```

## Maintenance

When updating the design system:

1. Update variables in `base.scss`
2. Document changes in this README
3. Test changes across all admin components
4. Ensure responsive behavior is maintained
5. Verify accessibility standards are met
