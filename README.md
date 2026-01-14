# BA-CVA Learning Module

An interactive learning management system for understanding the Basic Approach to Credit Valuation Adjustment (BA-CVA) capital calculations under Basel 3.1 regulations.

## Overview

This application provides a structured educational experience for learning how CVA capital requirements are calculated using the standardized BA-CVA methodology. It breaks down complex regulatory formulas into digestible components with visual process maps, explanatory text, and interactive elements.

## Features

- **Interactive Navigation**: Sidebar menu and sequential navigation buttons for a guided learning experience
- **Visual Process Maps**: Flow diagrams built with React Flow showing data dependencies between calculation components
- **Modular Content**: Each BA-CVA component has its own dedicated page with formulas, explanations, and examples
- **Responsive Design**: Clean, professional UI built with Tailwind CSS

## Module Structure

The learning module covers the following topics in sequence:

1. **Introduction** - Overview of CVA, the BA-CVA framework, and module navigation guide
2. **Process Maps** - Visual flowcharts illustrating how components connect from inputs to final capital
3. **K Full** - The complete capital charge formula blending hedged and unhedged components
4. **K Reduced** - Unhedged capital charge based solely on counterparty CVA exposures
5. **K Hedged** - Capital charge after recognizing risk-reducing effects of eligible hedges
6. **SCVA** - Standalone CVA calculation for individual counterparties
7. **SNH** - Single Name Hedges providing direct credit protection
8. **HMA** - Hedge Mismatch Adjustment accounting for basis risk
9. **IH** - Index Hedges offering broad market-based credit protection
10. **Practice** - Interactive exercises to test understanding

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type-safe development
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Zustand** - Lightweight state management
- **React Flow** - Interactive flow diagrams
- **Lucide React** - Icon library

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```text
src/
├── App.tsx                 # Main application component
├── index.css               # Global styles and Tailwind config
├── store/
│   └── courseStore.ts      # Zustand store for navigation state
├── ui/
│   ├── components/
│   │   └── NavigationButtons.tsx
│   ├── layouts/
│   │   └── Sidebar.tsx
│   └── views/
│       ├── IntroductionView.tsx
│       ├── ProcessMapsView.tsx
│       ├── KFullView.tsx
│       ├── KReducedView.tsx
│       ├── KHedgedView.tsx
│       ├── ScvaView.tsx
│       ├── SnhView.tsx
│       ├── HmaView.tsx
│       ├── IhView.tsx
│       └── PracticeView.tsx
└── lib/
    └── utils.ts            # Utility functions
```

## License

This project is for educational purposes.
