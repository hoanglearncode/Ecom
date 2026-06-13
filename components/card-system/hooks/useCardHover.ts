import * as React from "react"

export interface UseCardHoverOptions {
  disabled?: boolean
  onHoverStart?: () => void
  onHoverEnd?: () => void
}

export function useCardHover(options: UseCardHoverOptions = {}) {
  const { disabled = false, onHoverStart, onHoverEnd } = options
  const [isHovered, setIsHovered] = React.useState(false)

  const handleMouseEnter = React.useCallback(() => {
    if (disabled) return
    setIsHovered(true)
    onHoverStart?.()
  }, [disabled, onHoverStart])

  const handleMouseLeave = React.useCallback(() => {
    if (disabled) return
    setIsHovered(false)
    onHoverEnd?.()
  }, [disabled, onHoverEnd])

  return {
    isHovered,
    hoverProps: {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    },
  }
}
