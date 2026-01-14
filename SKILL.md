# BA-CVA LMS Development Skill File

## Project Overview

**Application**: BA-CVA Learning Management System (LMS)
**Purpose**: Training app for Basic Approach Credit Valuation Adjustment (BA-CVA) regulatory framework
**Stack**: React + TypeScript + Vite + Tailwind CSS
**Target**: PRA Near-Final Rules (PS9/24 and PS17/23) - Implementation Date: 1 January 2026

---

## Architecture

### Directory Structure

```
BA_CVA_LMS/
├── src/
│   ├── App.tsx                    # Main app shell with view routing
│   ├── index.css                  # Global styles and CSS variables
│   ├── main.tsx                   # Entry point
│   ├── constants/
│   │   └── bacva_params.ts        # Supervisory parameters
│   ├── store/
│   │   ├── courseStore.ts         # Zustand store for navigation state
│   │   ├── selectors.ts           # Store selectors
│   │   └── scorm-bridge.ts        # SCORM integration
│   ├── styles/
│   │   ├── chart-theme.ts         # Chart color configuration
│   │   └── design-tokens.ts       # Design system tokens
│   ├── types/
│   │   └── bacva.ts               # TypeScript interfaces
│   ├── ui/
│   │   ├── components/
│   │   │   └── NavigationButtons.tsx
│   │   ├── layouts/
│   │   │   └── Sidebar.tsx
│   │   └── views/                 # Main content views
│   │       ├── ScvaView.tsx       # Standalone CVA
│   │       ├── SnhView.tsx        # Single-Name Hedges
│   │       ├── HmaView.tsx        # Hedge Mismatch Adjustment
│   │       ├── IhView.tsx         # Index Hedges
│   │       ├── KReducedView.tsx   # K Reduced calculation
│   │       ├── KHedgedView.tsx    # K Hedged calculation
│   │       ├── KFullView.tsx      # K Full calculation
│   │       └── PracticeView.tsx   # Interactive practice
│   └── utils/
│       └── bacva_engine.ts        # Calculation engine
├── context/                       # Reference materials
│   ├── skills/
│   │   └── BA_CVA_SKILL.md        # Domain knowledge
│   ├── research/                  # Research documents
│   ├── blog/                      # Blog content (HTML)
│   ├── regulations/               # Regulatory text
│   ├── params/                    # Parameter configurations
│   └── logic/
│       └── BA_CVA_Detailed.ipynb  # Calculation examples
└── CARD_DESIGN_SYSTEM.md          # Card styling guide
```

### View Navigation Flow

```
Sidebar Navigation → courseStore.currentView → App.tsx renders view
```

Views: `k_full` | `k_reduced` | `k_hedged` | `scva` | `snh` | `hma` | `ih` | `practice`

---

## CSS Design System

### Color Palette

**Primary Brand**
- `--color-primary: #328cc1` - Main UI elements, borders, icons

**Card Variants** (use for section cards)
- `.card-v1`: Soft sky blue (#7B9CC4)
- `.card-v2`: Sage green (#6B9B8E)
- `.card-v3`: Soft purple (#9B86BD)
- `.card-v4`: Ocean blue (#5A8FAE)
- `.card-v5`: Muted green (#8BA888)
- `.card-v6`: Dusty purple (#8E7DAB)

**Chart Colors** (data visualization only)
- `--color-chart-1`: Deep purple (#292866)
- `--color-chart-2`: Forest green (#406352)
- `--color-chart-3`: Coral red (#F05C4F)
- `--color-chart-4`: Lavender (#C8C2E0)
- `--color-chart-5`: Mint green (#97D0B1)

**Neutral Scale**
- `--color-neutral-900` to `--color-neutral-50` for text and backgrounds

### Typography

- Font: Inter (system fallback)
- Base size: 13px
- `.text_body`: Standard body text
- `.heading-section`: Section headings (uppercase, tracking-wide)
- `.card-title-large`: Card titles
- `.legend-label`: Small uppercase labels

---

## View Component Pattern

### Standard View Structure

```tsx
import React from 'react';
import { IconName } from 'lucide-react';
import { NavigationButtons } from '../components/NavigationButtons';

export const ViewName: React.FC = () => {
    return (
        <div className="view-container">
            {/* Header */}
            <header className="view-header">
                <div className="view-header-content">
                    <IconName className="view-header-icon" />
                    <h1 className="view-header-title">View Title</h1>
                </div>
            </header>

            {/* Content */}
            <div className="view-content">
                <div className="content-wrapper">

                    {/* Section with heading */}
                    <section className="view-section">
                        <div className="heading-section">
                            <span>Section Title</span>
                        </div>

                        {/* Text block */}
                        <div className="text-block">
                            <p className="text_body">
                                Content paragraph...
                            </p>
                        </div>

                        {/* Formula card */}
                        <div className="card card-v1">
                            <div className="card-body">
                                <div className="card-stat-value">
                                    Formula here
                                </div>
                            </div>
                        </div>

                        {/* Grid layout for cards */}
                        <div className="layout-grid-2">
                            <div className="card card-v2">
                                <div className="card-body">
                                    <h3 className="card-title-large">Title</h3>
                                    <p className="card-subtitle">Subtitle</p>
                                    <div className="card-stat-value">Value</div>
                                    <p className="card-description">Description</p>
                                </div>
                            </div>
                            {/* Second card... */}
                        </div>

                        {/* Table */}
                        <table className="table">
                            <thead>
                                <tr>
                                    <th className="text_table_header_left">Column</th>
                                    <th className="text_table_header_right">Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="text_table_left">Row</td>
                                    <td className="text_table_right">Data</td>
                                </tr>
                            </tbody>
                        </table>
                    </section>

                    <NavigationButtons />
                </div>
            </div>
        </div>
    );
};
```

### CSS Classes Reference

**Layout**
- `.view-container` - Root container
- `.view-header` - Fixed header bar
- `.view-content` - Scrollable content area
- `.content-wrapper` - Content padding
- `.view-section` - Section spacing (mt-12, first:mt-0)
- `.layout-grid-2` - Two-column responsive grid

**Typography**
- `.heading-section` - Section headers
- `.text-block` - Text paragraphs container
- `.text_body` - Body text styling
- `.table_title` - Table/section label

**Cards**
- `.card` - Base card styling
- `.card-v1` through `.card-v6` - Color variants
- `.card-body` - Card padding
- `.card-title-large` - Card heading
- `.card-subtitle` - Card subheading
- `.card-description` - Card text
- `.card-stat-value` - Large centered value

**Tables**
- `.table` - Table styling
- `.text_table_header_left/right` - Header alignment
- `.text_table_left/right` - Cell alignment
- `.table-footnote` - Table notes

**Formula Highlighting**
- `.formula-systematic` - Blue for systematic terms
- `.formula-idiosyncratic` - Gray for idiosyncratic terms
- `.formula-hma` - Orange for HMA terms

**Legends**
- `.legend-container` - Legend wrapper
- `.legend-item` - Legend entry
- `.legend-dot-systematic/idiosyncratic/hma` - Color dots
- `.legend-label` - Legend text

---

## BA-CVA Domain Reference

### Core Formulas

**SCVA (Standalone CVA)**
```
SCVA_c = (1/α) · RW_c · Σ(M_NS · EAD_NS · DF_NS)
```

**K Reduced (Unhedged)**
```
K_reduced = √[(ρ · Σ SCVA_c)² + (1-ρ²) · Σ SCVA_c²]
```

**K Hedged**
```
K_hedged = √[(ρ · Σ(SCVA_c - SNH_c) - IH)² + (1-ρ²) · Σ(SCVA_c - SNH_c)² + Σ HMAC_c]
```

**K Full**
```
K_full = β · K_reduced + (1-β) · K_hedged
```

**Final Capital**
```
CVA_Capital = DS_BA_CVA · K_full = 0.65 · K_full
```

### Supervisory Parameters

| Parameter | Value | Description |
|-----------|-------|-------------|
| DS_BA_CVA | 0.65 | Discount Scalar |
| ρ (rho) | 0.50 | Correlation parameter |
| β (beta) | 0.25 | Hedge recognition floor |
| α (alpha) | 1.4 | CCR alpha (1.0 for pension funds) |
| Index scalar | 0.70 | Applied to index hedge RWs |

### Risk Weights by Sector

| Sector | IG | HY/Unrated |
|--------|-----|------------|
| Sovereigns | 0.5% | 2.0% |
| Local Govt/PSE | 1.0% | 4.0% |
| Financials | 5.0% | 12.0% |
| Pension Funds | 3.5% | 8.5% |
| Industrials | 3.0% | 7.0% |
| Consumer/Services | 3.0% | 8.5% |
| Technology | 2.0% | 5.5% |
| Healthcare/Utilities | 1.5% | 5.0% |
| Other | 5.0% | 12.0% |

### Hedge Correlations (r_hc)

| Type | Correlation | HMAC Factor |
|------|-------------|-------------|
| Direct reference | 1.00 | 0.00 |
| Legally related | 0.80 | 0.36 |
| Same sector/region | 0.50 | 0.75 |

---

## Context Files

Reference materials available in `/context`:

- **BA_CVA_SKILL.md**: Complete regulatory framework and formulas
- **research/*.md**: Deep dives on specific topics (EAD, Maturity, SNH, IH, HMA, etc.)
- **blog/*.html**: Structured content for each section
- **regulations/*.md**: PRA rule text
- **BA_CVA_Detailed.ipynb**: Worked calculation examples
- **BA_CVA_PARAMS.json**: Parameter dictionary

---

## Development Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # ESLint check
npm run preview  # Preview production build
```

---

## Implementation Guidelines

1. **Consistency**: Always use the CSS classes defined in index.css
2. **Card colors**: Cycle through card-v1 to card-v6 for visual variety
3. **Formula display**: Use subscript tags (`<sub>`) and color classes
4. **Navigation**: Include `<NavigationButtons />` at bottom of each view
5. **Sections**: Use `view-section` for proper spacing
6. **Tables**: Use standard table classes for alignment
7. **Text**: Always wrap paragraphs in `text-block` and apply `text_body`
8. **Icons**: Import from `lucide-react` for view headers

---

## Version

- Created: January 2026
- Last Updated: January 2026
