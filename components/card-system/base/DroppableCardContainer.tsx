"use client"

import * as React from "react"
import { useDroppable } from "@dnd-kit/core"
import { cn } from "@/lib/utils"

export interface DroppableCardContainerProps extends React.ComponentProps<"div"> {
  id: string
  onDrop?: (data: any) => void
  disabled?: boolean
  dragging?: boolean
}

const DroppableCardContainer = React.forwardRef<HTMLDivElement, DroppableCardContainerProps>(
  ({ id, onDrop, disabled = false, dragging, className, children, ...props }, ref) => {
    const { setNodeRef, isOver } = useDroppable({
      id,
      disabled,
    })

    React.useEffect(() => {
      if (isOver && !disabled) {
        onDrop?.({ id, isOver })
      }
    }, [isOver, disabled, id, onDrop])

    return (
      <div
        ref={(node) => {
          setNodeRef(node)
          if (typeof ref === "function") {
            ref(node)
          } else if (ref) {
            ref.current = node
          }
        }}
        className={cn(
          "transition-colors duration-200",
          isOver && !disabled && "bg-accent/50",
          dragging && "pointer-events-none",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
DroppableCardContainer.displayName = "DroppableCardContainer"

export { DroppableCardContainer }
