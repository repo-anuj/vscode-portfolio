import { lazy, ComponentType } from 'react'

/**
 * Creates a lazy-loaded component with preloading capability
 * @param importFn - Dynamic import function
 * @returns Object with Component and preload function
 */
export function lazyImport<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
) {
  const LazyComponent = lazy(importFn)
  
  return {
    Component: LazyComponent,
    preload: importFn
  }
}
