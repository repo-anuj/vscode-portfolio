import React, { ReactNode, useEffect, useState } from 'react';
import { GTProvider } from 'gt-react';
import { getGTConfig } from '../utils/gtConfig';

interface GTWrapperProps {
  children: ReactNode;
}

/**
 * GTWrapper component that ensures GT is properly initialized
 * This component handles the initialization of the GT provider
 * and ensures that it's only rendered when the configuration is ready
 *
 * In production, we don't include the API key as it's a security risk.
 * Instead, we only provide the projectId and let the GT library handle the rest.
 */
const GTWrapper: React.FC<GTWrapperProps> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [config, setConfig] = useState(getGTConfig());
  const isProduction = import.meta.env.PROD;

  useEffect(() => {
    try {
      // Ensure the config is loaded
      const gtConfig = getGTConfig();

      // In production, we only need projectId
      if (isProduction) {
        if (gtConfig.projectId) {
          setConfig(gtConfig);
          setIsReady(true);
        } else {
          console.warn('GT configuration is missing projectId. Translation features may not work properly.');
          // Still set isReady to true to avoid blocking the app
          setIsReady(true);
        }
      } else {
        // In development, we need both apiKey and projectId
        if (gtConfig.apiKey && gtConfig.projectId) {
          setConfig(gtConfig);
          setIsReady(true);
        } else {
          console.warn('GT configuration is missing apiKey or projectId. Translation features may not work properly.');
          // Still set isReady to true to avoid blocking the app
          setIsReady(true);
        }
      }
    } catch (error) {
      console.error('Error initializing GT:', error);
      // Set isReady to true to avoid blocking the app
      setIsReady(true);
    }
  }, [isProduction]);

  // Show a loading state while GT is initializing
  if (!isReady) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-vscode-accent/30 border-t-vscode-accent rounded-full animate-spin"></div>
          <p className="mt-4 text-white/60">Loading translations...</p>
        </div>
      </div>
    );
  }

  // Render the GTProvider with the loaded config
  return (
    <GTProvider {...config}>
      {children}
    </GTProvider>
  );
};

export default GTWrapper;
