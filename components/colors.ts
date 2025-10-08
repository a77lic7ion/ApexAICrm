export const priorityColors: Record<string, string> = {
  Low: '#6b7280', // Gray
  Medium: '#3b82f6', // Blue
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