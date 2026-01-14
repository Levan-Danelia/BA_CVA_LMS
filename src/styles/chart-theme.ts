/**
 * Chart Theme - Centralized Recharts styling configuration
 * Ensures all charts have consistent, professional appearance
 */

// Color palette matching CSS variables - 5-color chart palette
export const chartColors = {
  // 5-color palette for data visualization
  color1: '#292866',       // Deep purple
  color2: '#406352',       // Forest green
  color3: '#F05C4F',       // Coral red
  color4: '#C8C2E0',       // Lavender
  color5: '#97D0B1',       // Mint green

  // Chart infrastructure colors
  grid: '#e2e8f0',
  axis: '#64748b',
  background: '#ffffff',
  tooltip: {
    bg: '#0f172a',
    text: '#ffffff',
    border: '#334155',
  },
} as const;

// Axis configuration - consistent across all charts (matching table header styling)
export const axisConfig = {
  tick: {
    fontSize: 11,
    fontWeight: 600,
    fill: '#334155', // neutral-700 to match table headers
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  axisLine: false,
  tickLine: false,
} as const;

// Grid configuration
export const gridConfig = {
  strokeDasharray: '3 3',
  stroke: chartColors.grid,
  vertical: false,
} as const;

// Bar chart configuration
export const barConfig = {
  radius: [2, 2, 0, 0] as [number, number, number, number],
  barSize: 18,
} as const;

// Tooltip configuration
export const tooltipConfig = {
  contentStyle: {
    backgroundColor: chartColors.tooltip.bg,
    border: `1px solid ${chartColors.tooltip.border}`,
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '11px',
    fontWeight: 600,
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  labelStyle: {
    color: chartColors.tooltip.text,
    fontWeight: 700,
    marginBottom: '4px',
  },
  itemStyle: {
    color: chartColors.tooltip.text,
    padding: '2px 0',
  },
} as const;

// Legend configuration
export const legendConfig = {
  wrapperStyle: {
    paddingTop: '16px',
  },
  iconType: 'circle' as const,
  iconSize: 8,
} as const;

// Margin presets for different chart layouts
export const chartMargins = {
  default: { top: 10, right: 20, left: -10, bottom: 5 },
  withLegend: { top: 10, right: 20, left: -10, bottom: 30 },
  horizontal: { top: 10, right: 30, left: 60, bottom: 5 },
} as const;

// Direct color values for charts (not using CSS vars for Recharts compatibility)
export const chartCSSVars = {
  color1: '#292866',
  color2: '#406352',
  color3: '#F05C4F',
  color4: '#C8C2E0',
  color5: '#97D0B1',
} as const;
