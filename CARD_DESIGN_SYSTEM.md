# Card Design System

## Overview

The SFT_LMS application uses a standardized card design system with theme-coordinated colors. All card styling is defined in CSS (`src/index.css`) and should be applied via class names.

## Core Principles

1. **Define in CSS, Apply in Code** - All styling is in CSS files, not inline styles or Tailwind utilities
2. **Theme Coordination** - Cards, borders, backgrounds, icons, and tables all share the same theme color
3. **Consistent Spacing** - Standard 24px (p-6) padding throughout
4. **Professional Hierarchy** - Clear typography and component structure

---

## Card Color Variants

### Available Variants

| Class | Color | Hex | Usage |
| ----- | ----- | --- | ----- |
| `card-v1` | Soft Sky Blue | #7B9CC4 | Primary/main content cards |
| `card-v2` | Sage Green | #6B9B8E | Secondary/alternative cards |
| `card-v3` | Soft Purple | #9B86BD | Tertiary/detailed cards |
| `card-v4` | Ocean Blue | #5A8FAE | Accent/special case cards |
| `card-v5` | Muted Green | #8BA888 | Detail/additional info cards |
| `card-v6` | Dusty Purple | #8E7DAB | Conclusion/summary cards |

### How Variants Work

Each variant sets three CSS custom properties:

```css
.card-v1 {
  --card-theme-color: var(--color-card-1);  /* For borders, text, icons */
  --card-theme-rgb: 123, 156, 196;           /* For rgba() backgrounds */
  border-color: var(--color-card-1);
  background-color: rgba(123, 156, 196, 0.03);
}
```

All card components automatically inherit and use these theme colors.

---

## Card Patterns

### Pattern 1: Header + Body Card (Complex Data)

Use for cards with structured content, tables, and multiple sections.

```jsx
<div className="card card-v1">
  <div className="card-header">
    <div className="card-icon-wrapper">
      <div className="card-icon-circle">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="card-title-large">Card Title</h3>
    </div>
  </div>
  <div className="card-body">
    <p className="card-description">Description text here.</p>
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th className="text-left">Column 1</th>
            <th className="text-right">Column 2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-left">Data</td>
            <td className="text-right">123.45</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
```

**Features:**

- `card-header` has themed border-bottom and subtle background tint
- `card-body` provides 24px padding
- Tables inherit theme colors automatically

### Pattern 2: Simple Content Card (Stats/Summary)

Use for metric displays, summaries, and simple content.

```jsx
<div className="card card-v1">
  <div className="card-content">
    <div className="card-icon-wrapper">
      <div className="card-icon-circle">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h3 className="card-title-large">Metric Name</h3>
        <div className="card-subtitle">Metric Description</div>
      </div>
    </div>
    <div className="card-stat-value">£12,345.67</div>
    <div className="card-stat-label">As of today</div>
  </div>
</div>
```

**Features:**

- `card-content` provides 24px padding
- `card-stat-value` for large numbers
- `card-stat-label` for metadata

### Pattern 3: List Card

Use for feature lists, bullet points, or enumerated content.

```jsx
<div className="card card-v2">
  <div className="card-content">
    <div className="card-icon-wrapper">
      <div className="card-icon-circle">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="card-title-large">Feature List</h3>
    </div>
    <div className="card-list">
      <div className="card-list-item">
        <div className="card-list-bullet"></div>
        <span>First item description</span>
      </div>
      <div className="card-list-item">
        <div className="card-list-bullet"></div>
        <span>Second item description</span>
      </div>
    </div>
  </div>
</div>
```

**Features:**

- `card-list-bullet` uses theme color automatically
- Consistent spacing with `space-y-2`

---

## Component Reference

### Structural Components

| Class | Purpose | Properties |
| ----- | ------- | ---------- |
| `.card` | Base card container | Rounded corners, border, overflow hidden |
| `.card-header` | Card header with themed border | 24px horizontal padding, themed bottom border |
| `.card-body` | Card body section | 24px padding all sides |
| `.card-content` | Simple card content wrapper | 24px padding all sides |

### Icon Components

| Class | Purpose | Properties |
| ----- | ------- | ---------- |
| `.card-icon-wrapper` | Icon + title container | Flexbox with 16px gap |
| `.card-icon-circle` | Circular icon background | 48px circle, white text, themed background |

### Typography Components

| Class | Purpose | Font Size | Weight |
| ----- | ------- | --------- | ------ |
| `.card-title-large` | Main card title | 18px (text-lg) | Bold, uppercase |
| `.card-subtitle` | Secondary title | 12px (text-xs) | Semibold, uppercase |
| `.card-description` | Body text | 14px (text-sm) | Normal |
| `.card-formula` | Formula/code text | 12px (text-xs) | Mono, italic |
| `.card-stat-value` | Large metric display | 30px (text-3xl) | Bold |
| `.card-stat-label` | Stat metadata | 12px (text-xs) | Semibold, uppercase |

### List Components

| Class | Purpose |
| ----- | ------- |
| `.card-list` | List container with spacing |
| `.card-list-item` | Individual list item with bullet |
| `.card-list-bullet` | Themed bullet point |

---

## Tables

Tables automatically coordinate with card theme colors when placed inside a card.

### Basic Table Structure

```jsx
<table className="table">
  <thead>
    <tr>
      <th className="text-left">Left Aligned Header</th>
      <th className="text-right">Right Aligned Header</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td className="text-left">Data</td>
      <td className="text-right">123.45</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td className="text-left">Total</td>
      <td className="text-right">999.99</td>
    </tr>
  </tfoot>
</table>
```

### Table Features

- **Themed borders**: All borders use `--card-theme-color`
- **Themed header**: Background is 8% opacity theme color
- **Themed header text**: Column headers use theme color
- **Hover effect**: Rows highlight with 4% opacity theme color
- **Footer styling**: Semibold with 6% opacity background

### Text Alignment

Use standard Tailwind classes for alignment:

- `className="text-left"` for left-aligned cells
- `className="text-right"` for right-aligned cells (numbers, currencies)
- `className="text-center"` for centered cells

---

## Grid Layouts

While not strictly part of cards, use these container classes for card grids:

```jsx
{/* 3-column grid */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <div className="card card-v1">...</div>
  <div className="card card-v2">...</div>
  <div className="card card-v3">...</div>
</div>

{/* 2-column grid */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div className="card card-v1">...</div>
  <div className="card card-v2">...</div>
</div>
```

Standard gap is 24px (`gap-6`).

---

## Icon Guidelines

### Icon Circle Content

**Option 1: Lucide React Icons** (Preferred)

```jsx
import { TrendingDown } from 'lucide-react';

<div className="card-icon-circle">
  <TrendingDown className="w-6 h-6" />
</div>
```

**Option 2: Numbers** (For sequential steps)

```jsx
<div className="card-icon-circle">1</div>
```

**Icon Size**: Use `w-6 h-6` (24px) for icons inside the 48px circle.

### Standard Icons by Context

| Context | Suggested Icon |
| ------- | -------------- |
| Net Exposure | `TrendingDown` |
| Security | `Shield` |
| Currency/FX | `DollarSign` or `Coins` |
| Data/Tables | `Table` |
| Calculations | `Calculator` |
| Charts | `BarChart3` |
| Groups | `Layers` |
| Geography | `Globe` or `MapPin` |

---

## Migration Guide

### Old Pattern → New Pattern

**Before (inconsistent):**

```jsx
<div className="card p-6 card-v1">
  <div className="flex items-center gap-4 mb-3">
    <div className="card-icon-circle">
      <Icon className="w-5 h-5" />
    </div>
    <h3 className="card-title-large">Title</h3>
  </div>
  <div className="mt-4">
    <div className="text-3xl font-bold text-neutral-900">Value</div>
  </div>
</div>
```

**After (standardized):**

```jsx
<div className="card card-v1">
  <div className="card-content">
    <div className="card-icon-wrapper">
      <div className="card-icon-circle">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="card-title-large">Title</h3>
    </div>
    <div className="card-stat-value">Value</div>
  </div>
</div>
```

### Table Cell Classes

**Before:**

```jsx
<th className="text_table_header_left">Header</th>
<td className="text_table_left">Data</td>
```

**After:**

```jsx
<th className="text-left">Header</th>
<td className="text-left">Data</td>
```

All styling is now in `.table th` and `.table td` - only specify alignment.

---

## Common Mistakes to Avoid

1. **Don't mix padding classes**
   - ❌ `<div className="card card-v1 p-6">`
   - ✅ `<div className="card card-v1"><div className="card-content">...</div></div>`

2. **Don't use old table cell classes**
   - ❌ `className="text_table_header_right"`
   - ✅ `className="text-right"` (on `<th>` inside `.table`)

3. **Don't add inline styles**
   - ❌ `style={{ color: 'blue' }}`
   - ✅ Use CSS classes or request new component class

4. **Don't use inconsistent icon sizes**
   - ❌ `<Icon className="w-5 h-5" />` (too small)
   - ✅ `<Icon className="w-6 h-6" />` (standard 24px)

5. **Don't forget variant class**
   - ❌ `<div className="card">` (no theme color!)
   - ✅ `<div className="card card-v1">` (always specify variant)

---

## CSS Custom Properties Reference

### Available in all cards

```css
--card-theme-color   /* Hex color value (e.g., #7B9CC4) */
--card-theme-rgb     /* RGB values (e.g., 123, 156, 196) */
```

### Usage Examples

```css
/* In custom components */
.my-custom-element {
  color: var(--card-theme-color);
  background-color: rgba(var(--card-theme-rgb), 0.1);
  border: 2px solid var(--card-theme-color);
}
```

```jsx
/* In React inline styles (avoid if possible) */
<div style={{ backgroundColor: `var(--card-theme-color)` }}>...</div>
```

---

## File Locations

- **Main CSS**: `src/index.css` (lines 293-464)
- **Card color definitions**: `src/index.css` (lines 9-66, CSS variables)
- **Tailwind config**: `tailwind.config.js`
- **This documentation**: `CARD_DESIGN_SYSTEM.md`

---

## Questions & Support

For questions about the card system or to request new card components, consult this documentation first. All card styling should be defined in `src/index.css` following the established patterns.
