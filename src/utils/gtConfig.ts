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

// Create separate configurations for development and production
const developmentConfig = {
  locales: ["en", "es", "fr", "de", "zh"],
  defaultLocale: "en",
  apiKey: import.meta.env.VITE_GT_API_KEY || '',
  projectId: import.meta.env.VITE_GT_PROJECT_ID || '',
  debug: true
};

const productionConfig = {
  locales: ["en", "es", "fr", "de", "zh"],
  defaultLocale: "en",
  projectId: import.meta.env.VITE_GT_PROJECT_ID || '',
  debug: false
};

// Create a configuration object for GT
export const getGTConfig = () => {
  // Determine if we're in production
  const isProduction = import.meta.env.PROD;

  // Use the appropriate configuration based on environment
  if (isProduction) {
    console.log('Using production GT configuration (no API key)');
    return productionConfig;
  } else {
    // Check if development config has valid values
    if (!developmentConfig.apiKey || !developmentConfig.projectId) {
      console.warn('GT environment variables are missing. Translation features may not work properly.');
      console.warn('Make sure VITE_GT_API_KEY and VITE_GT_PROJECT_ID are set in your .env file.');
    }

    console.log('Using development GT configuration');
    return developmentConfig;
  }
}

export default getGTConfig
