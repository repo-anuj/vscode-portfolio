/**
 * Utility functions for optimizing animations
 */

// Check if the device prefers reduced motion
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Get animation settings based on device performance and preferences
export const getAnimationSettings = () => {
  const isReducedMotion = prefersReducedMotion()
  const isLowPowerMode = 'getBattery' in navigator && 
    (navigator as any).getBattery?.().then((battery: any) => battery.charging === false && battery.level < 0.2)
  
  // Detect low-end devices based on hardware concurrency
  const isLowEndDevice = navigator.hardwareConcurrency 
    ? navigator.hardwareConcurrency <= 4
    : false

  return {
    // Disable animations completely if reduced motion is preferred
    enabled: !isReducedMotion,
    
    // Use simpler animations for low-end devices
    useSimpleAnimations: isLowEndDevice || isLowPowerMode,
    
    // Reduce animation duration for low-end devices
    durationMultiplier: isLowEndDevice ? 0.7 : 1,
    
    // Reduce the number of animated elements for low-end devices
    maxAnimatedElements: isLowEndDevice ? 5 : 20
  }
}

// Get optimized framer-motion variants based on device capabilities
export const getOptimizedVariants = (variants: any, options = { force: false }) => {
  const settings = getAnimationSettings()
  
  // If animations are disabled and not forced, return empty animations
  if (!settings.enabled && !options.force) {
    return {
      initial: {},
      animate: {},
      exit: {}
    }
  }
  
  // For low-end devices, simplify animations
  if (settings.useSimpleAnimations) {
    // Create simplified variants by removing transform properties
    // that are expensive to animate (like scale, rotate)
    const simplify = (variant: any) => {
      const simplified = { ...variant }
      
      // Keep only opacity and simple transforms
      if (simplified.scale) delete simplified.scale
      if (simplified.rotate) delete simplified.rotate
      if (simplified.skew) delete simplified.skew
      
      // Adjust transition for better performance
      if (simplified.transition) {
        simplified.transition = {
          ...simplified.transition,
          duration: (simplified.transition.duration || 0.3) * settings.durationMultiplier,
          type: 'tween' // Use simpler tween instead of spring
        }
      }
      
      return simplified
    }
    
    return {
      initial: simplify(variants.initial),
      animate: simplify(variants.animate),
      exit: simplify(variants.exit)
    }
  }
  
  return variants
}

// Optimize GSAP animations
export const optimizeGSAP = (timeline: any) => {
  const settings = getAnimationSettings()
  
  if (!settings.enabled) {
    // Clear all animations if reduced motion is preferred
    timeline.clear()
    return timeline
  }
  
  if (settings.useSimpleAnimations) {
    // Adjust timeScale for simpler animations
    timeline.timeScale(1.5)
    
    // Force GPU acceleration for better performance
    timeline.set({}, { force3D: true })
  }
  
  return timeline
}
