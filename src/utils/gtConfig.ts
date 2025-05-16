/**
 * GeneralTranslation configuration utility
 *
 * This module provides configuration for the GT (General Translation) library
 * It handles environment variables and provides fallbacks for missing values
 *
 * IMPORTANT: In production, we don't include the API key as it's a security risk
 * and the GT library will throw an error if it detects an API key in production.
 * Instead, we only provide the projectId and let the GT library handle the rest.
 */

// Create a configuration object for GT
export const getGTConfig = () => {
  // Get environment variables with fallbacks
  const apiKey = import.meta.env.VITE_GT_API_KEY || '';
  const projectId = import.meta.env.VITE_GT_PROJECT_ID || '';

  // Check if we're in production
  const isProduction = import.meta.env.PROD;

  // Log warning if environment variables are missing in development
  if (!isProduction && (!apiKey || !projectId)) {
    console.warn('GT environment variables are missing. Translation features may not work properly.');
    console.warn('Make sure VITE_GT_API_KEY and VITE_GT_PROJECT_ID are set in your .env file.');
  }

  // In production, we don't include the API key as it's a security risk
  return {
    locales: ["en", "es", "fr", "de", "zh"],
    defaultLocale: "en",
    // Only include apiKey in development
    ...(isProduction ? {} : { apiKey }),
    projectId,
    debug: !isProduction // Only enable debug in development
  }
}

export default getGTConfig
