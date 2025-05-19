/**
 * Application configuration
 * This file centralizes all configuration settings with hardcoded values
 * to avoid environment variable issues
 */

// Hardcoded configuration to avoid environment variable issues
const appConfig = {
  // Environment settings
  isDevelopment: false,
  isProduction: true,

  // App metadata
  appName: "Popya Mobile App",
  appVersion: "1.0.0",

  // Feature flags
  features: {
    useOpenAI: true, // Can be toggled based on API key availability
    useMockData: true, // Fallback to mock data when API key is not available
  },

  // Development helpers
  devConfig: {
    showDevTools: false,
    logLevel: "error",
    mockDelay: 800, // ms
  },

  // UI settings
  ui: {
    theme: "system",
  },
}

// Export as both default and named export to ensure compatibility
export default appConfig
export { appConfig }
