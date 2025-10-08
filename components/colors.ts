export const priorityColors: Record<string, string> = {
  Low: '#7CCF35', // Palette green500
  Medium: '#497D15', // Palette green700
  High: '#f59e0b', // Amber
  Urgent: '#ef4444', // Red
};

// A palette of distinct, accessible colors
const staffPalette = [
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#8b5cf6', // Violet
  '#ef4444', // Red
  '#14b8a6', // Teal
  '#ec4899', // Pink
  '#22c55e', // Green
  '#a855f7', // Purple
  '#fb7185', // Rose
];

export const getStaffColor = (id?: number, fallback = '#9ca3af') => {
  if (!id || id < 0) return fallback;
  return staffPalette[id % staffPalette.length];
};

export const hexWithOpacity = (hex: string, alpha = 0.2) => {
  // Convert hex to rgba string with alpha
  const sanitized = hex.replace('#', '');
  const r = parseInt(sanitized.substring(0, 2), 16);
  const g = parseInt(sanitized.substring(2, 4), 16);
  const b = parseInt(sanitized.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Export requested palette for reuse
export const Palette = {
  green50:  '#F7FEE7',
  green100: '#ECFCCA',
  green200: '#D8F999',
  green300: '#BBF451',
  green400: '#9AE630',
  green500: '#7CCF35',
  green600: '#5EA529',
  green700: '#497D15',
  green800: '#3C6301',
  green900: '#35530E',
  green950: '#192E03',
};

// 20 bright, distinct colors for staff selection
export const brightColors: string[] = [
  '#FF3B30', // Bright Red
  '#FF9500', // Orange
  '#FFCC00', // Yellow
  '#34C759', // Bright Green
  '#30B0FF', // Sky Blue
  '#007AFF', // Blue
  '#5856D6', // Indigo
  '#AF52DE', // Purple
  '#FF2D55', // Pink
  '#8E8E93', // Gray
  '#00C7BE', // Turquoise
  '#00A8E8', // Azure
  '#2ECC71', // Emerald
  '#E67E22', // Carrot
  '#E74C3C', // Alizarin
  '#9B59B6', // Amethyst
  '#1ABC9C', // Teal
  '#F1C40F', // Sunflower
  '#3498DB', // Peter River
  '#D35400', // Pumpkin
];