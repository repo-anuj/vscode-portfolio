import { useGT, T as OriginalT, Var as OriginalVar } from 'gt-react';
import React, { ReactNode } from 'react';

/**
 * A hook that provides safe access to GT components
 * This hook ensures that GT components are only used when the GT provider is available
 * If the GT provider is not available, it falls back to rendering the children directly
 */
export const useSafeGT = () => {
  // Try to use the GT hook, but catch any errors
  let gtAvailable = true;
  let t: any = null;
  
  try {
    t = useGT();
  } catch (error) {
    // If useGT throws an error, GT is not available
    gtAvailable = false;
    console.warn('GT is not available. Using fallback rendering.');
  }

  // Safe version of the T component
  const SafeT: React.FC<{ id: string; children: ReactNode }> = ({ id, children }) => {
    if (!gtAvailable) {
      // If GT is not available, just render the children
      return <>{children}</>;
    }
    
    try {
      // Try to use the original T component
      return <OriginalT id={id}>{children}</OriginalT>;
    } catch (error) {
      // If that fails, fall back to rendering the children directly
      console.warn(`Failed to render T component with id ${id}. Using fallback.`);
      return <>{children}</>;
    }
  };

  // Safe version of the Var component
  const SafeVar: React.FC<{ children: ReactNode }> = ({ children }) => {
    if (!gtAvailable) {
      // If GT is not available, just render the children
      return <>{children}</>;
    }
    
    try {
      // Try to use the original Var component
      return <OriginalVar>{children}</OriginalVar>;
    } catch (error) {
      // If that fails, fall back to rendering the children directly
      console.warn('Failed to render Var component. Using fallback.');
      return <>{children}</>;
    }
  };

  return {
    t,
    T: SafeT,
    Var: SafeVar,
    gtAvailable
  };
};

export default useSafeGT;
