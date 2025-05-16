/**
 * Accessibility utilities for improving keyboard navigation and screen reader support
 */
import React from 'react'

// Handle keyboard navigation for interactive elements
export const handleKeyboardNavigation = (
  event: React.KeyboardEvent,
  callback: () => void
) => {
  // Execute callback on Enter or Space key press
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    callback()
  }
}

// Create props for accessible buttons that aren't actual button elements
export const accessibleButtonProps = (
  onClick: () => void,
  label?: string
): Record<string, any> => {
  return {
    role: 'button',
    tabIndex: 0,
    'aria-label': label,
    onClick,
    onKeyDown: (e: React.KeyboardEvent) => handleKeyboardNavigation(e, onClick)
  }
}

// Create props for accessible tabs
export const accessibleTabProps = (
  isSelected: boolean,
  onClick: () => void,
  label: string,
  controls: string
): Record<string, any> => {
  return {
    role: 'tab',
    tabIndex: isSelected ? 0 : -1,
    'aria-selected': isSelected,
    'aria-controls': controls,
    'aria-label': label,
    onClick,
    onKeyDown: (e: React.KeyboardEvent) => handleKeyboardNavigation(e, onClick)
  }
}

// Create props for accessible tab panels
export const accessibleTabPanelProps = (
  id: string,
  isSelected: boolean,
  labelledBy: string
): Record<string, any> => {
  return {
    role: 'tabpanel',
    id,
    'aria-labelledby': labelledBy,
    tabIndex: 0,
    hidden: !isSelected
  }
}

// Create props for accessible menu items
export const accessibleMenuItemProps = (
  onClick: () => void,
  label: string
): Record<string, any> => {
  return {
    role: 'menuitem',
    tabIndex: 0,
    'aria-label': label,
    onClick,
    onKeyDown: (e: React.KeyboardEvent) => handleKeyboardNavigation(e, onClick)
  }
}

// Create props for accessible toggle buttons
export const accessibleToggleProps = (
  isPressed: boolean,
  onClick: () => void,
  label: string
): Record<string, any> => {
  return {
    role: 'button',
    'aria-pressed': isPressed,
    'aria-label': label,
    tabIndex: 0,
    onClick,
    onKeyDown: (e: React.KeyboardEvent) => handleKeyboardNavigation(e, onClick)
  }
}

// Create props for accessible dialog
export const accessibleDialogProps = (
  isOpen: boolean,
  _onClose: () => void, // Prefixed with underscore to indicate it's not used
  title: string,
  description?: string
): Record<string, any> => {
  return {
    role: 'dialog',
    'aria-modal': true,
    'aria-hidden': !isOpen,
    'aria-labelledby': `${title.replace(/\s+/g, '-').toLowerCase()}-title`,
    'aria-describedby': description
      ? `${title.replace(/\s+/g, '-').toLowerCase()}-description`
      : undefined
  }
}

// Skip to content link for keyboard users
export const createSkipToContentLink = (): {
  linkProps: Record<string, any>;
  targetProps: Record<string, any>;
} => {
  return {
    linkProps: {
      href: "#main-content",
      className: "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-vscode-accent focus:text-white focus:rounded",
      children: "Skip to content"
    },
    targetProps: { id: 'main-content', tabIndex: -1 }
  }
}

// Focus trap for modals
export const createFocusTrap = (containerRef: React.RefObject<HTMLElement>) => {
  const handleTabKey = (e: KeyboardEvent) => {
    if (!containerRef.current || e.key !== 'Tab') return

    const focusableElements = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    // If shift+tab on first element, move to last element
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault()
      lastElement.focus()
    }
    // If tab on last element, move to first element
    else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault()
      firstElement.focus()
    }
  }

  return {
    enable: () => {
      document.addEventListener('keydown', handleTabKey)
      // Focus first element when trap is enabled
      setTimeout(() => {
        const firstFocusable = containerRef.current?.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as HTMLElement
        firstFocusable?.focus()
      }, 10)
    },
    disable: () => {
      document.removeEventListener('keydown', handleTabKey)
    }
  }
}
