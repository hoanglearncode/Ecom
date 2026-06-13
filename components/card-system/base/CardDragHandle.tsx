"use client"

import * as React from "react"
import { useDraggable } from "@dnd-kit/core"
import { GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CardDragHandleProps extends React.ComponentProps<"button"> {
  id: string
  disabled?: boolean
  showOnHover?: boolean
  position?: "start" | "end"
  icon?: React.ReactNode
}

const CardDragHandle = React.forwardRef<HTMLButtonElement, CardDragHandleProps>(
  ({ id, disabled = false, showOnHover = true, position = "end", icon, className, ...props }, ref) => {
    const { attributes, listeners, isDragging } = useDraggable({
      id,
      disabled,
    })

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "shrink-0 transition-opacity",
          showOnHover && "opacity-0 group-hover:opacity-100",
          isDragging && "opacity-100",
          position === "start" && "-ml-1 mr-2",
          position === "end" && "-mr-1 ml-2",
          "p-1 rounded hover:bg-muted cursor-grab active:cursor-grabbing text-muted-foreground/60 hover:text-muted-foreground",
          className
        )}
        disabled={disabled}
        {...attributes}
        {...listeners}
        {...props}
      >
        {icon || <GripVertical className="w-4 h-4" />}
      </button>
    )
  }
)
CardDragHandle.displayName = "CardDragHandle"

export { CardDragHandle }
