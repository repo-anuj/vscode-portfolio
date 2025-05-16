/**
 * GeneralTranslation configuration utility
 *
 * This module provides configuration for the GT (General Translation) library
 * It handles environment variables and provides fallbacks for missing values
 */

// Create a configuration object for GT
export const getGTConfig = () => {
  // Get environment variables with fallbacks
  const apiKey = import.meta.env.VITE_GT_API_KEY || '';
  const projectId = import.meta.env.VITE_GT_PROJECT_ID || '';

  // Log warning if environment variables are missing
  if (!apiKey || !projectId) {
    console.warn('GT environment variables are missing. Translation features may not work properly.');
    console.warn('Make sure VITE_GT_API_KEY and VITE_GT_PROJECT_ID are set in your .env file.');
  }

  return {
    locales: ["en", "es", "fr", "de", "zh"],
    defaultLocale: "en",
    apiKey,
    projectId,
    debug: process.env.NODE_ENV !== 'production' // Only enable debug in development
  }
}

export default getGTConfig
