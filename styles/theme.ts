export const colors = {
  primary: "#6C63FF", // Vibrant purple
  secondary: "#FF6584", // Soft pink
  tertiary: "#43C6AC", // Teal
  accent: "#FFC75F", // Warm yellow
  success: "#4CAF50",
  warning: "#FF9800",
  danger: "#F44336",
  light: "#F8FAFC",
  dark: "#1E293B",
  darkBlue: "#0F172A",
  background: "#FFFFFF",
  card: "#FFFFFF",
  text: "#334155",
  lightText: "#64748B",
  border: "#E2E8F0",
  notification: "#FF4757",
}

export const gradients = {
  primary: `linear-gradient(135deg, ${colors.primary}, #8B5CF6)`,
  secondary: `linear-gradient(135deg, ${colors.secondary}, #F472B6)`,
  tertiary: `linear-gradient(135deg, ${colors.tertiary}, #4ADE80)`,
}

export const shadows = {
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
}

export const animations = {
  fast: "0.2s ease",
  normal: "0.3s ease",
  slow: "0.5s ease",
  bounce: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
}
