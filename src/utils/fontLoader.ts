/**
 * Font loading utility to prevent font flickering
 */

// Define font families
const FONT_FAMILIES = {
  mono: 'Fira Code',
  sans: 'Inter',
  display: 'Space Grotesk'
}

// Define font weights
const FONT_WEIGHTS = [400, 500, 600, 700]

// Create font face observers
const createFontObserver = (family: string, weight: number): Promise<void> => {
  return new Promise((resolve) => {
    // Check if the font is already loaded
    if (document.fonts && document.fonts.check(`${weight} 12px "${family}"`)) {
      resolve()
      return
    }

    // Create a span element with the font
    const span = document.createElement('span')
    span.style.position = 'absolute'
    span.style.top = '-9999px'
    span.style.left = '-9999px'
    span.style.visibility = 'hidden'
    span.style.fontFamily = `"${family}", monospace`
    span.style.fontWeight = weight.toString()
    span.style.fontSize = '12px'
    span.textContent = 'BESbswy'
    document.body.appendChild(span)

    // Set a timeout to resolve after 3 seconds even if the font doesn't load
    const timeout = setTimeout(() => {
      document.body.removeChild(span)
      resolve()
    }, 3000)

    // Check if the font is loaded
    const checkFont = () => {
      if (document.fonts && document.fonts.check(`${weight} 12px "${family}"`)) {
        clearTimeout(timeout)
        document.body.removeChild(span)
        resolve()
        return
      }

      requestAnimationFrame(checkFont)
    }

    requestAnimationFrame(checkFont)
  })
}

// Load all fonts
export const loadFonts = async (): Promise<void> => {
  // Add a class to the document to indicate fonts are loading
  document.documentElement.classList.add('fonts-loading')

  // Create an array of promises for all font combinations
  const fontPromises: Promise<void>[] = []

  // Add promises for each font family and weight
  Object.values(FONT_FAMILIES).forEach((family) => {
    FONT_WEIGHTS.forEach((weight) => {
      fontPromises.push(createFontObserver(family, weight))
    })
  })

  // Wait for all fonts to load or timeout
  await Promise.all(fontPromises)

  // Remove the loading class and add the loaded class
  document.documentElement.classList.remove('fonts-loading')
  document.documentElement.classList.add('fonts-loaded')
}

// Add CSS to prevent FOUT (Flash of Unstyled Text)
export const addFontLoadingStyles = (): void => {
  const style = document.createElement('style')
  style.textContent = `
    .fonts-loading * {
      transition: none !important;
    }
    
    /* Hide text until fonts are loaded on critical elements */
    .fonts-loading h1,
    .fonts-loading h2,
    .fonts-loading h3,
    .fonts-loading .critical-text {
      opacity: 0;
    }
    
    .fonts-loaded h1,
    .fonts-loaded h2,
    .fonts-loaded h3,
    .fonts-loaded .critical-text {
      opacity: 1;
      transition: opacity 0.2s ease;
    }
  `
  document.head.appendChild(style)
}

// Initialize font loading
export const initFontLoading = (): void => {
  addFontLoadingStyles()
  loadFonts()
}
