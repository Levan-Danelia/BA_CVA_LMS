/**
 * Design Tokens - Single Source of Truth for all colors and styling constants
 * Professional financial aesthetic inspired by Bloomberg/Refinitiv terminals
 */

// ============================================================================
// COLOR PALETTE - Professional, balanced, neither too bright nor too pale
// ============================================================================

export const colors = {
  // Primary brand colors
  primary: {
    DEFAULT: '#2563eb', // Blue 600 - main action color
    light: '#3b82f6',   // Blue 500 - hover states
    dark: '#1d4ed8',    // Blue 700 - active states
    muted: '#dbeafe',   // Blue 100 - backgrounds
  },

  // Neutral palette - Slate-based for professional feel
  neutral: {
    900: '#0f172a', // Darkest - headings, primary text
    800: '#1e293b', // Dark backgrounds
    700: '#334155', // Secondary text
    600: '#475569', // Muted text
    500: '#64748b', // Placeholder text
    400: '#94a3b8', // Disabled text
    300: '#cbd5e1', // Borders
    200: '#e2e8f0', // Light borders
    100: '#f1f5f9', // Light backgrounds
    50: '#f8fafc',  // Lightest backgrounds
    0: '#ffffff',   // White
  },

  // Semantic colors - Risk categories
  risk: {
    sovereign: '#059669',    // Emerald 600 - stable, trustworthy
    corporate: '#2563eb',    // Blue 600 - standard risk
    securitization: '#d97706', // Amber 600 - elevated risk
    equity: '#7c3aed',       // Violet 600 - high volatility
  },

  // Status colors
  status: {
    success: '#059669',  // Emerald 600
    warning: '#d97706',  // Amber 600
    error: '#dc2626',    // Red 600
    info: '#2563eb',     // Blue 600
  },

  // Chart-specific colors (consistent with risk but with variations)
  chart: {
    grid: '#e2e8f0',     // Neutral 200
    axis: '#64748b',     // Neutral 500
    tooltip: '#0f172a',  // Neutral 900
  },
} as const;

// ============================================================================
// CHART THEME - Recharts configuration
// ============================================================================

export const chartTheme = {
  // Grid styling
  grid: {
    stroke: colors.chart.grid,
    strokeDasharray: '3 3',
  },

  // Axis styling
  axis: {
    tick: {
      fontSize: 11,
      fontWeight: 600,
      fill: colors.chart.axis,
    },
    axisLine: false,
    tickLine: false,
  },

  // Bar styling
  bar: {
    radius: [2, 2, 0, 0] as [number, number, number, number],
    barSize: 18,
  },

  // Category colors for bar charts
  categoryColors: {
    sovereign: colors.risk.sovereign,
    corporate: colors.risk.corporate,
    securitization: colors.risk.securitization,
    equity: colors.risk.equity,
  },
} as const;

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const typography = {
  fontFamily: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",

  sizes: {
    xs: '11px',
    sm: '12px',
    base: '13px',
    md: '14px',
    lg: '16px',
    xl: '18px',
    '2xl': '24px',
    '3xl': '30px',
  },

  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    black: 900,
  },
} as const;

// ============================================================================
// SPACING & SIZING
// ============================================================================

export const spacing = {
  table: {
    cellPadding: 'px-4 py-3',
    headerPadding: 'px-4 py-3',
  },
  card: {
    padding: 'p-6',
    gap: 'gap-4',
  },
} as const;

// ============================================================================
// ICON CONFIGURATION
// ============================================================================

export const iconConfig = {
  sizes: {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  },
  defaultColor: 'text-primary',
} as const;

// ============================================================================
// CSS VARIABLE MAPPINGS (for use in CSS files)
// ============================================================================

export const cssVariables = {
  // These map to CSS custom properties
  '--color-primary': colors.primary.DEFAULT,
  '--color-primary-light': colors.primary.light,
  '--color-primary-dark': colors.primary.dark,
  '--color-primary-muted': colors.primary.muted,

  '--color-neutral-900': colors.neutral[900],
  '--color-neutral-800': colors.neutral[800],
  '--color-neutral-700': colors.neutral[700],
  '--color-neutral-600': colors.neutral[600],
  '--color-neutral-500': colors.neutral[500],
  '--color-neutral-400': colors.neutral[400],
  '--color-neutral-300': colors.neutral[300],
  '--color-neutral-200': colors.neutral[200],
  '--color-neutral-100': colors.neutral[100],
  '--color-neutral-50': colors.neutral[50],

  '--color-risk-sov': colors.risk.sovereign,
  '--color-risk-corp': colors.risk.corporate,
  '--color-risk-sec': colors.risk.securitization,
  '--color-risk-equity': colors.risk.equity,

  '--color-success': colors.status.success,
  '--color-warning': colors.status.warning,
  '--color-error': colors.status.error,
  '--color-info': colors.status.info,
} as const;
